const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");

let dao = daoApi.create({
	table: "CODBEX_SUPPLIER",
	properties: [
		{
			name: "Id",
			column: "SUPPLIER_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "SUPPLIER_NAME",
			type: "VARCHAR",
		},
 {
			name: "Address",
			column: "SUPPLIER_ADDRESS",
			type: "VARCHAR",
		},
 {
			name: "City",
			column: "SUPPLIER_CITY",
			type: "VARCHAR",
		},
 {
			name: "PostalCode",
			column: "SUPPLIER_POSTALCODE",
			type: "VARCHAR",
		},
 {
			name: "Email",
			column: "SUPPLIER_EMAIL",
			type: "VARCHAR",
		},
 {
			name: "Phone",
			column: "SUPPLIER_PHONE",
			type: "VARCHAR",
		},
 {
			name: "Fax",
			column: "SUPPLIER_FAX",
			type: "VARCHAR",
		},
 {
			name: "Country",
			column: "SUPPLIER_COUNTRY",
			type: "INTEGER",
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
		table: "CODBEX_SUPPLIER",
		key: {
			name: "Id",
			column: "SUPPLIER_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_SUPPLIER",
		key: {
			name: "Id",
			column: "SUPPLIER_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_SUPPLIER",
		key: {
			name: "Id",
			column: "SUPPLIER_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_SUPPLIER"');
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
	producer.queue("codbex-orders/partners/Supplier/" + operation).send(JSON.stringify(data));
}