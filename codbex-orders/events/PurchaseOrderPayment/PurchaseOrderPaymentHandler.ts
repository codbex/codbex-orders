import { PurchaseOrderRepository } from "../../gen/dao/PurchaseOrder/PurchaseOrderRepository";
import { PurchaseOrderPaymentRepository } from "../../gen/dao/PurchaseOrder/PurchaseOrderPaymentRepository";

export const trigger = (event) => {
    const PurchaseOrderDao = new PurchaseOrderRepository();
    const PurchaseOrderPaymentDao = new PurchaseOrderPaymentRepository();
    const item = event.entity;

    const items = PurchaseOrderPaymentDao.findAll({
        $filter: {
            equals: {
                PurchaseOrder: item.PurchaseOrder
            }
        }
    });

    let amount = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].Amount) {
            amount += items[i].Amount;
        }
    }

    const header = PurchaseOrderDao.findById(item.PurchaseOrder);

    header.Paid = amount;

    PurchaseOrderDao.update(header);
}