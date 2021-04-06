sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("com.ingles.retail_pricing.ad_group.AD_Group.controller.NotFound", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
		}
	});	
});