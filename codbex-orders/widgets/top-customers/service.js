const widgetData = {
    id: 'top-customer-widget',
    label: 'Top Customer',
    link: '/services/web/codbex-orders/widgets/top-customers/index.html',
    redirectViewId: 'custmores-navigation',
    size: "large"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}
