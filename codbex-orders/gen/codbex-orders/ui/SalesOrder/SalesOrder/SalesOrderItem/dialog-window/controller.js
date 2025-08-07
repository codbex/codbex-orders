angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderItemService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'SalesOrderItem successfully created';
		let propertySuccessfullyUpdated = 'SalesOrderItem successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'SalesOrderItem Details',
			create: 'Create SalesOrderItem',
			update: 'Update SalesOrderItem'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-orders:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:defaults.formHeadSelect', { name: '$t(codbex-orders:t.SALESORDERITEM)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:defaults.formHeadCreate', { name: '$t(codbex-orders:t.SALESORDERITEM)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:defaults.formHeadUpdate', { name: '$t(codbex-orders:t.SALESORDERITEM)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:t.SALESORDERITEM)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:t.SALESORDERITEM)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsSalesOrder = params.optionsSalesOrder;
			$scope.optionsProduct = params.optionsProduct;
			$scope.optionsUoM = params.optionsUoM;
			$scope.optionsStatus = params.optionsStatus;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.SalesOrder.SalesOrderItem.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.SALESORDERITEM'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.SALESORDERITEM'),
					message: LocaleService.t('codbex-orders:messages.error.unableToCreate', { name: '$t(codbex-orders:t.SALESORDERITEM)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.SalesOrder.SalesOrderItem.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.SALESORDERITEM'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.SALESORDERITEM'),
					message: LocaleService.t('codbex-orders:messages.error.unableToUpdate', { name: '$t(codbex-orders:t.SALESORDERITEM)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceSalesOrder = '/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts';
		$scope.serviceProduct = '/services/ts/codbex-products/gen/codbex-products/api/Products/ProductService.ts';
		$scope.serviceUoM = '/services/ts/codbex-uoms/gen/codbex-uoms/api/Settings/UoMService.ts';
		$scope.serviceStatus = '/services/ts/codbex-orders/gen/codbex-orders/api/entities/SalesOrderItemStatusService.ts';

		$scope.$watch('entity.Product', function (newValue, oldValue) {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.serviceProduct + '/' + newValue).then((response) => {
					let valueFrom = response.data.Price;
					$scope.entity.Price = valueFrom;
				}, (error) => {
					console.error(error);
				});
			}
		});

		$scope.$watch('entity.Product', function (newValue, oldValue) {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.serviceProduct + '/' + newValue).then((response) => {
					let valueFrom = response.data.VATRate;
					$scope.entity.VATRate = valueFrom;
				}, (error) => {
					console.error(error);
				});
			}
		});

		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};

		$scope.cancel = () => {
			$scope.entity = {};
			$scope.action = 'select';
			Dialogs.closeWindow({ id: 'SalesOrderItem-details' });
		};
	});