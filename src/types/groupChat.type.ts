import { IKeys } from "./shared.types";

export interface IGroupUsers {
    userId: string;
    isAdmin: boolean;
};

export interface ILeftUsers {
    userId: string;
    groupDeleted: boolean;
};

export interface IGroupChat {
    groupName: string;
    keys: IKeys;
    activeUsers: IGroupUsers[];
    inactiveUsers: ILeftUsers[];
    messages: string[];
    groupProfile: string;
}