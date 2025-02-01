using {com.commission.sales as sales} from '../db/schema';

/**
 * Service used by sales manager to approve sale and commision.
 */

service ManagerService {

    @title: 'Sales Transactions'  @description: 'Stores sale detail for the sales representative with final sale price.'
    entity Sales            as projection on sales.Sales;
    @readonly
    entity Products         as projection on sales.Products;
    @readonly
    entity Customers        as projection on sales.Customers;

    entity CommissionConfig as projection on sales.CommissionConfig;
}

annotate ManagerService with @(requires: ['finance_manager','sales_manager']);

