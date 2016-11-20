window.onload = main;

function main() {
  let enter = document.getElementById('connect-button');
  let roomNameInput = document.getElementById('room-name-input');
  let form = document.getElementById('form');
  let channel = new Channel();
  form.onsubmit = (event) => {
    event.preventDefault();
  };
  enter.addEventListener('click', (event) => {
    let roomName = roomNameInput.value;
    // joinRoom(roomName).then((isCaller) => {
    //   if (isCaller) {
    //     window.channel.connect(true);
    //   }
    //   else {
    //     window.channel.connect(false);
    //   }
    // });

    channel.connect(roomName).then((dataChannel) => {
      dataChannel.send("what's up");
      console.log(dataChannel);
    });
    enter.disabled = true;
  });
}
