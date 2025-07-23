import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface SalesOrdersTotalReportFilterEntity {
    readonly SalesOrdersTotalReport: string;
    StartDate?: Date;
    EndDate?: Date;
}

export interface SalesOrdersTotalReportFilterCreateEntity {
    readonly StartDate?: Date;
    readonly EndDate?: Date;
}

export interface SalesOrdersTotalReportFilterUpdateEntity extends SalesOrdersTotalReportFilterCreateEntity {
    readonly SalesOrdersTotalReport: string;
}

export interface SalesOrdersTotalReportFilterEntityOptions {
    $filter?: {
        equals?: {
            SalesOrdersTotalReport?: string | string[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
        };
        notEquals?: {
            SalesOrdersTotalReport?: string | string[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
        };
        contains?: {
            SalesOrdersTotalReport?: string;
            StartDate?: Date;
            EndDate?: Date;
        };
        greaterThan?: {
            SalesOrdersTotalReport?: string;
            StartDate?: Date;
            EndDate?: Date;
        };
        greaterThanOrEqual?: {
            SalesOrdersTotalReport?: string;
            StartDate?: Date;
            EndDate?: Date;
        };
        lessThan?: {
            SalesOrdersTotalReport?: string;
            StartDate?: Date;
            EndDate?: Date;
        };
        lessThanOrEqual?: {
            SalesOrdersTotalReport?: string;
            StartDate?: Date;
            EndDate?: Date;
        };
    },
    $select?: (keyof SalesOrdersTotalReportFilterEntity)[],
    $sort?: string | (keyof SalesOrdersTotalReportFilterEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface SalesOrdersTotalReportFilterEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesOrdersTotalReportFilterEntity>;
    readonly key: {
        name: string;
        column: string;
        value: string;
    }
}

interface SalesOrdersTotalReportFilterUpdateEntityEvent extends SalesOrdersTotalReportFilterEntityEvent {
    readonly previousEntity: SalesOrdersTotalReportFilterEntity;
}

export class SalesOrdersTotalReportFilterRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESORDERSTOTALREPORTFILTER",
        properties: [
            {
                name: "SalesOrdersTotalReport",
                column: "SALESORDERSTOTALREPORTFILTER_SALESORDERSTOTALREPORT",
                type: "VARCHAR",
                id: true,
                autoIncrement: false,
            },
            {
                name: "StartDate",
                column: "SALESORDERSTOTALREPORTFILTER_STARTDATE",
                type: "DATE",
            },
            {
                name: "EndDate",
                column: "SALESORDERSTOTALREPORTFILTER_ENDDATE",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SalesOrdersTotalReportFilterRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: SalesOrdersTotalReportFilterEntityOptions = {}): SalesOrdersTotalReportFilterEntity[] {
        return this.dao.list(options).map((e: SalesOrdersTotalReportFilterEntity) => {
            EntityUtils.setDate(e, "StartDate");
            EntityUtils.setDate(e, "EndDate");
            return e;
        });
    }

    public findById(id: string): SalesOrdersTotalReportFilterEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "StartDate");
        EntityUtils.setDate(entity, "EndDate");
        return entity ?? undefined;
    }

    public create(entity: SalesOrdersTotalReportFilterCreateEntity): string {
        EntityUtils.setLocalDate(entity, "StartDate");
        EntityUtils.setLocalDate(entity, "EndDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESORDERSTOTALREPORTFILTER",
            entity: entity,
            key: {
                name: "SalesOrdersTotalReport",
                column: "SALESORDERSTOTALREPORTFILTER_SALESORDERSTOTALREPORT",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesOrdersTotalReportFilterUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "StartDate");
        // EntityUtils.setLocalDate(entity, "EndDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESORDERSTOTALREPORTFILTER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "SalesOrdersTotalReport",
                column: "SALESORDERSTOTALREPORTFILTER_SALESORDERSTOTALREPORT",
                value: entity.SalesOrdersTotalReport
            }
        });
    }

    public upsert(entity: SalesOrdersTotalReportFilterCreateEntity | SalesOrdersTotalReportFilterUpdateEntity): string {
        const id = (entity as SalesOrdersTotalReportFilterUpdateEntity).SalesOrdersTotalReport;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesOrdersTotalReportFilterUpdateEntity);
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
            table: "CODBEX_SALESORDERSTOTALREPORTFILTER",
            entity: entity,
            key: {
                name: "SalesOrdersTotalReport",
                column: "SALESORDERSTOTALREPORTFILTER_SALESORDERSTOTALREPORT",
                value: id
            }
        });
    }

    public count(options?: SalesOrdersTotalReportFilterEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESORDERSTOTALREPORTFILTER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesOrdersTotalReportFilterEntityEvent | SalesOrdersTotalReportFilterUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-entities-SalesOrdersTotalReportFilter", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-entities-SalesOrdersTotalReportFilter").send(JSON.stringify(data));
    }
}
