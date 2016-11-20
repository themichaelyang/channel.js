'use strict';

const config = {};

config.connection = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};
config.offer = null;
config.channel = {
  ordered: false, // unreliable data channel
  maxPacketLifeTime: 100, // millis
  maxRetransmits: 0 // don't send again
};
