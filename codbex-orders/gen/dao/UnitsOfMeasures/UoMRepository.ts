import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface UoMEntity {
    readonly Id: number;
    Name?: string;
    Unit?: string;
    Dimension?: number;
    Numerator?: number;
    Denominator?: number;
    Rounding?: number;
}

export interface UoMCreateEntity {
    readonly Name?: string;
    readonly Unit?: string;
    readonly Dimension?: number;
    readonly Numerator?: number;
    readonly Denominator?: number;
    readonly Rounding?: number;
}

export interface UoMUpdateEntity extends UoMCreateEntity {
    readonly Id: number;
}

export interface UoMEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Unit?: string | string[];
            Dimension?: number | number[];
            Numerator?: number | number[];
            Denominator?: number | number[];
            Rounding?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Unit?: string | string[];
            Dimension?: number | number[];
            Numerator?: number | number[];
            Denominator?: number | number[];
            Rounding?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Unit?: string;
            Dimension?: number;
            Numerator?: number;
            Denominator?: number;
            Rounding?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Unit?: string;
            Dimension?: number;
            Numerator?: number;
            Denominator?: number;
            Rounding?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Unit?: string;
            Dimension?: number;
            Numerator?: number;
            Denominator?: number;
            Rounding?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Unit?: string;
            Dimension?: number;
            Numerator?: number;
            Denominator?: number;
            Rounding?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Unit?: string;
            Dimension?: number;
            Numerator?: number;
            Denominator?: number;
            Rounding?: number;
        };
    },
    $select?: (keyof UoMEntity)[],
    $sort?: string | (keyof UoMEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface UoMEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<UoMEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class UoMRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_UOM",
        properties: [
            {
                name: "Id",
                column: "UOM_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "UOM_NAME",
                type: "VARCHAR",
            },
            {
                name: "Unit",
                column: "UOM_UNIT",
                type: "VARCHAR",
            },
            {
                name: "Dimension",
                column: "UOM_DIMENSION",
                type: "INTEGER",
            },
            {
                name: "Numerator",
                column: "UOM_NUMERATOR",
                type: "INTEGER",
            },
            {
                name: "Denominator",
                column: "UOM_DENOMINATOR",
                type: "INTEGER",
            },
            {
                name: "Rounding",
                column: "UOM_ROUNDING",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource?: string) {
        this.dao = daoApi.create(UoMRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: UoMEntityOptions): UoMEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): UoMEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: UoMCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_UOM",
            entity: entity,
            key: {
                name: "Id",
                column: "UOM_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: UoMUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_UOM",
            entity: entity,
            key: {
                name: "Id",
                column: "UOM_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: UoMCreateEntity | UoMUpdateEntity): number {
        const id = (entity as UoMUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as UoMUpdateEntity);
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
            table: "CODBEX_UOM",
            entity: entity,
            key: {
                name: "Id",
                column: "UOM_ID",
                value: id
            }
        });
    }

    public count(options?: UoMEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(options?: UoMEntityOptions): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_UOM"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: UoMEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-orders/UnitsOfMeasures/UoM", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.queue("codbex-orders/UnitsOfMeasures/UoM").send(JSON.stringify(data));
    }
}