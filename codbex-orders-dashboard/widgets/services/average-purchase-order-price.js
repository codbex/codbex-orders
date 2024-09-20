const widgetData = {
    id: 'average-purchase-order-price',
    label: 'Average Purchase Order Price',
    link: '/services/web/codbex-orders/widgets/subviews/average-purchase-order-price.html',
    lazyLoad: true,
    size: "medium"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }
