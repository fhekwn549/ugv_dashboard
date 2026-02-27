#!/usr/bin/env node
// Serial Protocol Deep-Dive Slides (2 slides)
// Same dark theme as main presentation

const pptxgen = require("pptxgenjs");
const pres = new pptxgen();

pres.layout = "LAYOUT_16x9";
pres.title = "시리얼 통신 프로토콜 심화";

// ── Color Palette (same as main) ──
const C = {
  bg:       "0F1923",
  bgAlt:    "162030",
  card:     "1C2940",
  accent:   "00D4AA",
  accent2:  "3B82F6",
  accent3:  "F59E0B",
  warn:     "EF4444",
  green:    "22C55E",
  text:     "E2E8F0",
  textDim:  "94A3B8",
  border:   "2A3A50",
  mono:     "CBD5E1",
  white:    "FFFFFF",
  purple:   "A855F7",
};

const FONT = { head: "Calibri", body: "Calibri", mono: "Consolas" };

// ── Helpers (same as main) ──
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

// ══════════════════════════════════════════════════════
// SLIDE 1: JSON over Serial — 설계 배경
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "JSON over Serial — 왜 이 방식인가?");

  slide.addText("Waveshare ESP32 펌웨어 설계 의도", {
    x: 0.6, y: 0.72, w: 6, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // ── Left: 원래 설계 (Wi-Fi) ──
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

  // ── Right: 현재 구조 (UART) ──
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

  // ── Bottom: 이유 3가지 카드 ──
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
// SLIDE 2: JSON vs Modbus RTU 비교
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "JSON vs Modbus RTU 프로토콜 비교");

  slide.addText("시리얼 통신에서의 데이터 포맷 선택", {
    x: 0.6, y: 0.72, w: 6, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // ── Left: JSON 방식 (본 시스템) ──
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

  // JSON 예시
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

  // ── Right: Modbus RTU ──
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

  // Modbus 예시
  slide.addText("[01] [06] [00 0D] [00 64] [98 08]", {
    x: 5.4, y: 1.58, w: 4.0, h: 0.35,
    fontSize: 12.5, fontFace: FONT.mono, bold: true,
    color: C.accent3, margin: [4, 8, 4, 8],
    fill: { color: C.bgAlt },
  });

  // Modbus 프레임 구조 설명
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

  // ── Bottom: 비교 테이블 ──
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
// SLIDE 3: 다중 AMR에서 Modbus 적용 구조
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "다중 AMR 시스템 — Modbus 적용 구조");

  slide.addText("로봇 내부 RS-485 버스 + 로봇 간 Modbus TCP/IP", {
    x: 0.6, y: 0.72, w: 7, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // ── Left: 로봇 내부 (Modbus RTU over RS-485) ──
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

  // ── Left bottom note ──
  slide.addText("→ 1:1 연결 대신 하나의 버스에 최대 247개 장치 연결", {
    x: 0.6, y: 3.3, w: 4.0, h: 0.22,
    fontSize: 9.5, fontFace: FONT.body, italic: true,
    color: C.accent3, margin: 0,
  });

  // ── Right: 로봇 간 (Modbus TCP/IP) ──
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

  // ── Right bottom note ──
  slide.addText("→ 각 AMR이 TCP 서버(포트 502)로 동작, 관제서버가 접속", {
    x: 5.4, y: 3.3, w: 4.0, h: 0.22,
    fontSize: 9.5, fontFace: FONT.body, italic: true,
    color: C.purple, margin: 0,
  });

  // ── Bottom: 레지스터 맵 예시 ──
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

  // 세로 구분선 (테이블 중앙)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 4.99, y: 4.1, w: 0.02, h: 0.95,
    fill: { color: C.accent2 },
  });
}

// ══════════════════════════════════════════════════════
// SLIDE 4: Modbus 한계와 실제 다중 AMR 통신 아키텍처
// ══════════════════════════════════════════════════════
{
  const slide = pres.addSlide();
  slide.background = { color: C.bg };
  addSectionTitle(slide, "Modbus의 한계와 실제 다중 AMR 통신");

  slide.addText("왜 산업 현장에서는 Modbus만으로 다중 AMR을 운영하지 않는가?", {
    x: 0.6, y: 0.72, w: 8.0, h: 0.25,
    fontSize: 11, fontFace: FONT.body,
    color: C.textDim, margin: 0,
  });

  // ── Left: Modbus 한계 ──
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

  // ── Right: 실제 다중 AMR 아키텍처 ──
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

  // ── Bottom: 프로토콜별 역할 비교 ──
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

// ── Write File ──
const outPath = process.argv[2] || "/home/fhekwn549/ugv_dashboard/protocol-slides.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log(`Created: ${outPath}`))
  .catch(err => { console.error("Error:", err); process.exit(1); });
