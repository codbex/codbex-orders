angular.module('new-sales-orders', ['ideUI', 'ideView'])
    .controller('NewSalesOrdersController', ['$scope', '$document', '$http', 'messageHub', function ($scope, $document, $http, messageHub) {
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
                calculateGrossProfit();
            });

    }]);