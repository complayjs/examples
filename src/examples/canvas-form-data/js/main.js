import {ApplicationFacade} from '../../../complay/js/complay';
import ApplicationDomComponent from '../../../complay/js/lib/application-dom-component';
// services
import Votes from './services/votes';
// modules

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
		module: Votes,
		options: {
			appName: 'votes',
			data: window.votes
		}
	});
}).onDomReady(() => {
	console.log('onDomReady');

	app.start({
		module: BarChart,
		options: {
			autostart: true
		}
	});
	app.start({
		module: VoteForm,
		options: {
			appName: 'voteForm',
			autostart: true
		}
	});
}).onWindowLoaded(() => {
	console.log('onWindowLoaded');
});