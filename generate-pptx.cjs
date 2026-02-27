#!/usr/bin/env node
// UGV Robot System Architecture Presentation Generator
// Dark theme, Korean, 16 slides
// Merged: system architecture + serial protocol deep-dive

const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

pres.layout = "LAYOUT_16x9";
pres.author = "";
pres.title = "UGV 로봇 시스템 아키텍처";

// ── Color Palette (Dark Robotics Theme) ──
const C = {
  bg:       "0F1923",   // deep dark blue
  bgAlt:    "162030",   // slightly lighter
  card:     "1C2940",   // card surface
  accent:   "00D4AA",   // teal/mint
  accent2:  "3B82F6",   // blue
  accent3:  "F59E0B",   // amber
  warn:     "EF4444",   // red
  green:    "22C55E",   // green
  text:     "E2E8F0",   // light gray
  textDim:  "94A3B8",   // muted gray
  border:   "2A3A50",   // border
  mono:     "CBD5E1",   // monospace text
  white:    "FFFFFF",
  purple:   "A855F7",   // purple
};

const FONT = { head: "Calibri", body: "Calibri", mono: "Consolas" };
const TOTAL = 16;

// ── Helpers ──
function addSlideNumber(slide, num) {
  slide.addText(`${num} / ${TOTAL}`, {
    x: 8.8, y: 5.2, w: 1, h: 0.35,
    fontSize: 9, fontFace: FONT.body,
    color: C.textDim, align: "right",
  });
}

function addSectionTitle(slide, title, opts = {}) {
  slide.addText(title, {
    x: opts.x || 0.6, y: opts.y || 0.3, w: opts.w || 8.8, h: 0.55,
    fontSize: 28, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });
}

function addCard(slide, x, y, w, h) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: C.card },
    line: { color: C.border, width: 1 },
    shadow: { type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.3 },
  });
}

