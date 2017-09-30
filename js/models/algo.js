/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var  ObjectId = Schema.ObjectId;
var Dependency=require('./dependency');
var AlgoModel=require('./algomodel');


var language=new Schema({
        name     : String


});
var framework=new Schema({
        name     : String


});
var AlgoSchema= new Schema({
        createdBy    :
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        name:{
                type:String,
                required: true


        },
        id:{
                type:String


        },
        status:{
                type:String


        },
        apipath:{
                type:String
        },
        description:{
                type:String
        },
        json      :Object,
        version: {
                type:String
        },
        language: language,
        framework: framework,
        dependencies    :[ {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Dependency'
        }],
        model    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'AlgoModel'
        },
        media:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Media'
        },
        annotations:[ {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Annotation'
        }],
        port:String




});

//AlgoSchema.plugin(uniqueValidator)
AlgoSchema.index({createdBy: 1,name:1,version:1,id:1}, { unique: true });
module.exports =mongoose.model('Algo',AlgoSchema);