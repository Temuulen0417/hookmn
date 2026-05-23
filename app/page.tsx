"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "hook", icon: "⚡", label: "Viral Hook", labelMn: "Вирал Хук" },
  { id: "caption", icon: "✍️", label: "Caption", labelMn: "Тайлбар" },
  { id: "thumbnail", icon: "🎯", label: "Thumbnail", labelMn: "Зургийн текст" },
  { id: "hashtag", icon: "#", label: "Hashtag", labelMn: "Хэштэг" },
  { id: "idea", icon: "💡", label: "Content Idea", labelMn: "Контент санаа" },
  { id: "comment", icon: "💬", label: "Engagement", labelMn: "Engagement" },
  { id: "story", icon: "📖", label: "Story", labelMn: "Сториас санаа" },
];

const PLATFORMS = ["TikTok", "Facebook Reel", "YouTube Shorts", "Instagram"];

const TRENDING_TOPICS = [
  { tag: "#МонголБизнес", count: "12.4K" },
  { tag: "#ВираалМонгол", count: "9.8K" },
  { tag: "#УБМотивэйшн", count: "8.1K" },
  { tag: "#МоринХуур", count: "7.3K" },
  { tag: "#LuxuryMongolia", count: "6.9K" },
  { tag: "#HustleMongol", count: "5.4K" },
  { tag: "#МонголCreator", count: "4.7K" },
  { tag: "#AlphaMindset", count: "3.9K" },
];

const STATS = [
  { value: 24800, label: "Бүтээгч", suffix: "+" },
  { value: 1200000, label: "Хук үүссэн", suffix: "+" },
  { value: 98, label: "Хэрэглэгч сэтгэл хангалуун", suffix: "%" },
  { value: 340, label: "Улсуудад ашиглагдаж байна", suffix: "+" },
];

const TESTIMONIALS = [
  {
    name: "Б. Мөнхзул",
    handle: "@munkhuul_creator",
    avatar: "М",
    color: "#a855f7",
    text: "Hook.mn ашиглаад миний TikTok фоллоуер 10 хоногт 50K болсон. Энэ платформ бол GAME CHANGER!",
    followers: "234K",
    platform: "TikTok",
  },
  {
    name: "Д. Батболд",
    handle: "@batbold.hustle",
    avatar: "Б",
    color: "#06b6d4",
    text: "Хук generator нь миний контент маш хурдан viral болгоход тусалсан. Реел бүр 100K+ view авдаг болсон.",
    followers: "89K",
    platform: "Facebook",
  },
  {
    name: "Н. Сарнай",
    handle: "@sarnai.luxury",
    avatar: "С",
    color: "#f59e0b",
    text: "Thumbnail text нь маш powerful. Хүмүүс click хийхгүй байхаар боломжгүй болдог.",
    followers: "156K",
    platform: "YouTube",
  },
];

const LIVE_ACTIVITIES = [
  "Улаанбаатар дахь хэрэглэгч viral hook үүсгэлээ",
  "Дархан-ын creator 20 хук хадгаллаа",
  "Эрдэнэт дэх бүтээгч caption авлаа",
  "UB creator 500+ hashtag ашигласан",
  "Нэгэн хэрэглэгч контент санаа авлаа",
];

const PRICING_PLANS = [
  {
    id: "free",
    name: "Free",
    nameMn: "Үнэгүй",
    price: "₮0",
    period: "/сар",
    color: "#64748b",
    glow: "rgba(100,116,139,0.2)",
    badge: null,
    features: [
      "5 хук/өдөр",
      "3 caption/өдөр",
      "10 hashtag/өдөр",
      "Thumbnail текст",
      "Контент санаа",
    ],
    locked: ["GPT-4o горим", "Хязгааргүй үүсгэх", "Priority дараалал", "Analytics"],
    cta: "Эхлэх",
    ctaStyle: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" },
  },
  {
    id: "pro",
    name: "Creator Pro",
    nameMn: "Бүтээгч Про",
    price: "₮29,900",
    period: "/сар",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.25)",
    badge: "🔥 ХАМГИЙН АЛДАРТАЙ",
    features: [
      "Хязгааргүй хук",
      "Хязгааргүй caption",
      "50 hashtag/дарах",
      "GPT-4o горим",
      "Favorite & History",
      "Priority дараалал",
      "Telegram дэмжлэг",
    ],
    locked: ["Agency dashboard", "Team access"],
    cta: "Pro болох",
    ctaStyle: { background: "linear-gradient(135deg,#a855f7,#7c3aed)", boxShadow: "0 8px 32px rgba(168,85,247,0.4)" },
  },
  {
    id: "agency",
    name: "Agency",
    nameMn: "Агентлаг",
    price: "₮99,900",
    period: "/сар",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
    badge: "👑 PREMIUM",
    features: [
      "Бүх Pro боломж",
      "5 хэрэглэгч",
      "Agency dashboard",
      "Team collaboration",
      "White-label тайлан",
      "Dedicated дэмжлэг",
      "Custom AI training",
    ],
    locked: [],
    cta: "Agency болох",
    ctaStyle: { background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 8px 32px rgba(245,158,11,0.35)" },
  },
];

