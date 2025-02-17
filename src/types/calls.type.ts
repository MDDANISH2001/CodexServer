export interface ICalls {
  callerId: string;
  recipientId: string;

  callStatus: "missed" | "answered" | "declined";
  mediaType: "audio" | "video";

  callTime: string;
  startTime: Date;
  endTime: Date;
  roomId?: string;

  createdAt?: Date;
}
