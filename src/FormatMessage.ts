import { gmail_v1 } from 'googleapis';
import { Message } from './Message.interface';
import { FormatMessageInterface } from './FormatMessageInterface.interface';

/**
 * Made these properties optional
 * TODO
 * decouple this interface from here as it is being passed on to the custom formats
 */
interface OriginalMessage extends Message {
    getFullMessage: () => any;
    body: {
        html: string | undefined;
        text: string | undefined;
    };
}

/**
 * Class used to format what is received by the Gmail API
 * It was decoupled to allow extend treatment to data before
 * returning it as the output Message object
 *
 * @param message
 */
export class FormatMessage implements FormatMessageInterface {
    public format(message: { data: gmail_v1.Schema$Message }): Message {
        const headers = message.data.payload?.headers;
        const prettyMessage: OriginalMessage = {
            body: this.getMessageBody(message),
            from: this.getHeader('From', headers),
            historyId: message.data.historyId!,
            internalDate: message.data.internalDate!,
            labelIds: message.data.labelIds!,
            messageId: message.data.id!,
            snippet: message.data.snippet!,
            threadId: message.data.threadId!,
            to: this.getHeader('To', headers),
            subject: this.getHeader('Subject', headers),
            receivedOn: this.getHeader('Date', headers),
            getFullMessage: () => message.data.payload,
        };

        return prettyMessage;
    }
    getHeader(
        name: string,
        headers: Array<gmail_v1.Schema$MessagePartHeader> | undefined,
    ): string | undefined {
        if (!headers) {
            return;
        }
        const header = headers.find(h => h.name === name);
        return header && headers['value'];
    };
    getMessageBody(message: { data: gmail_v1.Schema$Message; }): { html: string | undefined; text: string | undefined; } {
        let body: any = {};
        const messagePayload = message.data.payload;
        const messageBody = messagePayload?.body;
        if (messageBody?.size && messagePayload) {
            switch (messagePayload?.mimeType) {
                case 'text/html':
                    body.html = Buffer.from(messageBody.data as string, 'base64').toString('utf8');
                    break;
                case 'text/plain':
                default:
                    body.text = Buffer.from(messageBody.data as string, 'base64').toString('utf8');
                    break;
            }
        } else {
            body = this.getPayloadParts(message);
        }
        return body;
    }
    getPayloadParts(message: { data: gmail_v1.Schema$Message; }): any {
        const body: any = {};
        const parts = message.data.payload?.parts;
        const hasSubParts = parts?.find(part => part.mimeType?.startsWith('multipart/'));
        if (hasSubParts) {
            // recursively continue until you find the content
            const newMessage: any = {
                Headers: {},
                config: {},
                data: { payload: hasSubParts } as gmail_v1.Schema$Message,
            };
            return this.getPayloadParts(newMessage);
        }
        const htmlBodyPart = parts?.find(part => part.mimeType === 'text/html');

        if (htmlBodyPart && htmlBodyPart.body && htmlBodyPart.body.data) {
            body.html = Buffer.from(htmlBodyPart.body.data, 'base64').toString('utf8');
        }
        const textBodyPart = parts?.find(part => part.mimeType === 'text/plain');

        if (textBodyPart && textBodyPart.body && textBodyPart.body.data) {
            body.text = Buffer.from(textBodyPart.body.data, 'base64').toString('utf8');
        }

        return body;
    }

}
