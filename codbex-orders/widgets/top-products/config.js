const viewData = {
    id: 'top-products-widget',
    label: 'Top products',
    path: '/services/web/codbex-orders/widgets/top-products/index.html',
    lazyLoad: true,
    autoFocusTab: false,
    perspectiveId: 'Products',
    size: 'large'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}