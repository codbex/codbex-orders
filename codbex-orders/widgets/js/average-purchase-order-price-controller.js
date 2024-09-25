angular.module('average-purchase-order-price', ['ideUI', 'ideView'])
    .controller('AveragePurchaseOrderPriceController', ['$scope', '$http', function ($scope, $http) {
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
    }]);
