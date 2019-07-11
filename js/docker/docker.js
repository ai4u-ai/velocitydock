/**
 * Created by ivanjacob1 on 10/01/17.
 */

var spawn = require('child_process').spawn;
var grpc = require('grpc');
var PROTO_PATH =__dirname +  '/dockerservice.proto';
var dockerservice_proto = grpc.load(PROTO_PATH).dockerservice;
var client = new dockerservice_proto.Docker('localhost:50052',
    grpc.credentials.createInsecure());


var getAssignedPort=function(servicename,callback){

    client.getServicePorts({servicename:servicename},function(err, response) {
        var returnValue;
        if(response!=undefined) returnValue=response.port
        callback(returnValue);

    })
};

var createDockerImage=function(zipId,imagename, callback){
    client.createDockerImage({zipmodelid:zipId,imagename:imagename},function(err, response){
        console.log(err)
        if(!err){
            callback();
        }
        console.log(response)
    });
}

var getNextAvailiblePort=function(servicename,callback){

    client.getNextAvailiblePort({servicename:servicename},function(err, response) {

        var returnValue;
        if(response!=undefined) returnValue=response.port
        if(response===undefined)returnValue =30000;
            callback(returnValue);

    });


};
var getNumberOfContainers=function(servicename,callback){

    client.getServiceContainers({servicename:servicename+':latest'},function(err, response) {
        var returnValue;
        if(response!=undefined) returnValue=response.containers.length
        callback(returnValue);

    })
};


var scaleService=function(servicename,number,callback){


    var dockerSpown = spawn('docker', ['service','scale',servicename+'='+number]);
    dockerSpown.on('data',function(data)
    {
        console.log(data)
    })
    dockerSpown.on('error',function(err){
        console.log('err creating service'+err)
    })
    dockerSpown.on('exit',function(err){
        console.log('service started')
    })
    dockerSpown.on('close',function(err){
        client.getServiceContainers({servicename:servicename},function(err, response) {

            callback(response.containers.length);

        })
    })
};
module.exports = {
    getAssignedPort: getAssignedPort,
    getNumberOfContainers:getNumberOfContainers,
    scaleService:scaleService,
    getNextAvailiblePort:getNextAvailiblePort,
    createDockerImage:    createDockerImage


}