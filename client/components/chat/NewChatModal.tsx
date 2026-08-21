"use client";

import React, { useState } from "react";
import { Chat, ChatType } from "@/types/chat";
import { DoodleClose, DoodleStar, DoodleUsers, DoodleSpeaker } from "./DoodleIcons";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (newChat: Chat) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onCreateChat,
}) => {
  const [chatType, setChatType] = useState<ChatType>("direct");
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💬");
  const [selectedColor, setSelectedColor] = useState("#ffd166");

  if (!isOpen) return null;

  const emojiOptions = ["💬", "🚀", "🎨", "⚡", "🤖", "🥑", "💡", "🌈", "☕", "🎮", "🦄", "🔥"];
  const colorOptions = ["#ffd166", "#ff6b6b", "#4ecdc4", "#c3b1e1", "#ff9f1c", "#06d6a0"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newChat: Chat = {
      id: `chat_custom_${Date.now()}`,
      type: chatType,
      title: title.trim(),
      username: username.trim() || undefined,
      avatar: selectedEmoji,
      avatarColor: selectedColor,
      unreadCount: 0,
      description: description.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    onCreateChat(newChat);
    onClose();
    setTitle("");
    setUsername("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop-in">
      <div
        className="w-full max-w-md bg-[#fff9e6] border-2 border-[#323232] rounded-2xl shadow-[6px_6px_0px_#323232] p-5 relative overflow-hidden"
        style={{ borderRadius: "var(--sketch-radius-2)" }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#323232] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="font-black text-lg text-[#323232]" style={{ fontFamily: "var(--font-heading)" }}>
              Create New Doodle Chat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ffeef2] hover:bg-[#ff6b6b] border-2 border-[#323232] flex items-center justify-center font-black shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <DoodleClose size={14} />
          </button>
        </div>

        {/* Chat Type Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: "direct", label: "Direct DM", icon: "👤" },
            { id: "group", label: "Group Chat", icon: "👥" },
            { id: "channel", label: "Channel", icon: "📢" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setChatType(type.id as ChatType)}
              className={`p-2 rounded-xl text-xs font-bold border-2 border-[#323232] flex flex-col items-center gap-1 cursor-pointer transition-all ${
                chatType === type.id
                  ? "bg-[#ffd166] shadow-[2px_2px_0px_#323232] -translate-y-0.5"
                  : "bg-white/80 hover:bg-white text-[#666]"
              }`}
            >
              <span className="text-base">{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Avatar & Color Picker */}
          <div>
            <label className="block text-xs font-bold text-[#323232] mb-1">
              Select Avatar Emoji & Tint
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full border-2 border-[#323232] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#323232] shrink-0"
                style={{ backgroundColor: selectedColor }}
              >
                {selectedEmoji}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {emojiOptions.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      className={`w-7 h-7 rounded border border-[#323232] bg-white flex items-center justify-center text-sm hover:bg-[#fff9e6] cursor-pointer ${
                        selectedEmoji === em ? "bg-[#ffe66d] scale-110 font-bold" : ""
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-5 h-5 rounded-full border border-[#323232] cursor-pointer ${
                        selectedColor === c ? "ring-2 ring-[#323232] scale-110" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-[#323232] mb-1">
              {chatType === "direct"
                ? "Contact Name"
                : chatType === "group"
                ? "Group Name"
                : "Channel Name"}
            </label>
            <input
              type="text"
              required
              placeholder={
                chatType === "direct"
                  ? "e.g. Leonardo Doodle"
                  : chatType === "group"
                  ? "e.g. Sketch Masters Club"
                  : "e.g. Tech Doodle Dispatch"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="doodle-input text-xs"
            />
          </div>

          {/* Username / Handle */}
          <div>
            <label className="block text-xs font-bold text-[#323232] mb-1">
              Username / Handle (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. leonardo_art"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              className="doodle-input text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#323232] mb-1">
              Description / Bio
            </label>
            <textarea
              rows={2}
              placeholder="What is this chat all about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="doodle-input text-xs resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#ffeef2] text-xs font-bold border-2 border-[#323232] rounded-xl shadow-[2px_2px_0px_#323232] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ff6b6b] hover:bg-[#ff5252] text-xs font-black text-[#323232] border-2 border-[#323232] rounded-xl shadow-[3px_3px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            >
              Create Chat! 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
