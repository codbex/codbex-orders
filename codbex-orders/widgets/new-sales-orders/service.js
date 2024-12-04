const widgetData = {
    id: 'new-sales-orders-widget',
    label: 'New Sales Orders',
    link: '/services/web/codbex-orders/widgets/new-sales-orders/index.html',
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