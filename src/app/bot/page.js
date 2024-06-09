"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const URL =
  process.env.NODE_ENV === "production"
    ? "https://pronation.vercel.app"
    : "http://localhost:8000";
const socket = io(URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("question", (question) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: question, from: "bot" },
      ]);
    });

    socket.on("response", (response) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, from: "bot" },
      ]);
    });

    return () => {
      socket.off("question");
      socket.off("response");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, from: "user" },
    ]);
    socket.emit("answer", input);
    setInput("");
  };

  return (
    <div className="bg-red-100 h-full">
      <div className="container w-3/4 m-auto">
        <Link href="/">Home</Link>
        <div className="my-4">
          {messages.map((msg, index) => (
            <div key={index} className={msg.from}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
          />
          <button
            className="p-2 w-fit bg-slate-300 rounded-md"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
