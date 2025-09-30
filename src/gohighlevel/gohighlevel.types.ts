export interface Conversation {
  id: string;
  locationId: string;
  dateAdded: number;
  dateUpdated: number;
  lastMessageDate: number;
  lastMessageType: string;
  lastMessageDirection: string;
  unreadCount: number;
  lastManualMessageDate: number;
  followers: string[];
  isLastMessageInternalComment: boolean;
  contactId: string;
  fullName: string;
  contactName: string;
  companyName: string;
  phone: string;
  tags: string[];
  type: string;
  scoring: string[];
  sort: number[];
}

export interface ConversationMessage {
  id: string,
  direction: string,
  status: string,
  type: number,
  locationId: string,
  contactId: string,
  conversationId: string,
  dateAdded: string,
  dateUpdated: string,
  meta: {
    call: {
      duration: number,
      status: string,
    }
  },
  altId: string,
  messageType: string,

}

export interface conversationMessageResponseObject {
  lastMessageId: string,
  nextPage: boolean,
  messages: Array<ConversationMessage>
}


export interface ConversationMessageResponse {
  messages: conversationMessageResponseObject,
  traceId: string,
}


export interface ConversationMessageDetailResponse {
  id: string,
  altId: string,
  type: number,
  messageType: string,
  locationId: string,
  contactId: string,
  conversationId: string,
  dateAdded: string,
  body: string,
  direction: string,
  status: string,
  contentType: string,
  attachments: Array<string>,
  meta: {
    callDuration: number,
    callStatus: string,
    email: {
      email: {
        messageIds: Array<string>,
      }
    },
    ig: {
      ig: {
        page_id: string,
        page_name: string,
      }
    },
    fb: {
      fb: {
        page_id: string,
        page_name: string,
      }
    }
  },
  source: string,
  userId: string,
  conversationProviderId: string,
  chatWidgetId: string,
}