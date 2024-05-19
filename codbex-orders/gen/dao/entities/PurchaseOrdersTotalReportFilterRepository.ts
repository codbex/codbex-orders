import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface PurchaseOrdersTotalReportFilterEntity {
    readonly PurchaseOrdersTotalReport: Date;
    StartDate?: Date;
    EndDate?: Date;
}

export interface PurchaseOrdersTotalReportFilterCreateEntity {
    readonly StartDate?: Date;
    readonly EndDate?: Date;
}

export interface PurchaseOrdersTotalReportFilterUpdateEntity extends PurchaseOrdersTotalReportFilterCreateEntity {
    readonly PurchaseOrdersTotalReport: Date;
}

export interface PurchaseOrdersTotalReportFilterEntityOptions {
    $filter?: {
        equals?: {
            PurchaseOrdersTotalReport?: Date | Date[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
        };
        notEquals?: {
            PurchaseOrdersTotalReport?: Date | Date[];
            StartDate?: Date | Date[];
            EndDate?: Date | Date[];
        };
        contains?: {
            PurchaseOrdersTotalReport?: Date;
            StartDate?: Date;
            EndDate?: Date;
        };
        greaterThan?: {
            PurchaseOrdersTotalReport?: Date;
            StartDate?: Date;
            EndDate?: Date;
        };
        greaterThanOrEqual?: {
            PurchaseOrdersTotalReport?: Date;
            StartDate?: Date;
            EndDate?: Date;
        };
        lessThan?: {
            PurchaseOrdersTotalReport?: Date;
            StartDate?: Date;
            EndDate?: Date;
        };
        lessThanOrEqual?: {
            PurchaseOrdersTotalReport?: Date;
            StartDate?: Date;
            EndDate?: Date;
        };
    },
    $select?: (keyof PurchaseOrdersTotalReportFilterEntity)[],
    $sort?: string | (keyof PurchaseOrdersTotalReportFilterEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PurchaseOrdersTotalReportFilterEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseOrdersTotalReportFilterEntity>;
    readonly key: {
        name: string;
        column: string;
        value: Date;
    }
}

export class PurchaseOrdersTotalReportFilterRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEORDERSTOTALREPORTFILTER",
        properties: [
            {
                name: "PurchaseOrdersTotalReport",
                column: "PURCHASEORDERSTOTALREPORTFILTER_PURCHASEORDERSTOTALREPORT",
                type: "DATE",
                id: true,
                autoIncrement: false,
            },
            {
                name: "StartDate",
                column: "PURCHASEORDERSTOTALREPORTFILTER_STARTDATE",
                type: "DATE",
            },
            {
                name: "EndDate",
                column: "PURCHASEORDERSTOTALREPORTFILTER_ENDDATE",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PurchaseOrdersTotalReportFilterRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PurchaseOrdersTotalReportFilterEntityOptions): PurchaseOrdersTotalReportFilterEntity[] {
        return this.dao.list(options).map((e: PurchaseOrdersTotalReportFilterEntity) => {
            EntityUtils.setDate(e, "PurchaseOrdersTotalReport");
            EntityUtils.setDate(e, "StartDate");
            EntityUtils.setDate(e, "EndDate");
            return e;
        });
    }

    public findById(id: Date): PurchaseOrdersTotalReportFilterEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "PurchaseOrdersTotalReport");
        EntityUtils.setDate(entity, "StartDate");
        EntityUtils.setDate(entity, "EndDate");
        return entity ?? undefined;
    }

    public create(entity: PurchaseOrdersTotalReportFilterCreateEntity): Date {
        EntityUtils.setLocalDate(entity, "PurchaseOrdersTotalReport");
        EntityUtils.setLocalDate(entity, "StartDate");
        EntityUtils.setLocalDate(entity, "EndDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEORDERSTOTALREPORTFILTER",
            entity: entity,
            key: {
                name: "PurchaseOrdersTotalReport",
                column: "PURCHASEORDERSTOTALREPORTFILTER_PURCHASEORDERSTOTALREPORT",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseOrdersTotalReportFilterUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "PurchaseOrdersTotalReport");
        // EntityUtils.setLocalDate(entity, "StartDate");
        // EntityUtils.setLocalDate(entity, "EndDate");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEORDERSTOTALREPORTFILTER",
            entity: entity,
            key: {
                name: "PurchaseOrdersTotalReport",
                column: "PURCHASEORDERSTOTALREPORTFILTER_PURCHASEORDERSTOTALREPORT",
                value: entity.PurchaseOrdersTotalReport
            }
        });
    }

    public upsert(entity: PurchaseOrdersTotalReportFilterCreateEntity | PurchaseOrdersTotalReportFilterUpdateEntity): Date {
        const id = (entity as PurchaseOrdersTotalReportFilterUpdateEntity).PurchaseOrdersTotalReport;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseOrdersTotalReportFilterUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: Date): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_PURCHASEORDERSTOTALREPORTFILTER",
            entity: entity,
            key: {
                name: "PurchaseOrdersTotalReport",
                column: "PURCHASEORDERSTOTALREPORTFILTER_PURCHASEORDERSTOTALREPORT",
                value: id
            }
        });
    }

    public count(options?: PurchaseOrdersTotalReportFilterEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEORDERSTOTALREPORTFILTER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseOrdersTotalReportFilterEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-entities-PurchaseOrdersTotalReportFilter", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-entities-PurchaseOrdersTotalReportFilter").send(JSON.stringify(data));
    }
}
