"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import "./v2.css";

// 注册GSAP插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

// 场景数据
const SCENES = [
  {
    img: "/her.png",
    svg: "/ref/her.svg",
    title: "初见",
    titleEn: "SERENDIPITY",
    poem: ["那一刻星辰坠入眼眸", "时间忘记了流动", "世界只剩下你的轮廓"],
    story: "有些相遇，是命运在人海中精心安排的奇迹。当我第一次看见你，仿佛整个宇宙都在那一瞬间静止，只为让我记住你的模样。",
    color: "#ff74b7",
  },
  {
    img: "/her3.png",
    svg: "/ref/her3.svg",
    title: "心动",
    titleEn: "FLUTTER",
    poem: ["风很温柔", "像你第一次叫我的名字", "从此我的名字有了意义"],
    story: "心动是什么感觉？是听到你的声音会不自觉微笑，是想到你就觉得世界都变得柔软，是愿意为你变成更好的人。",
    color: "#ffa8d5",
  },
  {
    img: "/her4.png",
    svg: "/ref/her4.svg",
    title: "陪伴",
    titleEn: "INTIMACY",
    poem: ["路灯学会了浪漫", "只照亮你走过的路", "我学会了等待"],
    story: "最好的爱情不是轰轰烈烈，而是细水长流的陪伴。每一个平凡的日子，因为有你，都变成了值得珍藏的回忆。",
    color: "#e8a0bf",
  },
  {
    img: "/her5.png",
    svg: "/ref/her5.svg",
    title: "默契",
    titleEn: "COMPANIONSHIP",
    poem: ["时间煮雨", "我们煮茶", "岁月在杯中生香"],
    story: "不用言语，一个眼神就能懂得彼此。这种默契，是我们用无数个日夜培养出的专属语言。",
    color: "#d4a5c9",
  },
  {
    img: "/her6.png",
    svg: "/ref/her6.svg",
    title: "信任",
    titleEn: "TACIT",
    poem: ["不用回头", "我知道你一直在身后", "这是最安心的距离"],
    story: "信任是爱情最珍贵的礼物。因为相信你，我可以勇敢地向前走，因为我知道，无论发生什么，你都会在那里。",
    color: "#c9a0dc",
  },
  {
    img: "/her7.png",
    svg: "/ref/her7.svg",
    title: "宠溺",
    titleEn: "INDULGE",
    poem: ["我的超能力", "是让你永远做个孩子", "被世界温柔以待"],
    story: "想把所有的温柔都给你，想让你永远保持那份纯真的笑容。在我这里，你可以任性，可以撒娇，可以做最真实的自己。",
    color: "#ffb3c6",
  },
  {
    img: "/her8.png",
    svg: "/ref/her8.svg",
    title: "誓言",
    titleEn: "VOW",
    poem: ["想把所有美好的词", "都兑换成你", "写进余生的每一页"],
    story: "我不会说太多华丽的情话，但我想用一生的时间，把每一个承诺都变成现实。你值得世间所有的美好。",
    color: "#ff8fab",
  },
  {
    img: "/her9.png",
    svg: "/ref/her9.svg",
    title: "永恒",
    titleEn: "ETERNITY",
    poem: ["这一生很长", "好在有你", "闪闪发光"],
    story: "未来的路还很长，但只要牵着你的手，每一步都是风景。感谢命运让我遇见你，让我的生命从此有了光。",
    color: "#ffc2d1",
  },
];

