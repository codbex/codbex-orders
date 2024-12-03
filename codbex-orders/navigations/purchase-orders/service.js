const navigationData = {
    id: 'purchase-order-navigation',
    label: "Purchase Orders",
    group: "purchasing",
    order: 100,
    link: "/services/web/codbex-orders/gen/codbex-orders/ui/PurchaseOrder/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
