"use client";

import { useEffect, useMemo, useState } from "react";
import { getDailyPhotograph, localDateKey } from "../lib/artic";
import { getLesson } from "../lib/content";

type JournalEntry = {
  date: string;
  artwork: string;
  artist: string;
  concept: string;
  note: string;
};

const JOURNAL_KEY = "daily-shot:journal:v2";

function readJournal(): JournalEntry[] {
  try {
    return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function calcStreak(entries: JournalEntry[]) {
  const completed = new Set(entries.map((entry) => entry.date));
  let streak = 0;
  const cursor = new Date();
  while (completed.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function Home() {
  const today = useMemo(() => getDailyPhotograph(), []);
  const lesson = useMemo(() => getLesson(today.artwork.lessonId), [today.artwork.lessonId]);
  const [tab, setTab] = useState<"today" | "journal">("today");
  const [revealed, setRevealed] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const items = readJournal();
    setJournal(items);
    const existing = items.find((entry) => entry.date === today.dateKey);
    setNote(existing?.note || "");
  }, [today.dateKey]);

  useEffect(() => {
    if (!timerRunning || seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, seconds]);

  useEffect(() => {
    if (seconds === 0) setTimerRunning(false);
  }, [seconds]);

  const completedToday = journal.some((entry) => entry.date === today.dateKey);
  const streak = calcStreak(journal);

  const handleImageError = () => {
    const next = imageIndex + 1;
    if (next < today.artwork.imageUrls.length) {
      setImageIndex(next);
      setImageLoaded(false);
      return;
    }
    setImageFailed(true);
  };

  const saveToday = () => {
    const entry: JournalEntry = {
      date: today.dateKey,
      artwork: today.artwork.title,
      artist: today.artwork.artist,
      concept: lesson.concept,
      note: note.trim()
    };
    const next = [entry, ...journal.filter((item) => item.date !== today.dateKey)]
      .sort((a, b) => b.date.localeCompare(a.date));
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
    setJournal(next);
  };

  const startTimer = () => {
    setSeconds(30);
    setTimerRunning(true);
  };

  return (
    <main className="shell">
      <header className="topbar">
        <button className="brand-lockup" onClick={() => setTab("today")} aria-label="Daily Shot home">
          <span className="brand-mark" aria-hidden="true"><i /></span>
          <span><b>Daily Shot</b><small>Learn to see.</small></span>
        </button>
        <div className="header-meta">
          <span>{streak > 0 ? `${streak} day streak` : "Start your streak"}</span>
          <span className="date-chip">{new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date())}</span>
        </div>
      </header>

      <nav className="tabs" aria-label="Primary">
        <button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>Today</button>
        <button className={tab === "journal" ? "active" : ""} onClick={() => setTab("journal")}>
          Journal <span>{journal.length}</span>
        </button>
      </nav>

      {tab === "today" ? (
        <>
          <section className="intro-row">
            <div>
              <div className="eyebrow">DAILY PHOTOGRAPH · {lesson.kicker.toUpperCase()}</div>
              <h1>Look first.<br />Read later.</h1>
            </div>
            <p>One master photograph, one visual idea, one small assignment. About five minutes a day.</p>
          </section>

          <section className="photo-stage">
            {!imageFailed ? (
              <>
                {!imageLoaded && <div className="image-skeleton"><span>Loading today’s photograph</span></div>}
                <img
                  className={`photo ${imageLoaded ? "loaded" : ""}`}
                  src={today.artwork.imageUrls[imageIndex]}
                  alt={today.artwork.title}
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              </>
            ) : (
              <div className="image-error">
                <span className="brand-mark large"><i /></span>
                <h2>The image host is taking a break.</h2>
                <p>The lesson still works. Open the museum/source copy, then return here.</p>
                <a href={today.artwork.sourceUrl} target="_blank" rel="noreferrer">Open source photograph ↗</a>
              </div>
            )}
            {timerRunning && (
              <div className="timer-overlay">
                <span>{seconds}</span>
                <small>Just look. No judging.</small>
              </div>
            )}
          </section>

          <div className="caption-row">
            <div>
              <strong>{today.artwork.title}</strong>
              <span>{today.artwork.artist} · {today.artwork.date} · {today.artwork.location}</span>
            </div>
            <a href={today.artwork.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a>
          </div>
          <div className="credit">{today.artwork.credit}</div>

          <section className="observe">
            <div className="observe-head">
              <p>Spend 30 seconds with the frame before reading anything else.</p>
              <button className="timer-button" onClick={startTimer} disabled={timerRunning}>
                {timerRunning ? `${seconds}s` : "Start 30s look"}
              </button>
            </div>
            <div className="questions">
              {lesson.prompts.map((prompt, i) => (
                <article key={prompt}><b>0{i + 1}</b><span>{prompt}</span></article>
              ))}
            </div>
            {!revealed && <button className="primary wide" onClick={() => setRevealed(true)}>Reveal today’s lesson <span>↓</span></button>}
          </section>

          {revealed && (
            <section className="lesson">
              <div className="lesson-grid">
                <div>
                  <div className="eyebrow">TODAY’S CONCEPT</div>
                  <h2>{lesson.concept}</h2>
                </div>
                <div className="lesson-copy">
                  <p>{lesson.intro}</p>
                  <blockquote>{lesson.takeaway}</blockquote>
                </div>
              </div>

              <div className="practice-card">
                <div className="practice-number">01</div>
                <div>
                  <div className="eyebrow">MAKE A FRAME</div>
                  <h3>Try it today</h3>
                  <p>{lesson.practice}</p>
                </div>
              </div>

              <div className="reflection">
                <div>
                  <div className="eyebrow">YOUR NOTE</div>
                  <h3>What did you notice?</h3>
                </div>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="One sentence is enough…"
                  maxLength={400}
                />
                <div className="reflection-foot">
                  <span>{note.length}/400</span>
                  <button className={completedToday ? "complete-button done" : "complete-button"} onClick={saveToday}>
                    {completedToday ? "✓ Saved for today" : "Complete today"}
                  </button>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="journal-view">
          <div className="intro-row journal-title">
            <div><div className="eyebrow">YOUR PRACTICE</div><h1>Learning<br />journal.</h1></div>
            <p>A quiet record of the photographs and visual ideas you have actually spent time with.</p>
          </div>
          <div className="stats">
            <article><strong>{journal.length}</strong><span>days practiced</span></article>
            <article><strong>{streak}</strong><span>current streak</span></article>
            <article><strong>{new Set(journal.map((entry) => entry.concept)).size}</strong><span>concepts learned</span></article>
          </div>

          {journal.length ? (
            <div className="entries">
              {journal.map((entry) => (
                <article key={entry.date}>
                  <time>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(entry.date + "T12:00:00"))}</time>
                  <div><h3>{entry.concept}</h3><p>{entry.artwork} · {entry.artist}</p>{entry.note && <blockquote>“{entry.note}”</blockquote>}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="brand-mark large"><i /></span>
              <h2>Your journal starts with one photograph.</h2>
              <p>Finish today’s lesson and your first entry will appear here.</p>
              <button className="primary" onClick={() => setTab("today")}>Go to today</button>
            </div>
          )}
        </section>
      )}

      <footer><span className="brand-mark mini"><i /></span><span>Daily Shot</span><span>Seven photographs · seven ways of seeing</span></footer>
    </main>
  );
}
