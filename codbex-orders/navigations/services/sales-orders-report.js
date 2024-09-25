const navigationData = {
    id: 'sales-order-report-navigation',
    label: "Sales Orders",
    view: "sales-orders",
    group: "finance",
    orderNumber: 1000,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/SalesOrdersReport/index.html?embedded",
    lazyLoad: true
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
