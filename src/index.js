const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');

const apiController = require('./controllers/apiController');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', verificationController);
app.post('/', messageWebhookController);
app.post('/ai',apiController);
app.listen(8080,()=>{
    console.log("Listening @ port 8080");
});
