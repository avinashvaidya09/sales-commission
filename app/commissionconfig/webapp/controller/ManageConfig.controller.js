sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], (Controller, MessageToast, JSONModel) => {
    "use strict";

    return Controller.extend("ns.commissionconfig.controller.ManageConfig", {
        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteManage").attachPatternMatched(this._onObjectMatched, this);

            this._fetchCommissionConfigStatus();
        },
        _onObjectMatched: function (oEvent) {
            const oModel = this.getOwnerComponent().getModel();
            const oView = this.getView();
            
            // Get `configId` from route parameters
            this.sConfigId = oEvent.getParameter("arguments").configId;

            if (this.sConfigId && this.sConfigId !== "null") {
                // EDIT Mode: Load Existing Data
                oModel.bindContext(`/CommissionConfig('${this.sConfigId}')`).requestObject()
                    .then((oData) => {
                        oView.setModel(new JSONModel(oData), "editModel");
                    })
                    .catch((oError) => {
                        console.error("Error loading CommissionConfig:", oError);
                    });
            } else {
                // CREATE Mode: Set Empty Model
                oView.setModel(new JSONModel({
                    title: "",
                    year: "",
                    commissionPercent: "",
                    status_code: "PEND"
                }), "editModel");
            }
        },
        _fetchCommissionConfigStatus: function() {
            const oModel = this.getOwnerComponent().getModel();
            const oView = this.getView();

            // Fetch Status Data from OData
            oModel.bindList("/CommissionConfigStatus").requestContexts().then((aContexts) => {
                const aStatusData = aContexts.map((oContext) => oContext.getObject());
                const oStatusModel = new JSONModel({ Statuses: aStatusData });
                // Set the model for the view
                oView.setModel(oStatusModel, "statusModel");
                // Set Default Selection to "PEND"
                const oStatusSelect = oView.byId("statusSelect");
                if (oStatusSelect) {
                    oStatusSelect.setSelectedKey("PEND");
                }
            }).catch((oError) => {
                console.error("Error loading status values:", oError);
            });
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
        },
        onBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMain");
        },
        onYearChange: function (oEvent) {
            const oInput = oEvent.getSource();
            const sValue = oInput.getValue();
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            
            // Allow only numbers & ensure it's exactly 4 digits
            if (!/^\d{4}$/.test(sValue)) {
                oInput.setValueState("Error");
                oInput.setValueStateText(oResourceBundle.getText("message.year.invalid"));
            } else {
                oInput.setValueState("None"); // Remove error state if valid
            }
        }
    });
});