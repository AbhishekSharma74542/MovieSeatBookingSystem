
	//Some Essentials Global Variable for Storage Purpose
	var alreadyReserved = [];
	var allSeats = [];
	var availableSeats = [];

	//Defining Routes
	var myApp = angular.module('myApp', ['ngRoute']);
	myApp.config(function($routeProvider) {

		$routeProvider.when('/', {
			templateUrl: 'mainPage.html',
			controller: 'myCtrl'
		}).when('/:seats/:name', {
			templateUrl: 'seatsInterface.html',
			controller: 'seatsInterfaceCtrl'
		})

	});

	//Defining Controller One
	myApp.controller('myCtrl', function($scope,$http,$routeParams) { 

		//Fetching Data from Db

		$http.get('Data.json').success(function(data) {
			allSeats = data.seBts;
			availableSeats = data.seBts; 
			toCountOptions(availableSeats);


		});

		//Generic Function Counting no. of Options 
		var toCountOptions = function(availableSeats){
			var options = [];
			var k = 0;
			var j = 0;
			for(var i = 0;i<availableSeats.length;i++){
			console.log("availableSeats :: "+JSON.stringify(availableSeats[i]));	
			if(availableSeats[i].isReserved == false){
				j++;
				options.push(j); 
			}
			if(availableSeats[i].isReserved == true){
				k++;
				alreadyReserved.push(k);
				console.log("alreadyReserved :: "+alreadyReserved);
			}
			}
			alreadyReserved.length = alreadyReserved.length/2;
			console.log("alreadyReserved :: "+alreadyReserved);
			$scope.options = options;
		}

	});

	myApp.controller('seatsInterfaceCtrl', function($scope,$http,$window,$routeParams) { 
		//Defining some scopes

		couldSelect = true;
		$scope.confirm = false;
		$scope.availableSeats = availableSeats;
		$scope.seats = $routeParams.seats;
		$scope.name = $routeParams.name;

		//Defining by Default user
		var userData = [{"name":"Jenny","seats":"5"}];
		$scope.userData = userData;

		//Toggle Function for changing ng-class styles
		$scope.whatClassIsIt = function(toggle){
			if(couldSelect == true){	
				var seatsReserved = 0;
				var seatsUnreserved = 0;
				if(toggle == "true" || toggle == true){
					seatsReserved++;
					return 'red'
				}
				if(toggle == "false" || toggle == false){
					seatsUnreserved++;
					return 'grey'
				}
			}
		}

		//Function to Change Status After Selection 
		$scope.changeStatus = function(seatNumber){
			console.log("Coming to Change Status");
			if(couldSelect == true){
				toVerify(availableSeats);
				for(var i = 0;i<availableSeats.length;i++){
					if(seatNumber.id == availableSeats[i].id){
						availableSeats[i].isReserved = !availableSeats[i].isReserved;
					}
				}

			}
		}
		//Function to check user selection
		var toVerify = function(availableSeats){
			console.log("Coming to Verify Status");
			var youSelected = 0;
			console.log("alreadyReserved :: "+alreadyReserved);
			console.log("availableSeats.length :: "+availableSeats.length);
			for(var i = 0;i<availableSeats.length-alreadyReserved.length;i++){
				if(availableSeats[i].isReserved == true){
					youSelected++; 
				}
				console.log("youSelected :: "+youSelected);	
				console.log("$routeParams.seats :: "+$routeParams.seats);
				if(youSelected == $routeParams.seats-1){
					couldSelect == false;
					$window.alert("You have selected Maximum Seats! If you want to select more go back and choose from the option");
					$scope.confirm = true;
				}	
			}


		}
		//Function After Selection
		$scope.yesConfirm = function(seats,name){
			$scope.confirm = false;
			var tempObject = {};
			tempObject.seats = seats;
			tempObject.name = name;
			userData.push(tempObject);
			$scope.userData = userData;
		}




	});

	


	
