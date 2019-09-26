import { Injectable } from '@angular/core';

import {Message} from "./chat/shared/model/message";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  myMessages: Message[] = [];

  constructor() { }

  public getMyMessages():Message[] {
    return this.myMessages;
  }

  public addMessage(message:Message) {
    this.myMessages.push(message);
  }
}
