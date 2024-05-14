import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface WorkOrderEntity {
    readonly Id: number;
    Number?: string;
    Date?: Date;
    Due?: Date;
    Customer?: number;
    Task?: string;
    Net?: number;
    Currency?: number;
    Gross?: number;
    Disscount?: number;
    Taxes?: number;
    VAT?: number;
    Total?: number;
    Paid?: number;
    Conditions?: string;
    PaymentMethod?: number;
    SentMethod?: number;
    WorkOrderStatus?: number;
    Operator?: number;
    Document?: string;
    Company?: number;
    UUID: string;
    Name?: string;
    Referances?: string;
    Executor?: number;
    SalesOrder?: number;
}

export interface WorkOrderCreateEntity {
    readonly Date?: Date;
    readonly Due?: Date;
    readonly Customer?: number;
    readonly Task?: string;
    readonly Net?: number;
    readonly Currency?: number;
    readonly Gross?: number;
    readonly Disscount?: number;
    readonly Taxes?: number;
    readonly VAT?: number;
    readonly Total?: number;
    readonly Paid?: number;
    readonly Conditions?: string;
    readonly PaymentMethod?: number;
    readonly SentMethod?: number;
    readonly WorkOrderStatus?: number;
    readonly Operator?: number;
    readonly Document?: string;
    readonly Company?: number;
    readonly Referances?: string;
    readonly Executor?: number;
    readonly SalesOrder?: number;
}

export interface WorkOrderUpdateEntity extends WorkOrderCreateEntity {
    readonly Id: number;
}

