#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var port = 8182;

// Example code from websocket documentation - https://www.npmjs.org/package/websocket

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(port, function() {
    console.log((new Date()) + ' Server is listening on port ' + port);
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

var respondToBadRequest = function(connection, message) {
  var response = {
    type: "bad-request",
    message: message
  };
  connection.sendUTF(JSON.stringify(response));
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('scala-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
        if (message.type !== 'utf8') {
            respondToBadRequest(connection, "Message not UTF8");
            return;
        }

        console.log('Received Message: ' + message.utf8Data);
        var msgdata;
        try {
            msgdata = JSON.parse(message.utf8Data);
        }
        catch (err) {
            respondToBadRequest(connection, "Message not valid JSON");
            return;
        }

        switch(msgdata.type) {

            case "auto-complete":
                var tokens = ["NO TOKEN"];
                msgdata.doc && (tokens = msgdata.doc.split(/\s/));
                var response = {
                    type: "auto-complete",
                    // static matches, plus the first token of the document
                    // just to show we were listening
                    matches: ["O HAI", "ITZ COMPLEAT", tokens[0]]
                };
                connection.sendUTF(JSON.stringify(response));
                break;

            default:
                respondToBadRequest(connection,
                    "Message type '" + msgdata.type + "' not recognised");
                break;

        }

    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});