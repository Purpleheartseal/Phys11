import React, { useState, useEffect } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
  formatSciPlain,
} from '../components/LabUI';

/* =========================================================
   LAB 3-1: Magnetic Poles & Cut-the-Magnet (No Monopoles)
   ========================================================= */
export const Lab3_1: React.FC = () => {
  const [mode, setMode] = useState<'interact' | 'cut'>('interact');
  const [rightFlip, setRightFlip] = useState(false); // false: N-S vs N-S (attract S-N); true: N-S vs S-N (repel S-S)
  const [pieces, setPieces] = useState(1); // 1, 2, 4

  const attract = !rightFlip;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'interact', label: 'جاذبه و دافعه دو آهنربا' },
                { value: 'cut', label: 'برش آهنربا (نبود تک‌قطبی)' },
              ]}
            />
          </div>

          {mode === 'interact' ? (
            <svg viewBox="0 0 460 200" className="w-full h-auto max-h-[220px]">
              {/* Left Magnet: N left, S right */}
              <g transform={`translate(${attract ? 92 : 62}, 75)`}>
                <rect x="0" y="0" width="65" height="50" rx="6" fill="#ef4444" />
                <rect x="65" y="0" width="65" height="50" rx="6" fill="#2563eb" />
                <text x="32" y="31" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">N</text>
                <text x="97" y="31" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">S</text>
              </g>

              {/* Force arrows in middle */}
              {attract ? (
                <g>
                  <line x1="226" y1="100" x2="236" y2="100" stroke="#10b981" strokeWidth="4" />
                  <text x="230" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill="#059669">
                    قطب‌های ناهم‌نام (S و N) ← جاذبه!
                  </text>
                  <polygon points="222,100 210,93 210,107" fill="#10b981" />
                  <polygon points="238,100 250,93 250,107" fill="#10b981" />
                </g>
              ) : (
                <g>
                  <text x="230" y="55" textAnchor="middle" fontSize="13" fontWeight="900" fill="#e11d48">
                    قطب‌های هم‌نام (S و S) ← دافعه!
                  </text>
                  <line x1="196" y1="100" x2="220" y2="100" stroke="#f43f5e" strokeWidth="3.5" />
                  <polygon points="196,100 208,93 208,107" fill="#f43f5e" />
                  <line x1="240" y1="100" x2="264" y2="100" stroke="#f43f5e" strokeWidth="3.5" />
                  <polygon points="264,100 252,93 252,107" fill="#f43f5e" />
                </g>
              )}

              {/* Right Magnet */}
              <g transform={`translate(${attract ? 238 : 268}, 75)`}>
                <rect x="0" y="0" width="65" height="50" rx="6" fill={rightFlip ? '#2563eb' : '#ef4444'} />
                <rect x="65" y="0" width="65" height="50" rx="6" fill={rightFlip ? '#ef4444' : '#2563eb'} />
                <text x="32" y="31" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">
                  {rightFlip ? 'S' : 'N'}
                </text>
                <text x="97" y="31" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">
                  {rightFlip ? 'N' : 'S'}
                </text>
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 460 200" className="w-full h-auto max-h-[220px]">
              {Array.from({ length: pieces }).map((_, i) => {
                const gap = 14;
                const totalW = 360;
                const w = (totalW - (pieces - 1) * gap) / pieces;
                const x = 50 + i * (w + gap);
                return (
                  <g key={i} transform={`translate(${x}, 72)`}>
                    <rect x="0" y="0" width={w / 2} height="52" rx="4" fill="#ef4444" />
                    <rect x={w / 2} y="0" width={w / 2} height="52" rx="4" fill="#2563eb" />
                    <text x={w / 4} y="32" textAnchor="middle" fontSize={pieces === 4 ? 13 : 17} fontWeight="900" fill="white">N</text>
                    <text x={(3 * w) / 4} y="32" textAnchor="middle" fontSize={pieces === 4 ? 13 : 17} fontWeight="900" fill="white">S</text>
                  </g>
                );
              })}
              <text x="230" y="165" textAnchor="middle" fontSize="12" fontWeight="800" className="fill-violet-700 dark:fill-violet-300">
                تعداد قطعات: {pieces} ← هر قطعه دوباره یک آهنربای کامل با دو قطب N و S است!
              </text>
            </svg>
          )}
        </div>
      }
      controls={
        mode === 'interact' ? (
          <>
            <button
              type="button"
              onClick={() => setRightFlip((f) => !f)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm cursor-pointer"
            >
              برعکس کردن قطب‌های آهنربای سمت راست (N ↔ S)
            </button>
            <div className="text-xs leading-7 text-slate-600 dark:text-slate-300">
              بیشترین خاصیت مغناطیسی در دو سر آهنربا (قطب‌ها) است و در وسط آهنربا خاصیت مغناطیسی بسیار ناچیز است.
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">تعداد برش آهنربا:</div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 4].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPieces(p)}
                  className={`py-2.5 rounded-xl text-xs font-extrabold border cursor-pointer ${
                    pieces === p
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {p === 1 ? 'آهنربای سالم' : `برش به ${p} تکه`}
                </button>
              ))}
            </div>
          </div>
        )
      }
      metrics={
        <>
          <MetricCard label="تک‌قطبی مغناطیسی" value="وجود ندارد" color="violet" />
          <MetricCard
            label={mode === 'interact' ? 'نوع نیرو' : 'تعداد قطب‌ها'}
            value={mode === 'interact' ? (attract ? 'جاذبه' : 'دافعه') : `${pieces * 2} قطب`}
            color={mode === 'interact' && !attract ? 'rose' : 'emerald'}
          />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-2: Magnetic Field Lines, Compass & Earth's Magnetism
   ========================================================= */
export const Lab3_2: React.FC = () => {
  const [view, setView] = useState<'bar' | 'earth'>('bar');
  const [angleDeg, setAngleDeg] = useState(45); // compass orbit angle around magnet

  const rad = (angleDeg * Math.PI) / 180;
  const cx = 230 + Math.cos(rad) * 125;
  const cy = 115 + Math.sin(rad) * 78;
  // Dipole field approximation (N at x=290, S at x=170)
  const dxN = cx - 290;
  const dyN = cy - 115;
  const rN = Math.pow(dxN * dxN + dyN * dyN + 100, 1.5);
  const dxS = cx - 170;
  const dyS = cy - 115;
  const rS = Math.pow(dxS * dxS + dyS * dyS + 100, 1.5);
  const bx = dxN / rN - dxS / rS;
  const by = dyN / rN - dyS / rS;
  const compassRot = (Math.atan2(by, bx) * 180) / Math.PI;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={view}
              onChange={setView}
              options={[
                { value: 'bar', label: 'خطوط میدان و عقربه قطب‌نما' },
                { value: 'earth', label: 'میدان مغناطیسی زمین' },
              ]}
            />
          </div>

          {view === 'bar' ? (
            <svg viewBox="0 0 460 230" className="w-full h-auto max-h-[245px]">
              {/* Closed magnetic loops: outside N(right) -> S(left), inside S -> N */}
              {[-68, -36, 36, 68].map((h, i) => (
                <path
                  key={i}
                  d={`M 290 115 C 365 ${115 + h * 1.4}, 95 ${115 + h * 1.4}, 170 115`}
                  fill="none"
                  stroke="#7c3aed"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                />
              ))}
              {/* Bar magnet: S left, N right */}
              <rect x="170" y="92" width="60" height="46" rx="4" fill="#2563eb" />
              <rect x="230" y="92" width="60" height="46" rx="4" fill="#ef4444" />
              <text x="200" y="121" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">S</text>
              <text x="260" y="121" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">N</text>
              {/* Inside S -> N arrow */}
              <line x1="188" y1="100" x2="270" y2="100" stroke="#fde047" strokeWidth="2.5" strokeDasharray="4 2" />
              <polygon points="276,100 266,96 266,104" fill="#fde047" />
              <text x="230" y="158" textAnchor="middle" fontSize="10" fontWeight="800" fill="#6d28d9">
                درون آهنربا: از S به N | بیرون آهنربا: از N به S (خطوط بسته!)
              </text>

              {/* Movable Compass */}
              <g transform={`translate(${cx}, ${cy}) rotate(${compassRot})`}>
                <circle cx="0" cy="0" r="18" fill="white" stroke="#475569" strokeWidth="2" />
                <polygon points="14,0 0,-5 0,5" fill="#ef4444" />
                <polygon points="-14,0 0,-5 0,5" fill="#2563eb" />
                <circle cx="0" cy="0" r="2.5" fill="#0f172a" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 460 230" className="w-full h-auto max-h-[245px]">
              {/* Earth circle */}
              <circle cx="230" cy="115" r="76" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
              {/* Internal equivalent bar magnet: S at geographic North, N at geographic South! */}
              <g transform="translate(230, 115) rotate(-11)">
                <rect x="-15" y="-52" width="30" height="52" rx="3" fill="#2563eb" />
                <rect x="-15" y="0" width="30" height="52" rx="3" fill="#ef4444" />
                <text x="0" y="-22" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">S</text>
                <text x="0" y="30" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">N</text>
              </g>
              {/* Field arcs from South (N-mag) up to North (S-mag) */}
              <path d="M 240 188 C 365 200, 365 30, 220 42" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
              <path d="M 240 188 C 95 200, 95 30, 220 42" fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="5 3" />
              <text x="230" y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e40af">
                قطب شمال جغرافیایی ≈ قطب جنوب مغناطیسی (S)
              </text>
              <text x="230" y="216" textAnchor="middle" fontSize="11" fontWeight="900" fill="#b91c1c">
                قطب جنوب جغرافیایی ≈ قطب شمال مغناطیسی (N)
              </text>
            </svg>
          )}
        </div>
      }
      controls={
        <>
          {view === 'bar' && (
            <SliderControl
              label="موقعیت زاویه‌ای قطب‌نما دور آهنربا"
              value={angleDeg}
              min={0}
              max={360}
              step={15}
              unit="°"
              accentClass="text-violet-600"
              onChange={setAngleDeg}
            />
          )}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-center">
              <div className="text-2xl font-black text-violet-600 dark:text-violet-400">⊗</div>
              <div className="text-xs font-bold mt-1">میدان درون‌سو</div>
              <div className="text-[10px] text-slate-500">عمود بر صفحه به داخل (ته‌پیکان)</div>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-center">
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">⊙</div>
              <div className="text-xs font-bold mt-1">میدان برون‌سو</div>
              <div className="text-[10px] text-slate-500">عمود بر صفحه به بیرون (نوک پیکان)</div>
            </div>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="تبدیل تسلا و گاوس" value="1 T = 10⁴ G" color="violet" />
          <MetricCard label="میدان سطح زمین" value="≈ 0.5 G" sublabel="5 × 10⁻⁵ T" color="cyan" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-3: Lorentz Force on Moving Charge (F = |q|vB sinθ)
   ========================================================= */
export const Lab3_3: React.FC = () => {
  const [qSign, setQSign] = useState<'pos' | 'neg'>('pos');
  const [bDir, setBDir] = useState<'in' | 'out'>('in');
  const [qMicro, setQMicro] = useState(4); // µC
  const [v, setV] = useState(200); // m/s
  const [BmT, setBmT] = useState(50); // mT (500 G)
  const [theta, setTheta] = useState(90); // deg

  const F_mN = qMicro * 1e-6 * v * (BmT * 1e-3) * Math.sin((theta * Math.PI) / 180) * 1000;
  // v is to the right (+x). B_in = -z, B_out = +z.
  // v × B: (+x) × (-z) = +y (UP in standard coords, so UP on screen!).
  // For negative charge, flip!
  const forceUp = (bDir === 'in' ? 1 : -1) * (qSign === 'pos' ? 1 : -1) > 0;
  const bend = theta === 0 || theta === 180 ? 0 : (forceUp ? -1 : 1) * Math.min(72, 16 + F_mN * 450);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
            {/* Magnetic field zone (right side) */}
            <rect x="165" y="18" width="275" height="190" rx="14" fill="#ede9fe" fillOpacity="0.45" stroke="#8b5cf6" strokeWidth="1.8" strokeDasharray="5 4" />
            {[200, 260, 320, 380, 420].map((x) =>
              [50, 112, 174].map((y) => (
                <text key={`${x}-${y}`} x={x} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="900" fill="#7c3aed" fillOpacity="0.55">
                  {bDir === 'in' ? '⊗' : '⊙'}
                </text>
              ))
            )}
            <text x="428" y="34" textAnchor="end" fontSize="11" fontWeight="900" fill="#6d28d9">
              B = {BmT} mT ({BmT * 10} G) {bDir === 'in' ? 'درون‌سو' : 'برون‌سو'}
            </text>

            {/* Incoming straight path */}
            <line x1="35" y1="112" x2="165" y2="112" stroke="#475569" strokeWidth="2.5" strokeDasharray="5 4" />

            {/* Curved magnetic trajectory */}
            <path
              d={`M 165 112 Q 285 112, 365 ${112 + bend}`}
              fill="none"
              stroke={qSign === 'pos' ? '#ef4444' : '#2563eb'}
              strokeWidth="3.5"
            />

            {/* Velocity arrow v */}
            <line x1="165" y1="112" x2="230" y2="112" stroke="#0284c7" strokeWidth="3.5" />
            <polygon points="238,112 226,106 226,118" fill="#0284c7" />
            <text x="206" y="102" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0284c7">v</text>

            {/* Force arrow F at entry */}
            {theta !== 0 && theta !== 180 && (
              <g>
                <line x1="165" y1="112" x2="165" y2={forceUp ? 50 : 174} stroke="#10b981" strokeWidth="4" />
                <polygon
                  points={forceUp ? '165,42 158,54 172,54' : '165,182 158,170 172,170'}
                  fill="#10b981"
                />
                <text x="148" y={forceUp ? 68 : 162} textAnchor="end" fontSize="12" fontWeight="900" fill="#059669">
                  F ({forceUp ? 'بالا' : 'پایین'})
                </text>
              </g>
            )}

            {/* Particle */}
            <circle cx="165" cy="112" r="14" fill={qSign === 'pos' ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
            <text x="165" y="117" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">
              {qSign === 'pos' ? '+' : '−'}
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="F = |q|\,v\,B\,\sin\theta"
          substitutedTex={`F = (${qMicro}\\times 10^{-6})(${v})(${(BmT * 1e-3).toFixed(3)})\\sin(${theta}^\\circ) = ${formatSciPlain(F_mN * 1e-3, 2)}\\;\\text{N}`}
          symbols={[
            { symbol: 'F', meaning: 'اندازه نیروی مغناطیسی وارد بر ذره', unit: 'N' },
            { symbol: '|q|', meaning: 'اندازه بار الکتریکی ذره متحرک', unit: 'C' },
            { symbol: 'v', meaning: 'تندی حرکت ذره', unit: 'm/s' },
            { symbol: 'B', meaning: 'بزرگی میدان مغناطیسی ($1\\;\\text{T}=10^4\\;\\text{G}$)', unit: 'T' },
            { symbol: '\\theta', meaning: 'زاویه بین بردار سرعت $\\vec{v}$ و میدان $\\vec{B}$', unit: 'درجه' },
          ]}
          insight={
            theta === 0 || theta === 180
              ? 'ذره موازی میدان حرکت می‌کند (sin θ = 0) ← هیچ نیروی مغناطیسی وارد نمی‌شود و مسیر مستقیم می‌ماند!'
              : `دست راست (۴ انگشت راست، کف دست ${bDir === 'in' ? 'داخل صفحه' : 'بیرون صفحه'}) ← شست برای بار مثبت به سمت ${bDir === 'in' ? 'بالا' : 'پایین'} است${qSign === 'neg' ? '؛ چون بار منفی است جهت نیرو برعکس شد!' : '.'}`
          }
        />
      }
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <SegmentedButtons
              value={qSign}
              onChange={setQSign}
              options={[
                { value: 'pos', label: 'بار (+)' },
                { value: 'neg', label: 'بار (−)' },
              ]}
            />
            <SegmentedButtons
              value={bDir}
              onChange={setBDir}
              options={[
                { value: 'in', label: 'درون‌سو ⊗' },
                { value: 'out', label: 'برون‌سو ⊙' },
              ]}
            />
          </div>
          <SliderControl label="اندازه بار" symbol="|q|" value={qMicro} min={1} max={10} unit="µC" accentClass="text-rose-500" onChange={setQMicro} />
          <SliderControl label="تندی ذره" symbol="v" value={v} min={50} max={500} step={50} unit="m/s" accentClass="text-sky-600" onChange={setV} />
          <SliderControl label="میدان مغناطیسی" symbol="B" value={BmT} min={10} max={200} step={10} unit="mT" accentClass="text-violet-600" onChange={setBmT} />
          <SliderControl label="زاویه بین v و B" symbol="\theta" value={theta} min={0} max={180} step={15} unit="°" accentClass="text-amber-600" onChange={setTheta} />
        </>
      }
      metrics={
        <>
          <MetricCard label="اندازه نیروی مغناطیسی" value={formatSciPlain(F_mN, 2)} unit="mN" color="emerald" />
          <MetricCard label="جهت انحراف" value={theta === 0 || theta === 180 ? 'مستقیم (F=0)' : forceUp ? 'رو به بالا ↑' : 'رو به پایین ↓'} sublabel="تندی ذره ثابت می‌ماند!" color="violet" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-4: Magnetic Force on Current-Carrying Wire (F = IlB sinθ)
   ========================================================= */
export const Lab3_4: React.FC = () => {
  const [iDir, setIDir] = useState<'up' | 'down'>('up');
  const [bDir, setBDir] = useState<'in' | 'out'>('in');
  const [I, setI] = useState(5); // A
  const [lCm, setLCm] = useState(50); // cm
  const [B, setB] = useState(0.4); // T
  const [theta, setTheta] = useState(90); // deg

  const F = I * (lCm / 100) * B * Math.sin((theta * Math.PI) / 180);
  // I up (+y), B in (-z): (+y) × (-z) = -x (LEFT!). Flip if iDir=down or bDir=out.
  const forceRight = (iDir === 'up' ? -1 : 1) * (bDir === 'in' ? 1 : -1) > 0;
  const bendX = theta === 0 || theta === 180 ? 0 : (forceRight ? 1 : -1) * Math.min(55, F * 28);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
            <rect x="80" y="20" width="300" height="180" rx="14" fill="#ede9fe" fillOpacity="0.45" stroke="#8b5cf6" strokeDasharray="5 4" />
            {[125, 195, 265, 335].map((x) =>
              [55, 110, 165].map((y) => (
                <text key={`${x}-${y}`} x={x} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="900" fill="#7c3aed" fillOpacity="0.5">
                  {bDir === 'in' ? '⊗' : '⊙'}
                </text>
              ))
            )}

            {/* Flexible wire curving under magnetic force */}
            <path
              d={`M 230 22 Q ${230 + bendX * 1.6} 110, 230 198`}
              fill="none"
              stroke="#ea580c"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Current direction arrow */}
            <polygon
              points={iDir === 'up' ? '230,35 222,52 238,52' : '230,185 222,168 238,168'}
              fill="#dc2626"
            />
            <text x="248" y="48" fontSize="12" fontWeight="900" fill="#dc2626">
              I = {I}A ({iDir === 'up' ? 'بالا ↑' : 'پایین ↓'})
            </text>

            {/* Force arrow */}
            {theta !== 0 && theta !== 180 && (
              <g>
                <line
                  x1={230 + bendX * 0.8}
                  y1="110"
                  x2={230 + bendX * 0.8 + (forceRight ? 68 : -68)}
                  y2="110"
                  stroke="#10b981"
                  strokeWidth="4.5"
                />
                <polygon
                  points={
                    forceRight
                      ? `${230 + bendX * 0.8 + 76},110 ${230 + bendX * 0.8 + 64},103 ${230 + bendX * 0.8 + 64},117`
                      : `${230 + bendX * 0.8 - 76},110 ${230 + bendX * 0.8 - 64},103 ${230 + bendX * 0.8 - 64},117`
                  }
                  fill="#10b981"
                />
                <text
                  x={230 + bendX * 0.8 + (forceRight ? 40 : -40)}
                  y="96"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="900"
                  fill="#059669"
                >
                  F = {F.toFixed(2)} N
                </text>
              </g>
            )}
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="F = I\,l\,B\,\sin\theta"
          substitutedTex={`F = (${I})(${(lCm / 100).toFixed(2)})(${B.toFixed(2)})\\sin(${theta}^\\circ) = ${F.toFixed(2)}\\;\\text{N}`}
          symbols={[
            { symbol: 'F', meaning: 'اندازه نیروی مغناطیسی وارد بر سیم', unit: 'N' },
            { symbol: 'I', meaning: 'شدت جریان عبوری از سیم', unit: 'A' },
            { symbol: 'l', meaning: 'طول قسمتی از سیم که درون میدان است', unit: 'm' },
            { symbol: 'B', meaning: 'بزرگی میدان مغناطیسی', unit: 'T' },
            { symbol: '\\theta', meaning: 'زاویه بین راستای جریان سیم و میدان $\\vec{B}$', unit: 'درجه' },
          ]}
          insight="قاعده دست راست برای سیم: ۴ انگشت در جهت جریان I، کف دست در جهت میدان B ← شست جهت نیرو به سیم را نشان می‌دهد!"
        />
      }
      controls={
        <>
          <div className="grid grid-cols-2 gap-2">
            <SegmentedButtons
              value={iDir}
              onChange={setIDir}
              options={[
                { value: 'up', label: 'جریان بالا ↑' },
                { value: 'down', label: 'جریان پایین ↓' },
              ]}
            />
            <SegmentedButtons
              value={bDir}
              onChange={setBDir}
              options={[
                { value: 'in', label: 'میدان ⊗' },
                { value: 'out', label: 'میدان ⊙' },
              ]}
            />
          </div>
          <SliderControl label="شدت جریان سیم" symbol="I" value={I} min={1} max={10} unit="A" accentClass="text-orange-600" onChange={setI} />
          <SliderControl label="طول سیم در میدان" symbol="l" value={lCm} min={10} max={100} step={10} unit="cm" accentClass="text-indigo-600" onChange={setLCm} />
          <SliderControl label="بزرگی میدان" symbol="B" value={B} min={0.1} max={1.0} step={0.1} unit="T" accentClass="text-violet-600" onChange={setB} />
          <SliderControl label="زاویه سیم با میدان" symbol="\theta" value={theta} min={0} max={180} step={15} unit="°" accentClass="text-amber-600" onChange={setTheta} />
        </>
      }
      metrics={
        <>
          <MetricCard label="نیروی وارد بر سیم F" value={F.toFixed(2)} unit="N" color="emerald" />
          <MetricCard label="جهت انحراف سیم" value={theta === 0 || theta === 180 ? 'صفر' : forceRight ? 'به راست →' : 'به چپ ←'} color="violet" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 3-5: Magnetic Field of Currents (Solenoid, Wire, Parallel Wires)
   ========================================================= */
export const Lab3_5: React.FC = () => {
  const [sub, setSub] = useState<'solenoid' | 'wire' | 'parallel'>('solenoid');
  // Solenoid
  const [N, setN] = useState(600);
  const [lCm, setLCm] = useState(15);
  const [I, setI] = useState(2.0);
  const [ironCore, setIronCore] = useState(false);
  // Wire
  const [wireOut, setWireOut] = useState(true);
  // Parallel wires
  const [sameDir, setSameDir] = useState(true);

  const mu0 = 4 * Math.PI * 1e-7;
  const B_mT = ((mu0 * N * I) / (lCm / 100)) * 1000;
  const B_G = B_mT * 10;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={sub}
              onChange={setSub}
              options={[
                { value: 'solenoid', label: 'سیملوله آرمانی (فرمول)' },
                { value: 'wire', label: 'سیم راست (اورستد)' },
                { value: 'parallel', label: 'دو سیم موازی' },
              ]}
            />
          </div>

          {sub === 'solenoid' && (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {/* Optional Iron core */}
              {ironCore && (
                <rect x="88" y="84" width="284" height="48" rx="8" fill="#64748b" stroke="#334155" strokeWidth="2.5" />
              )}
              {/* Uniform field lines inside solenoid */}
              {[95, 108, 121].map((y) => (
                <g key={y}>
                  <line x1="55" y1={y} x2="400" y2={y} stroke="#7c3aed" strokeWidth={ironCore ? 3.2 : 2.2} />
                  <polygon points={`408,${y} 396,${y - 4} 396,${y + 4}`} fill="#7c3aed" />
                </g>
              ))}
              {/* Coils */}
              {Array.from({ length: Math.min(18, Math.max(6, Math.round(N / 70))) }).map((_, i, arr) => {
                const x = 105 + (i / (arr.length - 1)) * 250;
                return (
                  <ellipse
                    key={i}
                    cx={x}
                    cy="108"
                    rx="11"
                    ry="40"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="3.5"
                  />
                );
              })}
              <text x="68" y="65" textAnchor="middle" fontSize="15" fontWeight="900" fill="#2563eb">S</text>
              <text x="392" y="65" textAnchor="middle" fontSize="15" fontWeight="900" fill="#ef4444">N</text>
              <text x="230" y="185" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-violet-700 dark:fill-violet-300">
                {ironCore
                  ? 'هسته آهنی میدان سیملوله را صدها برابر تقویت می‌کند (آهنربای الکتریکی)!'
                  : `میدان یکنواخت درون سیملوله (هوا): B = ${B_mT.toFixed(2)} mT (${B_G.toFixed(1)} G)`}
              </text>
            </svg>
          )}

          {sub === 'wire' && (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {[38, 68, 96].map((r) => (
                <circle key={r} cx="230" cy="108" r={r} fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="6 3" />
              ))}
              {/* Direction tangent arrows on middle ring */}
              <polygon points={wireOut ? '230,40 242,34 242,46' : '230,40 218,34 218,46'} fill="#7c3aed" />
              <polygon points={wireOut ? '230,176 218,170 218,182' : '230,176 242,170 242,182'} fill="#7c3aed" />
              <circle cx="230" cy="108" r="16" fill="#ea580c" stroke="white" strokeWidth="2.5" />
              <text x="230" y="114" textAnchor="middle" fontSize="18" fontWeight="900" fill="white">
                {wireOut ? '⊙' : '⊗'}
              </text>
              <text x="230" y="206" textAnchor="middle" fontSize="11" fontWeight="800" fill="#6d28d9">
                جریان {wireOut ? 'برون‌سو (⊙) ← خطوط میدان پادساعتگرد' : 'درون‌سو (⊗) ← خطوط میدان ساعتگرد'}
              </text>
            </svg>
          )}

          {sub === 'parallel' && (
            <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
              {/* Wire 1 */}
              <line x1="155" y1="30" x2="155" y2="185" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
              <polygon points="155,44 147,60 163,60" fill="#dc2626" />
              {/* Wire 2 */}
              <line x1="305" y1="30" x2="305" y2="185" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
              <polygon points={sameDir ? '305,44 297,60 313,60' : '305,172 297,156 313,156'} fill="#dc2626" />

              {/* Forces */}
              <line x1="155" y1="110" x2={sameDir ? 215 : 95} y2="110" stroke="#10b981" strokeWidth="4" />
              <polygon points={sameDir ? '222,110 210,103 210,117' : '88,110 100,103 100,117'} fill="#10b981" />

              <line x1="305" y1="110" x2={sameDir ? 245 : 365} y2="110" stroke="#10b981" strokeWidth="4" />
              <polygon points={sameDir ? '238,110 250,103 250,117' : '372,110 360,103 360,117'} fill="#10b981" />

              <text x="230" y="205" textAnchor="middle" fontSize="12" fontWeight="900" fill={sameDir ? '#059669' : '#e11d48'}>
                {sameDir ? 'جریان‌های هم‌سو ← نیروی ربایشی (جاذبه)!' : 'جریان‌های ناهم‌سو ← نیروی رانشی (دافعه)!'}
              </text>
            </svg>
          )}
        </div>
      }
      formula={
        sub === 'solenoid' ? (
          <LiveFormulaCard
            formulaTex="B = \frac{\mu_0 N I}{l} \qquad (\mu_0 = 4\pi \times 10^{-7}\;\text{T}\cdot\text{m/A})"
            substitutedTex={`B = \\frac{(4\\pi\\times 10^{-7})(${N})(${I.toFixed(1)})}{${(lCm / 100).toFixed(2)}} = ${B_mT.toFixed(2)}\\;\\text{mT} = ${B_G.toFixed(1)}\\;\\text{G}`}
            symbols={[
              { symbol: 'B', meaning: 'بزرگی میدان مغناطیسی درون سیملوله', unit: 'T' },
              { symbol: '\\mu_0', meaning: 'تراوایی مغناطیسی خلأ', unit: '4π×10⁻⁷ T·m/A' },
              { symbol: 'N', meaning: 'تعداد کل دورهای (حلقه‌های) سیملوله', unit: 'دور' },
              { symbol: 'I', meaning: 'شدت جریان عبوری از سیملوله', unit: 'A' },
              { symbol: 'l', meaning: 'طول کل سیملوله', unit: 'm' },
            ]}
            insight="بزرگی میدان درون سیملوله آرمانی به شعاع سیملوله بستگی ندارد؛ فقط به تعداد دور در واحد طول (N/l) و جریان I وابسته است."
          />
        ) : undefined
      }
      controls={
        sub === 'solenoid' ? (
          <>
            <SliderControl label="تعداد دور سیملوله" symbol="N" value={N} min={100} max={1200} step={50} unit="دور" accentClass="text-amber-600" onChange={setN} />
            <SliderControl label="طول سیملوله" symbol="l" value={lCm} min={10} max={60} step={5} unit="cm" accentClass="text-indigo-600" onChange={setLCm} />
            <SliderControl label="شدت جریان" symbol="I" value={I} min={0.4} max={6.0} step={0.2} unit="A" accentClass="text-violet-600" onChange={setI} />
            <button
              type="button"
              onClick={() => setIronCore((v) => !v)}
              className={`w-full py-2 rounded-xl text-xs font-extrabold border cursor-pointer ${
                ironCore
                  ? 'bg-slate-800 text-white border-slate-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
              }`}
            >
              {ironCore ? '✓ هسته آهنی داخل سیملوله است (خارج کن)' : 'قرار دادن هسته آهنی (آهنربای الکتریکی)'}
            </button>
          </>
        ) : sub === 'wire' ? (
          <button
            type="button"
            onClick={() => setWireOut((v) => !v)}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm cursor-pointer"
          >
            تغییر جهت جریان سیم (⊙ برون‌سو ↔ ⊗ درون‌سو)
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSameDir((v) => !v)}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm cursor-pointer"
          >
            تغییر جهت جریان سیم دوم ({sameDir ? 'فعلاً هم‌سو' : 'فعلاً ناهم‌سو'})
          </button>
        )
      }
      metrics={
        sub === 'solenoid' ? (
          <>
            <MetricCard label="میدان B (میلی‌تسلا)" value={B_mT.toFixed(2)} unit="mT" color="violet" />
            <MetricCard label="میدان B (گاوس)" value={B_G.toFixed(1)} unit="G" color="cyan" />
          </>
        ) : undefined
      }
    />
  );
};

/* =========================================================
   LAB 3-6: Magnetic Materials & Domains Simulator
   ========================================================= */
export const Lab3_6: React.FC = () => {
  const [mat, setMat] = useState<'softFerro' | 'hardFerro' | 'para' | 'dia'>('softFerro');
  const [Bext, setBext] = useState(0); // 0..100
  const [wasMagnetized, setWasMagnetized] = useState(false);

  useEffect(() => {
    if (Bext >= 60 && mat === 'hardFerro') setWasMagnetized(true);
  }, [Bext, mat]);

  const alignment =
    mat === 'dia'
      ? -Bext * 0.35
      : mat === 'para'
      ? Bext * 0.45
      : mat === 'softFerro'
      ? Bext
      : wasMagnetized
      ? Math.max(78, Bext)
      : Bext;

  const baseAngles = [35, 145, -120, 75, -45, 165, -80, 15, 120, -155, 50, -25];

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-violet-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mat}
              onChange={(v) => {
                setMat(v);
                setWasMagnetized(false);
              }}
              options={[
                { value: 'softFerro', label: 'فرومغناطیس نرم (آهن)' },
                { value: 'hardFerro', label: 'فرومغناطیس سخت (فولاد)' },
                { value: 'para', label: 'پارامغناطیس (Al)' },
                { value: 'dia', label: 'دیامغناطیس (Cu/Bi)' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 215" className="w-full h-auto max-h-[235px]">
            {/* External B field */}
            {Bext > 5 && (
              <g>
                <line x1="35" y1="26" x2="410" y2="26" stroke="#0ea5e9" strokeWidth="3" />
                <polygon points="420,26 406,20 406,32" fill="#0ea5e9" />
                <text x="230" y="18" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0284c7">
                  میدان مغناطیسی خارجی B_ext = {Bext}% →
                </text>
              </g>
            )}

            {/* Material Slab */}
            <rect x="75" y="45" width="310" height="135" rx="16" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />

            {/* Microscopic dipoles/domains */}
            {baseAngles.map((randAng, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const x = 120 + col * 72;
              const y = 76 + row * 38;
              const t = Math.abs(alignment) / 100;
              const target = alignment >= 0 ? 0 : 180;
              const ang = mat === 'dia' ? (Bext > 5 ? 180 : 0) : randAng * (1 - t) + target * t;
              const showArrow = mat !== 'dia' || Bext > 8;
              return (
                <g key={i} transform={`translate(${x}, ${y}) rotate(${ang})`}>
                  <circle cx="0" cy="0" r="14" fill="white" fillOpacity="0.7" stroke="#94a3b8" strokeWidth="1" />
                  {showArrow ? (
                    <>
                      <line x1="-10" y1="0" x2="7" y2="0" stroke={mat === 'dia' ? '#e11d48' : '#7c3aed'} strokeWidth="2.8" />
                      <polygon points="11,0 4,-4 4,4" fill={mat === 'dia' ? '#e11d48' : '#7c3aed'} />
                    </>
                  ) : (
                    <circle cx="0" cy="0" r="3.5" fill="#94a3b8" />
                  )}
                </g>
              );
            })}

            <text x="230" y="202" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
              {mat === 'dia'
                ? Bext > 8
                  ? 'دیامغناطیس: دوقطبی‌های ضعیف در خلاف سوی میدان خارجی القا شدند!'
                  : 'دیامغناطیس: اتم‌ها ذاتاً دوقطبی مغناطیسی خالص ندارند.'
                : mat === 'hardFerro' && Bext === 0 && wasMagnetized
                ? 'فرومغناطیس سخت (فولاد): با حذف میدان، هم‌سویی حوزه‌ها حفظ شد (آهنربای دائم)!'
                : mat === 'softFerro'
                ? 'فرومغناطیس نرم (آهن): با میدان قوی شدیداً هم‌سو و با حذف میدان سریعاً بی‌اثر می‌شود.'
                : 'پارامغناطیس: هم‌سویی ضعیف و موقت در میدان قوی.'}
            </text>
          </svg>
        </div>
      }
      controls={
        <>
          <SliderControl
            label="شدت میدان مغناطیسی خارجی"
            symbol="B_{\text{ext}}"
            value={Bext}
            min={0}
            max={100}
            step={5}
            unit="%"
            accentClass="text-violet-600"
            onChange={setBext}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setBext(100)}
              className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold cursor-pointer"
            >
              اعمال میدان قوی (100%)
            </button>
            <button
              type="button"
              onClick={() => setBext(0)}
              className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold cursor-pointer"
            >
              حذف میدان خارجی (0%)
            </button>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard
            label="میزان هم‌راستایی دوقطبی‌ها"
            value={`${Math.round(alignment)}%`}
            color={alignment < 0 ? 'rose' : 'violet'}
          />
          <MetricCard
            label="کاربرد اصلی"
            value={
              mat === 'softFerro'
                ? 'هسته آهنربای الکتریکی'
                : mat === 'hardFerro'
                ? 'آهنربای دائم'
                : mat === 'para'
                ? 'مغناطیس موقت ضعیف'
                : 'دفع ضعیف میدان'
            }
            color="indigo"
          />
        </>
      }
    />
  );
};
