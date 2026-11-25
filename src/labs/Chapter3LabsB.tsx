import React, { useState, useEffect, useRef } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
  formatSciPlain,
} from '../components/LabUI';

/* =========================================================
   LAB 3-7: Faraday's Discovery (Moving Magnet + Galvanometer)
   ========================================================= */
export const Lab3_7: React.FC = () => {
  const [magnetX, setMagnetX] = useState(95); // 50..255 (coil at 235..345)
  const [flipped, setFlipped] = useState(false); // false: N faces coil; true: S faces coil
  const [galv, setGalv] = useState(0); // -1..+1 needle deflection
  const prevX = useRef(magnetX);
  const decayTimer = useRef<number | null>(null);

  const moveMagnet = (newX: number) => {
    const dx = newX - prevX.current;
    prevX.current = newX;
    setMagnetX(newX);
    const poleSign = flipped ? -1 : 1;
    // Deflection proportional to velocity near coil!
    const nearCoil = Math.exp(-Math.pow((newX - 210) / 90, 2));
    const kick = Math.max(-1, Math.min(1, dx * 0.11 * poleSign * (0.35 + nearCoil)));
    setGalv(kick);
    if (decayTimer.current) window.clearTimeout(decayTimer.current);
    decayTimer.current = window.setTimeout(() => setGalv(0), 260);
  };

  const animateSlide = (target: number, speedMs: number) => {
    const start = magnetX;
    const steps = 18;
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      const nx = start + ((target - start) * i) / steps;
      moveMagnet(nx);
      if (i >= steps) window.clearInterval(id);
    }, speedMs);
  };

  const needleDeg = galv * 58;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
            {/* Coil */}
            <g>
              {[255, 275, 295, 315, 335].map((x) => (
                <ellipse key={x} cx={x} cy="145" rx="14" ry="44" fill="none" stroke="#d97706" strokeWidth="4" />
              ))}
              {/* Wires to galvanometer */}
              <path d="M 255 189 L 255 208 L 390 208 L 390 105" fill="none" stroke="#475569" strokeWidth="2.5" />
              <path d="M 335 189 L 335 200 L 420 200 L 420 105" fill="none" stroke="#475569" strokeWidth="2.5" />
            </g>

            {/* Galvanometer */}
            <g transform="translate(405, 68)">
              <circle cx="0" cy="0" r="38" fill="white" stroke="#334155" strokeWidth="3" />
              <path d="M -26 -8 A 28 28 0 0 1 26 -8" fill="none" stroke="#94a3b8" strokeWidth="2" />
              <text x="0" y="-20" textAnchor="middle" fontSize="9" fontWeight="900" fill="#64748b">0</text>
              <text x="-22" y="-10" fontSize="9" fontWeight="900" fill="#2563eb">−</text>
              <text x="20" y="-10" fontSize="9" fontWeight="900" fill="#ef4444">+</text>
              <g transform={`rotate(${needleDeg})`}>
                <line x1="0" y1="6" x2="0" y2="-28" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
              </g>
              <circle cx="0" cy="0" r="4" fill="#0f172a" />
              <text x="0" y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill="#334155">G</text>
            </g>

            {/* Movable Bar Magnet */}
            <g transform={`translate(${magnetX - 55}, 122)`}>
              <rect x="0" y="0" width="55" height="44" rx="5" fill={flipped ? '#ef4444' : '#2563eb'} />
              <rect x="55" y="0" width="55" height="44" rx="5" fill={flipped ? '#2563eb' : '#ef4444'} />
              <text x="27" y="28" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">{flipped ? 'N' : 'S'}</text>
              <text x="82" y="28" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">{flipped ? 'S' : 'N'}</text>
            </g>

            <text x="180" y="42" textAnchor="middle" fontSize="12" fontWeight="900" fill={Math.abs(galv) > 0.05 ? '#059669' : '#64748b'}>
              {Math.abs(galv) > 0.05
                ? `جریان القایی ایجاد شد! (انحراف به ${galv > 0 ? 'راست' : 'چپ'})`
                : 'آهنربا ساکن است ← تغییر شار صفر ← جریان القایی صفر!'}
            </text>
          </svg>
        </div>
      }
      controls={
        <>
          <SliderControl
            label="آهنربا را سریع یا آرام به داخل پیچه بکشید"
            value={Math.round(magnetX)}
            min={70}
            max={265}
            step={2}
            displayValue={magnetX > 190 ? 'داخل پیچه' : 'بیرون پیچه'}
            accentClass="text-violet-600"
            onChange={moveMagnet}
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => animateSlide(magnetX < 180 ? 255 : 85, 22)}
              className="py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold cursor-pointer"
            >
              حرکت سریع (انحراف زیاد)
            </button>
            <button
              type="button"
              onClick={() => animateSlide(magnetX < 180 ? 255 : 85, 65)}
              className="py-2 rounded-xl bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 text-xs font-extrabold cursor-pointer"
            >
              حرکت آرام (انحراف کم)
            </button>
          </div>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
          >
            برعکس کردن قطب آهنربا ({flipped ? 'قطب S روبه‌روی پیچه' : 'قطب N روبه‌روی پیچه'})
          </button>
        </>
      }
      metrics={
        <>
          <MetricCard
            label="وضعیت عقربه گالوانومتر"
            value={Math.abs(galv) < 0.05 ? 'صفر (ثابت)' : galv > 0 ? 'انحراف +' : 'انحراف −'}
            color={Math.abs(galv) > 0.05 ? 'emerald' : 'indigo'}
          />
          <MetricCard label="شرط ایجاد جریان" value="ΔΦ ≠ 0" sublabel="فقط هنگام تغییر شار!" color="violet" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-8: Magnetic Flux & Faraday's Law
   ========================================================= */
export const Lab3_8: React.FC = () => {
  const [N, setN] = useState(200);
  const [Acm2, setAcm2] = useState(25); // cm²
  const [B1, setB1] = useState(0.18); // T
  const [B2, setB2] = useState(0.22); // T (can be negative for reversal!)
  const [theta, setTheta] = useState(0); // angle between B and normal
  const [dtMs, setDtMs] = useState(20); // ms
  const [R, setR] = useState(10); // Ω

  const A = Acm2 * 1e-4;
  const cosT = Math.cos((theta * Math.PI) / 180);
  const phi1 = B1 * A * cosT;
  const phi2 = B2 * A * cosT;
  const dPhi = phi2 - phi1;
  const emf = (-N * dPhi) / (dtMs * 1e-3);
  const Iav = Math.abs(emf) / R;
  const dq = (N * Math.abs(dPhi)) / R;

  // Visual loop tilt
  const rad = (theta * Math.PI) / 180;
  const rx = Math.max(8, Math.abs(Math.cos(rad)) * 46);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 210" className="w-full h-auto max-h-[230px]">
            {/* Horizontal B field lines */}
            {[50, 80, 110, 140, 170].map((y) => (
              <g key={y}>
                <line x1="45" y1={y} x2="405" y2={y} stroke="#7c3aed" strokeOpacity="0.45" strokeWidth="2.2" />
                <polygon points={`414,${y} 402,${y - 4.5} 402,${y + 4.5}`} fill="#7c3aed" fillOpacity="0.65" />
              </g>
            ))}
            <text x="412" y="34" textAnchor="end" fontSize="11" fontWeight="900" fill="#6d28d9">
              میدان B ({B1.toFixed(2)} T → {B2.toFixed(2)} T)
            </text>

            {/* Rotating Loop */}
            <g transform="translate(230, 110)">
              <ellipse cx="0" cy="0" rx={rx} ry="68" fill="#fef3c7" fillOpacity="0.45" stroke="#d97706" strokeWidth="4.5" />
              {/* Normal vector */}
              <line
                x1="0"
                y1="0"
                x2={Math.cos(rad) * 85}
                y2={-Math.sin(rad) * 85}
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray="5 3"
              />
              <circle cx={Math.cos(rad) * 85} cy={-Math.sin(rad) * 85} r="4" fill="#10b981" />
              <text x={Math.cos(rad) * 92} y={-Math.sin(rad) * 92 - 4} fontSize="11" fontWeight="900" fill="#059669">
                عمود بر سطح (θ={theta}°)
              </text>
            </g>

            <text x="230" y="198" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
              {theta === 90
                ? 'سطح حلقه موازی میدان (θ=90°) ← هیچ خطی عبور نمی‌کند (Φ = 0)!'
                : `تغییر شار هر حلقه: ΔΦ = ${(dPhi * 1e3).toFixed(3)} mWb`}
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\Phi = B A \cos\theta, \qquad \mathcal{E}_{\text{av}} = -N \frac{\Delta \Phi}{\Delta t}, \qquad |\Delta q| = N\frac{|\Delta \Phi|}{R}"
          substitutedTex={`|\\mathcal{E}_{\\text{av}}| = ${N}\\frac{|${(dPhi * 1e3).toFixed(3)}\\times 10^{-3}|}{${dtMs}\\times 10^{-3}} = ${Math.abs(emf).toFixed(2)}\\;\\text{V},\\quad I_{\\text{av}} = ${Iav.toFixed(2)}\\;\\text{A}`}
          symbols={[
            { symbol: '\\Phi', meaning: 'شار مغناطیسی عبوری از یک حلقه', unit: 'Wb (وبر)' },
            { symbol: 'B, A', meaning: 'بزرگی میدان مغناطیسی و مساحت حلقه', unit: 'T, m²' },
            { symbol: '\\theta', meaning: 'زاویه بین $\\vec{B}$ و نیم‌خط عمود بر سطح', unit: 'درجه' },
            { symbol: '\\mathcal{E}_{\\text{av}}', meaning: 'نیروی محرکه القایی متوسط', unit: 'V' },
            { symbol: 'N', meaning: 'تعداد دورهای پیچه', unit: 'دور' },
            { symbol: '\\Delta t, R', meaning: 'مدت زمان تغییر شار و مقاومت پیچه', unit: 's, Ω' },
            { symbol: '|\\Delta q|', meaning: 'بار الکتریکی القایی عبوری از مدار', unit: 'C' },
          ]}
          insight="مقادیر منفی برای B₂ یعنی میدان مغناطیسی وارون شده است! آن را تست کنید و ببینید چگونه ΔΦ و ℰ ناگهان بسیار بزرگ می‌شوند."
        />
      }
      controls={
        <>
          <SliderControl label="تعداد دور پیچه" symbol="N" value={N} min={10} max={500} step={10} unit="دور" accentClass="text-amber-600" onChange={setN} />
          <SliderControl label="مساحت هر حلقه" symbol="A" value={Acm2} min={10} max={100} step={5} unit="cm²" accentClass="text-indigo-600" onChange={setAcm2} />
          <SliderControl label="میدان اولیه" symbol="B_1" value={B1} min={0} max={0.5} step={0.02} unit="T" accentClass="text-violet-600" onChange={setB1} />
          <SliderControl label="میدان ثانویه (منفی = وارون)" symbol="B_2" value={B2} min={-0.5} max={0.5} step={0.02} unit="T" accentClass="text-rose-500" onChange={setB2} />
          <SliderControl label="زاویه B با خط عمود بر سطح" symbol="\theta" value={theta} min={0} max={90} step={15} unit="°" accentClass="text-emerald-600" onChange={setTheta} />
          <SliderControl label="مدت تغییر میدان" symbol="\Delta t" value={dtMs} min={2} max={100} step={2} unit="ms" accentClass="text-cyan-600" onChange={setDtMs} />
          <SliderControl label="مقاومت پیچه" symbol="R" value={R} min={2} max={50} step={2} unit="Ω" accentClass="text-slate-600" onChange={setR} />
        </>
      }
      metrics={
        <>
          <MetricCard label="نیروی محرکه |ℰ_av|" value={Math.abs(emf).toFixed(2)} unit="V" color="violet" />
          <MetricCard label="بار القایی |Δq|" value={formatSciPlain(dq * 1000, 2)} unit="mC" sublabel="مستقل از Δt!" color="emerald" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-9: Lenz's Law 3-Step Visual Trainer
   ========================================================= */
type LenzScenario = 'n_in' | 'n_out' | 'loop_enter' | 'loop_exit';

const lenzCases: Record<
  LenzScenario,
  {
    title: string;
    step1: string;
    step2: string;
    step3: string;
    clockwise: boolean;
    bExt: 'in' | 'out';
    bInd: 'in' | 'out';
  }
> = {
  n_in: {
    title: 'نزدیک شدن قطب N به حلقه',
    step1: 'میدان خارجی (درون‌سو از دید ناظر) در حال افزایش است (ΔΦ > 0).',
    step2: 'حلقه برای مخالفت با افزایش، میدان القایی برون‌سو (⊙) می‌سازد (رویه N برای دفع آهنربا!).',
    step3: 'با قاعده دست راست (شست برون‌سو)، جریان القایی پادساعتگرد است.',
    clockwise: false,
    bExt: 'in',
    bInd: 'out',
  },
  n_out: {
    title: 'دور شدن قطب N از حلقه',
    step1: 'میدان خارجی درون‌سو در حال کاهش است (ΔΦ < 0).',
    step2: 'حلقه برای جبران کاهش، میدان القایی هم‌سو یعنی درون‌سو (⊗) می‌سازد (رویه S برای جذب آهنربا!).',
    step3: 'با قاعده دست راست (شست درون‌سو)، جریان القایی ساعتگرد است.',
    clockwise: true,
    bExt: 'in',
    bInd: 'in',
  },
  loop_enter: {
    title: 'ورود حلقه به میدان درون‌سو (⊗)',
    step1: 'مساحت حلقه داخل میدان درون‌سو زیاد می‌شود ← شار ⊗ در حال افزایش است.',
    step2: 'برای مخالفت با افزایش ⊗، حلقه میدان برون‌سو (⊙) القا می‌کند.',
    step3: 'شست دست راست برون‌سو ← جریان القایی پادساعتگرد است.',
    clockwise: false,
    bExt: 'in',
    bInd: 'out',
  },
  loop_exit: {
    title: 'خروج حلقه از میدان درون‌سو (⊗)',
    step1: 'مساحت حلقه داخل میدان درون‌سو کم می‌شود ← شار ⊗ در حال کاهش است.',
    step2: 'برای مخالفت با کاهش ⊗، حلقه میدان هم‌سو یعنی درون‌سو (⊗) القا می‌کند.',
    step3: 'شست دست راست درون‌سو ← جریان القایی ساعتگرد است.',
    clockwise: true,
    bExt: 'in',
    bInd: 'in',
  },
};

export const Lab3_9: React.FC = () => {
  const [scenario, setScenario] = useState<LenzScenario>('loop_exit');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p + 4) % 360), 40);
    return () => window.clearInterval(id);
  }, []);

  const info = lenzCases[scenario];
  const angRad = ((info.clockwise ? phase : -phase) * Math.PI) / 180;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={scenario}
              onChange={setScenario}
              options={[
                { value: 'n_in', label: 'نزدیک شدن N' },
                { value: 'n_out', label: 'دور شدن N' },
                { value: 'loop_enter', label: 'ورود به میدان ⊗' },
                { value: 'loop_exit', label: 'خروج از میدان ⊗' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
            {/* Field zone background for loop scenarios */}
            {(scenario === 'loop_enter' || scenario === 'loop_exit') && (
              <g>
                <rect
                  x={scenario === 'loop_enter' ? 230 : 30}
                  y="24"
                  width="200"
                  height="172"
                  rx="12"
                  fill="#ede9fe"
                  fillOpacity="0.6"
                  stroke="#8b5cf6"
                  strokeDasharray="5 4"
                />
                {[0, 1, 2].map((c) =>
                  [60, 110, 160].map((y) => (
                    <text
                      key={`${c}-${y}`}
                      x={(scenario === 'loop_enter' ? 265 : 65) + c * 62}
                      y={y + 6}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="900"
                      fill="#7c3aed"
                      fillOpacity="0.45"
                    >
                      ⊗
                    </text>
                  ))
                )}
              </g>
            )}

            {/* Conducting Loop */}
            <circle cx="230" cy="110" r="64" fill="none" stroke="#d97706" strokeWidth="7" />

            {/* Animated induced current beads */}
            {[0, 90, 180, 270].map((deg) => {
              const a = angRad + (deg * Math.PI) / 180;
              return (
                <circle
                  key={deg}
                  cx={230 + Math.cos(a) * 64}
                  cy={110 + Math.sin(a) * 64}
                  r="6"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}

            {/* Induced B symbol at center */}
            <circle cx="230" cy="110" r="24" fill="white" stroke="#10b981" strokeWidth="2.5" />
            <text x="230" y="118" textAnchor="middle" fontSize="24" fontWeight="900" fill="#059669">
              {info.bInd === 'in' ? '⊗' : '⊙'}
            </text>
            <text x="230" y="152" textAnchor="middle" fontSize="10" fontWeight="900" fill="#059669">
              B_القایی ({info.bInd === 'in' ? 'درون‌سو' : 'برون‌سو'})
            </text>

            {/* Motion arrow */}
            <text x="230" y="206" textAnchor="middle" fontSize="12" fontWeight="900" fill="#4f46e5">
              نتیجه لنز: جریان القایی {info.clockwise ? 'ساعتگرد ↻' : 'پادساعتگرد ↺'}
            </text>
          </svg>
        </div>
      }
      controls={
        <div className="space-y-3">
          <div className="text-sm font-extrabold text-violet-700 dark:text-violet-300">
            تحلیل ۳ مرحله‌ای قانون لنز ({info.title}):
          </div>
          {[
            { num: '۱', title: 'بررسی تغییر شار:', text: info.step1, cls: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' },
            { num: '۲', title: 'تعیین B القایی (مخالفت با تغییر):', text: info.step2, cls: 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800' },
            { num: '۳', title: 'قاعده دست راست برای جریان:', text: info.step3, cls: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
          ].map((s) => (
            <div key={s.num} className={`rounded-xl border p-3 text-xs leading-6 ${s.cls}`}>
              <div className="font-extrabold mb-0.5">
                گام {s.num} — {s.title}
              </div>
              <div className="text-slate-700 dark:text-slate-200">{s.text}</div>
            </div>
          ))}
        </div>
      }
      metrics={
        <>
          <MetricCard label="جهت میدان القایی" value={info.bInd === 'in' ? 'درون‌سو ⊗' : 'برون‌سو ⊙'} color="violet" />
          <MetricCard label="جهت جریان القایی" value={info.clockwise ? 'ساعتگرد ↻' : 'پادساعتگرد ↺'} color="emerald" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-10: Inductor Energy (U = 1/2 LI²) & Neon Lamp Flash
   ========================================================= */
export const Lab3_10: React.FC = () => {
  const [LmH, setLmH] = useState(200); // mH
  const [I, setI] = useState(5); // A
  const [swClosed, setSwClosed] = useState(true);
  const [neonFlash, setNeonFlash] = useState(false);

  const U = 0.5 * (LmH * 1e-3) * I * I;

  const toggleSwitch = () => {
    if (swClosed) {
      // Opening switch triggers self-induction neon flash!
      setSwClosed(false);
      setNeonFlash(true);
      window.setTimeout(() => setNeonFlash(false), 950);
    } else {
      setSwClosed(true);
    }
  };

  return (
    <LabShell
      visual={
        <div
          className={`p-4 transition-colors duration-300 ${
            neonFlash
              ? 'bg-orange-200/80 dark:bg-orange-500/30'
              : 'bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950'
          }`}
        >
          <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
            {/* Circuit loop: Battery 9V + Switch + Inductor parallel with Neon Lamp (Exp 3-5!) */}
            <path d="M 65 175 L 65 52 L 385 52 L 385 175 Z" fill="none" stroke="#475569" strokeWidth="2.8" />
            <line x1="255" y1="52" x2="255" y2="175" stroke="#475569" strokeWidth="2.5" />

            {/* 9V Battery */}
            <rect x="42" y="88" width="46" height="54" rx="7" fill="#1e293b" />
            <text x="65" y="114" textAnchor="middle" fontSize="11" fontWeight="900" fill="#f87171">9V</text>
            <text x="65" y="130" textAnchor="middle" fontSize="9" fill="#94a3b8">باتری</text>

            {/* Switch */}
            <rect x="125" y="42" width="56" height="20" fill="#f8fafc" />
            <circle cx="130" cy="52" r="3.5" fill="#0f172a" />
            <circle cx="176" cy="52" r="3.5" fill="#0f172a" />
            <line
              x1="130"
              y1="52"
              x2={swClosed ? 176 : 168}
              y2={swClosed ? 52 : 30}
              stroke={swClosed ? '#10b981' : '#ef4444'}
              strokeWidth="3.5"
            />
            <text x="153" y="25" textAnchor="middle" fontSize="10" fontWeight="800" fill={swClosed ? '#059669' : '#dc2626'}>
              {swClosed ? 'کلید بسته (انرژی ذخیره شد)' : 'کلید قطع شد!'}
            </text>

            {/* Inductor coil on middle branch */}
            <g transform="translate(255, 76)">
              {[0, 18, 36, 54].map((y) => (
                <path key={y} d={`M 0 ${y} C 22 ${y}, 22 ${y + 18}, 0 ${y + 18}`} fill="none" stroke="#7c3aed" strokeWidth="4" />
              ))}
              {swClosed && (
                <rect x="-14" y="-4" width="38" height="82" rx="10" fill="#8b5cf6" fillOpacity={Math.min(0.35, U * 0.08)} />
              )}
              <text x="-16" y="40" textAnchor="end" fontSize="11" fontWeight="900" fill="#6d28d9">
                L={LmH}mH
              </text>
            </g>

            {/* Neon Lamp on right branch */}
            <g transform="translate(385, 114)">
              {neonFlash && <circle cx="0" cy="0" r="38" fill="#fb923c" fillOpacity="0.55" />}
              <circle
                cx="0"
                cy="0"
                r="20"
                fill={neonFlash ? '#f97316' : '#e2e8f0'}
                stroke={neonFlash ? '#c2410c' : '#64748b'}
                strokeWidth="3"
              />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill={neonFlash ? 'white' : '#475569'}>
                نئون
              </text>
              <text x="0" y="38" textAnchor="middle" fontSize="10" fontWeight="800" fill={neonFlash ? '#c2410c' : '#64748b'}>
                {neonFlash ? '⚡ درخشید (>70V)!' : 'خاموش (9V کم است)'}
              </text>
            </g>

            <text x="230" y="206" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
              آزمایش ۳-۵ کتاب: با قطع ناگهانی کلید، انرژی مغناطیسی القاگر ولتاژ بزرگ خودالقایی می‌سازد!
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="U = \frac{1}{2} L I^2"
          substitutedTex={`U = \\frac{1}{2}(${LmH}\\times 10^{-3}\\;\\text{H})(${I}\\;\\text{A})^2 = ${U.toFixed(2)}\\;\\text{J}`}
          symbols={[
            { symbol: 'U', meaning: 'انرژی ذخیره شده در میدان مغناطیسی القاگر', unit: 'J (ژول)' },
            { symbol: 'L', meaning: 'ضریب القاوری سیم‌پیچ (مستقل از جریان)', unit: 'H (هانری)' },
            { symbol: 'I', meaning: 'شدت جریان عبوری از القاگر', unit: 'A (آمپر)' },
          ]}
          insight="در جریان پایا، مقاومت همچنان انرژی را به گرما تلف می‌کند؛ ولی القاگر آرمانی انرژی را بدون تلفات در میدان مغناطیسی نگه می‌دارد و لحظه قطع کلید آزاد می‌کند!"
        />
      }
      controls={
        <>
          <button
            type="button"
            onClick={toggleSwitch}
            className={`w-full py-2.5 rounded-xl font-extrabold text-sm text-white cursor-pointer transition-colors ${
              swClosed ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {swClosed ? '⚡ قطع کردن ناگهانی کلید (مشاهده جرقه نئون!)' : 'وصل کردن دوباره کلید (ذخیره انرژی)'}
          </button>
          <SliderControl label="ضریب القاوری" symbol="L" value={LmH} min={20} max={500} step={20} unit="mH" accentClass="text-violet-600" onChange={setLmH} />
          <SliderControl label="جریان عبوری از القاگر" symbol="I" value={I} min={1} max={12} step={1} unit="A" accentClass="text-indigo-600" onChange={setI} />
        </>
      }
      metrics={
        <>
          <MetricCard label="انرژی مغناطیسی ذخیره U" value={U.toFixed(2)} unit="J" color="violet" />
          <MetricCard label="وضعیت لامپ نئون" value={neonFlash ? 'روشن شد!' : 'خاموش'} sublabel="ولتاژ شکست ≈ 70V" color={neonFlash ? 'amber' : 'indigo'} />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-11: AC Generator & Live Sine Wave Oscilloscope
   ========================================================= */
export const Lab3_11: React.FC = () => {
  const [Im, setIm] = useState(4.0); // A
  const [freq, setFreq] = useState(50); // Hz (Iran standard!)
  const [running, setRunning] = useState(true);
  const [phaseFrac, setPhaseFrac] = useState(0.25); // 0..1 of period T

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setPhaseFrac((p) => (p + 0.012 * (freq / 50)) % 1);
    }, 35);
    return () => window.clearInterval(id);
  }, [running, freq]);

  const T_ms = 1000 / freq;
  const t_ms = phaseFrac * T_ms;
  const theta = phaseFrac * 2 * Math.PI;
  const curI = Im * Math.sin(theta);
  const curPhiNorm = Math.cos(theta);

  // Oscilloscope plot (x from 175 to 440, y center 112)
  const waveI: string[] = [];
  const wavePhi: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const f = i / 80;
    const x = 175 + f * 260;
    const yI = 112 - Math.sin(f * 2 * Math.PI) * (Im / 10) * 78;
    const yP = 112 - Math.cos(f * 2 * Math.PI) * 58;
    waveI.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yI.toFixed(1)}`);
    wavePhi.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${yP.toFixed(1)}`);
  }
  const dotX = 175 + phaseFrac * 260;
  const dotYI = 112 - (curI / 10) * 78;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
            {/* Left: Rotating AC Generator Coil */}
            <rect x="16" y="72" width="24" height="80" rx="4" fill="#ef4444" />
            <text x="28" y="117" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">N</text>
            <rect x="122" y="72" width="24" height="80" rx="4" fill="#2563eb" />
            <text x="134" y="117" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">S</text>

            {/* Coil cross-section rotating */}
            <g transform={`translate(81, 112) rotate(${(phaseFrac * 360).toFixed(1)})`}>
              <line x1="-26" y1="0" x2="26" y2="0" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
              <circle cx="-26" cy="0" r="6" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
              <circle cx="26" cy="0" r="6" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
            </g>
            <text x="81" y="176" textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              چرخش پیچه مولد
            </text>

            {/* Right: Oscilloscope */}
            <rect x="166" y="22" width="278" height="180" rx="12" fill="#0f172a" />
            <line x1="175" y1="112" x2="435" y2="112" stroke="#334155" strokeWidth="1.5" />
            {/* Quarter period markers */}
            {[0.25, 0.5, 0.75, 1].map((q) => (
              <g key={q}>
                <line x1={175 + q * 260} y1="30" x2={175 + q * 260} y2="192" stroke="#1e293b" strokeDasharray="3 3" />
                <text x={175 + q * 260} y="196" textAnchor="middle" fontSize="9" fill="#94a3b8">
                  {q === 0.25 ? 'T/4' : q === 0.5 ? 'T/2' : q === 0.75 ? '3T/4' : 'T'}
                </text>
              </g>
            ))}

            {/* Flux cosine dashed */}
            <path d={wavePhi.join(' ')} fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 4" strokeOpacity="0.65" />
            {/* Current sine solid */}
            <path d={waveI.join(' ')} fill="none" stroke="#a855f7" strokeWidth="3.2" />

            {/* Live cursor dot */}
            <line x1={dotX} y1="30" x2={dotX} y2="188" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx={dotX} cy={dotYI} r="6" fill="#facc15" stroke="white" strokeWidth="2" />

            {/* Legend neatly inside top of dark scope */}
            <text x="180" y="38" textAnchor="start" fontSize="10" fontWeight="800" fill="#c084fc">── جریان I(t)</text>
            <text x="295" y="38" textAnchor="start" fontSize="10" fontWeight="800" fill="#38bdf8">- - شار Φ(t)</text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="I = I_m \sin\left(\frac{2\pi}{T} t\right) = I_m \sin(2\pi f t)"
          substitutedTex={`I(t) = ${Im.toFixed(1)} \\sin(${2 * freq}\\pi t)\\;\\text{A},\\qquad I(${t_ms.toFixed(1)}\\;\\text{ms}) = ${curI.toFixed(2)}\\;\\text{A}`}
          symbols={[
            { symbol: 'I', meaning: 'شدت جریان لحظه‌ای در زمان $t$', unit: 'A' },
            { symbol: 'I_m', meaning: 'بیشینه جریان (دامنه موج سینوسی)', unit: 'A' },
            { symbol: 'T', meaning: 'دوره تناوب (زمان یک چرخه کامل)', unit: 's' },
            { symbol: 'f', meaning: 'بسامد یا فرکانس ($f = 1/T$)', unit: 'Hz' },
            { symbol: 't', meaning: 'زمان سپری‌شده از شروع حرکت', unit: 's' },
          ]}
          insight="دقت کنید به اختلاف فاز شار و جریان در اسیلوسکوپ: هرگاه شار مغناطیسی (خط‌چین آبی) صفر می‌شود، جریان القایی (بنفش) به بیشینه اندازه $\pm I_m$ می‌رسد!"
        />
      }
      controls={
        <>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold cursor-pointer"
            >
              {running ? 'توقف زمان (برای بررسی لحظه‌ای)' : 'ادامه چرخش مولد'}
            </button>
          </div>
          <SliderControl label="بیشینه جریان (دامنه)" symbol="I_m" value={Im} min={1} max={10} step={0.5} unit="A" accentClass="text-violet-600" onChange={setIm} />
          <SliderControl label="بسامد (فرکانس برق)" symbol="f" value={freq} min={25} max={125} step={25} unit="Hz" accentClass="text-cyan-600" onChange={setFreq} />
          <SliderControl
            label="زمان لحظه‌ای (در یک دوره T)"
            symbol="t"
            value={Number(phaseFrac.toFixed(2))}
            min={0}
            max={1}
            step={0.05}
            displayValue={`${t_ms.toFixed(1)} ms (${Math.round(phaseFrac * 360)}°)`}
            accentClass="text-amber-500"
            onChange={(v) => {
              setRunning(false);
              setPhaseFrac(v);
            }}
          />
        </>
      }
      metrics={
        <>
          <MetricCard label="دوره تناوب T = 1/f" value={T_ms.toFixed(1)} unit="ms" sublabel={`تغییر جهت در ثانیه: ${freq * 2} بار`} color="cyan" />
          <MetricCard
            label="جریان لحظه‌ای I(t)"
            value={curI.toFixed(2)}
            unit="A"
            sublabel={`شار نسبی: ${curPhiNorm >= 0 ? '+' : '−'}${Math.abs(Math.round(curPhiNorm * 100))}٪`}
            color="violet"
          />
        </>
      }
    />
  );
};
