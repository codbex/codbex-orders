import { SalesOrderRepository as SalesOrderDao } from "../../../../codbex-orders/gen/dao/salesorder/SalesOrderRepository";
import { SalesOrderItemRepository as SalesOrderItemDao } from "../../../../codbex-orders/gen/dao/salesorder/SalesOrderItemRepository";
import { CustomerRepository as CustomerDao } from "../../../../codbex-partners/gen/dao/Customers/CustomerRepository";
import { ProductRepository as ProductDao } from "../../../../codbex-products/gen/dao/Products/ProductRepository";
import { CompanyRepository as CompanyDao } from "../../../../codbex-companies/gen/dao/Companies/CompanyRepository";
import { CityRepository as CityDao } from "../../../../codbex-cities/gen/dao/Cities/CityRepository";
import { CountryRepository as CountryDao } from "../../../../codbex-countries/gen/dao/Countries/CountryRepository";
import { PaymentMethodRepository as PaymentMethodDao } from "../../../../codbex-methods/gen/dao/Methods/PaymentMethodRepository";
import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/dao/Methods/SentMethodRepository";

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
    private readonly paymentMethodDao;
    private readonly sentMethodDao;

    constructor() {
        this.salesOrderDao = new SalesOrderDao();
        this.salesOrderItemDao = new SalesOrderItemDao();
        this.customerDao = new CustomerDao();
        this.productDao = new ProductDao();
        this.companyDao = new CompanyDao();
        this.cityDao = new CityDao();
        this.countryDao = new CountryDao();
        this.paymentMethodDao = new PaymentMethodDao();
        this.sentMethodDao = new SentMethodDao();
    }

    @Get("/:salesOrderId")
    public salesOrderData(_: any, ctx: any) {
        const salesOrderId = ctx.pathParameters.salesOrderId;

        let salesOrder = this.salesOrderDao.findById(salesOrderId);
        let paymentMethod = this.paymentMethodDao.findById(salesOrder.PaymentMethod);
        let sentMethod = this.sentMethodDao.findById(salesOrder.SentMethod);

        salesOrder.PaymentMethod = paymentMethod.Name;
        salesOrder.SentMethod = sentMethod.Name;

        let salesOrderItems = this.salesOrderItemDao.findAll({
            $filter: {
                equals: {
                    SalesOrder: salesOrder.Id
                }
            }
        });

        salesOrderItems.forEach((item: any) => {
            let product = this.productDao.findById(item.Product);
            item.Product = product.Name;
        });

        let company;

        if (salesOrder.Company) {
            company = this.companyDao.findById(salesOrder.Company);
            let city = this.cityDao.findById(company.City);
            let country = this.countryDao.findById(company.Country);

            company.CityName = city.Name;
            company.Country = country.Name;
        }

        let customer = this.customerDao.findById(salesOrder.Customer);

        return {
            salesOrder: salesOrder,
            salesOrderItems: salesOrderItems,
            customer: customer,
            company: company
        }
    }
}