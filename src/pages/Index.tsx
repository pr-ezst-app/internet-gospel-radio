import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.ezst.app/projects/29e0e4a4-6eeb-41d3-a315-67886953fcf9/files/06406326-40ab-435d-8905-3a8f4157fca4.jpg";

const NAV_LINKS = ["Home", "Live Stream", "News", "On-Demand", "Schedule", "About", "Contact", "Donate"];

const NEWS_ITEMS = [
  {
    id: 1,
    category: "Community",
    title: "Faith & Fellowship Conference Returns This Summer",
    excerpt: "Join thousands of believers for three days of worship, teaching, and community building at our annual gathering.",
    date: "May 20, 2026",
    readTime: "3 min read",
  },
  {
    id: 2,
    category: "Ministry",
    title: "24.7PraiseRadio Launches Youth Gospel Mentorship Program",
    excerpt: "A new initiative connecting seasoned gospel artists with young aspiring musicians across the nation.",
    date: "May 18, 2026",
    readTime: "4 min read",
  },
  {
    id: 3,
    category: "World",
    title: "Gospel Music Reaches New Heights in Global Charts",
    excerpt: "Contemporary gospel artists break streaming records, bringing the message of hope to millions worldwide.",
    date: "May 15, 2026",
    readTime: "5 min read",
  },
  {
    id: 4,
    category: "Local",
    title: "Community Prayer Walk Unites Neighborhoods in Hope",
    excerpt: "Over 500 residents joined hands last Sunday in a peaceful march for unity, healing, and restoration.",
    date: "May 12, 2026",
    readTime: "2 min read",
  },
];

const PROGRAMS = [
  { time: "6:00 AM", title: "Morning Devotional", host: "Pastor James", type: "Devotional" },
  { time: "8:00 AM", title: "Gospel Sunrise", host: "Sister Miriam", type: "Music" },
  { time: "10:00 AM", title: "The Word Today", host: "Rev. David Cole", type: "Teaching" },
  { time: "12:00 PM", title: "Midday Praise", host: "DJ Emmanuel", type: "Music" },
  { time: "2:00 PM", title: "Faith & Family", host: "Minister Grace", type: "Talk Show" },
  { time: "4:00 PM", title: "Evening Hymns", host: "Choir of Light", type: "Music" },
  { time: "7:00 PM", title: "Sunday Night Live", host: "Bishop T. Williams", type: "Live" },
  { time: "9:00 PM", title: "Nightly Blessings", host: "Minister Joy", type: "Devotional" },
];

const ON_DEMAND = [
  { id: 1, title: "Total Surrender", artist: "Bishop T. Williams", duration: "48:22", type: "Sermon" },
  { id: 2, title: "Hallelujah Rising", artist: "Choir of Light", duration: "35:10", type: "Music" },
  { id: 3, title: "Walking in Purpose", artist: "Rev. David Cole", duration: "52:44", type: "Teaching" },
  { id: 4, title: "Healing Rain", artist: "Sister Miriam", duration: "28:05", type: "Music" },
  { id: 5, title: "Unshakeable Faith", artist: "Pastor James", duration: "41:18", type: "Sermon" },
  { id: 6, title: "Songs of Zion", artist: "Grace Ensemble", duration: "44:30", type: "Music" },
];

