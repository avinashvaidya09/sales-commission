using ProcessorService as service from '../../srv/services';
using from '../../db/schema';

annotate service.Sales with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Customerid2}',
                Value : customer_ID,
            },
            {
                $Type : 'UI.DataField',
                Value : title,
                Label : '{i18n>Title1}',
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Statuscode2}',
                Value : status_code,
            },
            {
                $Type : 'UI.DataField',
                Value : createdAt,
            },
            {
                $Type : 'UI.DataField',
                Value : customer.email,
                Label : '{i18n>Email}',
            },
            {
                $Type : 'UI.DataField',
                Value : customer.phone,
                Label : '{i18n>Phone}',
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.CollectionFacet',
            Label : '{i18n>Overview}',
            ID : 'SaleDetails',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    ID : 'GeneratedFacet1',
                    Label : '{i18n>GeneralInformation}',
                    Target : '@UI.FieldGroup#GeneratedGroup',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : '{i18n>Details}',
                    ID : 'Details',
                    Target : '@UI.FieldGroup#Details1',
                },
            ],
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>ProductDetails}',
            ID : 'i18nProductDetails',
            Target : '@UI.FieldGroup#i18nProductDetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Pricing}',
            ID : 'i18nPricing',
            Target : '@UI.FieldGroup#i18nPricing',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : '{i18n>Notes}',
            ID : 'i18nNotes',
            Target : 'comment/@UI.LineItem#i18nNotes',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : title,
            Label : '{i18n>Title}',
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Customerid1}',
            Value : customer_ID,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Statuscode1}',
            Value : status_code,
            Criticality : status.criticality,
        },
        {
            $Type : 'UI.DataField',
            Value : product.ID,
            Label : '{i18n>Id}',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : '{i18n>Quantity}',
        },
        {
            $Type : 'UI.DataField',
            Value : product.price,
            Label : '{i18n>Price}',
        },
    ],
    UI.SelectionFields : [
        status_code,
        customer_ID,
    ],
    UI.HeaderInfo : {
        Title : {
            $Type : 'UI.DataField',
            Value : title,
        },
        TypeName : '',
        TypeNamePlural : '',
        ImageUrl : product.image,
        Description : {
            $Type : 'UI.DataField',
            Value : customer.name,
        },
        TypeImageUrl : '',
    },
    UI.FieldGroup #Details : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
    UI.FieldGroup #Details1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ID,
                Label : '{i18n>Id2}',
            },
            {
                $Type : 'UI.DataField',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Value : createdAt,
            },
            {
                $Type : 'UI.DataField',
                Value : createdBy,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedAt,
            },
            {
                $Type : 'UI.DataField',
                Value : modifiedBy,
            },
        ],
    },
    UI.FieldGroup #i18nProductDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : product_ID,
                Label : '{i18n>Productid}',
            },
            {
                $Type : 'UI.DataField',
                Value : product.category,
                Label : '{i18n>Category}',
            },
            {
                $Type : 'UI.DataField',
                Value : product.name,
                Label : '{i18n>ProductName}',
            },
            {
                $Type : 'UI.DataField',
                Value : product.description,
                Label : '{i18n>Description2}',
            },
            {
                $Type : 'UI.DataField',
                Value : product.price,
                Label : '{i18n>Price1}',
            },
            {
                $Type : 'UI.DataField',
                Value : product.modifiedAt,
            },
        ],
    },
    UI.FieldGroup #i18nPricing : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : productPrice,
            },
            {
                $Type : 'UI.DataField',
                Value : quantity,
            },
            {
                $Type : 'UI.DataField',
                Value : salePrice,
            },
            {
                $Type : 'UI.DataField',
                Value : totalSalePrice,
                Label : '{i18n>TotalSalePrice}',
            },
            {
                $Type : 'UI.DataField',
                Value : commission,
                Label : '{i18n>SalesRepCommission}',
            },
            {
                $Type : 'UI.DataField',
                Value : product.currency.code,
            },
        ],
    },
);

annotate service.Sales with {
    customer @(
        Common.Label : '{i18n>Customerid}',
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Customers',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : customer_ID,
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'ID',
                    LocalDataProperty : customer.ID,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'firstName',
                    LocalDataProperty : customer.firstName,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'lastName',
                    LocalDataProperty : customer.lastName,
                },
                {
                    $Type : 'Common.ValueListParameterOut',
                    ValueListProperty : 'email',
                    LocalDataProperty : customer.email,
                },
            ],
        },
        Common.ValueListWithFixedValues : false,
        Common.Text : {
            $value : customer_ID,
            ![@UI.TextArrangement] : #TextSeparate
        },
        Common.FieldControl : #Mandatory,
        )
};

annotate service.Sales with {
    product @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Products',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : product_ID,
                    ValueListProperty : 'name',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'description',
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'category',
                },
            ],
        },
        Common.Text : {
            $value : product_ID,
            ![@UI.TextArrangement] : #TextSeparate
        },
        Common.ValueListWithFixedValues : false,
        Common.FieldControl : #Mandatory,
        )
};

annotate service.Sales with {
    status @(
        Common.Label : '{i18n>Statuscode}',
        Common.Text : {
            $value : status.descr,
            ![@UI.TextArrangement] : #TextOnly
        },
        Common.ValueListWithFixedValues : true,
        )
};

annotate service.Status with {
    code @Common.Text : {
        $value : descr,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

annotate service.Sales.comment with @(
    UI.LineItem #i18nNotes : [
        {
            $Type : 'UI.DataField',
            Value : message,
            Label : '{i18n>Message}',
        },
        {
            $Type : 'UI.DataField',
            Value : author,
        },
        {
            $Type : 'UI.DataField',
            Value : timestamp,
        },
    ]
);

annotate service.Sales with {
    currency @Common.FieldControl : #ReadOnly
};

annotate service.Products with {
    ID @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Products',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : ID,
                    ValueListProperty : 'ID',
                },
            ],
        },
        Common.ValueListWithFixedValues : true,
        Common.Text : name,
        )
};

annotate service.Sales with {
    productPrice @Common.FieldControl : #ReadOnly
};

annotate service.Sales with {
    commission @Common.FieldControl : #ReadOnly
};

annotate service.Sales with {
    totalSalePrice @Common.FieldControl : #ReadOnly
};

annotate service.Customers with {
    ID @Common.Text : name
};

annotate service.Customers with {
    name @Common.Text : ID
};

annotate service.Products with {
    name @Common.Text : {
        $value : ID,
        ![@UI.TextArrangement] : #TextSeparate
    }
};

annotate service.Sales with {
    title @Common.FieldControl : #Mandatory
};

annotate service.Sales with {
    ID @Common.Text : {
        $value : customer.ID,
        ![@UI.TextArrangement] : #TextSeparate
    }
};

