angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.PurchaseOrder.PurchaseOrderPayment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderPaymentService.ts";
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', 'entityApi', function ($scope, messageHub, ViewParameters, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "PurchaseOrderPayment Details",
			create: "Create PurchaseOrderPayment",
			update: "Update PurchaseOrderPayment"
		};
		$scope.action = 'select';

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.action = params.action;
			$scope.entity = params.entity;
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsPurchaseOrder = params.optionsPurchaseOrder;
			$scope.optionsSupplierPayment = params.optionsSupplierPayment;
		}

		$scope.create = function () {
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.create(entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("PurchaseOrderPayment", `Unable to create PurchaseOrderPayment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("PurchaseOrderPayment", "PurchaseOrderPayment successfully created");
			});
		};

		$scope.update = function () {
			let id = $scope.entity.Id;
			let entity = $scope.entity;
			entity[$scope.selectedMainEntityKey] = $scope.selectedMainEntityId;
			entityApi.update(id, entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseOrderPayment", `Unable to update PurchaseOrderPayment: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				$scope.cancel();
				messageHub.showAlertSuccess("PurchaseOrderPayment", "PurchaseOrderPayment successfully updated");
			});
		};

		$scope.servicePurchaseOrder = "/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderService.ts";
		$scope.serviceSupplierPayment = "/services/ts/codbex-payments/gen/codbex-payments/api/SupplierPayment/SupplierPaymentService.ts";

		$scope.cancel = function () {
			$scope.entity = {};
			$scope.action = 'select';
			messageHub.closeDialogWindow("PurchaseOrderPayment-details");
		};

	}]);