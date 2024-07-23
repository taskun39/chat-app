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
    <div className="flex flex-col h-screen bg-blue-50">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Bristaサポート葉月</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`flex ${
                chat.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  chat.sender === "user"
                    ? "bg-blue-200 text-right"
                    : "bg-white border border-blue-200"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {chat.message}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ChatForm onMessageSent={addMessage} />
    </div>
  );
};