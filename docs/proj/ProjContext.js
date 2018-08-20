'use strict';
import { browserHistory } from 'react-router'
var Common = require('../public/script/common');

module.exports = {
    selectedGroup: null,	// 项目群
	selectedProj: null,	    // 项目组
	selectedPool: null,	    // 资源池
	selectedBiziProj: null,	// 事务项目
    selectedOutCorp: null,	// 外协
    
	selectedDispProj: null,	// 选择人员派遣的s项目

    // 返回的地址
    goBackUrl: null,
    //更改前的地址
    lastUrl: null,

    openProjGroupPage: function (group, e) {
        if (group !== null) {
            this.goBackUrl = '/proj/group/ProjGroupPage/';
            this.selectedGroup = group;
            browserHistory.push({
                pathname: '/proj/group/ProjPage/',
                state: { fromDashboard: true }
            });
        }
    },
    goBackProjGroupMain: function (e) {
        this.selectedBiziProj = null;
        if (this.goBackUrl === null) {
            this.goBackUrl = '/proj/group/ProjGroupPage/';
        }

        var url = this.goBackUrl;
        this.goBackUrl = null;

        this.selectedProj = null;
        this.selectedGroup = null;
        browserHistory.push({
            pathname: url,
            state: { fromDashboard: true }
        });
    },

    openProjPage: function(proj, e)
    {
        if (proj !== null) {
            this.goBackUrl = '/proj/proj/ProjPage/';
			this.selectedProj = proj;
			browserHistory.push({
				pathname: '/proj/proj2/ProjMemberPage/',
				state: { fromDashboard: true }
			});
    	}
    },
    goBackProjMain: function (e) {
        this.selectedBiziProj = null;
        if (this.goBackUrl === null) {
            this.goBackUrl = '/proj/proj/ProjPage/';
        }

        var url = this.goBackUrl;
        this.goBackUrl = null;

		this.selectedProj = null;
	  	browserHistory.push({
            pathname: url,
	  		state: {fromDashboard: true}
	  	});
	},

    openResPage: function(res, e)
    {
        if (res !== null) {
            this.goBackUrl = '/proj/proj/ProjPage/';
			this.selectedPool = res;
			browserHistory.push({
				pathname: '/proj/res2/ResMemberPage/',
				state: { fromDashboard: true }
			});
    	}
    },
    goBackResMain: function (e) {
        this.selectedBiziProj = null;
        if (this.goBackUrl === null) {
            this.goBackUrl = '/proj/res/PoolPage/';
        }

        var url = this.goBackUrl;
        this.goBackUrl = null;

		this.selectedPool = null;
	  	browserHistory.push({
            pathname: url,
	  		state: {fromDashboard: true}
	  	});
	},

    openGroupPage: function(group, e)
    {
        if (group !== null) {
            this.goBackUrl = '/proj/proj/ProjPage/';
			this.selectedGroup = group;
			browserHistory.push({
				pathname: '/proj/group/ProjPage/',
				state: { fromDashboard: true }
			});
    	}
    },
    goBackGroupMain: function (e) {
        this.selectedGroup = null;
        if (this.goBackUrl === null) {
            this.goBackUrl = '/proj/group/ProjGroupPage/';
        }

        var url = this.goBackUrl;
        this.goBackUrl = null;

		this.selectedGroup = null;
	  	browserHistory.push({
            pathname: url,
	  		state: {fromDashboard: true}
	  	});
	},

    openOutCorpPage: function(corp, e)
    {
        if (corp !== null) {
            this.goBackUrl = '/proj/out/CorpPage/';
			this.selectedOutCorp = corp;
			browserHistory.push({
				pathname: '/proj/out2/StaffPage/',
				state: { fromDashboard: true }
			});
    	}
    },
    goBackOutMain: function (e) {
        this.selectedBiziProj = null;
        if (this.goBackUrl === null) {
            this.goBackUrl = '/proj/out/CorpPage/';
        }

        var url = this.goBackUrl;
        this.goBackUrl = null;

		this.selectedOutCorp = null;
	  	browserHistory.push({
            pathname: url,
	  		state: {fromDashboard: true}
	  	});
	},

    openBiziProjPage: function(proj, e)
    {
        if (proj !== null) {
            this.goBackUrl = '/proj/proj/ProjPage/';
			this.selectedBiziProj = proj;
			browserHistory.push({
				pathname: '/proj/bizi2/BiziMemberPage/',
				state: { fromDashboard: true }
			});
    	}
    },
	goBackBiziProjMain: function(e){
        this.selectedBiziProj = null;
        if (this.goBackUrl === null) {
            this.goBackUrl = '/proj/bizi/BiziProjPage/';
        }

        var url = this.goBackUrl;
        this.goBackUrl = null;

	  	browserHistory.push({
            pathname: url,
	  		state: {fromDashboard: true}
	  	});
	},

    openGroupResPage: function (proj, e) {
        if (proj !== null) {
            this.goBackUrl = '/proj/group/PoolPage/';
            this.selectedPool = proj;
            browserHistory.push({
                pathname: '/proj/res2/ResMemberPage/',
                state: { fromDashboard: true }
            });
        }
    },

    openGroupProjPage: function (proj, e) {
        if (proj !== null) {
            this.lastUrl = this.goBackUrl;
            this.goBackUrl = '/proj/group/ProjPage/';
            this.selectedProj = proj;
            browserHistory.push({
                pathname: '/proj/proj2/ProjMemberPage/',
                state: { fromDashboard: true }
            });
        }
    },

    openGroupBiziProjPage: function (proj, e) {
        if (proj !== null) {
            this.goBackUrl = '/proj/group/BiziProjPage/';
            this.selectedBiziProj = proj;
            browserHistory.push({
                pathname: '/proj/bizi2/BiziMemberPage/',
                state: { fromDashboard: true }
            });
        }
    },

    openInitProjPage: function (proj, e) {
        if (proj !== null) {
            this.goBackUrl = '/proj/proj2/ProjQueryPage/';
            this.selectedProj = proj;
            browserHistory.push({
                pathname: '/proj/proj2/BatchInputPage/',
                state: { fromDashboard: true }
            });
        }
    },

    // 考勤
    openResChkPage: function (res, e) {
        if (res !== null) {
            this.goBackUrl = '/proj/proj/ChkProjPage/';
            this.selectedPool = res;
            browserHistory.push({
                pathname: '/proj/res2/UserCheckPage/',
                state: { fromDashboard: true }
            });
        }
    },
    openGroupChkPage: function (group, e) {
        if (group !== null) {
            this.goBackUrl = '/proj/proj/ChkProjPage/';
            this.selectedGroup = group;
            browserHistory.push({
                pathname: '/proj/group/GroupCheckPage/',
                state: { fromDashboard: true }
            });
        }
    },
    openProjChkPage: function (proj, e) {
        if (proj !== null) {
            this.goBackUrl = '/proj/proj/ChkProjPage/';
            this.selectedProj = proj;
            browserHistory.push({
                pathname: '/proj/proj2/UserCheckPage/',
                state: { fromDashboard: true }
            });
        }
    },
    openBiziProjChkPage: function (proj, e) {
        if (proj !== null) {
            this.goBackUrl = '/proj/proj/ChkProjPage/';
            this.selectedBiziProj = proj;
            browserHistory.push({
                pathname: '/proj/bizi2/UserCheckPage/',
                state: { fromDashboard: true }
            });
        }
    },

    // 根据入职日期和工作年限，计算开始工作月份
    calcBeginMonth: function (entryDate, years) {
        if (!entryDate || !years) {
            var m = Math.floor(Common.getToday() / 100);
            return '' + m;
        }

        var beginYear = 0;
        var beginMonth = 0;
        var entryDateYear = Math.floor(entryDate / 10000);
        var entryDateMonth = Math.floor((entryDate % 10000) / 100);
        var timeArr = years ? years.split('.') : [];
        var years = timeArr[0] ? timeArr[0] : 0;
        var months = timeArr[1] ? timeArr[1] : 0;

        beginYear = entryDateYear - years;
        if (entryDateMonth - months > 0) {
            var m = entryDateMonth - months;
            beginMonth = m > 9 ? ''+m : '0'+m;
        } else {
            --beginYear;
            var m = 12 + entryDateMonth - months;
            beginMonth = m > 9 ? '' + m : '0' + m;
        }

        if (beginMonth === '' || beginMonth === undefined) {
            beginMonth = '00';
        }

        return beginYear + beginMonth;
    },
    getWorkYears: function (begin) {
        var today = Common.getToday();
        if (!begin || begin == Math.floor(today / 100)) {
            return { year: '00', month: '00' };
        }
        var year = 0;
        var month = 0;
        var beginYear = Math.floor(begin / 100);
        var beginMonth = begin % 100;
        var todayYear = Math.floor(today / 10000);
        var todayMonth = Math.floor((today % 10000) / 100);
        year = todayYear - beginYear;
        if (todayMonth - beginMonth > 0) {
            month = todayMonth - beginMonth;
        } else {
            --year;
            month = 12 + todayMonth - beginMonth;
        }
        year = year > 9 ? year : '0' + year;
        month = month > 9 ? month : '0' + month;
        return { year: year, month: month };
    },
    // 表单中显示的数据，两个域
    getDisplayWorkYears: function (begin) {
        var today = Common.getToday();
        if (!begin || begin == Math.floor(today / 100)) {
            return { year: '', month: '' };
        }
        var year = 0;
        var month = 0;
        var beginYear = Math.floor(begin / 100);
        var beginMonth = begin % 100;
        var todayYear = Math.floor(today / 10000);
        var todayMonth = Math.floor((today % 10000) / 100);
        year = todayYear - beginYear;
        if (todayMonth - beginMonth > 0) {
            month = todayMonth - beginMonth;
        } else {
            --year;
            month = 12 + todayMonth - beginMonth;
        }

        year = (year === 0) ? '' : '' + year;
        month = (month === 0) ? '' : '' + month;
        return { y: year, m: month };
    },
    // table中显示的数据
    getColumnWorkYears: function (begin) {
        var today = Common.getToday();
        if (!begin || begin == Math.floor(today / 100)) {
            return '无';
        }
        var year = 0;
        var month = 0;
        var beginYear = Math.floor(begin / 100);
        var beginMonth = begin % 100;
        var todayYear = Math.floor(today / 10000);
        var todayMonth = Math.floor((today % 10000) / 100);
        year = todayYear - beginYear;
        if (todayMonth - beginMonth > 0) {
            month = todayMonth - beginMonth;
        } else {
            --year;
            month = 12 + todayMonth - beginMonth;
        }

        if (month === 0) {
            if (year === 0) {
                return '无';
            }
            else {
                return '' + year + '年';
            }
        }

        return '' + year + '年' + month + '月';
    },


    // 计算考勤数据
    // chkData 保存考勤数据, oldPosSet 考勤签到数据, leaveSet 休假数据, isCreate 创建/修改
    calcCheckDate: function (chkData, oldPosSet, leaveSet, isCreate) {
        // 计算 休假类型
        // 计算 休假时间
        var leaveFrom = 0;
        var leaveTo = 0;
        var leaveHour = 0;
        if (leaveSet !== undefined && leaveSet !== null && leaveSet.length > 0) {
            var leave = leaveSet[0];
            leaveFrom = leave.beginHour;
            leaveTo = leave.endHour;

            if (leave.beginDate !== chkData.chkDate) {
                leaveFrom = 9;
            }

            if (leave.endDate !== chkData.chkDate) {
                leaveTo = 18;
            }

            if (leaveFrom < 9) {
                leaveFrom = 9;
            }

            if (leaveTo > 18) {
                leaveTo = 18;
            }

            leaveHour = leaveTo - leaveFrom;
            if (leaveFrom <= 12 && leaveTo > 12) {
                leaveHour = leaveHour - 1;
            }

            chkData.leaveType = leave.leaveType;
            chkData.leaveHour = '' + leaveHour;
        }

        var posSet = [];
        var checkHour = '';
        var checkLogger = '';
        var checkFrom = -1;
        var checkTo = -1;
        var checkFrom2 = 0;
        var checkTo2 = 0;
        if (oldPosSet !== undefined && oldPosSet !== null && oldPosSet.length > 0) {
            var len = oldPosSet.length;
            for (var i = 0; i < len; i++) {
                var pos = oldPosSet[i];
                if (pos.posType !== 'booking' && pos.posType !== 'free') {
                    posSet.push(pos);
                }
            }

            // 排序
            Common.sortTable(posSet, 'posTime', false);

            len = posSet.length;
            for (var i = 0; i < len; i++) {
                var pos = posSet[i];
                checkLogger = checkLogger + pos.posType + ': ' + pos.posTime + ';    ';
            }

            // 计算 签到时长
            if (len > 1) {
                var c1 = posSet[0];
                var c2 = posSet[len - 1];
                checkFrom = parseInt(c1.posTime.substr(0, 2));
                checkTo = parseInt(c2.posTime.substr(0, 2));
                checkFrom2 = parseInt(c1.posTime.substr(3, 2));
                checkTo2 = parseInt(c2.posTime.substr(3, 2));

                checkHour = checkTo - checkFrom;
                if (checkFrom <= 12 && checkTo > 12) {
                    checkHour = checkHour - 1;
                }

                if (checkFrom <= 18 && checkTo > 19) {
                    checkHour = checkHour - 1;
                }

                var checkMinute = checkTo2 - checkFrom2;
                if (checkMinute < 0) {
                    checkHour = checkHour - 1;
                    checkMinute = 60 + checkMinute;
                }

                checkHour = '' + checkHour + ':' + checkMinute;

                chkData.checkIn = c1.posTime;
                chkData.checkOut = c2.posTime;
            }
            else if (len === 1) {
                chkData.checkIn = posSet[0].posTime;
            }
        }

        chkData.checkHour = checkHour;
        chkData.checkLogger = checkLogger;

        // 计算 工时 = 缺省值：8 - 休假时间
        if (leaveHour < 8 && isCreate) {
            this.calcWorkHour(chkData, checkFrom, checkFrom2, checkTo, checkTo2, leaveFrom, leaveTo);
        }
    },
    
    // 计算 工时 = 缺省值：8 - 休假时间
    // checkFrom，checkTo 签到时；checkFrom2，checkTo2 签到分；leaveFrom,leaveTo 休假数据； from,to 项目组考勤时间段
    calcWorkHour: function (chkData, checkFrom, checkFrom2, checkTo, checkTo2, leaveFrom, leaveTo) {
        chkData.workHour = '0';
        if (checkFrom < 0 || checkTo < 0) {
            // 没有考勤数据
            return;
        }

        console.log('chkData', chkData)
        var from = parseInt(chkData.fromHour.substr(0, 2));
        var to = parseInt(chkData.toHour.substr(0, 2));
        var from2 = parseInt(chkData.fromHour.substr(3, 2));
        var to2 = parseInt(chkData.toHour.substr(3, 2));
        
        // console.log('calcWorkHour', checkFrom, checkTo, leaveFrom, leaveTo, from, to);
        if (from <= 9 && to >= 18) {
            // 工作日，全天考勤
            if (chkData.dateType === '0') {
                var h = parseInt(chkData.leaveHour);
                chkData.workHour = '' + (8 - h);
                return;
            }
        }

        // 签到时间
        if (chkData.dateType === '0') {
            if (checkFrom < from || from >= 9) {
                checkFrom = from;
                checkFrom2 = from2;
            }

            if (checkTo > to || to <= 18) {
                checkTo = to;
                checkTo2 = to2;
            }
        }
        else {
            // 加班，按实际时间计算
            if (checkFrom < from || (checkFrom === from && checkFrom2 < from2)) {
                checkFrom = from;
                checkFrom2 = from2;
            }

            if (checkTo > to || (checkTo === to && checkTo2 > to2)) {
                checkTo = to;
                checkTo2 = to2;
            }
        }

        var checkHour = checkTo - checkFrom;
        if (checkFrom <= 12 && checkTo > 12) {
            checkHour = checkHour - 1;
        }

        if (checkFrom <= 18 && checkTo > 19) {
            checkHour = checkHour - 1;
        }

        // 分钟
        var checkMinute = checkTo2 - checkFrom2;
        if (checkMinute < -20) {
            checkHour = checkHour - 1;
        }
        else if (checkMinute > 40) {
            checkHour = checkHour + 1;
        }

        // 周日，节假日
        if (chkData.dateType !== '0') {
            chkData.overHour = '' + checkHour;
            return;
        }

        if (leaveFrom === 0 || leaveTo === 0) {
            // 无休假
            chkData.workHour = '' + checkHour;
            return;
        }

        // 休假时间
        if (leaveFrom < from) {
            leaveFrom = from;
        }

        if (leaveTo > to) {
            leaveTo = to;
        }

        var leaveHour = leaveTo - leaveFrom;
        if (leaveFrom <= 12 && leaveTo > 12) {
            leaveHour = leaveHour - 1;
        }

        chkData.workHour = '' + (checkHour - leaveHour);
    },
};
