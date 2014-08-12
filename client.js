var socket = new WebSocket("ws://localhost:8182", "scala-protocol");  
socket.onopen = function (event) {
  document.getElementById("send").disabled = false;
};
socket.onmessage = function(event) {
  document.getElementById("response").value = event.data;
};

function sendMessage() {
  var content = document.getElementById("message").value;
  var message = {
    type: "message",
    content: content
  }
  socket.send(JSON.stringify(message));
}

function closeConnection() {
  socket.close();
  document.getElementById("send").disabled = true;
  document.getElementById("close").disabled = true;
}