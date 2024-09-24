const navigationData = {
    id: 'purchase-order-navigation',
    label: "Purchase Orders",
    view: "purchase-orders",
    group: "purchasing",
    orderNumber: 1000
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
