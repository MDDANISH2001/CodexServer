export interface IKeys {
    publicKey: string,
    privateKey: { 
        iv: string,
        encryptedMessage:string,
        tag: string,
    },
    rootKey: { 
        iv: string,
        encryptedMessage:string,
        tag: string,
    },
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IAttachment {
    title: string;
    docUrl: string;
}