export interface WorkOrderEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Customer?: number | number[];
            Task?: string | string[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Disscount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Paid?: number | number[];
            Conditions?: string | string[];
            PaymentMethod?: number | number[];
            SentMethod?: number | number[];
            WorkOrderStatus?: number | number[];
            Operator?: number | number[];
            Document?: string | string[];
            Company?: number | number[];
            UUID?: string | string[];
            Name?: string | string[];
            Referances?: string | string[];
            Executor?: number | number[];
            SalesOrder?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Number?: string | string[];
            Date?: Date | Date[];
            Due?: Date | Date[];
            Customer?: number | number[];
            Task?: string | string[];
            Net?: number | number[];
            Currency?: number | number[];
            Gross?: number | number[];
            Disscount?: number | number[];
            Taxes?: number | number[];
            VAT?: number | number[];
            Total?: number | number[];
            Paid?: number | number[];
            Conditions?: string | string[];
            PaymentMethod?: number | number[];
            SentMethod?: number | number[];
            WorkOrderStatus?: number | number[];
            Operator?: number | number[];
            Document?: string | string[];
            Company?: number | number[];
            UUID?: string | string[];
            Name?: string | string[];
            Referances?: string | string[];
            Executor?: number | number[];
            SalesOrder?: number | number[];
        };
        contains?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Customer?: number;
            Task?: string;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Disscount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Paid?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            WorkOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            UUID?: string;
            Name?: string;
            Referances?: string;
            Executor?: number;
            SalesOrder?: number;
        };
        greaterThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Customer?: number;
            Task?: string;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Disscount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Paid?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            WorkOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            UUID?: string;
            Name?: string;
            Referances?: string;
            Executor?: number;
            SalesOrder?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Customer?: number;
            Task?: string;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Disscount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Paid?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            WorkOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            UUID?: string;
            Name?: string;
            Referances?: string;
            Executor?: number;
            SalesOrder?: number;
        };
        lessThan?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Customer?: number;
            Task?: string;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Disscount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Paid?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            WorkOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            UUID?: string;
            Name?: string;
            Referances?: string;
            Executor?: number;
            SalesOrder?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Number?: string;
            Date?: Date;
            Due?: Date;
            Customer?: number;
            Task?: string;
            Net?: number;
            Currency?: number;
            Gross?: number;
            Disscount?: number;
            Taxes?: number;
            VAT?: number;
            Total?: number;
            Paid?: number;
            Conditions?: string;
            PaymentMethod?: number;
            SentMethod?: number;
            WorkOrderStatus?: number;
            Operator?: number;
            Document?: string;
            Company?: number;
            UUID?: string;
            Name?: string;
            Referances?: string;
            Executor?: number;
            SalesOrder?: number;
        };
    },
    $select?: (keyof WorkOrderEntity)[],
    $sort?: string | (keyof WorkOrderEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface WorkOrderEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<WorkOrderEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class WorkOrderRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_WORKORDER",
        properties: [
            {
                name: "Id",
                column: "WORKORDER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Number",
                column: "WORKORDER_NUMBER",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "WORKORDER_DATE",
                type: "DATE",
            },
            {
                name: "Due",
                column: "WORKORDER_DUE",
                type: "DATE",
            },
            {
                name: "Customer",
                column: "WORKORDER_CUSTOMER",
                type: "INTEGER",
            },
            {
                name: "Task",
                column: "WORKORDER_TASK",
                type: "VARCHAR",
            },
            {
                name: "Net",
                column: "WORKORDER_NET",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "WORKORDER_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Gross",
                column: "WORKORDER_GROSS",
                type: "DECIMAL",
            },
            {
                name: "Disscount",
                column: "WORKORDER_DISSCOUNT",
                type: "DECIMAL",
            },
            {
                name: "Taxes",
                column: "WORKORDER_TAXES",
                type: "DECIMAL",
            },
            {
                name: "VAT",
                column: "WORKORDER_VAT",
                type: "DECIMAL",
            },
            {
                name: "Total",
                column: "WORKORDER_TOTAL",
                type: "DECIMAL",
            },
            {
                name: "Paid",
                column: "WORKORDER_PAID",
                type: "DECIMAL",
            },
            {
                name: "Conditions",
                column: "WORKORDER_CONDITIONS",
                type: "VARCHAR",
            },
            {
                name: "PaymentMethod",
                column: "WORKORDER_PAYMENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "SentMethod",
                column: "WORKORDER_SENTMETHOD",
                type: "INTEGER",
            },
            {
                name: "WorkOrderStatus",
                column: "WORKORDER_WORKORDERSTATUS",
                type: "INTEGER",
            },
            {
                name: "Operator",
                column: "WORKORDER_OPERATOR",
                type: "INTEGER",
            },
            {
                name: "Document",
                column: "WORKORDER_DOCUMENT",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "WORKORDER_COMPANY",
                type: "INTEGER",
            },
            {
                name: "UUID",
                column: "WORKORDER_UUID",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Name",
                column: "WORKORDER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Referances",
                column: "WORKORDER_REFERANCES",
                type: "VARCHAR",
            },
            {
                name: "Executor",
                column: "WORKORDER_EXECUTOR",
                type: "INTEGER",
            },
            {
                name: "SalesOrder",
                column: "WORKORDER_SALESORDER",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(WorkOrderRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: WorkOrderEntityOptions): WorkOrderEntity[] {
        return this.dao.list(options).map((e: WorkOrderEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Due");
            return e;
        });
    }

    public findById(id: number): WorkOrderEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Due");
        return entity ?? undefined;
    }

    public create(entity: WorkOrderCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Due");
        // @ts-ignore
        (entity as WorkOrderEntity).Number = new NumberGeneratorService().generate(4);
        // @ts-ignore
        (entity as WorkOrderEntity).UUID = require("sdk/utils/uuid").random();
        // @ts-ignore
        (entity as WorkOrderEntity).Name = entity["Number"] + "/" + new Date(entity["Date"]).toISOString().slice(0, 10) + "/" + entity["Total"];
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_WORKORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "WORKORDER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: WorkOrderUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Due");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_WORKORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "WORKORDER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: WorkOrderCreateEntity | WorkOrderUpdateEntity): number {
        const id = (entity as WorkOrderUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as WorkOrderUpdateEntity);
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
            table: "CODBEX_WORKORDER",
            entity: entity,
            key: {
                name: "Id",
                column: "WORKORDER_ID",
                value: id
            }
        });
    }

    public count(options?: WorkOrderEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_WORKORDER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: WorkOrderEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-WorkOrder-WorkOrder", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-WorkOrder-WorkOrder").send(JSON.stringify(data));
    }
}
