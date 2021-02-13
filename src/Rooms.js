class Rooms {
  constructor() {
    this.randomwords = require('random-words');
    this.randomnumber = require('random-number');
    this.rooms = {};
  }

  createRoom() {
    var code = randomwords({ exactly: 2, join: '-' }).concat('-', randomnumber({ min: 1, max: 9, integer: true })); 
    this.rooms[code] = {
      users: [],
      videoQueue: [],
      videoState: {
        time: 0,
        isPaused: false,
        url: ''
      }
    };
    return code;
  }

  hasRoom(roomcode) {
    return (roomcode in this.rooms);
  }

  addUserToRoom(roomcode, username) {
    this.rooms[roomcode]['users'].push(username);
  }

  roomHasUser(roomcode, username) {
    // Assume room exists
    return (username in this.rooms[roomcode]['users']);
  }

  removeUserFromRoom(roomcode, username) {
    // Assume room exists
    idx = this.rooms[roomcode]['users'].indexOf(username);
    if (idx > -1) {
      this.rooms[roomcode]['users'].splice(idx, 1);
    }
  }
}

const rooms = new Rooms();
module.exports = {
  rooms: rooms
};