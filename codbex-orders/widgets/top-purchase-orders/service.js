const widgetData = {
    id: 'top-purchase-orders-widget',
    label: 'Top Purchase Orders',
    link: '/services/web/codbex-orders/widgets/top-purchase-orders/index.html',
    redirectViewId: 'purchase-order-navigation',
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