"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import "./v3.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

const SCENES = [
  { img: "/her.png", svg: "/ref/her.svg", title: "初见", titleEn: "SERENDIPITY", poem: ["那一刻星辰坠入眼眸", "时间忘记了流动", "世界只剩下你的轮廓"], story: "有些相遇，是命运在人海中精心安排的奇迹。当我第一次看见你，仿佛整个宇宙都在那一瞬间静止，只为让我记住你的模样。", accent: "#ff74b7" },
  { img: "/her3.png", svg: "/ref/her3.svg", title: "心动", titleEn: "FLUTTER", poem: ["风很温柔", "像你第一次叫我的名字", "从此我的名字有了意义"], story: "心动是什么感觉？是听到你的声音会不自觉微笑，是想到你就觉得世界都变得柔软，是愿意为你变成更好的人。", accent: "#e8a0bf" },
  { img: "/her4.png", svg: "/ref/her4.svg", title: "陪伴", titleEn: "INTIMACY", poem: ["路灯学会了浪漫", "只照亮你走过的路", "我学会了等待"], story: "最好的爱情不是轰轰烈烈，而是细水长流的陪伴。每一个平凡的日子，因为有你，都变成了值得珍藏的回忆。", accent: "#d4a5c9" },
  { img: "/her5.png", svg: "/ref/her5.svg", title: "默契", titleEn: "COMPANIONSHIP", poem: ["时间煮雨", "我们煮茶", "岁月在杯中生香"], story: "不用言语，一个眼神就能懂得彼此。这种默契，是我们用无数个日夜培养出的专属语言。", accent: "#c9a0dc" },
  { img: "/her6.png", svg: "/ref/her6.svg", title: "信任", titleEn: "TACIT", poem: ["不用回头", "我知道你一直在身后", "这是最安心的距离"], story: "信任是爱情最珍贵的礼物。因为相信你，我可以勇敢地向前走，因为我知道，无论发生什么，你都会在那里。", accent: "#b8a0e8" },
  { img: "/her7.png", svg: "/ref/her7.svg", title: "宠溺", titleEn: "INDULGE", poem: ["我的超能力", "是让你永远做个孩子", "被世界温柔以待"], story: "想把所有的温柔都给你，想让你永远保持那份纯真的笑容。在我这里，你可以任性，可以撒娇，可以做最真实的自己。", accent: "#ffb3c6" },
  { img: "/her8.png", svg: "/ref/her8.svg", title: "誓言", titleEn: "VOW", poem: ["想把所有美好的词", "都兑换成你", "写进余生的每一页"], story: "我不会说太多华丽的情话，但我想用一生的时间，把每一个承诺都变成现实。你值得世间所有的美好。", accent: "#ff8fab" },
  { img: "/her9.png", svg: "/ref/her9.svg", title: "永恒", titleEn: "ETERNITY", poem: ["这一生很长", "好在有你", "闪闪发光"], story: "未来的路还很长，但只要牵着你的手，每一步都是风景。感谢命运让我遇见你，让我的生命从此有了光。", accent: "#ffc2d1" },
];

export default function GalleryV3Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!pageReady) return;
    const obs = Observer.create({
      target: window, type: "wheel,touch,pointer", wheelSpeed: -1, tolerance: 100, preventDefault: true,
      onDown: () => { if (!isTransitioning && currentIndex < SCENES.length - 1) { setIsTransitioning(true); setCurrentIndex(i => i + 1); } },
      onUp: () => { if (!isTransitioning && currentIndex > 0) { setIsTransitioning(true); setCurrentIndex(i => i - 1); } },
    });
    return () => obs.kill();
  }, [currentIndex, isTransitioning, pageReady]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isTransitioning || !pageReady) return;
      if (["ArrowDown", "ArrowRight", " "].includes(e.key)) { e.preventDefault(); if (currentIndex < SCENES.length - 1) { setIsTransitioning(true); setCurrentIndex(i => i + 1); } }
      else if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); if (currentIndex > 0) { setIsTransitioning(true); setCurrentIndex(i => i - 1); } }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, isTransitioning, pageReady]);

  const handleComplete = useCallback(() => setIsTransitioning(false), []);
  const scene = SCENES[currentIndex];

  return (
    <div className={`v3-stage ${pageReady ? "ready" : ""}`} style={{ "--accent": scene.accent } as React.CSSProperties}>
      <div className="v3-bg">
        <div className="v3-gradient" />
        <ParticleCanvas accent={scene.accent} />
        <div className="v3-vignette" />
      </div>

      {SCENES.map((s, i) => (
        <Scene key={i} scene={s} index={i} currentIndex={currentIndex} onComplete={handleComplete} pageReady={pageReady} />
      ))}

      <nav className="v3-nav">
        <div className="v3-nav-progress"><div className="v3-nav-fill" style={{ width: `${((currentIndex + 1) / SCENES.length) * 100}%` }} /></div>
        <div className="v3-nav-dots">{SCENES.map((s, i) => <div key={i} className={`v3-nav-dot ${i === currentIndex ? "active" : ""}`}><span className="v3-nav-label">{s.title}</span></div>)}</div>
      </nav>

      <footer className="v3-footer">
        <div className="v3-footer-num"><span className="current">{String(currentIndex + 1).padStart(2, "0")}</span><span className="sep">/</span><span className="total">{String(SCENES.length).padStart(2, "0")}</span></div>
        <div className="v3-footer-title">{scene.titleEn}</div>
        {currentIndex < SCENES.length - 1 && <div className="v3-footer-hint">↓ scroll</div>}
      </footer>
    </div>
  );
}

