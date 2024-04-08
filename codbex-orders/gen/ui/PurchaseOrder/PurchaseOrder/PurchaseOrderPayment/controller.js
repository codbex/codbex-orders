angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.PurchaseOrder.PurchaseOrderPayment';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-orders/gen/api/PurchaseOrder/PurchaseOrderPaymentService.ts";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', 'Extensions', function ($scope, $http, messageHub, entityApi, Extensions) {
		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-orders-custom-action').then(function (response) {
			$scope.pageActions = response.filter(e => e.perspective === "PurchaseOrder" && e.view === "PurchaseOrderPayment" && (e.type === "page" || e.type === undefined));
			$scope.entityActions = response.filter(e => e.perspective === "PurchaseOrder" && e.view === "PurchaseOrderPayment" && e.type === "entity");
		});

		$scope.triggerPageAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{},
				null,
				true,
				action
			);
		};

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

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-orders.PurchaseOrder.PurchaseOrder.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-orders.PurchaseOrder.PurchaseOrder.clearDetails", function (msg) {
			$scope.$apply(function () {
				resetPagination();
				$scope.selectedMainEntityId = null;
				$scope.data = null;
			});
		}, true);

		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entityCreated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage, $scope.filter);
		});

		messageHub.onDidReceiveMessage("entitySearch", function (msg) {
			resetPagination();
			$scope.filter = msg.data.filter;
			$scope.filterEntity = msg.data.entity;
			$scope.loadPage($scope.dataPage, $scope.filter);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber, filter) {
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
			entityApi.count(filter).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("PurchaseOrderPayment", `Unable to count PurchaseOrderPayment: '${response.message}'`);
					return;
				}
				if (response.data) {
					$scope.dataCount = response.data;
				}
				filter.$offset = (pageNumber - 1) * $scope.dataLimit;
				filter.$limit = $scope.dataLimit;
				entityApi.search(filter).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("PurchaseOrderPayment", `Unable to list/filter PurchaseOrderPayment: '${response.message}'`);
						return;
					}
					$scope.data = response.data;
				});
			});
		};

		$scope.selectEntity = function (entity) {
			$scope.selectedEntity = entity;
		};

		$scope.openDetails = function (entity) {
			$scope.selectedEntity = entity;
			messageHub.showDialogWindow("PurchaseOrderPayment-details", {
				action: "select",
				entity: entity,
				optionsPurchaseOrder: $scope.optionsPurchaseOrder,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			});
		};

		$scope.openFilter = function (entity) {
			messageHub.showDialogWindow("PurchaseOrderPayment-filter", {
				entity: $scope.filterEntity,
				optionsPurchaseOrder: $scope.optionsPurchaseOrder,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("PurchaseOrderPayment-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "PurchaseOrder",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsPurchaseOrder: $scope.optionsPurchaseOrder,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("PurchaseOrderPayment-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "PurchaseOrder",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsPurchaseOrder: $scope.optionsPurchaseOrder,
				optionsSupplierPayment: $scope.optionsSupplierPayment,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete PurchaseOrderPayment?',
				`Are you sure you want to delete PurchaseOrderPayment? This action cannot be undone.`,
				[{
					id: "delete-btn-yes",
					type: "emphasized",
					label: "Yes",
				},
				{
					id: "delete-btn-no",
					type: "normal",
					label: "No",
				}],
			).then(function (msg) {
				if (msg.data === "delete-btn-yes") {
					entityApi.delete(id).then(function (response) {
						if (response.status != 204) {
							messageHub.showAlertError("PurchaseOrderPayment", `Unable to delete PurchaseOrderPayment: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage, $scope.filter);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsPurchaseOrder = [];
		$scope.optionsSupplierPayment = [];


		$http.get("/services/ts/codbex-orders/gen/api/PurchaseOrder/PurchaseOrderService.ts").then(function (response) {
			$scope.optionsPurchaseOrder = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/ts/codbex-payments/gen/api/SupplierPayment/SupplierPaymentService.ts").then(function (response) {
			$scope.optionsSupplierPayment = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
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

	}]);
