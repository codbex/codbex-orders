angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.Reports.PurchaseOrdersTotalReport';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/codbex-orders/api/Reports/PurchaseOrdersTotalReportService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.filter = {};

		const ctx = document.getElementById('myChart');
		const myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: [],
				datasets: []
			}
		});

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("filter", function (msg) {
			$scope.filter = msg.data;
			$scope.loadPage();
		});
		//-----------------Events-------------------//

		$scope.loadPage = function () {
			entityApi.count($scope.filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseOrdersTotalReport", `Unable to count PurchaseOrdersTotalReport: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				entityApi.list($scope.filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("PurchaseOrdersTotalReport", `Unable to list PurchaseOrdersTotalReport: '${response.message}'`);
						return;
					}

					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = response.data;
					myChart.data.labels = $scope.data.map(e => e.Date);
					myChart.data.datasets = [
						{
							label: 'Total',
							data: $scope.data.map(e => e.Total),
							borderWidth: 1
						},
					];
					myChart.canvas.parentNode.style.height = '90%';
					myChart.update();
				});
			});
		};
		$scope.loadPage();

		$scope.openFilter = function () {
			messageHub.showDialogWindow("PurchaseOrdersTotalReport-details-filter", {
				action: "filter",
				filter: $scope.filter,
			});
		};


	}]);
