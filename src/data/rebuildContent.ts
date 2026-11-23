export type Lang = 'en' | 'ar';
export type ExperienceId = 'fertical' | 'cveeez' | 'xfuse' | 'careercv';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillGroupId = 'soft' | 'hard' | 'technical' | 'tools';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface AchievementItem {
  badge: string;
  caption: BilingualText;
}

export interface ExperienceStationData {
  id: ExperienceId;
  color: string;
  softColor: string;
  logoSrc?: string;
  darkLogoBg?: boolean;
  dates: BilingualText;
  /** Job title stays ALWAYS in English even in Arabic mode */
  role: string;
  company: BilingualText;
  companySubtitle?: BilingualText;
  headline: BilingualText;
  stat?: string;
  statLabel?: BilingualText;
  achievements: AchievementItem[];
  tabs?: {
    lead: AchievementItem[];
    sell: AchievementItem[];
  };
  extraChips?: BilingualText[];
  challenge: BilingualText;
  whatIDid: BilingualText;
  result?: BilingualText;
  bridgeBefore?: BilingualText;
}

export interface SkillEntryItem {
  id: string;
  label: BilingualText;
  level: SkillLevel;
  source: ExperienceId | 'course' | 'every';
  sourceLabel?: BilingualText;
}

export interface SkillGroupData {
  id: SkillGroupId;
  title: BilingualText;
  color: string;
  softColor: string;
  skills: SkillEntryItem[];
}

export interface LanguageItem {
  id: string;
  name: BilingualText;
  levelLabel: BilingualText;
  dots: number; // out of 5, never percentages
  color: string;
}

export interface CourseBookItem {
  id: string;
  spineColor: string;
  /** All course titles stay ALWAYS in English */
  title: string;
  provider?: BilingualText;
  year?: string;
  note?: BilingualText;
}

export const SKILL_LEVEL_LABELS: Record<SkillLevel, BilingualText> = {
  Beginner: { en: 'Beginner', ar: 'مبتدئ' },
  Intermediate: { en: 'Intermediate', ar: 'متوسط' },
  Advanced: { en: 'Advanced', ar: 'متقدم' },
};

export const EXPERIENCE_COLORS: Record<ExperienceId | 'course' | 'every', { hex: string; soft: string; label: BilingualText }> = {
  fertical: {
    hex: '#A68BC8',
    soft: '#E4D8F0',
    label: { en: 'From FERTICAL', ar: 'من FERTICAL' },
  },
  cveeez: {
    hex: '#E7907A',
    soft: '#F7DCD4',
    label: { en: 'From CVeeeZ', ar: 'من CVeeeZ' },
  },
  xfuse: {
    hex: '#9DB5A0',
    soft: '#DCE7DD',
    label: { en: 'From X-FUSE', ar: 'من X-FUSE' },
  },
  careercv: {
    hex: '#E3B26E',
    soft: '#F6E6CB',
    label: { en: 'From Career CV', ar: 'من Career CV' },
  },
  course: {
    hex: '#A68BC8',
    soft: '#E4D8F0',
    label: { en: 'From courses', ar: 'من الكورسات' },
  },
  every: {
    hex: '#EDA89B',
    soft: '#F9E1DC',
    label: { en: 'Across all roles', ar: 'من كل تجربة' },
  },
};

