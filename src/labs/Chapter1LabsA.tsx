import React, { useState, useEffect, useRef } from 'react';
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
   LAB 1-1: Electroscope & Electric Charge Interaction
   ========================================================= */
export const Lab1_1: React.FC = () => {
  const [scopeCharge, setScopeCharge] = useState<'neutral' | 'positive' | 'negative'>('positive');
  const [rodType, setRodType] = useState<'positive' | 'negative' | 'neutral'>('negative');
  const [proximity, setProximity] = useState(25); // 0 far, 100 very close

  const baseCharge = scopeCharge === 'positive' ? 4 : scopeCharge === 'negative' ? -4 : 0;
  // Induced charge pushed to leaves when rod is brought near
  const rodSign = rodType === 'positive' ? 1 : rodType === 'negative' ? -1 : 0;
  const inducedToLeaves =
    rodType === 'neutral'
      ? -baseCharge * (proximity / 100) * 0.28
      : rodSign * (proximity / 100) * 7.2;

  const leafCharge = baseCharge + inducedToLeaves;
  const leafAngle = Math.min(58, Math.max(4, Math.abs(leafCharge) * 5.2));
  const capCharge = baseCharge - inducedToLeaves;

  let behaviorText = '';
  if (proximity < 10) {
    behaviorText =
      scopeCharge === 'neutral'
        ? 'الکتروسکوپ خنثی است و ورقه‌ها بسته‌اند. میله را نزدیک کنید!'
        : `الکتروسکوپ بار ${scopeCharge === 'positive' ? 'مثبت' : 'منفی'} دارد و ورقه‌ها به دلیل دافعه هم‌نام باز هستند.`;
  } else if (rodType === 'neutral') {
    behaviorText =
      scopeCharge === 'neutral'
        ? 'هر دو خنثی هستند؛ اتفاقی نمی‌افتد.'
        : 'میله خنثی با القای متقابل اندکی بار را به سمت کلاهک می‌کشد و انحراف ورقه‌ها کمی کم می‌شود (اما هرگز بسته و دوباره باز نمی‌شوند!).';
  } else if (
    (scopeCharge === 'positive' && rodType === 'positive') ||
    (scopeCharge === 'negative' && rodType === 'negative')
  ) {
    behaviorText =
      'بار میله و الکتروسکوپ هم‌نام هستند ← بارهای هم‌نام بیشتری به ورقه‌ها رانده می‌شوند و انحراف ورقه‌ها بیشتر می‌شود!';
  } else if (scopeCharge === 'neutral') {
    behaviorText =
      'با نزدیک کردن میله باردار به الکتروسکوپ خنثی، در کلاهک بار ناهم‌نام و در ورقه‌ها بار هم‌نام با میله القا شده و ورقه‌ها باز می‌شوند.';
  } else {
    if (Math.abs(leafCharge) < 0.9) {
      behaviorText =
        'لحظه طلایی کنکور! بار القایی مخالف دقیقاً بار اولیه ورقه‌ها را خنثی کرده و ورقه‌ها کاملاً بسته شدند!';
    } else if (Math.sign(leafCharge) !== Math.sign(baseCharge)) {
      behaviorText =
        'ورقه‌ها ابتدا بسته شدند و اکنون با بار هم‌نامِ میله دوباره باز شدند ← دلیل قطعی ناهم‌نام بودن میله با الکتروسکوپ!';
    } else {
      behaviorText =
        'میله ناهم‌نام الکترون‌ها را جابه‌جا کرده و بار خالص ورقه‌ها کاهش یافته، پس انحراف ورقه‌ها کم می‌شود.';
    }
  }

  const rodX = 330 - (proximity / 100) * 115;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-cyan-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 280" className="w-full h-auto max-h-[300px]">
            {/* Glass jar */}
            <rect
              x="95"
              y="110"
              width="150"
              height="145"
              rx="22"
              className="fill-cyan-50/60 dark:fill-slate-800/60 stroke-slate-400 dark:stroke-slate-600"
              strokeWidth="2.5"
            />
            <rect x="85" y="250" width="170" height="14" rx="5" className="fill-slate-600 dark:fill-slate-700" />
            {/* Insulator stopper */}
            <rect x="148" y="98" width="44" height="22" rx="4" className="fill-amber-700/80" />
            {/* Metal stem */}
            <rect x="166" y="72" width="8" height="108" className="fill-slate-400 dark:fill-slate-300" />
            {/* Metal Cap */}
            <ellipse
              cx="170"
              cy="68"
              rx="38"
              ry="14"
              className="fill-slate-300 dark:fill-slate-500 stroke-slate-500"
              strokeWidth="2"
            />
            {/* Cap charge markers */}
            {Array.from({ length: Math.min(5, Math.round(Math.abs(capCharge))) }).map((_, i) => (
              <text
                key={`cap-${i}`}
                x={145 + i * 12}
                y={72}
                textAnchor="middle"
                fontSize="13"
                fontWeight="900"
                fill={capCharge >= 0 ? '#ef4444' : '#2563eb'}
              >
                {capCharge >= 0 ? '+' : '−'}
              </text>
            ))}

            {/* Gold leaves */}
            <g transform="translate(170, 176)">
              <g transform={`rotate(${-leafAngle})`}>
                <rect x="-3" y="0" width="5" height="62" rx="2.5" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                {Math.abs(leafCharge) > 0.8 && (
                  <text
                    x="-11"
                    y="45"
                    fontSize="13"
                    fontWeight="900"
                    fill={leafCharge > 0 ? '#ef4444' : '#2563eb'}
                  >
                    {leafCharge > 0 ? '+' : '−'}
                  </text>
                )}
              </g>
              <g transform={`rotate(${leafAngle})`}>
                <rect x="-2" y="0" width="5" height="62" rx="2.5" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                {Math.abs(leafCharge) > 0.8 && (
                  <text
                    x="10"
                    y="45"
                    fontSize="13"
                    fontWeight="900"
                    fill={leafCharge > 0 ? '#ef4444' : '#2563eb'}
                  >
                    {leafCharge > 0 ? '+' : '−'}
                  </text>
                )}
              </g>
              <circle cx="0" cy="0" r="4.5" fill="#64748b" />
            </g>

            {/* Approaching Rod */}
            <g transform={`translate(${rodX}, 48)`}>
              <rect
                x="0"
                y="0"
                width="115"
                height="28"
                rx="14"
                fill={
                  rodType === 'positive'
                    ? '#fee2e2'
                    : rodType === 'negative'
                    ? '#dbeafe'
                    : '#e2e8f0'
                }
                stroke={
                  rodType === 'positive'
                    ? '#ef4444'
                    : rodType === 'negative'
                    ? '#2563eb'
                    : '#64748b'
                }
                strokeWidth="2.5"
              />
              {rodType !== 'neutral' ? (
                [18, 38, 58, 78, 96].map((x) => (
                  <text
                    key={x}
                    x={x}
                    y="19"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="900"
                    fill={rodType === 'positive' ? '#dc2626' : '#1d4ed8'}
                  >
                    {rodType === 'positive' ? '+' : '−'}
                  </text>
                ))
              ) : (
                <text x="57" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
                  میله خنثی
                </text>
              )}
            </g>

            {/* Angle label */}
            <text x="170" y="272" textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">
              زاویه بازشدگی ورقه‌ها: {Math.round(leafAngle * 2)}°
            </text>
          </svg>
        </div>
      }
      controls={
        <>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">وضعیت اولیه الکتروسکوپ:</div>
            <SegmentedButtons
              value={scopeCharge}
              onChange={setScopeCharge}
              options={[
                { value: 'positive', label: 'بار مثبت (+)' },
                { value: 'neutral', label: 'خنثی (0)' },
                { value: 'negative', label: 'بار منفی (−)' },
              ]}
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">نوع میله نزدیک‌شونده:</div>
            <SegmentedButtons
              value={rodType}
              onChange={setRodType}
              options={[
                { value: 'positive', label: 'شیشه‌ای مثبت (+)' },
                { value: 'negative', label: 'پلاستیکی منفی (−)' },
                { value: 'neutral', label: 'میله خنثی' },
              ]}
            />
          </div>
          <SliderControl
            label="نزدیکی میله به کلاهک"
            value={proximity}
            min={0}
            max={100}
            unit="%"
            accentClass="text-cyan-600 dark:text-cyan-400"
            onChange={setProximity}
          />
          <div className="rounded-xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 p-3 text-xs sm:text-sm leading-7 text-slate-800 dark:text-slate-200">
            {behaviorText}
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard
            label="نوع بار فعلی ورقه‌ها"
            value={Math.abs(leafCharge) < 0.8 ? 'خنثی (0)' : leafCharge > 0 ? 'مثبت (+)' : 'منفی (−)'}
            color={leafCharge > 0.8 ? 'rose' : leafCharge < -0.8 ? 'cyan' : 'indigo'}
          />
          <MetricCard
            label="انحراف هر ورقه"
            value={`${Math.round(leafAngle)}°`}
            sublabel={Math.abs(leafCharge) < 0.8 ? 'ورقه‌ها بسته شدند!' : 'دافعه بین ورقه‌ها'}
            color="amber"
          />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-2: Triboelectric Series & Charge Quantization
   ========================================================= */
const triboMaterials = [
  { name: 'موی انسان', rank: 1 },
  { name: 'شیشه', rank: 2 },
  { name: 'نایلون', rank: 3 },
  { name: 'پشم', rank: 4 },
  { name: 'ابریشم', rank: 5 },
  { name: 'کاغذ', rank: 6 },
  { name: 'پلاستیک (پلی‌اتیلن)', rank: 7 },
  { name: 'تفلون', rank: 8 },
];

export const Lab1_2: React.FC = () => {
  const [matA, setMatA] = useState(2); // نایلون
  const [matB, setMatB] = useState(7); // تفلون
  const [nExp, setNExp] = useState(5); // ×10^10 electrons
  const [testQ, setTestQ] = useState('4.8'); // ×10^-19 C

  const a = triboMaterials[matA];
  const b = triboMaterials[matB];
  const sameMat = matA === matB;
  const aLoses = a.rank < b.rank; // higher in series loses electrons -> positive
  const qNano = Number((nExp * 1.6).toFixed(2)); // n*10^10 * 1.6*10^-19 = n*1.6 nC

  const parsedTest = parseFloat(testQ.replace(',', '.'));
  const ratioN = isNaN(parsedTest) ? NaN : parsedTest / 1.6;
  const isQuantized = !isNaN(ratioN) && Math.abs(ratioN - Math.round(ratioN)) < 1e-6;

  return (
    <LabShell
      visual={
        <div className="p-5 bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-950 space-y-4">
          <svg viewBox="0 0 460 190" className="w-full h-auto max-h-[210px]">
            {/* Material A box */}
            <rect
              x="24"
              y="40"
              width="150"
              height="100"
              rx="18"
              fill={sameMat ? '#e2e8f0' : aLoses ? '#fee2e2' : '#dbeafe'}
              stroke={sameMat ? '#94a3b8' : aLoses ? '#ef4444' : '#2563eb'}
              strokeWidth="2.5"
            />
            <text x="99" y="76" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">
              {a.name}
            </text>
            <text x="99" y="102" textAnchor="middle" fontSize="12" fontWeight="700" fill={aLoses ? '#b91c1c' : '#1d4ed8'}>
              {sameMat ? 'q = 0' : `${aLoses ? '+' : '−'}${qNano} nC`}
            </text>
            <text x="99" y="124" textAnchor="middle" fontSize="10" fill="#475569">
              {sameMat ? 'هم‌جنس' : aLoses ? 'الکترون از دست داد' : 'الکترون گرفت'}
            </text>

            {/* Electron flow arrow */}
            {!sameMat && (
              <g>
                <line
                  x1={aLoses ? 184 : 276}
                  y1="90"
                  x2={aLoses ? 270 : 190}
                  y2="90"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                />
                <polygon
                  points={aLoses ? '276,90 264,83 264,97' : '184,90 196,83 196,97'}
                  fill="#0284c7"
                />
                <circle cx="230" cy="64" r="13" fill="#0284c7" />
                <text x="230" y="68" textAnchor="middle" fontSize="12" fontWeight="900" fill="white">
                  e⁻
                </text>
                <text x="230" y="116" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0369a1">
                  n = {nExp}×10¹⁰
                </text>
              </g>
            )}

            {/* Material B box */}
            <rect
              x="286"
              y="40"
              width="150"
              height="100"
              rx="18"
              fill={sameMat ? '#e2e8f0' : aLoses ? '#dbeafe' : '#fee2e2'}
              stroke={sameMat ? '#94a3b8' : aLoses ? '#2563eb' : '#ef4444'}
              strokeWidth="2.5"
            />
            <text x="361" y="76" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">
              {b.name}
            </text>
            <text x="361" y="102" textAnchor="middle" fontSize="12" fontWeight="700" fill={aLoses ? '#1d4ed8' : '#b91c1c'}>
              {sameMat ? 'q = 0' : `${aLoses ? '−' : '+'}${qNano} nC`}
            </text>
            <text x="361" y="124" textAnchor="middle" fontSize="10" fill="#475569">
              {sameMat ? 'هم‌جنس' : aLoses ? 'الکترون گرفت' : 'الکترون از دست داد'}
            </text>

            {/* Conservation badge */}
            <rect x="115" y="155" width="230" height="26" rx="13" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
            <text x="230" y="172" textAnchor="middle" fontSize="11" fontWeight="800" fill="#047857">
              پایستگی بار: q₁ + q₂ = 0 (کل دستگاه خنثی می‌ماند)
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="q = \pm n e \qquad (e = 1.6 \times 10^{-19}\;\text{C})"
          substitutedTex={`q = (${nExp} \\times 10^{10})(1.6 \\times 10^{-19}\\;\\text{C}) = ${qNano} \\times 10^{-9}\\;\\text{C} = ${qNano}\\;\\text{nC}`}
          symbols={[
            { symbol: 'q', meaning: 'بار الکتریکی خالص جسم', unit: 'C' },
            { symbol: 'n', meaning: 'تعداد الکترون‌های مبادله‌شده (عدد صحیح)', unit: 'عدد' },
            { symbol: 'e', meaning: 'بزرگی بار هر الکترون (بار بنیادی)', unit: '1.6×10⁻¹⁹ C' },
          ]}
          insight="هرچه ماده در جدول تریبوالکتریک پایین‌تر باشد (مثل تفلون)، الکترون‌خواهی بیشتری دارد و بار منفی می‌گیرد."
        />
      }
      controls={
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">جسم اول (A):</label>
              <select
                value={matA}
                onChange={(e) => setMatA(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold"
              >
                {triboMaterials.map((m, i) => (
                  <option key={m.name} value={i}>
                    {i + 1}. {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">جسم دوم (B):</label>
              <select
                value={matB}
                onChange={(e) => setMatB(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold"
              >
                {triboMaterials.map((m, i) => (
                  <option key={m.name} value={i}>
                    {i + 1}. {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <SliderControl
            label="تعداد الکترون‌های مبادله‌شده"
            symbol="n"
            value={nExp}
            min={1}
            max={20}
            step={1}
            displayValue={`${nExp} × 10¹⁰`}
            accentClass="text-cyan-600 dark:text-cyan-400"
            onChange={setNExp}
          />

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
              آزمون کوانتیده بودن بار (ویژه کنکور):
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-300">مقدار بار:</span>
              <input
                type="text"
                dir="ltr"
                value={testQ}
                onChange={(e) => setTestQ(e.target.value)}
                className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-center"
              />
              <span dir="ltr" className="text-xs font-mono text-slate-500">× 10⁻¹⁹ C</span>
            </div>
            {!isNaN(ratioN) && (
              <div
                className={`rounded-xl px-3 py-2 text-xs font-bold ${
                  isQuantized
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {isQuantized
                  ? `✓ ممکن است! دقیقاً معادل n = ${Math.round(Math.abs(ratioN))} الکترون.`
                  : `✗ غیرممکن در طبیعت! نسبت q/e = ${ratioN.toFixed(2)} عدد صحیح نیست.`}
              </div>
            )}
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="بار هر جسم" value={`${qNano}`} unit="nC" color="cyan" />
          <MetricCard label="مجموع بار دستگاه" value="0" unit="C" sublabel="اصل پایستگی بار" color="emerald" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-3: Coulomb's Law, Equilibrium Point & 2D Superposition
   ========================================================= */
export const Lab1_3: React.FC = () => {
  const [mode, setMode] = useState<'pair' | 'eq' | '2d'>('pair');
  const [q1, setQ1] = useState(4); // µC
  const [q2, setQ2] = useState(-6); // µC
  const [rCm, setRCm] = useState(20); // cm
  const [q3, setQ3] = useState(3); // µC for 2D mode
  const [ryCm, setRyCm] = useState(20); // cm for 2D mode

  const k = 9e9;
  const rM = rCm / 100;
  const Fpair = (k * Math.abs(q1 * 1e-6) * Math.abs(q2 * 1e-6)) / (rM * rM);
  const attract = q1 * q2 < 0;

  // Equilibrium point calculation (for q1 at x=0, q2 at x=rCm)
  const sameSign = q1 * q2 > 0;
  const ratio = Math.sqrt(Math.abs(q1) / Math.max(0.01, Math.abs(q2)));
  let eqPosCm: number | null = null;
  let eqDesc = '';
  if (q1 === 0 || q2 === 0) {
    eqDesc = 'یکی از بارها صفر است.';
  } else if (sameSign) {
    // r1 / (L - r1) = ratio => r1 = L * ratio / (1 + ratio)
    eqPosCm = (rCm * ratio) / (1 + ratio);
    eqDesc = `چون دو بار هم‌نام هستند، نقطه تعادل بین دو بار و در فاصله ${eqPosCm.toFixed(1)} cm از q₁ قرار دارد.`;
  } else if (Math.abs(q1) === Math.abs(q2)) {
    eqPosCm = null;
    eqDesc = 'دو بار ناهم‌نام و هم‌اندازه‌اند ← هیچ نقطه تعادلی در فاصله متناهی وجود ندارد!';
  } else if (Math.abs(q1) < Math.abs(q2)) {
    // outside left of q1: r1 / (r1 + L) = ratio => r1 = L*ratio/(1-ratio)
    const distLeft = (rCm * ratio) / (1 - ratio);
    eqPosCm = -distLeft;
    eqDesc = `دو بار ناهم‌نام‌اند ← نقطه تعادل خارج از دو بار و در فاصله ${distLeft.toFixed(1)} cm سمت چپ q₁ (بار کوچک‌تر) است.`;
  } else {
    // outside right of q2: (r2 + L)/r2 = ratio => r2 = L/(ratio-1)
    const distRight = rCm / (ratio - 1);
    eqPosCm = rCm + distRight;
    eqDesc = `دو بار ناهم‌نام‌اند ← نقطه تعادل خارج از دو بار و در فاصله ${distRight.toFixed(1)} cm سمت راست q₂ (بار کوچک‌تر) است.`;
  }

  // 2D mode: q1 at origin, q2 on +x at rCm, q3 on +y at ryCm
  const F21 = (k * Math.abs(q1 * 1e-6) * Math.abs(q2 * 1e-6)) / Math.pow(rCm / 100, 2);
  const F31 = (k * Math.abs(q1 * 1e-6) * Math.abs(q3 * 1e-6)) / Math.pow(ryCm / 100, 2);
  const Fx = (q1 * q2 < 0 ? 1 : -1) * F21;
  const Fy = (q1 * q3 < 0 ? 1 : -1) * F31;
  const FT2d = Math.sqrt(Fx * Fx + Fy * Fy);

  const sepPx = 120 + ((rCm - 5) / 45) * 180;
  const x1 = 230 - sepPx / 2;
  const x2 = 230 + sepPx / 2;
  const maxInnerArrow = Math.max(20, sepPx / 2 - 36);
  const rawArrow = Math.min(72, Math.max(24, Math.log10(Fpair + 1) * 30));
  const arrowLen = attract ? Math.min(rawArrow, maxInnerArrow) : rawArrow;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-cyan-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'pair', label: 'دو بار نقطه‌ای' },
                { value: 'eq', label: 'نقطه تعادل (نیروی صفر)' },
                { value: '2d', label: 'برآیند دوبعدی (عمود بر هم)' },
              ]}
            />
          </div>

          {mode === 'pair' && (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Distance line */}
              <line x1={x1} y1="168" x2={x2} y2="168" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 3" />
              <line x1={x1} y1="160" x2={x1} y2="176" stroke="#64748b" strokeWidth="1.5" />
              <line x1={x2} y1="160" x2={x2} y2="176" stroke="#64748b" strokeWidth="1.5" />
              <text x="230" y="186" textAnchor="middle" fontSize="12" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
                r = {rCm} cm ({rM.toFixed(2)} m)
              </text>

              {/* Force vectors starting cleanly outside charge radius (r=24) */}
              {q1 !== 0 && q2 !== 0 && (() => {
                const start1 = attract ? x1 + 26 : x1 - 26;
                const end1 = attract ? start1 + arrowLen : start1 - arrowLen;
                const start2 = attract ? x2 - 26 : x2 + 26;
                const end2 = attract ? start2 - arrowLen : start2 + arrowLen;
                return (
                  <>
                    {/* F21 on q1 */}
                    <line x1={start1} y1="105" x2={end1} y2="105" stroke="#059669" strokeWidth="4" />
                    <polygon
                      points={
                        attract
                          ? `${end1 + 8},105 ${end1 - 3},98 ${end1 - 3},112`
                          : `${end1 - 8},105 ${end1 + 3},98 ${end1 + 3},112`
                      }
                      fill="#059669"
                    />
                    <text
                      x={(start1 + end1) / 2}
                      y="84"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill="#059669"
                    >
                      F₂₁
                    </text>

                    {/* F12 on q2 */}
                    <line x1={start2} y1="105" x2={end2} y2="105" stroke="#059669" strokeWidth="4" />
                    <polygon
                      points={
                        attract
                          ? `${end2 - 8},105 ${end2 + 3},98 ${end2 + 3},112`
                          : `${end2 + 8},105 ${end2 - 3},98 ${end2 - 3},112`
                      }
                      fill="#059669"
                    />
                    <text
                      x={(start2 + end2) / 2}
                      y="84"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill="#059669"
                    >
                      F₁₂
                    </text>
                  </>
                );
              })()}

              {/* Charge q1 */}
              <circle cx={x1} cy="105" r="24" fill={q1 >= 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="3" />
              <text x={x1} y="103" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">
                {q1 >= 0 ? `+${q1}` : q1}
              </text>
              <text x={x1} y="117" textAnchor="middle" fontSize="9" fill="white">
                µC
              </text>
              <text x={x1} y="146" textAnchor="middle" fontSize="12" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                q₁
              </text>

              {/* Charge q2 */}
              <circle cx={x2} cy="105" r="24" fill={q2 >= 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="3" />
              <text x={x2} y="103" textAnchor="middle" fontSize="13" fontWeight="900" fill="white">
                {q2 >= 0 ? `+${q2}` : q2}
              </text>
              <text x={x2} y="117" textAnchor="middle" fontSize="9" fill="white">
                µC
              </text>
              <text x={x2} y="146" textAnchor="middle" fontSize="12" fontWeight="800" className="fill-slate-700 dark:fill-slate-200">
                q₂
              </text>

              <text x="230" y="34" textAnchor="middle" fontSize="13" fontWeight="800" fill={attract ? '#0284c7' : '#e11d48'}>
                {q1 === 0 || q2 === 0
                  ? 'نیرو صفر است'
                  : attract
                  ? 'نیروی ربایشی (جاذبه) — F₁₂ = F₂₁'
                  : 'نیروی رانشی (دافعه) — F₁₂ = F₂₁'}
              </text>
            </svg>
          )}

          {mode === 'eq' && (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Axis */}
              <line x1="25" y1="115" x2="435" y2="115" stroke="#94a3b8" strokeWidth="2" />
              {/* q1 at x=170, q2 at x=290 */}
              <circle cx="170" cy="115" r="20" fill={q1 >= 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
              <text x="170" y="120" textAnchor="middle" fontSize="11" fontWeight="900" fill="white">
                {q1 > 0 ? `+${q1}` : q1}
              </text>
              <text x="170" y="152" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-300">
                q₁ (x=0)
              </text>

              <circle cx="290" cy="115" r="20" fill={q2 >= 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
              <text x="290" y="120" textAnchor="middle" fontSize="11" fontWeight="900" fill="white">
                {q2 > 0 ? `+${q2}` : q2}
              </text>
              <text x="290" y="152" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-700 dark:fill-slate-300">
                q₂ (x={rCm}cm)
              </text>

              {/* Equilibrium target */}
              {eqPosCm !== null && (() => {
                const px = Math.max(40, Math.min(420, 170 + (eqPosCm / rCm) * 120));
                return (
                  <g>
                    <circle cx={px} cy="115" r="14" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="4 2" />
                    <circle cx={px} cy="115" r="5" fill="#10b981" />
                    <line x1={px} y1="62" x2={px} y2="98" stroke="#10b981" strokeWidth="2" />
                    <rect x={px - 54} y="34" width="108" height="26" rx="8" fill="#10b981" />
                    <text x={px} y="51" textAnchor="middle" fontSize="11" fontWeight="800" fill="white">
                      F_net = 0 (x={eqPosCm.toFixed(1)})
                    </text>
                  </g>
                );
              })()}
              <text x="230" y="195" textAnchor="middle" fontSize="11" fontWeight="700" className="fill-slate-600 dark:fill-slate-300">
                {eqDesc}
              </text>
            </svg>
          )}

          {mode === '2d' && (
            <svg viewBox="0 0 460 240" className="w-full h-auto max-h-[250px]">
              {/* Axes centered at (210, 135) */}
              <line x1="40" y1="135" x2="420" y2="135" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="210" y1="20" x2="210" y2="225" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* q2 on +x */}
              <circle cx="350" cy="135" r="16" fill={q2 >= 0 ? '#ef4444' : '#2563eb'} />
              <text x="350" y="139" textAnchor="middle" fontSize="10" fontWeight="800" fill="white">q₂</text>
              {/* q3 on +y (up) */}
              <circle cx="210" cy="40" r="16" fill={q3 >= 0 ? '#ef4444' : '#2563eb'} />
              <text x="210" y="44" textAnchor="middle" fontSize="10" fontWeight="800" fill="white">q₃</text>

              {/* Vectors on q1 */}
              {(() => {
                const maxF = Math.max(F21, F31, 0.1);
                const dx = (Fx / maxF) * 72;
                const dy = -(Fy / maxF) * 72; // svg y down
                return (
                  <>
                    {/* Fx */}
                    <line x1="210" y1="135" x2={210 + dx} y2="135" stroke="#0284c7" strokeWidth="3" />
                    {/* Fy */}
                    <line x1="210" y1="135" x2="210" y2={135 + dy} stroke="#d97706" strokeWidth="3" />
                    {/* Parallelogram dashed */}
                    <line x1={210 + dx} y1="135" x2={210 + dx} y2={135 + dy} stroke="#94a3b8" strokeDasharray="3 3" />
                    <line x1="210" y1={135 + dy} x2={210 + dx} y2={135 + dy} stroke="#94a3b8" strokeDasharray="3 3" />
                    {/* Resultant FT */}
                    <line x1="210" y1="135" x2={210 + dx} y2={135 + dy} stroke="#10b981" strokeWidth="4" />
                    <circle cx={210 + dx} cy={135 + dy} r="4.5" fill="#10b981" />
                    <text
                      x={210 + dx + (dx >= 0 ? 16 : -26)}
                      y={135 + dy + (dy >= 0 ? 14 : -10)}
                      fontSize="12"
                      fontWeight="900"
                      fill="#10b981"
                    >
                      Fₜ
                    </text>
                  </>
                );
              })()}
              {/* q1 at origin */}
              <circle cx="210" cy="135" r="18" fill={q1 >= 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
              <text x="210" y="139" textAnchor="middle" fontSize="11" fontWeight="900" fill="white">q₁</text>
            </svg>
          )}
        </div>
      }
      formula={
        mode === '2d' ? (
          <LiveFormulaCard
            formulaTex="F_T = \sqrt{F_{21}^2 + F_{31}^2}"
            substitutedTex={`F_T = \\sqrt{(${F21.toFixed(2)})^2 + (${F31.toFixed(2)})^2} = ${FT2d.toFixed(2)}\\;\\text{N}`}
            symbols={[
              { symbol: 'F_T', meaning: 'اندازه نیروی برآیند (خالص) وارد بر $q_1$', unit: 'N' },
              { symbol: 'F_{21}', meaning: 'نیروی وارد از بار $q_2$ به بار $q_1$ (افقی)', unit: 'N' },
              { symbol: 'F_{31}', meaning: 'نیروی وارد از بار $q_3$ به بار $q_1$ (عمودی)', unit: 'N' },
            ]}
            insight="علامت بارها فقط جهت بردارهای F₂₁ و F₃₁ را مشخص می‌کند؛ اندازه برآیند دو نیروی عمود بر هم همیشه از فیثاغورس به دست می‌آید."
          />
        ) : (
          <LiveFormulaCard
            formulaTex="F = k \frac{|q_1|\,|q_2|}{r^2}"
            substitutedTex={`F = (9\\times 10^9)\\frac{(${Math.abs(q1)}\\times 10^{-6})(${Math.abs(q2)}\\times 10^{-6})}{(${rM.toFixed(2)})^2} = ${Fpair.toFixed(2)}\\;\\text{N}`}
            symbols={[
              { symbol: 'F', meaning: 'اندازه نیروی الکتریکی بین دو بار', unit: 'N' },
              { symbol: 'k', meaning: 'ثابت قانون کولن در خلأ', unit: '9×10⁹ N·m²/C²' },
              { symbol: '|q_1|, |q_2|', meaning: 'اندازه دو بار نقطه‌ای (بدون علامت)', unit: 'C' },
              { symbol: 'r', meaning: 'فاصله بین دو بار', unit: 'm' },
            ]}
            insight={`اگر فاصله $r$ را نصف کنید ($${(rCm / 2).toFixed(1)}\\;\\text{cm}$)، نیرو ۴ برابر ($${(Fpair * 4).toFixed(2)}\\;\\text{N}$) می‌شود!`}
          />
        )
      }
      controls={
        <>
          <SliderControl
            label="بار اول"
            symbol="q_1"
            value={q1}
            min={-10}
            max={10}
            step={1}
            unit="µC"
            accentClass="text-rose-500"
            onChange={setQ1}
          />
          <SliderControl
            label="بار دوم"
            symbol="q_2"
            value={q2}
            min={-10}
            max={10}
            step={1}
            unit="µC"
            accentClass="text-blue-500"
            onChange={setQ2}
          />
          <SliderControl
            label={mode === '2d' ? 'فاصله q₁ تا q₂ روی محور x' : 'فاصله بین دو بار'}
            symbol="r"
            value={rCm}
            min={5}
            max={50}
            step={1}
            unit="cm"
            accentClass="text-cyan-600"
            onChange={setRCm}
          />
          {mode === '2d' && (
            <>
              <SliderControl
                label="بار سوم روی محور y"
                symbol="q_3"
                value={q3}
                min={-10}
                max={10}
                step={1}
                unit="µC"
                accentClass="text-amber-500"
                onChange={setQ3}
              />
              <SliderControl
                label="فاصله q₁ تا q₃ روی محور y"
                symbol="r_y"
                value={ryCm}
                min={5}
                max={50}
                step={1}
                unit="cm"
                accentClass="text-amber-600"
                onChange={setRyCm}
              />
            </>
          )}
        </>
      }
      metrics={
        mode === '2d' ? (
          <>
            <MetricCard label="نیروی افقی F₂₁" value={F21.toFixed(2)} unit="N" color="cyan" />
            <MetricCard label="نیروی عمودی F₃₁" value={F31.toFixed(2)} unit="N" color="amber" />
            <MetricCard label="نیروی برآیند F_T" value={FT2d.toFixed(2)} unit="N" color="emerald" />
            <MetricCard
              label="زاویه برآیند"
              value={`${Math.round((Math.atan2(Fy, Fx) * 180) / Math.PI)}°`}
              color="violet"
            />
          </>
        ) : (
          <>
            <MetricCard label="اندازه نیروی کولن" value={Fpair.toFixed(2)} unit="N" color="emerald" />
            <MetricCard
              label="نوع برهم‌کنش"
              value={q1 === 0 || q2 === 0 ? 'صفر' : attract ? 'جاذبه' : 'دافعه'}
              color={attract ? 'cyan' : 'rose'}
            />
          </>
        )
      }
    />
  );
};

/* =========================================================
   LAB 1-4: Electric Field Definition & Independence of q0
   ========================================================= */
export const Lab1_4: React.FC = () => {
  const [E, setE] = useState(2000); // N/C
  const [q0, setQ0] = useState(4); // µC (can be negative!)

  const F_mN = Math.abs(q0) * 1e-6 * E * 1000; // in mN
  const forceRight = q0 >= 0;
  const fLen = Math.min(130, Math.max(18, F_mN * 4.5));

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-sky-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
            {/* Uniform E field lines */}
            {[40, 80, 120, 160, 200].map((y) => (
              <g key={y}>
                <line x1="35" y1={y} x2="420" y2={y} stroke="#0ea5e9" strokeOpacity="0.38" strokeWidth="2" />
                <polygon points={`425,${y} 413,${y - 5} 413,${y + 5}`} fill="#0ea5e9" fillOpacity="0.55" />
              </g>
            ))}
            <text x="410" y="25" textAnchor="end" fontSize="13" fontWeight="900" fill="#0284c7">
              E = {E} N/C →
            </text>

            {/* Force arrow on test charge */}
            {q0 !== 0 && (
              <g>
                <line
                  x1="230"
                  y1="120"
                  x2={forceRight ? 230 + fLen : 230 - fLen}
                  y2="120"
                  stroke={forceRight ? '#10b981' : '#f43f5e'}
                  strokeWidth="5"
                />
                <polygon
                  points={
                    forceRight
                      ? `${230 + fLen + 10},120 ${230 + fLen - 2},112 ${230 + fLen - 2},128`
                      : `${230 - fLen - 10},120 ${230 - fLen + 2},112 ${230 - fLen + 2},128`
                  }
                  fill={forceRight ? '#10b981' : '#f43f5e'}
                />
                <text
                  x={forceRight ? 230 + fLen / 2 : 230 - fLen / 2}
                  y="102"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="900"
                  fill={forceRight ? '#059669' : '#e11d48'}
                >
                  F = {F_mN.toFixed(1)} mN
                </text>
              </g>
            )}

            {/* Test Charge */}
            <circle
              cx="230"
              cy="120"
              r="24"
              fill={q0 > 0 ? '#ef4444' : q0 < 0 ? '#2563eb' : '#64748b'}
              stroke="white"
              strokeWidth="3"
            />
            <text x="230" y="118" textAnchor="middle" fontSize="12" fontWeight="900" fill="white">
              {q0 > 0 ? `+${q0}` : q0}
            </text>
            <text x="230" y="131" textAnchor="middle" fontSize="9" fill="white">
              µC
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="E = \frac{F}{|q_0|} \quad \Longleftrightarrow \quad F = |q_0| E"
          substitutedTex={
            q0 === 0
              ? 'q_0 = 0 \\Rightarrow F = 0\\;\\text{N}'
              : `E = \\frac{${F_mN.toFixed(1)}\\times 10^{-3}\\;\\text{N}}{${Math.abs(q0)}\\times 10^{-6}\\;\\text{C}} = ${E}\\;\\text{N/C}`
          }
          symbols={[
            { symbol: 'E', meaning: 'بزرگی میدان الکتریکی در نقطه موردنظر', unit: 'N/C' },
            { symbol: 'F', meaning: 'اندازه نیروی الکتریکی وارد بر بار آزمون', unit: 'N' },
            { symbol: '|q_0|', meaning: 'اندازه بار آزمون (میدان مستقل از آن است)', unit: 'C' },
          ]}
          insight="هرچقدر اسلایدر q₀ را تغییر دهید، نسبت F/|q₀| یعنی میدان E دقیقاً ثابت می‌ماند! میدان فقط به چشمه مولد میدان بستگی دارد."
        />
      }
      controls={
        <>
          <SliderControl
            label="بزرگی میدان الکتریکی"
            symbol="E"
            value={E}
            min={500}
            max={5000}
            step={100}
            unit="N/C"
            accentClass="text-sky-600"
            onChange={setE}
          />
          <SliderControl
            label="بار آزمون (مثبت یا منفی)"
            symbol="q_0"
            value={q0}
            min={-10}
            max={10}
            step={1}
            unit="µC"
            accentClass="text-indigo-600"
            onChange={setQ0}
          />
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3 text-xs leading-6 text-slate-600 dark:text-slate-300">
            جهت نیرو:{' '}
            <strong className={q0 > 0 ? 'text-emerald-600' : q0 < 0 ? 'text-rose-500' : ''}>
              {q0 === 0
                ? 'صفر (بار خنثی)'
                : q0 > 0
                ? 'هم‌جهت با میدان الکتریکی (به سمت راست)'
                : 'خلاف جهت میدان الکتریکی (به سمت چپ)'}
            </strong>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="اندازه نیرو F" value={F_mN.toFixed(1)} unit="mN" color="emerald" />
          <MetricCard label="نسبت F / |q₀|" value={`${E}`} unit="N/C" sublabel="مستقل از q₀!" color="cyan" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-5: Point Charge Electric Field & Movable Probe
   ========================================================= */
export const Lab1_5: React.FC = () => {
  const [q1, setQ1] = useState(4); // nC at (140, 130)
  const [q2, setQ2] = useState(-4); // nC at (320, 130)
  const [probe, setProbe] = useState({ x: 230, y: 80 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const c1 = { x: 140, y: 130 };
  const c2 = { x: 320, y: 130 };
  // Scale: 180 px = 0.60 m => 300 px = 1 m
  const scale = 300;
  const k = 9e9;

  const calcField = (cx: number, cy: number, qnC: number) => {
    const dx = (probe.x - cx) / scale;
    const dy = (probe.y - cy) / scale;
    const r2 = Math.max(0.0025, dx * dx + dy * dy);
    const r = Math.sqrt(r2);
    const E = (k * qnC * 1e-9) / r2;
    return { ex: (E * dx) / r, ey: (E * dy) / r, mag: Math.abs(E), r };
  };

  const f1 = calcField(c1.x, c1.y, q1);
  const f2 = calcField(c2.x, c2.y, q2);
  const exT = f1.ex + f2.ex;
  const eyT = f1.ey + f2.ey;
  const eT = Math.sqrt(exT * exT + eyT * eyT);

  const vecScale = (ex: number, ey: number, maxLen = 68) => {
    const m = Math.sqrt(ex * ex + ey * ey);
    if (m < 1e-3) return { vx: 0, vy: 0 };
    const len = Math.min(maxLen, Math.max(14, Math.log10(m + 1) * 18));
    return { vx: (ex / m) * len, vy: (ey / m) * len };
  };

  const v1 = vecScale(f1.ex, f1.ey, 58);
  const v2 = vecScale(f2.ex, f2.ey, 58);
  const vT = vecScale(exT, eyT, 76);

  const updateProbeFromPointer = (clientX: number, clientY: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 460;
    const y = ((clientY - rect.top) / rect.height) * 260;
    setProbe({
      x: Math.max(25, Math.min(435, x)),
      y: Math.max(25, Math.min(235, y)),
    });
  };

  return (
    <LabShell
      visual={
        <div className="p-3 bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-950">
          <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 mb-1">
            نقطه حسگر سبز (P) را روی صفحه بکشید یا کلیک کنید تا بردارهای E₁، E₂ و برآیند E_T را زنده ببینید
          </div>
          <svg
            ref={svgRef}
            viewBox="0 0 460 260"
            className="w-full h-auto max-h-[275px] cursor-crosshair select-none touch-none rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/60"
            onPointerDown={(e) => {
              setDragging(true);
              updateProbeFromPointer(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (dragging) updateProbeFromPointer(e.clientX, e.clientY);
            }}
            onPointerUp={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
          >
            {/* Subtle grid */}
            {[80, 140, 200, 260, 320, 380].map((gx) => (
              <line key={gx} x1={gx} y1="0" x2={gx} y2="260" stroke="#94a3b8" strokeOpacity="0.14" />
            ))}
            {[65, 130, 195].map((gy) => (
              <line key={gy} x1="0" y1={gy} x2="460" y2={gy} stroke="#94a3b8" strokeOpacity="0.14" />
            ))}

            {/* Distance dashed lines */}
            <line x1={c1.x} y1={c1.y} x2={probe.x} y2={probe.y} stroke="#06b6d4" strokeDasharray="4 4" strokeOpacity="0.55" />
            <line x1={c2.x} y1={c2.y} x2={probe.x} y2={probe.y} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity="0.55" />

            {/* E1 vector */}
            {q1 !== 0 && (
              <line
                x1={probe.x}
                y1={probe.y}
                x2={probe.x + v1.vx}
                y2={probe.y + v1.vy}
                stroke="#06b6d4"
                strokeWidth="3"
              />
            )}
            {/* E2 vector */}
            {q2 !== 0 && (
              <line
                x1={probe.x}
                y1={probe.y}
                x2={probe.x + v2.vx}
                y2={probe.y + v2.vy}
                stroke="#f59e0b"
                strokeWidth="3"
              />
            )}
            {/* Net E_T vector */}
            {eT > 1 && (
              <>
                <line
                  x1={probe.x}
                  y1={probe.y}
                  x2={probe.x + vT.vx}
                  y2={probe.y + vT.vy}
                  stroke="#10b981"
                  strokeWidth="4.5"
                />
                <circle cx={probe.x + vT.vx} cy={probe.y + vT.vy} r="4.5" fill="#10b981" />
              </>
            )}

            {/* Charges */}
            <circle cx={c1.x} cy={c1.y} r="19" fill={q1 >= 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
            <text x={c1.x} y={c1.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="white">
              {q1 > 0 ? `+${q1}` : q1}
            </text>
            <text x={c1.x} y={c1.y + 33} textAnchor="middle" fontSize="10" fontWeight="800" fill="#0891b2">
              q₁ (nC)
            </text>

            <circle cx={c2.x} cy={c2.y} r="19" fill={q2 >= 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
            <text x={c2.x} y={c2.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="white">
              {q2 > 0 ? `+${q2}` : q2}
            </text>
            <text x={c2.x} y={c2.y + 33} textAnchor="middle" fontSize="10" fontWeight="800" fill="#d97706">
              q₂ (nC)
            </text>

            {/* Probe */}
            <circle cx={probe.x} cy={probe.y} r="8" fill="#10b981" stroke="white" strokeWidth="2.5" />
            <text x={probe.x + 12} y={probe.y - 10} fontSize="11" fontWeight="900" fill="#059669">
              P
            </text>

            {/* Legend */}
            <g transform="translate(12, 16)" fontSize="10" fontWeight="700">
              <text x="0" y="0" fill="#0891b2">■ E₁</text>
              <text x="38" y="0" fill="#d97706">■ E₂</text>
              <text x="76" y="0" fill="#059669">■ E_T (برآیند)</text>
            </g>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="E = k \frac{|q|}{r^2}, \qquad \vec{E}_T = \vec{E}_1 + \vec{E}_2"
          substitutedTex={`E_1 = ${Math.round(f1.mag)}\\;\\text{N/C},\\quad E_2 = ${Math.round(f2.mag)}\\;\\text{N/C},\\quad E_T = ${Math.round(eT)}\\;\\text{N/C}`}
          symbols={[
            { symbol: 'E', meaning: 'بزرگی میدان الکتریکی یک ذره باردار', unit: 'N/C' },
            { symbol: 'k', meaning: 'ثابت کولن', unit: '9×10⁹ N·m²/C²' },
            { symbol: '|q|', meaning: 'اندازه بار مولد میدان', unit: 'C' },
            { symbol: 'r', meaning: 'فاصله حسگر P تا بار مولد', unit: 'm' },
            { symbol: '\\vec{E}_T', meaning: 'بردار میدان برآیند (جمع برداری $\\vec{E}_1$ و $\\vec{E}_2$)', unit: 'N/C' },
          ]}
          insight="در نقطه وسط دو بار ناهم‌نام و هم‌اندازه (+4 و -4)، دو میدان هم‌جهت شده و با هم جمع می‌شوند! اما برای دو بار هم‌نام (+4 و +4) در نقطه وسط یکدیگر را خنثی می‌کنند!"
        />
      }
      controls={
        <>
          <SliderControl label="بار اول" symbol="q_1" value={q1} min={-9} max={9} step={1} unit="nC" accentClass="text-cyan-600" onChange={setQ1} />
          <SliderControl label="بار دوم" symbol="q_2" value={q2} min={-9} max={9} step={1} unit="nC" accentClass="text-amber-500" onChange={setQ2} />
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setProbe({ x: 230, y: 130 })}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              قرار دادن P در نقطه وسط
            </button>
            <button
              type="button"
              onClick={() => {
                setQ1(9);
                setQ2(4);
                setProbe({ x: 140 + (180 * 3) / 5, y: 130 });
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 cursor-pointer"
            >
              نمایش نقطه میدان صفر (9 و 4)
            </button>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="میدان خالص E_T" value={`${Math.round(eT)}`} unit="N/C" color="emerald" />
          <MetricCard label="فاصله تا q₁ / q₂" value={`${(f1.r * 100).toFixed(0)} / ${(f2.r * 100).toFixed(0)}`} unit="cm" color="indigo" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-6: Interactive Electric Field Lines & Free Particle
   ========================================================= */
export const Lab1_6: React.FC = () => {
  const [preset, setPreset] = useState<'dipole' | 'like' | 'asym' | 'uniform'>('dipole');
  const [particleSign, setParticleSign] = useState<1 | -1>(1);
  const [particlePos, setParticlePos] = useState<{ x: number; y: number; active: boolean }>({
    x: 230,
    y: 120,
    active: false,
  });

  const charges =
    preset === 'dipole'
      ? [
          { x: 145, y: 125, q: 1 },
          { x: 315, y: 125, q: -1 },
        ]
      : preset === 'like'
      ? [
          { x: 145, y: 125, q: 1 },
          { x: 315, y: 125, q: 1 },
        ]
      : preset === 'asym'
      ? [
          { x: 145, y: 125, q: 2 },
          { x: 315, y: 125, q: -1 },
        ]
      : [];

  const evalField = (x: number, y: number) => {
    if (preset === 'uniform') return { ex: 1, ey: 0 };
    let ex = 0;
    let ey = 0;
    for (const c of charges) {
      const dx = x - c.x;
      const dy = y - c.y;
      const r2 = dx * dx + dy * dy + 25;
      const r = Math.sqrt(r2);
      ex += (c.q * dx) / (r2 * r);
      ey += (c.q * dy) / (r2 * r);
    }
    return { ex, ey };
  };

  // Trace streamlines from positive charges
  const lines: string[] = [];
  if (preset !== 'uniform') {
    for (const c of charges) {
      if (c.q <= 0) continue;
      const count = c.q === 2 ? 16 : 10;
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + 0.12;
        let x = c.x + Math.cos(ang) * 18;
        let y = c.y + Math.sin(ang) * 18;
        const pts: string[] = [`M ${x.toFixed(1)} ${y.toFixed(1)}`];
        for (let step = 0; step < 95; step++) {
          const { ex, ey } = evalField(x, y);
          const m = Math.hypot(ex, ey);
          if (m < 1e-8) break;
          x += (ex / m) * 5.2;
          y += (ey / m) * 5.2;
          pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
          if (x < 0 || x > 460 || y < 0 || y > 250) break;
          if (charges.some((o) => o.q < 0 && Math.hypot(x - o.x, y - o.y) < 16)) break;
        }
        lines.push(pts.join(' '));
      }
    }
  }

  // Animate test particle along/against field
  useEffect(() => {
    if (!particlePos.active) return;
    const id = window.setInterval(() => {
      setParticlePos((prev) => {
        if (!prev.active) return prev;
        const { ex, ey } = evalField(prev.x, prev.y);
        const m = Math.hypot(ex, ey);
        if (m < 1e-8) return { ...prev, active: false };
        const nx = prev.x + (particleSign * ex * 3.8) / m;
        const ny = prev.y + (particleSign * ey * 3.8) / m;
        const out = nx < 15 || nx > 445 || ny < 15 || ny > 235;
        const hit = charges.some((c) => Math.hypot(nx - c.x, ny - c.y) < 20);
        if (out || hit) return { x: nx, y: ny, active: false };
        return { x: nx, y: ny, active: true };
      });
    }, 30);
    return () => window.clearInterval(id);
  }, [particlePos.active, preset, particleSign]);

  const launchParticle = () => {
    setParticlePos({
      x: preset === 'uniform' ? (particleSign > 0 ? 90 : 370) : 230,
      y: preset === 'uniform' ? 125 : 85,
      active: true,
    });
  };

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-cyan-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={preset}
              onChange={(v) => {
                setPreset(v);
                setParticlePos((p) => ({ ...p, active: false }));
              }}
              options={[
                { value: 'dipole', label: 'دوقطبی (+ و −)' },
                { value: 'like', label: 'هم‌نام (+ و +)' },
                { value: 'asym', label: 'نابرابر (+2q و −q)' },
                { value: 'uniform', label: 'صفحات موازی (یکنواخت)' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 250" className="w-full h-auto max-h-[265px] rounded-xl bg-white/80 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            {preset === 'uniform' ? (
              <>
                <rect x="46" y="25" width="16" height="200" rx="4" fill="#ef4444" />
                <rect x="398" y="25" width="16" height="200" rx="4" fill="#2563eb" />
                {[45, 85, 125, 165, 205].map((y) => (
                  <g key={y}>
                    <text x="54" y={y + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="white">+</text>
                    <text x="406" y={y + 4} textAnchor="middle" fontSize="13" fontWeight="900" fill="white">−</text>
                    <line x1="68" y1={y} x2="386" y2={y} stroke="#0ea5e9" strokeWidth="2.2" />
                    <polygon points={`236,${y} 224,${y - 5} 224,${y + 5}`} fill="#0ea5e9" />
                  </g>
                ))}
              </>
            ) : (
              <>
                {lines.map((d, idx) => (
                  <path key={idx} d={d} fill="none" stroke="#0284c7" strokeWidth="1.7" strokeOpacity="0.72" />
                ))}
                {charges.map((c, idx) => (
                  <g key={idx}>
                    <circle cx={c.x} cy={c.y} r="18" fill={c.q > 0 ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
                    <text x={c.x} y={c.y + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="white">
                      {c.q === 2 ? '+2q' : c.q > 0 ? '+q' : '−q'}
                    </text>
                  </g>
                ))}
              </>
            )}

            {/* Animated test particle */}
            <circle
              cx={particlePos.x}
              cy={particlePos.y}
              r="9"
              fill={particleSign > 0 ? '#f97316' : '#8b5cf6'}
              stroke="white"
              strokeWidth="2.5"
            />
            <text x={particlePos.x} y={particlePos.y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="white">
              {particleSign > 0 ? '+' : '−'}
            </text>
          </svg>
        </div>
      }
      controls={
        <>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">علامت ذره آزمون متحرک:</div>
            <SegmentedButtons
              value={particleSign === 1 ? 'pos' : 'neg'}
              onChange={(v) => setParticleSign(v === 'pos' ? 1 : -1)}
              options={[
                { value: 'pos', label: 'ذره مثبت (+q) — هم‌جهت خطوط' },
                { value: 'neg', label: 'ذره منفی (−q) — خلاف خطوط' },
              ]}
            />
          </div>

          <button
            type="button"
            onClick={launchParticle}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            رها کردن ذره در میدان الکتریکی
          </button>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/80 p-3.5 text-xs leading-7 text-slate-700 dark:text-slate-300 space-y-1">
            <div>
              <strong>نکته کنکوری طرح فعلی:</strong>
            </div>
            {preset === 'dipole' && (
              <p>تعداد خطوط خروجی از +q و ورودی به −q مساوی است؛ خطوط از + شروع و به − ختم می‌شوند.</p>
            )}
            {preset === 'like' && (
              <p>خطوط دو بار هم‌نام یکدیگر را دفع کرده و دقیقاً در وسط آن‌ها نقطه میدان صفر (خالی از خط) شکل می‌گیرد.</p>
            )}
            {preset === 'asym' && (
              <p>تعداد خطوط خارج‌شده از +2q دقیقاً ۲ برابر خطوط واردشده به −q است (<span dir="ltr" className="font-mono font-bold">N₁/N₂ = |q₁|/|q₂| = 2</span>).</p>
            )}
            {preset === 'uniform' && (
              <p>درون دو صفحه موازی (دور از لبه‌ها)، خطوط موازی، هم‌فاصله و مستقیم‌اند ← میدان کاملاً یکنواخت است.</p>
            )}
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard
            label="تقاطع خطوط میدان"
            value="هرگز!"
            sublabel="در هر نقطه فقط یک بردار E"
            color="rose"
          />
          <MetricCard
            label="جهت نیروی وارد بر ذره"
            value={particleSign > 0 ? 'هم‌سو با E' : 'خلاف E'}
            sublabel="F = qE"
            color="cyan"
          />
        </>
      }
    />
  );
};
