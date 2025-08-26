angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseOrder successfully created';
		let propertySuccessfullyUpdated = 'PurchaseOrder successfully updated';
		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseOrder Details',
			create: 'Create PurchaseOrder',
			update: 'Update PurchaseOrder'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-orders:codbex-orders-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadSelect', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDER)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadCreate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDER)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDER)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDER)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDER)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			if (params.entity.Date) {
				params.entity.Date = new Date(params.entity.Date);
			}
			if (params.entity.Due) {
				params.entity.Due = new Date(params.entity.Due);
			}
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsSupplier = params.optionsSupplier;
			$scope.optionsSentMethod = params.optionsSentMethod;
			$scope.optionsCurrency = params.optionsCurrency;
			$scope.optionsPaymentMethod = params.optionsPaymentMethod;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsOperator = params.optionsOperator;
			$scope.optionsCompany = params.optionsCompany;
			$scope.optionsStore = params.optionsStore;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.PURCHASEORDER'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToCreate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDER)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entityUpdated', data: response.data });
				$scope.cancel();
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.PURCHASEORDER'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.PURCHASEORDER)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.serviceSupplier = '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts';
		
		$scope.optionsSupplier = [];
		
		$http.get('/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts').then((response) => {
			$scope.optionsSupplier = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Supplier',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceSentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodService.ts';
		
		$scope.optionsSentMethod = [];
		
		$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Settings/SentMethodService.ts').then((response) => {
			$scope.optionsSentMethod = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SentMethod',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts';
		
		$scope.optionsCurrency = [];
		
		$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Settings/CurrencyService.ts').then((response) => {
			$scope.optionsCurrency = response.data.map(e => ({
				value: e.Id,
				text: e.Code
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Currency',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.servicePaymentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts';
		
		$scope.optionsPaymentMethod = [];
		
		$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts').then((response) => {
			$scope.optionsPaymentMethod = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PaymentMethod',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceStatus = '/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/PurchaseOrderStatusService.ts';
		
		$scope.optionsStatus = [];
		
		$http.get('/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/PurchaseOrderStatusService.ts').then((response) => {
			$scope.optionsStatus = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Status',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceOperator = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		
		$scope.optionsOperator = [];
		
		$http.get('/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts').then((response) => {
			$scope.optionsOperator = response.data.map(e => ({
				value: e.Id,
				text: e.FirstName
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Operator',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';
		
		$scope.optionsCompany = [];
		
		$http.get('/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts').then((response) => {
			$scope.optionsCompany = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Company',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});
		$scope.serviceStore = '/services/ts/codbex-inventory/gen/codbex-inventory/api/Stores/StoreService.ts';
		
		$scope.optionsStore = [];
		
		$http.get('/services/ts/codbex-inventory/gen/codbex-inventory/api/Stores/StoreService.ts').then((response) => {
			$scope.optionsStore = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Store',
				message: LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
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
			Dialogs.closeWindow({ id: 'PurchaseOrder-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});