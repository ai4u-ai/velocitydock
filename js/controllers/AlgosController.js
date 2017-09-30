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



// anotations
    $scope.annotations=[];
    $scope.selectedAnnotation={};
    $scope.selectAnnotation=function(index){
        $scope.selectedAnnotation=$scope.annotations[index];
    };
    $scope.loadAnnotations = function () {

        $http.get('/api/anotations/loadAll').success(function (data) {
            console.log(data);


            $scope.annotations= data.map(function(obj){

                return {_id:obj._id,uploadedBy:obj.uploadedBy,annotation:obj.annotation,mediaFile:{src:API_ENDPOINT.url+'/stream/video/'+obj.annotatedOnMedia.media.id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4"}}

            });
           // $scope.select(0);

        });
    };
    $scope.startInterval=function (interval) {
        $scope.promise = $interval($scope.updateTraining, 2000);
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
            training:$scope.training._id

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.get('/api/refreshtraining/',config).success(function (data, status, headers) {

            console.log(data);
            if(data.training!=undefined){
                $scope.training=data.training;
                if($scope.training.endDate!=undefined) $scope.training.endDate=new Date();
            }

            if($scope.training.status='end');$scope.endInterval();

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
            console.log(data);
         
            // $scope.select(0);

        });
    };
    $scope.getTrainings=function ()
    {

        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            algo:$scope.selected._id,

        };
        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}


        };


        $http.get('/api/get/trainings',config).success(function (data) {
            console.log(data);
                $scope.trainings=data.trainings;
                $scope.selected.selectedTraining=data.trainings[data.trainings.length-1];
            // $scope.select(0);

        });
    };
 $scope.trainModel=function () {
     var modelId=0
     var retrain=false;
     if( $scope.selected.selectedModelToTrain ===undefined){
         modelId=$scope.selected.model._id;

     }else{
         modelId=$scope.selected.selectedModelToTrain.endModel._id;
         retrain=true;
     }

     var annoIds= $scope.selected.annotations.map(function (ann) {
         return ann._id;
     });
     var data = {
         steps:$scope.trainingSteps,
         retrain:retrain,
         annotations:annoIds ,
         model:modelId,
         algo:$scope.selected._id,
         apipath:$scope.selected.apipath,
         name:$scope.selected.name,
         version:$scope.selected.version

     };
     var config = {
         params: data,
         headers : {'Content-Type': 'application/json'}


     };


     $http.post('/api/trainmodel/',config).success(function (data) {
         console.log(data);
            $scope.training=data.training
            // $scope.startInterval()

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
    $scope.sources=[];
    $scope.loadMedia = function () {
        $http.get('/api/load/allmedia').success(function (data) {
            console.log(data);
            $scope.media=data;
            var media= $scope.media[0];
            var mediaFile={src:API_ENDPOINT.url+'/stream/video/'+media.media.id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4" ,title:media.name}
    if(  $scope.api.mediaElement!=undefined)            $scope.api.mediaElement[0].src=mediaFile.src;


        });
    };
    $scope.createAlgo=function(){
        $scope.algos.unshift({});

        $scope.selected={};
        $scope.selected.dependencies=[];
        $scope.selected.annotations=[];

    };
    $scope.selectMedia=function(index){
        $scope.selectedMedia= $scope.media[index];
        $scope.selected.media=$scope.media[index];
        var media=$scope.media[index];
        var mediaFile={src:API_ENDPOINT.url+'/stream/video/'+media.media.id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),type: "video/mp4" ,title:media.name}

        $scope.api.mediaElement[0].src=mediaFile.src;
    };

    $scope.loadMedia();






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

    var uploader = $scope.uploader = new FileUploader({
        url: API_ENDPOINT.url+'/upload',
        /*withCredentials: false,
         autoUpload: false,
         removeAfterUpload: true,*/
        headers: {
            Authorization: AuthService.getAuthToken()
        }  ,scope: $scope

    });
    $scope.models=[];
    $scope.selectModel=function(model){
        $scope.selectedAlgoModel= model;
        $scope.selected.model=$scope.selectedAlgoModel
        $scope.getTrainings();
    };
    $scope.loadModels = function () {
        $http.get('/api/load/algomodels').success(function (data) {
            console.log(data);
            $scope.models=data;


        });
    };
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        item.formData.push({type:item.file.type});
        item.formData.push({writeaccess:item.file.writeaccess});
        item.formData.push({readaccess:item.file.readaccess});
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.log('uploadCompleted event received');
        //$scope.load();

        $scope.loadModels();

        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.log('uploadCompleted event received');
      //  $scope.load();
        $scope.loadModels();
        console.info('onCompleteAll');
    };
    $scope.$on('uploadCompleted', function(event) {
        console.log('uploadCompleted event received');
      //  $scope.load();
        $scope.loadModels();
    });

    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
    });

    $scope.selected={};


    $scope.loadAlgos = function () {
        $http.get('/api/load/algos').success(function (data) {
            console.log(data);
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
            }else{
                $scope.selected={};
                $scope.selected.annotations=[];
                $scope.seleted.dependencies=[];
            }



        });
    };

    $scope.frameworks=[{name:'Tensorflow',languages:[{name:'Python'},{name:'C++'}]},{name:'Theano',languages:[{name:'Python'}]},{name:'Caffe',languages:[{name:'Python'}]},{name:'Wekka',languages:[{name:'Java'}]},{name:'Nodejs',languages:[{name:'JS'}]}];
    $scope.languages=[{name:'Java'},{name:'Python'},{name:'JS'},{name:'C++'}];
    $scope.dependencies=[];
    $scope.annotations=[];
    $scope.loadDependencies = function () {
        $http.get('/api/dependencies/get').success(function (data) {
            console.log(data);
            $scope.dependencies=data;


        });
    };

    $scope.selectedStep=0;
    $scope.loadDependencies();
    $scope.loadModels();
    $scope.loadAlgos();
    $scope.loadAnnotations();
    $scope.selectStep= function(step){
      $scope.selectedStep=step;
        $scope.getTrainings();


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
    $scope.saveAlgo=function(){
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

        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            algo:algo
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json', Authorization: AuthService.getAuthToken()}

        };

        $http.post('/api/algo/save/' ,config).success(function (data, status, headers) {

            $scope.loadDependencies();
            $scope.loadModels();
            $scope.loadAlgos();
            $scope.loadAnnotations();
            //$scope.selected= data.algo;
      //      if( !$scope.selected.annotations) $scope.selected.annotations=[];
           /* $scope.loadDependencies();
            $scope.selected.model=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model});
            $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});
            $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
*/
        });


    };


    $scope.select=function(index){
        $scope.selected= $scope.algos[index];
    //    if( $scope.selected.annotations===undefined) $scope.selected.annotations=[];
       // $scope.selectedAlgoModel=$scope.models.filter(function(model){if (model._id=== $scope.selected.model) return model})[0];
      //  $scope.selected.dependencies=$scope.dependencies.filter(function(dependency){if ($scope.selected.dependencies.filter(function(d){if(dependency._id===d) return d}).length>0) return dependency});


        $scope.loadDependencies();
        $scope.getTrainings();
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
            $scope.load();
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
});