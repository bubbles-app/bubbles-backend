"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mqtt = _interopRequireDefault(require("mqtt"));

var _messagingOptions = _interopRequireDefault(require("./messaging-options"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function messaging() {
  var client; // Connect to the message broker

  function connectWithPromise() {
    return new Promise(function (resolve, reject) {
      try {
        client = _mqtt["default"].connect(_messagingOptions["default"].host, _messagingOptions["default"]);
      } catch (err) {
        console.log('error connecting!');
        reject(err);
      }

      client.on('connect', function () {
        console.log('Connected to broker!');
        resolve('Connected!');
      });
    });
  } // Subscribe to a topic on to the broker


  function subscribe(topicName) {
    client.subscribe(topicName, function (err) {
      if (err) {
        console.error('Error subscribing to', topicName, err);
      }
    });
  } // Publish a message to the broker


  function publish(topicName, message) {
    client.publish(topicName, message, function (err) {
      if (err) {
        console.error('Error subscribing to', topicName, err);
      }
    });
  } // Register a function to handle received messages


  function registerMessageHandler(handler) {
    client.on('message', function (topic, message) {
      handler(topic.toString(), message.toString());
    });
  }

  return {
    connectWithPromise: connectWithPromise,
    subscribe: subscribe,
    publish: publish,
    registerMessageHandler: registerMessageHandler
  };
}

var messagingClient = messaging();
var _default = messagingClient;
exports["default"] = _default;
//# sourceMappingURL=Messaging.js.map