/**
 * Created by jacobiv on 06/10/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;








var FilteredFramesCollection= new Schema({

        media    : {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Media'
        },
        frames   : [{
                type:mongoose.Schema.Types.ObjectId,
                ref:'FilteredFrame'

        }],
        filter   : [{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Filter'
        }],
        status:String,
        scene:String,
        scale:String


});



module.exports =mongoose.model('FilteredFramesCollection',FilteredFramesCollection);