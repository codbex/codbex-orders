const viewData = {
    id: 'purchase-order-print',
    label: 'Print',
    link: '/services/ts/codbex-templates/print/purchase-order-print-template.ts',
    perspective: 'PurchaseOrder',
    view: 'PurchaseOrder',
    type: 'entity',
    order: 30
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}