'use strict';
import { browserHistory } from 'react-router'

module.exports = {
	paramApp: {},
	envApp:{},

	createContext: function(appName){
		this.paramApp = {
			uuid: appName,
			appName: appName,
			appCode: appName
		};
	}
};
