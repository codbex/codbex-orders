import { Controller, Get } from "sdk/http"
import { PurchaseOrdersTotalReportRepository, PurchaseOrdersTotalReportFilter, PurchaseOrdersTotalReportPaginatedFilter } from "../../dao/Reports/PurchaseOrdersTotalReportRepository";
import { HttpUtils } from "../utils/HttpUtils";

@Controller
class PurchaseOrdersTotalReportService {

    private readonly repository = new PurchaseOrdersTotalReportRepository();

    @Get("/")
    public filter(_: any, ctx: any) {
        try {
            const filter: PurchaseOrdersTotalReportPaginatedFilter = {
                StartDate: ctx.queryParameters.StartDate ? new Date(parseInt(ctx.queryParameters.StartDate)) : undefined,
                EndDate: ctx.queryParameters.EndDate ? new Date(parseInt(ctx.queryParameters.EndDate)) : undefined,
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
            const filter: PurchaseOrdersTotalReportFilter = {
                StartDate: ctx.queryParameters.StartDate ? new Date(parseInt(ctx.queryParameters.StartDate)) : undefined,
                EndDate: ctx.queryParameters.EndDate ? new Date(parseInt(ctx.queryParameters.EndDate)) : undefined,
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