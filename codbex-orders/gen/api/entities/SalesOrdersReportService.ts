import { Controller, Get } from "sdk/http"
import { SalesOrdersReportRepository, SalesOrdersReportFilter, SalesOrdersReportPaginatedFilter } from "../../dao/entities/SalesOrdersReportRepository";
import { HttpUtils } from "../utils/HttpUtils";

@Controller
class SalesOrdersReportService {

    private readonly repository = new SalesOrdersReportRepository();

    @Get("/")
    public filter(_: any, ctx: any) {
        try {
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

}