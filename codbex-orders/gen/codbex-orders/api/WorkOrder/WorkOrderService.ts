import { Controller, Get, Post, Put, Delete, response } from "sdk/http"
import { Extensions } from "sdk/extensions"
import { WorkOrderRepository, WorkOrderEntityOptions } from "../../dao/WorkOrder/WorkOrderRepository";
import { user } from "sdk/security"
import { ForbiddenError } from "../utils/ForbiddenError";
import { ValidationError } from "../utils/ValidationError";
import { HttpUtils } from "../utils/HttpUtils";
// custom imports
import { NumberGeneratorService } from "/codbex-number-generator/service/generator";

const validationModules = await Extensions.loadExtensionModules("codbex-orders-WorkOrder-WorkOrder", ["validate"]);

@Controller
class WorkOrderService {

    private readonly repository = new WorkOrderRepository();

    @Get("/")
    public getAll(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const options: WorkOrderEntityOptions = {
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
            this.checkPermissions("write");
            this.validateEntity(entity);
            entity.Id = this.repository.create(entity);
            response.setHeader("Content-Location", "/services/ts/codbex-orders/gen/codbex-orders/api/WorkOrder/WorkOrderService.ts/" + entity.Id);
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
            return this.repository.count();
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            this.checkPermissions("read");
            return this.repository.count(filter);
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
                HttpUtils.sendResponseNotFound("WorkOrder not found");
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
                HttpUtils.sendResponseNotFound("WorkOrder not found");
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
        if (operationType === "read" && !(user.isInRole("codbex-orders.WorkOrder.WorkOrderReadOnly") || user.isInRole("codbex-orders.WorkOrder.WorkOrderFullAccess"))) {
            throw new ForbiddenError();
        }
        if (operationType === "write" && !user.isInRole("codbex-orders.WorkOrder.WorkOrderFullAccess")) {
            throw new ForbiddenError();
        }
    }

    private validateEntity(entity: any): void {
        if (entity.Number?.length > 20) {
            throw new ValidationError(`The 'Number' exceeds the maximum length of [20] characters`);
        }
        if (entity.Date === null || entity.Date === undefined) {
            throw new ValidationError(`The 'Date' property is required, provide a valid value`);
        }
        if (entity.Due === null || entity.Due === undefined) {
            throw new ValidationError(`The 'Due' property is required, provide a valid value`);
        }
        if (entity.Task?.length > 200) {
            throw new ValidationError(`The 'Task' exceeds the maximum length of [200] characters`);
        }
        if (entity.Currency === null || entity.Currency === undefined) {
            throw new ValidationError(`The 'Currency' property is required, provide a valid value`);
        }
        if (entity.Conditions?.length > 200) {
            throw new ValidationError(`The 'Conditions' exceeds the maximum length of [200] characters`);
        }
        if (entity.PaymentMethod === null || entity.PaymentMethod === undefined) {
            throw new ValidationError(`The 'PaymentMethod' property is required, provide a valid value`);
        }
        if (entity.SentMethod === null || entity.SentMethod === undefined) {
            throw new ValidationError(`The 'SentMethod' property is required, provide a valid value`);
        }
        if (entity.Status === null || entity.Status === undefined) {
            throw new ValidationError(`The 'Status' property is required, provide a valid value`);
        }
        if (entity.Operator === null || entity.Operator === undefined) {
            throw new ValidationError(`The 'Operator' property is required, provide a valid value`);
        }
        if (entity.Document?.length > 200) {
            throw new ValidationError(`The 'Document' exceeds the maximum length of [200] characters`);
        }
        if (entity.UUID?.length > 36) {
            throw new ValidationError(`The 'UUID' exceeds the maximum length of [36] characters`);
        }
        if (entity.Name?.length > 200) {
            throw new ValidationError(`The 'Name' exceeds the maximum length of [200] characters`);
        }
        if (entity.Referance?.length > 36) {
            throw new ValidationError(`The 'Referance' exceeds the maximum length of [36] characters`);
        }
        for (const next of validationModules) {
            next.validate(entity);
        }
    }

}