// ─── Fake AI Outputs ──────────────────────────────────────────────────────────
const FAKE_OUTPUTS = {
  hook: (topic, platform) => [
    `Монгол хүн ийм зүйл хийнэ гэж хэн ч бодоогүй байсан 🔥 — ${topic}`,
    `${topic}-ын тухай 99% хүн мэдэхгүй байгаа нэг зүйл...`,
    `Энэ видеог харсны дараа таны ${topic}-д хандах хандлага өөрчлөгдөнө`,
    `POV: Чи ${topic}-ын тухай үнэнийг мэдэх гэж байна 👀`,
    `${platform}-д хамгийн их viral болж буй ${topic} content — яагаад?`,
    `Миний ${topic} journey 0-аас эхэлж яаж энд хүрсэн бэ...`,
    `Монголын top creator-ууд ${topic}-ын талаар яг ийм зүйл хийдэг`,
    `${topic} гэдэг зүйлийн талаар хэн ч тамд хэлдэггүй нэг нууц`,
    `Wait for it... ${topic}-ын тухай амьдралаа өөрчилсөн момент 🎯`,
    `Яагаад зарим хүн ${topic}-аар тэр болгон амжилттай болдог вэ? 💡`,
    `${topic} = миний амьдралыг LITERALLY өөрчилсэн зүйл ✨`,
    `Энэ TikTok харсан бүх хүн ${topic}-ын тухай өөрөөр бодно`,
    `CONTROVERSIAL TAKE: ${topic} гэдэг бол ихэнх хүн буруу ойлгодог`,
    `Монголын ${topic} creator болох 3 шат — хэн ч хэлдэггүй`,
    `${topic} эхлэхээс өмнө энэ видеог 100% харах хэрэгтэй 🚨`,
    `Flex: Миний ${topic} routine бол энэ — judge мэ if you want 💅`,
    `${topic}-аар амжилтанд хүрэхийн тулд яг ийм сэтгэлгээ хэрэгтэй`,
    `Real talk: ${topic} гэдэг нь хүмүүс боддогоос маш өөр байдаг`,
    `${topic} дотор нуугдаж байгаа энэ нэг зүйлийг та мэдэх үү? 🤫`,
    `Successful Монголын creators ${topic}-ын тухай ийм хандлагатай байдаг`,
  ],
  caption: (topic, platform) => [
    `✨ ${topic} гэдэг бол зүгээр нэг trend биш — энэ бол LIFESTYLE 🔥\n\nМонголын creator-ууд энэ замыг сонгосоор байна. Чи бэлэн үү? 💜\n\n#МонголCreator #${topic.replace(/\s/g, "")} #Вирал`,
    `💡 ${platform}-д viral болохын тулд нэг зүйл хэрэгтэй:\n\n${topic}-д AUTHENTIC байх 🎯\n\nBe real. Be bold. Be Mongolian. 🇲🇳`,
    `🚀 ${topic} journey минь energy-тэй байсан ч...\n\nAlways remember: мянган км-ийн аялал нэг алхмаас эхэлдэг 🐎`,
    `POV: Та ${topic}-ын талаар бүх зүйлийг мэдэж байгаа мэт 😌\n\nАлдаа байна. Бид бүгд тасралтгүй суралцаж байдаг 📚\n\nSave this for later!`,
    `💰 ${topic} + consistency + Mongolian spirit = 🔥\n\nЭнгийн тооцоо. Яахаа сайн мэд 💜`,
    `🎯 ${topic} талаар one thing та мэдэх ёстой:\n\nМонголын creator эргэн тойронд байгаа хамгийн том хөрөнгийн нэг. Own it. 🦅`,
    `Goodnight era of not knowing about ${topic} 🌙\n\nHello to your glow up 🌟\n\n#НойрсоорБайна #МонголCreator`,
    `${topic} check ✓\nConfidence check ✓\nMongolian energy check ✓\n\nWe are SO ready 💜🔥`,
    `Real ones know ${topic} hits different when you truly understand it 🤌\n\nDrop a 🔥 if you relate`,
    `This is your sign to finally start your ${topic} journey 🚨\n\nYou've been waiting long enough. Let's go. 💪`,
    `${topic} era > everything else 🌟\n\nAnd I will NOT be taking questions 😤💜`,
    `За юу гэж хэлэх вэ... ${topic} гэдэг нь цаанаасаа их зүйл агуулсан байдаг юм.\n\nDrop your thoughts below 👇`,
  ],
  thumbnail: (topic) => [
    `${topic.toUpperCase()} НУУЦ`,
    `ХЭН Ч ХЭЛДЭГГҮЙ`,
    `МИНИЙ АЛДАА`,
    `ЭНЭ БОДООГҮЙ БАЙСАН`,
    `${topic} = ИЙМ ЮМ УУ`,
    `ГАЙХАЛТАЙ БАЙНА`,
    `ЯАГААД ИЙМ ВЭ`,
    `МАРГААШ ОРОЙТОНО`,
    `NOBODY KNEW THIS`,
    `WAIT FOR IT...`,
    `1 ӨДӨРТ ${topic}`,
    `БҮГДЭД ХЭЛНЭ ЭЭ`,
    `ХАМГИЙН ЭЦЭСТ`,
    `ЭНЭ БОЛЖ МАГАДГҮЙ`,
    `ОДОО ХАРЖ БАЙ`,
  ],
  hashtag: (topic, platform) => [
    `#МонголCreator`, `#ВираалМонгол`, `#МонголБизнес`, `#УБМотивэйшн`,
    `#HustleMongol`, `#AlphaMindset`, `#LuxuryMongolia`, `#МоринХуур`,
    `#${topic.replace(/\s/g, "")}`, `#${topic.replace(/\s/g, "")}Mongolia`,
    `#МонголТикТок`, `#МонголYouTube`, `#CreatorEconomy`, `#ContentCreator`,
    `#${platform.replace(/\s/g, "")}Mongolia`, `#МонголInstagram`,
    `#ВираалКонтент`, `#МонголАйТи`, `#UlaanbaatarLife`, `#МонголGenZ`,
    `#viral`, `#fyp`, `#trending`, `#mongolian`, `#creator`,
    `#contentcreator`, `#socialmedia`, `#${topic.toLowerCase().replace(/\s/g, "")}`,
    `#viralcontent`, `#tiktoktrend`,
  ],
  idea: (topic) => [
    `[POV]: Ажилгүй байсан ${topic} creator байх нь — 30 хоногийн тэмдэглэл`,
    `[Day in My Life]: ${topic}-тай Монгол creator-ын нэг өдөр 🎬`,
    `[Challenge]: 7 хоногт зөвхөн ${topic} content хийж болох уу? 🔥`,
    `[Before vs After]: ${topic} эхлэхээс өмнө ба хойно миний амьдрал`,
    `[Story Time]: ${topic}-аар хамгийн том алдаа хийсэн тухай`,
    `[Tutorial]: ${topic}-г 0-аас 10 хоногт сурах аргачлал 📚`,
    `[Reacting To]: Монголын top ${topic} creator-уудын content`,
    `[Q&A]: ${topic}-тай холбоотой хамгийн их асуудаг асуултад хариулъя`,
    `[Collab Idea]: Монголын 5 ${topic} creator нэг видеонд — mega viral!`,
    `[Controversial]: ${topic}-ын тухай хэн ч дуртгахыг хүсдэггүй үнэн`,
  ],
  comment: (topic) => [
    `Энэ ${topic}-ын тухай видео миний амьдралыг literally өөрчиллөө 🙏`,
    `OMG ийм ${topic} content байна гэж мэдээгүй байлаа 😱 Subscribed!`,
    `${topic} гэж байдгийг мэдэж байсан ч ийм depth-тэй тайлбар анх удаа харлаа`,
    `Энэ видеог ах/эгч/найздаа tag хийх хэрэгтэй байна 🏷️`,
    `${topic} era has arrived 🔥 Бид бүгд ready болсон уу?`,
    `Part 2 хийгээрэй! ${topic}-ын дараагийн level рүү орохыг хүсч байна 🙏`,
    `Яг одоо ${topic} эхэлнэ гэж шийдлээ. Thanks for this! 💪`,
    `Mongolia + ${topic} + consistency = 🔥🔥🔥 Энэ тэгшитгэл 100% зөв`,
    `Энэ ${topic} видео algorithm-д гарах ёстой. Share хийж байна 📢`,
    `Real talk: ${topic}-ын тухай хамгийн honest content байна ✅`,
  ],
  story: (topic) => [
    `Poll: ${topic}-ын тухай та юу мэдэхийг хүсч байна? [Илүү ихийг мэдье/Аль хэдийн мэдэж байна]`,
    `Question sticker: ${topic}-аар таны хамгийн том сорилт юу байсан бэ?`,
    `Quiz: ${topic}-ын тухай 5 асуулт — дундаасаа хичнээ зөв гарах вэ? 🎯`,
    `Countdown: ${topic}-ын тухай тусгай видео гарахад... [хугацааны тоолуур]`,
    `Slider: ${topic} гэдэгт хэр их passionate байна вэ? 🔥`,
    `Before/After story: ${topic} journey-ийн маш solide proof`,
    `Behind-the-scenes: ${topic} content хэрхэн бүтдэг талаар`,
    `DM CTA: ${topic} талаар personal зөвлөгөө авахыг хүсвэл message илгээ`,
    `Swipe-up teaser: ${topic}-ын full video link in bio! 📲`,
    `Collaborative story: ${topic}-ын талаар таны санаа бодлыг share хийгээрэй`,
  ],
};

// ─── Helper hooks ─────────────────────────────────────────────────────────────
const useLocalStorage = (key, initial) => {
  const [val, setVal] = useState(initial);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    try {
      const stored = localStorage.getItem(key);
      if (stored) setVal(JSON.parse(stored));
    } catch {}
  }, [key]);

  const save = useCallback(
    (v) => {
      setVal(v);
      try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
    },
    [key]
  );
  return [val, save];
};

const usePremium = () => {
  const [isPremium, setIsPremium] = useLocalStorage("hookmn_premium", false);
  return [isPremium, setIsPremium];
};

const useCounter = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    const id = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration]);
  return count;
};

const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Toast = ({ message, visible }) => (
  <div style={{
    position: "fixed", bottom: 32, left: "50%",
    transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
    opacity: visible ? 1 : 0,
    transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
    background: "linear-gradient(135deg,#a855f7,#06b6d4)",
    color: "#fff", padding: "12px 28px", borderRadius: 50,
    fontWeight: 700, fontSize: 14, zIndex: 9999, whiteSpace: "nowrap",
    boxShadow: "0 8px 32px rgba(168,85,247,0.5)",
  }}>
    ✓ {message}
  </div>
);

