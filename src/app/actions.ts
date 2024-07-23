"use server";

import { revalidatePath } from "next/cache";

export type State = {
  result: "ok" | "error" | null;
  message: string | null;
  aiResponse: string | null;
};

export async function getInitialState(): Promise<State> {
  return {
    result: null,
    message: null,
    aiResponse: null,
  };
}

export async function actionMessage(prevState: State, formData: FormData): Promise<State> {
  const apiKey = process.env.DIFY_API_KEY;
  const message = formData.get("userMessage") as string;

  const body = {
    inputs: {},
    query: message,
    response_mode: "blocking",
    conversation_id: "",
    user: "abc-123",
  };

  try {
    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API response:", response.status, errorText);
      throw new Error(`API response: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("API response data:", data);

    revalidatePath("/chat");
    return { result: "ok", message: null, aiResponse: data.answer };
  } catch (error) {
    console.error("Error details:", error);
    return { result: "error", message: "エラーが発生しました。", aiResponse: null };
  }
}