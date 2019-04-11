// Required Modules
let express = require('express');
let app = express();
let path = require('path');
let jwt = require('jsonwebtoken');
let cors = require('cors');
let port = process.env.PORT || 8000;
let sessionSecret = 'STwHkLYUwN1L5rc3yqdkuthRvczrBupc';
let key = 'Q9gRpXWjVm5GXethNxG60utGMGW7NpsO';

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
