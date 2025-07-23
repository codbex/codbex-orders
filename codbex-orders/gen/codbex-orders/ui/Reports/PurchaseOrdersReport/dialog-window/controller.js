angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	$scope.entity = {};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		$scope.action = 'select';

		if (params.entity.Date) {
			params.entity.Date = new Date(params.entity.Date);
		}
		if (params.entity.Due) {
			params.entity.Due = new Date(params.entity.Due);
		}
		$scope.entity = params.entity;
	}
});