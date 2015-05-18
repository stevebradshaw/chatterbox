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
	$("#room-select-group").append('<span id="select-room" class="list-group-item">Bar<span class="badge">13</span></span>') ;
	$("#room-select-group").append('<a id="select-room" href="#" class="list-group-item">Lobby<span class="badge">27</span></a>') ;
	$("#room-select-group").append('<a id="select-room" href="#" class="list-group-item">Snug<span class="badge">4</span></a>') ;
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

	$("#select-room").click(function() {
		console.log('select room') ;
	}) ;
}


$(document).ready(function() {

	console.log('document ready') ;

	populateRoomList() ;

	setupButtons() ;

}) ;