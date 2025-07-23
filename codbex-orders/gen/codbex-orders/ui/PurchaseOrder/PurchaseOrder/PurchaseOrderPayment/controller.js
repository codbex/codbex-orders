angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderPaymentService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete PurchaseOrderPayment? This action cannot be undone.',
			deleteTitle: 'Delete PurchaseOrderPayment?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-orders:defaults.yes');
			translated.no = LocaleService.t('codbex-orders:defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-orders:defaults.deleteTitle', { name: '$t(codbex-orders:t.PURCHASEORDERPAYMENT)' });
			translated.deleteConfirm = LocaleService.t('codbex-orders:messages.deleteConfirm', { name: '$t(codbex-orders:t.PURCHASEORDERPAYMENT)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-orders-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'PurchaseOrder' && e.view === 'PurchaseOrderPayment' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'PurchaseOrder' && e.view === 'PurchaseOrderPayment' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'PurchaseOrder',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				maxWidth: action.maxWidth,
				maxHeight: action.maxHeight,
				closeButton: true
			});
		};

		$scope.triggerEntityAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					id: $scope.entity.Id,
					selectedMainEntityKey: 'PurchaseOrder',
					selectedMainEntityId: $scope.selectedMainEntityId,
				},
				closeButton: true
			});
		};
		//-----------------Custom Actions-------------------//

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderPayment.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderPayment.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderPayment.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.PurchaseOrder.PurchaseOrderPayment.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let PurchaseOrder = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			if (!filter && $scope.filter) {
				filter = $scope.filter;
			}
			if (!filter) {
				filter = {};
			}
			if (!filter.$filter) {
				filter.$filter = {};
			}
			if (!filter.$filter.equals) {
				filter.$filter.equals = {};
			}
			filter.$filter.equals.PurchaseOrder = PurchaseOrder;
			EntityService.count(filter).then((resp) => {
				if (resp.data) {
					$scope.dataCount = resp.data.count;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				EntityService.search(filter).then((response) => {
					$scope.data = response.data;
				}, (error) => {
					const message = error.data ? error.data.message : '';
					Dialogs.showAlert({
						title: LocaleService.t('codbex-orders:t.PURCHASEORDERPAYMENT'),
						message: LocaleService.t('codbex-orders:messages.error.unableToLF', { name: '$t(codbex-orders:t.PURCHASEORDERPAYMENT)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDERPAYMENT'),
					message: LocaleService.t('codbex-orders:messages.error.unableToCount', { name: '$t(codbex-orders:t.PURCHASEORDERPAYMENT)', message: message }),
					type: AlertTypes.Error
				});
				console.error('EntityService:', error);
			});
		};

		$scope.selectEntity = (entity) => {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = (entity) => {
			$scope.selectedEntity = entity;
			Dialogs.showWindow({
				id: 'PurchaseOrderPayment-details',
				params: {
					action: 'select',
					entity: entity,
					optionsPurchaseOrder: $scope.optionsPurchaseOrder,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'PurchaseOrderPayment-filter',
				params: {
					entity: $scope.filterEntity,
					optionsPurchaseOrder: $scope.optionsPurchaseOrder,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'PurchaseOrderPayment-details',
				params: {
					action: 'create',
					entity: {
						'PurchaseOrder': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'PurchaseOrder',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsPurchaseOrder: $scope.optionsPurchaseOrder,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'PurchaseOrderPayment-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'PurchaseOrder',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsPurchaseOrder: $scope.optionsPurchaseOrder,
					optionsSupplierPayment: $scope.optionsSupplierPayment,
			},
				closeButton: false
			});
		};

		$scope.deleteEntity = (entity) => {
			let id = entity.Id;
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
						$scope.loadPage($scope.dataPage, $scope.filter);
						Dialogs.triggerEvent('codbex-orders.PurchaseOrder.PurchaseOrderPayment.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-orders:t.PURCHASEORDERPAYMENT'),
							message: LocaleService.t('codbex-orders:messages.error.unableToDelete', { name: '$t(codbex-orders:t.PURCHASEORDERPAYMENT)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsPurchaseOrder = [];
		$scope.optionsSupplierPayment = [];


		$http.get('/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts').then((response) => {
			$scope.optionsPurchaseOrder = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'PurchaseOrder',
				message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentService.ts').then((response) => {
			$scope.optionsSupplierPayment = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SupplierPayment',
				message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$scope.optionsPurchaseOrderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsPurchaseOrder.length; i++) {
				if ($scope.optionsPurchaseOrder[i].value === optionKey) {
					return $scope.optionsPurchaseOrder[i].text;
				}
			}
			return null;
		};
		$scope.optionsSupplierPaymentValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSupplierPayment.length; i++) {
				if ($scope.optionsSupplierPayment[i].value === optionKey) {
					return $scope.optionsSupplierPayment[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
