sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("ovly.odatawrite.controller.Main", {

            oList: null,
            oPageDetail: null,

			onInit: function () {
                this.oList = this.byId("list");
                this.oPageDetail = this.byId("page-detail");
            },


            onItemPress: function(oEvent){
                var oSource = oEvent.getSource();
                var oParameters = oEvent.getParameters();
                var oListItem = oParameters.listItem;
                var oContext = oListItem.getBindingContext();

                this.byId("header").setBindingContext(oContext);
                this.oPageDetail.setBindingContext(oContext);
            },

            onLiveChange: function(oEvent){
                
                var aFilter = [];
                var sNewValue = oEvent.getParameters().newValue;
                if(sNewValue){
                    aFilter.push(
                        new sap.ui.model.Filter({
                            path: "Name",
                            operator: sap.ui.model.FilterOperator.Contains,
                            value1: sNewValue
                        })
                    );
                }

                var oBinding = this.oList.getBinding("items"); // sap.ui.model.odata.v2.ODataListBinding

                oBinding.filter(aFilter);
            },

            onSubmitReview: function(oEvent) {
                var oDataModel = this.getOwnerComponent().getModel();
                // window.oDataModel = oDataModel;

                var oContext = this.oPageDetail.getBindingContext();
                var sProductId = oContext.getObject().Id;
                // var sProductId = oContext.getProperty("Id");
                var oReview = {};
                oReview.ProductId = sProductId;
                oReview.Rating = this.byId("rating").getValue();
                oReview.Comment = this.byId("comment").getValue();

                oEvent.getSource().setBusy(true);

                var that = this;
                // var oButton = oEvent.getSource();
                var mParameters = {
                    success: function (oData, response) {
                        sap.m.MessageToast.show("sucesso");
                        this.setBusy(false);
                    }.bind(oEvent.getSource()),
                    error: function (oData, response) {
                        sap.m.MessageToast.show("error");
                        that.getSource().setBusy(false);
                        // oButton.setBusy(false);
                    }
                };
                oDataModel.create("/Reviews", oReview, mParameters)

            }

		});
	});
