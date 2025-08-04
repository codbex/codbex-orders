import { SalesOrderRepository } from "../../gen/codbex-orders/dao/SalesOrder/SalesOrderRepository";
import { SalesOrderItemRepository } from "../../gen/codbex-orders/dao/SalesOrder/SalesOrderItemRepository";

export const trigger = (event) => {

    console.log("event triggered!");

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

    console.log(JSON.stringify(items));

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

    console.log(JSON.stringify(header));

    header.Total ??= 0;
    header.Net = net;
    header.VAT = vat;
    header.Gross = gross;

    console.log("gross");
    console.log(header.Gross);

    console.log("disc");
    console.log(header.Discount);

    console.log("taxes");
    console.log(header.Taxes);

    const discount = header.Discount ?? 0;
    const taxes = header.Taxes ?? 0;

    total = header.Gross - (header.Gross * discount / 100) + (header.Gross * taxes / 100);
    header.Total = total;

    header.Name = header.Name.substring(0, header.Name.lastIndexOf("/") + 1) + header.Total;

    console.log("updated");
    console.log(JSON.stringify(header));

    SalesOrderDao.update(header);
}