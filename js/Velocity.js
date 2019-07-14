
/* Metronic App */
var VelocityModule = angular.module("velocity", [
    "ngSanitize","angulartics","ngIdle","angulartics.scroll","ngCookies","angular-inview","com.2fdevs.videogular","com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster","rzModule" ,  "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.analytics","info.vietnamcode.nampnq.videogular.plugins.youtube","ngStorage","rx","common.fabric",
    "common.fabric.utilities",
    "common.fabric.constants","angular-darkroom","dndLists","angularMoment"
]);

/* Setup global settings */
VelocityModule.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);


VelocityModule.config(['$analyticsProvider','deepQLearnServiceProvider', function ($analyticsProvider,deepQLearnServiceProvider) {
  /*  $analyticsProvider.registerPageTrack(function (path) {
       // console.log(path);
    });
    $analyticsProvider.registerEventTrack(function (action, properties) {
       // deepQLearnServiceProvider.$get().forward(1);
        console.log(action);
    });*/
}]);

//IDLE Provider
VelocityModule.config(function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
  //  IdleProvider.idle(50); // in seconds
  //  IdleProvider.timeout(50); // in seconds
 //   KeepaliveProvider.interval(2); // in seconds
})

VelocityModule.factory('uuid2', [
    function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return {

            newuuid: function() {
                // http://www.ietf.org/rfc/rfc4122.txt
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                return s.join("");
            },
            newguid: function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
        }

    }]);
VelocityModule.filter('removeSpaces', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
    };
}]);
VelocityModule.filter('replaceSpaces', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '_');
    };
}]);
/*VelocityModule.factory("inviewService",function(uuid2,$localStorage,
                                                $sessionStorage){
    API=null;

    if(angular.isUndefined($localStorage.uiid)){
        $localStorage.uiid=uuid2.newuuid()
    };

    if(document.referrer!=""){
        $localStorage.referrer=  new URL(document.referrer).hostname;
    }



    return{
        lineInView:function(inview, inviewpart) {
            var inViewReport = inview ? 'enters' : 'exit';
            if (typeof(inviewpart) != 'undefined') {
                inViewReport = inviewpart +  inViewReport;
            }
            if(angular.isDefined(API)&&!inview){
                console.log(  inViewReport+' '+ API.currentState+' '+API.currentTime+' '+API.pause());
            }     console.log("cookie id "+ $localStorage.uiid);

            if(angular.isDefined(API)&&inview){
                console.log(  inViewReport+' '+ API.currentState+' '+API.currentTime+' '+API.play());
            }

        },
        lineInViewVideo:function(index,inview, inviewpart,time) {
            var inViewReport = inview ? 'enters' : 'exit';
            if (typeof(inviewpart) != 'undefined') {
                inViewReport = inviewpart +  inViewReport;
            }
            if(angular.isDefined(API)&&!inview){
                console.log(  inViewReport+' '+ API.currentState+' '+API.currentTime+' '+API.pause());
                console.log("cookie id "+ $localStorage.uiid);
            }
            if(angular.isDefined(API)&&inview){
              //  API.seekTime(time)
                console.log(  inViewReport+' '+ API.currentState+' '+API.currentTime+' '+API.play());
            }

        },
        setPlayerApi:function(API){
            API=API;
        },API:API,onbeforeunload: window.onbeforeunload =
        function (event) {
            window.localStorage.setItem("left", new Date());
        }

        /!*     containerLineInView:function( inview, inviewpart) {
        var inViewReport = inview ? '<strong>enters</strong>' : '<strong>exit</strong>';
        if (typeof(inviewpart) != 'undefined') {
            inViewReport = '<strong>' + inviewpart + '</strong> part ' + inViewReport;
        }
           // console.log({  message: 'Containerd line <em>#' +  + '</em>: ' + inViewReport });
    }*!/
    }
});*/

MetronicApp.factory('convnetService', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope) {
        var d = $q.defer(),
          convnetService = {
                convnet: function() { return d.promise; }
            };
        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function() { d.resolve($window.convnetjs); });
        }
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'js/algorithms/convnet.js';
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return convnetService;
    }]);
MetronicApp.factory('recurrentRService', ['$document', '$window', '$q', '$rootScope',
    function($document, $window, $q, $rootScope) {
        var d = $q.defer(),
            recurrentRService = {
                R: function() { return d.promise; }
            };
        function onScriptLoad() {
            // Load client in the browser
            $rootScope.$apply(function() { d.resolve($window.R); });
        }
        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'js/algorithms/recurrent.js';
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return recurrentRService;
    }]);



VelocityModule.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated'
})


    // .constant('API_ENDPOINT', {
    //     url:  '/api'
    //     //  For a simulator use: url: 'http://127.0.0.1:8080/api'
    // });

VelocityModule.service('API_ENDPOINT',function($q,$location){
   return {url:$location.protocol()+'://'+$location.host()+':'+$location.port()+'/api',flask_api:$location.protocol()+'://'+$location.host()+':5000'}
});



