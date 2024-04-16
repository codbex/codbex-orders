import { database } from "sdk/db";

export interface SalesOrdersReport {
    readonly Number: string;
    readonly Name: string;
    readonly Date: Date;
    readonly Due: Date;
}

export interface SalesOrdersReportFilter {
    readonly Number?: string;
    readonly Name?: string;
    readonly Date?: Date;
    readonly Due?: Date;
}

export interface SalesOrdersReportPaginatedFilter extends SalesOrdersReportFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class SalesOrdersReportRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: SalesOrdersReportPaginatedFilter): SalesOrdersReport[] {
        const data: SalesOrdersReport[] = [];
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select SALESORDER_NUMBER as "Number",     SALESORDER_NAME as "Name",     SALESORDER_DATE as "Date",     SALESORDER_DUE as "Due" from CODBEX_SALESORDER where SALESORDER_SALESORDERSTATUS != 6 ${     filter.Number && filter.Name && filter.Due && filter.Date ?     `AND SALESORDER_NUMBER = ? AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `     :     filter.Number && filter.Name && filter.Due ?         `AND SALESORDER_NUMBER = ? AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DUE <= ?`     :     filter.Number && filter.Name && filter.Date ?         `AND SALESORDER_NUMBER = ? AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ?`     :     filter.Number && filter.Due && filter.Date ?         `AND SALESORDER_NUMBER = ? AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `     :     filter.Name && filter.Due && filter.Date ?         `AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `     :     filter.Number && filter.Date ?         `AND SALESORDER_NUMBER = ? AND SALESORDER_DATE = ?`     :     filter.Name && filter.Date ?         `AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ?`     :     filter.Due && filter.Date ?         `AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `     :     filter.Number ?         `AND SALESORDER_NUMBER = ?`     :     filter.Name ?         `AND SALESORDER_NAME LIKE CONCAT('%', ?, '%')`     :     filter.Due ?         `AND SALESORDER_DUE <= ?`     :     filter.Date ?         `AND SALESORDER_DATE = ?`     :         '' } ${     filter["$limit"] && filter["$offset"] ?         'limit ? offset ?'     :     filter["$limit"] ?         'limit ?'     :     filter["$offset"] ?         'offset ?'     :         '' }
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

    public count(filter: SalesOrdersReportFilter): number {
        let count = 0;
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select count(*) from (     select SALESORDER_NUMBER as "Number",         SALESORDER_NAME as "Name",         SALESORDER_DATE as "Date",         SALESORDER_DUE as "Due"     from CODBEX_SALESORDER     where SALESORDER_SALESORDERSTATUS != 6     ${         filter.Number && filter.Name && filter.Due && filter.Date ?         `AND SALESORDER_NUMBER = ? AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `         :         filter.Number && filter.Name && filter.Due ?             `AND SALESORDER_NUMBER = ? AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DUE <= ?`         :         filter.Number && filter.Name && filter.Date ?             `AND SALESORDER_NUMBER = ? AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ?`         :         filter.Number && filter.Due && filter.Date ?             `AND SALESORDER_NUMBER = ? AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `         :         filter.Name && filter.Due && filter.Date ?             `AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `         :         filter.Number && filter.Date ?             `AND SALESORDER_NUMBER = ? AND SALESORDER_DATE = ?`         :         filter.Name && filter.Date ?             `AND SALESORDER_NAME LIKE CONCAT('%', ?, '%') AND SALESORDER_DATE = ?`         :         filter.Due && filter.Date ?             `AND SALESORDER_DATE = ? AND SALESORDER_DUE <= ? `         :         filter.Number ?             `AND SALESORDER_NUMBER = ?`         :         filter.Name ?             `AND SALESORDER_NAME LIKE CONCAT('%', ?, '%')`         :         filter.Due ?             `AND SALESORDER_DUE <= ?`         :         filter.Date ?             `AND SALESORDER_DATE = ?`         :             ''     } )
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