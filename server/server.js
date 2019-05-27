const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
let roomsData = require('./rooms.json');

app.use(express.json());

//Returns unique ID for rooms
function getRoomId(){
  let data = roomsData.data;
  let lastId = data[data.length - 1].roomId;
  return lastId += 1;
}

//Checks whether room with same name exists
function verifyRoomName(name){
  let found = roomsData.data.find((room) => name.toLowerCase() === room.roomName.toLowerCase());
  return found ? false : true;
}

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
    messages: [],
  }
  roomsData.data.push(newRoom);
  fs.writeFile('./rooms.json', JSON.stringify(roomsData), function(err) {
    if(err) throw err;
    res.status(201);
    res.send(newRoom);
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

//Server startup
app.listen(port, () => console.log(`Listening on port ${port}!`));
