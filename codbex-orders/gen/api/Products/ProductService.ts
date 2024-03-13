import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { ProductRepository, ProductEntityOptions } from "../../dao/Products/ProductRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-orders-Products-Product", ["validate"]);

@Controller
class ProductService {

    private readonly repository = new ProductRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: ProductEntityOptions = {
                $limit: ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                $offset: ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(options);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/")
    public create(entity: any) {
        try {
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-orders/gen/api/Products/ProductService.ts/" + entity.Id);
            response.setStatus(response.CREATED);
            return entity;
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
                HttpUtils.sendResponseNotFound("Product not found");
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
                HttpUtils.sendResponseNotFound("Product not found");
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
        if (entity.Name === null || entity.Name === undefined) {
            throw new ValidationError(`The 'Name' property is required, provide a valid value`);
        }
        if (entity.Name?.length > 500) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [500] characters`);
        }
        if (entity.Model?.length > 200) {
            throw new ValidationError(`The 'Model' exceeds the maximum length of [200] characters`);
        }
        if (entity.SKU?.length > 64) {
            throw new ValidationError(`The 'SKU' exceeds the maximum length of [64] characters`);
        }
        if (entity.UPC?.length > 20) {
            throw new ValidationError(`The 'UPC' exceeds the maximum length of [20] characters`);
        }
        if (entity.EAN?.length > 20) {
            throw new ValidationError(`The 'EAN' exceeds the maximum length of [20] characters`);
        }
        if (entity.JAN?.length > 20) {
            throw new ValidationError(`The 'JAN' exceeds the maximum length of [20] characters`);
        }
        if (entity.ISBN?.length > 20) {
            throw new ValidationError(`The 'ISBN' exceeds the maximum length of [20] characters`);
        }
        if (entity.MPN?.length > 40) {
            throw new ValidationError(`The 'MPN' exceeds the maximum length of [40] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