export const PORTFOLIO_COPY = {
  brand: {
    en: 'Esraa El Labban',
    ar: 'إسراء اللبان',
  },
  nav: [
    { id: 'scene-journey', label: { en: 'Journey', ar: 'رحلتي' } },
    { id: 'scene-experiences', label: { en: 'Experiences', ar: 'خبراتي' } },
    { id: 'scene-skills', label: { en: 'Skills', ar: 'مهاراتي' } },
    { id: 'scene-learning', label: { en: 'Courses', ar: 'كورساتي' } },
    { id: 'scene-connect', label: { en: 'Connect', ar: 'نتكلم' } },
  ],
  controls: {
    soundOn: { en: 'Sound On', ar: 'الصوت شغال' },
    soundOff: { en: 'Sound Off', ar: 'الصوت مقفول' },
    nightMode: { en: 'Night mode', ar: 'وضع الليل' },
    lightMode: { en: 'Light mode', ar: 'وضع النهار' },
  },
  gate: {
    line1: { en: 'It’s a bit dark in here.', ar: 'المكان ضلمة شوية..' },
    line2: { en: 'Mind pulling that lantern?', ar: 'ممكن تشد الفانوس ده؟' },
    button: { en: 'Pull lantern', ar: 'شد الفانوس' },
    tooltip: { en: 'Pull or tap the lantern cord', ar: 'شد أو دوس على حبل الفانوس' },
    skip: { en: 'Skip', ar: 'عدّي' },
  },
  hero: {
    en: {
      line1: 'Hello! I’m Esraa El Labban',
      line2: 'This is my portfolio.',
      line3Before: 'It’s full of ',
      line3Curiosity: 'curiosity',
      line3Mid: ', and full of ',
      line3Steps: 'steps',
      line3After: ' I’ve actually taken.',
    },
    ar: {
      line1: 'هاااللو! أنا إسراء اللبان',
      line2: 'ده البورتفوليو بتاعي.',
      line3Before: 'مليان ',
      line3Curiosity: 'فضول',
      line3Mid: '، ومليان ',
      line3Steps: 'خطوات',
      line3After: ' قدرت أحققها.',
    },
  },
  journey: {
    lead: {
      en: 'My journey always started with...',
      ar: 'رحلتي دايمًا كانت بتبدأ بـ...',
    },
    lines: [
      {
        id: 1,
        num: { en: '1.', ar: '١.' },
        highlight: { en: 'Curious questions', ar: 'أسئلة فضولية كتير' },
        rest: { en: ' that won’t leave me alone', ar: ' مش بتسيبني في حالي' },
        imgSrc: '/assets/aistudio/curious_mind_74a48458.webp',
      },
      {
        id: 2,
        num: { en: '2.', ar: '٢.' },
        highlight: { en: 'Wide research', ar: 'ريسيرش واسع' },
        rest: { en: ' to dig out answers and solutions', ar: ' علشان أدور على الأجوبة والحلول' },
        imgSrc: '/assets/aistudio/from_insight_to_product_8fa218bd.webp',
      },
      {
        id: 3,
        num: { en: '3.', ar: '٣.' },
        highlight: { en: 'Critical thinking', ar: 'تفكير نقدي مستمر..' },
        rest: { en: ' that makes me doubt even my first answer', ar: ' بيخليني أشك حتى في أول إجابة بوصل لها' },
        imgSrc: '/assets/aistudio/things_i_bulid_25d9218e.webp',
      },
    ],
    closingBefore: { en: 'And a few ', ar: 'وشوية ' },
    closingWord: { en: 'scribbles', ar: 'شخبطة' },
    closingAfter: { en: ' along the way.', ar: ' في الطريق.' },
    ctaPrefix: { en: 'This is where it started:', ar: 'من هنا بدأت:' },
    ctaCompany: 'FERTICAL',
  },
  experiences: {
    openFile: { en: 'Open the file', ar: 'افتح الملف' },
    closeLabel: { en: 'Close', ar: 'اقفل' },
    tabLead: { en: 'Lead', ar: 'Lead' },
    tabSell: { en: 'Sell', ar: 'Sell' },
    blocks: {
      challenge: { en: 'Challenge', ar: 'التحدي' },
      whatIDid: { en: 'What I did', ar: 'اللي عملته' },
      result: { en: 'Result', ar: 'النتيجة' },
    },
    pocketLabel: 'skills pocket',
    cveeezStage: {
      replay: { en: 'Replay', ar: 'عيد تاني' },
      captionChaos: {
        en: 'Accounts frozen. Clients waiting for months.',
        ar: 'حسابات متوقفة. وعملاء مستنيين بالشهور.',
      },
      captionAsk: {
        en: 'I could fix them one by one. Or ask why.',
        ar: 'كان ممكن أصلّحهم واحد واحد. أو أسأل ليه.',
      },
      captionOrder: {
        en: 'So I rebuilt the workflow.',
        ar: 'فبنيت الـ workflow من الأول.',
      },
      clockSuffix: { en: 'hrs / day', ar: 'ساعات / يوم' },
      stampsChaos: [
        { en: 'Frozen', ar: 'متوقف' },
        { en: 'Closed', ar: 'مقفول' },
        { en: 'Waiting 3 months', ar: 'مستني شهور' },
        { en: 'Frozen', ar: 'متوقف' },
        { en: 'Waiting 3 months', ar: 'مستني شهور' },
        { en: 'Closed', ar: 'مقفول' },
      ],
      stampActive: { en: 'Active', ar: 'شغال' },
    },
  },
  skillsSlide: {
    assemblyLabel: 'my skills',
    titleBefore: { en: 'Skills I ', ar: 'المهارات اللي ' },
    titleAccent: { en: 'built', ar: 'بنيتها' },
    titleAfter: { en: ' along the way', ar: ' في الطريق' },
    subtitle: {
      en: 'Grouped across Soft, Hard, Technical & Tools — each with its level.',
      ar: 'متقسمة بين Soft و Hard و Technical و Tools — وكل مهارة بمستواها.',
    },
  },
  languages: {
    titleBefore: { en: 'And the ', ar: 'واللغات اللي ' },
    titleAccent: { en: 'languages', ar: 'بتكلمها' },
    titleAfter: { en: ' I work in', ar: ' في شغلي' },
  },
  learning: {
    coursesTitleBefore: { en: 'What I studied along the way... ', ar: 'اللي اتعلمته في الطريق... ' },
    coursesTitleAccent: { en: 'my courses', ar: 'كورساتي' },
  },
  projectsTeaser: {
    titleBefore: { en: 'Projects: ', ar: 'المشاريع: ' },
    titleAccent: { en: 'being updated', ar: 'بتتحدث دلوقتي' },
    line: {
      en: 'Still adding the things I built. Check back soon.',
      ar: 'لسه بضيف الحاجات اللي بنيتها. ارجع بص تاني قريب.',
    },
  },
  connect: {
    eyebrow: { en: 'Closing Horizon', ar: 'الخطوة الجاية' },
    titleBefore: { en: 'So, ', ar: 'طب و' },
    titleAccent: { en: 'what’s next?', ar: 'إيه الجاي؟' },
    titleAfter: { en: ' Honestly, I’d love to know.', ar: ' بصراحة.. نفسي أعرف.' },
    body: {
      en: 'I’m looking for a place as a Product Manager or Account Manager where I can mix research, problem-solving, and understanding people. Open for onsite or remote position. If that sounds like what you need, let’s talk.',
      ar: 'بدور على مكان كـ Product Manager أو Account Manager أجمع فيه بين البحث، وحل المشاكل، وفهم الناس. متاحة لشغل onsite أو remote. لو ده اللي محتاجه، يلا نتكلم.',
    },
    button: {
      en: 'Got something interesting in mind? Say hello',
      ar: 'عندك فكرة أو شغل حلو؟ ابعتلي',
    },
    email: 'israaellban@gmail.com',
    phone: '+201554488665',
    copyEmail: { en: 'Copy Email', ar: 'انسخ الإيميل' },
    copied: { en: 'Copied', ar: 'اتنسخ' },
    copyLabel: { en: 'Copy', ar: 'نسخ' },
    directEmailLabel: { en: 'DIRECT EMAIL', ar: 'الإيميل المباشر' },
    phoneLabel: { en: 'PHONE', ar: 'الموبايل' },
    focusAreasLabel: { en: 'FOCUS AREAS', ar: 'مجالات شغلي' },
    focusAreasValue: {
      en: 'Product Manager · Account Manager · Business Development · Operations',
      ar: 'Product Manager · Account Manager · Business Development · Operations',
    },
    availabilityLabel: { en: 'BASED IN', ar: 'المكان والشغل' },
    availabilityValue: {
      en: 'Egypt · Open for onsite or remote position',
      ar: 'مصر · متاحة لشغل onsite أو remote',
    },
    backToTop: { en: 'Back to Top', ar: 'ارجع فوق' },
    footer: {
      en: 'Made with curiosity, a little stubbornness, and lots of coffee.',
      ar: 'اتعمل بفضول، وشوية عند، وقهوة كتير.',
    },
  },
} as const;

