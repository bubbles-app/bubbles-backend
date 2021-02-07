"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Messaging = _interopRequireDefault(require("./Messaging"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var App = /*#__PURE__*/function () {
  function App() {
    _classCallCheck(this, App);
  }

  _createClass(App, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;

      // First, connect to the Solace Message Broker
      _Messaging["default"].connectWithPromise().then(function (response) {
        console.log('Succesfully connected to Solace Cloud.', response); // Now that we are successfully connected, register our message handler

        _Messaging["default"].registerMessageHandler(app.messageHandler.bind(_this));
      })["catch"](function (error) {
        console.log('Unable to establish connection with Solace Cloud', error);
      });
    }
  }, {
    key: "messageHandler",
    value: function messageHandler(topicString, messageString) {
      console.log('New message on topic:', topicString, '::', messageString); // Here is where you add code to handle the message

      switch (topicString) {
        case 'SomeTopic':
          {
            var message = JSON.parse(messageString);
            console.log('Message as object', message);
            break;
          }

        default:
          {
            console.warn('Unexpected topic', topicString);
            break;
          }
      }
    }
  }, {
    key: "publishMessage",
    value: function publishMessage(topic, message) {
      _Messaging["default"].publish(topic, message);
    }
  }, {
    key: "subscribeToTopic",
    value: function subscribeToTopic(topic) {
      _Messaging["default"].subscribe(topic);
    }
  }]);

  return App;
}();

var app = new App();
var _default = app;
exports["default"] = _default;
//# sourceMappingURL=App.js.map