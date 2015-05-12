var appinfo = { port: 3000} ;

var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , logger = require('morgan') ;

var app = express() ;

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
       { title : 'Chatterbox' }
     )
  }) ;

app.listen(appinfo.port, function () {
  console.log('Listening on port ' + appinfo.port) ;
})