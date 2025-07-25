import { SalesOrderRepository as SalesOrderDao } from "../../../../codbex-orders/gen/codbex-orders/dao/SalesOrder/SalesOrderRepository";
import { SalesOrderItemRepository as SalesOrderItemDao } from "../../../../codbex-orders/gen/codbex-orders/dao/salesorder/SalesOrderItemRepository";
import { CustomerRepository as CustomerDao } from "../../../../codbex-partners/gen/codbex-partners/dao/Customers/CustomerRepository";
import { ProductRepository as ProductDao } from "../../../../codbex-products/gen/codbex-products/dao/Products/ProductRepository";
import { CompanyRepository as CompanyDao } from "../../../../codbex-companies/gen/codbex-companies/dao/Companies/CompanyRepository";
import { CityRepository as CityDao } from "../../../../codbex-cities/gen/codbex-cities/dao/Settings/CityRepository";
import { CountryRepository as CountryDao } from "../../../../codbex-countries/gen/codbex-countries/dao/Settings/CountryRepository";
import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Settings/SentMethodRepository";
import { SalesOrderItemStatusRepository as SalesOrderItemStatusDao } from "../../../../codbex-orders/gen/codbex-orders/dao/Settings/SalesOrderItemStatusRepository";

import { Controller, Get } from "sdk/http";

@Controller
class SalesOrderService {

    private readonly salesOrderDao;
    private readonly salesOrderItemDao;
    private readonly customerDao;
    private readonly productDao;
    private readonly companyDao;
    private readonly cityDao;
    private readonly countryDao;
    private readonly sentMethodDao;
    private readonly salesOrderItemStatusDao;

    constructor() {
        this.salesOrderDao = new SalesOrderDao();
        this.salesOrderItemDao = new SalesOrderItemDao();
        this.customerDao = new CustomerDao();
        this.productDao = new ProductDao();
        this.companyDao = new CompanyDao();
        this.cityDao = new CityDao();
        this.countryDao = new CountryDao();
        this.sentMethodDao = new SentMethodDao();
        this.salesOrderItemStatusDao = new SalesOrderItemStatusDao();
    }

    @Get("/:salesOrderId")
    public salesOrderData(_: any, ctx: any) {
        const salesOrderId = ctx.pathParameters.salesOrderId;

        let salesOrder = this.salesOrderDao.findById(salesOrderId);
        const sentMethod = this.sentMethodDao.findById(salesOrder.SentMethod);

        salesOrder.SentMethod = sentMethod.Name;

        let salesOrderItems = this.salesOrderItemDao.findAll({
            $filter: {
                equals: {
                    SalesOrder: salesOrder.Id
                }
            }
        });

        salesOrderItems.forEach((item: any) => {
            const product = this.productDao.findById(item.Product);
            item.Product = product.Name;

            const itemStatus = this.salesOrderItemStatusDao.findAll({
                $filter: {
                    equals: {
                        Id: item.Status
                    }
                }
            });

            item.Status = itemStatus[0].Name;
        });

        let company;

        if (salesOrder.Company) {
            company = this.companyDao.findById(salesOrder.Company);
            const city = this.cityDao.findById(company.City);
            const country = this.countryDao.findById(company.Country);

            company.City = city.Name;
            company.Country = country.Name;
        }

        const customer = this.customerDao.findById(salesOrder.Customer);

        return {
            salesOrder: salesOrder,
            salesOrderItems: salesOrderItems,
            customer: customer,
            company: company
        }
    }
}