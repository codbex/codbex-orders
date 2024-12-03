const widgetData = {
    id: 'new-sales-orders-widget',
    label: 'New Sales Orders',
    link: '/services/web/codbex-orders/widgets/subviews/new-sales-orders.html',
    redirectViewId: 'sales-order-navigation',
    size: "small"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = function () {
        return widgetData;
    }
}