sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog", 
    "sap/m/Button",
    "sap/m/Text"
], (Controller, MessageToast, JSONModel, Dialog, Button, Text) => {
    "use strict";

    return Controller.extend("ns.commissionconfig.controller.ManageConfig", {
        onInit() {
            this._setManageConfigPageTitle("CREATE");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteManage").attachPatternMatched(this._onObjectMatched, this);

            this._fetchCommissionConfigStatus();
        },
        _setManageConfigPageTitle: function(manageType) {
            const oView = this.getView();
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            let oViewModel = null;
            let pageTitle = oResourceBundle.getText("CreateCommissionConfiguration")
            if (manageType == "CREATE") {
                oViewModel = new JSONModel({
                    title: pageTitle
                });
            } else {
                pageTitle = oResourceBundle.getText("EditCommissionConfiguration");
                oViewModel = new JSONModel({
                    title: pageTitle
                });
            }
            oView.setModel(oViewModel, "viewModel");
        },
        _onObjectMatched: function (oEvent) {
            const oModel = this.getOwnerComponent().getModel();
            const oView = this.getView();

            // Get `configId` from route parameters
            this.sConfigId = oEvent.getParameter("arguments").configId;

            if (this.sConfigId && this.sConfigId !== "null") {
                this._setManageConfigPageTitle("EDIT");
                // EDIT Mode: Load Existing Data
                oModel.bindContext(`/CommissionConfig('${this.sConfigId}')`).requestObject()
                    .then((oData) => {
                        oView.setModel(new JSONModel(oData), "editModel");
                    })
                    .catch((oError) => {
                        console.error("Error loading CommissionConfig:", oError);
                    });
            } else {
                this._setManageConfigPageTitle("CREATE");
                // CREATE Mode: Set Empty Model
                oView.setModel(new JSONModel({
                    title: "",
                    year: "",
                    commissionPercent: "",
                    status_code: "PEND"
                }), "editModel");
            }
        },
        _fetchCommissionConfigStatus: function () {
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
        _getFormData: function () {
            const oView = this.getView();
            return {
                year: oView.byId("yearInput").getValue(),
                title: oView.byId("titleInput").getValue(),
                commissionPercent: parseFloat(oView.byId("commissionPercentInput").getValue()),
                status_code: oView.byId("statusSelect").getSelectedKey()
            };
        },
        _validateFormData: function (oData, oResourceBundle) {
            if (!oData.year || !oData.title || isNaN(oData.commissionPercent)) {
                MessageToast.show(oResourceBundle.getText("msg.error.requiredFields"));
                return false;
            }
            return true;
        },
        /**
         * Return the promise object to ensure record is created before
         * the app navigates to the main page.
         * This ensures the calling method "onSave" waits for completion.
         * 
         * @param {*} oModel 
         * @param {*} oData 
         * @returns Promise Object
         */
        _createCommissionConfig: function (oModel, oData) {
            return new Promise((resolve, reject) => {
                const oListBinding = oModel.bindList("/CommissionConfig");
                const oContext = oListBinding.create(oData);

                oContext.created().then(() => resolve()).catch((oError) => reject(oError));
            });

        },
        /**
         * This method first updates a specific record.
         * 
         * @param {*} oModel 
         * @param {*} oData 
         * @returns Promise Object
         */
        _updateCommissionConfig: function (oModel, oData, oResourceBundle) {
            return new Promise((resolve, reject) => {
                // Bind the context to the specific record being edited
                const oContextBinding = oModel.bindContext(`/CommissionConfig('${this.sConfigId}')`);

                // Fetch existing data to ensure binding is valid
                oContextBinding.requestObject().then(() => {
                    // Get bound context for entity
                    const oContext = oContextBinding.getBoundContext();
                    if (!oContext) {
                        return reject(oResourceBundle.getText("message.error.CommissionConfigFailed"));
                    }
                    // Update each field as per the incoming data
                    Object.keys(oData).forEach(key => {
                        oContext.setProperty(key, oData[key]);
                    });
                    
                    // Submit batch. In OData V4 for updates, use batch update
                    oModel.submitBatch("commissionUpdateBatch")
                            .then(() => {
                                // Wait for UI5 to process messages asynchronously
                                return new Promise((resolve) => setTimeout(resolve, 100));
                            })
                            .then(() => {
                            // Retrieve messages from Message Manager
                            const oMessageManager = sap.ui.getCore().getMessageManager();
                            const aMessages = oMessageManager.getMessageModel().getData();
                            const aErrorMessages = aMessages.filter(msg => msg.type === "Error");
                            aMessages.forEach(msg => oMessageManager.removeMessages(msg));
                            if (aErrorMessages.length > 0) {
                                return reject(new Error(aErrorMessages.map(msg => msg.message).join("\n")));
                            } else {
                                resolve()
                            }  
                        })
                        .catch((oError) => reject(oError));

                }).catch((oError) => {
                    reject("Error fetching data: " + oError.message)
                });
                
            });
        },
        onSave: async function () {
            const oModel = this.getOwnerComponent().getModel();
            const oRouter = this.getOwnerComponent().getRouter();
            const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

            const oData = this._getFormData(); // Get form data

            // Validate required fields
            if (!this._validateFormData(oData, oResourceBundle)) {
                return; // Stop execution if validation fails
            }

            try {
                if (this.sConfigId && this.sConfigId !== "null") {
                    // EDIT MODE: Update existing record
                    await this._updateCommissionConfig(oModel, oData, oResourceBundle);
                    MessageToast.show(oResourceBundle.getText("message.success.CommissionConfigUpdated"));
                } else {
                    // CREATE MODE: Create new record
                    await this._createCommissionConfig(oModel, oData);
                    MessageToast.show(oResourceBundle.getText("message.success.CommissionConfigCreated"));
                }
                // Add a slight delay before navigating
                setTimeout(() => {
                    oRouter.navTo("RouteMain");
                }, 500);
            } catch (oError) {
                let sErrorMessage = oResourceBundle.getText("message.error.CommissionConfigFailed");
                if (oError && oError.message) {
                    sErrorMessage = oError.message;
                }
                console.error("Save failed:", oError);
                this._showErrorDialog(sErrorMessage);
               
            }
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
        },
        _showErrorDialog: function (sMessage) {
            const oDialog = new Dialog({
                title: "Error",
                type: "Message",
                state: "Error",
                content: new Text({ text: sMessage }),
                beginButton: new Button({
                    text: "OK",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        }
    });
});