// Required modules
var http = require('http');
var url = require('url');

var tf = require('@tensorflow/tfjs');

var express = require('express');
var app = express();


bodyParser = require('body-parser'),
  app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
  // const values = [];
  // for (let i=0;i<15;i++){
  //   values[i] = Math.random()*100;
  // }
  // const shape = [5,3];
  // const myData =tf.tensor2d(values,shape);

  // const myVar = tf.variable(myData);

  // myData.print();
  // console.log(myVar);

});

app.post('/submit', function (req, res) {
  //Vectors from form
  var vector1 = req.body.firstVector;
  var vector2 = req.body.secondVector;
  console.log(req.body.firstVector);
  // Define a model for linear regression.
  const model = tf.sequential(); //empty NN architecture
  model.add(tf.layers.dense({ units: 1, inputShape: [1] })); //fuly connected layer

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  const xlength = (vector1.length-1)/2;
  const ylength = (vector2.length-1)/2;
  console.log(xlength);
  // Generate some synthetic data for training.
  // Evaluate form input to 2d Tensors
  eval("x_temp = tf.tensor2d(" + vector1 + ", [" + xlength + ", 1])");
  eval("y_temp = tf.tensor2d(" + vector2 + ", [" + ylength + ", 1])");
  // const xs = x_temp;
  // const ys = y_temp;
  
  console.log(y_temp);

  // Train the model using the data.
  model.fit(x_temp, y_temp,{batchSize: 4, epochs: 3}).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    // model.predict(tf.tensor2d([xlength+1], [1, 1])).print();
    // http.createServer(function (req, res) {
    //   res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('predicting the next value from\n' + x_temp + '\n and\n' + y_temp + '\n gives us\n' + model.predict(tf.tensor2d([xlength+1], [1, 1])));
    // }).listen(8080);
  });

});



var server = app.listen(5000, function () {
  console.log('Node server is running..');
});
