import { IKeys } from "./shared.types";

export interface IGroupUsers {
    userId: string;
    isAdmin: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface ILeftUsers {
    userId: string;
    groupDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IGroupChat {
    groupName: string;
    keys: IKeys;
    activeUsers: IGroupUsers[];
    inactiveUsers: ILeftUsers[];
    messages: string[];
    groupProfile: string;
    createdAt?: Date;
    updatedAt?: Date;
}