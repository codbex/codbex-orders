import { PurchaseOrderRepository as PurchaseOrderDao } from "../../../../codbex-orders/gen/codbex-orders/dao/purchaseorder/PurchaseOrderRepository";
import { PurchaseOrderItemRepository as PurchaseOrderItemDao } from "../../../../codbex-orders/gen/codbex-orders/dao/purchaseorder/PurchaseOrderItemRepository";
import { SupplierRepository as SupplierDao } from "../../../../codbex-partners/gen/codbex-partners/dao/Suppliers/SupplierRepository";
import { ProductRepository as ProductDao } from "../../../../codbex-products/gen/codbex-products/dao/Products/ProductRepository";
import { CompanyRepository as CompanyDao } from "../../../../codbex-companies/gen/codbex-companies/dao/Companies/CompanyRepository";
import { CityRepository as CityDao } from "../../../../codbex-cities/gen/codbex-cities/dao/Settings/CityRepository";
import { CountryRepository as CountryDao } from "../../../../codbex-countries/gen/codbex-countries/dao/Settings/CountryRepository";
import { PaymentMethodRepository as PaymentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Settings/PaymentMethodRepository";
import { SentMethodRepository as SentMethodDao } from "../../../../codbex-methods/gen/codbex-methods/dao/Settings/SentMethodRepository";

import { Controller, Get } from "sdk/http";

@Controller
class PurchaseOrderService {

    private readonly purchaseOrderDao;
    private readonly purchaseOrderItemDao;
    private readonly supplierDao;
    private readonly productDao;
    private readonly companyDao;
    private readonly cityDao;
    private readonly countryDao;
    private readonly paymentMethodDao;
    private readonly sentMethodDao;

    constructor() {
        this.purchaseOrderDao = new PurchaseOrderDao();
        this.purchaseOrderItemDao = new PurchaseOrderItemDao();
        this.supplierDao = new SupplierDao();
        this.productDao = new ProductDao();
        this.companyDao = new CompanyDao();
        this.cityDao = new CityDao();
        this.countryDao = new CountryDao();
        this.paymentMethodDao = new PaymentMethodDao();
        this.sentMethodDao = new SentMethodDao();
    }

    @Get("/:purchaseOrderId")
    public purchaseOrderData(_: any, ctx: any) {
        const purchaseOrderId = ctx.pathParameters.purchaseOrderId;

        let purchaseOrder = this.purchaseOrderDao.findById(purchaseOrderId);
        const paymentMethod = this.paymentMethodDao.findById(purchaseOrder.PaymentMethod);
        const sentMethod = this.sentMethodDao.findById(purchaseOrder.SentMethod);

        purchaseOrder.PaymentMethod = paymentMethod.Name;
        purchaseOrder.SentMethod = sentMethod.Name;

        let purchaseOrderItems = this.purchaseOrderItemDao.findAll({
            $filter: {
                equals: {
                    PurchaseOrder: purchaseOrder.Id
                }
            }
        });

        purchaseOrderItems.forEach((item: any) => {
            const product = this.productDao.findById(item.Product);
            item.Product = product.Name;
        });

        let company;

        if (purchaseOrder.Company) {
            company = this.companyDao.findById(purchaseOrder.Company);
            const city = this.cityDao.findById(company.City);
            const country = this.countryDao.findById(company.Country);

            company.City = city.Name;
            company.Country = country.Name;
        }

        const supplier = this.supplierDao.findById(purchaseOrder.Supplier);

        return {
            purchaseOrder: purchaseOrder,
            purchaseOrderItems: purchaseOrderItems,
            supplier: supplier,
            company: company
        }
    }
}