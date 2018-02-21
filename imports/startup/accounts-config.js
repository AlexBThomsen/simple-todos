import { Accounts } from 'meteor/accounts-base';
 
 // to configure account UI to use usernames instead of email addresses.
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});