import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

export interface PurchaseOrderEntity {
    readonly Id: number;
    Number: string;
    Date: Date;
    Due: Date;
    Supplier: number;
    Net?: number;
    Currency: number;
    Gross?: number;
    Discount?: number;
    Taxes?: number;
    VAT?: number;
    Total?: number;
    Conditions?: string;
    PaymentMethod: number;
    SentMethod: number;
    PurchaseOrderStatus: number;
    Operator: number;
    Document?: string;
    Company?: number;
    Name: string;
    UUID: string;
    Reference?: string;
}

export interface PurchaseOrderCreateEntity {
    readonly Date: Date;
    readonly Due: Date;
    readonly Supplier: number;
    readonly Net?: number;
    readonly Currency: number;
    readonly Gross?: number;
    readonly Discount?: number;
    readonly Taxes?: number;
    readonly VAT?: number;
    readonly Total?: number;
    readonly Conditions?: string;
    readonly PaymentMethod: number;
    readonly SentMethod: number;
    readonly PurchaseOrderStatus: number;
    readonly Operator: number;
    readonly Document?: string;
    readonly Company?: number;
    readonly Reference?: string;
}

export interface PurchaseOrderUpdateEntity extends PurchaseOrderCreateEntity {
    readonly Id: number;
}

export interface PurchaseOrderEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Supplier?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Discount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Conditions?: string | string[];
            PaymentMethod?: number | number[];
            SentMethod?: number | number[];
            PurchaseOrderStatus?: number | number[];
            Operator?: number | number[];
            Document?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Supplier?: number | number[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Discount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Conditions?: string | string[];
            PaymentMethod?: number | number[];
            SentMethod?: number | number[];
            PurchaseOrderStatus?: number | number[];
            Operator?: number | number[];
            Document?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            PurchaseOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            PurchaseOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            PurchaseOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            PurchaseOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Supplier?: number;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Discount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            PurchaseOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
    },
    $select?: (keyof PurchaseOrderEntity)[],
    $sort?: string | (keyof PurchaseOrderEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface PurchaseOrderEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<PurchaseOrderEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class PurchaseOrderRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PURCHASEORDER",
        properties: [
            {
                name: "Id",
                column: "PURCHASEORDER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
                required: true
            },
            {
                name: "Number",
                column: "PURCHASEORDER_NUMBER",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Date",
                column: "PURCHASEORDER_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Due",
                column: "PURCHASEORDER_DUE",
                type: "DATE",
                required: true
            },
            {
                name: "Supplier",
                column: "PURCHASEORDER_SUPPLIER",
                type: "INTEGER",
                required: true
            },
            {
                name: "Net",
                column: "PURCHASEORDER_NET",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "PURCHASEORDER_CURRENCY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Gross",
                column: "PURCHASEORDER_GROSS",
                type: "DECIMAL",
            },
            {
                name: "Discount",
                column: "PURCHASEORDER_DISCOUNT",
                type: "DECIMAL",
            },
            {
                name: "Taxes",
                column: "PURCHASEORDER_TAXES",
                type: "DECIMAL",
            },
            {
                name: "VAT",
                column: "PURCHASEORDER_VAT",
                type: "DECIMAL",
            },
            {
                name: "Total",
                column: "PURCHASEORDER_TOTAL",
                type: "DECIMAL",
            },
            {
                name: "Conditions",
                column: "PURCHASEORDER_CONDITIONS",
                type: "VARCHAR",
            },
            {
                name: "PaymentMethod",
                column: "PURCHASEORDER_PAYMENTMETHOD",
                type: "INTEGER",
                required: true
            },
            {
                name: "SentMethod",
                column: "PURCHASEORDER_SENTMETHOD",
                type: "INTEGER",
                required: true
            },
            {
                name: "PurchaseOrderStatus",
                column: "PURCHASEORDER_PURCHASEORDERSTATUS",
                type: "INTEGER",
                required: true
            },
            {
                name: "Operator",
                column: "PURCHASEORDER_OPERATOR",
                type: "INTEGER",
                required: true
            },
            {
                name: "Document",
                column: "PURCHASEORDER_DOCUMENT",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "PURCHASEORDER_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "PURCHASEORDER_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "UUID",
                column: "PURCHASEORDER_UUID",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Reference",
                column: "PURCHASEORDER_REFERENCE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(PurchaseOrderRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: PurchaseOrderEntityOptions): PurchaseOrderEntity[] {
        return this.dao.list(options).map((e: PurchaseOrderEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Due");
            return e;
        });
    }

    public findById(id: number): PurchaseOrderEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Due");
        return entity ?? undefined;
    }

    public create(entity: PurchaseOrderCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Due");
        // @ts-ignore
        (entity as PurchaseOrderEntity).Number = new NumberGeneratorService().generate(9);
        // @ts-ignore
        (entity as PurchaseOrderEntity).Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + entity["Total"];
        // @ts-ignore
        (entity as PurchaseOrderEntity).UUID = require("sdk/utils/uuid").random();
        if (!entity.Discount) {
            entity.Discount = "0";
        }
        if (!entity.Taxes) {
            entity.Taxes = "0";
        }
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PURCHASEORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: PurchaseOrderUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Due");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PURCHASEORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: PurchaseOrderCreateEntity | PurchaseOrderUpdateEntity): number {
        const id = (entity as PurchaseOrderUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as PurchaseOrderUpdateEntity);
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
            table: "CODBEX_PURCHASEORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "PURCHASEORDER_ID",
                value: id
            }
        });
    }

    public count(options?: PurchaseOrderEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__PURCHASEORDER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: PurchaseOrderEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-PurchaseOrder-PurchaseOrder", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-PurchaseOrder-PurchaseOrder").send(JSON.stringify(data));
    }
}
