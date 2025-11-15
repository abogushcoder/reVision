import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    console.log("Using API key starting with:", process.env.OPENAI_API_KEY?.slice(0, 8) + "...");

    const response = await client.responses.create({
      model: "gpt-4.1-mini",     // or gpt-4.1, gpt-5.1-mini, etc.
      input: "Say: API key test successful.",
    });

    const text = response.output[0].content[0].text;
    console.log("OpenAI replied:", text);
  } catch (err) {
    console.error("Error calling OpenAI:", err.response?.data || err.message || err);
  }
}

main();

