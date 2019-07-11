/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var  ObjectId = Schema.ObjectId;
var Dependency=require('./dependency');
var AlgoModel=require('./algomodel');


var Image= new Schema({
        contentType     : String,
        img:  {type: Schema.Types.Object, ref: 'GFS' }



});

//AlgoSchema.plugin(uniqueValidator)
module.exports =mongoose.model('Image',Image);