sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("ns.commissionconfig.controller.ManageConfig", {
        onInit() {

        },
        onSave: function () {
            const oModel = this.getOwnerComponent().getModel();
            const oListBinding = oModel.bindList("/CommissionConfig");
            const oView = this.getView();
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            const oData = {
                year: oView.byId("yearInput").getValue(),
                title: oView.byId("titleInput").getValue(),
                commissionPercent: parseFloat(oView.byId("commissionPercentInput").getValue()),
                status_code: oView.byId("statusSelect").getSelectedKey()
            };

            // Ensure required fields are filled
            if (!oData.year || !oData.title || isNaN(oData.commissionPercent)) {
                MessageToast.show(oResourceBundle.getText("msg.error.requiredFields"));
            return;
            }

            const oContext = oListBinding.create(oData);

            oContext.created().then(() => {
                MessageToast.show(oResourceBundle.getText("message.success.CommissionConfigCreated"));
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain");
            }).catch((oError) => {
                let sErrorMessage = oResourceBundle.getText(message.error.CommissionConfigFailed);
                if (oError && oError.message) {
                    sErrorMessage = oError.message;
                }
                MessageToast.show(sErrorMessage);
                console.error("Create failed:", oError);
            })

            
        }
    });
});