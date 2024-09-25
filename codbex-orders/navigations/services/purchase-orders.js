const navigationData = {
    id: 'purchase-order-navigation',
    label: "Purchase Orders",
    view: "purchase-orders",
    group: "purchasing",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/PurchaseOrder/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
