const cds = require('@sap/cds');


class ManagerService extends cds.ApplicationService {

    // Constants
    static COMMISSION_CONFIG_CLOSED_STATUS_CODES = ['REJC', 'APPR'];

    /* Registering custom event handlers in the init method */
    init() {
        this.before("UPDATE", "CommissionConfig", (request) => this.validateOnUpdate(request));
        this.before("UPDATE", "CommissionConfig", (request) => this.checkApprovalPermissions(request));
        return super.init();
    }

    /**
     * Validates if the commission config record is already approved or rejected.
     * 
     * @param {*} request 
     * @throws {Error} Returns 404 if the sales record is not found.
     * @throws {Error} Returns 400 is sales record is already closed.
     */
    async validateOnUpdate(request) {
        const data = request.data;
        const currentRecord = await cds.tx(request).run(SELECT.one.from('CommissionConfig').where({ID: data.ID}));
        if (!currentRecord) {
            return request.reject(404, `Commission config record with ID ${ID} not found`);
        }
        if (ManagerService.COMMISSION_CONFIG_CLOSED_STATUS_CODES.includes(currentRecord.status_code)) {
            return request.reject(400, 'Cannot modify this record as it is already approved or rejected');
        }
    }

    /**
     * Checks if only finance manager can approve or reject the commission config record.
     * 
     * @param {*} request 
     * @returns 
     */
    async checkApprovalPermissions(request) {
        const data = request.data;
        if(!request.user.is("finance_manager") && ManagerService.COMMISSION_CONFIG_CLOSED_STATUS_CODES.includes(data.status_code)) {
            return request.reject(403, "Only Finance managers can approve or reject commission config. Please contact your Finance Team.");
        }
    }
}

module.exports = { ManagerService }