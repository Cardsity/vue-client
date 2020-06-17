/* eslint-disable no-console */

import { register } from 'register-service-worker';
import store from './store/index';

if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.\n' +
                    'For more details, visit https://goo.gl/AFskqB'
            );
        },
        registered(registration) {
            console.log('Service worker has been registered.');

            // Routinely check for app updates by testing for a new service worker.
            setInterval(() => {
                registration.update();
            }, 1000 * 60 * 60); // hourly checks
        },
        cached() {
            console.log('Content has been cached for offline use.');
        },
        updatefound() {
            console.log('New content is downloading.');
            // TODO: maybe add a downloading new content notification
        },
        updated() {
            console.log('New content is available; please refresh.');
            store.state.updateAvailable = true;
        },
        offline() {
            console.log('No internet connection found. App is running in offline mode.');
            // TODO: display offline message
        },
        error(error) {
            console.error('Error during service worker registration:', error);
        },
    });
}
