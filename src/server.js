const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
let roomsData = require('./rooms.json');

app.use(express.json());

function getRoomId(){
  let data = roomsData.data;
  let lastId = data[data.length - 1].roomId;
  return lastId += 1;
}

function verifyRoomName(name){
  let found = roomsData.data.find((room) => name.toLowerCase() === room.roomName.toLowerCase());
  return found ? false : true;
}

app.get('/rooms', (req, res) => {
  res.status(200);
  res.send(roomsData);
})

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

app.post('/rooms', (req, res) => {
  if(!req.body.roomName || typeof req.body.roomName !== 'string'){
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

app.listen(port, () => console.log(`Listening on port ${port}!`));
