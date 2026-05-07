require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const urls = [];

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;

  let parsedUrl;

  try {
    parsedUrl = new URL(originalUrl); //Verifica que el texto tenga formato de URL válido.
  } catch (error) {
    return res.json({ error: "invalid url" });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return res.json({ error: "invalid url" }); //Esto filtra protocolos permitidos.
  }

  dns.lookup(parsedUrl.hostname, function (err) { //Verifica que el dominio exista realmente.
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
  const shortUrl = Number(req.params.short_url);

  const found = urls.find(url => url.short_url === shortUrl);

  if (!found) {
    return res.json({ error: "No short URL found" });
  }

  res.redirect(found.original_url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
