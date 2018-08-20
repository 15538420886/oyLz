import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var AtsPageIndex = React.createClass({
  getInitialState : function() {
      return {
	      navItems: [
          {
            name: '标准岗位',
            to: '/ats/StdJobPage/'
          },
          {
            name: '人力专员',
            to: '/ats/HrPersonPage/'
          },
          {
            name: '面试题库',
            to: '/ats/TestQuestPage/'
          },
          {
            name: '报到地址',
            to: '/ats/EntryLocPage/'
           }
	      ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/ats/StdJobPage/" children={this.props.children}/>
    );
  }
});

AtsPageIndex.propTypes = propTypes;
module.exports = AtsPageIndex;


