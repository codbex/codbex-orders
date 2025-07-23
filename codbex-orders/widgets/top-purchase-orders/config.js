const viewData = {
    id: 'top-purchase-orders-widget',
    label: 'Top Purchase Orders',
    link: '/services/web/codbex-orders/widgets/top-purchase-orders/index.html',
    redirectViewId: 'purchase-order-navigation',
    size: "large",
    lazyLoad: true,
    autoFocusTab: false
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}