
import { useState } from "react";
import "./App.css";

type Analysis = {
  stress: number;
  fear: number;
  anxiety: number;
  distress: number;
  priority: "LOW" | "MODERATE" | "HIGH" | "URGENT";
  bot: "stress" | "trauma" | "urgent" | "general";
};

function analyzeText(text: string): Analysis {
  const value = text.toLowerCase();

  let stress = 20;
  let fear = 15;
  let anxiety = 15;
  let distress = 10;

  const stressWords = [
    "stress",
    "stressed",
    "pressure",
    "worried",
    "worry",
    "tension",
  ];

  const fearWords = [
    "afraid",
    "scared",
    "fear",
    "threat",
    "threatened",
    "unsafe",
  ];

  const anxietyWords = [
    "anxious",
    "anxiety",
    "panic",
    "nervous",
    "restless",
  ];

  const distressWords = [
    "trauma",
    "traumatic",
    "helpless",
    "distressed",
    "terrified",
  ];

  stressWords.forEach((word) => {
    if (value.includes(word)) stress += 12;
  });

  fearWords.forEach((word) => {
    if (value.includes(word)) fear += 15;
  });

  anxietyWords.forEach((word) => {
    if (value.includes(word)) anxiety += 12;
  });

  distressWords.forEach((word) => {
    if (value.includes(word)) distress += 15;
  });

  const urgentWords = [
    "immediate danger",
    "danger",
    "help me",
    "attack",
    "hurt me",
    "emergency",
  ];

  const urgent = urgentWords.some((word) => value.includes(word));

  stress = Math.min(stress, 100);
  fear = Math.min(fear, 100);
  anxiety = Math.min(anxiety, 100);
  distress = Math.min(distress, 100);

  const average = (stress + fear + anxiety + distress) / 4;

  let priority: Analysis["priority"] = "LOW";
  let bot: Analysis["bot"] = "general";

  if (urgent) {
    priority = "URGENT";
    bot = "urgent";
  } else if (distress >= 60 || fear >= 70) {
    priority = "HIGH";
    bot = "trauma";
  } else if (stress >= 50 || anxiety >= 50) {
    priority = average >= 60 ? "HIGH" : "MODERATE";
    bot = "stress";
  } else {
    priority = "LOW";
    bot = "general";
  }

  return {
    stress,
    fear,
    anxiety,
    distress,
    priority,
    bot,
  };
}

