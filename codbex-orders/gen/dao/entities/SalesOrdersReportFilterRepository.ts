import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface SalesOrdersReportFilterEntity {
    readonly SalesOrdersReport: string;
    Number?: string;
    Name?: string;
    Date?: Date;
    Due?: Date;
}

export interface SalesOrdersReportFilterCreateEntity {
    readonly Number?: string;
    readonly Name?: string;
    readonly Date?: Date;
    readonly Due?: Date;
}

export interface SalesOrdersReportFilterUpdateEntity extends SalesOrdersReportFilterCreateEntity {
    readonly SalesOrdersReport: string;
}

export interface SalesOrdersReportFilterEntityOptions {
    $filter?: {
        equals?: {
            SalesOrdersReport?: string | string[];
            Number?: string | string[];
            Name?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
        };
        notEquals?: {
            SalesOrdersReport?: string | string[];
            Number?: string | string[];
            Name?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
        };
        contains?: {
            SalesOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        greaterThan?: {
            SalesOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        greaterThanOrEqual?: {
            SalesOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        lessThan?: {
            SalesOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        lessThanOrEqual?: {
            SalesOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
    },
    $select?: (keyof SalesOrdersReportFilterEntity)[],
    $sort?: string | (keyof SalesOrdersReportFilterEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesOrdersReportFilterEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesOrdersReportFilterEntity>;
    readonly key: {
        name: string;
        column: string;
        value: string;
    }
}

export class SalesOrdersReportFilterRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ORDERSREPORTFILTER",
        properties: [
            {
                name: "SalesOrdersReport",
                column: "ORDERSREPORTFILTER_SALESORDERSREPORT",
                type: "VARCHAR",
                id: true,
                autoIncrement: false,
            },
            {
                name: "Number",
                column: "ORDERSREPORTFILTER_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "Name",
                column: "ORDERSREPORTFILTER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "ORDERSREPORTFILTER_DATE",
                type: "DATE",
            },
            {
                name: "Due",
                column: "ORDERSREPORTFILTER_DUE",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SalesOrdersReportFilterRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesOrdersReportFilterEntityOptions): SalesOrdersReportFilterEntity[] {
        return this.dao.list(options).map((e: SalesOrdersReportFilterEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Due");
            return e;
        });
    }

    public findById(id: string): SalesOrdersReportFilterEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Due");
        return entity ?? undefined;
    }

    public create(entity: SalesOrdersReportFilterCreateEntity): string {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Due");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ORDERSREPORTFILTER",
            entity: entity,
            key: {
                name: "SalesOrdersReport",
                column: "ORDERSREPORTFILTER_SALESORDERSREPORT",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesOrdersReportFilterUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Due");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ORDERSREPORTFILTER",
            entity: entity,
            key: {
                name: "SalesOrdersReport",
                column: "ORDERSREPORTFILTER_SALESORDERSREPORT",
                value: entity.SalesOrdersReport
            }
        });
    }

    public upsert(entity: SalesOrdersReportFilterCreateEntity | SalesOrdersReportFilterUpdateEntity): string {
        const id = (entity as SalesOrdersReportFilterUpdateEntity).SalesOrdersReport;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesOrdersReportFilterUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: string): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_ORDERSREPORTFILTER",
            entity: entity,
            key: {
                name: "SalesOrdersReport",
                column: "ORDERSREPORTFILTER_SALESORDERSREPORT",
                value: id
            }
        });
    }

    public count(options?: SalesOrdersReportFilterEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ORDERSREPORTFILTER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesOrdersReportFilterEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-entities-SalesOrdersReportFilter", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-entities-SalesOrdersReportFilter").send(JSON.stringify(data));
    }
}
