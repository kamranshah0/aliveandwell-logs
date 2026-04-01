import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smile, Plus, SendHorizontal, Search } from "lucide-react";
import { TbUserPlus } from "react-icons/tb";
import { IoAttachOutline } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import FormLabel from "./FormLabel";
import FormInput from "./FormInput";

// ----------------- Types -----------------
type Reaction = { emoji: string; count: number };

type NormalMessage = {
  id: number;
  sender: string;
  text: string;
  time: string;
  reactions: Reaction[];
};

type SystemMessage = {
  id: number;
  system: true;
  text: string;
  time: string;
  reactions: Reaction[];
};

type ChatMessageType = NormalMessage | SystemMessage;

type Participant = {
  id: number;
  name: string;
  role: string;
  avatar: string;
};

// ----------------- Dummy Participants -----------------
const allParticipants: Participant[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
    avatar: "https://i.pravatar.cc/40?u=1",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Member",
    avatar: "https://i.pravatar.cc/40?u=2",
  },
  {
    id: 3,
    name: "Maria Torres",
    role: "Member",
    avatar: "https://i.pravatar.cc/40?u=3",
  },
];

// ----------------- ChatMessage Component -----------------
function ChatMessage({
  message,
  isOwn,
  onReact,
  onRemoveReaction,
}: {
  message: ChatMessageType;
  isOwn: boolean;
  onReact: (id: number, emoji: string) => void;
  onRemoveReaction: (id: number, emoji: string) => void;
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactButton, setShowReactButton] = useState(false);
  const msgRef = useRef<HTMLDivElement | null>(null);

  // Detect text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (
        selection &&
        selection.toString().trim().length > 0 &&
        msgRef.current &&
        msgRef.current.contains(selection.anchorNode)
      ) {
        setShowReactButton(true);
      } else {
        setShowReactButton(false);
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);

  // System Message UI
  if ("system" in message && message.system) {
    return (
      <div className="flex justify-center my-2">
        <div className="text-center text-text-high-em text-sm bg-gray-100 px-3 py-1 rounded-full">
          {message.text}
        </div>
      </div>
    );
  }

  // Normal Message UI
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} `}>
      <div className={`flex  gap-3 max-w-[90%] mb-4 `}>
        {!isOwn && (
          <img
            src="/images/avatar.png"
            alt=""
            className="size-10 rounded-full"
          />
        )}

        <div
          className={`flex flex-col  ${isOwn ? "items-end" : "items-start"}`}
        >
          {/* Sender & Time */}
          <div className="flex items-center justify-between w-full max-w-md mb-2">
            <span className="text-sm text-text-low-em">
              {"system" in message ? "" : isOwn ? "You" : message.sender}
            </span>
            <span className="text-xs text-text-low-em">{message.time}</span>
          </div>

          {/* Message Bubble */}
          <div className="relative max-w-md" ref={msgRef}>
            <div
              className={`p-4 rounded-2xl   whitespace-pre-line break-words ${
                isOwn
                  ? "bg-surface-brand-primary-main text-white rounded-tr-none"
                  : "bg-surface-1 text-text-high-em rounded-tl-none"
              }`}
            >
              {message.text}
            </div>

            {/* Reaction Button */}
            {showReactButton && (
              <div
                className={`absolute ${
                  isOwn ? "left-0 -ml-8" : "right-0 -mr-8"
                } 
            top-1/2 -translate-y-1/2 flex`}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Emoji Picker (aligned under bubble) */}
            {showEmojiPicker && (
              <div
                className={`absolute z-20 ${
                  isOwn ? "right-0" : "left-0"
                } top-full mt-2`}
              >
                <EmojiPicker
                  onEmojiClick={(emoji) => {
                    onReact(message.id, emoji.emoji);
                    setShowEmojiPicker(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {message.reactions.map((r, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-sm shadow"
                >
                  <span
                    className="cursor-pointer"
                    onClick={() => onReact(message.id, r.emoji)}
                  >
                    {r.emoji}
                  </span>
                  <span className="text-xs text-text-high-em">{r.count}</span>

                  <button
                    onClick={() => onRemoveReaction(message.id, r.emoji)}
                    className="ml-1 hidden group-hover:inline text-text-high-em hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------- Main Chat Interface -----------------
export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 1,
      sender: "Alex Matthews",
      text: "Good morning! Has shipment #LS105002 been handed over to the freight partner yet?",
      time: "Friday 2:20pm",
      reactions: [],
    },
    {
      id: 2,
      sender: "You",
      text: "Hi Alex, yes — the shipment was picked up from our warehouse in Hamburg at 8:30 AM local time. It’s now en route to the port.",
      time: "Friday 2:22pm",
      reactions: [{ emoji: "❤️", count: 2 }],
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [participants, setParticipants] = useState(allParticipants.slice(0, 1));
  const [search, setSearch] = useState("");
  const [chatType, setChatType] = useState("Internal");
  const [selectedParticipants, setSelectedParticipants] = useState<
    Participant[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------- Message Send -----------------

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reactions: [],
      },
    ]);
    setNewMessage("");
  };

  // ----------------- Reaction Add/Increment -----------------
  const handleReact = (id: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const existing = m.reactions.find((r) => r.emoji === emoji);
          let updated: Reaction[];
          if (existing) {
            updated = m.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            );
          } else {
            updated = [...m.reactions, { emoji, count: 1 }];
          }
          return { ...m, reactions: updated };
        }
        return m;
      })
    );
  };

  // ----------------- Reaction Remove -----------------
  const handleRemoveReaction = (id: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = m.reactions.filter((r) => r.emoji !== emoji);
          return { ...m, reactions: updated };
        }
        return m;
      })
    );
  };

  // ----------------- Add Participants -----------------
  const toggleSelectParticipant = (p: Participant) => {
    if (selectedParticipants.find((x) => x.id === p.id)) {
      setSelectedParticipants(
        selectedParticipants.filter((x) => x.id !== p.id)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, p]);
    }
  };

  const handleAddParticipants = () => {
    const newOnes = selectedParticipants.filter(
      (p) => !participants.find((x) => x.id === p.id)
    );

    if (newOnes.length > 0) {
      setParticipants([...participants, ...newOnes]);
      setMessages([
        ...messages,
        ...newOnes.map((p) => ({
          id: Date.now() + Math.random(),
          system: true as const,
          text: `${p.name} has joined the chat`,
          time: "",
          reactions: [],
        })),
      ]);
    }
    setSelectedParticipants([]);
    setShowAddParticipant(false);
  };

  const filteredParticipants = allParticipants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ----------------- Render -----------------
  return (
    <div className="flex flex-col h-full gap-3 p-3 bg-custom-bg-1">
      {/* Header */}
      <div className="flex justify-between items-center gap-3">
        <Select value={chatType} onValueChange={setChatType}>
          <SelectTrigger className="bg-surface-0 max-w-[300px]  w-full px-3 py-2 text-text-low-em text-xs font-semibold">
            <SelectValue placeholder="Select chat" />
          </SelectTrigger>
          <SelectContent className="text-text-low-em text-xs">
            <SelectItem value="Internal">Internal</SelectItem>
            <SelectItem value="External">External</SelectItem>
          </SelectContent>
        </Select>

        {/* Plus Icon */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowAddParticipant(true)}
        >
          <Plus className="text-text-med-em size-5" />
        </Button>
        {/* UserPlus Icon */}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowAddParticipant(true)}
        >
          <TbUserPlus className="text-text-med-em size-5  " />
        </Button>
      </div>

      <div className="bg-surface-0 rounded-lg overflow-auto custom-scroll">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwn={"system" in msg ? false : msg.sender === "You"}
              onReact={handleReact}
              onRemoveReaction={handleRemoveReaction}
            />
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      {/* Input */}
      <div className="flex items-center border-t relative py-4 -mx-3 px-3 gap-2 bg-surface-0">
        <Button
          className="gap-0 p-0 bg-transparent"
          variant="ghost"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile className="size-4 p-0" />
        </Button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-20">
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setNewMessage((prev) => prev + emoji.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        )}
        <Button variant="ghost" size="sm" className="gap-0 p-0 bg-transparent">
          <IoAttachOutline className="size-4 p-0" />
        </Button>

        {/* Multiline Textarea */}

        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Describe what you want to add"
          className="flex-1 rounded-lg border border-outline-med-em py-4 px-2  text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button className="py-4 px-2" onClick={handleSend}>
          <SendHorizontal />
        </Button>
      </div>

      {/* Add Participant Modal */}
      <Dialog open={showAddParticipant} onOpenChange={setShowAddParticipant}>
        <DialogContent className="lg:min-w-[796px] md:min-w-[756px] min-w-[600px]">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-semibold">
              Add participants
            </DialogTitle>
          </DialogHeader>

          {/* Search input */}

          <div className="relative  pt-4">
            <FormLabel className="text-text-med-em font-semibold text-xs">
              Name
            </FormLabel>
            <div className="relative">
              <Search
                className="absolute  left-3 top-1/2 -translate-y-1/2 text-text-low-em"
                size={18}
              />
              <FormInput
                type="text"
                placeholder="Search participant by name, id"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-outline-med-em text-text-low-em text-sm rounded-lg px-3 py-2 pl-10"
              />
            </div>
          </div>

          {/* Recently used */}
          <div className="mt-4 flex-1">
            <p className="text-xs text-text-high-em mb-2">Recently used</p>
            <div className="grid grid-cols-3 gap-2">
              {filteredParticipants.map((p: any) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-2 border p-2 rounded-lg cursor-pointer 
            ${
              selectedParticipants.find((x) => x.id === p.id)
                ? "border-blue-500 bg-surface-1"
                : "hover:bg-surface-1"
            }`}
                  onClick={() => toggleSelectParticipant(p)}
                >
                  <Avatar>
                    <AvatarImage src={p.avatar} />
                    <AvatarFallback>{p.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-text-high-em">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="border-t pt-3 flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowAddParticipant(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddParticipants}
              disabled={selectedParticipants.length === 0}
            >
              Add{" "}
              {selectedParticipants.length > 1 ? "participants" : "participant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
