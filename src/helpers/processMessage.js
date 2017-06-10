const FACEBOOK_ACCESS_TOKEN = 'EAAbtvjSS2uwBAFYxZBobWRZBFp9W1rEsLumbQmmLEvDrXytO4tMBfwtVwmaLRBbAsZCn2WshWRhjwAmlLHKqjJLG7ZAZBaFSF3WdFMuPf7T722RsnY4N0zMVUNPGXBUn7KdtwZBs1yUUYdfBMGmTTFZAZBUQAfI0aCKDjvFpvaLSKgZDZD';
const CAT_IMAGE_URL = 'https://botcube.co/public/blog/apiai-tutorial-bot/hosico_cat.jpg';
const request = require('request');

const API_AI_TOKEN = '4bf7d05d52634678a8a4390416b0ed6c';
const apiAiClient = require('apiai')(API_AI_TOKEN);

const Agenda = require('agenda');
const mongoConnectionString = "mongodb://root:root@ds155201.mlab.com:55201/agenda";
const agenda = new Agenda({ db: { address: mongoConnectionString } });




    agenda.define('set reminder2', (job, done) => {
    console.log("doing job")
    const  senderId = job.attrs.data.to;
    console.log(senderId)
    let message = "It is time to take your medicine";
    sendTextMessage(senderId, message);
});


const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

const calculateobsity = (senderId, result) => {
    if (result < 18.5)
        sendTextMessage(senderId, "You are Underweight");
    else if (result < 25) {
        sendTextMessage(senderId, "You are Normal (healthy weight)");
    } else if (result < 30) {
        sendTextMessage(senderId, "You are Overweight");
    } else {
        sendTextMessage(senderId, "You are Obese");
    }
}

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, { sessionId: 'fitness_bot' });

    apiaiSession.on('response', (response) => {
        result = response.result.fulfillment.speech;
        if (response.result.metadata.intentName === 'calculate.bmi') {
           
            if(response.result.parameters['unit-length']['amount'] != undefined && response.result.parameters['unit-weight']['amount'] != undefined){
                sendTextMessage(senderId, "Your BMI is " + result);
                console.log(response.result.parameters['unit-length']['amount']);
                console.log(response.result.parameters['unit-weight']['amount']);
                calculateobsity(senderId, parseInt(result));    
            }else{
                 sendTextMessage(senderId, result);
            }
            
        }
        else if (response.result.metadata.intentName === 'set.reminder') {
            if(response.result.parameters.mytime === ''){
                 sendTextMessage(senderId, result);
                }
            else{
                sendTextMessage(senderId, "the medicine reminder has been set");
            
             agenda.schedule(response.result.parameters.mytime, 'set reminder2',{to:senderId});
             agenda.start();
            
            // makeagenda(senderId);
            }
        }
        else {
            sendTextMessage(senderId, result);
        }

    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};