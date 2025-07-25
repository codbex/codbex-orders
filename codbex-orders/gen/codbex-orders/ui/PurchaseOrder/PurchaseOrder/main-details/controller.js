angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(["EntityServiceProvider", (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts';
	}])
	.controller('PageController', ($scope, $http, Extensions, LocaleService, EntityService) => {
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
			description = LocaleService.t('codbex-orders:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:defaults.formHeadSelect', { name: '$t(codbex-orders:t.PURCHASEORDER)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:defaults.formHeadCreate', { name: '$t(codbex-orders:t.PURCHASEORDER)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:defaults.formHeadUpdate', { name: '$t(codbex-orders:t.PURCHASEORDER)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:t.PURCHASEORDER)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:t.PURCHASEORDER)' });
		});

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-orders-custom-action']).then((response) => {
			$scope.entityActions = response.data.filter(e => e.perspective === 'PurchaseOrder' && e.view === 'PurchaseOrder' && e.type === 'entity');
		});

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsSupplier = [];
				$scope.optionsCurrency = [];
				$scope.optionsPaymentMethod = [];
				$scope.optionsSentMethod = [];
				$scope.optionsStatus = [];
				$scope.optionsOperator = [];
				$scope.optionsCompany = [];
				$scope.optionsStore = [];
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entitySelected', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Due) {
					data.entity.Due = new Date(data.entity.Due);
				}
				$scope.entity = data.entity;
				$scope.optionsSupplier = data.optionsSupplier;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.optionsSentMethod = data.optionsSentMethod;
				$scope.optionsStatus = data.optionsStatus;
				$scope.optionsOperator = data.optionsOperator;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsStore = data.optionsStore;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.createEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.optionsSupplier = data.optionsSupplier;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.optionsSentMethod = data.optionsSentMethod;
				$scope.optionsStatus = data.optionsStatus;
				$scope.optionsOperator = data.optionsOperator;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsStore = data.optionsStore;
				$scope.action = 'create';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.updateEntity', handler: (data) => {
			$scope.$evalAsync(() => {
				if (data.entity.Date) {
					data.entity.Date = new Date(data.entity.Date);
				}
				if (data.entity.Due) {
					data.entity.Due = new Date(data.entity.Due);
				}
				$scope.entity = data.entity;
				$scope.optionsSupplier = data.optionsSupplier;
				$scope.optionsCurrency = data.optionsCurrency;
				$scope.optionsPaymentMethod = data.optionsPaymentMethod;
				$scope.optionsSentMethod = data.optionsSentMethod;
				$scope.optionsStatus = data.optionsStatus;
				$scope.optionsOperator = data.optionsOperator;
				$scope.optionsCompany = data.optionsCompany;
				$scope.optionsStore = data.optionsStore;
				$scope.action = 'update';
			});
		}});

		$scope.serviceSupplier = '/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts';
		$scope.serviceCurrency = '/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts';
		$scope.servicePaymentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts';
		$scope.serviceSentMethod = '/services/ts/codbex-methods/gen/codbex-methods/api/Methods/SentMethodService.ts';
		$scope.serviceStatus = '/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/PurchaseOrderStatusService.ts';
		$scope.serviceOperator = '/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts';
		$scope.serviceCompany = '/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts';
		$scope.serviceStore = '/services/ts/codbex-inventory/gen/codbex-inventory/api/Stores/StoreService.ts';

		//-----------------Events-------------------//

		$scope.create = () => {
			EntityService.create($scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entityCreated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails' , data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDER'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDER'),
					message: LocaleService.t('codbex-orders:messages.error.unableToCreate', { name: '$t(codbex-orders:t.PURCHASEORDER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			EntityService.update($scope.entity.Id, $scope.entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entityUpdated', data: response.data });
				Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDER'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDER'),
					message: LocaleService.t('codbex-orders:messages.error.unableToCreate', { name: '$t(codbex-orders:t.PURCHASEORDER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.cancel = () => {
			Dialogs.triggerEvent('codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails');
		};
		
		//-----------------Dialogs-------------------//
		$scope.alert = (message) => {
			if (message) Dialogs.showAlert({
				title: description,
				message: message,
				type: AlertTypes.Information,
				preformatted: true,
			});
		};
		
		$scope.createSupplier = () => {
			Dialogs.showWindow({
				id: 'Supplier-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCurrency = () => {
			Dialogs.showWindow({
				id: 'Currency-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createPaymentMethod = () => {
			Dialogs.showWindow({
				id: 'PaymentMethod-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createSentMethod = () => {
			Dialogs.showWindow({
				id: 'SentMethod-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createStatus = () => {
			Dialogs.showWindow({
				id: 'PurchaseOrderStatus-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createOperator = () => {
			Dialogs.showWindow({
				id: 'Employee-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createCompany = () => {
			Dialogs.showWindow({
				id: 'Company-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};
		$scope.createStore = () => {
			Dialogs.showWindow({
				id: 'Store-details',
				params: {
					action: 'create',
					entity: {},
				},
				closeButton: false
			});
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshSupplier = () => {
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
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCurrency = () => {
			$scope.optionsCurrency = [];
			$http.get('/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts').then((response) => {
				$scope.optionsCurrency = response.data.map(e => ({
					value: e.Id,
					text: e.Code
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'Currency',
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshPaymentMethod = () => {
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
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshSentMethod = () => {
			$scope.optionsSentMethod = [];
			$http.get('/services/ts/codbex-methods/gen/codbex-methods/api/Methods/SentMethodService.ts').then((response) => {
				$scope.optionsSentMethod = response.data.map(e => ({
					value: e.Id,
					text: e.Name
				}));
			}, (error) => {
				console.error(error);
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: 'SentMethod',
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshStatus = () => {
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
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshOperator = () => {
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
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshCompany = () => {
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
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};
		$scope.refreshStore = () => {
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
					message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
					type: AlertTypes.Error
				});
			});
		};

		//----------------Dropdowns-----------------//	
	});