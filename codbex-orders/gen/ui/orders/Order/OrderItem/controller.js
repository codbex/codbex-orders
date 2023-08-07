angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.orders.OrderItem';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/js/codbex-orders/gen/api/orders/OrderItem.js";
	}])
	.controller('PageController', ['$scope', '$http', 'messageHub', 'entityApi', function ($scope, $http, messageHub, entityApi) {

		function resetPagination() {
			$scope.dataPage = 1;
			$scope.dataCount = 0;
			$scope.dataLimit = 10;
		}
		resetPagination();

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("codbex-orders.orders.Order.entitySelected", function (msg) {
			resetPagination();
			$scope.selectedMainEntityId = msg.data.selectedMainEntityId;
			$scope.loadPage($scope.dataPage);
		}, true);

		messageHub.onDidReceiveMessage("codbex-orders.orders.Order.clearDetails", function (msg) {
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
			$scope.loadPage($scope.dataPage);
		});

		messageHub.onDidReceiveMessage("entityUpdated", function (msg) {
			$scope.loadPage($scope.dataPage);
		});
		//-----------------Events-------------------//

		$scope.loadPage = function (pageNumber) {
			let Order = $scope.selectedMainEntityId;
			$scope.dataPage = pageNumber;
			entityApi.count(Order).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("OrderItem", `Unable to count OrderItem: '${response.message}'`);
					return;
				}
				$scope.dataCount = response.data;
				let query = `Order=${Order}`;
				let offset = (pageNumber - 1) * $scope.dataLimit;
				let limit = $scope.dataLimit;
				entityApi.filter(query, offset, limit).then(function (response) {
					if (response.status != 200) {
						messageHub.showAlertError("OrderItem", `Unable to list OrderItem: '${response.message}'`);
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
			messageHub.showDialogWindow("OrderItem-details", {
				action: "select",
				entity: entity,
				optionsOrder: $scope.optionsOrder,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
			});
		};

		$scope.createEntity = function () {
			$scope.selectedEntity = null;
			messageHub.showDialogWindow("OrderItem-details", {
				action: "create",
				entity: {},
				selectedMainEntityKey: "Order",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsOrder: $scope.optionsOrder,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
			}, null, false);
		};

		$scope.updateEntity = function (entity) {
			messageHub.showDialogWindow("OrderItem-details", {
				action: "update",
				entity: entity,
				selectedMainEntityKey: "Order",
				selectedMainEntityId: $scope.selectedMainEntityId,
				optionsOrder: $scope.optionsOrder,
				optionsProduct: $scope.optionsProduct,
				optionsUoM: $scope.optionsUoM,
			}, null, false);
		};

		$scope.deleteEntity = function (entity) {
			let id = entity.Id;
			messageHub.showDialogAsync(
				'Delete OrderItem?',
				`Are you sure you want to delete OrderItem? This action cannot be undone.`,
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
							messageHub.showAlertError("OrderItem", `Unable to delete OrderItem: '${response.message}'`);
							return;
						}
						$scope.loadPage($scope.dataPage);
						messageHub.postMessage("clearDetails");
					});
				}
			});
		};

		//----------------Dropdowns-----------------//
		$scope.optionsOrder = [];
		$scope.optionsProduct = [];
		$scope.optionsUoM = [];

		$http.get("/services/js/codbex-orders/gen/api/orders/Order.js").then(function (response) {
			$scope.optionsOrder = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Number
				}
			});
		});

		$http.get("/services/js/codbex-orders/gen/api/entities/Product.js").then(function (response) {
			$scope.optionsProduct = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});

		$http.get("/services/js/codbex-orders/gen/api/entities/UoM.js").then(function (response) {
			$scope.optionsUoM = response.data.map(e => {
				return {
					value: e.Id,
					text: e.Name
				}
			});
		});
		$scope.optionsOrderValue = function (optionKey) {
			for (let i = 0; i < $scope.optionsOrder.length; i++) {
				if ($scope.optionsOrder[i].value === optionKey) {
					return $scope.optionsOrder[i].text;
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
		//----------------Dropdowns-----------------//

	}]);
