var appinfo = { port: 3000 } ;

var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , logger = require('morgan') ;
//  , http = require('http') ;

var app = express() ;

//var server = http.createServer(app) ;
var http = require('http').Server(app);
var io = require('socket.io')(http);

//var io = require('socket.io').listen(server) ;

app.locals.basedir = __dirname ;

var roomOccupants = [{"room": "Auditorium", "occupants": [], "ids": []},
                     {"room": "Bar", "occupants": [], "ids": []},
                     {"room": "Lobby", "occupants": [], "ids": []},
                     {"room": "Snug", "occupants": [], "ids": []}] ;

/*var roomList = [ {"room": "Auditorium", "count": 123 },
                 {"room": "Bar", "count": 27 },
                 {"room": "Lobby", "count": 8 },
                 {"room": "Snug", "count": 2} ] ;*/


function removeOccupant(params) {
  console.log(params) ;
      for (var i = 0; i < roomOccupants.length; i++) {
console.log(i) ;
console.log(params.room) ;
      if ((roomOccupants[i].room == params.room) || (typeof params.room === 'undefined')) {

//        roomOccupants[i].occupants.push(data.user) ;

        for(var j = roomOccupants[i].occupants.length - 1; j >= 0; j--) {
          if(roomOccupants[i].ids[j] == params.id) {
//          if(roomOccupants[i].occupants[j] === data.user) {
            roomOccupants[i].occupants.splice(j, 1);
            roomOccupants[i].ids.splice(j, 1);
          }
        }
      }
    } 

    console.log(roomOccupants) ;
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
//console.log(socket) ;
  socket.on('subscribe', function(data) {
    console.log(data) ;
    socket.join(data.room, function () { 
      console.log('join ok') ; 
      console.log(data.user) ;


  for (var i = 0; i < roomOccupants.length; i++) {
console.log(i) ;
console.log(data.room) ;
    if (roomOccupants[i].room == data.room) {
      roomOccupants[i].occupants.push(data.user) ;
      roomOccupants[i].ids.push(socket.id) ;      
    }
  }
      
      console.log(roomOccupants) ;

      io.sockets.in(data.room).emit('chat message', {msg: data.user + ' has entered the room ' + data.room}) ;
      io.sockets.in(data.room).emit('room occupants', {msg: roomOccupants }) ;



      //socket.emit('chat message', {msg: 'someone is here...'})
    }); 
  })

  socket.on('unsubscribe', function(data) {
    socket.leave(data.room); 

removeOccupant({id: socket.id, room: data.room}) ;
  /*  for (var i = 0; i < roomOccupants.length; i++) {

      if (roomOccupants[i].room == data.room) {

//        roomOccupants[i].occupants.push(data.user) ;

        for(var j = roomOccupants[i].occupants.length - 1; j >= 0; j--) {
          if(roomOccupants[i].ids[j] === socket.id) {
//          if(roomOccupants[i].occupants[j] === data.user) {
            roomOccupants[i].occupants.splice(j, 1);
            roomOccupants[i].ids.splice(j, 1);
          }
        }
      }
    } 

    console.log(roomOccupants) ;*/
  })

  socket.on('disconnect', function(data) {
    console.log('disconnect detected') ;
    console.log(data) ;
    console.log(socket.id) ;
    removeOccupant({id: socket.id, room: data.room}) ;
  })

  socket.on('chat message', function(msg){
    io.sockets.in(msg.room).emit('chat message', {msg: msg.msg}) ;
  }) ;

  socket.emit('room list', {msg: roomOccupants}) ;
}) ;

//app.listen(appinfo.port, function () {
//  console.log('Listening on port ' + appinfo.port) ;
//})

http.listen(appinfo.port, function(){
  console.log('listening on *:3000');
}) ;

//io.on('connection', function (socket) {
//      socket.emit('news', { hello: 'world' });
//        socket.on('my other event', function (data) {
//                console.log(data);
//                  });
//});