//FeedReader service
var app = angular.module('app',["ngAnimate"]);

app.service('feedReaderService', ["$http", "$q", 
	function($http, $q){
	
		var feedBaseUrl = "https://hacker-news.firebaseio.com/v0/topstories.json";
	
		var feedNews = [];
		
		this.getTop10News = function(successCallback){
			
			$http.get(feedBaseUrl).success(function(newsIds) {
				
				var maxLength = Math.min(10,newsIds.length); //restrict max length to 10.
				
				//Create an array of promises to guarantee the callback function will
				//be only called when all the requests are completed.
				var newsPromises = [];
			
				for (var i = 0; i < maxLength; i++) {
                    newsPromises.push($http.get("https://hacker-news.firebaseio.com/v0/item/" + newsIds[i] + ".json"));
                }
				
				//This will wait until every request returns
				$q.all(newsPromises).then(function(retNewsPromises) {

                    var userPromises = [];
					
                    for (var j = 0; j < retNewsPromises.length; j++) {
                        feedNews.push(retNewsPromises[j].data);
                        userPromises.push($http.get("https://hacker-news.firebaseio.com/v0/user/" + retNewsPromises[j].data.by + ".json"));
                    }
					
                    $q.all(userPromises).then(function(retUserPromises) {
                        for (var k = 0; k < retUserPromises.length; k++) {
                            if (retUserPromises[k]) {
                                feedNews[k].user = retUserPromises[k].data;
                            }
                        }
                        
						//Just now the callback function will be called.
						//At this point, everything is already loaded.
                        successCallback(feedNews);
                    });
                });
				
			
			});
		};
		
	}
]);