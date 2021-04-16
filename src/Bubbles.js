import randomNumber from 'random-number';
import randomWords from 'random-words';

class Bubbles {
  constructor() {
    this.rooms = {};
    this.createRoom = this.createRoom.bind(this);
  }

  createRoom() {
    const code = this.generateRoomCode();
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

  generateRoomCode() {
    return randomWords({ exactly: 2, join: '-' }).concat('-', randomNumber({ min: 1, max: 9, integer: true }));
  }

  hasRoom(roomcode) {
    return roomcode in this.rooms;
  }

  addUserToRoom(roomcode, username) {
    // Assume room exists
    this.rooms[roomcode]['users'].push(username);
  }

  getUsersForRoom(roomcode) {
    // Assume room exists
    return this.rooms[roomcode]['users'];
  }

  roomHasUser(roomcode, username) {
    // Assume room exists
    return username in this.rooms[roomcode]['users'];
  }

  removeUserFromRoom(roomcode, username) {
    // Assume room exists
    idx = this.rooms[roomcode]['users'].indexOf(username);
    if (idx > -1) {
      this.rooms[roomcode]['users'].splice(idx, 1);
    }
  }

  getVideoUrlForRoom(roomcode) {
    // Assume room exists
    return this.rooms[roomcode]['videoState']['url'];
  }

  setVideoUrlForRoom(roomcode, url) {
    // Assume room exists
    this.rooms[roomcode]['videoState']['url'] = url;
  }
}

let bubbles = new Bubbles();
export default bubbles;
