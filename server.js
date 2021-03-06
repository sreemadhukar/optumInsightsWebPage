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
var apiForwardingUrl = 'https://gateway-stage-core.optum.com';
var sessionSecret = 'STwHkLYUwN1L5rc3yqdkuthRvczrBupc';
var key = 'Q9gRpXWjVm5GXethNxG60utGMGW7NpsO';

app.all('/api/qaone/ped/*', function(req, res) {
  apiProxy.web(req, res, { target: apiForwardingUrl, changeOrigin: true, secure: true }, function(e) {
    handleExceptions(e, res);
  });
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

// Start Server
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
