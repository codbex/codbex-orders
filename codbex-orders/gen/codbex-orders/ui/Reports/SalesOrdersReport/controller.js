angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/Reports/SalesOrdersReportService.ts';
	}])
	.controller('PageController', ($scope,, EntityService, LocaleService) => {
		const Dialogs = new DialogHub();

		$scope.filter = {};

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 20;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-orders.Reports.SalesOrdersReport.filter', handler: (data) => {
			$scope.filter = data;
			$scope.loadPage(1);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber) => {
			const listFilter = {
				$offset: (pageNumber - 1) * $scope.dataLimit,
				$limit: $scope.dataLimit,
				...$scope.filter
			};
			$scope.dataPage = pageNumber;
			EntityService.count($scope.filter).then((resp) => {
				$scope.dataCount = resp.data.count;
				EntityService.list(listFilter).then((response) => {
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Due) {
							e.Due = new Date(e.Due);
						}
					});

					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({ title: LocaleService.t('codbex-orders:codbex-orders-model.t.ORDERSREPORT'), message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLF', { name: '$t(codbex-orders:codbex-orders-model.t.ORDERSREPORT)', message: message }), type: AlertTypes.Error });
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlertError({ title: LocaleService.t('codbex-orders:codbex-orders-model.t.ORDERSREPORT'), message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToCount', { name: '$t(codbex-orders:codbex-orders-model.t.ORDERSREPORT)', message: message }), type: AlertTypes.Error });
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'SalesOrdersReport-details',
				params: {
					action: 'select',
					entity: entity,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'SalesOrdersReport-details-filter',
				params: {
					action: 'filter',
					filter: $scope.filter,
				}
			});
		};

	});