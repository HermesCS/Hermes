import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, map, tap } from 'rxjs';
import { ChatType } from 'src/app/models/chat';
import { ChatContact } from 'src/app/models/chat-contact';
import { AuthorizationService } from 'src/app/service/authorization.service';
import { ChatPortalService } from 'src/app/service/chat-portal.service';

@Component({
  selector: 'ChatHeader',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit, OnDestroy {

  @Input() forContact!: ChatContact
  @Output() onToggleChatSettings = new EventEmitter();

  get isOnline(){
    return this.checkStatus()>0;
  };
  get onlinesCount(){
    return this.checkStatus();
  };

  onlineUsers!: Set<string>;
  subscription!: Subscription;

  constructor(
    private auth: AuthorizationService,
    private chatPortal: ChatPortalService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.listenToStatusChanged();
  }

  private listenToStatusChanged() {
    this.subscription = this.chatPortal
      .onlineUsers$.pipe(
        tap(o => this.onlineUsers = o),
        map(this.checkStatus),
      ).subscribe();
  }

  checkStatus = () => {
    const found = this.forContact.members.filter(i => i._id != this.auth.myId);
    let status = found.reduce((a, b) => a + (this.onlineUsers.has(b._id) ? 1 : 0), 0);
    return status;
  }



  toggleChatSettings() {
    this.onToggleChatSettings.emit()
  }
}
