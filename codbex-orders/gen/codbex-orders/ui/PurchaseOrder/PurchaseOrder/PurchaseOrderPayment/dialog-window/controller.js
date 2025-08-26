angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderPaymentService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseOrderPayment successfully created';
		let propertySuccessfullyUpdated = 'PurchaseOrderPayment successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseOrderPayment Details',
			create: 'Create PurchaseOrderPayment',
			update: 'Update PurchaseOrderPayment'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-orders:codbex-orders-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadSelect', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadCreate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsPurchaseOrder = params.optionsPurchaseOrder;
			$scope.optionsSupplierPayment = params.optionsSupplierPayment;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderPayment.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT'),
					message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToCreate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderPayment.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT'),
					message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDERPAYMENT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.servicePurchaseOrder = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts';
		$scope.serviceSupplierPayment = '/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentService.ts';

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
			Dialogs.closeWindow({ id: 'PurchaseOrderPayment-details' });
		};
	});