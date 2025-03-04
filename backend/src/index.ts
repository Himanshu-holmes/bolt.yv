import { getSystemPrompt } from "./prompts";

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
import express from "express"
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { BASE_PROMPT } from "./prompts";


const app = express()
app.use(express.json())
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/template",async(req,res)=>{
 const prompt = req.body.prompt

   const model = await genAI.getGenerativeModel({
     model: "gemini-2.0-flash",
     systemInstruction:
       "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
   });
   const response = await model.generateContent(prompt);
//  console.log("model response",response)
     const answer =  (await response.response.text() as string).trim(); // react or node
   console.log("answer",answer)
     if (answer === "react") {
       res.json({
         prompts: [
           BASE_PROMPT,
           `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
         ],
         uiPrompts: [reactBasePrompt],
       });
       return;
     }

     if (answer === "node") {
       res.json({
         prompts: [
           `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
         ],
         uiPrompts: [nodeBasePrompt],
       });
       return;
     }

     res.status(403).json({ message: "You can't access this" });
})

async function main(){
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

// main();

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})  