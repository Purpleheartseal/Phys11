import { PracticeQuestion } from '../types/physics';

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function makeMcqOptions(correct: number, unit: string, multipliers: number[] = [0.5, 2, 4]) {
  const vals = [correct];
  for (const m of multipliers) {
    const v = Number((correct * m).toPrecision(3));
    if (!vals.some((x) => Math.abs(x - v) < 1e-9)) vals.push(v);
  }
  while (vals.length < 4) {
    vals.push(Number((correct * (vals.length + 1.5)).toPrecision(3)));
  }
  const shuffled = vals
    .map((v, i) => ({ v, isCorrect: i === 0, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort);
  const correctIndex = shuffled.findIndex((x) => x.isCorrect);
  return {
    options: shuffled.map((x) => ({
      label: '',
      tex: `${x.v}\\;\\text{${unit}}`,
    })),
    correctIndex,
  };
}

export function generateDynamicProblem(subsectionId: string): PracticeQuestion | null {
  const stamp = Date.now();

  switch (subsectionId) {
    case '1-2': {
      const mult = pick([2, 3, 4, 5, 6, 8]);
      const nPow = pick([9, 10, 11, 12]);
      const n = mult * 1; // mult × 10^nPow electrons
      const qMicro = Number((n * 1.6 * Math.pow(10, nPow - 13)).toPrecision(3));
      return {
        id: `dyn-1-2-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی (کوانتیده بودن بار)',
        prompt: `اگر در اثر مالش، تعداد $${mult} \\times 10^{${nPow}}$ الکترون از یک جسم خنثی جدا شود، اندازه بار الکتریکی ایجاد شده روی آن چند نانوکولن ($\\text{nC}$) خواهد بود؟ ($e = 1.6 \\times 10^{-19}\\;\\text{C}$)`,
        numericAnswer: Number((mult * 1.6 * Math.pow(10, nPow - 10)).toPrecision(4)),
        tolerance: 0.03,
        unit: 'nC',
        hint: 'از رابطه $q = ne$ استفاده کنید و حاصل را به نانوکولن ($10^{-9}\\;\\text{C}$) تبدیل کنید.',
        solutionSteps: [
          {
            text: 'از رابطه کوانتیده بودن بار استفاده می‌کنیم:',
            tex: `q = n e = (${mult} \\times 10^{${nPow}})(1.6 \\times 10^{-19}\\;\\text{C})`,
          },
          {
            text: 'محاسبه مقدار بار برحسب کولن و تبدیل به نانوکولن:',
            tex: `q = ${Number((mult * 1.6).toFixed(2))} \\times 10^{${nPow - 19}}\\;\\text{C} = ${Number((mult * 1.6 * Math.pow(10, nPow - 10)).toPrecision(4))}\\;\\text{nC}`,
          },
          {
            text: `توجه: چون الکترون جدا شده است، علامت بار جسم مثبت و معادل $${qMicro}\\;\\mu\\text{C}$ است.`,
          },
        ],
      };
    }

    case '1-3': {
      const q1 = pick([2, 3, 4, 5, 6, 8]);
      const q2 = pick([2, 3, 4, 6, 8]);
      const rCm = pick([3, 6, 10, 15, 30]);
      const rM = rCm / 100;
      const F = Number(((9e9 * (q1 * 1e-6) * (q2 * 1e-6)) / (rM * rM)).toPrecision(3));
      const { options, correctIndex } = makeMcqOptions(F, 'N', [0.25, 0.5, 2]);
      return {
        id: `dyn-1-3-${stamp}`,
        type: 'mcq',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی قانون کولن',
        prompt: `دو بار نقطه‌ای $q_1 = +${q1}\\;\\mu\\text{C}$ و $q_2 = -${q2}\\;\\mu\\text{C}$ در فاصله $${rCm}\\;\\text{cm}$ از یکدیگر در خلأ قرار دارند. اندازه نیروی الکتریکی بین آن‌ها چند نیوتون است؟ ($k = 9 \\times 10^9\\;\\text{N}\\cdot\\text{m}^2/\\text{C}^2$)`,
        options,
        correctIndex,
        hint: 'ابتدا فاصله را به متر و بارها را به کولن تبدیل کنید، سپس در رابطه $F = k\\frac{|q_1||q_2|}{r^2}$ قرار دهید.',
        solutionSteps: [
          {
            text: 'تبدیل یکاها به SI:',
            tex: `|q_1| = ${q1}\\times 10^{-6}\\;\\text{C},\\quad |q_2| = ${q2}\\times 10^{-6}\\;\\text{C},\\quad r = ${rM}\\;\\text{m}`,
          },
          {
            text: 'جایگذاری در قانون کولن:',
            tex: `F = 9\\times 10^9 \\times \\frac{(${q1}\\times 10^{-6})(${q2}\\times 10^{-6})}{(${rM})^2} = ${F}\\;\\text{N}`,
          },
        ],
      };
    }

    case '1-5': {
      const q = pick([2, 4, 5, 8, 9, 12]);
      const rCm = pick([10, 20, 30, 60]);
      const rM = rCm / 100;
      const E = Number(((9e9 * q * 1e-9) / (rM * rM)).toPrecision(3));
      return {
        id: `dyn-1-5-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی میدان ذره باردار',
        prompt: `بزرگی میدان الکتریکی حاصل از یک ذره با بار $q = +${q}\\;\\text{nC}$ در فاصله $${rCm}\\;\\text{cm}$ از آن چند نیوتون بر کولن ($\\text{N/C}$) است؟`,
        numericAnswer: E,
        tolerance: 0.03,
        unit: 'N/C',
        hint: 'بار را از نانوکولن ($10^{-9}\\;\\text{C}$) و فاصله را به متر تبدیل کرده و از $E = k\\frac{|q|}{r^2}$ استفاده کنید.',
        solutionSteps: [
          {
            text: 'استفاده از فرمول میدان الکتریکی یک ذره باردار:',
            tex: `E = k\\frac{|q|}{r^2} = (9\\times 10^9)\\frac{${q}\\times 10^{-9}}{(${rM})^2} = ${E}\\;\\text{N/C}`,
          },
        ],
      };
    }

    case '1-7':
    case '1-8': {
      const E = pick([200, 400, 500, 800, 1000, 1500]);
      const dCm = pick([5, 10, 20, 25, 40]);
      const dM = dCm / 100;
      const dV = Number((E * dM).toPrecision(3));
      return {
        id: `dyn-1-8-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی پتانسیل و میدان یکنواخت',
        prompt: `در یک میدان الکتریکی یکنواخت به بزرگی $E = ${E}\\;\\text{N/C}$، دو نقطه A و B در امتداد یک خط میدان به فاصله $${dCm}\\;\\text{cm}$ از یکدیگر قرار دارند. اندازه اختلاف پتانسیل بین دو نقطه ($|\\Delta V|$) چند ولت است؟`,
        numericAnswer: dV,
        tolerance: 0.02,
        unit: 'V',
        hint: 'در میدان یکنواخت داریم $|\\Delta V| = E d$ (فاصله باید برحسب متر باشد).',
        solutionSteps: [
          {
            text: 'تبدیل فاصله به متر و محاسبه اختلاف پتانسیل:',
            tex: `|\\Delta V| = E \\cdot d = (${E}\\;\\text{V/m})(${dM}\\;\\text{m}) = ${dV}\\;\\text{V}`,
          },
        ],
      };
    }

    case '1-10': {
      const C = pick([2, 4, 5, 6, 8, 10, 12]);
      const V = pick([6, 12, 20, 24, 50]);
      const k = pick([2, 3, 4, 5]);
      const connected = pick([true, false]);
      if (connected) {
        const Qnew = C * k * V;
        return {
          id: `dyn-1-10-${stamp}`,
          type: 'numeric',
          difficulty: 'کنکوری',
          source: 'تمرین تصادفی خازن (تیپ بسیار پرتکرار کنکور)',
          prompt: `خازن تختی به ظرفیت $${C}\\;\\mu\\text{F}$ به یک باتری $${V}\\;\\text{V}$ متصل است. در حالی که خازن **همچنان به باتری متصل است**، دی‌الکتریکی با ثابت $\\kappa = ${k}$ بین صفحات قرار می‌دهیم. بار نهایی خازن چند میکروکولن ($\\mu\\text{C}$) می‌شود؟`,
          numericAnswer: Qnew,
          tolerance: 0.02,
          unit: 'µC',
          hint: 'وقتی خازن به باتری متصل است، $V$ ثابت می‌ماند و $C$ برابر $\\kappa C_0$ می‌شود؛ پس $Q = C V$.',
          solutionSteps: [
            { text: 'ظرفیت جدید پس از ورود دی‌الکتریک:', tex: `C' = \\kappa C_0 = ${k} \\times ${C}\\;\\mu\\text{F} = ${C * k}\\;\\mu\\text{F}` },
            { text: 'چون باتری متصل است $V$ ثابت می‌ماند:', tex: `Q' = C' V = (${C * k}\\;\\mu\\text{F})(${V}\\;\\text{V}) = ${Qnew}\\;\\mu\\text{C}` },
          ],
        };
      } else {
        const Vnew = Number((V / k).toPrecision(3));
        return {
          id: `dyn-1-10-${stamp}`,
          type: 'numeric',
          difficulty: 'کنکوری',
          source: 'تمرین تصادفی خازن (جدا از باتری)',
          prompt: `خازنی به ظرفیت $${C}\\;\\mu\\text{F}$ را با ولتاژ $${V}\\;\\text{V}$ پر کرده و سپس **از باتری جدا می‌کنیم**. اکنون دی‌الکتریکی با ثابت $\\kappa = ${k}$ فضای بین صفحات را پر می‌کند. اختلاف پتانسیل جدید دو سر خازن چند ولت می‌شود؟`,
          numericAnswer: Vnew,
          tolerance: 0.03,
          unit: 'V',
          hint: 'پس از جدا کردن از باتری، بار $Q$ ثابت می‌ماند. با $\\kappa$ برابر شدن $C$، ولتاژ تقسیم بر $\\kappa$ می‌شود.',
          solutionSteps: [
            { text: 'چون خازن از مولد جداست، $Q$ ثابت می‌ماند:', tex: `V' = \\frac{Q}{C'} = \\frac{Q}{\\kappa C_0} = \\frac{V}{\\kappa} = \\frac{${V}}{${k}} = ${Vnew}\\;\\text{V}` },
          ],
        };
      }
    }

    case '1-11': {
      const C = pick([10, 20, 40, 50, 100, 200]); // µF
      const V = pick([100, 200, 300, 400]);
      const U = Number((0.5 * C * 1e-6 * V * V).toPrecision(3));
      return {
        id: `dyn-1-11-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی انرژی خازن',
        prompt: `خازنی به ظرفیت $${C}\\;\\mu\\text{F}$ را به اختلاف پتانسیل $${V}\\;\\text{V}$ متصل می‌کنیم. انرژی ذخیره شده در این خازن چند ژول ($\\text{J}$) است؟`,
        numericAnswer: U,
        tolerance: 0.02,
        unit: 'J',
        hint: 'از رابطه $U = \\frac{1}{2}CV^2$ استفاده کنید و $\\mu\\text{F}$ را به $10^{-6}\\;\\text{F}$ تبدیل کنید.',
        solutionSteps: [
          {
            text: 'جایگذاری در رابطه انرژی خازن:',
            tex: `U = \\frac{1}{2}CV^2 = \\frac{1}{2}(${C}\\times 10^{-6})(${V})^2 = ${U}\\;\\text{J}`,
          },
        ],
      };
    }

    case '2-1': {
      const I = pick([0.5, 1.6, 2.0, 3.2, 4.0, 6.4]);
      const t = pick([5, 10, 20, 30, 60]);
      const q = Number((I * t).toPrecision(3));
      return {
        id: `dyn-2-1-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی جریان الکتریکی',
        prompt: `از مقطع یک سیم مسی، جریان ثابت $${I}\\;\\text{A}$ به مدت $${t}\\;\\text{s}$ عبور می‌کند. چه مقدار بار الکتریکی برحسب کولن ($\\text{C}$) از مقطع این سیم گذشته است؟`,
        numericAnswer: q,
        tolerance: 0.02,
        unit: 'C',
        hint: 'از رابطه تعریف جریان $I = \\frac{\\Delta q}{\\Delta t}$ داریم $\\Delta q = I \\Delta t$.',
        solutionSteps: [
          {
            text: 'محاسبه بار عبوری:',
            tex: `\\Delta q = I \\cdot \\Delta t = (${I}\\;\\text{A})(${t}\\;\\text{s}) = ${q}\\;\\text{C}`,
          },
        ],
      };
    }

    case '2-2': {
      const R = pick([4, 5, 6, 8, 10, 12, 15, 20]);
      const I = pick([0.5, 1.2, 1.5, 2, 2.5, 3]);
      const V = Number((R * I).toPrecision(3));
      return {
        id: `dyn-2-2-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی قانون اهم',
        prompt: `به دو سر یک رسانای اهمی به مقاومت $${R}\\;\\Omega$، اختلاف پتانسیل $${V}\\;\\text{V}$ اعمال می‌کنیم. شدت جریان عبوری از آن چند آمپر است؟`,
        numericAnswer: I,
        tolerance: 0.02,
        unit: 'A',
        hint: 'طبق قانون اهم داریم $I = \\frac{V}{R}$.',
        solutionSteps: [
          { text: 'محاسبه جریان:', tex: `I = \\frac{V}{R} = \\frac{${V}\\;\\text{V}}{${R}\\;\\Omega} = ${I}\\;\\text{A}` },
        ],
      };
    }

    case '2-3': {
      const R1 = pick([2, 3, 4, 5, 6, 8]);
      const factor = pick([2, 3, 4]);
      const R2 = R1 * factor * factor;
      const { options, correctIndex } = makeMcqOptions(R2, '\\Omega', [1 / factor, 0.5, 2]);
      return {
        id: `dyn-2-3-${stamp}`,
        type: 'mcq',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی کشیدن سیم (حجم ثابت)',
        prompt: `سیمی به مقاومت $${R1}\\;\\Omega$ را به طور یکنواخت آن‌قدر می‌کشیم تا طول آن $${factor}$ برابر شود (بدون تغییر جرم و چگالی). مقاومت جدید سیم چند اهم می‌شود؟`,
        options,
        correctIndex,
        hint: 'هنگام کشیدن سیم با حجم ثابت ($V=AL$)، اگر طول $n$ برابر شود، سطح مقطع $\\frac{1}{n}$ برابر و مقاومت $n^2$ برابر می‌شود!',
        solutionSteps: [
          { text: 'از ثابت بودن حجم سیم داریم:', tex: `A_1 L_1 = A_2 L_2 \\Rightarrow \\frac{A_1}{A_2} = \\frac{L_2}{L_1} = ${factor}` },
          { text: 'نسبت مقاومت جدید به قدیم:', tex: `\\frac{R_2}{R_1} = \\left(\\frac{L_2}{L_1}\\right)^2 = ${factor}^2 = ${factor * factor} \\Rightarrow R_2 = ${R1} \\times ${factor * factor} = ${R2}\\;\\Omega` },
        ],
      };
    }

    case '2-4': {
      const emf = pick([12, 15, 18, 24, 30]);
      const r = pick([1, 2, 3]);
      const R = pick([3, 4, 5, 7, 9]);
      const I = Number((emf / (R + r)).toPrecision(3));
      const V = Number((emf - I * r).toPrecision(3));
      return {
        id: `dyn-2-4-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی مدار تک‌حلقه و باتری واقعی',
        prompt: `باتری با نیروی محرکه $\\mathcal{E} = ${emf}\\;\\text{V}$ و مقاومت داخلی $r = ${r}\\;\\Omega$ به مقاومت خارجی $R = ${R}\\;\\Omega$ متصل شده است. اختلاف پتانسیل دو سر باتری ($V$) چند ولت است؟`,
        numericAnswer: V,
        tolerance: 0.03,
        unit: 'V',
        hint: 'ابتدا جریان مدار را از $I = \\frac{\\mathcal{E}}{R+r}$ بیابید و سپس از $V = \\mathcal{E} - Ir$ (یا $V = IR$) استفاده کنید.',
        solutionSteps: [
          { text: 'محاسبه جریان کل مدار:', tex: `I = \\frac{\\mathcal{E}}{R+r} = \\frac{${emf}}{${R}+${r}} = ${I}\\;\\text{A}` },
          { text: 'اختلاف پتانسیل دو سر باتری:', tex: `V = \\mathcal{E} - Ir = ${emf} - (${I})(${r}) = ${V}\\;\\text{V}` },
        ],
      };
    }

    case '2-5': {
      const emf = pick([12, 16, 20, 24]);
      const r = pick([1, 2, 4]);
      const R = pick([3, 4, 6, 8]);
      const I = emf / (R + r);
      const Pout = Number((R * I * I).toPrecision(3));
      return {
        id: `dyn-2-5-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی توان خروجی باتری',
        prompt: `باتری با $\\mathcal{E} = ${emf}\\;\\text{V}$ و $r = ${r}\\;\\Omega$ به مقاومت $R = ${R}\\;\\Omega$ وصل است. توان خروجی (مفید) باتری چند وات ($\\text{W}$) است؟`,
        numericAnswer: Pout,
        tolerance: 0.03,
        unit: 'W',
        hint: 'جریان $I = \\frac{\\mathcal{E}}{R+r}$ را حساب کرده و سپس $P_{\\text{خروجی}} = R I^2 = \\mathcal{E}I - rI^2$ را بیابید.',
        solutionSteps: [
          { text: 'جریان مدار:', tex: `I = \\frac{${emf}}{${R}+${r}} = ${Number(I.toFixed(2))}\\;\\text{A}` },
          { text: 'توان خروجی (مصرفی در مقاومت خارجی):', tex: `P_{\\text{خروجی}} = R I^2 = ${R} \\times (${Number(I.toFixed(2))})^2 = ${Pout}\\;\\text{W}` },
        ],
      };
    }

    case '2-6': {
      const pairs = [
        [3, 6],
        [4, 12],
        [6, 12],
        [10, 15],
        [6, 3],
        [20, 30],
      ];
      const [R2, R3] = pick(pairs);
      const R1 = pick([2, 3, 4, 5]);
      const Rp = (R2 * R3) / (R2 + R3);
      const Req = Number((R1 + Rp).toPrecision(3));
      return {
        id: `dyn-2-6-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی ترکیب مقاومت‌ها',
        prompt: `مقاومت $R_1 = ${R1}\\;\\Omega$ به طور متوالی با ترکیب موازی دو مقاومت $R_2 = ${R2}\\;\\Omega$ و $R_3 = ${R3}\\;\\Omega$ بسته شده است. مقاومت معادل کل چند اهم ($\\Omega$) است؟`,
        numericAnswer: Req,
        tolerance: 0.02,
        unit: 'Ω',
        hint: 'ابتدا معادل موازی $R_{23} = \\frac{R_2 R_3}{R_2 + R_3}$ را حساب کرده، سپس با $R_1$ جمع کنید.',
        solutionSteps: [
          { text: 'معادل شاخه موازی:', tex: `R_{23} = \\frac{R_2 R_3}{R_2 + R_3} = \\frac{${R2}\\times ${R3}}{${R2}+${R3}} = ${Rp}\\;\\Omega` },
          { text: 'معادل کل (متوالی با $R_1$):', tex: `R_{\\text{eq}} = R_1 + R_{23} = ${R1} + ${Rp} = ${Req}\\;\\Omega` },
        ],
      };
    }

    case '3-3': {
      const q = pick([2, 4, 5, 8]); // µC
      const v = pick([100, 200, 500, 1000]); // m/s
      const B = pick([0.2, 0.4, 0.5, 0.8, 1.0]);
      const angle = pick([30, 90]);
      const sinV = angle === 30 ? 0.5 : 1;
      const FmN = Number((q * 1e-6 * v * B * sinV * 1000).toPrecision(3)); // in mN
      return {
        id: `dyn-3-3-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی نیروی مغناطیسی ذره',
        prompt: `ذره‌ای با بار $q = +${q}\\;\\mu\\text{C}$ با تندی $v = ${v}\\;\\text{m/s}$ تحت زاویه $${angle}^\\circ$ وارد میدان مغناطیسی یکنواخت $B = ${B}\\;\\text{T}$ می‌شود. اندازه نیروی مغناطیسی وارد بر آن چند **میلی‌نیوتون** ($\\text{mN}$) است؟`,
        numericAnswer: FmN,
        tolerance: 0.03,
        unit: 'mN',
        hint: 'از رابطه $F = |q|vB\\sin\\theta$ استفاده کنید و حاصل را برحسب میلی‌نیوتون ($10^{-3}\\;\\text{N}$) بنویسید.',
        solutionSteps: [
          {
            text: 'جایگذاری در فرمول نیروی مغناطیسی:',
            tex: `F = |q|vB\\sin${angle}^\\circ = (${q}\\times 10^{-6})(${v})(${B})(${sinV}) = ${FmN}\\times 10^{-3}\\;\\text{N} = ${FmN}\\;\\text{mN}`,
          },
        ],
      };
    }

    case '3-4': {
      const I = pick([2, 4, 5, 6, 8]);
      const lCm = pick([20, 40, 50, 80, 100]);
      const B = pick([0.2, 0.25, 0.4, 0.5]);
      const angle = pick([30, 90]);
      const sinV = angle === 30 ? 0.5 : 1;
      const F = Number((I * (lCm / 100) * B * sinV).toPrecision(3));
      return {
        id: `dyn-3-4-${stamp}`,
        type: 'numeric',
        difficulty: 'تمرین کتاب',
        source: 'تمرین تصادفی نیروی وارد بر سیم حامل جریان',
        prompt: `از سیم راستی به طول $${lCm}\\;\\text{cm}$ جریان $${I}\\;\\text{A}$ عبور می‌کند. این سیم در میدان مغناطیسی یکنواخت $${B}\\;\\text{T}$ تحت زاویه $${angle}^\\circ$ قرار دارد. بزرگی نیروی مغناطیسی وارد بر سیم چند نیوتون است؟`,
        numericAnswer: F,
        tolerance: 0.03,
        unit: 'N',
        hint: 'طول را به متر تبدیل کرده و در $F = I l B \\sin\\theta$ قرار دهید.',
        solutionSteps: [
          {
            text: 'محاسبه نیرو:',
            tex: `F = I l B \\sin${angle}^\\circ = (${I})(${lCm / 100})(${B})(${sinV}) = ${F}\\;\\text{N}`,
          },
        ],
      };
    }

    case '3-5': {
      const N = pick([400, 500, 600, 800, 1000]);
      const lCm = pick([20, 25, 40, 50]);
      const I = pick([1, 2, 2.5, 4, 5]);
      // using pi ≈ 3 for clean konkoor calculation
      const BmT = Number(((4 * 3 * 1e-7 * N * I) / (lCm / 100) * 1000).toPrecision(3));
      return {
        id: `dyn-3-5-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی سیملوله آرمانی ($\\pi \\approx 3$)',
        prompt: `سیملوله آرمانی به طول $${lCm}\\;\\text{cm}$ دارای $${N}$ دور سیم است و جریان $${I}\\;\\text{A}$ از آن می‌گذرد. بزرگی میدان مغناطیسی درون آن چند **میلی‌تسلا** ($\\text{mT}$) است؟ ($\\mu_0 = 4\\pi \\times 10^{-7}\\;\\text{T}\\cdot\\text{m/A}$ و $\\pi \\approx 3$)`,
        numericAnswer: BmT,
        tolerance: 0.06,
        unit: 'mT',
        hint: 'از رابطه $B = \\frac{\\mu_0 N I}{l}$ با $l$ برحسب متر استفاده کنید.',
        solutionSteps: [
          {
            text: 'جایگذاری در فرمول سیملوله آرمانی:',
            tex: `B = \\frac{\\mu_0 N I}{l} = \\frac{(12\\times 10^{-7})(${N})(${I})}{${lCm / 100}} = ${BmT}\\;\\text{mT}`,
          },
        ],
      };
    }

    case '3-8': {
      const N = pick([50, 100, 200, 400]);
      const Acm2 = pick([20, 40, 50, 100]);
      const dB = pick([0.1, 0.2, 0.4, 0.5]);
      const dt = pick([0.05, 0.1, 0.2, 0.4]);
      const emf = Number(((N * (Acm2 * 1e-4) * dB) / dt).toPrecision(3));
      return {
        id: `dyn-3-8-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی قانون فاراده',
        prompt: `میدان مغناطیسی عمود بر سطح پیچه‌ای شامل $${N}$ حلقه به مساحت هر حلقه $${Acm2}\\;\\text{cm}^2$، در مدت $${dt}\\;\\text{s}$ به اندازه $${dB}\\;\\text{T}$ افزایش می‌یابد. بزرگی نیروی محرکه القایی متوسط در پیچه چند ولت است؟`,
        numericAnswer: emf,
        tolerance: 0.03,
        unit: 'V',
        hint: 'توجه کنید $1\\;\\text{cm}^2 = 10^{-4}\\;\\text{m}^2$. سپس از $|\\mathcal{E}_{\\text{av}}| = N\\frac{A|\\Delta B|}{\\Delta t}$ استفاده کنید.',
        solutionSteps: [
          { text: 'تغییر شار هر حلقه:', tex: `\\Delta \\Phi = A\\,\\Delta B = (${Acm2}\\times 10^{-4})(${dB}) = ${Number((Acm2 * 1e-4 * dB).toPrecision(3))}\\;\\text{Wb}` },
          { text: 'نیروی محرکه القایی متوسط:', tex: `|\\mathcal{E}_{\\text{av}}| = N\\frac{|\\Delta \\Phi|}{\\Delta t} = ${N}\\times \\frac{${Number((Acm2 * 1e-4 * dB).toPrecision(3))}}{${dt}} = ${emf}\\;\\text{V}` },
        ],
      };
    }

    case '3-10': {
      const LmH = pick([20, 40, 50, 100, 200, 500]);
      const I = pick([2, 4, 5, 6, 10]);
      const U = Number((0.5 * (LmH * 1e-3) * I * I).toPrecision(3));
      return {
        id: `dyn-3-10-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی انرژی القاگر',
        prompt: `از القاگری با ضریب القاوری $L = ${LmH}\\;\\text{mH}$ جریان ثابت $I = ${I}\\;\\text{A}$ می‌گذرد. انرژی ذخیره شده در میدان مغناطیسی آن چند ژول ($\\text{J}$) است؟`,
        numericAnswer: U,
        tolerance: 0.02,
        unit: 'J',
        hint: 'میلی‌هانری را به هانری ($10^{-3}\\;\\text{H}$) تبدیل کرده و از $U = \\frac{1}{2}LI^2$ استفاده کنید.',
        solutionSteps: [
          {
            text: 'محاسبه انرژی مغناطیسی القاگر:',
            tex: `U = \\frac{1}{2}LI^2 = \\frac{1}{2}(${LmH}\\times 10^{-3})(${I})^2 = ${U}\\;\\text{J}`,
          },
        ],
      };
    }

    case '3-11': {
      const f = pick([25, 50, 100, 125]);
      const Tms = Number((1000 / f).toPrecision(3));
      const Im = pick([2, 4, 5, 8, 10]);
      return {
        id: `dyn-3-11-${stamp}`,
        type: 'numeric',
        difficulty: 'کنکوری',
        source: 'تمرین تصادفی جریان متناوب',
        prompt: `معادله جریان یک مولد جریان متناوب در SI به صورت $I = ${Im}\\sin(${2 * f}\\pi t)$ است. دوره تناوب ($T$) این جریان چند **میلی‌ثانیه** ($\\text{ms}$) است؟`,
        numericAnswer: Tms,
        tolerance: 0.02,
        unit: 'ms',
        hint: 'با مقایسه با $I = I_m \\sin(\\frac{2\\pi}{T}t)$ داریم $\\frac{2\\pi}{T} = ${2 * f}\\pi$.',
        solutionSteps: [
          { text: 'مقایسه ضریب $t$:', tex: `\\frac{2\\pi}{T} = ${2 * f}\\pi \\Rightarrow T = \\frac{1}{${f}}\\;\\text{s} = ${Tms}\\;\\text{ms}` },
        ],
      };
    }

    default:
      return null;
  }
}
