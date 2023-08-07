const rs = require("http/rs");
const dao = require("codbex-orders/gen/dao/orders/OrderItem");
const http = require("codbex-orders/gen/api/utils/http");

rs.service()
	.resource("")
		.get(function(ctx, request) {
			let queryOptions = {};
			let parameters = request.getParameterNames();
			for (let i = 0; i < parameters.length; i ++) {
				queryOptions[parameters[i]] = request.getParameter(parameters[i]);
			}
			let entities = dao.list(queryOptions);
			http.sendResponseOk(entities);
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("count/{Order}")
		.get(function(ctx, request) {
			let Order = parseInt(ctx.pathParameters.Order);
			Order = isNaN(Order) ? ctx.pathParameters.Order : Order;
			http.sendResponseOk("" + dao.count(Order));
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.get(function(ctx) {
			let id = ctx.pathParameters.id;
			let entity = dao.get(id);
			if (entity) {
			    http.sendResponseOk(entity);
			} else {
				http.sendResponseNotFound("OrderItem not found");
			}
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("")
		.post(function(ctx, request, response) {
			let entity = request.getJSON();
			entity.Id = dao.create(entity);
			response.setHeader("Content-Location", "/services/js/codbex-orders/gen/api/OrderItem.js/" + entity.Id);
			http.sendResponseCreated(entity);
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.put(function(ctx, request) {
			let entity = request.getJSON();
			entity.Id = ctx.pathParameters.id;
			dao.update(entity);
			http.sendResponseOk(entity);
		})
		.produces(["application/json"])
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
	.resource("{id}")
		.delete(function(ctx) {
			let id = ctx.pathParameters.id;
			let entity = dao.get(id);
			if (entity) {
				dao.delete(id);
				http.sendResponseNoContent();
			} else {
				http.sendResponseNotFound("OrderItem not found");
			}
		})
		.catch(function(ctx, error) {
            if (error.name === "ForbiddenError") {
                http.sendForbiddenRequest(error.message);
            } else if(error.name === "ValidationError") {
				http.sendResponseBadRequest(error.message);
			} else {
				http.sendInternalServerError(error.message);
			}
        })
.execute();
