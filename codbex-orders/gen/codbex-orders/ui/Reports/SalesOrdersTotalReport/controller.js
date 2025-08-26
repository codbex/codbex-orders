angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/Reports/SalesOrdersTotalReportService.ts';
	}])
	.controller('PageController', ($scope, EntityService, LocaleService) => {
		const Dialogs = new DialogHub();
		$scope.filter = {};

		const ctx = document.getElementById('myChart');
		const myChart = new Chart(ctx, {
			data: {
				labels: [],
				datasets: []
			}
		});

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-orders.Reports.SalesOrdersTotalReport.filter', handler: (data) => {
			$scope.filter = data;
			$scope.loadPage();
		}});
		//-----------------Events-------------------//

		$scope.loadPage = () => {
			EntityService.count($scope.filter).then((resp) => {
				$scope.dataCount = resp.data.count;
				EntityService.list($scope.filter).then((response) => {
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
					});

					$scope.data = response.data;
					myChart.data.labels = $scope.data.map(e => e.Date);
					myChart.data.datasets = [
						{
							label: LocaleService.t('codbex-orders:codbex-orders-model.t.SALESORDERSTOTALREPORT_TOTAL', 'Total'),
							data: $scope.data.map(e => e.Total),
							borderWidth: 1
						},
					];
					myChart.canvas.parentNode.style.height = '90%';
					myChart.update();
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-orders:codbex-orders-model.t.SALESORDERSTOTALREPORT'),
						message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLF', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERSTOTALREPORT)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.SALESORDERSTOTALREPORT'),
					message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToCount', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERSTOTALREPORT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage();

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'SalesOrdersTotalReport-details-filter',
				params: {
					action: 'filter',
					filter: $scope.filter,
				},
			});
		};

	});