// 背景粒子
function ParticleCanvas({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles: Array<{ x: number; y: number; size: number; vx: number; vy: number; opacity: number; phase: number }> = [];
    for (let i = 0; i < 60; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 0.5, vx: (Math.random() - 0.5) * 0.1, vy: (Math.random() - 0.5) * 0.1, opacity: Math.random() * 0.3 + 0.1, phase: Math.random() * Math.PI * 2 });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.phase += 0.01;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.save();
        ctx.globalAlpha = p.opacity * (0.5 + 0.5 * Math.sin(p.phase));
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = 6;
        ctx.shadowColor = accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animId); };
  }, [accent]);
  return <canvas ref={canvasRef} className="v3-particles" />;
}

// SVG描边动画
function SVGDrawing({ src, accent, isActive }: { src: string; accent: string; isActive: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    fetch(src).then(res => res.text()).then(text => setSvgContent(text)).catch(() => {});
  }, [src]);

  useEffect(() => {
    if (!containerRef.current || !svgContent) return;
    tlRef.current?.kill();
    const svg = containerRef.current.querySelector("svg");
    if (!svg) return;

    const paths = svg.querySelectorAll("path, line, polyline, polygon, circle, ellipse");
    paths.forEach((path) => {
      const el = path as SVGGeometryElement;
      el.style.fill = "none";
      el.style.stroke = accent;
      el.style.strokeWidth = "1";
      el.style.strokeLinecap = "round";
      if (typeof el.getTotalLength === "function") {
        const length = el.getTotalLength();
        el.style.strokeDasharray = String(length);
        el.style.strokeDashoffset = String(length);
      }
    });

    if (isActive) {
      const tl = gsap.timeline();
      tlRef.current = tl;
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
      const pathArray = Array.from(paths).sort(() => Math.random() - 0.5);
      pathArray.forEach((path, i) => {
        const el = path as SVGGeometryElement;
        if (typeof el.getTotalLength === "function") {
          tl.to(el, { strokeDashoffset: 0, duration: 1.5 + Math.random() * 0.5, ease: "power1.inOut" }, 0.2 + i * 0.02);
        }
      });
      tl.to(svg, { filter: `drop-shadow(0 0 8px ${accent})`, duration: 0.5 }, "-=0.5");
    } else {
      const tl = gsap.timeline();
      tlRef.current = tl;
      paths.forEach((path) => {
        const el = path as SVGGeometryElement;
        if (typeof el.getTotalLength === "function") {
          tl.to(el, { strokeDashoffset: -el.getTotalLength(), duration: 0.5, ease: "power2.in" }, 0);
        }
      });
      tl.to(containerRef.current, { opacity: 0, duration: 0.3 }, 0);
    }
    return () => { tlRef.current?.kill(); };
  }, [svgContent, isActive, accent]);

  return <div ref={containerRef} className="v3-svg-container" dangerouslySetInnerHTML={{ __html: svgContent }} />;
}

