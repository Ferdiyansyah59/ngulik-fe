"use client";

import { useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

type Message = {
  role: "user" | "asistant";
  content: string;
};

function CetinganGepete() {
  const [message, setMessage] = useState<Message[]>([
    {
      role: "asistant",
      content: "Hallo mase nama gue Nurdin!!",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    /* 
        Ini buat asign message dari user yang di terima di inputan, terus nanti
        messagenya bakal di masukin ke state Message
    */
    const userMsg: Message = { role: "user", content: input };
    const newMessage = [...message, userMsg];
    setMessage(newMessage);
    setInput("");
    setLoading(true);

    try {
      // wadah message
      setMessage((prev) => [...prev, { role: "asistant", content: "" }]);

      // manggil api y yang anu

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!res.body) return;

      // data stream

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done: boolean = false;
      let assitantMessage: string = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chuckValue = decoder.decode(value);
          assitantMessage += chuckValue;

          setMessage((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "asistant",
              content: assitantMessage,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      console.log("Error disini ges: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-gray-900 text-gray-100 border-x border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gray-800 z-10">
        <h1 className="font-bold">Virtualization Chat (GPT-3.5)</h1>
        <p className="text-xs text-gray-400">
          Rendering ribuan chat? No problem.
        </p>
      </div>

      {/* AREA CHAT VIRTUALIZATION */}
      <div className="flex-1 p-4">
        <Virtuoso
          ref={virtuosoRef}
          data={message}
          // Fitur killer: Auto follow bottom kalau user lagi di bawah
          followOutput="smooth"
          // Render item per baris
          itemContent={(index, msg) => (
            <div
              className={`flex mb-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-200 rounded-bl-none"
                }`}
              >
                {/* Tips: Jika GPT balikin Markdown, 
                  bisa bungkus msg.content pake <ReactMarkdown> disini 
                */}
                {msg.content}
              </div>
            </div>
          )}
        />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Tanya GPT..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input}
            className="bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default CetinganGepete;
