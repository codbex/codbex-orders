import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface PurchaseOrderItemEntity {
    readonly Id: number;
    PurchaseOrder: number;
    Product: number;
    UoM: number;
    Quantity: number;
    Price: number;
    Net?: number;
    VATRate?: number;
    VAT?: number;
    Gross?: number;
}

export interface PurchaseOrderItemCreateEntity {
    readonly PurchaseOrder: number;
    readonly Product: number;
    readonly UoM: number;
    readonly Quantity: number;
    readonly Price: number;
    readonly VATRate?: number;
}

export interface PurchaseOrderItemUpdateEntity extends PurchaseOrderItemCreateEntity {
    readonly Id: number;
}

export interface PurchaseOrderItemEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            PurchaseOrder?: number | number[];
            Product?: number | number[];
            UoM?: number | number[];
            Quantity?: number | number[];
            Price?: number | number[];
            Net?: number | number[];
            VATRate?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            PurchaseOrder?: number | number[];
            Product?: number | number[];
            UoM?: number | number[];
            Quantity?: number | number[];
            Price?: number | number[];
            Net?: number | number[];
            VATRate?: number | number[];
            VAT?: number | number[];
            Gross?: number | number[];
        };
        contains?: {
            Id?: number;
            PurchaseOrder?: number;
            Product?: number;
            UoM?: number;
            Quantity?: number;
            Price?: number;
            Net?: number;
            VATRate?: number;
            VAT?: number;
            Gross?: number;
        };
        greaterThan?: {
            Id?: number;
            PurchaseOrder?: number;
            Product?: number;
            UoM?: number;
            Quantity?: number;
            Price?: number;
            Net?: number;
            VATRate?: number;
            VAT?: number;
            Gross?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            PurchaseOrder?: number;
            Product?: number;
            UoM?: number;
            Quantity?: number;
            Price?: number;
            Net?: number;
            VATRate?: number;
            VAT?: number;
            Gross?: number;
        };
        lessThan?: {
            Id?: number;
            PurchaseOrder?: number;
            Product?: number;
            UoM?: number;
            Quantity?: number;
            Price?: number;
            Net?: number;
            VATRate?: number;
            VAT?: number;
            Gross?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            PurchaseOrder?: number;
            Product?: number;
            UoM?: number;
            Quantity?: number;
            Price?: number;
            Net?: number;
            VATRate?: number;
            VAT?: number;
            Gross?: number;
        };
    },
    $select?: (keyof PurchaseOrderItemEntity)[],
    $sort?: string | (keyof PurchaseOrderItemEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface PurchaseOrderItemEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseOrderItemEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface PurchaseOrderItemUpdateEntityEvent extends PurchaseOrderItemEntityEvent {
    readonly previousEntity: PurchaseOrderItemEntity;
}

export class PurchaseOrderItemRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEORDERITEM",
        properties: [
            {
                name: "Id",
                column: "PURCHASEORDERITEM_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
                required: true
            },
            {
                name: "PurchaseOrder",
                column: "PURCHASEORDERITEM_PURCHASEORDER",
                type: "INTEGER",
                required: true
            },
            {
                name: "Product",
                column: "PURCHASEORDERITEM_PRODUCT",
                type: "INTEGER",
                required: true
            },
            {
                name: "UoM",
                column: "PURCHASEORDERITEM_UOM",
                type: "INTEGER",
                required: true
            },
            {
                name: "Quantity",
                column: "PURCHASEORDERITEM_QUANTITY",
                type: "DECIMAL",
                required: true
            },
            {
                name: "Price",
                column: "PURCHASEORDERITEM_PRICE",
                type: "DECIMAL",
                required: true
            },
            {
                name: "Net",
                column: "PURCHASEORDERITEM_NET",
                type: "DECIMAL",
            },
            {
                name: "VATRate",
                column: "PURCHASEORDERITEM_VATRATE",
                type: "DECIMAL",
            },
            {
                name: "VAT",
                column: "PURCHASEORDERITEM_VAT",
                type: "DECIMAL",
            },
            {
                name: "Gross",
                column: "PURCHASEORDERITEM_GROSS",
                type: "DECIMAL",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(PurchaseOrderItemRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: PurchaseOrderItemEntityOptions = {}): PurchaseOrderItemEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): PurchaseOrderItemEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: PurchaseOrderItemCreateEntity): number {
        // @ts-ignore
        (entity as PurchaseOrderItemEntity).Net = entity["Quantity"] * entity["Price"];
        // @ts-ignore
        (entity as PurchaseOrderItemEntity).VAT = entity["Price"]*entity["VATRate"]/100;
        // @ts-ignore
        (entity as PurchaseOrderItemEntity).Gross = entity["Net"] + entity["VAT"];
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEORDERITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDERITEM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseOrderItemUpdateEntity): void {
        // @ts-ignore
        (entity as PurchaseOrderItemEntity).Net = entity["Quantity"] * entity["Price"];
        // @ts-ignore
        (entity as PurchaseOrderItemEntity).VAT = entity["Price"]*entity["VATRate"]/100;
        // @ts-ignore
        (entity as PurchaseOrderItemEntity).Gross = entity["Net"] + entity["VAT"];
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEORDERITEM",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "PURCHASEORDERITEM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseOrderItemCreateEntity | PurchaseOrderItemUpdateEntity): number {
        const id = (entity as PurchaseOrderItemUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseOrderItemUpdateEntity);
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
            table: "CODBEX_PURCHASEORDERITEM",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDERITEM_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseOrderItemEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__PURCHASEORDERITEM"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseOrderItemEntityEvent | PurchaseOrderItemUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-PurchaseOrder-PurchaseOrderItem", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-PurchaseOrder-PurchaseOrderItem").send(JSON.stringify(data));
    }
}
