angular.module('top-purchase-orders', ['ideUI', 'ideView'])
    .controller('TopPurchaseOrdersController', ['$scope', '$document', '$http', 'messageHub', function ($scope, $document, $http, messageHub) {
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

        async function getOrderData() {
            try {
                const response = await $http.get("/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData");
                return response.data;
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        }


        angular.element($document[0]).ready(async function () {
            const orderData = await getOrderData();
            $scope.$apply(function () {
                $scope.topPurchaseOrders = orderData.TopPurchaseOrders;
            });
        });
    }]);
