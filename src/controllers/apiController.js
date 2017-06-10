const nutritionixKey = '4af2455cc6b74fad9fe6f359af23f7a0';
const nutritionixId = '79055be8';
const request = require('request');

var fs = require("fs"),
    json;

function readJsonFileSync(filepath, encoding) {

    if (typeof (encoding) == 'undefined') {
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file) {

    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}


module.exports = (req, res) => {
    if (req.body.result.action == 'bmi') {
        let height = req.body.result.parameters['unit-length']['amount'];
        let weight = req.body.result.parameters['unit-weight']['amount'];
        console.log(height + " " + weight);
        let msg = Math.round(((weight * 10000) / (height * height)) * 100) / 100;




        return res.json({
            speech: msg,
            displayText: msg,
            source: 'bmi'
        });

    }
    if (req.body.result.action == 'calorie') {
        let msg = "no data found";
        let foods = req.body.result.parameters['food_product'];
        let unit = req.body.result.parameters['number'];
        let num = req.body.result.parameters['food_unit'];
        foods.forEach(function (food) {
            request("https://api.nutritionix.com/v1_1/search/" + food + "%20" + num + "%20" + unit + "?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat%2Cphotos&appId=" + nutritionixId + "&appKey=" + nutritionixKey, (err, resp, body) => {
                if (JSON.parse(resp.body).hits[0]) {
                    let item = JSON.parse(resp.body).hits[0];
                    console.log(item.fields);
                    // console.log("hello");
                    if (!item.fields.nf_calories) item.fields.nf_calories = 0;
                    if (!item.fields.nf_total_fat) item.fields.nf_total_fat = 0;
                    msg = "item name = " + item.fields.item_name + "\ncalorie = " + item.fields.nf_calories + "\nfat = " + item.fields.nf_total_fat;
                    return res.json({
                        speech: msg,
                        displayText: msg,
                        source: 'bmi'
                    });
                }
            })
        });
    }
    if (req.body.result.action == 'set.reminder') {
        console.log(req.body.result.fulfillment);
        let msg = req.body.result.parameters['time'];
        return res.json({
            speech: msg,
            displayText: msg,
            source: 'reminder'
        });
    }
    if (req.body.result.action == "exe") {
        let myres = req.body.result.parameters['body'];
        uri = 'https://wger.de/api/v2/exercise/?category=10';
        if (myres == "abs")
            uri = 'https://wger.de/api/v2/exercise/?category=10';
        if (myres == "arms")
            uri = 'https://wger.de/api/v2/exercise/?category=8';
        if (myres == "back")
            uri = 'https://wger.de/api/v2/exercise/?category=12';
        if (myres == "calves")
            uri = 'https://wger.de/api/v2/exercise/?category=14';
        if (myres == "chest")
            uri = 'https://wger.de/api/v2/exercise/?category=11';
        if (myres == "legs")
            uri = 'https://wger.de/api/v2/exercise/?category=9';
        if (myres == "shoulders")
            uri = 'https://wger.de/api/v2/exercise/?category=13';

        request(uri,(err,resp,body)=>{
            console.log(JSON.parse(body));
        });
        msg = "ok";
        return res.json({
            speech: msg,
            displayText: msg,
            source: 'exe'
        });
    }
    if (req.body.result.action == 'diet') {
        let type = req.body.result.parameters['type-diet']
        let msg = "fetching info";


        json = getConfig('../data.json');
        if (type == "gain weight") {
            item = json.morning.increase;
            msg = "\nMorning :" + item[Math.floor(Math.random() * item.length)];
            item = json.noon.increase;
            msg += "\nNoon :" + item[Math.floor(Math.random() * item.length)];
            item = json.evening.increase;
            msg += "\nEvening :" + item[Math.floor(Math.random() * item.length)];
        } else if (type == "loose weight") {
            item = json.morning.decrease;
            msg = "\nMorning :" + item[Math.floor(Math.random() * item.length)];
            item = json.noon.decrease;
            msg += "\nNoon :" + item[Math.floor(Math.random() * item.length)];
            item = json.evening.decrease;
            msg += "\nEvening :" + item[Math.floor(Math.random() * item.length)];
        }

        return res.json({
            speech: msg,
            displayText: msg,
            source: 'diet'
        });
    }


}





























