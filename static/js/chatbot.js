// === GEMINI API CONFIGURATION ===
const GEMINI_API_KEY = "AIzaSyB-x18BVQjpw5z1hvkz9O0eNDvQheCtcec";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// === FACTS ABOUT SAMEER ===
const sameerFacts = `
PERSONAL INFORMATION:
- Name: Shaik Sameer
- Email: shaiksameershubhan@gmail.com
- LinkedIn: https://www.linkedin.com/in/shaik-sameer-69a342a8
- GitHub: https://github.com/Smr2005
- Location: India

EDUCATION:
- B.Tech in AI & Data Science from Aditya College of Engineering (2021–2026)
- Intermediate in Maths, Physics, Chemistry at Vidyanikethan Junior College (2020–2022)
- Secondary School at Kothaindlu MPL High School (2019–2020)

TECHNICAL SKILLS:
- Programming Languages: Python, JavaScript, HTML, CSS
- Frameworks & Libraries: Flask, Streamlit, OpenCV, Pandas, NumPy
- Databases: MySQL
- Tools & Technologies: Power BI, Git, GitHub, VS Code
- AI/ML: Computer Vision, Data Analysis, Machine Learning
- Web Development: Frontend and Backend development

PROJECTS:
1. Facial Recognition System - Built using OpenCV and Python for real-time face detection and recognition
2. Disease Prediction App - Machine learning application for predicting diseases based on symptoms
3. Personal Portfolio Website - Full-stack web application showcasing skills and projects
4. IoT Gas Leak Detection System - IoT-based safety system for detecting gas leaks
5. AutoFeel- Car Sentiment Analyzer

INTERNSHIPS & EXPERIENCE:
- AI Intern at TechSaksham Edunet Foundation (Microsoft & SAP CSR)
- Data Science Intern at SkillDzire Technologies
- Data Analytics Intern at APSCHE x SmartBridge Virtual Internship (Current)
- Skillbit Technologies Virtual Internship – Artificial Intelligence Intern

STRENGTHS:
- Dedicated and hardworking
- Innovative problem solver
- Fast learner and adaptable
- Detail-oriented approach
- Strong analytical thinking

AREAS FOR IMPROVEMENT:
- Time management (tends to hyper-focus on problem-solving)
- Working on balancing perfectionism with efficiency

CAREER GOALS:
- Passionate about AI and Data Science
- Interested in developing innovative solutions
- Seeking opportunities to grow in tech industry
- Committed to continuous learning and development

CERTIFICATIONS & ACHIEVEMENTS:
- Various certifications in AI, Data Science, and Web Development
- Active participant in tech communities
- Continuous learner with focus on emerging technologies

```;

// --- GLOBAL VARIABLES ---
const chatbox = document.getElementById("chatbox");
let chatHistory = [];

// === FUNCTION TO CALL GEMINI API ===
async function askGemini(question) {
    const headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY
    };

    // Construct the prompt to be a system instruction for the model
    const systemInstruction = {
        parts: [{
            text: `You are an FAQ chatbot for Sameer's personal portfolio website. Your purpose is to provide information about Sameer based **EXCLUSIVELY** on the facts provided below.

**Instructions:**
1. **Strictly use the provided FACTS**. Do not invent or hallucinate information.
2. **Answer concisely but informatively**. Keep responses helpful and professional.
3. **Always refer to Sameer in the third person**.
4. **If a question cannot be answered from the provided facts**, politely redirect the user and list the available topics.

**Available Topics:** Education, Technical Skills, Projects, Internships & Experience, Strengths, Areas for Improvement, Career Goals, or Certifications & Achievements.

**FACTS ABOUT SAMEER:**
${sameerFacts}`
        }]
    };
    
    // Create the full contents array with history and the new user question
    const contents = [...chatHistory, {
        role: "user",
        parts: [{
            text: question
        }]
    }];

    const payload = {
        system_instruction: systemInstruction,
        contents: contents
    };

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        
        // Update the chat history with the new user message and the model's reply
        chatHistory.push({ role: "user", parts: [{ text: question }] });
        chatHistory.push({ role: "model", parts: [{ text: reply }] });

        return reply;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return "I'm sorry, I'm having trouble connecting right now. Please try asking about Sameer's projects, skills, education, or experience!";
    }
}

// === TEXT-TO-SPEECH FUNCTION ===
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
}

// === INITIALIZE AFTER DOM LOAD ===
document.addEventListener("DOMContentLoaded", () => {
    const chatFloatBtn = document.getElementById("chat-float-btn");

    // Scroll to Chat section on floating button click
    chatFloatBtn.addEventListener("click", () => {
        const chatSection = document.getElementById("chat");
        if (chatSection) chatSection.scrollIntoView({ behavior: "smooth" });
    });

    // Animate floating chat icon based on visible sections
    const sections = ["#about", "#projects", "#certifications", "#skills", "#internships", "#chat", "#contact"];
    const sides = ["right", "left"];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = sections.findIndex(id => entry.target.matches(id));
                const align = sides[index % 2];
                const rect = entry.target.getBoundingClientRect();
                const topY = window.scrollY + rect.top + rect.height / 2 - 30;
                chatFloatBtn.classList.add("animate");
                chatFloatBtn.style.top = `${topY}px`;
                chatFloatBtn.style.left = align === "left" ? "5%" : "90%";
                setTimeout(() => chatFloatBtn.classList.remove("animate"), 500);
            }
        });
    }, { threshold: 0.6 });

    sections.forEach(id => {
        const el = document.querySelector(id);
        if (el) observer.observe(el);
    });

    // Support sending a message on ENTER key press
    const userInput = document.getElementById("userInput");
    if (userInput) {
        userInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});

// === FUNCTION TO SEND MESSAGE TO THE CHATBOX ===
async function sendMessage() {
    const inputElem = document.getElementById("userInput");
    const chatFloatBtn = document.getElementById("chat-float-btn");
    const userMessage = inputElem.value.trim();
    if (!userMessage) return;

    // Display user message
    chatbox.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;
    inputElem.value = '';

    // Display bot typing animation
    chatbox.innerHTML += `
        <div id="typing-indicator" class="typing-indicator">
            <strong>Bot is typing</strong>
            <span></span><span></span><span></span>
        </div>
    `;
    chatFloatBtn.classList.add("talking");
    chatbox.scrollTop = chatbox.scrollHeight;

    // Get response from Gemini API
    try {
        const reply = await askGemini(userMessage);
        
        // Remove typing animation and display reply with voice output
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) typingIndicator.remove();
        
        chatbox.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
        chatFloatBtn.classList.remove("talking");
        chatbox.scrollTop = chatbox.scrollHeight;
        speak(reply);
    } catch (error) {
        // Handle error case
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) typingIndicator.remove();
        
        const errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try asking about Sameer's projects, skills, education, or experience!";
        chatbox.innerHTML += `<div><strong>Bot:</strong> ${errorMessage}</div>`;
        chatFloatBtn.classList.remove("talking");
        chatbox.scrollTop = chatbox.scrollHeight;
        speak(errorMessage);
    }
}
