angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
			if (params?.filter?.PurchaseOrdersTotalReport) {
				params.filter.PurchaseOrdersTotalReport = new Date(params.filter.PurchaseOrdersTotalReport);
			}
			if (params?.filter?.StartDate) {
				params.filter.StartDate = new Date(params.filter.StartDate);
			}
			if (params?.filter?.EndDate) {
				params.filter.EndDate = new Date(params.filter.EndDate);
			}
			$scope.entity = params.filter ?? {};
	}

	$scope.filter = () => {
		const filter = {
			...$scope.entity
		};
		filter.PurchaseOrdersTotalReport = filter.PurchaseOrdersTotalReport?.getTime();
		filter.StartDate = filter.StartDate?.getTime();
		filter.EndDate = filter.EndDate?.getTime();
		Dialogs.postMessage({ topic: 'codbex-orders.Reports.PurchaseOrdersTotalReport.filter', data: filter });
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'PurchaseOrdersTotalReport-details-filter' });
	};
});