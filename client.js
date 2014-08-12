var socket = new WebSocket("ws://localhost:8182", "echo-protocol");  
socket.onopen = function (event) {
  document.getElementById("send").disabled = false;
};
socket.onmessage = function(event) {
  document.getElementById("response").value = event.data;
};

function sendMessage() {
  var message = document.getElementById("message").value;
  socket.send(message);
}