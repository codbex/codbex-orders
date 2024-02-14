import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface PurchaseOrderEntity {
    readonly Id: number;
    Number: string;
    Date: Date;
    Due?: Date;
    Customer?: number;
    Net?: number;
    Currency: number;
    Gross?: number;
    Discount?: number;
    Taxes?: number;
    VAT?: number;
    Total?: number;
    Conditions?: string;
    PaymentMethod?: number;
    SentMethod?: number;
    Status?: number;
    Operator?: number;
    Document?: string;
    Company?: number;
    Name: string;
    UUID: string;
    Reference?: string;
}

export interface PurchaseOrderCreateEntity {
    readonly Number: string;
    readonly Date: Date;
    readonly Due?: Date;
    readonly Customer?: number;
    readonly Net?: number;
    readonly Currency: number;
    readonly Gross?: number;
    readonly Discount?: number;
    readonly Taxes?: number;
    readonly VAT?: number;
    readonly Conditions?: string;
    readonly PaymentMethod?: number;
    readonly SentMethod?: number;
    readonly Status?: number;
    readonly Operator?: number;
    readonly Document?: string;
    readonly Company?: number;
    readonly UUID: string;
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
            Customer?: number | number[];
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
            Status?: number | number[];
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
            Customer?: number | number[];
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
            Status?: number | number[];
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
            Customer?: number;
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
            Status?: number;
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
            Customer?: number;
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
            Status?: number;
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
            Customer?: number;
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
            Status?: number;
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
            Customer?: number;
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
            Status?: number;
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
            Customer?: number;
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
            Status?: number;
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
            },
            {
                name: "Customer",
                column: "PURCHASEORDER_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Net",
                column: "PURCHASEORDER_NET",
                type: "DOUBLE",
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
                type: "DOUBLE",
            },
            {
                name: "Discount",
                column: "PURCHASEORDER_DISCOUNT",
                type: "DOUBLE",
            },
            {
                name: "Taxes",
                column: "PURCHASEORDER_TAXES",
                type: "DOUBLE",
            },
            {
                name: "VAT",
                column: "PURCHASEORDER_VAT",
                type: "DOUBLE",
            },
            {
                name: "Total",
                column: "PURCHASEORDER_TOTAL",
                type: "DOUBLE",
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
            },
            {
                name: "SentMethod",
                column: "PURCHASEORDER_SENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "PURCHASEORDER_STATUS",
                type: "INTEGER",
            },
            {
                name: "Operator",
                column: "PURCHASEORDER_OPERATOR",
                type: "INTEGER",
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
        (entity as PurchaseOrderEntity).Total = entity["Gross"] - (entity["Gross"] * (entity["Discount"] / 100)) + (entity["Taxes"] / 100) + entity["VAT"];;
        // @ts-ignore
        (entity as PurchaseOrderEntity).Name = entity['Number'] + '/' + entity['Date'] + '/' + entity["Total"];;
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
        // @ts-ignore
        (entity as PurchaseOrderEntity).Total = entity["Gross"] - (entity["Gross"] * (entity["Discount"] / 100)) + (entity["Taxes"] / 100) + entity["VAT"];;
        // @ts-ignore
        (entity as PurchaseOrderEntity).Name = entity['Number'] + '/' + entity['Date'] + '/' + entity["Total"];;
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

    public customDataCount(options?: PurchaseOrderEntityOptions): number {
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
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/PurchaseOrder/PurchaseOrder", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/PurchaseOrder/PurchaseOrder").send(JSON.stringify(data));
    }
}