

Messages = new Mongo.Collection('messages');


if (Meteor.isClient) {
    
    Template.listing.helpers({
        entries: function() {
            return Messages.find();
        },
        formatDate: function() {
            return this.date ? moment(this.date).format("ddd, hA, h:mm:ss") : '';
        },
        username: function() {
            let  userID =  Messages.findOne({_id: this._id}).owner;
            return username = Meteor.users.findOne(userID).username;

            //return  username =  Messages.findOne({_id: this._id}).username;
            
           // return username = Meteor.users.findOne(userID).username;
        }
    });
    

    Template.newEntry.events({
        'submit form': function(event){
            event.preventDefault();

            let c = document.getElementById('content').value;
            Meteor.call('addMessage', {content: c});

            event.target.reset();
        }
    });

}

if (Meteor.isServer) {

    Meteor.methods({
        addMessage: function(message) {
            if(!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }

            if(!message.content) {
                throw new Meteor.Error('invalid');
            }

            message.date = new Date();
            message.owner = Meteor.userId();
            message.name = Meteor.user();

            Messages.insert(message);
        }
    });

}