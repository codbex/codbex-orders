import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface SalesOrderEntity {
    readonly Id: number;
    Number: string;
    Date: Date;
    Due?: number;
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
    Name?: string;
    UUID: string;
    Reference?: string;
}

export interface SalesOrderCreateEntity {
    readonly Number: string;
    readonly Date: Date;
    readonly Due?: number;
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

export interface SalesOrderUpdateEntity extends SalesOrderCreateEntity {
    readonly Id: number;
}

export interface SalesOrderEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: number | number[];
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
            Due?: number | number[];
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
            Due?: number;
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
            Due?: number;
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
            Due?: number;
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
            Due?: number;
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
            Due?: number;
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
    $select?: (keyof SalesOrderEntity)[],
    $sort?: string | (keyof SalesOrderEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SalesOrderEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SalesOrderEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SalesOrderRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SALESORDER",
        properties: [
            {
                name: "Id",
                column: "SALESORDER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "SALESORDER_NUMBER",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Date",
                column: "SALESORDER_DATE",
                type: "DATE",
                required: true
            },
            {
                name: "Due",
                column: "SALESORDER_DUE",
                type: "DOUBLE",
            },
            {
                name: "Customer",
                column: "SALESORDER_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Net",
                column: "SALESORDER_NET",
                type: "DOUBLE",
            },
            {
                name: "Currency",
                column: "SALESORDER_CURRENCY",
                type: "INTEGER",
                required: true
            },
            {
                name: "Gross",
                column: "SALESORDER_GROSS",
                type: "DOUBLE",
            },
            {
                name: "Discount",
                column: "SALESORDER_DISCOUNT",
                type: "DOUBLE",
            },
            {
                name: "Taxes",
                column: "SALESORDER_TAXES",
                type: "DOUBLE",
            },
            {
                name: "VAT",
                column: "SALESORDER_VAT",
                type: "DOUBLE",
            },
            {
                name: "Total",
                column: "SALESORDER_TOTAL",
                type: "DOUBLE",
            },
            {
                name: "Conditions",
                column: "SALESORDER_CONDITIONS",
                type: "VARCHAR",
            },
            {
                name: "PaymentMethod",
                column: "SALESORDER_PAYMENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "SentMethod",
                column: "SALESORDER_SENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "SALESORDER_STATUS",
                type: "INTEGER",
            },
            {
                name: "Operator",
                column: "SALESORDER_OPERATOR",
                type: "INTEGER",
            },
            {
                name: "Document",
                column: "SALESORDER_DOCUMENT",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "SALESORDER_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "SALESORDER_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "SALESORDER_UUID",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Reference",
                column: "SALESORDER_REFERENCE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SalesOrderRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SalesOrderEntityOptions): SalesOrderEntity[] {
        return this.dao.list(options).map((e: SalesOrderEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): SalesOrderEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: SalesOrderCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as SalesOrderEntity).Total = entity["Gross"] - (entity["Gross"] * (entity["Discount"] / 100)) + (entity["Taxes"] / 100) + entity["VAT"];;
        // @ts-ignore
        (entity as SalesOrderEntity).Name = entity['Number'] + '/' + entity['Date'] + '/' + entity["Total"];;
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SALESORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SalesOrderUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // @ts-ignore
        (entity as SalesOrderEntity).Total = entity["Gross"] - (entity["Gross"] * (entity["Discount"] / 100)) + (entity["Taxes"] / 100) + entity["VAT"];;
        // @ts-ignore
        (entity as SalesOrderEntity).Name = entity['Number'] + '/' + entity['Date'] + '/' + entity["Total"];;
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SALESORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SalesOrderCreateEntity | SalesOrderUpdateEntity): number {
        const id = (entity as SalesOrderUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SalesOrderUpdateEntity);
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
            table: "CODBEX_SALESORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "SALESORDER_ID",
                value: id
            }
        });
    }

    public count(options?: SalesOrderEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: SalesOrderEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__SALESORDER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SalesOrderEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/SalesOrder/SalesOrder", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/SalesOrder/SalesOrder").send(JSON.stringify(data));
    }
}