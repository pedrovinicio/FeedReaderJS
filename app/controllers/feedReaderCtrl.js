//Be careful while changing the strings injected here. It can cause problems if we use minification
angular.module('app').controller('feedReaderController',["$scope","feedReaderService",
    function ($scope,feedReaderService) {
        
        $scope.news = [];
        $scope.isLoading = true;
        
        $scope.selectedItem;
        
        feedReaderService.getTop10News(function(news){
            $scope.news = news;
            $scope.isLoading = false;
            $scope.selectedItem = news[0];
        });
      
        $scope.onItemClicked = function(item){
           $scope.selectedItem = item;
        };

    }                                                     
]);