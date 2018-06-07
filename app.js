// Required modules
var http = require('http');
var url = require('url');
var tf = require('@tensorflow/tfjs');

var express = require('express');
var app = express();

bodyParser = require('body-parser'),
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', function (req, res) {
//   res.sendFile('index.html', { root: __dirname });
// });

app.post('/submit', function (req, res) {
  //Vectors from form
  var vector1 = req.body.firstVector;
  var vector2 = req.body.secondVector;

  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training.
  // // Evaluate form input to 2d Tensors
  // eval("x_temp = tf.tensor2d(" + vector1 + ", [4, 1])");
  // eval("y_temp = tf.tensor2d(" + vector2 + ", [4, 1])");
  // const xs = x_temp;
  // const ys = y_temp;
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    model.predict(tf.tensor2d([5], [1, 1])).print();
    // http.createServer(function (req, res) {
    //   res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('predicting the next value from\n' + xs + '\n and\n' + ys + '\n gives us\n' + model.predict(tf.tensor2d([5], [1, 1])));
    // }).listen(8080);
  });
});



var server = app.listen(5000, function () {
  console.log('Node server is running..');
});
