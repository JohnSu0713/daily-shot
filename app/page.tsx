"use client";
import { useEffect, useState } from "react";
import { Artwork, getDailyPhotograph } from "../lib/artic";

type Locale = "en" | "zh";
type Theme = "light" | "dark";

const copy = {
  en: {
    tagline:"Learn to see.", today:"Today", journal:"Journal", daily:"DAILY PHOTOGRAPH", title:"Look before you read.", loading:"Finding today’s photograph…", failed:"Today’s photograph could not be displayed. Please refresh to try again.", lead:"Spend 30 seconds looking. Don’t decide whether you like it yet.", prompts:["Where does your eye go first?","What is the light doing?","What might exist outside the frame?"], reveal:"Reveal today’s lesson", conceptLabel:"TODAY’S CONCEPT", concept:"Observe Before Judging", intro:"Separate what you see from what you assume. Start with light, shape, gesture, distance, repetition, contrast, and framing.", practiceLabel:"TRY IT TODAY", practiceTitle:"One subject, three readings", practice:"Photograph one ordinary subject three ways: emphasize light, shape, then story. Compare which frame communicates most clearly.", complete:"Complete today’s practice", completed:"✓ Today complete", progress:"YOUR PROGRESS", journalTitle:"Learning journal", days:"Days completed", concepts:"Concepts learned", themeLight:"Light", themeDark:"Dark"
  },
  zh: {
    tagline:"學會看見。", today:"今日", journal:"日誌", daily:"每日攝影作品", title:"先看，再讀。", loading:"正在準備今天的攝影作品…", failed:"今天的攝影作品無法顯示，請重新整理後再試。", lead:"先花 30 秒觀察。暫時不要判斷自己喜不喜歡這張照片。", prompts:["你的視線第一個落在哪裡？","光線正在做什麼？","畫面之外可能還有什麼？"], reveal:"揭曉今天的課程", conceptLabel:"今日概念", concept:"先觀察，再判斷", intro:"把你真正看見的，和你以為發生的事情分開。先觀察光線、形狀、動作、距離、重複、對比與取景。", practiceLabel:"今天試試看", practiceTitle:"一個主體，三種觀看方式", practice:"選一個日常主體拍三張照片：第一張強調光線、第二張強調形狀、第三張強調故事。比較哪一張最清楚地傳達你的想法。", complete:"完成今天的練習", completed:"✓ 今日已完成", progress:"你的進度", journalTitle:"學習日誌", days:"完成天數", concepts:"學會的概念", themeLight:"淺色", themeDark:"深色"
  }
} as const;

export default function Home() {
  const [art, setArt] = useState<Artwork | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState<"today" | "journal">("today");
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const t = copy[locale];

  useEffect(() => {
    setDone(localStorage.getItem("daily-shot:today") === "done");
    const savedLocale = localStorage.getItem("daily-shot:locale") as Locale | null;
    const savedTheme = localStorage.getItem("daily-shot:theme") as Theme | null;
    if (savedLocale === "en" || savedLocale === "zh") setLocale(savedLocale);
    const initialTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
    getDailyPhotograph().then(result => { if(result){setArt(result.artwork);setImageUrl(result.imageUrl);} }).finally(()=>setLoading(false));
  }, []);

  const switchLocale = (value: Locale) => { setLocale(value); localStorage.setItem("daily-shot:locale", value); document.documentElement.lang = value === "zh" ? "zh-Hant" : "en"; };
  const switchTheme = (value: Theme) => { setTheme(value); localStorage.setItem("daily-shot:theme", value); document.documentElement.dataset.theme = value; };
  const complete = () => { localStorage.setItem("daily-shot:today", "done"); setDone(true); };

  return <main className="shell">
    <header><div><div className="eyebrow">DAILY SHOT</div><div className="brand">{t.tagline}</div></div><div className="controls" aria-label="Preferences"><div className="segmented"><button className={locale==="en"?"selected":""} onClick={()=>switchLocale("en")}>EN</button><button className={locale==="zh"?"selected":""} onClick={()=>switchLocale("zh")}>中文</button></div><div className="segmented"><button aria-label={t.themeLight} className={theme==="light"?"selected":""} onClick={()=>switchTheme("light")}>☀︎</button><button aria-label={t.themeDark} className={theme==="dark"?"selected":""} onClick={()=>switchTheme("dark")}>☾</button></div></div></header>
    <nav><button className={tab==="today"?"active":""} onClick={()=>setTab("today")}>{t.today}</button><button className={tab==="journal"?"active":""} onClick={()=>setTab("journal")}>{t.journal}</button></nav>
    {tab === "today" ? <><section className="hero"><div className="eyebrow">{t.daily}</div><h1>{t.title}</h1>{loading?<div className="placeholder">{t.loading}</div>:art&&imageUrl&&!imageFailed?<figure><img className="photo" src={imageUrl} alt={art.title} onError={()=>setImageFailed(true)}/><figcaption>{art.title} · {art.artist_title||"Unknown artist"} · {art.date_display}</figcaption></figure>:<div className="placeholder">{t.failed}</div>}<p className="lead">{t.lead}</p><div className="questions">{t.prompts.map((p,i)=><article key={p}><b>0{i+1}</b><span>{p}</span></article>)}</div>{!revealed&&<button className="primary" onClick={()=>setRevealed(true)}>{t.reveal}</button>}</section>{revealed&&<section className="lesson"><div className="eyebrow">{t.conceptLabel}</div><h2>{t.concept}</h2><p>{t.intro}</p><div className="practice"><div className="eyebrow">{t.practiceLabel}</div><h3>{t.practiceTitle}</h3><p>{t.practice}</p>{done?<strong>{t.completed}</strong>:<button className="primary" onClick={complete}>{t.complete}</button>}</div></section>}</>:<section><div className="eyebrow">{t.progress}</div><h1>{t.journalTitle}</h1><div className="stats"><article><strong>{done?1:0}</strong><span>{t.days}</span></article><article><strong>{done?1:0}</strong><span>{t.concepts}</span></article></div></section>}
    <footer>Daily Shot · v0.2</footer>
  </main>;
}