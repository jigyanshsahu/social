"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/types/chat";
import {
  DoodlePaperPlane,
  DoodlePaperclip,
  DoodleSmiley,
  DoodleMic,
  DoodleClose,
  DoodleStar,
} from "./DoodleIcons";
import { DOODLE_STICKERS, POPULAR_REACTION_EMOJIS } from "@/lib/mockChatData";

interface MessageInputProps {
  onSendMessage: (text: string, sticker?: string, attachmentType?: "image" | "voice" | "file") => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
  onTyping: () => void;
  draftText?: string;
  onDraftChange?: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  replyingTo,
  onCancelReply,
  onTyping,
  draftText = "",
  onDraftChange,
}) => {
  const [inputText, setInputText] = useState(draftText);
  const [showStickerDrawer, setShowStickerDrawer] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [drawerTab, setDrawerTab] = useState<"stickers" | "emojis">("stickers");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync draft
  useEffect(() => {
    setInputText(draftText);
  }, [draftText]);

  // Voice recording timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  const handleSend = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      onSendMessage(`🎤 Voice Note (${recordingSeconds}s)`, undefined, "voice");
      return;
    }

    if (inputText.trim() === "") return;
    onSendMessage(inputText.trim());
    setInputText("");
    if (onDraftChange) onDraftChange("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (onDraftChange) onDraftChange(e.target.value);
    onTyping();

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleSendSticker = (emoji: string) => {
    onSendMessage("", emoji);
    setShowStickerDrawer(false);
  };

  const handleSendEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    if (textareaRef.current) textareaRef.current.focus();
  };

  return (
    <div className="border-t-2 border-[#323232] bg-[#fff9e6] p-3 relative z-20">
      {/* Reply-To Preview Banner */}
      {replyingTo && (
        <div className="mb-2 p-2 bg-[#faf4e1] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] flex items-center justify-between animate-pop-in">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-1 bg-[#ff6b6b] h-8 rounded-full"></div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#ff6b6b]">
                Replying to {replyingTo.senderName}
              </div>
              <div className="text-xs text-[#555] truncate font-medium">
                {replyingTo.text || "Attached media"}
              </div>
            </div>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 hover:bg-[#ffeef2] rounded-full text-xs font-bold"
          >
            <DoodleClose size={16} />
          </button>
        </div>
      )}

      {/* Attach Popup Menu */}
      {showAttachMenu && (
        <div
          className="absolute bottom-16 left-4 bg-[#fffdf5] border-2 border-[#323232] rounded-xl shadow-[4px_4px_0px_#323232] p-2 flex flex-col gap-1.5 z-50 animate-pop-in w-44"
          style={{ borderRadius: "var(--sketch-radius-1)" }}
        >
          <button
            onClick={() => {
              setShowAttachMenu(false);
              onSendMessage("🖼️ Doodle Photo Snapshot", undefined, "image");
            }}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#ffeef2] rounded-lg text-xs font-bold text-left cursor-pointer"
          >
            <span>📷</span> Send Photo
          </button>
          <button
            onClick={() => {
              setShowAttachMenu(false);
              onSendMessage("📄 Sketchpad_Design_v2.pdf (1.2 MB)", undefined, "file");
            }}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#e6f0ff] rounded-lg text-xs font-bold text-left cursor-pointer"
          >
            <span>📎</span> Attach Document
          </button>
          <button
            onClick={() => {
              setShowAttachMenu(false);
              onSendMessage("📊 Poll: Which doodle color should we add next?\n1. Coral Red 💖\n2. Honey Yellow 🍯\n3. Mint Teal 🌿");
            }}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#fff3c4] rounded-lg text-xs font-bold text-left cursor-pointer"
          >
            <span>📊</span> Create Doodle Poll
          </button>
        </div>
      )}

      {/* Stickers & Emoji Picker Drawer */}
      {showStickerDrawer && (
        <div
          className="absolute bottom-16 right-4 sm:right-12 w-80 bg-[#fff9e6] border-2 border-[#323232] rounded-2xl shadow-[6px_6px_0px_#323232] p-3 z-50 animate-pop-in"
          style={{ borderRadius: "var(--sketch-radius-2)" }}
        >
          {/* Drawer Tabs */}
          <div className="flex items-center justify-between border-b-2 border-[#323232] pb-2 mb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setDrawerTab("stickers")}
                className={`px-3 py-1 rounded-full text-xs font-black border border-[#323232] ${
                  drawerTab === "stickers"
                    ? "bg-[#ff6b6b] text-[#323232] shadow-[1px_1px_0px_#323232]"
                    : "bg-white text-[#666]"
                }`}
              >
                🎨 Stickers
              </button>
              <button
                onClick={() => setDrawerTab("emojis")}
                className={`px-3 py-1 rounded-full text-xs font-black border border-[#323232] ${
                  drawerTab === "emojis"
                    ? "bg-[#ffd166] text-[#323232] shadow-[1px_1px_0px_#323232]"
                    : "bg-white text-[#666]"
                }`}
              >
                😊 Emojis
              </button>
            </div>
            <button
              onClick={() => setShowStickerDrawer(false)}
              className="p-1 hover:bg-[#ffeef2] rounded-full text-xs"
            >
              ✕
            </button>
          </div>

          {/* Tab Contents */}
          {drawerTab === "stickers" ? (
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
              {DOODLE_STICKERS.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => handleSendSticker(stk.emoji)}
                  title={stk.title}
                  className="w-14 h-14 rounded-xl border-2 border-[#323232] flex items-center justify-center text-3xl shadow-[2px_2px_0px_#323232] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  style={{ backgroundColor: stk.bg }}
                >
                  {stk.emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
              {POPULAR_REACTION_EMOJIS.concat([
                "😎", "🥳", "🤔", "😇", "💡", "☕", "🍕", "🎈", "🎁", "💖", "🎯", "🍿",
              ]).map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendEmoji(emoji)}
                  className="w-9 h-9 rounded-lg border border-[#323232] bg-white flex items-center justify-center text-xl hover:bg-[#fff9e6] hover:scale-125 transition-transform cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Input Control Bar */}
      <div className="flex items-end gap-2">
        {/* Attachment Paperclip Button */}
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          title="Attach file / photo / poll"
          className="w-10 h-10 rounded-xl bg-[#faf7ef] hover:bg-[#ffd166] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0 transition-colors"
          style={{ borderRadius: "var(--sketch-radius-btn)" }}
        >
          <DoodlePaperclip size={20} color="#323232" />
        </button>

        {/* Input Field / Voice Recording Banner */}
        <div className="flex-1 relative flex items-center">
          {isRecordingVoice ? (
            <div className="w-full py-2.5 px-4 bg-[#ffeef2] border-2 border-[#ff5252] rounded-xl flex items-center justify-between animate-pulse shadow-[2px_2px_0px_#323232]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5252] animate-ping"></span>
                <span className="text-xs font-black text-[#ff5252]">
                  Recording Audio... {recordingSeconds}s
                </span>
              </div>
              <button
                onClick={() => setIsRecordingVoice(false)}
                className="text-xs font-bold text-[#888] hover:text-[#ff5252]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Write a doodle message... (Enter to send)"
                value={inputText}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                className="w-full py-2.5 pl-4 pr-10 bg-white border-2 border-[#323232] rounded-xl text-sm font-semibold text-[#323232] focus:bg-[#fffdf5] focus:outline-none shadow-[2px_2px_0px_#323232] resize-none max-h-32 transition-all leading-normal"
                style={{ borderRadius: "var(--sketch-radius-1)" }}
              />
              {/* Sticker / Emoji Toggle Icon */}
              <button
                onClick={() => setShowStickerDrawer(!showStickerDrawer)}
                title="Stickers & Emojis"
                className="absolute right-2.5 p-1 text-[#666] hover:text-[#323232] hover:scale-110 transition-transform cursor-pointer"
              >
                <DoodleSmiley size={20} color="#323232" />
              </button>
            </>
          )}
        </div>

        {/* Voice Note / Send Button */}
        {inputText.trim() === "" && !isRecordingVoice ? (
          <button
            onClick={() => setIsRecordingVoice(true)}
            title="Record Voice Note"
            className="w-10 h-10 rounded-xl bg-[#4ecdc4] hover:bg-[#3bbfb6] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0 transition-colors"
            style={{ borderRadius: "var(--sketch-radius-btn)" }}
          >
            <DoodleMic size={20} color="#323232" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            title="Send Message"
            className="w-10 h-10 rounded-xl bg-[#ff6b6b] hover:bg-[#ff5252] border-2 border-[#323232] flex items-center justify-center shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0 transition-all transform hover:-rotate-6"
            style={{ borderRadius: "var(--sketch-radius-btn)" }}
          >
            <DoodlePaperPlane size={20} color="#323232" fill="#323232" />
          </button>
        )}
      </div>
    </div>
  );
};
