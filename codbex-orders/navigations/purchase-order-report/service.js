const navigationData = {
    id: 'purchase-order-report-navigation',
    label: "Purchase Orders Report",
    group: "reports",
    order: 100,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/PurchaseOrdersReport/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
