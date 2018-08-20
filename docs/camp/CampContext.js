'use strict';
import { browserHistory } from 'react-router'

module.exports = {
	runMode: 'conf',
	selectedCampus: null,
	selectedBuild: null,
	selectedRoom: null,

    openBuildPage: function(campus, mode, e)
    {
    	if(campus !== null){
    		this.runMode = mode;
			this.selectedCampus = campus;
			browserHistory.push({
				pathname: '/camp/BuildPage/',
				state: { fromDashboard: true }
			});
    	}
    },
	goBackCampus: function(e){
		var url = '/camp/CampusPage/';
		if( this.runMode === 'test' ){
			url = '/camp/CampusTestPage/';
		}
		else if( this.runMode === 'stat' ){
			url = '/camp/CampusStatPage/';
		}

	  	browserHistory.push({
	  		pathname: url,
	  		state: {fromDashboard: true}
	  	});
	},

    openRoomPage: function(build, e)
    {
    	if(build !== null){
			this.selectedBuild = build;
			browserHistory.push({
				pathname: '/camp/RoomPage/',
				state: { fromDashboard: true }
			});
    	}
    },
	goBackBuild: function(e){
	  	browserHistory.push({
	  		pathname: '/camp/BuildPage/',
	  		state: {fromDashboard: true}
	  	});
	},

	openSeatPage: function(room, e)
    {
    	if(room !== null){
			var url = '/camp/SeatPage/';
			if( this.runMode === 'test' ){
				url = '/camp/SeatTestPage/';
			}
			else if( this.runMode === 'stat' ){
				url = '/camp/SeatStatPage/';
			}
    		
			this.selectedRoom = room;
			browserHistory.push({
				pathname: url,
				state: { fromDashboard: true }
			});
    	}
    },
	goBackRoom: function(e){
	  	browserHistory.push({
	  		pathname: '/camp/RoomPage/',
	  		state: {fromDashboard: true}
	  	});
	},
};
