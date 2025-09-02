import { sql, query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PurchaseOrderStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface PurchaseOrderStatusCreateEntity {
    readonly Name?: string;
}

export interface PurchaseOrderStatusUpdateEntity extends PurchaseOrderStatusCreateEntity {
    readonly Id: number;
}

export interface PurchaseOrderStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof PurchaseOrderStatusEntity)[],
    $sort?: string | (keyof PurchaseOrderStatusEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface PurchaseOrderStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseOrderStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface PurchaseOrderStatusUpdateEntityEvent extends PurchaseOrderStatusEntityEvent {
    readonly previousEntity: PurchaseOrderStatusEntity;
}

export class PurchaseOrderStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEORDERSTATUS",
        properties: [
            {
                name: "Id",
                column: "PURCHASEORDERSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PURCHASEORDERSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PurchaseOrderStatusRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PurchaseOrderStatusEntityOptions = {}): PurchaseOrderStatusEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: PurchaseOrderStatusEntityOptions = {}): PurchaseOrderStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PurchaseOrderStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDERSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseOrderStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEORDERSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PURCHASEORDERSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseOrderStatusCreateEntity | PurchaseOrderStatusUpdateEntity): number {
        const id = (entity as PurchaseOrderStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseOrderStatusUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_PURCHASEORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDERSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseOrderStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEORDERSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseOrderStatusEntityEvent | PurchaseOrderStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-Settings-PurchaseOrderStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-Settings-PurchaseOrderStatus").send(JSON.stringify(data));
    }
}
