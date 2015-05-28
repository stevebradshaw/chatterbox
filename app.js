var appinfo = { port: 3000 }
  , express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , logger = require('morgan')
  , async = require('async') ;

var occupants = require('./modules/occupants') ;

var app = express() ;

var http = require('http').Server(app),
    io   = require('socket.io')(http);

app.locals.basedir = __dirname ;

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
      occupants.add({room: data.room, user: data.user, id: socket.id}) ;      
      io.sockets.in(data.room).emit('chat message', {msg: data.user + ' has entered the ' + data.room}) ;
      io.sockets.in(data.room).emit('room occupants', {msg: occupants.get() }) ;
      io.sockets.emit('room list', { msg: occupants.get() });
    }); 
  })

  socket.on('unsubscribe', function(data) {
    socket.leave(data.room); 
    occupants.remove({id: socket.id, room: data.room}) ;
    io.sockets.emit('room list', {msg: occupants.get() });
  })

  socket.on('disconnect', function(data) {
    occupants.remove({id: socket.id, room: data.room}) ;    
    io.sockets.emit('room list', {msg: occupants.get() });
  })

  socket.on('chat message', function(msg){
    io.sockets.in(msg.room).emit('chat message', {msg: msg.msg}) ;
  }) ;

  socket.emit('room list', {msg: occupants.get() }) ;
}) ;

http.listen(appinfo.port, function(){
  console.log('listening on *:3000');
}) ;