angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
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
		$scope.optionsStatus = params.optionsStatus;
	}

	$scope.filter = () => {
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
		if (entity.UoM !== undefined) {
			filter.$filter.equals.UoM = entity.UoM;
		}
		if (entity.Quantity !== undefined) {
			filter.$filter.equals.Quantity = entity.Quantity;
		}
		if (entity.Price !== undefined) {
			filter.$filter.equals.Price = entity.Price;
		}
		if (entity.Net !== undefined) {
			filter.$filter.equals.Net = entity.Net;
		}
		if (entity.VATRate !== undefined) {
			filter.$filter.equals.VATRate = entity.VATRate;
		}
		if (entity.VAT !== undefined) {
			filter.$filter.equals.VAT = entity.VAT;
		}
		if (entity.Gross !== undefined) {
			filter.$filter.equals.Gross = entity.Gross;
		}
		if (entity.Status !== undefined) {
			filter.$filter.equals.Status = entity.Status;
		}
		Dialogs.postMessage({ topic: 'codbex-orders.SalesOrder.SalesOrderItem.entitySearch', data: {
			entity: entity,
			filter: filter
		}});
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'SalesOrderItem-filter' });
	};

	$scope.clearErrorMessage = () => {
		$scope.errorMessage = null;
	};
});