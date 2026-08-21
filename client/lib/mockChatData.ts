import { User, Chat, Message } from "@/types/chat";

export const CURRENT_USER: User = {
  id: "user_me",
  name: "You (Explorer)",
  username: "doodle_master",
  avatar: "🚀",
  avatarColor: "#ffd166",
  status: "online",
  bio: "Sketching ideas & chatting at the speed of ink! ✏️✨",
  phone: "+1 234 567 8900",
};

export const INITIAL_USERS: Record<string, User> = {
  user_alice: {
    id: "user_alice",
    name: "Alice Smith",
    username: "alice_wonder",
    avatar: "🎨",
    avatarColor: "#ff6b6b",
    status: "online",
    bio: "Product designer & coffee enthusiast ☕",
    phone: "+1 415 555 0192",
  },
  user_bob: {
    id: "user_bob",
    name: "Bob Builder",
    username: "bob_codes",
    avatar: "⚡",
    avatarColor: "#4ecdc4",
    status: "away",
    lastSeen: "20m ago",
    bio: "Full-stack developer building cool web toys 🛠️",
  },
  user_charlie: {
    id: "user_charlie",
    name: "Charlie Dev",
    username: "charlie_arch",
    avatar: "🐱",
    avatarColor: "#c3b1e1",
    status: "offline",
    lastSeen: "2h ago",
    bio: "Open-source lover & terminal hacker 💻",
  },
  user_doodle_bot: {
    id: "user_doodle_bot",
    name: "Doodle AI Bot",
    username: "doodle_ai_bot",
    avatar: "🤖",
    avatarColor: "#06d6a0",
    status: "online",
    bio: "Official Telegram Doodle Helper Bot! Ask me anything.",
  },
};

