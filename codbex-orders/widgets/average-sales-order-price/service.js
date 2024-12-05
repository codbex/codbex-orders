const widgetData = {
    id: 'average-sales-order-price-widget',
    label: 'Average Sales Order Price',
    link: '/services/web/codbex-orders/widgets/average-sales-order-price/index.html',
    redirectViewId: "sales-order-navigation",
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