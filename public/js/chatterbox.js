var socket ;

function connect(params) {
  console.log(params) ;
  socket = io.connect('');
  socket.emit("subscribe", { user: params.user, room: params.room });

  socket.on("roomChanged", function(data) {
    console.log("roomChanged", data);
    socket.emit('chat message', {msg: '... has joined the room', room: $('#r').val()}) ;
  });

  socket.on('chat message', function(msg){
    console.log('received message: ' + msg.msg)
    $('#messages').append($('<li>').text(msg.msg));
  });
}


function populateRoomList() {

/*
<a id="selectRoom" href="#" class="list-group-item">Lobby<span class="badge">27</span></a>

              a(href="#", class="list-group-item") Lobby
                span.badge 27
              a(href="#", class="list-group-item active") Snug
                span.badge 6
              a(href="#", class="list-group-item") Private 
                span.badge 2
*/
	$("#room-select-group").append('<a id="select-room-Bar" href="#" class="list-group-item">Bar<span class="badge">13</span></a>') ;
	$("#room-select-group").append('<a id="select-room-Lobby" href="#" class="list-group-item">Lobby<span class="badge">27</span></a>') ;
	$("#room-select-group").append('<a id="select-room-Snug" href="#" class="list-group-item">Snug<span class="badge">4</span></a>') ;
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
         r = "Lobby" ; //$('#r').val() ;
    console.log(u) ;
     connect({ user: u, room: r} ) ;
//     $('#send-msg').removeClass('hidden') ;
//     $('#join-room').addClass('hidden') ;
//  }) ;

	}) ;
}


$(document).ready(function() {

	console.log('document ready') ;

	populateRoomList() ;

	setupButtons() ;

	//$('form').submit(function(){
$('#btn-send-msg').click(function() {
console.log('boom!') ;
   //socket.emit('chat message', {msg: msg, room: $('#r').val() });
   socket.emit('chat message', {msg: 'Hello world!', room: 'Lobby' });

    }) ;

}) ;