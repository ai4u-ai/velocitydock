/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var  ObjectId = Schema.ObjectId;

var Schema = mongoose.Schema;

var TrainingAction=new Schema(
    {
        name: String,
        time: String

    });


//AlgoSchema.plugin(uniqueValidator)
AlgoModelSchema.index({createdBy: 1,name:1,version:1}, { unique: true });
module.exports =mongoose.model('TrainingAction',TrainingAction);