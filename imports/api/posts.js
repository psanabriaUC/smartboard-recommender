import {Mongo} from 'meteor/mongo';

export class Post {
    constructor() {
        this._id = 0;
        this.title = "";
        this.url = "";
        this.text = "";
        this.created_at = new Date();
        this.tfs = {};
        this.idfs = {};
        this.tfidfs = {};
        this.origin = Post.reddit;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }
}

Post.reddit = 'REDDIT';
Post.stackExchange = 'STACK_EXCHANGE';
Post.collection = new Mongo.Collection('posts');
