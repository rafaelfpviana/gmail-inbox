// export interface Message {
//     messageId: string;
//     threadId: string;
//     subject: string | undefined;
//     from: string | undefined;
//     to: string | undefined;
//     receivedOn: string | undefined;
//     labelIds: string[];
//     snippet: string;
//     historyId: string;
//     xHeaders: Array<{ name?: string | undefined; value?: string | undefined }> | undefined;
//     allHeaders: Array<{ name?: string | undefined; value?: string | undefined }> | undefined;
//     /**
//      * unix ms timestamp string
//      */
//     internalDate: string;
//     getFullMessage?: () => any;
//     body?: {
//       html: string | undefined;
//       text: string | undefined;
//     };
//   }

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
  getFullMessage: () => any;
  body: {
    html: string | undefined;
    text: string | undefined;
  };
}