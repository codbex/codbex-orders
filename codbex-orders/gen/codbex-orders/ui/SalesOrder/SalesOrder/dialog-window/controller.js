angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.SalesOrder.SalesOrder';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "SalesOrder Details",
			create: "Create SalesOrder",
			update: "Update SalesOrder"
		};
		$scope.action = 'select';

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
			$scope.optionsCustomer = params.optionsCustomer;
			$scope.optionsCurrency = params.optionsCurrency;
			$scope.optionsSentMethod = params.optionsSentMethod;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsOperator = params.optionsOperator;
			$scope.optionsCompany = params.optionsCompany;
			$scope.optionsStore = params.optionsStore;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create SalesOrder: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("SalesOrder", "SalesOrder successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update SalesOrder: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("SalesOrder", "SalesOrder successfully updated");
			});
		};

		$scope.serviceCustomer = "/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts";
		
		$scope.optionsCustomer = [];
		
		$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/Customers/CustomerService.ts").then(function (response) {
			$scope.optionsCustomer = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";
		
		$scope.optionsCurrency = [];
		
		$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts").then(function (response) {
			$scope.optionsCurrency = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Code
				}
			});
		});
		$scope.serviceSentMethod = "/services/ts/codbex-methods/gen/codbex-methods/api/Methods/SentMethodService.ts";
		
		$scope.optionsSentMethod = [];
		
		$http.get("/services/ts/codbex-methods/gen/codbex-methods/api/Methods/SentMethodService.ts").then(function (response) {
			$scope.optionsSentMethod = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceStatus = "/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/SalesOrderStatusService.ts";
		
		$scope.optionsStatus = [];
		
		$http.get("/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/SalesOrderStatusService.ts").then(function (response) {
			$scope.optionsStatus = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceOperator = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		
		$scope.optionsOperator = [];
		
		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts").then(function (response) {
			$scope.optionsOperator = response.data.map(e => {
				return {
					value: e.Id,
					text: e.FirstName
				}
			});
		});
		$scope.serviceCompany = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts";
		
		$scope.optionsCompany = [];
		
		$http.get("/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts").then(function (response) {
			$scope.optionsCompany = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.serviceStore = "/services/ts/codbex-inventory/gen/codbex-inventory/api/Stores/StoreService.ts";
		
		$scope.optionsStore = [];
		
		$http.get("/services/ts/codbex-inventory/gen/codbex-inventory/api/Stores/StoreService.ts").then(function (response) {
			$scope.optionsStore = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("SalesOrder-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);