import { Meteor } from 'meteor/meteor';
//import schedule from 'node-schedule';
import {syncRedit} from './cron';

Meteor.startup(() => {
    syncRedit();
});
