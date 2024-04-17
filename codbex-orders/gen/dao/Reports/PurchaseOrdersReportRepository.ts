import { database } from "sdk/db";

export interface PurchaseOrdersReport {
    readonly Number: string;
    readonly Name: string;
    readonly Date: Date;
    readonly Due: Date;
}

export interface PurchaseOrdersReportFilter {
    readonly Number?: string;
    readonly Name?: string;
    readonly Date?: Date;
    readonly Due?: Date;
}

export interface PurchaseOrdersReportPaginatedFilter extends PurchaseOrdersReportFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class PurchaseOrdersReportRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: PurchaseOrdersReportPaginatedFilter): PurchaseOrdersReport[] {
        const data: PurchaseOrdersReport[] = [];
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select PURCHASEORDER_NUMBER as "Number",     PURCHASEORDER_NAME as "Name",     PURCHASEORDER_DATE as "Date",     PURCHASEORDER_DUE as "Due" from CODBEX_PURCHASEORDER where PURCHASEORDER_PURCHASEORDERSTATUS != 6 ${     filter.Number && filter.Name && filter.Due && filter.Date ?     `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `     :     filter.Number && filter.Name && filter.Due ?         `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DUE <= ?`     :     filter.Number && filter.Name && filter.Date ?         `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ?`     :     filter.Number && filter.Due && filter.Date ?         `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `     :     filter.Name && filter.Due && filter.Date ?         `AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `     :     filter.Number && filter.Date ?         `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_DATE = ?`     :     filter.Name && filter.Date ?         `AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ?`     :     filter.Due && filter.Date ?         `AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `     :     filter.Number ?         `AND PURCHASEORDER_NUMBER = ?`     :     filter.Name ?         `AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%')`     :     filter.Due ?         `AND PURCHASEORDER_DUE <= ?`     :     filter.Date ?         `AND PURCHASEORDER_DATE = ?`     :         '' } ${     filter["$limit"] && filter["$offset"] ?         'limit ? offset ?'     :     filter["$limit"] ?         'limit ?'     :     filter["$offset"] ?         'offset ?'     :         '' }
            `;

            const statement = connection.prepareStatement(sql);

            let paramIndex = 1;
            if (filter.Number) {
                statement.setString(paramIndex++, filter.Number);
            }
            if (filter.Name) {
                statement.setString(paramIndex++, filter.Name);
            }
            if (filter.Date) {
                statement.setDate(paramIndex++, filter.Date);
            }
            if (filter.Due) {
                statement.setDate(paramIndex++, filter.Due);
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
                    Number: resultSet.getString("Number"),
                    Name: resultSet.getString("Name"),
                    Date: resultSet.getDate("Date"),
                    Due: resultSet.getDate("Due")
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

    public count(filter: PurchaseOrdersReportFilter): number {
        let count = 0;
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select count(*) from (     select PURCHASEORDER_NUMBER as "Number",         PURCHASEORDER_NAME as "Name",         PURCHASEORDER_DATE as "Date",         PURCHASEORDER_DUE as "Due"     from CODBEX_PURCHASEORDER     where PURCHASEORDER_PURCHASEORDERSTATUS != 6     ${         filter.Number && filter.Name && filter.Due && filter.Date ?         `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `         :         filter.Number && filter.Name && filter.Due ?             `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DUE <= ?`         :         filter.Number && filter.Name && filter.Date ?             `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ?`         :         filter.Number && filter.Due && filter.Date ?             `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `         :         filter.Name && filter.Due && filter.Date ?             `AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `         :         filter.Number && filter.Date ?             `AND PURCHASEORDER_NUMBER = ? AND PURCHASEORDER_DATE = ?`         :         filter.Name && filter.Date ?             `AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%') AND PURCHASEORDER_DATE = ?`         :         filter.Due && filter.Date ?             `AND PURCHASEORDER_DATE = ? AND PURCHASEORDER_DUE <= ? `         :         filter.Number ?             `AND PURCHASEORDER_NUMBER = ?`         :         filter.Name ?             `AND PURCHASEORDER_NAME LIKE CONCAT('%', ?, '%')`         :         filter.Due ?             `AND PURCHASEORDER_DUE <= ?`         :         filter.Date ?             `AND PURCHASEORDER_DATE = ?`         :             ''     } )
            `;

            const statement = connection.prepareStatement(sql);

            let paramIndex = 1;
            if (filter.Number) {
                statement.setString(paramIndex++, filter.Number);
            }
            if (filter.Name) {
                statement.setString(paramIndex++, filter.Name);
            }
            if (filter.Date) {
                statement.setDate(paramIndex++, filter.Date);
            }
            if (filter.Due) {
                statement.setDate(paramIndex++, filter.Due);
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