const viewData = {
    id: 'top-sales-orders-widget',
    label: 'Top Sales Orders',
    path: '/services/web/codbex-orders/widgets/top-sales-orders/index.html',
    redirectViewId: 'sales-orders-navigation',
    size: 'large',
    lazyLoad: true,
    autoFocusTab: false
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}