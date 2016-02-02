var express = require('express');
var bodyParser = require('body-parser');
var Trello = require('node-trello');
var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

function postToTrello(listId, command, text, user_name, cb) {
  if (text == undefined || text == null || text == "") {
    throw new Error('Format is ' + command + ' card title | label(bug, chore, or feature)');
  }

  var name_and_label = text.split('|');

	var card_data = {
		'name' : name_and_label.shift() + ' (@' + user_name + ')',
		'labels' : name_and_label.shift()
	};
	
		if (card_data[1] == "bug") {
			var idLabels = 56a39dabfb396fe70686c100;
		} else if (card_data[1] == "chore") {
			var idLabels = 56a39ffcfb396fe70686c76e;
		} else {
			var idLabels = 56a39e63fb396fe70686c30e;	
		}
	}
	
	var card_data = {
		'name' : name_and_label.shift() + ' (@' + user_name + ')',
		'idLabels' : idLabels
	};

	trello.post('/1/lists/' + listId + '/cards', card_data, cb);
}

app.post('/*', function(req, res, next) {
  var listId = req.params[0];
  var command = req.body.command,
  text = req.body.text,
  user_name = req.body.user_name;

  postToTrello(listId, command, text, user_name, function(err, data) {
    if (err) throw err;
    console.log(data);

    var name = data.name;
    var url = data.shortUrl;

    res.status(200).send('Card "' + name + '" created here: <' + url + '>');
  });
});

// test route
app.get('/', function (req, res) { res.status(200).send('SupportKit.io loves Slack and Trello!') });

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send('Error: ' + err.message);
});

app.listen(port, function () {
  console.log('Started Slack-To-Trello ' + port);
});
