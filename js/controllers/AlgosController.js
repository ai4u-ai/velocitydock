/**
 * Created by jacobiv on 10/10/2016.
*/
MetronicApp.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
MetronicApp.controller('AlgosController',function ($scope, API_ENDPOINT,AuthService,$http,$location,FileUploader,$filter,$interval) {

    $scope.flask_api=API_ENDPOINT.flask_api
    $scope.current_host=API_ENDPOINT.current_host

// anotations
    $scope.annotations=[];
    $scope.selectedAnnotation=[];
    $scope.selectAnnotation=function(item){
        $scope.selectedAnnotation=item;
    };
    $scope.loadAnnotations = function () {
        $scope.mediafiles=[];
        $http.get('/api/anotations/loadAll').success(function (data) {



            $scope.annotations= data.map(function(obj){
                $scope.mediafiles.push(obj.annotatedOnMedia.name);
                return {_id:obj._id,media_name:obj.annotatedOnMedia.name,uploadedBy:obj.uploadedBy,annotation:obj.annotation,mediaFile:{src:API_ENDPOINT.url+'/stream/video/'+obj.annotatedOnMedia.media.id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4"}}

            });
           // $scope.select(0);
            $scope.mediafiles=Array.from(new Set($scope.mediafiles))
            $scope.mediafiles.unshift('all');
            $scope.selectedMedia= $scope.mediafiles[0]

        });
    };
    $scope.groupByMedia = function (media) {
        $scope.selectedMedia=media;

    }

    $scope.$on('$destroy',function(){
        $interval.cancel($scope.promise);
    });

    $scope.startInterval=function (interval) {
        $scope.promise = $interval($scope.updateTraining, interval);

    };
    $scope.endInterval=function(){
        $interval.cancel($scope.promise);
        $scope.promise = undefined;
    }
    $scope.getDuration = function(start, end) {
        try {
            var  duration='';
            if(!(start===undefined ||end===undefined)){
                duration=new Date(new Date(end)-new Date(start));

            }

            return duration;
        } catch (e) {
            return "Cant evaluate"
        }
    };
    $scope.updateTraining=function () {

        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            training:$scope.stats.selectedTraining._id

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.get('/api/refreshtraining/',config).success(function (data, status, headers) {


            if(data.training!=undefined){
                $scope.training=data.training;
                $scope.stats.selectedTraining=data.training;

                $scope.updateChart($scope.stats.selectedTraining)
                console.log('updating')
                if ($scope.stats.selectedTraining.status=='end'){
                    $scope.endInterval()
                }
                if($scope.training.endDate!=undefined){
                    $scope.stats.selectedTraining=data.training;
                    $scope.training.endDate=new Date();


                }
            }

            //if($scope.training.status='end');$scope.endInterval();

            /*.map(function (annotation) {
             annotation.filteredframe.image= 'data:image/jpeg;base64,'+annotation.filteredframe.image;
             return annotation
             });*/
            //$scope.selected= data.algo;
            //      if( !$scope.selected.annotations) $scope.selected.annotations=[];
            /* $scope.loadDependencies();
             $scope.selected.model=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model});
             $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
             $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
             */
        });


    };

  $scope.training={};

    $scope.deployModel=function () 
    {
        console.log('calling deploymodel')
        var data = {

            endModel:$scope.selected.selectedTraining.endModel._id,
            algo:$scope.selected._id,
            apipath:$scope.selected.apipath,
            name:$scope.selected.name


        };
        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}


        };


        $http.post('/api/deploymodel/',config).success(function (data) {

         
            // $scope.select(0);

        });
    };
    $scope.getTrainings=function ()
    {
        $scope.trainings=[]
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            algo:$scope.selected._id,

        };
        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}


        };


        $http.get('/api/get/trainings',config).success(function (data) {

                $scope.trainings=data.trainings;
                if ($scope.trainings.size>0){
                    $scope.selected.selectedTraining=data.trainings[0];
                    stats.selectedTraining=data.trainings[0];
                }

            // $scope.select(0);

        });
    };
    $scope.track = function() {
        $timeout(function() {
            $scope.value++;
            poll();
        }, 1000);
    };
    $scope.trainModel=function () {
     var modelId=0
     var retrain=false;
     $scope.conversionSettings.classMode=$scope.class_mode.selected;
     if( $scope.selected.selectedModelToTrain !=undefined)
     {
         modelId = $scope.selected.selectedModelToTrain.endModel._id;
         $scope.conversionSettings.image_width=$scope.selected.selectedModelToTrain.conversionSettings.image_width;
         $scope.conversionSettings.image_height=$scope.selected.selectedModelToTrain.conversionSettings.image_height;

     }



     var data = {
         epochs:$scope.trainingEpochs,
         steps:$scope.trainingSteps,
         trainingMode:$scope.training_mode.selected,
         conversionSettings:$scope.conversionSettings,

         dataset:$scope.selected.selectedDataSet._id ,
         model:modelId,
         algo:$scope.selected,

         name:$scope.selected.name,
         version:$scope.selected.version

     };

        if ($scope.selected.selectedModelToTrain!=undefined){
            data.startFromPrevTraining=$scope.selected.selectedModelToTrain._id
        }
     var config = {
         params: data,
         headers : {'Content-Type': 'application/json'}


     };


     $http.post('/api/trainmodel/',config).success(function (data) {

            $scope.training=data.training
            $scope.getTrainings()

            $scope.startInterval(5000)

         // $scope.select(0);

     });
 };

    //Media

    $scope.api={};
    $scope.config = {
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
    $scope.onPlayerReady=function(api){
        console.log(api);
        $scope.api=api;
    };
    $scope.selected={};
    //Create New Algo

    $scope.trainingSteps=10;
    $scope.trainingEpochs=10;
    $scope.sources=[];
    $scope.loadMedia = function () {
        $http.get('/api/load/allmedia').success(function (data) {

            $scope.media=data;
            var media= $scope.media[0];
            var method=media.filePath == undefined ? '/stream/video/' : '/stream/video/frompath/';
            var id=media.filePath == undefined ? media.media.id : media.filePath;
            var mediaFile={src:API_ENDPOINT.url+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4" ,title:media.name}



            if(  $scope.api.mediaElement!=undefined)            $scope.api.mediaElement[0].src=mediaFile.src;


        });
    };
    $scope.conversionSettings={dest_path:'tmp',image_width:300,image_height:300,test_train_split:0.8
    }

    $scope.getDestPath=function(){
            $scope.conversionSettings.dest_path='models/'+$filter('lowercase') ($scope.getUser().userName)+ "/"+ $filter('lowercase')($filter('removeSpaces')($scope.selected.name))
            return 'models/'+$filter('lowercase') ($scope.getUser().userName)+ "/"+ $filter('lowercase')($filter('removeSpaces')($scope.selected.name))
    }

    $scope.algos=[]
    $scope.createAlgo=function(){
        $scope.selectedStep=0;


        $scope.selected={};

        $scope.algos.unshift($scope.selected);
        $scope.selected.selectedDataSet={};
        $scope.selectedAnnotation=[];
        $scope.conversionSettings={dest_path:'tmp',image_width:300,image_height:300,test_train_split:0.8};
        $scope.getDestPath();


    };
    $scope.selectMedia=function(index){
        $scope.selectedMedia= $scope.media[index];
        $scope.selected.media=$scope.media[index];
        var media=$scope.media[index];

        var method=media.filePath ==undefined ? '/stream/video/' : '/stream/video/frompath'
        var id=media.filePath == undefined ? media.media.id : '';
        var mediaFile={src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+media.filePath+'&'+'type='+"video/mp4",type: "video/mp4" ,title:media.name};

        $scope.api.mediaElement[0].src=mediaFile.src;
    };

    //$scope.loadMedia();






    $scope.selectedAlgoModel={};




    $scope.delete=[];

    $scope.dropCallback = function(event, index, item, external, type, allowedType) {

            if($scope.selected.dependencies!=undefined){
                if(!($scope.selected.dependencies.filter(function(d){if(d._id===item._id) return d})[0]===undefined)) return false;
            }else{
                $scope.selected.dependencies=[];
            }
                    return item;
    };
    $scope.dropCallbackAnnotations=function(event, index, item, external, type, allowedType) {

        if($scope.selected.annotations!=undefined){
           if(!($scope.selected.annotations.filter(function(d){if(d._id===item._id) return d})[0]===undefined)) return false;
        }else{
           $scope.selected.annotations=[];
        }
        return item;
    };
    $scope.dropCallbackDependencies = function(event, index, item, external, type, allowedType) {


        return false;
    };
/*$scope.$watchCollection('selectedDependencies',function (newC,oldC) {
        $scope.selected.dependencies=newC.map(function(d){return d._id});

});*/
    $scope.removeFromSelectedDep=function (index) {
        if($scope.dependencies.filter(function(d){if(d._id===$scope.selected.dependencies[index]._id) return d}).length===0){
            $scope.dependencies.push($scope.selected.dependencies[index]);
        }

        $scope.selected.dependencies.splice(index,1);
    };
    $scope.removeFromSelectedAnn=function (index) {
        if($scope.annotations.filter(function(d){if(d._id===$scope.selected.annotations[index]._id) return d}).length===0){
            $scope.annotations.push($scope.selected.annotations[index]);
        }

        $scope.selected.annotations.splice(index,1);
    };


    $scope.models=[];
    $scope.selectModel=function(model){
        $scope.selectedAlgoModel= model;
        $scope.selected.model=$scope.selectedAlgoModel;
        $scope.getTrainings();
    };
    $scope.loadModels = function () {
        $http.get('/api/load/algomodels').success(function (data) {

            $scope.models=data;


        });
    };




    $scope.selected={};


    $scope.loadAlgos = function () {
        $http.get('/api/load/algos').success(function (data) {

           /* $scope.algos=data.map(function(selected){
               selected.model=($scope.models.filter(function(model){if (model._id=== selected.model) return model}));
               selected.dependencies=$scope.dependencies.filter(function(dependency){if (selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
                //$scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
                return selected;
            });
*/
           $scope.algos=data;
            if( $scope.algos.length>0){

                $scope.selected= $scope.algos[0];
             //   if( $scope.selected.annotations===undefined) $scope.selected.annotations=[];
             //   if( $scope.selected.dependencies===undefined) $scope.selected.dependencies=[];
                $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
                $scope.dest_path=$scope.getDestPath()
                $scope.algotype.selected=$scope.selected.algoType;
                $scope.training_mode.selected=$scope.training_modes[0]

            }else{
                $scope.selected={};
                $scope.selected.annotations=[];
                $scope.selected.dependencies=[];
                $scope.algos.push( $scope.selected)
                $scope.dest_path=$scope.getDestPath()
                $scope.training_mode.selected=$scope.training_modes[0]

            }

            $scope.getTrainings();

        });
    };

    $scope.algotype=["ssd_mobilenet_v1_coco", "ssd_mobilenet_v1_0.75_depth_coco", "ssd_mobilenet_v1_quantized_coco", "ssd_mobilenet_v1_0.75_depth_quantized_coco", "ssd_mobilenet_v1_ppn_coco", "ssd_mobilenet_v1_fpn_coco", "ssd_resnet_50_fpn_coco", "ssd_mobilenet_v2_coco", "ssd_mobilenet_v2_quantized_coco", "ssdlite_mobilenet_v2_coco", "ssd_inception_v2_coco", "faster_rcnn_inception_v2_coco", "faster_rcnn_resnet50_coco", "faster_rcnn_resnet50_lowproposals_coco", "rfcn_resnet101_coco", "faster_rcnn_resnet101_coco", "faster_rcnn_resnet101_lowproposals_coco", "faster_rcnn_inception_resnet_v2_atrous_coco", "faster_rcnn_inception_resnet_v2_atrous_lowproposals_coco", "faster_rcnn_nas", "faster_rcnn_nas_lowproposals_coco", "mask_rcnn_inception_resnet_v2_atrous_coco", "mask_rcnn_inception_v2_coco", "mask_rcnn_resnet101_atrous_coco", "mask_rcnn_resnet50_atrous_coco",
        'Inception V3',
        'Xception',
                'VGG16',
                'VGG19'	,
                'ResNet50',
                        'ResNet101','ResNet152'	,
   'ResNet50V2'	,
   'ResNet101V2'	,
   'ResNet152V2'	,

   'InceptionV3'	,
   'InceptionResNetV2'	,
   'MobileNet'	,
   'MobileNetV2'	,
   'DenseNet121'	,
   'DenseNet169'	,
   'DenseNet201'	,
   'NASNetMobile'	,
   'NASNetLarge'	]







    ;
    $scope.training_modes=['Transfer Learning','From Scratch',];
    $scope.class_modes=['categorical','binary','input'];
    $scope.class_mode={}
    $scope.class_mode.selected= $scope.class_modes[0]
    $scope.algotype.selected=$scope.algotype[0]
    $scope.training_mode={};
    $scope.training_mode.selected=$scope.training_modes[0]
    $scope.onSelectedMode=function(mode){
        $scope.algotype.selected=mode;
        $scope.selected.algoType=mode;
    };
    $scope.dependencies=[];
    $scope.annotations=[];
    $scope.loadDependencies = function () {
        $http.get('/api/dependencies/get').success(function (data) {

            $scope.dependencies=data;


        });
    };

    $scope.selectedStep=0;
    //$scope.loadDependencies();
    //$scope.loadModels();
    $scope.loadAlgos();

    $scope.selectStep= function(step){
      $scope.selectedStep=step;
      $scope.getDestPath();
      $scope.saveAlgo()
        $scope.getTrainings()



    };
    $scope.algoTypeSelected=function(type){
      $scope.selected.algoType=type;
    };
    $scope.previousTrainingSelected=function(item){
        $scope.conversionSettings.image_width=item.conversionSettings.image_width;
        $scope.conversionSettings.image_height=item.conversionSettings.image_height;
        $scope.algotype.selected=item.algoType;
    };
    $scope.removeOne=function(id){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            id:id
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/algo/delete/' ,config).success(function (data, status, headers) {
            $scope.algos.splice($scope.algos.indexOf($scope.selected), 1);
            $scope.loadAlgos();
            $scope.selected= $scope.algos[index];
            if( !$scope.selected.annotations) $scope.selected.annotations=[];

        });


    };
    $scope.selected.selectedTraining;
    $scope.selected.selectedModelToTrain;
    $scope.saveAndPublish=function () {
       $scope.selected.status='Awaiting Validation';
        $scope.saveAlgo();
        $scope.deployModel();
    };
    $scope.saveAlgo=function()
    {
        var algo=Object.assign({},$scope.selected);
        if(algo.dependencies!=undefined){
            algo.dependencies=algo.dependencies.map(function(d){return d._id});
        };

        if(algo.annotations!=undefined){
            algo.annotations=algo.annotations.map(function(d){return d._id});
        };
        algo.apipath=$filter('lowercase')($scope.getUser().userName)+'/'+$filter('lowercase')($filter('removeSpaces')(algo.name));
        if(algo.model!=undefined) algo.model=algo.model._id;
        if(algo.media!=undefined) algo.media=algo.media._id;

        algo.algoType=$scope.algotype.selected;

        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            algo:algo
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.post('/api/algo/save/' ,config).success(function (data, status, headers) {

            //$scope.loadDependencies();
            //$scope.loadModels();
                //$scope.loadAlgos();
           // $scope.loadAnnotations();

            in_list=$scope.algos.filter(function(algo) {

                return algo._id=== data.algo._id
            });

            if (in_list.length > 0){
                $scope.algos=$scope.algos.map(function (value) {
                    if (in_list[0]._id===value._id){
                        value=data.algo;
                        $scope.selected=value;
                        $scope.algotype.selected=$scope.selected.algoType
                    }
                    return value;
                })



            }else{

                $scope.selected={};
                $scope.algos=$scope.algos.map(function (value) {
                    if (data.algo.name ===value.name){
                        value=data.algo;
                        $scope.selected=value;
                        $scope.algotype.selected=$scope.selected.algoType
                    }
                    return value;
                })

            }

      //      if( !$scope.selected.annotations) $scope.selected.annotations=[];
           /* $scope.loadDependencies();
            $scope.selected.model=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model});
            $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
            $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
*/
        });


    };
    $scope.selected.selectedDataSet={}
    $scope.selectDataset = function (dataset) {
        $scope.selected.selectedDataSet=dataset;
        $scope.selectedAnnotation=[]
        /*dataset.annotations.map(function(obj){

            var data = {
                _id:obj


            };
            var config = {
                params: data,
                headers : {'Content-Type': 'application/json'}

            };
            $http.get('/api/annotations/getById',config).success(function (data) {
                // console.log(data);


                $scope.selectedAnnotation=$scope.selectedAnnotation.concat(data.annotation.annotation)


                //$scope.selectedDataSet= data[0];

            });



        });*/


    }
    $scope.loadAllDataSets= function ()
    {
        $http.get('/api/dataset/loadAll').success(function (data) {
            // console.log(data);


            $scope.datasets= data;


            //$scope.selectedDataSet= data[0];

        });
    };

    $scope.loadAllDataSets();
    $scope.selectAlgo=function(index){
        $scope.selectedStep=0;
        $scope.selected= $scope.algos[index];
        $scope.selected.selectedDataSet={}
        $scope.selectedAnnotation=[]
        $scope.training={}
        $scope.conversionSettings={dest_path:'tmp',image_width:300,image_height:300,test_train_split:0.8}
        $scope.getDestPath();
        $scope.getTrainings();
    //    if( $scope.selected.annotations===undefined) $scope.selected.annotations=[];
       // $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
      //  $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});


        //$scope.loadDependencies();

    };
    $scope.removeAll=function(){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/media/deleteAll' ,config).success(function (data, status, headers) {
            $scope.algos=[];


            $scope.selected={};

        });


    };
    /*$scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
    $rootScope.settings.layout.pageSidebarClosed = true;
*/
    $scope.initChart=function(){
        $scope.chart=am4core.create("chartdiv", am4charts.XYChart);
        $scope.chart.data=[]
        // Create axes
        var xAxis =  $scope.chart.xAxes.push(new am4charts.ValueAxis());
        xAxis.renderer.minGridDistance = 40;

// Create value axis
        var yAxis =  $scope.chart.yAxes.push(new am4charts.ValueAxis());

// Create series
        var series =  $scope.chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = "x";
        series.dataFields.valueY = "ay";
        series.dataFields.value = "aValue";
        series.strokeWidth = 2;

// Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";

        // Create series
        var series =  $scope.chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueX = "x";
        series.dataFields.valueY = "ay";
        series.dataFields.value = "aValue";
        series.strokeWidth = 2;

// Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";

// Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");
        bullet.tooltipText="step:{valueX} "+ $scope.selectedMetric+":[bold]{valueY}"
        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

// Make a panning cursor
        $scope.chart.cursor = new am4charts.XYCursor();
        $scope.chart.cursor.behavior = "panXY";
        $scope.chart.cursor.xAxis = xAxis;
        $scope.chart.cursor.snapToSeries = series;

// Create vertical scrollbar and place it before the value axis
        $scope.chart.scrollbarY = new am4core.Scrollbar();
        $scope.chart.scrollbarY.parent =  $scope.chart.leftAxesContainer;
        $scope.chart.scrollbarY.toBack();

// Create a horizontal scrollbar with previe and place it underneath the date axis
        $scope.chart.scrollbarX = new am4charts.XYChartScrollbar();
        $scope.chart.scrollbarX.series.push(series);
        $scope.chart.scrollbarX.parent =  $scope.chart.bottomAxesContainer;

        $scope.chart.events.on("ready", function () {
            xAxis.zoom({start:0.79, end:1});
        });
    }


    $scope.metrics=['accuracy','loss']
    $scope.selectedMetric=$scope.metrics[0]

    $scope.stats={}
    $scope.updateChart=function(training){

        if ( training.accuracies!=undefined){

            if( $scope.selectedMetric=='accuracy'){

                $scope.chart.data=  training.accuracies.map(function (element,index) {
                    return {"x":index,ay:element}

                })
            }
            if( $scope.selectedMetric=='loss'){

                $scope.chart.data=  training.losses.map(function (element,index) {
                    return {"x":index,ay:element}

                })
            }



        }else {
            if ( training.losses!=undefined){


                if( $scope.selectedMetric=='loss'){

                    $scope.chart.data=  training.losses.map(function (element,index) {
                        return {"x":index,ay:element}

                    })
                }



            }
        }

    }
    $scope.initChart()
    $scope.metricSelected=function(metric){
        $scope.selectedMetric=metric
        $scope.initChart()
        $scope.chart.data=[];
        $scope.updateChart($scope.stats.selectedTraining)


    }

    $scope.trainingSelected=function(training){

    $scope.endInterval()
    $scope.startInterval(5000)
    $scope.stats.selectedTraining=training;
    $scope.chart.data=[];
        if (training.accuracies!=undefined){

            if( $scope.selectedMetric=='accuracy'){

                $scope.chart.data= training.accuracies.map(function (element,index) {
                    return {"x":index,ay:element}

                })
            }
            if( $scope.selectedMetric=='loss'){

                $scope.chart.data= training.losses.map(function (element,index) {
                    return {"x":index,ay:element}

                })
            }



    }
}
    $scope.download = function () {
        var myData = new Blob([text], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(myData, '~/models/ivanjacobs/first/Inception V3/5d158eac6a99c050e7ec49ab/training/model/first_inception_v3.h5');
    }
}); // end am4core.ready()