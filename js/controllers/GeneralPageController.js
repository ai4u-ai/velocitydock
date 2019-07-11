
/* Setup general page controller */
MetronicApp.controller('GeneralPageController', ['$rootScope', '$scope', 'settings','$sce',function($rootScope, $scope, settings, $sce) {

    $scope.$on('$viewContentLoaded', function() {

        $scope.treeConfig = {
            core : {
                multiple : false,
                animation: true,
                error : function(error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback : true,
                worker : true
            },
            types : {
                default : {
                    icon : 'glyphicon glyphicon-flash'
                },
                star : {
                    icon : 'glyphicon glyphicon-star'
                },
                cloud : {
                    icon : 'glyphicon glyphicon-cloud'
                }
            },
            version : 1,
            plugins : ['types','checkbox','dnd']
        };
        $scope.treeData=[ { "text": "Dimensions", "icon": "fa fa-file icon-state-warning", "state": { "selected": true }, "children": [ { "text": "YEAR_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "2016", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "YEAR_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "2016", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MONTH_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "01", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MONTH_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "01", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "WEEK_V", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "1", "icon": "fa fa-file icon-state-warning" }, { "text": "2", "icon": "fa fa-file icon-state-warning" }, { "text": "3", "icon": "fa fa-file icon-state-warning" }, { "text": "4", "icon": "fa fa-file icon-state-warning" }, { "text": "5", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "WEEK_V", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "1", "icon": "fa fa-file icon-state-warning" }, { "text": "2", "icon": "fa fa-file icon-state-warning" }, { "text": "3", "icon": "fa fa-file icon-state-warning" }, { "text": "4", "icon": "fa fa-file icon-state-warning" }, { "text": "5", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "NAME", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "DAVID MAGDALENA-LUCIANA", "icon": "fa fa-file icon-state-warning" }, { "text": "DOCKX Monique", "icon": "fa fa-file icon-state-warning" }, { "text": "JONCKHEERE PATRICIA", "icon": "fa fa-file icon-state-warning" }, { "text": "FERNANDEZ IGLESIAS SARA", "icon": "fa fa-file icon-state-warning" }, { "text": "BRUCHER Sabine", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "NAME", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "DAVID MAGDALENA-LUCIANA", "icon": "fa fa-file icon-state-warning" }, { "text": "DOCKX Monique", "icon": "fa fa-file icon-state-warning" }, { "text": "JONCKHEERE PATRICIA", "icon": "fa fa-file icon-state-warning" }, { "text": "FERNANDEZ IGLESIAS SARA", "icon": "fa fa-file icon-state-warning" }, { "text": "BRUCHER Sabine", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "Measures", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "SCANNED LOTS", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "Measures", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "SCANNED LOTS", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "RCG_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED-BX", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "RCG_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED-BX", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MODULE", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MODULE", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "INS_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "COM", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "INS_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "COM", "icon": "fa fa-file icon-state-warning" } ] } ] }, { "text": "Dimensions", "icon": "fa fa-file icon-state-warning", "state": { "selected": true }, "children": [ { "text": "YEAR_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "2016", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "YEAR_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "2016", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MONTH_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "01", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MONTH_CREAT", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "01", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "WEEK_V", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "1", "icon": "fa fa-file icon-state-warning" }, { "text": "2", "icon": "fa fa-file icon-state-warning" }, { "text": "3", "icon": "fa fa-file icon-state-warning" }, { "text": "4", "icon": "fa fa-file icon-state-warning" }, { "text": "5", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "WEEK_V", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "1", "icon": "fa fa-file icon-state-warning" }, { "text": "2", "icon": "fa fa-file icon-state-warning" }, { "text": "3", "icon": "fa fa-file icon-state-warning" }, { "text": "4", "icon": "fa fa-file icon-state-warning" }, { "text": "5", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "NAME", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "DAVID MAGDALENA-LUCIANA", "icon": "fa fa-file icon-state-warning" }, { "text": "DOCKX Monique", "icon": "fa fa-file icon-state-warning" }, { "text": "JONCKHEERE PATRICIA", "icon": "fa fa-file icon-state-warning" }, { "text": "FERNANDEZ IGLESIAS SARA", "icon": "fa fa-file icon-state-warning" }, { "text": "BRUCHER Sabine", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "NAME", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "DAVID MAGDALENA-LUCIANA", "icon": "fa fa-file icon-state-warning" }, { "text": "DOCKX Monique", "icon": "fa fa-file icon-state-warning" }, { "text": "JONCKHEERE PATRICIA", "icon": "fa fa-file icon-state-warning" }, { "text": "FERNANDEZ IGLESIAS SARA", "icon": "fa fa-file icon-state-warning" }, { "text": "BRUCHER Sabine", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "Measures", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "SCANNED LOTS", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "Measures", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "SCANNED LOTS", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "RCG_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED-BX", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "RCG_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED-BX", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MODULE", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "MODULE", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "MED", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "INS_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "COM", "icon": "fa fa-file icon-state-warning" } ] }, { "text": "INS_CD", "icon": "fa fa-file icon-state-warning", "children": [ { "text": "COM", "icon": "fa fa-file icon-state-warning" } ] } ] } ];
    	// initialize core components
    	Metronic.initAjax();
       /* var logId = 0;
        $scope.testLines = [];
        for (var i = 20; i >= 0; i--) {
            $scope.testLines.push(i);
        };
        $scope.inviewLogs = [];
        $scope.lineInView = function(index, inview, inviewpart) {
            var inViewReport = inview ? '<strong>enters</strong>' : '<strong>exit</strong>';
            if (typeof(inviewpart) != 'undefined') {
                inViewReport = '<strong>' + inviewpart + '</strong> part ' + inViewReport;
            }
            $scope.inviewLogs.unshift({ id: logId++, message: $sce.trustAsHtml('Line <em>#' + index + '</em>: ' + inViewReport) });
        }
        $scope.containerLineInView = function(index, inview, inviewpart) {
            var inViewReport = inview ? '<strong>enters</strong>' : '<strong>exit</strong>';
            if (typeof(inviewpart) != 'undefined') {
                inViewReport = '<strong>' + inviewpart + '</strong> part ' + inViewReport;
            }
            $scope.inviewLogs.unshift({ id: logId++, message: $sce.trustAsHtml('Containerd line <em>#' + index + '</em>: ' + inViewReport) });
        }*/
    });
}]);
