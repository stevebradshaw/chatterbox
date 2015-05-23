var socket ;

var selectedRoom = "" ;

function connect() {
//  console.log(params) ;
  socket = io.connect('');
 // socket.emit("subscribe", { user: params.user, room: params.room });

  socket.on("roomChanged", function(data) {
    console.log("roomChanged", data);
    socket.emit('chat message', {msg: '... has joined the room', room: $('#r').val()}) ;
  });

  socket.on('chat message', function(msg){
    console.log('received message: ' + msg.msg)
    $('#messages').append($('<li>').text(msg.msg));
  });

  socket.on('room occupants', function(msg) {
    console.log('update room occupants') ;
    console.log(msg) ;
    populateOccupants(msg) ;
  }) ;

  socket.on('room list', function(msg) {
    console.log('room list') ;
    populateRoomList(msg) ;
  })
}

function join(params) {
  socket.emit("subscribe", { user: params.user, room: params.room });
  selectedRoom = params.room ;
}

function leave(params) {
  console.log('leave room: ' + params.room) ;
  socket.emit("unsubscribe", { user: params.user, room: params.room });  
}


function populateOccupants(params) {

  var rooms = params.msg ;
console.log('populateOccupants - ' + selectedRoom) ;
//console.log(rooms) ;
  var occupants = "" ;

  for (var i = 0; i < rooms.length; i++) {
console.log(rooms[i].room) ;
    if (rooms[i].room == selectedRoom) {
      
      var occ = "", o = rooms[i].occupants ;
//console.log(o) ;
      o.forEach(function(e) {
//        console.log(e) ;
        occ = occ + e + ", " ;
      }) ;
$("#room-occupants").html(occ) ;
    }
  }
 

}

function populateRoomList(params) {
console.log(params.msg.length) ;
/*
<a id="selectRoom" href="#" class="list-group-item">Lobby<span class="badge">27</span></a>

              a(href="#", class="list-group-item") Lobby
                span.badge 27
              a(href="#", class="list-group-item active") Snug
                span.badge 6
              a(href="#", class="list-group-item") Private 
                span.badge 2
*/

  var r, c ;
  $("#room-select-group").html('') ;
  for (var i=0 ; i < params.msg.length ; i++) {
    r = params.msg[i].room ;
    c = params.msg[i].count ;
    $("#room-select-group").append('<a id="select-room-' + r + '" href="#" class="list-group-item">' + r + '<span class="badge">' + c + '</span></a>') ;
  }
	//$("#room-select-group").append('<a id="select-room-Bar" href="#" class="list-group-item">Bar<span class="badge">13</span></a>') ;
	//$("#room-select-group").append('<a id="select-room-Lobby" href="#" class="list-group-item">Lobby<span class="badge">27</span></a>') ;
	//$("#room-select-group").append('<a id="select-room-Snug" href="#" class="list-group-item">Snug<span class="badge">4</span></a>') ;


  $("[id^=select-room]").click(function(t) {
    t.preventDefault() ;
    console.log(t) ;
    console.log(t.target.childNodes[0].data) ;
$("[id^=select-room]").removeClass('room-selected') ;
    $(t.target).addClass('room-selected') ;

//  $('#send-msg').addClass('hidden') ;

//  $('#join').click(function() {
     console.log('click join');
     var u = $('#username').val(),
         r = t.target.childNodes[0].data ; //"Lobby" ; //$('#r').val() ;
    console.log(u) ;
    console.log(r) ;

    if (selectedRoom !== "")
      leave({user: u, room: selectedRoom}) ;

    join({user: u, room: r}) ;
//     connect({ user: u, room: r} ) ;
//     $('#send-msg').removeClass('hidden') ;
//     $('#join-room').addClass('hidden') ;
//  }) ;

  }) ;
}

function populateRoomOccupants() {
/*	a(href="#", class="list-group-item") Tom
    a(href="#", class="list-group-item") Dick
    a(href="#", class="list-group-item") Harry */

}

function setupButtons() {

	$("#btn-new-room").click(function() {
		console.log('create room') ;
	}) ;


}


$(document).ready(function() {

	console.log('document ready') ;

	//populateRoomList() ;

	setupButtons() ;

  connect() ;

	//$('form').submit(function(){
$('#btn-send-msg').click(function() {
console.log('boom!') ;
   //socket.emit('chat message', {msg: msg, room: $('#r').val() });
   socket.emit('chat message', {msg: 'Hello world!', room: selectedRoom });

    }) ;

}) ;