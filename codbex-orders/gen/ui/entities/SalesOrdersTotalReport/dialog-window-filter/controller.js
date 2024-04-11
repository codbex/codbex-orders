angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.entities.SalesOrdersTotalReport';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
				if (params?.filter?.StartDate) {
					params.filter.StartDate = new Date(params.filter.StartDate);
				}
				if (params?.filter?.EndDate) {
					params.filter.EndDate = new Date(params.filter.EndDate);
				}
				$scope.entity = params.filter ?? {};
		}

		$scope.filter = function () {
			const filter = {
				...$scope.entity
			};
			filter.StartDate = filter.StartDate?.getTime();
			filter.EndDate = filter.EndDate?.getTime();
			messageHub.postMessage("filter", filter);
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("SalesOrdersTotalReport-details-filter");
		};

	}]);