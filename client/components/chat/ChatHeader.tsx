"use client";

import React, { useState } from "react";
import { Chat } from "@/types/chat";
import {
  DoodlePhone,
  DoodleVideo,
  DoodleSearch,
  DoodleInfo,
  DoodleMore,
  DoodlePin,
  DoodleStar,
} from "./DoodleIcons";

interface ChatHeaderProps {
  chat: Chat;
  onBackToSidebar?: () => void;
  onToggleInfoDrawer: () => void;
  onToggleSearchInChat: () => void;
  isSearchingInChat: boolean;
  searchQueryInChat: string;
  onSearchInChatChange: (q: string) => void;
  isTyping?: boolean;
  onTogglePinChat: (chatId: string) => void;
  onClearChatHistory: (chatId: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  onBackToSidebar,
  onToggleInfoDrawer,
  onToggleSearchInChat,
  isSearchingInChat,
  searchQueryInChat,
  onSearchInChatChange,
  isTyping = false,
  onTogglePinChat,
  onClearChatHistory,
}) => {
  const [showCallModal, setShowCallModal] = useState<"audio" | "video" | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Status text
  let statusSubtitle = "last seen recently";
  if (chat.type === "channel") {
    statusSubtitle = "1.4K subscribers • Broadcast channel";
  } else if (chat.type === "group") {
    statusSubtitle = `${chat.members?.length || 4} members • 2 online`;
  } else if (chat.type === "saved") {
    statusSubtitle = "Cloud Storage • Saved Notes";
  } else if (isTyping) {
    statusSubtitle = "✏️ typing...";
  } else if (chat.id === "chat_alice" || chat.id === "chat_bot") {
    statusSubtitle = "online";
  } else if (chat.id === "chat_bob") {
    statusSubtitle = "last seen 20m ago";
  }

  return (
    <>
      <header className="px-4 py-3 border-b-2 border-[#323232] bg-[#fff9e6] flex items-center justify-between shadow-[0_2px_0px_rgba(0,0,0,0.04)] z-10">
        {/* Left Side: Avatar & Name */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToSidebar && (
            <button
              onClick={onBackToSidebar}
              className="md:hidden w-8 h-8 rounded-full border-2 border-[#323232] bg-[#ffeef2] flex items-center justify-center font-black shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5"
            >
              ←
            </button>
          )}

          {/* Avatar with click to open info drawer */}
          <div
            onClick={onToggleInfoDrawer}
            className="w-11 h-11 rounded-full border-2 border-[#323232] flex items-center justify-center text-xl shadow-[2px_2px_0px_#323232] shrink-0 cursor-pointer hover:scale-105 transition-transform"
            style={{
              backgroundColor: chat.avatarColor || "#ffd166",
              borderRadius: "var(--sketch-radius-avatar)",
            }}
          >
            {chat.avatar}
          </div>

          <div
            onClick={onToggleInfoDrawer}
            className="min-w-0 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <h2
                className="font-bold text-base text-[#323232] truncate leading-tight hover:underline"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {chat.title}
              </h2>
              {chat.isVerified && (
                <span className="text-xs text-[#2d8cf0]" title="Verified">
                  ✓
                </span>
              )}
              {chat.isPinned && (
                <span title="Pinned Chat">
                  <DoodlePin size={13} color="#555" fill="#555" />
                </span>
              )}
            </div>
            <p
              className={`text-xs font-semibold truncate ${
                isTyping ? "text-[#06d6a0] animate-pulse" : "text-[#777]"
              }`}
            >
              {statusSubtitle}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* In-chat search toggle */}
          <button
            onClick={onToggleSearchInChat}
            title="Search in conversation"
            className={`w-9 h-9 rounded-full border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all ${
              isSearchingInChat ? "bg-[#ffd166]" : "bg-[#faf7ef] hover:bg-[#fff0e6]"
            }`}
          >
            <DoodleSearch size={18} color="#323232" />
          </button>

          {/* Voice Call (DMs only) */}
          {chat.type === "direct" && (
            <button
              onClick={() => setShowCallModal("audio")}
              title="Voice Call"
              className="w-9 h-9 rounded-full bg-[#e8f7ee] hover:bg-[#c9f0d7] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
            >
              <DoodlePhone size={18} color="#323232" />
            </button>
          )}

          {/* Video Call (DMs only) */}
          {chat.type === "direct" && (
            <button
              onClick={() => setShowCallModal("video")}
              title="Video Call"
              className="w-9 h-9 rounded-full bg-[#e6f0ff] hover:bg-[#c8e1ff] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
            >
              <DoodleVideo size={18} color="#323232" />
            </button>
          )}

          {/* Info Panel Toggle */}
          <button
            onClick={onToggleInfoDrawer}
            title="Chat Info & Media"
            className="w-9 h-9 rounded-full bg-[#fffdf5] hover:bg-[#ffd166] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
          >
            <DoodleInfo size={19} color="#323232" />
          </button>

          {/* More options dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="w-9 h-9 rounded-full bg-[#fffdf5] hover:bg-[#e6f0ff] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer transition-all"
            >
              <DoodleMore size={18} color="#323232" />
            </button>

            {showMoreMenu && (
              <div
                className="absolute right-0 top-11 w-48 bg-[#fff9e6] border-2 border-[#323232] rounded-xl shadow-[4px_4px_0px_#323232] p-1.5 z-50 animate-pop-in"
                style={{ borderRadius: "var(--sketch-radius-1)" }}
              >
                <button
                  onClick={() => {
                    onTogglePinChat(chat.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-[#323232] hover:bg-[#ffd166] rounded-lg flex items-center gap-2"
                >
                  <DoodlePin size={15} />
                  {chat.isPinned ? "Unpin from top" : "Pin to top"}
                </button>
                <button
                  onClick={() => {
                    onToggleInfoDrawer();
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-[#323232] hover:bg-[#4ecdc4] rounded-lg flex items-center gap-2"
                >
                  <DoodleInfo size={15} />
                  View Details & Media
                </button>
                <div className="h-0.5 bg-[#323232]/20 my-1"></div>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear this chat history?")) {
                      onClearChatHistory(chat.id);
                    }
                    setShowMoreMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-[#ff5252] hover:bg-[#ffeef2] rounded-lg flex items-center gap-2"
                >
                  🗑️ Clear Chat History
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Embedded Search In-Chat Bar */}
      {isSearchingInChat && (
        <div className="px-4 py-2 bg-[#fcf8eb] border-b-2 border-[#323232] flex items-center justify-between gap-3 animate-pop-in">
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-3 text-[#555]">
              <DoodleSearch size={16} color="#323232" />
            </div>
            <input
              type="text"
              placeholder={`Search messages in ${chat.title}...`}
              value={searchQueryInChat}
              onChange={(e) => onSearchInChatChange(e.target.value)}
              className="w-full pl-8 pr-8 py-1 bg-white border-2 border-[#323232] rounded-lg text-xs font-semibold focus:outline-none shadow-[2px_2px_0px_#323232]"
              autoFocus
            />
            {searchQueryInChat && (
              <button
                onClick={() => onSearchInChatChange("")}
                className="absolute right-2 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={onToggleSearchInChat}
            className="text-xs font-bold px-2 py-1 bg-[#ffeef2] hover:bg-[#ff6b6b] border border-[#323232] rounded shadow-[1px_1px_0px_#323232]"
          >
            Close
          </button>
        </div>
      )}

      {/* Simulated Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div
            className="w-full max-w-sm bg-[#fff9e6] border-2 border-[#323232] rounded-2xl p-6 shadow-[6px_6px_0px_#323232] text-center relative animate-pop-in"
            style={{ borderRadius: "var(--sketch-radius-2)" }}
          >
            <div
              className="w-20 h-20 rounded-full border-2 border-[#323232] flex items-center justify-center text-4xl shadow-[4px_4px_0px_#323232] mx-auto mb-4 animate-bounce"
              style={{ backgroundColor: chat.avatarColor || "#ffd166" }}
            >
              {chat.avatar}
            </div>
            <h3 className="font-extrabold text-xl text-[#323232] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
              {chat.title}
            </h3>
            <p className="text-sm font-semibold text-[#06d6a0] mb-6 animate-pulse">
              {showCallModal === "video" ? "📹 Starting encrypted video call..." : "📞 Calling via Doodle Network..."}
            </p>

            {/* Audio wave simulation */}
            <div className="flex items-center justify-center gap-1.5 h-10 mb-6">
              {[40, 70, 90, 60, 100, 80, 50, 90, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#ff6b6b] border border-[#323232] rounded-full"
                  style={{
                    height: `${h}%`,
                    animation: `wave-bar 1s ease-in-out infinite ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* Call Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowCallModal(null)}
                className="px-6 py-2.5 bg-[#ff5252] hover:bg-[#e04040] text-white font-black text-sm border-2 border-[#323232] rounded-xl shadow-[3px_3px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                🔴 End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
