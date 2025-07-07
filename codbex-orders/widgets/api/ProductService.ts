import { Controller, Get } from "sdk/http";
import { query } from "sdk/db";

@Controller
class ProductService {

    @Get("/productData")
    public productData() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        const sqlUnits = `
            SELECT
                p."PRODUCT_NAME" as "NAME",
                SUM(so."SALESORDERITEM_QUANTITY") AS "UNIT_COUNT",
                SUM(so."SALESORDERITEM_GROSS") AS "REVENUE_SUM"
            FROM
                "CODBEX_PRODUCT" p
            JOIN
                "CODBEX_SALESORDERITEM" so ON p."PRODUCT_ID" = so."SALESORDERITEM_PRODUCT"
            GROUP BY
                p."PRODUCT_ID", p."PRODUCT_NAME"
            ORDER BY
                "UNIT_COUNT"
            DESC
            LIMIT 5
        `;
        let resultset = query.execute(sqlUnits);

        const topProductsByUnits = resultset.map(row => ({
            productName: row.NAME,
            unitCount: row.UNIT_COUNT,
            revenue: row.REVENUE_SUM
        }));

        const sqlRevenue = `
            SELECT
                p."PRODUCT_NAME" as "NAME",
                SUM(so."SALESORDERITEM_QUANTITY") AS "UNIT_COUNT",
                SUM(so."SALESORDERITEM_GROSS") AS "REVENUE_SUM"
            FROM
                "CODBEX_PRODUCT" p
            JOIN
                "CODBEX_SALESORDERITEM" so ON p."PRODUCT_ID" = so."SALESORDERITEM_PRODUCT"
            GROUP BY
                p."PRODUCT_ID",
                p."PRODUCT_NAME"
            ORDER BY
                "REVENUE_SUM"
            DESC
            LIMIT 5
        `;
        resultset = query.execute(sqlRevenue);

        const topProductsByRevenue = resultset.map(row => ({
            productName: row.NAME,
            unitCount: row.UNIT_COUNT,
            revenue: row.REVENUE_SUM
        }));

        return {
            "TopProductsByUnits": topProductsByUnits,
            "TopProductsByRevenue": topProductsByRevenue
        };
    }

}