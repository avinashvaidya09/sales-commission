using {
  cuid,
  managed,
  sap.common.CodeList,
  sap.common.Currencies
} from '@sap/cds/common';

//namespace com.commission.sales;

context com.commission.sales {
  entity Sales : cuid, managed {
    key ID             : UUID            @Core.Computed;
        customer       : Association to Customers;
        title          : String not null @title: 'Title';
        status         : Association to Status default 'NEW';
        product        : Association to Products;
        quantity       : Int32 default 1 @title: 'Quantity';
        productPrice   : Decimal(15, 2)  @title: 'Product Price';
        salePrice      : Decimal(15, 2)  @title: 'Sale Price';
        totalSalePrice : Decimal(15, 2)  @title: 'Total Sale Price';
        currency       : Association to Currencies;
        commission     : Decimal(15, 2)  @title: 'Sales Rep Commission';
        comment        : Composition of many {
                           key ID        : UUID;
                               timestamp : type of managed : createdAt;
                               author    : type of managed : createdBy;
                               message   : String;
                         };
  }

  entity Products : managed {
    key ID          : String         @title: 'Product ID';
        name        : String         @title: 'Product Name';
        description : String;
        category    : String;
        image       : String         @title: 'Looks Like';
        price       : Decimal(15, 2) @title: 'Price';
        currency    : Association to Currencies;
  }

  /**
  * Customers entitled to create support Incidents.
  */
  entity Customers : managed {
    key ID        : String;
        firstName : String;
        lastName  : String;
        name      : String = firstName || ' ' || lastName;
        email     : EMailAddress;
        phone     : PhoneNumber;
        sales     : Association to many Sales
                      on sales.customer = $self;
        addresses : Composition of many Addresses
                      on addresses.customer = $self;
  }

  entity Addresses : managed {
    key ID              : String;
        customer        : Association to Customers;
        streetAddress   : String;
        city            : String;
        postCode        : String;
        country         : String;
        addressTimeZone : String;
  }

  entity Status : CodeList {
    key code        : String enum {
          new              = 'NEW';
          in_process       = 'INP';
          on_hold          = 'HLD';
          closed           = 'CLS';
          approved         = 'APR';
          approval_pending = 'PEN';
          rejected         = 'REJ';
          cancelled        = 'CAN';
        };
        criticality : Integer;
  }

  entity CommissionConfigStatus : CodeList {
    key code : String enum {
          pending  = 'PEND';
          approved = 'APPR';
          rejected = 'REJC';
        };
  }

  entity CommissionConfig : managed {
    key ID                : UUID @Core.Computed;
        status            : Association to CommissionConfigStatus default 'PEND';
        title             : String;
        commissionPercent : Decimal(15, 2);
        year              : Integer;
  }

  type EMailAddress : String;
  type PhoneNumber  : String;
}

@cds.persistence.exists 
@cds.persistence.calcview 
Entity V_SALES {
key     TITLE: String(5000)  @title: 'TITLE: TITLE' ; 
        STATUS_CODE: String(5000)  @title: 'STATUS_CODE: STATUS_CODE' ; 
        PRODUCT_ID: String(5000)  @title: 'PRODUCT_ID: PRODUCT_ID' ; 
        CUSTOMER_ID: String(5000)  @title: 'CUSTOMER_ID: CUSTOMER_ID' ; 
        QUANTITY: Integer  @title: 'QUANTITY: QUANTITY' ; 
        PRODUCTPRICE: Decimal(15)  @title: 'PRODUCTPRICE: PRODUCTPRICE' ; 
        SALEPRICE: Decimal(15)  @title: 'SALEPRICE: SALEPRICE' ; 
        TOTALSALEPRICE: Decimal(15)  @title: 'TOTALSALEPRICE: TOTALSALEPRICE' ; 
        CURRENCY_CODE: String(3)  @title: 'CURRENCY_CODE: CURRENCY_CODE' ; 
        COMMISSION: Decimal(15)  @title: 'COMMISSION: COMMISSION' ; 
        FIRSTNAME: String(5000)  @title: 'FIRSTNAME: FIRSTNAME' ; 
        LASTNAME: String(5000)  @title: 'LASTNAME: LASTNAME' ; 
        EMAIL: String(5000)  @title: 'EMAIL: EMAIL' ; 
        PHONE: String(5000)  @title: 'PHONE: PHONE' ; 
        STREETADDRESS: String(5000)  @title: 'STREETADDRESS: STREETADDRESS' ; 
        CITY: String(5000)  @title: 'CITY: CITY' ; 
        POSTCODE: String(5000)  @title: 'POSTCODE: POSTCODE' ; 
        COUNTRY: String(5000)  @title: 'COUNTRY: COUNTRY' ; 
        ADDRESSTIMEZONE: String(5000)  @title: 'ADDRESSTIMEZONE: ADDRESSTIMEZONE' ; 
}