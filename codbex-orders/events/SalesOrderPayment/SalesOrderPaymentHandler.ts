import { SalesOrderRepository } from "../../gen/dao/SalesOrder/SalesOrderRepository";
import { SalesOrderPaymentRepository } from "../../gen/dao/SalesOrder/SalesOrderPaymentRepository";

export const trigger = (event) => {
    const SalesOrderDao = new SalesOrderRepository();
    const SalesOrderPaymentDao = new SalesOrderPaymentRepository();
    const item = event.entity;

    console.log("ITEM" + JSON.stringify(item));

    const items = SalesOrderPaymentDao.findAll({
        $filter: {
            equals: {
                SalesOrder: item.SalesOrder
            }
        }
    });

    let amount = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].Amount) {
            amount += items[i].Amount;
        }
    }

    const header = SalesOrderDao.findById(item.SalesOrder);

    console.log("HEADER" + JSON.stringify(header));

    header.Paid = amount;

    SalesOrderDao.update(header);
}