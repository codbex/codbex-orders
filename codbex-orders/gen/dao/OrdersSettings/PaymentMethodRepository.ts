import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PaymentMethodEntity {
    readonly Id: number;
    Name?: string;
}

export interface PaymentMethodCreateEntity {
    readonly Name?: string;
}

export interface PaymentMethodUpdateEntity extends PaymentMethodCreateEntity {
    readonly Id: number;
}

export interface PaymentMethodEntityOptions {
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
    $select?: (keyof PaymentMethodEntity)[],
    $sort?: string | (keyof PaymentMethodEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PaymentMethodEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PaymentMethodEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class PaymentMethodRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PAYMENTMETHOD",
        properties: [
            {
                name: "Id",
                column: "PAYMENTMETHOD_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PAYMENTMETHOD_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(PaymentMethodRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PaymentMethodEntityOptions): PaymentMethodEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PaymentMethodEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PaymentMethodCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PAYMENTMETHOD",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTMETHOD_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PaymentMethodUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PAYMENTMETHOD",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTMETHOD_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PaymentMethodCreateEntity | PaymentMethodUpdateEntity): number {
        const id = (entity as PaymentMethodUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PaymentMethodUpdateEntity);
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
            table: "CODBEX_PAYMENTMETHOD",
            entity: entity,
            key: {
                name: "Id",
                column: "PAYMENTMETHOD_ID",
                value: id
            }
        });
    }

    public count(options?: PaymentMethodEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: PaymentMethodEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PAYMENTMETHOD"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PaymentMethodEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/OrdersSettings/PaymentMethod", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/OrdersSettings/PaymentMethod").send(JSON.stringify(data));
    }
}