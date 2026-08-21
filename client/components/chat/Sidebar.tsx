"use client";

import React, { useState } from "react";
import { Chat, ChatFolder, User } from "@/types/chat";
import {
  DoodleSearch,
  DoodlePlus,
  DoodleSettings,
  DoodleSaved,
  DoodleUsers,
  DoodleSpeaker,
  DoodleChecks,
  DoodleStar,
  DoodlePin,
} from "./DoodleIcons";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  currentUser: User;
  onOpenNewChat: () => void;
  onOpenSettings: () => void;
  activeFolder: ChatFolder;
  onSelectFolder: (folder: ChatFolder) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isMobileListOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  currentUser,
  onOpenNewChat,
  onOpenSettings,
  activeFolder,
  onSelectFolder,
  searchQuery,
  onSearchChange,
  isMobileListOpen = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter chats by folder and search
  const filteredChats = chats.filter((chat) => {
    // Folder filter
    if (activeFolder === "direct" && chat.type !== "direct") return false;
    if (activeFolder === "groups" && chat.type !== "group") return false;
    if (activeFolder === "channels" && chat.type !== "channel") return false;
    if (activeFolder === "saved" && chat.type !== "saved") return false;
    if (activeFolder === "unread" && chat.unreadCount === 0) return false;

    // Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const titleMatch = chat.title.toLowerCase().includes(q);
      const userMatch = chat.username?.toLowerCase().includes(q);
      const msgMatch = chat.lastMessage?.text.toLowerCase().includes(q);
      return titleMatch || userMatch || msgMatch;
    }

    return true;
  });

  // Calculate unread tallies
  const unreadTotal = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <aside
      className={`w-full md:w-80 lg:w-96 flex flex-col h-full bg-[#fdfaf2] border-r-2 border-[#323232] select-none transition-all ${
        isMobileListOpen ? "flex" : "hidden md:flex"
      }`}
    >
      {/* Top App Header */}
      <div className="p-3 border-b-2 border-[#323232] bg-[#fff9e6] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Doodle Telegram Logo */}
          <div className="w-10 h-10 rounded-full bg-[#ffe66d] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] text-xl relative">
            ✈️
            <span className="absolute -top-1 -right-1 text-xs">✨</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight flex items-center gap-1.5 text-[#323232] tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
              DoodleGram
              <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#4ecdc4] text-[#323232] border border-[#323232] rounded shadow-[1px_1px_0px_#323232]">
                Telegram
              </span>
            </h1>
            <p className="text-xs text-[#666] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#06d6a0] border border-[#323232] inline-block"></span>
              {currentUser.username ? `@${currentUser.username}` : "Online"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenNewChat}
            title="New Chat / Group / Channel"
            className="w-9 h-9 rounded-full bg-[#ff6b6b] hover:bg-[#ff5252] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <DoodlePlus size={18} color="#323232" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings & Themes"
            className="w-9 h-9 rounded-full bg-[#ffeef2] hover:bg-[#ffd166] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <DoodleSettings size={18} color="#323232" />
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-3 bg-[#faf7ef] border-b-2 border-[#323232]">
        <div className="relative flex items-center">
          <div className="absolute left-3 pointer-events-none text-[#777]">
            <DoodleSearch size={18} color="#323232" />
          </div>
          <input
            type="text"
            placeholder="Search chats, notes, channels..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-white border-2 border-[#323232] rounded-xl text-sm font-medium focus:bg-[#fffdf5] focus:outline-none shadow-[2px_2px_0px_#323232] transition-all"
            style={{ borderRadius: "var(--sketch-radius-1)" }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 text-xs bg-[#ffeef2] border border-[#323232] rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Telegram Folder Tabs (All, DMs, Groups, Channels, Saved, Unread) */}
      <div className="px-2 py-1.5 bg-[#f5efe0] border-b-2 border-[#323232] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: "all", label: "All", badge: unreadTotal > 0 ? unreadTotal : null },
          { id: "direct", label: "Direct", icon: "👤" },
          { id: "groups", label: "Groups", icon: "👥" },
          { id: "channels", label: "Channels", icon: "📢" },
          { id: "saved", label: "Saved", icon: "⭐" },
          { id: "unread", label: "Unread", badge: unreadTotal > 0 ? unreadTotal : null },
        ].map((folder) => {
          const isActive = activeFolder === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => onSelectFolder(folder.id as ChatFolder)}
              className={`px-3 py-1 text-xs font-bold whitespace-nowrap border-2 border-[#323232] rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                isActive
                  ? "bg-[#ffd166] shadow-[2px_2px_0px_#323232] -translate-y-0.5"
                  : "bg-white/80 hover:bg-white text-[#555] hover:text-[#323232] shadow-[1px_1px_0px_#323232]"
              }`}
            >
              {folder.icon && <span>{folder.icon}</span>}
              <span>{folder.label}</span>
              {folder.badge && (
                <span className="px-1.5 py-0.2 bg-[#ff6b6b] text-[#323232] rounded-full text-[10px] font-black border border-[#323232]">
                  {folder.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y-2 divide-[#323232]/20 doodle-bg-lined">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-[#777] flex flex-col items-center justify-center gap-2">
            <div className="text-4xl animate-bounce">🔍</div>
            <p className="font-bold text-sm text-[#323232]">No doodle chats found</p>
            <p className="text-xs">Try a different search query or start a new conversation!</p>
            <button
              onClick={onOpenNewChat}
              className="mt-2 doodle-button text-xs"
            >
              + Create New Chat
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-3 flex items-start gap-3 cursor-pointer transition-all border-b border-[#323232]/10 relative ${
                  isActive
                    ? "bg-[#fff9e6] border-l-4 border-l-[#ff6b6b] shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]"
                    : "hover:bg-[#faf4e1]/70"
                }`}
              >
                {/* Chat Avatar */}
                <div className="relative shrink-0">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-[#323232] flex items-center justify-center text-xl shadow-[2px_2px_0px_#323232] font-black"
                    style={{
                      backgroundColor: chat.avatarColor || "#ffd166",
                      borderRadius: "var(--sketch-radius-avatar)",
                    }}
                  >
                    {chat.avatar}
                  </div>
                  {/* Status Indicator / Verified */}
                  {chat.type === "channel" ? (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ff9f1c] text-[10px] text-white border border-[#323232] rounded-full flex items-center justify-center shadow-[1px_1px_0px_#323232]"
                      title="Channel"
                    >
                      📢
                    </span>
                  ) : chat.type === "group" ? (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4ecdc4] text-[10px] text-[#323232] border border-[#323232] rounded-full flex items-center justify-center shadow-[1px_1px_0px_#323232]"
                      title="Group"
                    >
                      👥
                    </span>
                  ) : chat.type === "saved" ? (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#ffd166] text-[10px] text-[#323232] border border-[#323232] rounded-full flex items-center justify-center shadow-[1px_1px_0px_#323232]"
                      title="Saved Cloud"
                    >
                      ⭐
                    </span>
                  ) : (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-[#323232] shadow-[1px_1px_0px_#323232]"
                      style={{
                        backgroundColor:
                          chat.id === "chat_alice" || chat.id === "chat_bot"
                            ? "#06d6a0"
                            : chat.id === "chat_bob"
                            ? "#ffd166"
                            : "#bbb",
                      }}
                    />
                  )}
                </div>

                {/* Chat Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <h3 className="font-bold text-sm text-[#323232] truncate" style={{ fontFamily: "var(--font-heading)" }}>
                        {chat.title}
                      </h3>
                      {chat.isVerified && (
                        <span className="text-xs text-[#2d8cf0]" title="Verified Channel">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-[#777] shrink-0">
                      {chat.lastMessage?.timestamp || ""}
                    </span>
                  </div>

                  {/* Message Snippet & Read Receipt */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-[#555] truncate font-medium flex items-center gap-1">
                      {chat.lastMessage?.isOutgoing && (
                        <DoodleChecks
                          isRead={chat.lastMessage?.status === "read"}
                          size={14}
                          className="shrink-0"
                        />
                      )}
                      {chat.draft ? (
                        <span className="text-[#ff5252] font-bold">Draft: {chat.draft}</span>
                      ) : (
                        <span className="truncate">{chat.lastMessage?.text || "No messages yet"}</span>
                      )}
                    </p>

                    {/* Unread Pill / Pinned Pin */}
                    <div className="flex items-center gap-1 shrink-0">
                      {chat.isPinned && (
                        <span title="Pinned Chat" className="text-[#888]">
                          <DoodlePin size={13} color="#555" fill="#555" />
                        </span>
                      )}
                      {chat.unreadCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#ff6b6b] text-[#323232] text-[11px] font-black border border-[#323232] flex items-center justify-center shadow-[1px_1px_0px_#323232]">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t-2 border-[#323232] bg-[#fff9e6] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full border-2 border-[#323232] flex items-center justify-center text-lg shadow-[2px_2px_0px_#323232] cursor-pointer"
            style={{ backgroundColor: currentUser.avatarColor || "#ffd166" }}
            onClick={onOpenSettings}
          >
            {currentUser.avatar}
          </div>
          <div className="cursor-pointer" onClick={onOpenSettings}>
            <div className="font-bold text-xs text-[#323232] flex items-center gap-1">
              {currentUser.name}
              <span className="text-[10px] text-[#06d6a0] font-black">● online</span>
            </div>
            <div className="text-[11px] text-[#777]">@{currentUser.username}</div>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="px-2.5 py-1 text-xs font-bold bg-[#e6f0ff] hover:bg-[#d0e4ff] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        >
          Profile
        </button>
      </div>
    </aside>
  );
};
