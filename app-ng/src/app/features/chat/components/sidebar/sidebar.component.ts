import { Component, EventEmitter, Output } from '@angular/core';
import { ChatType } from 'src/app/models/chat';
import { ChatContact } from 'src/app/models/chat-contact';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'Sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  chatContacts: ChatContact[] = [];

  @Output() onOpenCollapse = new EventEmitter();

  filteredChatContacts: ChatContact[] = [];
  filteredBySearchChatContacts: ChatContact[] = [];
  isMainSettingsOpen = false;

  searchText = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.chatContacts$.subscribe({
      next: (res) => {
        this.chatContacts = res;
        this.filteredChatContacts = res;
        this.filteredBySearchChatContacts = res;
      },
      error: (err) => console.log(err),
    });
  }

  onOpenMainSettings() {
    this.isMainSettingsOpen = true;
  }

  onCloseMainSettings() {
    this.isMainSettingsOpen = false;
  }

  onChangeFilter(filter: ChatType | null) {
    if (!filter) {
      this.filteredChatContacts = this.chatContacts;
    } else {
      if (filter === ChatType.PRIVATE) {
        this.filteredChatContacts = this.chatContacts.filter(
          (contact) => contact.type === ChatType.PRIVATE
        );
      } else {
        this.filteredChatContacts = this.chatContacts.filter(
          (contact) => contact.type === ChatType.GROUP
        );
      }
    }
  }

  onSearch(text: string) {
    this.searchText = text;

    this.filteredBySearchChatContacts = this.filteredChatContacts.filter((contact) =>
      contact.chatName.toLowerCase().startsWith(this.searchText.toLowerCase())
    );
  }

  openMobileCollapse() {
    this.onOpenCollapse.emit();
  }
}
