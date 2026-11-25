import { ChapterMeta, SubsectionData } from '../types/physics';
import { chapter1Subsections } from './chapter1';
import { chapter2Subsections } from './chapter2';
import { chapter3Subsections } from './chapter3';

export const chaptersMeta: ChapterMeta[] = [
  {
    id: 1,
    numberFa: '۱',
    title: 'الکتریسیتۀ ساکن',
    subtitle: 'از بار الکتریکی و قانون کولن تا میدان، پتانسیل و خازن',
    bookPages: 'صفحه ۱ تا ۳۸',
    konkoorShare: 'حدود ۳ تا ۴ تست کنکور',
    accent: 'cyan',
    description:
      'پایه و اساس الکتریسیته: برهم‌کنش بارها، قانون کولن و برآیند نیروها، میدان الکتریکی و خطوط آن، انرژی پتانسیل و اختلاف پتانسیل، توزیع بار روی رساناها و تحلیل خازن تخت.',
  },
  {
    id: 2,
    numberFa: '۲',
    title: 'جریان الکتریکی و مدارهای جریان مستقیم',
    subtitle: 'قانون اهم، مقاومت و کشیدن سیم، باتری واقعی، توان و ترکیب مقاومت‌ها',
    bookPages: 'صفحه ۳۹ تا ۶۴',
    konkoorShare: 'حدود ۳ تا ۴ تست کنکور',
    accent: 'emerald',
    description:
      'قلب تحلیل مدار در فیزیک یازدهم: رفتار رسانای اهمی و غیراهمی، تغییر ابعاد و دمای سیم، نیروی محرکه و مقاومت داخلی، توان خروجی و بازده، و تحلیل مدارهای متوالی، موازی و ترکیبی.',
  },
  {
    id: 3,
    numberFa: '۳',
    title: 'مغناطیس و القای الکترومغناطیسی',
    subtitle: 'میدان و نیروی مغناطیسی، سیملوله، قانون فاراده، لنز، القاگر و جریان متناوب',
    bookPages: 'صفحه ۶۵ تا ۱۰۴',
    konkoorShare: 'حدود ۳ تا ۴ تست کنکور',
    accent: 'violet',
    description:
      'پیوند الکتریسیته و مغناطیس: قاعده دست راست برای ذره و سیم، میدان مغناطیسی جریان و سیملوله آرمانی، مواد مغناطیسی، شار مغناطیسی، قانون فاراده و لنز، انرژی القاگر و موج سینوسی جریان متناوب.',
  },
];

export const allSubsections: SubsectionData[] = [
  ...chapter1Subsections,
  ...chapter2Subsections,
  ...chapter3Subsections,
];
