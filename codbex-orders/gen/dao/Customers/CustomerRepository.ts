import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface CustomerEntity {
    readonly Id: number;
    Name?: string;
    Address?: string;
    PostalCode?: string;
    Email?: string;
    Phone?: string;
    Fax?: string;
    City?: number;
    Country?: number;
    TIN?: string;
    IBAN?: string;
}

export interface CustomerCreateEntity {
    readonly Name?: string;
    readonly Address?: string;
    readonly PostalCode?: string;
    readonly Email?: string;
    readonly Phone?: string;
    readonly Fax?: string;
    readonly City?: number;
    readonly Country?: number;
    readonly TIN?: string;
    readonly IBAN?: string;
}

export interface CustomerUpdateEntity extends CustomerCreateEntity {
    readonly Id: number;
}

export interface CustomerEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Address?: string | string[];
            PostalCode?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
            Fax?: string | string[];
            City?: number | number[];
            Country?: number | number[];
            TIN?: string | string[];
            IBAN?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Address?: string | string[];
            PostalCode?: string | string[];
            Email?: string | string[];
            Phone?: string | string[];
            Fax?: string | string[];
            City?: number | number[];
            Country?: number | number[];
            TIN?: string | string[];
            IBAN?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Address?: string;
            PostalCode?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            City?: number;
            Country?: number;
            TIN?: string;
            IBAN?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Address?: string;
            PostalCode?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            City?: number;
            Country?: number;
            TIN?: string;
            IBAN?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Address?: string;
            PostalCode?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            City?: number;
            Country?: number;
            TIN?: string;
            IBAN?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Address?: string;
            PostalCode?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            City?: number;
            Country?: number;
            TIN?: string;
            IBAN?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Address?: string;
            PostalCode?: string;
            Email?: string;
            Phone?: string;
            Fax?: string;
            City?: number;
            Country?: number;
            TIN?: string;
            IBAN?: string;
        };
    },
    $select?: (keyof CustomerEntity)[],
    $sort?: string | (keyof CustomerEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CustomerEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CustomerEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class CustomerRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_CUSTOMER",
        properties: [
            {
                name: "Id",
                column: "CUSTOMER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "CUSTOMER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Address",
                column: "CUSTOMER_ADDRESS",
                type: "VARCHAR",
            },
            {
                name: "PostalCode",
                column: "CUSTOMER_POSTALCODE",
                type: "VARCHAR",
            },
            {
                name: "Email",
                column: "CUSTOMER_EMAIL",
                type: "VARCHAR",
            },
            {
                name: "Phone",
                column: "CUSTOMER_PHONE",
                type: "VARCHAR",
            },
            {
                name: "Fax",
                column: "CUSTOMER_FAX",
                type: "VARCHAR",
            },
            {
                name: "City",
                column: "CUSTOMER_CITY",
                type: "INTEGER",
            },
            {
                name: "Country",
                column: "CUSTOMER_COUNTRYID",
                type: "INTEGER",
            },
            {
                name: "TIN",
                column: "CUSTOMER_TIN",
                type: "VARCHAR",
            },
            {
                name: "IBAN",
                column: "CUSTOMER_IBAN",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(CustomerRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CustomerEntityOptions): CustomerEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): CustomerEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: CustomerCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_CUSTOMER",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CustomerUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_CUSTOMER",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CustomerCreateEntity | CustomerUpdateEntity): number {
        const id = (entity as CustomerUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CustomerUpdateEntity);
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
            table: "CODBEX_CUSTOMER",
            entity: entity,
            key: {
                name: "Id",
                column: "CUSTOMER_ID",
                value: id
            }
        });
    }

    public count(options?: CustomerEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: CustomerEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_CUSTOMER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CustomerEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/Customers/Customer", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/Customers/Customer").send(JSON.stringify(data));
    }
}