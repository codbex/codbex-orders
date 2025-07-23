const viewData = {
    id: 'average-sales-order-price-widget',
    label: 'Average Sales Order Price',
    path: '/services/web/codbex-orders/widgets/average-sales-order-price/index.html',
    redirectViewId: "sales-order-navigation",
    size: "small",
    lazyLoad: true,
    autoFocusTab: false
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}