"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import "./gallery.css";

// 场景数据 - 每张照片配三段文字
const SCENES = [
  {
    img: "/her.png",
    svg: "/ref/her.svg",
    title: "初见",
    poem: ["那一刻星辰坠入眼眸", "时间忘记了流动", "世界只剩下你的轮廓"],
    story: "有些相遇，是命运在人海中精心安排的奇迹。当我第一次看见你，仿佛整个宇宙都在那一瞬间静止，只为让我记住你的模样。"
  },
  {
    img: "/her3.png",
    svg: "/ref/her3.svg",
    title: "心动",
    poem: ["风很温柔", "像你第一次叫我的名字", "从此我的名字有了意义"],
    story: "心动是什么感觉？是听到你的声音会不自觉微笑，是想到你就觉得世界都变得柔软，是愿意为你变成更好的人。"
  },
  {
    img: "/her4.png",
    svg: "/ref/her4.svg",
    title: "陪伴",
    poem: ["路灯学会了浪漫", "只照亮你走过的路", "我学会了等待"],
    story: "最好的爱情不是轰轰烈烈，而是细水长流的陪伴。每一个平凡的日子，因为有你，都变成了值得珍藏的回忆。"
  },
  {
    img: "/her5.png",
    svg: "/ref/her5.svg",
    title: "默契",
    poem: ["时间煮雨", "我们煮茶", "岁月在杯中生香"],
    story: "不用言语，一个眼神就能懂得彼此。这种默契，是我们用无数个日夜培养出的专属语言。"
  },
  {
    img: "/her6.png",
    svg: "/ref/her6.svg",
    title: "信任",
    poem: ["不用回头", "我知道你一直在身后", "这是最安心的距离"],
    story: "信任是爱情最珍贵的礼物。因为相信你，我可以勇敢地向前走，因为我知道，无论发生什么，你都会在那里。"
  },
  {
    img: "/her7.png",
    svg: "/ref/her7.svg",
    title: "宠溺",
    poem: ["我的超能力", "是让你永远做个孩子", "被世界温柔以待"],
    story: "想把所有的温柔都给你，想让你永远保持那份纯真的笑容。在我这里，你可以任性，可以撒娇，可以做最真实的自己。"
  },
  {
    img: "/her8.png",
    svg: "/ref/her8.svg",
    title: "誓言",
    poem: ["想把所有美好的词", "都兑换成你", "写进余生的每一页"],
    story: "我不会说太多华丽的情话，但我想用一生的时间，把每一个承诺都变成现实。你值得世间所有的美好。"
  },
  {
    img: "/her9.png",
    svg: "/ref/her9.svg",
    title: "永恒",
    poem: ["这一生很长", "好在有你", "闪闪发光"],
    story: "未来的路还很长，但只要牵着你的手，每一步都是风景。感谢命运让我遇见你，让我的生命从此有了光。"
  },
];

