const widgetData = {
    id: 'top-sales-orders',
    label: 'Top Sales Orders',
    link: '/services/web/codbex-orders/widgets/subviews/top-sales-orders.html',
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