const GlowCard = ({ children, style = {}, onClick, hover = true }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
        border: hovered ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: 20,
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        boxShadow: hovered ? "0 0 30px rgba(168,85,247,0.15)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const ResultCard = ({ text, index, onCopy, onSave, saved, locked }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.03)",
        border: hov ? "1px solid rgba(168,85,247,0.35)" : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: "16px 18px",
        display: "flex", gap: 14, alignItems: "flex-start",
        transition: "all 0.25s ease",
        animation: `fadeSlideIn 0.4s ease ${index * 0.04}s both`,
        position: "relative", overflow: "hidden",
      }}
    >
      <span style={{
        minWidth: 28, height: 28, borderRadius: 8,
        background: "linear-gradient(135deg,#a855f7,#06b6d4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
      }}>{index + 1}</span>
      <p style={{
        flex: 1, margin: 0, fontSize: 14, lineHeight: 1.6, color: "#e2e8f0",
        fontFamily: "'Noto Sans', sans-serif",
        filter: locked ? "blur(5px)" : "none",
        userSelect: locked ? "none" : "auto",
        transition: "filter 0.3s",
      }}>{text}</p>
      {!locked && (
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={() => onSave(text)} title="Хадгалах" style={{
            background: saved ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.06)",
            border: saved ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, color: saved ? "#c084fc" : "#94a3b8",
            cursor: "pointer", padding: "6px 10px", fontSize: 13, transition: "all 0.2s",
          }}>{saved ? "★" : "☆"}</button>
          <button onClick={() => onCopy(text)} style={{
            background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)",
            borderRadius: 8, color: "#67e8f9", cursor: "pointer",
            padding: "6px 12px", fontSize: 12, fontWeight: 700, transition: "all 0.2s",
          }}>Copy</button>
        </div>
      )}
    </div>
  );
};

const StatCounter = ({ value, label, suffix }) => {
  const count = useCounter(value);
  const display = value >= 1000000
    ? (count / 1000000).toFixed(1) + "M"
    : value >= 1000 ? (count / 1000).toFixed(0) + "K"
    : count;
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: "clamp(28px,5vw,48px)", fontWeight: 900,
        background: "linear-gradient(135deg,#a855f7,#06b6d4)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1,
      }}>{display}{suffix}</div>
      <div style={{ color: "#64748b", fontSize: 13, marginTop: 6, fontWeight: 600 }}>{label}</div>
    </div>
  );
};

