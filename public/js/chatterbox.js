var socket ;

var selectedRoom = "",username = "" ;

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
      $('a#select-room-' + selectedRoom + ' > span').html(o.length) ;
console.log(o.length) ;
      o.forEach(function(e) {
        occ = occ + e + ", " ;
      }) ;

      $("#room-occupants").html(occ) ;
    }
  }
}

function populateRoomList(params) {

  var r, c, o ;

  $("#room-select-group").html('') ;

  for (var i=0 ; i < params.msg.length ; i++) {
    r = params.msg[i].room ;
    o = params.msg[i].occupants
    c = o.length ;
    $("#room-select-group").append('<a id="select-room-' + r + '" href="#" class="list-group-item">' + r + '<span class="badge">' + c + '</span></a>') ;
  }

  $("[id^=select-room]").click(function(t) {
    t.preventDefault() ;

    $("[id^=select-room]").removeClass('room-selected') ;
    $(t.target).addClass('room-selected') ;

    username = $('#username').val() ;

    var r = t.target.childNodes[0].data ;

    if (username == "") 
      username = "anonymous" ;

console.log('u = ' + username) ;
    if (selectedRoom !== "")
      leave({user: username, room: selectedRoom}) ;

    join({user: username, room: r}) ;

    $('#message').removeAttr('disabled');
    $('#btn-send-msg').removeAttr('disabled');
    $('#username').attr('disabled','disabled');

  }) ;
}

function setupButtons() {

	$("#btn-new-room").click(function() {
		console.log('create room') ;
	}) ;

  $('#btn-send-msg').click(function() {
    console.log($('#message').val()) ;
    socket.emit('chat message', {msg: "{" + username + "} " + $('#message').val(), room: selectedRoom });
  }) ;

  $('#message').attr('disabled','disabled');
  $('#btn-send-msg').attr('disabled','disabled');
}

$(document).ready(function() {

	setupButtons() ;

  connect() ;

}) ;