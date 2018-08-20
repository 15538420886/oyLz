import React from 'react';
import { browserHistory } from 'react-router'

var IndexPage = React.createClass({
	getInitialState: function () {
		var path = '';
		var loading = false;
		var loc = this.props.location;
		if(loc !== null && typeof(loc) !== 'undefined'){
			path = loc.pathname;
			if(path !== null && typeof(path) !== 'undefined'){
				if(path.startsWith('/resume/') || path.startsWith('/resume2/')){
					loading = true;
					document.location.href='/resume.html';
				}
				else if(path.startsWith('/auth/') || path.startsWith('/auth2/')){
					loading = true;
					document.location.href='/auth.html';
				}
				else if(path.startsWith('/param/') || path.startsWith('/param2/')){
					loading = true;
					document.location.href='/auth.html';
				}
				else if(path.startsWith('/hr/')){
					loading = true;
					document.location.href='/hr.html';
				}
				else if(path.startsWith('/proj/')){
					loading = true;
					document.location.href='/proj.html';
				}
				else if(path.startsWith('/avt/')){
					loading = true;
					document.location.href='/avt.html';
				}
				else if(path.startsWith('/uman/')){
					loading = true;
					document.location.href='/uman.html';
				}
				else if(path.startsWith('/camp/')){
					loading = true;
					document.location.href='/camp.html';
				}
				else if(path.startsWith('/env/')){
					loading = true;
					document.location.href='/env.html';
				}
				else if (path.startsWith('/dev/') || path.startsWith('/dev2/')){
					loading = true;
					document.location.href='/dev.html';
				}
				else if(path.startsWith('/cost/')){
					loading = true;
					document.location.href='/cost.html';
				}
				else if(path.startsWith('/ats/')){
					loading = true;
					document.location.href='/ats.html';
				}
				else if(path.startsWith('/asset/')){
					loading = true;
					document.location.href='/asset.html';
				}
				else if(path.startsWith('/tbug/')){
					loading = true;
					document.location.href='/tbug.html';
				}
				else if(path.startsWith('/tcase/')){
					loading = true;
					document.location.href='/tcase.html';
				}
			}
		}
		
		return {
			loading: loading,
			path: path,
		};
	},

	render: function () {
		if(this.state.loading){
			return (
				<div id="app" style="width:100%; height:100%">
					<div style="padding-top:100px;width:300px;margin:0 auto">正在加载，请等待....</div>
				</div>
			);
		}
		
		return (
			<div>
				<h1>404 - Not Found {this.state.path}</h1>
			</div>
		);
	}
});

module.exports = IndexPage;
