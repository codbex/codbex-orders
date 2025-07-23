const viewData = {
    id: 'average-purchase-order-price-widget',
    label: 'Average Purchase Order Price',
    path: '/services/web/codbex-orders/widgets/average-purchase-order-price/index.html',
    redirectViewId: "purchase-order-navigation",
    lazyLoad: true,
    autoFocusTab: false,
    size: 'small'
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}