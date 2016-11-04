let socket = io();

function joinRoom(roomName) {
  return new Promise((resolve, reject) => {
    socket.emit('join_room', {'roomName': roomName});

    let connectionTimeoutID = setTimeout(() => {
      reject();
    }, 2000); // make this value configurable
    socket.on('joined_room', (data) => {
      print('Room "' + data.roomName + '" joined, '+ data.totalConnections +' total connections.');
      clearTimeout(connectionTimeoutID);
      let isCaller = (data.totalConnections === 2);
      resolve(isCaller);
    });
  });
}

function connect(calling) {
  print('Created RTCPeerConnection');

  let connection = new RTCPeerConnection(config.connection);
  socket.on('remote_session_description', (data) => {
    receiveSessionDescription(connection, data.description);
  });

  if (calling) {
    let channel = connection.createDataChannel("", config.channel);
    // print(channel);
    bindDataChannelHandlers(channel);

    makeOffer(connection);
  }
  else {
    awaitDataChannel(connection).then((channel) => {
      print('Received RTCDataChannel');
      bindDataChannelHandlers(channel);
    });
  }

  bindICECandidateHandlers(connection);
}

// could combine makeOffer and makeAnswer
function makeOffer(connection) {
  connection.createOffer(config.offer)
  .then(offer => {
    // patchSDP(offer); // increase throughput
    // print(offer);
    return connection.setLocalDescription(offer)
  })
  .then(() => sendSessionDescription(connection.localDescription))
  .catch(error => console.error('createOffer() or setLocalDescription() failed: '+error));
  print('Made and sent offer');
}

function makeAnswer(connection) {
  connection.createAnswer(config.offer)
  .then(answer => { return connection.setLocalDescription(answer) })
  .then(() => sendSessionDescription(connection.localDescription))
  .catch(error => console.error('createAnswer() or setLocalDescription() failed: '+error));
  print('Made and sent answer');
}

function sendSessionDescription(offer) {
  // implement
  socket.emit('send_session_description', {description: offer});
  print('Sent session description');
}

function receiveSessionDescription(connection, receivedDescription) {
  connection.setRemoteDescription(receivedDescription)
  .then(() => {
    print('Received and set remoteDescription');
    // print(connection.localDescription);
    if (!isEmptyDescription(connection.localDescription)) { // technically should be null before set, according to spec
      // if theres local desc, should be caller
      // idk what it should do tbh
      // print('Should be connected if ICE is done');
    }
    else {
      // should be callee (answering)
      makeAnswer(connection);
    }
  });
}

function bindICECandidateHandlers(connection) {
  connection.onicecandidate = (event) => {
    if (event.candidate) {
      sendICECandidate(event.candidate); // trickle ICE candidates
      print('Sent an ICE candidate');
    }
    else {
      print('Finished sending ICE candidates');
    }
  };

  socket.on('remote_ICE_candidate', (data) => {
    connection.addIceCandidate(data.candidate).then(() => {
      print('Added ICE candidate');
    })
    .catch(error => console.error(error));
  });

  function sendICECandidate(candidate) {
    socket.emit('send_ICE_candidate', {candidate: candidate});
  }
}

function isEmptyDescription(description) {
  return !(description.type && description.sdp);
}

function print(str) {
  console.log(str);
}
