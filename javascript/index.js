window.onload = main;

function main() {
  let enter = document.getElementById('connect-button');
  let roomNameInput = document.getElementById('room-name-input');
  let form = document.getElementById('form');
  form.onsubmit = (event) => {
    event.preventDefault();
  };
  enter.addEventListener('click', (event) => {
    let roomName = roomNameInput.value;
    init(roomName);
  });
}
