angular.module('average-purchase-order-price', ['blimpKit', 'platformView'])
    .controller('AveragePurchaseOrderPriceController', ($scope, $http) => {

        const orderServiceUrl = "/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData";
        $http.get(orderServiceUrl)
            .then((response) => {
                $scope.OrderData = response.data;
            }, (error) => {
                console.error(error);
            });
    });