export default function GalleryV2Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 预加载图片
  useEffect(() => {
    const preloadImages = async () => {
      const promises = SCENES.map((scene) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = scene.img;
        });
      });
      await Promise.all(promises);
      setIsLoaded(true);
    };
    preloadImages();
  }, []);

  // 入场动画
  useEffect(() => {
    if (!isLoaded) return;

    const tl = gsap.timeline();
    tl.fromTo(
      ".gallery-v2-stage",
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, [isLoaded]);

  // 滚动控制
  useEffect(() => {
    if (!isLoaded) return;

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 80,
      preventDefault: true,
      onDown: () => {
        if (!isTransitioning && currentIndex < SCENES.length - 1) {
          setIsTransitioning(true);
          setCurrentIndex((i) => i + 1);
        }
      },
      onUp: () => {
        if (!isTransitioning && currentIndex > 0) {
          setIsTransitioning(true);
          setCurrentIndex((i) => i - 1);
        }
      },
    });

    return () => obs.kill();
  }, [currentIndex, isTransitioning, isLoaded]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning || !isLoaded) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (currentIndex < SCENES.length - 1) {
          setIsTransitioning(true);
          setCurrentIndex((i) => i + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentIndex > 0) {
          setIsTransitioning(true);
          setCurrentIndex((i) => i - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isTransitioning, isLoaded]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  const currentScene = SCENES[currentIndex];

  return (
    <div
      ref={containerRef}
      className="gallery-v2-stage"
      style={{
        "--accent-color": currentScene.color,
      } as React.CSSProperties}
    >
      {/* 动态背景 */}
      <DynamicBackground currentIndex={currentIndex} scenes={SCENES} />

      {/* 场景 */}
      {SCENES.map((scene, index) => (
        <SceneV2
          key={index}
          scene={scene}
          index={index}
          currentIndex={currentIndex}
          onTransitionEnd={handleTransitionEnd}
        />
      ))}

      {/* 侧边导航 */}
      <SideNavigation
        current={currentIndex}
        total={SCENES.length}
        scenes={SCENES}
        onNavigate={(index) => {
          if (!isTransitioning && index !== currentIndex) {
            setIsTransitioning(true);
            setCurrentIndex(index);
          }
        }}
      />

      {/* 底部信息 */}
      <BottomInfo scene={currentScene} index={currentIndex} />

      {/* 滚动提示 */}
      <ScrollHint visible={currentIndex === 0} />
    </div>
  );
}

// 加载屏幕
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-heart">♥</div>
        <div className="loading-text">为你准备中...</div>
        <div className="loading-bar">
          <div className="loading-fill" />
        </div>
      </div>
    </div>
  );
}

// 动态背景
function DynamicBackground({
  currentIndex,
  scenes,
}: {
  currentIndex: number;
  scenes: typeof SCENES;
}) {
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

    // 粒子系统
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      phase: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const color = scenes[currentIndex].color;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.speed;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const twinkle = 0.5 + 0.5 * Math.sin(p.phase);

        ctx.save();
        ctx.globalAlpha = p.opacity * twinkle;
        ctx.fillStyle = color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [currentIndex, scenes]);

  return (
    <>
      <div className="v2-gradient-bg" />
      <canvas ref={canvasRef} className="v2-particles-canvas" />
      <div className="v2-noise-overlay" />
    </>
  );
}

