
var corpStruct = '园区';	// 园区，多公司，单公司
var serviceIP = 'http://127.0.0.1:8360/';
var utilConf = {
	checkRole: false,	// 检查权限
	localDict: false,
	dbUrl: '',
	authUrl: serviceIP+'auth_s/',
	paramUrl: serviceIP+'param_s/',
	campUrl: serviceIP+'camp_s/',
	devUrl: serviceIP+'dev_s/',
	resumeUrl: serviceIP+'resume2_s/',
	hrUrl: serviceIP+'hr_s/',
	projUrl: serviceIP+'proj_s/',
	costUrl: serviceIP+'cost_s/',
	flowUrl: serviceIP+'flow_s/',
	atsUrl: serviceIP+'ats_s/',
	assetUrl: serviceIP+'asset_s/',
	tbugUrl: serviceIP+'tbug_s/',
	tcaseUrl: serviceIP+'tcase_s/'

};

var commonConf = {
    // 公共变量
    resMode: false,
    
    corpStruct: corpStruct,
    campusUuid: 'nan',
    campusName: '无',
    corpUuid: '113K11A4B8R3L003',
    corpName: '无锡公司',
    
    // 公共变量
    authHome: (corpStruct === '园区') ? '/auth/CampusPage/' : ((corpStruct === '多公司') ? '/auth/CorpPage/' : '/auth/SysUserPage/'),
    hrHome: '/hr/CorpStaffPage/',
    resumeHome: '/resume/QueryPage/',
    avtHome: '/avt/hr/PersonInfoPage/',
    uManHome: '/uman/DeptPage/',
    campHome: '/camp/CampusPage/',
    envHome: '/env/EnvHostPage/',
    devHome: '/dev/AppPage/',
    projHome: '/proj/proj/ProjPage/',
    costHome: '/cost/param/HotelPage/',
    atsHome: '/ats/RecruitPage/',
    assetHome: '/asset/AssetQueryPage/',
    tbugHome:'/tbug/Components/TbugPage/',
    tcaseHome:'/tcase/resume/UsecaseListPage/',

    iconAdd: 'plus',
    iconRefresh: 'sync',
    iconBack: 'rollback',
    iconUpdate: 'edit',
    iconRemove: 'delete',
    iconUser: 'user',
    iconAddChild: 'folder-add',
    iconDetail: 'bars',

    tableBorder: false,
    tableHeight: '510px',
    searchWidth: '180px',

    // 日期格式
    dateFormat: 'YYYY-MM-DD',
    monthFormat: 'YYYY-MM',

	// 标题
	removeTitle: '删除确认',
	removeOkText: '确定',
	removeCancelText: '取消',
};
