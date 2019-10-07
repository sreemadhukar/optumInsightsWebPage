// Required Modules
var express = require('express');
var app = express();
var path = require('path');
var httpProxy = require('http-proxy');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var compression = require('compression');
var helmet = require('helmet');
const puppeteer = require('puppeteer');

var port = process.env.PORT || 8000;
console.log(`Worker ${process.pid} started...`);
console.log('Node Environment: ' + process.env.NODE_ENV);
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, '.')));

var apiProxy = httpProxy.createProxyServer();
var apiForwardingUrl = 'https://gateway-stage-core.optum.com';
var sessionSecret = 'STwHkLYUwN1L5rc3yqdkuthRvczrBupc';
var key = 'Q9gRpXWjVm5GXethNxG60utGMGW7NpsO';
var heac = require('./src/assets/mock-data/heac.json');

app.all('/uhci/prd/*', function(req, res) {
  apiProxy.web(req, res, { target: apiForwardingUrl, changeOrigin: true, secure: false }, function(e) {
    handleExceptions(e, res);
  });
});

app.use((error, req, res, next) => {
  handleExceptions(error, res);
});

var whitelist = ['*.optum.com', '*.uhc.com'];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.get('/api/getJwt', function(req, res) {
  let token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iss: key
    },
    sessionSecret
  );
  res.status(200).json({
    token: token
  });
});

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://blog.risingstack.com', { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdf;
}

app.get('/api/generatePdf', function(req, res) {
  printPDF.then(pdf => {
    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length });
    res.send(pdf);
  });
});

app.get('/api/getHeac/:MsId', function(req, res) {
  res.status(200).json({
    heac: include(heac.user, req.params.MsId)
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const handleExceptions = (exception, res) => {
  console.log(exception.message + ' ' + exception.status);
  res.status(exception.status || 500);
  res.json({
    error: {
      status: 500,
      message: 'Internal Server Error 12312312'
    }
  });
};

function include(arr, obj) {
  return arr.indexOf(obj) != -1;
}

// Start Server
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
