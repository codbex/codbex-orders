const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_PURCHASEORDERITEM",
	properties: [
		{
			name: "Id",
			column: "PURCHASEORDERITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "PurchaseOrder",
			column: "PURCHASEORDERITEM_PURCHASEORDERID",
			type: "INTEGER",
		},
 {
			name: "Product",
			column: "PURCHASEORDERITEM_PRODUCT",
			type: "INTEGER",
		},
 {
			name: "UoM",
			column: "PURCHASEORDERITEM_UOM",
			type: "INTEGER",
		},
 {
			name: "Quantity",
			column: "PURCHASEORDERITEM_QUANTITY",
			type: "DOUBLE",
		},
 {
			name: "Price",
			column: "PURCHASEORDERITEM_PRICE",
			type: "DOUBLE",
		},
 {
			name: "Amount",
			column: "PURCHASEORDERITEM_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "PURCHASEORDERITEM_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "PURCHASEORDERITEM_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "PURCHASEORDERITEM_TOTAL",
			type: "DOUBLE",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_PURCHASEORDERITEM",
		key: {
			name: "Id",
			column: "PURCHASEORDERITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_PURCHASEORDERITEM",
		key: {
			name: "Id",
			column: "PURCHASEORDERITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_PURCHASEORDERITEM",
		key: {
			name: "Id",
			column: "PURCHASEORDERITEM_ID",
			value: id
		}
	});
};

exports.count = function (PurchaseOrder) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEORDERITEM" WHERE "PURCHASEORDERITEM_PURCHASEORDERID" = ?', [PurchaseOrder]);
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_PURCHASEORDERITEM"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-orders/PurchaseOrder/PurchaseOrderItem/" + operation).send(JSON.stringify(data));
}