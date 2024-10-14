import { ProductRepository } from "codbex-products/gen/codbex-products/dao/Products/ProductRepository";
import { SalesOrderItemRepository } from "codbex-orders/gen/codbex-orders/dao/SalesOrder/SalesOrderItemRepository";

export const trigger = (event) => {

    const SalesOrderItemDao = new SalesOrderItemRepository();
    const ProductDao = new ProductRepository();

    const item = event.entity;
    const operation = event.operation;

    if (operation === "create") {

        const product = ProductDao.findById(item.Product);

        item.UoM = product.BaseUnit;
        SalesOrderItemDao.update(item);
    }

}