export const EXPERIENCE_STATIONS: ExperienceStationData[] = [
  {
    id: 'fertical',
    color: '#A68BC8',
    softColor: '#E4D8F0',
    logoSrc: '/assets/aistudio/Fertoical_logo_e5c793d4.jpg',
    dates: { en: 'Jan 2023 – May 2025', ar: 'يناير ٢٠٢٣ – مايو ٢٠٢٥' },
    role: 'Co-Founder | Business Development & Product Operations',
    company: { en: 'FERTICAL', ar: 'FERTICAL' },
    companySubtitle: {
      en: 'Agricultural biotechnology startup',
      ar: 'ستارت أب في التكنولوجيا الحيوية الزراعية',
    },
    headline: {
      en: 'The product was safe. Nobody wanted to buy it.',
      ar: 'المنتج كان آمن.. بس محدش عايز يشتريه.',
    },
    stat: '1,000+',
    statLabel: { en: 'units in 3 months', ar: 'منتج في ٣ شهور' },
    achievements: [
      {
        badge: '1,000+',
        caption: {
          en: 'Sold 1,000+ units in 3 months once we adapted the product to real farm feedback',
          ar: 'بعنا أكتر من ١٠٠٠ منتج في ٣ شهور بعد ما عدلنا المنتج على كلام المزارعين',
        },
      },
      {
        badge: '+80%',
        caption: {
          en: 'Grew sales nearly 80% with stronger repeat B2B orders',
          ar: 'المبيعات زادت حوالي ٨٠٪ والعملاء الدايمين كتروا',
        },
      },
      {
        badge: '€4,000',
        caption: {
          en: 'Raised €4,000 for the startup through incubators and events',
          ar: 'جمعت ٤٠٠٠ يورو تمويل للشركة من حاضنات الأعمال والفعاليات',
        },
      },
    ],
    extraChips: [
      { en: '+80% sales', ar: '+٨٠٪ مبيعات' },
      { en: '€4,000 raised', ar: '٤٠٠٠ يورو تمويل' },
    ],
    challenge: {
      en: 'Pests were resisting chemical pesticides in Egypt and Africa. I started with a biological answer, but farmers weren’t adopting it.',
      ar: 'الحشرات بقت تقاوم المبيدات الكيماوية في مصر وأفريقيا. بدأت بحل بيولوجي، بس المزارعين مكانوش مقتنعين بيه.',
    },
    whatIDid: {
      en: 'I went back to customer discovery: what held farmers back and what they expected. I built B2B relationships with agricultural professionals and farm owners, improved the product from field-trial feedback, and coordinated R&D, production, quality, sales and marketing.',
      ar: 'نزلت أسأل المزارعين إيه اللي مخوفهم ومستنيين إيه. بنيت علاقات B2B مع أصحاب المزارع والمتخصصين، وحسنت المنتج من تجارب الحقل، ونسقت بين الـ R&D والإنتاج والجودة والمبيعات والتسويق.',
    },
    result: {
      en: 'In 3 months we sold 1,000+ products and sales grew almost 80%, with more repeat customers. Through incubators and business events, I helped raise €4,000 for the company.',
      ar: 'في ٣ شهور بعنا +١٠٠٠ منتج والمبيعات زادت حوالي ٨٠٪. وكمان جمعت ٤٠٠٠ يورو للشركة من حاضنات الأعمال والفعاليات.',
    },
  },
  {
    id: 'cveeez',
    color: '#E7907A',
    softColor: '#F7DCD4',
    logoSrc: '/assets/aistudio/cveeez_logo_e5423e19.jpg',
    dates: { en: 'Sep 2024 – Nov 2025', ar: 'سبتمبر ٢٠٢٤ – نوفمبر ٢٠٢٥' },
    role: 'LinkedIn Personal Branding Specialist',
    company: { en: 'CVeeeZ', ar: 'CVeeeZ' },
    headline: {
      en: 'Accounts frozen. Clients waiting. Why does this keep happening?',
      ar: 'حسابات متوقفة، وعملاء مستنيين.. ليه ده بيحصل أصلًا؟',
    },
    stat: '1,000+',
    statLabel: { en: 'LinkedIn profiles', ar: 'بروفايل LinkedIn' },
    achievements: [
      {
        badge: '1,000+',
        caption: {
          en: 'Delivered 1,000+ LinkedIn personal branding profiles tailored to each industry',
          ar: 'اشتغلت على أكتر من ١٠٠٠ بروفايل LinkedIn متفصل على كل مجال',
        },
      },
      {
        badge: '4 hrs/day',
        caption: {
          en: 'Rebuilt the entire workflow from months of delays down to 4 hours a day',
          ar: 'بنيت الـ workflow من الأول فالشغل بقى يخلص في ٤ ساعات في اليوم بدل شهور',
        },
      },
      {
        badge: '2 startups',
        caption: {
          en: 'Supported the director in developing two startup initiatives in software & marketing',
          ar: 'ساعدت المدير في تطوير فكرتين ستارت أب في البرمجيات والتسويق',
        },
      },
    ],
    challenge: {
      en: 'Accounts were frozen or closed, and clients waited for months.',
      ar: 'حسابات متوقفة ومقفولة، وعملاء مستنيين بالشهور.',
    },
    whatIDid: {
      en: 'Instead of fixing accounts one by one, I rebuilt the workflow. I gathered each client’s goals and feedback, turned them into profile improvements, managed revisions, and adapted my advice to different industries and career goals.',
      ar: 'بدل ما أصلح كل حساب لوحده، بنيت النظام من الأول. كنت بسمع أهداف كل عميل وأحوّلها لتحسينات في البروفايل، وأتابع التعديلات، وأظبط نصايحي حسب مجاله.',
    },
    result: {
      en: 'What used to take months of delays now fits into 4 hours a day for every client, across 1,000+ profiles. I started in sales and moderation, then moved into personal branding after strong performance, and later supported the director in developing two startup initiatives in software solutions and marketing.',
      ar: 'اللي كان بيتأخر شهور بقى يخلص في ٤ ساعات يوميًا على أكتر من ١٠٠٠ بروفايل. بدأت في المبيعات والمودريشن وبعدها اتنقلت للـ Personal Branding وساعدت في تطوير فكرتين ستارت أب.',
    },
    bridgeBefore: {
      en: 'In parallel, I took the same curiosity into a company: CVeeeZ.',
      ar: 'في نفس الوقت، خدت نفس الفضول ودخلت شركة CVeeeZ.',
    },
  },
  {
    id: 'xfuse',
    color: '#9DB5A0',
    softColor: '#DCE7DD',
    logoSrc: '/assets/aistudio/X-Fuse_b9307951.jpg',
    darkLogoBg: true,
    dates: { en: 'Apr 2025 – Dec 2025', ar: 'أبريل ٢٠٢٥ – ديسمبر ٢٠٢٥' },
    role: 'Team Leader | Sales & Marketing Executive',
    company: { en: 'X-FUSE', ar: 'X-FUSE' },
    headline: {
      en: 'Month one was a failure. Month three hit 120%.',
      ar: 'أول شهر كان فشل.. والشهر التالت وصلت ١٢٠٪.',
    },
    stat: '120%',
    statLabel: { en: 'of sales target', ar: 'من تارجت المبيعات' },
    achievements: [
      {
        badge: '12–15',
        caption: {
          en: 'Led a cross-functional team of 12–15 across marketing, content, design & web',
          ar: 'قدت تيم من ١٢–١٥ فرد بين تسويق ومحتوى وتصميم وويب',
        },
      },
      {
        badge: 'ClickUp',
        caption: {
          en: 'Built a ClickUp delivery board tracking review, edits, done & ready stages',
          ar: 'عملت بورد ClickUp يتابع الشغل من المراجعة والتعديلات لحد النشر',
        },
      },
      {
        badge: '120%',
        caption: {
          en: 'Turned month 1 miss into 70% in month 2 and 120% of target in month 3',
          ar: 'بعد فشل أول شهر وصلت ٧٠٪ في التاني و١٢٠٪ من التارجت في التالت',
        },
      },
    ],
    tabs: {
      lead: [
        {
          badge: '12–15',
          caption: {
            en: 'Led a 12–15 member team across marketing, content, design & web',
            ar: 'قدت تيم من ١٢–١٥ فرد بين تسويق ومحتوى وتصميم وويب',
          },
        },
        {
          badge: 'ClickUp',
          caption: {
            en: 'Set up ClickUp board so everyone sees what is in review, edits, done & ready',
            ar: 'عملت بورد ClickUp للتيم كله يشوف كل حاجة تحت المراجعة أو جاهزة للنشر',
          },
        },
        {
          badge: 'KPIs',
          caption: {
            en: 'Defined every role, trained the team as I learned & tracked delivery quality',
            ar: 'حددت دور كل واحد ودرّبت التيم وتابعت الـ KPIs وجودة التسليم',
          },
        },
      ],
      sell: [
        {
          badge: '120%',
          caption: {
            en: 'Grew from a month 1 miss to 70% in month 2 and 120% of sales target in month 3',
            ar: 'وصلت لـ ١٢٠٪ من التارجت في الشهر التالت بعد ٧٠٪ في التاني وفشل الأول',
          },
        },
        {
          badge: 'Closed',
          caption: {
            en: 'Led discovery calls, presentations, objection handling, negotiation & follow-up',
            ar: 'قدت مكالمات الاكتشاف والعروض والرد على الاعتراضات والتفاوض والمتابعة',
          },
        },
        {
          badge: 'Positioned',
          caption: {
            en: 'Refined how we positioned our services to match what clients actually bought',
            ar: 'طورت طريقة عرض خدماتنا علشان تناسب اللي العميل محتاجه فعلاً',
          },
        },
      ],
    },
    extraChips: [{ en: 'Team of 12–15', ar: 'تيم ١٢–١٥ فرد' }],
    challenge: {
      en: 'A field I barely knew, a team of 12–15 across marketing, content, design and web, and a first month that missed the target.',
      ar: 'مجال مكنتش أعرفه، وتيم من ١٢–١٥ شخص بين تسويق ومحتوى وتصميم وويب، وأول شهر موصلتش فيه للتارجت.',
    },
    whatIDid: {
      en: 'I learned step by step and taught the team as I learned, defined every role, tracked KPIs, and ran training and delivery quality. In sales I led discovery calls, presentations, objection handling, negotiation and follow-up, and improved how our services were positioned. I also set up a ClickUp board so everyone could see what was in review, in edits, done, or ready to publish.',
      ar: 'اتعلمت خطوة بخطوة وعلمت التيم معايا، وحددت دور كل فرد وتابعت الـ KPIs والتدريب وجودة التسليم. وفي المبيعات مسكت مكالمات الاكتشاف والعروض والتفاوض والمتابعة، وعملت بورد ClickUp ينظم الشغل كله.',
    },
    result: {
      en: 'Month 1: a failure. Month 2: 70% of target. Month 3: 120%.',
      ar: 'الشهر الأول: فشل. الشهر التاني: ٧٠٪ من التارجت. الشهر التالت: ١٢٠٪.',
    },
    bridgeBefore: {
      en: 'From my success at CVeeeZ, a new partnership began for a startup called X-FUSE.',
      ar: 'ومن نجاحي في CVeeeZ، ابتدت شراكة جديدة لستارت أب اسمها X-FUSE.',
    },
  },
  {
    id: 'careercv',
    color: '#E3B26E',
    softColor: '#F6E6CB',
    logoSrc: '/assets/aistudio/Cereer_Cv_1ecf1176.jpg',
    dates: { en: 'Nov 2025 – Mar 2026', ar: 'نوفمبر ٢٠٢٥ – مارس ٢٠٢٦' },
    role: 'Sales Specialist',
    company: { en: 'Career CV', ar: 'Career CV' },
    headline: {
      en: 'The right service for the right person.',
      ar: 'الخدمة الصح للشخص الصح.',
    },
    stat: '+25%',
    statLabel: { en: 'above team level', ar: 'زيادة فوق مستوى التيم' },
    achievements: [
      {
        badge: '+25%',
        caption: {
          en: '+25% sales for the marketing team above their usual level',
          ar: '+25% sales for the marketing team above their usual level',
        },
      },
      {
        badge: 'Rewrote',
        caption: {
          en: 'Rewrote the client tone of voice',
          ar: 'Rewrote the client tone of voice',
        },
      },
      {
        badge: 'Tailored',
        caption: {
          en: 'Customized every plan to the client in front of me',
          ar: 'Customized every plan to the client in front of me',
        },
      },
    ],
    challenge: {
      en: 'Every customer came with different needs and different reasons to buy.',
      ar: 'كل عميل كان بيجي باحتياجات مختلفة ودوافع شراء غير التاني.',
    },
    whatIDid: {
      en: 'I identified what each person needed, customized every plan to the client in front of me, rewrote the client tone of voice, introduced relevant add-ons, and followed up leads through the whole sales process.',
      ar: 'فهمت كل عميل محتاج إيه، وفصّلت كل خطة على مقاسه، وأعدت صياغة الـ tone of voice، ورشحتله الخدمات الإضافية المناسبة وتابعته طول رحلة البيع.',
    },
    bridgeBefore: {
      en: 'A tighter role came next: pure sales.',
      ar: 'وبعدها دور أركز أكتر: مبيعات وبس.',
    },
  },
];

