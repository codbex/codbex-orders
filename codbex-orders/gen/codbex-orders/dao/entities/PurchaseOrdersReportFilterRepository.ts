import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface PurchaseOrdersReportFilterEntity {
    readonly PurchaseOrdersReport: string;
    Number?: string;
    Name?: string;
    Date?: Date;
    Due?: Date;
}

export interface PurchaseOrdersReportFilterCreateEntity {
    readonly Number?: string;
    readonly Name?: string;
    readonly Date?: Date;
    readonly Due?: Date;
}

export interface PurchaseOrdersReportFilterUpdateEntity extends PurchaseOrdersReportFilterCreateEntity {
    readonly PurchaseOrdersReport: string;
}

export interface PurchaseOrdersReportFilterEntityOptions {
    $filter?: {
        equals?: {
            PurchaseOrdersReport?: string | string[];
            Number?: string | string[];
            Name?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
        };
        notEquals?: {
            PurchaseOrdersReport?: string | string[];
            Number?: string | string[];
            Name?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
        };
        contains?: {
            PurchaseOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        greaterThan?: {
            PurchaseOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        greaterThanOrEqual?: {
            PurchaseOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        lessThan?: {
            PurchaseOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
        lessThanOrEqual?: {
            PurchaseOrdersReport?: string;
            Number?: string;
            Name?: string;
            Date?: Date;
            Due?: Date;
        };
    },
    $select?: (keyof PurchaseOrdersReportFilterEntity)[],
    $sort?: string | (keyof PurchaseOrdersReportFilterEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

export interface PurchaseOrdersReportFilterEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseOrdersReportFilterEntity>;
    readonly key: {
        name: string;
        column: string;
        value: string;
    }
}

export interface PurchaseOrdersReportFilterUpdateEntityEvent extends PurchaseOrdersReportFilterEntityEvent {
    readonly previousEntity: PurchaseOrdersReportFilterEntity;
}

export class PurchaseOrdersReportFilterRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEORDERSREPORTFILTER",
        properties: [
            {
                name: "PurchaseOrdersReport",
                column: "PURCHASEORDERSREPORTFILTER_PURCHASEORDERSREPORT",
                type: "VARCHAR",
                id: true,
                autoIncrement: false,
            },
            {
                name: "Number",
                column: "PURCHASEORDERSREPORTFILTER_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "Name",
                column: "PURCHASEORDERSREPORTFILTER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "PURCHASEORDERSREPORTFILTER_DATE",
                type: "DATE",
            },
            {
                name: "Due",
                column: "PURCHASEORDERSREPORTFILTER_DUE",
                type: "DATE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PurchaseOrdersReportFilterRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PurchaseOrdersReportFilterEntityOptions = {}): PurchaseOrdersReportFilterEntity[] {
        return this.dao.list(options).map((e: PurchaseOrdersReportFilterEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Due");
            return e;
        });
    }

    public findById(id: string): PurchaseOrdersReportFilterEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Due");
        return entity ?? undefined;
    }

    public create(entity: PurchaseOrdersReportFilterCreateEntity): string {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Due");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEORDERSREPORTFILTER",
            entity: entity,
            key: {
                name: "PurchaseOrdersReport",
                column: "PURCHASEORDERSREPORTFILTER_PURCHASEORDERSREPORT",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseOrdersReportFilterUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Due");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEORDERSREPORTFILTER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "PurchaseOrdersReport",
                column: "PURCHASEORDERSREPORTFILTER_PURCHASEORDERSREPORT",
                value: entity.PurchaseOrdersReport
            }
        });
    }

    public upsert(entity: PurchaseOrdersReportFilterCreateEntity | PurchaseOrdersReportFilterUpdateEntity): string {
        const id = (entity as PurchaseOrdersReportFilterUpdateEntity).PurchaseOrdersReport;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseOrdersReportFilterUpdateEntity);
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
            table: "CODBEX_PURCHASEORDERSREPORTFILTER",
            entity: entity,
            key: {
                name: "PurchaseOrdersReport",
                column: "PURCHASEORDERSREPORTFILTER_PURCHASEORDERSREPORT",
                value: id
            }
        });
    }

    public count(options?: PurchaseOrdersReportFilterEntityOptions): number {
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

    private async triggerEvent(data: PurchaseOrdersReportFilterEntityEvent | PurchaseOrdersReportFilterUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-entities-PurchaseOrdersReportFilter", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-entities-PurchaseOrdersReportFilter").send(JSON.stringify(data));
    }
}
