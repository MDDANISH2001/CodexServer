import { IAttachment } from "./shared.types";

export interface IAllMessages {
    message: string;
    userId: string;
    taggedMessage?: string;
    attachments?: IAttachment[];
    createdAt?: Date;
    updatedAt?: Date;
};