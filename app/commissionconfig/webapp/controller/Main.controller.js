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
            // This is for initial data load.
            this._fetchCommissionData();

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteMain").attachPatternMatched(this._onPatternMatched, this);
            
        },
        _fetchCommissionData: function() {
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
        /**
         * Called every time the Main page is loaded (navigated to).
         */
        _onPatternMatched: function() {
            this._fetchCommissionData();
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
        },
        onCreate: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteManage");
        },
        onEditCommissionConfig: function (oEvent) {
            const oRouter = this.getOwnerComponent().getRouter();
            const oSelectedObject = oEvent.getSource().getBindingContext("commissionConfig").getObject();

            if (oSelectedObject && oSelectedObject.ID) {
                // Navigate to Edit Page with configId
                oRouter.navTo("RouteManage", { configId: oSelectedObject.ID });
            } else {
                console.error("Error: No valid ID found for navigation.");
            }
        }

    });
});