export default function GalleryPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 初始化粒子背景
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

    // 星尘粒子
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      twinkle: number;
    }> = [];

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const twinkleOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.twinkle));

        ctx.save();
        ctx.globalAlpha = twinkleOpacity;
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 182, 193, 0.8)";
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
  }, []);

  // 滚动/滑动控制
  useEffect(() => {
    gsap.registerPlugin(Observer);

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 50,
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
  }, [currentIndex, isTransitioning]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (currentIndex < SCENES.length - 1) {
          setIsTransitioning(true);
          setCurrentIndex((i) => i + 1);
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (currentIndex > 0) {
          setIsTransitioning(true);
          setCurrentIndex((i) => i - 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isTransitioning]);

  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return (
    <div ref={containerRef} className="gallery-stage">
      {/* 粒子背景 */}
      <canvas ref={canvasRef} className="gallery-particles" />

      {/* 渐变背景 */}
      <div className="gallery-gradient-bg" />

      {/* 装饰性SVG元素 */}
      <DecoElements currentIndex={currentIndex} />

      {/* 场景容器 */}
      <div className="gallery-scenes">
        {SCENES.map((scene, index) => (
          <Scene
            key={index}
            scene={scene}
            index={index}
            currentIndex={currentIndex}
            onTransitionEnd={handleTransitionEnd}
          />
        ))}
      </div>

      {/* 进度指示器 */}
      <ProgressIndicator current={currentIndex} total={SCENES.length} />

      {/* 导航提示 */}
      <NavigationHint />
    </div>
  );
}

// 单个场景组件
function Scene({
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
  const photoRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const poemRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLParagraphElement>(null);
  const frameRef = useRef<SVGSVGElement>(null);

  const isActive = index === currentIndex;
  const isPrev = index < currentIndex;

  useEffect(() => {
    if (!sceneRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (isActive) onTransitionEnd();
        },
      });

      if (isActive) {
        // 进入动画
        gsap.set(sceneRef.current, { visibility: "visible", zIndex: 10 });

        // 照片容器动画
        tl.fromTo(
          photoRef.current,
          {
            scale: 1.3,
            opacity: 0,
            filter: "blur(20px) brightness(2)",
          },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px) brightness(1)",
            duration: 1.8,
            ease: "power3.out",
          }
        );

        // SVG线条动画 - 描边效果
        tl.fromTo(
          svgRef.current,
          {
            opacity: 0,
            scale: 1.1,
          },
          {
            opacity: 0.6,
            scale: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=1.4"
        );

        // 装饰框架动画
        tl.fromTo(
          frameRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
          "-=1"
        );

        // 标题动画 - 从下方滑入并展开
        tl.fromTo(
          titleRef.current,
          {
            y: 80,
            opacity: 0,
            letterSpacing: "0.5em",
          },
          {
            y: 0,
            opacity: 1,
            letterSpacing: "0.3em",
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.8"
        );

        // 诗句逐行显现
        const poemLines = poemRef.current?.querySelectorAll(".poem-line");
        if (poemLines) {
          tl.fromTo(
            poemLines,
            {
              x: -50,
              opacity: 0,
            },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: "power3.out",
            },
            "-=0.6"
          );
        }

        // 故事文字淡入
        tl.fromTo(
          storyRef.current,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4"
        );

        // 持续的微动效果
        gsap.to(photoRef.current, {
          y: 10,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        gsap.to(svgRef.current, {
          opacity: 0.4,
          duration: 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      } else {
        // 离开动画
        const direction = isPrev ? -1 : 1;

        tl.to(
          [photoRef.current, svgRef.current],
          {
            scale: 0.8,
            opacity: 0,
            y: direction * -100,
            filter: "blur(10px)",
            duration: 0.8,
            ease: "power2.in",
          },
          0
        );

        tl.to(
          [titleRef.current, poemRef.current, storyRef.current],
          {
            opacity: 0,
            y: direction * -50,
            duration: 0.6,
            ease: "power2.in",
          },
          0
        );

        tl.set(sceneRef.current, { visibility: "hidden", zIndex: 0 });
      }
    }, sceneRef);

    return () => ctx.revert();
  }, [isActive, isPrev, onTransitionEnd]);

  return (
    <div
      ref={sceneRef}
      className={`gallery-scene ${isActive ? "active" : ""}`}
      style={{ visibility: isActive ? "visible" : "hidden" }}
    >
      {/* 照片区域 */}
      <div className="scene-visual">
        <div ref={photoRef} className="scene-photo-container">
          {/* 装饰框架 */}
          <svg ref={frameRef} className="photo-frame" viewBox="0 0 400 500">
            <defs>
              <linearGradient id={`frameGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,116,183,0.6)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,168,213,0.6)" />
              </linearGradient>
            </defs>
            {/* 角落装饰 */}
            <path
              d="M 20 60 L 20 20 L 60 20"
              fill="none"
              stroke={`url(#frameGrad-${index})`}
              strokeWidth="2"
              className="frame-corner"
            />
            <path
              d="M 340 20 L 380 20 L 380 60"
              fill="none"
              stroke={`url(#frameGrad-${index})`}
              strokeWidth="2"
              className="frame-corner"
            />
            <path
              d="M 380 440 L 380 480 L 340 480"
              fill="none"
              stroke={`url(#frameGrad-${index})`}
              strokeWidth="2"
              className="frame-corner"
            />
            <path
              d="M 60 480 L 20 480 L 20 440"
              fill="none"
              stroke={`url(#frameGrad-${index})`}
              strokeWidth="2"
              className="frame-corner"
            />
            {/* 装饰线条 */}
            <line x1="80" y1="20" x2="320" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="80" y1="480" x2="320" y2="480" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5,5" />
          </svg>

          {/* SVG线条叠加 */}
          <img ref={svgRef} src={scene.svg} alt="" className="scene-svg-overlay" />

          {/* 照片 */}
          <img src={scene.img} alt={scene.title} className="scene-photo" />

          {/* 光晕效果 */}
          <div className="photo-glow" />
        </div>
      </div>

      {/* 文字区域 */}
      <div className="scene-content">
        {/* 标题 */}
        <h2 ref={titleRef} className="scene-title">
          <span className="title-text">{scene.title}</span>
          <span className="title-line" />
        </h2>

        {/* 诗句 */}
        <div ref={poemRef} className="scene-poem">
          {scene.poem.map((line, i) => (
            <div key={i} className="poem-line">
              <span className="poem-marker">—</span>
              <span className="poem-text">{line}</span>
            </div>
          ))}
        </div>

        {/* 故事 */}
        <p ref={storyRef} className="scene-story">
          {scene.story}
        </p>
      </div>
    </div>
  );
}

// 装饰性SVG元素
function DecoElements({ currentIndex }: { currentIndex: number }) {
  const decoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!decoRef.current) return;

    // 根据场景切换装饰元素的动画
    gsap.to(".deco-circle", {
      rotation: currentIndex * 45,
      duration: 1.5,
      ease: "power2.out",
    });

    gsap.to(".deco-line-h", {
      scaleX: 0.5 + (currentIndex / 8) * 0.5,
      duration: 1,
      ease: "power2.out",
    });
  }, [currentIndex]);

  return (
    <div ref={decoRef} className="deco-elements">
      {/* 左上角装饰 */}
      <svg className="deco-corner deco-top-left" viewBox="0 0 200 200">
        <circle
          className="deco-circle"
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(255,116,183,0.15)"
          strokeWidth="1"
          strokeDasharray="10,5"
        />
        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line className="deco-line-h" x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,116,183,0.2)" strokeWidth="1" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,116,183,0.2)" strokeWidth="1" />
      </svg>

      {/* 右下角装饰 */}
      <svg className="deco-corner deco-bottom-right" viewBox="0 0 200 200">
        <path
          d="M 20 180 Q 100 100 180 20"
          fill="none"
          stroke="rgba(255,168,213,0.2)"
          strokeWidth="1"
        />
        <circle cx="180" cy="20" r="5" fill="rgba(255,116,183,0.3)" />
        <circle cx="20" cy="180" r="5" fill="rgba(255,168,213,0.3)" />
      </svg>

      {/* 浮动装饰点 */}
      <div className="floating-dots">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-dot"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// 进度指示器
function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="progress-indicator">
      <div className="progress-numbers">
        <span className="progress-current">{String(current + 1).padStart(2, "0")}</span>
        <span className="progress-divider">/</span>
        <span className="progress-total">{String(total).padStart(2, "0")}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ height: `${((current + 1) / total) * 100}%` }}
        />
      </div>
      <div className="progress-dots">
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === current ? "active" : ""} ${i < current ? "passed" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// 导航提示
function NavigationHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="nav-hint">
      <div className="hint-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
      <span className="hint-text">滑动或滚动探索</span>
    </div>
  );
}
