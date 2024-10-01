const navigationData = {
    id: 'purchase-order-total-report-navigation',
    label: "Purchase Orders Total Report",
    view: "purchase-orders-total-report",
    group: "finance",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/PurchaseOrdersTotalReport/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
