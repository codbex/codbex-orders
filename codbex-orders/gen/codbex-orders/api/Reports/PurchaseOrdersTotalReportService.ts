import { Controller, Get } from "sdk/http"
import { PurchaseOrdersTotalReportRepository, PurchaseOrdersTotalReportFilter, PurchaseOrdersTotalReportPaginatedFilter } from "../../dao/Reports/PurchaseOrdersTotalReportRepository";
import { user } from "sdk/security"
import { ForbiddenError } from "../utils/ForbiddenError";
import { HttpUtils } from "../utils/HttpUtils";

@Controller
class PurchaseOrdersTotalReportService {

    private readonly repository = new PurchaseOrdersTotalReportRepository();

    @Get("/")
    public filter(_: any, ctx: any) {
        try {
            this.checkPermissions("read");
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
            this.checkPermissions("read");
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

    private checkPermissions(operationType: string) {
        if (operationType === "read" && !(user.isInRole("codbex-orders.Reports.PurchaseOrdersTotalReportReadOnly"))) {
            throw new ForbiddenError();
        }
    }

}