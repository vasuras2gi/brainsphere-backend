// const axios = require("axios");
import axios from "axios";

export const generateDebateSummary = async (debateText) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `Summarize the following debate text clearly and professionally. If the text is short, still provide a meaningful summary.\n\n${debateText}`

          },
          {
            role: "user",
            content: `Summarize this debate clearly:\n\n${debateText}`
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 🔍 Debug full response once
    console.log("Groq Raw Response:", JSON.stringify(response.data, null, 2));

    const summary =
      response?.data?.choices?.[0]?.message?.content ||
      response?.data?.choices?.[0]?.text ||
      "No summary generated";

    return summary;

  } catch (error) {
    console.error("Groq Error:", error.response?.data || error.message);
    return "AI summary failed.";
  }
};


export const scoreDebate = async (debateText) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an expert debate evaluator."
          },
          {
            role: "user",
            content: `
            Evaluate this debate and respond ONLY in JSON format like this:
            {
              "clarity": number,
              "logic": number,
              "argumentStrength": number,
              "overallScore": number
            }

            Debate:
            ${debateText}
            `
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return JSON.parse(
      response.data.choices[0].message.content
    );

  } catch (error) {
    console.error(error.response?.data || error.message);
    return null;
  }
};
