"use client";

import React, { useState, useEffect } from "react";
import { Chat, Message, User, ChatFolder } from "@/types/chat";
import {
  CURRENT_USER,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  generateBotReply,
} from "@/lib/mockChatData";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { ChatInfoDrawer } from "@/components/chat/ChatInfoDrawer";
import { NewChatModal } from "@/components/chat/NewChatModal";
import { SettingsModal } from "@/components/chat/SettingsModal";
import { DoodleStar, DoodleSparkle } from "@/components/chat/DoodleIcons";

export default function ChatPage() {
  // State
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("chat_alice");
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [activeFolder, setActiveFolder] = useState<ChatFolder>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // UI Panels
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  // In-Chat Search & Reply & Typing
  const [isSearchingInChat, setIsSearchingInChat] = useState(false);
  const [searchQueryInChat, setSearchQueryInChat] = useState("");
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [isPeerTyping, setIsPeerTyping] = useState<Record<string, boolean>>({});

  // LocalStorage Persistence on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("doodle_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedChats = localStorage.getItem("doodle_chats");
      if (savedChats) setChats(JSON.parse(savedChats));

      const savedMessages = localStorage.getItem("doodle_messages");
      if (savedMessages) setMessages(JSON.parse(savedMessages));
    } catch (e) {
      console.error("Failed to load local chat state", e);
    }
  }, []);

  // Save changes to LocalStorage
  const persistData = (
    newChats?: Chat[],
    newMessages?: Record<string, Message[]>,
    newUser?: User
  ) => {
    try {
      if (newChats) localStorage.setItem("doodle_chats", JSON.stringify(newChats));
      if (newMessages) localStorage.setItem("doodle_messages", JSON.stringify(newMessages));
      if (newUser) localStorage.setItem("doodle_user", JSON.stringify(newUser));
    } catch (e) {
      console.error("Failed to save local chat state", e);
    }
  };

  // Active Chat Object
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0] || INITIAL_CHATS[0];
  const activeMessages = messages[activeChatId] || [];

  // Select a Chat
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setIsMobileListOpen(false);
    setIsSearchingInChat(false);
    setSearchQueryInChat("");
    setReplyingToMessage(null);

    // Clear unread count for selected chat
    const updatedChats = chats.map((c) =>
      c.id === chatId ? { ...c, unreadCount: 0 } : c
    );
    setChats(updatedChats);
    persistData(updatedChats);
  };

  // Send a Message
  const handleSendMessage = (
    text: string,
    stickerUrl?: string,
    attachmentType?: "image" | "voice" | "file"
  ) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp,
      isOutgoing: true,
      status: "sent",
      replyTo: replyingToMessage
        ? {
            id: replyingToMessage.id,
            senderName: replyingToMessage.senderName,
            text: replyingToMessage.text || "Media",
          }
        : undefined,
      stickerUrl,
      attachments: attachmentType
        ? [
            {
              id: `att_${Date.now()}`,
              type: attachmentType,
              url: "#",
              duration: attachmentType === "voice" ? 12 : undefined,
              waveform:
                attachmentType === "voice"
                  ? [40, 70, 90, 60, 100, 80, 50, 90, 40]
                  : undefined,
            },
          ]
        : undefined,
      reactions: [],
    };

    const currentChatMsgs = messages[activeChatId] || [];
    const updatedMsgsForChat = [...currentChatMsgs, newMessage];
    const updatedAllMessages = {
      ...messages,
      [activeChatId]: updatedMsgsForChat,
    };

    // Update lastMessage in chat list
    const updatedChats = chats.map((c) =>
      c.id === activeChatId
        ? {
            ...c,
            lastMessage: {
              text: stickerUrl ? `[Sticker ${stickerUrl}]` : text,
              timestamp,
              isOutgoing: true,
              status: "sent",
            },
            draft: undefined,
          }
        : c
    );

    setMessages(updatedAllMessages);
    setChats(updatedChats);
    setReplyingToMessage(null);
    persistData(updatedChats, updatedAllMessages);

    // Simulate peer/bot reply if chat is direct or group (and not saved notes)
    if (activeChat.type !== "saved") {
      simulatePeerResponse(activeChatId, activeChat.title, text);
    }
  };

  // Simulate auto response
  const simulatePeerResponse = (
    chatId: string,
    chatTitle: string,
    userText: string
  ) => {
    // Show typing after 600ms
    setTimeout(() => {
      setIsPeerTyping((prev) => ({ ...prev, [chatId]: true }));
    }, 600);

    // Reply after 2000ms
    setTimeout(() => {
      setIsPeerTyping((prev) => ({ ...prev, [chatId]: false }));

      const replyText = generateBotReply(userText, chatTitle);
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const replyMsg: Message = {
        id: `msg_reply_${Date.now()}`,
        chatId,
        senderId: chatId === "chat_dev_group" ? "user_bob" : "user_peer",
        senderName:
          chatId === "chat_dev_group"
            ? "Bob Builder"
            : chatId === "chat_alice"
            ? "Alice Smith"
            : chatId === "chat_bot"
            ? "Doodle AI Assistant"
            : chatTitle,
        senderAvatar:
          chatId === "chat_dev_group"
            ? "⚡"
            : chatId === "chat_alice"
            ? "🎨"
            : "🤖",
        senderColor:
          chatId === "chat_dev_group"
            ? "#4ecdc4"
            : chatId === "chat_alice"
            ? "#ff6b6b"
            : "#06d6a0",
        text: replyText,
        timestamp,
        isOutgoing: false,
        status: "read",
        reactions: [],
      };

      setMessages((prev) => {
        const list = prev[chatId] || [];
        const nextList = [...list, replyMsg];
        const nextAll = { ...prev, [chatId]: nextList };
        persistData(undefined, nextAll);
        return nextAll;
      });

      setChats((prevChats) => {
        const nextChats = prevChats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                unreadCount: activeChatId === chatId ? 0 : c.unreadCount + 1,
                lastMessage: {
                  text: replyText,
                  timestamp,
                  isOutgoing: false,
                  status: "read",
                },
              }
            : c
        );
        persistData(nextChats);
        return nextChats;
      });
    }, 2200);
  };

  // Toggle Reactions
  const handleToggleReaction = (messageId: string, emoji: string) => {
    const chatMsgs = messages[activeChatId] || [];
    const updated = chatMsgs.map((m) => {
      if (m.id !== messageId) return m;

      const existingReactionIndex = m.reactions.findIndex((r) => r.emoji === emoji);
      let newReactions = [...m.reactions];

      if (existingReactionIndex > -1) {
        const reaction = newReactions[existingReactionIndex];
        if (reaction.users.includes(currentUser.id)) {
          // Remove user reaction
          const newUsers = reaction.users.filter((u) => u !== currentUser.id);
          if (newUsers.length === 0) {
            newReactions.splice(existingReactionIndex, 1);
          } else {
            newReactions[existingReactionIndex] = {
              ...reaction,
              count: reaction.count - 1,
              users: newUsers,
            };
          }
        } else {
          // Add user reaction
          newReactions[existingReactionIndex] = {
            ...reaction,
            count: reaction.count + 1,
            users: [...reaction.users, currentUser.id],
          };
        }
      } else {
        // Create new reaction
        newReactions.push({
          emoji,
          count: 1,
          users: [currentUser.id],
        });
      }

      return { ...m, reactions: newReactions };
    });

    const updatedAll = { ...messages, [activeChatId]: updated };
    setMessages(updatedAll);
    persistData(undefined, updatedAll);
  };

  // Pin / Unpin message
  const handleTogglePinMessage = (messageId: string) => {
    const chatMsgs = messages[activeChatId] || [];
    const updated = chatMsgs.map((m) =>
      m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
    );
    const updatedAll = { ...messages, [activeChatId]: updated };
    setMessages(updatedAll);
    persistData(undefined, updatedAll);
  };

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    const chatMsgs = messages[activeChatId] || [];
    const updated = chatMsgs.filter((m) => m.id !== messageId);
    const updatedAll = { ...messages, [activeChatId]: updated };
    setMessages(updatedAll);
    persistData(undefined, updatedAll);
  };

  // Pin / Unpin Chat
  const handleTogglePinChat = (chatId: string) => {
    const updated = chats.map((c) =>
      c.id === chatId ? { ...c, isPinned: !c.isPinned } : c
    );
    // Sort: pinned first
    updated.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    setChats(updated);
    persistData(updated);
  };

  // Clear Chat History
  const handleClearChatHistory = (chatId: string) => {
    const updatedAll = { ...messages, [chatId]: [] };
    const updatedChats = chats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            lastMessage: {
              text: "Chat cleared",
              timestamp: "Just now",
              isOutgoing: false,
            },
          }
        : c
    );
    setMessages(updatedAll);
    setChats(updatedChats);
    persistData(updatedChats, updatedAll);
  };

  // Create New Chat
  const handleCreateNewChat = (newChat: Chat) => {
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setActiveChatId(newChat.id);
    setIsMobileListOpen(false);
    persistData(updatedChats);
  };

  // Update Profile
  const handleUpdateUser = (updated: User) => {
    setCurrentUser(updated);
    persistData(undefined, undefined, updated);
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-[#f7f4ea] relative select-none">
      {/* Background Floating Doodle SVGs (Matching Login Page) */}
      <div className="absolute top-2 left-6 pointer-events-none opacity-40 hidden sm:block">
        <DoodleStar size={36} fill="#ffd166" className="animate-[float-star_5s_ease-in-out_infinite]" />
      </div>
      <div className="absolute bottom-6 right-8 pointer-events-none opacity-40 hidden sm:block">
        <DoodleSparkle size={36} fill="#06d6a0" className="animate-[float-sparkle_4s_ease-in-out_infinite]" />
      </div>

      {/* Main Chat Container with Notebook Neo-Brutalist Frame */}
      <div className="flex-1 flex overflow-hidden w-full h-full relative">
        {/* Sidebar */}
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          currentUser={currentUser}
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          activeFolder={activeFolder}
          onSelectFolder={setActiveFolder}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isMobileListOpen={isMobileListOpen}
        />

        {/* Chat Main Window */}
        <div
          className={`flex-1 flex flex-col h-full bg-[#fdfaf2] overflow-hidden ${
            isMobileListOpen ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header */}
          <ChatHeader
            chat={activeChat}
            onBackToSidebar={() => setIsMobileListOpen(true)}
            onToggleInfoDrawer={() => setIsInfoDrawerOpen(!isInfoDrawerOpen)}
            onToggleSearchInChat={() => setIsSearchingInChat(!isSearchingInChat)}
            isSearchingInChat={isSearchingInChat}
            searchQueryInChat={searchQueryInChat}
            onSearchInChatChange={setSearchQueryInChat}
            isTyping={isPeerTyping[activeChatId]}
            onTogglePinChat={handleTogglePinChat}
            onClearChatHistory={handleClearChatHistory}
          />

          {/* Messages Stream */}
          <MessageList
            chat={activeChat}
            messages={activeMessages}
            currentUser={currentUser}
            onReplyToMessage={(msg) => setReplyingToMessage(msg)}
            onTogglePinMessage={handleTogglePinMessage}
            onDeleteMessage={handleDeleteMessage}
            onToggleReaction={handleToggleReaction}
            highlightedMessageId={highlightedMessageId}
            searchFilter={isSearchingInChat ? searchQueryInChat : ""}
          />

          {/* Input Bar */}
          <MessageInput
            onSendMessage={handleSendMessage}
            replyingTo={replyingToMessage}
            onCancelReply={() => setReplyingToMessage(null)}
            onTyping={() => {}}
            draftText={activeChat.draft || ""}
            onDraftChange={(text) => {
              setChats((prev) =>
                prev.map((c) =>
                  c.id === activeChatId ? { ...c, draft: text } : c
                )
              );
            }}
          />
        </div>

        {/* Telegram Profile Details Info Drawer */}
        <ChatInfoDrawer
          chat={activeChat}
          isOpen={isInfoDrawerOpen}
          onClose={() => setIsInfoDrawerOpen(false)}
          onClearHistory={() => handleClearChatHistory(activeChatId)}
        />
      </div>

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateNewChat}
      />

      {/* Settings & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
      />
    </main>
  );
}
