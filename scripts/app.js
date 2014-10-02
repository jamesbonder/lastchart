var app = angular.module("lastchart", ['dotjem.routing']);


app.service('api', function($http){
	var api = {};

	api.getTopArtists = function(user){
		var request = $http.get("http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user="+ user +"&api_key=0f123375fc773afd63a2058e4d80b8e2&format=json");
		
		return request;
	};

	api.getTopTracks = function(user){
		var request = $http.get("http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user="+ user +"&api_key=0f123375fc773afd63a2058e4d80b8e2&format=json");

		return request;
	}

	api.getTopAlbums = function(user){
		var request = $http.get("http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user="+	user +"&api_key=0f123375fc773afd63a2058e4d80b8e2&format=json");

		return request;
	}

	api.getRecentTracks = function(user){
		var request = $http.get("http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user="+	user +"&api_key=0f123375fc773afd63a2058e4d80b8e2&format=json");

		return request;
	}

	return api;
});

app.config(function($locationProvider, $routeProvider, $stateProvider){
	$routeProvider.otherwise({redirectTo:"/home"});

	$stateProvider.state('home', {
		route:'/home',
		views:{
			'main':{
				template:"templates/main.html"
			}
		}
	});
});

app.controller("mainController", function($scope, api){
	var ctrl = this;

	$scope.topArtistsArray = [];
	$scope.topTracksArray = [];
	$scope.topAlbumsArray = [];
	
	$scope.recentTracks = [];

	$scope.search = "jamboon";

	this.topArtists = new Morris.Bar({
		  // ID of the element in which to draw the chart.
		  element: 'topartists',
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  data: [],
		  // The name of the data record attribute that contains x-values.
		  xkey: 'name',
		  // A list of names of data record attributes that contain y-values.
		  ykeys: ['playcount'],
		  // Labels for the ykeys -- will be displayed when you hover over the
		  // chart.
		  labels: ['Play count'],	 

		  barColors: ['#D9540A']
		});
	this.topTracks = new Morris.Bar({
		  // ID of the element in which to draw the chart.
		  element: 'toptracks',
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  data: [],
		  // The name of the data record attribute that contains x-values.
		  xkey: 'name',
		  // A list of names of data record attributes that contain y-values.
		  ykeys: ['playcount'],
		  // Labels for the ykeys -- will be displayed when you hover over the
		  // chart.
		  labels: ['Play count'],	 

		  barColors: ['#D9540A']
		});

	this.topAlbums = new Morris.Bar({
		  // ID of the element in which to draw the chart.
		  element: 'topalbums',
		  // Chart data records -- each entry in this array corresponds to a point on
		  // the chart.
		  data: [],
		  // The name of the data record attribute that contains x-values.
		  xkey: 'name',
		  // A list of names of data record attributes that contain y-values.
		  ykeys: ['playcount'],
		  // Labels for the ykeys -- will be displayed when you hover over the
		  // chart.
		  labels: ['Play count'],	 

		  barColors: ['#D9540A']
		});

	$scope.completeSearch = function(){
		api.getTopTracks($scope.search).success(function(data){
		if($scope.topTracksArray != []){$scope.topTracksArray = []}
		for(var i = 0; i < 10; i++){
				$scope.topTracksArray.push({name: data.toptracks.track[i]['name'], playcount:parseInt(data.toptracks.track[i]['playcount'])});
		}

			ctrl.topTracks.setData($scope.topTracksArray);
		});

		api.getTopAlbums($scope.search).success(function(data){
			if($scope.topAlbumsArray != []){$scope.topAlbumsArray = []}
			for(var i = 0; i < 10; i++){
					$scope.topAlbumsArray.push({name: data.topalbums.album[i]['name'], playcount:parseInt(data.topalbums.album[i]['playcount'])});
			}

			ctrl.topAlbums.setData($scope.topAlbumsArray);
		});

		api.getTopArtists($scope.search).success(function(data){
			if($scope.topTracksArray != []){$scope.topArtistsArray = []}
			for(var i = 0; i < 10; i++){
					$scope.topArtistsArray.push({name: data.topartists.artist[i]['name'], playcount:parseInt(data.topartists.artist[i]['playcount'])});
			}
			ctrl.topArtists.setData($scope.topArtistsArray);
		});

		api.getRecentTracks($scope.search).success(function(data){
			if($scope.topTracksArray != []){$scope.recentTracks = []}
			for(var i = 0; i < 5; i++){
					$scope.recentTracks.push({name: data.recenttracks.track[i]['name'], image:data.recenttracks.track[i]['image'][0]["#text"]});
					
			}
		});
	}
	$scope.completeSearch();
});