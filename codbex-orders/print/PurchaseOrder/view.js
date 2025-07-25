const viewData = {
    id: 'purchase-order-print',
    label: 'Print',
    path: '/services/ts/codbex-templates/print/purchase-order-print-template.ts',
    perspective: 'PurchaseOrder',
    translation: {
        key: 'codbex-orders:t.PURCHASEORDER',
    },
    view: 'PurchaseOrder',
    type: 'entity',
    order: 30
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}