const widgetData = {
    id: 'unpaid-purchase-orders',
    label: 'Unpaid Purchase Orders',
    link: '/services/web/codbex-orders/widgets/subviews/unpaid-purchase-orders.html',
    redirectViewId: 'purchase-order-navigation',
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