VelocityModule.factory('ChangeAPICallsIntercepter', ['$log', function($log,$location,API_ENDPOINT) {
    $log.debug('$log is here to show you that this is a regular factory with injection');

    var myInterceptor = {
        'request': function (config) {
            if (API_ENDPOINT !=undefined){
                $log.debug( API_ENDPOINT.url());

            }

            return config || $q.when(config);

        }
    };

    return myInterceptor;
}]) .config(function ($httpProvider) {
    $httpProvider.interceptors.push('ChangeAPICallsIntercepter');
});
VelocityModule.service('AuthService', function($q, $http, $location,API_ENDPOINT) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var isAuthenticated = false;
    var authToken;
    var authUser;
    function getUserAvatar(){
    /*    var data = {
            access_token:getAuthToken().substring(4,getAuthToken().length)

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
        $http.get(
            API_ENDPOINT.url+'/user/get/avatar',config

        )
            .then(angular.bind(this,function(response) {
                console.log(response.data);
                /!* var json = JSON.parse(response.data.json);
                 net = new convnetjs.Net();*!/

                  return response.data;


                //return response.data;
            }));*/
    };
    function getCurrentUser(){
        if(authUser!=undefined) {
            return authUser;
        }else{
            var  token =window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                return   parseJwt(token);
            }
        }
    };
     function parseJwt( token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;

        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken;
    }
    function getAuthToken(){
      return window.localStorage.getItem(LOCAL_TOKEN_KEY);
    };
    function destroyUserCredentials() {
        authUser=undefined;
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);

                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var update = function(user) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/updateUser', user).then(function(result) {
                if (result.data.success) {
                    storeUserCredentials(result.data.token);


                    resolve(result.data.msg);
                    authUser=result.data.user;


                } else {
                    reject(result.data.msg);
                }
            });
        });
    };
    var login = function(user) {
        return $q(function(resolve, reject) {


            $http.post(    API_ENDPOINT.url+ '/authenticate', user).then(function(result) {
                if (result.data.success) {
                    storeUserCredentials(result.data.token);
                    resolve(result.data.msg);
                    authUser=result.data.user;
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var logout = function() {
        destroyUserCredentials();
    };

    loadUserCredentials();

    return {
        updateUser:update,
        getUserAvatar:getUserAvatar,
        getCurrUser:getCurrentUser,
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: function() {return isAuthenticated;},
        getAuthToken:getAuthToken
    };
});

VelocityModule.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });



VelocityModule.factory("annotationService",function($rootScope,$http,API_ENDPOINT,AuthService) {
var classes={};
    var classCollection={};
    classCollection.classes=[{number:0,name:'Fill in'},{number:1,name:'Fill in'}];
    classCollection.name='Fill in Name';
    classes=[];
    classes.push(classCollection);
    selectedClasses=classes[0];
    var selectedClass={};
    var selectedClasses={};
    var data = {
        access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

    };
    var data = {
        access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

    };
    var config = {
        params: data,
        headers : {'Content-Type': 'application/json'}

    };
/*    loadClassesInit= function(){  $http.get(
        API_ENDPOINT.url+'/classes/get',config

    )
        .then(angular.bind(this,function(response) {
            console.log(response.data);
            /!* var json = JSON.parse(response.data.json);
             net = new convnetjs.Net();*!/
            if(response.data!=null){
                classes=   response.data;
                selectedClasses=classes[0];
            }

            //return response.data;
        }));
  };*/
  //  loadClassesInit();
    return {
        classes:classes,
        selectedClass:selectedClass,
        addNewClasses:function(){




        },


        addClasses:function(videoId){

            selectedClasses.classes.push({number: selectedClasses.classes.length,name:'Fill in name'});

        var data ={
            classes:selectedClasses.classes,
            name:selectedClasses.name,
            annotatedFrom:videoId
        };
        $http({
            url:API_ENDPOINT.url+ '/classes/save',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}}).then(function() {console.log('success')})   // success
            .catch(function() {console.log('error')});

        return classes;
    },
        deleteClass:function(index){

            selectedClasses.classes.splice(index,1);
            selectedClasses.classes.join();
            var data ={
                classes:selectedClasses.classes,
                algo:this.getSelectedAlgo()._id,
                _id:classes._id
            };
            $http({
                url:API_ENDPOINT.url+ '/classes/save',
                method: "POST",
                data: data,
                headers: {'Content-Type': 'application/json'}}).then(function() {console.log('success')})   // success
                .catch(function() {console.log('error')});

        },
        getSelectedClass:function(){

            return    this.selectedClass;
        },
        setSelectedClass:function(selectedClass){

            this.selectedClass=selectedClass;
        },
        getClasses:function(){

            return classes;
        }


    }

});


VelocityModule.factory("algoService",function($rootScope,$http,API_ENDPOINT,AuthService) {
    var trained=0;
    var train_acc=0;
    var stats={};
    var size={width:32,height:32};
    var trainer;
    var net=new convnetjs.Net();
    var selectedAlgo=0;
    var layer_defs = [];
    layer_defs.push({type:'input', out_sx:size.width, out_sy:size.height, out_depth:3});
    layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
    // the layer will perform convolution with 16 kernels, each of size 5x5.
    // the input will be padded with 2 pixels on all sides to make the output Vol of the same size
    // output Vol will thus be 32x32x16 at this point
    layer_defs.push({type:'pool', sx:2, stride:2});
    // output Vol is of size 16x16x16 here
    layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
    // output Vol is of size 16x16x20 here
    layer_defs.push({type:'pool', sx:2, stride:2});
    // output Vol is of size 8x8x20 here
    layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
    // output Vol is of size 8x8x20 here
    layer_defs.push({type:'pool', sx:2, stride:2});
    // output Vol is of size 4x4x20 here
    //layer_defs.push({type:'softmax', num_classes:2});
    layer_defs.push({type:'softmax', num_classes:2});
    var classes={};
    classes.classes = Array.apply(null, Array(layer_defs[ layer_defs.length-1].num_classes)).map(function (o, i) { return new Object({number:i,name:'Fill in'}); });



    var selectedClass=0;

  //  var algos= [{name: "Convnent",version:'1.7.0',layers:[{type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'},{type:'pool', sx:2, stride:2},{type:'softmax', num_classes:2},{type:'svm', num_classes:2},{type:'fc', num_neurons:10, activation:'sigmoid'}]}];

    var algos=[];
        return {
           train_accAdd: function(_train_acc){
               train_acc+=_train_acc;
           },
    trainedNumberAdd:function(){
        trained++;
    },
    setStats:function(_stats){
        stats=_stats;
    },
           loadMyAlgoritms:function(){
                $http.get(API_ENDPOINT.url+'/myAlgos')
                    .then(angular.bind(this,function(response) {
                        console.log(response.data);
                        /* var json = JSON.parse(response.data.json);
                         net = new convnetjs.Net();*/
                        algos=   response.data;
                        this.select(0);

                        //return response.data;
                    }));

            },
            getMyAlgoritms:function(){
             //   if(!algos.length>0) this.loadMyAlgoritms();
                return algos;

            },
            deteletAlgo:function(algo){


                $http({
                    url:API_ENDPOINT.url+ '/algoDelete',
                    method: "DELETE",
                    data:algo,
                    headers: {'Content-Type': 'application/json'}}).then(function(response) {
                    algos.splice(algos.indexOf(algo),1);
                    console.log('success')})   // success
                    .catch(function() {console.log('error')});

            },
            saveAlgorithm:function(algo){
                /*var fd = new FormData();
                fd.append('data', net.toJSON());*/

//remove comment to append a file to the request
//var oBlob = new Blob(['test'], { type: "text/plain"});
//fd.append("file", oBlob,'test.txt');
             /*   $http.post('/data/fileupload', net.toJSON(), {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                });*/
             var netJson=   angular.toJson(net);
                $http({
                    url:API_ENDPOINT.url+ '/algo/save',
                    method: "POST",
                    data:{name:algo.name,version:algo.version,json:netJson},
                    headers: {'Content-Type': 'application/json'}}).then(function() {console.log('success')})   // success
                    .catch(function() {console.log('error')}); //
            },
            loadAlgorithm:function(){

                    $http.get(API_ENDPOINT.url+'/algo')
                        .then(angular.bind(this,function(response) {
                          console.log(response.data);
                           /* var json = JSON.parse(response.data.json);
                            net = new convnetjs.Net();*/
                            net.fromJSON(JSON.parse(response.data.json));
                            this.createTrainer();
                        }));
            },
            getSize:function(){

                return size;
            },
            setSize:function(_size){
                size=_size;
            },


            getStats:function () {
                stats.train_acc=train_acc/trained;
              return stats ;
            },

            isSelected: function(index){
                return  index===selectedAlgo ? true:false;
            },
            select:function(index){
                selectedAlgo=index;



            },
            getSelectedAlgo:function(){
                return algos[selectedAlgo];
            },
            createTrainer:function(){

                switch(algos[selectedAlgo].name){
                    case "Convnent":
                            net.makeLayers(layer_defs);
                            trainer= new convnetjs.SGDTrainer( net, {method:'adadelta', batch_size:4, l2_decay:0.0001});
                        break;

                }

            },
            getNet:function(){
                return net;
            },
            getTrainer:function(){

                if(trainer===undefined){
                    this.createTrainer();
                }
                return trainer;
            },
            getLayers:function(){
                return layer_defs;
            },
            addLayer: function(index,indexL){
                if(index!=layer_defs.length-1) {
                    layer_defs.splice(index + 1, 0, algos[selectedAlgo].layers[indexL]);
                    layer_defs.join();
                }
            },
            deleteLayer: function(index){
                if(index!=0&&index!=layer_defs.length-1){
                    layer_defs.splice(index-1,1);
                    layer_defs.join();
                }

            },
            convertToVol:function(img_data){
                // prepare the input: get pixels and normalize them
                var p = img_data.data;
                var W = size.width;
                var H = size.height;
                var pv = [];
                for(var i=0;i<p.length;i++) {
                    pv.push(p[i]/255.0-0.5); // normalize image pixels to [-0.5, 0.5]
                }
                var x = new convnetjs.Vol(W, H, 3, 0.0); //input volume (image)
                x.w = pv;
                var dx = Math.floor(Math.random()*5-2);
                var dy = Math.floor(Math.random()*5-2);
                x = convnetjs.augment(x, size.width, dx, dy, Math.random()<0.5);
                return x;
            }

        }
    }
);


/*VelocityModule.factory.service("VideoProvider", ["$q", "$http", "$sce","AuthService",
    function ($q, $http, $sce,AuthService) {
        var defer = $q.defer();

        this.loadVideo = function loadVideo(url) {
            $http.get(url).then(
                this.onLoadVideo.bind(this),
                this.onLoadVideoError.bind(this)
            );

            return defer.promise;
        };

        this.onLoadVideo = function onLoadVideo(response) {
            var videos = [];

            for (var i=0, l=response.data.sources.length; i<l; i++) {
                videos.push({src: $sce.trustAsResourceUrl(response.data.sources[i].src), type: response.data.sources[i].type});
            }

            response.data.sources = videos;

            defer.resolve(response.data);
        };

        this.onLoadVideoError = function onLoadVideoError(error) {
            defer.reject(error);
        };
    }
]);*/
VelocityModule.factory("videoService",function($sce,$rootScope,$http,$timeout,$filter,rx,convnetService,recurrentRService,algoService,AuthService,API_ENDPOINT,annotationService){
    $timeupdate=null,
    API=null;
    var offset = 300;
    self=this;


    this.algoService=algoService;

   // classTainer = algoService.getTrainer();
// create the agent, yay!



    /*
     this.classTainer.train(convnetjs.img_to_vol(tempCanv), 1);
     this.regressionTainer.train(this.classTainer.net.layers[this.classTainer.net.layers.length-2].out_act,[this.selector.x1,this.selector.y1, this.selector.x2 ,this.selector.y2] );

 */




   /* recurrentRService.R().then(function(R){
      console.log(R);
    });*/
/*  $http.get('js/data/tweets.json').then( function successCallback(_tweets){
      for (var i=0, l=_tweets.data.length; i<l; i++) {
          var tweet = {};
          var date = new Date(_tweets.data[i].created_at);
          var minutes = date.getUTCMinutes();
          var seconds = date.getUTCSeconds();
          var start = minutes * 60 + seconds - offset;
          var end = start + 15;

          tweet.timeLapse = {
              start: start,
              end: end
          };

          tweet.onLeave = angular.bind(self,self.onLeave);
          tweet.onUpdate = angular.bind(self,self.onUpdate);
          tweet.onComplete = angular.bind(self,self.onComplete);

          tweet.params =_tweets.data[i];
          tweet.params.index = i;

          tweets.push(tweet);
      }
 },function errorCallback(response) {
     console.log(response);
  });*/
    var tweets = [];
    var timeFrames = [];
    self.onLeave = function onLeave(currentTime, timeLapse, params) {
        params.completed = false;
        params.selected = false;
       // console.log("onLeave"+params);
    };

    self.onComplete = function onComplete(currentTime, timeLapse, params) {
        params.completed = true;
        params.selected = false;
    //    console.log("onComplete"+params);
    };

    self.onUpdate = function onUpdate(currentTime, timeLapse, params) {
        if (!params.selected) {
           // this.tweetElements[params.index].scrollIntoView();
            params.completed = false;
            params.selected = true;
       //     console.log("onUpdate"+params);
        }
    };



           /* sources=[
                /!*{src: "http://ooyala.persgroep.be/1hdHVmNDE6PhI0M_G6AufY1td-4f5OzK/DOcJ-FxaFrRg4gtDEwOjIwbTowODE7WK?_=iwsukx3cuhb2kczt1emi", type: "video/mp4" ,title:'Turkey Airport Attack' ,timeFrames:[{timeLapse :{ start:1000, end:4000, onLeave : angular.bind(self,self.onLeave),
                   onUpdate :angular.bind(self,self.onUpdate),onComplete : angular.bind(self,self.onComplete) }}]},
                {src:"http://localhost:3000/video/archery.mp4", type: "video/mp4" ,title:'archery' ,timeFrames:[]},
                {src: "http://localhost:3000/video/v_BabyCrawling_g01_c03.mp4", type: "video/mp4" ,title:'BabyCrawling2' ,timeFrames:[]},*!/
                {src: "http://localhost:3000/video/IMG_2828.MOV.mp4", type: "video/mp4" , title:'Test ',selections:[] ,timeFrames:[{timeLapse :{ start:0, end:0, onLeave : angular.bind(self,self.onLeave),
                    onUpdate :angular.bind(self,self.onUpdate),onComplete : angular.bind(self,self.onComplete) }}]},
                {src: "http://localhost:3000/video/IMG_2803.MOV.mp4", type: "video/mp4" , title:'Test luggage',selections:[] ,timeFrames:[{timeLapse :{ start:0, end:0, onLeave : angular.bind(self,self.onLeave),
                    onUpdate :angular.bind(self,self.onUpdate),onComplete : angular.bind(self,self.onComplete) }}]},
                {src: "http://localhost:3000/video/file.mp4", type: "video/mp4" , title:'Unatended luggage',selections:[] ,timeFrames:[{timeLapse :{ start:0, end:0, onLeave : angular.bind(self,self.onLeave),
                    onUpdate :angular.bind(self,self.onUpdate),onComplete : angular.bind(self,self.onComplete) }}]},
                {src: 'http://localhost:3000/api/stream/video/57fb9eec9fa4ca1d942937f1?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length), type: "video/mp4" ,title:'Biking' ,timeFrames:[]},


            ];*/



    config = {
        autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            sources: [],
            theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        plugins: {
            poster: "http://www.videogular.com/assets/images/videogular.png"
        }


    };

    analytics= {
        category: "Videogular",
            label: "Main",
            events: {
                ready: true,
                play: true,
                pause: true,
                stop: true,
                complete: true,
                progress: 10
            }
    };


    return{
        mouseDown:false,
        regressionTainer:{},
        detectObjects:true,
        detectfaces:true,
        detectMovement:true,
        detectMovementInSelection:false,
        annottate:true,
        config : config,
        $timeupdate:$timeupdate,
        API:API,
        analytics:analytics,
        currentVideo:{},
        isCompleted:false,
        playList:[],
        currentTime:0,
        paused:false,
        autoplay:0,
        edited:{},
        selector: {},
        image : {
            src: 'assets/admin/pages/media/gallery/image4.jpg',
            maxWidth: 938
        },
        onConsoleCuePoint:function onConsoleCuePoint(currentTime, timeLapse, params) {

        var percent = (currentTime - timeLapse.start) * 100 / (timeLapse.end - timeLapse.start);
        this.consoleCuePointsMessages = "time: " + currentTime + " -> (start/end/percent) " + timeLapse.start + "/" + timeLapse.end + "/" + percent + "% = " + params.message + "\n";
    },
      /*  cuePoints: {
            console: [
                {
                    timeLapse: {
                        start: 0,
                        end: 555
                    },
                    onEnter: angular.bind(this,this.onConsoleCuePoint) ,
                    onLeave: angular.bind(this,this.onConsoleCuePoint),
                    onUpdate: angular.bind(this,this.onConsoleCuePoint),
                    onComplete: angular.bind(this,this.onConsoleCuePoint),

                    params: {
                        message: "hello dude!"
                    }
                },
                {
                    timeLapse: {
                        start: 0,
                        end: 6666
                    },
                    onEnter:angular.bind(this,this.onConsoleCuePoint) ,
                    onLeave:angular.bind(this,this.onConsoleCuePoint) ,
                    onUpdate: angular.bind(this,this.onConsoleCuePoint) ,
                    onComplete: angular.bind(this,this.onConsoleCuePoint) ,
                    params: {
                        message: "cue points are awesome"
                    }
                },
                {
                    timeLapse: {
                        start: 0,
                        end: 6666
                    },
                    onLeave: angular.bind(this,this.onConsoleCuePoint) ,
                    onUpdate: angular.bind(this,this.onConsoleCuePoint) ,
                    onComplete: angular.bind(this,this.onConsoleCuePoint) ,
                    params: {
                        message: "(ノ・◡・)ノ"
                    }
                }
            ]
        },*/
        removeAnnotation:function(index){
          this.currentVideo.selections.splice(  this.currentVideo.selections.length-index-1,1)  ;



        },
        removeAllAnnotations:function(){
            this.currentVideo.selections=[]  ;



        },
        saveAnnotations:function(){
           // this.currentVideo.selections
           // var netJson=   angular.toJson(this.currentVideo.selections);

            $http({
                url:API_ENDPOINT.url+ '/annotations/save',
                method: "POST",
                data:{annotation:this.currentVideo.selections,_id:this.currentVideo.selections._id,annotatedOnMedia:this.currentVideo._id},
                headers: {'Content-Type': 'application/json'}}).then(
                    angular.bind(this,function(mess) {
                        this.currentVideo.selections=[];
                        this.currentVideo.selections=   mess.data.annotation;
                        this.currentVideo.selections._id=mess.data._id;
                        console.log(mess.data._id)}))  // success
                .catch(function() {console.log('error')}); //
        },

      setVideo:function(index){

          if(this.paused&&this.playList[index]===this.currentVideo){
              // this.API.play();
          }else{
              this.currentVideo=this.playList[index];
              if (this.currentVideo !== null && this.currentVideo !== undefined) {

                  this.API.stop();

                  this.config.sources=[this.currentVideo];

                  //  this.config.plugins.poster = this.currentVideo.cover.url;


                  // $timeout(this.API.play.bind(this.API), 100);


              }
          }



        //  API.changeSource(sources[index]);
          //API.play();

      },
        onPlayerReady : function(_API,algoService) {
           var forwardIndex = function(G, model, ix, prev) {
                var x = G.rowPluck(model['Wil'], ix);
                // forward prop the sequence learner

                var out_struct = R.forwardLSTM(G, model, hidden_sizes, x, prev);

                return out_struct;
            };

            /* this.costfun = function(model,  sent) {/*
                // takes a model and a sentence and
                // calculates the loss. Also returns the Graph
                // object which can be used to do backprop
                var n = sent.length;
                var G = new R.Graph();
                var log2ppl = 0.0;
                var cost = 0.0;
                var prev = {};
                var statsConvnet=[];
                for(var i=-1;i<n;i++) {
                    // start and end tokens are zeros
                    var ix_source = i === -1 ? 0 : sent[i]; // first step: start with START token
                    var ix_target = i === n-1 ? 0 : sent[i+1].label; // last step: end with END token


                    if(ix_source===0)
                    {
                        lh = forwardIndex(G, model, ix_source, prev);
                        prev = lh;

                        // set gradients into logprobabilities
                        logprobs = lh.o; // interpret output as logprobs
                        probs = R.softmax(logprobs); // compute the softmax probabilities

                        log2ppl += -Math.log2(probs.w[ix_target]); // accumulate base 2 log prob and do smoothing
                        cost += -Math.log(probs.w[ix_target]);

                        // write gradients into log probabilities
                        logprobs.dw = probs.w;
                        logprobs.dw[ix_target] -= 1
                    }else
                    {
                        var x = ix_source.x;
                        var y = ix_target;

                        // train Convnet
                        var stats = trainer.train(x, y);
                        //CONVNETN Stats
                        var yhat = net.getPrediction();
                        var val_acc = yhat === y ? 1.0 : 0.0;
                       // valAccWindow.add(val_acc);


                        statsConvnet.push(stats);
                        //end Stats
                        //START RECCURENTJS
                        var G = new R.Graph();
                        // var x1 = new R.Mat(20,1,net.layers[9].out_act.w,net.layers[9].out_act.dw); // example input #1

                        var x1=   G.rowBackward(net,lstm_model['Wil'],y);
                        lh = R.forwardLSTM(G, model, hidden_sizes, x1, prev);
                        prev = lh;




                        // set gradients into logprobabilities
                        logprobs = lh.o; // interpret output as logprobs
                        probs = R.softmax(logprobs); // compute the softmax probabilities


                        var val_acc_lsm = R.samplei(probs.w) === y ? 1.0 : 0.0;
                        //valAccSLMWindow.add(val_acc_lsm);


                        log2ppl += -Math.log2(probs.w[ix_target]); // accumulate base 2 log prob and do smoothing
                        cost += -Math.log(probs.w[ix_target]);

                        // write gradients into log probabilities
                        logprobs.dw = probs.w;
                        logprobs.dw[ix_target] -= 1
                        G.backward();
                        // perform param update
                        this.solver.step(this.lstm_model, 0.01, 0.00001, 5.0);
                        /!*if(R.samplei(probs.w)===ix_target){
                         correctPredictionsLSM++;
                         console.log((correctPredictionsLSM/step_num*75)*100);
                         //console.log(correctPredictionsLSM+' '+step_num);

                         }*!/


                        //visualize
                       /!* var vis_elt = document.getElementById("visnet");
                        var activations_current = document.createElement('div');
                        activations_current.appendChild(document.createTextNode('Activations frame:'));
                        activations_current.appendChild(document.createElement('br'));
                        activations_current.className = 'layer_act';
                        var train_elt = document.getElementById("trainstats");
                        train_elt.innerHTML = '';


                        var scale = 2;
                        var vol= net.layers[net.layers.length-3].out_act;
                        vol.w=lh.o.w;
                        vol.dw=lh.o.dw;
                        draw_activations_COLOR(vis_elt, vol, scale);
                        draw_activations_COLOR(vis_elt, vol, scale, true);
                        draw_activations(vis_elt,lh.o, scale);
                        train_elt.appendChild(activations_current);
                        //draw_activations_COLOR(vis_elt, x1, scale);



                        visualize_activations(net, vis_elt);*!/
                    }




                }



                var ppl = Math.pow(2, log2ppl / (n - 1));

                return {'G':G, 'ppl':ppl, 'cost':cost,'statsConvnet':statsConvnet};
            };*/

            /*var utilAddToModel = function(modelto, modelfrom) {
                for(var k in modelfrom) {
                    if(modelfrom.hasOwnProperty(k)) {
                        // copy over the pointer but change the key to use the append
                        modelto[k] = modelfrom[k];
                    }
                }
            };
            var initModel = function(letter_size,hidden_sizes,output_size,generator) {
                // letter embedding vectors
                var model = {};
                model['Wil'] = new R.RandMat(10, letter_size , 0, 0.08);

                if(generator === 'rnn') {
                    var rnn = R.initRNN(letter_size, hidden_sizes, output_size);
                    utilAddToModel(model, rnn);
                } else {
                    var lstm = R.initLSTM(letter_size, hidden_sizes, output_size);
                    utilAddToModel(model, lstm);
                }

                return model;
            };
          this.solver = new R.Solver();
            var layer_defs, net, trainer;
            var hidden_sizes = [100, 100,100, 100,100, 100];
            this.lstm_model =initModel(20, hidden_sizes, 3,'lstm');

            this.solver = new R.Solver();

*/

            //this.net =algoService.getNet();






          this.faceTracker = new tracking.ObjectTracker('face');

            //this.faceTracker.setStepSize(1.7);

        /*    var layer_defs, net, trainer;
            var t = layer_defs = [];
            layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2});
            /!*layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});*!/
            /!* layer_defs.push({type:'pool', sx:2, stride:2});
             layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
             layer_defs.push({type:'pool', sx:2, stride:2});
             layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
             layer_defs.push({type:'pool', sx:2, stride:2});*!/
           /!* layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
            layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
            layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
            layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});*!/
            layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
            layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
            layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
            layer_defs.push({type:'fc', num_neurons:20, activation:'relu'});
            layer_defs.push({type:'regression', num_neurons:4}); // 4 x,y x2 ,y2
            net = new convnetjs.Net();
            net.makeLayers(layer_defs);
            this.regressionTainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.9, batch_size:5, l2_decay:0.0});*/

           // this.classTainer=classTainer;
            //this.regressionTainer=regressionTainer;


            this.myMedia=[];
            this.config.sources=[];
            this.loadAllMyMedia = function () {
                $http.get('/api/load/allmedia').success(angular.bind(this,function (data) {
                    console.log(data);
                    if(data!=undefined){
                        data.map(function(media){

                            var method=media.filePath ==undefined ? '/stream/video/' : '/stream/video/frompath'
                            var id=media.filePath == undefined ? media.media.id : '';
                            var mediaFile={src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+media.filePath+'&'+'type='+"video/mp4",type: "video/mp4"  ,title:media.name,selections:[],timeFrames:[],_id:media._id};

                            // var mediaFile={src:API_ENDPOINT.url+'/stream/video/'+media.media.id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4" ,title:media.name,selections:[],timeFrames:[],_id:media._id}

                            this.config.sources.push(mediaFile);

                        });
                        this.API.mediaElement[0].src=  this.config.sources[0].src;
                        this.setVideo(0)
                        this.initTimeFrames()
                    }

                }));
            };

            this.loadAllMyMedia();

            this.playList=this.config.sources;

           this.API = _API;

            this.API.setVolume(0);
          // this.$timeupdate.subscribe(function(event){console.log(event)});


                if ( this.API.currentState == 'play' ||this.isCompleted)
                this.API.play();

            this.isCompleted = false;
            this.setVideo(0);
            if (this.config.autoPlay) {
                this.setVideo(0);

            }
          //  inviewService.setPlayerApi(API);
    },
        removeVideo:function(item){
            if(this.playList.indexOf(item)>-1){
                this.playList.splice(this.playList.indexOf(item),1);
            }


        },
        pouseVideo:function(video){

            if (this.currentVideo === this.playList[this.playList.indexOf(video)]) {
            //this.currentTime=this.API.currentTime;

                    this.API.pause();
                //this.API.seekTime(this.API.currentTime/1000);
                    this.paused=true;
                    this.completed=false;

            }

        },
        pouseVideo(){
            console.log(this.API.currentState)

            if(this.paused){
                this.paused=false;

                this.API.play();


            }
            if(!this.paused){
                this.paused=true;
                this.API.pause()
            }
        },
        pouseAll:function(){
                this.API.pause();


        },
        playAll:function(){
                this.API.pause();


        },
        toggleAutoplay:function(){
            if(this.config.autoPlay===false){
                this.config.autoPlay=true;
            }else{
                this.config.autoPlay=false;
            };


        },
        autoPlay:function(){
          return  this.config.autoPlay;
        },

        getTimeVideo:function(video){
            if (this.currentVideo === this.playList[this.playList.indexOf(video)]) {
                return this.API.currentTime;
            }
        },
        removeAll:function() {
            this.playList=[];

        },
        startEdit:function(video){
          this.edited=video;
        },
        selectVideo:function(video){
           // this.cuePoints.console=[];
            this.currentVideo=video;
            if(this.currentVideo.timeFrames.length===0){
                this.initTimeFrames()
            }

           /* for(var i=0;i<this.currentVideo.timeFrames.length;i++)
            {
                this.currentVideo.timeFrames[i].onEnter= function(){console.log('brseeeeeee')};
                this.currentVideo.timeFrames[i].onComplete= function(){console.log('stop ma',this.API.stop())};

                this.cuePoints.console.push( this.currentVideo.timeFrames[i]);

            }
*/

            this.config.sources=[this.currentVideo];
        },
        onCompleteVideo: function(_API){
            var indexOfVideo = this.playList.indexOf(this.currentVideo);
            this.isCompleted = true;
            if(this.config.autoPlay){
                if (indexOfVideo+1 === this.playList.length) {
                    this.currentVideo = this.playList[this.currentVideo];
                    return;
                }

                this.setVideo(indexOfVideo+1);
            }

        },
        isPlaying:function(video){
         return this.playList.indexOf(this.currentVideo)===this.playList.indexOf(video);

        },
        isPaused:function(video){
            return this.playList.indexOf(this.currentVideo)===this.playList.indexOf(video)&&this.paused;

        },
        addEmptyVideo:function(){
          var video ={};
            video.src='';
            video.timeFrame=[]; video.type="video/mp4" ;video.title='';
            this.playList.push(video);

        },
        initTimeFrames:function() {
            var timeFrame = {};
            timeFrame.timeLapse = {
                start: 0,
                end: 1000
            };
            this.currentVideo.timeFrames[0]=timeFrame
        },
        addTimeFrames:function(){
            var timeFrame={};
            timeFrame.timeLapse = {
                start: 0,
                end: 1000
            };

          /*  timeFrame.onLeave = angular.bind(this,function(){console.log('aaaaaaa')});
            timeFrame.onUpdate = angular.bind(this,function(){console.log('aaaaaaa')});
            timeFrame.onComplete = angular.bind(this,function(){console.log('aaaaaaa')});*/
           this.currentVideo.timeFrames.push(timeFrame);
           // return this.playList.indexOf(this.currentVideo)===this.playList.indexOf(video);

        },
        playFrames:function(index){
        /*    this.cuePoints.console=[];*/
           // this.currentVideo.timeFrames[index].onLeave=function(){console.log('i should be stopping here'),this.API.stop()} ;
            //this.currentVideo.timeFrames[index].onUpdate=function(){console.log('i should be stopping here'),this.API.stop()} ;
            this.currentVideo.timeFrames[index].onEnter=function(){console.log('i should be stopping here'),this.API.stop()} ;
            this.currentVideo.timeFrames[index].onEnter=function(){console.log('i should be stopping here'),this.API.stop()} ;
           // this.cuePoints.console.push(this.currentVideo.timeFrames[index]);
            this.API.seekTime(this.currentVideo.timeFrames[index].timeLapse.start/1000);
            this.API.play();
           var stop= rx.createObservableFunction(this, 'stop')
                .map(function (timeframe) { return timeframe;this.API.stop()});


            function check(event){if(event.target.currentTime>this.currentVideo.timeFrames[index].timeLapse.end){this.API.stop()}};
            this.$timeupdate=  rx.Observable.fromEvent(this.API.mediaElement, 'timeupdate')
           this.$timeupdateSubs= this.$timeupdate.subscribe(angular.bind(this,function(event)
            {

                if(event.target.currentTime> this.currentVideo.timeFrames[index].timeLapse.end/1000)
                {
                    /*console.log('event.currentTime'+ event.target.currentTime);
                    console.log('currentVideo.currentTime'+ $filter('date')(this.currentVideo.timeFrames[index].timeLapse.end, "ss"));*/
                    this.API.pause();
                    this.$timeupdateSubs.dispose();

                }
            }
            ));
        },
        cropSelected:function(){


            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            this.selector.crop(this.API.mediaElement[0]);

        },
      createSelectionCanvas:function(videoel) {


            var tempCanv=document.createElement('canvas');
            var tempContext = tempCanv.getContext('2d');
            tempCanv.width = this.API.mediaElement.width();
            tempCanv.height = this.API.mediaElement.height();
            tempContext.drawImage(videoel,0,0,tempCanv.width,tempCanv.height);
            var scale = 1; // scope.$parent.scale*!;
            var width = (this.selector.x2 - this.selector.x1) * scale;
            var height = (this.selector.y2 - this.selector.y1) * scale;

           /* var canvasForCon=document.getElementById('new');
            var canvasForConContext=canvasForCon.getContext('2d');
          canvasForConContext.drawImage(tempCanv, 0,0, width, height, 0, 0, 32, 32);*/
            /*   canvas.width = width;
             canvas.height = height;*/
            var canvas = document.createElement('canvas');
            canvas.width=width;
            canvas.height = height;
            var context = canvas.getContext('2d');
            context.width=width;
            context.height=height;
            context.clearRect(0, 0, canvas.width, canvas.height);
            var video=this.API.mediaElement[0];
            context.drawImage(tempCanv, this.selector.x1 * scale, this.selector.y1 * scale, width, height, 0, 0, width, height);

            //visualize
      /*    var newC=document.getElementById('new');
          newC.width=width;
          newC.height=height;
          newC.getContext('2d').width=width;
          newC.getContext('2d').height=height;
          newC.getContext('2d').drawImage(canvas,0,0,width,height);
*/


          return canvas;
        },
        playAlFramesSelectedVideo:function(_index){






            this.calculator =  new oflow.FlowCalculator(2);
           /*var zones= this.calculator.calculate(document.getElementById('destCanvas').getContext('2d').getImageData(0, 0, this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1).data, document.getElementById('destCanvas').getContext('2d').getImageData(0, 0,  this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1).data,this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1);


            var imageDataOrg =  document.getElementById('destCanvas').getContext('2d').getImageData(0, 0,this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1);


            var grayOrg = tracking.Image.grayscale(tracking.Image.blur(imageDataOrg.data, this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1, 3),this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1);


            var cornersCanvasOrg = tracking.Fast.findCorners(grayOrg,this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1);
*/


          /*this.env = {};
            this.env.cornersCanvasOrg=cornersCanvasOrg;
            this.env.cornersCanvasDest=cornersCanvasOrg;
            this.env.zones=zones;
            this.env.getNumStates = function() { return zones.zones.length+(2*cornersCanvasOrg.length); }
            this.env.getMaxNumActions = function() { return 4; }*/
           /* var spec = {};
            spec.update = 'qlearn'; // qlearn | sarsa
            spec.gamma = 0.9; // discount factor, [0, 1)
            spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
            spec.alpha = 0.01; // value function learning rate
            spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
            spec.experience_size = 5000; // size of experience replay memory
            spec.learning_steps_per_iteration = 20;
            spec.tderror_clamp = 1.0; // for robustness
            spec.num_hidden_units = 100 ;// number of neurons in hidden layer*/
           // this.Qagent = new RL.DQNAgent(this.env, spec);

          //  this.cuePoints.console=[];
            // this.currentVideo.timeFrames[index].onLeave=function(){console.log('i should be stopping here'),this.API.stop()} ;
            //this.currentVideo.timeFrames[index].onUpdate=function(){console.log('i should be stopping here'),this.API.stop()} ;

            this.drawArrow=function(ctx, p1, p2, size) {
                ctx.save();

                // Rotate the context to point along the path
                var dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx * dx + dy * dy);
                ctx.translate(p2.x, p2.y);
                ctx.rotate(Math.atan2(dy, dx));
                ctx.fillStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                    Math.floor(255-42.5*(-len)) + ')';
                ctx.lineWidth = 2;
                // line
                ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                    Math.floor(255-42.5*(-len)) + ')';
                ctx.beginPath();
                ctx.moveTo(0, 0);

                ctx.lineTo(-len, 0);
                ctx.closePath();
                ctx.stroke();

                // arrowhead
                ctx.fillStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                    Math.floor(255-42.5*(-len)) + ')';
                ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                    Math.floor(255-42.5*(-len)) + ')';
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-size, -size);
                ctx.lineTo(-size, size);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            };


            this.convertCanvasToImage=function(canvas) {
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                return image;
            };
            this.convertImageToCanvas=function(image) {
                var canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext("2d").drawImage(image, 0, 0);

                return canvas;
            };
            this.index=_index;



                this.API.seekTime(this.currentVideo.timeFrames[this.index].timeLapse.start/1000);
                this.API.play();
                var startTime=this.API.currentTime;
              //  this.$timeupdate=  rx.Observable.fromEvent(this.API.mediaElement, 'timeupdate');

            this.$timeupdate=  rx.Observable.fromEvent(this.API.mediaElement, 'timeupdate')
            this.$timeupdateSubs= this.$timeupdate.subscribe(angular.bind(this,function(event)
                {

                    if(event.target.currentTime> this.currentVideo.timeFrames[this.index].timeLapse.end/1000)
                    {
                        /*console.log('event.currentTime'+ event.target.currentTime);
                         console.log('currentVideo.currentTime'+ $filter('date')(this.currentVideo.timeFrames[index].timeLapse.end, "ss"));*/
                        this.API.pause();
                        this.$timeupdateSubs.dispose();


                    }
                }
            ));
                this.$timeupdateCanvas=  rx.Observable.fromEvent(this.API.mediaElement, 'timeupdate').map(angular.bind(this,(function(event){
                           // this.API.pause();
                          //  accumulator=this.API.currentTime-startTime;
                    if(this.mouseDown){
                            var sceneInterm= document.createElement('canvas');
                            var sceneIntermContext=sceneInterm.getContext('2d');
                            var w = this.API.videogularElement.width();
                            var h = this.API.videogularElement.height();
                            sceneInterm.width=w;
                            sceneInterm.height=h;
                            sceneIntermContext.width=w;
                            sceneIntermContext.height=h;
                            sceneIntermContext.drawImage(event.target,0,0,  w,h);

                            event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d').save();
                            event.srcElement.parentNode.parentElement.children[0].children[1].width=w;
                            event.srcElement.parentNode.parentElement.children[0].children[1].height=h;
                           // if(this.currentVideo.selections.length===0){
                                var selection={};
                                selection.objectSelector={};
                                selection.objectSelector.x1=this.selector.x1;
                                selection.objectSelector.x2=this.selector.x2;
                                selection.objectSelector.y1=this.selector.y1;
                                selection.objectSelector.y2=this.selector.y2;
                                selection.objectSelector.mouseDown=  this.mouseDown;
                                selection.objectSelector.class=annotationService.getSelectedClass();
                               // selection.objectSelector.algo=algoService.getSelectedAlgo().name;
                                selection.origSize={};
                                selection.origSize.width=w;
                                selection.origSize.height=h;
                                var sceneSelection={};
                                sceneSelection.x1=  this.selector.x1-5;
                                sceneSelection.y1=  this.selector.y1-5;
                                sceneSelection.x2=  this.selector.x2+5;
                                sceneSelection.y2=  this.selector.y2+5;
                                selection.sceneSelector=sceneSelection;

                                    selection.objectSelector.selectionCanvas=this.createSelectionCanvas(event.target);
                                    selection.objectSelector.dataUrl=  selection.objectSelector.selectionCanvas.toDataURL("image/jpeg",1);
                                    var image = new Image();
                                    image.src = selection.objectSelector.selectionCanvas.toDataURL("image/jpg");
                                    selection.objectSelector.image= image;




                                // var selectionCanvas= this.createSelectionCanvas(event.target);


                                 //   selection.selectionCanvasOrg= document.getElementById('destCanvas');


                              /*  var newC=document.getElementById('drawing');
                                newC.width=w;
                                newC.height=h;
                                newC.getContext('2d').width=w;
                                newC.getContext('2d').height=h;
                                newC.getContext('2d').drawImage(sceneInterm,0,0,w,h,0,0,this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1);
*/

                                selection.sceneCanvas=sceneInterm;
                                selection.currentTime=this.API.currentTime;
                                this.currentVideo.selections.push(selection);
                    }
                           /* }else{

                                this.selector= this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector;
                                this.currentVideo.selections.push(this.currentVideo.selections[this.currentVideo.selections.length-1]);
                                this.currentVideo.selections[this.currentVideo.selections.length-1].sceneCanvas=sceneInterm;
                                // var selectionCanvas= this.createSelectionCanvas(event.target);
                                var selectionCanvas = document.getElementById('destCanvas');
                                this.currentVideo.selections[this.currentVideo.selections.length-1].selectionCanvasOrg=selectionCanvas;
                            }*/




                            return event;

            })));



         //var $$=   this.$timeupdate.delay(750);
           // var $$=   rx.Observable.zip(this.$timeupdate, this.$timeupdateCanvas).bufferWithCount(2);
            this.$timeupdateCanvas.subscribe();
            var $$=   this.$timeupdateCanvas;


var visualize$$=   rx.Observable.fromEvent(this.API.mediaElement, 'timeupdate').bufferWithCount(10);
            visualize$$.subscribe(angular.bind(this,function(){
                // Visualise activations
    if(this.mouseDown){
        var f2t = function(x, d) {
            if(typeof(d)==='undefined') { var d = 5; }
            var dd = 1.0 * Math.pow(10, d);
            return '' + Math.floor(x*dd)/dd;
        }
        var maxmin = function(w) {
            if(w.length === 0) { return {}; } // ... ;s

            var maxv = w[0];
            var minv = w[0];
            var maxi = 0;
            var mini = 0;
            for(var i=1;i<w.length;i++) {
                if(w[i] > maxv) { maxv = w[i]; maxi = i; }
                if(w[i] < minv) { minv = w[i]; mini = i; }
            }
            return {maxi: maxi, maxv: maxv, mini: mini, minv: minv, dv:maxv-minv};
        }
        var draw_activations = function(elt, A, scale, grads) {

            var s = scale || 2; // scale
            var draw_grads = false;
            if(typeof(grads) !== 'undefined') draw_grads = grads;

            // get max and min activation to scale the maps automatically
            var w = draw_grads ? A.dw : A.w;
            var mm = maxmin(w);

            // create the canvas elements, draw and add to DOM
            for(var d=0;d<A.depth;d++) {

                var canv = document.createElement('canvas');
                canv.className = 'actmap';
                var W = A.sx * s;
                var H = A.sy * s;
                canv.width = W;
                canv.height = H;
                var ctx = canv.getContext('2d');
                var g = ctx.createImageData(W, H);

                for(var x=0;x<A.sx;x++) {
                    for(var y=0;y<A.sy;y++) {
                        if(draw_grads) {
                            var dval = Math.floor((A.get_grad(x,y,d)-mm.minv)/mm.dv*255);
                        } else {
                            var dval = Math.floor((A.get(x,y,d)-mm.minv)/mm.dv*255);
                        }
                        for(var dx=0;dx<s;dx++) {
                            for(var dy=0;dy<s;dy++) {
                                var pp = ((W * (y*s+dy)) + (dx + x*s)) * 4;
                                for(var i=0;i<3;i++) { g.data[pp + i] = dval; } // rgb
                                g.data[pp+3] = 255; // alpha channel
                            }
                        }
                    }
                }
                ctx.putImageData(g, 0, 0);
                elt.appendChild(canv);
            }
        }

        var draw_activations_COLOR = function(elt, A, scale, grads) {

            var s = scale || 2; // scale
            var draw_grads = false;
            if(typeof(grads) !== 'undefined') draw_grads = grads;

            // get max and min activation to scale the maps automatically
            var w = draw_grads ? A.dw : A.w;
            var mm = maxmin(w);

            var canv = document.createElement('canvas');
            canv.className = 'actmap';
            var W = A.sx * s;
            var H = A.sy * s;
            canv.width = W;
            canv.height = H;
            var ctx = canv.getContext('2d');
            var g = ctx.createImageData(W, H);
            for(var d=0;d<3;d++) {
                for(var x=0;x<A.sx;x++) {
                    for(var y=0;y<A.sy;y++) {
                        if(draw_grads) {
                            var dval = Math.floor((A.get_grad(x,y,d)-mm.minv)/mm.dv*255);
                        } else {
                            var dval = Math.floor((A.get(x,y,d)-mm.minv)/mm.dv*255);
                        }
                        for(var dx=0;dx<s;dx++) {
                            for(var dy=0;dy<s;dy++) {
                                var pp = ((W * (y*s+dy)) + (dx + x*s)) * 4;
                                g.data[pp + d] = dval;
                                if(d===0) g.data[pp+3] = 255; // alpha channel
                            }
                        }
                    }
                }
            }
            ctx.putImageData(g, 0, 0);
            elt.appendChild(canv);
        }
        var visualize_activations = function(net, elt) {

            // clear the element
            elt.innerHTML = "";

            // show activations in each layer
            var N = algoService.getTrainer().net.layers.length;
            for(var i=0;i<N;i++) {
                var L = net.layers[i];

                var layer_div = document.createElement('div');

                // visualize activations
                var activations_div = document.createElement('div');
                activations_div.appendChild(document.createTextNode('Activations:'));
                activations_div.appendChild(document.createElement('br'));
                activations_div.className = 'layer_act';
                var scale = 2;
                if(L.layer_type==='softmax' || L.layer_type==='fc') scale = 10; // for softmax

                // HACK to draw in color in input layer
                if(i===0) {
                    draw_activations_COLOR(activations_div, L.out_act, scale);
                    draw_activations_COLOR(activations_div, L.out_act, scale, true);

                    /*
                     // visualize positive and negative components of the gradient separately
                     var dd = L.out_act.clone();
                     var ni = L.out_act.w.length;
                     for(var q=0;q<ni;q++) { var dwq = L.out_act.dw[q]; dd.w[q] = dwq > 0 ? dwq : 0.0; }
                     draw_activations_COLOR(activations_div, dd, scale);
                     for(var q=0;q<ni;q++) { var dwq = L.out_act.dw[q]; dd.w[q] = dwq < 0 ? -dwq : 0.0; }
                     draw_activations_COLOR(activations_div, dd, scale);
                     */

                    /*
                     // visualize what the network would like the image to look like more
                     var dd = L.out_act.clone();
                     var ni = L.out_act.w.length;
                     for(var q=0;q<ni;q++) { var dwq = L.out_act.dw[q]; dd.w[q] -= 20*dwq; }
                     draw_activations_COLOR(activations_div, dd, scale);
                     */

                    /*
                     // visualize gradient magnitude
                     var dd = L.out_act.clone();
                     var ni = L.out_act.w.length;
                     for(var q=0;q<ni;q++) { var dwq = L.out_act.dw[q]; dd.w[q] = dwq*dwq; }
                     draw_activations_COLOR(activations_div, dd, scale);
                     */

                } else {
                    draw_activations(activations_div, L.out_act, scale);
                }

                // visualize data gradients
                if(L.layer_type !== 'softmax' && L.layer_type !== 'input' ) {
                    var grad_div = document.createElement('div');
                    grad_div.appendChild(document.createTextNode('Activation Gradients:'));
                    grad_div.appendChild(document.createElement('br'));
                    grad_div.className = 'layer_grad';
                    var scale = 2;
                    if(L.layer_type==='softmax' || L.layer_type==='fc') scale = 10; // for softmax
                    draw_activations(grad_div, L.out_act, scale, true);
                    activations_div.appendChild(grad_div);
                }

                // visualize filters if they are of reasonable size
                if(L.layer_type === 'conv') {
                    var filters_div = document.createElement('div');
                    if(L.filters[0].sx>3) {
                        // actual weights
                        filters_div.appendChild(document.createTextNode('Weights:'));
                        filters_div.appendChild(document.createElement('br'));
                        for(var j=0;j<L.filters.length;j++) {
                            // HACK to draw in color for first layer conv filters
                            if(i===1) {
                                draw_activations_COLOR(filters_div, L.filters[j], 2);
                            } else {
                                filters_div.appendChild(document.createTextNode('('));
                                draw_activations(filters_div, L.filters[j], 2);
                                filters_div.appendChild(document.createTextNode(')'));
                            }
                        }
                        // gradients
                        filters_div.appendChild(document.createElement('br'));
                        filters_div.appendChild(document.createTextNode('Weight Gradients:'));
                        filters_div.appendChild(document.createElement('br'));
                        for(var j=0;j<L.filters.length;j++) {
                            if(i===1) { draw_activations_COLOR(filters_div, L.filters[j], 2, true); }
                            else {
                                filters_div.appendChild(document.createTextNode('('));
                                draw_activations(filters_div, L.filters[j], 2, true);
                                filters_div.appendChild(document.createTextNode(')'));
                            }
                        }
                    } else {
                        filters_div.appendChild(document.createTextNode('Weights hidden, too small'));
                    }
                    activations_div.appendChild(filters_div);
                }
                layer_div.appendChild(activations_div);

                // print some stats on left of the layer
                layer_div.className = 'layer ' + 'lt' + L.layer_type;
                var title_div = document.createElement('div');
                title_div.className = 'ltitle'
                var t = L.layer_type + ' (' + L.out_sx + 'x' + L.out_sy + 'x' + L.out_depth + ')';
                title_div.appendChild(document.createTextNode(t));
                layer_div.appendChild(title_div);

                if(L.layer_type==='conv') {
                    var t = 'filter size ' + L.filters[0].sx + 'x' + L.filters[0].sy + 'x' + L.filters[0].depth + ', stride ' + L.stride;
                    layer_div.appendChild(document.createTextNode(t));
                    layer_div.appendChild(document.createElement('br'));
                }
                if(L.layer_type==='pool') {
                    var t = 'pooling size ' + L.sx + 'x' + L.sy + ', stride ' + L.stride;
                    layer_div.appendChild(document.createTextNode(t));
                    layer_div.appendChild(document.createElement('br'));
                }

                // find min, max activations and display them
                var mma = maxmin(L.out_act.w);
                var t = 'max activation: ' + f2t(mma.maxv) + ', min: ' + f2t(mma.minv);
                layer_div.appendChild(document.createTextNode(t));
                layer_div.appendChild(document.createElement('br'));

                var mma = maxmin(L.out_act.dw);
                var t = 'max gradient: ' + f2t(mma.maxv) + ', min: ' + f2t(mma.minv);
                layer_div.appendChild(document.createTextNode(t));
                layer_div.appendChild(document.createElement('br'));

                // number of parameters
                if(L.layer_type==='conv' || L.layer_type==='local') {
                    var tot_params = L.sx*L.sy*L.in_depth*L.filters.length + L.filters.length;
                    var t = 'parameters: ' + L.filters.length + 'x' + L.sx + 'x' + L.sy + 'x' + L.in_depth + '+' + L.filters.length + ' = ' + tot_params;
                    layer_div.appendChild(document.createTextNode(t));
                    layer_div.appendChild(document.createElement('br'));
                }
                if(L.layer_type==='fc') {
                    var tot_params = L.num_inputs*L.filters.length + L.filters.length;
                    var t = 'parameters: ' + L.filters.length + 'x' + L.num_inputs + '+' + L.filters.length + ' = ' + tot_params;
                    layer_div.appendChild(document.createTextNode(t));
                    layer_div.appendChild(document.createElement('br'));
                }

                // css madness needed here...
                var clear = document.createElement('div');
                clear.className = 'clear';
                layer_div.appendChild(clear);

                elt.appendChild(layer_div);
            }
        }
       /* var vis_elt = document.getElementById("visnet");
        if(algoService.getTrainer().net.layers[0].out_act != undefined){

            visualize_activations(algoService.getTrainer().net, vis_elt);
        }*/

    }

            }));
           //this.$moveDetect=$$;
            if(!this.annottate){
                this.$moveDetect= $$
                    .map(angular.bind(this,function(event){
                        if(this.currentVideo.selections.length>=2) {
                            var colsScene = (Math.round(this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.x2-this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.x1).toFixed(0))/1 ;
                            var rowsScene =  (Math.round(this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.y2-this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.y1).toFixed(0))/1;
                            var colsObject = (Math.round(this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.x2-this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.x1).toFixed(0))/1;
                            var rowsObject = (Math.round(this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.y2-this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.y1).toFixed(0))/1;

                            var newSceneCanvas=this.currentVideo.selections[this.currentVideo.selections.length-1].sceneCanvas;
                            var oldSceneCanvas=this.currentVideo.selections[this.currentVideo.selections.length-2].sceneCanvas;
                           /* var newC=document.getElementById('new');
                            newC.width=colsObject;
                            newC.height=rowsObject;
                            newC.getContext('2d').width=colsObject;
                            newC.getContext('2d').height=rowsObject;
                            newC.getContext('2d').drawImage(newSceneCanvas,this.selector.x1,this.selector.y1, colsObject,rowsObject,0,0,colsObject,rowsObject);
*/





                           /* var old=document.getElementById('old');
                            old.width=colsObject;
                            old.height=rowsObject;
                            old.getContext('2d').width=this.API.mediaElement.width();
                            old.getContext('2d').height=this.API.mediaElement.height();
                            old.getContext('2d').drawImage(oldSceneCanvas,this.selector.x1,this.selector.y1, colsObject,rowsObject,0,0,colsObject,rowsObject);
*/
                            var zonesFull=    this.calculator.calculate(oldSceneCanvas.getContext('2d').getImageData(0, 0,  oldSceneCanvas.width, oldSceneCanvas.height).data, newSceneCanvas.getContext('2d').getImageData(0, 0,  newSceneCanvas.width, newSceneCanvas.height).data,newSceneCanvas.width,newSceneCanvas.height);

                            var zones =  this.calculator.calculate(old.getContext('2d').getImageData(0, 0, colsObject,rowsObject).data, newC.getContext('2d').getImageData(0, 0,  colsObject,rowsObject).data,colsObject, rowsObject);
                                   var descriptorLength = 256;
                            var matchesShown = 10;
                            var blurRadius = 3;
                            tracking.Fast.THRESHOLD = 30;
                            tracking.Brief.N = descriptorLength;


// START ZONES IN SELECTION

                            if(this.detectMovementInSelection) {
                                zones.zones.map(angular.bind(this,function(zone){

                                    zone.x=zone.x+this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.x1;
                                    zone.y=zone.y+this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.y1;

                                }));
                                var x1=this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.x1;
                                var x2=this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.x2;
                                var y1=this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.y1;
                                var y2=this.currentVideo.selections[this.currentVideo.selections.length-1].sceneSelector.y2;
                                if(zones.u!=0||zones.v!=0){
                                    var externalZones=[];
                                    var internalZones=[];
                                    for (var i = 0; i < zones.zones.length; ++i) {
                                        var zone = zones.zones[i];
                                        if(this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.x1<=(zone.x)&&this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.x2>=(zone.x)&&this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.y1<=(zone.y )&&this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.y2>=(zone.y)) {

                                            if(this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.x1>=(zone.x + zone.u * 4)||this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.x2<=(zone.x + zone.u * 4)||this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.y1>=(zone.y + zone.v * 4 )||this.currentVideo.selections[this.currentVideo.selections.length-1].objectSelector.y2<=(zone.y + zone.v * 4)) {
                                                externalZones.push(zone);

                                                this.drawArrow(event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d'), zone, {
                                                    x: zone.x + zone.u * 4,
                                                    y: zone.y + zone.v * 4
                                                }, 2);



                                            }else{
                                                /* internalZones.push(zone);
                                                 this.drawArrow(event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d'), zone, {
                                                 x: zone.x + zone.u * 4,
                                                 y: zone.y + zone.v * 4
                                                 }, 2);*/
                                            }
                                        }

                                    }




                                    //max X and y
                                    if(externalZones.length>0){






                                        externalZones.map(function(zone)
                                        {
                                            if(x1>=(zone.x + zone.u * 4))
                                            {
                                                x1=(zone.x + zone.u * 4)
                                            }




                                            if(y1>=(zone.y + zone.v * 4)){
                                                y1=(zone.y + zone.v * 4 )
                                            }


                                            if(x2<=(zone.x + zone.u * 4)){
                                                x2=(zone.x + zone.u * 4 )
                                            }



                                            if(y2<=(zone.y + zone.v * 4)){
                                                y2=(zone.y + zone.v * 4 )
                                            }


                                        });

                                    }
                                }


                            }




                            var  getCorners=    angular.bind(this,function (x1,x2,y1,y2){




                                var matchesOrg=[];
                                //        if((x2-x1)!=0&&(y2-y1)!=0&&(x2O-x1O)!=0&&(y2O-y1O)!=0){
                                var descriptorLength = 256;
                                var matchesShown = 10;
                                var blurRadius = 3;
                                tracking.Fast.THRESHOLD = 30;
                                tracking.Brief.N = descriptorLength;

                                var homo3x3 = new jsfeat.matrix_t(3, 3, jsfeat.F32C1_t);
                                var match_mask = new jsfeat.matrix_t(500, 1, jsfeat.U8C1_t);



                                var x1Dest=x1,
                                //this.selector.y1=this.selector.y1+(y1-y1O);
                                    x2Dest=x2,
                                    y1Dest=y1,
                                    y2Dest=y2;




                                var imageDataSceneDest =  newSceneCanvas.getContext('2d').getImageData(x1Dest, x2Dest, x2Dest-x1Dest,y2Dest-y1Dest);


                                var graySceneDest = tracking.Image.grayscale(tracking.Image.blur(imageDataSceneDest.data, x2Dest-x1Dest,y2Dest-y1Dest, blurRadius),x2Dest-x1Dest,y2Dest-y1Dest);


                                var cornersSceneDest = tracking.Fast.findCorners(graySceneDest, x2Dest-x1Dest,y2Dest-y1Dest);



                                return cornersSceneDest;
                            });



                            // detect movement
                            // actually pythagoras not euclidian need to change neame
                            function euclidian(a){
                                var adx =  a.x + a.u * 4 - a.x , ady =  a.y + a.v * 4 -a.y, lena =Math.sqrt(adx * adx + ady * ady);
                                return lena;
                            }
                            function distanceEndPoint(a,b){
                                //pythagoras theorem  http://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
                                var adx =  (a.x + a.u * 4) - (b.x + b.v * 4) , ady =  (a.y + a.v * 4) -(b.y + b.v * 4), lena =Math.sqrt(adx * adx + ady * ady);
                                //  var fadx =  a.x  - b.x, fady =  a.y -b.y, fena = Math.sqrt(fadx * fadx + fady * fady);
                                /*  var adx =  (a.x + a.u * 4) - a.x , ady =  (a.y + a.v * 4) - a.y, lena =Math.sqrt(adx * adx + ady * ady);
                                 var adx =  (b.x + b.u * 4) - b.x , ady =  (b.y +b.v * 4) -b.y, blena =Math.sqrt(adx * adx + ady * ady);
                                 */
                                return lena;

                            }
                            function distance(a,b){
                                //pythagoras theorem  http://stackoverflow.com/questions/20916953/get-distance-between-two-points-in-canvas
                                var adx =  (a.x + a.u * 4) - (b.x + b.v * 4) , ady =  (a.y + a.v * 4) -(b.y + b.v * 4), lena =Math.sqrt(adx * adx + ady * ady);
                                //  var fadx =  a.x  - b.x, fady =  a.y -b.y, fena = Math.sqrt(fadx * fadx + fady * fady);
                                /*  var adx =  (a.x + a.u * 4) - a.x , ady =  (a.y + a.v * 4) - a.y, lena =Math.sqrt(adx * adx + ady * ady);
                                 var adx =  (b.x + b.u * 4) - b.x , ady =  (b.y +b.v * 4) -b.y, blena =Math.sqrt(adx * adx + ady * ady);
                                 */
                                return lena;

                            }


                            var distancePythagoras=    angular.bind(this,function (a,b){

                                var adx =  a.x1  - b.x1  , ady =  a.y1 -b.y2 , lena =Math.sqrt(adx * adx + ady * ady);

                                return lena;

                            });

                            function distanceOrigin(a,b){

                                var adx =  a.x - b.x  , ady =  a.y -b.y , lena = Math.sqrt(adx * adx + ady * ady);

                                return lena;

                            };




                            var tempZones= zonesFull.zones;

                            tempZones.sort(function (a, b) {
                                var adx =  (a.x + a.u * 4) - a.x , ady =  (a.y + a.v * 4) - a.y, lena =Math.sqrt(adx * adx + ady * ady);
                                var adx =  (b.x + b.u * 4) - b.x , ady =  (b.y +b.v * 4) -b.y, blena =Math.sqrt(adx * adx + ady * ady);
                                if(lena<blena){
                                    return 1;
                                }
                                if(lena>blena){
                                    return -1;
                                }
                                return 0;
                            });
                            if(  zones.zones !=undefined){

                            };

                            var tempZones= tempZones.slice(0,500);
                            //   tempZones.slice(0,100);
                            var  clouds=[];
                            var cloud={};
                            /*  var treeOrigin = new kdTree( zones.zones, distanceOrigin, ["x", "y","u","v"]);
                             var  treeEndPoint = new kdTree( tempZones, distanceEndPoint, ["x", "y","u","v"]);
                             */
                            function euclidian(a){
                                var adx =  a.x + a.u * 4 - a.x , ady =  a.y + a.v * 4 -a.y, lena =Math.sqrt(adx * adx + ady * ady);
                                return lena;
                            }
                            drawArrow=function(ctx, p1, p2, size) {
                                ctx.save();

                                // Rotate the context to point along the path
                                var dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx * dx + dy * dy);
                                ctx.translate(p2.x, p2.y);
                                ctx.rotate(Math.atan2(dy, dx));
                                ctx.fillStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                                    Math.floor(255-42.5*(-len)) + ')';
                                ctx.lineWidth = 2;
                                // line
                                ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                                    Math.floor(255-42.5*(-len)) + ')';
                                ctx.beginPath();
                                ctx.moveTo(0, 0);

                                ctx.lineTo(-len, 0);
                                ctx.closePath();
                                ctx.stroke();

                                // arrowhead
                                ctx.fillStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                                    Math.floor(255-42.5*(-len)) + ')';
                                ctx.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*(-len)) + ',' +
                                    Math.floor(255-42.5*(-len)) + ')';
                                ctx.beginPath();
                                ctx.moveTo(0, 0);
                                ctx.lineTo(-size, -size);
                                ctx.lineTo(-size, size);
                                ctx.closePath();
                                ctx.fill();

                                ctx.restore();
                            };

                            /* DBSCAN();*/
                            var dbscan = new  DBSCAN();
// parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
                            var dests=tempZones.filter(
                                function(zone){
                                    var adx =  zone.x + zone.u * 4-zone.x , ady =  zone.y + zone.v * 4-zone.y, lena =Math.sqrt(adx * adx + ady * ady);
                                    if(lena>5){

                                        /*   console.log((zone.x + zone.u * 4)-zone.x);
                                         console.log((zone.y + zone.v * 4)-zone.y);*/
                                        return zone
                                    }
                                }).map(function(a){
                                return [a.x + a.u * 4,a.y + a.v * 4, /*,findMatchPoints(a,5,'red')*/]});
                            var clusters = dbscan.run(dests, 30,30);
                            //console.log(clusters.length);


                            var clustersXY =    clusters.map(function(cluster){return cluster.map(function(c){return dests[c]})});

                            var img_u8, corners;
                            var maxClusters= clustersXY.map(angular.bind(this,function (c){

                                var maxX= c.map(function(v){return v}).reduce(function(a,b,c){ if(a!=undefined){if(b[0]>a[0]){return b}else{return a}}});
                                var minX= c.map(function(v){return v}).reduce(function(a,b,c){ if(a!=undefined){if(b[0]>a[0]){return a}else{return b}}});
                                var maxY= c.map(function(v){return v}).reduce(function(a,b,c){  if(a!=undefined){if(b[1]>a[1]){return b}else{return a}}});
                                var minY= c.map(function(v){return v}).reduce(function(a,b,c){if(a!=undefined) { if(b[1]>a[1]){return a}else{return b}}});
                                //  detectDiff(minX[0], maxX[0], maxY[0],minY[0], minX[0], maxX[0], maxY[0],minY[0], 'DeepPink');


                                var tempCanv=document.createElement('canvas');
                                var tempContext= tempCanv.getContext("2d");
                                tempCanv.width = Math.abs(maxX[0])-Math.abs(minX[0]);
                                tempCanv.height = Math.abs(maxY[1])- Math.abs(minY[1]);
                                tempContext.width =  Math.abs(maxX[0])-Math.abs(minX[0]);
                                tempContext.height =  Math.abs(maxY[1])- Math.abs(minY[1]);
                                tempContext.drawImage(newSceneCanvas,Math.abs(minX[0]),  Math.abs(minY[1]),tempCanv.width, tempCanv.height,0,0,tempCanv.width, tempCanv.height);



                                // find corners
                                img_u8 = new jsfeat.matrix_t(tempCanv.width, tempCanv.height, jsfeat.U8_t | jsfeat.C1_t);

                                var   corners = [];
                                var i = tempCanv.width*tempCanv.height;
                                while(--i >= 0) {
                                    corners[i] = new jsfeat.keypoint_t(0,0,0,0);
                                }
                                var imageData = tempContext.getImageData(0, 0, tempCanv.width, tempCanv.height);
                                jsfeat.imgproc.grayscale(imageData.data, tempCanv.width, tempCanv.height, img_u8);
                                jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
                                jsfeat.yape06.laplacian_threshold =30;
                                jsfeat.yape06.min_eigen_value_threshold =25;
                                var count = jsfeat.yape06.detect(img_u8, corners);
                                var data_u32 = new Uint32Array(imageData.data.buffer);
                                function render_corners(corners, count, img, step) {
                                    var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
                                    var img2={};
                                    for(var i=0; i < count; ++i)
                                    {
                                        var x = corners[i].x;
                                        var y = corners[i].y;
                                        var off = (x + y * step);
                                        img2[off] = img[off];
                                        img2[off-1] = img[off-1];
                                        img2[off+1] = img[off+1];
                                        img2[off-step] =  img[off-step];
                                        img2[off+step] = img[off+step];
                                    }
                                    img.map(function(p,i){if (img2[i]!=undefined){
                                        img[i]=img2[i];
                                    }else{
                                        img[i]=0;
                                    }})
                                }

                                render_corners(corners, count, data_u32, tempCanv.width);


                                //end find corners





                                return {x1:Math.abs(minX[0]),x2:Math.abs(maxX[0]),y1:Math.abs(minY[1]),y2:Math.abs(maxY[1]),clusters:c,volCluster:imageData};

                            }));

//drow cluisters and faces in clusters
                            /*    var ctx=  event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d');
                             this.faceTracker.on('track',angular.bind(this, function(event) {
                             if(event.data.length>0) console.log(event.data);
                             event.data.forEach(function(rect) {
                             console.log(rect.x, rect.y, rect.width, rect.height);

                             ctx.save();
                             ctx.strokeStyle = 'green';
                             ctx.fillRect(rect.x ,rect.y, 3, 3);
                             ctx.fillRect(rect.x + rect.width,   rect.y+rect.height, 3, 3);


                             });
                             }));*/
                            maxClusters.map(angular.bind(this,function(cluster){

                                var ctx=  event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d');
                                ctx.save();
                                ctx.strokeStyle = 'YellowGreen';
                                ctx.beginPath();
                                //  ctx.translate(c[0][0] ,    c[0][1]);
                                ctx.moveTo(cluster.x1,  cluster.y1);
                                ctx.lineTo(cluster.x2 ,  cluster.y1);
                                ctx.lineTo(cluster.x2,cluster.y2);
                                ctx.lineTo(cluster.x1,cluster.y2);
                                ctx.lineTo(cluster.x1,  cluster.y1);
                                ctx.lineWidth = 2;
                                ctx.stroke();







                            }));

                            /*var ctrack = new clm.tracker({useWebGL : true});
                             ctrack.init(pModel);
                             */

                            var ec = new emotionClassifier();
                            ec.init(emotionModel);

                            maxClusters.map(angular.bind(this,function(cluster){


                                var ctx=  event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d');

                                var tempCanvF=document.createElement('canvas');
                                var tempContextF= tempCanvF.getContext("2d");
                                tempCanvF.width = cluster.x2-cluster.x1;
                                tempCanvF.height =  cluster.y2-cluster.y1;
                                tempContextF.width =  cluster.x2-cluster.x1;
                                tempContextF.height =  cluster.y2-cluster.y1;
                                tempContextF.drawImage(newSceneCanvas,cluster.x1,cluster.y1,tempCanvF.width, tempCanvF.height,0,0,tempCanvF.width, tempCanvF.height);


                                if(this.detectfaces){
                                    var imageData = tempContextF.getImageData(0, 0,  tempCanvF.width, tempCanvF.height);
                                    var result=  tracking.ViolaJones.detect(imageData.data, tempCanvF.width, tempCanvF.height, tracking.ObjectTracker.prototype.getInitialScale(), tracking.ObjectTracker.prototype.getScaleFactor(), tracking.ObjectTracker.prototype.getStepSize(), tracking.ObjectTracker.prototype.getEdgesDensity(), this.faceTracker.classifiers[0]);

                                    result.map(function(rect){
                                        ctx.save();
                                        ctx.strokeStyle = 'yellow';
                                        ctx.fillText("Face",cluster.x1,cluster.y1);
                                        ctx.moveTo(cluster.x1+rect.x,  cluster.y1+rect.y);
                                        ctx.lineTo(cluster.x1+rect.x + rect.width ,cluster.y1+ rect.y);
                                        ctx.lineTo(cluster.x1+rect.x + rect.width , cluster.y1+rect.y-rect.height);
                                        ctx.lineTo(cluster.x1+rect.x ,cluster.y1+ rect.y-rect.height);
                                        ctx.lineTo(cluster.x1+rect.x,  cluster.y1+rect.y);
                                        ctx.lineWidth = 2;
                                        ctx.stroke();
                                    })
                                }

                            }));



                            var kMeans=new KMEANS();
                            // var nearestClustersConent=kMeans.run(maxClusters.map(function(cl) {return cl.volCluster.w}),3);

                            var euclidianDistance=function(a, b){
                                var p= [];
                                for(var i=0;i<a.volCluster.data.length;i++) {
                                    p.push(a.volCluster.data[i]/255.0-0.5); // normalize image pixels to [-0.5, 0.5]
                                }
                                var q= [];
                                for(var i=0;i<b.volCluster.data.length;i++) {
                                    q.push(b.volCluster.data[i]/255.0-0.5); // normalize image pixels to [-0.5, 0.5]
                                }


                                var sum = 0;
                                var i = Math.min(p.length, q.length);

                                while (i--) {
                                    var diff = p[i] - q[i];
                                    sum += diff * diff;
                                }

                                return Math.sqrt(sum);
                            } ;
                            var nearestClusters = new kdTree( maxClusters,euclidianDistance, ["x1", "x2","y1","y2","clusters","volCluster"]);




                            if(this.mouseDown&&(!this.annottate)){

                                //Prevent Overfitting.

                                var tempCanv=document.createElement('canvas');
                                var tempContext= tempCanv.getContext("2d");
                                tempCanv.width = algoService.getSize().width;
                                tempCanv.height = algoService.getSize().height;
                                tempContext.width = algoService.getSize().width;
                                tempContext.height =algoService.getSize().height;
                                tempContext.drawImage(newSceneCanvas,this.selector.x2,this.selector.y1, this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1,0,0,algoService.getSize().width, algoService.getSize().height);

                                //                 this.classTainer.train(convnetjs.img_to_vol(tempCanv), 1);






                                var tempCanv2=document.createElement('canvas');
                                var tempContext2 = tempCanv2.getContext('2d');
                                tempCanv2.width = algoService.getSize().width;
                                tempCanv2.height =  algoService.getSize().height;
                                tempContext2.width = algoService.getSize().width;
                                tempContext2.height = algoService.getSize().height;

                                tempContext2.drawImage(newSceneCanvas,this.selector.x1, this.selector.y1,  this.selector.x2-this.selector.x1,this.selector.y2-this.selector.y1,0,0,algoService.getSize().width,algoService.getSize().height);



                                var stats= algoService.getTrainer().train( convnetjs.img_to_vol(tempCanv2),annotationService.getSelectedClass());
                                try{
                                    var yhat = algoService.getTrainer().net.getPrediction();
                                }catch(e){
                                    console.log(e)
                                }

                                var train_acc = yhat === annotationService.getSelectedClass() ? 1 : 0;
                                algoService.train_accAdd(train_acc);
                                algoService.trainedNumberAdd();
                                algoService.setStats(stats);



                            }else{
                                var learned=this.currentVideo.selections.filter(function(c){ if (c.objectSelector.mouseDown) return c});

                                var   corners = [];

                                if(learned.length>0){


                                    var    tempCanv = learned[learned.length-1].selectionCanvas;
                                    tempContext=tempCanv.getContext('2d');
                                    // find corners
                                    var img_u8 = new jsfeat.matrix_t(tempCanv.width, tempCanv.height, jsfeat.U8_t | jsfeat.C1_t);


                                    var i = tempCanv.width*tempCanv.height;
                                    while(--i >= 0) {
                                        corners[i] = new jsfeat.keypoint_t(0,0,0,0);
                                    }
                                    var imageData = tempContext.getImageData(0, 0, tempCanv.width, tempCanv.height);
                                    jsfeat.imgproc.grayscale(imageData.data, tempCanv.width, tempCanv.height, img_u8);
                                    jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
                                    jsfeat.yape06.laplacian_threshold =30;
                                    jsfeat.yape06.min_eigen_value_threshold =25;
                                    var count = jsfeat.yape06.detect(img_u8, corners);
                                    var data_u32 = new Uint32Array(imageData.data.buffer);
                                    function render_corners(corners, count, img, step) {
                                        var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
                                        var img2={};
                                        for(var i=0; i < count; ++i)
                                        {
                                            var x = corners[i].x;
                                            var y = corners[i].y;
                                            var off = (x + y * step);
                                            img2[off] = img[off];
                                            img2[off-1] = img[off-1];
                                            img2[off+1] = img[off+1];
                                            img2[off-step] =  img[off-step];
                                            img2[off+step] = img[off+step];
                                        }
                                        img.map(function(p,i){if (img2[i]!=undefined){
                                            img[i]=img2[i];
                                        }else{
                                            img[i]=0;
                                        }})
                                    }

                                    render_corners(corners, count, data_u32, tempCanv.width);


                                    //end find corners
                                }else{
                                    var tempCanv2=document.createElement('canvas');
                                    var tempContext2 = tempCanv2.getContext('2d');
                                    tempCanv2.width = this.selector.x2-this.selector.x1;
                                    tempCanv2.height =  this.selector.y2-this.selector.y1;
                                    tempContext2.width = this.selector.x2-this.selector.x1;
                                    tempContext2.height =  this.selector.y2-this.selector.y1;
                                    tempContext2.drawImage(newSceneCanvas,this.selector.x1, this.selector.y1,  tempCanv2.width, tempCanv2.height,0,0,tempCanv2.width, tempCanv2.height);

                                    var img_u8 = new jsfeat.matrix_t(tempCanv2.width, tempCanv2.height, jsfeat.U8_t | jsfeat.C1_t);


                                    var i = tempCanv2.width*tempCanv2.height;
                                    while(--i >= 0) {
                                        corners[i] = new jsfeat.keypoint_t(0,0,0,0);
                                    }
                                    var imageData = tempContext2.getImageData(0, 0, tempCanv2.width, tempCanv2.height);
                                    jsfeat.imgproc.grayscale(imageData.data, tempCanv2.width, tempCanv2.height, img_u8);
                                    jsfeat.imgproc.box_blur_gray(img_u8, img_u8, 2, 0);
                                    jsfeat.yape06.laplacian_threshold =30;
                                    jsfeat.yape06.min_eigen_value_threshold =25;
                                    var count = jsfeat.yape06.detect(img_u8, corners);
                                    var data_u32 = new Uint32Array(imageData.data.buffer);
                                    function render_corners(corners, count, img, step) {
                                        var pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
                                        var img2={};
                                        for(var i=0; i < count; ++i)
                                        {
                                            var x = corners[i].x;
                                            var y = corners[i].y;
                                            var off = (x + y * step);
                                            img2[off] = img[off];
                                            img2[off-1] = img[off-1];
                                            img2[off+1] = img[off+1];
                                            img2[off-step] =  img[off-step];
                                            img2[off+step] = img[off+step];
                                        }
                                        img.map(function(p,i){if (img2[i]!=undefined){
                                            img[i]=img2[i];
                                        }else{
                                            img[i]=0;
                                        }})
                                    }

                                    render_corners(corners, count, data_u32, tempCanv2.width);


                                }




                                var point={x1:this.selector.x1,x2:this.selector.x2,y1:this.selector.y1,y2:this.selector.y2,clusters:[],volCluster:imageData};
                                var nearestArr=  nearestClusters.nearest(point,5,[150]);

                                if(nearestArr.length>0&&(!this.mouseDown)&&(!this.annottate)){

                                    nearestArr.map(function(neares){
                                        var nearest=neares[0];
                                        var tempCanv2=document.createElement('canvas');
                                        var tempContext2 = tempCanv2.getContext('2d');
                                        tempCanv2.width = algoService.getSize().width;
                                        tempCanv2.height =  algoService.getSize().height;
                                        tempContext2.width = algoService.getSize().width;
                                        tempContext2.height =  algoService.getSize().height;

                                        tempContext2.drawImage(newSceneCanvas,nearest.x1, nearest.y1,  nearest.x2-nearest.x1,nearest.y2-nearest.y1,0,0,algoService.getSize().width,algoService.getSize().height);


                                       /* var convnettempCanv=document.getElementById('convnet');
                                        convnettempCanv.width=algoService.getSize().width;
                                        convnettempCanv.height=algoService.getSize().height;
                                        convnettempCanv.getContext("2d").width=algoService.getSize().width;
                                        convnettempCanv.getContext("2d").height=algoService.getSize().height;
                                        convnettempCanv.getContext("2d").drawImage(newSceneCanvas,nearest.x1, nearest.y1,  nearest.x2-nearest.x1,nearest.y2-nearest.y1,0,0,algoService.getSize().widtt,algoService.getSize().height);
*/

                                        var prob2 =  algoService.getTrainer().net.forward(convnetjs.img_to_vol(tempCanv2));
                                        algoService.getTrainer().net.getPrediction();
                                        prob2.w[algoService.getTrainer().net.getPrediction()];
                                        var ctx=  event.srcElement.parentNode.parentElement.children[0].children[1].getContext('2d');
                                        ctx.save();
                                        ctx.font = "18px bold Georgia";
                                        ctx.fillText("Class:"+algoService.getTrainer().net.getPrediction()+" Prob:"+prob2.w[algoService.getTrainer().net.getPrediction()].toFixed(2), nearest.x1, nearest.y1);
                                    })

                                }

                            }






                        }



                        return event;
                    }));



            }

            }

        ,
        removeTimeFrames:function(index){
            this.currentVideo.timeFrames.splice(index,1);
        },
        getTimeFramesOptions:function(video,timeFrame){
            var oldrzSliderModel;
            var oldrzSliderHigh;
            return slider = {
                minValue: 0,
                maxValue: this.API.totalTime,

                options: {

                    onStart: function(api, rzSliderModel, rzSliderHigh) {
                        //api.stop();
                      this.oldrzSliderHigh=rzSliderHigh;
                       this.oldrzSliderModel=rzSliderModel;
                    },
                    onChange: function(api, rzSliderModel, rzSliderHigh) {
                      //  api.currentTime=$filter('date')(rzSliderHigh, "mm:ss");

                        if( this.oldrzSliderHigh===rzSliderHigh){
                            api.seekTime(rzSliderModel/1000);
                        }
                        if(  this.oldrzSliderModel===rzSliderModel){
                            api.seekTime(rzSliderHigh/1000);
                        }

                       // api.seekTime($filter('date')(rzSliderModel, "ss"));
                       // timeout(api.play.bind(api), 100);
                       // api.currentTime=rzSliderHigh;
                    },
                    onEnd: function(api,rzSliderModel, rzSliderHigh) {
                        //api.seekTime($filter('date')(rzSliderModel, "ss"));
                        //api.seekTime($filter('date')(rzSliderHigh, "ss"));

                     //   api.seekTime($filter('date')(rzSliderHigh, "mm:ss"));
                     //   $timeout(api.play.bind(api), 100);
                    },
                    floor: 0,
                    ceil: this.API.totalTime,
                    translate: function(value) {
                        var returnValue=  $filter('date')(value, "mm:ss");
                        return returnValue;
                    }
                }
            };
        },
        quepoints: {tweets:tweets},
        seekTime:function(start){
        this.API.seekTime(start);
    }



    /*     containerLineInView:function( inview, inviewpart) {
     var inViewReport = inview ? '<strong>enters</strong>' : '<strong>exit</strong>';
     if (typeof(inviewpart) != 'undefined') {
     inViewReport = '<strong>' + inviewpart + '</strong> part ' + inViewReport;
     }
     // console.log({  message: 'Containerd line <em>#' +  + '</em>: ' + inViewReport });
     }*/
    }
});

