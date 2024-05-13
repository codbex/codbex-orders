const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', function ($scope, $http, ViewParameters) {
    const params = ViewParameters.get();

    const printSalesOrderUrl = "/services/ts/codbex-orders/print/SalesOrder/api/SalesOrderService.ts/" + params.id;

    $http.get(printSalesOrderUrl)
        .then(function (response) {
            $scope.Order = response.data.salesOrder;
            $scope.OrderItems = response.data.salesOrderItems;
            $scope.Customer = response.data.customer;
            $scope.Company = response.data.company;
        });
}]);
