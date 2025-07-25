import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { PurchaseOrderItemRepository, PurchaseOrderItemEntityOptions } from "../../dao/PurchaseOrder/PurchaseOrderItemRepository";
import { user } from "sdk/security"
import { ForbiddenError } from "../utils/ForbiddenError";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-orders-PurchaseOrder-PurchaseOrderItem", ["validate"]);

@Controller
class PurchaseOrderItemService {

    private readonly repository = new PurchaseOrderItemRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const options: PurchaseOrderItemEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            let PurchaseOrder = parseInt(ctx.queryParameters.PurchaseOrder);
            PurchaseOrder = isNaN(PurchaseOrder) ? ctx.queryParameters.PurchaseOrder : PurchaseOrder;

            if (PurchaseOrder !== undefined) {
                options.$filter = {
                    equals: {
                        PurchaseOrder: PurchaseOrder
                    }
                };
            }

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.checkPermissions("write");
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-orders/gen/codbex-orders/api/PurchaseOrder/PurchaseOrderItemService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count() {
        try {
            this.checkPermissions("read");
            return { count: this.repository.count() };
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            this.checkPermissions("read");
            return { count: this.repository.count(filter) };
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            this.checkPermissions("read");
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/:id")
    public getById(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const id = parseInt(ctx.pathParameters.id);
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("PurchaseOrderItem not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            this.checkPermissions("write");
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
            this.checkPermissions("write");
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                this.repository.deleteById(id);
                HttpUtils.sendResponseNoContent();
            } else {
                HttpUtils.sendResponseNotFound("PurchaseOrderItem not found");
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

    private checkPermissions(operationType: string) {
        if (operationType === "read" && !(user.isInRole("codbex-orders.PurchaseOrder.PurchaseOrderItemReadOnly") || user.isInRole("codbex-orders.PurchaseOrder.PurchaseOrderItemFullAccess"))) {
            throw new ForbiddenError();
        }
        if (operationType === "write" && !user.isInRole("codbex-orders.PurchaseOrder.PurchaseOrderItemFullAccess")) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.PurchaseOrder === null || entity.PurchaseOrder === undefined) {
            throw new ValidationError(`The 'PurchaseOrder' property is required, provide a valid value`);
        }
        if (entity.Product === null || entity.Product === undefined) {
            throw new ValidationError(`The 'Product' property is required, provide a valid value`);
        }
        if (entity.UoM === null || entity.UoM === undefined) {
            throw new ValidationError(`The 'UoM' property is required, provide a valid value`);
        }
        if (entity.Quantity === null || entity.Quantity === undefined) {
            throw new ValidationError(`The 'Quantity' property is required, provide a valid value`);
        }
        if (entity.Price === null || entity.Price === undefined) {
            throw new ValidationError(`The 'Price' property is required, provide a valid value`);
        }
        if (entity.VATRate === null || entity.VATRate === undefined) {
            throw new ValidationError(`The 'VATRate' property is required, provide a valid value`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
