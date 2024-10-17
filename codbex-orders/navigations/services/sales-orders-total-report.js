const navigationData = {
    id: 'sales-order-total-report-navigation',
    label: "Sales Orders Total Report",
    view: "sales-orders-total-report",
    group: "reports",
    orderNumber: 1000,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/SalesOrdersTotalReport/index.html?embedded",
    lazyLoad: true
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
