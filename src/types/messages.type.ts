import { IAttachment } from "./shared.types";

export interface IAllMessages {
    message: string;
    userId: string;
    attachments: IAttachment[];
};