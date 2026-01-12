"use client";

import { memo, useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import "./gallery.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

const SCENES = [
  { img: "/her.png", svg: "/ref/her.svg", title: "初见", titleEn: "SERENDIPITY", poem: ["那一刻星辰坠入眼眸", "时间忘记了流动", "世界只剩下你的轮廓"], story: "相遇很奇妙，不常用抖音的我在某一个夜晚突然被一束光照亮，一切仿佛静止。", accent: "#ff74b7" },
  { img: "/her3.png", svg: "/ref/her3.svg", title: "心动", titleEn: "FLUTTER", poem: ["似被暖阳照射", "网络不再虚妄", "从此我敲出的0与1都有了意义"], story: "心动是什么感觉？我想是我压不住的嘴角，是想到你就觉得世界都变得柔软，是想在方方面面成为更好的人。", accent: "#e8a0bf" },
  { img: "/her4.png", svg: "/ref/her4.svg", title: "陪伴", titleEn: "INTIMACY", poem: ["掌间流出了浪漫", "浮萍有了归属", "心中多了想象和期待"], story: "这真的是一种奇怪的感觉，对于一向直来直去的我，无法清晰描述那种期待和悸动到底是一种什么感觉。", accent: "#d4a5c9" },
  { img: "/her5.png", svg: "/ref/her5.svg", title: "暖光", titleEn: "LIGHT", poem: ["你眼中有光柔和而明媚", "如晨曦初透", "温暖照耀未知世界"], story: "你眼里有光，这光只存于善良与清澈，未被尘世污浊之人眼中，我想要尽我一切，留住这份光。", accent: "#c9a0dc" },
  { img: "/her6.png", svg: "/ref/her6.svg", title: "勇气", titleEn: "BRAVE", poem: ["心动打破了长久的沉默", "炽热融化了尘封的冰川", "浪漫胜过了理智的计算"], story: "你曾说，把我的勇气留下，留给未来，但我觉得，计算不应该放在这里，你是所有的值得。", accent: "#b8a0e8" },
  { img: "/her7.png", svg: "/ref/her7.svg", title: "沉沦", titleEn: "INDULGE", poem: ["想尽一切能力", "让你永远做个小朋友", "被世界上的一切美好包围"], story: "把一切交予给你，想让你永远保持那份纯真的笑容，想让你永远可以做真实的自己。", accent: "#ffb3c6" },
  { img: "/her8.png", svg: "/ref/her8.svg", title: "誓言", titleEn: "VOW", poem: ["穷尽我脑海中的一切想象与美好", "兑换成你", "写进未来的每一页"], story: "现在不会说太动人的话，也没有太高的情商，只能在付诸行动的过程中，不断完善我的方方面面。", accent: "#ff8fab" },
  { img: "/her9.png", svg: "/ref/her9.svg", title: "永恒", titleEn: "ETERNITY", poem: ["未来漫长", "可否和你", "共赴光芒"], story: "未来的路还很长，但我想，美好的事情已经发生，带着滤镜，我想会更加简单快乐。", accent: "#ffc2d1" },
];

export default function GalleryPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [loveReady, setLoveReady] = useState(false);
  const currentIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const loveWrapperRef = useRef<HTMLDivElement | null>(null);
  const loveBtnRef = useRef<HTMLButtonElement | null>(null);
  const loveAnimPlayedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  useEffect(() => {
    if (currentIndex !== SCENES.length - 1) {
      setLoveReady(false);
      loveAnimPlayedRef.current = false;
      if (loveWrapperRef.current) {
        gsap.set(loveWrapperRef.current, { 
          visibility: "hidden", 
          opacity: 0 
        });
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!pageReady) return;
    if (!loveReady) return;
    if (showEnding) return;
    if (currentIndex !== SCENES.length - 1) return;
    if (loveAnimPlayedRef.current) return;

    const wrapper = loveWrapperRef.current;
    const btn = loveBtnRef.current;
    const tip = wrapper?.querySelector(".gallery-love-letter-tip") as HTMLElement;
    if (!wrapper || !btn) return;

    loveAnimPlayedRef.current = true;

    const trailCanvas = document.createElement("canvas");
    trailCanvas.className = "gallery-love-trail-canvas";
    trailCanvas.style.position = "fixed";
    trailCanvas.style.top = "0";
    trailCanvas.style.left = "0";
    trailCanvas.style.width = "100%";
    trailCanvas.style.height = "100%";
    trailCanvas.style.pointerEvents = "none";
    trailCanvas.style.zIndex = "59";
    document.body.appendChild(trailCanvas);

    const ctx = trailCanvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const startX = window.innerWidth * 1.5;
    const startY = -window.innerHeight * 0.3;
    const endX = window.innerWidth * 0.5;
    const endY = window.innerHeight * 0.5;

    gsap.set(wrapper, { 
      left: "150%",
      top: "-30%",
      xPercent: -50,
      yPercent: -50,
      scale: 0.3, 
      opacity: 0, 
      visibility: "visible",
      rotate: -25,
    });
    gsap.set(btn, { pointerEvents: "none", filter: "blur(8px)", scale: 0.5, opacity: 1 });
    gsap.set(tip, { opacity: 0, y: 20 });

    const particles: Array<{ x: number; y: number; life: number; size: number; vx: number; vy: number }> = [];
    let animId: number;
    let lastX = startX;
    let lastY = startY;

    const renderParticles = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life -= 0.025;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        const alpha = p.life * 0.9;
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        gradient.addColorStop(0, `rgba(255, 182, 193, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(255, 116, 183, ${alpha * 0.7})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(255, 182, 193, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const updateTrail = (x: number, y: number) => {
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 2) {
        const steps = Math.floor(dist / 3);
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          const px = lastX + dx * t;
          const py = lastY + dy * t;
          particles.push({ 
            x: px, 
            y: py, 
            life: 1, 
            size: 2 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
          });
        }
        lastX = x;
        lastY = y;
      }
      
      if (particles.length > 50) particles.shift();
      renderParticles();
    };

    const animateTrail = () => {
      renderParticles();
      animId = requestAnimationFrame(animateTrail);
    };
    animateTrail();

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          if (trailCanvas.parentNode) trailCanvas.parentNode.removeChild(trailCanvas);
          window.removeEventListener("resize", resize);
          if (animId) cancelAnimationFrame(animId);
        }, 500);
        
        gsap.set(wrapper, {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
          visibility: "visible",
        });
        
        gsap.set(btn, { pointerEvents: "auto" });
        
        setTimeout(() => {
          gsap.to(wrapper, {
            top: "calc(50% - 15px)",
            duration: 1.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }, 200);
      },
    });

    tl.to(wrapper, {
      left: "50%",
      top: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      rotate: 0,
      opacity: 1,
      visibility: "visible",
      duration: 2.8,
      ease: "power2.out",
      onUpdate: function() {
        const progress = this.progress();
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        updateTrail(currentX, currentY);
      },
    });

    tl.to(btn, {
      filter: "blur(0px)",
      scale: 1,
      duration: 1.5,
      ease: "power2.out",
    }, "-=1.5");

    tl.to(btn, {
      boxShadow: "0 10px 40px rgba(255, 116, 183, 0.3), 0 0 30px rgba(255, 182, 193, 0.25)",
      duration: 1.2,
      ease: "power2.out",
    }, "-=1.2");

    tl.to(btn, {
      rotate: 360,
      duration: 2.8,
      ease: "power2.out",
    }, 0);

    tl.to(tip, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }, "-=0.8");

    return () => {
      tl.kill();
      if (trailCanvas.parentNode) trailCanvas.parentNode.removeChild(trailCanvas);
      window.removeEventListener("resize", resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [pageReady, currentIndex, showEnding, loveReady]);

  const go = useCallback((dir: 1 | -1) => {
    if (!pageReady || isTransitioningRef.current || showEnding) return;
    const next = currentIndexRef.current + dir;
    if (next < 0 || next > SCENES.length - 1) {
      if (next === SCENES.length && currentIndexRef.current === SCENES.length - 1) {
        setShowEnding(true);
      }
      return;
    }
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex(next);
  }, [pageReady, showEnding]);

  useEffect(() => {
    if (!pageReady || showEnding) return;
    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 60,
      preventDefault: true,
      onDown: () => go(-1),
      onUp: () => go(1),
    });
    return () => obs.kill();
  }, [go, pageReady, showEnding]);

  useEffect(() => {
    if (!pageReady) return;
    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", " "].includes(e.key)) { e.preventDefault(); go(1); }
      else if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [go, pageReady]);

  const handleComplete = useCallback(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
  }, []);
  const scene = SCENES[currentIndex];
  const renderIndexes = [currentIndex - 1, currentIndex, currentIndex + 1].filter(i => i >= 0 && i < SCENES.length);

  return (
    <div className={`gallery-stage ${pageReady ? "ready" : ""}`} style={{ "--accent": scene.accent } as React.CSSProperties}>
      <div className="gallery-bg">
        <div className="gallery-gradient" />
        <MeteorCanvas />
        <div className="gallery-vignette" />
      </div>

      {!showEnding && renderIndexes.map((i) => (
        <Scene
          key={i}
          scene={SCENES[i]}
          index={i}
          currentIndex={currentIndex}
          onComplete={handleComplete}
          pageReady={pageReady}
          onLastComplete={i === SCENES.length - 1 ? () => setLoveReady(true) : undefined}
        />
      ))}

      <nav className="gallery-nav">
        <div className="gallery-nav-progress"><div className="gallery-nav-fill" style={{ width: `${((currentIndex + 1) / SCENES.length) * 100}%` }} /></div>
        <div className="gallery-nav-dots">{SCENES.map((s, i) => <div key={i} className={`gallery-nav-dot ${i === currentIndex ? "active" : ""}`}><span className="gallery-nav-label">{s.title}</span></div>)}</div>
      </nav>

      <footer className="gallery-footer">
        <button className="gallery-back-btn" onClick={() => window.location.href = "/"} title="返回">
          <span>←</span>
        </button>
        <div className="gallery-footer-center">
          <div className="gallery-footer-num"><span className="current">{String(currentIndex + 1).padStart(2, "0")}</span><span className="sep">/</span><span className="total">{String(SCENES.length).padStart(2, "0")}</span></div>
          <div className="gallery-footer-title">{scene.titleEn}</div>
          {currentIndex < SCENES.length - 1 && <div className="gallery-footer-hint">↓ scroll</div>}
        </div>
      </footer>

      {currentIndex === SCENES.length - 1 && !showEnding && (
        <div ref={loveWrapperRef} className="gallery-love-letter-wrapper">
          <button
            ref={loveBtnRef}
            className="gallery-love-letter-btn"
            onClick={() => setShowEnding(true)}
            title="打开书信"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <div className="gallery-love-letter-tip">给你的信</div>
        </div>
      )}

      {showEnding && <EndingPage lastScene={SCENES[SCENES.length - 1]} />}
    </div>
  );
}

// 流星特效Canvas - 完全独立运行，不受SVG绘制影响
function MeteorCanvas() {
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
    }> = [];
    
    const createMeteor = () => {
      const startX = Math.random() * canvas.width;
      const startY = -50;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 2.5 + Math.random() * 2.5;
      const length = 50 + Math.random() * 30;
      
      meteors.push({
        x: startX,
        y: startY,
        length,
        speed,
        angle
      });
    };
    
    let animId: number;
    
    // 使用独立的动画循环，不依赖帧率限制
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 流星生成
      if (Math.random() < 0.015 && meteors.length < 4) {
        createMeteor();
      }
      
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        const dx = Math.cos(meteor.angle) * meteor.speed;
        const dy = Math.sin(meteor.angle) * meteor.speed;
        
        meteor.x += dx;
        meteor.y += dy;
        
        ctx.save();
        const gradient = ctx.createLinearGradient(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length,
          meteor.x,
          meteor.y
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.4)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length);
        ctx.stroke();
        ctx.restore();
        
        if (meteor.y > canvas.height + 100 || meteor.x < -100 || meteor.x > canvas.width + 100) {
          meteors.splice(i, 1);
        }
      }
      
      animId = requestAnimationFrame(animate);
    };
    
    animId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="gallery-particles" />;
}

// 纯线条绘制的 SVG 组件 - 只显示描边，不显示填充
const PortraitSketch = memo(function PortraitSketch({ svgSrc, accent, isActive, onComplete }: { svgSrc: string; accent: string; isActive: boolean; onComplete?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animRef = useRef<gsap.core.Timeline | null>(null);
  const loadedRef = useRef(false);
  const svgContentRef = useRef<string | null>(null); // 缓存SVG内容

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 清理旧动画
    if (animRef.current) {
      animRef.current.kill();
      animRef.current = null;
    }

    if (isActive) {
      // 如果已经加载过，直接恢复显示
      if (loadedRef.current && svgContentRef.current) {
        // 重新插入缓存的SVG内容
        if (!container.querySelector("svg")) {
          container.innerHTML = svgContentRef.current;
          const svg = container.querySelector("svg");
          if (svg) {
            svgRef.current = svg;
            // 确保所有路径都是最终状态
            const paths = svg.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect");
            paths.forEach((path) => {
              const el = path as SVGGeometryElement;
              el.style.strokeDashoffset = "0";
              el.style.opacity = "1";
            });
          }
        }
        gsap.to(container, { opacity: 1, duration: 0.5 });
        if (onComplete) setTimeout(onComplete, 500);
        return;
      }
      
      // 首次加载SVG
      fetch(svgSrc)
        .then(res => res.text())
        .then(svgText => {
          if (!containerRef.current) return;
          
          // 缓存原始SVG内容
          svgContentRef.current = svgText;
          
          container.innerHTML = svgText;
          const svg = container.querySelector("svg");
          if (!svg) {
            if (onComplete) setTimeout(onComplete, 500);
            return;
          }
          
          svgRef.current = svg;
          svg.classList.add("gallery-sketch-svg");
          
          const originalWidth = svg.getAttribute("width");
          const originalHeight = svg.getAttribute("height");
          
          if (!svg.hasAttribute("viewBox")) {
            let width = originalWidth ? parseFloat(originalWidth.replace(/px|pt|em|rem/, '')) : 800;
            let height = originalHeight ? parseFloat(originalHeight.replace(/px|pt|em|rem/, '')) : 1344;
            if (!width || !height) {
              const rect = svg.getBoundingClientRect();
              width = width || rect.width || 800;
              height = height || rect.height || 1344;
            }
            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
          }
          
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
          
          // 获取所有路径元素
          const paths = svg.querySelectorAll("path, line, polyline, polygon, circle, ellipse, rect");
          
          if (paths.length === 0) {
            loadedRef.current = true;
            gsap.to(container, { opacity: 1, duration: 0.5 });
            if (onComplete) setTimeout(onComplete, 500);
            return;
          }

          // 只保留有描边的路径，移除所有填充
          const validPaths: SVGGeometryElement[] = [];
          paths.forEach((path) => {
            const el = path as SVGGeometryElement;
            const computedStyle = window.getComputedStyle(el);
            const stroke = computedStyle.stroke;
            const strokeWidth = parseFloat(computedStyle.strokeWidth) || 0;
            
            // 移除所有填充，只保留描边
            el.setAttribute("fill", "none");
            el.style.fill = "none";
            
            // 如果没有描边，添加一个基于accent颜色的描边
            if (!stroke || stroke === "none" || strokeWidth === 0) {
              el.setAttribute("stroke", accent);
              el.setAttribute("stroke-width", "1");
            }
            
            // 设置描边颜色为accent色
            el.style.stroke = accent;
            el.style.filter = `drop-shadow(0 0 6px ${accent})`;
            
            // 设置描边动画
            try {
              const length = el.getTotalLength?.() || 1000;
              el.style.strokeDasharray = `${length}`;
              el.style.strokeDashoffset = `${length}`;
            } catch {
              // 某些元素可能不支持 getTotalLength
            }
            
            gsap.set(el, { opacity: 0 });
            validPaths.push(el);
          });

          gsap.set(container, { opacity: 1 });

          // 按Y坐标排序，从上到下绘制
          validPaths.sort((a, b) => {
            try {
              const aBox = a.getBBox();
              const bBox = b.getBBox();
              return (aBox.y + aBox.height / 2) - (bBox.y + bBox.height / 2);
            } catch {
              return 0;
            }
          });
          
          const batchSize = Math.max(1, Math.floor(validPaths.length / 8));
          
          const tl = gsap.timeline({
            onComplete: () => {
              loadedRef.current = true;
              // 更新缓存的SVG内容为最终状态
              if (svgRef.current) {
                svgContentRef.current = container.innerHTML;
              }
              if (onComplete) setTimeout(onComplete, 100);
            }
          });
          animRef.current = tl;
          
          // 线条绘制动画
          validPaths.forEach((el, i) => {
            const batchIndex = Math.floor(i / batchSize);
            const delay = batchIndex * 0.08 + (i % batchSize) * 0.01;
            
            // 先显示元素，然后绘制线条
            tl.to(el, { 
              opacity: 1,
              duration: 0.3,
              ease: "power2.out"
            }, delay);
            
            tl.to(el, { 
              strokeDashoffset: 0, 
              duration: 1.2 + (i % 3) * 0.2, 
              ease: "power2.inOut"
            }, delay);
          });

          // 整体发光效果
          gsap.set(svg, { scale: 0.98 });
          tl.to(svg, {
            filter: `drop-shadow(0 0 15px ${accent})`,
            scale: 1,
            duration: 0.8,
            ease: "power2.out"
          }, "-=0.5");

        })
        .catch(err => {
          console.error("Failed to load SVG:", err);
          if (onComplete) onComplete();
        });

    } else {
      // 非激活状态：淡出
      gsap.to(container, { opacity: 0, duration: 0.2 });
    }

    return () => {
      if (animRef.current) {
        animRef.current.kill();
        animRef.current = null;
      }
    };
  }, [isActive, svgSrc, accent, onComplete]);

  return <div ref={containerRef} className="gallery-sketch-container" />;
});

// 照片组件
function PhotoWithGlow({ src, accent }: { src: string; accent: string }) {
  return (
    <div className="gallery-photo-container">
      <img src={src} alt="" className="gallery-photo" />
      <div className="gallery-photo-glow" style={{ background: `radial-gradient(ellipse, ${accent}30 0%, transparent 70%)` }} />
    </div>
  );
}

// 场景组件
function Scene({ scene, index, currentIndex, onComplete, pageReady, onLastComplete }: {
  scene: (typeof SCENES)[0]; index: number; currentIndex: number; onComplete: () => void; pageReady: boolean; onLastComplete?: () => void;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const textStartedRef = useRef(false);

  const isActive = index === currentIndex;

  const handleSketchComplete = useCallback(() => {
    if (!contentAreaRef.current || textStartedRef.current) return;
    textStartedRef.current = true;
    
    // 移除自动触发书信的逻辑，改为用户手动滚动触发

    const titleEn = contentAreaRef.current.querySelector(".gallery-title-en");
    const titleCn = contentAreaRef.current.querySelector(".gallery-title-cn");
    const titleLine = contentAreaRef.current.querySelector(".gallery-title-line");
    const poemLines = contentAreaRef.current.querySelectorAll(".gallery-poem-line");
    const storyBlock = contentAreaRef.current.querySelector(".gallery-story-block");

    const textTl = gsap.timeline();

    if (titleEn) {
      gsap.set(titleEn, { scale: 0.9, rotationX: -15 });
      textTl.to(titleEn, { 
        x: 0, 
        opacity: 1,
        scale: 1,
        rotationX: 0,
        duration: 1.2, 
        ease: "back.out(1.2)" 
      }, 0);
    }
    
    if (titleCn) {
      gsap.set(titleCn, { scale: 0.92 });
      textTl.to(titleCn, { 
        y: 0, 
        opacity: 1,
        scale: 1,
        duration: 1.3, 
        ease: "elastic.out(1, 0.5)" 
      }, 0.2);
    }
    
    if (titleLine) {
      textTl.to(titleLine, { 
        scaleX: 1, 
        duration: 1.2, 
        ease: "power3.inOut" 
      }, 0.5);
    }
    
    if (poemLines?.length) {
      poemLines.forEach((line, i) => {
        gsap.set(line, { x: -20 * (i % 2 === 0 ? 1 : -1), scale: 0.95 });
      });
      textTl.to(poemLines, { 
        opacity: 1, 
        y: 0,
        x: 0,
        scale: 1,
        duration: 1.1, 
        stagger: {
          amount: 0.6,
          from: "start",
          ease: "power2.inOut"
        },
        ease: "back.out(1.1)" 
      }, 0.7);
    }
    
    if (storyBlock) {
      gsap.set(storyBlock, { scale: 0.96, rotationY: 5 });
      textTl.to(storyBlock, { 
        opacity: 1, 
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 1.4, 
        ease: "power2.out" 
      }, 1.2);
    }

    if (onLastComplete) {
      textTl.eventCallback("onComplete", () => {
        onLastComplete();
      });
    }
  }, [onLastComplete]);

  useEffect(() => {
    if (!sceneRef.current || !pageReady) return;
    tlRef.current?.kill();
    gsap.killTweensOf([photoWrapperRef.current, contentAreaRef.current]);
    textStartedRef.current = false;

    if (isActive) {
      gsap.set(sceneRef.current, { visibility: "visible", zIndex: 10 });
      gsap.set([photoWrapperRef.current, contentAreaRef.current], { opacity: 1, clearProps: "filter" });
      gsap.set(photoWrapperRef.current, { y: 0 });
      const tl = gsap.timeline({ onComplete });
      tlRef.current = tl;

      tl.fromTo(photoWrapperRef.current,
        { scale: 0.96, opacity: 0, y: 18 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        0
      );

      const delayText = typeof window !== "undefined" && !window.matchMedia("(max-width: 1200px)").matches;
      if (contentAreaRef.current) {
        const titleEn = contentAreaRef.current.querySelector(".gallery-title-en");
        const titleCn = contentAreaRef.current.querySelector(".gallery-title-cn");
        const titleLine = contentAreaRef.current.querySelector(".gallery-title-line");
        const poemLines = contentAreaRef.current.querySelectorAll(".gallery-poem-line");
        const storyBlock = contentAreaRef.current.querySelector(".gallery-story-block");

        if (titleEn) gsap.set(titleEn, { x: -30, opacity: 0, scale: 0.9, rotationX: -15 });
        if (titleCn) gsap.set(titleCn, { y: 20, opacity: 0, scale: 0.92 });
        if (titleLine) gsap.set(titleLine, { scaleX: 0, transformOrigin: "left" });
        if (poemLines?.length) {
          poemLines.forEach((line: Element, i: number) => {
            gsap.set(line, { opacity: 0, y: 15, x: -20 * (i % 2 === 0 ? 1 : -1), scale: 0.95 });
          });
        }
        if (storyBlock) gsap.set(storyBlock, { opacity: 0, y: 10, scale: 0.96, rotationY: 5 });

        if (!delayText) {
          if (titleEn) tl.to(titleEn, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.2);
          if (titleCn) tl.to(titleCn, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.3);
          if (titleLine) tl.to(titleLine, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.5);
          if (poemLines?.length) tl.to(poemLines, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 0.6);
          if (storyBlock) tl.to(storyBlock, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.9);
        }
      }

      gsap.to(photoWrapperRef.current, { y: 6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });

    } else {
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to([photoWrapperRef.current, contentAreaRef.current], {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      }, 0);

      tl.set(sceneRef.current, { visibility: "hidden", zIndex: 0 });
    }

    return () => { tlRef.current?.kill(); gsap.killTweensOf([photoWrapperRef.current, contentAreaRef.current]); };
  }, [isActive, onComplete, pageReady]);

  return (
    <div ref={sceneRef} className="gallery-scene" style={{ visibility: isActive ? "visible" : "hidden" }}>
      <div className="gallery-photo-area">
        <div ref={photoWrapperRef} className="gallery-photo-wrapper">
          <PhotoWithGlow src={scene.img} accent={scene.accent} />
        </div>
      </div>

      <div ref={contentAreaRef} className="gallery-content-area">
        <div className="gallery-title-block">
          <span className="gallery-title-en">{scene.titleEn}</span>
          <h2 className="gallery-title-cn">{scene.title}</h2>
          <div className="gallery-title-line" />
        </div>
        <div className="gallery-poem-block">
          {scene.poem.map((line, i) => (
            <div key={i} className="gallery-poem-line">
              <span className="gallery-poem-marker">—</span>
              <span className="gallery-poem-text">{line}</span>
            </div>
          ))}
        </div>
        <div className="gallery-story-block">
          <p>{scene.story}</p>
        </div>
      </div>

      <div className="gallery-svg-area">
        <PortraitSketch svgSrc={scene.svg} accent={scene.accent} isActive={isActive} onComplete={handleSketchComplete} />
      </div>
    </div>
  );
}

// 浪漫装饰元素组件
function RomanticDecorations() {
  const leftDecorRef = useRef<HTMLDivElement>(null);
  const rightDecorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftDecor = leftDecorRef.current;
    const rightDecor = rightDecorRef.current;
    if (!leftDecor || !rightDecor) return;

    // 左侧飘落的花瓣/爱心
    const createFallingElement = (side: 'left' | 'right') => {
      const container = side === 'left' ? leftDecor : rightDecor;
      const element = document.createElement('div');
      element.className = `romantic-${side}-element`;
      
      const types = ['heart', 'petal', 'star'];
      const type = types[Math.floor(Math.random() * types.length)];
      element.setAttribute('data-type', type);
      
      // 计算信件中心位置和宽度（假设信件最大宽度650px）
      const letterCenterX = window.innerWidth / 2;
      const letterWidth = 650;
      const letterLeft = letterCenterX - letterWidth / 2;
      const letterRight = letterCenterX + letterWidth / 2;
      
      let startX: number;
      let endX: number;
      
      if (side === 'left') {
        // 左侧：从屏幕左边缘到信件左边缘附近
        const leftArea = letterLeft - 100;
        startX = Math.random() * Math.max(leftArea, 400);
        endX = startX + (Math.random() - 0.5) * 150;
      } else {
        // 右侧：从信件右边缘附近到屏幕右边缘
        const rightAreaStart = letterRight + 50;
        const rightAreaWidth = window.innerWidth - rightAreaStart;
        startX = rightAreaStart + Math.random() * Math.max(rightAreaWidth, 400);
        endX = startX + (Math.random() - 0.5) * 150;
      }
      
      gsap.set(element, {
        x: startX,
        y: -50,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.7,
        opacity: 0.7 + Math.random() * 0.3
      });
      
      container.appendChild(element);
      
      const duration = 8 + Math.random() * 6;
      const delay = Math.random() * 2;
      
      gsap.to(element, {
        x: endX,
        y: window.innerHeight + 100,
        rotation: Math.random() * 720,
        duration: duration,
        delay: delay,
        ease: "none",
        onComplete: () => element.remove()
      });
    };

    // 右侧闪烁的星星
    const createTwinklingStar = () => {
      const star = document.createElement('div');
      star.className = 'romantic-right-star';
      
      // 计算信件右侧区域
      const letterCenterX = window.innerWidth / 2;
      const letterWidth = 650;
      const letterRight = letterCenterX + letterWidth / 2;
      const rightAreaStart = letterRight + 50;
      const rightAreaWidth = window.innerWidth - rightAreaStart;
      
      const x = rightAreaStart + Math.random() * Math.max(rightAreaWidth, 300);
      const y = Math.random() * window.innerHeight;
      
      gsap.set(star, {
        x: x,
        y: y,
        scale: 0,
        opacity: 0
      });
      
      rightDecor.appendChild(star);
      
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      tl.to(star, {
        scale: 0.8 + Math.random() * 0.4,
        opacity: 0.6 + Math.random() * 0.3,
        duration: 1.5 + Math.random(),
        ease: "sine.inOut"
      });
      
      setTimeout(() => {
        gsap.to(star, {
          opacity: 0,
          scale: 0,
          duration: 1,
          onComplete: () => star.remove()
        });
      }, 8000 + Math.random() * 4000);
    };

    // 左侧浮动光点
    const createFloatingLight = () => {
      const light = document.createElement('div');
      light.className = 'romantic-floating-light';
      
      // 计算信件左侧区域
      const letterCenterX = window.innerWidth / 2;
      const letterWidth = 650;
      const letterLeft = letterCenterX - letterWidth / 2;
      const leftArea = letterLeft - 100;
      
      const x = Math.random() * Math.max(leftArea, 400);
      const startY = Math.random() * window.innerHeight;
      const endY = startY - 100 - Math.random() * 200;
      
      gsap.set(light, {
        x: x,
        y: startY,
        scale: 0,
        opacity: 0
      });
      
      leftDecor.appendChild(light);
      
      gsap.to(light, {
        y: endY,
        scale: 0.5 + Math.random() * 0.5,
        opacity: 0.4 + Math.random() * 0.3,
        duration: 4 + Math.random() * 3,
        ease: "sine.inOut",
        onComplete: () => {
          gsap.to(light, {
            opacity: 0,
            scale: 0,
            duration: 1,
            onComplete: () => light.remove()
          });
        }
      });
    };

    // 右侧爱心粒子
    const createHeartParticle = () => {
      const heart = document.createElement('div');
      heart.className = 'romantic-heart-particle';
      heart.textContent = '♥';
      
      // 计算信件右侧区域
      const letterCenterX = window.innerWidth / 2;
      const letterWidth = 650;
      const letterRight = letterCenterX + letterWidth / 2;
      const rightAreaStart = letterRight + 50;
      const rightAreaWidth = window.innerWidth - rightAreaStart;
      
      const x = rightAreaStart + Math.random() * Math.max(rightAreaWidth, 300);
      const startY = window.innerHeight + 20;
      const endY = -50;
      
      gsap.set(heart, {
        x: x,
        y: startY,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.6,
        opacity: 0.8 + Math.random() * 0.2
      });
      
      rightDecor.appendChild(heart);
      
      gsap.to(heart, {
        y: endY,
        x: x + (Math.random() - 0.5) * 100,
        rotation: Math.random() * 720,
        duration: 8 + Math.random() * 4,
        ease: "none",
        onComplete: () => heart.remove()
      });
    };

    // 持续创建元素
    const leftInterval = setInterval(() => {
      if (leftDecor.querySelectorAll('.romantic-left-element').length < 15) {
        createFallingElement('left');
      }
    }, 800);

    const rightStarInterval = setInterval(() => {
      if (rightDecor.querySelectorAll('.romantic-right-star').length < 12) {
        createTwinklingStar();
      }
    }, 1500);

    const rightFallingInterval = setInterval(() => {
      if (rightDecor.querySelectorAll('.romantic-right-element').length < 15) {
        createFallingElement('right');
      }
    }, 800);

    const leftLightInterval = setInterval(() => {
      if (leftDecor.querySelectorAll('.romantic-floating-light').length < 5) {
        createFloatingLight();
      }
    }, 2500);

    const rightHeartInterval = setInterval(() => {
      if (rightDecor.querySelectorAll('.romantic-heart-particle').length < 10) {
        createHeartParticle();
      }
    }, 1500);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightStarInterval);
      clearInterval(rightFallingInterval);
      clearInterval(leftLightInterval);
      clearInterval(rightHeartInterval);
    };
  }, []);

  return (
    <>
      <div ref={leftDecorRef} className="romantic-decorations romantic-decorations-left" />
      <div ref={rightDecorRef} className="romantic-decorations romantic-decorations-right" />
    </>
  );
}

// 结束页面组件
function EndingPage({ lastScene }: { lastScene: (typeof SCENES)[0] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const letter = letterRef.current;
    if (!container || !canvas || !letter) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // 书信动画
    gsap.set(letter, { opacity: 0, scale: 0.9, y: 40 });
    
    // 存储原始文本并清空
    const textBlocks = letter.querySelectorAll(".gallery-ending-text p");
    const originalTexts: string[] = [];
    textBlocks.forEach((block) => {
      originalTexts.push(block.textContent || "");
      block.textContent = "";
      gsap.set(block, { opacity: 0 });
    });
    
    gsap.to(letter, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      delay: 0.6,
      onComplete: () => {
        // 逐段逐字打字机效果
        let currentBlockIndex = 0;
        
        const typeNextBlock = () => {
          if (currentBlockIndex >= textBlocks.length) return;
          
          const block = textBlocks[currentBlockIndex];
          const originalText = originalTexts[currentBlockIndex];
          if (!originalText) {
            currentBlockIndex++;
            typeNextBlock();
            return;
          }
          
          gsap.set(block, { opacity: 1 });
          
          let charIndex = 0;
          const typeInterval = setInterval(() => {
            if (charIndex < originalText.length) {
              block.textContent = originalText.substring(0, charIndex + 1);
              charIndex++;
            } else {
              clearInterval(typeInterval);
              currentBlockIndex++;
              // 段落之间稍作停顿
              setTimeout(typeNextBlock, 300);
            }
          }, 45);
        };
        
        typeNextBlock();
      }
    });
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    
    // 流星系统
    const meteors: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
    }> = [];
    
    const createMeteor = () => {
      if (meteors.length < 5) {
        meteors.push({
          x: Math.random() * canvas.width,
          y: -50,
          length: 50 + Math.random() * 40,
          speed: 3 + Math.random() * 3,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
        });
      }
    };
    
    // 烟花粒子系统
    const fireworks: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      trail: Array<{ x: number; y: number; opacity: number }>;
      targetY: number;
      exploded: boolean;
    }> = [];
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
      decay: number;
    }> = [];
    
    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const targetY = canvas.height * 0.15 + Math.random() * canvas.height * 0.3;
      const colors = ["#ff74b7", "#ffa8d5", "#ffb6c1", "#ffc0e3", "#ffffff", "#ff9ed2"];
      
      if (fireworks.length < 6) {
        fireworks.push({
          x,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -18 - Math.random() * 4,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: [],
          targetY,
          exploded: false
        });
      }
    };
    
    const explodeFirework = (firework: typeof fireworks[0]) => {
      const colors = ["#ff74b7", "#ffa8d5", "#ffb6c1", "#ffc0e3", "#ffffff", "#ff9ed2", "#ffc0cb"];
      const particleCount = 80 + Math.floor(Math.random() * 40);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
        const speed = 4 + Math.random() * 8;
        const size = 2 + Math.random() * 3;
        
        particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size,
          decay: 0.012 + Math.random() * 0.008
        });
      }
    };
    
    let animId: number;
    let lastTime = performance.now();
    let fireworkTimer = 0;
    let meteorTimer = 0;
    
    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 流星生成
      meteorTimer += delta;
      if (meteorTimer > 400 + Math.random() * 600) {
        meteorTimer = 0;
        createMeteor();
      }
      
      // 绘制流星
      for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i];
        const dx = Math.cos(meteor.angle) * meteor.speed;
        const dy = Math.sin(meteor.angle) * meteor.speed;
        
        meteor.x += dx;
        meteor.y += dy;
        
        ctx.save();
        const gradient = ctx.createLinearGradient(
          meteor.x - Math.cos(meteor.angle) * meteor.length,
          meteor.y - Math.sin(meteor.angle) * meteor.length,
          meteor.x,
          meteor.y
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.7, "rgba(255, 255, 255, 0.4)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.8)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
        
        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length);
        ctx.stroke();
        ctx.restore();
        
        if (meteor.y > canvas.height + 100 || meteor.x < -100 || meteor.x > canvas.width + 100) {
          meteors.splice(i, 1);
        }
      }
      
      // 烟花生成
      fireworkTimer += delta;
      if (fireworkTimer > 800 + Math.random() * 1200) {
        fireworkTimer = 0;
        createFirework();
      }
      
      // 更新烟花
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        if (fw.exploded) continue;
        
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.vy += 0.25;
        
        fw.trail.push({ x: fw.x, y: fw.y, opacity: 1 });
        if (fw.trail.length > 20) fw.trail.shift();
        
        ctx.save();
        ctx.strokeStyle = fw.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.shadowColor = fw.color;
        
        for (let j = 0; j < fw.trail.length - 1; j++) {
          const p1 = fw.trail[j];
          const p2 = fw.trail[j + 1];
          ctx.globalAlpha = (j / fw.trail.length) * 0.8;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.restore();
        
        if (fw.y <= fw.targetY || fw.vy >= 0) {
          fw.exploded = true;
          explodeFirework(fw);
          fireworks.splice(i, 1);
        }
      }
      
      // 更新爆炸粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.98;
        p.life -= p.decay;
        
        if (p.life <= 0 || p.y > canvas.height + 50) {
          particles.splice(i, 1);
          continue;
        }
        
        ctx.save();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.6, p.color + "80");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      
      animId = requestAnimationFrame(animate);
    };
    
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="gallery-ending-page">
      <canvas ref={canvasRef} className="gallery-ending-canvas" />
      <button className="gallery-ending-back-btn" onClick={() => window.location.href = "/"} title="返回">
        <span>←</span>
      </button>
      <RomanticDecorations />
      <div className="gallery-ending-content">
        <div ref={letterRef} className="gallery-ending-letter">
          <h2 className="gallery-ending-title">致优优</h2>
          <div className="gallery-ending-text">
            <p>亲爱的优优，</p>
            <p>写下这些字的时候，我的心情就像此刻窗外的夜空一样，既深邃又明亮。想说的话有很多，但真正落笔时，又觉得任何语言都显得苍白。</p>
            <p>从第一次在屏幕上看到你，到现在的每一天，你都在我生命里留下了不可磨灭的印记。那些看似平凡的瞬间，在我这里都变成了珍贵的回忆。</p>
            <p>你的笑容是我见过最美的风景，你的声音是我听过最动听的旋律。每一次和你聊天，我都能感受到那份难得的温暖和真实。</p>
            <p>我知道自己还有很多不足，但我会努力变得更好。我想成为那个能让你安心的人，想成为那个能陪你走过每一个春夏秋冬的人。</p>
            <p>未来的路还很长，但我希望每一步都能和你一起走。无论是阳光明媚的日子，还是风雨交加的时刻，我都想陪在你身边。</p>
            <p>这不仅仅是一封信，更是我想对你说的所有话的集合。也许文字有限，但我的心意是无限的。</p>
            <p>谢谢你出现在我的生命里，谢谢你带来的所有美好。</p>
            <p>愿我们都能成为更好的自己，愿我们的故事能够继续写下去。</p>
            <p className="gallery-ending-signature">—— 永远爱你的我</p>
          </div>
        </div>
      </div>
    </div>
  );
}
