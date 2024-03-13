import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface CustomerPaymentEntity {
    readonly Id: number;
    Date?: Date;
    Valor?: Date;
    CompanyIBAN?: string;
    Amount?: number;
    Currency?: number;
    Reason?: string;
    Description?: string;
    Company?: number;
    Name?: string;
    UUID?: string;
    Reference?: string;
}

export interface CustomerPaymentCreateEntity {
    readonly Date?: Date;
    readonly Valor?: Date;
    readonly CompanyIBAN?: string;
    readonly Amount?: number;
    readonly Currency?: number;
    readonly Reason?: string;
    readonly Description?: string;
    readonly Company?: number;
    readonly Name?: string;
    readonly Reference?: string;
}

export interface CustomerPaymentUpdateEntity extends CustomerPaymentCreateEntity {
    readonly Id: number;
}

export interface CustomerPaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            CompanyIBAN?: string | string[];
            Amount?: number | number[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            CompanyIBAN?: string | string[];
            Amount?: number | number[];
            Currency?: number | number[];
            Reason?: string | string[];
            Description?: string | string[];
            Company?: number | number[];
            Name?: string | string[];
            UUID?: string | string[];
            Reference?: string | string[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Valor?: Date;
            CompanyIBAN?: string;
            Amount?: number;
            Currency?: number;
            Reason?: string;
            Description?: string;
            Company?: number;
            Name?: string;
            UUID?: string;
            Reference?: string;
        };
    },
    $select?: (keyof CustomerPaymentEntity)[],
    $sort?: string | (keyof CustomerPaymentEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CustomerPaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CustomerPaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class CustomerPaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CUSTOMERPAYMENT",
        properties: [
            {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "CUSTOMERPAYMENT_DATE",
                type: "DATE",
            },
            {
                name: "Valor",
                column: "CUSTOMERPAYMENT_VALOR",
                type: "DATE",
            },
            {
                name: "CompanyIBAN",
                column: "CUSTOMERPAYMENT_COMPANYIBAN",
                type: "VARCHAR",
            },
            {
                name: "Amount",
                column: "CUSTOMERPAYMENT_AMOUNT",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "CUSTOMERPAYMENT_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Reason",
                column: "CUSTOMERPAYMENT_REASON",
                type: "VARCHAR",
            },
            {
                name: "Description",
                column: "CUSTOMERPAYMENT_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "CUSTOMERPAYMENT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "CUSTOMERPAYMENT_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "CUSTOMERPAYMENT_UUID",
                type: "VARCHAR",
            },
            {
                name: "Reference",
                column: "CUSTOMERPAYMENT_REFERENCE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(CustomerPaymentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CustomerPaymentEntityOptions): CustomerPaymentEntity[] {
        return this.dao.list(options).map((e: CustomerPaymentEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Valor");
            return e;
        });
    }

    public findById(id: number): CustomerPaymentEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Valor");
        return entity ?? undefined;
    }

    public create(entity: CustomerPaymentCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Valor");
        // @ts-ignore
        (entity as CustomerPaymentEntity).UUID = require("sdk/utils/uuid").random();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CUSTOMERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CustomerPaymentUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Valor");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CUSTOMERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CustomerPaymentCreateEntity | CustomerPaymentUpdateEntity): number {
        const id = (entity as CustomerPaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CustomerPaymentUpdateEntity);
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
            table: "CODBEX_CUSTOMERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMERPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: CustomerPaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CUSTOMERPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CustomerPaymentEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-CustomerPayment-CustomerPayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-CustomerPayment-CustomerPayment").send(JSON.stringify(data));
    }
}
