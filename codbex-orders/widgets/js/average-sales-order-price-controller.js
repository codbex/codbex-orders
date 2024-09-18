angular.module('average-sales-order-price', ['ideUI', 'ideView'])
    .controller('AverageSalesOrderPriceController', ['$scope', '$document', '$http', 'messageHub', function ($scope, $document, $http, messageHub) {
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
