"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRouter } from "next/navigation";
import "./rose/rose.css";
import "./story.css";

// --- Config ---
const PASS = process.env.NEXT_PUBLIC_PASS || "1314";
const SESSION_KEY = "romance_unlocked_final_v6";

const SCENES = [
  { img: "/her.png", svg: "/ref/her.svg", en: "Serendipity", cn: "有些相遇，是星星落进了眼睛里" },
  { img: "/her3.png", svg: "/ref/her3.svg", en: "Flutter", cn: "风很温柔，像你第一次叫我的名字" },
  { img: "/her4.png", svg: "/ref/her4.svg", en: "Intimacy", cn: "连路灯都学会了浪漫，只照亮你" },
  { img: "/her5.png", svg: "/ref/her5.svg", en: "Companionship", cn: "时间煮雨，我们煮茶，岁月生香" },
  { img: "/her6.png", svg: "/ref/her6.svg", en: "Tacit", cn: "不用回头，我知道你一直在身后" },
  { img: "/her7.png", svg: "/ref/her7.svg", en: "Indulge", cn: "我的超能力，是让你永远做个孩子" },
  { img: "/her8.png", svg: "/ref/her8.svg", en: "Vow", cn: "想把所有美好的词，都兑换成你" },
  { img: "/her9.png", svg: "/ref/her9.svg", en: "Eternity", cn: "这一生很长，好在有你，闪闪发光" },
] as const;

