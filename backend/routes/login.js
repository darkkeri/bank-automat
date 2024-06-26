const express = require('express');
const router = express.Router();
const cards = require('../models/cards_model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/',function(request, response){
    if(request.body.idCards && request.body.pincode){
        cards.login(request.body.idCards, function(err,result){
            if(err){
                console.log(err.errno);
                response.json(err.errno);
            }
            else{
                if(result.length > 0){
                    bcrypt.compare(request.body.pincode, result[0].pincode, function(err, compareResult){
                        if(compareResult){
                            console.log("Kirjautuminen ok")
                            const token = genToken({idCards: request.body.idCards});
                            response.send(token);
                        }
                        else{
                            console.log("Väärä pinkoodi");
                            response.send(false);
                        }
                    })
                }
                else{
                    console.log("Korttia ei ole");
                    response.send(false);
                }
            }
        });
    }
    else{
        console.log("Pinkoodi puuttuu");
        response.send(false);
    }
});

function genToken(value){
    return jwt.sign(value, process.env.MY_TOKEN, {expiresIn: '600s'});
}

module.exports = router;