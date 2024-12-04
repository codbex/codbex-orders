const navigationData = {
    id: 'sales-order-navigation',
    label: "Sales Orders",
    group: "sales",
    order: 100,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/SalesOrder/index.html?embedded",
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
