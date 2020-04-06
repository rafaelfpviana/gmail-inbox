export interface Message {
  messageId: string;
  threadId: string;
  subject: string | undefined;
  from: string | undefined;
  to: string | undefined;
  receivedOn: string | undefined;
  labelIds: string[];
  snippet: string;
  historyId: string;
  /**
   * unix ms timestamp string
   */
  internalDate: string;
}
