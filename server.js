// Required Modules
var express = require('express');
var app = express();
var path = require('path');
var httpProxy = require('http-proxy');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var compression = require('compression');
var helmet = require('helmet');

var port = process.env.PORT || 8000;
console.log(`Worker ${process.pid} started...`);
console.log('Node Environment: ' + process.env.NODE_ENV);
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, '.')));

var apiProxy = httpProxy.createProxyServer();
var apiForwardingUrl = 'https://pedapigateway-pedprddr.ocp-ctc-dmz.optum.com';
var apiForwardingUrlStage = 'https://pedapiuhc-pedstgapp.origin-ctc-core.optum.com/';
var sessionSecret = 'STwHkLYUwN1L5rc3yqdkuthRvczrBupc';
var key = 'Q9gRpXWjVm5GXethNxG60utGMGW7NpsO';
var heac = require('./src/assets/mock-data/heac.json');
var trendAccess = require('./src/assets/mock-data/trendAccess.json');
var whitelist = ['http://localhost:4200', 'https://localhost:4200'];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.all('/uhci/stage/*', function(req, res) {
  const urlBreakDown = req.url.split('/uhci/stage/');
  const proxyUrl = apiForwardingUrlStage + urlBreakDown[urlBreakDown.length - 1];
  apiProxy.web(req, res, { target: proxyUrl, changeOrigin: true, secure: false }, function(e) {
    handleExceptions(e, res);
  });
});

app.all('/uhci/prd/*', function(req, res) {
  apiProxy.web(req, res, { target: apiForwardingUrl, changeOrigin: true, secure: false }, function(e) {
    handleExceptions(e, res);
  });
});

//app.use(cors(corsOptions));
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

app.use((error, req, res, next) => {
  handleExceptions(error, res);
});
app.get('/api/getJwt', cors(), function(req, res) {
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

app.get('/api/getHeac/:MsId', function(req, res) {
  res.status(200).json({
    heac: include(heac.user, req.params.MsId)
  });
});

app.get('/api/getTrendAccess/:MsId', function(req, res) {
  res.status(200).json({
    trendAccess: include(trendAccess.user, req.params.MsId)
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
