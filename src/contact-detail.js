import {WebAPI} from './web-api';
import {areEqual} from './utility';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ContactUpdated,ContactViewed} from './messages';

export class ContactDetail{

  static inject(){return [WebAPI,EventAggregator];}

  constructor(api,ea){
    this.api = api;
    this.ea = ea;
  }

  activate(params,routeConfig){
    this.routeConfig = routeConfig;
    return this.api.getContactDetails(params.id).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));
      this.ea.publish(new ContactViewed(this.contact));
    })
  }

  get canSave(){
    return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
  }

  save(){
    this.api.saveContact(this.contact).then(contact => {
      this.contact = contact;
      this.routeConfig.navModel.setTitle(contact.firstName);
      this.originalContact = JSON.parse(JSON.stringify(contact));
      this.ea.publish(new ContactUpdated(this.contact));
    })
  }

  canDeactivate(){
    if(!areEqual(this.originalContact,this.contact)){
      let result = confirm('you have unsaved changes. Are you sure you wish to leave?');
      if(!result){
        this.ea.publish(new ContactViewed(this.contact))
      }
      return result;
    }
  }
}
