"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Application, Sprite, Container, Texture, Filter, BLEND_MODES, WRAP_MODES, DisplacementFilter } from "pixi.js";
import { AdvancedBloomFilter } from "@pixi/filter-advanced-bloom";
import { RGBSplitFilter } from "@pixi/filter-rgb-split";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRouter } from "next/navigation";
import "../app/rose/rose.css";

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

// --- GLSL Shaders ---
const gradientFrag = `
precision mediump float;
uniform float time;
uniform vec2 resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time * 0.1;
    // 更深邃、更现代的高级灰/紫调
    vec3 col1 = vec3(0.02, 0.02, 0.05); 
    vec3 col2 = vec3(0.15, 0.05, 0.15);
    vec3 col3 = vec3(0.05, 0.1, 0.2);
    
    float n1 = sin(uv.x * 1.5 + t) * cos(uv.y * 1.5 - t);
    float n2 = sin(uv.x * 2.5 - t * 1.2) * cos(uv.y * 2.5 + t);
    
    vec3 finalColor = col1;
    finalColor = mix(finalColor, col2, smoothstep(-1.0, 1.0, n1));
    finalColor = mix(finalColor, col3, smoothstep(-1.0, 1.0, n2) * 0.6);
    
    float vignette = 1.0 - length(uv - 0.5) * 1.2;
    finalColor *= vignette;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// --- WebGL Experience ---
function WebGLExperience({ idx, setIdx }: { idx: number; setIdx: React.Dispatch<React.SetStateAction<number>> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  
  const bgUniformsRef = useRef({ time: 0, resolution: [0, 0] });
  const spritesRef = useRef<Sprite[]>([]);
  const linesRef = useRef<Sprite[]>([]);
  const particlesRef = useRef<Container | null>(null);
  
  // 滤镜引用
  const displacementFilterRef = useRef<DisplacementFilter | null>(null);
  const rgbFilterRef = useRef<RGBSplitFilter | null>(null);
  const bloomFilterRef = useRef<AdvancedBloomFilter | null>(null);
  
  const currentIdxRef = useRef(idx);
  const isTransitioningRef = useRef(false);
  const destroyedRef = useRef(false);
  const isEndingRef = useRef(false); // New: Track ending state

  useEffect(() => {
    if (!containerRef.current) return;
    destroyedRef.current = false;

    const app = new Application({
      resizeTo: window,
      backgroundAlpha: 1,
      backgroundColor: 0x000000,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio, 2),
      autoDensity: true,
    });
    
    if (containerRef.current) {
        containerRef.current.appendChild(app.view as unknown as Node);
        appRef.current = app;
    }

    const initStage = async () => {
        if (destroyedRef.current || !app.renderer) return;

        // 1. 背景层 (Shader)
        const bgFilter = new Filter(undefined, gradientFrag, bgUniformsRef.current);
        const bgSprite = new Sprite(Texture.WHITE);
        bgSprite.width = app.renderer.screen.width;
        bgSprite.height = app.renderer.screen.height;
        bgSprite.filters = [bgFilter];
        app.stage.addChild(bgSprite);

        // 2. 星尘粒子层 (Stardust)
        const pContainer = new Container();
        particlesRef.current = pContainer;
        app.stage.addChild(pContainer);

        const starTexture = Texture.from("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIj48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iNCIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjwvc3ZnPg==");
        
        for(let i=0; i<150; i++) {
            const star = new Sprite(starTexture);
            star.x = Math.random() * app.renderer.screen.width;
            star.y = Math.random() * app.renderer.screen.height;
            star.alpha = Math.random() * 0.5 + 0.1;
            star.scale.set(Math.random() * 0.5 + 0.1);
            // Custom properties for animation
            (star as any).vx = (Math.random() - 0.5) * 0.2;
            (star as any).vy = (Math.random() - 0.5) * 0.2;
            pContainer.addChild(star);
        }

        // 3. 内容层容器
        const photoContainer = new Container();
        const lineContainer = new Container();
        
        // 4. 滤镜配置
        const rgbFilter = new RGBSplitFilter([0, 0], [0, 0], [0, 0]);
        rgbFilterRef.current = rgbFilter;
        
        // 线条专用的 Bloom - 增强亮度
        const bloomFilter = new AdvancedBloomFilter({
            threshold: 0.4,
            bloomScale: 1.5,
            brightness: 1.5,
            blur: 4,
            quality: 5
        });
        bloomFilterRef.current = bloomFilter;

        // 全局置换 (用于转场液化)
        const noiseTex = Texture.from("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIj48ZmlsdGVyIGlkPSJnoiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjAxIiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2cpIiBvcGFjaXR5PSIxIi8+PC9zdmc+");
        const dispSprite = new Sprite(noiseTex);
        dispSprite.texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
        dispSprite.scale.set(4);
        app.stage.addChild(dispSprite);
        
        const dispFilter = new DisplacementFilter(dispSprite);
        dispFilter.scale.set(0);
        displacementFilterRef.current = dispFilter;

        // 应用滤镜策略
        lineContainer.filters = [dispFilter, rgbFilter, bloomFilter];
        photoContainer.filters = [dispFilter, rgbFilter];

        // 顺序：照片在下，线条在上
        app.stage.addChild(photoContainer);
        app.stage.addChild(lineContainer);

        // 5. 加载资源
        for (const s of SCENES) {
            if (destroyedRef.current) return;

            // Photo
            const imgTex = await Texture.fromURL(s.img);
            if (destroyedRef.current || !app.renderer) return;

            const photo = new Sprite(imgTex);
            photo.anchor.set(0.5);
            photo.x = app.renderer.screen.width / 2;
            photo.y = app.renderer.screen.height / 2;
            
            // 缩小比例：0.55
            const ratio = Math.max(app.renderer.screen.width / photo.width, app.renderer.screen.height / photo.height) * 0.55;
            photo.scale.set(ratio);
            photo.alpha = 0;
            
            photoContainer.addChild(photo);
            spritesRef.current.push(photo);

            // SVG Lines
            const svgTex = await Texture.fromURL(s.svg);
            if (destroyedRef.current || !app.renderer) return;

            const line = new Sprite(svgTex);
            line.anchor.set(0.5);
            line.x = app.renderer.screen.width / 2;
            line.y = app.renderer.screen.height / 2;
            line.scale.set(ratio);
            line.alpha = 0;
            line.blendMode = BLEND_MODES.ADD;
            line.tint = 0xffeef5; // Softer pink-white
            
            lineContainer.addChild(line);
            linesRef.current.push(line);
        }

        app.ticker.add((delta) => {
            if (destroyedRef.current || !app.renderer) return;
            bgUniformsRef.current.time += 0.01 * delta;
            bgUniformsRef.current.resolution = [app.renderer.screen.width, app.renderer.screen.height];
            dispSprite.x += 1 * delta;
            dispSprite.y += 0.5 * delta;

            // Particle Animation
            if (particlesRef.current) {
                for (const p of particlesRef.current.children) {
                    p.x += (p as any).vx * delta;
                    p.y += (p as any).vy * delta;
                    if (p.x < 0) p.x = app.renderer.screen.width;
                    if (p.x > app.renderer.screen.width) p.x = 0;
                    if (p.y < 0) p.y = app.renderer.screen.height;
                    if (p.y > app.renderer.screen.height) p.y = 0;
                }
            }
        });

        transitionTo(0);
    };

    initStage();

    return () => {
        destroyedRef.current = true;
        if (appRef.current) {
            appRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
            appRef.current = null;
        }
    };
  }, []);

  // --- Animation Logic ---
  const killSceneTweens = (index: number) => {
      if (!spritesRef.current[index] || !linesRef.current[index]) return;
      const photo = spritesRef.current[index];
      const line = linesRef.current[index];
      gsap.killTweensOf([photo, line, photo.scale, line.scale, photo.position, line.position]);
      if (displacementFilterRef.current) gsap.killTweensOf(displacementFilterRef.current.scale);
      if (rgbFilterRef.current) gsap.killTweensOf(rgbFilterRef.current);
      if (bloomFilterRef.current) gsap.killTweensOf(bloomFilterRef.current);
  };

  const showEnding = () => {
      if (!appRef.current || destroyedRef.current || isEndingRef.current) return;
      isEndingRef.current = true;
      isTransitioningRef.current = true; // Lock navigation

      // Kill active scene
      killSceneTweens(currentIdxRef.current);
      const activePhoto = spritesRef.current[currentIdxRef.current];
      const activeLine = linesRef.current[currentIdxRef.current];
      if (activePhoto) gsap.to(activePhoto, { alpha: 0, duration: 1 });
      if (activeLine) gsap.to(activeLine, { alpha: 0, duration: 1 });

      const cx = appRef.current.renderer.screen.width / 2;
      const cy = appRef.current.renderer.screen.height / 2;
      
      // Montage Animation: Spiral Layout
      spritesRef.current.forEach((sprite, i) => {
         sprite.alpha = 0;
         sprite.scale.set(0);
         sprite.x = cx;
         sprite.y = cy;
         sprite.rotation = (Math.random() - 0.5) * 1;
         
         // Calculate spiral position
         const angle = (i / spritesRef.current.length) * Math.PI * 2;
         const radius = Math.min(cx, cy) * 0.7; // 70% of screen radius
         const targetX = cx + Math.cos(angle) * radius;
         const targetY = cy + Math.sin(angle) * radius;

         const tl = gsap.timeline({ delay: i * 0.2 + 1 });
         tl.to(sprite, { alpha: 0.8, pixi: { scale: 0.15 }, duration: 1.5, ease: "back.out(1.2)" }) // Pop in small
           .to(sprite, { x: targetX, y: targetY, rotation: 0, duration: 2, ease: "power3.out" }, "<");
           
         // Floating effect
         gsap.to(sprite, { y: targetY + 20, duration: 2 + Math.random(), yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.2 + 3 });
      });

      // Camera drift
      if (particlesRef.current) {
          gsap.to(particlesRef.current, { rotation: 0.2, duration: 20, ease: "none", repeat: -1, yoyo: true });
      }
  };

  const transitionTo = (index: number) => {
      if (!appRef.current || destroyedRef.current || !appRef.current.renderer) return;
      if (isEndingRef.current) return;

      // Force Cleanup
      spritesRef.current.forEach((s, i) => { if (i !== index) { gsap.killTweensOf(s); s.alpha = 0; } });
      linesRef.current.forEach((l, i) => { if (i !== index) { gsap.killTweensOf(l); l.alpha = 0; } });

      const photo = spritesRef.current[index];
      const line = linesRef.current[index];
      if (!photo || !line) return;
      
      killSceneTweens(index);

      const cx = appRef.current.renderer.screen.width / 2;
      const cy = appRef.current.renderer.screen.height / 2;

      const tl = gsap.timeline({
          onComplete: () => { isTransitioningRef.current = false; }
      });

      // Reset
      gsap.set([photo, line], { alpha: 0, pixi: { scale: photo.scale.x * 1.15 } }); 
      photo.position.set(cx, cy);
      line.position.set(cx, cy);

      if (displacementFilterRef.current && rgbFilterRef.current && bloomFilterRef.current) {
          gsap.set(displacementFilterRef.current.scale, { x: 0, y: 0 });
          gsap.set(rgbFilterRef.current, { red: [0, 0], green: [0, 0], blue: [0, 0] });
          gsap.set(bloomFilterRef.current, { threshold: 0.4, bloomScale: 1.5, brightness: 1.5 });
      }

      // Phase 1: Laser Etch (Flicker + Shake)
      // Rapid flicker
      tl.to(line, { alpha: 1, duration: 0.05, repeat: 5, yoyo: true }) 
        .to(line, { alpha: 1, duration: 0.5 });
        
      // Shake effect on RGB filter to simulate energy
      if (rgbFilterRef.current) {
          tl.to(rgbFilterRef.current, { red: [5, 0], blue: [-5, 0], duration: 0.1, yoyo: true, repeat: 5 }, 0);
      }

      // Phase 2: Transformation
      tl.to(photo, { alpha: 1, duration: 1.5, ease: "power2.inOut" }, ">-0.2");
      tl.to(line, { alpha: 0, duration: 1.0, ease: "power2.inOut" }, "<"); 

      // 3. Settle
      tl.to([photo.scale, line.scale], { 
          x: photo.scale.x / 1.15, 
          y: photo.scale.y / 1.15, 
          duration: 4, 
          ease: "sine.out" 
      }, 0);
  };

  const hideScene = (index: number, dir: number) => {
      if (!appRef.current || destroyedRef.current) return;
      const photo = spritesRef.current[index];
      const line = linesRef.current[index];
      if (!photo || !line) return;

      killSceneTweens(index);

      const tl = gsap.timeline();
      if (rgbFilterRef.current) {
         tl.to(rgbFilterRef.current, { red: [10, 0], blue: [-10, 0], duration: 0.4, yoyo: true, repeat: 1 }, 0);
      }
      tl.to([photo, line], { alpha: 0, x: photo.x - dir * 100, duration: 0.8, ease: "power2.inOut" }, 0);
      return tl;
  };

  useEffect(() => {
      if (idx === currentIdxRef.current || isTransitioningRef.current || !appRef.current) return;
      
      const prev = currentIdxRef.current;
      const next = idx;
      
      currentIdxRef.current = next;
      isTransitioningRef.current = true;

      // Check for Ending
      if (idx === SCENES.length) {
          hideScene(prev, 1);
          gsap.delayedCall(0.8, showEnding);
          return;
      }

      const dir = next > prev ? 1 : -1;
      hideScene(prev, dir);
      
      gsap.delayedCall(0.6, () => {
          if (!destroyedRef.current) transitionTo(next);
      });

  }, [idx]);

  useEffect(() => {
      gsap.registerPlugin(Observer);
      const obs = Observer.create({
          target: window,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 10,
          preventDefault: true,
          onDown: () => {
              // Allow going to length (Ending)
              if (!isTransitioningRef.current && idx < SCENES.length && !isEndingRef.current) {
                  setIdx(i => i + 1);
              }
          },
          onUp: () => {
              if (!isTransitioningRef.current && idx > 0 && !isEndingRef.current) {
                  setIdx(i => i - 1);
              }
          }
      });
      return () => obs.kill();
  }, [idx, setIdx]);

  return <div ref={containerRef} className="webgl-container" />;
}

// --- UI Overlay ---
function UIOverlay({ idx }: { idx: number }) {
    if (idx >= SCENES.length) return <EndingOverlay />; // Show ending text

    const story = SCENES[idx];
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            
            // Mask Reveal Setup
            // We use clip-path to hide the text initially
            gsap.set([titleRef.current, textRef.current], { 
                clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", 
                y: 50, 
                opacity: 0 
            });
            gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });

            // Animate In - Cinematic Reveal
            tl.to(lineRef.current, { scaleX: 1, duration: 1.0, ease: "expo.out" })
              .to(titleRef.current, { 
                  clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", 
                  y: 0, 
                  opacity: 1,
                  duration: 1.5, 
                  ease: "power3.out", 
              }, "-=0.8")
              .to(textRef.current, { 
                  clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
                  y: 0, 
                  opacity: 1,
                  duration: 1.5, 
                  ease: "power3.out" 
              }, "-=1.3");
              
        }, containerRef);
        return () => ctx.revert();
    }, [idx]);

    return (
        <div ref={containerRef} className="ui-overlay">
            <div className="content-box">
                <div ref={lineRef} className="deco-line" />
                <h1 ref={titleRef} className="title-cinematic">
                    {story.en}
                </h1>
                <p ref={textRef} className="subtitle-cinematic">{story.cn}</p>
            </div>
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${((idx + 1) / SCENES.length) * 100}%` }} />
            </div>
        </div>
    );
}

