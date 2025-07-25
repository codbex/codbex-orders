angular.module('top-customers', ['blimpKit', 'platformView']).controller('TopCustomerController', ($scope, $http) => {

    const orderServiceUrl = '/services/ts/codbex-orders/widgets/api/OrderService.ts/orderData';

    $http.get(orderServiceUrl)
        .then(response => {
            const data = response.data;
            $scope.OrderData = data;
            $scope.TopCustomers = data.TopCustomers;
        })
        .catch(error => {
            console.error('Error fetching order data:', error);
        });
});