export const SKILL_GROUPS: SkillGroupData[] = [
  {
    id: 'soft',
    title: { en: 'Soft', ar: 'Soft Skills' },
    color: '#A68BC8',
    softColor: '#E4D8F0',
    skills: [
      { id: 's-lead', label: { en: 'Team leadership', ar: 'قيادة التيم' }, level: 'Advanced', source: 'xfuse' },
      { id: 's-comm', label: { en: 'Client communication', ar: 'التواصل مع العملاء' }, level: 'Advanced', source: 'cveeez' },
      { id: 's-crit', label: { en: 'Critical thinking', ar: 'التفكير النقدي' }, level: 'Advanced', source: 'every' },
      { id: 's-nego', label: { en: 'Consultative selling & negotiation', ar: 'البيع الاستشاري والتفاوض' }, level: 'Advanced', source: 'careercv' },
      { id: 's-coord', label: { en: 'Cross-functional coordination', ar: 'التنسيق بين الفرق' }, level: 'Intermediate', source: 'fertical' },
    ],
  },
  {
    id: 'hard',
    title: { en: 'Hard', ar: 'Hard Skills' },
    color: '#E7907A',
    softColor: '#F7DCD4',
    skills: [
      { id: 'h-disc', label: { en: 'Customer discovery & market research', ar: 'اكتشاف العميل وبحث السوق' }, level: 'Advanced', source: 'fertical' },
      { id: 'h-wf', label: { en: 'Workflow design', ar: 'تصميم الـ Workflow' }, level: 'Advanced', source: 'cveeez' },
      { id: 'h-pmf', label: { en: 'Product-market fit & positioning', ar: 'ملاءمة المنتج وعرض الخدمات' }, level: 'Intermediate', source: 'fertical' },
      { id: 'h-kpi', label: { en: 'KPI tracking & sales pipeline', ar: 'متابعة الـ KPIs والمبيعات' }, level: 'Advanced', source: 'xfuse' },
      { id: 'h-li', label: { en: 'LinkedIn personal branding', ar: 'الـ Personal Branding على LinkedIn' }, level: 'Advanced', source: 'cveeez' },
    ],
  },
  {
    id: 'technical',
    title: { en: 'Technical', ar: 'Technical Skills' },
    color: '#9DB5A0',
    softColor: '#DCE7DD',
    skills: [
      { id: 't-da', label: { en: 'Data analysis', ar: 'تحليل البيانات' }, level: 'Intermediate', source: 'course' },
      { id: 't-py', label: { en: 'Python', ar: 'Python' }, level: 'Beginner', source: 'course' },
      { id: 't-ops', label: { en: 'Product operations & systems thinking', ar: 'إدارة عمليات المنتج' }, level: 'Intermediate', source: 'fertical' },
      { id: 't-vibe', label: { en: 'AI rapid prototyping', ar: 'بناء نماذج أولية بالـ AI' }, level: 'Intermediate', source: 'every' },
    ],
  },
  {
    id: 'tools',
    title: { en: 'Tools', ar: 'Tools' },
    color: '#E3B26E',
    softColor: '#F6E6CB',
    skills: [
      { id: 'tl-design', label: { en: 'Design tools', ar: 'Design tools' }, level: 'Intermediate', source: 'every' },
      { id: 'tl-ai', label: { en: 'AI tools & vibe coding', ar: 'AI tools & vibe coding' }, level: 'Advanced', source: 'every' },
      { id: 'tl-excel', label: { en: 'Excel', ar: 'Excel' }, level: 'Intermediate', source: 'course' },
      { id: 'tl-pbi', label: { en: 'Power BI', ar: 'Power BI' }, level: 'Beginner', source: 'course' },
      { id: 'tl-ms', label: { en: 'Microsoft tools', ar: 'Microsoft tools' }, level: 'Advanced', source: 'every' },
      { id: 'tl-clickup', label: { en: 'ClickUp', ar: 'ClickUp' }, level: 'Advanced', source: 'xfuse' },
      { id: 'tl-zoho', label: { en: 'Zoho', ar: 'Zoho' }, level: 'Intermediate', source: 'every' },
      { id: 'tl-odoo', label: { en: 'Odoo', ar: 'Odoo' }, level: 'Intermediate', source: 'every' },
      { id: 'tl-firebase', label: { en: 'Firebase', ar: 'Firebase' }, level: 'Beginner', source: 'every' },
    ],
  },
];

export const LANGUAGES_LIST: LanguageItem[] = [
  {
    id: 'arabic',
    name: { en: 'Arabic', ar: 'العربي' },
    levelLabel: { en: 'Native', ar: 'اللغة الأم' },
    dots: 5,
    color: '#A68BC8',
  },
  {
    id: 'english',
    name: { en: 'English', ar: 'الإنجليزي' },
    levelLabel: { en: 'Professional Working', ar: 'شغل وتواصل احترافي' },
    dots: 4,
    color: '#9DB5A0',
  },
];

export const COURSE_BOOKS: CourseBookItem[] = [
  {
    id: 'data-analysis',
    spineColor: '#A68BC8',
    title: 'Data Analysis',
  },
  {
    id: 'marketing',
    spineColor: '#E7907A',
    title: 'Marketing',
  },
  {
    id: 'python',
    spineColor: '#9DB5A0',
    title: 'Python',
  },
  {
    id: 'excel',
    spineColor: '#E3B26E',
    title: 'Excel',
  },
  {
    id: 'soft-skills',
    spineColor: '#C59AB8',
    title: 'Soft Skills',
    provider: { en: 'ماي كنسي', ar: 'ماي كنسي' },
  },
];
