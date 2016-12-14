var app = angular.module('Twitter', ['ui.router']);




function profileController($scope, $http) {
  $scope.formData = {};

  $http.get('/profile')
    .success(function(data) {
      $scope.twits = data;
      console.log(data);
    })
    .error(function(data) {
      console.log('Error', data);
    });
}
