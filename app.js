var appinfo = { port: 3000} ;

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
console.log(socket) ;
  socket.on('subscribe', function(data) { socket.join(data.room); })

  socket.on('unsubscribe', function(data) { socket.leave(data.room); })

  socket.on('chat message', function(msg){
    console.log(msg) ;
    console.log(msg.room) ;
    io.sockets.in(msg.room).emit('chat message', {msg: msg.msg}) ;
  }) ;
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