// ─── Premium Modal ────────────────────────────────────────────────────────────
const PremiumModal = ({ onClose, onUnlock }) => {
  const [method, setMethod] = useState(null);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      background: "rgba(7,7,17,0.92)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeSlideIn 0.3s ease both",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 440,
        background: "linear-gradient(135deg,rgba(168,85,247,0.12),rgba(7,7,17,0.98))",
        border: "1px solid rgba(168,85,247,0.3)", borderRadius: 24,
        padding: "36px 32px", position: "relative",
        boxShadow: "0 0 80px rgba(168,85,247,0.2)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, color: "#94a3b8", width: 32, height: 32, cursor: "pointer", fontSize: 16,
        }}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👑</div>
          <h2 style={{
            margin: "0 0 8px", fontSize: 26, fontWeight: 900,
            fontFamily: "'Space Grotesk',sans-serif",
            background: "linear-gradient(135deg,#a855f7,#06b6d4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Creator Pro Unlock</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            Хязгааргүй AI үүсгэлт + premium боломжууд
          </p>
        </div>

        {!method ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", margin: "0 0 8px" }}>
              Төлбөрийн аргаа сонго:
            </p>
            {[
              { id: "qpay", label: "QPay", emoji: "📱", color: "#06b6d4", desc: "QR кодоор төлөх" },
              { id: "monpay", label: "MonPay", emoji: "💳", color: "#a855f7", desc: "MonPay данснаас шилжүүлэх" },
              { id: "telegram", label: "Telegram-аар холбоо барих", emoji: "✈️", color: "#f59e0b", desc: "Шууд захиалах" },
            ].map((m) => (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                background: `rgba(${m.id === "qpay" ? "6,182,212" : m.id === "monpay" ? "168,85,247" : "245,158,11"},0.08)`,
                border: `1px solid rgba(${m.id === "qpay" ? "6,182,212" : m.id === "monpay" ? "168,85,247" : "245,158,11"},0.25)`,
                borderRadius: 14, padding: "16px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 28 }}>{m.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, color: "#e2e8f0", fontSize: 15, fontFamily: "'Space Grotesk',sans-serif" }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        ) : method === "qpay" || method === "monpay" ? (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 180, height: 180, margin: "0 auto 20px",
              background: "#fff", borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: "#334155", fontWeight: 700, padding: 16,
            }}>
              <div>
                <div style={{ fontSize: 48 }}>📲</div>
                <div style={{ marginTop: 8 }}>QR Code</div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Demo mode</div>
              </div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20 }}>
              {method === "qpay" ? "QPay app-аараа" : "MonPay-аараа"} уншуулж ₮29,900 төлнө үү
            </p>
            <button onClick={() => { onUnlock(); onClose(); }} style={{
              width: "100%", background: "linear-gradient(135deg,#a855f7,#7c3aed)",
              border: "none", borderRadius: 12, color: "#fff", padding: "14px",
              fontSize: 15, fontWeight: 800, cursor: "pointer",
              fontFamily: "'Space Grotesk',sans-serif",
            }}>✅ Төлсөн — Нэвтрэх</button>
            <button onClick={() => setMethod(null)} style={{
              marginTop: 10, background: "none", border: "none",
              color: "#64748b", fontSize: 13, cursor: "pointer",
            }}>← Буцах</button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✈️</div>
            <h3 style={{ color: "#f59e0b", fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8 }}>
              @hookmn_official
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
              Telegram-д бидэнд бичнэ үү. 5 минутын дотор Pro болгоно.
            </p>
            <a href="https://t.me/hookmn_official" target="_blank" rel="noreferrer" style={{
              display: "block", width: "100%", background: "linear-gradient(135deg,#0088cc,#006699)",
              border: "none", borderRadius: 12, color: "#fff", padding: "14px",
              fontSize: 15, fontWeight: 800, cursor: "pointer", textDecoration: "none",
              fontFamily: "'Space Grotesk',sans-serif", boxSizing: "border-box",
            }}>Telegram нээх ✈️</a>
            <button onClick={() => setMethod(null)} style={{
              marginTop: 10, background: "none", border: "none",
              color: "#64748b", fontSize: 13, cursor: "pointer",
            }}>← Буцах</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Pages ───────────────────────────────────────────────────────────────────

// HOME PAGE
const HomePage = ({ setPage }) => {
  const [liveIdx, setLiveIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLiveIdx((i) => (i + 1) % LIVE_ACTIVITIES.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 20px 80px", position: "relative", textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: 50, padding: "8px 18px", marginBottom: 32,
          fontSize: 12, color: "#c084fc", fontWeight: 700, letterSpacing: 1,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%", background: "#a855f7",
            display: "inline-block", animation: "pulse 1.5s infinite",
          }} />
          ЛАЙВ · {LIVE_ACTIVITIES[liveIdx]}
        </div>

        <h1 style={{
          fontSize: "clamp(42px,9vw,96px)", fontWeight: 900, lineHeight: 1.05,
          margin: "0 0 24px", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: -2,
        }}>
          <span style={{ background: "linear-gradient(135deg,#fff 0%,#e2e8f0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Монголын
          </span>
          <br />
          <span style={{ background: "linear-gradient(135deg,#a855f7 0%,#06b6d4 50%,#f59e0b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            #1 Creator AI
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(16px,2.5vw,22px)", color: "#64748b", maxWidth: 560,
          lineHeight: 1.6, margin: "0 0 48px", fontFamily: "'Noto Sans',sans-serif",
        }}>
          Вирал хук, caption, hashtag, thumbnail текст — бүгдийг нэг дарахад Монгол хэлээр үүсгэ. Монголын 24,800+ creator ашигладаг.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => setPage("tools")} style={{
            background: "linear-gradient(135deg,#a855f7,#7c3aed)", border: "none",
            borderRadius: 14, color: "#fff", padding: "18px 40px", fontSize: 17,
            fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 48px rgba(168,85,247,0.5)",
            fontFamily: "'Space Grotesk',sans-serif", transition: "transform 0.2s",
          }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
             onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            ⚡ Үнэгүй эхлэх
          </button>
          <button onClick={() => setPage("pricing")} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 14, color: "#e2e8f0", padding: "18px 32px", fontSize: 17,
            fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
          }}>
            Үнэ харах →
          </button>
        </div>

        {/* Tool pills */}
        <div style={{ display: "flex", gap: 10, marginTop: 56, flexWrap: "wrap", justifyContent: "center", maxWidth: 600 }}>
          {TOOLS.map((t, i) => (
            <div key={t.id} onClick={() => setPage("tools")} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 50, padding: "8px 18px", fontSize: 13, color: "#94a3b8",
              cursor: "pointer", fontWeight: 600,
              animation: `fadeSlideIn 0.5s ease ${i * 0.08}s both`,
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,85,247,0.1)"; e.currentTarget.style.color = "#c084fc"; e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              {t.icon} {t.labelMn}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: "60px 20px",
        background: "rgba(255,255,255,0.02)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 32,
        }}>
          {STATS.map((s) => <StatCounter key={s.label} {...s} />)}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-block", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)",
            borderRadius: 50, padding: "6px 18px", fontSize: 12, color: "#67e8f9",
            fontWeight: 700, letterSpacing: 2, marginBottom: 20,
          }}>FEATURES</div>
          <h2 style={{
            fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, margin: 0,
            fontFamily: "'Space Grotesk',sans-serif",
            background: "linear-gradient(135deg,#fff,#94a3b8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Бүх зүйл нэг дор</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {[
            { icon: "⚡", title: "20 Вирал Хук", desc: "Нэг дарахад 20 өөр стилийн хук үүснэ. Emotional, flex, controversial, storytelling.", color: "#a855f7" },
            { icon: "✍️", title: "Платформ тус бүрд", desc: "TikTok, Facebook, YouTube Shorts-т тохирсон caption тус бүр үүснэ.", color: "#06b6d4" },
            { icon: "🎯", title: "Thumbnail Текст", desc: "Click-bait гэхгүй, хүмүүсийн анхааралыг татах thumbnail текст.", color: "#f59e0b" },
            { icon: "#", title: "30 Хэштэг", desc: "Монгол + глобал хэштэг хослуулан, reach-ийг нэмэгдүүл.", color: "#10b981" },
            { icon: "💡", title: "Контент Санаа", desc: "Ништ тохирсон вирал контент санаа. Хийхэд бэлэн idea.", color: "#f43f5e" },
            { icon: "★", title: "Favorites & History", desc: "Хамгийн сайн хукуудаа хадгал. Өмнөх генерацуудыг харах.", color: "#8b5cf6" },
          ].map((f, i) => (
            <GlowCard key={i} style={{ padding: 28 }} onClick={() => setPage("tools")}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: f.color + "20", border: `1px solid ${f.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 16,
              }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 800, color: "#e2e8f0", fontFamily: "'Space Grotesk',sans-serif" }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "80px 20px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{
            textAlign: "center", fontSize: "clamp(24px,4vw,42px)", fontWeight: 900,
            marginBottom: 48, fontFamily: "'Space Grotesk',sans-serif",
            background: "linear-gradient(135deg,#fff,#94a3b8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Монголын creators хэлэх нь</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <GlowCard key={i} hover={false} style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg,${t.color},${t.color}88)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 900, color: "#fff",
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "#e2e8f0" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{t.handle}</div>
                  </div>
                  <div style={{
                    marginLeft: "auto", background: t.color + "15", border: `1px solid ${t.color}30`,
                    borderRadius: 8, padding: "4px 10px", fontSize: 11, color: t.color, fontWeight: 700,
                  }}>{t.followers}</div>
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: "#94a3b8", lineHeight: 1.7 }}>"{t.text}"</p>
                <div style={{ marginTop: 12, fontSize: 11, color: "#475569" }}>📱 {t.platform}</div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 20px", textAlign: "center" }}>
        <div style={{
          maxWidth: 600, margin: "0 auto",
          background: "linear-gradient(135deg,rgba(168,85,247,0.12),rgba(6,182,212,0.08))",
          border: "1px solid rgba(168,85,247,0.2)", borderRadius: 28, padding: "60px 40px",
        }}>
          <h2 style={{
            fontSize: "clamp(26px,5vw,48px)", fontWeight: 900, margin: "0 0 16px",
            fontFamily: "'Space Grotesk',sans-serif",
            background: "linear-gradient(135deg,#fff,#c084fc)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Viral болоход бэлэн үү?</h2>
          <p style={{ color: "#64748b", marginBottom: 32, fontSize: 16 }}>
            Монголын 24,800+ creator Hook.mn ашиглаж байна. Чи юу хүлээж байна?
          </p>
          <button onClick={() => setPage("tools")} style={{
            background: "linear-gradient(135deg,#a855f7,#7c3aed)", border: "none",
            borderRadius: 14, color: "#fff", padding: "18px 48px", fontSize: 17, fontWeight: 800,
            cursor: "pointer", boxShadow: "0 8px 48px rgba(168,85,247,0.5)", fontFamily: "'Space Grotesk',sans-serif",
          }}>⚡ Үнэгүй эхлэх</button>
          <div style={{ marginTop: 20, fontSize: 12, color: "#475569" }}>Бүртгэл шаардлагагүй · Үнэгүй · Mongolian AI</div>
        </div>
      </section>
    </div>
  );
};

// TOOLS PAGE
const ToolsPage = ({ favorites, setFavorites, history, setHistory, isPremium, setShowPremium }) => {
  const [activeTool, setActiveTool] = useState("hook");
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ visible: false, msg: "" });
  const [tab, setTab] = useState("generate");
  const FREE_LIMIT = 5;

  const showToast = (msg) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: "" }), 2500);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => showToast("Хуулагдлаа!"));
  };

  const toggleFav = (text) => {
    const key = activeTool + "::" + text;
    const exists = favorites.some((f) => f.key === key);
    if (exists) { setFavorites(favorites.filter((f) => f.key !== key)); showToast("Хасагдлаа"); }
    else { setFavorites([{ key, text, tool: activeTool, ts: Date.now() }, ...favorites]); showToast("Хадгалагдлаа ★"); }
  };

  const isFaved = (text) => favorites.some((f) => f.key === activeTool + "::" + text);

  const generate = () => {
    if (!topic.trim()) { setError("Сэдэв оруулна уу!"); return; }
    setError("");
    setLoading(true);
    setResults([]);

    setTimeout(() => {
      const fakeOutputFn = FAKE_OUTPUTS[activeTool];
      const generated = fakeOutputFn
        ? fakeOutputFn(topic.trim(), platform)
        : [`${topic} хук #1`, `${topic} хук #2`, `${topic} хук #3`];
      setResults(generated);
      setHistory([{ tool: activeTool, topic: topic.trim(), platform, results: generated, ts: Date.now() }, ...history.slice(0, 19)]);
      setLoading(false);
    }, 1400 + Math.random() * 600);
  };

  const tool = TOOLS.find((t) => t.id === activeTool);
  const visibleCount = isPremium ? results.length : Math.min(results.length, FREE_LIMIT);
  const lockedCount = isPremium ? 0 : Math.max(0, results.length - FREE_LIMIT);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "100px 16px 60px" }}>
      <Toast message={toast.msg} visible={toast.visible} />

      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
          <h1 style={{
            fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, margin: 0,
            fontFamily: "'Space Grotesk',sans-serif",
            background: "linear-gradient(135deg,#fff,#94a3b8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Creator Tools ⚡</h1>
          {!isPremium && (
            <button onClick={() => setShowPremium(true)} style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none",
              borderRadius: 8, color: "#fff", padding: "6px 14px", fontSize: 12,
              fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
              animation: "pulse 2s infinite",
            }}>👑 PRO болох</button>
          )}
          {isPremium && (
            <span style={{
              background: "linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.05))",
              border: "1px solid rgba(245,158,11,0.35)", borderRadius: 8,
              padding: "6px 14px", fontSize: 12, fontWeight: 800, color: "#fbbf24",
            }}>👑 PRO ИДЭВХТЭЙ</span>
          )}
        </div>
        <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>Сэдэв оруулаад AI-аар вирал контент үүсгэ</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {["generate", "favorites", "history"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.03)",
            border: tab === t ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, color: tab === t ? "#c084fc" : "#64748b",
            padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
          }}>
            {t === "generate" ? "⚡ Үүсгэх" : t === "favorites" ? `★ Хадгалсан (${favorites.length})` : `🕐 Түүх (${history.length})`}
          </button>
        ))}
      </div>

      {tab === "generate" && (
        <>
          {/* Tool Selector */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 10, marginBottom: 24 }}>
            {TOOLS.map((t) => (
              <button key={t.id} onClick={() => { setActiveTool(t.id); setResults([]); }} style={{
                background: activeTool === t.id ? "linear-gradient(135deg,rgba(168,85,247,0.25),rgba(6,182,212,0.15))" : "rgba(255,255,255,0.03)",
                border: activeTool === t.id ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, color: activeTool === t.id ? "#e2e8f0" : "#64748b",
                padding: "12px 8px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                transition: "all 0.2s", textAlign: "center", lineHeight: 1.4,
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
                {t.labelMn}
              </button>
            ))}
          </div>

          {/* Input */}
          <GlowCard hover={false} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>СЭДЭВ / TOPIC</label>
                <input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generate()}
                  placeholder="жишээ: mori, luxury, hustle, mongol, бизнес..."
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)",
                    border: error ? "1px solid #f43f5e" : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12, color: "#e2e8f0", padding: "14px 18px",
                    fontSize: 15, outline: "none", fontFamily: "'Noto Sans',sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {activeTool === "hook" && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>НИШ / NICHE (заавал биш)</label>
                  <input
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="жишээ: fitness, luxury, business, comedy..."
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
                      color: "#e2e8f0", padding: "14px 18px", fontSize: 15,
                      outline: "none", fontFamily: "'Noto Sans',sans-serif", boxSizing: "border-box",
                    }}
                  />
                </div>
              )}

              {(activeTool === "hook" || activeTool === "caption" || activeTool === "hashtag") && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 8, letterSpacing: 1 }}>ПЛАТФОРМ</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {PLATFORMS.map((p) => (
                      <button key={p} onClick={() => setPlatform(p)} style={{
                        background: platform === p ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.04)",
                        border: platform === p ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8, color: platform === p ? "#c084fc" : "#64748b",
                        padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                      }}>{p}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {error && <p style={{ color: "#f43f5e", fontSize: 13, marginTop: 10, marginBottom: 0 }}>{error}</p>}
          </GlowCard>

          <button onClick={generate} disabled={loading} style={{
            width: "100%",
            background: loading ? "rgba(168,85,247,0.3)" : "linear-gradient(135deg,#a855f7,#7c3aed)",
            border: "none", borderRadius: 14, color: "#fff", padding: "17px",
            fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
            marginBottom: 28, boxShadow: loading ? "none" : "0 8px 32px rgba(168,85,247,0.35)",
            transition: "all 0.2s", fontFamily: "'Space Grotesk',sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            {loading ? (
              <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span> AI үүсгэж байна...</>
            ) : `${tool?.icon} ${tool?.labelMn} үүсгэх`}
          </button>

          {/* Results */}
          {results.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#94a3b8" }}>
                  {results.length} үр дүн · "{topic}"
                </h3>
                <button onClick={() => { navigator.clipboard.writeText(results.slice(0, visibleCount).join("\n\n")); showToast("Бүгдийг хуулагдлаа!"); }} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#94a3b8", padding: "7px 16px",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}>Бүгдийг хуулах</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {results.slice(0, visibleCount).map((r, i) => (
                  <ResultCard key={i} text={r} index={i} onCopy={copyText} onSave={toggleFav} saved={isFaved(r)} locked={false} />
                ))}
                {lockedCount > 0 && (
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {results.slice(visibleCount).map((r, i) => (
                        <ResultCard key={i + visibleCount} text={r} index={i + visibleCount} onCopy={copyText} onSave={toggleFav} saved={false} locked={true} />
                      ))}
                    </div>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to bottom, transparent, rgba(7,7,17,0.97))",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "flex-end", padding: 24,
                      borderRadius: 16,
                    }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 16, fontWeight: 600 }}>
                          +{lockedCount} нэмэлт үр дүн Pro горимд нэвтэрч харна уу
                        </p>
                        <button onClick={() => setShowPremium(true)} style={{
                          background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none",
                          borderRadius: 12, color: "#fff", padding: "12px 28px",
                          fontSize: 14, fontWeight: 800, cursor: "pointer",
                          fontFamily: "'Space Grotesk',sans-serif",
                          boxShadow: "0 8px 24px rgba(245,158,11,0.4)",
                        }}>👑 Pro болох — ₮29,900/сар</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "favorites" && (
        <div>
          {favorites.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>☆</div>
              <p>Хадгалсан зүйл байхгүй байна</p>
              <p style={{ fontSize: 13 }}>Results дахь ★ товч дарж хадгал</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {favorites.map((f, i) => (
                <GlowCard key={i} hover={false}>
                  <div style={{ fontSize: 11, color: "#475569", marginBottom: 8, fontWeight: 700 }}>
                    {TOOLS.find((t) => t.id === f.tool)?.icon} {TOOLS.find((t) => t.id === f.tool)?.labelMn}
                  </div>
                  <p style={{ margin: "0 0 12px", color: "#e2e8f0", fontSize: 14, lineHeight: 1.6 }}>{f.text}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => copyText(f.text)} style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 8, color: "#67e8f9", padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Copy</button>
                    <button onClick={() => setFavorites(favorites.filter((_, j) => j !== i))} style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 8, color: "#f87171", padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Устгах</button>
                  </div>
                </GlowCard>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "history" && (
        <div>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🕐</div>
              <p>Түүх байхгүй байна</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {history.map((h, i) => (
                <GlowCard key={i} hover={false}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                      {TOOLS.find((t) => t.id === h.tool)?.icon} {TOOLS.find((t) => t.id === h.tool)?.labelMn} · "{h.topic}"
                    </span>
                    <span style={{ fontSize: 11, color: "#334155" }}>{new Date(h.ts).toLocaleDateString("mn-MN")}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {h.results.slice(0, 3).map((r, j) => (
                      <div key={j} style={{ fontSize: 13, color: "#94a3b8", paddingLeft: 8, borderLeft: "2px solid rgba(168,85,247,0.3)" }}>{r}</div>
                    ))}
                    {h.results.length > 3 && <div style={{ fontSize: 12, color: "#475569" }}>+{h.results.length - 3} дэлгэрэнгүй...</div>}
                  </div>
                </GlowCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// TRENDING PAGE
const TrendingPage = ({ setPage }) => {
  const TRENDING_HOOKS = [
    { hook: "Монгол хүн ийм зүйл хийнэ гэж хэн ч бодоогүй байсан 🔥", views: "2.1M", platform: "TikTok" },
    { hook: "BMW-тэй болохоос өмнө миний амьдрал яг ийм байсан...", views: "890K", platform: "Facebook" },
    { hook: "Энэ нэг зүйлийг мэдэхгүй байгаа учраас чи poor хэвээр байна", views: "1.4M", platform: "TikTok" },
    { hook: "Монголын залуус яагаад successful болдоггүйн ЖИНХЭНЭ шалтгаан", views: "670K", platform: "YouTube" },
    { hook: "Морины дуу сонсоод таны сэтгэл хэрхэн өөрчлөгдөхийг харна уу", views: "3.2M", platform: "TikTok" },
    { hook: "1 сарын дараа үүнийг харахад та хайрлах болно — эсвэл үзэн ядах", views: "445K", platform: "Facebook" },
    { hook: "Luxury амьдрал гэдэг мөнгө биш. Энэ видеог үзсэний дараа та ойлгоно", views: "1.1M", platform: "Instagram" },
    { hook: "Чи энэ зургийн юуг анзаарлаа? 90% хүн буруу хариулдаг 👇", views: "2.8M", platform: "TikTok" },
  ];

  const CREATOR_STYLES = [
    { name: "Luxury Mongolian", emoji: "👑", desc: "High-end lifestyle, BMW, watches, travel", color: "#f59e0b" },
    { name: "Alpha Mindset", emoji: "💪", desc: "Hustle, discipline, success, motivation", color: "#a855f7" },
    { name: "Mongolian Heritage", emoji: "🐎", desc: "Morin khuur, culture, tradition, nature", color: "#10b981" },
    { name: "Gen Z Humor", emoji: "😂", desc: "Relatable, memes, daily life, comedy", color: "#06b6d4" },
    { name: "Business Grind", emoji: "💼", desc: "Entrepreneur, startup, money, growth", color: "#f43f5e" },
    { name: "Student Creator", emoji: "📚", desc: "Study tips, campus life, future dreams", color: "#8b5cf6" },
  ];

  const [copiedIdx, setCopiedIdx] = useState(null);
  const copyHook = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 16px 60px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, margin: "0 0 8px",
          fontFamily: "'Space Grotesk',sans-serif",
          background: "linear-gradient(135deg,#fff,#94a3b8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>🔥 Trending Mongolia</h1>
        <p style={{ color: "#64748b", margin: 0 }}>Өнөөдөр Монголд хамгийн их вирал болж байгаа контент</p>
      </div>

      {/* Trending Hashtags */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#94a3b8", marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>
          📈 Trending Hashtags
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {TRENDING_TOPICS.map((t, i) => (
            <div key={i} style={{
              background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)",
              borderRadius: 50, padding: "10px 20px", display: "flex", alignItems: "center",
              gap: 10, cursor: "pointer", transition: "all 0.2s",
              animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,85,247,0.18)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(168,85,247,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(168,85,247,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              onClick={() => navigator.clipboard.writeText(t.tag)}
            >
              <span style={{ color: "#c084fc", fontWeight: 700, fontSize: 14 }}>{t.tag}</span>
              <span style={{ background: "rgba(168,85,247,0.2)", borderRadius: 50, padding: "2px 10px", fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>{t.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Topics */}
      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#94a3b8", marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>
          🌐 Trending Topics
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
          {[
            { topic: "Luxury lifestyle", emoji: "👑", growth: "+340%" },
            { topic: "Crypto Mongolia", emoji: "₿", growth: "+220%" },
            { topic: "Morin Khuur", emoji: "🐎", growth: "+189%" },
            { topic: "UB Street Food", emoji: "🍜", growth: "+156%" },
            { topic: "Fitness Mongolia", emoji: "💪", growth: "+134%" },
            { topic: "Travel Mongolia", emoji: "✈️", growth: "+112%" },
          ].map((t, i) => (
            <GlowCard key={i} style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{t.emoji}</span>
                <span style={{ fontWeight: 800, color: "#e2e8f0", fontSize: 14 }}>{t.topic}</span>
              </div>
              <span style={{
                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#34d399", fontWeight: 700,
              }}>{t.growth}</span>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Top Hooks */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#94a3b8", margin: 0, fontFamily: "'Space Grotesk',sans-serif" }}>
            ⚡ Өнөөдрийн Top Хукууд
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            Лайв шинэчлэгдэж байна
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TRENDING_HOOKS.map((h, i) => (
            <GlowCard key={i} style={{ padding: "18px 20px", animation: `fadeSlideIn 0.4s ease ${i * 0.07}s both` }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  fontSize: 22, fontWeight: 900, color: i < 3 ? "#f59e0b" : "#334155",
                  minWidth: 36, textAlign: "center", fontFamily: "'Space Grotesk',sans-serif",
                }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 14, color: "#e2e8f0", lineHeight: 1.6 }}>{h.hook}</p>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#475569", flexWrap: "wrap" }}>
                    <span>👁 {h.views} views</span>
                    <span>📱 {h.platform}</span>
                  </div>
                </div>
                <button onClick={() => copyHook(h.hook, i)} style={{
                  background: copiedIdx === i ? "rgba(16,185,129,0.15)" : "rgba(6,182,212,0.1)",
                  border: copiedIdx === i ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(6,182,212,0.2)",
                  borderRadius: 8, color: copiedIdx === i ? "#34d399" : "#67e8f9",
                  padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                  transition: "all 0.2s",
                }}>{copiedIdx === i ? "✓" : "Copy"}</button>
              </div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* Creator Styles */}
      <section>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#94a3b8", marginBottom: 16, fontFamily: "'Space Grotesk',sans-serif" }}>
          🎨 Top Creator Styles
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14 }}>
          {CREATOR_STYLES.map((s, i) => (
            <GlowCard key={i} onClick={() => setPage("tools")} style={{ padding: "20px 24px", animation: `fadeSlideIn 0.4s ease ${i * 0.08}s both` }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{s.emoji}</div>
              <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.name}</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: "#64748b" }}>{s.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>
    </div>
  );
};

// PRICING PAGE
const PricingPage = ({ setShowPremium, isPremium }) => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 16px 80px" }}>
    <div style={{ textAlign: "center", marginBottom: 64 }}>
      <div style={{
        display: "inline-block", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)",
        borderRadius: 50, padding: "6px 18px", fontSize: 12, color: "#c084fc",
        fontWeight: 700, letterSpacing: 2, marginBottom: 20,
      }}>ҮНЭ ЦЭНЭ</div>
      <h1 style={{
        fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, margin: "0 0 16px",
        fontFamily: "'Space Grotesk',sans-serif",
        background: "linear-gradient(135deg,#fff,#94a3b8)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>Өөрт тохирох төлөвлөгөөгөө сонго</h1>
      <p style={{ color: "#64748b", fontSize: 17, margin: 0 }}>Монголын creator-уудад зориулсан боломжийн үнэ</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, alignItems: "start" }}>
      {PRICING_PLANS.map((plan, i) => (
        <div key={plan.id} style={{
          background: plan.id === "pro" ? "linear-gradient(135deg,rgba(168,85,247,0.12),rgba(6,182,212,0.06))" : "rgba(255,255,255,0.03)",
          border: plan.id === "pro" ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, padding: "32px 28px",
          boxShadow: plan.id === "pro" ? "0 0 60px rgba(168,85,247,0.12)" : "none",
          position: "relative", animation: `fadeSlideIn 0.5s ease ${i * 0.1}s both`,
          transform: plan.id === "pro" ? "scale(1.02)" : "scale(1)",
        }}>
          {plan.badge && (
            <div style={{
              position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
              background: plan.id === "pro" ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "linear-gradient(135deg,#f59e0b,#d97706)",
              borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 800, color: "#fff",
              whiteSpace: "nowrap",
            }}>{plan.badge}</div>
          )}

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: plan.color, letterSpacing: 2, marginBottom: 8 }}>
              {plan.name.toUpperCase()}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{
                fontSize: 42, fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif",
                background: `linear-gradient(135deg,${plan.color},${plan.color}99)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>{plan.price}</span>
              <span style={{ color: "#64748b", fontSize: 14 }}>{plan.period}</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{plan.nameMn}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            {plan.features.map((f, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: `${plan.color}20`, border: `1px solid ${plan.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: plan.color, flexShrink: 0,
                }}>✓</span>
                <span style={{ fontSize: 14, color: "#94a3b8" }}>{f}</span>
              </div>
            ))}
            {plan.locked.map((f, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, opacity: 0.4 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#475569", flexShrink: 0,
                }}>✕</span>
                <span style={{ fontSize: 14, color: "#475569" }}>{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={plan.id !== "free" ? () => setShowPremium(true) : undefined}
            disabled={plan.id === "free" && !isPremium ? false : isPremium && plan.id === "pro"}
            style={{
              width: "100%", border: "none", borderRadius: 14,
              color: "#fff", padding: "15px", fontSize: 15, fontWeight: 800,
              cursor: plan.id === "free" ? "default" : "pointer",
              fontFamily: "'Space Grotesk',sans-serif",
              transition: "all 0.2s",
              ...plan.ctaStyle,
            }}
          >
            {isPremium && plan.id === "pro" ? "✅ Идэвхтэй" : plan.cta}
          </button>
        </div>
      ))}
    </div>

    <div style={{ textAlign: "center", marginTop: 56 }}>
      <p style={{ color: "#475569", fontSize: 14 }}>
        ❓ Асуулт байна уу? <a href="https://t.me/hookmn_official" target="_blank" rel="noreferrer" style={{ color: "#c084fc", textDecoration: "none" }}>Telegram-д бидэнтэй холбогдох</a>
      </p>
    </div>
  </div>
);

// ABOUT PAGE
const AboutPage = () => (
  <div style={{ maxWidth: 800, margin: "0 auto", padding: "100px 16px 60px" }}>
    <div style={{ textAlign: "center", marginBottom: 60 }}>
      <div style={{
        width: 80, height: 80, borderRadius: 24, margin: "0 auto 24px",
        background: "linear-gradient(135deg,#a855f7,#06b6d4)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
        boxShadow: "0 0 60px rgba(168,85,247,0.4)",
      }}>⚡</div>
      <h1 style={{
        fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, margin: "0 0 16px",
        fontFamily: "'Space Grotesk',sans-serif",
        background: "linear-gradient(135deg,#a855f7,#06b6d4)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>Hook.mn-ийн тухай</h1>
      <p style={{ color: "#64748b", fontSize: 17, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
        Hook.mn бол Монголын вирал контент бүтээгчдэд зориулсан AI creator toolkit. Монголын creator economy-г дараагийн түвшинд гаргах зорилготой.
      </p>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
      {[
        { title: "🎯 Манай зорилго", text: "Монголын бүтээгч бүр дэлхийн чанарын контент үүсгэх боломжтой болох. AI технологийг ашиглан, хэлний саад тотгоргүйгээр, Монгол контент creator-уудыг дэлхийн тавцанд гаргах." },
        { title: "💡 Яагаад Hook.mn?", text: "Бид Монголын social media-г судалж, viral болдог контентийн хэв маяг, хэл, соёлыг ойлгосон дэлгэрэнгүй AI систем бүтээсэн. Энэ нь зөвхөн орчуулга биш — жинхэнэ Монгол creative intelligence." },
        { title: "🤖 Технологи", text: "Дэлхийн хамгийн сүүлийн үеийн AI загвар дээр суурилсан бөгөөд Монгол хэл, интернет slang, creator economy-г гүнзгий судалж сургагдсан." },
        { title: "🇲🇳 Монголд зориулсан", text: "TikTok, Facebook Reel, YouTube Shorts, Instagram — Монголын залуучуудын ашигладаг бүх платформд optimized контент үүсгэдэг. Монгол Gen Z энергиэр дүүрэн." },
      ].map((s, i) => (
        <GlowCard key={i} hover={false} style={{ padding: "24px 28px", animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both` }}>
          <h3 style={{ margin: "0 0 12px", fontWeight: 800, color: "#e2e8f0", fontFamily: "'Space Grotesk',sans-serif", fontSize: 17 }}>{s.title}</h3>
          <p style={{ margin: 0, color: "#64748b", lineHeight: 1.8, fontSize: 14 }}>{s.text}</p>
        </GlowCard>
      ))}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
      {[
        { val: "24,800+", label: "Монгол Creator" },
        { val: "1.2M+", label: "Үүссэн хук" },
        { val: "2023", label: "Үүсгэгдсэн он" },
        { val: "98%", label: "Хэрэглэгч сэтгэл хангалуун" },
      ].map((s, i) => (
        <div key={i} style={{
          textAlign: "center", padding: "20px 16px",
          background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 16,
        }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#c084fc", fontFamily: "'Space Grotesk',sans-serif" }}>{s.val}</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// CONTACT PAGE
const ContactPage = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "100px 16px 60px" }}>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{
          fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, margin: "0 0 8px",
          fontFamily: "'Space Grotesk',sans-serif",
          background: "linear-gradient(135deg,#fff,#94a3b8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Холбоо барих ✉️</h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: 15 }}>Санал хүсэлт, хамтын ажиллагаа, асуулт байвал бичээрэй</p>
      </div>

      {/* Social Links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 40 }}>
        {[
          { name: "TikTok", icon: "🎵", handle: "@hookmn", color: "#e2e8f0", bg: "rgba(255,255,255,0.04)" },
          { name: "Facebook", icon: "📘", handle: "Hook.mn", color: "#60a5fa", bg: "rgba(96,165,250,0.06)" },
          { name: "Instagram", icon: "📸", handle: "@hook.mn", color: "#f472b6", bg: "rgba(244,114,182,0.06)" },
          { name: "Telegram", icon: "✈️", handle: "@hookmn_official", color: "#67e8f9", bg: "rgba(103,232,249,0.06)" },
        ].map((s, i) => (
          <a key={i} href="#" style={{
            display: "block", textDecoration: "none",
            background: s.bg, border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: 14, padding: "16px 14px", textAlign: "center", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, color: s.color, fontSize: 13, fontFamily: "'Space Grotesk',sans-serif" }}>{s.name}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{s.handle}</div>
          </a>
        ))}
      </div>

      {/* Contact Form */}
      {sent ? (
        <div style={{
          textAlign: "center", padding: "48px 32px",
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <h3 style={{ color: "#34d399", fontWeight: 800, fontSize: 20, fontFamily: "'Space Grotesk',sans-serif" }}>Илгээгдлээ!</h3>
          <p style={{ color: "#64748b" }}>Бид 24 цагийн дотор хариу өгнө.</p>
        </div>
      ) : (
        <GlowCard hover={false} style={{ padding: 28 }}>
          <h3 style={{ margin: "0 0 20px", fontWeight: 800, color: "#e2e8f0", fontFamily: "'Space Grotesk',sans-serif" }}>Мессеж илгээх</h3>
          {[
            { key: "name", label: "Нэр", placeholder: "Таны нэр", type: "text" },
            { key: "email", label: "Email", placeholder: "email@example.com", type: "email" },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: 1 }}>{f.label.toUpperCase()}</label>
              <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                  color: "#e2e8f0", padding: "14px 16px", fontSize: 14, outline: "none", boxSizing: "border-box",
                }} />
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 6, letterSpacing: 1 }}>МЕССЕЖ</label>
            <textarea rows={5} placeholder="Санал хүсэлт, асуулт, хамтын ажиллагаа..." value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                color: "#e2e8f0", padding: "14px 16px", fontSize: 14, resize: "vertical",
                outline: "none", boxSizing: "border-box", fontFamily: "'Noto Sans',sans-serif",
              }} />
          </div>
          <button onClick={() => setSent(true)} style={{
            width: "100%", background: "linear-gradient(135deg,#a855f7,#7c3aed)", border: "none",
            borderRadius: 12, color: "#fff", padding: "15px", fontSize: 15, fontWeight: 800,
            cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
          }}>Илгээх ✉️</button>
        </GlowCard>
      )}
    </div>
  );
};

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [favorites, setFavorites] = useLocalStorage("hookmn_favs", []);
  const [history, setHistory] = useLocalStorage("hookmn_history", []);
  const [isPremium, setIsPremium] = useLocalStorage("hookmn_premium", false);
  const isMobile = useIsMobile();

  const NAV = [
    { id: "home", label: "Нүүр" },
    { id: "tools", label: "Tools ⚡" },
    { id: "trending", label: "Trending 🔥" },
    { id: "pricing", label: "Үнэ 💎" },
    { id: "about", label: "Тухай" },
    { id: "contact", label: "Холбоо" },
  ];

  const navigate = (p) => { setPage(p); setMenuOpen(false); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10); };

  return (
    <div style={{ minHeight: "100vh", background: "#070711", color: "#fff", fontFamily: "'DM Sans',sans-serif", position: "relative", overflowX: "hidden" }}>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #070711; }
        ::-webkit-scrollbar-thumb { background: rgba(168,85,247,0.3); border-radius: 3px; }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: #334155; }
        textarea::placeholder { color: #334155; }
        select option { background: #0f0f1a; color: #e2e8f0; }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (min-width: 641px) {
          .hamburger { display: none !important; }
        }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "5%", left: "10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.08) 0%,transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "40%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.06) 0%,transparent 70%)", animation: "float 10s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.04) 0%,transparent 70%)", animation: "float 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Sticky Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 20px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(7,7,17,0.9)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {/* Logo */}
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
          <span style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg,#a855f7,#06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, boxShadow: "0 0 20px rgba(168,85,247,0.4)",
          }}>⚡</span>
          <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: -0.5 }}>
            Hook<span style={{ color: "#a855f7" }}>.mn</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{
              background: page === n.id ? "rgba(168,85,247,0.15)" : "none",
              border: page === n.id ? "1px solid rgba(168,85,247,0.3)" : "1px solid transparent",
              borderRadius: 10, color: page === n.id ? "#c084fc" : "#64748b",
              padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { if (page !== n.id) { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; } }}
              onMouseLeave={(e) => { if (page !== n.id) { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.borderColor = "transparent"; } }}
            >{n.label}</button>
          ))}
          {!isPremium && (
            <button onClick={() => setShowPremium(true)} style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none",
              borderRadius: 10, color: "#fff", padding: "7px 14px", fontSize: 12,
              fontWeight: 800, cursor: "pointer", marginLeft: 4,
            }}>👑 PRO</button>
          )}
          <button onClick={() => navigate("tools")} style={{
            background: "linear-gradient(135deg,#a855f7,#7c3aed)", border: "none",
            borderRadius: 10, color: "#fff", padding: "8px 18px", fontSize: 13,
            fontWeight: 800, cursor: "pointer", marginLeft: 4, fontFamily: "'Space Grotesk',sans-serif",
          }}>Start Free</button>
        </div>

        {/* Mobile Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isPremium && (
            <button onClick={() => setShowPremium(true)} className="hamburger" style={{
              display: "none", background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none",
              borderRadius: 8, color: "#fff", padding: "7px 10px", fontSize: 11, fontWeight: 800, cursor: "pointer",
            }}>👑</button>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
            display: "none", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, color: "#e2e8f0", padding: "8px 14px", cursor: "pointer", fontSize: 18,
          }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0,
          background: "rgba(7,7,17,0.98)", backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          zIndex: 999, padding: "8px 0",
          animation: "slideDown 0.2s ease",
        }}>
          {NAV.map((n) => (
            <button key={n.id} onClick={() => navigate(n.id)} style={{
              display: "flex", width: "100%", textAlign: "left",
              background: page === n.id ? "rgba(168,85,247,0.08)" : "none",
              border: "none", color: page === n.id ? "#c084fc" : "#94a3b8",
              padding: "14px 24px", fontSize: 16, fontWeight: 700, cursor: "pointer",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>{n.label}</button>
          ))}
          <div style={{ padding: "12px 16px" }}>
            <button onClick={() => { navigate("tools"); }} style={{
              width: "100%", background: "linear-gradient(135deg,#a855f7,#7c3aed)", border: "none",
              borderRadius: 12, color: "#fff", padding: "13px", fontSize: 15,
              fontWeight: 800, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif",
            }}>⚡ Start Free</button>
          </div>
        </div>
      )}

      {/* Premium Modal */}
      {showPremium && (
        <PremiumModal onClose={() => setShowPremium(false)} onUnlock={() => setIsPremium(true)} />
      )}

      {/* Page Content */}
      <main style={{ position: "relative", zIndex: 1 }}>
        {page === "home" && <HomePage setPage={navigate} />}
        {page === "tools" && <ToolsPage favorites={favorites} setFavorites={setFavorites} history={history} setHistory={setHistory} isPremium={isPremium} setShowPremium={setShowPremium} />}
        {page === "trending" && <TrendingPage setPage={navigate} />}
        {page === "pricing" && <PricingPage setShowPremium={setShowPremium} isPremium={isPremium} />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
      </main>

      {/* Footer */}
      <footer style={{
        position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.015)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "56px 20px 32px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 48 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#a855f7,#06b6d4)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>⚡</span>
                <span style={{ fontWeight: 900, fontFamily: "'Space Grotesk',sans-serif", fontSize: 16 }}>Hook<span style={{ color: "#a855f7" }}>.mn</span></span>
              </div>
              <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                Монголын creator economy-д зориулан бүтээсэн #1 AI toolkit. Вирал контент хоромхон зуур.
              </p>
            </div>

            {/* Tools */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", letterSpacing: 2, marginBottom: 16 }}>TOOLS</div>
              {TOOLS.map((t) => (
                <button key={t.id} onClick={() => navigate("tools")} style={{
                  display: "block", background: "none", border: "none", color: "#475569",
                  fontSize: 13, padding: "4px 0", cursor: "pointer", textAlign: "left",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#c084fc"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
                >{t.icon} {t.labelMn}</button>
              ))}
            </div>

            {/* Links */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", letterSpacing: 2, marginBottom: 16 }}>LINKS</div>
              {NAV.map((n) => (
                <button key={n.id} onClick={() => navigate(n.id)} style={{
                  display: "block", background: "none", border: "none", color: "#475569",
                  fontSize: 13, padding: "4px 0", cursor: "pointer", textAlign: "left", transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#c084fc"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
                >{n.label}</button>
              ))}
            </div>

            {/* Social */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", letterSpacing: 2, marginBottom: 16 }}>SOCIAL</div>
              {[
                { label: "TikTok", icon: "🎵" },
                { label: "Facebook", icon: "📘" },
                { label: "Instagram", icon: "📸" },
                { label: "Telegram", icon: "✈️" },
                { label: "Email: hello@hook.mn", icon: "✉️" },
              ].map((s) => (
                <a key={s.label} href="#" style={{ display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 13, padding: "4px 0", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#c084fc"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
                >{s.icon} {s.label}</a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#334155", fontSize: 12, margin: 0 }}>
              © 2025 Hook.mn · Монголын Creator Economy-д зориулан бүтээлээ · Made with ⚡ AI
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Нүүцлалын бодлого", "Үйлчилгээний нөхцөл"].map((l) => (
                <span key={l} style={{ fontSize: 12, color: "#334155", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
