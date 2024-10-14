import { SalesOrderRepository } from "../../gen/codbex-orders/dao/SalesOrder/SalesOrderRepository";
import { SalesOrderItemRepository } from "../../gen/codbex-orders/dao/SalesOrder/SalesOrderItemRepository";

export const trigger = (event) => {
    const SalesOrderDao = new SalesOrderRepository();
    const SalesOrderItemDao = new SalesOrderItemRepository();
    const item = event.entity;

    const items = SalesOrderItemDao.findAll({
        $filter: {
            equals: {
                SalesOrder: item.SalesOrder
            }
        }
    });

    console.log(item.UoM);

    let net = 0;
    let vat = 0;
    let gross = 0;
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].Net) {
            net += items[i].Net;
            vat += items[i].VAT;
            gross += items[i].Gross;
        }
    }

    const header = SalesOrderDao.findById(item.SalesOrder);

    header.Total ??= 0;
    header.Net = net;
    header.VAT = vat;
    header.Gross = gross;

    total = header.Gross - (header.Gross * header.Discount / 100) + (header.Gross * header.Taxes / 100);
    header.Total = total;

    header.Name = header.Name.substring(0, header.Name.lastIndexOf("/") + 1) + header.Total;

    SalesOrderDao.update(header);
}