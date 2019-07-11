/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var  ObjectId = Schema.ObjectId;

var Schema = mongoose.Schema;


var TrainingSchema= new Schema({
        trainedBy    :
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
        },
        algo    :
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Algo'
        },
        trainingMode:String,
       
        startModel:
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'AlgoModel'
        },
        endModel:
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'AlgoModel'
        },
        startDate:
        {
                type:Date
        },
        endDate:
        {
                type:Date
        },
        status :
        {
                type:String
        },
        conversionSettings:{
            dest_path:String,image_width:String,image_height:String,test_train_split:String,classMode:String
        },

        actions:[{ type:mongoose.Schema.Types.ObjectId,
                ref:'TrainingAction'}],
        dataSet:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'DataSet'
        }
        ,
        steps:String,
        algoType:String,
        epochs:String,
        startFromPrevTraining:String


});

//AlgoSchema.plugin(uniqueValidator)

module.exports =mongoose.model('Training',TrainingSchema);