function addCardTitle(slide, text, x, y, w) {
  slide.addText(text, {
    x: x + 0.15, y, w: w - 0.3, h: 0.35,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 1: Title
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };

  // Top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.accent },
  });

  // Decorative circuit-like lines
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 1.5, w: 0.04, h: 2.8,
    fill: { color: C.border },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.0, w: 0.6, h: 0.04,
    fill: { color: C.border },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.2, w: 0.4, h: 0.04,
    fill: { color: C.border },
  });

  // Small accent dots
  slide.addShape(pres.shapes.OVAL, {
    x: 0.52, y: 1.92, w: 0.2, h: 0.2,
    fill: { color: C.accent },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 0.52, y: 3.12, w: 0.2, h: 0.2,
    fill: { color: C.accent2 },
  });

  // Title
  slide.addText("UGV 로봇 시스템\n아키텍처", {
    x: 1.5, y: 1.2, w: 7.5, h: 2.2,
    fontSize: 42, fontFace: FONT.head, bold: true,
    color: C.white, margin: 0,
    lineSpacingMultiple: 1.1,
  });

  // Subtitle
  slide.addText("Waveshare WAVE ROVER + RoArm-M2", {
    x: 1.5, y: 3.4, w: 7.5, h: 0.5,
    fontSize: 18, fontFace: FONT.body,
    color: C.accent, margin: 0,
  });

  // Bottom info bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.95, w: 10, h: 0.68,
    fill: { color: C.bgAlt },
  });
  slide.addText("ROS 2 Humble  |  Raspberry Pi 4  |  ESP32  |  LD19 LiDAR  |  CycloneDDS", {
    x: 0.6, y: 5.0, w: 8.8, h: 0.5,
    fontSize: 13, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 2: System Overview
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "시스템 개요");
  addSlideNumber(slide, 2);

  // Left description card
  addCard(slide, 0.6, 1.05, 4.6, 4.0);
  slide.addText("WAVE ROVER + RoArm-M2", {
    x: 0.8, y: 1.15, w: 4.2, h: 0.4,
    fontSize: 16, fontFace: FONT.head, bold: true,
    color: C.white, margin: 0,
  });
  slide.addText([
    { text: "4WD 모바일 플랫폼 (WAVE ROVER) 위에 4축 로봇팔 (RoArm-M2)을 탑재한 UGV 시스템", options: { breakLine: true, fontSize: 13 } },
    { text: "", options: { breakLine: true, fontSize: 8 } },
    { text: "핵심 특징:", options: { breakLine: true, fontSize: 13, bold: true, color: C.accent } },
    { text: "ROS 2 Humble 기반 통합 제어", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "CycloneDDS로 RPi ↔ WSL 멀티호스트 통신", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "rf2o LiDAR 스캔 기반 오도메트리", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "Cartographer SLAM 맵핑", options: { bullet: true, breakLine: true, fontSize: 12 } },
    { text: "RViz2로 실시간 시각화 (WSL)", options: { bullet: true, fontSize: 12 } },
  ], {
    x: 0.8, y: 1.65, w: 4.2, h: 3.2,
    color: C.text, fontFace: FONT.body,
    valign: "top", margin: 0,
    paraSpaceAfter: 4,
  });

  // Right component cards
  const components = [
    { name: "WAVE ROVER", desc: "4WD 이동 플랫폼\nDC 모터 x4, IMU, 전압 센서", color: C.accent },
    { name: "RoArm-M2", desc: "4축 로봇팔\nBase/Shoulder/Elbow/Gripper", color: C.accent2 },
    { name: "Raspberry Pi 4", desc: "메인 컨트롤러\nROS 2 실행, Wi-Fi 통신", color: C.accent3 },
    { name: "LD19 LiDAR", desc: "360° 2D 레이저 스캐너\n12m 범위, 10Hz", color: C.green },
  ];
  components.forEach((c, i) => {
    const cy = 1.05 + i * 1.0;
    addCard(slide, 5.5, cy, 3.9, 0.88);
    // Accent dot
    slide.addShape(pres.shapes.OVAL, {
      x: 5.7, y: cy + 0.18, w: 0.18, h: 0.18,
      fill: { color: c.color },
    });
    slide.addText(c.name, {
      x: 6.0, y: cy + 0.1, w: 3.2, h: 0.3,
      fontSize: 13, fontFace: FONT.head, bold: true,
      color: C.white, margin: 0,
    });
    slide.addText(c.desc, {
      x: 6.0, y: cy + 0.42, w: 3.2, h: 0.4,
      fontSize: 10, fontFace: FONT.body,
      color: C.textDim, margin: 0,
    });
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 3: Hardware Connection Diagram
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "하드웨어 연결 구조");
  addSlideNumber(slide, 3);

  // Subtitle
  slide.addText("UART 115200 baud  •  USB  •  Wi-Fi (CycloneDDS)  •  I2C 400kHz", {
    x: 0.6, y: 0.72, w: 6, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Top card: Communication connections
  addCard(slide, 0.4, 0.95, 9.2, 2.15);
  slide.addText("통신 연결", {
    x: 0.6, y: 1.05, w: 2.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });

  const commDiagram = [
    "┌────────────────────────── Raspberry Pi 4B ──────────────────────────┐",
    "│                                                                      │",
    "│  /dev/ttyAMA0 (UART) ───── ESP32 (WAVE ROVER Driver Board)         │",
    "│                              ├── DC 모터 x4 (PWM)                   │",
    "│                              ├── IMU ICM-20948 (I2C)                │",
    "│                              └── 전압 센서 INA219 (I2C)             │",
    "│                                                                      │",
    "│  /dev/ttyUSB0 (USB)  ───── ESP32 (RoArm-M2)                        │",
    "│                              └── 버스 서보 x4 (데이지 체인) + LED   │",
    "│                                                                      │",
    "│  /dev/ttyUSB1 (USB)  ───── LD19 LiDAR (360° 2D)                    │",
    "│                                                                      │",
    "│  Wi-Fi (192.168.0.71) ──── CycloneDDS (ROS 2 DDS 멀티호스트)       │",
    "└──────────────────────────────────────────────────────────────────────┘",
  ];

  slide.addText(commDiagram.join("\n"), {
    x: 0.6, y: 1.3, w: 8.8, h: 1.7,
    fontSize: 9.5, fontFace: FONT.mono,
    color: C.mono, margin: [2, 10, 2, 10],
    valign: "middle",
  });

  // Bottom left card: Power distribution
  addCard(slide, 0.4, 3.3, 4.4, 1.85);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.3, w: 4.4, h: 0.06,
    fill: { color: C.accent3 },
  });
  slide.addText("전원 분배", {
    x: 0.6, y: 3.4, w: 2.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent3, margin: 0,
  });

  const powerDiagram = [
    "WAVE ROVER 배터리 (Li-ion)",
    " ├── Driver Board (ESP32 + 모터 드라이버)",
    " │    ├── DC 모터 x4 (PWM 구동)",
    " │    ├── IMU + INA219 (I2C, 3.3V)",
    " │    └── LED IO4/IO5 (PWM 0-255)",
    " ├── RPi 4B (5V 레귤레이터 공급)",
    " │    ├── USB → RoArm ESP32 (전원+데이터)",
    " │    └── USB → LD19 LiDAR (전원+데이터)",
    " └── INA219로 배터리 전압/전류 모니터링",
  ];

  slide.addText(powerDiagram.join("\n"), {
    x: 0.6, y: 3.75, w: 4.0, h: 1.3,
    fontSize: 9.5, fontFace: FONT.mono,
    color: C.mono, margin: 0,
  });

  // Bottom right card: Pin wiring
  addCard(slide, 5.2, 3.3, 4.4, 1.85);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.3, w: 4.4, h: 0.06,
    fill: { color: C.accent2 },
  });
  slide.addText("핀 배선 (RPi GPIO ↔ ESP32 UART)", {
    x: 5.4, y: 3.4, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });

  const pinRows = [
    [
      { text: "RPi GPIO", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 10 } },
      { text: "", options: { bold: true, fill: { color: C.bgAlt }, fontSize: 10 } },
      { text: "ESP32", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 10 } },
      { text: "용도", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 10 } },
    ],
    [
      { text: "GPIO 14 (TXD)", options: { fontFace: FONT.mono, fontSize: 9.5 } },
      { text: "→", options: { fontSize: 10, align: "center" } },
      { text: "RX", options: { fontFace: FONT.mono, fontSize: 9.5 } },
      { text: "명령 전송 (T:13)", options: { fontSize: 9.5 } },
    ],
    [
      { text: "GPIO 15 (RXD)", options: { fontFace: FONT.mono, fontSize: 9.5 } },
      { text: "←", options: { fontSize: 10, align: "center" } },
      { text: "TX", options: { fontFace: FONT.mono, fontSize: 9.5 } },
      { text: "피드백 수신 (T:1001)", options: { fontSize: 9.5 } },
    ],
    [
      { text: "GND", options: { fontFace: FONT.mono, fontSize: 9.5 } },
      { text: "↔", options: { fontSize: 10, align: "center" } },
      { text: "GND", options: { fontFace: FONT.mono, fontSize: 9.5 } },
      { text: "공통 접지", options: { fontSize: 9.5 } },
    ],
  ];

  slide.addTable(pinRows, {
    x: 5.4, y: 3.8, w: 4.0, h: 1.0,
    colW: [1.4, 0.3, 0.5, 1.8],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 10,
    margin: [3, 5, 3, 5],
  });

  slide.addText("115200 baud  •  8N1  •  JSON 프로토콜", {
    x: 5.4, y: 4.85, w: 4.0, h: 0.2,
    fontSize: 10, fontFace: FONT.mono,
    color: C.textDim, margin: 0,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 4: Serial Protocol
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "시리얼 통신 프로토콜");
  addSlideNumber(slide, 4);

  // Format info
  slide.addText("JSON 형식  •  115200 baud", {
    x: 0.6, y: 0.72, w: 4, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Left card: Wheels ESP32
  addCard(slide, 0.4, 1.1, 4.4, 3.95);
  slide.addText("ESP32 바퀴 제어  (ttyAMA0)", {
    x: 0.6, y: 1.2, w: 4.0, h: 0.35,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });

  const wheelRows = [
    [
      { text: "명령", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent } },
      { text: "설명", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent } },
    ],
    [
      { text: "T:13", options: { fontFace: FONT.mono, fontSize: 11 } },
      { text: "모터 속도 명령 (cmd_vel → 좌/우 바퀴 속도)", options: { fontSize: 11 } },
    ],
    [
      { text: "T:1001", options: { fontFace: FONT.mono, fontSize: 11 } },
      { text: "센서 피드백 (IMU roll/pitch/yaw, 전압, 엔코더 L/R)", options: { fontSize: 11 } },
    ],
  ];
  slide.addTable(wheelRows, {
    x: 0.6, y: 1.65, w: 4.0, h: 1.2,
    colW: [1.0, 3.0],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 11,
    margin: [4, 6, 4, 6],
  });

  slide.addText([
    { text: "※ WAVE ROVER는 엔코더 없음", options: { breakLine: true, bold: true, color: C.accent3 } },
    { text: "   → L, R 값 항상 0 (위치 추정 불가)", options: { breakLine: true } },
    { text: "   → rf2o LiDAR 스캔 매칭으로 위치 추정", options: {} },
  ], {
    x: 0.6, y: 3.2, w: 4.0, h: 1.4,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 4,
  });

  // Right card: Arm ESP32
  addCard(slide, 5.2, 1.1, 4.4, 3.95);
  slide.addText("ESP32 로봇팔  (ttyUSB0)", {
    x: 5.4, y: 1.2, w: 4.0, h: 0.35,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });

  const armRows = [
    [
      { text: "명령", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2 } },
      { text: "설명", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2 } },
    ],
    [
      { text: "T:102", options: { fontFace: FONT.mono, fontSize: 11 } },
      { text: "관절 이동 명령 (Base/Shoulder/Elbow/Gripper)", options: { fontSize: 11 } },
    ],
    [
      { text: "T:105", options: { fontFace: FONT.mono, fontSize: 11 } },
      { text: "관절 피드백 요청 → T:1051 응답 (b/s/e/t 필드)", options: { fontSize: 11 } },
    ],
    [
      { text: "T:106", options: { fontFace: FONT.mono, fontSize: 11 } },
      { text: "그리퍼 열기/닫기 명령", options: { fontSize: 11 } },
    ],
  ];
  slide.addTable(armRows, {
    x: 5.4, y: 1.65, w: 4.0, h: 1.5,
    colW: [1.0, 3.0],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 11,
    margin: [4, 6, 4, 6],
  });

  slide.addText([
    { text: "피드백 응답 형식:", options: { breakLine: true, bold: true, color: C.accent2 } },
    { text: '  {"T":1051,"b":0,"s":45,"e":-30,', options: { breakLine: true, fontFace: FONT.mono, fontSize: 10, color: C.mono } },
    { text: '   "t":0,"x":235,"y":0,"z":155}', options: { fontFace: FONT.mono, fontSize: 10, color: C.mono } },
  ], {
    x: 5.4, y: 3.4, w: 4.0, h: 1.2,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 4,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 5: JSON over Serial — Design Background
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "JSON over Serial — 왜 이 방식인가?");
  addSlideNumber(slide, 5);

  slide.addText("Waveshare ESP32 펌웨어 설계 의도", {
    x: 0.6, y: 0.72, w: 6, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Left: Original design (Wi-Fi)
  addCard(slide, 0.4, 1.05, 4.4, 2.0);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.accent2 },
  });
  slide.addText("원래 설계: ESP32 자체 웹 서버", {
    x: 0.6, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });

  const webDiagram = [
    "┌──────────┐   HTTP/WS   ┌───────────┐",
    "│ 브라우저  │ ──────────→ │ ESP32     │",
    "│ (Wi-Fi)  │   JSON      │ 웹 서버   │",
    "└──────────┘             │ + 모터/서보│",
    "                          └───────────┘",
  ];
  slide.addText(webDiagram.join("\n"), {
    x: 0.6, y: 1.55, w: 4.0, h: 1.2,
    fontSize: 10.5, fontFace: FONT.mono,
    color: C.mono, margin: [2, 5, 2, 5],
    valign: "middle",
  });

  slide.addText("→ Wi-Fi 웹 UI에서 JSON은 자연스러운 선택", {
    x: 0.6, y: 2.72, w: 4.0, h: 0.25,
    fontSize: 10, fontFace: FONT.body, italic: true,
    color: C.accent2, margin: 0,
  });

  // Right: Current structure (UART)
  addCard(slide, 5.2, 1.05, 4.4, 2.0);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.accent },
  });
  slide.addText("현재 구조: RPi → UART → ESP32", {
    x: 5.4, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });

  const uartDiagram = [
    "┌──────────┐  UART 115200 ┌───────────┐",
    "│ RPi 4B   │ ───────────→ │ ESP32     │",
    "│ (ROS 2)  │  JSON 텍스트 │ 같은 펌웨어│",
    "└──────────┘              │ + 모터/서보│",
    "                           └───────────┘",
  ];
  slide.addText(uartDiagram.join("\n"), {
    x: 5.4, y: 1.55, w: 4.0, h: 1.2,
    fontSize: 10.5, fontFace: FONT.mono,
    color: C.mono, margin: [2, 5, 2, 5],
    valign: "middle",
  });

  slide.addText("→ 웹용 JSON 파서를 시리얼에도 그대로 재사용", {
    x: 5.4, y: 2.72, w: 4.0, h: 0.25,
    fontSize: 10, fontFace: FONT.body, italic: true,
    color: C.accent, margin: 0,
  });

  // Bottom: 3 reason cards
  const reasons = [
    {
      title: "펌웨어 통일",
      desc: "웹/시리얼 양쪽에서\n같은 JSON 파서 하나로 처리\n→ 개발·유지보수 비용 절감",
      color: C.accent3,
    },
    {
      title: "디버깅 용이성",
      desc: "시리얼 모니터에서\nJSON 텍스트 직접 확인 가능\n→ 교육/메이커 제품에 적합",
      color: C.green,
    },
    {
      title: "충분한 성능",
      desc: "115200 baud에서\n모터 명령 10~20Hz는 여유\n→ 실시간 제어에 문제 없음",
      color: C.accent2,
    },
  ];

  reasons.forEach((r, i) => {
    const rx = 0.4 + i * 3.15;
    addCard(slide, rx, 3.25, 2.95, 1.85);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: rx, y: 3.25, w: 2.95, h: 0.06,
      fill: { color: r.color },
    });
    slide.addShape(pres.shapes.OVAL, {
      x: rx + 0.15, y: 3.4, w: 0.22, h: 0.22,
      fill: { color: r.color },
    });
    slide.addText(String(i + 1), {
      x: rx + 0.15, y: 3.39, w: 0.22, h: 0.22,
      fontSize: 11, fontFace: FONT.head, bold: true,
      color: C.bg, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(r.title, {
      x: rx + 0.45, y: 3.37, w: 2.3, h: 0.3,
      fontSize: 14, fontFace: FONT.head, bold: true,
      color: r.color, margin: 0,
    });
    slide.addText(r.desc, {
      x: rx + 0.15, y: 3.75, w: 2.65, h: 1.2,
      fontSize: 11, fontFace: FONT.body,
      color: C.text, margin: 0,
    });
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 6: JSON vs Modbus RTU
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "JSON vs Modbus RTU 프로토콜 비교");
  addSlideNumber(slide, 6);

  slide.addText("시리얼 통신에서의 데이터 포맷 선택", {
    x: 0.6, y: 0.72, w: 6, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Left: JSON
  addCard(slide, 0.4, 1.05, 4.4, 2.65);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.accent },
  });
  slide.addText("JSON over UART (본 시스템)", {
    x: 0.6, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });

  slide.addText('{"T":13,"L":100,"R":100}\\n', {
    x: 0.6, y: 1.58, w: 4.0, h: 0.35,
    fontSize: 12.5, fontFace: FONT.mono, bold: true,
    color: C.accent3, margin: [4, 8, 4, 8],
    fill: { color: C.bgAlt },
  });

  slide.addText([
    { text: "25 바이트  •  줄바꿈(\\n)으로 프레임 구분", options: { breakLine: true, color: C.textDim, fontSize: 9.5 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "텍스트 기반 — 사람이 즉시 읽기 가능", options: { bullet: true, breakLine: true } },
    { text: "필드명 포함 — 별도 문서 없이 의미 파악", options: { bullet: true, breakLine: true } },
    { text: "유연한 구조 — 필드 추가/삭제 자유로움", options: { bullet: true, breakLine: true } },
    { text: "에러 검출 없음 (체크섬/CRC 미지원)", options: { bullet: true, breakLine: true, color: C.accent3 } },
    { text: "파싱 오버헤드 (문자열→숫자 변환 필요)", options: { bullet: true, color: C.accent3 } },
  ], {
    x: 0.6, y: 2.0, w: 4.0, h: 1.55,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 2,
  });

  // Right: Modbus RTU
  addCard(slide, 5.2, 1.05, 4.4, 2.65);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.purple },
  });
  slide.addText("Modbus RTU (산업 표준)", {
    x: 5.4, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.purple, margin: 0,
  });

  slide.addText("[01] [06] [00 0D] [00 64] [98 08]", {
    x: 5.4, y: 1.58, w: 4.0, h: 0.35,
    fontSize: 12.5, fontFace: FONT.mono, bold: true,
    color: C.accent3, margin: [4, 8, 4, 8],
    fill: { color: C.bgAlt },
  });

  slide.addText([
    { text: "8 바이트  •  3.5문자 무음 구간으로 프레임 구분", options: { breakLine: true, color: C.textDim, fontSize: 9.5 } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "국제 표준 (IEC 61158) — 기기 간 호환성", options: { bullet: true, breakLine: true } },
    { text: "CRC-16 체크섬 — 전송 에러 검출 가능", options: { bullet: true, breakLine: true } },
    { text: "마스터-슬레이브 구조 — 다중 장치 제어", options: { bullet: true, breakLine: true } },
    { text: "사람이 읽을 수 없음 (헥스 분석 필요)", options: { bullet: true, breakLine: true, color: C.accent3 } },
    { text: "고정 레지스터 맵 — 구조 변경 어려움", options: { bullet: true, color: C.accent3 } },
  ], {
    x: 5.4, y: 2.0, w: 4.0, h: 1.55,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 2,
  });

  // Bottom: Comparison table
  addCard(slide, 0.4, 3.9, 9.2, 1.25);
  slide.addText("비교 요약", {
    x: 0.6, y: 3.98, w: 2.0, h: 0.25,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.white, margin: 0,
  });

  const compareRows = [
    [
      { text: "항목", options: { bold: true, fill: { color: C.bgAlt }, color: C.white, fontSize: 10 } },
      { text: "JSON over UART (본 시스템)", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent, fontSize: 10 } },
      { text: "Modbus RTU (산업 표준)", options: { bold: true, fill: { color: C.bgAlt }, color: C.purple, fontSize: 10 } },
    ],
    [
      { text: "데이터 포맷", options: { fontSize: 9.5 } },
      { text: "텍스트 (ASCII JSON)", options: { fontSize: 9.5 } },
      { text: "바이너리 (고정 프레임)", options: { fontSize: 9.5 } },
    ],
    [
      { text: "에러 검출", options: { fontSize: 9.5 } },
      { text: "없음", options: { fontSize: 9.5, color: C.accent3 } },
      { text: "CRC-16 체크섬", options: { fontSize: 9.5, color: C.green } },
    ],
    [
      { text: "다중 장치", options: { fontSize: 9.5 } },
      { text: "포트별 1:1 연결", options: { fontSize: 9.5 } },
      { text: "버스 공유 (ID로 구분, 최대 247대)", options: { fontSize: 9.5, color: C.green } },
    ],
    [
      { text: "디버깅", options: { fontSize: 9.5 } },
      { text: "시리얼 모니터로 즉시 확인", options: { fontSize: 9.5, color: C.green } },
      { text: "전용 도구 필요 (Modbus Poll 등)", options: { fontSize: 9.5, color: C.accent3 } },
    ],
    [
      { text: "적용 분야", options: { fontSize: 9.5 } },
      { text: "교육/메이커, 웹 연동 IoT", options: { fontSize: 9.5 } },
      { text: "공장 자동화, PLC, 산업용 센서", options: { fontSize: 9.5 } },
    ],
  ];

  slide.addTable(compareRows, {
    x: 0.6, y: 4.22, w: 8.8, h: 0.85,
    colW: [1.3, 3.75, 3.75],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 10,
    margin: [2, 5, 2, 5],
    autoPage: false,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 7: Multi-AMR Modbus Architecture
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "다중 AMR 시스템 — Modbus 적용 구조");
  addSlideNumber(slide, 7);

  slide.addText("로봇 내부 RS-485 버스 + 로봇 간 Modbus TCP/IP", {
    x: 0.6, y: 0.72, w: 7, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Left: Internal (Modbus RTU over RS-485)
  addCard(slide, 0.4, 1.05, 4.4, 2.55);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.accent3 },
  });
  slide.addText("로봇 1대 내부: Modbus RTU (RS-485)", {
    x: 0.6, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent3, margin: 0,
  });

  const internalDiagram = [
    "RPi (Master)",
    " │  RS-485 버스 (1개 배선으로 공유)",
    " │",
    " ├── 모터 드라이버   (Slave ID: 1)",
    " ├── 로봇팔 컨트롤러 (Slave ID: 2)",
    " ├── IMU 센서        (Slave ID: 3)",
    " └── 전압 센서       (Slave ID: 4)",
  ];
  slide.addText(internalDiagram.join("\n"), {
    x: 0.6, y: 1.55, w: 4.0, h: 1.85,
    fontSize: 10.5, fontFace: FONT.mono,
    color: C.mono, margin: [2, 5, 2, 5],
    valign: "middle",
  });

  slide.addText("→ 1:1 연결 대신 하나의 버스에 최대 247개 장치 연결", {
    x: 0.6, y: 3.3, w: 4.0, h: 0.22,
    fontSize: 9.5, fontFace: FONT.body, italic: true,
    color: C.accent3, margin: 0,
  });

  // Right: Fleet (Modbus TCP/IP)
  addCard(slide, 5.2, 1.05, 4.4, 2.55);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.purple },
  });
  slide.addText("다중 로봇 간: Modbus TCP/IP", {
    x: 5.4, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.purple, margin: 0,
  });

  const fleetDiagram = [
    "┌───────────────────────────┐",
    "│  중앙 관제 서버 (Master)   │",
    "│  Modbus TCP Client        │",
    "└───┬────────┬────────┬─────┘",
    "    │TCP/IP  │TCP/IP  │TCP/IP",
    " ┌──┴──┐ ┌──┴──┐ ┌──┴──┐",
    " │AMR 1│ │AMR 2│ │AMR 3│",
    " │:502 │ │:502 │ │:502 │",
    " └──┬──┘ └──┬──┘ └──┬──┘",
    "  RS-485   RS-485   RS-485",
  ];
  slide.addText(fleetDiagram.join("\n"), {
    x: 5.4, y: 1.52, w: 4.0, h: 1.95,
    fontSize: 9.5, fontFace: FONT.mono,
    color: C.mono, margin: [2, 5, 2, 5],
    valign: "middle",
  });

  slide.addText("→ 각 AMR이 TCP 서버(포트 502)로 동작, 관제서버가 접속", {
    x: 5.4, y: 3.3, w: 4.0, h: 0.22,
    fontSize: 9.5, fontFace: FONT.body, italic: true,
    color: C.purple, margin: 0,
  });

  // Bottom: Register map
  addCard(slide, 0.4, 3.7, 9.2, 1.45);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.7, w: 9.2, h: 0.06,
    fill: { color: C.accent2 },
  });
  slide.addText("Modbus 레지스터 맵 설계 예시", {
    x: 0.6, y: 3.8, w: 4.0, h: 0.25,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });

  const regRows = [
    [
      { text: "Slave", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 9.5 } },
      { text: "레지스터", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 9.5 } },
      { text: "내용", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 9.5 } },
      { text: "Slave", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 9.5 } },
      { text: "레지스터", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 9.5 } },
      { text: "내용", options: { bold: true, fill: { color: C.bgAlt }, color: C.accent2, fontSize: 9.5 } },
    ],
    [
      { text: "ID:1", options: { fontFace: FONT.mono, fontSize: 9, color: C.accent3 } },
      { text: "0x0000", options: { fontFace: FONT.mono, fontSize: 9 } },
      { text: "좌측 모터 속도 (R/W)", options: { fontSize: 9 } },
      { text: "ID:2", options: { fontFace: FONT.mono, fontSize: 9, color: C.accent3 } },
      { text: "0x0000", options: { fontFace: FONT.mono, fontSize: 9 } },
      { text: "Base 각도 (R/W)", options: { fontSize: 9 } },
    ],
    [
      { text: "모터", options: { fontSize: 9, color: C.textDim } },
      { text: "0x0001", options: { fontFace: FONT.mono, fontSize: 9 } },
      { text: "우측 모터 속도 (R/W)", options: { fontSize: 9 } },
      { text: "로봇팔", options: { fontSize: 9, color: C.textDim } },
      { text: "0x0001", options: { fontFace: FONT.mono, fontSize: 9 } },
      { text: "Shoulder 각도 (R/W)", options: { fontSize: 9 } },
    ],
    [
      { text: "", options: { fontSize: 9 } },
      { text: "0x0002", options: { fontFace: FONT.mono, fontSize: 9 } },
      { text: "좌측 엔코더 값 (R)", options: { fontSize: 9 } },
      { text: "", options: { fontSize: 9 } },
      { text: "0x0002", options: { fontFace: FONT.mono, fontSize: 9 } },
      { text: "Elbow 각도 (R/W)", options: { fontSize: 9 } },
    ],
  ];

  slide.addTable(regRows, {
    x: 0.6, y: 4.1, w: 8.8, h: 0.95,
    colW: [0.6, 0.85, 2.0, 0.6, 0.85, 2.0],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 9,
    margin: [2, 4, 2, 4],
    autoPage: false,
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.99, y: 4.1, w: 0.02, h: 0.95,
    fill: { color: C.accent2 },
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 8: Modbus Limitations & Real Multi-AMR
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "Modbus의 한계와 실제 다중 AMR 통신");
  addSlideNumber(slide, 8);

  slide.addText("왜 산업 현장에서는 Modbus만으로 다중 AMR을 운영하지 않는가?", {
    x: 0.6, y: 0.72, w: 8.0, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Left: Modbus limitations
  addCard(slide, 0.4, 1.05, 4.4, 2.15);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.warn },
  });
  slide.addText("Modbus의 구조적 한계", {
    x: 0.6, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.warn, margin: 0,
  });

  slide.addText([
    { text: "폴링 방식", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ 마스터가 매번 요청해야 함, 로봇 수 ↑ 지연 ↑", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "", options: { breakLine: true, fontSize: 3 } },
    { text: "이벤트 발행 불가", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ \"장애물 발견\" 같은 긴급 알림을 스스로 보낼 수 없음", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "", options: { breakLine: true, fontSize: 3 } },
    { text: "로봇 간 직접 통신 불가", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ 항상 마스터(관제서버)를 경유해야 함", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "", options: { breakLine: true, fontSize: 3 } },
    { text: "대용량 데이터 전송 불가", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ LiDAR 포인트클라우드, 카메라 영상 등 처리 불가", options: { color: C.textDim, fontSize: 10 } },
  ], {
    x: 0.6, y: 1.55, w: 4.0, h: 1.55,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 1,
  });

  // Right: Real architecture
  addCard(slide, 5.2, 1.05, 4.4, 2.15);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.green },
  });
  slide.addText("실제 다중 AMR 통신 아키텍처", {
    x: 5.4, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.green, margin: 0,
  });

  const realArch = [
    "┌──────────────────────────┐",
    "│  Fleet Manager (관제)     │",
    "│  REST API + MQTT Broker  │",
    "└───┬────────┬────────┬────┘",
    "    │ MQTT   │ MQTT   │ MQTT",
    " ┌──┴───┐┌──┴───┐┌──┴───┐",
    " │AMR #1││AMR #2││AMR #3│",
    " │ROS 2 ││ROS 2 ││ROS 2 │",
    " └──┬───┘└──┬───┘└──┬───┘",
    " Modbus  Modbus  Modbus",
    " (내부)  (내부)  (내부)",
  ];
  slide.addText(realArch.join("\n"), {
    x: 5.4, y: 1.52, w: 4.0, h: 1.58,
    fontSize: 9.5, fontFace: FONT.mono,
    color: C.mono, margin: [0, 5, 0, 5],
    valign: "middle",
  });

  // Bottom: Protocol role table
  addCard(slide, 0.4, 3.4, 9.2, 1.75);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.4, w: 9.2, h: 0.06,
    fill: { color: C.accent },
  });
  slide.addText("계층별 통신 프로토콜 역할 분담", {
    x: 0.6, y: 3.52, w: 5.0, h: 0.25,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });

  const protoRows = [
    [
      { text: "계층", options: { bold: true, fill: { color: C.bgAlt }, color: C.white, fontSize: 10 } },
      { text: "프로토콜", options: { bold: true, fill: { color: C.bgAlt }, color: C.white, fontSize: 10 } },
      { text: "역할", options: { bold: true, fill: { color: C.bgAlt }, color: C.white, fontSize: 10 } },
      { text: "특징", options: { bold: true, fill: { color: C.bgAlt }, color: C.white, fontSize: 10 } },
    ],
    [
      { text: "하드웨어", options: { fontSize: 10, bold: true, color: C.accent3 } },
      { text: "Modbus RTU", options: { fontSize: 10, fontFace: FONT.mono } },
      { text: "모터, 센서 저수준 제어", options: { fontSize: 10 } },
      { text: "로봇 내부에서만 사용", options: { fontSize: 10, color: C.textDim } },
    ],
    [
      { text: "로봇 내부", options: { fontSize: 10, bold: true, color: C.accent2 } },
      { text: "ROS 2 DDS", options: { fontSize: 10, fontFace: FONT.mono } },
      { text: "노드 간 토픽/서비스 통신", options: { fontSize: 10 } },
      { text: "Pub/Sub, 실시간, 대용량", options: { fontSize: 10, color: C.textDim } },
    ],
    [
      { text: "로봇 ↔ 서버", options: { fontSize: 10, bold: true, color: C.green } },
      { text: "MQTT", options: { fontSize: 10, fontFace: FONT.mono } },
      { text: "상태 보고, 이벤트 알림", options: { fontSize: 10 } },
      { text: "경량, 이벤트 기반, 수천 대 확장", options: { fontSize: 10, color: C.textDim } },
    ],
    [
      { text: "관제 시스템", options: { fontSize: 10, bold: true, color: C.purple } },
      { text: "REST API", options: { fontSize: 10, fontFace: FONT.mono } },
      { text: "미션/태스크 할당·관리", options: { fontSize: 10 } },
      { text: "표준 HTTP, 웹 연동 용이", options: { fontSize: 10, color: C.textDim } },
    ],
  ];

  slide.addTable(protoRows, {
    x: 0.6, y: 3.82, w: 8.8, h: 1.25,
    colW: [1.2, 1.4, 2.8, 3.4],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 10,
    margin: [3, 5, 3, 5],
    autoPage: false,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 9: ROS 2 Node Structure
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "ROS 2 노드 구조");
  addSlideNumber(slide, 9);

  const nodeRows = [
    [
      { text: "노드", options: { bold: true, fill: { color: "1A3040" }, color: C.accent, fontSize: 12 } },
      { text: "패키지", options: { bold: true, fill: { color: "1A3040" }, color: C.accent, fontSize: 12 } },
      { text: "역할", options: { bold: true, fill: { color: "1A3040" }, color: C.accent, fontSize: 12 } },
    ],
    [
      { text: "ugv_bringup", options: { fontFace: FONT.mono, fontSize: 10.5 } },
      { text: "ugv_bringup", options: { fontSize: 10.5 } },
      { text: "ESP32 피드백 수신 → /voltage, /imu/data, /odom_raw 발행", options: { fontSize: 10.5 } },
    ],
    [
      { text: "ugv_driver", options: { fontFace: FONT.mono, fontSize: 10.5 } },
      { text: "ugv_bringup", options: { fontSize: 10.5 } },
      { text: "/cmd_vel 구독 → ESP32 모터 명령 (T:13) 전송", options: { fontSize: 10.5 } },
    ],
    [
      { text: "rf2o_laser_odom", options: { fontFace: FONT.mono, fontSize: 10.5 } },
      { text: "rf2o_laser_odometry", options: { fontSize: 10.5 } },
      { text: "/scan 스캔 매칭 → /odom (Odometry) + TF(odom→base_footprint)", options: { fontSize: 10.5 } },
    ],
    [
      { text: "roarm_driver", options: { fontFace: FONT.mono, fontSize: 10.5 } },
      { text: "ugv_bringup", options: { fontSize: 10.5 } },
      { text: "/arm_controller, /gripper_cmd 구독 → ESP32 시리얼 전송", options: { fontSize: 10.5 } },
    ],
    [
      { text: "ldlidar_ros2", options: { fontFace: FONT.mono, fontSize: 10.5 } },
      { text: "ldlidar_ros2", options: { fontSize: 10.5 } },
      { text: "LD19 시리얼 데이터 → /scan (LaserScan) 발행", options: { fontSize: 10.5 } },
    ],
    [
      { text: "robot_state_pub", options: { fontFace: FONT.mono, fontSize: 10.5 } },
      { text: "robot_state_pub", options: { fontSize: 10.5 } },
      { text: "URDF → /tf_static 발행 (프레임 간 정적 변환)", options: { fontSize: 10.5 } },
    ],
  ];

  addCard(slide, 0.4, 0.95, 9.2, 4.2);
  slide.addTable(nodeRows, {
    x: 0.6, y: 1.05, w: 8.8, h: 3.95,
    colW: [1.8, 1.6, 5.4],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 11,
    margin: [5, 8, 5, 8],
    autoPage: false,
    rowH: [0.42, 0.48, 0.48, 0.48, 0.48, 0.48, 0.48],
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 10: Topic & Message Flow
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "토픽 및 메시지 흐름도");
  addSlideNumber(slide, 10);

  // Sensor data flow (top)
  addCard(slide, 0.4, 0.95, 9.2, 1.85);
  slide.addText("센서 데이터 흐름  (ESP32/LiDAR → ROS)", {
    x: 0.6, y: 1.05, w: 4.5, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.green, margin: 0,
  });

  const sensorFlow = [
    "ESP32(바퀴) → ttyAMA0 → ugv_bringup → /voltage (Float32), /imu/data (Imu), /odom_raw (Float32MultiArray)",
    "LD19       → ttyUSB1 → ldlidar_ros2 → /scan (LaserScan)",
    "/scan      → rf2o_laser_odometry → /odom (Odometry) + TF(odom→base_footprint)",
    "ESP32(팔)  → ttyUSB0 → roarm_driver → /joint_states (JointState)",
  ];
  slide.addText(sensorFlow.map((line, i) => ({
    text: line,
    options: { breakLine: i < sensorFlow.length - 1, fontSize: 10 },
  })), {
    x: 0.6, y: 1.4, w: 8.8, h: 1.25,
    fontFace: FONT.mono, color: C.mono, margin: 0,
    paraSpaceAfter: 5,
  });

  // Control flow (bottom)
  addCard(slide, 0.4, 3.0, 9.2, 2.1);
  slide.addText("제어 명령 흐름  (ROS → ESP32)", {
    x: 0.6, y: 3.1, w: 4.5, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent3, margin: 0,
  });

  const ctrlFlow = [
    "/cmd_vel (Twist)                        → ugv_driver   → ttyAMA0 → ESP32 → 모터",
    "/arm_controller/joint_trajectory (JointTraj) → roarm_driver → ttyUSB0 → ESP32 → 서보",
    "/roarm/gripper_cmd (Float64)             → roarm_driver → ttyUSB0 → ESP32 → 그리퍼",
  ];
  slide.addText(ctrlFlow.map((line, i) => ({
    text: line,
    options: { breakLine: i < ctrlFlow.length - 1, fontSize: 10 },
  })), {
    x: 0.6, y: 3.5, w: 8.8, h: 1.3,
    fontFace: FONT.mono, color: C.mono, margin: 0,
    paraSpaceAfter: 6,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 11: TF Frame Tree
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "TF 프레임 트리");
  addSlideNumber(slide, 11);

  addCard(slide, 0.4, 0.95, 9.2, 4.2);

  const tfTree = [
    "map (SLAM 사용 시)",
    " └── odom",
    "      └── base_footprint",
    "           └── base_link",
    "                ├── base_lidar_link (LD19)",
    "                │    └── base_laser (static TF, yaw=π/2)",
    "                ├── base_imu_link",
    "                ├── arm_base_link",
    "                │    └── arm_link1",
    "                │         └── arm_link2",
    "                │              └── arm_link3",
    "                │                   └── arm_gripper_link",
    "                ├── left_up_wheel_link",
    "                ├── left_down_wheel_link",
    "                ├── right_up_wheel_link",
    "                └── right_down_wheel_link",
  ];

  slide.addText(tfTree.join("\n"), {
    x: 0.8, y: 1.1, w: 5.0, h: 3.9,
    fontSize: 11, fontFace: FONT.mono,
    color: C.mono, margin: 0,
    valign: "middle",
  });

  // Legend on right side
  const legendItems = [
    { label: "SLAM 제공", frame: "map → odom", color: C.accent },
    { label: "rf2o 스캔 매칭", frame: "odom → base_footprint", color: C.accent2 },
    { label: "URDF 정적 변환", frame: "base_link → *", color: C.accent3 },
  ];
  legendItems.forEach((item, i) => {
    const ly = 1.6 + i * 0.9;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 6.3, y: ly, w: 3.0, h: 0.7,
      fill: { color: C.bgAlt },
      line: { color: C.border, width: 1 },
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: 6.3, y: ly, w: 0.07, h: 0.7,
      fill: { color: item.color },
    });
    slide.addText(item.label, {
      x: 6.55, y: ly + 0.05, w: 2.6, h: 0.3,
      fontSize: 12, fontFace: FONT.head, bold: true,
      color: C.white, margin: 0,
    });
    slide.addText(item.frame, {
      x: 6.55, y: ly + 0.35, w: 2.6, h: 0.25,
      fontSize: 10, fontFace: FONT.mono,
      color: C.textDim, margin: 0,
    });
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 12: Multi-Host Communication (CycloneDDS)
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "멀티호스트 통신 — CycloneDDS");
  addSlideNumber(slide, 12);

  slide.addText("RPi ↔ WSL 간 ROS 2 네이티브 통신", {
    x: 0.6, y: 0.72, w: 6, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Architecture diagram
  addCard(slide, 0.4, 1.05, 9.2, 2.2);
  const archDiagram = [
    "┌── RPi (192.168.0.71) ─────────────┐     ┌── WSL (192.168.0.x) ────────────┐",
    "│                                     │     │                                   │",
    "│  robot_state_publisher              │ DDS │  cartographer_node (SLAM)         │",
    "│  ugv_bringup (ESP32 센서)           │←───→│  cartographer_occupancy_grid_node │",
    "│  ugv_driver (cmd_vel→모터)          │     │  RViz2 (시각화)                  │",
    "│  rf2o_laser_odometry (/odom + TF)   │     │  Nav2 (자율 주행, 향후)           │",
    "│  roarm_driver                       │     │  teleop_keyboard                  │",
    "│  ldlidar (/scan)                    │     │                                   │",
    "│  static TF                          │     │                                   │",
    "└─────────────────────────────────────┘     └───────────────────────────────────┘",
  ];
  slide.addText(archDiagram.join("\n"), {
    x: 0.5, y: 1.15, w: 9.0, h: 2.0,
    fontSize: 8.8, fontFace: FONT.mono,
    color: C.mono, margin: [2, 5, 2, 5],
    valign: "middle",
  });

  // Left: Why CycloneDDS
  addCard(slide, 0.4, 3.45, 4.4, 1.7);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.45, w: 4.4, h: 0.06,
    fill: { color: C.accent },
  });
  slide.addText("CycloneDDS 선택 이유", {
    x: 0.6, y: 3.55, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });
  slide.addText([
    { text: "ROS 2 네이티브 — 브릿지 없이 토픽/TF 직접 공유", options: { bullet: true, breakLine: true } },
    { text: "제로 설정 — 같은 서브넷이면 자동 디스커버리", options: { bullet: true, breakLine: true } },
    { text: "DDS 멀티캐스트 — 다중 수신자 동시 구독 가능", options: { bullet: true, breakLine: true } },
    { text: "성능 — LiDAR 데이터 직접 전송 (바이너리)", options: { bullet: true } },
  ], {
    x: 0.6, y: 3.9, w: 4.0, h: 1.15,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 3,
  });

  // Right: Config snippet
  addCard(slide, 5.2, 3.45, 4.4, 1.7);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.45, w: 4.4, h: 0.06,
    fill: { color: C.accent2 },
  });
  slide.addText("설정 (cyclonedds.xml)", {
    x: 5.4, y: 3.55, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });
  const configSnippet = [
    "export RMW_IMPLEMENTATION=\\",
    "  rmw_cyclonedds_cpp",
    "export CYCLONEDDS_URI=\\",
    "  file:///path/cyclonedds.xml",
    "",
    "# Peer list 방식 (멀티캐스트 불가 시)",
    "<Peers>",
    "  <Peer address=\"192.168.0.71\"/>",
    "</Peers>",
  ];
  slide.addText(configSnippet.join("\n"), {
    x: 5.4, y: 3.9, w: 4.0, h: 1.15,
    fontSize: 9.5, fontFace: FONT.mono,
    color: C.mono, margin: [2, 5, 2, 5],
    valign: "top",
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 13: SLAM Structure (slam_toolbox — original)
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "SLAM 구조 (1세대: slam_toolbox)");
  addSlideNumber(slide, 13);

  // Package info
  slide.addText("slam_toolbox  (ROS 2 Humble)  •  cmd_vel dead reckoning 기반", {
    x: 0.6, y: 0.72, w: 6, h: 0.25,
    fontSize: 12, fontFace: FONT.mono,
    color: C.textDim, margin: 0,
  });

  // Input/Output card
  addCard(slide, 0.4, 1.05, 4.4, 1.5);
  slide.addText("입력 / 출력", {
    x: 0.6, y: 1.15, w: 4.0, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });

  const ioRows = [
    [
      { text: "입력", options: { bold: true, fill: { color: "1A3040" }, color: C.green } },
      { text: "/scan (LaserScan) + /odom (cmd_vel dead reckoning)", options: {} },
    ],
    [
      { text: "출력", options: { bold: true, fill: { color: "1A3040" }, color: C.accent3 } },
      { text: "/map (OccupancyGrid) + TF(map→odom)", options: {} },
    ],
  ];
  slide.addTable(ioRows, {
    x: 0.6, y: 1.5, w: 4.0, h: 0.85,
    colW: [0.7, 3.3],
    border: { pt: 0.5, color: C.border },
    color: C.text, fontFace: FONT.body, fontSize: 11,
    margin: [4, 6, 4, 6],
  });

  // Process steps (right column)
  addCard(slide, 5.2, 1.05, 4.4, 1.5);
  slide.addText("동작 원리", {
    x: 5.4, y: 1.15, w: 4.0, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });
  const steps = [
    { n: "1", text: "LiDAR 스캔 매칭 (현재 vs 이전 비교)" },
    { n: "2", text: "로봇 이동/회전량 추정" },
    { n: "3", text: "맵 누적 생성 + 루프 클로저" },
  ];
  steps.forEach((s, i) => {
    const sy = 1.55 + i * 0.32;
    slide.addShape(pres.shapes.OVAL, {
      x: 5.5, y: sy + 0.02, w: 0.22, h: 0.22,
      fill: { color: C.accent2 },
    });
    slide.addText(s.n, {
      x: 5.5, y: sy + 0.01, w: 0.22, h: 0.22,
      fontSize: 10, fontFace: FONT.head, bold: true,
      color: C.white, align: "center", valign: "middle", margin: 0,
    });
    slide.addText(s.text, {
      x: 5.85, y: sy, w: 3.5, h: 0.28,
      fontSize: 11, fontFace: FONT.body,
      color: C.text, margin: 0,
    });
  });

  // Problem: Why it didn't work without encoders
  addCard(slide, 0.4, 2.75, 4.4, 2.3);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 2.75, w: 4.4, h: 0.06,
    fill: { color: C.warn },
  });
  slide.addText("발견된 문제: 오도메트리 부정확", {
    x: 0.6, y: 2.85, w: 4.0, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.warn, margin: 0,
  });
  slide.addText([
    { text: "WAVE ROVER에 엔코더 없음", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ ESP32 L/R 값 항상 0, 실제 이동량 측정 불가", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "", options: { breakLine: true, fontSize: 5 } },
    { text: "cmd_vel dead reckoning 오도메트리", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ 명령값 기반 추정이라 슬립/드리프트 반영 불가", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "", options: { breakLine: true, fontSize: 5 } },
    { text: "ESP32 IMU 노이즈 심함", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ Yaw 드리프트가 커서 보정 효과 미미", options: { color: C.textDim, fontSize: 10 } },
  ], {
    x: 0.6, y: 3.2, w: 4.0, h: 1.6,
    fontSize: 12, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 3,
  });

  // Result: SLAM broken
  addCard(slide, 5.2, 2.75, 4.4, 2.3);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 2.75, w: 4.4, h: 0.06,
    fill: { color: C.accent3 },
  });
  slide.addText("결과: SLAM 맵 품질 불량", {
    x: 5.4, y: 2.85, w: 4.0, h: 0.3,
    fontSize: 13, fontFace: FONT.head, bold: true,
    color: C.accent3, margin: 0,
  });
  slide.addText([
    { text: "odom TF가 실제와 크게 괴리", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ 스캔 매칭 초기값이 부정확해 수렴 실패", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "", options: { breakLine: true, fontSize: 5 } },
    { text: "맵이 이중/삼중으로 겹침", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ 같은 벽이 여러 겹으로 표시됨", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "", options: { breakLine: true, fontSize: 5 } },
    { text: "회전 시 맵이 크게 틀어짐", options: { bullet: true, breakLine: true, bold: true } },
    { text: "→ dead reckoning이 회전에 특히 취약", options: { color: C.textDim, fontSize: 10 } },
  ], {
    x: 5.4, y: 3.2, w: 4.0, h: 1.6,
    fontSize: 12, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 3,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 14: SLAM Transition — Cartographer + rf2o
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "SLAM 전환: Cartographer + rf2o");
  addSlideNumber(slide, 14);

  slide.addText("인코더 없이 SLAM 품질을 확보하기 위한 아키텍처 변경", {
    x: 0.6, y: 0.72, w: 8, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // Before → After comparison
  addCard(slide, 0.4, 1.05, 4.4, 1.75);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.warn },
  });
  slide.addText("Before (1세대)", {
    x: 0.6, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.warn, margin: 0,
  });
  slide.addText([
    { text: "오도메트리: ", options: { bold: true } },
    { text: "cmd_vel dead reckoning (base_node)", options: { breakLine: true } },
    { text: "SLAM: ", options: { bold: true } },
    { text: "slam_toolbox (async)", options: { breakLine: true } },
    { text: "IMU: ", options: { bold: true } },
    { text: "ESP32 ICM-20948 (노이즈 심함)", options: { breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 5 } },
    { text: "→ 명령값 기반 추정 → 맵 품질 불량", options: { color: C.warn, bold: true } },
  ], {
    x: 0.6, y: 1.55, w: 4.0, h: 1.1,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 2,
  });

  addCard(slide, 5.2, 1.05, 4.4, 1.75);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.05, w: 4.4, h: 0.06,
    fill: { color: C.green },
  });
  slide.addText("After (2세대)", {
    x: 5.4, y: 1.2, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.green, margin: 0,
  });
  slide.addText([
    { text: "오도메트리: ", options: { bold: true } },
    { text: "rf2o_laser_odometry (LiDAR 스캔 매칭)", options: { breakLine: true } },
    { text: "SLAM: ", options: { bold: true } },
    { text: "Cartographer (online correlative scan matching)", options: { breakLine: true } },
    { text: "IMU: ", options: { bold: true } },
    { text: "사용 안 함 (use_imu_data: false)", options: { breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 5 } },
    { text: "→ 실제 이동 측정 → 맵 품질 개선 기대", options: { color: C.green, bold: true } },
  ], {
    x: 5.4, y: 1.55, w: 4.0, h: 1.1,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 2,
  });

  // Why rf2o
  addCard(slide, 0.4, 3.0, 4.4, 2.1);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 3.0, w: 4.4, h: 0.06,
    fill: { color: C.accent2 },
  });
  slide.addText("rf2o_laser_odometry", {
    x: 0.6, y: 3.1, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });
  slide.addText([
    { text: "연속 LiDAR 스캔을 비교하여 이동량 계산", options: { bullet: true, breakLine: true } },
    { text: "인코더/IMU 불필요 — LiDAR만으로 동작", options: { bullet: true, breakLine: true } },
    { text: "20Hz로 odom → base_footprint TF 발행", options: { bullet: true, breakLine: true } },
    { text: "RPi에서 실행 (지연 최소화)", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 4 } },
    { text: "한계: 특징 없는 환경(긴 복도), 빠른 회전 시 정확도 저하", options: { fontSize: 10, color: C.accent3 } },
  ], {
    x: 0.6, y: 3.45, w: 4.0, h: 1.5,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 3,
  });

  // Why Cartographer
  addCard(slide, 5.2, 3.0, 4.4, 2.1);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 3.0, w: 4.4, h: 0.06,
    fill: { color: C.accent },
  });
  slide.addText("Cartographer SLAM", {
    x: 5.4, y: 3.1, w: 4.0, h: 0.3,
    fontSize: 14, fontFace: FONT.head, bold: true,
    color: C.accent, margin: 0,
  });
  slide.addText([
    { text: "use_online_correlative_scan_matching", options: { bullet: true, breakLine: true, fontFace: FONT.mono, fontSize: 10 } },
    { text: "→ 스캔 매칭으로 초기 포즈 추정 (핵심 기능)", options: { breakLine: true, color: C.textDim, fontSize: 10 } },
    { text: "Waveshare 원본 레포에서도 Cartographer 사용", options: { bullet: true, breakLine: true } },
    { text: "use_imu_data: false — 노이즈 IMU 배제", options: { bullet: true, breakLine: true } },
    { text: "slam_toolbox 대비 odom 의존도 낮음", options: { bullet: true, breakLine: true } },
    { text: "→ 부정확한 odom에도 스캔 매칭으로 보정 가능", options: { color: C.textDim, fontSize: 10 } },
  ], {
    x: 5.4, y: 3.45, w: 4.0, h: 1.5,
    fontSize: 11, fontFace: FONT.body,
    color: C.text, margin: 0,
    paraSpaceAfter: 3,
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 15: Nav2 Navigation (Future)
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "Nav2 내비게이션 구조 (향후)");
  addSlideNumber(slide, 15);

  // Main flow
  addCard(slide, 0.4, 0.95, 9.2, 1.3);
  slide.addText("/goal_pose 발행  →  Nav2 경로 계획  →  /cmd_vel  →  로봇 이동", {
    x: 0.6, y: 1.15, w: 8.8, h: 0.4,
    fontSize: 15, fontFace: FONT.mono, bold: true,
    color: C.accent, margin: 0,
    align: "center",
  });
  slide.addText("Cartographer SLAM으로 맵 생성 후 → Nav2로 자율 주행", {
    x: 0.6, y: 1.6, w: 8.8, h: 0.35,
    fontSize: 12, fontFace: FONT.body,
    color: C.textDim, margin: 0,
    align: "center",
  });

  // Three component cards
  const nav2Components = [
    {
      title: "Planner",
      desc: "전역 경로 계획",
      details: "시작점→목표점 최적 경로 탐색\nA* / NavFn 알고리즘",
      color: C.accent,
    },
    {
      title: "Controller",
      desc: "경로 추종 제어",
      details: "계획된 경로를 따라 cmd_vel 생성\nDWB Local Planner",
      color: C.accent2,
    },
    {
      title: "Costmap",
      desc: "장애물 지도",
      details: "정적 맵 + LiDAR 실시간 장애물\n안전 거리(inflation) 적용",
      color: C.accent3,
    },
  ];

  nav2Components.forEach((c, i) => {
    const cx = 0.4 + i * 3.15;
    addCard(slide, cx, 2.5, 2.95, 1.8);
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 2.5, w: 2.95, h: 0.06,
      fill: { color: c.color },
    });
    slide.addText(c.title, {
      x: cx + 0.15, y: 2.65, w: 2.65, h: 0.3,
      fontSize: 16, fontFace: FONT.head, bold: true,
      color: c.color, margin: 0,
    });
    slide.addText(c.desc, {
      x: cx + 0.15, y: 2.95, w: 2.65, h: 0.25,
      fontSize: 12, fontFace: FONT.body, bold: true,
      color: C.white, margin: 0,
    });
    slide.addText(c.details, {
      x: cx + 0.15, y: 3.3, w: 2.65, h: 0.85,
      fontSize: 10.5, fontFace: FONT.body,
      color: C.textDim, margin: 0,
    });
  });

  // RViz integration note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 4.55, w: 9.2, h: 0.55,
    fill: { color: C.bgAlt },
    line: { color: C.border, width: 1 },
  });
  slide.addText("RViz2에서 Nav2 Goal 클릭으로 목표 지점 전송 가능 (/goal_pose → Nav2)", {
    x: 0.6, y: 4.6, w: 8.8, h: 0.45,
    fontSize: 12, fontFace: FONT.body,
    color: C.accent, margin: 0,
    valign: "middle",
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 16: Current Status & Future Plans
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "현재 상태 및 향후 계획");
  addSlideNumber(slide, 16);

  // Completed (left)
  addCard(slide, 0.4, 1.0, 4.4, 4.0);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.0, w: 4.4, h: 0.06,
    fill: { color: C.green },
  });
  slide.addText("현재 완료", {
    x: 0.6, y: 1.15, w: 4.0, h: 0.35,
    fontSize: 16, fontFace: FONT.head, bold: true,
    color: C.green, margin: 0,
  });

  const completed = [
    "하드웨어 통합\n(RPi + 2x ESP32 + LD19 LiDAR 시리얼 연결)",
    "ROS 2 노드 구현\n(모터 제어, 로봇팔 제어, 센서 데이터 발행)",
    "CycloneDDS 멀티호스트 통신\n(RPi ↔ WSL 간 토픽/TF 자동 공유)",
    "rf2o LiDAR 오도메트리\n(인코더 없이 스캔 매칭 기반 위치 추정)",
    "Cartographer SLAM 전환\n(slam_toolbox → Cartographer + rf2o)",
  ];
  completed.forEach((item, i) => {
    const iy = 1.6 + i * 0.63;
    slide.addShape(pres.shapes.OVAL, {
      x: 0.65, y: iy + 0.04, w: 0.16, h: 0.16,
      fill: { color: C.green },
    });
    slide.addText(item, {
      x: 0.95, y: iy, w: 3.65, h: 0.55,
      fontSize: 11, fontFace: FONT.body,
      color: C.text, margin: 0,
      valign: "top",
    });
  });

  // Future plans (right)
  addCard(slide, 5.2, 1.0, 4.4, 4.0);
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.0, w: 4.4, h: 0.06,
    fill: { color: C.accent2 },
  });
  slide.addText("향후 계획", {
    x: 5.4, y: 1.15, w: 4.0, h: 0.35,
    fontSize: 16, fontFace: FONT.head, bold: true,
    color: C.accent2, margin: 0,
  });

  const future = [
    "SLAM 맵 품질 검증\n(Cartographer + rf2o 실환경 테스트)",
    "Nav2 자율 주행\n(경로 계획 + 장애물 회피)",
    "Spring Boot 백엔드 + MQTT\n(미션/태스크 REST API + mqtt_client 브릿지)",
    "웹 대시보드 개발\n(Vue 3 + MQTT.js 실시간 모니터링/제어)",
    "맵 시각화 고도화\n(OccupancyGrid + 로봇 위치 + 경로 오버레이)",
  ];
  future.forEach((item, i) => {
    const iy = 1.6 + i * 0.63;
    slide.addShape(pres.shapes.OVAL, {
      x: 5.45, y: iy + 0.04, w: 0.16, h: 0.16,
      fill: { color: C.accent2 },
    });
    slide.addText(item, {
      x: 5.75, y: iy, w: 3.65, h: 0.55,
      fontSize: 11, fontFace: FONT.body,
      color: C.text, margin: 0,
      valign: "top",
    });
  });
}

// ── Write File ──
const outPath = process.argv[2] || "/home/fhekwn549/ugv_dashboard/presentation.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => { console.error("Error:", err); process.exit(1); });
