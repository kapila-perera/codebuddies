import moment from 'moment';

/**
* get list of users who are eligible to receive emails for given type
* @function
* @name getEligibleRecipients
* @param { String } type - email notification type
* @param { Array } subscribers - list of user(s)
* @return { Array } subscribers - list ppl who has enabled email noticiation.
*/
function getEligibleRecipients(type, recipients) {

  let result = [];
  // check if recipients is an arry of users
  if (recipients && recipients instanceof Array) {

    recipients.forEach((recipients)=> {
      const user = Meteor.users.findOne({_id: recipients.id});
      // if user has enabled notification for the 'type'
      if (user
          && user.emails_preference
          && user.emails_preference.indexOf(type) != -1 ) {

         result.push(user.email)
      }
    })
    return result
  }
}

/**
* get list of users who are member of a group
* @function
* @name getGroupMembers
* @param { String } type - email notification type
* @param { Array } subscribers - list of user(s)
* @return { Array } members - list of group members
*/
function getGroupMembers(study_group_id) {
  if (study_group_id === 'CB') {
    return false;
  }

  const group = StudyGroups.findOne({'_id': study_group_id})

  if (group && group.members) {
    return group.members
  }

  return false;
}

/**
* get list of users who are member of a group
* @function
* @name getGroupOrganizers
* @param { String } type - email notification type
* @param { Array } subscribers - list of user(s)
* @return { Array } organizers - list of group organizers {owner, admin, moderator}
*/
function getGroupOrganizers(study_group_id) {
  if (study_group_id === 'CB') {
    return false;
  }

  const group = StudyGroups.findOne({'_id': study_group_id})

  if (group && group.members) {

    const organizers = group.members.filter(function(member) {
      return member.role === 'owner' || member.role === 'admin' || member.role === 'moderator';
    })
    return organizers
  }

  return false;
}

/**
* get list of users who are member of a group
* @function
* @name getDiscussionSubscribers
* @param { String } type - email notification type
* @return { Array } subscribers - list ppl who has enabled email noticiation.
*/
function getDiscussionSubscribers(discussion_id) {
  if (discussion_id === 'CB') {
    return false;
  }

  const discussion = Discussions.findOne({'_id': discussion_id})
  let result = [];
  if (discussion && discussion.subscribers) {

    discussion.subscribers.forEach((subscriber)=> {

      const user = Meteor.users.findOne({_id: subscriber.id});
      // if user has enabled notification for the 'type'
      if (user) {
         result.push(user.email)
      }

    })
    return result;
  }

}


/**
* get list of new hangouts
* @function
* @name getNewHangouts
* @return { Array } hangouts - list of new hangout
*/
function getNewHangouts() {
  return Hangouts.find({'email_notifications.initial': false, 'visibility': true}).fetch();
}

/**
* get list of new discussions
* @function
* @name getNewDiscussions
* @return { Array } Discussions - list of new Discussion
*/
function getNewDiscussions() {
  return Discussions.find({'email_notifications.initial': false, 'visibility': true}).fetch();
}

/**
* get list of new discussion responses
* @function
* @name getNewDiscussionResponses
* @return { Array } DiscussionResponses - list of new DiscussionResponses
*/
function getNewDiscussionResponses() {
  return DiscussionResponses.find({'email_notifications.initial': false, 'visibility': true}).fetch();
}

/**
* get list of new members
* @function
* @name getNewMembers
* @return { Array } members - list of new members
*/
function getNewMembers() {
  return Activities.find({'email_notifications.initial': false, 'type': 'USER_JOIN'}).fetch();
}

/**
* parse created_at time to time from now
* @function
* @name createdFromNow
* @param { item } item - object
* @return { item } item - object
*/
function createdFromNow(item){
  if (item.created_at) {
    item.from_now = moment(item.created_at).fromNow();
    return item
  }
}


export {
  getEligibleRecipients,
  getGroupMembers,
  getGroupOrganizers,
  getDiscussionSubscribers,
  getNewHangouts,
  getNewDiscussions,
  getNewDiscussionResponses,
  getNewMembers,
  createdFromNow
}
