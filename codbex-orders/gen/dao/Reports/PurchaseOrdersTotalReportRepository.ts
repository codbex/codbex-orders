import { database } from "sdk/db";

export interface PurchaseOrdersTotalReport {
    readonly Date: Date;
    readonly Total: number;
}

export interface PurchaseOrdersTotalReportFilter {
    readonly StartDate?: Date;
    readonly EndDate?: Date;
}

export interface PurchaseOrdersTotalReportPaginatedFilter extends PurchaseOrdersTotalReportFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class PurchaseOrdersTotalReportRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: PurchaseOrdersTotalReportPaginatedFilter): PurchaseOrdersTotalReport[] {
        const data: PurchaseOrdersTotalReport[] = [];
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select     PURCHASEORDER_DATE as "Date",     sum(PURCHASEORDER_TOTAL) as "Total" from CODBEX_PURCHASEORDER where PURCHASEORDER_PURCHASEORDERSTATUS = 6 ${     filter.StartDate && filter.EndDate ?         `AND PURCHASEORDER_DATE >= ? AND PURCHASEORDER_DATE <= ? `     :     filter.StartDate ?         `AND PURCHASEORDER_DATE >= ?`     :     filter.EndDate ?         `AND PURCHASEORDER_DATE <= ?`     :         '' } group by PURCHASEORDER_DATE ${     filter["$limit"] && filter["$offset"] ?         'limit ? offset ?'     :     filter["$limit"] ?         'limit ?'     :     filter["$offset"] ?         'offset ?'     :         '' }
            `;

            const statement = connection.prepareStatement(sql);

            let paramIndex = 1;
            if (filter.StartDate) {
                statement.setDate(paramIndex++, filter.StartDate);
            }
            if (filter.EndDate) {
                statement.setDate(paramIndex++, filter.EndDate);
            }
            if (filter["$limit"]) {
                statement.setInt(paramIndex++, filter["$limit"]);
            }
            if (filter["$offset"]) {
                statement.setInt(paramIndex++, filter["$offset"]);
            }

            const resultSet = statement.executeQuery();
            while (resultSet.next()) {
                data.push({
                    Date: resultSet.getDate("Date"),
                    Total: resultSet.getDouble("Total")
                });
            }
            resultSet.close();
            statement.close();
        } finally {
            if (connection) {
                connection.close();
            }
        }
        return data;
    }

    public count(filter: PurchaseOrdersTotalReportFilter): number {
        let count = 0;
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select count(*) from (     select         PURCHASEORDER_DATE as "Date",         sum(PURCHASEORDER_TOTAL) as "Total"     from CODBEX_PURCHASEORDER     where PURCHASEORDER_PURCHASEORDERSTATUS = 6     ${         filter.StartDate && filter.EndDate ?             `AND PURCHASEORDER_DATE >= ? AND PURCHASEORDER_DATE <= ? `         :         filter.StartDate ?             `AND PURCHASEORDER_DATE >= ?`         :         filter.EndDate ?             `AND PURCHASEORDER_DATE <= ?`         :             ''     }     group by PURCHASEORDER_DATE )
            `;

            const statement = connection.prepareStatement(sql);

            let paramIndex = 1;
            if (filter.StartDate) {
                statement.setDate(paramIndex++, filter.StartDate);
            }
            if (filter.EndDate) {
                statement.setDate(paramIndex++, filter.EndDate);
            }

            const resultSet = statement.executeQuery();
            while (resultSet.next()) {
                count = resultSet.getInt(1);
            }
            resultSet.close();
            statement.close();
        } finally {
            if (connection) {
                connection.close();
            }
        }
        return count;
    }
}