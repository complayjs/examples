import {ApplicationFacade} from '../../../complay/js/complay';
import Votes from './services/votes';

let app = new ApplicationFacade({
	observe: true
});

app.immediate(() => {
	console.log('immediate');
	app.start({module: Votes, options: {appName: 'votes', data: window.votes}});
}).onDomReady(() => {
	console.log('onDomReady');
}).onWindowLoaded(() => {
	console.log('onWindowLoaded');
});