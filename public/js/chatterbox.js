var socket ;

var selectedRoom = "" ;

function connect() {

  socket = io.connect('');

  socket.on("roomChanged", function(data) {
    socket.emit('chat message', {msg: '... has joined the room', room: $('#r').val()}) ;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg.msg));
  });

  socket.on('room occupants', function(msg) {
    populateOccupants(msg) ;
  }) ;

  socket.on('room list', function(msg) {
    populateRoomList(msg) ;
  })
}

function join(params) {
  socket.emit("subscribe", { user: params.user, room: params.room });
  selectedRoom = params.room ;
}

function leave(params) {
  socket.emit("unsubscribe", { user: params.user, room: params.room });  
}

function populateOccupants(params) {

  var rooms = params.msg, 
      occupants = "" ;

  for (var i = 0; i < rooms.length; i++) {

    if (rooms[i].room == selectedRoom) {
      
      var occ = "", o = rooms[i].occupants ;

      o.forEach(function(e) {
        occ = occ + e + ", " ;
      }) ;

      $("#room-occupants").html(occ) ;
    }
  }
}

function populateRoomList(params) {

  var r, c ;

  $("#room-select-group").html('') ;

  for (var i=0 ; i < params.msg.length ; i++) {
    r = params.msg[i].room ;
    c = params.msg[i].count ;
    $("#room-select-group").append('<a id="select-room-' + r + '" href="#" class="list-group-item">' + r + '<span class="badge">' + c + '</span></a>') ;
  }

  $("[id^=select-room]").click(function(t) {
    t.preventDefault() ;

    $("[id^=select-room]").removeClass('room-selected') ;
    $(t.target).addClass('room-selected') ;

    var u = $('#username').val(),
        r = t.target.childNodes[0].data ;

    if (u=="") 
      u = "anonymous" ;

console.log('u = ' + u) ;
    if (selectedRoom !== "")
      leave({user: u, room: selectedRoom}) ;

    join({user: u, room: r}) ;

  }) ;
}

function setupButtons() {

	$("#btn-new-room").click(function() {
		console.log('create room') ;
	}) ;

}

$(document).ready(function() {

	setupButtons() ;

  connect() ;

  $('#btn-send-msg').click(function() {
    socket.emit('chat message', {msg: 'Hello world!', room: selectedRoom });
  }) ;

}) ;