"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message, Chat, User } from "@/types/chat";
import {
  DoodleChecks,
  DoodlePin,
  DoodleReply,
  DoodleTrash,
  DoodleSmiley,
  DoodleMic,
  DoodleStar,
} from "./DoodleIcons";
import { POPULAR_REACTION_EMOJIS } from "@/lib/mockChatData";

interface MessageListProps {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  onReplyToMessage: (message: Message) => void;
  onTogglePinMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  highlightedMessageId?: string | null;
  searchFilter?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  chat,
  messages,
  currentUser,
  onReplyToMessage,
  onTogglePinMessage,
  onDeleteMessage,
  onToggleReaction,
  highlightedMessageId,
  searchFilter = "",
}) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<Record<string, number>>({});
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [reactionPickerMsgId, setReactionPickerMsgId] = useState<string | null>(null);

  // Auto-scroll to bottom on new messages if not searching
  useEffect(() => {
    if (!searchFilter) {
      scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, searchFilter]);

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightedMessageId && messageRefs.current[highlightedMessageId]) {
      messageRefs.current[highlightedMessageId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedMessageId]);

  // Simulated Voice Note Playback Timer
  useEffect(() => {
    if (!playingVoiceId) return;

    const interval = setInterval(() => {
      setVoiceProgress((prev) => {
        const current = prev[playingVoiceId] || 0;
        if (current >= 100) {
          setPlayingVoiceId(null);
          return { ...prev, [playingVoiceId]: 0 };
        }
        return { ...prev, [playingVoiceId]: current + 5 };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [playingVoiceId]);

  const toggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(msgId);
    }
  };

  // Find pinned message if any
  const pinnedMessage = messages.find((m) => m.isPinned);

  // Filter messages by search if active
  const displayedMessages = searchFilter
    ? messages.filter((m) =>
        m.text.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : messages;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#faf7ef] doodle-bg-notebook relative select-text overflow-hidden">
      {/* Pinned Message Banner (Telegram Style) */}
      {pinnedMessage && (
        <div
          onClick={() => {
            if (messageRefs.current[pinnedMessage.id]) {
              messageRefs.current[pinnedMessage.id]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }}
          className="px-4 py-2 bg-[#fff3c4] border-b-2 border-[#323232] flex items-center justify-between gap-2 shadow-[0_2px_4px_rgba(0,0,0,0.05)] cursor-pointer hover:bg-[#ffeaa7] transition-colors z-10 shrink-0"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-[#ff6b6b] shrink-0 animate-bounce">
              <DoodlePin size={16} fill="#ff6b6b" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-black text-[#ff6b6b] tracking-wider uppercase">
                Pinned Message
              </div>
              <p className="text-xs font-semibold text-[#323232] truncate">
                {pinnedMessage.text || "Attached media / voice note"}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePinMessage(pinnedMessage.id);
            }}
            title="Unpin message"
            className="text-xs font-bold text-[#888] hover:text-[#323232] px-1.5 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {displayedMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#777]">
            <div className="text-5xl mb-2 animate-bounce">✏️</div>
            <h4
              className="text-lg font-bold text-[#323232]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {searchFilter ? "No matching messages" : "Start sketching ideas!"}
            </h4>
            <p className="text-xs max-w-xs mt-1">
              {searchFilter
                ? `No messages matching "${searchFilter}" in this chat.`
                : "Type a message below, send a voice note, or drop a playful doodle sticker!"}
            </p>
          </div>
        ) : (
          displayedMessages.map((msg, index) => {
            const isOutgoing = msg.isOutgoing;
            const isHighlighted = highlightedMessageId === msg.id;

            return (
              <div
                key={msg.id}
                ref={(el) => {
                  messageRefs.current[msg.id] = el;
                }}
                onMouseEnter={() => setHoveredMessageId(msg.id)}
                onMouseLeave={() => {
                  setHoveredMessageId(null);
                  if (reactionPickerMsgId === msg.id) setReactionPickerMsgId(null);
                }}
                className={`flex flex-col ${
                  isOutgoing ? "items-end" : "items-start"
                } group relative transition-all ${
                  isHighlighted ? "scale-[1.02] duration-300" : ""
                }`}
              >
                {/* Sender Name in Groups (for incoming messages) */}
                {chat.type === "group" && !isOutgoing && (
                  <div className="flex items-center gap-1.5 ml-3 mb-1">
                    <span
                      className="w-5 h-5 rounded-full border border-[#323232] flex items-center justify-center text-[10px] shadow-[1px_1px_0px_#323232]"
                      style={{ backgroundColor: msg.senderColor || "#ffd166" }}
                    >
                      {msg.senderAvatar || "👤"}
                    </span>
                    <span className="text-xs font-bold text-[#444]">
                      {msg.senderName}
                    </span>
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className="relative max-w-[85%] sm:max-w-[75%] md:max-w-[68%]">
                  {/* Floating Action Menu on Hover */}
                  {hoveredMessageId === msg.id && (
                    <div
                      className={`absolute -top-7 ${
                        isOutgoing ? "right-0" : "left-0"
                      } bg-[#fff9e6] border-2 border-[#323232] rounded-lg shadow-[2px_2px_0px_#323232] flex items-center gap-1 px-1.5 py-0.5 z-20 animate-pop-in`}
                    >
                      {/* Reaction Picker Button */}
                      <button
                        onClick={() =>
                          setReactionPickerMsgId(
                            reactionPickerMsgId === msg.id ? null : msg.id
                          )
                        }
                        title="Add Reaction"
                        className="p-1 hover:bg-[#ffe66d] rounded cursor-pointer transition-colors"
                      >
                        <DoodleSmiley size={14} color="#323232" />
                      </button>

                      {/* Reply Button */}
                      <button
                        onClick={() => onReplyToMessage(msg)}
                        title="Reply"
                        className="p-1 hover:bg-[#4ecdc4] rounded cursor-pointer transition-colors"
                      >
                        <DoodleReply size={14} color="#323232" />
                      </button>

                      {/* Pin Button */}
                      <button
                        onClick={() => onTogglePinMessage(msg.id)}
                        title={msg.isPinned ? "Unpin" : "Pin"}
                        className="p-1 hover:bg-[#ffd166] rounded cursor-pointer transition-colors"
                      >
                        <DoodlePin
                          size={14}
                          color="#323232"
                          fill={msg.isPinned ? "#323232" : "none"}
                        />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        title="Delete"
                        className="p-1 hover:bg-[#ff5252] hover:text-white rounded cursor-pointer transition-colors"
                      >
                        <DoodleTrash size={14} color="#323232" />
                      </button>
                    </div>
                  )}

                  {/* Reaction Picker Popover */}
                  {reactionPickerMsgId === msg.id && (
                    <div
                      className={`absolute -top-14 ${
                        isOutgoing ? "right-0" : "left-0"
                      } bg-[#fff9e6] border-2 border-[#323232] rounded-full shadow-[4px_4px_0px_#323232] flex items-center gap-1 p-1 z-30 animate-pop-in`}
                    >
                      {POPULAR_REACTION_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => {
                            onToggleReaction(msg.id, emoji);
                            setReactionPickerMsgId(null);
                          }}
                          className="w-7 h-7 flex items-center justify-center hover:scale-125 transition-transform text-sm cursor-pointer rounded-full hover:bg-white/80"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message Bubble Body */}
                  <div
                    className={`p-3 relative select-text ${
                      isOutgoing ? "doodle-bubble-out" : "doodle-bubble-in"
                    } ${
                      isHighlighted
                        ? "!border-[#ff6b6b] !shadow-[4px_4px_0px_#ff6b6b]"
                        : ""
                    }`}
                  >
                    {/* Reply-To Preview Header */}
                    {msg.replyTo && (
                      <div
                        onClick={() => {
                          if (
                            msg.replyTo?.id &&
                            messageRefs.current[msg.replyTo.id]
                          ) {
                            messageRefs.current[
                              msg.replyTo.id
                            ]?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                        }}
                        className="mb-2 p-2 bg-black/5 border-l-4 border-l-[#ff6b6b] rounded-r text-xs cursor-pointer hover:bg-black/10 transition-colors"
                      >
                        <div className="font-bold text-[#ff6b6b]">
                          {msg.replyTo.senderName}
                        </div>
                        <div className="truncate text-[#555] italic">
                          {msg.replyTo.text}
                        </div>
                      </div>
                    )}

                    {/* Forwarded Tag */}
                    {msg.forwardFrom && (
                      <div className="text-[11px] font-bold text-[#777] mb-1 italic flex items-center gap-1">
                        <span>↪ Forwarded from {msg.forwardFrom}</span>
                      </div>
                    )}

                    {/* Sticker Content */}
                    {msg.stickerUrl && (
                      <div className="my-1 flex items-center justify-center p-2">
                        <div className="text-6xl animate-bounce transform hover:scale-110 transition-transform">
                          {msg.stickerUrl}
                        </div>
                      </div>
                    )}

                    {/* Voice Note Audio Player Attachment */}
                    {msg.attachments?.some((a) => a.type === "voice") && (
                      <div className="my-2 p-2.5 bg-[#fdfaf2] border-2 border-[#323232] rounded-xl shadow-[2px_2px_0px_#323232] flex items-center gap-3">
                        <button
                          onClick={() => toggleVoicePlayback(msg.id)}
                          className="w-10 h-10 rounded-full bg-[#4ecdc4] hover:bg-[#3bbfb6] border-2 border-[#323232] flex items-center justify-center text-sm font-black shadow-[2px_2px_0px_#323232] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0"
                        >
                          {playingVoiceId === msg.id ? "⏸" : "▶"}
                        </button>
                        <div className="flex-1">
                          {/* Animated / Simulated Waveform */}
                          <div className="flex items-center gap-1 h-6">
                            {[30, 70, 45, 90, 100, 60, 40, 85, 95, 55, 75, 40, 65, 80, 50].map(
                              (height, i) => {
                                const isPlayed =
                                  (i / 15) * 100 <=
                                  (voiceProgress[msg.id] || 0);
                                return (
                                  <div
                                    key={i}
                                    className={`w-1 rounded-full transition-all ${
                                      isPlayed
                                        ? "bg-[#ff6b6b] scale-y-110"
                                        : "bg-[#323232]/40"
                                    }`}
                                    style={{
                                      height: `${height}%`,
                                      animation:
                                        playingVoiceId === msg.id
                                          ? `wave-bar 0.8s ease-in-out infinite ${
                                              i * 0.08
                                            }s`
                                          : "none",
                                    }}
                                  />
                                );
                              }
                            )}
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-[#666] mt-1">
                            <span>Voice Note</span>
                            <span>0:18</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Attachments */}
                    {msg.attachments?.some((a) => a.type === "image") && (
                      <div className="my-2 doodle-frame">
                        <div className="w-full h-44 bg-[#ffeef2] rounded-lg border border-[#323232] flex items-center justify-center text-4xl shadow-inner relative overflow-hidden">
                          🖼️
                          <div className="absolute bottom-1 right-2 text-[10px] font-bold bg-white/80 px-1.5 rounded border border-[#323232]">
                            Doodle Snapshot
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Text */}
                    {msg.text && (
                      <div className="text-sm font-semibold text-[#323232] leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </div>
                    )}

                    {/* Message Meta (Time + Checks + Pin indicator) */}
                    <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[11px] font-bold text-[#777] select-none">
                      {msg.isPinned && (
                        <span title="Pinned">
                          <DoodlePin size={11} color="#ff6b6b" fill="#ff6b6b" />
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                      {isOutgoing && (
                        <DoodleChecks
                          isRead={msg.status === "read"}
                          size={15}
                          className="shrink-0"
                        />
                      )}
                    </div>
                  </div>

                  {/* Reaction Badges Bar */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div
                      className={`flex flex-wrap gap-1 mt-1 ${
                        isOutgoing ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.reactions.map((reaction) => {
                        const hasReacted = reaction.users.includes(
                          currentUser.id
                        );
                        return (
                          <button
                            key={reaction.emoji}
                            onClick={() =>
                              onToggleReaction(msg.id, reaction.emoji)
                            }
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold border-2 border-[#323232] rounded-full shadow-[1px_1px_0px_#323232] transition-all cursor-pointer ${
                              hasReacted
                                ? "bg-[#ffd166] scale-105"
                                : "bg-white hover:bg-[#fff9e6]"
                            }`}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-[11px] text-[#323232]">
                              {reaction.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollEndRef} />
      </div>
    </div>
  );
};
