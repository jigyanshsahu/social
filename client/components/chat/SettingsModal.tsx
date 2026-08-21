"use client";

import React, { useState } from "react";
import { User } from "@/types/chat";
import { DoodleClose, DoodleSettings, DoodleStar } from "./DoodleIcons";
import { clearToken } from "@/lib/api";
import { useRouter } from "next/navigation";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updated: User) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const router = useRouter();
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarColor, setAvatarColor] = useState(currentUser.avatarColor);
  const [paperTheme, setPaperTheme] = useState<"cream" | "blue" | "pink" | "grid">("cream");

  if (!isOpen) return null;

  const emojiOptions = ["🚀", "🎨", "⚡", "🤖", "🥑", "💡", "🦄", "🐱", "🐶", "⭐", "🔥", "🍀"];
  const colorOptions = ["#ffd166", "#ff6b6b", "#4ecdc4", "#c3b1e1", "#ff9f1c", "#06d6a0"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      username,
      bio,
      avatar,
      avatarColor,
    });
    onClose();
  };

  const handleLogout = () => {
    clearToken();
    router.push("/auth?mode=login");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop-in">
      <div
        className="w-full max-w-md bg-[#fff9e6] border-2 border-[#323232] rounded-2xl shadow-[6px_6px_0px_#323232] p-5 relative overflow-hidden"
        style={{ borderRadius: "var(--sketch-radius-1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#323232] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h3 className="font-black text-lg text-[#323232]" style={{ fontFamily: "var(--font-heading)" }}>
              Doodle Settings & Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#ffeef2] hover:bg-[#ff6b6b] border-2 border-[#323232] flex items-center justify-center font-black shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <DoodleClose size={14} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Avatar Customization */}
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-full border-2 border-[#323232] flex items-center justify-center text-3xl shadow-[3px_3px_0px_#323232] shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {avatar}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap gap-1">
                {emojiOptions.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setAvatar(em)}
                    className={`w-6 h-6 rounded border border-[#323232] bg-white flex items-center justify-center text-xs cursor-pointer ${
                      avatar === em ? "bg-[#ffe66d] scale-110 font-bold" : ""
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
                    onClick={() => setAvatarColor(c)}
                    className={`w-4 h-4 rounded-full border border-[#323232] cursor-pointer ${
                      avatarColor === c ? "ring-2 ring-[#323232] scale-110" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Name & Username */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#323232] mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="doodle-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#323232] mb-1">
                Username (@)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                className="doodle-input text-xs"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-[#323232] mb-1">
              About / Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="doodle-input text-xs resize-none"
            />
          </div>

          {/* Paper Texture Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-[#323232] mb-1">
              Notebook Paper Aesthetic
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: "cream", label: "Cream Lined", bg: "#fff9e6" },
                { id: "blue", label: "Sky Paper", bg: "#e6f0ff" },
                { id: "pink", label: "Pastel Pink", bg: "#ffeef2" },
                { id: "grid", label: "Graph Grid", bg: "#fcf9f2" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setPaperTheme(theme.id as any)}
                  className={`p-1.5 rounded-lg border-2 border-[#323232] text-[10px] font-bold text-center cursor-pointer ${
                    paperTheme === theme.id ? "ring-2 ring-[#ff6b6b] scale-105" : ""
                  }`}
                  style={{ backgroundColor: theme.bg }}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t-2 border-[#323232]">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[#ffeef2] hover:bg-[#ff5252] hover:text-white text-[#ff5252] text-xs font-bold border-2 border-[#323232] rounded-xl shadow-[2px_2px_0px_#323232] cursor-pointer"
            >
              🚪 Sign Out
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-white text-xs font-bold border-2 border-[#323232] rounded-xl shadow-[2px_2px_0px_#323232] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#4ecdc4] hover:bg-[#3bbfb6] text-xs font-black text-[#323232] border-2 border-[#323232] rounded-xl shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                Save Changes! ✨
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
