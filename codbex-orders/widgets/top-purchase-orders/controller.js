angular.module('top-purchase-orders', ['blimpKit', 'platformView'])
    .controller('TopPurchaseOrdersController', ($scope, $http, $document) => {

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
            $scope.$evalAsync(() => {
                $scope.topPurchaseOrders = orderData.TopPurchaseOrders;
            });
        });
    });