export const INITIAL_CHATS: Chat[] = [
  {
    id: "chat_saved",
    type: "saved",
    title: "Saved Messages",
    avatar: "⭐",
    avatarColor: "#ffd166",
    isPinned: true,
    unreadCount: 0,
    lastMessage: {
      text: "Notes: Buy sketchbook paper and ink pens 🖊️",
      timestamp: "10:42 AM",
      isOutgoing: true,
      status: "read",
    },
    description: "Your cloud storage note pad. Forward messages here or write personal reminders!",
    createdAt: "2026-08-01",
  },
  {
    id: "chat_alice",
    type: "direct",
    title: "Alice Smith",
    username: "alice_wonder",
    avatar: "🎨",
    avatarColor: "#ff6b6b",
    isPinned: true,
    unreadCount: 2,
    lastMessage: {
      text: "Check out this new doodle color scheme! ✨",
      timestamp: "11:15 AM",
      isOutgoing: false,
      senderName: "Alice",
      status: "delivered",
    },
    description: "Alice is a UX/UI designer working on the neo-brutalist chat themes.",
    createdAt: "2026-08-05",
  },
  {
    id: "chat_dev_group",
    type: "group",
    title: "Creative Coders Club 🚀",
    username: "creative_coders",
    avatar: "💡",
    avatarColor: "#4ecdc4",
    isPinned: false,
    unreadCount: 5,
    lastMessage: {
      text: "Bob: Just deployed the new paper texture shader!",
      timestamp: "10:30 AM",
      senderName: "Bob",
      isOutgoing: false,
      status: "read",
    },
    members: [
      CURRENT_USER,
      INITIAL_USERS.user_alice,
      INITIAL_USERS.user_bob,
      INITIAL_USERS.user_charlie,
    ],
    description: "A playful hangout for frontend wizards, designers, and creative makers!",
    createdAt: "2026-07-20",
  },
  {
    id: "chat_channel_news",
    type: "channel",
    title: "Telegram Doodle News 📢",
    username: "doodlenews",
    avatar: "🗞️",
    avatarColor: "#ff9f1c",
    isVerified: true,
    unreadCount: 1,
    lastMessage: {
      text: "🎉 Major Update: Animated stickers and voice notes are now live in doodle edition!",
      timestamp: "Yesterday",
      senderName: "Telegram News",
      isOutgoing: false,
      status: "read",
    },
    description: "Official broadcast channel for Doodle Telegram updates, tips, and feature drops.",
    createdAt: "2026-06-15",
  },
  {
    id: "chat_bob",
    type: "direct",
    title: "Bob Builder",
    username: "bob_codes",
    avatar: "⚡",
    avatarColor: "#4ecdc4",
    unreadCount: 0,
    lastMessage: {
      text: "Voice note received! Sounds great 👍",
      timestamp: "Aug 20",
      isOutgoing: true,
      status: "read",
    },
    description: "Full-stack developer building cool web toys 🛠️",
    createdAt: "2026-08-10",
  },
  {
    id: "chat_bot",
    type: "direct",
    title: "Doodle AI Assistant",
    username: "doodle_ai_bot",
    avatar: "🤖",
    avatarColor: "#06d6a0",
    unreadCount: 0,
    lastMessage: {
      text: "I can help you sketch diagrams, organize reminders, and format notes! Try typing /help",
      timestamp: "Aug 19",
      senderName: "Doodle AI",
      isOutgoing: false,
      status: "read",
    },
    description: "AI-powered assistant equipped with doodle drawing tools and prompt generators.",
    createdAt: "2026-08-12",
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  chat_saved: [
    {
      id: "msg_s1",
      chatId: "chat_saved",
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: "Welcome to your personal Saved Notes space! Any files or ideas pinned here stay forever synced in the cloud. ☁️✨",
      timestamp: "09:00 AM",
      isOutgoing: true,
      status: "read",
      isPinned: true,
      reactions: [{ emoji: "⭐", count: 1, users: [CURRENT_USER.id] }],
    },
    {
      id: "msg_s2",
      chatId: "chat_saved",
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: "Notes: Buy sketchbook paper and ink pens 🖊️\n- 0.5mm Micron black ink\n- Pastel markers (Mint, Coral, Honey)\n- Hardcover notebook",
      timestamp: "10:42 AM",
      isOutgoing: true,
      status: "read",
      reactions: [],
    },
  ],
  chat_alice: [
    {
      id: "msg_a1",
      chatId: "chat_alice",
      senderId: "user_alice",
      senderName: "Alice Smith",
      text: "Hey! Did you check out the new doodle interface styles we drafted yesterday? 🎨",
      timestamp: "11:00 AM",
      isOutgoing: false,
      status: "read",
      reactions: [{ emoji: "❤️", count: 1, users: [CURRENT_USER.id] }],
    },
    {
      id: "msg_a2",
      chatId: "chat_alice",
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: "Yes! The hand-drawn borders and notebook paper look super fresh and lively!",
      timestamp: "11:05 AM",
      isOutgoing: true,
      status: "read",
      replyTo: {
        id: "msg_a1",
        senderName: "Alice Smith",
        text: "Hey! Did you check out the new doodle interface styles...",
      },
      reactions: [{ emoji: "🔥", count: 2, users: [CURRENT_USER.id, "user_alice"] }],
    },
    {
      id: "msg_a3",
      chatId: "chat_alice",
      senderId: "user_alice",
      senderName: "Alice Smith",
      text: "I also recorded a quick voice breakdown of the interactive micro-animations:",
      timestamp: "11:10 AM",
      isOutgoing: false,
      status: "read",
      reactions: [],
      attachments: [
        {
          id: "att_voice_1",
          type: "voice",
          url: "#",
          duration: 18,
          waveform: [30, 60, 40, 80, 100, 75, 45, 90, 60, 85, 50, 40, 70, 95, 60, 30, 20],
        },
      ],
    },
    {
      id: "msg_a4",
      chatId: "chat_alice",
      senderId: "user_alice",
      senderName: "Alice Smith",
      text: "Check out this new doodle color scheme! ✨",
      timestamp: "11:15 AM",
      isOutgoing: false,
      status: "delivered",
      reactions: [
        { emoji: "🎉", count: 1, users: ["user_alice"] },
        { emoji: "👍", count: 1, users: [CURRENT_USER.id] },
      ],
    },
  ],
  chat_dev_group: [
    {
      id: "msg_g1",
      chatId: "chat_dev_group",
      senderId: "user_charlie",
      senderName: "Charlie Dev",
      senderAvatar: "🐱",
      senderColor: "#c3b1e1",
      text: "Welcome team! Let's make sure our Telegram chat client feels snappy on mobile and desktop!",
      timestamp: "09:30 AM",
      isOutgoing: false,
      status: "read",
      isPinned: true,
      reactions: [{ emoji: "🚀", count: 4, users: [CURRENT_USER.id, "user_alice", "user_bob", "user_charlie"] }],
    },
    {
      id: "msg_g2",
      chatId: "chat_dev_group",
      senderId: "user_bob",
      senderName: "Bob Builder",
      senderAvatar: "⚡",
      senderColor: "#4ecdc4",
      text: "I just connected the custom SVG doodle icons and animated reaction bars!",
      timestamp: "10:15 AM",
      isOutgoing: false,
      status: "read",
      reactions: [{ emoji: "👏", count: 3, users: [CURRENT_USER.id, "user_alice", "user_bob"] }],
    },
    {
      id: "msg_g3",
      chatId: "chat_dev_group",
      senderId: "user_bob",
      senderName: "Bob Builder",
      senderAvatar: "⚡",
      senderColor: "#4ecdc4",
      text: "Just deployed the new paper texture shader! Give it a spin!",
      timestamp: "10:30 AM",
      isOutgoing: false,
      status: "read",
      reactions: [{ emoji: "🔥", count: 2, users: [CURRENT_USER.id, "user_alice"] }],
    },
  ],
  chat_channel_news: [
    {
      id: "msg_n1",
      chatId: "chat_channel_news",
      senderId: "channel_admin",
      senderName: "Telegram Doodle Official",
      text: "✨ WELCOME TO DOODLE TELEGRAM ✨\n\nA new playful way to chat with friends, organize channels, send voice notes, and share sketches in hand-crafted comic notebook style.",
      timestamp: "Aug 15",
      isOutgoing: false,
      status: "read",
      isPinned: true,
      reactions: [
        { emoji: "❤️", count: 142, users: [] },
        { emoji: "🔥", count: 98, users: [] },
        { emoji: "🎉", count: 85, users: [] },
      ],
    },
    {
      id: "msg_n2",
      chatId: "chat_channel_news",
      senderId: "channel_admin",
      senderName: "Telegram Doodle Official",
      text: "🎉 Major Update: Animated stickers, voice waveforms, doodle photo frames, and interactive emoji reactions are now live across all channels and direct chats! Stay tuned for more creative tools!",
      timestamp: "Yesterday",
      isOutgoing: false,
      status: "read",
      reactions: [
        { emoji: "🚀", count: 210, users: [] },
        { emoji: "👏", count: 164, users: [] },
      ],
    },
  ],
  chat_bob: [
    {
      id: "msg_b1",
      chatId: "chat_bob",
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: "Hey Bob! Do you have the latest design tokens for the doodle buttons?",
      timestamp: "Aug 20, 02:15 PM",
      isOutgoing: true,
      status: "read",
      reactions: [],
    },
    {
      id: "msg_b2",
      chatId: "chat_bob",
      senderId: "user_bob",
      senderName: "Bob Builder",
      text: "Sure thing! They are: --primary-btn: #ff6b6b, --secondary-btn: #4ecdc4, and --shadow-offset: 4px!",
      timestamp: "Aug 20, 02:18 PM",
      isOutgoing: false,
      status: "read",
      reactions: [{ emoji: "👍", count: 1, users: [CURRENT_USER.id] }],
    },
    {
      id: "msg_b3",
      chatId: "chat_bob",
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      text: "Voice note received! Sounds great 👍",
      timestamp: "Aug 20, 02:25 PM",
      isOutgoing: true,
      status: "read",
      reactions: [],
    },
  ],
  chat_bot: [
    {
      id: "msg_bot1",
      chatId: "chat_bot",
      senderId: "user_doodle_bot",
      senderName: "Doodle AI Assistant",
      text: "👋 Hi! I am your Doodle Telegram Assistant.\n\nHere are some things I can do:\n• Type anything to chat with me\n• Type /idea for creative drawing/coding sparks\n• Type /quote for playful inspiration\n• Type /help to see all interactive tricks!",
      timestamp: "Aug 19, 10:00 AM",
      isOutgoing: false,
      status: "read",
      isPinned: true,
      reactions: [{ emoji: "🤖", count: 1, users: [CURRENT_USER.id] }],
    },
  ],
};

export const DOODLE_STICKERS = [
  { id: "stk_1", emoji: "🚀", title: "Rocket Doodle", bg: "#fff9e6" },
  { id: "stk_2", emoji: "🎨", title: "Artist Palette", bg: "#e6f0ff" },
  { id: "stk_3", emoji: "⭐", title: "Golden Star", bg: "#fff3c4" },
  { id: "stk_4", emoji: "💖", title: "Sparkle Heart", bg: "#ffeef2" },
  { id: "stk_5", emoji: "🔥", title: "Blazing Fire", bg: "#fff0e6" },
  { id: "stk_6", emoji: "🎉", title: "Party Popper", bg: "#e8f7ee" },
  { id: "stk_7", emoji: "🐱", title: "Cool Cat", bg: "#f3ebff" },
  { id: "stk_8", emoji: "☕", title: "Hot Coffee", bg: "#fff9e6" },
  { id: "stk_9", emoji: "🍦", title: "Sweet Ice Cream", bg: "#ffeef2" },
  { id: "stk_10", emoji: "⚡", title: "Lightning Bolt", bg: "#fff3c4" },
  { id: "stk_11", emoji: "🍕", title: "Tasty Pizza", bg: "#fff0e6" },
  { id: "stk_12", emoji: "🌈", title: "Magic Rainbow", bg: "#e6f0ff" },
];

export const POPULAR_REACTION_EMOJIS = ["👍", "❤️", "🔥", "🎉", "🚀", "👏", "⭐", "💩", "🤯", "😍"];

// Bot auto response helper
export function generateBotReply(incomingText: string, chatTitle: string): string {
  const lower = incomingText.toLowerCase();

  if (lower.includes("/idea")) {
    const ideas = [
      "💡 Doodle Idea: Create a comic strip where buttons revolt against hover animations!",
      "💡 Doodle Idea: Design an interactive soundboard with hand-drawn drum pads!",
      "💡 Doodle Idea: Build an animated sticky note board that wobbles on click!",
    ];
    return ideas[Math.floor(Math.random() * ideas.length)];
  }

  if (lower.includes("/quote")) {
    const quotes = [
      "✨ 'Creativity is intelligence having fun.' — Albert Einstein",
      "🎨 'Every artist was first an amateur.' — Ralph Waldo Emerson",
      "🚀 'Simplicity is the soul of efficiency.' — Austin Freeman",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  if (lower.includes("/help")) {
    return "🤖 Doodle Bot Commands:\n• /idea - Generates creative sparks\n• /quote - Inspiring quote of the day\n• /echo [text] - Echoes your message\n• Or just say hello!";
  }

  if (lower.startsWith("/echo ")) {
    return `📢 Echo: "${incomingText.replace("/echo ", "")}"`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
    return `👋 Hey there! Loving the fresh doodle vibes in ${chatTitle}! How can I assist your creative day? ✨`;
  }

  const defaultReplies = [
    `That sounds fantastic! 🎨 Let's sketch it into reality!`,
    `Got it! Added a doodle note on our notebook board 📝`,
    `Awesome message! The ink never fades on these ideas 🚀`,
    `Haha love this! Telegram Doodle edition is rolling along nicely! ✨`,
    `Totally agree with you! Sending some doodle stars your way ⭐`,
  ];

  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}
