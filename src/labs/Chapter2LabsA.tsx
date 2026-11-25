import React, { useState, useEffect } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
  formatSci,
  formatSciPlain,
} from '../components/LabUI';

/* =========================================================
   LAB 2-1: Microscopic Electric Current & Battery Capacity
   ========================================================= */
export const Lab2_1: React.FC = () => {
  const [I, setI] = useState(2.4); // A
  const [dt, setDt] = useState(10); // s
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((p) => (p + 0.6 + I * 1.1) % 360);
    }, 35);
    return () => window.clearInterval(id);
  }, [I]);

  const dq = I * dt;
  const electrons = dq / 1.6e-19;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
            {/* Wire body */}
            <rect x="40" y="65" width="380" height="90" rx="18" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
            {/* Cross-section ellipse */}
            <ellipse cx="230" cy="110" rx="14" ry="45" fill="#10b981" fillOpacity="0.18" stroke="#059669" strokeWidth="2" strokeDasharray="4 3" />
            <text x="230" y="176" textAnchor="middle" fontSize="11" fontWeight="800" fill="#059669">
              سطح مقطع A (شمارش بار عبوری)
            </text>

            {/* Fixed copper lattice ions */}
            {[85, 145, 205, 265, 325, 385].map((x) =>
              [88, 132].map((y) => (
                <g key={`${x}-${y}`}>
                  <circle cx={x} cy={y} r="7" fill="#f59e0b" fillOpacity="0.45" />
                  <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="900" fill="#b45309">+</text>
                </g>
              ))
            )}

            {/* Drifting free electrons moving LEFT (opposite to E and I!) */}
            {Array.from({ length: 12 }).map((_, idx) => {
              const row = idx % 3;
              const base = (idx * 33) % 350;
              const x = 405 - ((base + phase * 1.4) % 350);
              const y = 80 + row * 28 + Math.sin((phase + idx * 40) * 0.12) * 3;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="6.5" fill="#2563eb" stroke="white" strokeWidth="1.5" />
                  <text x={x} y={y + 3} textAnchor="middle" fontSize="10" fontWeight="900" fill="white">−</text>
                </g>
              );
            })}

            {/* Conventional current & E arrows (LEFT -> RIGHT) */}
            <g>
              <line x1="120" y1="36" x2="335" y2="36" stroke="#ef4444" strokeWidth="3.5" />
              <polygon points="346,36 332,29 332,43" fill="#ef4444" />
              <text x="230" y="24" textAnchor="middle" fontSize="12" fontWeight="900" fill="#dc2626">
                جهت جریان قراردادی (I) و میدان الکتریکی (E) →
              </text>
            </g>

            {/* Electron drift arrow (RIGHT -> LEFT) */}
            <g>
              <line x1="335" y1="202" x2="125" y2="202" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5 3" />
              <polygon points="114,202 128,196 128,208" fill="#2563eb" />
              <text x="230" y="218" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1d4ed8">
                ← جهت حرکت سوق الکترون‌های آزاد (v_d ≈ 10⁻⁵ m/s)
              </text>
            </g>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="I = \frac{\Delta q}{\Delta t} = \frac{n e}{\Delta t} \quad \Longrightarrow \quad n = \frac{I\,\Delta t}{e}"
          substitutedTex={`\\Delta q = (${I.toFixed(1)})(${dt}) = ${dq.toFixed(1)}\\;\\text{C},\\qquad n = \\frac{${dq.toFixed(1)}}{1.6\\times 10^{-19}} = ${formatSci(electrons, 2)}`}
          symbols={[
            { symbol: 'I', meaning: 'شدت جریان الکتریکی عبوری از سیم', unit: 'A (آمپر)' },
            { symbol: '\\Delta q', meaning: 'مقدار بار الکتریکی عبوری از مقطع', unit: 'C (کولن)' },
            { symbol: '\\Delta t', meaning: 'مدت زمان عبور جریان', unit: 's (ثانیه)' },
            { symbol: 'n', meaning: 'تعداد الکترون‌های عبوری از مقطع', unit: 'عدد' },
            { symbol: 'e', meaning: 'بزرگی بار هر الکترون', unit: '1.6×10⁻¹⁹ C' },
          ]}
          insight="توجه کنید که در سیم فلزی فقط الکترون‌های آزاد حرکت می‌کنند و جهت حرکت آن‌ها دقیقاً عکس جهت جریان قراردادی I است."
        />
      }
      controls={
        <>
          <SliderControl label="شدت جریان الکتریکی" symbol="I" value={I} min={0.4} max={8.0} step={0.4} unit="A" accentClass="text-emerald-600" onChange={setI} />
          <SliderControl label="مدت زمان عبور جریان" symbol="\Delta t" value={dt} min={1} max={60} step={1} unit="s" accentClass="text-cyan-600" onChange={setDt} />
          <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-xs leading-7 text-slate-700 dark:text-slate-200">
            <strong>مقایسه با باتری گوشی:</strong> این مقدار بار ({dq.toFixed(1)} C) معادل{' '}
            <span dir="ltr" className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
              {(dq / 3.6).toFixed(2)} mAh
            </span>{' '}
            از ظرفیت یک باتری است! (<span dir="ltr" className="font-mono font-semibold">1 mAh = 3.6 C</span>)
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="بار کل عبوری Δq" value={dq.toFixed(1)} unit="C" color="emerald" />
          <MetricCard label="تعداد الکترون‌های عبوری" value={formatSciPlain(electrons, 2)} color="cyan" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 2-2: Ohm's Law vs Non-Ohmic (LED / Diode)
   ========================================================= */
export const Lab2_2: React.FC = () => {
  const [device, setDevice] = useState<'ohmic' | 'led'>('ohmic');
  const [V, setV] = useState(4.0); // -4V to +8V
  const [R0, setR0] = useState(4.0); // Ω for ohmic

  // Ohmic: I = V / R0; LED: forward conduction above ~1.6V exponentially (in mA scaled to A for comparison)
  const calcI = (v: number) => {
    if (device === 'ohmic') return v / R0;
    if (v <= 1.2) return 0;
    return Math.min(3.5, 0.045 * Math.pow(v - 1.2, 2.35));
  };

  const I = calcI(V);
  const effectiveR = Math.abs(I) > 1e-4 ? Math.abs(V / I) : Infinity;

  // Build SVG plot path on V in [-4, 8], I in [-2, 3]
  const mapX = (v: number) => 55 + ((v + 4) / 12) * 365;
  const mapY = (i: number) => 170 - (i / 3.2) * 140;

  const pts: string[] = [];
  for (let v = -4; v <= 8.01; v += 0.25) {
    const iv = Math.max(-1.2, Math.min(3.2, calcI(v)));
    pts.push(`${pts.length === 0 ? 'M' : 'L'} ${mapX(v).toFixed(1)} ${mapY(iv).toFixed(1)}`);
  }

  const ledGlow = device === 'led' ? Math.min(1, I / 1.5) : Math.min(1, Math.abs(I) / 2.2);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={device}
              onChange={setDevice}
              options={[
                { value: 'ohmic', label: 'رسانای اُهمی (خطی — R ثابت)' },
                { value: 'led', label: 'دیود نورگسیل LED (غیراهمی)' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 235" className="w-full h-auto max-h-[250px]">
            {/* Axes: V=0 at mapX(0), I=0 at mapY(0) */}
            <line x1="40" y1={mapY(0)} x2="430" y2={mapY(0)} stroke="#475569" strokeWidth="1.8" />
            <line x1={mapX(0)} y1="18" x2={mapX(0)} y2="220" stroke="#475569" strokeWidth="1.8" />
            <text x="430" y={mapY(0) + 16} textAnchor="end" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              V (ولت)
            </text>
            <text x={mapX(0) + 8} y="26" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              I ({device === 'led' ? '×10 mA' : 'A'})
            </text>

            {/* Curve */}
            <path
              d={pts.join(' ')}
              fill="none"
              stroke={device === 'ohmic' ? '#10b981' : '#f43f5e'}
              strokeWidth="3.2"
            />

            {/* Operating point */}
            <line x1={mapX(V)} y1={mapY(0)} x2={mapX(V)} y2={mapY(Math.max(-1.2, Math.min(3.2, I)))} stroke="#6366f1" strokeDasharray="3 3" />
            <circle
              cx={mapX(V)}
              cy={mapY(Math.max(-1.2, Math.min(3.2, I)))}
              r="7"
              fill="#6366f1"
              stroke="white"
              strokeWidth="2.5"
            />

            {/* Visual bulb/LED indicator top-left */}
            <g transform="translate(80, 56)">
              <circle cx="0" cy="0" r={16 + ledGlow * 14} fill={device === 'led' ? '#fb7185' : '#facc15'} fillOpacity={ledGlow * 0.45} />
              <circle
                cx="0"
                cy="0"
                r="14"
                fill={ledGlow > 0.05 ? (device === 'led' ? '#f43f5e' : '#eab308') : '#94a3b8'}
                stroke="#334155"
                strokeWidth="2"
              />
              <text x="0" y="30" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                {device === 'led' ? (I > 0.02 ? 'LED روشن!' : 'خاموش (بایاس معکوس/کم)') : 'مقاومت اهمی'}
              </text>
            </g>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="R = \frac{V}{I} \quad \Longleftrightarrow \quad I = \frac{V}{R}"
          substitutedTex={
            device === 'ohmic'
              ? `I = \\frac{${V.toFixed(1)}\\;\\text{V}}{${R0.toFixed(1)}\\;\\Omega} = ${I.toFixed(2)}\\;\\text{A}\\quad (\\text{شیب خط} = \\frac{1}{R} = ${(1 / R0).toFixed(2)}\\;\\Omega^{-1})`
              : I > 0.01
              ? `R_{\\text{لحظه‌ای}} = \\frac{${V.toFixed(1)}\\;\\text{V}}{${(I * 10).toFixed(1)}\\;\\text{mA}} = ${(V / (I * 0.01)).toFixed(0)}\\;\\Omega\\;(\\text{غیرثابت!})`
              : 'V < 1.2\\;\\text{V} \\Rightarrow I = 0\\;(\\text{دیود جریان را عبور نمی‌دهد!})'
          }
          symbols={[
            { symbol: 'R', meaning: 'مقاومت الکتریکی قطعه', unit: 'Ω (اهم)' },
            { symbol: 'V', meaning: 'اختلاف پتانسیل (ولتاژ) دو سر قطعه', unit: 'V (ولت)' },
            { symbol: 'I', meaning: 'شدت جریان عبوری از قطعه', unit: 'A (آمپر)' },
          ]}
          insight={
            device === 'ohmic'
              ? 'در رسانای اهمی نمودار I-V خط راست گذرنده از مبدأ است و هرچه R بزرگ‌تر باشد، شیب خط (1/R) کمتر (خوابیده‌تر) می‌شود!'
              : 'در LED با ولتاژ منفی جریان صفر است و پس از ولتاژ آستانه به صورت غیرخطی جهش می‌کند ← از قانون اهم پیروی نمی‌کند.'
          }
        />
      }
      controls={
        <>
          <SliderControl label="اختلاف پتانسیل اعمالی" symbol="V" value={V} min={-4} max={8} step={0.4} unit="V" accentClass="text-indigo-600" onChange={setV} />
          {device === 'ohmic' && (
            <SliderControl label="مقاومت رسانای اهمی" symbol="R" value={R0} min={1} max={12} step={0.5} unit="Ω" accentClass="text-emerald-600" onChange={setR0} />
          )}
        </>
      }
      metrics={
        <>
          <MetricCard
            label="شدت جریان I"
            value={device === 'led' ? (I * 10).toFixed(1) : I.toFixed(2)}
            unit={device === 'led' ? 'mA' : 'A'}
            color="emerald"
          />
          <MetricCard
            label="مقاومت لحظه‌ای V/I"
            value={isFinite(effectiveR) ? (device === 'led' ? (V / (I * 0.01)).toFixed(0) : effectiveR.toFixed(1)) : '∞'}
            unit="Ω"
            sublabel={device === 'ohmic' ? 'همیشه ثابت!' : 'وابسته به V'}
            color={device === 'ohmic' ? 'cyan' : 'rose'}
          />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 2-3: Resistance Factors, Wire Stretching, Rheostat & Color Code
   ========================================================= */
const metals = [
  { name: 'نقره', rho: 1.6e-8, color: '#cbd5e1' },
  { name: 'مس', rho: 1.7e-8, color: '#ea580c' },
  { name: 'آلومینیم', rho: 2.8e-8, color: '#94a3b8' },
  { name: 'تنگستن', rho: 5.5e-8, color: '#64748b' },
  { name: 'نیکروم (المنت)', rho: 100e-8, color: '#78716c' },
];

const colorBands = [
  { name: 'سیاه', digit: 0, mult: 1, hex: '#1e293b' },
  { name: 'قهوه‌ای', digit: 1, mult: 10, hex: '#78350f' },
  { name: 'قرمز', digit: 2, mult: 100, hex: '#dc2626' },
  { name: 'نارنجی', digit: 3, mult: 1e3, hex: '#f97316' },
  { name: 'زرد', digit: 4, mult: 1e4, hex: '#eab308' },
  { name: 'سبز', digit: 5, mult: 1e5, hex: '#16a34a' },
  { name: 'آبی', digit: 6, mult: 1e6, hex: '#2563eb' },
  { name: 'بنفش', digit: 7, mult: 1e7, hex: '#7c3aed' },
  { name: 'خاکستری', digit: 8, mult: 1e8, hex: '#64748b' },
  { name: 'سفید', digit: 9, mult: 1e9, hex: '#f8fafc' },
];

export const Lab2_3: React.FC = () => {
  const [tab, setTab] = useState<'wire' | 'rheostat' | 'color'>('wire');
  // Wire tab
  const [metalIdx, setMetalIdx] = useState(1); // copper
  const [stretchMode, setStretchMode] = useState<'free' | 'constVol'>('constVol');
  const [L, setL] = useState(1.0); // multiplier 1..4 (base 100m)
  const [rRad, setRRad] = useState(1.0); // mm (when free mode)
  const [temp, setTemp] = useState(20); // °C
  // Rheostat tab
  const [wiper, setWiper] = useState(45); // %
  // Color code tab (Example from book p.47: Red(2), Green(5), Orange(10^3) = 25 kΩ ±10%)
  const [b1, setB1] = useState(2);
  const [b2, setB2] = useState(5);
  const [b3, setB3] = useState(3);
  const [tol, setTol] = useState<'gold' | 'silver' | 'none'>('silver');

  const mat = metals[metalIdx];
  const baseL = 100; // m
  const baseR_mm = 1.0; // mm
  const actualL = baseL * L;
  // If constant volume: A * L = A0 * L0 => r = r0 / sqrt(L)
  const actualRadMm = stretchMode === 'constVol' ? baseR_mm / Math.sqrt(L) : rRad;
  const areaM2 = Math.PI * Math.pow(actualRadMm * 1e-3, 2);
  const tempFactor = 1 + 0.004 * (temp - 20);
  const R_wire = (mat.rho * tempFactor * actualL) / areaM2;
  const R_base = (mat.rho * baseL) / (Math.PI * Math.pow(baseR_mm * 1e-3, 2));

  // Color code value
  const codeVal = (b1 * 10 + b2) * colorBands[b3].mult;
  const formatOhm = (val: number) => {
    if (val >= 1e6) return `${(val / 1e6).toFixed(val % 1e6 === 0 ? 0 : 1)} MΩ`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(val % 1e3 === 0 ? 0 : 1)} kΩ`;
    return `${val} Ω`;
  };

  // Rheostat
  const R_rheo = Math.max(1, Math.round((wiper / 100) * 20));
  const I_rheo = 12 / (R_rheo + 4); // with 4Ω lamp

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={tab}
              onChange={setTab}
              options={[
                { value: 'wire', label: 'عوامل مقاومت و کشیدن سیم' },
                { value: 'rheostat', label: 'رئوستا (مقاومت متغیر)' },
                { value: 'color', label: 'کد رنگی مقاومت (ص ۴۷)' },
              ]}
            />
          </div>

          {tab === 'wire' && (
            <svg viewBox="0 0 460 210" className="w-full h-auto max-h-[230px]">
              {/* Wire cylinder visually scaling with L and actualRadMm */}
              {(() => {
                const w = 85 + (L - 1) * 95;
                const h = Math.max(12, Math.min(72, actualRadMm * 32));
                const x0 = 230 - w / 2;
                const y0 = 105 - h / 2;
                return (
                  <g>
                    <rect x={x0} y={y0} width={w} height={h} rx={h / 4} fill={mat.color} stroke="#334155" strokeWidth="2.5" />
                    <ellipse cx={x0 + w} cy="105" rx="7" ry={h / 2} fill="#f8fafc" fillOpacity="0.45" stroke="#334155" strokeWidth="2" />
                    {/* Dimension L */}
                    <line x1={x0} y1={y0 + h + 22} x2={x0 + w} y2={y0 + h + 22} stroke="#475569" strokeWidth="1.8" />
                    <text x="230" y={y0 + h + 38} textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                      L = {actualL.toFixed(0)} m (×{L.toFixed(1)})
                    </text>
                    {/* Radius label */}
                    <text x="230" y={y0 - 12} textAnchor="middle" fontSize="11" fontWeight="800" fill="#0284c7">
                      شعاع r = {actualRadMm.toFixed(2)} mm | A = {(areaM2 * 1e6).toFixed(2)} mm²
                    </text>
                  </g>
                );
              })()}
              <text x="230" y="24" textAnchor="middle" fontSize="12" fontWeight="900" fill="#059669">
                جنس: {mat.name} | نسبت مقاومت به حالت پایه: ×{(R_wire / R_base).toFixed(2)}
              </text>
            </svg>
          )}

          {tab === 'rheostat' && (
            <svg viewBox="0 0 460 210" className="w-full h-auto max-h-[230px]">
              {/* Top rail */}
              <line x1="65" y1="55" x2="395" y2="55" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
              {/* Coil cylinder */}
              <rect x="75" y="95" width="310" height="54" rx="10" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
              {/* Coil turns: active portion left of wiper glows amber! */}
              {Array.from({ length: 24 }).map((_, i) => {
                const tx = 86 + i * 12.5;
                const active = tx <= 86 + (wiper / 100) * 288;
                return (
                  <line
                    key={i}
                    x1={tx}
                    y1="95"
                    x2={tx}
                    y2="149"
                    stroke={active ? '#f59e0b' : '#94a3b8'}
                    strokeWidth={active ? '4' : '2.5'}
                  />
                );
              })}
              {/* Wiper */}
              {(() => {
                const wx = 86 + (wiper / 100) * 288;
                return (
                  <g>
                    <rect x={wx - 12} y="43" width="24" height="24" rx="5" fill="#1e293b" />
                    <line x1={wx} y1="67" x2={wx} y2="95" stroke="#dc2626" strokeWidth="4" />
                    <polygon points={`${wx},97 ${wx - 6},87 ${wx + 6},87`} fill="#dc2626" />
                  </g>
                );
              })()}
              {/* Lamp brightness */}
              <g transform="translate(230, 182)">
                <circle cx="0" cy="0" r={10 + I_rheo * 9} fill="#facc15" fillOpacity={Math.min(0.6, I_rheo * 0.25)} />
                <circle cx="0" cy="0" r="11" fill="#eab308" stroke="#713f12" strokeWidth="2" />
                <text x="26" y="4" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                  جریان لامپ: {I_rheo.toFixed(2)} A (R_رئوستا = {R_rheo} Ω)
                </text>
              </g>
            </svg>
          )}

          {tab === 'color' && (
            <svg viewBox="0 0 460 205" className="w-full h-auto max-h-[225px]">
              {/* Leads */}
              <line x1="35" y1="100" x2="120" y2="100" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <line x1="340" y1="100" x2="425" y2="100" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              {/* Resistor body */}
              <rect x="115" y="56" width="230" height="88" rx="28" fill="#f5d0a9" stroke="#92400e" strokeWidth="3" />
              {/* 4 color bands */}
              <rect x="150" y="57" width="20" height="86" fill={colorBands[b1].hex} />
              <rect x="192" y="57" width="20" height="86" fill={colorBands[b2].hex} />
              <rect x="234" y="57" width="20" height="86" fill={colorBands[b3].hex} />
              {tol !== 'none' && (
                <rect x="295" y="57" width="18" height="86" fill={tol === 'gold' ? '#eab308' : '#cbd5e1'} />
              )}
              <text x="160" y="45" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">رقم ۱ ({b1})</text>
              <text x="202" y="45" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">رقم ۲ ({b2})</text>
              <text x="244" y="45" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">ضریب (10^{b3})</text>
              <text x="304" y="45" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">تلرانس</text>

              <text x="230" y="178" textAnchor="middle" fontSize="16" fontWeight="900" fill="#4f46e5">
                R = {formatOhm(codeVal)} ± {tol === 'gold' ? '5%' : tol === 'silver' ? '10%' : '20%'}
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        tab === 'wire' ? (
          <LiveFormulaCard
            formulaTex={
              stretchMode === 'constVol'
                ? 'R = \\rho\\frac{L}{A},\\qquad \\text{حجم ثابت} \\Rightarrow \\frac{R_2}{R_1} = \\left(\\frac{L_2}{L_1}\\right)^2 = \\left(\\frac{r_1}{r_2}\\right)^4'
                : 'R = \\rho\\frac{L}{A} = \\rho\\frac{L}{\\pi r^2}'
            }
            substitutedTex={`R = (${formatSci(mat.rho * tempFactor, 2)})\\frac{${actualL.toFixed(0)}}{${formatSci(areaM2, 2)}} = ${R_wire.toFixed(2)}\\;\\Omega`}
            symbols={[
              { symbol: 'R', meaning: 'مقاومت الکتریکی سیم', unit: 'Ω' },
              { symbol: '\\rho', meaning: 'مقاومت ویژه فلز (وابسته به جنس و دما)', unit: 'Ω·m' },
              { symbol: 'L', meaning: 'طول سیم', unit: 'm' },
              { symbol: 'A', meaning: 'مساحت سطح مقطع سیم ($\\pi r^2$)', unit: 'm²' },
              { symbol: 'r', meaning: 'شعاع سطح مقطع سیم', unit: 'm' },
            ]}
            insight={
              stretchMode === 'constVol'
                ? `وقتی سیم را ${L.toFixed(1)} برابر می‌کشید، سطح مقطع هم‌زمان ÷${L.toFixed(1)} می‌شود؛ پس مقاومت دقیقاً ${L.toFixed(1)}² = ${(L * L).toFixed(2)} برابر می‌شود!`
                : 'با افزایش دمای فلزات، ارتعاش اتم‌ها بیشتر و مقاومت ویژه افزایش می‌یابد (برخلاف نیم‌رساناها که با دما مقاومتشان کم می‌شود!).'
            }
          />
        ) : undefined
      }
      controls={
        tab === 'wire' ? (
          <>
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">حالت تغییر ابعاد سیم:</div>
              <SegmentedButtons
                value={stretchMode}
                onChange={setStretchMode}
                options={[
                  { value: 'constVol', label: 'کشیدن سیم (حجم ثابت — کنکوری!)' },
                  { value: 'free', label: 'تغییر مستقل L و r' },
                ]}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {metals.map((m, i) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setMetalIdx(i)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                    metalIdx === i
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <SliderControl
              label={stretchMode === 'constVol' ? 'ضریب کشیدن طول (L/L₀)' : 'ضریب طول سیم'}
              symbol="L/L_0"
              value={L}
              min={1}
              max={4}
              step={0.5}
              displayValue={`×${L.toFixed(1)}`}
              accentClass="text-emerald-600"
              onChange={setL}
            />
            {stretchMode === 'free' && (
              <SliderControl label="شعاع مقطع سیم" symbol="r" value={rRad} min={0.5} max={2.5} step={0.25} unit="mm" accentClass="text-cyan-600" onChange={setRRad} />
            )}
            <SliderControl label="دمای سیم فلزی" symbol="T" value={temp} min={20} max={220} step={20} unit="°C" accentClass="text-rose-500" onChange={setTemp} />
          </>
        ) : tab === 'rheostat' ? (
          <>
            <SliderControl label="موقعیت لغزنده رئوستا" value={wiper} min={5} max={100} unit="%" accentClass="text-amber-600" onChange={setWiper} />
            <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-xs leading-7 text-slate-700 dark:text-slate-200">
              با حرکت لغزنده به راست، طول بیشتری از سیم مقاومتی (نارنجی) در مسیر جریان قرار می‌گیرد ← مقاومت بیشتر و جریان لامپ کمتر می‌شود.
            </div>
          </>
        ) : (
          <div className="space-y-3">
            {[
              { label: 'حلقه ۱ (رقم اول)', val: b1, set: setB1 },
              { label: 'حلقه ۲ (رقم دوم)', val: b2, set: setB2 },
              { label: 'حلقه ۳ (ضریب 10ⁿ)', val: b3, set: setB3 },
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300">{row.label}:</div>
                <div className="flex flex-wrap gap-1">
                  {colorBands.slice(0, row.label.includes('ضریب') ? 7 : 10).map((c) => (
                    <button
                      key={c.digit}
                      type="button"
                      onClick={() => row.set(c.digit)}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold border cursor-pointer ${
                        row.val === c.digit ? 'ring-2 ring-indigo-500 scale-105' : 'opacity-80'
                      }`}
                      style={{
                        backgroundColor: c.hex,
                        color: c.digit === 4 || c.digit === 9 ? '#0f172a' : '#ffffff',
                      }}
                    >
                      {c.name} ({c.digit})
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">حلقه ۴ (تلرانس):</div>
              <SegmentedButtons
                value={tol}
                onChange={setTol}
                options={[
                  { value: 'gold', label: 'طلایی (±5%)' },
                  { value: 'silver', label: 'نقره‌ای (±10%)' },
                  { value: 'none', label: 'بی‌رنگ (±20%)' },
                ]}
              />
            </div>
          </div>
        )
      }
      metrics={
        tab === 'wire' ? (
          <>
            <MetricCard label="مقاومت نهایی R" value={R_wire.toFixed(2)} unit="Ω" color="emerald" />
            <MetricCard label="نسبت R / R₀" value={`×${(R_wire / R_base).toFixed(2)}`} sublabel={stretchMode === 'constVol' ? 'تناسب با L²' : 'تناسب با L/r²'} color="amber" />
          </>
        ) : undefined
      }
    />
  );
};
