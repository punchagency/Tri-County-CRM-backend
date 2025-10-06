import { ApiConfig } from '@src/config';

export class GohighlevelServiceApi {
  static api({ gohighlevel, conversationId, messageId, contactId }: { gohighlevel: ApiConfig['gohighlevel'], conversationId?: string, messageId?: string, contactId?: string }) {

    return {
      call_conversations_request_inbound: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/search?locationId=${gohighlevel.location_id}&lastMessageType=TYPE_SMS&lastMessageDirection=inbound&limit=100`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      sms_conversations_request_inbound: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/search?locationId=${gohighlevel.location_id}&lastMessageType=TYPE_CALL&lastMessageDirection=inbound&limit=100`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      call_conversations_request_outbound: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/search?locationId=${gohighlevel.location_id}&lastMessageType=TYPE_SMS&lastMessageDirection=outbound&limit=100`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      sms_conversations_request_outbound: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/search?locationId=${gohighlevel.location_id}&lastMessageType=TYPE_CALL&lastMessageDirection=outbound&limit=100`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      single_conversation_request_messages: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/${conversationId}/messages`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      single_conversation_request_detail: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/${conversationId}`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      single_conversation_request_detail_contact_id: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/search?locationId=${gohighlevel.location_id}&contactId=${contactId}`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      single_message_request_detail: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/messages/${messageId}`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      recording_request: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/conversations/messages/${messageId}/locations/${gohighlevel.location_id}/recording`,
        headers: {
          'content-type': "audio/x-wav",
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
      single_contact_request_detail: {
        token: gohighlevel.token,
        method: 'GET',
        url: `${gohighlevel.baseUrl}/contacts/${contactId}`,
        headers: {
          'Accept': 'application/json',
          'Version': '2021-04-15',
          'Authorization': `Bearer ${gohighlevel.token}`
        }
      },
    }
  }
}
