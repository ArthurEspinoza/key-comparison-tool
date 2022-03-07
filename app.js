const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
//Routes
const apiRoutes = require('./api/index');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})
app.use('/api', apiRoutes);


app.listen(5000, () => {
    console.log("Listening on port: 5000");
})