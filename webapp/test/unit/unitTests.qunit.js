/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"Ingles/Mock/AD_Group/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});