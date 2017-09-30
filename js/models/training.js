/**
 * Created by jacobiv on 06/10/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
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
       
       startModel:
        {
                type:mongoose.Schema.Types.ObjectId,
                ref:'AlgoModel'
        },
        endModel      :
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

        actions:[{ type:mongoose.Schema.Types.ObjectId,
                ref:'TrainingAction'}]


});

//AlgoSchema.plugin(uniqueValidator)

module.exports =mongoose.model('Training',TrainingSchema);