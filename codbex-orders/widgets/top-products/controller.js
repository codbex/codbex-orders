angular.module('top-products', ['blimpKit', 'platformView']).controller('TopProductsController', ($scope, $http) => {
    const Shell = new ShellHub();
    let topProductsByUnits;
    let topProductsByRevenue;

    $scope.openPerspective = () => {
        if (viewData && viewData.perspectiveId) Shell.showPerspective({ id: viewData.perspectiveId });
    };

    $http.get('/services/ts/codbex-orders/widgets/api/ProductService.ts/productData').then((response) => {
        console.log(response)
        topProductsByUnits = response.data.TopProductsByUnits;
        topProductsByRevenue = response.data.TopProductsByRevenue;
        $scope.$evalAsync(() => {
            $scope.displayedProducts = topProductsByUnits;
        });
    }, (error) => {
        console.error(error);
    });

    $scope.displayByUnits = () => {
        $scope.displayedProducts = topProductsByUnits;
    };

    $scope.displayByRevenue = () => {
        $scope.displayedProducts = topProductsByRevenue;
    };
});