function EndingOverlay() {
    const ref = useRef(null);
    useEffect(() => {
        gsap.fromTo(ref.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 2, delay: 2 });
    }, []);
    return (
        <div ref={ref} className="ui-overlay ending-mode">
             <div className="content-box center">
                <h1 className="title-cinematic large">FOREVER & ALWAYS</h1>
                <p className="subtitle-cinematic">未完待续 · 我们的故事刚刚开始</p>
            </div>
        </div>
    );
}

// --- Main Page ---
export default function Page() {
  const [unlocked, setUnlocked] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [renderChoice, setRenderChoice] = useState(false); // 新增：控制渲染
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const isUnlocked = sessionStorage.getItem(SESSION_KEY) === "1";
    if (isUnlocked) {
      setUnlocked(true);
      setRenderChoice(true);
      setShowChoice(true);
    }
  }, []);

  const handleUnlock = () => {
    setUnlocked(true);
    // 立即渲染ChoiceScreen（但保持隐藏）
    setRenderChoice(true);
    // 不立即显示选择界面，等待粒子动画完成
  };

  const handleParticleComplete = () => {
    // 显示选择界面（触发淡入动画）
    setShowChoice(prev => {
      if (!prev) {
        return true;
      }
      return prev;
    });
  };

  return (
    <div className="stage-root">
        {unlocked && !showChoice && <WebGLExperience idx={idx} setIdx={setIdx} />}
        {unlocked && !showChoice && <UIOverlay idx={idx} />}
        {renderChoice && <ChoiceScreen show={showChoice} />}
        {!unlocked && <Gate onUnlock={handleUnlock} onParticleComplete={handleParticleComplete} />}
    </div>
  );
}

