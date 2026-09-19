"use client";
import { useEffect, useMemo, useState } from "react";
import { getDailyPhotograph, localDateKey } from "../lib/artic";
import { getLesson } from "../lib/content";
import { Locale, UI, localizeLesson } from "../lib/i18n";

type Theme="light"|"dark";
type JournalEntry={date:string;artwork:string;artist:string;concept:string;note:string};
const JOURNAL_KEY="daily-shot:journal:v2";
const readJournal=():JournalEntry[]=>{try{return JSON.parse(localStorage.getItem(JOURNAL_KEY)||"[]")}catch{return[]}};
function calcStreak(entries:JournalEntry[]){const completed=new Set(entries.map(e=>e.date));let streak=0;const cursor=new Date();while(completed.has(localDateKey(cursor))){streak++;cursor.setDate(cursor.getDate()-1)}return streak}

export default function Home(){
 const today=useMemo(()=>getDailyPhotograph(),[]);
 const baseLesson=useMemo(()=>getLesson(today.artwork.lessonId),[today.artwork.lessonId]);
 const [locale,setLocale]=useState<Locale>("en"); const [theme,setTheme]=useState<Theme>("light");
 const [tab,setTab]=useState<"today"|"journal">("today"); const [revealed,setRevealed]=useState(false);
 const [imageIndex,setImageIndex]=useState(0); const [imageLoaded,setImageLoaded]=useState(false); const [imageFailed,setImageFailed]=useState(false);
 const [journal,setJournal]=useState<JournalEntry[]>([]); const [note,setNote]=useState(""); const [seconds,setSeconds]=useState(30); const [timerRunning,setTimerRunning]=useState(false);
 const t=UI[locale]; const lesson=localizeLesson(baseLesson,locale);
 useEffect(()=>{const l=localStorage.getItem("daily-shot:locale");if(l==="en"||l==="zh")setLocale(l);const saved=localStorage.getItem("daily-shot:theme");const initial=saved==="dark"||saved==="light"?saved:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");setTheme(initial);document.documentElement.dataset.theme=initial;const items=readJournal();setJournal(items);setNote(items.find(e=>e.date===today.dateKey)?.note||"")},[today.dateKey]);
 useEffect(()=>{if(!timerRunning||seconds<=0)return;const id=window.setInterval(()=>setSeconds(v=>v-1),1000);return()=>clearInterval(id)},[timerRunning,seconds]);
 useEffect(()=>{if(seconds===0)setTimerRunning(false)},[seconds]);
 const changeLocale=(l:Locale)=>{setLocale(l);localStorage.setItem("daily-shot:locale",l);document.documentElement.lang=l==="zh"?"zh-Hant":"en"};
 const changeTheme=(v:Theme)=>{setTheme(v);localStorage.setItem("daily-shot:theme",v);document.documentElement.dataset.theme=v};
 const completedToday=journal.some(e=>e.date===today.dateKey),streak=calcStreak(journal);
 const imageError=()=>{const next=imageIndex+1;if(next<today.artwork.imageUrls.length){setImageIndex(next);setImageLoaded(false)}else setImageFailed(true)};
 const saveToday=()=>{const entry={date:today.dateKey,artwork:today.artwork.title,artist:today.artwork.artist,concept:lesson.concept,note:note.trim()};const next=[entry,...journal.filter(e=>e.date!==today.dateKey)].sort((a,b)=>b.date.localeCompare(a.date));localStorage.setItem(JOURNAL_KEY,JSON.stringify(next));setJournal(next)};
 const startTimer=()=>{setSeconds(30);setTimerRunning(true)};
 const date=new Intl.DateTimeFormat(locale==="zh"?"zh-TW":"en",{month:"short",day:"numeric"}).format(new Date());
 return <main className="shell">
  <header className="topbar"><button className="brand-lockup" onClick={()=>setTab("today")}><span className="brand-mark"><i/></span><span><b>Daily Shot</b><small>{t.tagline}</small></span></button>
   <div className="header-actions"><div className="preference-switch" aria-label="Language"><button className={locale==="en"?"selected":""} onClick={()=>changeLocale("en")}>EN</button><button className={locale==="zh"?"selected":""} onClick={()=>changeLocale("zh")}>中文</button></div><div className="preference-switch" aria-label="Theme"><button className={theme==="light"?"selected":""} onClick={()=>changeTheme("light")} aria-label="Light mode">☀︎</button><button className={theme==="dark"?"selected":""} onClick={()=>changeTheme("dark")} aria-label="Dark mode">☾</button></div><span className="date-chip">{date}</span></div>
  </header>
  <nav className="tabs"><button className={tab==="today"?"active":""} onClick={()=>setTab("today")}>{t.today}</button><button className={tab==="journal"?"active":""} onClick={()=>setTab("journal")}>{t.journal} <span>{journal.length}</span></button></nav>
  {tab==="today"?<><section className="intro-row"><div><div className="eyebrow">{t.dailyPhoto} · {lesson.kicker.toUpperCase()}</div><h1>{t.lookTitle.split("\n").map((x,i)=><span key={x}>{x}{i===0&&<br/>}</span>)}</h1></div><p>{t.intro}</p></section>
   <section className="photo-stage">{!imageFailed?<><>{!imageLoaded&&<div className="image-skeleton"><span>{t.loading}</span></div>}</><img className={`photo ${imageLoaded?"loaded":""}`} src={today.artwork.imageUrls[imageIndex]} alt={today.artwork.title} onLoad={()=>setImageLoaded(true)} onError={imageError}/></>:<div className="image-error"><span className="brand-mark large"><i/></span><h2>{t.imageBreak}</h2><p>{t.imageBreakBody}</p><a href={today.artwork.sourceUrl} target="_blank">{t.openSource}</a></div>}{timerRunning&&<div className="timer-overlay"><span>{seconds}</span><small>{t.justLook}</small></div>}</section>
   <div className="caption-row"><div><strong>{today.artwork.title}</strong><span>{today.artwork.artist} · {today.artwork.date} · {today.artwork.location}</span></div><a href={today.artwork.sourceUrl} target="_blank">{t.source}</a></div><div className="credit">{today.artwork.credit}</div>
   <section className="observe"><div className="observe-head"><p>{t.observe}</p><button className="timer-button" onClick={startTimer} disabled={timerRunning}>{timerRunning?`${seconds}s`:t.startLook}</button></div><div className="questions">{lesson.prompts.map((p,i)=><article key={p}><b>0{i+1}</b><span>{p}</span></article>)}</div>{!revealed&&<button className="primary wide" onClick={()=>setRevealed(true)}>{t.reveal}<span>↓</span></button>}</section>
   {revealed&&<section className="lesson"><div className="lesson-grid"><div><div className="eyebrow">{t.concept}</div><h2>{lesson.concept}</h2></div><div className="lesson-copy"><p>{lesson.intro}</p><blockquote>{lesson.takeaway}</blockquote></div></div><div className="practice-card"><div className="practice-number">01</div><div><div className="eyebrow">{t.makeFrame}</div><h3>{t.tryToday}</h3><p>{lesson.practice}</p></div></div><div className="reflection"><div><div className="eyebrow">{t.yourNote}</div><h3>{t.notice}</h3></div><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={t.notePlaceholder} maxLength={400}/><div className="reflection-foot"><span>{note.length}/400</span><button className={completedToday?"complete-button done":"complete-button"} onClick={saveToday}>{completedToday?t.saved:t.complete}</button></div></div></section>}
  </>:<section className="journal-view"><div className="intro-row journal-title"><div><div className="eyebrow">{t.practice}</div><h1>{t.journalTitle.split("\n").map((x,i)=><span key={x}>{x}{i===0&&<br/>}</span>)}</h1></div><p>{t.journalIntro}</p></div><div className="stats"><article><strong>{journal.length}</strong><span>{t.days}</span></article><article><strong>{streak}</strong><span>{t.currentStreak}</span></article><article><strong>{new Set(journal.map(e=>e.concept)).size}</strong><span>{t.learned}</span></article></div>{journal.length?<div className="entries">{journal.map(e=><article key={e.date}><time>{e.date}</time><div><h3>{e.concept}</h3><p>{e.artwork} · {e.artist}</p>{e.note&&<blockquote>“{e.note}”</blockquote>}</div></article>)}</div>:<div className="empty-state"><span className="brand-mark large"><i/></span><h2>{t.emptyTitle}</h2><p>{t.emptyBody}</p><button className="primary" onClick={()=>setTab("today")}>{t.goToday}</button></div>}</section>}
  <footer><span className="brand-mark mini"><i/></span><span>Daily Shot</span><span>{t.footer}</span></footer>
 </main>
}