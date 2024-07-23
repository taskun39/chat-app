"use client";

import React, { useState, useCallback } from "react";
import { ChatForm } from "./ChatForm";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Chat = { id: string; message: string; sender: "user" | "ai" };

export const ChatScreen: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  const addMessage = useCallback((message: string, sender: "user" | "ai") => {
    setChatHistory((prev) => [...prev, { id: Date.now().toString(), message, sender }]);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-orange-500 text-white p-4">
        <h1 className="text-2xl font-bold">東京グルメAIチャット</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 rounded-lg ${
                chat.sender === "user"
                  ? "bg-orange-100 text-right"
                  : "bg-gray-100"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {chat.message}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
      <ChatForm onMessageSent={addMessage} />
    </div>
  );
};