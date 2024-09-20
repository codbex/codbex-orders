const widgetData = {
    id: 'top-customer',
    label: 'Top Customer',
    link: '/services/web/codbex-orders/widgets/subviews/top-customer.html',
    lazyLoad: true,
    size: "medium"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}
