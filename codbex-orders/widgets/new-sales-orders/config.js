const viewData = {
    id: 'new-sales-orders-widget',
    label: 'New Sales Orders',
    path: '/services/web/codbex-orders/widgets/new-sales-orders/index.html',
    redirectViewId: 'sales-order-navigation',
    size: 'small',
    lazyLoad: true,
    autoFocusTab: false
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}
