import ApplicationFacade from 'complay/lib/application-facade';
import ApplicationDomComponent from 'complay/lib/application-dom-component';

// services
import Votes from './services/votes';
// modules
import VoteFormVotesMediator from './modules/vote-form-votes-mediator'
// components
import BarChart from './components/bar-chart';
import VoteForm from './components/vote-form';

let app = new ApplicationFacade({
	observe: true,
	AppComponent: ApplicationDomComponent
});

app.immediate(() => {
	console.log('immediate');

	app.start({
		service: Votes,
		options: {
			appName: 'votes',
			data: window.votes
		}
	});
}).onDomReady(() => {
	console.log('onDomReady');

	app.start({
		component: VoteForm,
		options: {
			appName: 'voteForm',
			autostart: true
		}
	});
	
	app.start({
		component: BarChart,
		options: {
			appName: 'barChart',
			service: app.votes
		}
	});


	app.start({
		module: VoteFormVotesMediator,
		options: {
			votes: app.votes,
			voteViewStorages: app.voteViewStorages,
			voteForm: app.voteForm,
			barChart: app.barChart
		}
	});
}).onWindowLoaded(() => {
	console.log('onWindowLoaded', app);
});