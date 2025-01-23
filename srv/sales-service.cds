using {com.commission.sales as sales} from '../db/schema';

/*
* Service used by Sales Service representatives and managers.
*/
service SalesService {

    @title: 'Sales Transactions'  @description: 'Stores sale detail for the sales representative with final sale price.'
    entity Sales            as projection on sales.Sales;
    @readonly
    entity Products         as projection on sales.Products;
    @readonly
    entity Customers        as projection on sales.Customers;

}

annotate SalesService.Sales with @odata.draft.enabled;

/**
 * Service used by sales manager to approve sale and commision.
 */

service SalesManagerService {

    @title: 'Sales Transactions'  @description: 'Stores sale detail for the sales representative with final sale price.'
    entity Sales            as projection on sales.Sales;
    @readonly
    entity Products         as projection on sales.Products;
    @readonly
    entity Customers        as projection on sales.Customers;
}

annotate SalesService with @(requires: 'sales_representative');

annotate SalesManagerService with @(requires: 'sales_manager');

