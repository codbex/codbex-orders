import { SalesOrderRepository } from "../../gen/codbex-orders/dao/SalesOrder/SalesOrderRepository";
import { SalesOrderItemRepository } from "../../gen/codbex-orders/dao/SalesOrder/SalesOrderItemRepository";
import { CatalogueRepository } from "codbex-products/gen/codbex-products/dao/Catalogues/CatalogueRepository";

export const trigger = (event) => {
    const SalesOrderDao = new SalesOrderRepository();
    const SalesOrderItemDao = new SalesOrderItemRepository();
    const CtalogueDao = new CatalogueRepository();

    const item = event.entity;
    const operation = event.operation;

    if (operation === "create" || operation === "update") {

        const salesOrderItem = SalesOrderItemDao.findById(item.Id);

        const salesOrder = SalesOrderDao.findAll({
            $filter: {
                equals: {
                    Id: item.SalesOrder
                }
            }
        });

        const store = salesOrder[0].Store;
        const salesOrderItemProduct = salesOrderItem.Product;

        const catalogue = CtalogueDao.findAll({
            $filter: {
                equals: {
                    Store: store,
                    Product: salesOrderItemProduct
                }
            }
        });

        salesOrderItem.Availability = catalogue[0].Quantity.toFixed(2);

        SalesOrderItemDao.update(salesOrderItem);
    }

}