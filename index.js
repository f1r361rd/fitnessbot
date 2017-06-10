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
app.listen( (process.env.PORT || 5000) ,()=>{
    console.log("Listening @ port 5000");
});
