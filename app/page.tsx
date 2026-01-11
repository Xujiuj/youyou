"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import GateDroneBackground from "./components/GateDroneBackground";
import "./story.css";

const PASS = process.env.NEXT_PUBLIC_PASS || "0105";
const SESSION_KEY = "romance_unlocked_final_v6";

export default function Page() {
  const [unlocked, setUnlocked] = useState(false);
  const [showChoice, setShowChoice] = useState(false);

  useEffect(() => {
    const isUnlocked = sessionStorage.getItem(SESSION_KEY) === "1";
    if (isUnlocked) {
      setUnlocked(true);
      setShowChoice(true);
    }
  }, []);

  const handleUnlock = () => {
    setUnlocked(true);
  };

  const handleParticleComplete = () => {
    setShowChoice(true);
  };

  return (
    <div className="stage-root">
      <ChoiceScreen show={showChoice} />
      {!unlocked && <Gate onUnlock={handleUnlock} onParticleComplete={handleParticleComplete} />}
    </div>
  );
}

function ChoiceScreen({ show }: { show: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;

    const tl = gsap.timeline({ delay: 0 });
    
    tl.fromTo(".rose-bg", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" });
    tl.fromTo(".top-decoration", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");
    tl.fromTo(".choice-title", { y: 100, opacity: 0, scale: 0.8, rotationX: -30 }, { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1.2, ease: "power4.out" }, "-=0.5");
    tl.fromTo(".choice-subtitle", { opacity: 0, y: 30, letterSpacing: "0.5em" }, { opacity: 1, y: 0, letterSpacing: "0.3em", duration: 1, ease: "power3.out" }, "-=0.8");
    tl.to(".journey-path", { opacity: 1, duration: 0.6 }, "-=0.5");
    tl.to(".path-line", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.3");
    
    gsap.set(".choice-btn", { opacity: 0, scale: 0.5, rotationY: -90, transformPerspective: 1000 });
    tl.to(".choice-btn", { opacity: 1, scale: 1, rotationY: 0, duration: 1, stagger: 0.2, ease: "back.out(1.5)" }, "-=1");
    
    tl.fromTo(".footer-line", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4");
    tl.fromTo(".footer-text", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.3");
    tl.fromTo(".footer-date", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2");
    
    const floatTween = gsap.to(".choice-btn", {
      y: -10, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1,
      stagger: { each: 0.3, from: "start" }
    });

    return () => {
      tl.kill();
      floatTween.kill();
    };
  }, [show]);

  const navigateToGallery = () => {
    gsap.to(".rose-stage", {
      opacity: 0, scale: 0.95, duration: 0.8, ease: "power2.inOut",
      onComplete: () => { window.location.href = "/gallery"; }
    });
  };

  const showComingSoon = () => {
    const btn = document.querySelector(".choice-btn.disabled");
    gsap.timeline().to(btn, { scale: 1.05, duration: 0.1 }).to(btn, { scale: 1, duration: 0.1 });
  };

  return (
    <div ref={containerRef} className="rose-stage" style={{ opacity: show ? 1 : 0, pointerEvents: show ? 'auto' : 'none' }}>
      <div className="rose-bg">
        <RoseMeteorCanvas />
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
            <path className="path-line" d="M 50 40 Q 200 10, 400 40 T 750 40" fill="none" stroke="url(#pathGradient)" strokeWidth="2" strokeDasharray="5,5" />
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
          <button onClick={navigateToGallery} className="choice-btn active">
            <div className="btn-bg"></div>
            <div className="btn-content">
              <div className="btn-icon">💌</div>
              <h3 className="btn-title">你好，优优</h3>
              <p className="btn-desc">Hello World</p>
              <div className="btn-detail">一封给优优的信</div>
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
              <div className="btn-detail">给优优打造的小世界</div>
            </div>
            <div className="construction-badge"><span>🚧 施工中</span></div>
          </button>

          <button onClick={showComingSoon} className="choice-btn disabled">
            <div className="btn-bg"></div>
            <div className="btn-content">
              <div className="btn-icon">🏠</div>
              <h3 className="btn-title">智能生活小助手</h3>
              <p className="btn-desc">给优优的专属AI生活助手</p>
              <div className="btn-detail">AI正在尝试了解优优</div>
            </div>
            <div className="construction-badge"><span>🚧 施工中</span></div>
          </button>

          <button onClick={showComingSoon} className="choice-btn disabled">
            <div className="btn-bg"></div>
            <div className="btn-content">
              <div className="btn-icon">💼</div>
              <h3 className="btn-title">智能工作小助手</h3>
              <p className="btn-desc">给优优的专属AI工作助手</p>
              <div className="btn-detail">AI正在尝试了解优优</div>
            </div>
            <div className="construction-badge"><span>🚧 施工中</span></div>
          </button>
        </div>

        <div className="choice-footer">
          <div className="footer-line"></div>
          <p className="footer-text">皆因是你</p>
          <div className="footer-date">2026 · Just the Way You Are</div>
        </div>
      </div>
    </div>
  );
}

function RoseMeteorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    
    const meteors: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }> = [];
    
    const createMeteor = () => {
      const startX = Math.random() * canvas.width;
      const startY = -50;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 2.5 + Math.random() * 3.5;
      const length = 100 + Math.random() * 80;
      
      meteors.push({
        x: startX,
        y: startY,
        length,
        speed,
        angle,
        opacity: 1,
        trail: []
      });
    };
    
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.015 && meteors.length < 4) {
        createMeteor();
      }
      
      meteors.forEach((meteor, index) => {
        const dx = Math.cos(meteor.angle) * meteor.speed;
        const dy = Math.sin(meteor.angle) * meteor.speed;
        
        meteor.x += dx;
        meteor.y += dy;
        
        meteor.trail.push({ x: meteor.x, y: meteor.y, opacity: meteor.opacity });
        if (meteor.trail.length > 25) {
          meteor.trail.shift();
        }
        
        ctx.save();
        const gradient = ctx.createLinearGradient(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length,
          meteor.x,
          meteor.y
        );
        gradient.addColorStop(0, "rgba(255, 182, 193, 0)");
        gradient.addColorStop(0.5, "rgba(255, 182, 193, 0.6)");
        gradient.addColorStop(1, `rgba(255, 255, 255, ${meteor.opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(255, 182, 193, 0.9)";
        
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length);
        ctx.stroke();
        
        meteor.trail.forEach((point, i) => {
          const trailOpacity = (i / meteor.trail.length) * meteor.opacity * 0.4;
          ctx.globalAlpha = trailOpacity;
          ctx.fillStyle = "rgba(255, 182, 193, 0.9)";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2.5 - (i / meteor.trail.length) * 2, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.restore();
        
        if (meteor.y > canvas.height + 100 || meteor.x < -100 || meteor.x > canvas.width + 100) {
          meteors.splice(index, 1);
        }
      });
      
      animId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="rose-stars" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

function GateMeteorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    
    const meteors: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }> = [];
    
    const createMeteor = () => {
      const startX = Math.random() * canvas.width;
      const startY = -50;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 2.5 + Math.random() * 3.5;
      const length = 100 + Math.random() * 80;
      
      meteors.push({
        x: startX,
        y: startY,
        length,
        speed,
        angle,
        opacity: 1,
        trail: []
      });
    };
    
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (Math.random() < 0.015 && meteors.length < 4) {
        createMeteor();
      }
      
      meteors.forEach((meteor, index) => {
        const dx = Math.cos(meteor.angle) * meteor.speed;
        const dy = Math.sin(meteor.angle) * meteor.speed;
        
        meteor.x += dx;
        meteor.y += dy;
        
        meteor.trail.push({ x: meteor.x, y: meteor.y, opacity: meteor.opacity });
        if (meteor.trail.length > 25) {
          meteor.trail.shift();
        }
        
        ctx.save();
        const gradient = ctx.createLinearGradient(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length,
          meteor.x,
          meteor.y
        );
        gradient.addColorStop(0, "rgba(255, 182, 193, 0)");
        gradient.addColorStop(0.5, "rgba(255, 182, 193, 0.6)");
        gradient.addColorStop(1, `rgba(255, 255, 255, ${meteor.opacity})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(255, 182, 193, 0.9)";
        
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length);
        ctx.stroke();
        
        meteor.trail.forEach((point, i) => {
          const trailOpacity = (i / meteor.trail.length) * meteor.opacity * 0.4;
          ctx.globalAlpha = trailOpacity;
          ctx.fillStyle = "rgba(255, 182, 193, 0.9)";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2.5 - (i / meteor.trail.length) * 2, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.restore();
        
        if (meteor.y > canvas.height + 100 || meteor.x < -100 || meteor.x > canvas.width + 100) {
          meteors.splice(index, 1);
        }
      });
      
      animId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="gate-stars" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }} />;
}

function Gate({ onUnlock, onParticleComplete }: { onUnlock: () => void; onParticleComplete: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [err, setErr] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
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
      x: number; y: number; vx: number; vy: number; size: number; color: string;
      life: number; rotation: number; rotationSpeed: number;
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
          x: startX, y: startY,
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
        x: centerX, y: centerY,
        vx: x * 0.4, vy: y * 0.4,
        size: 3 + Math.random() * 2,
        color: "#ff74b7",
        life: 1.2,
        rotation: 0,
        rotationSpeed: 0.2
      });
    }

    gsap.to(".gate-card", { opacity: 0, scale: 0.3, rotation: 15, duration: 0.5, ease: "power4.in" });

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
          opacity: 0, duration: 0.6, ease: "power2.out",
          onStart: () => {
            sessionStorage.setItem(SESSION_KEY, "1");
            onParticleComplete();
          },
          onComplete: () => {
            onUnlock();
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
          <GateMeteorCanvas />
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
        <GateDroneBackground />
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
                      placeholder="一个特殊的日子"
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
