var module = angular.module('Demo', ['ui.bootstrap'], angular.noop)
.run(['$http', function($http) {
    console.log('aaa')
}]);
