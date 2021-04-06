sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox",
	"sap/base/util/UriParameters",
	"sap/m/Token",
	"com/ingles/retail_pricing/ad_group/AD_Group/controller/ValueHelper"
], function (JSONModel, Controller, Filter, FilterOperator, Sorter, MessageBox, UriParameters,Token, ValueHelper) {
	"use strict";

	return Controller.extend("com.ingles.retail_pricing.ad_group.AD_Group.controller.Master", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this._bDescendingSort = false;
			this.oRouter.getRoute("notFound").attachPatternMatched(this._getQuery, this);
			this._vendorValueHelp = new ValueHelper(this, 'VENDOR');
			
			
		},
		_getQuery: function (oEvent) {
			
			var oHashChanger = new sap.ui.core.routing.HashChanger();
			var query = oHashChanger.getHash();
			var value = this.getAllUrlParams(query);
			this._oMultiInput = this.getView().byId("VendorInput");
			this._oMultiInput.setTokens(this._getDefaultTokens());
			if (value.pricestrategy !== undefined) {
				this.getOwnerComponent().getModel("query").setProperty("/PriceStrategy", decodeURIComponent(value.pricestrategy));
				this.getOwnerComponent().getModel("query").setProperty("/PriceType", decodeURIComponent(value.pricetype));
			}

		},
		_getDefaultTokens: function () {
			//var ValueHelpRangeOperation = compLibrary.valuehelpdialog.ValueHelpRangeOperation;
			var oToken1 = new Token({
				key: "DC10",
				text: "DC10"
			});
			return [oToken1];
		},
		
		tokenUpdate: function (oEvent, oPath) {
			var sType = oEvent.getParameter("type"),
				aAddedTokens = oEvent.getParameter("addedTokens"),
				aRemovedTokens = oEvent.getParameter("removedTokens"),
				oModel = this.getView().getModel("appControl"),
				aContexts = oModel.getProperty(oPath);

			switch (sType) {
				// add new context to the data of the model, when new token is being added
			case "added":
				aAddedTokens.forEach(function (oToken) {
					aContexts.push({
						key: oToken.getKey(),
						text: oToken.getKey()
					});
				});
				break;
				// remove contexts from the data of the model, when tokens are being removed
			case "removed":
				aRemovedTokens.forEach(function (oToken) {
					aContexts = aContexts.filter(function (oContext) {
						return oContext.key !== oToken.getKey();
					});
				});
				break;
			default:
				break;
			}

			oModel.setProperty(oPath, aContexts);

		},
		
		onVendorValueHelp: function (oEvent) {
			this._vendorValueHelp.openValueHelp(oEvent);
		},		
		
		onListItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
				productPath = oEvent.getSource().getBindingContext("products").getPath(),
				product = productPath.split("/").slice(-1).pop();
			
			this.oRouter.navTo("detail", {
				layout: oNextUIState.layout,
				product: product
			},true);
		},
		onSearch: function (oEvent) {
			if (this.getOwnerComponent().getModel("query").getProperty("/PriceStrategy") !== "") {

				this.getOwnerComponent().getModel("query").setProperty("/PriceStrategy", this.getView().byId("Strategy").getSelectedItem().getText());
				this.getOwnerComponent().getModel("query").setProperty("/PriceType", this.getView().byId("Type").getSelectedItem().getText());
			}
			
			this.oRouter.navTo("detail", {
				layout: "MidColumnFullScreen",
				product: "95"
			},true);
		},

		onAdd: function (oEvent) {
			MessageBox.show("This functionality is not ready yet.", {
				icon: MessageBox.Icon.INFORMATION,
				title: "Aw, Snap!",
				actions: [MessageBox.Action.OK]
			});
		},

		onSort: function (oEvent) {
			this._bDescendingSort = !this._bDescendingSort;
			var oView = this.getView(),
				oTable = oView.byId("productsTable"),
				oBinding = oTable.getBinding("items"),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},
		getAllUrlParams: function (url) {

			// get query string from url (optional) or window
			var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

			// we'll store the parameters here
			var obj = {};

			// if query string exists
			if (queryString) {

				// stuff after # is not part of query string, so get rid of it
				queryString = queryString.split('#')[0];

				// split our query string into its component parts
				var arr = queryString.split('&');

				for (var i = 0; i < arr.length; i++) {
					// separate the keys and the values
					var a = arr[i].split('=');

					// set parameter name and value (use 'true' if empty)
					var paramName = a[0];
					var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

					// (optional) keep case consistent
					paramName = paramName.toLowerCase();
					if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

					// if the paramName ends with square brackets, e.g. colors[] or colors[2]
					if (paramName.match(/\[(\d+)?\]$/)) {

						// create key if it doesn't exist
						var key = paramName.replace(/\[(\d+)?\]/, '');
						if (!obj[key]) obj[key] = [];

						// if it's an indexed array e.g. colors[2]
						if (paramName.match(/\[\d+\]$/)) {
							// get the index value and add the entry at the appropriate position
							var index = /\[(\d+)\]/.exec(paramName)[1];
							obj[key][index] = paramValue;
						} else {
							// otherwise add the value to the end of the array
							obj[key].push(paramValue);
						}
					} else {
						// we're dealing with a string
						if (!obj[paramName]) {
							// if it doesn't exist, create property
							obj[paramName] = paramValue;
						} else if (obj[paramName] && typeof obj[paramName] === 'string') {
							// if property does exist and it's a string, convert it to an array
							obj[paramName] = [obj[paramName]];
							obj[paramName].push(paramValue);
						} else {
							// otherwise add the property
							obj[paramName].push(paramValue);
						}
					}
				}
			}

			return obj;
		}

	});
});