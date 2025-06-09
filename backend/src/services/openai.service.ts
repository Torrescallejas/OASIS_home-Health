import OpenAI from "openai";
import fs from "fs";
export class OpenAIService {
    private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async transcribe(path: string) {
        const resp: any = await this.client.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: "whisper-1",
            response_format: "text"
        });
        return resp.text;
    }

    async extractOasis(transcript: string) {
        const fn = {
            name: "oasis_g",
            description: "Extrae M1800–M1860 y un resumen",
            parameters: {
                type: "object",
                properties: {
                    m1800: { type: "integer" },
                    m1810: { type: "integer" },
                    m1820: { type: "integer" },
                    m1830: { type: "integer" },
                    m1840: { type: "integer" },
                    m1850: { type: "integer" },
                    m1860: { type: "integer" },
                    summary: { type: "string" }
                },
                required: ["m1800", "m1810", "m1820", "m1830", "m1840", "m1850", "m1860", "summary"]
            }
        };

        const chat = await this.client.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Eres un experto en codificación OASIS G." },
                { role: "user", content: transcript }
            ],
            functions: [fn],
            function_call: { name: "oasis_g" }
        });

        return JSON.parse(chat.choices[0].message.function_call!.arguments);
    }
}
