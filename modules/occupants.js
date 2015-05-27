var roomOccupants = [{"room": "Auditorium", "occupants": [], "ids": []},
                     {"room": "Bar", "occupants": [], "ids": []},
                     {"room": "Lobby", "occupants": [], "ids": []},
                     {"room": "Snug", "occupants": [], "ids": []}] ;

module.exports.remove = function(params) {
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

module.exports.add = function(params) {
  for (var i = 0; i < roomOccupants.length; i++) {
    if (roomOccupants[i].room == params.room) {
      roomOccupants[i].occupants.push(params.user) ;
      roomOccupants[i].ids.push(params.id) ;      
    }
  }
}

module.exports.get = function() {
	return roomOccupants ;
}