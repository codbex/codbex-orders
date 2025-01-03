const widgetData = {
    id: 'top-sales-orders-widget',
    label: 'Top Sales Orders',
    link: '/services/web/codbex-orders/widgets/top-sales-orders/index.html',
    redirectViewId: 'sales-orders-navigation',
    size: "large"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = function () {
        return widgetData;
    }
}