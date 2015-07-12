//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');

var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

var app = express();

app.use(express.bodyParser());

app.get('/echo', function (req, res) {
  res.send('Hello World!');
});

app.post('/echo', function (req, res) {
  
  console.log(req.body);
  
  var shouldEndSession = false;
  
  var requestType = req.body.request.type;
  var intent = req.body.request.intent;
  var slots = [];
  var responseText = "hello";
  if (requestType !== undefined) {
    if (requestType == "LaunchRequest") {
      responseText = "Hello! What's your name?";
    }
    if (requestType == "SessionEndedRequest") {
    }
  }
  if (intent !== undefined) {
    var intentName = intent.name;
    slots  = intent.slots;
    
    if (intentName == 'AskMe') {
      var question = slots.Question.value;
      console.log(question);
      responseText = question;
    }
    
    if (intentName == 'Stop') {
      shouldEndSession = true;
      responseText = "Goodbye!";
    }
    
  }
  
  var data = {
    "version": "1.0",
    "sessionAttributes": {
    },
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": responseText
      },
      "card": {
        "type": "Simple",
        "title": "Eliza",
        "subtitle": "Your personal psychotherapy",
        "content": responseText
      },
      "shouldEndSession": shouldEndSession
    }
  };
  
  var dataString = JSON.stringify(data);

  res.set({'Content-Type':'application/json;charset=UTF-8',    
'Content-Length': Buffer.byteLength(dataString, 'utf-8')});  
  
  res.send(dataString);
});

var server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
