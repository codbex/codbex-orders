import { SalesOrderRepository as SalesOrderDao } from "codbex-orders/gen/codbex-orders/dao/SalesOrder/SalesOrderRepository";
import { PurchaseOrderRepository as PurchaseOrderDao } from "codbex-orders/gen/codbex-orders/dao/PurchaseOrder/PurchaseOrderRepository";
import { CustomerRepository as CustomerDao } from "codbex-partners/gen/codbex-partners/dao/Customers/CustomerRepository";
import { SupplierRepository as SupplierDao } from "codbex-partners/gen/codbex-partners/dao/Suppliers/SupplierRepository";

import { Controller, Get } from "sdk/http";
import { query, sql } from "sdk/db";

@Controller
class OrderService {

    private readonly salesOrderDao;
    private readonly purchaseOrderDao;
    private readonly customerDao;
    private readonly supplierDao;


    constructor() {
        this.salesOrderDao = new SalesOrderDao();
        this.purchaseOrderDao = new PurchaseOrderDao();
        this.customerDao = new CustomerDao();
        this.supplierDao = new SupplierDao();
    }

    @Get("/orderData")
    public orderData() {
        let paidSalesOrders: number = 0;
        let newSalesOrders: number = 0;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        let salesOrdersToday = this.salesOrderDao.findAll({
            $filter: {
                equals: {
                    Date: currentDate
                }
            }
        });

        const salesOrderTodayLength: number = !salesOrdersToday || salesOrdersToday.length === 0 ? 0 : salesOrdersToday.length;

        const unpaidSalesOrders = this.salesOrderDao.count({
            $filter: {
                notEquals: {
                    //All orders that don't have the status 'Paid'
                    SalesOrderStatus: 6
                }
            }
        });
        const unpaidPurchaseOrders = this.purchaseOrderDao.count({
            $filter: {
                notEquals: {
                    //All orders that don't have the status 'Paid'
                    PurchaseOrderStatus: 6
                }
            }
        });

        const salesOrderDueCalculations = this.salesOrderDueDateCalculations(currentDate);
        const purchaseOrderDueCalculations = this.purchaseOrderDueDateCalculations(currentDate);

        const lastMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const avgSalesOrderPrice = this.avgSalesOrderPrice(lastMonthStartDate, currentDate);
        const avgPurchaseOrderPrice = this.avgPurchaseOrderPrice(lastMonthStartDate, currentDate);

        const topSalesOrders = this.topSalesOrders(5);
        const topPurchaseOrders = this.topPurchaseOrders(5);
        const topCustomers = this.topCustomers(5);

        return {
            "UnpaidSalesOrders": unpaidSalesOrders,
            "UnpaidPurchaseOrders": unpaidPurchaseOrders,
            "SalesOrdersToday": salesOrderTodayLength,
            "SalesOrderTotal": salesOrderDueCalculations.salesOrderTotal,
            "PurchaseOrderTotal": purchaseOrderDueCalculations.purchaseOrderTotal,
            "ReceivableCurrent": salesOrderDueCalculations.salesTotalNotDue,
            'ReceivableOverdue': salesOrderDueCalculations.salesTotalDue,
            "PayablesCurrent": purchaseOrderDueCalculations.purchaseTotalNotDue,
            "PayablesOverdue": purchaseOrderDueCalculations.purchaseTotalDue,
            "PaidSalesOrders": paidSalesOrders,
            "NewSalesOrders": newSalesOrders,
            "AverageSalesOrderPrice": avgSalesOrderPrice,
            "AveragePurchaseOrderPrice": avgPurchaseOrderPrice,
            "TopSalesOrders": topSalesOrders,
            "TopPurchaseOrders": topPurchaseOrders,
            "TopCustomers": topCustomers
        };
    }

    private salesOrderDueDateCalculations(currentDate: Date) {
        let salesOrderTotal: number = 0.0;
        let salesTotalNotDue: number = 0;
        let salesTotalDue: number = 0;

        const salesOrdersNotDue = this.salesOrderDao.findAll({
            $filter: {
                greaterThanOrEqual: {
                    Due: currentDate
                }
            }
        });

        salesOrdersNotDue.forEach(salesOrder => {
            salesTotalNotDue += salesOrder.Total;
            salesOrderTotal += salesOrder.Total;
        });

        const salesOrdersDue = this.salesOrderDao.findAll({
            $filter: {
                lessThan: {
                    Due: currentDate
                }
            }
        });

        salesOrdersDue.forEach(salesOrder => {
            salesTotalDue += salesOrder.Total;
            salesOrderTotal += salesOrder.Total;
        });

        return {
            "salesOrderTotal": salesOrderTotal,
            "salesTotalNotDue": salesTotalNotDue,
            "salesTotalDue": salesTotalDue
        }
    }

