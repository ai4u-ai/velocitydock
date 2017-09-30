'use strict';

MetronicApp.controller('ExampleCtrl', ['$scope', 'Fabric', 'FabricConstants', 'Keypress', function($scope, Fabric, FabricConstants, Keypress) {

    $scope.fabric = {};
    $scope.FabricConstants = FabricConstants;

    //
    // Creating Canvas Objects
    // ================================================================
    $scope.addShape = function(path) {
        $scope.fabric.addShape('http://fabricjs.com/assets/15.svg');
    };

    $scope.addImage = function(image) {
        $scope.fabric.addImage('assets/admin/pages/media/gallery/image4.jpg');
    };

    $scope.addImageUpload = function(data) {
        var obj = angular.fromJson(data);
        $scope.addImage(obj.filename);
    };

    //
    // Editing Canvas Size
    // ================================================================
    $scope.selectCanvas = function() {
        $scope.canvasCopy = {
            width: $scope.fabric.canvasOriginalWidth,
            height: $scope.fabric.canvasOriginalHeight
        };
    };

    $scope.setCanvasSize = function() {
        $scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
        $scope.fabric.setDirty(true);
        delete $scope.canvasCopy;
    };

    //
    // Init
    // ================================================================
    $scope.init = function() {
        $scope.fabric = new Fabric({
            JSONExportProperties: FabricConstants.JSONExportProperties,
            textDefaults: FabricConstants.textDefaults,
            shapeDefaults: FabricConstants.shapeDefaults,
            json: {}
        });
    };

    $scope.$on('canvas:created', $scope.init);

    Keypress.onSave(function() {
        $scope.updatePage();
    });

}]);
MetronicApp.controller('VideoController',
    ["$sce", function ($sce) {
        this.config = {
            preload: "none",
            sources: [
                {src:"js/data/archery.mp4", type: "video/mp4"},
                {src: "js/data/BabyCrawling_g05_c03.mp4", type: "video/mp4"},
                {src: "js/data/v_BabyCrawling_g01_c03.mp4", type: "video/mp4"},
                {src: "js/data/v_Biking_g01_c03.mp4", type: "video/mp4"}
            ],
            theme: {
                url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
            },
            plugins: {
                poster: "http://www.videogular.com/assets/images/videogular.png",
                analytics: {
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
                }
            }
        };
    }]
);

    MetronicApp.controller('VideoEditorController', function( AuthService,$rootScope, $scope, API_ENDPOINT,$http, $timeout,$analytics, Idle, deepQLearnService,$cookies,$cookieStore,$sce,videoService,algoService,$modal,annotationService) {

        //VIDEO GULAR

        $scope.videoService=videoService;
        $scope.annotationService=annotationService;

        $scope.algoService=algoService;
        $scope.classes=[];
        $scope.tempClassCollection={};
        $scope.tempClassCollection.classes=[{number:0,name:'Fill in'},{number:1,name:'Fill in'}];
        $scope.tempClassCollection.name="Fill in Name";
        $scope.addTempClass=function(){
            $scope.tempClassCollection.classes.push({number: $scope.tempClassCollection.classes.length+1,name:'Fill in'});
        };
        $scope.addClass=function(){
            $scope.getSelectedClasses().classes.push({number: $scope.tempClassCollection.classes.length+1,name:'Fill in'});
        };

    $scope.selectedClasses={};
        $scope.selectedClass={};


        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

        };
        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
       $scope.loadClassesInit= function(){  $http.get(
            API_ENDPOINT.url+'/classes/get',config

        ).then(angular.bind(this,function(response) {
                console.log('in controller'+response.data);
                /* var json = JSON.parse(response.data.json);
                 net = new convnetjs.Net();*/
                if(response.data!=null){
                    $scope.classes=   response.data;
                    $scope.selectedClasses= $scope.classes[0];
                    $scope.selectedClass=$scope.selectedClasses.classes[0];
                    annotationService.selectedClass=   $scope.selectedClass;

                }

                //return response.data;
            }));
        };
        $scope.loadClassesInit();
       $scope.setSelectedClasses=function(index){

           $scope.selectedClasses=$scope.classes[index];

        };
        $scope.getSelectedClasses=function(){

            return   $scope.selectedClasses;
        };

        $scope.addClasses=function(){

            $scope.selectedClasses.classes.push({number:  $scope.selectedClasses.classes.length,name:'Fill in'});


        };

        $scope.deleteClass=function(index){

            $scope.classes.splice(index,1);
            $scope.classes.join();

        },
        $scope.setSelectedClass=function(index){

            $scope.selectedClass=$scope.selectedClasses.classes[index];
            annotationService.setSelectedClass( $scope.selectedClass)
        };
        $scope.getClasses=function(){

            return $scope.classes;
        };
        $scope.getSelectedClass=function(){

           return $scope.selectedClass;
        },

       $scope.saveClasses=function(classCollection){
            var data ={
                classes:classCollection,
                _id:classCollection._id

            };
            $http({
                url:API_ENDPOINT.url+ '/classes/save',
                method: "POST",
                data: data,
                headers: {'Content-Type': 'application/json'}}).then(function(response)
            {
                console.log('success')
           /*    $scope.setSelectedClasses(  $scope.classes.length-1);
               $scope.classes.push(classCollection);*/
                $scope.loadClassesInit();
                $scope.tempClassCollection={};
                $scope.tempClassCollection.classes=[{number:0,name:'Fill in'},{number:1,name:'Fill in'}];
                $scope.tempClassCollection.name="Fill in Name";
            })   // success
                .catch(function() {console.log('error')});

        };

        /*    $scope.$on('$destroy', function( event ) {
            $localStorage.left = 'toda';
            window.localStorage.setItem("left", new Date());
            if (! $localStorage.left) {
                event.preventDefault();
            }
        });*/
        function buildRectangle() {
            return {startX: 10,
                startY: 10,
                sizeX: 100,
                sizeY: 100,
                name: 'rect'
            };
        };
        algoService.loadMyAlgoritms();
        $scope.image = {
            src: 'assets/admin/pages/media/gallery/image4.jpg',
            maxWidth: 938
        };
        // Must be [x, y, x2, y2, w, h]
        $scope.image.coords = [100, 100, 200, 200, 100, 100];

        // You can add a thumbnail if you want
        $scope.image.thumbnail = true;
        $scope.selector = {};
        $scope.selection={};

        $scope.drawer = [
            { x1: 625, y1: 154, x2: 777, y2: 906, color: '#337ab7', stroke: 1 },
            { x1: 778, y1: 154, x2: 924, y2: 906, color: '#3c763d', stroke: 1 },
            { x1: 172, y1: 566, x2: 624, y2: 801, color: '#a94442', stroke: 1 }
        ];

        $scope.addRect = function () {
            $scope.drawer.push({
                x1: $scope.selector.x1,
                y1: $scope.selector.y1,
                x2: $scope.selector.x2,
                y2: $scope.selector.y2,
                color: '#337ab7',
                stroke: 1
            });
            $scope.selector.clear();
        };

        $scope.cropRect = function () {
            $scope.cropResult = $scope.selector.crop();
        };

        // List of rectangles
        $scope.rectangles = [];

        // Create shapes
        for (var i = 0; i < 2; i++) {
            $scope.rectangles.push( buildRectangle() );
        }

        $scope.$on('$viewContentLoaded', function() {



        // initialize core components
        // emit event track (without properties)
        var someSessionObj = { 'innerObj' : 'somesessioncookievalue'};
      //  $scope.inviewService=inviewService;
        $cookies.dotobject = someSessionObj;
        $scope.usingCookies = { 'cookies.dotobject' : $cookies.dotobject, "cookieStore.get" : $cookieStore.get('dotobject') };

        $cookieStore.put('obj', someSessionObj);
        $scope.usingCookieStore = { "cookieStore.get" : $cookieStore.get('obj'), 'cookies.dotobject' : $cookies.obj, };

            $scope.slider = {
                minValue: 100,
                maxValue: 400,
                options: {
                    floor: 0,
                    ceil: 500,
                    translate: function(value) {
                        return '$' + value;
                    }
                }
            };

            var actions =[1,2,3];
           // var brain=new deepqlearn.Brain(1, 3)
            var action;
         //   $analytics.eventTrack( );

            // emit event track (with category and label properties for GA)
          /*  $analytics.eventTrack('eventName', {
                category: 'category', label: 'label'
            });*/
            Metronic.initAjax();

         /*   $scope.events = [];*/
          /*  $scope.idle = 5;
            $scope.timeout = 5;*/

           /* $scope.$on('IdleStart', function() {
                addEvent({event: 'IdleStart', date: new Date()});
                $analytics.eventTrack('IdleStart', {event: 'IdleStart', date: new Date()});
               action= deepQLearnService.forward(1);
                console.log(action);
                if(action=1){

                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });
            $scope.$on('IdleEnd', function() {
                addEvent({event: 'IdleEnd', date: new Date()});
                $analytics.eventTrack('IdleEnd', {event: 'IdleEnd', date: new Date()});
                action= deepQLearnService.forward(2);
                console.log(action);
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }

            });
            $scope.$on('IdleWarn', function(e, countdown) {
                addEvent({event: 'IdleWarn', date: new Date(), countdown: countdown});
                $analytics.eventTrack('IdleWarn', {event: 'IdleWarn', date: new Date()});
                action= deepQLearnService.forward(3);
                console.log(action);
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });
            $scope.$on('IdleTimeout', function() {
                addEvent({event: 'IdleTimeout', date: new Date()});
                $analytics.eventTrack('IdleTimeout', {event: 'IdleTimeout', date: new Date()});
                action= deepQLearnService.forward(4);
                console.log(action);
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });
            $scope.$on('Keepalive', function() {
                addEvent({event: 'Keepalive', date: new Date()});
                $analytics.eventTrack('Keepalive', {event: 'Keepalive', date: new Date()});
                action= deepQLearnService.forward(5);
                console.log(action);
              // deepQLearnService.savenet();
                if(action=1){
                    deepQLearnService.backward(1);
                    $scope.reset();
                }else{
                    deepQLearnService.backward(0);
                }
            });*/
          /*  function addEvent(evt) {
                $scope.$evalAsync(function() {
                    $scope.events.push(evt);
                })
            }*/

           /* $scope.reset = function() {
                Idle.watch();
            }
            $scope.$watch('idle', function(value) {
                if (value !== null) Idle.setIdle(value);
            });
            $scope.$watch('timeout', function(value) {
                if (value !== null) Idle.setTimeout(value);
            });*/


    });
});
