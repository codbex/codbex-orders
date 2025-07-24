const viewData = {
    id: 'top-customers',
    label: 'Top Customer',
    path: '/services/web/codbex-orders/widgets/top-customers/index.html',
    redirectViewId: 'custmores-navigation',
    size: 'large',
    lazyLoad: true,
    autoFocusTab: false
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}