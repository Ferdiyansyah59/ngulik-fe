import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type IncomingMessage = {
  role: string;
  content: string;
};

export async function POST(req: Request) {
  console.log("Masuk API Route");

  // 1. WRAP SEMUA LOGIC DI TRY CATCH
  try {
    const { message } = await req.json(); // Perhatikan: di frontend kamu kirim { message }, bukan { messages }

    // Cek format message biar sesuai aturan OpenAI
    const formattedMessages = message.map((m: IncomingMessage) => ({
      role: m.role === "asistant" ? "assistant" : m.role,
      content: m.content,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Ganti 'gpt-5-nano' (kemungkinan invalid) ke model standar
      stream: true,
      messages: formattedMessages,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error: unknown) {
    // 2. TANGKAP ERRORNYA DISINI
    console.error("Server Error:", error);

    let errorMessage = "An unknown error occurred"; // Default message

    // Cek dulu: Apakah error ini beneran Object Error?
    if (error instanceof Error) {
      errorMessage = error.message; // ✅ Aman, TS jadi tau ini Error
    } else if (typeof error === "string") {
      errorMessage = error; // ✅ Aman, kalo errornya cuma string
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      // Pakai variabel tadi
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
