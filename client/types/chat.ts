export type ChatType = "direct" | "group" | "channel" | "saved";

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  avatarColor: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
  bio?: string;
  phone?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user ids
}

export interface Attachment {
  id: string;
  type: "image" | "file" | "voice" | "doodle";
  url: string;
  name?: string;
  size?: string;
  duration?: number; // for voice in seconds
  waveform?: number[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderColor?: string;
  text: string;
  timestamp: string; // ISO or formatted
  isOutgoing: boolean;
  status: "sending" | "sent" | "delivered" | "read";
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  forwardFrom?: string;
  isPinned?: boolean;
  reactions: Reaction[];
  attachments?: Attachment[];
  stickerUrl?: string;
  isEdited?: boolean;
}

export interface Chat {
  id: string;
  type: ChatType;
  title: string;
  username?: string; // for channels/groups e.g. @telegramnews
  avatar: string;
  avatarColor: string;
  isVerified?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  unreadCount: number;
  lastMessage?: {
    text: string;
    timestamp: string;
    senderName?: string;
    isOutgoing?: boolean;
    status?: "sending" | "sent" | "delivered" | "read";
  };
  members?: User[];
  description?: string;
  draft?: string;
  themePaper?: "cream" | "blue" | "pink" | "yellow" | "green";
  createdAt: string;
}

export type ChatFolder = "all" | "direct" | "groups" | "channels" | "unread" | "saved";
