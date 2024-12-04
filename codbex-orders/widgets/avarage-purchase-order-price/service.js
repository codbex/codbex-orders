const widgetData = {
    id: 'average-purchase-order-price-widget',
    label: 'Average Purchase Order Price',
    link: '/services/web/codbex-orders/widgets/average-purchase-order-price/index.html',
    redirectViewId: "purchase-order-navigation",
    size: "small"
};

function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = getWidget;
}

export { getWidget }
