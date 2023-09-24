import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, from, map, of, switchMap, tap } from 'rxjs';
import { Message, MessageType } from 'src/app/models/message';
import { AuthorizationService } from 'src/app/service/authorization.service';
import { ChatPortalService } from 'src/app/service/chat-portal.service';
import { ChatService } from 'src/app/service/chat.service';
@Component({
  selector: 'ChatBox',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  myId: string = '';
  activedChatID?: string;
  oldestChatID?: string;

  subscriptions: Subscription = new Subscription();

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private auth: AuthorizationService,
    private chatPortal: ChatPortalService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.myId = this.auth.myId;
    this.route.paramMap
      .pipe(
        map((param) => param.get('chatId') || ''),
        tap(this.resetMessageSetUp),
        tap(this.loadMessages),
        tap(this.subscriptMessageNotify)
      )
      .subscribe();
  }

  private resetMessageSetUp = (activedPpath: string) => {
    activedPpath = activedPpath;
    this.messages = [];
    this.oldestChatID = undefined;
  };

  loadMessages = (chatId: string | null = null) => {
    let id = this.oldestChatID ?? this.activedChatID ?? chatId;
    if (!id) return;

    console.log('Loading messages from ref => ', id);
    this.chatService.getMessages(id).subscribe({
      next: this.onLoadMessageSuccess,
      error: (err) => {},
    });
  };

  private onLoadMessageSuccess = (message: Message[]) => {
    console.log(message);
    this.oldestChatID = message[message.length - 1].messageID;

    // just for delayed loading
    for (let i = 0; i < message.length; i++) {
      setTimeout(() => {
        console.log('pushing message ', i);
        this.pushMessage(message[i], true);
      }, 200 * i);
    }

    // this is for real functional
    // this.messages.push(...message);
  };

  private subscriptMessageNotify = () => {
    const portal = this.chatPortal.messageStream$
      .pipe(
        tap(console.log),
        map(
          (message) =>
            ({
              chatID: message.chatId,
              content: {
                type: message.chatContent.type,
                data: message.chatContent.value,
              },
              senderID: message.sender,
              sendTime: message.timestamp,
              messageID: message.messageId,
            } as Message)
        ),
        tap(console.log),
        tap(this.pushMessage)
      )
      .subscribe();
    this.subscriptions.add(portal);
  };

  private pushMessage = (message: Message, oldMessage: boolean = false) => {
    if (oldMessage) this.messages.push(message);
    else this.messages.unshift(message);
  };
}
