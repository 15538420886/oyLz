import React from 'react';
import TopBar from '../lib/Components/TopBar';


var MainLayout = React.createClass({
	getInitialState : function() {
		return {
	      navItems: [
	          {
				name: '工作台',
				to: '/main/DeskPage/',
				icon: 'home'
	          },
	          {
	            name: '应用',
	            to: '/main/AppsPage/',
				icon: 'appstore-o'
	          },
	      ]
	    }
	},

	render : function() {
        return <TopBar navItems={this.state.navItems} activeNode="/main/DeskPage/" offsetLeft='300px' children={this.props.children}/>
	}
});

module.exports = MainLayout;


