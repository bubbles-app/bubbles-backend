require('dotenv').config();

const options = {
  host: process.env.SOLACE_HOST,
  username: 'solace-cloud-client',
  password: process.env.SOLACE_PASSWORD,
  clientId: 'myUniqueClientId',
  keepalive: 10,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 10000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed abnormally..!',
    qos: 0,
    retain: false
  },
  rejectUnauthorized: false
};

exports.options = options;
