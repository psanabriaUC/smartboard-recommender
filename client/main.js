import {Template} from 'meteor/templating';
import {Post} from '../imports/api/posts';

import './main.html';

Template.body.helpers({
    posts() {
        return Post.collection.find().count();
    }
});