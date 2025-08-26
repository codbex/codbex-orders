angular.module('page', ['blimpKit', 'platformView', 'platformLocale', 'EntityService'])
	.config(['EntityServiceProvider', (EntityServiceProvider) => {
		EntityServiceProvider.baseUrl = '/services/ts/codbex-orders/gen/codbex-orders/api/Settings/ShippingProviderService.ts';
	}])
	.controller('PageController', ($scope, $http, ViewParameters, LocaleService, EntityService) => {
		const Dialogs = new DialogHub();
		const Notifications = new NotificationHub();
		let description = 'Description';
		let propertySuccessfullyCreated = 'ShippingProvider successfully created';
		let propertySuccessfullyUpdated = 'ShippingProvider successfully updated';

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: 'ShippingProvider Details',
			create: 'Create ShippingProvider',
			update: 'Update ShippingProvider'
		};
		$scope.action = 'select';

		LocaleService.onInit(() => {
			description = LocaleService.t('codbex-orders:codbex-orders-model.defaults.description');
			$scope.formHeaders.select = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadSelect', { name: '$t(codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER)' });
			$scope.formHeaders.create = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadCreate', { name: '$t(codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER)' });
			$scope.formHeaders.update = LocaleService.t('codbex-orders:codbex-orders-model.defaults.formHeadUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER)' });
			propertySuccessfullyCreated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyCreated', { name: '$t(codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER)' });
			propertySuccessfullyUpdated = LocaleService.t('codbex-orders:codbex-orders-model.messages.propertySuccessfullyUpdated', { name: '$t(codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER)' });
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
				Dialogs.postMessage({ topic: 'codbex-orders.Settings.ShippingProvider.entityCreated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER'),
					description: propertySuccessfullyCreated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToCreate', { name: '$t(codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER)', message: message });
				});
				console.error('EntityService:', error);
			});
		};

		$scope.update = () => {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			EntityService.update(id, entity).then((response) => {
				Dialogs.postMessage({ topic: 'codbex-orders.Settings.ShippingProvider.entityUpdated', data: response.data });
				Notifications.show({
					title: LocaleService.t('codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER'),
					description: propertySuccessfullyUpdated,
					type: 'positive'
				});
				$scope.cancel();
			}, (error) => {
				const message = error.data ? error.data.message : '';
				$scope.$evalAsync(() => {
					$scope.errorMessage = LocaleService.t('codbex-orders:codbex-orders-model.messages.error.unableToUpdate', { name: '$t(codbex-orders:codbex-orders-model.t.SHIPPINGPROVIDER)', message: message });
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
			Dialogs.closeWindow({ id: 'ShippingProvider-details' });
		};

		$scope.clearErrorMessage = () => {
			$scope.errorMessage = null;
		};
	});