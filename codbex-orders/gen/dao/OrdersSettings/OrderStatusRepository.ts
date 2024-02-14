import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OrderStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface OrderStatusCreateEntity {
    readonly Name?: string;
}

export interface OrderStatusUpdateEntity extends OrderStatusCreateEntity {
    readonly Id: number;
}

export interface OrderStatusEntityOptions {
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
    $select?: (keyof OrderStatusEntity)[],
    $sort?: string | (keyof OrderStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OrderStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OrderStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class OrderStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ORDERSTATUS",
        properties: [
            {
                name: "Id",
                column: "ORDERSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "ORDERSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(OrderStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OrderStatusEntityOptions): OrderStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OrderStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OrderStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "ORDERSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OrderStatusUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "ORDERSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OrderStatusCreateEntity | OrderStatusUpdateEntity): number {
        const id = (entity as OrderStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OrderStatusUpdateEntity);
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
            table: "CODBEX_ORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "ORDERSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: OrderStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: OrderStatusEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__ORDERSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OrderStatusEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/OrdersSettings/OrderStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/OrdersSettings/OrderStatus").send(JSON.stringify(data));
    }
}