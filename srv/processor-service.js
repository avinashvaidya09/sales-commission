const cds = require('@sap/cds');


class ProcessorService extends cds.ApplicationService {

    // Constants
    static SALES_CLOSED_STATUS_CODES = ['CAN', 'REJ', 'APR', 'CLS'];

    /* Registering custom event handlers in the init method */
    init() {
        this.before("UPDATE", "Sales", (request) => this.validateOnUpdate(request));
        this.before(["CREATE", "UPDATE"], "Sales", (request) => this.updateProductPriceOnSaleRecord(request));
        this.before("UPDATE", "Sales", (request) => this.updatePricing(request));
        this.before("UPDATE", "Sales", (request) => this.calculateSalesCommission(request));
        return super.init();
    }

    /**
     * Validates is the sales record is already in CAN, REJ, APR or CLS status.
     * 
     * @param {*} request 
     * @throws {Error} Returns 404 if the sales record is not found.
     * @throws {Error} Returns 400 is sales record is already closed.
     */
    async validateOnUpdate(request) {
        const data = request.data;
        const currentSale = await cds.tx(request).run(SELECT.one.from('Sales').where({ID: data.ID}));
        if (!currentSale) {
            return request.reject(404, `Sale record with ID ${ID} not found`);
        }
        if (ProcessorService.SALES_CLOSED_STATUS_CODES.includes(currentSale.status_code)) {
            return request.reject(400, 'Cannot modify this sale transaction as it is already closed');
        }
    }

    /**
     * Updates product price on sales record for future reference. This price will be used for further commission calculations.
     * @param {*} request 
     */
    async updateProductPriceOnSaleRecord(request) {
        const data = request.data;
        const currentSale = await cds.tx(request).run(SELECT.one.from('Sales').where({ID: data.ID}));
        if(data.productPrice == null || data.product_ID != currentSale.product_ID) {
            const currentProductRecord = await cds.tx(request).run(SELECT.one.from('Products').where({ID: data.product_ID}));
            data.productPrice = currentProductRecord.price;
        }
       
    }

    /**
     * Updated total sale price on the sales record.
     * @param {*} request 
     */
    updatePricing(request) {
        const data = request.data;
        if (data.salePrice == null && data.productPrice == null) {
            return;
        }
        const productSalePrice = data.salePrice != null ? data.salePrice : data.productPrice;
        const quantity = data.quantity;
        const totalSalePrice = productSalePrice * quantity;
        data.totalSalePrice = totalSalePrice;
    }

    /**
     * Calculates sales commision based on the commision configuration.
     * Commission calculation is only done when the status of the sales
     * record is updated to APR-Approved and only sales manager can update 
     * the approved status.
     * 
     * @param {*} request 
     */
    async calculateSalesCommission(request) {
        const data = request.data;
        if(!request.user.is("sales_manager") && data.status_code == "APR") {
            return request.reject(403, "Only sales managers can approve sales. Please contact your Sales Manager");
        }
        if (data.status_code == "APR" && data.totalSalePrice != null) {
            const sale = await cds.tx(request).run(SELECT.one.from('Sales').where({ID: data.ID}));;
            const createdAtDateObj = new Date(sale.createdAt);
            const yearOfSale = createdAtDateObj.getFullYear();
            console.log(yearOfSale);
            const commissionForCurrentYear = await cds.tx(request).run(SELECT.one.from('CommissionConfig').where({year: yearOfSale}));
            if (commissionForCurrentYear == null) {
                return request.reject(400, `No commission configuration found for the year: ${yearOfSale}`)
            }
            const commissionForCurrentSale = (commissionForCurrentYear.commissionPercent / 100) * data.totalSalePrice;

            data.commission = commissionForCurrentSale;
        }
    }
}

module.exports = { ProcessorService }