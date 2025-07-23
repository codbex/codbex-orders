const viewData = {
    id: 'unpaid-purchase-orders-widget',
    label: 'Unpaid Purchase Orders',
    link: '/services/web/codbex-orders/widgets/unpaid-purchase-orders/index.html',
    redirectViewId: 'purchase-order-navigation',
    size: "small",
    lazyLoad: true,
    autoFocusTab: false
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}