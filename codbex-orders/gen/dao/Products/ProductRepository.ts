import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface ProductEntity {
    readonly Id: number;
    Name?: string;
    Type?: number;
    Category?: number;
    BaseUnit?: number;
    Model?: string;
    Company?: number;
    SKU?: string;
    UPC?: string;
    EAN?: string;
    JAN?: string;
    ISBN?: string;
    MPN?: string;
    Manufacturer?: number;
    Weight?: number;
    Height?: number;
    Length?: number;
    VAT?: number;
}

export interface ProductCreateEntity {
    readonly Name?: string;
    readonly Type?: number;
    readonly Category?: number;
    readonly BaseUnit?: number;
    readonly Model?: string;
    readonly Company?: number;
    readonly SKU?: string;
    readonly UPC?: string;
    readonly EAN?: string;
    readonly JAN?: string;
    readonly ISBN?: string;
    readonly MPN?: string;
    readonly Manufacturer?: number;
    readonly Weight?: number;
    readonly Height?: number;
    readonly Length?: number;
    readonly VAT?: number;
}

export interface ProductUpdateEntity extends ProductCreateEntity {
    readonly Id: number;
}

export interface ProductEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Type?: number | number[];
            Category?: number | number[];
            BaseUnit?: number | number[];
            Model?: string | string[];
            Company?: number | number[];
            SKU?: string | string[];
            UPC?: string | string[];
            EAN?: string | string[];
            JAN?: string | string[];
            ISBN?: string | string[];
            MPN?: string | string[];
            Manufacturer?: number | number[];
            Weight?: number | number[];
            Height?: number | number[];
            Length?: number | number[];
            VAT?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Type?: number | number[];
            Category?: number | number[];
            BaseUnit?: number | number[];
            Model?: string | string[];
            Company?: number | number[];
            SKU?: string | string[];
            UPC?: string | string[];
            EAN?: string | string[];
            JAN?: string | string[];
            ISBN?: string | string[];
            MPN?: string | string[];
            Manufacturer?: number | number[];
            Weight?: number | number[];
            Height?: number | number[];
            Length?: number | number[];
            VAT?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Type?: number;
            Category?: number;
            BaseUnit?: number;
            Model?: string;
            Company?: number;
            SKU?: string;
            UPC?: string;
            EAN?: string;
            JAN?: string;
            ISBN?: string;
            MPN?: string;
            Manufacturer?: number;
            Weight?: number;
            Height?: number;
            Length?: number;
            VAT?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Type?: number;
            Category?: number;
            BaseUnit?: number;
            Model?: string;
            Company?: number;
            SKU?: string;
            UPC?: string;
            EAN?: string;
            JAN?: string;
            ISBN?: string;
            MPN?: string;
            Manufacturer?: number;
            Weight?: number;
            Height?: number;
            Length?: number;
            VAT?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Type?: number;
            Category?: number;
            BaseUnit?: number;
            Model?: string;
            Company?: number;
            SKU?: string;
            UPC?: string;
            EAN?: string;
            JAN?: string;
            ISBN?: string;
            MPN?: string;
            Manufacturer?: number;
            Weight?: number;
            Height?: number;
            Length?: number;
            VAT?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Type?: number;
            Category?: number;
            BaseUnit?: number;
            Model?: string;
            Company?: number;
            SKU?: string;
            UPC?: string;
            EAN?: string;
            JAN?: string;
            ISBN?: string;
            MPN?: string;
            Manufacturer?: number;
            Weight?: number;
            Height?: number;
            Length?: number;
            VAT?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Type?: number;
            Category?: number;
            BaseUnit?: number;
            Model?: string;
            Company?: number;
            SKU?: string;
            UPC?: string;
            EAN?: string;
            JAN?: string;
            ISBN?: string;
            MPN?: string;
            Manufacturer?: number;
            Weight?: number;
            Height?: number;
            Length?: number;
            VAT?: number;
        };
    },
    $select?: (keyof ProductEntity)[],
    $sort?: string | (keyof ProductEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface ProductEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<ProductEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class ProductRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_PRODUCT",
        properties: [
            {
                name: "Id",
                column: "PRODUCT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "PRODUCT_NAME",
                type: "VARCHAR",
            },
            {
                name: "Type",
                column: "PRODUCT_TYPE",
                type: "INTEGER",
            },
            {
                name: "Category",
                column: "PRODUCT_CATEGORY",
                type: "INTEGER",
            },
            {
                name: "BaseUnit",
                column: "PRODUCT_BASEUNIT",
                type: "INTEGER",
            },
            {
                name: "Model",
                column: "PRODUCT_MODEL",
                type: "VARCHAR",
            },
            {
                name: "Company",
                column: "PRODUCT_COMPANY",
                type: "INTEGER",
            },
            {
                name: "SKU",
                column: "PRODUCT_SKU",
                type: "VARCHAR",
            },
            {
                name: "UPC",
                column: "PRODUCT_UPC",
                type: "VARCHAR",
            },
            {
                name: "EAN",
                column: "PRODUCT_EAN",
                type: "VARCHAR",
            },
            {
                name: "JAN",
                column: "PRODUCT_JAN",
                type: "VARCHAR",
            },
            {
                name: "ISBN",
                column: "PRODUCT_ISBN",
                type: "VARCHAR",
            },
            {
                name: "MPN",
                column: "PRODUCT_MPN",
                type: "VARCHAR",
            },
            {
                name: "Manufacturer",
                column: "PRODUCT_MANUFACTURER",
                type: "INTEGER",
            },
            {
                name: "Weight",
                column: "PRODUCT_WEIGHT",
                type: "DOUBLE",
            },
            {
                name: "Height",
                column: "PRODUCT_HEIGHT",
                type: "DOUBLE",
            },
            {
                name: "Length",
                column: "PRODUCT_LENGTH",
                type: "DOUBLE",
            },
            {
                name: "VAT",
                column: "PRODUCT_VAT",
                type: "DOUBLE",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(ProductRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: ProductEntityOptions): ProductEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): ProductEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: ProductCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_PRODUCT",
            entity: entity,
            key: {
                name: "Id",
                column: "PRODUCT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: ProductUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_PRODUCT",
            entity: entity,
            key: {
                name: "Id",
                column: "PRODUCT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: ProductCreateEntity | ProductUpdateEntity): number {
        const id = (entity as ProductUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as ProductUpdateEntity);
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
            table: "CODBEX_PRODUCT",
            entity: entity,
            key: {
                name: "Id",
                column: "PRODUCT_ID",
                value: id
            }
        });
    }

    public count(options?: ProductEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: ProductEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PRODUCT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: ProductEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/Products/Product", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/Products/Product").send(JSON.stringify(data));
    }
}