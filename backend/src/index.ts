import { getSystemPrompt } from "./prompts";

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
import express from "express"


const app = express()
app.use(express.json())
app.post("/template",(req,res)=>{
 const prompt
})

async function main(){
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: getSystemPrompt(),
    });
    
    const prompt = "Write the code for a TODO application";
    
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }

}

main();