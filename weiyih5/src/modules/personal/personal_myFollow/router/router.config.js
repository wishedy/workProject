import followCase from '../components/FollowCase.vue';
import followTopic from '../components/FollowTopic.vue';
import followTag from '../components/FollowTag.vue';
export default[
	{
		path:'/',
		redirect:'/followCase'
	},
	{
		path:"/followCase",
		component:followCase,
		name:"followCase",
		meta:{
			// keepAlive:true
		}
	},
	{
		path:"/followTopic",
		component:followTopic,
		name:'followTopic',
		meta:{
			// keepAlive:false
		}
	},
	{
		path:"/followTag",
		name:"followTag",
		component:followTag,
		meta:{
			// keepAlive:false
		}
	}
]