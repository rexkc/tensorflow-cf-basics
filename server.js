// Required modules
var tf = require('@tensorflow/tfjs');

var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();

var express = require('express');
var app = express();
var session = require('express-session');

var csrf = require('csurf');
var cookieParser = require('cookie-parser');
var csrfProtection = csrf({ cookie: true });

var bodyParser = require('body-parser')
var parseForm = bodyParser.urlencoded({ extended: false })

var port = appEnv.port || 6016;

app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.use(csrf());
app.use(function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.locals.csrftoken = req.csrfToken();
  next();
});

app.get('/', csrfProtection, function (req, res) {
  res.sendFile('index.html', { root: __dirname});
});

app.post('/submit', parseForm, csrfProtection, function (req, res) {
  //Vectors from form
  var vector1 = req.body.firstVector;
  var vector2 = req.body.secondVector;
  console.log(req.body.firstVector);
  // Define a model for linear regression.
  const model = tf.sequential(); //empty NN architecture
  model.add(tf.layers.dense({ units: 1, inputShape: [1] })); //fuly connected layer

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  const xlength = (vector1.length - 1) / 2;
  const ylength = (vector2.length - 1) / 2;

  // Evaluate form input to 2d Tensors
  eval("x_temp = tf.tensor2d(" + vector1 + ", [" + xlength + ", 1])");
  eval("y_temp = tf.tensor2d(" + vector2 + ", [" + ylength + ", 1])");

  console.log(y_temp);

  // Train the model using the data.
  model.fit(x_temp, y_temp, { batchSize: 4, epochs: 30 }).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    // model.predict(tf.tensor2d([xlength+1], [1, 1])).print();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('predicting the next value from\n' + x_temp + '\n and\n' + y_temp + '\n gives us\n' + model.predict(tf.tensor2d([xlength + 1], [1, 1])));
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.send('error');
// });

app.listen(port, function () {
  console.log('server starting on ' + port);
});
