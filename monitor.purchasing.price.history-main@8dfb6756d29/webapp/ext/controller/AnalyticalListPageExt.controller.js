sap.ui.define([
    "vwks/nlp/s2p/mm/reuse/lib/util/Constants",
    "vwks/nlp/s2p/mm/reuse/lib/util/NavigationHelper",
    "sap/ui/model/Filter",   
    "sap/ui/model/FilterOperator",
    "vwks/nlp/s2p/mm/mntr/price/hist/utils/Constants"
], function (ReuseConstants, NavigationHelper,Filter,FilterOperator,Constants) {
    "use strict";
    sap.ui.controller("vwks.nlp.s2p.mm.mntr.price.hist.ext.controller.AnalyticalListPageExt", {

    /**
     * Method to get Price Trend Filter  
     * @returns {sap.ui.model.Filter} Price Trend Filter
     */
        getPriceTrendFilter : function ()  {
            var oComboBox = sap.ui.getCore().byId('vwks.nlp.s2p.mm.mntr.price.hist::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::xVWKSxNLP_C_PRI_HIS_RESULTLISTResults--template::SmartFilterBar-filterItemControl_BASIC-UseCaseID');
            var sKey = oComboBox.getSelectedKey();
            if (sKey === Constants.PRICE_TREND) {
                    var oPriceTrendFilter = new Filter ({
                        path: "ProcmtHubContrIsCurrentVersion",
                        operator: FilterOperator.EQ,
                        value1: true
                        
                    }) ;
            }
            return oPriceTrendFilter;
        },
       /**
        * Method to set UseCaseID filter value to fetch data for Price breakdown/Price versioning
        * @param { Object[] } mBinding - binding parameter of the event
        */
        setUseCaseID : function (mBinding) {
            var oFilter =  mBinding.filters[0];           
            var slen = oFilter.aFilters.length;
            for (var i = 0; i < slen; i++) {
                if ( oFilter.aFilters[i].sPath === 'UseCaseID') {
                     oFilter.aFilters[i].oValue1 = '01';
                     break;                      
                }
            }              

        },

      /**
       * Before Rebind chart extension for Analytical List Page Chart
       * @param {sap.ui.base.Event} oEvent - Event object
       */
        onBeforeRebindChartExtension : function (oEvent) {
              var mBinding = oEvent.getParameter("bindingParams");
             this.setUseCaseID(mBinding);
              var oPriceTrendFilter = this.getPriceTrendFilter();
              mBinding.filters.push(oPriceTrendFilter);
        },

        /**
         * Before Rebind Table extension for Analytical List Page Table
         * @param {sap.ui.base.Event} oEvent - Event object
         */
        onBeforeRebindTableExtension : function (oEvent) {
           var mBinding = oEvent.getParameter("bindingParams");        
           this.setUseCaseID(mBinding);
           var oPriceTrendFilter = this.getPriceTrendFilter();
           mBinding.filters.push(oPriceTrendFilter);
        },
        /**
         * @param {sap.ui.base.Event} oEvent - Event object
         */
        handleContractItemPress: function (oEvent) {
            var oPriceHistoryData = oEvent.getSource().getBindingContext().getObject(),
                sDocType = oPriceHistoryData.PurchaseContractType,
                sCentralPurchaseContract = oPriceHistoryData.FormattedPurchasingDocItem.split("/")[0],
                sCentralPurchaseContractItem = oPriceHistoryData.FormattedPurchasingDocItem.split("/")[1];               
            if (sDocType === Constants.DOC_TYPE.HRMK || sDocType === Constants.DOC_TYPE.HRWK) {
                var sContractHierHeader = this.getView().getModel("MCPC").createKey("C_CntrlPurContrHierHdrTP", {
                    CentralPurchaseContract: sCentralPurchaseContract,
                    DraftUUID: ReuseConstants.INITIAL_GUID,
                    IsActiveEntity: true
                });
                var sContractHierItem = this.getView().getModel("MCPC").createKey("C_CntrlPurContrHierItemTP", {
                    CentralPurchaseContractItem: sCentralPurchaseContractItem,
                    CentralPurchaseContract: sCentralPurchaseContract,
                    DraftUUID: ReuseConstants.INITIAL_GUID,
                    IsActiveEntity: true
                });
                var sContractHierItemPath = sContractHierHeader + "/to_CntrlPurchaseContractItemTP(" + sContractHierItem.split("(")[1];
                NavigationHelper.navigateToExternalApp(this, "MCPC", sContractHierItemPath, null, true);
            } else {
                var sContractHeader = this.getView().getModel("MCPC").createKey("C_CentralPurchaseContractTP", {
                    CentralPurchaseContract: sCentralPurchaseContract,
                    DraftUUID: ReuseConstants.INITIAL_GUID,
                    IsActiveEntity: true
                });
                var sContractItem = this.getView().getModel("MCPC").createKey("C_CntrlPurchaseContractItemTP", {
                    CentralPurchaseContractItem: sCentralPurchaseContractItem,
                    CentralPurchaseContract: sCentralPurchaseContract,
                    DraftUUID: ReuseConstants.INITIAL_GUID,
                    IsActiveEntity: true
                });
                var sContractItemPath = sContractHeader + "/to_CntrlPurchaseContractItemTP(" + sContractItem.split("(")[1];
                NavigationHelper.navigateToExternalApp(this, "MCPC", sContractItemPath, null, true);
            }
        },

        /*
         * Supplier navigation event handler.
         * @param {sap.ui.base.Event} oEvent- event object
         */
        handleSupplierPress: function (oEvent) {
            var oPriceHistoryData = oEvent.getSource().getBindingContext().getObject();
            var sSupplier = oPriceHistoryData.Supplier;
            var oParams = {
                Supplier: sSupplier
            };
            // Navigate to Supplier
            NavigationHelper.navigateToExternalApp(this, "Supplier", null, oParams, true);
        }
    });
});
