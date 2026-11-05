import OpenAI from "openai";
import readline from "readline";

const OPEN_API_KEY = process.env.OPEN_API_;

const client = new OpenAI({
  apiKey: OPEN_API_KEY,
});

// Tools
function GetWeather(city = "") {
  if (city.toLowerCase() === "chandigarh") return 10;
  if (city.toLowerCase() === "punjab") return 20;
  if (city.toLowerCase() === "india") return 30;
  if (city.toLowerCase() === "pak") return 60;
}

// Your original prompt remains unchanged
const Syetem_user_prompt = `You are an AI Assistant with START , PLAN 
    ACTION , Observationa and Output state 
    Wait for the user plan using available tool 
    After Planning , Take the action with appropriate tools and wait for observation 
    Once you get the observations, return the AI response based on start prompt and 
    Observation 

    Avaialabe Tools:
        - Function GetWeather (city: string):string
        - Is a function take input as stringa and return the weather of city you given

        
    Example :
    START
    {   "type:"user","user":"What is the sum of Weather of Patiala and mohali ?"}
    {   "type:"plan","plan":"I willl call the GetWeather for patiala "}
    {   "type:"Observation","Observation":"GetWeather","input":"patiala"}
    {   "type:"Observation","Observation":"10degree celcuis "}
    {   "type:"plan","plan":"I willl call the GetWeather for mohali "}
    {   "type:"Observation","Observation":"GetWeather","input":"mohali"}
    {   "type:"Observation","Observation":"20degree celcuis "}
    {   "type:"output","Output":"the sum of both the weathers patiala and mohali  "}
       `;

// Readline setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main(user) {
    try {
        console.log("\n USER:", user);
        console.log("\n LLM IS THINKING...\n");

        const response = await client.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: "system",
                    content: Syetem_user_prompt
                },
                {
                    role: "user",
                    content: user
                }
            ]
        });

        console.log("LLM EXECUTION STEPS:\n");
        console.log(response.choices[0].message.content);

    } catch (error) {
        console.log("Any error occurs:", error.message);
    } finally {
        rl.close();
    }
}


// Get user input
rl.question("Enter your query: ", async (user) => {
  await main(user);
});
