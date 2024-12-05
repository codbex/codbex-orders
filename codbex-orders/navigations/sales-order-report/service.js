const navigationData = {
    id: 'sales-order-report-navigation',
    label: "Sales Orders Report",
    view: "sales-orders-report",
    group: "reports",
    order: 300,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/SalesOrdersReport/index.html?embedded",
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
