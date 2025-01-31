using {
  cuid,
  managed,
  sap.common.CodeList,
  sap.common.Currencies
} from '@sap/cds/common';

namespace com.commission.sales;

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

entity Addresses : cuid, managed {
  customer      : Association to Customers;
  city          : String;
  postCode      : String;
  streetAddress : String;
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
