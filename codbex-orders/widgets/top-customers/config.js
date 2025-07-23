const viewData = {
    id: 'top-customer-widget',
    label: 'Top Customer',
    link: '/services/web/codbex-orders/widgets/top-customers/index.html',
    redirectViewId: 'custmores-navigation',
    size: "large",
    lazyLoad: true,
    autoFocusTab: false
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}