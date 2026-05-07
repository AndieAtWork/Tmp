require('dotenv').config();
const express = require('express');
const dns = require("dns");
const cors = require('cors');
const app = express();

const fs = require("fs");
const e = require('express');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  let parsedUrl;

  try {
    parsedUrl = new URL(originalUrl);
  } catch (error) {
    return res.json({ error: "invalid url" });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(parsedUrl.hostname, function (err) {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    const shortUrl = urls.length + 1;

    const newUrl = {
      original_url: originalUrl,
      short_url: shortUrl
    };
    urls.push(newUrl);

    res.json(newUrl);
  });
});


app.get("/api/shorturl/:short_url", function (req, res) {
  console.log("URLS");
  console.log(urls);
  const shortUrl = parseInt(req.params.short_url);
  const found = urls.find(
    item => item.short_url === shortUrl
  );
  if (!found) {
    return res.json({ error: "No short URL found" });
  }
  return res.redirect(found.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
