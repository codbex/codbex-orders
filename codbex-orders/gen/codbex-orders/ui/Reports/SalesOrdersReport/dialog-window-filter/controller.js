angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.Reports.SalesOrdersReport';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			if (params?.filter?.Date) {
				params.filter.Date = new Date(params.filter.Date);
			}
			if (params?.filter?.Due) {
				params.filter.Due = new Date(params.filter.Due);
			}
			$scope.entity = params.filter ?? {};
		}

		$scope.filter = function () {
			const filter = {
				...$scope.entity
			};
			filter.Date = filter.Date?.getTime();
			filter.Due = filter.Due?.getTime();
			messageHub.postMessage("filter", filter);
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("SalesOrdersReport-details-filter");
		};

	}]);