import { Message } from './Message.interface';

export interface FormatMessageInterface {
    format(message: any): Message;
}