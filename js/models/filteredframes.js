/**
 * Created by jacobiv on 06/10/2016.
 */
var Frame=require('../models/frame');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');



var FilteredFramesSchema= new Schema({
        pos:String,
        pts:String,
        pts_time:String,
        s:String,
        n:String,
        iskey:String,
        fmt:String,
        sar:String,
        type:String,
        image: {type: Schema.Types.Object, ref: 'GFS' },
        imagegfsid: String,
        frame: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Frame'
        },
        media: {
                 type:mongoose.Schema.Types.ObjectId,
                 ref:'Media'

                },
        ffcollection: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'FilteredFramesCollection'

        }


});


module.exports =mongoose.model('FilteredFrame',FilteredFramesSchema);