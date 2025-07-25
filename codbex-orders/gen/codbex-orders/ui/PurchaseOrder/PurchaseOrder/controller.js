angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete PurchaseOrder? This action cannot be undone.',
			deleteTitle: 'Delete PurchaseOrder?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-orders:defaults.yes');
			translated.no = LocaleService.t('codbex-orders:defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-orders:defaults.deleteTitle', { name: '$t(codbex-orders:t.PURCHASEORDER)' });
			translated.deleteConfirm = LocaleService.t('codbex-orders:messages.deleteConfirm', { name: '$t(codbex-orders:t.PURCHASEORDER)' });
		});
		$scope.dataPage = 1;
		$scope.dataCount = 0;
		$scope.dataOffset = 0;
		$scope.dataLimit = 10;
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-orders-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'PurchaseOrder' && e.view === 'PurchaseOrder' && (e.type === 'page' || e.type === undefined));
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function refreshData() {
			$scope.dataReset = true;
			$scope.dataPage--;
		}

		function resetPagination() {
			$scope.dataReset = true;
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.selectedEntity = null;
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entityCreated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entityUpdated', handler: () => {
			refreshData();
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			$scope.selectedEntity = null;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				$scope.dataPages = Math.ceil($scope.dataCount / $scope.dataLimit);
				filter.$offset = ($scope.dataPage - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				if ($scope.dataReset) {
					filter.$offset = 0;
					filter.$limit = $scope.dataPage * $scope.dataLimit;
				}

				EntityService.search(filter).then((response) => {
					if ($scope.data == null || $scope.dataReset) {
						$scope.data = [];
						$scope.dataReset = false;
					}
					response.data.forEach(e => {
						if (e.Date) {
							e.Date = new Date(e.Date);
						}
						if (e.Due) {
							e.Due = new Date(e.Due);
						}
					});

					$scope.data = $scope.data.concat(response.data);
					$scope.dataPage++;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-orders:t.PURCHASEORDER'),
						message: LocaleService.t('codbex-orders:messages.error.unableToLF', { name: '$t(codbex-orders:t.PURCHASEORDER)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDER'),
					message: LocaleService.t('codbex-orders:messages.error.unableToCount', { name: '$t(codbex-orders:t.PURCHASEORDER)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};
		$scope.loadPage($scope.dataPage, $scope.filter);

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entitySelected', data: {
				entity: entity,
				selectedMainEntityId: entity.Id,
				optionsSupplier: $scope.optionsSupplier,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
				optionsStore: $scope.optionsStore,
			}});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			$scope.action = 'create';

			Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.createEntity', data: {
				entity: {},
				optionsSupplier: $scope.optionsSupplier,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
				optionsStore: $scope.optionsStore,
			}});
		};

		$scope.updateEntity = () => {
			$scope.action = 'update';
			Dialogs.postMessage({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.updateEntity', data: {
				entity: $scope.selectedEntity,
				optionsSupplier: $scope.optionsSupplier,
				optionsCurrency: $scope.optionsCurrency,
				optionsPaymentMethod: $scope.optionsPaymentMethod,
				optionsSentMethod: $scope.optionsSentMethod,
				optionsStatus: $scope.optionsStatus,
				optionsOperator: $scope.optionsOperator,
				optionsCompany: $scope.optionsCompany,
				optionsStore: $scope.optionsStore,
			}});
		};

		$scope.deleteEntity = () => {
			let id = $scope.selectedEntity.Id;
			Dialogs.showDialog({
				title: translated.deleteTitle,
				message: translated.deleteConfirm,
				buttons: [{
					id: 'delete-btn-yes',
					state: ButtonStates.Emphasized,
					label: translated.yes,
				}, {
					id: 'delete-btn-no',
					label: translated.no,
				}],
				closeButton: false
			}).then((buttonId) => {
				if (buttonId === 'delete-btn-yes') {
					EntityService.delete(id).then(() => {
						refreshData();
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-orders:t.PURCHASEORDER'),
							message: LocaleService.t('codbex-orders:messages.error.unableToDelete', { name: '$t(codbex-orders:t.PURCHASEORDER)', message: message }),
							type: AlertTypes.Error
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'PurchaseOrder-filter',
				params: {
					entity: $scope.filterEntity,
					optionsSupplier: $scope.optionsSupplier,
					optionsCurrency: $scope.optionsCurrency,
					optionsPaymentMethod: $scope.optionsPaymentMethod,
					optionsSentMethod: $scope.optionsSentMethod,
					optionsStatus: $scope.optionsStatus,
					optionsOperator: $scope.optionsOperator,
					optionsCompany: $scope.optionsCompany,
					optionsStore: $scope.optionsStore,
				},
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsSupplier = [];
		$scope.optionsCurrency = [];
		$scope.optionsPaymentMethod = [];
		$scope.optionsSentMethod = [];
		$scope.optionsStatus = [];
		$scope.optionsOperator = [];
		$scope.optionsCompany = [];
		$scope.optionsStore = [];


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

		$scope.optionsSupplierValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsSupplier.length; i++) {
				if ($scope.optionsSupplier[i].value === optionKey) {
					return $scope.optionsSupplier[i].text;
				}
			}
			return null;
		};
		$scope.optionsCurrencyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCurrency.length; i++) {
				if ($scope.optionsCurrency[i].value === optionKey) {
					return $scope.optionsCurrency[i].text;
				}
			}
			return null;
		};
		$scope.optionsPaymentMethodValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsPaymentMethod.length; i++) {
				if ($scope.optionsPaymentMethod[i].value === optionKey) {
					return $scope.optionsPaymentMethod[i].text;
				}
			}
			return null;
		};
		$scope.optionsSentMethodValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsSentMethod.length; i++) {
				if ($scope.optionsSentMethod[i].value === optionKey) {
					return $scope.optionsSentMethod[i].text;
				}
			}
			return null;
		};
		$scope.optionsStatusValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsStatus.length; i++) {
				if ($scope.optionsStatus[i].value === optionKey) {
					return $scope.optionsStatus[i].text;
				}
			}
			return null;
		};
		$scope.optionsOperatorValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsOperator.length; i++) {
				if ($scope.optionsOperator[i].value === optionKey) {
					return $scope.optionsOperator[i].text;
				}
			}
			return null;
		};
		$scope.optionsCompanyValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsCompany.length; i++) {
				if ($scope.optionsCompany[i].value === optionKey) {
					return $scope.optionsCompany[i].text;
				}
			}
			return null;
		};
		$scope.optionsStoreValue = (optionKey) => {
			for (let i = 0; i < $scope.optionsStore.length; i++) {
				if ($scope.optionsStore[i].value === optionKey) {
					return $scope.optionsStore[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
