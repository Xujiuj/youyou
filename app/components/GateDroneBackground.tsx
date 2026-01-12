"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

const DRONE_COUNT = 1000;
const CARD_RADIUS = 25;
const BOUNDS_X = 100;  // 进一步增大X边界
const BOUNDS_Y = 50;
const BOUNDS_Z = 35;
const HOVER_HEIGHT = 25;

// 添加性能检测函数
const getPerformanceFactor = (): number => {
  // 在生产环境中，根据设备性能调整动画速度
  if (typeof window !== 'undefined') {
    // 简单的性能检测：如果设备内存较小，则降低性能要求
    const deviceMemory = (navigator as any).deviceMemory || 8; // 默认8GB
    if (deviceMemory < 4) {
      return 0.8; // 低性能设备
    }
  }
  return 1.0; // 正常性能
};

const performanceFactor = getPerformanceFactor();

const getHeartShape = (scale = 1, centerX = 0, centerY = 0): THREE.Vector3[] => {
  const points: THREE.Vector3[] = [];
  
  // 使用参数方程生成心形轮廓点
  const heartX = (t: number) => 16 * Math.pow(Math.sin(t), 3);
  const heartY = (t: number) => 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  
  // 生成多层心形轮廓来填充，围绕卡片展开
  // 卡片大约占据中心 -25 到 25 的区域
  const cardHalfWidth = 28;
  const cardHalfHeight = 22;
  
  for (let layer = 0.4; layer <= 1; layer += 0.03) {
    const layerScale = layer;
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 2;
      let x = heartX(t) * layerScale * scale;
      let y = heartY(t) * layerScale * scale;
      
      // 检查是否在卡片区域内，如果是则跳过
      if (Math.abs(x + centerX) < cardHalfWidth && Math.abs(y + centerY) < cardHalfHeight) {
        continue;
      }
      
      points.push(new THREE.Vector3(
        x + centerX + (Math.random() - 0.5) * 0.5,
        y + centerY + (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 3
      ));
    }
  }
  
  // 添加更密集的轮廓点
  for (let i = 0; i < 300; i++) {
    const t = (i / 300) * Math.PI * 2;
    const x = heartX(t) * scale;
    const y = heartY(t) * scale;
    
    // 跳过卡片区域
    if (Math.abs(x + centerX) < cardHalfWidth && Math.abs(y + centerY) < cardHalfHeight) {
      continue;
    }
    
    points.push(new THREE.Vector3(
      x + centerX + (Math.random() - 0.5) * 0.3,
      y + centerY + (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 2
    ));
  }
  
  return points;
};

const loadSVGPath = async (svgPath: string, scale = 1): Promise<THREE.Vector3[]> => {
  try {
    const response = await fetch(svgPath);
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    const viewBox = svgElement.getAttribute("viewBox");
    if (!viewBox) return [];
    
    const [, , width, height] = viewBox.split(" ").map(Number);
    const centerX = width / 2;
    const centerY = height / 2;
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return [];
    
    // 保持宽高比，使用较大的分辨率
    const resolution = 4;
    canvas.width = width * resolution;
    canvas.height = height * resolution;
    
    const img = new Image();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve) => {
      img.onload = () => {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const allPoints: THREE.Vector3[] = [];
        
        // 计算宽高比，确保X和Y方向缩放一致
        const aspectRatio = width / height;
        const baseScale = 0.12 * scale;
        
        // 先收集所有填充像素
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const r = imageData.data[index];
            const g = imageData.data[index + 1];
            const b = imageData.data[index + 2];
            
            // 检测非白色像素（SVG 填充部分）
            if (r < 128 || g < 128 || b < 128) {
              // 保持宽高比的缩放
              const px = ((x / resolution) - centerX) * baseScale;
              const py = -((y / resolution) - centerY) * baseScale;
              allPoints.push(new THREE.Vector3(px, py, 0));
            }
          }
        }
        
        URL.revokeObjectURL(url);
        
        // 均匀采样，确保点分布均匀
        const targetCount = Math.min(DRONE_COUNT, allPoints.length);
        const points: THREE.Vector3[] = [];
        
        if (allPoints.length <= targetCount) {
          // 点不够，全部使用并添加随机偏移
          for (const p of allPoints) {
            points.push(new THREE.Vector3(
              p.x + (Math.random() - 0.5) * 0.3,
              p.y + (Math.random() - 0.5) * 0.3,
              (Math.random() - 0.5) * 2
            ));
          }
        } else {
          // 均匀采样
          const step = allPoints.length / targetCount;
          for (let i = 0; i < targetCount; i++) {
            const idx = Math.floor(i * step);
            const p = allPoints[idx];
            points.push(new THREE.Vector3(
              p.x + (Math.random() - 0.5) * 0.2,
              p.y + (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 1.5
            ));
          }
        }
        
        resolve(points);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve([]);
      };
      img.src = url;
    });
  } catch (error) {
    console.error('Error loading SVG:', error);
    return [];
  }
};

