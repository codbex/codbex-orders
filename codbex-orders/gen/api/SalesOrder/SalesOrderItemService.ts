import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { SalesOrderItemRepository, SalesOrderItemEntityOptions } from "../../dao/SalesOrder/SalesOrderItemRepository";
import { SalesOrderRepository } from "../../dao/SalesOrder/SalesOrderRepository";
import { CatalogueRepository } from "codbex-products/gen/dao/Catalogues/CatalogueRepository"
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-orders-SalesOrder-SalesOrderItem", ["validate"]);

@Controller
class SalesOrderItemService {

    private readonly repository = new SalesOrderItemRepository();
    private readonly salesOrderRepository = new SalesOrderRepository();
    private readonly catalogueRepository = new CatalogueRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: SalesOrderItemEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            let SalesOrder = parseInt(ctx.queryParameters.SalesOrder);
            SalesOrder = isNaN(SalesOrder) ? ctx.queryParameters.SalesOrder : SalesOrder;

            if (SalesOrder !== undefined) {
                options.$filter = {
                    equals: {
                        SalesOrder: SalesOrder
                    }
                };
            }

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public async create(entity: any) {
        try {
            this.validateEntity(entity);

            const salesOrder = this.salesOrderRepository.findById(entity.SalesOrder);

            if (!salesOrder) {
                throw new ValidationError("SalesOrder not found");
            }

            // Fetch available stock for the product in the given store
            const availableStockResults = this.catalogueRepository.findAll({
                $filter: {
                    equals: {
                        Store: salesOrder.Store,
                        Product: entity.Product,
                    },
                },
            });

            const availableStock = availableStockResults.length > 0 ? availableStockResults[0].Quantity : 0;

            const createdEntities = [];

            if (entity.Quantity > availableStock) {
                // Create the first item with the available stock
                const entityWithAvailableStock = { ...entity, Quantity: availableStock };
                entityWithAvailableStock.Id = this.repository.create(entityWithAvailableStock);
                createdEntities.push(entityWithAvailableStock);

                // Create the second item with the remaining quantity
                const remainingQuantity = entity.Quantity - availableStock;
                const entityWithRemainingQuantity = { ...entity, Quantity: remainingQuantity };
                entityWithRemainingQuantity.Id = this.repository.create(entityWithRemainingQuantity);
                createdEntities.push(entityWithRemainingQuantity);

                response.setHeader(
                    "Content-Location",
                    `/services/ts/codbex-orders/gen/api/SalesOrder/SalesOrderItemService.ts/${entityWithAvailableStock.Id},${entityWithRemainingQuantity.Id}`
                );
            } else {
                // Create the item with the requested quantity
                entity.Id = this.repository.create(entity);
                createdEntities.push(entity);

                response.setHeader(
                    "Content-Location",
                    `/services/ts/codbex-orders/gen/api/SalesOrder/SalesOrderItemService.ts/${entity.Id}`
                );
            }

            response.setStatus(response.CREATED);
            return createdEntities.length > 1 ? createdEntities : createdEntities[0];
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("SalesOrderItem not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.Id = ctx.pathParameters.id;
            this.validateEntity(entity);
            this.repository.update(entity);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Delete("/:id")
    public deleteById(_: any, ctx: any) {
        try {
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("SalesOrderItem not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

    private validateEntity(entity: any): void {
        if (entity.SalesOrder === null || entity.SalesOrder === undefined) {
            throw new ValidationError(`The 'SalesOrder' property is required, provide a valid value`);
        }
        if (entity.Product === null || entity.Product === undefined) {
            throw new ValidationError(`The 'Product' property is required, provide a valid value`);
        }
        if (entity.Quantity === null || entity.Quantity === undefined) {
            throw new ValidationError(`The 'Quantity' property is required, provide a valid value`);
        }
        if (entity.UoM === null || entity.UoM === undefined) {
            throw new ValidationError(`The 'UoM' property is required, provide a valid value`);
        }
        if (entity.Price === null || entity.Price === undefined) {
            throw new ValidationError(`The 'Price' property is required, provide a valid value`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}