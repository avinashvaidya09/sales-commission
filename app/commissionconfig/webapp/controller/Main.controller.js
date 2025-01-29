sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("ns.commissionconfig.controller.Main", {
        /**
         * In case you want to edit data or add parameters, onInit method is the
         * right place to add custom logic.
         */
        onInit: function () {
            const oModel = this.getOwnerComponent().getModel();
            const oView = this.getView();
            const oParameters = {
                $count: true,
                $expand: "status"
            }
            oModel.bindList("/CommissionConfig",undefined, undefined, undefined, oParameters).requestContexts().then((aContexts) => {
                const aData = aContexts.map((oContext) => oContext.getObject());
                const oJsonModel = new JSONModel(aData);
                oView.setModel(oJsonModel, "commissionConfig");
            }).catch((oError) => {
                console.error("Error loading CommissionConfig data:", oError);
            });
        },
        formatDate: function (sDateTime) {
            if (!sDateTime) {
                return "";
            }
            const oDate = new Date(sDateTime);
            return oDate.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
        },
        onFilterConfig: function(oEvent) {
            // Build filter array
            const aFilter = [];
            const sQuery = oEvent.getParameter("query");
            if(sQuery) {
                aFilter.push(new Filter("year", FilterOperator.Equals, sQuery));
                aFilter.push(new Filter("title", FilterOperator.Contains, sQuery));
            }

            // Filter Binding
            const oList = this.byId("commissionConfigTable");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        }

    });
});