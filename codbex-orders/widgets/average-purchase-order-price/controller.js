angular.module('average-purchase-order-price', ['blimpKit', 'platformView'])
    .controller('AveragePurchaseOrderPriceController', ($scope, $http) => {

        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        const orderServiceUrl = "/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData";
        $http.get(orderServiceUrl)
            .then(function (response) {
                $scope.OrderData = response.data;
            });
    });