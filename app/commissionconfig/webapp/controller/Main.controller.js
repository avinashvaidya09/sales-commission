sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (Controller, MessageToast, JSONModel) => {
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
                $count: true
            }
            oModel.bindList("/CommissionConfig",undefined, undefined, undefined, oParameters).requestContexts().then((aContexts) => {
                const aData = aContexts.map((oContext) => oContext.getObject());
                const oJsonModel = new JSONModel(aData);
                oView.setModel(oJsonModel, "commissionConfig");
            }).catch((oError) => {
                console.error("Error loading CommissionConfig data:", oError);
            });
        }

    });
});