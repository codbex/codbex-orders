const viewData = {
    id: 'sales-order-print',
    label: 'Print',
    path: '/services/ts/codbex-templates/print/sales-order-print-template.ts',
    perspective: 'SalesOrder',
    translation: {
        key: 'codbex-orders:t.SALESORDER',
    },
    view: 'SalesOrder',
    type: 'entity',
    order: 30
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}
