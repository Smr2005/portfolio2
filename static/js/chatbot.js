// === OFFLINE Q&A ===
const qaPairs = {
  "hi": "Hello! I'm Sameer’s assistant. Ask me anything about his skills or experience.",
  "hello": "Hey there! Ready to explore Sameer’s projects and profile?",
  "projects": "Sameer built a Facial Recognition System, Disease Prediction App, and IoT Gas Sensor.",
  "skills": "Sameer is skilled in Python, Flask, Streamlit, OpenCV, Pandas, NumPy, Power BI, and more.",
  "technologies": "Python, Flask, OpenCV, Streamlit, MySQL, Power BI, Git, GitHub, and more.",
  "education": "He is a B.Tech AI & Data Science graduate from Aditya College of Engineering (2021–2026).",
  "linkedin": "Here’s Sameer’s LinkedIn: https://www.linkedin.com/in/shaik-sameer-69a3422a8",
  "github": "GitHub: https://github.com/Smr2005",
  "email": "You can email Sameer at shaiksameershubhan@gmail.com",
  "internships": "He interned at Cognizant (HR Tools), SmartBridge (IoT + AI), and CodeClause (Python Dev).",
  "strengths": "Sameer is dedicated, innovative, a fast learner, and detail-oriented.",
  "weakness": "He tends to hyper-focus on solving problems, but is improving time balance.",
  "why should we hire you": "Because Sameer brings strong technical skills, creativity, and a drive to grow.",
  "bye": "Thanks for chatting! Feel free to explore more of Sameer’s portfolio."
};

// === SPEAK FUNCTION ===
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("chat-float-btn");

  // ✅ On click, just scroll to #chat section
  btn.addEventListener("click", function () {
    const chatSection = document.getElementById("chat");
    if (chatSection) chatSection.scrollIntoView({ behavior: "smooth" });
  });

  // Floating AI Icon Movement
  const icon = document.getElementById("chat-float-btn");
  const sections = ["#about", "#projects", "#certifications", "#skills", "#internships", "#chat", "#contact"];
  const sides = ["right", "left"];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = sections.findIndex(id => entry.target.matches(id));
        const align = sides[index % 2];
        const rect = entry.target.getBoundingClientRect();
        const topY = window.scrollY + rect.top + rect.height / 2 - 30;

        icon.classList.add("animate");
        icon.style.top = `${topY}px`;
        icon.style.left = align === "left" ? "5%" : "90%";
        setTimeout(() => icon.classList.remove("animate"), 500);
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(id => {
    const el = document.querySelector(id);
    if (el) observer.observe(el);
  });

  // ENTER key support
  const inputMain = document.getElementById("userInput");
  if (inputMain) {
    inputMain.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});

// === Send Message to Chat Section
function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const icon = document.getElementById("chat-float-btn");
  const userMessage = input.value.trim().toLowerCase();
  if (!userMessage) return;

  chatbox.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;
  input.value = '';

  chatbox.innerHTML += `
    <div id="typing-indicator" class="typing-indicator">
      <strong>Bot is typing</strong>
      <span></span><span></span><span></span>
    </div>
  `;
  icon.classList.add("talking");
  chatbox.scrollTop = chatbox.scrollHeight;

  const reply = qaPairs[userMessage] || "🤖 I didn’t understand that. Try asking about Sameer’s certifications, tools, or internships.";

  setTimeout(() => {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
    chatbox.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
    icon.classList.remove("talking");
    chatbox.scrollTop = chatbox.scrollHeight;
    speak(reply);
  }, 1000);
}
