import PerIntro from './perIntro/PerIntroPage';

module.exports = {
	path: '/resume2/',
	indexRoute: {component: PerIntro},
    childRoutes: [
		{
	      path: 'PreviewPage/',
	      component: require('./preview/PreviewPage')
	    },
	    {
	      path: 'ResumePage/',
	      component: require('./resume/ResumePage')
	    },
		{
		  path: 'PerIntro/',
		  component: require('./perIntro/PerIntroPage')
		},
		{
	      path: 'PerAss/',
	      component: require('./perAss/PerAssPage')
	    },
		{
		  path: 'ContactInfor/',
		  component: require('./contactInfor/ContactInforPage')
		},
		{
		  path: 'identityInfor/',
		  component: require('./identityInfor/IdentityInforPage')
		},
		{
		  path: 'otherInfor/',
		  component: require('./otherInfor/OtherInforPage')
		},
		{
		  path: 'education/',
		  component: require('./eduBackground/EduBackgroundage')
		},
		{
		  path: 'eduHonor/',
		  component: require('./eduHonor/EduHonorPage')
		},
		{
		  path: 'schHonor/',
		  component: require('./schHonor/schHonorPage')
		},
		{
		  path: 'schPrac/',
		  component: require('./schPrac/SchPracPage')
		},
		{
		  path: 'peComp/',
		  component: require('./peComp/PeCompPage')
		},
		{
		  path: 'peProj/',
		  component: require('./peProj/PeProjPage')
		},
		{
		  path: 'workHonor/',
		  component: require('./workHonor/WorkHonorPage')
		},
		{
		  path: 'train/',
		  component: require('./train/TrainPage')
		},
		{
		  path: 'cert/',
		  component: require('./cert/CertPage')
		},
		{
		  path: 'techSkill/',
		  component: require('./techSkill/TechSkillPage')
		},
		{
		  path: 'biziSkill/',
		  component: require('./biziSkill/BiziSkillPage')
		},
		{
		  path: 'projSkill/',
		  component: require('./projSkill/ProjSkillPage')
		},
		{
		  path: 'lang/',
		  component: require('./lang/LangPage')
		},
		{
		  path: 'otherSkill/',
		  component: require('./otherSkill/OtherSkillPage')
		},
		{
		  path: 'wsProj/',
		  component: require('./wsProj/WsProjPage')
		},
		{
		  path: 'wsThesis/',
		  component: require('./wsThesis/WsThesisPage')
		},
		{
		  path: 'wsIssue/',
		  component: require('./wsIssue/WsIssuePage')
		},
		{
		  path: 'family/',
		  component: require('./family/FamilyPage')
		},
		{
		  path: 'social/',
		  component: require('./social/SocialPage')
		},
		{
		  path: 'soHonor/',
		  component: require('./soHonor/SoHonorPage')
		},
		{
		  path: 'benefit/',
		  component: require('./benefit/BenefitPage')
		},
		{
		  path: 'emerg/',
		  component: require('./emerg/EmergPage')
		},
	]
}
