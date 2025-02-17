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
};

export interface IAttachment {
    title: string;
    docUrl: string;
}