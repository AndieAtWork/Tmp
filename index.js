// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/:date?', function(req, res) {
  let dateInput = req.params.date;

  if(!dateInput){
    var date = new Date();
    var unix = date.getTime();
    res.json({
      unix: parseInt(unix),
      utc: date.toUTCString()
    });
  }else if (isValidDateFormat(dateInput)){
    var date = new Date(dateInput);
    var unix = date.getTime();
    res.json({
      unix: parseInt(unix),
      utc: date.toUTCString()
    });
  }else if (isValidUnixFormat(dateInput)){
    var date = new Date(parseInt(dateInput));
    var unix = dateInput;
    res.json({
      unix: parseInt(unix),
      utc: date.toUTCString()
    });
  }else{
    res.json({ error : "Invalid Date" });
  }
});

function isValidDateFormat(dateStr){
  var value = dateStr.split("-");
  if (value.length != 3){
    //console.log("A");
    return false;
  }
  var year = value[0];
  var month = value[1];
  var day = value[2];

  if (/^\d+$/.test(year) == false){
    //console.log("B");
    return false;
  }
  if (/^\d+$/.test(month) == false){
    //console.log("C");
    return false;
  }
  if (/^\d+$/.test(day) == false){
    //console.log("D");
    return false;
  }

  const fecha = new Date(year, month - 1, day);
  //console.log("final test");
  //console.log(fecha);
  return (
    fecha.getFullYear() === parseInt(year) &&
    fecha.getMonth() === parseInt(month) - 1 &&
    fecha.getDate() === parseInt(day)
  );
}

function isValidUnixFormat(dateStr){
  if (/^\d+$/.test(dateStr) == false){
    return false;
  }
  const date = new Date(Number(dateStr));
  if (date.toString() === "Invalid Date"){
    return false;
  }
  return true;
}


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
