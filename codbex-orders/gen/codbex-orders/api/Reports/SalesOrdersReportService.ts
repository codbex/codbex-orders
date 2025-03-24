import { Controller, Get } from "sdk/http"
import { SalesOrdersReportRepository, SalesOrdersReportFilter, SalesOrdersReportPaginatedFilter } from "../../dao/Reports/SalesOrdersReportRepository";
import { user } from "sdk/security"
import { ForbiddenError } from "../utils/ForbiddenError";
import { HttpUtils } from "../utils/HttpUtils";

@Controller
class SalesOrdersReportService {

    private readonly repository = new SalesOrdersReportRepository();

    @Get("/")
    public filter(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const filter: SalesOrdersReportPaginatedFilter = {
                Number: ctx.queryParameters.Number ? ctx.queryParameters.Number : undefined,
                Name: ctx.queryParameters.Name ? ctx.queryParameters.Name : undefined,
                Date: ctx.queryParameters.Date ? new Date(parseInt(ctx.queryParameters.Date)) : undefined,
                Due: ctx.queryParameters.Due ? new Date(parseInt(ctx.queryParameters.Due)) : undefined,
                "$limit": ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                "$offset": ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
            const filter: SalesOrdersReportFilter = {
                Number: ctx.queryParameters.Number ? ctx.queryParameters.Number : undefined,
                Name: ctx.queryParameters.Name ? ctx.queryParameters.Name : undefined,
                Date: ctx.queryParameters.Date ? new Date(parseInt(ctx.queryParameters.Date)) : undefined,
                Due: ctx.queryParameters.Due ? new Date(parseInt(ctx.queryParameters.Due)) : undefined,
            };

            const count = this.repository.count(filter);
            return JSON.stringify(count);
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
        if (operationType === "read" && !(user.isInRole("codbex-orders.Reports.SalesOrdersReportReadOnly"))) {
            throw new ForbiddenError();
        }
    }

}