// 照片粒子爆发效果 - 轻量版
function PhotoWithParticles({ 
  src, accent, isActive, onParticleComplete 
}: { 
  src: string; accent: string; isActive: boolean; onParticleComplete: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }>>([]);
  const animIdRef = useRef<number>(0);

  // 创建粒子爆发
  const createBurst = useCallback(() => {
    if (!photoRef.current || !canvasRef.current) return;
    
    const rect = photoRef.current.getBoundingClientRect();
    const canvas = canvasRef.current;
    const centerX = rect.left + rect.width / 2 - canvas.getBoundingClientRect().left;
    const centerY = rect.top + rect.height / 2 - canvas.getBoundingClientRect().top;

    const particles: typeof particlesRef.current = [];
    const colors = [accent, "#fff", "#ffd1dc", "#ffb6c1"];

    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80 + Math.random() * 0.5;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x: centerX + (Math.random() - 0.5) * rect.width * 0.8,
        y: centerY + (Math.random() - 0.5) * rect.height * 0.8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = particles;
  }, [accent]);

  // 粒子动画循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const container = containerRef.current;
      if (container) {
        canvas.width = container.offsetWidth + 200;
        canvas.height = container.offsetHeight + 200;
      }
    };
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      if (particles.length > 0) {
        let allDone = true;
        particles.forEach(p => {
          if (p.alpha > 0.01) {
            allDone = false;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.alpha *= 0.95;

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
        if (allDone) {
          particlesRef.current = [];
        }
      }
      
      animIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animIdRef.current);
  }, []);

  // 场景切换时触发粒子
  const prevActiveRef = useRef(isActive);
  useEffect(() => {
    if (prevActiveRef.current && !isActive) {
      // 离开时爆发粒子
      createBurst();
    }
    prevActiveRef.current = isActive;
  }, [isActive, createBurst]);

  return (
    <div ref={containerRef} className="v3-photo-container">
      <canvas ref={canvasRef} className="v3-burst-canvas" />
      <img ref={photoRef} src={src} alt="" className="v3-photo" />
      <div className="v3-photo-glow" style={{ background: `radial-gradient(ellipse, ${accent}30 0%, transparent 70%)` }} />
    </div>
  );
}

// 场景组件
function Scene({ scene, index, currentIndex, onComplete, pageReady }: {
  scene: (typeof SCENES)[0]; index: number; currentIndex: number; onComplete: () => void; pageReady: boolean;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const isActive = index === currentIndex;

  useEffect(() => {
    if (!sceneRef.current || !pageReady) return;
    tlRef.current?.kill();
    gsap.killTweensOf(photoWrapperRef.current);

    if (isActive) {
      gsap.set(sceneRef.current, { visibility: "visible", zIndex: 10 });
      const tl = gsap.timeline({ onComplete });
      tlRef.current = tl;

      // 照片入场 - 从粒子聚合的感觉
      tl.fromTo(photoWrapperRef.current,
        { scale: 0.9, opacity: 0, filter: "blur(15px) brightness(1.5)" },
        { scale: 1, opacity: 1, filter: "blur(0px) brightness(1)", duration: 0.8, ease: "power2.out" },
        0
      );

      // 浮动
      gsap.to(photoWrapperRef.current, { y: 6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });

    } else {
      const tl = gsap.timeline();
      tlRef.current = tl;

      // 照片出场 - 散开消失的感觉
      tl.to(photoWrapperRef.current, { 
        scale: 1.05, 
        opacity: 0, 
        filter: "blur(10px) brightness(1.3)", 
        duration: 0.5, 
        ease: "power2.in" 
      }, 0);

      tl.set(sceneRef.current, { visibility: "hidden", zIndex: 0 });
    }

    return () => { tlRef.current?.kill(); gsap.killTweensOf(photoWrapperRef.current); };
  }, [isActive, onComplete, pageReady]);

  return (
    <div ref={sceneRef} className="v3-scene" style={{ visibility: isActive ? "visible" : "hidden" }}>
      {/* 照片 */}
      <div className="v3-photo-area">
        <div ref={photoWrapperRef} className="v3-photo-wrapper">
          <PhotoWithParticles 
            src={scene.img} 
            accent={scene.accent} 
            isActive={isActive}
            onParticleComplete={() => {}}
          />
        </div>
      </div>

      {/* 文字 */}
      <div className="v3-content-area">
        <div className="v3-title-block">
          <span className="v3-title-en">{scene.titleEn}</span>
          <h2 className="v3-title-cn">{scene.title}</h2>
          <div className="v3-title-line" />
        </div>
        <div className="v3-poem-block">
          {scene.poem.map((line, i) => (
            <div key={i} className="v3-poem-line">
              <span className="v3-poem-marker">—</span>
              <span className="v3-poem-text">{line}</span>
            </div>
          ))}
        </div>
        <div className="v3-story-block">
          <p>{scene.story}</p>
        </div>
      </div>

      {/* SVG */}
      <div className="v3-svg-area">
        <SVGDrawing src={scene.svg} accent={scene.accent} isActive={isActive} />
      </div>
    </div>
  );
}
