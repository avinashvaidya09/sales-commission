using {com.commission.sales as sales} from '../db/schema';

/*
* Service used by Sales Service representatives and managers.
*/
service SalesService {

    @title: 'Sales Transactions'  @description: 'Stores sale detail for the sales representative with final sale price.'
    entity Sales            as
        projection on sales.Sales {
            *,
            (
                quantity * salePrice
            ) as totalPrice : Decimal(15, 2) @title : 'TotalSalePrice'
        }

    
    @readonly
    entity Products         as projection on sales.Products;

    @readonly
    entity Customers        as projection on sales.Customers;

    @readonly
    entity CommissionConfig as projection on sales.CommissionConfig;

}

annotate SalesService.Sales with @odata.draft.enabled;

//annotate SalesService with @(requires: 'sales_representative');
