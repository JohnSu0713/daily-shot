"use client";

import { ChangeEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { getDailyPhotograph, localDateKey } from "../lib/artic";
import { getLesson } from "../lib/content";
import { Locale, UI, localizeLesson } from "../lib/i18n";
import { loadPracticeShot, removePracticeShot, savePracticeShot } from "../lib/vault";

type Theme = "light" | "dark";
type StudyMode = "clean" | "thirds" | "mono" | "squint";
type FocusPoint = { x:number; y:number };
type JournalEntry = { date:string; artwork:string; artist:string; concept:string; note:string; shot?:boolean };

const JOURNAL_KEY = "daily-shot:journal:v2";
const EXTRA = {
  en: {
    study:"STUDY THE FRAME", clean:"Clean", thirds:"Thirds", mono:"B&W", squint:"Squint",
    thirdsHint:"Ignore the labels. Notice how subjects sit on lines and intersections.", monoHint:"Remove color and compare the hierarchy of light and dark.", squintHint:"Blur detail to reveal the large visual masses and balance.", cleanHint:"Return to the photograph as the photographer made it.",
    share:"Share", copied:"Copied", fieldProof:"YOUR FRAME", localOnly:"Private · stored only on this device", addShot:"Take / add your shot", replaceShot:"Replace shot", removeShot:"Remove",
    shotHelp:"Attach one frame from today’s assignment. It stays on this device and appears in your journal.", shotError:"Couldn’t save this image on the device.",
    rhythm:"7-DAY RHYTHM", thisWeek:"this week", yourShot:"Your practice frame", noNote:"No note yet", shareText:"Today’s Daily Shot",
    captured:"Observation captured", glance:"Tap where your eye landed first", glanceDone:"First glance saved · tap again to move it"
  },
  zh: {
    study:"觀看工具", clean:"原圖", thirds:"三分線", mono:"黑白", squint:"瞇眼看",
    thirdsHint:"先忘掉文字，觀察主體如何落在線條與交點附近。", monoHint:"拿掉色彩，只比較亮暗階層與視覺重量。", squintHint:"模糊細節，看看畫面的大塊明暗與平衡。", cleanHint:"回到攝影家原本呈現的畫面。",
    share:"分享", copied:"已複製", fieldProof:"你的畫面", localOnly:"私密 · 只儲存在這台裝置", addShot:"拍攝 / 加入你的照片", replaceShot:"更換照片", removeShot:"移除",
    shotHelp:"把今天作業的一張照片放進來。照片只存在這台裝置，並會出現在學習日誌。", shotError:"無法在這台裝置上儲存照片。",
    rhythm:"7 日節奏", thisWeek:"本週完成", yourShot:"你的練習作品", noNote:"還沒有筆記", shareText:"今天的 Daily Shot",
    captured:"已記下第一眼觀察", glance:"點一下你第一眼被吸住的位置", glanceDone:"第一眼已記下 · 再點可調整"
  }
} as const;

const readJournal = (): JournalEntry[] => {
  try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]"); } catch { return []; }
};

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/[，。！？、；：,.!?;:()（）「」『』"']/g, " ").replace(/\s+/g, " ").trim();
}

