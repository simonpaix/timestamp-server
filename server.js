// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});

function swapWords(my_string) {
  str = my_string.split(' ');
  my_string = [str[1], str[0]].join(' ');
  return my_string;
}

// transform from unix to utc and format as required
function unixToUtc(unix) {
  // remove ending part after GMT
  let utc = new Date(unix).toString().split('+')[0];
  //add the comma to utc string
  utc = [utc.slice(0, 3), ',', utc.slice(3)].join('');
  //swap day and moth
  utc = [utc.slice(0, 5), swapWords(utc.slice(5, 11)), utc.slice(11)].join('');
  return utc;
}

app.use("/api/:date?", function(req, res) {

  let unix;
  let utc;
  req.date = req.params.date;

  // if date input is truthy but not valid, return error
  if (new Date(parseInt(req.date)) == "Invalid Date" && req.date) {
    res.json({ error: "Invalid Date" });
  }

  else {
    // if date is empty, undefined, zero, false, or NaN, return current time
    if (!req.date) {
      unix = parseInt(Date.now());
    }
    else {
      //if date is digit only string, e.g unix date
      if (/^\d*$/.test(req.date)) {
        unix = parseInt(req.date);
      }
      else {
        unix = new Date(req.date).getTime();
      }
    }
    utc = unixToUtc(unix);
    console.log({ unix: unix, utc: utc });
    res.json({ unix: unix, utc: utc });
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

