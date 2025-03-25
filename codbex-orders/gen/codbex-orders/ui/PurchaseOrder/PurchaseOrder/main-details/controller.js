angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.PurchaseOrder.PurchaseOrder';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "PurchaseOrder Details",
			create: "Create PurchaseOrder",
			update: "Update PurchaseOrder"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-orders-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "PurchaseOrder" && e.view === "PurchaseOrder" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
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
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.Due) {
					msg.data.entity.Due = new Date(msg.data.entity.Due);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsStore = msg.data.optionsStore;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsStore = msg.data.optionsStore;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.Due) {
					msg.data.entity.Due = new Date(msg.data.entity.Due);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsStore = msg.data.optionsStore;
				$scope.action = 'update';
			});
		});

		$scope.serviceSupplier = "/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts";
		$scope.serviceCurrency = "/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts";
		$scope.servicePaymentMethod = "/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts";
		$scope.serviceSentMethod = "/services/ts/codbex-methods/gen/codbex-methods/api/Methods/SentMethodService.ts";
		$scope.serviceStatus = "/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/PurchaseOrderStatusService.ts";
		$scope.serviceOperator = "/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts";
		$scope.serviceCompany = "/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts";
		$scope.serviceStore = "/services/ts/codbex-inventory/gen/codbex-inventory/api/Stores/StoreService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("PurchaseOrder", `Unable to create PurchaseOrder: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("PurchaseOrder", "PurchaseOrder successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseOrder", `Unable to update PurchaseOrder: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("PurchaseOrder", "PurchaseOrder successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createSupplier = function () {
			messageHub.showDialogWindow("Supplier-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCurrency = function () {
			messageHub.showDialogWindow("Currency-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createPaymentMethod = function () {
			messageHub.showDialogWindow("PaymentMethod-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createSentMethod = function () {
			messageHub.showDialogWindow("SentMethod-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createStatus = function () {
			messageHub.showDialogWindow("PurchaseOrderStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createOperator = function () {
			messageHub.showDialogWindow("Employee-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCompany = function () {
			messageHub.showDialogWindow("Company-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createStore = function () {
			messageHub.showDialogWindow("Store-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshSupplier = function () {
			$scope.optionsSupplier = [];
			$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/Suppliers/SupplierService.ts").then(function (response) {
				$scope.optionsSupplier = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshCurrency = function () {
			$scope.optionsCurrency = [];
			$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/Currencies/CurrencyService.ts").then(function (response) {
				$scope.optionsCurrency = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Code
					}
				});
			});
		};
		$scope.refreshPaymentMethod = function () {
			$scope.optionsPaymentMethod = [];
			$http.get("/services/ts/codbex-methods/gen/codbex-methods/api/Methods/PaymentMethodService.ts").then(function (response) {
				$scope.optionsPaymentMethod = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshSentMethod = function () {
			$scope.optionsSentMethod = [];
			$http.get("/services/ts/codbex-methods/gen/codbex-methods/api/Methods/SentMethodService.ts").then(function (response) {
				$scope.optionsSentMethod = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshStatus = function () {
			$scope.optionsStatus = [];
			$http.get("/services/ts/codbex-orders/gen/codbex-orders/api/OrdersSettings/PurchaseOrderStatusService.ts").then(function (response) {
				$scope.optionsStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshOperator = function () {
			$scope.optionsOperator = [];
			$http.get("/services/ts/codbex-employees/gen/codbex-employees/api/Employees/EmployeeService.ts").then(function (response) {
				$scope.optionsOperator = response.data.map(e => {
					return {
						value: e.Id,
						text: e.FirstName
					}
				});
			});
		};
		$scope.refreshCompany = function () {
			$scope.optionsCompany = [];
			$http.get("/services/ts/codbex-companies/gen/codbex-companies/api/Companies/CompanyService.ts").then(function (response) {
				$scope.optionsCompany = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshStore = function () {
			$scope.optionsStore = [];
			$http.get("/services/ts/codbex-inventory/gen/codbex-inventory/api/Stores/StoreService.ts").then(function (response) {
				$scope.optionsStore = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);