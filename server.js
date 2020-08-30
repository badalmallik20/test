const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http").Server(app);
const Joi = require("joi");
const ObjectId = require('objectid');
const cors = require('cors');

const service=require('./services/dbQuery');

app.use(express.static(__dirname));

var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors()) 


//routing and controller work here

app.post('/', async (req, res) => {
    try {
        if(req.query.type==1){ //update
            let schema = Joi.object().keys({
                id: Joi.string().required(),
                firstName: Joi.string().required().min(2).max(45),
                lastName: Joi.string().required().min(2).max(45),
                email: Joi.string().email().required(),
                mobileNumber:Joi.string().length(10).regex(/^\d+$/),
            });

            Joi.validate(req.body, schema);
            let payload = await Joi.validate(req.body, schema);
            if(payload.error != null){
                throw  payload.error;
            }

            payload.email=payload.email.toLowerCase();
            let checkEmailAlreadyExist = await service.findOne({ "email": payload.email.toLowerCase()}, { "_id": 1}, { });
            if (checkEmailAlreadyExist) return res.status(400).send({message:"This Email is already registered with us.",code:400});

            let set = {
                firstName:payload.firstName,
                lastName:payload.lastName,
                email:payload.email,
                mobileNumber:payload.mobileNumber,
            };

            await service.update({ "_id": payload.id }, set, {});
            return res.status(200).send({message:'User information has been updated.',code:200});
        }else if(req.query.type==2){ //delete
            let schema = Joi.object().keys({
                id: Joi.string().required()
            });

            Joi.validate(req.body, schema);
            let payload = await Joi.validate(req.body, schema);
            if(payload.error != null){
                throw  payload.error;
            }

            await service.delete({ "_id": payload.id });
            return res.status(200).send({message:'User has been deleted.',code:200});
        }else if(req.query.type==3){ //get single user
            let schema = Joi.object().keys({
                id: Joi.string().required()
            });

            Joi.validate(req.body, schema);
            let payload = await Joi.validate(req.body, schema);
            if(payload.error != null){
                throw  payload.error;
            }
            
            let userData = await service.findOne({ "_id": payload.id}, { "firstName": 1,"lastName":1,"email":1,"mobileNumber":1,"_id":1}, { });
            return res.status(200).send({message:'User data.',code:200,data:userData});
        }else{
            let condition={};
            if (req.query.search && req.query.search !='') {
                condition=
                    { $or: [
                        {"email": {$regex: req.query.search, $options: "$i"}},
                        {"firstName": {$regex: req.query.search, $options: "$i"}},
                        {"lastName": {$regex: req.query.search, $options: "$i"}},
                        {"mobileNumber": {$regex: req.query.search, $options: "$i"}}
                    ]}
            }
            let aggragte=[];
            aggragte.push({"$match": condition})
            aggragte.push({ "$project": { "firstName": 1,"lastName":1,"email":1,"mobileNumber":1,"_id":1}});	
            aggragte.push({
                "$facet": {
                    list: [{ $skip: (parseInt(1)-1)*2 }, { $limit: 2 }],
                    count:[{$count:'total'}]
                }
            })
            let listData = await service.find(aggragte);

            return res.status(200).send({message:'User data.',code:200,data:{list:listData[0].list,count:listData[0].count[0]? listData[0].count[0].total : 0}});
        }
    }
    catch (err) {
        console.log(err)
        return res.status(400).send({message:err,code:400});
    } 
})

//mongoDb connection
mongoose.Promise = global.Promise;
  console.log("connected with - test db");
mongoose.connect('mongodb://localhost:27017/test', () => {
  console.log('you are connected to MongoDb');
});
mongoose.connection.on('error', (err) => {
  console.log('Mongdb connection failed due to error : ', err);
});

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});