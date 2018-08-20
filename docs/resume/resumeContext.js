'use strict';
import { browserHistory } from 'react-router'

module.exports = {
	resumeApp: {},
	envApp:{},

	createContext: function(appName){
		this.resumeApp = {
			uuid: appName,
			appName: appName,
			appCode: appName
		};
	}
};
