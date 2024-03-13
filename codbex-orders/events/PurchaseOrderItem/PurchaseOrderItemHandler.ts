import { PurchaseOrderRepository } from "../../gen/dao/PurchaseOrder/PurchaseOrderRepository";
import { PurchaseOrderItemRepository } from "../../gen/dao/PurchaseOrder/PurchaseOrderItemRepository";

export const trigger = (event) => {
    const PurchaseOrderDao = new PurchaseOrderRepository();
    const PurchaseOrderItemDao = new PurchaseOrderItemRepository();
    const item = event.entity;

    const items = PurchaseOrderItemDao.findAll({
        $filter: {
            equals: {
                PurchaseOrder: item.PurchaseOrder
            }
        }
    });

    let net = 0;
    let vat = 0.0;
    let gross = 0;
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].Net) {
            net += items[i].Net;
            vat += items[i].VAT;
            gross += items[i].Gross;
        }
    }

    const header = PurchaseOrderDao.findById(item.PurchaseOrder);

    header.Total ??= 0;
    header.Net = net;
    header.VAT = vat;
    header.Gross = gross;

    total = header.Gross - (header.Gross * header.Discount / 100) + (header.Gross * header.Taxes / 100);
    header.Total = total;

    header.Name = header.Name.substring(0, header.Name.lastIndexOf("/") + 1) + header.Total;

    PurchaseOrderDao.update(header);
}