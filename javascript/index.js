window.onload = main;

function main() {
  let enter = document.getElementById('connect-button');
  let roomNameInput = document.getElementById('room-name-input');
  let form = document.getElementById('form');
  window.channel = new Channel();
  form.onsubmit = (event) => {
    event.preventDefault();
  };
  enter.addEventListener('click', (event) => {
    let roomName = roomNameInput.value;

    channel.on('message', (message) => {
      console.log(message.data);
    });

    channel.connect(roomName).then((dataChannel) => {
      dataChannel.send("what's up from "+channel.clientId);
    });

    enter.disabled = true;
  });
}
