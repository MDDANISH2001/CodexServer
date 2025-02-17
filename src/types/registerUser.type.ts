import { IAttachment, IKeys } from "./shared.types";

export interface IUser {
    username:string;
    email:string;
    password:string;
    phone:number;
    keys: IKeys;
    profilePic: string;
    attachments: IAttachment[];
}