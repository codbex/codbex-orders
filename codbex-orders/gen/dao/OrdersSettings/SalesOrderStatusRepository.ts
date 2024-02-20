import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface SalesOrderStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface SalesOrderStatusCreateEntity {
    readonly Name?: string;
}

export interface SalesOrderStatusUpdateEntity extends SalesOrderStatusCreateEntity {
    readonly Id: number;
}

export interface SalesOrderStatusEntityOptions {
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
    $select?: (keyof SalesOrderStatusEntity)[],
    $sort?: string | (keyof SalesOrderStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesOrderStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesOrderStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SalesOrderStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESORDERSTATUS",
        properties: [
            {
                name: "Id",
                column: "SALESORDERSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "SALESORDERSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SalesOrderStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesOrderStatusEntityOptions): SalesOrderStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): SalesOrderStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: SalesOrderStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDERSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesOrderStatusUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDERSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesOrderStatusCreateEntity | SalesOrderStatusUpdateEntity): number {
        const id = (entity as SalesOrderStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesOrderStatusUpdateEntity);
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
            table: "CODBEX_SALESORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDERSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: SalesOrderStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: SalesOrderStatusEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SALESORDERSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesOrderStatusEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/OrdersSettings/SalesOrderStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/OrdersSettings/SalesOrderStatus").send(JSON.stringify(data));
    }
}