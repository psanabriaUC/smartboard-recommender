import {Meteor} from 'meteor/meteor';
import XmlStream from 'xml-stream';
import {TfIdf} from 'natural';
import htmlToText from 'html-to-text';
import fs from 'fs';

import {Post} from '../api/posts';

export function readStackExchangeXML(file) {
    var path = Assets.absoluteFilePath(file);
    var stream = fs.createReadStream(path);
    var xml = new XmlStream(stream);

    xml.on('endElement: row', Meteor.bindEnvironment((item) => {
        if (item['$']['PostTypeId'] == "1") {
            var post = new Post();

            post.id = item['$']['Id'];
            post.created_at = new Date(item['$']['CreationDate']);
            post.title = item['$']['Title'];
            post.text = item['$']['Body'];
            post.origin = Post.stackExchange;
            post.text = htmlToText.fromString(item['$']['Body'], {
                wordwrap: 130
            });

            if (Post.collection.findOne({_id: post.id}) != null) {
                Post.collection.update({_id: post.id}, post);
            } else {
                Post.collection.insert(post);
            }
        }
    }));

    xml.on('end', Meteor.bindEnvironment(() => {
        console.log("End parsing XML");
        processTfIdf();
    }));
}

function processTfIdf() {
    var tfidf = new TfIdf();
    var posts = [];
    Post.collection.find({}).forEach((post) => {
        tfidf.addDocument(`${post.title}\n${post.text}`);
        posts.push(post);
    });
    console.log('Calculating tf-idf');
    for (var i = 0; i < posts.length; i++) {
        tfidf.listTerms(i).forEach((item) => {
            posts[i].tfs[item.term] = TfIdf.tf(item.term, tfidf.documents[i]);
            posts[i].tfidfs[item.term] = item.tfidf;
            posts[i].idfs[item.term] = tfidf.idf(item.term);
        });
        Post.collection.update({_id: posts[i]._id}, posts[i]);
    }
    console.log("Finished to calculate tf-idf");
}
