var socket = new WebSocket("ws://localhost:8182", "scala-protocol");  
socket.onopen = function (event) {
  document.getElementById("send").disabled = false;
  document.getElementById("close").disabled = false;
};
socket.onmessage = function(event) {
  document.getElementById("response").value = event.data;
};

function sendMessage() {
  var content = document.getElementById("message").value;
  var message = {
    type: "auto-complete",
    doc: content,
    fullAst: null,
    pos: null,
    currentNode: null
  }
  socket.send(JSON.stringify(message));
}

function closeConnection() {
  socket.close();
  document.getElementById("send").disabled = true;
  document.getElementById("close").disabled = true;
}