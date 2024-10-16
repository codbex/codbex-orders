const navigationData = {
    id: 'purchase-order-report-navigation',
    label: "Purchase Orders Report",
    view: "purchase-orders-report",
    group: "reports",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/Reports/PurchaseOrdersReport/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
