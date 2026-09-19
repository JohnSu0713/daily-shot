"use client";
import { useEffect, useState } from "react";
import { artworkImageUrl, Artwork, getDailyPhotograph } from "../lib/artic";
import { dailyLesson } from "../lib/content";

export default function Home() {
  const [art, setArt] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState<"today" | "journal">("today");

  useEffect(() => {
    setDone(localStorage.getItem("daily-shot:today") === "done");
    getDailyPhotograph().then(setArt).finally(() => setLoading(false));
  }, []);

  const complete = () => {
    localStorage.setItem("daily-shot:today", "done");
    setDone(true);
  };

  return <main className="shell">
    <header><div><div className="eyebrow">DAILY SHOT</div><div className="brand">Learn to see.</div></div><div className="day">TODAY</div></header>
    <nav><button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>Today</button><button className={tab === "journal" ? "active" : ""} onClick={() => setTab("journal")}>Journal</button></nav>
    {tab === "today" ? <>
      <section className="hero"><div className="eyebrow">DAILY PHOTOGRAPH</div><h1>Look before you read.</h1>
        {loading ? <div className="placeholder">Finding today’s photograph…</div> : art ? <figure><img className="photo" src={artworkImageUrl(art.image_id)} alt={art.title}/><figcaption>{art.title} · {art.artist_title || "Unknown artist"} · {art.date_display}</figcaption></figure> : <div className="placeholder">Today’s photograph could not be loaded.</div>}
        <p className="lead">Spend 30 seconds looking. Don’t decide whether you like it yet.</p>
        <div className="questions">{dailyLesson.prompts.map((p, i) => <article key={p}><b>0{i + 1}</b><span>{p}</span></article>)}</div>
        {!revealed && <button className="primary" onClick={() => setRevealed(true)}>Reveal today’s lesson</button>}
      </section>
      {revealed && <section className="lesson"><div className="eyebrow">TODAY’S CONCEPT</div><h2>{dailyLesson.concept}</h2><p>{dailyLesson.intro}</p><div className="practice"><div className="eyebrow">TRY IT TODAY</div><h3>One subject, three readings</h3><p>{dailyLesson.practice}</p>{done ? <strong>✓ Today complete</strong> : <button className="primary" onClick={complete}>Complete today’s practice</button>}</div></section>}
    </> : <section><div className="eyebrow">YOUR PROGRESS</div><h1>Learning journal</h1><div className="stats"><article><strong>{done ? 1 : 0}</strong><span>Days completed</span></article><article><strong>{done ? 1 : 0}</strong><span>Concepts learned</span></article></div></section>}
    <footer>Daily Shot · v0.1</footer>
  </main>;
}