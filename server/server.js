const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
let socket = require('socket.io');
let roomsData = require('./rooms.json');
let membersData = require('./members.json');

app.use(express.json());



//Returns unique ID for rooms
function getRoomId(){
  let data = roomsData.data;
  if(data.length <= 0) return 1;
  let lastId = data[data.length - 1].roomId;
  return lastId += 1;
}

function getMessageId(room){
  let data = room.messages
  if(data.length <= 0) return 1;
  let lastId = data[data.length - 1].msgId;
  return lastId += 1;
}

//Checks whether room with same name exists
function verifyRoomName(name){
  let found = roomsData.data.find((room) => name.toLowerCase() === room.roomName.toLowerCase());
  return found ? false : true;
}

app.get('/members', (req, res) => {
  res.status(200);
  res.send(membersData);
})

//GET all rooms
app.get('/rooms', (req, res) => {
  res.status(200);
  res.send(roomsData);
})

//GET specific room from id
app.get('/rooms/:id', (req, res) => {
  let found = roomsData.data.find((room) => room.roomId === parseInt(req.params.id))
  if(!found){
    res.status(404);
    res.end();
    return;
  }
  res.status(200);
  res.send({data: found});
})

//POST, Creating new room
app.post('/rooms', (req, res) => {
  if(!req.body.roomName || typeof req.body.roomName !== 'string' || req.body.roomName.length > 20){
    res.status(400).end();
    return;
  }
  else if(!verifyRoomName(req.body.roomName)){
    res.status(409).end();
    return;
  }
  let newRoom = {
    roomId: getRoomId(),
    roomName: req.body.roomName,
    members: [],
    messages: [],
  }
  roomsData.data.push(newRoom);
  fs.writeFile('./rooms.json', JSON.stringify(roomsData), function(err) {
    if(err) throw err;
    res.status(201);
    res.send({ data: newRoom });
  })
})

app.post('/rooms/:id', (req, res) => {
  let found = roomsData.data.find((room) => room.roomId === parseInt(req.params.id));
  let id = getMessageId(found);
  let memberIdx = found.members.findIndex((member) => req.body.user.toLowerCase() === member.user);
  if(memberIdx === -1){
    let memberObj = {
      user: req.body.user.toLowerCase(),
    }
    found.members.push(memberObj);
  }
  let newMsg = {
    msgId: id,
    user: req.body.user,
    message: req.body.message
  }
  found.messages.push(newMsg);
  fs.writeFile('./rooms.json', JSON.stringify(roomsData), function(err){
    if(err) throw err;
    res.status(201);
    res.send({ data: newMsg });
  })
})

//DELETE, Removes room with ID
app.delete('/rooms/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if(!id){
    res.status(400).end();
    return;
  }
  const foundIdx = roomsData.data.findIndex(room => room.roomId === id);
  if(foundIdx !== -1){
    roomsData.data.splice(foundIdx, 1);
  }
  fs.writeFile('./rooms.json', JSON.stringify(roomsData), function(err){
    if(err) throw err;
    res.status(204).end();
  })
})

//Server setup
let server = app.listen(port, () => console.log(`Listening on port ${port}!`));

let io = socket(server);

io.on('connection', function(socket){

  socket.on('new_connection', function(data){
    let foundMember = membersData.data.find((member) => member.user.toLowerCase() === data.toLowerCase());
    if(!foundMember){
      let obj = {
        user: data.toLowerCase(),
        socketId: socket.id,
        isOnline: true
      }
      membersData.data.push(obj);
    }
    else{
      foundMember.socketId = socket.id;
      foundMember.isOnline = true;
    }
    fs.writeFile('./members.json', JSON.stringify(membersData), function(err){
      if(err) throw err;
    })
    io.sockets.emit('new_connection', membersData);
  })

  console.log('a user connected', socket.id);
  socket.on('all data', function(data){
    io.sockets.emit('all data', roomsData);
  })

  socket.on('new_member', function(data){
    console.log(data);
    let foundMember = membersData.data.find((member) => member.user.toLowerCase() === data.username.toLowerCase());
    console.log(foundMember);
    if(!foundMember){
      let obj = {
        user: data.username,
        socketId: socket.id,
        isOnline: true
      }
      membersData.data.push(obj);
      fs.writeFile('./members.json', JSON.stringify(membersData), function(err){
        if(err) throw err;
      })
    }
    else if(foundMember.socketId !== socket.id){
      foundMember.socketId = socket.id;
      fs.writeFile('./members.json', JSON.stringify(membersData), function(err){
        if(err) throw err;
      })
    }
    io.sockets.emit('new_member', membersData);
  })

  socket.on('disconnect', function(data) {
    let foundMember = membersData.data.find((member) => member.socketId === socket.id);
    if(foundMember){
      foundMember.socketId = '';
      foundMember.isOnline = false;
      fs.writeFile('./members.json', JSON.stringify(membersData), function(err){
        if(err) throw err;
      })
      console.log('disconnected', socket.id);
      io.sockets.emit('user_disconnect', membersData);
    }
  })

  socket.on('user_disconnect', function(data) {
    let foundMember = membersData.data.find((member) => member.socketId === socket.id);
    foundMember.socketId = '';
    foundMember.isOnline = false;
    fs.writeFile('./members.json', JSON.stringify(membersData), function(err){
      if(err) throw err;
    })
    console.log('disconnected', socket.id);
    io.sockets.emit('user_disconnect', membersData);
  })

})
