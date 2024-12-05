const navigationData = {
    id: 'purchase-order-total-report-navigation',
    label: "Purchase Orders Total Report",
    group: "reports",
    order: 200,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/PurchaseOrdersTotalReport/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