function calcStreak(entries: JournalEntry[]) {
  const completed = new Set(entries.map((entry) => entry.date));
  let streak = 0;
  const cursor = new Date();
  while (completed.has(localDateKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}

function weekDays(locale: Locale) {
  const result: { key:string; label:string; day:string; today:boolean }[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    result.push({
      key: localDateKey(date),
      label: new Intl.DateTimeFormat(locale === "zh" ? "zh-TW" : "en", { weekday:"narrow" }).format(date),
      day: String(date.getDate()),
      today: offset === 0,
    });
  }
  return result;
}

function ShotThumb({ date, alt }: { date:string; alt:string }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let objectUrl = "";
    let active = true;
    loadPracticeShot(date).then((blob) => {
      if (!blob || !active) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch(() => {});
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [date]);
  return url ? <img className="journal-shot" src={url} alt={alt} /> : null;
}

export default function Home() {
  const today = useMemo(() => getDailyPhotograph(), []);
  const baseLesson = useMemo(() => getLesson(today.artwork.lessonId), [today.artwork.lessonId]);
  const [locale, setLocale] = useState<Locale>("zh");
  const [theme, setTheme] = useState<Theme>("light");
  const [tab, setTab] = useState<"today" | "journal">("today");
  const [revealed, setRevealed] = useState(false);
  const [revealedNote, setRevealedNote] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [note, setNote] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>("clean");
  const [practiceShotUrl, setPracticeShotUrl] = useState("");
  const [shotError, setShotError] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [focusPoint, setFocusPoint] = useState<FocusPoint | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const practiceObjectUrl = useRef("");
  const t = UI[locale];
  const x = EXTRA[locale];
  const lesson = localizeLesson(baseLesson, locale);
  const keywordMatches = useMemo(() => {
    const source = normalize(revealedNote);
    return lesson.keywords.map((keyword) => ({
      ...keyword,
      matched: source.length > 0 && keyword.aliases.some((alias) => source.includes(normalize(alias)))
    }));
  }, [lesson, revealedNote]);

  useEffect(() => {
    const storedLocale = localStorage.getItem("daily-shot:locale");
    const initialLocale: Locale = storedLocale === "en" || storedLocale === "zh" ? storedLocale : "zh";
    setLocale(initialLocale);
    document.documentElement.lang = initialLocale === "zh" ? "zh-Hant" : "en";
    if (!storedLocale) localStorage.setItem("daily-shot:locale", initialLocale);

    const savedTheme = localStorage.getItem("daily-shot:theme");
    const initialTheme: Theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;

    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (requestedTab === "journal") setTab("journal");

    const items = readJournal();
    setJournal(items);
    setNote(items.find((entry) => entry.date === today.dateKey)?.note || "");
    try {
      const savedFocus = localStorage.getItem(`daily-shot:focus:${today.dateKey}`);
      if (savedFocus) setFocusPoint(JSON.parse(savedFocus));
    } catch {}

    loadPracticeShot(today.dateKey).then((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      practiceObjectUrl.current = url;
      setPracticeShotUrl(url);
    }).catch(() => {});

    return () => { if (practiceObjectUrl.current) URL.revokeObjectURL(practiceObjectUrl.current); };
  }, [today.dateKey]);

  useEffect(() => {
    if (!timerRunning || seconds <= 0) return;
    const id = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, seconds]);
  useEffect(() => { if (seconds === 0) setTimerRunning(false); }, [seconds]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return;
      if (event.key.toLowerCase() === "g") setStudyMode("thirds");
      if (event.key.toLowerCase() === "b") setStudyMode("mono");
      if (event.key.toLowerCase() === "s") setStudyMode("squint");
      if (event.key === "Escape") setStudyMode("clean");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const completedToday = journal.some((entry) => entry.date === today.dateKey);
  const streak = calcStreak(journal);
  const week = weekDays(locale);
  const completedKeys = new Set(journal.map((entry) => entry.date));
  const weekCount = week.filter((day) => completedKeys.has(day.key)).length;

  const changeLocale = (next: Locale) => { setLocale(next); localStorage.setItem("daily-shot:locale", next); document.documentElement.lang = next === "zh" ? "zh-Hant" : "en"; };
  const changeTheme = (next: Theme) => { setTheme(next); localStorage.setItem("daily-shot:theme", next); document.documentElement.dataset.theme = next; };
  const imageError = () => { const next = imageIndex + 1; if (next < today.artwork.imageUrls.length) { setImageIndex(next); setImageLoaded(false); } else setImageFailed(true); };
  const startTimer = () => { setSeconds(30); setTimerRunning(true); };
  const captureFirstGlance = (event: ReactPointerEvent<HTMLImageElement>) => {
    if (timerRunning) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const point = {
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    };
    setFocusPoint(point);
    localStorage.setItem(`daily-shot:focus:${today.dateKey}`, JSON.stringify(point));
  };
  const revealLesson = () => {
    setRevealedNote(note.trim());
    setRevealed(true);
    window.setTimeout(() => document.getElementById("today-lesson")?.scrollIntoView({ behavior:"smooth", block:"start" }), 60);
  };
  const saveToday = () => {
    const entry: JournalEntry = { date:today.dateKey, artwork:today.artwork.title, artist:today.artwork.artist, concept:lesson.concept, note:note.trim(), shot:Boolean(practiceShotUrl) };
    const next = [entry, ...journal.filter((item) => item.date !== today.dateKey)].sort((a,b) => b.date.localeCompare(a.date));
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
    setJournal(next);
  };

  const onPracticeShot = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setShotError(false);
    try {
      const blob = await savePracticeShot(today.dateKey, file);
      if (practiceObjectUrl.current) URL.revokeObjectURL(practiceObjectUrl.current);
      const url = URL.createObjectURL(blob);
      practiceObjectUrl.current = url;
      setPracticeShotUrl(url);
      if (completedToday) {
        const next = journal.map((entry) => entry.date === today.dateKey ? { ...entry, shot:true } : entry);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
        setJournal(next);
      }
    } catch { setShotError(true); }
  };
  const clearPracticeShot = async () => {
    await removePracticeShot(today.dateKey).catch(() => {});
    if (practiceObjectUrl.current) URL.revokeObjectURL(practiceObjectUrl.current);
    practiceObjectUrl.current = "";
    setPracticeShotUrl("");
    const next = journal.map((entry) => entry.date === today.dateKey ? { ...entry, shot:false } : entry);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(next));
    setJournal(next);
  };

  const shareToday = async () => {
    const text = `${x.shareText}: ${today.artwork.title} — ${today.artwork.artist}. ${lesson.concept}`;
    const url = `${window.location.origin}/daily-shot/`;
    try {
      if (navigator.share) await navigator.share({ title:"Daily Shot", text, url });
      else { await navigator.clipboard.writeText(`${text}\n${url}`); setShareState("copied"); window.setTimeout(() => setShareState("idle"), 1800); }
    } catch { /* user cancelled */ }
  };

  const date = new Intl.DateTimeFormat(locale === "zh" ? "zh-TW" : "en", { month:"short", day:"numeric" }).format(new Date());
  const studyHint = studyMode === "thirds" ? x.thirdsHint : studyMode === "mono" ? x.monoHint : studyMode === "squint" ? x.squintHint : x.cleanHint;

  return <main className="shell">
    <header className="topbar">
      <button className="brand-lockup" onClick={() => setTab("today")} aria-label="Daily Shot home"><span className="brand-mark"><i /></span><span><b>Daily Shot</b><small>{t.tagline}</small></span></button>
      <div className="header-actions">
        {streak > 1 && <span className="streak-chip">{streak}×</span>}
        <div className="preference-switch" aria-label="Language"><button className={locale === "en" ? "selected" : ""} onClick={() => changeLocale("en")}>EN</button><button className={locale === "zh" ? "selected" : ""} onClick={() => changeLocale("zh")}>中文</button></div>
        <div className="preference-switch" aria-label="Theme"><button className={theme === "light" ? "selected" : ""} onClick={() => changeTheme("light")} aria-label="Light mode">☀︎</button><button className={theme === "dark" ? "selected" : ""} onClick={() => changeTheme("dark")} aria-label="Dark mode">☾</button></div>
        <span className="date-chip">{date}</span>
      </div>
    </header>

    <nav className="tabs"><button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>{t.today}</button><button className={tab === "journal" ? "active" : ""} onClick={() => setTab("journal")}>{t.journal} <span>{journal.length}</span></button></nav>

    {tab === "today" ? <>
      <section className="photo-stage">
        {!imageFailed ? <>
          {!imageLoaded && <div className="image-skeleton"><span>{t.loading}</span></div>}
          <img className={`photo ${imageLoaded ? "loaded" : ""} study-${studyMode}`} src={today.artwork.imageUrls[imageIndex]} alt={today.artwork.title} onLoad={() => setImageLoaded(true)} onError={imageError} onPointerDown={captureFirstGlance} />
          {studyMode === "thirds" && <div className="thirds-grid" aria-hidden="true"><i/><i/><b/><b/></div>}
          {focusPoint && <span className="focus-marker" aria-hidden="true" style={{ left:`${focusPoint.x}%`, top:`${focusPoint.y}%` }}><i /></span>}
          {!timerRunning && <div className={`first-glance-hint ${focusPoint ? "done" : ""}`}>{focusPoint ? `✓ ${x.glanceDone}` : x.glance}</div>}
        </> : <div className="image-error"><span className="brand-mark large"><i /></span><h2>{t.imageBreak}</h2><p>{t.imageBreakBody}</p><a href={today.artwork.sourceUrl} target="_blank" rel="noreferrer">{t.openSource}</a></div>}
        {timerRunning && <div className="timer-overlay"><span>{seconds}</span><small>{t.justLook}</small></div>}
      </section>

      <div className="caption-row">
        <div><strong>{today.artwork.title}</strong><span>{today.artwork.artist} · {today.artwork.date} · {today.artwork.location}</span></div>
        <div className="caption-actions"><button onClick={shareToday}>{shareState === "copied" ? x.copied : x.share}</button><a href={today.artwork.sourceUrl} target="_blank" rel="noreferrer">{t.source}</a></div>
      </div>
      <div className="credit">{today.artwork.credit}</div>

      <section className="study-panel" aria-label={x.study}>
        <div><div className="eyebrow">{x.study}</div><p>{studyHint}</p></div>
        <div className="study-switch">
          {(["clean","thirds","mono","squint"] as StudyMode[]).map((mode) => <button key={mode} aria-pressed={studyMode === mode} className={studyMode === mode ? "selected" : ""} onClick={() => setStudyMode(mode)}>{mode === "clean" ? x.clean : mode === "thirds" ? x.thirds : mode === "mono" ? x.mono : x.squint}</button>)}
        </div>
      </section>

      <section className="reflection pre-reveal">
        <div><div className="eyebrow">{t.yourNote}</div><h3>{t.notice}</h3><p className="note-hint">{t.noteHint}</p></div>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={t.notePlaceholder} maxLength={400} />
        <div className="reflection-foot"><span>{note.length}/400</span>{revealed ? <span className="captured">✓ {x.captured}</span> : <button className="reveal-note-button" onClick={revealLesson}>{t.reveal} <span>↓</span></button>}</div>
      </section>

      <section className="observe">
        <div className="observe-head"><p>{t.observe}</p><button className="timer-button" onClick={startTimer} disabled={timerRunning}>{timerRunning ? `${seconds}s` : t.startLook}</button></div>
        <div className="questions">{lesson.prompts.map((prompt, index) => <article key={prompt}><b>0{index + 1}</b><span>{prompt}</span></article>)}</div>
        {!revealed && <button className="primary wide" onClick={revealLesson}>{t.reveal}<span>↓</span></button>}
      </section>

      {revealed && <section className="lesson" id="today-lesson">
        <div className="lesson-grid"><div><div className="eyebrow">{t.concept}</div><h2>{lesson.concept}</h2></div><div className="lesson-copy"><p>{lesson.intro}</p><blockquote>{lesson.takeaway}</blockquote></div></div>

        <div className="keyword-section">
          <div className="keyword-heading"><div><div className="eyebrow">{t.keywordTitle}</div><p>{t.keywordIntro}</p></div><div className="keyword-chips">{keywordMatches.map((keyword) => <span key={keyword.label} className={keyword.matched ? "keyword-chip matched" : "keyword-chip"}>{keyword.matched && <b>✓</b>}{keyword.label}</span>)}</div></div>
          <div className="keyword-carousel">{keywordMatches.map((keyword, index) => <article className={keyword.matched ? "keyword-card matched" : "keyword-card"} key={keyword.label}><div className="keyword-card-top"><span>0{index + 1}</span>{keyword.matched && <b>✓</b>}</div><h3>{keyword.label}</h3><p>{keyword.description}</p><small>{keyword.matched ? t.matched : t.notMatched}</small></article>)}</div>
        </div>

        <div className="practice-card"><div className="practice-number">01</div><div><div className="eyebrow">{t.makeFrame}</div><h3>{t.tryToday}</h3><p>{lesson.practice}</p></div></div>

        <div className="shot-card">
          <div className="shot-copy"><div className="eyebrow">{x.fieldProof}</div><h3>{x.yourShot}</h3><p>{x.shotHelp}</p><small>{x.localOnly}</small></div>
          <div className="shot-media">{practiceShotUrl ? <img src={practiceShotUrl} alt={x.yourShot} /> : <button className="shot-placeholder" onClick={() => fileRef.current?.click()}><span>＋</span><b>{x.addShot}</b></button>}<input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onPracticeShot} hidden /></div>
          <div className="shot-actions">{practiceShotUrl && <><button onClick={() => fileRef.current?.click()}>{x.replaceShot}</button><button onClick={clearPracticeShot}>{x.removeShot}</button></>}{shotError && <span role="alert">{x.shotError}</span>}</div>
        </div>

        <div className="lesson-complete"><button className={completedToday ? "complete-button done" : "complete-button"} onClick={saveToday}>{completedToday ? t.saved : t.complete}</button></div>
      </section>}
    </> : <section className="journal-view">
      <div className="intro-row journal-title"><div><div className="eyebrow">{t.practice}</div><h1>{t.journalTitle.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h1></div><p>{t.journalIntro}</p></div>

      <section className="rhythm-card">
        <div className="rhythm-head"><div><div className="eyebrow">{x.rhythm}</div><strong>{weekCount}/7 <span>{x.thisWeek}</span></strong></div><span>{streak > 0 ? `${streak}×` : "—"}</span></div>
        <div className="week-strip">{week.map((day) => <div className={`${completedKeys.has(day.key) ? "complete" : ""} ${day.today ? "today" : ""}`} key={day.key}><span>{day.label}</span><b>{day.day}</b><i /></div>)}</div>
      </section>

      <div className="stats"><article><strong>{journal.length}</strong><span>{t.days}</span></article><article><strong>{streak}</strong><span>{t.currentStreak}</span></article><article><strong>{new Set(journal.map((entry) => entry.concept)).size}</strong><span>{t.learned}</span></article></div>

      {journal.length ? <div className="entries">{journal.map((entry) => <article key={entry.date}>
        <time>{new Intl.DateTimeFormat(locale === "zh" ? "zh-TW" : "en", { month:"short", day:"numeric", year:"numeric" }).format(new Date(`${entry.date}T12:00:00`))}</time>
        <div className="entry-body"><h3>{entry.concept}</h3><p>{entry.artwork} · {entry.artist}</p>{entry.note ? <blockquote>“{entry.note}”</blockquote> : <small>{x.noNote}</small>}</div>
        {entry.shot && <ShotThumb date={entry.date} alt={x.yourShot} />}
      </article>)}</div> : <div className="empty-state"><span className="brand-mark large"><i /></span><h2>{t.emptyTitle}</h2><p>{t.emptyBody}</p><button className="primary" onClick={() => setTab("today")}>{t.goToday}</button></div>}
    </section>}

    <footer><span className="brand-mark mini"><i /></span><span>Daily Shot</span><span>{t.footer}</span></footer>
  </main>;
}
