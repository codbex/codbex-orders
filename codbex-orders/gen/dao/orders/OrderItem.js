const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_ORDERITEM",
	properties: [
		{
			name: "Id",
			column: "ORDERITEM_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Order",
			column: "ORDERITEM_ORDERID",
			type: "INTEGER",
		},
 {
			name: "Product",
			column: "ORDERITEM_PRODUCT",
			type: "INTEGER",
		},
 {
			name: "UoM",
			column: "ORDERITEM_UOM",
			type: "INTEGER",
		},
 {
			name: "Quantity",
			column: "ORDERITEM_QUANTITY",
			type: "DOUBLE",
		},
 {
			name: "Price",
			column: "ORDERITEM_PRICE",
			type: "DOUBLE",
		},
 {
			name: "Amount",
			column: "ORDERITEM_AMOUNT",
			type: "DOUBLE",
		},
 {
			name: "Discount",
			column: "ORDERITEM_DISCOUNT",
			type: "DOUBLE",
		},
 {
			name: "VAT",
			column: "ORDERITEM_VAT",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "ORDERITEM_TOTAL",
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
		table: "CODBEX_ORDERITEM",
		key: {
			name: "Id",
			column: "ORDERITEM_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_ORDERITEM",
		key: {
			name: "Id",
			column: "ORDERITEM_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_ORDERITEM",
		key: {
			name: "Id",
			column: "ORDERITEM_ID",
			value: id
		}
	});
};

exports.count = function (Order) {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ORDERITEM" WHERE "ORDERITEM_ORDERID" = ?', [Order]);
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
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ORDERITEM"');
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
	producer.queue("codbex-orders/orders/OrderItem/" + operation).send(JSON.stringify(data));
}