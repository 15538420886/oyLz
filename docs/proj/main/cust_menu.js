import React from 'react';
import LeftMenu from '../../lib/Components/LeftMenu';

const propTypes = {
    children: React.PropTypes.node
};

var CustPageIndex = React.createClass({
    getInitialState: function () {
        return {
            navItems: [
                {
                    name: '客户管理',
                    to: '/proj/cust/CustPage/'
                },
                {
                    name: '合同管理',
                    icon: 'home',
                    to: 'man_cust',
                    childItems: [
                        {
                            name: '合同管理',
                            to: '/proj/cust/ContractPage/'
                        },
                        {
                            name: '订单管理',
                            to: '/proj/cust/ProjOrderPage/'
                        },
                        {
                            name: '合同事件',
                            to: '/proj/cust/EventPage/'
                        },
                    ]
                },
                {
                    name: '外协公司',
                    icon: 'home',
                    to: 'man_out',
                    childItems: [
                        {
                            name: '公司管理',
                            to: '/proj/out/CorpPage/'
                        },
                        {
                            name: '人员查询',
                            to: '/proj/out/StaffQueryPage/'
                        },
                    ]
                },
            ]
        }
    },

    render: function () {
        var pathname = this.props.location.pathname;
        if (pathname === undefined || pathname === null || pathname === '') {
            pathname = "/proj/cust/CustPage/";
        }

        return (
            <LeftMenu navItems={this.state.navItems} activeNode={pathname} children={this.props.children} />
        );
    }
});

CustPageIndex.propTypes = propTypes;
module.exports = CustPageIndex;
