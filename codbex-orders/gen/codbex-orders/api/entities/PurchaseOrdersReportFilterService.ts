import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { PurchaseOrdersReportFilterRepository, PurchaseOrdersReportFilterEntityOptions } from "../../dao/entities/PurchaseOrdersReportFilterRepository";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";

const validationModules = await Extensions.loadExtensionModules("codbex-orders-entities-PurchaseOrdersReportFilter", ["validate"]);

@Controller
class PurchaseOrdersReportFilterService {

    private readonly repository = new PurchaseOrdersReportFilterRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            const options: PurchaseOrdersReportFilterEntityOptions = {
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
            entity.PurchaseOrdersReport = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-orders/gen/codbex-orders/api/entities/PurchaseOrdersReportFilterService.ts/" + entity.PurchaseOrdersReport);
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
            const id = ctx.pathParameters.id;
            const entity = this.repository.findById(id);
            if (entity) {
                return entity;
            } else {
                HttpUtils.sendResponseNotFound("PurchaseOrdersReportFilter not found");
            }
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Put("/:id")
    public update(entity: any, ctx: any) {
        try {
            entity.PurchaseOrdersReport = ctx.pathParameters.id;
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
                HttpUtils.sendResponseNotFound("PurchaseOrdersReportFilter not found");
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
        if (entity.PurchaseOrdersReport?.length > 20) {
            throw new ValidationError(`The 'PurchaseOrdersReport' exceeds the maximum length of [20] characters`);
        }
        if (entity.Number?.length > 20) {
            throw new ValidationError(`The 'Number' exceeds the maximum length of [20] characters`);
        }
        if (entity.Name?.length > 200) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [200] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
