function awaitDataChannel(connection) {
  return new Promise((resolve, reject) => {
    connection.ondatachannel = (event) => {
      let dataChannel = event.channel;
      resolve(dataChannel);
    };
  });
}

// later differentiate between caller and receiver
function bindDataChannelHandlers(dataChannel) {
  dataChannel.onopen = () => {
    print("%cRTCDataChannel now open and ready to receive messages", "color:blue;");
    // for (let i = 0; i < 200; i++) {
    //   dataChannel.send("hello!");
    // }
  };
  dataChannel.onmessage = (event) => { // careful: both clients recieve message sent
    let message = event.data;
    print("RTCDataChannel recieved a message: "+message);
  };
  dataChannel.onclose = () => {
    print("RTCDataChannel closed");
  };
  dataChannel.onerror = () => {
    print("RTCDataChannel error!");
  };
}
