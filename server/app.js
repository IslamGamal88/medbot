const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const questions = [
  "ما هو سنك ؟",
  "هل انت ذكر ام انثي ؟",
  "كم هو طولك ؟",
  "كم هو وزنك ؟",
  "ماهي الرياضه التي تمارسها ؟",
  "مازال تمارس هذه الرياضه ام معتزل ؟",
  "ماهي الاصابات  التي اصبت بها من قبل ؟",
  "هل عالجت هذه الاصابات ام لا ؟ ",
  "هل يختلف الالم من مكان الي اخر ام يبقي في نفس المكان ؟ ",
  "اين موضع الالم ؟ هل تشعر بالعمق ام السطحيه ؟",
  "هل الوضع يتحسن ام يسوء ؟ ",
  "متي تشعر ان الامر يزاد سوءا و متي يتحسن ؟ ",
  "هل هذه المره الاولي التي تعاني منها ام واجهت  شيئا مشابها من قبل ؟",
  "ما هي طبيعه عملك ؟",
];

io.on("connection", (socket) => {
  console.log("a user connected");

  let currentQuestionIndex = 0;
  let answers = [];

  socket.emit("question", questions[currentQuestionIndex]);

  socket.on("answer", (answer) => {
    answers.push(answer);
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      socket.emit("question", questions[currentQuestionIndex]);
    } else {
      const prompt = `User answers: ${answers.join(", ")}`;
      getChatGPTResponse(prompt).then((response) => {
        socket.emit("response", response);
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

async function getChatGPTResponse(prompt) {
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    {
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
  return response.data.choices[0].text;
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
