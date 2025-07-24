angular.module('average-sales-order-price', ['blimpKit', 'platformView'])
    .controller('AverageSalesOrderPriceController', ($scope, $http) => {

        const orderServiceUrl = "/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData";
        $http.get(orderServiceUrl)
            .then((response) => {
                $scope.OrderData = response.data;
            }, (error) => {
                console.error(error);
            });
    });
