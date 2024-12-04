const widgetData = {
    id: 'unpaid-purchase-orders-widget',
    label: 'Unpaid Purchase Orders',
    link: '/services/web/codbex-orders/widgets/unpaid-purchase-orders/index.html',
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