using {com.commission.sales as sales} from '../db/schema';
using { V_SALES  } from '../db/schema';

/*
* Service used by Sales Service representatives and managers.
*/
service ProcessorService {

    @title: 'Sales Transactions'  @description: 'Stores sale detail for the sales representative with final sale price.'
    entity Sales            as projection on sales.Sales;
    @readonly
    entity Products         as projection on sales.Products;
    @readonly
    entity Customers        as projection on sales.Customers;
    @readonly
    entity Addresses as projection on sales.Addresses;

    @readonly
    entity V_Sales as projection on V_SALES;

}

annotate ProcessorService.Sales with @odata.draft.enabled;
annotate ProcessorService with @(requires: ['sales_manager', 'sales_representative']);



