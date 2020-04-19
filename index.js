const express = require('express');
const http =  require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const spot = require('./routes/spot');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json())

app.use('/spot', spot);
  

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});