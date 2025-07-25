angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderItemService.ts';
	}])
	.controller('PageController', ($scope, $http, EntityService, Extensions, LocaleService, ButtonStates) => {
		const Dialogs = new DialogHub();
		let translated = {
			yes: 'Yes',
			no: 'No',
			deleteConfirm: 'Are you sure you want to delete SalesOrderItem? This action cannot be undone.',
			deleteTitle: 'Delete SalesOrderItem?'
		};

		LocaleService.onInit(() => {
			translated.yes = LocaleService.t('codbex-orders:defaults.yes');
			translated.no = LocaleService.t('codbex-orders:defaults.no');
			translated.deleteTitle = LocaleService.t('codbex-orders:defaults.deleteTitle', { name: '$t(codbex-orders:t.SALESORDERITEM)' });
			translated.deleteConfirm = LocaleService.t('codbex-orders:messages.deleteConfirm', { name: '$t(codbex-orders:t.SALESORDERITEM)' });
		});
		//-----------------Custom Actions-------------------//
		Extensions.getWindows(['codbex-orders-custom-action']).then((response) => {
			$scope.pageActions = response.data.filter(e => e.perspective === 'SalesOrder' && e.view === 'SalesOrderItem' && (e.type === 'page' || e.type === undefined));
			$scope.entityActions = response.data.filter(e => e.perspective === 'SalesOrder' && e.view === 'SalesOrderItem' && e.type === 'entity');
		});

		$scope.triggerPageAction = (action) => {
			Dialogs.showWindow({
				hasHeader: true,
        		title: LocaleService.t(action.translation.key, action.translation.options, action.label),
				path: action.path,
				params: {
					selectedMainEntityKey: 'SalesOrder',
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
					selectedMainEntityKey: 'SalesOrder',
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
		Dialogs.addMessageListener({ topic: 'codbex-orders.SalesOrder.SalesOrder.entitySelected', handler: (data) => {
			resetPagination();
			$scope.selectedMainEntityId = data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.SalesOrder.SalesOrder.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.SalesOrder.SalesOrderItem.clearDetails', handler: () => {
			$scope.$evalAsync(() => {
				$scope.entity = {};
				$scope.action = 'select';
			});
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.SalesOrder.SalesOrderItem.entityCreated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.SalesOrder.SalesOrderItem.entityUpdated', handler: () => {
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		Dialogs.addMessageListener({ topic: 'codbex-orders.SalesOrder.SalesOrderItem.entitySearch', handler: (data) => {
			resetPagination();
			$scope.filter = data.filter;
			$scope.filterEntity = data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		}});
		//-----------------Events-------------------//

		$scope.loadPage = (pageNumber, filter) => {
			let SalesOrder = $scope.selectedMainEntityId;
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
			filter.$filter.equals.SalesOrder = SalesOrder;
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
						title: LocaleService.t('codbex-orders:t.SALESORDERITEM'),
						message: LocaleService.t('codbex-orders:messages.error.unableToLF', { name: '$t(codbex-orders:t.SALESORDERITEM)', message: message }),
						type: AlertTypes.Error
					});
					console.error('EntityService:', error);
				});
			}, (error) => {
				const message = error.data ? error.data.message : '';
				Dialogs.showAlert({
					title: LocaleService.t('codbex-orders:t.SALESORDERITEM'),
					message: LocaleService.t('codbex-orders:messages.error.unableToCount', { name: '$t(codbex-orders:t.SALESORDERITEM)', message: message }),
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
				id: 'SalesOrderItem-details',
				params: {
					action: 'select',
					entity: entity,
					optionsSalesOrder: $scope.optionsSalesOrder,
					optionsProduct: $scope.optionsProduct,
					optionsUoM: $scope.optionsUoM,
					optionsStatus: $scope.optionsStatus,
				},
			});
		};

		$scope.openFilter = () => {
			Dialogs.showWindow({
				id: 'SalesOrderItem-filter',
				params: {
					entity: $scope.filterEntity,
					optionsSalesOrder: $scope.optionsSalesOrder,
					optionsProduct: $scope.optionsProduct,
					optionsUoM: $scope.optionsUoM,
					optionsStatus: $scope.optionsStatus,
				},
			});
		};

		$scope.createEntity = () => {
			$scope.selectedEntity = null;
			Dialogs.showWindow({
				id: 'SalesOrderItem-details',
				params: {
					action: 'create',
					entity: {
						'SalesOrder': $scope.selectedMainEntityId
					},
					selectedMainEntityKey: 'SalesOrder',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsSalesOrder: $scope.optionsSalesOrder,
					optionsProduct: $scope.optionsProduct,
					optionsUoM: $scope.optionsUoM,
					optionsStatus: $scope.optionsStatus,
				},
				closeButton: false
			});
		};

		$scope.updateEntity = (entity) => {
			Dialogs.showWindow({
				id: 'SalesOrderItem-details',
				params: {
					action: 'update',
					entity: entity,
					selectedMainEntityKey: 'SalesOrder',
					selectedMainEntityId: $scope.selectedMainEntityId,
					optionsSalesOrder: $scope.optionsSalesOrder,
					optionsProduct: $scope.optionsProduct,
					optionsUoM: $scope.optionsUoM,
					optionsStatus: $scope.optionsStatus,
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
						Dialogs.triggerEvent('codbex-orders.SalesOrder.SalesOrderItem.clearDetails');
					}, (error) => {
						const message = error.data ? error.data.message : '';
						Dialogs.showAlert({
							title: LocaleService.t('codbex-orders:t.SALESORDERITEM'),
							message: LocaleService.t('codbex-orders:messages.error.unableToDelete', { name: '$t(codbex-orders:t.SALESORDERITEM)', message: message }),
							type: AlertTypes.Error,
						});
						console.error('EntityService:', error);
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsSalesOrder = [];
		$scope.optionsProduct = [];
		$scope.optionsUoM = [];
		$scope.optionsStatus = [];


		$http.get('/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts').then((response) => {
			$scope.optionsSalesOrder = response.data.map(e => ({
				value: e.Id,
				text: e.Number
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'SalesOrder',
				message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-products/gen/codbex-products/api/Products/ProductService.ts').then((response) => {
			$scope.optionsProduct = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'Product',
				message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-uoms/gen/codbex-uoms/api/UnitsOfMeasures/UoMService.ts').then((response) => {
			$scope.optionsUoM = response.data.map(e => ({
				value: e.Id,
				text: e.Name
			}));
		}, (error) => {
			console.error(error);
			const message = error.data ? error.data.message : '';
			Dialogs.showAlert({
				title: 'UoM',
				message: LocaleService.t('codbex-orders:messages.error.unableToLoad', { message: message }),
				type: AlertTypes.Error
			});
		});

		$http.get('/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/SalesOrderItemStatusService.ts').then((response) => {
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

		$scope.optionsSalesOrderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsSalesOrder.length; i++) {
				if ($scope.optionsSalesOrder[i].value === optionKey) {
					return $scope.optionsSalesOrder[i].text;
				}
			}
			return null;
		};
		$scope.optionsProductValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsProduct.length; i++) {
				if ($scope.optionsProduct[i].value === optionKey) {
					return $scope.optionsProduct[i].text;
				}
			}
			return null;
		};
		$scope.optionsUoMValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsUoM.length; i++) {
				if ($scope.optionsUoM[i].value === optionKey) {
					return $scope.optionsUoM[i].text;
				}
			}
			return null;
		};
		$scope.optionsStatusValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsStatus.length; i++) {
				if ($scope.optionsStatus[i].value === optionKey) {
					return $scope.optionsStatus[i].text;
				}
			}
			return null;
		};
		//----------------Dropdowns-----------------//
	});
