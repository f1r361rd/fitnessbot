module.exports = (req,res) => {
    const hubChallenge = req.query['hub.challenge'];

    const hubMode = req.query['hub.mode'];
    const verifyTokenMatch = (req.query['hub.verify_token']==='fitness_bot');

    if(hubMode && verifyTokenMatch){
        res.status(200).send(hubChallenge);
    }else{
        res.status(403).end();
    }
};