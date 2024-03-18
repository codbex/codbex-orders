import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PurchaseOrderPaymentEntity {
    readonly Id: number;
    PurchaseOrder: number;
    SupplierPayment: number;
    Amount: number;
}

export interface PurchaseOrderPaymentCreateEntity {
    readonly PurchaseOrder: number;
    readonly SupplierPayment: number;
    readonly Amount: number;
}

export interface PurchaseOrderPaymentUpdateEntity extends PurchaseOrderPaymentCreateEntity {
    readonly Id: number;
}

export interface PurchaseOrderPaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            PurchaseOrder?: number | number[];
            SupplierPayment?: number | number[];
            Amount?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            PurchaseOrder?: number | number[];
            SupplierPayment?: number | number[];
            Amount?: number | number[];
        };
        contains?: {
            Id?: number;
            PurchaseOrder?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        greaterThan?: {
            Id?: number;
            PurchaseOrder?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            PurchaseOrder?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        lessThan?: {
            Id?: number;
            PurchaseOrder?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            PurchaseOrder?: number;
            SupplierPayment?: number;
            Amount?: number;
        };
    },
    $select?: (keyof PurchaseOrderPaymentEntity)[],
    $sort?: string | (keyof PurchaseOrderPaymentEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PurchaseOrderPaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseOrderPaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class PurchaseOrderPaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEORDERPAYMENT",
        properties: [
            {
                name: "Id",
                column: "PURCHASEORDERPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "PurchaseOrder",
                column: "PURCHASEORDERPAYMENT_PURCHASEORDER",
                type: "INTEGER",
                required: true
            },
            {
                name: "SupplierPayment",
                column: "PURCHASEORDERPAYMENT_SUPPLIERPAYMENT",
                type: "INTEGER",
                required: true
            },
            {
                name: "Amount",
                column: "PURCHASEORDERPAYMENT_AMOUNT",
                type: "DECIMAL",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(PurchaseOrderPaymentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PurchaseOrderPaymentEntityOptions): PurchaseOrderPaymentEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PurchaseOrderPaymentEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PurchaseOrderPaymentCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEORDERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDERPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseOrderPaymentUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEORDERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDERPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseOrderPaymentCreateEntity | PurchaseOrderPaymentUpdateEntity): number {
        const id = (entity as PurchaseOrderPaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseOrderPaymentUpdateEntity);
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
            table: "CODBEX_PURCHASEORDERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDERPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseOrderPaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEORDERPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseOrderPaymentEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-PurchaseOrder-PurchaseOrderPayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-PurchaseOrder-PurchaseOrderPayment").send(JSON.stringify(data));
    }
}