VelocityModule.provider('deepQLearnService',
    function(){
        var num_inputs = 27; // 9 eyes, each sees 3 numbers (wall, green, red thing proximity)
        var num_actions = 5; // 5 possible angles agent can turn
        var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
        var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;

        // the value function network computes a value of taking any of the possible actions
        // given an input state. Here we specify one explicitly the hard way
        // but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
        // to just insert simple relu hidden layers.
        var layer_defs = [];
        layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
        layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
        layer_defs.push({type:'fc', num_neurons: 50, activation:'relu'});
        layer_defs.push({type:'regression', num_neurons:num_actions});

        // options for the Temporal Difference learner that trains the above net
        // by backpropping the temporal difference learning rule.
        var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};

        var opt = {};
        opt.temporal_window = temporal_window;
        opt.experience_size = 30000;
        opt.start_learn_threshold = 1000;
        opt.gamma = 0.7;
        opt.learning_steps_total = 200000;
        opt.learning_steps_burnin = 3000;
        opt.epsilon_min = 0.05;
        opt.epsilon_test_time = 0.05;
        opt.layer_defs = layer_defs;
        opt.tdtrainer_options = tdtrainer_options;

        return{
            numberInputs:function(nrInputs){
                if(angular.isDefined(nrInputs)){
                    num_inputs= nrInputs;
                    return this;
                }else{
                    return num_inputs;
                }
            } ,
            numberActions:function(nrActions){
                if(angular.isDefined(nrActions)){
                    num_actions=nrActions;
                    return this;
                }else {
                    return num_actions;
                }
            },
            $get :function() {


               // return new deepqlearn.Brain(num_inputs, num_actions,  opt);
            }
        }



    });