export default function App() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [recording, setRecording] = useState(false);

  const analyze = () => {
    if (!text.trim()) return;
    setAnalysis(analyzeText(text));
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setRecording(true);

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setRecording(false);

      setTimeout(() => {
        setAnalysis(analyzeText(transcript));
      }, 300);
    };

    recognition.onerror = () => {
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };
  };

  const botTitle = () => {
    if (!analysis) return "";

    switch (analysis.bot) {
      case "stress":
        return "Stress Support Bot";
      case "trauma":
        return "Trauma Support Bot";
      case "urgent":
        return "Human Support Recommended";
      default:
        return "General Support Bot";
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span>🛡️</span>
          NHAA Support AI
        </div>

        <div className="navLinks">
          <a href="#home">Home</a>
          <a href="#assessment">Assessment</a>
          <a href="#statistics">Statistics</a>
          <a href="#about">About</a>
        </div>

        <a className="callButton" href="tel:14566">
          📞 14566
        </a>
      </nav>

      <section className="hero" id="home">
        <div className="heroText">
          <div className="badge">
            AI-POWERED VICTIM SUPPORT
          </div>

          <h1>
            You don't have to
            <span> face it alone.</span>
          </h1>

          <p>
            A safe AI-assisted platform that listens to your
            voice or message, identifies emotional distress
            indicators and connects you with appropriate support.
          </p>

          <div className="heroButtons">
            <a href="#assessment" className="primaryButton">
              Start Assessment →
            </a>

            <a href="tel:14566" className="secondaryButton">
              📞 NHAA 14566
            </a>
          </div>
        </div>

        <div className="heroCard">
          <div className="shield">🛡️</div>

          <h3>AI Support Assessment</h3>

          <p>
            Voice & text based emotional support analysis
          </p>

          <div className="miniStats">
            <div>
              <strong>24/7</strong>
              <small>Support</small>
            </div>

            <div>
              <strong>AI</strong>
              <small>Assisted</small>
            </div>

            <div>
              <strong>14566</strong>
              <small>NHAA</small>
            </div>
          </div>
        </div>
      </section>

      <section className="assessment" id="assessment">
        <div className="sectionTitle">
          <span>01 — ASSESSMENT</span>

          <h2>
            Tell us what
            <span> you're experiencing.</span>
          </h2>

          <p>
            You can type your experience or use your voice.
            The system will identify emotional indicators and
            recommend an appropriate support option.
          </p>
        </div>

        <div className="assessmentCard">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us what is happening or how you are feeling..."
          />

          <div className="inputActions">
            <button
              className={`voiceButton ${recording ? "recording" : ""}`}
              onClick={startVoice}
            >
              {recording ? "🔴 Listening..." : "🎙️ Speak"}
            </button>

            <button
              className="analyzeButton"
              onClick={analyze}
            >
              Analyze →
            </button>
          </div>

          {analysis && (
            <div className="results">
              <div className="resultHeader">
                <div>
                  <span>AI SUPPORT ANALYSIS</span>
                  <h3>Emotional Indicators</h3>
                </div>

                <div
                  className={`priority ${analysis.priority.toLowerCase()}`}
                >
                  {analysis.priority}
                </div>
              </div>

              <Emotion
                name="Stress"
                value={analysis.stress}
              />

              <Emotion
                name="Fear"
                value={analysis.fear}
              />

              <Emotion
                name="Anxiety"
                value={analysis.anxiety}
              />

              <Emotion
                name="Distress"
                value={analysis.distress}
              />

              <div className="recommendation">
                <div>
                  <span>RECOMMENDED SUPPORT</span>
                  <h3>{botTitle()}</h3>
                </div>

                {analysis.bot === "urgent" ? (
                  <a href="tel:14566" className="nhButton">
                    📞 Call 14566
                  </a>
                ) : (
                  <button className="botButton">
                    Open Bot →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="statistics" id="statistics">
        <div className="sectionTitle">
          <span>02 — ANALYTICS</span>

          <h2>
            Support
            <span> statistics.</span>
          </h2>
        </div>

        <div className="statGrid">
          <Stat number="128" label="Total Assessments" />
          <Stat number="32" label="High Priority" />
          <Stat number="7" label="Urgent Cases" />
          <Stat number="89%" label="AI Response Rate" />
        </div>

        <div className="chartCard">
          <h3>Emotional Indicator Overview</h3>

          <div className="chartRow">
            <span>Stress</span>
            <div className="chartBar">
              <div style={{ width: "78%" }} />
            </div>
            <strong>78%</strong>
          </div>

          <div className="chartRow">
            <span>Fear</span>
            <div className="chartBar">
              <div style={{ width: "64%" }} />
            </div>
            <strong>64%</strong>
          </div>

          <div className="chartRow">
            <span>Anxiety</span>
            <div className="chartBar">
              <div style={{ width: "57%" }} />
            </div>
            <strong>57%</strong>
          </div>

          <div className="chartRow">
            <span>Distress</span>
            <div className="chartBar">
              <div style={{ width: "42%" }} />
            </div>
            <strong>42%</strong>
          </div>
        </div>
      </section>

      <section className="features" id="about">
        <div className="feature">
          <span>🎙️</span>
          <h3>Voice Analysis</h3>
          <p>
            Users can speak instead of typing their experience.
          </p>
        </div>

        <div className="feature">
          <span>🤖</span>
          <h3>AI Support Routing</h3>
          <p>
            Automatically recommends the appropriate support
            conversation.
          </p>
        </div>

        <div className="feature">
          <span>📊</span>
          <h3>Real-Time Analytics</h3>
          <p>
            Visualizes emotional indicators and support priority.
          </p>
        </div>

        <div className="feature">
          <span>📞</span>
          <h3>NHAA Connection</h3>
          <p>
            Provides direct access to NHAA 14566 when human
            assistance is needed.
          </p>
        </div>
      </section>

      <footer>
        <div>
          <strong>NHAA Support AI</strong>
          <p>AI-assisted victim support platform</p>
        </div>

        <div>
          <a href="tel:14566">📞 NHAA 14566</a>
        </div>
      </footer>
    </div>
  );
}

function Emotion({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div className="emotion">
      <div className="emotionTop">
        <span>{name}</span>
        <strong>{value}%</strong>
      </div>

      <div className="progress">
        <div style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="stat">
      <strong>{number}</strong>
      <span>{label}</span>
    </div>
  );
}
