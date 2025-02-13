const viewData = {
    id: 'sales-order-print',
    label: 'Print',
    link: '/services/ts/codbex-templates/print/sales-order-print-template.ts',
    perspective: 'SalesOrder',
    view: 'SalesOrder',
    type: 'entity',
    order: 30
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}