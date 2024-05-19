angular.module('page', ["ideUI", "ideView"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-orders.SalesOrder.SalesOrderItem';
	}])
	.controller('PageController', ['$scope', 'messageHub', 'ViewParameters', function ($scope, messageHub, ViewParameters) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};

		let params = ViewParameters.get();
		if (Object.keys(params).length) {
			$scope.entity = params.entity ?? {};
			$scope.selectedMainEntityKey = params.selectedMainEntityKey;
			$scope.selectedMainEntityId = params.selectedMainEntityId;
			$scope.optionsSalesOrder = params.optionsSalesOrder;
			$scope.optionsProduct = params.optionsProduct;
			$scope.optionsUoM = params.optionsUoM;
		}

		$scope.filter = function () {
			let entity = $scope.entity;
			const filter = {
				$filter: {
					equals: {
					},
					notEquals: {
					},
					contains: {
					},
					greaterThan: {
					},
					greaterThanOrEqual: {
					},
					lessThan: {
					},
					lessThanOrEqual: {
					}
				},
			};
			if (entity.Id !== undefined) {
				filter.$filter.equals.Id = entity.Id;
			}
			if (entity.SalesOrder !== undefined) {
				filter.$filter.equals.SalesOrder = entity.SalesOrder;
			}
			if (entity.Product !== undefined) {
				filter.$filter.equals.Product = entity.Product;
			}
			if (entity.Quantity !== undefined) {
				filter.$filter.equals.Quantity = entity.Quantity;
			}
			if (entity.UoM !== undefined) {
				filter.$filter.equals.UoM = entity.UoM;
			}
			if (entity.Price !== undefined) {
				filter.$filter.equals.Price = entity.Price;
			}
			if (entity.Net !== undefined) {
				filter.$filter.equals.Net = entity.Net;
			}
			if (entity.VAT !== undefined) {
				filter.$filter.equals.VAT = entity.VAT;
			}
			if (entity.Gross !== undefined) {
				filter.$filter.equals.Gross = entity.Gross;
			}
			messageHub.postMessage("entitySearch", {
				entity: entity,
				filter: filter
			});
			$scope.cancel();
		};

		$scope.resetFilter = function () {
			$scope.entity = {};
			$scope.filter();
		};

		$scope.cancel = function () {
			messageHub.closeDialogWindow("SalesOrderItem-filter");
		};

		$scope.clearErrorMessage = function () {
			$scope.errorMessage = null;
		};

	}]);