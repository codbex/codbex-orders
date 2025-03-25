angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.WorkOrder.WorkOrder';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/codbex-orders/api/WorkOrder/WorkOrderService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'messageHub', 'ViewParameters', 'entityApi', function ($scope,  $http, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "WorkOrder Details",
			create: "Create WorkOrder",
			update: "Update WorkOrder"
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
			$scope.optionsPaymentMethod = params.optionsPaymentMethod;
			$scope.optionsSentMethod = params.optionsSentMethod;
			$scope.optionsStatus = params.optionsStatus;
			$scope.optionsOperator = params.optionsOperator;
			$scope.optionsCompany = params.optionsCompany;
			$scope.optionsWorker = params.optionsWorker;
			$scope.optionsSalesOrder = params.optionsSalesOrder;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					$scope.errorMessage = `Unable to create WorkOrder: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("WorkOrder", "WorkOrder successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					$scope.errorMessage = `Unable to update WorkOrder: '${response.message}'`;
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("WorkOrder", "WorkOrder successfully updated");
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
					text: e.Name
				}
			});
		});
		$scope.servicePaymentMethod = "/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts";
		
		$scope.optionsPaymentMethod = [];
		
		$http.get("/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts").then(function (response) {
			$scope.optionsPaymentMethod = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
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
		$scope.serviceStatus = "/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/WorkOrderStatusService.ts";
		
		$scope.optionsStatus = [];
		
		$http.get("/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/WorkOrderStatusService.ts").then(function (response) {
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
		$scope.serviceWorker = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		
		$scope.optionsWorker = [];
		
		$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts").then(function (response) {
			$scope.optionsWorker = response.data.map(e => {
				return {
					value: e.Id,
					text: e.FirstName
				}
			});
		});
		$scope.serviceSalesOrder = "/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts";
		
		$scope.optionsSalesOrder = [];
		
		$http.get("/services/ts/codbex-orders/gen/codbex-orders/api/SalesOrder/SalesOrderService.ts").then(function (response) {
			$scope.optionsSalesOrder = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("WorkOrder-details");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);