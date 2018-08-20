import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
  children: React.PropTypes.node
};

var ParamMenuIndex = React.createClass({
  getInitialState : function() {
      return {
            navItems: [
              {
                name: '缺陷列表',
                to: '/tbug/components/tbugPage/'
              }
            ]
      }
  },

  render : function() {
    return (
        <LeftMenu navItems={this.state.navItems} activeNode="/tbug/components/tbugPage/" children={this.props.children}/>
    );
  }
});

ParamMenuIndex.propTypes = propTypes;
module.exports = ParamMenuIndex;


