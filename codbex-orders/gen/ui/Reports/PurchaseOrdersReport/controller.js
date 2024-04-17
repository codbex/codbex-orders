angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.Reports.PurchaseOrdersReport';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/api/Reports/PurchaseOrdersReportService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.filter = {};

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("filter", function (msg) {
			$scope.filter = msg.data;
			$scope.loadPage(1);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			const listFilter = {
				$offset: (pageNumber - 1) * $scope.dataLimit,
				$limit: $scope.dataLimit,
				...$scope.filter
			};
			$scope.dataPage = pageNumber;
			entityApi.count($scope.filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseOrdersReport", `Unable to count PurchaseOrdersReport: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				entityApi.list(listFilter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("PurchaseOrdersReport", `Unable to list PurchaseOrdersReport: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Due) {
							e.Due = new Date(e.Due);
						}
					});

					$scope.data = response.data;
				});
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("PurchaseOrdersReport-details", {
				action: "select",
				entity: entity,
			});
		};

		$scope.openFilter = function () {
			messageHub.showDialogWindow("PurchaseOrdersReport-details-filter", {
				action: "filter",
				filter: $scope.filter,
			});
		};


	}]);
