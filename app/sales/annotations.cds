using SalesService as service from '../../srv/sales-service';
using from '../../db/schema';

annotate service.Sales with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'customer_ID',
                Value : customer_ID,
            },
            {
                $Type : 'UI.DataField',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'status_code',
                Value : status_code,
            },
            {
                $Type : 'UI.DataField',
                Value : quantity,
            },
            {
                $Type : 'UI.DataField',
                Value : productPrice,
            },
            {
                $Type : 'UI.DataField',
                Value : salePrice,
            },
            {
                $Type : 'UI.DataField',
                Label : 'currency_code',
                Value : currency_code,
            },
            {
                $Type : 'UI.DataField',
                Value : totalPrice,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : ID,
            Label : '{i18n>Id1}',
        },
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
                    ValueListProperty : 'ID',
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
        )
};

annotate service.Sales with {
    product @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Products',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : product_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'category',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'image',
            },
        ],
    }
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

annotate service.Customers with {
    ID @Common.Text : {
        $value : name,
        ![@UI.TextArrangement] : #TextSeparate,
    }
};

annotate service.Status with {
    code @Common.Text : {
        $value : descr,
        ![@UI.TextArrangement] : #TextOnly,
    }
};

