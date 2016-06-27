 ;(function (angular) {
 	//定义ng模块管理应用程序
 	angular.module('musicApp',['ngRoute'])
 	.config(['$routeProvider',function($routeProvider) {
 		$routeProvider
 		.when('/home',{
 			controller:'HomeController',
 			templateUrl:'home'
 		})
 		.when('/list',{
 			controller:'ListController',
 			templateUrl:'list'
 		})
		.when('/item/:id',{
 			controller:'ItemController',
 			templateUrl:'item'
 		})
 		.otherwise({ redirectTo:'/home'})
 	}])
 	.controller('HomeController',['$scope',function ($scope){}])
 	.controller('ListController',['$scope','$http',function ($scope,$http){
 		$scope.data = {}
 		$scope.action = {}
 		$http.jsonp('http://localhost:2080/api/music?callback=JSON_CALLBACK')
 		.then(res => {
 			$scope.data.list = res.data
 		})
 		.catch(console.log)
 	}])
 	.controller('ItemController',['$scope','$routeParams','$http',function ($scope,$routeParams,$http){
 		window.audio && window.audio.pause()
 		window.audio = new Audio()
 		$scope.data = {}
 		$scope.data.item = {}
 		$scope.data.playing = false
 		$scope.data.duration = 100
 		$scope.data.current = 0

 		$http.jsonp('http://localhost:2080/api/music/' + $routeParams.id+'?callback=JSON_CALLBACK')
 			.then(res => {
 				$scope.data.item = res.data
 				audio.src = $scope.data.item.music
 				audio.autoplay = true
 				audio.addEventListener('playing', () => {
					$scope.data.playing = true
					$scope.$apply()
 				})
 				audio.addEventListener('loadedmetadata', () => {
 					$scope.data.duration = audio.duration
 					$scope.$apply()	
 				})
 				audio.addEventListener('timeupdate', () => {
 					$scope.data.current = audio.currentTime
 					$scope.$apply()
 				})
 			})
 			.catch(console.log)
 		$scope.action = {}
 		$scope.action.play = () => {
 			$scope.data.playing ?
 			audio.pause():
 			audio.play()
 			$scope.data.playing = !$scope.data.playing
 		}
 		$scope.action.prev = () => {
 			
 		}
 		$scope.action.next = () => {
 			
 		}
 		$scope.action.convert = (second) => {
 			function pad(num, n) {
 				return (Array(n).join(0) + num).slice(-n)
 			}
 			var h = Math.floor(second / 3600)
 			var m = Math.floor(second % 3600 / 60)
 			var s = Math.floor(second % 60)
 			return h ? `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}`:`${pad(m, 2)}:${pad(s, 2)}`
 		}
 		$scope.action.progress = () => {
 			audio.currentTime = $scope.data.current
 		}
 	}])
 })(angular)
