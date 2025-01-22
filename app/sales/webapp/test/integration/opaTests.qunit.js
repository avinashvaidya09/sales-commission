sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'ns/sales/test/integration/FirstJourney',
		'ns/sales/test/integration/pages/SalesList',
		'ns/sales/test/integration/pages/SalesObjectPage'
    ],
    function(JourneyRunner, opaJourney, SalesList, SalesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('ns/sales') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheSalesList: SalesList,
					onTheSalesObjectPage: SalesObjectPage
                }
            },
            opaJourney.run
        );
    }
);