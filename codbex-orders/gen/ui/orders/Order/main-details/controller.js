angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.orders.Order';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-orders/gen/api/orders/Order.js";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'entityApi', function ($scope, messageHub, entityApi) {

		$scope.entity = {};
		$scope.formHeaders = {
			select: "Order Details",
			create: "Create Order",
			update: "Update Order"
		};
		$scope.formErrors = {};
		$scope.action = 'select';

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.formErrors = {};
				$scope.optionsOperator = [];
				$scope.optionsCustomer = [];
				$scope.optionsSupplier = [];
				$scope.optionsType = [];
				$scope.optionsCurrency = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'create';
				// Set Errors for required fields only
				$scope.formErrors = {
				};
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsSupplier = msg.data.optionsSupplier;
				$scope.optionsType = msg.data.optionsType;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.isValid = function (isValid, property) {
			$scope.formErrors[property] = !isValid ? true : undefined;
			for (let next in $scope.formErrors) {
				if ($scope.formErrors[next] === true) {
					$scope.isFormValid = false;
					return;
				}
			}
			$scope.isFormValid = true;
		};

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Order", `Unable to create Order: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Order", "Order successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Order", `Unable to update Order: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Order", "Order successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);