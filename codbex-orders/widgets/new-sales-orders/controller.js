angular.module('new-sales-orders', ['blimpKit', 'platformView'])
    .controller('NewSalesOrdersController', ($scope, $http) => {

        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.today = new Date();

        const orderServiceUrl = "/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData";
        $http.get(orderServiceUrl)
            .then(function (response) {
                $scope.OrderData = response.data;
                // calculateGrossProfit();
            });

    });