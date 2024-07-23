"use client";

import React, { useState, useCallback, useEffect, useRef, FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { actionMessage, getInitialState, State } from "../app/actions";

interface ChatFormProps {
  onMessageSent: (message: string, sender: "user" | "ai") => void;
}

export const ChatForm: React.FC<ChatFormProps> = ({ onMessageSent }) => {
  const [initialState, setInitialState] = useState<State | null>(null);
  const lastResponseRef = useRef<string | null>(null);

  useEffect(() => {
    getInitialState().then(setInitialState);
  }, []);

  const [state, formAction] = useFormState(actionMessage, initialState || {
    result: null,
    message: null,
    aiResponse: null,
  });
  
  const [inputMessage, setInputMessage] = useState("");
  const { pending } = useFormStatus();

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("userMessage") as string;
    if (message.trim()) {
      onMessageSent(message, "user");
      formAction(formData);
    }
    setInputMessage("");
  }, [onMessageSent, formAction]);

  useEffect(() => {
    if (state.result === "ok" && state.aiResponse && state.aiResponse !== lastResponseRef.current) {
      onMessageSent(state.aiResponse, "ai");
      lastResponseRef.current = state.aiResponse;
    }
  }, [state, onMessageSent]);

  if (initialState === null) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      {state.result === "error" && (
        <div className="w-full mb-4 text-red-500">{state.message}</div>
      )}
      <div className="flex space-x-2">
        <input
          id="userMessage"
          name="userMessage"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow border rounded-lg p-2"
          placeholder="メッセージを入力..."
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg"
          disabled={pending}
        >
          {pending ? "送信中..." : "送信"}
        </button>
      </div>
    </form>
  );
};