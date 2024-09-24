const navigationData = {
    id: 'sales-order-navigation',
    label: "Sales Orders",
    view: "sales-orders",
    group: "sales",
    orderNumber: 1000
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
