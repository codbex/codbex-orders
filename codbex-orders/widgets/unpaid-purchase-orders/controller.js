angular.module('unpaid-purchase-orders', ['blimpKit', 'platformView'])
    .controller('UnpaidPurchaseOrdersController', ($scope, $http) => {

        $scope.today = new Date();

        const orderServiceUrl = "/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData";
        $http.get(orderServiceUrl)
            .then(function (response) {
                $scope.OrderData = response.data;
            }, (error) => {
                console.error(error);
            });
    });
