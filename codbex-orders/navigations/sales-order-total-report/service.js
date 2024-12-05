const navigationData = {
    id: 'sales-order-total-report-navigation',
    label: "Sales Orders Total Report",
    group: "reports",
    order: 400,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/SalesOrdersTotalReport/index.html?embedded",
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
