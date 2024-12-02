const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const msleep = require('util').promisify(setTimeout);
const path = require('path');
const rti = require('rticonnextdds-connector');
const configFile = path.join(__dirname, 'ShapeExample.xml');
const app = express();

app.use(cors()); // Add this line
app.use(bodyParser.json());

let connector;
let output;

const initRTI = async () => {
  connector = new rti.Connector('MyParticipantLibrary::MyPubParticipant', configFile);
  output = connector.getOutput('MyPublisher::MySquareWriter');
  console.log('Waiting for subscriptions...');
  await output.waitForSubscriptions();
};

app.post("/api", async (req, res) => {
    console.log("running post meathod")
  const { x, y, shapesize } = req.body;
  try {
    console.log('Writing...');
    output.instance.setNumber('x', x);
    output.instance.setNumber('y', y);
    output.instance.setNumber('shapesize', shapesize);
    output.instance.setString('color', 'BLUE');
    output.write();
    await msleep(500);

    res.json({ status: 'Data sent successfully!' });
  } catch (err) {
    console.log('Error encountered: ' + err);
    res.status(500).json({ status: 'Error', error: err.message });
  }
});

app.listen(5000, async () => {
  console.log("Server started on port 5000");
  await initRTI();
});