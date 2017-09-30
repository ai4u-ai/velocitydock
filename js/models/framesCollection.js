/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;





var FramesCollection= new Schema({

        framesOfMedia    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Media'
        },
        frames   : [{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Frame'
        }]

});



module.exports =mongoose.model('FramesCollection',FramesCollection);