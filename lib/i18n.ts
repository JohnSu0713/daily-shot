import type { Lesson } from "./content";

export type Locale = "en" | "zh";

export const UI = {
  en: { tagline:"Learn to see.", streak:"day streak", startStreak:"Start your streak", today:"Today", journal:"Journal", dailyPhoto:"DAILY PHOTOGRAPH", lookTitle:"Look first.\nRead later.", intro:"One master photograph, one visual idea, one small assignment. About five minutes a day.", loading:"Loading today’s photograph", imageBreak:"The image host is taking a break.", imageBreakBody:"The lesson still works. Open the source photograph, then return here.", openSource:"Open source photograph ↗", source:"Source ↗", observe:"Spend 30 seconds with the frame before reading anything else.", startLook:"Start 30s look", justLook:"Just look. No judging.", reveal:"Reveal today’s lesson", concept:"TODAY’S CONCEPT", makeFrame:"MAKE A FRAME", tryToday:"Try it today", yourNote:"YOUR NOTE", notice:"What did you notice?", notePlaceholder:"One sentence is enough…", saved:"✓ Saved for today", complete:"Complete today", practice:"YOUR PRACTICE", journalTitle:"Learning\njournal.", journalIntro:"A quiet record of the photographs and visual ideas you have actually spent time with.", days:"days practiced", currentStreak:"current streak", learned:"concepts learned", emptyTitle:"Your journal starts with one photograph.", emptyBody:"Finish today’s lesson and your first entry will appear here.", goToday:"Go to today", footer:"Seven photographs · seven ways of seeing" },
  zh: { tagline:"學會看見。", streak:"天連續學習", startStreak:"開始你的連續學習", today:"今日", journal:"日誌", dailyPhoto:"每日攝影作品", lookTitle:"先看。\n再讀。", intro:"每天一張經典攝影、一個視覺概念、一個小練習。大約五分鐘。", loading:"正在載入今天的攝影作品", imageBreak:"圖片來源暫時無法使用。", imageBreakBody:"課程仍可繼續。先開啟原始作品，再回到這裡。", openSource:"開啟原始作品 ↗", source:"來源 ↗", observe:"先花 30 秒看這張照片，再閱讀其他內容。", startLook:"開始 30 秒觀察", justLook:"只看。先別判斷。", reveal:"揭曉今天的課程", concept:"今日概念", makeFrame:"拍一張照片", tryToday:"今天試試看", yourNote:"你的筆記", notice:"你注意到了什麼？", notePlaceholder:"一句話就夠了…", saved:"✓ 今日已儲存", complete:"完成今天", practice:"你的練習", journalTitle:"學習\n日誌。", journalIntro:"安靜記錄你真正花時間看過的攝影作品與視覺概念。", days:"練習天數", currentStreak:"目前連續天數", learned:"學會的概念", emptyTitle:"你的日誌從一張照片開始。", emptyBody:"完成今天的課程，第一篇紀錄就會出現在這裡。", goToday:"前往今日課程", footer:"七張照片 · 七種觀看方式" }
} as const;

const ZH: Record<string, Omit<Lesson,"id">> = {
 gesture:{concept:"姿態承載故事",kicker:"人物注意力",intro:"在閱讀表情之前，先看手、肩膀、姿勢，以及身體傾向哪裡。姿態往往比表情更早告訴你照片的情緒。",prompts:["你的視線先落在哪裡？","哪個動作最有張力？","如果裁掉一個人，畫面會怎麼改變？"],practice:"拍攝一個沒有刻意擺姿勢的人。拍三張，讓手勢或姿態——而不是臉部表情——承載意義。",takeaway:"有力量的照片常常間接地描述情緒。"},
 layers:{concept:"用層次建立畫面",kicker:"構圖",intro:"前景、中景和背景都可以承載資訊。有層次的畫面更像被發現，而不是被安排。",prompts:["你能找出幾個視覺層次？","哪個人物穩住了畫面？","哪裡的重複形成節奏？"],practice:"找一個繁忙場景。等到前景、中景與背景都有值得保留的元素，再按下快門。",takeaway:"深度不只是光學效果，也可以是資訊的深度。"},
 framing:{concept:"讓取景產生壓力",kicker:"人像",intro:"緊密的取景會減少逃離畫面的空間。背景質感、邊緣張力與直接眼神，都能讓簡單的人像變得難以忽視。",prompts:["畫框離主體有多近？","背景提供了什麼？","更多留白會讓它更強還是更弱？"],practice:"用三種距離拍同一張人像：寬鬆、中等、近到有點不舒服。比較情緒壓力如何改變。",takeaway:"距離是最有力的敘事控制之一。"},
 symbols:{concept:"使用符號，再讓它變複雜",kicker:"視覺意義",intro:"旗幟、制服、工具、建築與物件自帶文化意義。好的照片會利用這些意義，但不把自己變成一句簡單的圖說。",prompts:["哪個物件最像符號？","你看到什麼視覺矛盾？","哪個細節讓照片不只傳達單一訊息？"],practice:"拍攝一個熟悉的符號，把它放在會改變或複雜化原本意義的情境中。",takeaway:"當照片加入摩擦，符號才會變得有趣。"},
 color:{concept:"用色彩組織空間",kicker:"色彩",intro:"色彩具有結構性。重複的色相可以連結畫面中相隔很遠的區域，而一個對比色能立刻成為焦點。",prompts:["哪個色系占主導？","最強的色彩對比在哪裡？","想像成黑白後，哪些部分仍然成立？"],practice:"選一種顏色，拍五張照片，讓它分別出現在構圖中的不同位置。",takeaway:"把色彩當成形狀，而不是裝飾。"},
 atmosphere:{concept:"把天氣當成視覺材料",kicker:"氛圍",intro:"灰塵、雨、霧、雪與強烈陽光都會改變對比、深度、邊緣與尺度。環境條件不是障礙，而是影像的一部分。",prompts:["氛圍隱藏了什麼？","畫面如何傳達尺度？","哪個邊緣最清楚？為什麼？"],practice:"下一個天氣不完美的日子，拍一些必須依靠這種天候才成立的照片，而不是試著掩飾它。",takeaway:"氛圍可以同時成為主題與構圖。"},
 depth:{concept:"讓視線在畫面中旅行",kicker:"深度",intro:"引導線、重複平面與重疊形狀會為視線建立一條穿越照片的路徑。好的深度讓觀看具有順序。",prompts:["視覺入口在哪裡？","哪條線把你帶得更深？","視線最後停在哪裡？"],practice:"拍攝一個室內空間，至少使用三個深度平面與一條明確的方向線。",takeaway:"一張照片也可以有開始、中段與結尾。"}
};

export function localizeLesson(lesson: Lesson, locale: Locale): Lesson {
  return locale === "zh" && ZH[lesson.id] ? {id:lesson.id,...ZH[lesson.id]} : lesson;
}