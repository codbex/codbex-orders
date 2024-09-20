const widgetData = {
    id: 'average-sales-order-price',
    label: 'Average Sales Order Price',
    link: '/services/web/codbex-orders/widgets/subviews/average-sales-order-price.html',
    lazyLoad: true,
    size: "medium"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = function () {
        return widgetData;
    }
}