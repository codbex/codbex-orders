const navigationData = {
    id: 'sales-order-navigation',
    label: "Sales Orders",
    view: "sales-orders",
    group: "sales",
    orderNumber: 1000,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/SalesOrder/index.html?embedded",
    lazyLoad: true
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