    private purchaseOrderDueDateCalculations(currentDate: Date) {
        let purchaseOrderTotal: number = 0.0;
        let purchaseTotalNotDue: number = 0;
        let purchaseTotalDue: number = 0;

        const purchaseOrdersNotDue = this.purchaseOrderDao.findAll({
            $filter: {
                greaterThanOrEqual: {
                    Due: currentDate
                }
            }
        });

        purchaseOrdersNotDue.forEach(purchaseOrder => {
            purchaseTotalNotDue += purchaseOrder.Total;
            purchaseOrderTotal += purchaseOrder.Total;
        });

        const purchaseOrdersDue = this.purchaseOrderDao.findAll({
            $filter: {
                lessThan: {
                    Due: currentDate
                }
            }
        });

        purchaseOrdersDue.forEach(purchaseOrder => {
            purchaseTotalDue += purchaseOrder.Total;
            purchaseOrderTotal += purchaseOrder.Total;
        });

        return {
            "purchaseOrderTotal": purchaseOrderTotal,
            "purchaseTotalNotDue": purchaseTotalNotDue,
            "purchaseTotalDue": purchaseTotalDue
        }
    }

    private avgSalesOrderPrice(lastMonthStartDate: Date, currentDate: Date) {
        const salesOrdersLastMonth = this.salesOrderDao.findAll({
            $filter: {
                greaterThanOrEqual: {
                    Date: lastMonthStartDate
                },
                lessThan: {
                    Date: currentDate
                }
            }
        });

        const totalSalesPriceLastMonth = salesOrdersLastMonth.reduce((total, order) => total + order.Gross, 0);
        return totalSalesPriceLastMonth / salesOrdersLastMonth.length;
    }

    private avgPurchaseOrderPrice(lastMonthStartDate: Date, currentDate: Date) {
        const purchaseOrdersLastMonth = this.purchaseOrderDao.findAll({
            $filter: {
                greaterThanOrEqual: {
                    Date: lastMonthStartDate
                },
                lessThan: {
                    Date: currentDate
                }
            }
        });

        const totalPurchasePriceLastMonth = purchaseOrdersLastMonth.reduce((total, order) => total + order.Gross, 0);
        return totalPurchasePriceLastMonth / purchaseOrdersLastMonth.length;
    }

    private topSalesOrders(limit: number) {
        const mostExpensiveSalesOrders = this.salesOrderDao.findAll({
            $sort: 'Gross',
            $order: "desc",
            $limit: limit,
            $select: ['Number', 'Customer', 'Gross']
        });

        const customerIds = mostExpensiveSalesOrders.map(order => order.Customer);
        const customers = this.customerDao.findAll({
            $filter: {
                equals: {
                    Id: customerIds
                }
            }
        });
        const salesOrdersWithNames = mostExpensiveSalesOrders.map(order => {
            const customer = customers.find(c => c.Id === order.Customer);
            return {
                Number: order.Number,
                Customer: customer ? customer.Name : "Unknown",
                Gross: order.Gross
            };
        });

        return salesOrdersWithNames;
    }

    private topPurchaseOrders(limit: number) {
        const mostExpensivePurchaseOrders = this.purchaseOrderDao.findAll({
            $sort: 'Gross',
            $order: "desc",
            $limit: limit,
            $select: ['Number', 'Supplier', 'Gross']
        });

        const supplierIds = mostExpensivePurchaseOrders.map(order => order.Supplier);
        const suppliers = this.supplierDao.findAll({
            $filter: {
                equals: {
                    Id: supplierIds
                }
            }
        });
        const purchaseOrdersWithNames = mostExpensivePurchaseOrders.map(order => {
            const supplier = suppliers.find(s => s.Id === order.Supplier);
            return {
                Number: order.Number,
                Supplier: supplier ? supplier.Name : "Unknown",
                Gross: order.Gross
            };
        });

        return purchaseOrdersWithNames;
    }

    private topCustomers(customersLimit: number) {

        const topCustomersQuery = sql.getDialect()
            .select()
            .column('CUSTOMER_NAME')
            .column('SUM(SALESORDER_GROSS) REVENUE_SUM')
            .column('COUNT(SALESORDER_ID) ORDER_COUNT')
            .from('CODBEX_CUSTOMER')
            .leftJoin('CODBEX_SALESORDER', 'CUSTOMER_ID = SALESORDER_CUSTOMER')
            .group('CUSTOMER_ID')
            .group('CUSTOMER_NAME')
            .order('ORDER_COUNT')
            .limit(customersLimit)
            .build();

        const categoryResult = query.execute(topCustomersQuery);

        const topCustomers = categoryResult.map(row => ({
            Name: row.CUSTOMER_NAME,
            Orders: row.ORDER_COUNT,
            Revenue: row.REVENUE_SUM
        })).reverse();

        return topCustomers;
    }
}