// 选择界面组件
function ChoiceScreen({ show }: { show: boolean }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 只在 show 为 true 时执行动画
    if (!show) return;

    // 电影级入场动画 - 与Gate的淡出交叉进行
    const tl = gsap.timeline({ delay: 0 }); // 立即开始
    
    // 背景淡入 - 从Gate的背景过渡过来
    tl.fromTo(".rose-bg", 
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
    
    // 顶部装饰
    tl.fromTo(".top-decoration", 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    );
    
    // 标题 - 从下方滑入并放大
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
    
    // 副标题 - 字符逐个出现
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
    
    // 旅程路径
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
    
    // 按钮 - 3D翻转入场
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
    
    // 底部装饰 - 线条展开
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
    
    // 添加持续的浮动动画
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

    // 清理函数 - 组件卸载时杀死所有动画
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
    // 整个页面淡出，避免与目标页面的入场动画冲突
    const tl = gsap.timeline();
    tl.to(".choice-container", {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: "power2.inOut",
    });
    tl.to(".rose-bg", {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    }, "-=0.3");
    tl.to(".rose-stage", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => router.push("/gallery/v3")
    }, "-=0.2");
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
        
        {/* 添加装饰性光圈 */}
        <div className="deco-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
      </div>

      <div className="choice-container">
        {/* 顶部装饰 */}
        <div className="top-decoration">
          <div className="deco-line-top"></div>
          <div className="deco-dot"></div>
          <div className="deco-line-top"></div>
        </div>

        <h2 className="choice-title">选择你的旅程</h2>
        <p className="choice-subtitle">Choose Your Journey</p>
        
        {/* 中间装饰引导线 */}
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

    // 不要淡出背景，让它保持，避免黑屏闪现
    // gsap.to(".gate-bg", {
    //   opacity: 0,
    //   duration: 1.5,
    //   ease: "power2.inOut"
    // });

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
        // 粒子消散完成，淡出整个Gate组件（包括背景）
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