const createTextPath = (text: string, scale = 1, font = "bold 200px Arial"): THREE.Vector3[] => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  canvas.width = 1024;
  canvas.height = 256;
  ctx.fillStyle = "white";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const points: THREE.Vector3[] = [];
  const step = 2;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const index = (y * canvas.width + x) * 4;
      if (imageData.data[index + 3] > 128) {
        const px = (x - canvas.width / 2) * 0.025 * scale;
        const py = -(y - canvas.height / 2) * 0.025 * scale;
        points.push(new THREE.Vector3(px, py, 0));
      }
    }
  }
  return points;
};

const avoidCardArea = (x: number, y: number, z: number): THREE.Vector3 => {
  const distFromCenter = Math.sqrt(x * x + y * y);
  if (distFromCenter < CARD_RADIUS + 3) {
    const angle = Math.atan2(y, x);
    const newDist = CARD_RADIUS + 5 + Math.random() * 3;
    return new THREE.Vector3(
      Math.cos(angle) * newDist,
      Math.sin(angle) * newDist,
      z
    );
  }
  return new THREE.Vector3(x, y, z);
};

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export default function GateDroneBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    drones: THREE.Points;
    droneData: {
      velocities: Float32Array;
      targets: Float32Array;
      targetColors: Float32Array;
    };
  } | null>(null);
  const animationIdRef = useRef<number>(0);
  const timelineRef = useRef<gsap.core.Tween | null>(null);
  const stageRef = useRef<number>(0);
  const initialPositionsRef = useRef<Float32Array | null>(null);
  const svgPathsRef = useRef<{
    you: THREE.Vector3[];
    forever: THREE.Vector3[];
    happy: THREE.Vector3[];
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 80);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(DRONE_COUNT * 3);
    const colors = new Float32Array(DRONE_COUNT * 3);
    const sizes = new Float32Array(DRONE_COUNT);
    const velocities = new Float32Array(DRONE_COUNT * 3);
    const targets = new Float32Array(DRONE_COUNT * 3);
    const targetColors = new Float32Array(DRONE_COUNT * 3);
    const initialPositions = new Float32Array(DRONE_COUNT * 3);
    const opacities = new Float32Array(DRONE_COUNT);  // 每个无人机的透明度

    const gridSize = Math.ceil(Math.sqrt(DRONE_COUNT));
    const spacing = 2.5;
    const startX = -(gridSize * spacing) / 2;
    const startZ = -(gridSize * spacing) / 2;

    for (let i = 0; i < DRONE_COUNT; i++) {
      const i3 = i * 3;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      const x = startX + col * spacing + (Math.random() - 0.5) * 0.3;
      const z = startZ + row * spacing + (Math.random() - 0.5) * 0.3;
      const y = -45 - Math.random() * 5;  // 初始位置调高
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      initialPositions[i3] = x;
      initialPositions[i3 + 1] = y;
      initialPositions[i3 + 2] = z;
      
      targets[i3] = x;
      targets[i3 + 1] = y;
      targets[i3 + 2] = z;
      
      const hue = 0.85 + Math.random() * 0.15;
      const color = new THREE.Color().setHSL(hue, 0.95, 0.92);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      targetColors[i3] = color.r;
      targetColors[i3 + 1] = color.g;
      targetColors[i3 + 2] = color.b;
      
      sizes[i] = 4.0 + Math.random() * 3.0;
      opacities[i] = 0;  // 初始透明度为0（不可见）
    }

    initialPositionsRef.current = initialPositions;

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying vec3 vColor;
        varying float vDistance;
        varying float vOpacity;
        uniform float pixelRatio;
        uniform float time;
        
        void main() {
          vColor = color;
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vDistance = length(mvPosition.xyz);
          
          float pulse = sin(time * 2.5 + position.x * 0.08 + position.y * 0.08) * 0.15 + 1.0;
          gl_PointSize = size * pixelRatio * (220.0 / vDistance) * pulse;
          gl_PointSize = max(gl_PointSize, 4.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDistance;
        varying float vOpacity;
        
        void main() {
          if (vOpacity < 0.01) discard;
          
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          
          if (dist > 0.5) discard;
          
          float innerGlow = 1.0 - dist * 2.0;
          innerGlow = pow(innerGlow, 1.5);
          
          float outerGlow = 1.0 - dist * 1.2;
          outerGlow = pow(outerGlow, 0.6);
          
          vec3 coreColor = vColor * (1.5 + innerGlow * 1.8);
          vec3 glowColor = vColor * outerGlow * 1.2;
          
          float fade = 1.0 / (1.0 + vDistance * 0.008);
          
          vec3 finalColor = mix(glowColor, coreColor, innerGlow) * fade;
          float alpha = (innerGlow * 1.0 + outerGlow * 0.5) * fade * vOpacity;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const drones = new THREE.Points(geometry, material);
    scene.add(drones);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 250;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 180;
      starPositions[i * 3 + 2] = -60 - Math.random() * 40;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5
    });
    scene.add(new THREE.Points(starGeometry, starMaterial));

    threeRef.current = {
      scene,
      camera,
      renderer,
      drones,
      droneData: { velocities, targets, targetColors }
    };

    const posAttr = drones.geometry.attributes.position.array as Float32Array;
    const colorAttr = drones.geometry.attributes.color.array as Float32Array;
    const opacityAttr = drones.geometry.attributes.opacity.array as Float32Array;

    const checkAllArrived = (targets: Float32Array, threshold = 0.5): boolean => {
      let allArrived = true;
      for (let i = 0; i < DRONE_COUNT; i++) {
        const i3 = i * 3;
        const dx = targets[i3] - posAttr[i3];
        const dy = targets[i3 + 1] - posAttr[i3 + 1];
        const dz = targets[i3 + 2] - posAttr[i3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > threshold) {
          allArrived = false;
          break;
        }
      }
      return allArrived;
    };

    // 悬停时的浮动偏移量，用于实现悬停效果
    const hoverOffsets = new Float32Array(DRONE_COUNT);
    const hoverPhases = new Float32Array(DRONE_COUNT);
    for (let i = 0; i < DRONE_COUNT; i++) {
      hoverOffsets[i] = (Math.random() - 0.5) * 2; // 随机浮动幅度
      hoverPhases[i] = Math.random() * Math.PI * 2; // 随机相位
    }

    // 控制是否允许无人机移动（初始化阶段不移动）
    let allowMovement = false;

    const animate = () => {
      if (!threeRef.current) return;
      
      const { scene, camera, renderer, drones, droneData } = threeRef.current;
      const { velocities, targets, targetColors } = droneData;
      
      const time = Date.now() * 0.001;
      (material.uniforms.time as THREE.IUniform).value = time;
      
      // 只有在允许移动时才更新位置
      if (allowMovement) {
        // 检查是否处于悬停阶段（stage 0 或 5）
        const isHovering = stageRef.current === 0 || stageRef.current === 5;
        
        for (let i = 0; i < DRONE_COUNT; i++) {
          const i3 = i * 3;
          
          // 悬停时添加浮动效果
          let targetY = targets[i3 + 1];
          if (isHovering) {
            const hoverWave = Math.sin(time * 1.5 + hoverPhases[i]) * 0.8;
            targetY = HOVER_HEIGHT + hoverOffsets[i] + hoverWave;
          }
          
          const dx = targets[i3] - posAttr[i3];
          const dy = targetY - posAttr[i3 + 1];
          const dz = targets[i3 + 2] - posAttr[i3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          // 提高速度让无人机更快到位
          const maxSpeed = 0.8;
          const acceleration = Math.min(0.025, distance * 0.002);
          
          velocities[i3] += dx * acceleration;
          velocities[i3 + 1] += dy * acceleration;
          velocities[i3 + 2] += dz * acceleration;
          
          const speed = Math.sqrt(velocities[i3] * velocities[i3] + velocities[i3 + 1] * velocities[i3 + 1] + velocities[i3 + 2] * velocities[i3 + 2]);
          if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            velocities[i3] *= scale;
            velocities[i3 + 1] *= scale;
            velocities[i3 + 2] *= scale;
          }
          
          velocities[i3] *= 0.96;
          velocities[i3 + 1] *= 0.96;
          velocities[i3 + 2] *= 0.96;
          
          posAttr[i3] += velocities[i3];
          posAttr[i3 + 1] += velocities[i3 + 1];
          posAttr[i3 + 2] += velocities[i3 + 2];
          
          posAttr[i3] = clamp(posAttr[i3], -BOUNDS_X, BOUNDS_X);
          posAttr[i3 + 1] = clamp(posAttr[i3 + 1], -BOUNDS_Y, BOUNDS_Y);
          posAttr[i3 + 2] = clamp(posAttr[i3 + 2], -BOUNDS_Z, BOUNDS_Z);
          
          colorAttr[i3] += (targetColors[i3] - colorAttr[i3]) * 0.02;
          colorAttr[i3 + 1] += (targetColors[i3 + 1] - colorAttr[i3 + 1]) * 0.02;
          colorAttr[i3 + 2] += (targetColors[i3 + 2] - colorAttr[i3 + 2]) * 0.02;
        }
        
        drones.geometry.attributes.position.needsUpdate = true;
        drones.geometry.attributes.color.needsUpdate = true;
      }
      
      drones.geometry.attributes.opacity.needsUpdate = true;
      
      const camTime = time * 0.0008;
      camera.position.x = Math.sin(camTime) * 4;
      camera.position.y = Math.cos(camTime * 0.7) * 3;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      if (!threeRef.current) return;
      const { camera, renderer } = threeRef.current;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 逐排点亮无人机的初始化动画
    const runInitAnimation = (onComplete: () => void) => {
      const totalRows = gridSize;
      // 根据性能调整动画速度
      const rowDelay = Math.max(40, 80 / performanceFactor); // 每排间隔时间(ms)
      let currentRow = 0;
      
      const lightUpRow = () => {
        if (currentRow >= totalRows) {
          // 所有无人机都点亮了，等待一小段时间后开始主序列
          // 确保有固定的暂停时间，不受性能影响
          setTimeout(() => {
            allowMovement = true; // 点亮完成后才允许移动
            onComplete();
          }, 2000); // 固定2秒暂停
          return;
        }
        
        // 点亮当前排的所有无人机
        for (let col = 0; col < gridSize; col++) {
          const droneIndex = currentRow * gridSize + col;
          if (droneIndex < DRONE_COUNT) {
            opacityAttr[droneIndex] = 1;
          }
        }
        drones.geometry.attributes.opacity.needsUpdate = true;
        
        currentRow++;
        setTimeout(lightUpRow, rowDelay);
      };
      
      lightUpRow();
    };

    const setupHover = () => {
      if (!threeRef.current) return;
      const { droneData } = threeRef.current;
      const { targets, targetColors } = droneData;
      
      for (let i = 0; i < DRONE_COUNT; i++) {
        const i3 = i * 3;
        const initialPos = initialPositionsRef.current!;
        targets[i3] = initialPos[i3];
        targets[i3 + 1] = HOVER_HEIGHT + hoverOffsets[i];
        targets[i3 + 2] = initialPos[i3 + 2];
        
        // 随机颜色
        const hue = 0.82 + Math.random() * 0.18;
        const saturation = 0.85 + Math.random() * 0.15;
        const lightness = 0.88 + Math.random() * 0.12;
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        targetColors[i3] = color.r;
        targetColors[i3 + 1] = color.g;
        targetColors[i3 + 2] = color.b;
      }
    };

    const setupYouCharacters = () => {
      if (!threeRef.current || !svgPathsRef.current) return;
      const { droneData } = threeRef.current;
      const { targets, targetColors } = droneData;
      
      const youPoints = svgPathsRef.current.you;
      let pointIndex = 0;
      const offsetX = 35;
      
      if (youPoints.length > 0) {
        // 左侧 "优"
        const leftCount = Math.min(Math.floor(DRONE_COUNT * 0.45), youPoints.length);
        for (let i = 0; i < leftCount && pointIndex < DRONE_COUNT; i++) {
          const i3 = pointIndex * 3;
          const srcIdx = Math.floor(i * youPoints.length / leftCount);
          const p = youPoints[srcIdx];
          targets[i3] = clamp(p.x - offsetX, -BOUNDS_X, BOUNDS_X);
          targets[i3 + 1] = clamp(p.y, -BOUNDS_Y, BOUNDS_Y);
          targets[i3 + 2] = clamp(p.z + (Math.random() - 0.5) * 2, -BOUNDS_Z, BOUNDS_Z);
          
          // 随机颜色
          const hue = 0.82 + Math.random() * 0.18;
          const saturation = 0.85 + Math.random() * 0.15;
          const lightness = 0.88 + Math.random() * 0.12;
          const color = new THREE.Color().setHSL(hue, saturation, lightness);
          targetColors[i3] = color.r;
          targetColors[i3 + 1] = color.g;
          targetColors[i3 + 2] = color.b;
          pointIndex++;
        }
        
        // 右侧 "优"
        const rightCount = Math.min(Math.floor(DRONE_COUNT * 0.45), youPoints.length);
        for (let i = 0; i < rightCount && pointIndex < DRONE_COUNT; i++) {
          const i3 = pointIndex * 3;
          const srcIdx = Math.floor(i * youPoints.length / rightCount);
          const p = youPoints[srcIdx];
          targets[i3] = clamp(p.x + offsetX, -BOUNDS_X, BOUNDS_X);
          targets[i3 + 1] = clamp(p.y, -BOUNDS_Y, BOUNDS_Y);
          targets[i3 + 2] = clamp(p.z + (Math.random() - 0.5) * 2, -BOUNDS_Z, BOUNDS_Z);
          
          // 随机颜色
          const hue = 0.82 + Math.random() * 0.18;
          const saturation = 0.85 + Math.random() * 0.15;
          const lightness = 0.88 + Math.random() * 0.12;
          const color = new THREE.Color().setHSL(hue, saturation, lightness);
          targetColors[i3] = color.r;
          targetColors[i3 + 1] = color.g;
          targetColors[i3 + 2] = color.b;
          pointIndex++;
        }
      }
      
      // 剩余无人机散布在周围
      for (let i = pointIndex; i < DRONE_COUNT; i++) {
        const i3 = i * 3;
        const angle = Math.random() * Math.PI * 2;
        const radius = 48 + Math.random() * 8;
        targets[i3] = clamp(Math.cos(angle) * radius, -BOUNDS_X, BOUNDS_X);
        targets[i3 + 1] = clamp((Math.random() - 0.5) * 12, -BOUNDS_Y, BOUNDS_Y);
        targets[i3 + 2] = clamp(Math.sin(angle) * radius * 0.3, -BOUNDS_Z, BOUNDS_Z);
        
        const hue = 0.82 + Math.random() * 0.18;
        const saturation = 0.8 + Math.random() * 0.2;
        const lightness = 0.85 + Math.random() * 0.15;
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        targetColors[i3] = color.r;
        targetColors[i3 + 1] = color.g;
        targetColors[i3 + 2] = color.b;
      }
    };

    const setupHeartAroundCard = () => {
      if (!threeRef.current) return;
      const { droneData } = threeRef.current;
      const { targets, targetColors } = droneData;
      
      // 心形围绕卡片展开，中心在原点，缩放更大
      const heartPoints = getHeartShape(4, 0, 5);
      
      for (let i = 0; i < DRONE_COUNT; i++) {
        const i3 = i * 3;
        if (i < heartPoints.length) {
          const point = heartPoints[i];
          targets[i3] = clamp(point.x, -BOUNDS_X, BOUNDS_X);
          targets[i3 + 1] = clamp(point.y, -BOUNDS_Y, BOUNDS_Y);
          targets[i3 + 2] = clamp(point.z, -BOUNDS_Z, BOUNDS_Z);
        } else {
          // 多余的无人机围绕心形外围散布
          const angle = Math.random() * Math.PI * 2;
          const radius = 55 + Math.random() * 8;
          targets[i3] = clamp(Math.cos(angle) * radius, -BOUNDS_X, BOUNDS_X);
          targets[i3 + 1] = clamp(5 + (Math.random() - 0.5) * 30, -BOUNDS_Y, BOUNDS_Y);
          targets[i3 + 2] = clamp(Math.sin(angle) * radius * 0.3, -BOUNDS_Z, BOUNDS_Z);
        }
        
        // 心形用粉红色调
        const hue = 0.92 + Math.random() * 0.08;
        const saturation = 0.9 + Math.random() * 0.1;
        const lightness = 0.88 + Math.random() * 0.12;
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        targetColors[i3] = color.r;
        targetColors[i3 + 1] = color.g;
        targetColors[i3 + 2] = color.b;
      }
    };

    const setupForever = () => {
      if (!threeRef.current || !svgPathsRef.current) return;
      const { droneData } = threeRef.current;
      const { targets, targetColors } = droneData;
      
      const points = svgPathsRef.current.forever;
      if (points.length > 0) {
        const useCount = Math.min(Math.floor(DRONE_COUNT * 0.9), points.length);
        for (let i = 0; i < DRONE_COUNT; i++) {
          const i3 = i * 3;
          if (i < useCount) {
            const srcIdx = Math.floor(i * points.length / useCount);
            const p = points[srcIdx];
            // 放在卡片上方，Y 坐标增加 25
            targets[i3] = clamp(p.x, -BOUNDS_X, BOUNDS_X);
            targets[i3 + 1] = clamp(p.y + 28, -BOUNDS_Y, BOUNDS_Y);
            targets[i3 + 2] = clamp(p.z, -BOUNDS_Z, BOUNDS_Z);
          } else {
            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * 8;
            targets[i3] = clamp(Math.cos(angle) * radius, -BOUNDS_X, BOUNDS_X);
            targets[i3 + 1] = clamp(28 + (Math.random() - 0.5) * 8, -BOUNDS_Y, BOUNDS_Y);
            targets[i3 + 2] = clamp(Math.sin(angle) * radius * 0.3, -BOUNDS_Z, BOUNDS_Z);
          }
          
          // 随机颜色，让每个无人机颜色略有不同
          const hue = 0.82 + Math.random() * 0.18;
          const saturation = 0.85 + Math.random() * 0.15;
          const lightness = 0.88 + Math.random() * 0.12;
          const color = new THREE.Color().setHSL(hue, saturation, lightness);
          targetColors[i3] = color.r;
          targetColors[i3 + 1] = color.g;
          targetColors[i3 + 2] = color.b;
        }
      }
    };

    const setupHappyEveryday = () => {
      if (!threeRef.current || !svgPathsRef.current) return;
      const { droneData } = threeRef.current;
      const { targets, targetColors } = droneData;
      
      const points = svgPathsRef.current.happy;
      
      if (points.length > 0) {
        const useCount = Math.min(Math.floor(DRONE_COUNT * 0.9), points.length);
        for (let i = 0; i < DRONE_COUNT; i++) {
          const i3 = i * 3;
          if (i < useCount) {
            const srcIdx = Math.floor(i * points.length / useCount);
            const p = points[srcIdx];
            // 放在卡片上方，Y 坐标增加 25
            targets[i3] = clamp(p.x, -BOUNDS_X, BOUNDS_X);
            targets[i3 + 1] = clamp(p.y + 28, -BOUNDS_Y, BOUNDS_Y);
            targets[i3 + 2] = clamp(p.z, -BOUNDS_Z, BOUNDS_Z);
            
            // 随机颜色
            const hue = 0.82 + Math.random() * 0.18;
            const saturation = 0.85 + Math.random() * 0.15;
            const lightness = 0.88 + Math.random() * 0.12;
            const color = new THREE.Color().setHSL(hue, saturation, lightness);
            targetColors[i3] = color.r;
            targetColors[i3 + 1] = color.g;
            targetColors[i3 + 2] = color.b;
          } else {
            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * 8;
            targets[i3] = clamp(Math.cos(angle) * radius, -BOUNDS_X, BOUNDS_X);
            targets[i3 + 1] = clamp(28 + (Math.random() - 0.5) * 15, -BOUNDS_Y, BOUNDS_Y);
            targets[i3 + 2] = clamp(Math.sin(angle) * radius * 0.3, -BOUNDS_Z, BOUNDS_Z);
            
            const hue = 0.82 + Math.random() * 0.18;
            const saturation = 0.8 + Math.random() * 0.2;
            const lightness = 0.85 + Math.random() * 0.15;
            const color = new THREE.Color().setHSL(hue, saturation, lightness);
            targetColors[i3] = color.r;
            targetColors[i3 + 1] = color.g;
            targetColors[i3 + 2] = color.b;
          }
        }
      }
    };

    const setupDescend = () => {
      if (!threeRef.current) return;
      const { droneData } = threeRef.current;
      const { targets, targetColors } = droneData;
      const initialPos = initialPositionsRef.current!;
      
      for (let i = 0; i < DRONE_COUNT; i++) {
        const i3 = i * 3;
        targets[i3] = initialPos[i3];
        targets[i3 + 1] = initialPos[i3 + 1];
        targets[i3 + 2] = initialPos[i3 + 2];
        
        // 随机颜色
        const hue = 0.82 + Math.random() * 0.18;
        const saturation = 0.85 + Math.random() * 0.15;
        const lightness = 0.88 + Math.random() * 0.12;
        const color = new THREE.Color().setHSL(hue, saturation, lightness);
        targetColors[i3] = color.r;
        targetColors[i3 + 1] = color.g;
        targetColors[i3 + 2] = color.b;
      }
    };

    const waitForArrival = (callback: () => void, timeout = 3000) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (checkAllArrived(threeRef.current!.droneData.targets, 1.5) || Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          callback();
        }
      }, 100);
    };

    // 完整序列：升空 → 优优 → 爱心 → FOREVER → HAPPY → 升空 → 下落 → 循环
    const sequences = [
      { setup: setupHover, duration: 2000 },           // 0: 升空悬停 - 固定2秒
      { setup: setupYouCharacters, duration: 2000 },   // 1: 优优 - 固定2秒
      { setup: setupHeartAroundCard, duration: 2000 }, // 2: 爱心 - 固定2秒
      { setup: setupForever, duration: 2000 },         // 3: FOREVER - 固定2秒
      { setup: setupHappyEveryday, duration: 2000 },   // 4: HAPPY - 固定2秒
      { setup: setupHover, duration: 2000 },           // 5: 再次升空悬停 - 固定2秒
      { setup: setupDescend, duration: 2000 }          // 6: 下落到初始位置 - 固定2秒
    ];

    const playSequence = (index: number) => {
      // 循环回到开头（从升空开始）
      if (index >= sequences.length) {
        stageRef.current = 0;
        playSequence(0);
        return;
      }
      
      sequences[index].setup();
      
      if (timelineRef.current) timelineRef.current.kill();
      
      // 固定等待时间：飞行时间 + 悬停时间
      const flyTime = 2500; // 飞行到位时间（毫秒）
      const holdTime = sequences[index].duration; // 悬停时间（毫秒）
      
      timelineRef.current = gsap.delayedCall((flyTime + holdTime) / 1000, () => {
        stageRef.current = index + 1;
        playSequence(stageRef.current);
      });
    };

    // 预加载SVG，带错误处理
    Promise.all([
      loadSVGPath("/you.svg", 4.5),
      loadSVGPath("/FOREVER.svg", 3),
      loadSVGPath("/HAPPY.svg", 2.8)
    ])
    .then(([you, forever, happy]) => {
      svgPathsRef.current = { you, forever, happy };
      // 先运行初始化动画（逐排点亮），完成后开始主序列
      runInitAnimation(() => {
        playSequence(0);
      });
    })
    .catch(error => {
      console.error('Error loading SVGs:', error);
      // 即使加载失败也继续运行基本动画
      runInitAnimation(() => {
        playSequence(0);
      });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationIdRef.current);
      if (timelineRef.current) timelineRef.current.kill();
      if (threeRef.current?.renderer && containerRef.current) {
        containerRef.current.removeChild(threeRef.current.renderer.domElement);
        threeRef.current.renderer.dispose();
      }
      threeRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none"
      }}
    />
  );
}