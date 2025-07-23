angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderItemService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseOrderItem successfully created';
		let propertySuccessfullyUpdated = 'PurchaseOrderItem successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseOrderItem Details',
			create: 'Create PurchaseOrderItem',
			update: 'Update PurchaseOrderItem'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-orders:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:defaults.formHeadSelect', { name: '$t(codbex-orders:t.PURCHASEORDERITEM)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:defaults.formHeadCreate', { name: '$t(codbex-orders:t.PURCHASEORDERITEM)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:defaults.formHeadUpdate', { name: '$t(codbex-orders:t.PURCHASEORDERITEM)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:t.PURCHASEORDERITEM)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:t.PURCHASEORDERITEM)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsPurchaseOrder = params.optionsPurchaseOrder;
			$scope.optionsProduct = params.optionsProduct;
			$scope.optionsUoM = params.optionsUoM;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderItem.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDERITEM'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDERITEM'),
					message: LocaleService.t('codbex-orders:messages.error.unableToCreate', { name: '$t(codbex-orders:t.PURCHASEORDERITEM)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderItem.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDERITEM'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDERITEM'),
					message: LocaleService.t('codbex-orders:messages.error.unableToUpdate', { name: '$t(codbex-orders:t.PURCHASEORDERITEM)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.servicePurchaseOrder = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts';
		$scope.serviceProduct = '/services/ts/codbex-products/gen/codbex-products/api/Products/ProductService.ts';
		$scope.serviceUoM = '/services/ts/codbex-uoms/gen/codbex-uoms/api/UnitsOfMeasures/UoMService.ts';

		$scope.$watch('entity.Product', function (newValue, oldValue) {
			if (newValue !== undefined && newValue !== null) {
				$http.get($scope.serviceProduct + '/' + newValue).then((response) => {
					let valueFrom = response.data.BaseUnit;
					$http.post('/services/ts/codbex-uoms/gen/codbex-uoms/api/UnitsOfMeasures/UoMService.ts/search', {
						$filter: {
							equals: {
								Id: valueFrom
							}
						}
					}).then((response) => {
						$scope.optionsUoM = response.data.map(e => ({
							value: e.Id,
							text: e.Name
						}));
						if ($scope.action !== 'select' && newValue !== oldValue) {
							if ($scope.optionsUoM.length == 1) {
								$scope.entity.UoM = $scope.optionsUoM[0].value;
							} else {
								$scope.entity.UoM = undefined;
							}
						}
					}, (error) => {
						console.error(error);
					});
				}, (error) => {
					console.error(error);
				});
			}
		});

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
			Dialogs.closeWindow({ id: 'PurchaseOrderItem-details' });
		};
	});