import { Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatList, MatListItem } from '@angular/material';

import { Action } from './shared/model/action';
import { Event } from './shared/model/event';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { SocketService } from './shared/services/socket.service';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { DialogUserType } from './dialog-user/dialog-user-type';


const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  action = Action;
  user: User;
  currentUser: User;
  messages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

  constructor(private socketService: SocketService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initModel();
    let data = localStorage.getItem('chat');
    if(!data){
      setTimeout(() => {
        this.openUserPopup(this.defaultDialogUserParams);
      }, 0);
    }

    // setTimeout(() => {
    //   this.openUserPopup(this.defaultDialogUserParams);
    // }, 0);
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    const randomId = this.getRandomId();

    let data = localStorage.getItem('chat');

    if(data) {
      this.currentUser = JSON.parse(data);
      this.user = {
        id: this.currentUser.id,
        avatar: this.currentUser.avatar,
        name: this.currentUser.name
      };
      this.initIoConnection();
      let paramsDialog = {
        dialogType: 0,
        previousUsername: undefined,
        username: 'hello'
      };
      this.sendNotification(paramsDialog, Action.JOINED);
    }
    else {
      this.user = {
        id: randomId,
        avatar: `${AVATAR_URL}/${randomId}.png`
      };
    }
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });


    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.name = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
      localStorage.setItem('chat',JSON.stringify(this.user));
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    const currentTime = new Date();
    let hours: number = currentTime.getHours();
    let minutes: any = currentTime.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeFormatted = `${hours}:${minutes} ${ampm}`;

    this.socketService.send({
      from: this.user,
      content: message,
      time: timeFormatted
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action
      }
    } else if (action === Action.RENAME) {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    }

    this.socketService.send(message);
  }

  public sendMessageFire(event, message){
    if(event.ctrlKey && event.key === 'Enter') {
      this.sendMessage(message);
    }
    else if(event.key === 'Enter'){
      this.sendMessage(message);
    }
  }
}
