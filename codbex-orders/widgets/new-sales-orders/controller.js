angular.module('new-sales-orders', ['blimpKit', 'platformView'])
    .controller('NewSalesOrdersController', ($scope, $http) => {

        $scope.today = new Date();

        const orderServiceUrl = "/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData";
        $http.get(orderServiceUrl)
            .then((response) => {
                $scope.OrderData = response.data;
                // calculateGrossProfit();
            }, (error) => {
                console.error(error);
            });

    });