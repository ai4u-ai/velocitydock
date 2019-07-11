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
MetronicApp.controller('DataSetsController',function ($scope, API_ENDPOINT,AuthService,$http,$location, rx,$location,$filter,$interval,FileUploader, $anchorScroll,$window) {

    $scope.adjectives = ["adamant", "adroit", "amatory", "animistic", "antic", "arcadian", "baleful", "bellicose", "bilious", "boorish", "calamitous", "caustic", "cerulean", "comely", "concomitant", "contumacious", "corpulent", "crapulous", "defamatory", "didactic", "dilatory", "dowdy", "efficacious", "effulgent", "egregious", "endemic", "equanimous", "execrable", "fastidious", "feckless", "fecund", "friable", "fulsome", "garrulous", "guileless", "gustatory", "heuristic", "histrionic", "hubristic", "incendiary", "insidious", "insolent", "intransigent", "inveterate", "invidious", "irksome", "jejune", "jocular", "judicious", "lachrymose", "limpid", "loquacious", "luminous", "mannered", "mendacious", "meretricious", "minatory", "mordant", "munificent", "nefarious", "noxious", "obtuse", "parsimonious", "pendulous", "pernicious", "pervasive", "petulant", "platitudinous", "precipitate", "propitious", "puckish", "querulous", "quiescent", "rebarbative", "recalcitant", "redolent", "rhadamanthine", "risible", "ruminative", "sagacious", "salubrious", "sartorial", "sclerotic", "serpentine", "spasmodic", "strident", "taciturn", "tenacious", "tremulous", "trenchant", "turbulent", "turgid", "ubiquitous", "uxorious", "verdant", "voluble", "voracious", "wheedling", "withering", "zealous"];
    $scope.nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbin boy", "clerk of the chapel", "filling station attendant", "foreman", "maintenance engineering", "mechanic", "miller", "moldmaker", "panel beater", "patternmaker", "plant operator", "plumber", "sawfiler", "shop foreman", "soaper", "stationary engineer", "wheelwright", "woodworkers"];


    $scope.randomEl=function (list) {
        var i = Math.floor(Math.random() * list.length);
        return list[i];
    }


    $scope.idImage="canvas"

    $scope.selectedAnnotation={};
    $scope.annotations=[];
    $scope.selectedAnnotaionTime={};
    $scope.api={};
    $scope.scrollTo = function(currentTime,index) {
               $('.scroller').slimScroll({scrollTo : (document.getElementById(currentTime).scrollHeight * index)  });
    };
    $scope.calculateAverageTimeDist=function(){
      $scope.averTimeDist=  $scope.selectedAnnotation.annotation.map(function(a,index){ var next=$scope.selectedAnnotation.annotation[index+1]; if(next!=undefined) return next.currentTime -a.currentTime}).filter(function(f){if(f!=undefined) return f}).reduce(function(a,b){return a +b})/$scope.selectedAnnotation.annotation.length ;
    };
    $scope.select=function(file){


        if($scope.files.length>0){
            $scope.selectedAnnotation= file;
            // $scope.calculateAverageTimeDist();

            /*    $scope.annotationsMap={};
                $scope.selectedAnnotation.annotation.map(function(annotation){
                $scope.annotationsMap[ parseInt(annotation.currentTime, 10)]=annotation;
            });*/
            if( $scope.api.mediaElement==undefined) $scope.api.mediaElement=[]
           // $scope.api.mediaElement[0].src= $scope.selectedAnnotation.mediaFile.src;
        }

    };

    $scope.selectMedia = function (media) {
        $scope.selectedMedia=media;

    }
    $scope.selectMediaDataSet = function (media) {
        $scope.selectedMediaDataSet=media;

    }
    $scope.groupByMedia = function (media) {
        $scope.selectedMedia=media;

    }
    $scope.groupByMediaDataSet = function (media) {
        $scope.selectedMediaDataSet=media;

    }
    $scope.selectDataset = function (dataset) {
        $scope.selectedDataSet=dataset;
        $scope.selected.annotations=dataset.annotations.map(function (value) {
            return $scope.files.find(function(anno){
            return anno._id===value
            })
        });
        $scope.calculateClasses()
        $scope.getDestPath()
        $scope.loadConversionDataSet()

    };
    $scope.selectedConversion={}
    $scope.selectConversion=function(conversion){
        $scope.selectedConversion=conversion;
    }
    $scope.load = function () {
        $scope.mediafiles=[];
        $http.get('/api/anotations/loadAll').success(function (data) {
           // console.log(data);


            $scope.files= data.map(function(obj){
                var method=obj.annotatedOnMedia.filePath ==undefined ? '/stream/video/' : '/stream/video/frompath';
                var id=obj.annotatedOnMedia.filePath == undefined ? obj.annotatedOnMedia.media.id : '';
                // var mediaFile={src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+media.filePath+'&'+'type='+"video/mp4",type: "video/mp4" ,title:media.name};

                $scope.mediafiles.push(obj.annotatedOnMedia.name)
                return {_id:obj._id,media_name:obj.annotatedOnMedia.name,uploadedBy:obj.uploadedBy,annotation:obj.annotation,mediaFile:{_id:obj.annotatedOnMedia.media._id,src:API_ENDPOINT.url+method+id+'?'+'access_token='+AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)+'&'+'filePath='+obj.annotatedOnMedia.filePath+'&'+'type='+"video/mp4",type: "video/mp4"}}

            });
            $scope.select($scope.files[0]);
            $scope.mediafiles=Array.from(new Set($scope.mediafiles))
            $scope.mediafiles.unshift('all')
            $scope.selectedMedia= $scope.mediafiles[0]
            $scope.selectedMediaDataSet= $scope.mediafiles[0];

        });
        $scope.loadAllDataSets()
    };
    $scope.selectedAnnotations=[];
    $scope.selectAnnotation=function(annotation){
        annotation.isChecked=true;
        $scope.selectedAnnotations.push(annotation)
    };
    $scope.allItemsSelected=false;
    $scope.selectAll=function(){

        $scope.files=$scope.files.map(function (file) {

            if (file.isChecked){
                if($scope.selectedMedia=="all"){
                    file.isChecked=false;
                }else{
                    if($scope.selectedMedia==file.media_name){
                        file.isChecked=false;
                    }
                }

            }else{
                if($scope.selectedMedia=="all"){
                    file.isChecked=true;
                }else{
                    if($scope.selectedMedia==file.media_name){
                        file.isChecked=true;
                    }
                }

            }

            return file
        })
    };
    $scope.moveAllSelected=function(){
        filtered=$scope.files.filter(function (file) {
            return file.isChecked==true
        });
        $scope.selected.annotations=$scope.selected.annotations.concat(angular.copy(filtered));
        $scope.files=$scope.files.map(function (file) {
            file.isChecked=false;
            return file
        });
        $scope.allItemsSelected=false;
        $scope.calculateClasses()
        $scope.getDestPath()
    };
    $scope.conversionSettings={dest_path:'tmp',image_width:300,image_height:300,types:['Object Detection Tensorflow','Classification Convnet','Yolo'],test_train_split:0.8}
    $scope.conversionSettings.image_width="300";
    $scope.selectedConversionType=$scope.conversionSettings.types[0];
    $scope.getDestPath=function(){
        $scope.conversionSettings.dest_path='data/'+$filter('lowercase') ($scope.getUser().userName)+ "/"+ $filter('lowercase')($filter('removeSpaces')($scope.selectedDataSet.name))
        return $scope.conversionSettings.dest_path
    }

    $scope.setConversionType=function(type){
        $scope.selectedConversionType=type;
        $scope.conversionSettings.selectedConversionType=type;
    };
    $scope.loadConversionDataSet=function(){

        var data = {
            _id:$scope.selectedDataSet._id,

        };
        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
        $http.get('/api/conversion/findByDataSet',config).success(function (data) {
            // console.log(data);





            $scope.conversions= data;

        });

    }

    $scope.startInterval=function (interval) {
        $scope.promise = $interval($scope.loadConversionDataSet, interval);

    };
    $scope.endInterval=function(){
        $interval.cancel($scope.promise);
        $scope.promise = undefined;
    }

    $scope.convertDataset=function(){
        if ($scope.selectedDataSet._id ===undefined){
            $scope.saveDataSets($scope.selectedDataSet)
        }
        if ($scope.selectedDataSet.annotations.length <$scope.selected.annotations.length)
        {
            $scope.saveDataSets($scope.selectedDataSet)
        }

        var data = {
            _id:$scope.selectedDataSet._id,
            destpath:$scope.conversionSettings.dest_path,
            image_width:$scope.conversionSettings.image_width,
            image_height:$scope.conversionSettings.image_height,
            selected_type:$scope.selectedConversionType,
            test_train_split:$scope.conversionSettings.test_train_split

        };
        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
        $http.get('/api/dataset/convert',config).success(function (data) {
            // console.log(data);






        });
        $scope.loadConversionDataSet()
        $scope.endInterval()
        $scope.startInterval(10000)
    };

    $scope.$on('$destroy',function(){
        $interval.cancel($scope.promise);
    });
    $scope.loadAllDataSets= function ()
    {
        $http.get('/api/dataset/loadAll').success(function (data) {
            // console.log(data);


            $scope.datasets= data;


            //$scope.selectedDataSet= data[0];

        });
    };
    $scope.load();

    $scope.selected={};
    $scope.selected.annotations=[];
    $scope.classes=[];
    $scope.calculateClasses=function(item){
        $scope.classes=[];
        if (item!=undefined){
            item.annotation.map(function(an){
                if ($scope.classes.length==0){
                    $scope.classes.push({class:an.objectSelector.class.name,count:1})
                }else{
                    cla=$scope.classes.find(
                        function (cl)
                        {
                            if(an.objectSelector.class.name==cl.class)
                            {
                                return cl;
                            }
                        });
                    if (cla!=undefined){

                        cla= cla.count++

                    }else{
                        $scope.classes.push({class:an.objectSelector.class.name,count:1})
                    }
                }


                return an

            })
        }
        $scope.selected.annotations.map(function(annotation){

            annotation.annotation.map(function(an){
                if ($scope.classes.length==0){
                    $scope.classes.push({class:an.objectSelector.class.name,count:1})
                }else{
                    cla=$scope.classes.find(
                        function (cl)
                        {
                                if(an.objectSelector.class.name==cl.class)
                                    {
                                        return cl;
                                    }
                            });
                    if (cla!=undefined){

                        cla= cla.count++

                    }else{
                        $scope.classes.push({class:an.objectSelector.class.name,count:1})
                    }
                }


                return an

            })

        })
    };
    $scope.dropCallbackAnnotations=function(event, index, item, external, type, allowedType) {
        if(item.annotations != undefined){
            new_annos=item.annotations.map(function (value) {
                return $scope.files.find(function(anno){

                    return anno._id===value
                })
            });
            $scope.selected.annotations=$scope.selected.annotations.concat(new_annos)
            $scope.calculateClasses()

        }else{
            $scope.calculateClasses(item)

            return item;
        }
        $scope.getDestPath()

    };
    $scope.dropCallbackDependencies = function(event, index, item, external, type, allowedType) {


        return false;
    };
    $scope.removeFromSelectedAnn=function (index) {
        if($scope.files.filter(function(d){if(d._id===$scope.selected.annotations[index]._id) return d}).length===0){
            $scope.files.push($scope.selected.annotations[index]);
        }

        $scope.selected.annotations.splice(index,1);
        $scope.calculateClasses()


    };






    $scope.removeAnnotation=function(index,id){

        var indexAnno=$scope.files.indexOf($scope.selectedAnnotation);
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length),
            id:$scope.files[$scope.files.indexOf($scope.selectedAnnotation)].annotation[index]._id

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
        $scope.files[$scope.files.indexOf($scope.selectedAnnotation)].annotation.splice(index, 1);
       /* $http.delete('/api/annotation/delete/' ,config).success(function (data, status, headers) {
            $scope.files[$scope.files.indexOf($scope.selectedAnnotation)].annotation.splice(index, 1);
           // $scope.load();
            $scope.selectedAnnotation= $scope.files[index];
        });*/
        $scope.saveAnnotations();
       // $scope.selectedAnnotation= $scope.files[indexAnno];

    };
    $scope.showNameDataSet=function(){
        if ($scope.selectedDataSet.name===undefined && $scope.selected.annotations.length>0){
            $scope.selectedDataSet={}
            $scope.selectedDataSet.name=$scope.randomEl($scope.adjectives)+' '+ $scope.randomEl($scope.nouns);
        }
        return $scope.selectedDataSet
    };
    $scope.saveAnnotations=function(){
        // this.currentVideo.selections
        // var netJson=   angular.toJson(this.currentVideo.selections);

        $http({
            url:API_ENDPOINT.url+ '/annotations/save',
            method: "POST",
            data:{annotation:$scope.selectedAnnotation.annotation,_id:$scope.selectedAnnotation._id,annotatedOnMedia:$scope.selectedAnnotation.mediaFile._id},
            headers: {'Content-Type': 'application/json'}}).then(
            angular.bind(this,function(mess) {
                // $scope.load();
                // $scope.selectedAnnotation= mess;
            }))  // success
            .catch(function() {console.log('error')}); //
    }
    $scope.selectedDataSet={}
    $scope.createNewDataSet=function(){
        $scope.selectedDataSet={}
        $scope.selectedDataSet.name=$scope.randomEl($scope.adjectives)+' '+ $scope.randomEl($scope.nouns);
        $scope.selected.annotations=[]
        $scope.getDestPath()
        $scope.calculateClasses()
    };
    $scope.saveDataSets=function(selectedDataSet){
        // this.currentVideo.selections
        // var netJson=   angular.toJson(this.currentVideo.selections);
        if (selectedDataSet !=undefined)
        {
            // var a = $scope.selected.annotations.map(function(obj){ return obj._id});
            // b = selectedDataSet.annotations;
            // var c = a.concat(b);
            data={name:selectedDataSet.name, _id:selectedDataSet._id,annotations:$scope.selected.annotations.map(function(obj){ return obj._id})}
        }else {
            if ($scope.selectedDataSet.name===undefined){
                n= $scope.randomEl($scope.adjectives)+' '+ $scope.randomEl($scope.nouns);
            }else{
                n=$scope.selectedDataSet.name
            }

            data={ name :n , annotations : $scope.selected.annotations.map(function(obj){ return obj._id})}
        }

        $http({
            url:API_ENDPOINT.url+ '/dataset/save',
            method: "POST",
            data:data,
            headers: {'Content-Type': 'application/json'}}).then(
            angular.bind(this,function(mess) {
                // $scope.load();
                console.log(mess)
                $scope.selectedDataSet= mess.data.dataset;

               })
        )  // success
            .catch(function() {console.log('error')}); //
        $http.get('/api/dataset/loadAll').success(function (data) {
            // console.log(data);


            $scope.datasets= data;




        });
    }
    $scope.deleteDataSet=function(todelete_id){
        data={_id:todelete_id}


        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };
        $http.delete('/api/dataset/delete' ,config).success(function (data, status, headers) {
            $scope.files=[];
            $scope.load();
            $scope.selectedAnnotation={};
        });
        $scope.classes=[]
    };
    $scope.removeAllAnnotations=function(){
        var data = {
            access_token:AuthService.getAuthToken().substring(4,AuthService.getAuthToken().length)

        };

        var config = {
            params: data,
            headers : {'Content-Type': 'application/json'}

        };

        $http.delete('/api/annotation/deleteAll' ,config).success(function (data, status, headers) {
            $scope.files=[];
            $scope.load();
            $scope.selectedAnnotation={};
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