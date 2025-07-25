angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/Settings/PurchaseOrderStatusService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'PurchaseOrderStatus successfully created';
		let propertySuccessfullyUpdated = 'PurchaseOrderStatus successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'PurchaseOrderStatus Details',
			create: 'Create PurchaseOrderStatus',
			update: 'Update PurchaseOrderStatus'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-orders:defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:defaults.formHeadSelect', { name: '$t(codbex-orders:t.PURCHASEORDERSTATUS)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:defaults.formHeadCreate', { name: '$t(codbex-orders:t.PURCHASEORDERSTATUS)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:defaults.formHeadUpdate', { name: '$t(codbex-orders:t.PURCHASEORDERSTATUS)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:t.PURCHASEORDERSTATUS)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:t.PURCHASEORDERSTATUS)' });
		});

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
		}

		$scope.create = () => {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.create(entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.Settings.PurchaseOrderStatus.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDERSTATUS'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-orders:messages.error.unableToCreate', { name: '$t(codbex-orders:t.PURCHASEORDERSTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.Settings.PurchaseOrderStatus.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:t.PURCHASEORDERSTATUS'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-orders:messages.error.unableToUpdate', { name: '$t(codbex-orders:t.PURCHASEORDERSTATUS)', message: message });
				});
				console.error('EntityService:', error);
			});
		};


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
			Dialogs.closeWindow({ id: 'PurchaseOrderStatus-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});