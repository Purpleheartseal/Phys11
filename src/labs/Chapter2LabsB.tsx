import React, { useState, useEffect } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
} from '../components/LabUI';

/* =========================================================
   LAB 2-4: Real Battery (EMF, Internal Resistance r) & V-I Graph
   ========================================================= */
export const Lab2_4: React.FC = () => {
  const [emf, setEmf] = useState(12); // V
  const [rInt, setRInt] = useState(2.0); // Ω
  const [Rext, setRext] = useState(4.0); // Ω
  const [switchClosed, setSwitchClosed] = useState(true);
  const [tick, setTick] = useState(0);

  const I = switchClosed ? emf / (Rext + rInt) : 0;
  const Vterm = emf - I * rInt;
  const Isc = emf / rInt;

  useEffect(() => {
    if (!switchClosed) return;
    const id = window.setInterval(() => setTick((t) => (t + I * 1.4) % 100), 40);
    return () => window.clearInterval(id);
  }, [switchClosed, I]);

  // V-I Graph coordinates (left half circuit, right half V-I graph)
  const gx0 = 258;
  const gx1 = 435;
  const gy0 = 185;
  const gy1 = 35;
  const maxI = Math.max(12, Math.ceil(Isc));
  const maxV = 24;
  const pxI = (iVal: number) => gx0 + Math.min(1, iVal / maxI) * (gx1 - gx0);
  const pyV = (vVal: number) => gy0 - Math.min(1, vVal / maxV) * (gy0 - gy1);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[245px]">
            {/* Left side: Live Circuit */}
            <rect
              x="25"
              y="42"
              width="190"
              height="142"
              rx="10"
              fill="none"
              stroke={switchClosed ? '#059669' : '#94a3b8'}
              strokeWidth="3"
            />

            {/* Animated current dots around loop */}
            {switchClosed &&
              [0, 25, 50, 75].map((off) => {
                const p = (tick + off) % 100;
                let cx = 25;
                let cy = 42;
                if (p < 30) {
                  cx = 25 + (p / 30) * 190;
                  cy = 42;
                } else if (p < 50) {
                  cx = 215;
                  cy = 42 + ((p - 30) / 20) * 142;
                } else if (p < 80) {
                  cx = 215 - ((p - 50) / 30) * 190;
                  cy = 184;
                } else {
                  cx = 25;
                  cy = 184 - ((p - 80) / 20) * 142;
                }
                return <circle key={off} cx={cx} cy={cy} r="4.5" fill="#10b981" stroke="white" strokeWidth="1.5" />;
              })}

            {/* Real battery box (left edge) */}
            <rect x="8" y="75" width="44" height="76" rx="8" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
            <text x="30" y="98" textAnchor="middle" fontSize="11" fontWeight="900" fill="#f87171">ℰ={emf}V</text>
            <text x="30" y="116" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fbbf24">r={rInt}Ω</text>
            <text x="30" y="140" textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8">باتری</text>

            {/* Switch K on top wire */}
            <rect x="92" y="32" width="52" height="20" fill="#f8fafc" />
            <circle cx="96" cy="42" r="3.5" fill="#334155" />
            <circle cx="140" cy="42" r="3.5" fill="#334155" />
            <line
              x1="96"
              y1="42"
              x2={switchClosed ? 140 : 134}
              y2={switchClosed ? 42 : 22}
              stroke={switchClosed ? '#10b981' : '#ef4444'}
              strokeWidth="3.5"
            />
            <text x="118" y="20" textAnchor="middle" fontSize="10" fontWeight="800" fill={switchClosed ? '#059669' : '#dc2626'}>
              {switchClosed ? 'کلید بسته' : 'کلید باز (I=0)'}
            </text>

            {/* External Resistor R on right edge */}
            <rect x="197" y="84" width="36" height="58" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
            <text x="215" y="110" textAnchor="middle" fontSize="11" fontWeight="900" fill="#92400e">R</text>
            <text x="215" y="126" textAnchor="middle" fontSize="10" fontWeight="800" fill="#b45309">{Rext}Ω</text>

            {/* Voltmeter badge inside loop */}
            <rect x="68" y="88" width="110" height="52" rx="10" fill="#eef2ff" stroke="#6366f1" strokeWidth="2" />
            <text x="123" y="108" textAnchor="middle" fontSize="10" fontWeight="800" fill="#4338ca">ولت‌سنج دو سر باتری</text>
            <text x="123" y="128" textAnchor="middle" fontSize="14" fontWeight="900" fill="#312e81">
              V = {Vterm.toFixed(2)} V
            </text>

            {/* Right side: V-I Graph */}
            <line x1={gx0} y1={gy0} x2={gx1 + 8} y2={gy0} stroke="#475569" strokeWidth="1.8" />
            <line x1={gx0} y1={gy1 - 8} x2={gx0} y2={gy0} stroke="#475569" strokeWidth="1.8" />
            <text x={gx1 + 8} y={gy0 + 16} textAnchor="end" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              I (A)
            </text>
            <text x={gx0 - 4} y={gy1 - 12} textAnchor="middle" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              V (V)
            </text>

            {/* Line from (0, emf) to (Isc, 0) */}
            <line x1={pxI(0)} y1={pyV(emf)} x2={pxI(Isc)} y2={pyV(0)} stroke="#059669" strokeWidth="3" />
            {/* Operating point */}
            <circle cx={pxI(I)} cy={pyV(Vterm)} r="6.5" fill="#6366f1" stroke="white" strokeWidth="2" />
            <text x={pxI(0) + 6} y={pyV(emf) - 6} fontSize="10" fontWeight="800" fill="#059669">
              ℰ={emf}V
            </text>
            <text x={pxI(Isc)} y={gy0 + 14} textAnchor="middle" fontSize="9" fontWeight="800" fill="#dc2626">
              I_sc={Isc.toFixed(1)}A
            </text>
            <text x={(gx0 + gx1) / 2} y="214" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-slate-500 dark:fill-slate-400">
              شیب خط = −r = −{rInt} Ω
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="I = \frac{\mathcal{E}}{R + r}, \qquad V = \mathcal{E} - I r"
          substitutedTex={
            switchClosed
              ? `I = \\frac{${emf}}{${Rext} + ${rInt}} = ${I.toFixed(2)}\\;\\text{A},\\qquad V = ${emf} - (${I.toFixed(2)})(${rInt}) = ${Vterm.toFixed(2)}\\;\\text{V}`
              : `\\text{مدار باز: } I = 0 \\Rightarrow V = \\mathcal{E} = ${emf}\\;\\text{V}`
          }
          symbols={[
            { symbol: 'I', meaning: 'شدت جریان کل مدار', unit: 'A' },
            { symbol: '\\mathcal{E}', meaning: 'نیروی محرکه الکتریکی باتری', unit: 'V' },
            { symbol: 'V', meaning: 'اختلاف پتانسیل (ولتاژ) دو سر باتری', unit: 'V' },
            { symbol: 'R', meaning: 'مقاومت خارجی مدار', unit: 'Ω' },
            { symbol: 'r', meaning: 'مقاومت داخلی باتری', unit: 'Ω' },
          ]}
          insight="کلید را باز و بسته کنید! در حالت کلید باز، افت داخلی (Ir) صفر است و ولت‌سنج دقیقاً نیروی محرکه ℰ را نشان می‌دهد. هرچه R را زیاد کنید، I کم و V به ℰ نزدیک‌تر می‌شود!"
        />
      }
      controls={
        <>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSwitchClosed((s) => !s)}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors cursor-pointer ${
                switchClosed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {switchClosed ? 'کلید مدار: بسته (قطع کن)' : 'کلید مدار: باز (وصل کن)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setSwitchClosed(true);
                setRext(0);
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 text-amber-800 dark:text-amber-300 cursor-pointer"
            >
              اتصال کوتاه (R=0)
            </button>
          </div>
          <SliderControl label="نیروی محرکه باتری" symbol="\mathcal{E}" value={emf} min={6} max={24} step={1} unit="V" accentClass="text-emerald-600" onChange={setEmf} />
          <SliderControl label="مقاومت داخلی باتری" symbol="r" value={rInt} min={0.5} max={5} step={0.5} unit="Ω" accentClass="text-rose-500" onChange={setRInt} />
          <SliderControl label="مقاومت خارجی مدار" symbol="R" value={Rext} min={0} max={20} step={0.5} unit="Ω" accentClass="text-amber-600" onChange={setRext} />
        </>
      }
      metrics={
        <>
          <MetricCard label="جریان مدار I" value={I.toFixed(2)} unit="A" color="emerald" />
          <MetricCard label="ولتاژ پایانه V" value={Vterm.toFixed(2)} unit="V" sublabel={`افت داخلی Ir = ${(I * rInt).toFixed(2)}V`} color="indigo" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 2-5: Power, Efficiency & Maximum Power Transfer (R = r)
   ========================================================= */
export const Lab2_5: React.FC = () => {
  const [emf, setEmf] = useState(12); // V
  const [rInt, setRInt] = useState(2); // Ω
  const [Rext, setRext] = useState(2); // Ω (starts right at max power!)

  const I = emf / (Rext + rInt);
  const Ptot = emf * I;
  const Pout = Rext * I * I;
  const Ploss = rInt * I * I;
  const Pmax = (emf * emf) / (4 * rInt);
  const eff = (Rext / (Rext + rInt)) * 100;

  // Plot P_out(R) for R in [0, 14]
  const pts: string[] = [];
  for (let rv = 0; rv <= 14.01; rv += 0.25) {
    const iv = emf / (rv + rInt);
    const pv = rv * iv * iv;
    const x = 52 + (rv / 14) * 375;
    const y = 185 - (pv / Math.max(Pmax * 1.15, 1)) * 145;
    pts.push(`${pts.length === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const curX = 52 + (Math.min(14, Rext) / 14) * 375;
  const curY = 185 - (Pout / Math.max(Pmax * 1.15, 1)) * 145;
  const peakX = 52 + (Math.min(14, rInt) / 14) * 375;
  const peakY = 185 - (Pmax / Math.max(Pmax * 1.15, 1)) * 145;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/30 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
            <line x1="52" y1="185" x2="435" y2="185" stroke="#475569" strokeWidth="1.8" />
            <line x1="52" y1="24" x2="52" y2="185" stroke="#475569" strokeWidth="1.8" />
            <text x="430" y="204" textAnchor="end" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              مقاومت خارجی R (Ω)
            </text>
            <text x="46" y="32" textAnchor="end" fontSize="10" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              P_خروجی (W)
            </text>

            {/* Peak guideline at R = r */}
            <line x1={peakX} y1={peakY} x2={peakX} y2="185" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.8" />
            <text x={peakX} y={peakY - 10} textAnchor="middle" fontSize="10" fontWeight="900" fill="#d97706">
              ★ بیشینه توان در R = r = {rInt}Ω ({Pmax.toFixed(1)}W)
            </text>

            {/* Curve */}
            <path d={pts.join(' ')} fill="none" stroke="#10b981" strokeWidth="3.2" />

            {/* Current operating point */}
            <circle cx={curX} cy={curY} r="7" fill="#4f46e5" stroke="white" strokeWidth="2.5" />
            <text x={curX} y="202" textAnchor="middle" fontSize="10" fontWeight="800" fill="#4f46e5">
              R={Rext}Ω
            </text>
          </svg>

          {/* Power split bar */}
          <div className="px-2 space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-emerald-600 dark:text-emerald-400">توان مفید خروجی: {Pout.toFixed(1)}W ({eff.toFixed(0)}%)</span>
              <span className="text-rose-500">تلف‌شده در r: {Ploss.toFixed(1)}W ({(100 - eff).toFixed(0)}%)</span>
            </div>
            <div className="h-3 rounded-full bg-rose-200 dark:bg-rose-950 overflow-hidden flex">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${eff}%` }} />
            </div>
          </div>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="P_{\text{خروجی}} = R I^2 = \mathcal{E}I - rI^2, \qquad \eta = \frac{R}{R+r}"
          substitutedTex={`P_{\\text{خروجی}} = (${Rext})(${I.toFixed(2)})^2 = ${Pout.toFixed(1)}\\;\\text{W},\\qquad \\eta = \\frac{${Rext}}{${Rext}+${rInt}} = ${eff.toFixed(0)}\\%`}
          symbols={[
            { symbol: 'P_{\\text{خروجی}}', meaning: 'توان مفید تحویلی به مقاومت خارجی', unit: 'W' },
            { symbol: '\\mathcal{E}', meaning: 'نیروی محرکه الکتریکی باتری', unit: 'V' },
            { symbol: 'I', meaning: 'شدت جریان عبوری از مدار', unit: 'A' },
            { symbol: 'R', meaning: 'مقاومت خارجی (مصرف‌کننده)', unit: 'Ω' },
            { symbol: 'r', meaning: 'مقاومت داخلی باتری (تلف‌کننده گرما)', unit: 'Ω' },
            { symbol: '\\eta', meaning: 'بازده باتری (درصد توان مفید)', unit: '%' },
          ]}
          insight="نکته طلایی کنکور: در R = r توان خروجی بیشینه (P_max = ℰ²/4r) و بازده دقیقاً ۵۰٪ است! با بزرگ‌تر کردن R، بازده به ۱۰۰٪ نزدیک می‌شود اما توان خروجی کاهش می‌یابد."
        />
      }
      controls={
        <>
          <SliderControl label="نیروی محرکه" symbol="\mathcal{E}" value={emf} min={6} max={24} step={2} unit="V" accentClass="text-emerald-600" onChange={setEmf} />
          <SliderControl label="مقاومت داخلی باتری" symbol="r" value={rInt} min={1} max={5} step={0.5} unit="Ω" accentClass="text-rose-500" onChange={setRInt} />
          <SliderControl label="مقاومت خارجی" symbol="R" value={Rext} min={0.5} max={14} step={0.5} unit="Ω" accentClass="text-indigo-600" onChange={setRext} />
          <button
            type="button"
            onClick={() => setRext(rInt)}
            className="w-full py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 font-bold text-xs cursor-pointer"
          >
            تنظیم دقیق روی نقطه بیشینه توان (R = r = {rInt} Ω)
          </button>
        </>
      }
      metrics={
        <>
          <MetricCard label="توان کل باتری (ℰI)" value={Ptot.toFixed(1)} unit="W" color="indigo" />
          <MetricCard label="توان مفید خروجی" value={Pout.toFixed(1)} unit="W" sublabel={`بیشینه ممکن: ${Pmax.toFixed(1)}W`} color="emerald" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 2-6: Interactive DC Circuit & Resistor Networks (Series, Parallel, Mixed, Home Fuse)
   ========================================================= */
export const Lab2_6: React.FC = () => {
  const [topo, setTopo] = useState<'series' | 'parallel' | 'mixed' | 'home'>('mixed');
  const [emf, setEmf] = useState(9);
  const [rInt, setRInt] = useState(1);
  const [R1, setR1] = useState(3);
  const [R2, setR2] = useState(3);
  const [R3, setR3] = useState(6);

  // Home circuit (Example 2-10)
  const [lampOn, setLampOn] = useState(true);
  const [tvOn, setTvOn] = useState(true);
  const [heaterOn, setHeaterOn] = useState(true);
  const [dryerOn, setDryerOn] = useState(false);
  const [fuseLimit, setFuseLimit] = useState(15); // A

  const [tick, setTick] = useState(0);

  // Circuit solver
  let Req = 1;
  let Itot = 0;
  let I1 = 0;
  let I2 = 0;
  let I3 = 0;
  let V1 = 0;
  let V2 = 0;
  let V3 = 0;

  if (topo === 'series') {
    Req = R1 + R2 + R3;
    Itot = emf / (Req + rInt);
    I1 = I2 = I3 = Itot;
    V1 = I1 * R1;
    V2 = I2 * R2;
    V3 = I3 * R3;
  } else if (topo === 'parallel') {
    Req = 1 / (1 / R1 + 1 / R2 + 1 / R3);
    Itot = emf / (Req + rInt);
    const Vp = Itot * Req;
    V1 = V2 = V3 = Vp;
    I1 = Vp / R1;
    I2 = Vp / R2;
    I3 = Vp / R3;
  } else if (topo === 'mixed') {
    const R23 = (R2 * R3) / (R2 + R3);
    Req = R1 + R23;
    Itot = emf / (Req + rInt);
    I1 = Itot;
    V1 = I1 * R1;
    const V23 = Itot * R23;
    V2 = V3 = V23;
    I2 = V23 / R2;
    I3 = V23 / R3;
  }

  // Home fuse calculations (220V)
  const homeDevices = [
    { name: 'لامپ (100W)', p: 100, on: lampOn, toggle: () => setLampOn((v) => !v) },
    { name: 'پخش صوت (200W)', p: 200, on: tvOn, toggle: () => setTvOn((v) => !v) },
    { name: 'بخاری برقی (2000W)', p: 2000, on: heaterOn, toggle: () => setHeaterOn((v) => !v) },
    { name: 'سشوار (2200W)', p: 2200, on: dryerOn, toggle: () => setDryerOn((v) => !v) },
  ];
  const homeP = homeDevices.reduce((s, d) => s + (d.on ? d.p : 0), 0);
  const homeI = homeP / 220;
  const fuseBlown = homeI > fuseLimit;

  useEffect(() => {
    const speed = topo === 'home' ? (fuseBlown ? 0 : Math.min(4, homeI * 0.25)) : Math.min(4, Itot * 0.8);
    if (speed <= 0.01) return;
    const id = window.setInterval(() => setTick((t) => (t + speed * 2) % 100), 40);
    return () => window.clearInterval(id);
  }, [topo, Itot, homeI, fuseBlown]);

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={topo}
              onChange={setTopo}
              options={[
                { value: 'mixed', label: 'ترکیبی (مثال ۲-۱۱)' },
                { value: 'series', label: 'متوالی (سری)' },
                { value: 'parallel', label: 'موازی' },
                { value: 'home', label: 'مدار خانگی و فیوز' },
              ]}
            />
          </div>

          {topo === 'mixed' && (
            <svg viewBox="0 0 460 235" className="w-full h-auto max-h-[250px]">
              {/* Main loop */}
              <path d="M 55 185 L 55 55 L 220 55" fill="none" stroke="#059669" strokeWidth="3" />
              <path d="M 385 115 L 385 185 L 55 185" fill="none" stroke="#059669" strokeWidth="3" />
              {/* Parallel split from x=220 to x=385 */}
              <path d="M 220 55 L 220 115 L 245 115" fill="none" stroke="#059669" strokeWidth="2.5" />
              <path d="M 220 55 L 385 55 L 385 115" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <path d="M 220 115 L 385 115" fill="none" stroke="#d97706" strokeWidth="2.5" />

              {/* Animated dots on main wire */}
              {[0, 33, 66].map((o) => {
                const p = (tick + o) % 100;
                const x = 60 + (p / 100) * 155;
                return <circle key={o} cx={x} cy="55" r="4" fill="#10b981" stroke="white" strokeWidth="1" />;
              })}
              {/* Dots on R2 branch */}
              <circle cx={240 + ((tick * 1.2) % 130)} cy="55" r="3.5" fill="#0284c7" />
              {/* Dots on R3 branch */}
              <circle cx={240 + ((tick * 0.7) % 130)} cy="115" r="3.5" fill="#d97706" />

              {/* Battery */}
              <rect x="28" y="88" width="54" height="66" rx="8" fill="#1e293b" />
              <text x="55" y="114" textAnchor="middle" fontSize="11" fontWeight="900" fill="#f87171">ℰ={emf}V</text>
              <text x="55" y="132" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fbbf24">r={rInt}Ω</text>
              <text x="55" y="148" textAnchor="middle" fontSize="9" fill="#94a3b8">I={Itot.toFixed(2)}A</text>

              {/* R1 */}
              <rect x="112" y="38" width="66" height="34" rx="6" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
              <text x="145" y="54" textAnchor="middle" fontSize="11" fontWeight="900" fill="#065f46">R₁={R1}Ω</text>
              <text x="145" y="67" textAnchor="middle" fontSize="9" fontWeight="800" fill="#047857">I₁={I1.toFixed(2)}A</text>

              {/* R2 (top parallel) */}
              <rect x="270" y="38" width="70" height="34" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
              <text x="305" y="54" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0369a1">R₂={R2}Ω</text>
              <text x="305" y="67" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0284c7">I₂={I2.toFixed(2)}A</text>

              {/* R3 (bottom parallel) */}
              <rect x="270" y="98" width="70" height="34" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
              <text x="305" y="114" textAnchor="middle" fontSize="11" fontWeight="900" fill="#92400e">R₃={R3}Ω</text>
              <text x="305" y="127" textAnchor="middle" fontSize="9" fontWeight="800" fill="#b45309">I₃={I3.toFixed(2)}A</text>

              {/* Node voltages */}
              <text x="305" y="160" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-indigo-700 dark:fill-indigo-300">
                V₂ = V₃ = {V2.toFixed(2)} V | V₁ = {V1.toFixed(2)} V
              </text>
              <text x="230" y="214" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                R_eq = R₁ + (R₂ ∥ R₃) = {Req.toFixed(2)} Ω
              </text>
            </svg>
          )}

          {topo === 'series' && (
            <svg viewBox="0 0 460 225" className="w-full h-auto max-h-[240px]">
              <rect x="45" y="50" width="370" height="125" rx="10" fill="none" stroke="#059669" strokeWidth="3" />
              {[0, 25, 50, 75].map((o) => (
                <circle key={o} cx={55 + (((tick + o) % 100) / 100) * 350} cy="50" r="4" fill="#10b981" />
              ))}
              <rect x="20" y="82" width="50" height="60" rx="8" fill="#1e293b" />
              <text x="45" y="108" textAnchor="middle" fontSize="10" fontWeight="900" fill="#f87171">ℰ={emf}V</text>
              <text x="45" y="126" textAnchor="middle" fontSize="9" fill="#fbbf24">r={rInt}Ω</text>

              {[
                { x: 100, l: 'R₁', r: R1, v: V1, c: '#059669' },
                { x: 205, l: 'R₂', r: R2, v: V2, c: '#0284c7' },
                { x: 310, l: 'R₃', r: R3, v: V3, c: '#d97706' },
              ].map((b) => (
                <g key={b.l}>
                  <rect x={b.x} y="32" width="76" height="36" rx="6" fill="white" stroke={b.c} strokeWidth="2.5" />
                  <text x={b.x + 38} y="49" textAnchor="middle" fontSize="11" fontWeight="900" fill={b.c}>{b.l}={b.r}Ω</text>
                  <text x={b.x + 38} y="62" textAnchor="middle" fontSize="9" fontWeight="800" fill="#475569">V={b.v.toFixed(2)}V</text>
                </g>
              ))}
              <text x="230" y="118" textAnchor="middle" fontSize="13" fontWeight="900" fill="#059669">
                جریان یکسان در کل حلقه: I = {Itot.toFixed(2)} A
              </text>
              <text x="230" y="205" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
                R_eq = R₁ + R₂ + R₃ = {Req.toFixed(2)} Ω | ولتاژ به نسبت مقاومت تقسیم می‌شود
              </text>
            </svg>
          )}

          {topo === 'parallel' && (
            <svg viewBox="0 0 460 230" className="w-full h-auto max-h-[245px]">
              {/* Battery left, 3 horizontal parallel branches */}
              <path d="M 65 40 L 390 40 L 390 190 L 65 190 Z" fill="none" stroke="#059669" strokeWidth="2.8" />
              <line x1="150" y1="40" x2="150" y2="190" stroke="#059669" strokeWidth="2.5" />
              <line x1="150" y1="115" x2="390" y2="115" stroke="#0284c7" strokeWidth="2.5" />

              <rect x="38" y="82" width="54" height="66" rx="8" fill="#1e293b" />
              <text x="65" y="108" textAnchor="middle" fontSize="11" fontWeight="900" fill="#f87171">ℰ={emf}V</text>
              <text x="65" y="126" textAnchor="middle" fontSize="10" fill="#fbbf24">r={rInt}Ω</text>
              <text x="65" y="142" textAnchor="middle" fontSize="9" fill="#94a3b8">I={Itot.toFixed(2)}A</text>

              {[
                { y: 40, l: 'R₁', r: R1, i: I1, c: '#059669' },
                { y: 115, l: 'R₂', r: R2, i: I2, c: '#0284c7' },
                { y: 190, l: 'R₃', r: R3, i: I3, c: '#d97706' },
              ].map((b) => (
                <g key={b.l}>
                  <rect x="230" y={b.y - 17} width="90" height="34" rx="6" fill="white" stroke={b.c} strokeWidth="2.5" />
                  <text x="275" y={b.y - 1} textAnchor="middle" fontSize="11" fontWeight="900" fill={b.c}>{b.l}={b.r}Ω</text>
                  <text x="275" y={b.y + 12} textAnchor="middle" fontSize="9" fontWeight="800" fill="#475569">I={b.i.toFixed(2)}A</text>
                </g>
              ))}
              <text x="275" y="222" textAnchor="middle" fontSize="11" fontWeight="800" className="fill-indigo-600 dark:fill-indigo-300">
                ولتاژ مشترک هر سه شاخه: V = {V1.toFixed(2)} V | R_eq = {Req.toFixed(2)} Ω
              </text>
            </svg>
          )}

          {topo === 'home' && (
            <div className="p-2 space-y-3">
              <div
                className={`rounded-2xl border-2 p-4 text-center transition-all ${
                  fuseBlown
                    ? 'bg-rose-600 border-rose-700 text-white shadow-md'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                <div className="text-sm font-black">
                  {fuseBlown ? (
                    <>
                      ⚡ فیوز <span dir="ltr" className="inline-block font-mono">{fuseLimit} A</span> پرید! جریان درخواستی (
                      <span dir="ltr" className="inline-block font-mono">{homeI.toFixed(1)} A</span>) از حد مجاز بیشتر شد!
                    </>
                  ) : (
                    <>
                      ✓ مدار خانگی ۲۲۰ ولت ایمن و برقرار است — جریان کل:{' '}
                      <span dir="ltr" className="inline-block font-mono">{homeI.toFixed(1)} A</span> از{' '}
                      <span dir="ltr" className="inline-block font-mono">{fuseLimit} A</span>
                    </>
                  )}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  توان کل مصرفی هم‌زمان: <span dir="ltr" className="inline-block font-mono font-bold">{homeP} W</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {homeDevices.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={d.toggle}
                    className={`p-3 rounded-xl border-2 text-right transition-all cursor-pointer ${
                      d.on && !fuseBlown
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-400/30 text-slate-900 dark:text-white'
                        : d.on && fuseBlown
                        ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 ring-2 ring-rose-400/30 text-rose-900 dark:text-rose-100'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-65'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{d.name}</div>
                    <div className="text-[11px] font-mono mt-1 text-slate-600 dark:text-slate-300" dir="ltr">
                      I = {(d.p / 220).toFixed(2)} A • {d.on ? 'ON' : 'OFF'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      formula={
        topo !== 'home' ? (
          <LiveFormulaCard
            formulaTex={
              topo === 'series'
                ? 'R_{\\text{eq}} = R_1 + R_2 + R_3, \\qquad I = \\frac{\\mathcal{E}}{R_{\\text{eq}} + r}'
                : topo === 'parallel'
                ? '\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}, \\qquad I = I_1 + I_2 + I_3'
                : 'R_{\\text{eq}} = R_1 + \\frac{R_2 R_3}{R_2 + R_3}, \\qquad I = \\frac{\\mathcal{E}}{R_{\\text{eq}} + r}'
            }
            substitutedTex={`R_{\\text{eq}} = ${Req.toFixed(2)}\\;\\Omega,\\quad I_{\\text{کل}} = ${Itot.toFixed(2)}\\;\\text{A},\\quad (I_2=${I2.toFixed(2)}\\;\\text{A},\\; I_3=${I3.toFixed(2)}\\;\\text{A})`}
            symbols={[
              { symbol: 'R_{\\text{eq}}', meaning: 'مقاومت معادل کل مدار خارجی', unit: 'Ω' },
              { symbol: 'R_1, R_2, R_3', meaning: 'مقاومت‌های موجود در شاخه‌های مدار', unit: 'Ω' },
              { symbol: 'I', meaning: 'جریان اصلی خروجی از باتری', unit: 'A' },
              { symbol: 'I_1, I_2, I_3', meaning: 'شدت جریان عبوری از هر مقاومت', unit: 'A' },
              { symbol: '\\mathcal{E}, r', meaning: 'نیروی محرکه و مقاومت داخلی باتری', unit: 'V, Ω' },
            ]}
            insight={
              topo === 'mixed'
                ? 'مقادیر پیش‌فرض دقیقاً همان مثال ۲-۱۱ کتاب درسی است (ℰ=9V, r=1Ω, R₁=3Ω, R₂=3Ω, R₃=6Ω ← R_eq=5Ω و I=1.5A و I₂=1A)!'
                : topo === 'parallel'
                ? 'دقت کنید مقاومت معادل موازی همواره از کوچک‌ترین مقاومت شاخه‌ها نیز کوچک‌تر است!'
                : 'در مدار متوالی هر مقاومتی بزرگ‌تر باشد، افت ولتاژ (V=IR) و توان مصرفی (RI²) بیشتری سهم می‌برد!'
            }
          />
        ) : (
          <LiveFormulaCard
            formulaTex="I_{\text{فیوز}} = I_1 + I_2 + \dots = \frac{P_{\text{کل}}}{220\;\text{V}}"
            substitutedTex={`I_{\\text{کل}} = \\frac{${homeP}\\;\\text{W}}{220\\;\\text{V}} = ${homeI.toFixed(2)}\\;\\text{A}`}
            symbols={[
              { symbol: 'I_{\\text{فیوز}}', meaning: 'شدت جریان کل عبوری از فیوز اصلی', unit: 'A' },
              { symbol: 'I_1, I_2, \\dots', meaning: 'جریان مصرفی هر وسیله برقی موازی', unit: 'A' },
              { symbol: 'P_{\\text{کل}}', meaning: 'مجموع توان مصرفی وسایل روشن', unit: 'W' },
              { symbol: '220\\;\\text{V}', meaning: 'ولتاژ استاندارد برق شهری ایران', unit: 'V' },
            ]}
            insight="وسایل خانگی موازی وصل‌اند تا همه ۲۲۰ ولت بگیرند؛ اما فیوز متوالی در مسیر اصلی قرار دارد تا کل جریان را کنترل کند!"
          />
        )
      }
      controls={
        topo === 'home' ? (
          <>
            <SliderControl label="ظرفیت مجاز فیوز" symbol="I_{\text{fuse}}" value={fuseLimit} min={10} max={25} step={5} unit="A" accentClass="text-rose-600" onChange={setFuseLimit} />
            <div className="text-xs leading-7 text-slate-600 dark:text-slate-300">
              روی کارت هر یک از وسایل برقی کلیک کنید تا آن را روشن یا خاموش کنید و ببینید دقیقاً چه زمانی جریان کل از حد فیوز فراتر می‌رود!
            </div>
          </>
        ) : (
          <>
            <SliderControl label="نیروی محرکه" symbol="\mathcal{E}" value={emf} min={3} max={24} step={1} unit="V" accentClass="text-emerald-600" onChange={setEmf} />
            <SliderControl label="مقاومت داخلی" symbol="r" value={rInt} min={0} max={4} step={0.5} unit="Ω" accentClass="text-rose-500" onChange={setRInt} />
            <SliderControl label="مقاومت اول" symbol="R_1" value={R1} min={1} max={12} step={1} unit="Ω" accentClass="text-emerald-600" onChange={setR1} />
            <SliderControl label="مقاومت دوم" symbol="R_2" value={R2} min={1} max={12} step={1} unit="Ω" accentClass="text-sky-600" onChange={setR2} />
            <SliderControl label="مقاومت سوم" symbol="R_3" value={R3} min={1} max={12} step={1} unit="Ω" accentClass="text-amber-600" onChange={setR3} />
          </>
        )
      }
      metrics={
        topo === 'home' ? (
          <>
            <MetricCard label="جریان عبوری از فیوز" value={homeI.toFixed(2)} unit="A" color={fuseBlown ? 'rose' : 'emerald'} />
            <MetricCard label="توان کل مصرفی" value={`${homeP}`} unit="W" color="amber" />
          </>
        ) : (
          <>
            <MetricCard label="مقاومت معادل کل" value={Req.toFixed(2)} unit="Ω" color="indigo" />
            <MetricCard label="جریان کل مدار" value={Itot.toFixed(2)} unit="A" color="emerald" />
          </>
        )
      }
    />
  );
};
