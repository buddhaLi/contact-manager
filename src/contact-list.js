import {WebAPI} from './web-api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ContactUpdated,ContactViewed} from './messages';

export class ContactList{
  static inject() {return [WebAPI,EventAggregator]};

  constructor(api,ea){
    this.api = api;
    ea.subscribe(ContactViewed,msg => this.select(msg.contact));
    ea.subscribe(ContactUpdated, msg => {
      let id = msg.contact.id;
      let found = this.contacts.find(x => x.id === id);
      Object.assign(found,msg.contact);
    })
  }

  created(){
    this.api.getContactList().then(contacts => this.contacts = contacts);
  }

  select(contact){
    this.selectedId = contact.id;
    return true;
  }
}
