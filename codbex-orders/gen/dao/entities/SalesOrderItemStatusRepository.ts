import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SalesOrderItemStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface SalesOrderItemStatusCreateEntity {
    readonly Name?: string;
}

export interface SalesOrderItemStatusUpdateEntity extends SalesOrderItemStatusCreateEntity {
    readonly Id: number;
}

export interface SalesOrderItemStatusEntityOptions {
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
    $select?: (keyof SalesOrderItemStatusEntity)[],
    $sort?: string | (keyof SalesOrderItemStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesOrderItemStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesOrderItemStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface SalesOrderItemStatusUpdateEntityEvent extends SalesOrderItemStatusEntityEvent {
    readonly previousEntity: SalesOrderItemStatusEntity;
}

export class SalesOrderItemStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESORDERITEMSTATUS",
        properties: [
            {
                name: "Id",
                column: "SALESORDERITEMSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "SALESORDERITEMSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(SalesOrderItemStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesOrderItemStatusEntityOptions): SalesOrderItemStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SalesOrderItemStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SalesOrderItemStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESORDERITEMSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDERITEMSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesOrderItemStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESORDERITEMSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SALESORDERITEMSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesOrderItemStatusCreateEntity | SalesOrderItemStatusUpdateEntity): number {
        const id = (entity as SalesOrderItemStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesOrderItemStatusUpdateEntity);
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
            table: "CODBEX_SALESORDERITEMSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDERITEMSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: SalesOrderItemStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESORDERITEMSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesOrderItemStatusEntityEvent | SalesOrderItemStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-entities-SalesOrderItemStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-entities-SalesOrderItemStatus").send(JSON.stringify(data));
    }
}