// --- Story Experience (Romantic Design) ---
function StoryExperience({ idx, setIdx }: { idx: number; setIdx: React.Dispatch<React.SetStateAction<number>> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(Observer);
    
    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onDown: () => {
        if (!isTransitioning && idx < SCENES.length) {
          setIdx(i => i + 1);
        }
      },
      onUp: () => {
        if (!isTransitioning && idx > 0) {
          setIdx(i => i - 1);
        }
      }
    });
    
    return () => obs.kill();
  }, [idx, setIdx, isTransitioning]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    setIsTransitioning(true);
    
    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false)
    });

    tl.fromTo(
      `.story-scene[data-index="${idx}"]`,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
    );

    tl.fromTo(
      `.story-text[data-index="${idx}"] .story-en`,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=1"
    );

    tl.fromTo(
      `.story-text[data-index="${idx}"] .story-cn`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.7"
    );

    return () => {
      tl.kill();
    };
  }, [idx]);

  if (idx >= SCENES.length) {
    return <EndingScene />;
  }

  return (
    <div ref={containerRef} className="story-experience">
      <div className="story-background">
        <div className="story-gradient"></div>
        <div className="story-stars"></div>
        <div className="story-floating-particles">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="story-scenes">
        {SCENES.map((scene, i) => (
          <div
            key={i}
            className={`story-scene ${i === idx ? 'active' : ''}`}
            data-index={i}
            style={{ display: i === idx ? 'block' : 'none' }}
          >
            <div className="story-image-wrapper">
              <div className="image-glow"></div>
              <img src={scene.img} alt={scene.en} className="story-image" />
              <img src={scene.svg} alt={scene.en} className="story-svg-overlay" />
            </div>

            <div className="story-text" data-index={i}>
              <div className="text-decoration"></div>
              <h2 className="story-en">{scene.en}</h2>
              <p className="story-cn">{scene.cn}</p>
              <div className="text-decoration-bottom"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="story-navigation">
        <div className="nav-dots">
          {SCENES.map((_, i) => (
            <button
              key={i}
              className={`nav-dot ${i === idx ? 'active' : ''}`}
              onClick={() => !isTransitioning && setIdx(i)}
            >
              <span className="dot-inner"></span>
            </button>
          ))}
        </div>
        <div className="nav-hint">
          {idx < SCENES.length - 1 ? '滚动查看更多' : '滚动查看结局'}
        </div>
      </div>

      <div className="story-decorations">
        <div className="deco-heart deco-heart-1">♥</div>
        <div className="deco-heart deco-heart-2">♥</div>
        <div className="deco-heart deco-heart-3">♥</div>
      </div>
    </div>
  );
}


function EndingScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(
      ".ending-title",
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power3.out" }
    );

    tl.fromTo(
      ".ending-subtitle",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.8"
    );

    tl.fromTo(
      ".ending-gallery",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    SCENES.forEach((_, i) => {
      tl.fromTo(
        `.ending-photo[data-index="${i}"]`,
        { opacity: 0, scale: 0.8, rotation: Math.random() * 20 - 10 },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 0,
          duration: 0.8, 
          ease: "back.out(1.5)" 
        },
        `-=${i === 0 ? 0 : 0.6}`
      );
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="ending-scene">
      <div className="story-background">
        <div className="story-gradient"></div>
        <div className="story-stars"></div>
      </div>

      <div className="ending-content">
        <h1 className="ending-title">Forever & Always</h1>
        <p className="ending-subtitle">未完待续 · 我们的故事刚刚开始</p>

        <div className="ending-gallery">
          {SCENES.map((scene, i) => (
            <div key={i} className="ending-photo" data-index={i}>
              <img src={scene.img} alt={scene.en} />
              <div className="photo-label">{scene.en}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function Page() {
  const [unlocked, setUnlocked] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [renderChoice, setRenderChoice] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const isUnlocked = sessionStorage.getItem(SESSION_KEY) === "1";
    const viewStory = sessionStorage.getItem("view_story") === "1";
    
    if (isUnlocked) {
      setUnlocked(true);
      if (viewStory) {
        setShowStory(true);
        setShowChoice(false);
        setRenderChoice(false);
      } else {
        setRenderChoice(true);
        setShowChoice(true);
      }
    }
  }, []);

  const handleUnlock = () => {
    setUnlocked(true);
    setRenderChoice(true);
  };

  const handleParticleComplete = () => {
    setShowChoice(prev => {
      if (!prev) {
        return true;
      }
      return prev;
    });
  };

  const handleNavigateToStory = () => {
    sessionStorage.setItem("view_story", "1");
    setShowStory(true);
    setShowChoice(false);
    setRenderChoice(false);
  };

  return (
    <div className="stage-root">
        {showStory && <StoryExperience idx={idx} setIdx={setIdx} />}
        {renderChoice && <ChoiceScreen show={showChoice} onNavigateToStory={handleNavigateToStory} />}
        {!unlocked && <Gate onUnlock={handleUnlock} onParticleComplete={handleParticleComplete} />}
    </div>
  );
}


function ChoiceScreen({ show, onNavigateToStory }: { show: boolean; onNavigateToStory: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    const tl = gsap.timeline({ delay: 0 });
    
    tl.fromTo(".rose-bg", 
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
    
    tl.fromTo(".top-decoration", 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );
    
    tl.fromTo(".choice-title", 
      { 
        y: 100, 
        opacity: 0,
        scale: 0.8,
        rotationX: -30
      },
      { 
        y: 0, 
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1.2, 
        ease: "power4.out" 
      },
      "-=0.5"
    );
    
    tl.fromTo(".choice-subtitle", 
      { 
        opacity: 0,
        y: 30,
        letterSpacing: "0.5em"
      },
      { 
        opacity: 1,
        y: 0,
        letterSpacing: "0.3em",
        duration: 1, 
        ease: "power3.out" 
      },
      "-=0.8"
    );
    
    tl.to(".journey-path", 
      { opacity: 1, duration: 0.6 },
      "-=0.5"
    );
    
    tl.to(".path-line", 
      { 
        strokeDashoffset: 0, 
        duration: 1.5, 
        ease: "power2.inOut" 
      },
      "-=0.3"
    );
    
    gsap.set(".choice-btn", { 
      opacity: 0, 
      scale: 0.5,
      rotationY: -90,
      transformPerspective: 1000
    });
    
    tl.to(".choice-btn", 
      { 
        opacity: 1,
        scale: 1, 
        rotationY: 0,
        duration: 1, 
        stagger: 0.2,
        ease: "back.out(1.5)" 
      },
      "-=1"
    );
    
    tl.fromTo(".footer-line", 
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );
    
    tl.fromTo(".footer-text", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.3"
    );
    
    tl.fromTo(".footer-date", 
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.2"
    );
    
    const floatTween = gsap.to(".choice-btn", {
      y: -10,
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.3,
        from: "start"
      }
    });

    return () => {
      tl.kill();
      floatTween.kill();
      gsap.killTweensOf(".rose-bg");
      gsap.killTweensOf(".top-decoration");
      gsap.killTweensOf(".choice-title");
      gsap.killTweensOf(".choice-subtitle");
      gsap.killTweensOf(".journey-path");
      gsap.killTweensOf(".path-line");
      gsap.killTweensOf(".choice-btn");
      gsap.killTweensOf(".footer-line");
      gsap.killTweensOf(".footer-text");
      gsap.killTweensOf(".footer-date");
    };
  }, [show]);

  const navigateToStory = () => {
    gsap.to(".rose-stage", {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        onNavigateToStory();
      }
    });
  };

  const showComingSoon = () => {
    const btn = document.querySelector(".choice-btn.disabled");
    gsap.timeline()
      .to(btn, { scale: 1.05, duration: 0.1 })
      .to(btn, { scale: 1, duration: 0.1 });
  };

  return (
    <div ref={containerRef} className="rose-stage" style={{ opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none' }}>
      <div className="rose-bg">
        <div className="rose-stars"></div>
        <div className="floating-hearts">
          <span className="heart">♥</span>
          <span className="heart">♥</span>
          <span className="heart">♥</span>
          <span className="heart">♥</span>
          <span className="heart">♥</span>
        </div>
        
        <div className="deco-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="choice-container">
        <div className="top-decoration">
          <div className="deco-line-top"></div>
          <div className="deco-dot"></div>
          <div className="deco-line-top"></div>
        </div>

        <h2 className="choice-title">选择你的旅程</h2>
        <p className="choice-subtitle">Choose Your Journey</p>
        
        <div className="journey-path">
          <svg width="100%" height="80" viewBox="0 0 800 80" preserveAspectRatio="xMidYMid meet">
            <path 
              className="path-line"
              d="M 50 40 Q 200 10, 400 40 T 750 40" 
              fill="none" 
              stroke="url(#pathGradient)" 
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 116, 183, 0.3)" />
                <stop offset="50%" stopColor="rgba(255, 116, 183, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 116, 183, 0.3)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="choice-grid">
          <button onClick={navigateToStory} className="choice-btn active">
            <div className="btn-bg"></div>
            <div className="btn-content">
              <div className="btn-icon">💌</div>
              <h3 className="btn-title">想对你说的话</h3>
              <p className="btn-desc">Words from the Heart</p>
              <div className="btn-detail">8个珍贵瞬间</div>
            </div>
            <div className="btn-shine"></div>
            <div className="btn-particles">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          <button onClick={showComingSoon} className="choice-btn disabled">
            <div className="btn-bg"></div>
            <div className="btn-content">
              <div className="btn-icon">🌌</div>
              <h3 className="btn-title">优优的元宇宙</h3>
              <p className="btn-desc">正在为优优搬砖打造中...</p>
              <div className="btn-detail">敬请期待</div>
            </div>
            <div className="construction-badge">
              <span>🚧 施工中</span>
            </div>
          </button>

          <button onClick={showComingSoon} className="choice-btn disabled">
            <div className="btn-bg"></div>
            <div className="btn-content">
              <div className="btn-icon">🏠</div>
              <h3 className="btn-title">智能生活小助手</h3>
              <p className="btn-desc">Your Personal Life Assistant</p>
              <div className="btn-detail">敬请期待</div>
            </div>
            <div className="construction-badge">
              <span>🚧 施工中</span>
            </div>
          </button>

          <button onClick={showComingSoon} className="choice-btn disabled">
            <div className="btn-bg"></div>
            <div className="btn-content">
              <div className="btn-icon">💼</div>
              <h3 className="btn-title">智能工作小助手</h3>
              <p className="btn-desc">Your Professional Work Assistant</p>
              <div className="btn-detail">敬请期待</div>
            </div>
            <div className="construction-badge">
              <span>🚧 施工中</span>
            </div>
          </button>
        </div>

        <div className="choice-footer">
          <div className="footer-line"></div>
          <p className="footer-text">为你，倾尽所有浪漫</p>
          <div className="footer-date">2025 · 永恒的承诺</div>
        </div>
      </div>
    </div>
  );
}


function Gate({ onUnlock, onParticleComplete }: { onUnlock: () => void; onParticleComplete: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [err, setErr] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const bgCanvas = bgCanvasRef.current;
      if (!bgCanvas) return;
      
      const ctx = bgCanvas.getContext("2d");
      if (!ctx) return;
      
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
      
      const particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        opacity: number;
        color: string;
      }> = [];
      
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * bgCanvas.width,
          y: Math.random() * bgCanvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: Math.random() > 0.5 ? "#ff74b7" : "#ffa8d5"
        });
      }
      
      const animate = () => {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;
          
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
        
        requestAnimationFrame(animate);
      };
      
      animate();
      
      const handleResize = () => {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
      };
      
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);


  const createParticleExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const inputBox = document.querySelector(".gate-card");
    const rect = inputBox?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ["#ff74b7", "#ffa8d5", "#ffffff", "#ffb3e6", "#ff9ed2", "#ffc0e3"];
    
    const gridSize = 20;
    for (let gx = 0; gx < gridSize; gx++) {
      for (let gy = 0; gy < gridSize; gy++) {
        const startX = rect.left + (rect.width / gridSize) * gx + Math.random() * (rect.width / gridSize);
        const startY = rect.top + (rect.height / gridSize) * gy + Math.random() * (rect.height / gridSize);
        
        const angle = Math.atan2(startY - centerY, startX - centerX) + (Math.random() - 0.5) * 0.5;
        const velocity = 3 + Math.random() * 8;
        
        particles.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - Math.random() * 3,
          size: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3
        });
      }
    }

    for (let i = 0; i < 30; i++) {
      const t = (i / 30) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      particles.push({
        x: centerX,
        y: centerY,
        vx: x * 0.4,
        vy: y * 0.4,
        size: 3 + Math.random() * 2,
        color: "#ff74b7",
        life: 1.2,
        rotation: 0,
        rotationSpeed: 0.2
      });
    }

    gsap.to(".gate-card", { 
      opacity: 0, 
      scale: 0.3, 
      rotation: 15,
      duration: 0.5,
      ease: "power4.in"
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let aliveCount = 0;
      particles.forEach(p => {
        if (p.life <= 0) return;
        aliveCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life -= 0.012;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.globalAlpha = p.life * 0.9;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 25;
        ctx.shadowColor = p.color;
        
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = p.life * 0.4;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      if (aliveCount > 0) {
        requestAnimationFrame(animate);
      } else {
        gsap.to(".gate-overlay", {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            sessionStorage.setItem(SESSION_KEY, "1");
            onUnlock();
            setTimeout(() => onParticleComplete(), 100);
          }
        });
      }
    };

    animate();
  };

  const check = () => {
    if (inputRef.current?.value === PASS) {
      createParticleExplosion();
    } else {
      setErr(true);
      gsap.fromTo(".gate-card", { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
      setTimeout(() => setErr(false), 500);
    }
  };

  if(!mounted) return null;

  return (
    <div className="gate-overlay">
        <div className="gate-bg">
          <div className="gate-glow-orb orb-1"></div>
          <div className="gate-glow-orb orb-2"></div>
          <div className="gate-glow-orb orb-3"></div>
          <div className="gate-stars"></div>
          <div className="gate-floating-hearts">
            <span className="heart">♥</span>
            <span className="heart">♥</span>
            <span className="heart">♥</span>
            <span className="heart">♥</span>
            <span className="heart">♥</span>
            <span className="heart">♥</span>
            <span className="heart">♥</span>
            <span className="heart">♥</span>
          </div>
        </div>
        <canvas ref={bgCanvasRef} className="gate-bg-canvas" />
        <canvas ref={canvasRef} className="gate-particle-canvas" />
        <div className="gate-card">
            <div className="gate-card-glow"></div>
            <div className="gate-card-content">
              <h1 className="gate-brand">
                <span className="brand-text">YOUYOU</span>
                <span className="brand-shine"></span>
              </h1>
              <p className="gate-hint">Enter Your Universe</p>
              <div className="gate-input-wrapper">
                  <input 
                      ref={inputRef} 
                      type="password" 
                      className="gate-input"
                      placeholder="1314"
                      onKeyDown={e => e.key === "Enter" && check()}
                  />
                  <button className="gate-btn" onClick={check}>
                    <span>→</span>
                    <div className="btn-ripple"></div>
                  </button>
              </div>
              {err && <div className="gate-error">Access Denied</div>}
            </div>
        </div>
    </div>
  );
}
