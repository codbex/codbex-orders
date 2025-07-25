angular.module('page', ['blimpKit', 'platformView', 'platformLocale']).controller('PageController', ($scope, ViewParameters) => {
	const Dialogs = new DialogHub();
	$scope.entity = {};
	$scope.forms = {
		details: {},
	};

	let params = ViewParameters.get();
	if (Object.keys(params).length) {
		if (params?.filter?.Date) {
			params.filter.Date = new Date(params.filter.Date);
		}
		if (params?.filter?.Due) {
			params.filter.Due = new Date(params.filter.Due);
		}
		$scope.entity = params.filter ?? {};
	}

	$scope.filter = () => {
		const filter = {
			...$scope.entity
		};
		filter.Date = filter.Date?.getTime();
		filter.Due = filter.Due?.getTime();
		Dialogs.postMessage({ topic: 'codbex-orders.Reports.SalesOrdersReport.filter', data: filter });
		$scope.cancel();
	};

	$scope.resetFilter = () => {
		$scope.entity = {};
		$scope.filter();
	};

	$scope.cancel = () => {
		Dialogs.closeWindow({ id: 'SalesOrdersReport-details-filter' });
	};
});