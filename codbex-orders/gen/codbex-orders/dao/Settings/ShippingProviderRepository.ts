import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ShippingProviderEntity {
    readonly Id: number;
    Name?: string;
}

export interface ShippingProviderCreateEntity {
    readonly Name?: string;
}

export interface ShippingProviderUpdateEntity extends ShippingProviderCreateEntity {
    readonly Id: number;
}

export interface ShippingProviderEntityOptions {
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
    $select?: (keyof ShippingProviderEntity)[],
    $sort?: string | (keyof ShippingProviderEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

export interface ShippingProviderEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ShippingProviderEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface ShippingProviderUpdateEntityEvent extends ShippingProviderEntityEvent {
    readonly previousEntity: ShippingProviderEntity;
}

export class ShippingProviderRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SHIPPINGPROVIDER",
        properties: [
            {
                name: "Id",
                column: "SHIPPINGPROVIDER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "SHIPPINGPROVIDER_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(ShippingProviderRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: ShippingProviderEntityOptions = {}): ShippingProviderEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ShippingProviderEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ShippingProviderCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SHIPPINGPROVIDER",
            entity: entity,
            key: {
                name: "Id",
                column: "SHIPPINGPROVIDER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ShippingProviderUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SHIPPINGPROVIDER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "SHIPPINGPROVIDER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ShippingProviderCreateEntity | ShippingProviderUpdateEntity): number {
        const id = (entity as ShippingProviderUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ShippingProviderUpdateEntity);
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
            table: "CODBEX_SHIPPINGPROVIDER",
            entity: entity,
            key: {
                name: "Id",
                column: "SHIPPINGPROVIDER_ID",
                value: id
            }
        });
    }

    public count(options?: ShippingProviderEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SHIPPINGPROVIDER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ShippingProviderEntityEvent | ShippingProviderUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-Settings-ShippingProvider", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-Settings-ShippingProvider").send(JSON.stringify(data));
    }
}
