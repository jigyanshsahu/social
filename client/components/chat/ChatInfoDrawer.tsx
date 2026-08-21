"use client";

import React, { useState } from "react";
import { Chat, User } from "@/types/chat";
import {
  DoodleClose,
  DoodlePhone,
  DoodleVideo,
  DoodleUsers,
  DoodleStar,
  DoodlePin,
} from "./DoodleIcons";

interface ChatInfoDrawerProps {
  chat: Chat;
  onClose: () => void;
  onClearHistory: () => void;
  isOpen: boolean;
}

export const ChatInfoDrawer: React.FC<ChatInfoDrawerProps> = ({
  chat,
  onClose,
  onClearHistory,
  isOpen,
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<"media" | "files" | "voice" | "links">("media");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <aside className="w-full md:w-80 lg:w-88 border-l-2 border-[#323232] bg-[#fff9e6] flex flex-col h-full overflow-y-auto select-none z-30 animate-pop-in shadow-[-4px_0px_0px_rgba(0,0,0,0.05)]">
      {/* Drawer Header */}
      <div className="p-3 border-b-2 border-[#323232] bg-[#fffdf5] flex items-center justify-between">
        <h3 className="font-bold text-sm text-[#323232] flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
          <span>User Info</span>
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#ffeef2] hover:bg-[#ff6b6b] border-2 border-[#323232] flex items-center justify-center font-bold shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          <DoodleClose size={15} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-5 flex flex-col items-center text-center border-b-2 border-[#323232] bg-[#fdfaf2]">
        <div
          className="w-24 h-24 rounded-full border-2 border-[#323232] flex items-center justify-center text-5xl shadow-[4px_4px_0px_#323232] mb-3 transform hover:rotate-6 transition-transform"
          style={{
            backgroundColor: chat.avatarColor || "#ffd166",
            borderRadius: "var(--sketch-radius-avatar)",
          }}
        >
          {chat.avatar}
        </div>
        <h2 className="font-black text-lg text-[#323232] leading-snug flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
          {chat.title}
          {chat.isVerified && (
            <span className="text-xs text-[#2d8cf0]" title="Verified">
              ✓
            </span>
          )}
        </h2>
        <p className="text-xs font-bold text-[#777] mt-0.5">
          {chat.username ? `@${chat.username}` : "Telegram User"}
        </p>

        {/* Quick Action Buttons (Call / Video / Pin) */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => alert(`Calling ${chat.title}...`)}
            className="w-10 h-10 rounded-xl bg-[#e8f7ee] hover:bg-[#c9f0d7] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            title="Audio Call"
          >
            <DoodlePhone size={18} color="#323232" />
          </button>
          <button
            onClick={() => alert(`Starting video with ${chat.title}...`)}
            className="w-10 h-10 rounded-xl bg-[#e6f0ff] hover:bg-[#c8e1ff] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            title="Video Call"
          >
            <DoodleVideo size={18} color="#323232" />
          </button>
          <button
            onClick={() => alert("Chat pinned!")}
            className="w-10 h-10 rounded-xl bg-[#fff3c4] hover:bg-[#ffd166] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            title="Pin Chat"
          >
            <DoodlePin size={18} color="#323232" />
          </button>
        </div>
      </div>

      {/* Info & Bio Section */}
      <div className="p-4 border-b-2 border-[#323232] bg-white space-y-3">
        {chat.description && (
          <div>
            <div className="text-[11px] font-black text-[#888] uppercase tracking-wider">
              Bio / Description
            </div>
            <p className="text-xs font-semibold text-[#323232] mt-0.5 leading-relaxed">
              {chat.description}
            </p>
          </div>
        )}

        {/* Notifications Switch (Doodle Style from Login page) */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-xs font-bold text-[#323232]">Notifications</div>
            <div className="text-[11px] text-[#777]">Sound & alert popups</div>
          </div>
          <div
            onClick={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
            className="w-12 h-6 rounded-full border-2 border-[#323232] relative cursor-pointer shadow-[2px_2px_0px_#323232] transition-colors"
            style={{
              backgroundColor: isNotificationsEnabled ? "#ffe66d" : "#e0e0e0",
            }}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white border-2 border-[#323232] absolute top-0.5 transition-transform ${
                isNotificationsEnabled ? "left-6" : "left-1"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Group Members List (if group) */}
      {chat.type === "group" && chat.members && (
        <div className="p-4 border-b-2 border-[#323232] bg-[#fcf9f2]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-[#323232] uppercase tracking-wider flex items-center gap-1">
              <DoodleUsers size={15} /> Members ({chat.members.length})
            </span>
          </div>
          <div className="space-y-2">
            {chat.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white border border-transparent hover:border-[#323232]/20 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full border border-[#323232] flex items-center justify-center text-sm shadow-[1px_1px_0px_#323232]"
                    style={{ backgroundColor: member.avatarColor || "#ffd166" }}
                  >
                    {member.avatar}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#323232]">
                      {member.name}
                    </div>
                    <div className="text-[10px] text-[#777]">
                      {member.status === "online" ? "online" : "last seen recently"}
                    </div>
                  </div>
                </div>
                {member.id === "user_charlie" && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 bg-[#ffd166] border border-[#323232] rounded">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared Media Tabs */}
      <div className="flex-1 p-4 bg-[#fffdf5]">
        <div className="flex items-center justify-between border-b-2 border-[#323232] pb-2 mb-3">
          {[
            { id: "media", label: "Media" },
            { id: "files", label: "Files" },
            { id: "voice", label: "Voice" },
            { id: "links", label: "Links" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMediaTab(tab.id as any)}
              className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                activeMediaTab === tab.id
                  ? "bg-[#ff6b6b] text-[#323232] shadow-[1px_1px_0px_#323232] border border-[#323232]"
                  : "text-[#666] hover:text-[#323232]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Media Tab Contents */}
        {activeMediaTab === "media" && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-[#ffeef2] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] flex items-center justify-center text-xl hover:scale-105 transition-transform cursor-pointer"
              >
                {i % 2 === 0 ? "🎨" : "🚀"}
              </div>
            ))}
          </div>
        )}

        {activeMediaTab === "files" && (
          <div className="space-y-2">
            {["Notebook_Theme.fig", "API_Documentation.pdf", "Audio_Notes.zip"].map(
              (file, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] flex items-center gap-2 text-xs font-bold"
                >
                  <span className="text-base">📄</span>
                  <div className="truncate flex-1">{file}</div>
                  <span className="text-[10px] text-[#777]">1.4MB</span>
                </div>
              )
            )}
          </div>
        )}

        {activeMediaTab === "voice" && (
          <div className="space-y-2">
            {["Voice Note #1 (0:18)", "Voice Note #2 (0:45)"].map((v, idx) => (
              <div
                key={idx}
                className="p-2 bg-white border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] flex items-center justify-between text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <span>🎙️</span>
                  <span>{v}</span>
                </div>
                <span className="text-xs">▶</span>
              </div>
            ))}
          </div>
        )}

        {activeMediaTab === "links" && (
          <div className="space-y-2">
            {[
              { title: "Doodle Design Library", url: "https://doodle.dev" },
              { title: "Telegram Web Portal", url: "https://t.me" },
            ].map((link, idx) => (
              <div
                key={idx}
                className="p-2 bg-white border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] text-xs"
              >
                <div className="font-bold text-[#2d8cf0] underline">
                  {link.title}
                </div>
                <div className="text-[11px] text-[#888]">{link.url}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Actions Footer */}
      <div className="p-3 border-t-2 border-[#323232] bg-[#faf7ef]">
        <button
          onClick={() => {
            if (confirm("Clear all messages in this chat?")) {
              onClearHistory();
            }
          }}
          className="w-full py-2 bg-[#ffeef2] hover:bg-[#ff5252] hover:text-white text-[#ff5252] border-2 border-[#323232] rounded-xl text-xs font-black shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          🗑️ Clear Chat History
        </button>
      </div>
    </aside>
  );
};
