import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface SupplierPaymentEntity {
    readonly Id: number;
    Date?: Date;
    Valor?: Date;
    CompanyIBAN?: string;
    CounterpartyIBAN?: string;
    CounterpartyName?: string;
    Amount?: number;
    Currency?: number;
    Reason?: string;
    Description?: string;
    Company?: number;
    Name?: string;
    UUID?: string;
    Reference?: string;
}

export interface SupplierPaymentCreateEntity {
    readonly Date?: Date;
    readonly Valor?: Date;
    readonly CompanyIBAN?: string;
    readonly CounterpartyIBAN?: string;
    readonly CounterpartyName?: string;
    readonly Amount?: number;
    readonly Currency?: number;
    readonly Reason?: string;
    readonly Description?: string;
    readonly Company?: number;
    readonly Reference?: string;
}

export interface SupplierPaymentUpdateEntity extends SupplierPaymentCreateEntity {
    readonly Id: number;
}

export interface SupplierPaymentEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Valor?: Date | Date[];
            CompanyIBAN?: string | string[];
            CounterpartyIBAN?: string | string[];
            CounterpartyName?: string | string[];
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
            CounterpartyIBAN?: string | string[];
            CounterpartyName?: string | string[];
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
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
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
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
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
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
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
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
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
            CounterpartyIBAN?: string;
            CounterpartyName?: string;
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
    $select?: (keyof SupplierPaymentEntity)[],
    $sort?: string | (keyof SupplierPaymentEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface SupplierPaymentEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<SupplierPaymentEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class SupplierPaymentRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_SUPPLIERPAYMENT",
        properties: [
            {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "SUPPLIERPAYMENT_DATE",
                type: "DATE",
            },
            {
                name: "Valor",
                column: "SUPPLIERPAYMENT_VALOR",
                type: "DATE",
            },
            {
                name: "CompanyIBAN",
                column: "SUPPLIERPAYMENT_COMPANYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyIBAN",
                column: "SUPPLIERPAYMENT_COUNTERPARTYIBAN",
                type: "VARCHAR",
            },
            {
                name: "CounterpartyName",
                column: "SUPPLIERPAYMENT_COUNTERPARTYNAME",
                type: "VARCHAR",
            },
            {
                name: "Amount",
                column: "SUPPLIERPAYMENT_AMOUNT",
                type: "DECIMAL",
            },
            {
                name: "Currency",
                column: "SUPPLIERPAYMENT_CURRENCY",
                type: "INTEGER",
            },
            {
                name: "Reason",
                column: "SUPPLIERPAYMENT_REASON",
                type: "VARCHAR",
            },
            {
                name: "Description",
                column: "SUPPLIERPAYMENT_DESCRIPTION",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "SUPPLIERPAYMENT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "Name",
                column: "SUPPLIERPAYMENT_NAME",
                type: "VARCHAR",
            },
            {
                name: "UUID",
                column: "SUPPLIERPAYMENT_UUID",
                type: "VARCHAR",
            },
            {
                name: "Reference",
                column: "SUPPLIERPAYMENT_REFERENCE",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(SupplierPaymentRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: SupplierPaymentEntityOptions): SupplierPaymentEntity[] {
        return this.dao.list(options).map((e: SupplierPaymentEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "Valor");
            return e;
        });
    }

    public findById(id: number): SupplierPaymentEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "Valor");
        return entity ?? undefined;
    }

    public create(entity: SupplierPaymentCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "Valor");
        // @ts-ignore
        (entity as SupplierPaymentEntity).Name = new NumberGeneratorService().generate(21);
        // @ts-ignore
        (entity as SupplierPaymentEntity).UUID = require("sdk/utils/uuid").random();
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_SUPPLIERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: SupplierPaymentUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "Valor");
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_SUPPLIERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: SupplierPaymentCreateEntity | SupplierPaymentUpdateEntity): number {
        const id = (entity as SupplierPaymentUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as SupplierPaymentUpdateEntity);
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
            table: "CODBEX_SUPPLIERPAYMENT",
            entity: entity,
            key: {
                name: "Id",
                column: "SUPPLIERPAYMENT_ID",
                value: id
            }
        });
    }

    public count(options?: SupplierPaymentEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SUPPLIERPAYMENT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: SupplierPaymentEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders-SupplierPayment-SupplierPayment", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-orders-SupplierPayment-SupplierPayment").send(JSON.stringify(data));
    }
}
