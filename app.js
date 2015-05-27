var appinfo = { port: 3000 }
  , express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , logger = require('morgan') ;

var app = express() ;

var http = require('http').Server(app),
    io   = require('socket.io')(http);

app.locals.basedir = __dirname ;

var roomOccupants = [{"room": "Auditorium", "occupants": [], "ids": []},
                     {"room": "Bar", "occupants": [], "ids": []},
                     {"room": "Lobby", "occupants": [], "ids": []},
                     {"room": "Snug", "occupants": [], "ids": []}] ;

function removeOccupant(params) {

  for (var i = 0; i < roomOccupants.length; i++) {
    if ((roomOccupants[i].room == params.room) || (typeof params.room === 'undefined')) {
      for(var j = roomOccupants[i].occupants.length - 1; j >= 0; j--) {
        if(roomOccupants[i].ids[j] == params.id) {
          roomOccupants[i].occupants.splice(j, 1);
          roomOccupants[i].ids.splice(j, 1);
        }
      }
    }
  }

}

function addOccupant(params) {
  for (var i = 0; i < roomOccupants.length; i++) {
    if (roomOccupants[i].room == params.room) {
      roomOccupants[i].occupants.push(params.user) ;
      roomOccupants[i].ids.push(params.id) ;      
    }
  }
}

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(logger("combined")) ;

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

app.use(express.static(__dirname + '/public')) ;

app.get('/', function (req,res) {
  res.render('index',
       { title : 'Chatter Box' }
     )
  }) ;

io.sockets.on('connection', function (socket) {

  socket.on('subscribe', function(data) {

    socket.join(data.room, function () { 
      addOccupant({room: data.room, user: data.user, id: socket.id}) ;    
      io.sockets.in(data.room).emit('chat message', {msg: data.user + ' has entered the room ' + data.room}) ;
      io.sockets.in(data.room).emit('room occupants', {msg: roomOccupants }) ;
    }); 
  })

  socket.on('unsubscribe', function(data) {
    socket.leave(data.room); 
    removeOccupant({id: socket.id, room: data.room}) ;
  })

  socket.on('disconnect', function(data) {
    removeOccupant({id: socket.id, room: data.room}) ;
  })

  socket.on('chat message', function(msg){
    io.sockets.in(msg.room).emit('chat message', {msg: msg.msg}) ;
  }) ;

  socket.emit('room list', {msg: roomOccupants}) ;
}) ;

http.listen(appinfo.port, function(){
  console.log('listening on *:3000');
}) ;