const DONATION_TIERS = [
  { amount: 10, label: "Seed", description: "Sow a seed of faith" },
  { amount: 25, label: "Tithe", description: "Honor God with your tithe" },
  { amount: 50, label: "Offering", description: "Give a generous offering" },
  { amount: 100, label: "Champion", description: "Champion the ministry" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("Home");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donationFreq, setDonationFreq] = useState<"once" | "monthly">("once");
  const [currentDay] = useState("Sunday");
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".section-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeSection]);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = sectionsRef.current[section];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const typeColor: Record<string, string> = {
    Sermon: "bg-blue-900/50 text-blue-300",
    Music: "bg-purple-900/50 text-purple-300",
    Teaching: "bg-green-900/50 text-green-300",
    Live: "bg-red-900/50 text-red-300",
    Devotional: "bg-yellow-900/50 text-yellow-300",
    "Talk Show": "bg-pink-900/50 text-pink-300",
  };

  return (
    <div className="min-h-screen font-nunito" style={{ background: "var(--gospel-navy)" }}>

      {/* ── TOP NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
        style={{ background: "rgba(6,14,36,0.92)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("Home")}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", boxShadow: "0 0 20px rgba(245,166,35,0.4)" }}>
                <Icon name="Radio" size={18} />
              </div>
              <div>
                <span className="font-playfair font-bold text-lg leading-none block" style={{ color: "var(--gospel-gold)" }}>
                  24.7PraiseRadio
                </span>
                <span className="text-xs uppercase tracking-widest block" style={{ color: "var(--gospel-text)", opacity: 0.6 }}>
                  Your Global Inspiration Station
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
                  style={{ color: activeSection === link ? "var(--gospel-gold)" : "var(--gospel-text)" }}>
                  {link === "Donate" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{ background: "var(--gospel-gold)", color: "var(--gospel-navy)" }}>
                      Give Now
                    </span>
                  ) : link}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                style={{ borderColor: "rgba(245,166,35,0.4)", background: "rgba(245,166,35,0.08)" }}>
                <div className="w-2 h-2 rounded-full live-dot" style={{ background: "#ef4444" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gospel-gold)" }}>Live</span>
              </div>
              <button className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ color: "var(--gospel-text)" }}>
                <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 px-4 pb-4 pt-2 animate-fade-in"
            style={{ background: "rgba(6,14,36,0.98)" }}>
            {NAV_LINKS.map((link) => (
              <button key={link} onClick={() => scrollToSection(link)}
                className="block w-full text-left px-3 py-3 rounded-lg text-sm font-medium hover:bg-white/5 transition"
                style={{ color: "var(--gospel-text)" }}>
                {link}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section ref={(el) => { sectionsRef.current["Home"] = el; }} className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Grace Wave Radio" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(6,14,36,0.6) 0%, rgba(6,14,36,0.75) 50%, rgba(6,14,36,1) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(245,166,35,0.08) 0%, transparent 70%)"
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <span className="inline-block text-xs uppercase tracking-[0.3em] font-semibold mb-6 px-4 py-2 rounded-full border"
              style={{ color: "var(--gospel-gold)", borderColor: "rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.08)" }}>
              ✦ Your Global Inspiration Station ✦
            </span>
          </div>

          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 animate-fade-in"
            style={{ animationDelay: "0.25s", animationFillMode: "both", color: "var(--gospel-cream)" }}>
            Where Faith
            <br />
            <span className="shimmer">Meets the Airwaves</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-in"
            style={{ animationDelay: "0.4s", animationFillMode: "both", color: "var(--gospel-text)", opacity: 0.8 }}>
            24/7 live gospel streaming, Spirit-filled news, and on-demand worship — bringing heaven's soundtrack to your world.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: "0.55s", animationFillMode: "both" }}>
            <button onClick={() => scrollToSection("Live Stream")}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)", boxShadow: "0 0 30px rgba(245,166,35,0.4)" }}>
              <Icon name="Radio" size={20} />
              Join Live Stream
            </button>
            <button onClick={() => scrollToSection("News")}
              className="flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base border transition-all duration-300 hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "var(--gospel-cream)" }}>
              <Icon name="Newspaper" size={20} />
              Gospel News
            </button>
          </div>
        </div>

        <div className="relative flex justify-center pb-8 animate-fade-in" style={{ animationDelay: "1s", animationFillMode: "both" }}>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--gospel-text)" }}>Scroll</span>
            <Icon name="ChevronDown" size={18} style={{ color: "var(--gospel-gold)" }} />
          </div>
        </div>
      </section>

      {/* ── LIVE STREAM PLAYER ── */}
      <section ref={(el) => { sectionsRef.current["Live Stream"] = el; }} className="py-20 px-6"
        style={{ background: "linear-gradient(180deg, var(--gospel-navy) 0%, var(--gospel-navy-mid) 100%)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="section-reveal text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--gospel-gold)" }}>
              Broadcasting Now
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-2" style={{ color: "var(--gospel-cream)" }}>
              Live Stream
            </h2>
          </div>

          <div className="section-reveal rounded-3xl overflow-hidden border"
            style={{ background: "var(--gospel-navy-light)", borderColor: "rgba(245,166,35,0.2)" }}>
            <div className="flex items-center gap-3 px-6 py-3 border-b"
              style={{ background: "rgba(245,166,35,0.08)", borderColor: "rgba(245,166,35,0.15)" }}>
              <div className="w-2 h-2 rounded-full live-dot" style={{ background: "#ef4444" }} />
              <span className="text-xs uppercase tracking-widest font-bold" style={{ color: "#ef4444" }}>On Air</span>
              <span className="text-sm ml-2" style={{ color: "var(--gospel-text)", opacity: 0.7 }}>
                Sunday Night Live with Bishop T. Williams — 24.7PraiseRadio
              </span>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex items-end justify-center gap-1.5 mb-10 h-16">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className={`wave-bar ${isPlaying ? "" : "paused"}`}
                    style={{
                      animationDelay: `${(i * 0.08) % 1.2}s`,
                      height: `${20 + Math.sin(i * 0.8) * 14 + Math.cos(i * 1.2) * 10}px`,
                      opacity: 0.6 + (i % 3) * 0.15,
                    }} />
                ))}
              </div>

              <div className="text-center mb-8">
                <h3 className="font-playfair text-2xl font-bold mb-1" style={{ color: "var(--gospel-cream)" }}>
                  Sunday Night Live
                </h3>
                <p className="text-sm" style={{ color: "var(--gospel-gold)" }}>Bishop T. Williams • 24.7PraiseRadio</p>
              </div>

              <div className="flex items-center justify-center gap-6 mb-8">
                <button className="p-3 rounded-full hover:bg-white/10 transition"
                  style={{ color: "var(--gospel-text)" }}>
                  <Icon name="SkipBack" size={22} />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)", boxShadow: "0 0 25px rgba(245,166,35,0.5)" }}>
                  <Icon name={isPlaying ? "Pause" : "Play"} size={28} />
                </button>
                <button className="p-3 rounded-full hover:bg-white/10 transition"
                  style={{ color: "var(--gospel-text)" }}>
                  <Icon name="SkipForward" size={22} />
                </button>
              </div>

              <div className="flex items-center gap-3 max-w-xs mx-auto">
                <Icon name="Volume2" size={18} style={{ color: "var(--gospel-gold)" }} />
                <div className="flex-1 h-1.5 rounded-full cursor-pointer relative"
                  style={{ background: "rgba(255,255,255,0.15)" }}>
                  <div className="h-full rounded-full" style={{
                    width: `${volume}%`,
                    background: "linear-gradient(90deg, var(--gospel-gold), #fde68a)"
                  }} />
                  <input type="range" min={0} max={100} value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                </div>
                <span className="text-xs w-8 text-right" style={{ color: "var(--gospel-text)", opacity: 0.6 }}>{volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOSPEL NEWS ── */}
      <section ref={(el) => { sectionsRef.current["News"] = el; }} className="py-20 px-6"
        style={{ background: "var(--gospel-navy-mid)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="section-reveal flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--gospel-gold)" }}>
                Latest Stories
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-2" style={{ color: "var(--gospel-cream)" }}>
                Gospel News Portal
              </h2>
            </div>
            <button className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
              style={{ color: "var(--gospel-gold)" }}>
              All Stories <Icon name="ArrowRight" size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {NEWS_ITEMS.map((item, i) => (
              <article key={item.id}
                className="section-reveal group p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:bg-white/5"
                style={{
                  background: "rgba(22, 40, 96, 0.4)",
                  borderColor: "rgba(255,255,255,0.08)",
                  animationDelay: `${i * 0.1}s`
                }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(245,166,35,0.15)", color: "var(--gospel-gold)" }}>
                    {item.category}
                  </span>
                  <span className="text-xs" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>
                    {item.date}
                  </span>
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-3 leading-snug group-hover:opacity-80 transition-opacity"
                  style={{ color: "var(--gospel-cream)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--gospel-text)", opacity: 0.65 }}>
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--gospel-gold)" }}>
                  <Icon name="Clock" size={13} />
                  <span>{item.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ON DEMAND ── */}
      <section ref={(el) => { sectionsRef.current["On-Demand"] = el; }} className="py-20 px-6"
        style={{ background: "var(--gospel-navy)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="section-reveal text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--gospel-gold)" }}>
              Anytime, Anywhere
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-2" style={{ color: "var(--gospel-cream)" }}>
              Content Library
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm" style={{ color: "var(--gospel-text)", opacity: 0.65 }}>
              Sermons, worship music, teachings — all available on demand.
            </p>
          </div>

          <div className="section-reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ON_DEMAND.map((item) => (
              <div key={item.id}
                className="group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:bg-white/5"
                style={{ background: "rgba(22, 40, 96, 0.3)", borderColor: "rgba(255,255,255,0.06)" }}>
                <button className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{ background: "rgba(245,166,35,0.15)", color: "var(--gospel-gold)" }}>
                  <Icon name="Play" size={16} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--gospel-cream)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--gospel-text)", opacity: 0.55 }}>
                    {item.artist}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor[item.type] || "bg-white/10 text-white/60"}`}>
                    {item.type}
                  </span>
                  <span className="text-xs" style={{ color: "var(--gospel-text)", opacity: 0.45 }}>
                    {item.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="section-reveal text-center mt-8">
            <button className="px-6 py-3 rounded-full border text-sm font-semibold transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(245,166,35,0.3)", color: "var(--gospel-gold)" }}>
              Browse Full Library
            </button>
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section ref={(el) => { sectionsRef.current["Schedule"] = el; }} className="py-20 px-6"
        style={{ background: "var(--gospel-navy-mid)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="section-reveal text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--gospel-gold)" }}>
              Today's Programming
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-2" style={{ color: "var(--gospel-cream)" }}>
              Program Schedule
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--gospel-gold)" }}>{currentDay}</p>
          </div>

          <div className="section-reveal space-y-2">
            {PROGRAMS.map((prog, i) => (
              <div key={i}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-white/5 ${i === 6 ? "border" : ""}`}
                style={i === 6 ? {
                  background: "rgba(245,166,35,0.08)",
                  borderColor: "rgba(245,166,35,0.3)"
                } : {}}>
                <div className="w-20 flex-shrink-0">
                  <span className="text-sm font-bold" style={{ color: i === 6 ? "var(--gospel-gold)" : "var(--gospel-text)", opacity: i === 6 ? 1 : 0.6 }}>
                    {prog.time}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--gospel-cream)" }}>
                    {prog.title}
                    {i === 6 && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-400">Live Now</span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>
                    {prog.host}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full ${typeColor[prog.type] || "bg-white/10 text-white/60"}`}>
                  {prog.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section ref={(el) => { sectionsRef.current["About"] = el; }} className="py-20 px-6"
        style={{ background: "var(--gospel-navy)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="section-reveal">
              <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--gospel-gold)" }}>
                Our Story
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-3 mb-6" style={{ color: "var(--gospel-cream)" }}>
                About 24.7PraiseRadio
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--gospel-text)", opacity: 0.75 }}>
                24.7PraiseRadio was founded on the belief that the gospel has the power to transform lives.
                We broadcast 24 hours a day, 7 days a week — delivering Spirit-filled music, powerful sermons,
                and uplifting news to communities across the nation and around the world.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--gospel-text)", opacity: 0.75 }}>
                Our mission is simple: to be a lighthouse in the airwaves, bringing hope, healing, and the
                love of God to every listener, wherever they may be.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { number: "24/7", label: "Live Broadcasting" },
                  { number: "50K+", label: "Weekly Listeners" },
                  { number: "15+", label: "Years of Ministry" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-playfair text-3xl font-bold" style={{
                      background: "linear-gradient(135deg, var(--gospel-gold) 0%, #fde68a 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}>{stat.number}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--gospel-text)", opacity: 0.6 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-reveal grid grid-cols-2 gap-4">
              {[
                { icon: "Music", title: "Gospel Music", desc: "Curated worship, contemporary gospel & classic hymns" },
                { icon: "BookOpen", title: "Bible Teaching", desc: "In-depth sermons and devotionals for spiritual growth" },
                { icon: "Newspaper", title: "Kingdom News", desc: "Faith-based news keeping the body of Christ informed" },
                { icon: "Heart", title: "Community", desc: "A family of believers united in worship and prayer" },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl border"
                  style={{ background: "rgba(22, 40, 96, 0.4)", borderColor: "rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: "rgba(245,166,35,0.15)" }}>
                    <Icon name={item.icon} fallback="Star" size={20} style={{ color: "var(--gospel-gold)" }} />
                  </div>
                  <h4 className="font-playfair font-semibold text-base mb-1.5" style={{ color: "var(--gospel-cream)" }}>
                    {item.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--gospel-text)", opacity: 0.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DONATIONS ── */}
      <section ref={(el) => { sectionsRef.current["Donate"] = el; }} className="py-20 px-6"
        style={{ background: "linear-gradient(180deg, var(--gospel-navy-mid) 0%, var(--gospel-navy) 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="section-reveal text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--gospel-gold)" }}>
              Support the Ministry
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-2" style={{ color: "var(--gospel-cream)" }}>
              Tithes & Donations
            </h2>
            <p className="mt-3 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: "var(--gospel-text)", opacity: 0.65 }}>
              "Bring the whole tithe into the storehouse." — Malachi 3:10
              <br />Your generosity keeps this ministry on the air.
            </p>
          </div>

          <div className="section-reveal rounded-3xl p-8 md:p-10 border"
            style={{ background: "var(--gospel-navy-light)", borderColor: "rgba(245,166,35,0.2)" }}>

            <div className="flex items-center justify-center mb-8">
              <div className="flex rounded-full p-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                {(["once", "monthly"] as const).map((freq) => (
                  <button key={freq} onClick={() => setDonationFreq(freq)}
                    className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                    style={donationFreq === freq ? {
                      background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)",
                      color: "var(--gospel-navy)"
                    } : {
                      color: "var(--gospel-text)"
                    }}>
                    {freq === "once" ? "One Time" : "Monthly"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {DONATION_TIERS.map((tier) => (
                <button key={tier.amount} onClick={() => { setSelectedDonation(tier.amount); setCustomAmount(""); }}
                  className="p-4 rounded-2xl border text-center transition-all duration-200 hover:scale-105"
                  style={selectedDonation === tier.amount && !customAmount ? {
                    borderColor: "var(--gospel-gold)",
                    background: "rgba(245,166,35,0.12)"
                  } : {
                    borderColor: "rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)"
                  }}>
                  <div className="font-playfair text-2xl font-bold mb-1"
                    style={{ color: selectedDonation === tier.amount && !customAmount ? "var(--gospel-gold)" : "var(--gospel-cream)" }}>
                    ${tier.amount}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ color: "var(--gospel-gold)", opacity: selectedDonation === tier.amount && !customAmount ? 1 : 0.6 }}>
                    {tier.label}
                  </div>
                  <div className="text-xs" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>
                    {tier.description}
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-8">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-playfair text-lg"
                  style={{ color: "var(--gospel-gold)" }}>$</span>
                <input type="number" placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedDonation(0); }}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border bg-transparent text-base outline-none transition-all placeholder:opacity-40"
                  style={{
                    borderColor: customAmount ? "var(--gospel-gold)" : "rgba(255,255,255,0.12)",
                    color: "var(--gospel-cream)"
                  }} />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider mb-3 text-center" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>
                Secure payment methods
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {["Credit Card", "Debit Card", "PayPal", "Apple Pay", "Google Pay"].map((method) => (
                  <span key={method} className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                    style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--gospel-text)", opacity: 0.6 }}>
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)", boxShadow: "0 0 25px rgba(245,166,35,0.3)" }}>
              <Icon name="Heart" size={20} />
              Give ${customAmount || selectedDonation}
              {donationFreq === "monthly" ? " / Month" : ""}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Icon name="Lock" size={14} style={{ color: "var(--gospel-text)", opacity: 0.4 }} />
              <p className="text-xs" style={{ color: "var(--gospel-text)", opacity: 0.4 }}>
                256-bit SSL encrypted · PCI compliant · Your giving is tax-deductible
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section ref={(el) => { sectionsRef.current["Contact"] = el; }} className="py-20 px-6"
        style={{ background: "var(--gospel-navy)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="section-reveal">
              <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--gospel-gold)" }}>
                Get In Touch
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mt-2 mb-6" style={{ color: "var(--gospel-cream)" }}>
                Contact & Support
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--gospel-text)", opacity: 0.7 }}>
                Have a prayer request, ministry inquiry, or want to partner with 24.7PraiseRadio?
                We'd love to hear from you.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "Mail", label: "Email", value: "hello@gracewaveradio.com" },
                  { icon: "Phone", label: "Phone", value: "+1 (800) GRACE-FM" },
                  { icon: "MapPin", label: "Address", value: "123 Faith Avenue, Gospel City, GC 10001" },
                  { icon: "Clock", label: "Office Hours", value: "Mon–Fri: 9am – 5pm EST" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(245,166,35,0.12)" }}>
                      <Icon name={item.icon} fallback="Star" size={18} style={{ color: "var(--gospel-gold)" }} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>
                        {item.label}
                      </p>
                      <p className="text-sm font-medium" style={{ color: "var(--gospel-cream)" }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-reveal">
              <div className="rounded-2xl p-6 md:p-8 border"
                style={{ background: "rgba(22, 40, 96, 0.4)", borderColor: "rgba(255,255,255,0.07)" }}>
                <h3 className="font-playfair text-2xl font-semibold mb-6" style={{ color: "var(--gospel-cream)" }}>
                  Send a Message
                </h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {["First Name", "Last Name"].map((placeholder) => (
                      <input key={placeholder} type="text" placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none text-sm transition-all placeholder:opacity-40"
                        style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--gospel-cream)" }} />
                    ))}
                  </div>
                  <input type="email" placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none text-sm transition-all placeholder:opacity-40"
                    style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--gospel-cream)" }} />
                  <select className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all"
                    style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--gospel-text)", background: "var(--gospel-navy-light)" }}>
                    <option value="">Subject</option>
                    <option>Prayer Request</option>
                    <option>Ministry Partnership</option>
                    <option>Technical Support</option>
                    <option>Advertising</option>
                    <option>General Inquiry</option>
                  </select>
                  <textarea placeholder="Your message..." rows={5}
                    className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none text-sm transition-all resize-none placeholder:opacity-40"
                    style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--gospel-cream)" }} />
                  <button className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)" }}>
                    <Icon name="Send" size={16} />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t" style={{ background: "var(--gospel-navy)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)" }}>
                <Icon name="Radio" size={18} />
              </div>
              <div>
                <span className="font-playfair font-bold text-lg block leading-none" style={{ color: "var(--gospel-gold)" }}>
                  24.7PraiseRadio
                </span>
                <span className="text-xs opacity-50 block" style={{ color: "var(--gospel-text)" }}>
                  Your Global Inspiration Station
                </span>
              </div>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {NAV_LINKS.slice(0, 6).map((link) => (
                <button key={link} onClick={() => scrollToSection(link)}
                  className="text-xs hover:opacity-100 transition-opacity"
                  style={{ color: "var(--gospel-text)", opacity: 0.55 }}>
                  {link}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {[
                { icon: "Facebook", label: "Facebook" },
                { icon: "Instagram", label: "Instagram" },
                { icon: "Youtube", label: "YouTube" },
                { icon: "Twitter", label: "Twitter" },
              ].map((s) => (
                <button key={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center border transition-all hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--gospel-text)" }}>
                  <Icon name={s.icon} fallback="Share2" size={15} />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-xs"
            style={{ borderColor: "rgba(255,255,255,0.06)", color: "var(--gospel-text)", opacity: 0.35 }}>
            © 2026 24.7PraiseRadio. All rights reserved. Your Global Inspiration Station.
          </div>
        </div>
      </footer>

    </div>
  );
}