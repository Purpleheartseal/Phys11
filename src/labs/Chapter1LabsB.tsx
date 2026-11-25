import React, { useState } from 'react';
import {
  LabShell,
  SliderControl,
  MetricCard,
  LiveFormulaCard,
  SegmentedButtons,
  formatSciPlain,
} from '../components/LabUI';

/* =========================================================
   LAB 1-7: Electric Potential Energy & Work
   ========================================================= */
export const Lab1_7: React.FC = () => {
  const [qSign, setQSign] = useState<'pos' | 'neg'>('pos');
  const [qAbs, setQAbs] = useState(4); // µC
  const [E, setE] = useState(500); // N/C (pointing right)
  const [dCm, setDCm] = useState(20); // cm
  const [moveDir, setMoveDir] = useState<'right' | 'left' | 'up'>('right');

  // E points right (+x). F points right if pos, left if neg.
  const forceRight = qSign === 'pos';
  // Angle theta between F_E and d:
  let theta = 90;
  if (moveDir === 'right') theta = forceRight ? 0 : 180;
  else if (moveDir === 'left') theta = forceRight ? 180 : 0;
  else theta = 90;

  const cosT = theta === 0 ? 1 : theta === 180 ? -1 : 0;
  const WE_mJ = qAbs * 1e-6 * E * (dCm / 100) * cosT * 1000;
  const dUE_mJ = -WE_mJ;

  const startX = 230;
  const startY = 125;
  const endX = moveDir === 'right' ? 320 : moveDir === 'left' ? 140 : 230;
  const endY = moveDir === 'up' ? 45 : 125;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-amber-50/30 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 230" className="w-full h-auto max-h-[250px]">
            {/* Positive plate left, Negative plate right */}
            <rect x="28" y="20" width="14" height="190" rx="4" fill="#ef4444" />
            <rect x="418" y="20" width="14" height="190" rx="4" fill="#2563eb" />
            {[45, 85, 125, 165, 195].map((y) => (
              <g key={y}>
                <text x="35" y={y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="white">+</text>
                <text x="425" y={y + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill="white">−</text>
                <line x1="48" y1={y} x2="410" y2={y} stroke="#0ea5e9" strokeOpacity="0.28" strokeWidth="2" />
              </g>
            ))}
            <text x="395" y="34" textAnchor="end" fontSize="12" fontWeight="900" fill="#0284c7">
              E = {E} N/C →
            </text>

            {/* Force vector FE */}
            <line
              x1={startX}
              y1={startY + 26}
              x2={forceRight ? startX + 70 : startX - 70}
              y2={startY + 26}
              stroke="#f43f5e"
              strokeWidth="3.5"
            />
            <polygon
              points={
                forceRight
                  ? `${startX + 78},${startY + 26} ${startX + 66},${startY + 20} ${startX + 66},${startY + 32}`
                  : `${startX - 78},${startY + 26} ${startX - 66},${startY + 20} ${startX - 66},${startY + 32}`
              }
              fill="#f43f5e"
            />
            <text
              x={forceRight ? startX + 38 : startX - 38}
              y={startY + 46}
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill="#e11d48"
            >
              F_E ({forceRight ? 'راست' : 'چپ'})
            </text>

            {/* Displacement vector d */}
            <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#10b981" strokeWidth="4" strokeDasharray="6 3" />
            <circle cx={endX} cy={endY} r="7" fill="none" stroke="#10b981" strokeWidth="3" />
            <text
              x={(startX + endX) / 2 + (moveDir === 'up' ? 24 : 0)}
              y={(startY + endY) / 2 - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill="#059669"
            >
              d = {dCm} cm
            </text>

            {/* Charge */}
            <circle cx={startX} cy={startY} r="17" fill={qSign === 'pos' ? '#ef4444' : '#2563eb'} stroke="white" strokeWidth="2.5" />
            <text x={startX} y={startY + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="white">
              {qSign === 'pos' ? `+${qAbs}` : `−${qAbs}`}
            </text>

            {/* Angle badge */}
            <rect x="145" y="192" width="170" height="26" rx="13" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="230" y="209" textAnchor="middle" fontSize="11" fontWeight="800" fill="#92400e">
              زاویه بین F_E و d: θ = {theta}°
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\Delta U_E = -W_E = -|q| E d \cos\theta"
          substitutedTex={`\\Delta U_E = -(${qAbs}\\times 10^{-6})(${E})(${(dCm / 100).toFixed(2)})\\cos(${theta}^\\circ) = ${dUE_mJ > 0 ? '+' : ''}${dUE_mJ.toFixed(2)}\\;\\text{mJ}`}
          symbols={[
            { symbol: '\\Delta U_E', meaning: 'تغییر انرژی پتانسیل الکتریکی', unit: 'J' },
            { symbol: 'W_E', meaning: 'کار نیروی الکتریکی در جابه‌جایی', unit: 'J' },
            { symbol: '|q|', meaning: 'اندازه بار الکتریکی ذره', unit: 'C' },
            { symbol: 'E', meaning: 'بزرگی میدان الکتریکی یکنواخت', unit: 'N/C' },
            { symbol: 'd', meaning: 'اندازه جابه‌جایی ذره', unit: 'm' },
            { symbol: '\\theta', meaning: 'زاویه بین نیروی الکتریکی $\\vec{F}_E$ و جابه‌جایی $\\vec{d}$', unit: 'درجه' },
          ]}
          insight={
            dUE_mJ < 0
              ? 'بار هم‌جهت با نیروی الکتریکی حرکت کرد (حرکت طبیعی/آزاد) ← کار نیروی الکتریکی مثبت و انرژی پتانسیل کاهش یافت (تبدیل به انرژی جنبشی!).'
              : dUE_mJ > 0
              ? 'بار خلاف جهت نیروی الکتریکی جابه‌جا شد ← کار نیروی الکتریکی منفی و انرژی پتانسیل ذخیره (افزایش) یافت!'
              : 'جابه‌جایی عمود بر میدان است (θ = 90°) ← نه کاری انجام می‌شود و نه انرژی پتانسیل تغییر می‌کند.'
          }
        />
      }
      controls={
        <>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">علامت ذره باردار:</div>
            <SegmentedButtons
              value={qSign}
              onChange={setQSign}
              options={[
                { value: 'pos', label: 'بار مثبت (+q)' },
                { value: 'neg', label: 'بار منفی (−q)' },
              ]}
            />
          </div>
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">جهت جابه‌جایی (d):</div>
            <SegmentedButtons
              value={moveDir}
              onChange={setMoveDir}
              options={[
                { value: 'right', label: 'هم‌جهت میدان (→)' },
                { value: 'left', label: 'خلاف میدان (←)' },
                { value: 'up', label: 'عمود بر میدان (↑)' },
              ]}
            />
          </div>
          <SliderControl label="اندازه بار" symbol="|q|" value={qAbs} min={1} max={10} unit="µC" accentClass="text-rose-500" onChange={setQAbs} />
          <SliderControl label="بزرگی میدان" symbol="E" value={E} min={100} max={2000} step={100} unit="N/C" accentClass="text-sky-600" onChange={setE} />
          <SliderControl label="مسافت جابه‌جایی" symbol="d" value={dCm} min={5} max={50} step={5} unit="cm" accentClass="text-emerald-600" onChange={setDCm} />
        </>
      }
      metrics={
        <>
          <MetricCard
            label="کار نیروی الکتریکی W_E"
            value={`${WE_mJ > 0 ? '+' : ''}${WE_mJ.toFixed(2)}`}
            unit="mJ"
            color={WE_mJ > 0 ? 'emerald' : WE_mJ < 0 ? 'rose' : 'indigo'}
          />
          <MetricCard
            label="تغییر انرژی پتانسیل ΔU_E"
            value={`${dUE_mJ > 0 ? '+' : ''}${dUE_mJ.toFixed(2)}`}
            unit="mJ"
            sublabel={dUE_mJ > 0 ? 'افزایش پتانسیل' : dUE_mJ < 0 ? 'کاهش پتانسیل' : 'ثابت'}
            color={dUE_mJ > 0 ? 'amber' : dUE_mJ < 0 ? 'cyan' : 'indigo'}
          />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-8: Electric Potential & Equipotential Lines
   ========================================================= */
export const Lab1_8: React.FC = () => {
  const [E, setE] = useState(400); // V/m
  const [xA, setXA] = useState(10); // cm from + plate (0 to 40cm)
  const [xB, setXB] = useState(30); // cm from + plate
  const [yB, setYB] = useState(0); // vertical offset (cm) to prove perpendicular doesn't change V!
  const [refPlate, setRefPlate] = useState<'neg' | 'mid' | 'pos'>('neg');
  const [qTest, setQTest] = useState(-2); // µC

  const totalD = 40; // cm = 0.4 m
  const totalV = E * (totalD / 100);
  const vAt = (xCm: number) => {
    const vFromNeg = E * ((totalD - xCm) / 100);
    if (refPlate === 'neg') return vFromNeg;
    if (refPlate === 'mid') return vFromNeg - totalV / 2;
    return vFromNeg - totalV;
  };

  const VA = vAt(xA);
  const VB = vAt(xB);
  const dV = VB - VA;
  const dU_uJ = qTest * dV; // µC * V = µJ

  const pxFromCm = (cm: number) => 60 + (cm / totalD) * 340;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-950">
          <svg viewBox="0 0 460 235" className="w-full h-auto max-h-[250px]">
            {/* Plates */}
            <rect x="44" y="25" width="14" height="175" rx="4" fill="#ef4444" />
            <rect x="402" y="25" width="14" height="175" rx="4" fill="#2563eb" />

            {/* Equipotential vertical dashed lines */}
            {[0, 10, 20, 30, 40].map((cm) => {
              const px = pxFromCm(cm);
              return (
                <g key={cm}>
                  <line x1={px} y1="25" x2={px} y2="200" stroke="#6366f1" strokeOpacity="0.32" strokeDasharray="4 4" strokeWidth="1.5" />
                  <text x={px} y="218" textAnchor="middle" fontSize="10" fontWeight="700" className="fill-indigo-600 dark:fill-indigo-300">
                    {vAt(cm).toFixed(0)}V
                  </text>
                </g>
              );
            })}

            {/* E arrows */}
            <line x1="150" y1="36" x2="305" y2="36" stroke="#0ea5e9" strokeWidth="2.5" />
            <polygon points="314,36 302,31 302,41" fill="#0ea5e9" />
            <text x="230" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0284c7">
              جهت میدان E (پتانسیل در این جهت کم می‌شود)
            </text>

            {/* Path A -> B */}
            <line
              x1={pxFromCm(xA)}
              y1="115"
              x2={pxFromCm(xB)}
              y2={115 - yB * 2.2}
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="5 3"
            />
            {/* Point A */}
            <circle cx={pxFromCm(xA)} cy="115" r="11" fill="#f59e0b" stroke="white" strokeWidth="2.5" />
            <text x={pxFromCm(xA)} y="119" textAnchor="middle" fontSize="11" fontWeight="900" fill="white">A</text>
            {/* Point B */}
            <circle cx={pxFromCm(xB)} cy={115 - yB * 2.2} r="11" fill="#10b981" stroke="white" strokeWidth="2.5" />
            <text x={pxFromCm(xB)} y={119 - yB * 2.2} textAnchor="middle" fontSize="11" fontWeight="900" fill="white">B</text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="\Delta V = V_B - V_A = \pm E d_\parallel, \qquad \Delta U_E = q \Delta V"
          substitutedTex={`\\Delta V = ${VB.toFixed(1)} - (${VA.toFixed(1)}) = ${dV > 0 ? '+' : ''}${dV.toFixed(1)}\\;\\text{V},\\quad \\Delta U = (${qTest}\\;\\mu\\text{C})(${dV.toFixed(1)}\\;\\text{V}) = ${dU_uJ.toFixed(1)}\\;\\mu\\text{J}`}
          symbols={[
            { symbol: '\\Delta V', meaning: 'اختلاف پتانسیل الکتریکی ($V_B - V_A$)', unit: 'V' },
            { symbol: 'E', meaning: 'بزرگی میدان الکتریکی یکنواخت', unit: 'V/m' },
            { symbol: 'd_\\parallel', meaning: 'فاصله افقی دو نقطه هم‌راستا با میدان', unit: 'm' },
            { symbol: '\\Delta U_E', meaning: 'تغییر انرژی پتانسیل ذره', unit: 'J' },
            { symbol: 'q', meaning: 'بار الکتریکی ذره (**با علامت!**)', unit: 'C' },
          ]}
          insight="اسلایدر جابه‌جایی عمودی B را تکان دهید! می‌بینید که حرکت عمود بر خطوط میدان، هیچ تغییری در پتانسیل ایجاد نمی‌کند (خطوط عمود بر E هم‌پتانسیل‌اند)."
        />
      }
      controls={
        <>
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">انتخاب مرجع زمین (V = 0):</div>
            <SegmentedButtons
              value={refPlate}
              onChange={setRefPlate}
              options={[
                { value: 'neg', label: 'صفحه منفی (0V)' },
                { value: 'mid', label: 'وسط (0V)' },
                { value: 'pos', label: 'صفحه مثبت (0V)' },
              ]}
            />
          </div>
          <SliderControl label="میدان الکتریکی" symbol="E" value={E} min={100} max={1000} step={50} unit="V/m" accentClass="text-sky-600" onChange={setE} />
          <SliderControl label="مکان افقی A" symbol="x_A" value={xA} min={0} max={40} step={2} unit="cm" accentClass="text-amber-500" onChange={setXA} />
          <SliderControl label="مکان افقی B" symbol="x_B" value={xB} min={0} max={40} step={2} unit="cm" accentClass="text-emerald-600" onChange={setXB} />
          <SliderControl label="جابه‌جایی عمودی B (عمود بر E)" symbol="y_B" value={yB} min={-20} max={20} step={2} unit="cm" accentClass="text-indigo-500" onChange={setYB} />
          <SliderControl label="بار جابه‌جا شده (با علامت)" symbol="q" value={qTest} min={-10} max={10} step={1} unit="µC" accentClass="text-rose-500" onChange={setQTest} />
        </>
      }
      metrics={
        <>
          <MetricCard label="پتانسیل V_A و V_B" value={`${VA.toFixed(0)} / ${VB.toFixed(0)}`} unit="V" color="indigo" />
          <MetricCard label="اختلاف پتانسیل ΔV" value={`${dV > 0 ? '+' : ''}${dV.toFixed(1)}`} unit="V" sublabel="مستقل از مرجع زمین!" color="cyan" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-9: Conductor Charge Distribution & Faraday Cage
   ========================================================= */
export const Lab1_9: React.FC = () => {
  const [mode, setMode] = useState<'tip' | 'faraday'>('tip');
  const [chargeLevel, setChargeLevel] = useState(65); // 10..100
  const [extField, setExtField] = useState(80); // 0..100

  const coronaActive = chargeLevel >= 82;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={mode}
              onChange={setMode}
              options={[
                { value: 'tip', label: 'جسم دوکی و نقاط نوک‌تیز' },
                { value: 'faraday', label: 'قفس فاراده (E_داخل = 0)' },
              ]}
            />
          </div>

          {mode === 'tip' ? (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* Corona glow at sharp tip */}
              {coronaActive && (
                <g className="animate-pulse">
                  <circle cx="372" cy="110" r="34" fill="#a855f7" fillOpacity="0.22" />
                  <circle cx="372" cy="110" r="18" fill="#c084fc" fillOpacity="0.45" />
                  <path d="M 378 106 L 405 92 L 395 108 L 420 112 L 396 118 L 408 132 L 378 114" fill="#a855f7" />
                  <text x="392" y="64" textAnchor="middle" fontSize="11" fontWeight="900" fill="#7e22ce">
                    تخلیه هاله‌ای!
                  </text>
                </g>
              )}

              {/* Teardrop / pear conductor */}
              <path
                d="M 110 52 C 55 52, 55 168, 110 168 C 195 168, 280 132, 368 110 C 280 88, 195 52, 110 52 Z"
                fill="#cbd5e1"
                stroke="#475569"
                strokeWidth="3"
              />
              {/* Insulator stand */}
              <rect x="155" y="162" width="12" height="44" fill="#78350f" />
              <rect x="130" y="202" width="62" height="10" rx="4" fill="#451a03" />

              {/* Inside E=0 label */}
              <text x="155" y="114" textAnchor="middle" fontSize="13" fontWeight="900" fill="#0f172a">
                E_داخل = 0
              </text>

              {/* Surface charges: sparse on wide left, very dense on sharp tip! */}
              {[
                { x: 78, y: 80 },
                { x: 74, y: 112 },
                { x: 78, y: 142 },
                { x: 118, y: 60 },
                { x: 118, y: 160 },
                { x: 175, y: 66 },
                { x: 175, y: 154 },
                { x: 240, y: 81 },
                { x: 240, y: 139 },
                // Dense tip charges
                { x: 295, y: 94 },
                { x: 295, y: 126 },
                { x: 325, y: 100 },
                { x: 325, y: 120 },
                { x: 344, y: 104 },
                { x: 344, y: 116 },
                { x: 358, y: 110 },
                { x: 368, y: 110 },
              ]
                .slice(0, Math.max(6, Math.round((chargeLevel / 100) * 17)))
                .map((p, i) => (
                  <text key={i} x={p.x} y={p.y + 4} textAnchor="middle" fontSize="13" fontWeight="900" fill="#dc2626">
                    +
                  </text>
                ))}
            </svg>
          ) : (
            <svg viewBox="0 0 460 220" className="w-full h-auto max-h-[240px]">
              {/* External field lines */}
              {[35, 70, 110, 150, 185].map((y) => (
                <g key={y}>
                  <line
                    x1="20"
                    y1={y}
                    x2={y > 55 && y < 165 ? 155 : 440}
                    y2={y}
                    stroke="#0ea5e9"
                    strokeWidth={1.2 + extField / 60}
                    strokeOpacity={0.25 + extField / 140}
                  />
                  {y > 55 && y < 165 && (
                    <line
                      x1="305"
                      y1={y}
                      x2="440"
                      y2={y}
                      stroke="#0ea5e9"
                      strokeWidth={1.2 + extField / 60}
                      strokeOpacity={0.25 + extField / 140}
                    />
                  )}
                </g>
              ))}

              {/* Hollow metal Faraday shell */}
              <circle cx="230" cy="110" r="74" fill="#cbd5e1" stroke="#475569" strokeWidth="3" />
              <circle cx="230" cy="110" r="54" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />

              {/* Induced charges on outer wall */}
              {extField > 8 &&
                [-35, -18, 0, 18, 35].slice(0, Math.ceil(extField / 20)).map((dy, i) => (
                  <React.Fragment key={i}>
                    <text x="164" y={114 + dy} textAnchor="middle" fontSize="14" fontWeight="900" fill="#2563eb">−</text>
                    <text x="296" y={114 + dy} textAnchor="middle" fontSize="14" fontWeight="900" fill="#ef4444">+</text>
                  </React.Fragment>
                ))}

              <text x="230" y="106" textAnchor="middle" fontSize="14" fontWeight="900" fill="#059669">
                E_داخل = 0
              </text>
              <text x="230" y="126" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
                منطقه امن (قفس فاراده)
              </text>
            </svg>
          )}
        </div>
      }
      controls={
        mode === 'tip' ? (
          <>
            <SliderControl
              label="مقدار بار داده شده به رسانا"
              symbol="Q"
              value={chargeLevel}
              min={15}
              max={100}
              unit="%"
              accentClass="text-rose-600"
              onChange={setChargeLevel}
            />
            <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-xs leading-7 text-slate-700 dark:text-slate-200">
              {coronaActive
                ? 'میدان در نوک تیز از آستانه شکست هوا عبور کرد و تخلیه هاله‌ای (جرقه/آتش سنت المو) رخ داد! همین اصل در برق‌گیر ساختمان به کار می‌رود.'
                : 'مقدار بار را از ۸۲٪ بیشتر کنید تا پدیده تخلیه هاله‌ای در نوک تیز رسانا را ببینید! توجه: پتانسیل همه نقاط سطح همچنان برابر است.'}
            </div>
          </>
        ) : (
          <>
            <SliderControl
              label="شدت میدان الکتریکی خارجی"
              symbol="E_{\text{ext}}"
              value={extField}
              min={0}
              max={100}
              unit="kV/m"
              accentClass="text-sky-600"
              onChange={setExtField}
            />
            <div className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 text-xs leading-7 text-slate-700 dark:text-slate-200">
              هرچه میدان خارجی قوی‌تر شود، بارهای القایی بیشتری روی سطح بیرونی قفس جمع می‌شوند تا میدان داخلی را دقیقاً صفر نگه دارند!
            </div>
          </>
        )
      }
      metrics={
        <>
          <MetricCard label="میدان داخل رسانا" value="0" unit="N/C" sublabel="همیشه در تعادل!" color="emerald" />
          <MetricCard
            label={mode === 'tip' ? 'وضعیت نوک تیز' : 'میدان القایی جبرانی'}
            value={mode === 'tip' ? (coronaActive ? 'تخلیه هاله‌ای!' : 'تراکم بیشینه') : `${extField}`}
            unit={mode === 'tip' ? '' : 'kV/m'}
            color={mode === 'tip' && coronaActive ? 'violet' : 'cyan'}
          />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-10: Parallel-Plate Capacitor Konkoor Simulator
   ========================================================= */
const dielectrics = [
  { name: 'خلأ / هوا', k: 1.0, color: '#e2e8f0' },
  { name: 'تفلون', k: 2.1, color: '#bae6fd' },
  { name: 'کاغذ', k: 3.5, color: '#fde68a' },
  { name: 'شیشه پیرکس', k: 5.0, color: '#a5f3fc' },
  { name: 'میکا', k: 7.0, color: '#ddd6fe' },
];

export const Lab1_10: React.FC = () => {
  const [connected, setConnected] = useState<'yes' | 'no'>('yes');
  const [areaCm2, setAreaCm2] = useState(100); // cm² (initial 100)
  const [dMm, setDMm] = useState(2.0); // mm (initial 2)
  const [dielIdx, setDielIdx] = useState(0); // air k=1
  const [V0, setV0] = useState(12); // initial battery voltage

  const eps0 = 8.85e-12;
  const C0_pF = (eps0 * (100 * 1e-4)) / (2e-3) * 1e12; // baseline pF at A=100, d=2, k=1
  const Q0_pC = C0_pF * V0;
  const E0_kV = V0 / 2; // V / mm = kV/m
  const U0_nJ = 0.5 * C0_pF * 1e-12 * V0 * V0 * 1e9;

  const kappa = dielectrics[dielIdx].k;
  const C_pF = (kappa * eps0 * (areaCm2 * 1e-4)) / (dMm * 1e-3) * 1e12;
  const V = connected === 'yes' ? V0 : Q0_pC / C_pF;
  const Q_pC = connected === 'yes' ? C_pF * V0 : Q0_pC;
  const E_kV = V / dMm;
  const U_nJ = 0.5 * C_pF * 1e-12 * V * V * 1e9;

  const ratioBadge = (cur: number, base: number) => {
    const r = cur / base;
    if (Math.abs(r - 1) < 0.02) return 'ثابت (×1)';
    return `×${r.toFixed(2)}`;
  };

  const plateW = 90 + (areaCm2 / 200) * 130;
  const gapPx = 24 + (dMm / 5) * 68;
  const topY = 125 - gapPx / 2;
  const botY = 125 + gapPx / 2;

  return (
    <LabShell
      visual={
        <div className="p-4 bg-gradient-to-b from-slate-50 to-cyan-50/40 dark:from-slate-900 dark:to-slate-950 space-y-3">
          <div className="flex justify-center">
            <SegmentedButtons
              value={connected}
              onChange={setConnected}
              options={[
                { value: 'yes', label: 'متصل به باتری (V ثابت)' },
                { value: 'no', label: 'جدا از باتری (Q ثابت)' },
              ]}
            />
          </div>

          <svg viewBox="0 0 460 245" className="w-full h-auto max-h-[260px]">
            {/* Wires to battery */}
            <path
              d={`M 85 95 L 85 52 L 260 52 L 260 ${topY}`}
              fill="none"
              stroke={connected === 'yes' ? '#475569' : '#cbd5e1'}
              strokeWidth="2.5"
              strokeDasharray={connected === 'yes' ? undefined : '5 5'}
            />
            <path
              d={`M 85 155 L 85 208 L 260 208 L 260 ${botY}`}
              fill="none"
              stroke={connected === 'yes' ? '#475569' : '#cbd5e1'}
              strokeWidth="2.5"
              strokeDasharray={connected === 'yes' ? undefined : '5 5'}
            />

            {/* Switch gap when disconnected */}
            {connected === 'no' && (
              <g>
                <rect x="135" y="42" width="44" height="20" fill="#f8fafc" />
                <line x1="138" y1="52" x2="170" y2="36" stroke="#ef4444" strokeWidth="3" />
                <text x="157" y="30" textAnchor="middle" fontSize="10" fontWeight="900" fill="#dc2626">
                  کلید باز (Q ثابت)
                </text>
              </g>
            )}

            {/* Battery */}
            <g transform="translate(65, 95)">
              <rect x="0" y="0" width="40" height="60" rx="8" fill="#1e293b" />
              <text x="20" y="22" textAnchor="middle" fontSize="12" fontWeight="900" fill="#f87171">+</text>
              <text x="20" y="36" textAnchor="middle" fontSize="10" fontWeight="800" fill="white">{V0}V</text>
              <text x="20" y="52" textAnchor="middle" fontSize="13" fontWeight="900" fill="#60a5fa">−</text>
            </g>

            {/* Dielectric Slab */}
            {dielIdx > 0 && (
              <rect
                x={260 - plateW / 2 + 4}
                y={topY + 8}
                width={plateW - 8}
                height={gapPx - 16}
                rx="4"
                fill={dielectrics[dielIdx].color}
                fillOpacity="0.85"
                stroke="#64748b"
                strokeWidth="1.5"
              />
            )}

            {/* Electric Field arrows (skip center when dielectric pill is shown so zero overlap!) */}
            {(dielIdx > 0 ? [-0.38, 0.38] : [-0.35, 0, 0.35]).map((f, i) => (
              <g key={i}>
                <line
                  x1={260 + f * plateW}
                  y1={topY + 10}
                  x2={260 + f * plateW}
                  y2={botY - 12}
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeOpacity={Math.min(1, 0.35 + E_kV / 12)}
                />
                <polygon
                  points={`${260 + f * plateW},${botY - 7} ${260 + f * plateW - 4},${botY - 15} ${260 + f * plateW + 4},${botY - 15}`}
                  fill="#0284c7"
                />
              </g>
            ))}

            {/* Top Plate (+Q) */}
            <rect x={260 - plateW / 2} y={topY - 8} width={plateW} height="10" rx="3" fill="#ef4444" />
            {/* Bottom Plate (-Q) */}
            <rect x={260 - plateW / 2} y={botY - 2} width={plateW} height="10" rx="3" fill="#2563eb" />

            {/* Labels cleanly separated from wires & arrows */}
            <text x="260" y={topY - 15} textAnchor="middle" fontSize="11" fontWeight="800" fill="#dc2626">
              +Q = {Q_pC.toFixed(0)} pC
            </text>
            <text x={260 - plateW / 2 + 16} y={botY + 23} textAnchor="start" fontSize="11" fontWeight="800" fill="#2563eb">
              −Q
            </text>
            {/* Distance bracket strictly outside right edge */}
            <line x1={260 + plateW / 2 + 12} y1={topY + 2} x2={260 + plateW / 2 + 12} y2={botY - 2} stroke="#64748b" strokeWidth="1.5" />
            <text x={260 + plateW / 2 + 20} y="129" textAnchor="start" fontSize="10.5" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              d = {dMm.toFixed(1)} mm
            </text>
            {dielIdx > 0 && (
              <g>
                <rect x="204" y="114" width="112" height="22" rx="11" fill="white" fillOpacity="0.92" stroke="#94a3b8" strokeWidth="1" />
                <text x="260" y="129" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0f172a">
                  κ={kappa} ({dielectrics[dielIdx].name})
                </text>
              </g>
            )}
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="C = \kappa \varepsilon_0 \frac{A}{d}, \qquad C = \frac{Q}{V}, \qquad E = \frac{V}{d}"
          substitutedTex={`C = ${kappa} \\times (8.85\\times 10^{-12})\\frac{${areaCm2}\\times 10^{-4}}{${dMm.toFixed(1)}\\times 10^{-3}} = ${C_pF.toFixed(1)}\\;\\text{pF}`}
          symbols={[
            { symbol: 'C', meaning: 'ظرفیت خازن تخت', unit: 'F (پیکوفاراد)' },
            { symbol: '\\kappa', meaning: 'ثابت دی‌الکتریک (برای هوا ۱)', unit: 'بدون یکا' },
            { symbol: '\\varepsilon_0', meaning: 'ضریب گذردهی الکتریکی خلأ', unit: '8.85×10⁻¹² F/m' },
            { symbol: 'A', meaning: 'مساحت مشترک صفحات خازن', unit: 'm²' },
            { symbol: 'd', meaning: 'فاصله بین دو صفحه خازن', unit: 'm' },
            { symbol: 'Q, V', meaning: 'بار ذخیره شده و ولتاژ دو سر خازن', unit: 'C, V' },
            { symbol: 'E', meaning: 'میدان الکتریکی یکنواخت بین صفحات', unit: 'V/m' },
          ]}
          insight={
            connected === 'no'
              ? 'حالت جدا از باتری (Q ثابت): وقتی d را تغییر می‌دهید (با هوا)، به مقدار میدان E نگاه کنید — دقیقاً ثابت می‌ماند! اما با ورود دی‌الکتریک، V و E تقسیم بر κ می‌شوند.'
              : 'حالت متصل به باتری (V ثابت): هر تغییری که ظرفیت C را افزایش دهد (مثل کم کردن d یا وارد کردن دی‌الکتریک)، بار Q و انرژی U را نیز به همان نسبت افزایش می‌دهد!'
          }
        />
      }
      controls={
        <>
          <SliderControl label="مساحت صفحات" symbol="A" value={areaCm2} min={50} max={200} step={10} unit="cm²" accentClass="text-cyan-600" onChange={setAreaCm2} />
          <SliderControl label="فاصله دو صفحه" symbol="d" value={dMm} min={1.0} max={5.0} step={0.5} unit="mm" accentClass="text-indigo-600" onChange={setDMm} />
          <SliderControl label="ولتاژ باتری اولیه" symbol="V_0" value={V0} min={6} max={36} step={6} unit="V" accentClass="text-amber-600" onChange={setV0} />
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">جنس دی‌الکتریک (جدول ۱-۳ کتاب):</div>
            <div className="flex flex-wrap gap-1.5">
              {dielectrics.map((d, i) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setDielIdx(i)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                    dielIdx === i
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {d.name} (κ={d.k})
                </button>
              ))}
            </div>
          </div>
        </>
      }
      metrics={
        <>
          <MetricCard label="ظرفیت C" value={C_pF.toFixed(1)} unit="pF" sublabel={`نسبت به پایه: ${ratioBadge(C_pF, C0_pF)}`} color="cyan" />
          <MetricCard label="ولتاژ V" value={V.toFixed(1)} unit="V" sublabel={`نسبت به پایه: ${ratioBadge(V, V0)}`} color="amber" />
          <MetricCard label="بار Q" value={Q_pC.toFixed(0)} unit="pC" sublabel={`نسبت به پایه: ${ratioBadge(Q_pC, Q0_pC)}`} color="rose" />
          <MetricCard label="میدان E" value={E_kV.toFixed(2)} unit="kV/m" sublabel={`نسبت به پایه: ${ratioBadge(E_kV, E0_kV)}`} color="emerald" />
        </>
      }
    />
  );
};

/* =========================================================
   LAB 1-11: Capacitor Energy & Flash/Defibrillator Discharge
   ========================================================= */
export const Lab1_11: React.FC = () => {
  const [C_uF, setC_uF] = useState(20); // µF
  const [V, setV] = useState(300); // V
  const [dtMs, setDtMs] = useState(2.0); // ms
  const [flashing, setFlashing] = useState(false);

  const Q_mC = C_uF * 1e-6 * V * 1000;
  const U_J = 0.5 * C_uF * 1e-6 * V * V;
  const Pav_W = U_J / (dtMs * 1e-3);

  const triggerFlash = () => {
    setFlashing(true);
    window.setTimeout(() => setFlashing(false), 650);
  };

  // Q-V triangle coordinates
  const maxV = 600;
  const maxQ = 100 * 1e-6 * maxV * 1000; // 60 mC
  const pxV = 55 + (V / maxV) * 340;
  const pyQ = 195 - Math.min(1, Q_mC / 30) * 155;

  return (
    <LabShell
      visual={
        <div
          className={`p-4 transition-colors duration-300 ${
            flashing
              ? 'bg-amber-200 dark:bg-amber-500/40'
              : 'bg-gradient-to-b from-slate-50 to-amber-50/30 dark:from-slate-900 dark:to-slate-950'
          }`}
        >
          <svg viewBox="0 0 460 230" className="w-full h-auto max-h-[250px]">
            {/* Axes */}
            <line x1="55" y1="195" x2="420" y2="195" stroke="#475569" strokeWidth="2" />
            <line x1="55" y1="25" x2="55" y2="195" stroke="#475569" strokeWidth="2" />
            <text x="415" y="214" textAnchor="end" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              V (ولت)
            </text>
            <text x="48" y="34" textAnchor="end" fontSize="11" fontWeight="800" className="fill-slate-600 dark:fill-slate-300">
              Q (mC)
            </text>

            {/* Shaded triangle area = Energy U */}
            <polygon
              points={`55,195 ${pxV},195 ${pxV},${pyQ}`}
              fill="#6366f1"
              fillOpacity={flashing ? '0.65' : '0.28'}
              stroke="#4f46e5"
              strokeWidth="2.5"
            />
            <circle cx={pxV} cy={pyQ} r="5.5" fill="#4f46e5" />

            <text x={(55 + pxV * 2) / 3} y={(195 * 2 + pyQ) / 3 + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="#4338ca">
              مساحت = U = {U_J.toFixed(2)} J
            </text>
            <text x={pxV} y="212" textAnchor="middle" fontSize="10" fontWeight="800" fill="#4f46e5">
              {V}V
            </text>
            <text x="48" y={pyQ + 4} textAnchor="end" fontSize="10" fontWeight="800" fill="#4f46e5">
              {Q_mC.toFixed(1)}
            </text>
          </svg>
        </div>
      }
      formula={
        <LiveFormulaCard
          formulaTex="U = \frac{1}{2} C V^2 = \frac{1}{2} Q V, \qquad P_{\text{av}} = \frac{U}{\Delta t}"
          substitutedTex={`U = \\frac{1}{2}(${C_uF}\\times 10^{-6})(${V})^2 = ${U_J.toFixed(2)}\\;\\text{J},\\qquad P_{\\text{av}} = \\frac{${U_J.toFixed(2)}}{${dtMs}\\times 10^{-3}} = ${formatSciPlain(Pav_W, 1)}\\;\\text{W}`}
          symbols={[
            { symbol: 'U', meaning: 'انرژی ذخیره شده در میدان خازن', unit: 'J' },
            { symbol: 'C', meaning: 'ظرفیت خازن', unit: 'F' },
            { symbol: 'V', meaning: 'اختلاف پتانسیل (ولتاژ) شارژ خازن', unit: 'V' },
            { symbol: 'Q', meaning: 'بار ذخیره شده روی صفحه مثبت', unit: 'C' },
            { symbol: 'P_{\\text{av}}', meaning: 'توان متوسط تخلیه ناگهانی', unit: 'W' },
            { symbol: '\\Delta t', meaning: 'مدت زمان تخلیه انرژی', unit: 's' },
          ]}
          insight="چون ولتاژ به توان ۲ می‌رسد، دو برابر کردن ولتاژ خازن، انرژی ذخیره شده را ۴ برابر می‌کند!"
        />
      }
      controls={
        <>
          <SliderControl label="ظرفیت خازن" symbol="C" value={C_uF} min={5} max={100} step={5} unit="µF" accentClass="text-indigo-600" onChange={setC_uF} />
          <SliderControl label="ولتاژ شارژ" symbol="V" value={V} min={50} max={600} step={25} unit="V" accentClass="text-amber-600" onChange={setV} />
          <SliderControl label="مدت زمان تخلیه" symbol="\Delta t" value={dtMs} min={0.5} max={10} step={0.5} unit="ms" accentClass="text-rose-600" onChange={setDtMs} />
          <button
            type="button"
            onClick={triggerFlash}
            className="w-full py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer"
          >
            ⚡ شبیه‌سازی تخلیه ناگهانی (فلاش / دفیبریلاتور)
          </button>
        </>
      }
      metrics={
        <>
          <MetricCard label="انرژی ذخیره شده U" value={U_J.toFixed(2)} unit="J" color="indigo" />
          <MetricCard label="توان متوسط تخلیه" value={(Pav_W / 1000).toFixed(2)} unit="kW" color="amber" />
        </>
      }
    />
  );
};
