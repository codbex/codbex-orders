const viewData = {
    id: 'purchase-order-print',
    label: 'Print',
    link: '/services/web/codbex-orders/print/PurchaseOrder/print-purchase-order.html',
    perspective: 'PurchaseOrder',
    view: 'PurchaseOrder',
    type: 'entity',
    order: 20
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}