// 场景组件V2
function SceneV2({
  scene,
  index,
  currentIndex,
  onTransitionEnd,
}: {
  scene: (typeof SCENES)[0];
  index: number;
  currentIndex: number;
  onTransitionEnd: () => void;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const photoWrapperRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<HTMLDivElement>(null);
  const titleCnRef = useRef<HTMLHeadingElement>(null);
  const titleEnRef = useRef<HTMLSpanElement>(null);
  const poemContainerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<SVGSVGElement>(null);

  const isActive = index === currentIndex;
  const direction = index > currentIndex ? 1 : -1;

  useEffect(() => {
    if (!sceneRef.current) return;

    const ctx = gsap.context(() => {
      if (isActive) {
        // 显示场景
        gsap.set(sceneRef.current, { visibility: "visible", zIndex: 10 });

        const tl = gsap.timeline({
          onComplete: onTransitionEnd,
        });

        // 照片入场 - 电影级缩放
        tl.fromTo(
          photoWrapperRef.current,
          {
            scale: 1.4,
            opacity: 0,
            filter: "blur(30px) saturate(0)",
            rotateY: direction * 15,
          },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px) saturate(1)",
            rotateY: 0,
            duration: 2,
            ease: "power3.out",
          }
        );

        // SVG线条闪现
        tl.fromTo(
          svgOverlayRef.current,
          { opacity: 0, scale: 1.2 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power4.out",
          },
          "-=1.5"
        );

        tl.to(
          svgOverlayRef.current,
          {
            opacity: 0.4,
            duration: 1,
            ease: "power2.out",
          },
          "-=1"
        );

        // 装饰SVG描边动画
        const decorPaths = decorRef.current?.querySelectorAll("path, circle, line");
        if (decorPaths) {
          tl.fromTo(
            decorPaths,
            { strokeDashoffset: 1000, opacity: 0 },
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 1.5,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=1.5"
          );
        }

        // 英文标题 - 字母逐个出现
        tl.fromTo(
          titleEnRef.current,
          {
            opacity: 0,
            letterSpacing: "1em",
            y: 30,
          },
          {
            opacity: 1,
            letterSpacing: "0.5em",
            y: 0,
            duration: 1.2,
            ease: "power4.out",
          },
          "-=1.2"
        );

        // 中文标题 - 放大淡入
        tl.fromTo(
          titleCnRef.current,
          {
            scale: 0.5,
            opacity: 0,
            y: 50,
          },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.5)",
          },
          "-=0.8"
        );

        // 诗句 - 打字机效果
        const poemLines = poemContainerRef.current?.querySelectorAll(".v2-poem-line");
        if (poemLines) {
          tl.fromTo(
            poemLines,
            {
              clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
              opacity: 0,
            },
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              opacity: 1,
              duration: 0.8,
              stagger: 0.3,
              ease: "power2.out",
            },
            "-=0.5"
          );
        }

        // 故事文字
        tl.fromTo(
          storyRef.current,
          {
            y: 40,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6"
        );

        // 持续动画
        gsap.to(photoWrapperRef.current, {
          y: 15,
          duration: 5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to(svgOverlayRef.current, {
          opacity: 0.2,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      } else {
        // 隐藏场景
        const tl = gsap.timeline();

        tl.to(
          [photoWrapperRef.current, svgOverlayRef.current],
          {
            scale: 0.8,
            opacity: 0,
            filter: "blur(20px)",
            duration: 0.6,
            ease: "power2.in",
          },
          0
        );

        tl.to(
          [titleCnRef.current, titleEnRef.current, poemContainerRef.current, storyRef.current],
          {
            opacity: 0,
            y: direction * -30,
            duration: 0.4,
            ease: "power2.in",
          },
          0
        );

        tl.set(sceneRef.current, { visibility: "hidden", zIndex: 0 });
      }
    }, sceneRef);

    return () => ctx.revert();
  }, [isActive, direction, onTransitionEnd]);

  return (
    <div
      ref={sceneRef}
      className="v2-scene"
      style={{ visibility: isActive ? "visible" : "hidden" }}
    >
      {/* 左侧 - 视觉区域 */}
      <div className="v2-visual-area">
        {/* 装饰SVG */}
        <svg ref={decorRef} className="v2-decor-svg" viewBox="0 0 600 800">
          <defs>
            <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={scene.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* 装饰圆环 */}
          <circle
            cx="300"
            cy="400"
            r="280"
            fill="none"
            stroke={`url(#grad-${index})`}
            strokeWidth="0.5"
            strokeDasharray="1000"
            opacity="0.3"
          />
          <circle
            cx="300"
            cy="400"
            r="320"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            strokeDasharray="5,10"
          />
          {/* 角落装饰 */}
          <path
            d="M 50 100 L 50 50 L 100 50"
            fill="none"
            stroke={scene.color}
            strokeWidth="1"
            strokeDasharray="1000"
            opacity="0.6"
          />
          <path
            d="M 500 50 L 550 50 L 550 100"
            fill="none"
            stroke={scene.color}
            strokeWidth="1"
            strokeDasharray="1000"
            opacity="0.6"
          />
          <path
            d="M 550 700 L 550 750 L 500 750"
            fill="none"
            stroke={scene.color}
            strokeWidth="1"
            strokeDasharray="1000"
            opacity="0.6"
          />
          <path
            d="M 100 750 L 50 750 L 50 700"
            fill="none"
            stroke={scene.color}
            strokeWidth="1"
            strokeDasharray="1000"
            opacity="0.6"
          />
          {/* 装饰线条 */}
          <line
            x1="100"
            y1="400"
            x2="200"
            y2="400"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="1000"
          />
          <line
            x1="400"
            y1="400"
            x2="500"
            y2="400"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="1000"
          />
        </svg>

        {/* 照片容器 */}
        <div ref={photoWrapperRef} className="v2-photo-wrapper">
          {/* SVG叠加层 */}
          <div ref={svgOverlayRef} className="v2-svg-overlay">
            <img src={scene.svg} alt="" />
          </div>
          {/* 照片 */}
          <div className="v2-photo-frame">
            <img src={scene.img} alt={scene.title} className="v2-photo" />
            <div className="v2-photo-shine" />
          </div>
          {/* 光晕 */}
          <div className="v2-photo-glow" style={{ background: `radial-gradient(ellipse, ${scene.color}40 0%, transparent 70%)` }} />
        </div>
      </div>

      {/* 右侧 - 文字区域 */}
      <div className="v2-content-area">
        <div className="v2-content-inner">
          {/* 英文标题 */}
          <span ref={titleEnRef} className="v2-title-en">
            {scene.titleEn}
          </span>

          {/* 中文标题 */}
          <h2 ref={titleCnRef} className="v2-title-cn">
            {scene.title}
          </h2>

          {/* 分隔线 */}
          <div className="v2-divider">
            <svg viewBox="0 0 200 20">
              <line x1="0" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="10" r="4" fill="currentColor" />
              <line x1="120" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* 诗句 */}
          <div ref={poemContainerRef} className="v2-poem-container">
            {scene.poem.map((line, i) => (
              <div key={i} className="v2-poem-line">
                <span className="v2-poem-text">{line}</span>
              </div>
            ))}
          </div>

          {/* 故事 */}
          <div ref={storyRef} className="v2-story">
            <p>{scene.story}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 侧边导航
function SideNavigation({
  current,
  total,
  scenes,
  onNavigate,
}: {
  current: number;
  total: number;
  scenes: typeof SCENES;
  onNavigate: (index: number) => void;
}) {
  return (
    <nav className="v2-side-nav">
      <div className="v2-nav-track">
        {scenes.map((scene, i) => (
          <button
            key={i}
            className={`v2-nav-dot ${i === current ? "active" : ""} ${i < current ? "passed" : ""}`}
            onClick={() => onNavigate(i)}
            aria-label={`跳转到 ${scene.title}`}
          >
            <span className="v2-nav-dot-inner" style={{ backgroundColor: scene.color }} />
            <span className="v2-nav-label">{scene.title}</span>
          </button>
        ))}
      </div>
      <div className="v2-nav-progress">
        <div
          className="v2-nav-progress-fill"
          style={{ height: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </nav>
  );
}

// 底部信息
function BottomInfo({ scene, index }: { scene: (typeof SCENES)[0]; index: number }) {
  return (
    <div className="v2-bottom-info">
      <div className="v2-scene-number">
        <span className="v2-number-current">{String(index + 1).padStart(2, "0")}</span>
        <span className="v2-number-divider">/</span>
        <span className="v2-number-total">{String(SCENES.length).padStart(2, "0")}</span>
      </div>
      <div className="v2-scene-title-mini">{scene.titleEn}</div>
    </div>
  );
}

// 滚动提示
function ScrollHint({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="v2-scroll-hint">
      <div className="v2-scroll-icon">
        <svg viewBox="0 0 24 40" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="6" y="1" width="12" height="22" rx="6" />
          <line x1="12" y1="6" x2="12" y2="10" className="v2-scroll-wheel" />
          <path d="M8 28 L12 34 L16 28" className="v2-scroll-arrow" />
        </svg>
      </div>
      <span className="v2-scroll-text">向下滑动探索</span>
    </div>
  );
}
