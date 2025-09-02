import { sql, query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface WorkOrderStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface WorkOrderStatusCreateEntity {
    readonly Name?: string;
}

export interface WorkOrderStatusUpdateEntity extends WorkOrderStatusCreateEntity {
    readonly Id: number;
}

export interface WorkOrderStatusEntityOptions {
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
    $select?: (keyof WorkOrderStatusEntity)[],
    $sort?: string | (keyof WorkOrderStatusEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface WorkOrderStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<WorkOrderStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface WorkOrderStatusUpdateEntityEvent extends WorkOrderStatusEntityEvent {
    readonly previousEntity: WorkOrderStatusEntity;
}

export class WorkOrderStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_WORKORDERSTATUS",
        properties: [
            {
                name: "Id",
                column: "WORKORDERSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "WORKORDERSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(WorkOrderStatusRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: WorkOrderStatusEntityOptions = {}): WorkOrderStatusEntity[] {
        let list = this.dao.list(options);
        return list;
    }

    public findById(id: number, options: WorkOrderStatusEntityOptions = {}): WorkOrderStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: WorkOrderStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_WORKORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "WORKORDERSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: WorkOrderStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_WORKORDERSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "WORKORDERSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: WorkOrderStatusCreateEntity | WorkOrderStatusUpdateEntity): number {
        const id = (entity as WorkOrderStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as WorkOrderStatusUpdateEntity);
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
            table: "CODBEX_WORKORDERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "WORKORDERSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: WorkOrderStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_WORKORDERSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: WorkOrderStatusEntityEvent | WorkOrderStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-Settings-WorkOrderStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-Settings-WorkOrderStatus").send(JSON.stringify(data));
    }
}
