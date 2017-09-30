/**
 * Created by jacobiv on 10/10/2016.
 */
MetronicApp.controller('FileUploadCtrl',function ($scope, FileUploader,API_ENDPOINT,AuthService,$http,$location) {

    var uploader = $scope.uploader = new FileUploader({
        url: API_ENDPOINT.url+'/upload',
        /*withCredentials: false,
        autoUpload: false,
        removeAfterUpload: true,*/
        headers: {
            Authorization: AuthService.getAuthToken()
        }  ,scope: $scope

    });

    $scope.dependencies=[];

    $scope.load = function () {
        $http.get('/api/load/allmedia').success(function (data) {
            console.log(data);
            $scope.files=data;


        });
    };
    $scope.loadDependencies = function () {
        $http.get('/api/dependencies/get').success(function (data) {
            console.log(data);
            $scope.dependencies=data;


        });
    };
    $scope.loadModels = function () {
        $http.get('/api/load/algomodels').success(function (data) {
            console.log(data);
            $scope.models=data;


        });
    };
    $scope.loadModels();
    $scope.load();
    $scope.loadDependencies();
    $scope.loadOne = function (id) {
        $http.get('/api/containers/container1/download/'+ encodeURIComponent(id), {
            headers: {'Range': 'bytes=0-550'}}).success(function (data) {
            $location.url(data);
            console.log(data);
            $scope.files = data;
        });
    };

    $scope.delete = function (index, id) {
        $http.delete('/api/delete/' + encodeURIComponent(id)).success(function (data, status, headers) {
            $scope.files.splice(index, 1);
        });
    };

    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

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
        $scope.loadDependencies();
        $scope.load();
        $scope.loadModels();
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.log('uploadCompleted event received');
        $scope.loadDependencies();
        $scope.load();
        $scope.loadModels();
        console.info('onCompleteAll');
    };
    $scope.$on('uploadCompleted', function(event) {
        console.log('uploadCompleted event received');
        $scope.loadDependencies();
        $scope.load();
        $scope.loadModels();
    });
    console.info('uploader', uploader);


    $scope.removeMediaOne=function(index,id){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            id:id
        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/media/delete/' ,config).success(function (data, status, headers) {
            $scope.files.splice(index, 1);
            $scope.load();
            $scope.selectedAnnotation= $scope.files[index];
        });


    };
    $scope.removeMediaAll=function(){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/media/deleteAll' ,config).success(function (data, status, headers) {
            $scope.files=[];
            $scope.load();
            $scope.selectedAnnotation={};
        });


    };

});