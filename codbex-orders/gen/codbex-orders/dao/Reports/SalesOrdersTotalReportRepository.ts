import { database } from "sdk/db";

export interface SalesOrdersTotalReport {
    readonly Date: Date;
    readonly Total: number;
}

export interface SalesOrdersTotalReportFilter {
    readonly StartDate?: Date;
    readonly EndDate?: Date;
}

export interface SalesOrdersTotalReportPaginatedFilter extends SalesOrdersTotalReportFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class SalesOrdersTotalReportRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: SalesOrdersTotalReportPaginatedFilter): SalesOrdersTotalReport[] {
        const data: SalesOrdersTotalReport[] = [];
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select     SALESORDER_DATE as "Date",     sum(SALESORDER_TOTAL) as "Total" from CODBEX_SALESORDER where SALESORDER_SALESORDERSTATUS = 6 ${     filter.StartDate && filter.EndDate ?         `AND SALESORDER_DATE >= ? AND SALESORDER_DATE <= ? `     :     filter.StartDate ?         `AND SALESORDER_DATE >= ?`     :     filter.EndDate ?         `AND SALESORDER_DATE <= ?`     :         '' } group by SALESORDER_DATE ${     filter["$limit"] && filter["$offset"] ?         'limit ? offset ?'     :     filter["$limit"] ?         'limit ?'     :     filter["$offset"] ?         'offset ?'     :         '' }
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

    public count(filter: SalesOrdersTotalReportFilter): number {
        let count = 0;
        let connection;
        try {
            connection = database.getConnection(this.datasourceName);

            const sql = `
                select count(*) from (     select         SALESORDER_DATE as "Date",         sum(SALESORDER_TOTAL) as "Total"     from CODBEX_SALESORDER     where SALESORDER_SALESORDERSTATUS = 6     ${         filter.StartDate && filter.EndDate ?             `AND SALESORDER_DATE >= ? AND SALESORDER_DATE <= ? `         :         filter.StartDate ?             `AND SALESORDER_DATE >= ?`         :         filter.EndDate ?             `AND SALESORDER_DATE <= ?`         :             ''     }     group by SALESORDER_DATE )
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