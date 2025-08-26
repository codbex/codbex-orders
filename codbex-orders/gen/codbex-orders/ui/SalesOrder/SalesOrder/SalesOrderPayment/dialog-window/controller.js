angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderPaymentService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'SalesOrderPayment successfully created';
		let propertySuccessfullyUpdated = 'SalesOrderPayment successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'SalesOrderPayment Details',
			create: 'Create SalesOrderPayment',
			update: 'Update SalesOrderPayment'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-orders:codbex-orders-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadSelect', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadCreate', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsSalesOrder = params.optionsSalesOrder;
			$scope.optionsCustomerPayment = params.optionsCustomerPayment;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.SalesOrder.SalesOrderPayment.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT'),
					message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToCreate', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT)', message: message }),
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
				Dialogs.postMessage({ topic: 'codbex-orders.SalesOrder.SalesOrderPayment.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT'),
					message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.SALESORDERPAYMENT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceSalesOrder = '/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts';
		$scope.serviceCustomerPayment = '/services/ts/codbex-payments/gen/codbex-payments/api/CustomerPayment/CustomerPaymentService.ts';

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
			Dialogs.closeWindow({ id: 'SalesOrderPayment-details' });
		};
	});