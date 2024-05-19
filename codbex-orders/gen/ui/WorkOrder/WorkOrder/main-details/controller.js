angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.WorkOrder.WorkOrder';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/api/WorkOrder/WorkOrderService.ts";
	}])
	.controller('PageController', ['$scope', 'Extensions', 'messageHub', 'entityApi', function ($scope, Extensions, messageHub, entityApi) {

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

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-orders-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "WorkOrder" && e.view === "WorkOrder" && e.type === "entity");
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
				$scope.optionsCustomer = [];
				$scope.optionsCurrency = [];
				$scope.optionsPaymentMethod = [];
				$scope.optionsSentMethod = [];
				$scope.optionsWorkOrderStatus = [];
				$scope.optionsOperator = [];
				$scope.optionsCompany = [];
				$scope.optionsWorker = [];
				$scope.optionsSalesOrder = [];
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
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsWorkOrderStatus = msg.data.optionsWorkOrderStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsWorker = msg.data.optionsWorker;
				$scope.optionsSalesOrder = msg.data.optionsSalesOrder;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsWorkOrderStatus = msg.data.optionsWorkOrderStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsWorker = msg.data.optionsWorker;
				$scope.optionsSalesOrder = msg.data.optionsSalesOrder;
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
				$scope.optionsCustomer = msg.data.optionsCustomer;
				$scope.optionsCurrency = msg.data.optionsCurrency;
				$scope.optionsPaymentMethod = msg.data.optionsPaymentMethod;
				$scope.optionsSentMethod = msg.data.optionsSentMethod;
				$scope.optionsWorkOrderStatus = msg.data.optionsWorkOrderStatus;
				$scope.optionsOperator = msg.data.optionsOperator;
				$scope.optionsCompany = msg.data.optionsCompany;
				$scope.optionsWorker = msg.data.optionsWorker;
				$scope.optionsSalesOrder = msg.data.optionsSalesOrder;
				$scope.action = 'update';
			});
		});
		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("WorkOrder", `Unable to create WorkOrder: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("WorkOrder", "WorkOrder successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("WorkOrder", `Unable to update WorkOrder: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("WorkOrder", "WorkOrder successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};

	}]);