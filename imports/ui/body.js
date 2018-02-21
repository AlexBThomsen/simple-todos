import { Meteor } from 'meteor/meteor';

import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

 
import { Tasks } from '../api/tasks.js';
 
import './task.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
// we use subscribe to let the server know what to send to client (tasks which have been registered on the server using publish)
  Meteor.subscribe('tasks');

});
 
Template.body.helpers({
  tasks() {
  	const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    // Show newest tasks at the top
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
//adding a helper so we can count incomplete  tasks
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
});

//Here's the JavaScript code we need to add to listen to the submit event on the form:

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
 
    // Insert a task into the collection
    Meteor.call('tasks.insert', text);
 
    // Clear form
    target.text.value = '';
  },
	// add event handler for checkbox (ReactiveDict)
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});