VelocityModule.directive('inputFieldSelection', function(){
    return{
        restrict: 'A',
        scope:{
            onSelected: '='
        },
        link:function(scope, elem, attrs){
            var focusedElement;
            elem.on('click', function () {
                if (focusedElement != this) {
                    scope.onSelected(elem.prop('selectionStart'));
                    focusedElement = this;
                }
            });
            elem.on('blur', function () {
                focusedElement = null;
            });

            elem.on('select', function(){
                var text = elem.val().substring(elem.prop('selectionStart'),
                    elem.prop('selectionEnd'));
                scope.onSelected(text);
            });

            // elem.on('blur', function(){ scope.onSelected('') });
            // elem.on('keydown', function(){ scope.onSelected('')});
            // elem.on('mousedown', function(){ scope.onSelected('')  });
        }
    }
});

VelocityModule.directive('drawing',['videoService', function(videoService){
    function offset(element) {
        var documentElem;
        var box = { top: 0, left: 0 };
        var doc = element && element[0].children[1].ownerDocument;

        documentElem = doc.documentElement;

        if ( typeof element[0].getBoundingClientRect !== undefined ) {
            box = element[0].children[1].getBoundingClientRect();
        }

        return {
            top: box.top + (window.pageYOffset || documentElem.scrollTop) - (documentElem.clientTop || 0),
            left: box.left + (window.pageXOffset || documentElem.scrollLeft) - (documentElem.clientLeft || 0)
        };
    }
    return {
        restrict: 'E',
        scope: { localRectangles: '=rectangleList' },
        require: "^videogular",
        drawer: '=?mrDrawer',
        selector: '=?mrSelector',
        template:
        '<div mr-image-drawer mr-model="drawer" ></div>'+
        '<canvas  style="position: absolute;  z-index: 3;width:100%; height:100%" ></canvas>'
       ,
         link: function(scope, element){

      /*      var canvasElement = element.children()[0];
            var ctx = canvasElement.getContext('2d');

            // Are we drawing?
            var drawing = false;
            var dragging=false;
            var dragoffx;
            var   dragoffy;
            var selection=null;
            var valid=true;
            // the last coordinates before the current move
            var centerX;
            var centerY;
            var selectedIndex;
            element.bind('mousedown', function(newEvent){
                startX = newEvent.offsetX;
                startY = newEvent.offsetY;
                for(var i = scope.localRectangles.length-1; i >= 0; i--){
                   var r=scope.localRectangles[i];

                    selectedIndex=i;

                   // ctx.beginPath();
                    ctx.rect(r.startX, r.startY, 10, 10);
                  //  ctx.strokeStyle = 'red';
                    // draw it
                   // ctx.stroke();
                    if(ctx.isPointInPath(startX - 0.5 , startY - 0.5 )){

                       // ctx.fillStyle='red';

                        // Keep track of where in the object we clicked
                        // so we can move it smoothly (see mousemove)
                        dragoffx = startX - r.startX;
                        dragoffy = startX - r.startY;
                        dragging = true;
                        selection = r;
                        valid = false;
                        return;


                    }

                }

                if (selection) {
                    selection = null;
                    valid = false; // Need to clear the old selection border
                    dragging=false;
                }
                // begins new line
                if(!dragging){
                    ctx.beginPath();

                    drawing = true;
                }


            });

            element.bind('mousemove', function(newEvent){
                if(drawing){

                    // get current mouse position
                    currentX = newEvent.offsetX;
                    currentY = newEvent.offsetY;

                    draw(startX, startY, currentX, currentY);

                    var lastIdx = scope.localRectangles.length - 1;
                    scope.localRectangles[lastIdx] = ({startX:startX, startY: startY, sizeX: currentX, sizeY: currentY});
                    scope.$apply();
                }
                if(dragging){
                    currentX = event.offsetX;
                    currentY = event.offsetY;


                    scope.localRectangles[selectedIndex].startX =dragoffx;
                    scope.localRectangles[selectedIndex].startY =dragoffy;
                    ctx.rect( scope.localRectangles[selectedIndex].startX- 0.5 * scope.localRectangles[selectedIndex].sizeX,
                        scope.localRectangles[selectedIndex].centerY - 0.5 * scope.localRectangles[selectedIndex].sizeY,
                        scope.localRectangles[selectedIndex].sizeX, scope.localRectangles[selectedIndex].sizeY);
                    ctx.lineWidth = 2;
                    // color
                    ctx.strokeStyle = '#39e600';
                    // draw it
                    ctx.stroke();
                    scope.$apply();
                }

            });

            element.bind('mouseup', function(event){
                // stop drawing
                drawing = false;
                dragging = false;
            });


            // canvas reset
            function reset(){
                canvasElement.width = canvasElement.width;
            }

            function draw(centerX, centerY,
                          currentX, currentY, rotate){

                reset();
                var sizeX = 2 * (currentX - centerX);
                var sizeY = 2 * (currentY - centerY);

                ctx.rect(centerX - 0.5 * sizeX,
                    centerY - 0.5 * sizeY,
                    sizeX, sizeY);
                ctx.lineWidth = 2;
                // color
                ctx.strokeStyle = '#39e600';
                // draw it
                ctx.stroke();
            }*/
             scope.scaleValue = function (value, scale) {
                 return Math.floor(value * scale);
             };
             element.css('width', scope.scaleValue(element.parent().width(), scope.scale) + 'px');
             element.css('height', scope.scaleValue(element.parent().height(), scope.scale) + 'px');

             scope.selector = videoService.selector || {};

             var selector = scope.selector;
             var aspectRatio = scope.aspectRatio;

             scope.$watch('aspectRatio', function (value) {
                 aspectRatio = value;
             });

             var $document = angular.element(document);
             var $rect = angular.element('<div class="mr-box">' +
                 '<div class="mr-line top"></div>'    +
                 '<div class="mr-line bottom"></div>' +
                 '<div class="mr-line left"></div>'   +
                 '<div class="mr-line right"></div>'  +
                                 '</div>');

             var $lines = angular.element('<div class="mr-drag-line n"></div>' +
                 '<div class="mr-drag-line s"></div>' +
                 '<div class="mr-drag-line w"></div>' +
                 '<div class="mr-drag-line e"></div>');

             var $handles = angular.element('<div class="mr-drag-handle nw"></div>' +
                 '<div class="mr-drag-handle n"></div>'  +
                 '<div class="mr-drag-handle ne"></div>' +
                 '<div class="mr-drag-handle w"></div>'  +
                 '<div class="mr-drag-handle e"></div>'  +
                 '<div class="mr-drag-handle sw"></div>' +
                 '<div class="mr-drag-handle s"></div>'  +
                 '<div class="mr-drag-handle se"></div>'+


                 '</span>'+

             '</div>');


             $rect.append($lines).append($handles);

             element.append($rect);

             //
             // Shadow
             //

             var $shadow = angular.element('<div class="mr-shadow">');

             var $shadowLeft         = angular.element('<div class="mr-shadow left">');
             var $shadowCenterTop    = angular.element('<div class="mr-shadow center top">');
             var $shadowCenterBottom = angular.element('<div class="mr-shadow center bottom">');
             var $shadowRight        = angular.element('<div class="mr-shadow right">');

             $shadow.append($shadowLeft).append($shadowCenterTop).append($shadowCenterBottom).append($shadowRight);
             element.append($shadow);

             function updateShadow(position, width, height) {
                 $shadow.css('display', 'block');

                 $shadowLeft.css('right', width - position.left  + 'px');
                 $shadowRight.css('left', width - position.right + 'px');

                 $shadowCenterTop.css('left',   position.left  + 'px');
                 $shadowCenterTop.css('right',  position.right + 'px');
                 $shadowCenterTop.css('bottom', height - position.top + 'px');

                 $shadowCenterBottom.css('left',  position.left  + 'px');
                 $shadowCenterBottom.css('right', position.right + 'px');
                 $shadowCenterBottom.css('top',   height - position.bottom + 'px');
             }

             //
             // User select
             //

             function enableUserSelect() {
                 $document[0].documentElement.className = $document[0].documentElement.className.replace(' mr-user-select', '');
             }

             function disableUserSelect() {
                 videoService.mouseDown=true;
                 $document[0].documentElement.className += ' mr-user-select';
             }

             //
             // Drawing
             //

             var click = false, centerX, centerY;

             element.bind('mousedown', onDrawingDown);

         /*    element.bind('mousedown',  toggleMouse);*/

             element.bind('mouseup', toggleMouse
             );

          function   toggleMouse(){

                  videoService.mouseDown=false;

          }
             function bindDrawing() {
                 $document.bind('mousemove', onDrawingMove);
                 $document.bind('mouseup', onDrawingUp);
             }

             function unbindDrawing() {
                 $document.unbind('mousemove', onDrawingMove);
                 $document.unbind('mouseup', onDrawingUp);
             }

             function onDrawingDown(event) {
                 disableUserSelect();
                 // pageX and pageY are absolutes (relative to document), transform to relative to parent
                 var position = offset(element); // offset() absolutes coordinates relative to document
                 centerX = event.pageX - position.left;
                 centerY = event.pageY - position.top;
                 click = true;
                 bindDrawing();
             }

             function onDrawingMove(event) {
                 click = false;
                 var position = offset(element);
                 var currentX = event.pageX - position.left;
                 var currentY = event.pageY - position.top;
                 scope.$apply(function () {
                     update(centerX, centerY, currentX, currentY);
                 });
             }

             function onDrawingUp(event,videoService) {

                 enableUserSelect();
                 if (click) {
                     scope.$apply(clear);
                 }
                 unbindDrawing();
             }

             function update(x1, y1, x2, y2, apply) {
                 var height = element.parent().height();
                 var width  = element.parent().width();

                 // Cap values to bounds
                 x2 = x2 < 0 ? 0 : x2;
                 x2 = x2 > width ? width : x2;
                 y2 = y2 < 0 ? 0 : y2;
                 y2 = y2 > height ? height : y2;

                 var position = {
                     top: y1 < y2 ? y1 : y2,
                     bottom: y2 > y1 ? height - y2 : height - y1,
                     left: x1 < x2 ? x1 : x2,
                     right: x2 > x1 ? width - x2 : width - x1
                 };

                 updateRect(position, width, height);
             }

             //
             // Resize and moving variables
             //

             var startX, startY, rectPosition, type;

             //
             // Resize
             //

             $lines.bind('mousedown', onResizeDown);
             $handles.bind('mousedown', onResizeDown);

             function bindResize() {
                 $document.bind('mousemove', onResizeMove);
                 $document.bind('mouseup', onResizeUp);
             }

             function unbindResize() {
                 $document.unbind('mousemove', onResizeMove);
                 $document.unbind('mouseup', onResizeUp);
             }

             function onResizeDown(event) {
                 event.stopPropagation();
                 disableUserSelect();
                 type = angular.element(event.target).attr('class').replace('mr-drag-handle', '').replace('mr-drag-line', '').trim();
                 startX = event.pageX;
                 startY = event.pageY;

                 rectPosition = {
                     top:    parseInt($rect.css('top')),
                     bottom: parseInt($rect.css('bottom')),
                     left:   parseInt($rect.css('left')),
                     right:  parseInt($rect.css('right'))
                 };

                 bindResize();
             }

             function onResizeMove(event) {
                 var height = element.parent().height();
                 var width  = element.parent().width();

                 // The difference (delta) is the same to all coordinates, relatives and absolutes
                 var diffX = event.pageX - startX;
                 var diffY = event.pageY - startY;

                 var position = {
                     top:    rectPosition.top,
                     bottom: rectPosition.bottom,
                     left:   rectPosition.left,
                     right:  rectPosition.right
                 };

                 // nw n ne
                 // w    e
                 // sw s se

                 if (type[0] == 'n') {
                     position.top += diffY;
                 }
                 else if (type[0] == 's') {
                     position.bottom -= diffY;
                 }
                 if (type[0] == 'w' || type[1] == 'w') {
                     position.left += diffX;
                 }
                 else if (type[0] == 'e' || type[1] == 'e') {
                     position.right -= diffX;
                 }

                 var aux;

                 if (position.top >= height - position.bottom || position.bottom >= height - position.top) {
                     aux = position.top;
                     position.top = height - position.bottom;
                     position.bottom = height - aux;
                 }

                 if (position.left >= width - position.right || position.right >= width - position.left) {
                     aux = position.left;
                     position.left = width - position.right;
                     position.right = width - aux;
                 }

                 position.top    = position.top    < 0 ?  0 : position.top;
                 position.bottom = position.bottom < 0 ?  0 : position.bottom;
                 position.left   = position.left   < 0 ?  0 : position.left;
                 position.right  = position.right  < 0 ?  0 : position.right;

                 if (aspectRatio) {
                     if (type == 'n') {
                         position.left = width - (position.right + (height - position.top - position.bottom) * aspectRatio);
                     }
                     if (type == 's') {
                         position.right = width - (position.left + (height - position.top - position.bottom) * aspectRatio);
                     }
                     if (type == 'w' || type == 'nw' || type == 'ne') {
                         position.top = height - (position.bottom + (width - position.left - position.right) / aspectRatio);

                         if (position.top < 0) {
                             position.top = 0;

                             if (type[0] == 'w' || type[1] == 'w') {
                                 position.left = width - (position.right + (height - position.top - position.bottom) * aspectRatio);
                             }
                             else {
                                 position.right = width - (position.left + (height - position.top - position.bottom) * aspectRatio);
                             }
                         }
                     }
                     if (type == 'e' || type == 'se' || type == 'sw') {
                         position.bottom = height - (position.top + (width - position.left - position.right) / aspectRatio);

                         if (position.bottom < 0) {
                             position.bottom = 0;

                             if (type[0] == 'e' || type[1] == 'e') {
                                 position.right = width - (position.left + (height - position.top - position.bottom) * aspectRatio);
                             }
                             else {
                                 position.left = width - (position.right + (height - position.top - position.bottom) * aspectRatio);
                             }
                         }
                     }
                 }

                 scope.$apply(function () {
                     updateRect(position, width, height);
                 });
             }

             function onResizeUp(event) {
                 enableUserSelect();
                 unbindResize();
             }

             //
             // Moving
             //

             $rect.bind('mousedown', onMovingDown);

             function bindMoving() {
                 $document.bind('mousemove', onMovingMove);
                 $document.bind('mouseup', onMovingUp);
             }

             function unbindMoving() {
                 $document.unbind('mousemove', onMovingMove);
                 $document.unbind('mouseup', onMovingUp);
             }

             function onMovingDown(event) {
                 event.stopPropagation();
                 disableUserSelect();
                 startX = event.pageX;
                 startY = event.pageY;

                 rectPosition = {
                     top:    parseInt($rect.css('top')),
                     bottom: parseInt($rect.css('bottom')),
                     left:   parseInt($rect.css('left')),
                     right:  parseInt($rect.css('right'))
                 };

                 bindMoving();
             }

             function onMovingMove(event) {
                 var height = element.parent().height();
                 var width  =  element.parent().width();

                 // The difference (delta) is the same to all coordinates, relatives and absolutes
                 var diffX = event.pageX - startX;
                 var diffY = event.pageY - startY;

                 // Position is relative to parent
                 var position = {
                     top:    rectPosition.top    + diffY,
                     bottom: rectPosition.bottom - diffY,
                     left:   rectPosition.left   + diffX,
                     right:  rectPosition.right  - diffX
                 };

                 if (position.top < 0) {
                     position.bottom = position.bottom + position.top;
                     position.top = 0;
                 }

                 if (position.bottom < 0) {
                     position.top = position.bottom + position.top;
                     position.bottom = 0;
                 }

                 if (position.left < 0) {
                     position.right = position.right + position.left;
                     position.left = 0;
                 }

                 if (position.right < 0) {
                     position.left = position.left + position.right;
                     position.right = 0;
                 }

                 scope.$apply(function () {
                     updateRect(position, width, height);
                 });
             }

             function onMovingUp(event) {
                 enableUserSelect();
                 unbindMoving();
             }

             function updateRect(position, width, height, apply) {
                 if (!position) {
                     return;
                 }

                 if (aspectRatio) {
                     if (centerX > position.left) {
                         position.left = width - (position.right + (height - position.top - position.bottom) * aspectRatio);
                     }
                     else {
                         position.right = width - (position.left + (height - position.top - position.bottom) * aspectRatio);
                     }

                     if (position.top < 0) {
                         position.top = 0;

                         position.left = width - (position.right + (height - position.top - position.bottom) * aspectRatio);
                     }
                     if (position.bottom < 0) {
                         position.bottom = 0;

                         position.right = width - (position.left + (height - position.top - position.bottom) * aspectRatio);
                     }
                     if (position.left < 0) {
                         position.left = 0;

                         position.top = height - (position.bottom + (width - position.left - position.right) / aspectRatio);
                     }
                     if (position.right < 0) {
                         position.right = 0;

                         position.bottom = height - (position.top + (width - position.left - position.right) / aspectRatio);
                     }
                 }

                 updateShadow(position, width, height);

                 $rect.css('display', 'block');

                 $rect.css({
                     top:    position.top    + 'px',
                     bottom: position.bottom + 'px',
                     left:   position.left   + 'px',
                     right:  position.right  + 'px'
                 });

                 selectorWatch();

                 selector.x1 = position.left;
                 selector.y1 = position.top;
                 selector.x2 = width - position.right;
                 selector.y2 = height - position.bottom;

                 selectorWatch = scope.$watch('selector', updateSelector, true);
             }

             //
             // Selector
             //

             var binded = true;

             function bind() {
                 if (binded) {
                     return;
                 }
                 element.bind('mousedown', onDrawingDown);
                 $lines.bind('mousedown', onResizeDown);
                 $handles.bind('mousedown', onResizeDown);
                 $rect.bind('mousedown', onMovingDown);
                 binded = true;
             }

             function unbind() {
                 if (!binded) {
                     return;
                 }
                 element.unbind('mousedown', onDrawingDown);
                 $lines.unbind('mousedown', onResizeDown);
                 $handles.unbind('mousedown', onResizeDown);
                 $rect.unbind('mousedown', onMovingDown);
                 binded = false;
             }

             selector.clear = clear;
             selector.enabled = typeof selector.enabled !== 'boolean' ? true : selector.enabled;

             var selectorWatch = scope.$watch('selector', updateSelector, true);

             function clear() {
                 selector.x1 = selector.x2 = selector.y1 = selector.y2 = undefined;
                 $rect.css('display', 'none');
                 $shadow.css('display', 'none');
             }

             function isPositionUndefined() {
                 return angular.isUndefined(selector.x1) && angular.isUndefined(selector.x2)
                     && angular.isUndefined(selector.y1) && angular.isUndefined(selector.y2);
             }

             function isPositionFinite() {
                 return isFinite(selector.x1) && isFinite(selector.x2) && isFinite(selector.y1) && isFinite(selector.y2);
             }
            selector.updateSelector=updateSelector;
             function updateSelector(selector, old) {
                 // To avoid when watch is created
                 updateSelectorEnabled(selector.enabled);
                 if (angular.equals(selector, old) || selector.enabled != old.enabled) {
                     return;
                 }
                 if (isPositionUndefined()) {
                     return;
                 }
                 if (!isPositionFinite()) {
                     console.error('[ERROR]: Selector position value (x1, x2, y1, y2) is not a valid number.');
                     return;
                 }
                 update(selector.x1, selector.y1, selector.x2, selector.y2);
             }

             function updateSelectorEnabled(enabled) {
                 selector.enabled = typeof enabled !== 'boolean' ? true : enabled;

                 if (selector.enabled && isPositionFinite()){
                     bind();
                     element.css('z-index', 300);
                     $rect.css('display', 'block');
                     $shadow.css('display', 'block');
                 }
                 else if (selector.enabled) {
                     bind();
                     element.css('z-index', 300);
                     clear();
                 }
                 else {
                     unbind();
                     element.css('z-index', 100);
                     $rect.css('display', 'none');
                     $shadow.css('display', 'none');
                 }
             }

             //
             // Crop
             //

             selector.crop = crop;

             function crop(videoel) {


                        var tempCanv=document.createElement('canvas');
                        var tempContext = tempCanv.getContext('2d');
                        tempCanv.width = videoService.API.mediaElement.width();
                        tempCanv.height = videoService.API.mediaElement.height();
                        tempContext.drawImage(videoel,0,0,tempCanv.width,tempCanv.height);
                        var scale = 1; // scope.$parent.scale*!;
                        var width = (selector.x2 - selector.x1) * scale;
                        var height = (selector.y2 - selector.y1) * scale;
                 /*   canvas.width = width;
                 canvas.height = height;*/
                  /*      var canvas = document.getElementById('destCanvas');
                        canvas.width=width;
                        canvas.height = height;*/
                        var context = canvas.getContext('2d');
                        context.width=videoService.API.mediaElement.width();
                        context.height=videoService.API.mediaElement.height();
                        context.clearRect(0, 0, tempCanv.width, tempCanv.height);
                        var video=videoService.API.mediaElement[0];
                        context.drawImage(tempCanv, selector.x1 * scale, selector.y1 * scale, width, height, 0, 0, width, height);
                 //return canvas.toDataURL('image/png');
             }

         }
    };
}]);



VelocityModule.config(function(deepQLearnServiceProvider){

    deepQLearnServiceProvider.numberInputs(27).numberActions(5);

});

/* Init global settings and run the app */
VelocityModule.run(["$rootScope",  "Idle","convnetService","recurrentRService",function($rootScope,Idle,convnetService,recurrentRService) {
    convnetService.convnet();
    recurrentRService.R();

 //   Idle.watch();

}]);