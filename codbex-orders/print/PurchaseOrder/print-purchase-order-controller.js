const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', function ($scope, $http, ViewParameters) {
    const params = ViewParameters.get();

    const printPurchaseOrderUrl = "/services/ts/codbex-orders/print/PurchaseOrder/api/PurchaseOrderService.ts/" + params.id;

    $http.get(printPurchaseOrderUrl)
        .then(function (response) {
            $scope.Order = response.data.purchaseOrder;
            $scope.OrderItems = response.data.purchaseOrderItems;
            $scope.Supplier = response.data.supplier;
            $scope.Company = response.data.company;
        });
}]);
