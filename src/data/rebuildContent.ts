export type Lang = 'en' | 'ar';
export type ExperienceId = 'fertical' | 'cveeez' | 'xfuse-lead' | 'xfuse-sell' | 'careercv';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SkillGroupId = 'soft' | 'hard' | 'technical' | 'tools';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface BilingualList {
  en: string[];
  ar: string[];
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
  dates?: string;
  /** Company name & job title stay ALWAYS in English */
  company: string;
  role: string;
  companySubtitle?: BilingualText;
  achievements: AchievementItem[];
  roleOverview: BilingualText;
  responsibilities: BilingualList;
  keyAchievements?: BilingualList;
  skillsDemonstrated: BilingualList;
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

export const EXPERIENCE_COLORS: Record<
  ExperienceId | 'course' | 'every',
  { hex: string; soft: string; label: BilingualText }
> = {
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
  'xfuse-lead': {
    hex: '#9DB5A0',
    soft: '#DCE7DD',
    label: { en: 'From X-FUSE', ar: 'من X-FUSE' },
  },
  'xfuse-sell': {
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
    en: 'Israa Ellban',
    ar: 'Israa Ellban',
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
    line1: { en: 'It’s a bit dark in here.', ar: 'المكان ضلمة شوية 👀؟!!' },
    line2: { en: 'Mind pulling that lantern?', ar: 'ممكن تشد الفانوس ده؟' },
    button: { en: 'Pull lantern', ar: 'شد الفانوس' },
    tooltip: { en: 'Pull or tap the lantern cord', ar: 'شد أو دوس على حبل الفانوس' },
    skip: { en: 'Skip', ar: 'عدّي' },
  },
  hero: {
    en: {
      greeting: 'Hello hello..',
      namePrefix: 'My name’s ',
      name: 'Israa Ellban',
      portfolioPrefix: ' and this is my ',
      portfolioWord: 'portfolio',
      portfolioDots: '...',
      line3Before: 'Full of ',
      line3Curiosity: 'curiosity',
      line3Mid: ' and a bit of persistence to take these ',
      line3Steps: 'steps',
      line3After: '...',
    },
    ar: {
      greeting: 'هاالو هاالو ..',
      namePrefix: 'أنا ',
      name: 'إسراء اللبان',
      portfolioPrefix: ' وده ',
      portfolioWord: 'البورتفوليو',
      portfolioDots: ' بتاعي...',
      line3Before: 'اللي مليااان ',
      line3Curiosity: 'فضول',
      line3Mid: ' وشوية مثابرة علشان أحقق ',
      line3Steps: 'الخطوات',
      line3After: ' دي...',
    },
  },
  journey: {
    lead: {
      en: 'My journey always starts with',
      ar: 'رحلتي دايمًا بتبدأ بـ',
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
    openFile: { en: 'Open the file', ar: 'Open the file' },
    closeLabel: { en: 'Close', ar: 'إغلاق' },
    blocks: {
      roleOverview: { en: 'Role Overview', ar: 'نبذة عن الدور' },
      responsibilities: { en: 'Key Responsibilities', ar: 'المسؤوليات' },
      keyAchievements: { en: 'Key Achievements', ar: 'الإنجازات' },
      skillsDemonstrated: { en: 'Skills Demonstrated', ar: 'المهارات' },
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
      monthLabel: { en: '1 Month', ar: 'شهر كامل' },
      dropSteps: {
        en: ['1 Month', '14 Days', '3 Days', '12 Hours', '4 Hours'],
        ar: ['شهر', '١٤ يوم', '٣ أيام', '١٢ ساعة', '٤ ساعات'],
      },
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
    line1Before: { en: 'Umm, ', ar: 'أممم.. ' },
    line1Highlight: { en: "what's next?", ar: 'إيه الخطوة الجاية؟' },
    line1Emoji: '👀',
    line2: "idk.. let's figure it out.",
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
    whatsappUrl: 'https://wa.me/201554488665',
    whatsappLabel: { en: 'WhatsApp', ar: 'واتساب' },
    downloadCv: { en: 'Download my CV', ar: 'تحميل الـ CV' },
    copyEmail: { en: 'Copy Email', ar: 'انسخ الإيميل' },
    copied: { en: 'Copied', ar: 'اتنسخ' },
    copyLabel: { en: 'Copy', ar: 'نسخ' },
    directEmailLabel: { en: 'DIRECT EMAIL', ar: 'الإيميل المباشر' },
    phoneLabel: { en: 'WHATSAPP', ar: 'واتساب' },
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
    dates: 'Jan 2023 – May 2025',
    company: 'FERTICAL',
    role: 'Co-Founder | Business Development & Product Operations',
    companySubtitle: {
      en: 'Agricultural biotechnology startup',
      ar: 'ستارت أب في التكنولوجيا الحيوية الزراعية',
    },
    achievements: [
      {
        badge: '1,000+',
        caption: {
          en: 'Sold 1,000+ units in 3 months after adapting the product based on farm feedback.',
          ar: 'بيع أكتر من 1,000 وحدة في 3 شهور بعد تعديل المنتج بناءً على فيدباك المزارع.',
        },
      },
      {
        badge: '+80%',
        caption: {
          en: 'Increased sales by nearly 80% through repeat B2B orders.',
          ar: 'زيادة المبيعات بحوالي 80% من خلال طلبات B2B متكررة.',
        },
      },
      {
        badge: '€4,000',
        caption: {
          en: 'Secured €4,000 in startup funding.',
          ar: 'الحصول على تمويل بقيمة 4,000 يورو للستارت أب.',
        },
      },
    ],
    roleOverview: {
      en: 'Co-founded and developed an agricultural biotechnology startup, working across product research, development, market validation, sales, marketing, and business operations.',
      ar: 'شاركت في تأسيس وتطوير ستارت أب في مجال التكنولوجيا الحيوية الزراعية، واشتغلت على أبحاث المنتج، التطوير، التحقق من السوق، المبيعات، التسويق، والعمليات.',
    },
    responsibilities: {
      en: [
        'Conducted market research and customer discovery to identify agricultural challenges and business opportunities.',
        'Participated in product research, development, testing, packaging, and production.',
        'Managed sales and marketing activities across B2B and B2C channels.',
        'Built relationships with agricultural consultants, farm owners, and potential customers.',
        'Gathered customer feedback and adapted product positioning to address market resistance.',
        'Managed operational activities, production coordination, and quality control.',
      ],
      ar: [
        'إجراء أبحاث السوق واكتشاف احتياجات العملاء لتحديد التحديات والفرص الزراعية.',
        'المشاركة في أبحاث المنتج، التطوير، الاختبار، التغليف، والإنتاج.',
        'إدارة أنشطة المبيعات والتسويق عبر قنوات B2B وB2C.',
        'بناء علاقات مع الاستشاريين الزراعيين وأصحاب المزارع والعملاء المحتملين.',
        'جمع فيدباك العملاء وتعديل تموضع المنتج لمواجهة تحديات السوق.',
        'إدارة العمليات اليومية، وتنسيق الإنتاج، ومراقبة الجودة.',
      ],
    },
    keyAchievements: {
      en: [
        'Sold more than 1,000 units within three months following product and marketing adjustments.',
        'Increased sales by approximately 80% through repeat B2B business.',
        'Secured €4,000 in startup funding.',
        'Developed customer acquisition and market positioning based on real customer feedback.',
      ],
      ar: [
        'بيع أكتر من 1,000 وحدة خلال 3 شهور بعد تعديلات المنتج والتسويق.',
        'زيادة المبيعات بنحو 80% من خلال طلبات الـ B2B المتكررة.',
        'الحصول على تمويل بقيمة 4,000 يورو للستارت أب.',
        'تطوير استراتيجية استحواذ عملاء وتموضع سوقي مبني على فيدباك حقيقي.',
      ],
    },
    skillsDemonstrated: {
      en: [
        'Business Development',
        'Product Operations',
        'Market Research',
        'Sales',
        'Customer Discovery',
        'Product Development',
        'B2B & B2C',
        'Marketing',
        'Quality Control',
      ],
      ar: [
        'تطوير الأعمال',
        'عمليات المنتج',
        'أبحاث السوق',
        'المبيعات',
        'اكتشاف العملاء',
        'تطوير المنتج',
        'B2B & B2C',
        'التسويق',
        'مراقبة الجودة',
      ],
    },
  },
  {
    id: 'cveeez',
    color: '#E7907A',
    softColor: '#F7DCD4',
    logoSrc: '/assets/aistudio/cveeez_logo_e5423e19.jpg',
    dates: 'Sep 2024 – Nov 2025',
    company: 'CVeeeZ',
    role: 'LinkedIn Personal Branding Specialist',
    achievements: [
      {
        badge: '1,000+',
        caption: {
          en: 'Delivered 1,000+ personalized LinkedIn profiles.',
          ar: 'تسليم أكتر من 1,000 بروفايل LinkedIn مخصص لكل عميل.',
        },
      },
      {
        badge: '4 hrs/day',
        caption: {
          en: 'Rebuilt workflow from months of delays to approximately 4 hours per day.',
          ar: 'إعادة بناء الـ workflow وتقليل وقت التسليم من شهور لحوالي 4 ساعات يوميًا.',
        },
      },
      {
        badge: '2 startups',
        caption: {
          en: 'Supported the director in developing two startup initiatives.',
          ar: 'دعم المدير في تطوير مبادرتين ستارت أب جديدين.',
        },
      },
    ],
    roleOverview: {
      en: 'Worked with professionals, entrepreneurs, and business owners to build and improve their LinkedIn presence through profile optimization, personal branding, research, and tailored content.',
      ar: 'اشتغلت مع محترفين ورواد أعمال وأصحاب شركات على بناء وتطوير حضورهم على LinkedIn من خلال تحسين البروفايل، الـ Personal Branding، البحث، وكتابة محتوى مخصص.',
    },
    responsibilities: {
      en: [
        'Optimized LinkedIn profiles based on clients’ careers, industries, and goals.',
        'Gathered client information and translated it into professional profile content.',
        'Conducted research to improve positioning and profile relevance.',
        'Managed client communication, revisions, and delivery.',
        'Maintained quality and organized workflow across multiple client projects.',
      ],
      ar: [
        'تحسين بروفايلات LinkedIn بناءً على المسار المهني ومجال وأهداف كل عميل.',
        'جمع معلومات العملاء وتحويلها لمحتوى احترافي للبروفايل.',
        'إجراء أبحاث لتحسين التموضع وملاءمة البروفايل للسوق.',
        'إدارة التواصل مع العملاء، التعديلات، والتسليم في المواعيد.',
        'الحفاظ على الجودة وتنظيم الـ workflow عبر عدة مشاريع في نفس الوقت.',
      ],
    },
    keyAchievements: {
      en: [
        'Delivered over 1,000 LinkedIn profile branding projects.',
        'Improved workflow organization and reduced delivery time to approximately 4 working hours per day.',
        'Supported the director in developing two startup initiatives in software solutions and marketing.',
      ],
      ar: [
        'تسليم أكتر من 1,000 مشروع Personal Branding على LinkedIn.',
        'تطوير تنظيم العمل وتقليل وقت التنفيذ لحوالي 4 ساعات شغل في اليوم.',
        'دعم المدير في تطوير مبادرتين ستارت أب في حلول السوفتوير والتسويق.',
      ],
    },
    skillsDemonstrated: {
      en: [
        'Client Management',
        'Personal Branding',
        'Research',
        'Workflow Improvement',
        'Project Coordination',
        'Quality Management',
        'Communication',
      ],
      ar: [
        'إدارة العملاء',
        'Personal Branding',
        'البحث',
        'تحسين الـ Workflow',
        'تنسيق المشاريع',
        'إدارة الجودة',
        'التواصل',
      ],
    },
    bridgeBefore: {
      en: 'In parallel, I took the same curiosity into a company: CVeeeZ.',
      ar: 'وبالتوازي، أخدت نفس الفضول لشركة: CVeeeZ.',
    },
  },
  {
    id: 'xfuse-lead',
    color: '#9DB5A0',
    softColor: '#DCE7DD',
    logoSrc: '/assets/aistudio/X-Fuse_b9307951.jpg',
    darkLogoBg: true,
    dates: 'Apr 2025 – Dec 2025',
    company: 'X-FUSE',
    role: 'Team Leader | Team & Operations Management',
    achievements: [
      {
        badge: '12–15',
        caption: {
          en: 'Led a cross-functional team of 12–15 members.',
          ar: 'قيادة تيم متعدد التخصصات مكون من 12 إلى 15 فرد.',
        },
      },
      {
        badge: '5 areas',
        caption: {
          en: 'Coordinated work across 5 functional areas.',
          ar: 'تنسيق الشغل عبر 5 مجالات وتخصصات مختلفة.',
        },
      },
      {
        badge: 'KPIs',
        caption: {
          en: 'Managed KPIs, task distribution, and individual performance.',
          ar: 'إدارة الـ KPIs، وتوزيع المهام، ومتابعة أداء كل فرد.',
        },
      },
    ],
    roleOverview: {
      en: 'Led a cross-functional team, managing daily operations, task distribution, performance, and coordination to ensure work was delivered efficiently and according to expectations.',
      ar: 'قُدت تيم متعدد التخصصات، وأدرت العمليات اليومية، وتوزيع المهام، والأداء، والتنسيق علشان الشغل يتسلم بكفاءة وحسب التوقعات.',
    },
    responsibilities: {
      en: [
        'Managed recruitment, onboarding, and team training.',
        'Distributed tasks and coordinated daily workflows.',
        'Set, monitored, and followed up on team KPIs.',
        'Evaluated individual performance and provided feedback.',
        'Conducted coaching and performance follow-up.',
        'Coordinated communication between team members and clients.',
        'Monitored deadlines, quality, and work delivery.',
      ],
      ar: [
        'إدارة التوظيف، الـ onboarding، وتدريب التيم.',
        'توزيع المهام وتنسيق الـ workflow اليومي.',
        'تحديد ومتابعة الـ KPIs الخاصة بالتيم.',
        'تقييم الأداء الفردي وتقديم الفيدباك المستمر.',
        'تقديم الكوتشينج ومتابعة تطور الأداء.',
        'تنسيق التواصل بين أعضاء التيم والعملاء.',
        'مراقبة المواعيد النهائية، الجودة، وتسليم الشغل.',
      ],
    },
    skillsDemonstrated: {
      en: [
        'Team Leadership',
        'Team Building',
        'KPI Tracking',
        'Performance Management',
        'Recruitment',
        'Coaching',
        'Operations',
        'Workflow Coordination',
      ],
      ar: [
        'قيادة التيم',
        'بناء الفرق',
        'متابعة الـ KPIs',
        'إدارة الأداء',
        'التوظيف',
        'الكوتشينج',
        'العمليات',
        'تنسيق الـ Workflow',
      ],
    },
    bridgeBefore: {
      en: 'From my success at CVeeeZ, a new partnership began for a startup called X-FUSE.',
      ar: 'ومن نجاحي في CVeeeZ، بدأت شراكة جديدة في ستارت أب اسمه X-FUSE.',
    },
  },
  {
    id: 'xfuse-sell',
    color: '#9DB5A0',
    softColor: '#DCE7DD',
    logoSrc: '/assets/aistudio/X-Fuse_b9307951.jpg',
    darkLogoBg: true,
    dates: 'Apr 2025 – Dec 2025',
    company: 'X-FUSE',
    role: 'Sales & Marketing Executive',
    achievements: [
      {
        badge: '70%',
        caption: {
          en: 'Achieved 70% of target in the first month.',
          ar: 'تحقيق 70% من التارجت الشهري في أول شهر.',
        },
      },
      {
        badge: '120%',
        caption: {
          en: 'Reached 120% of target in the second month.',
          ar: 'الوصول إلى 120% من التارجت في تاني شهر.',
        },
      },
      {
        badge: 'Full cycle',
        caption: {
          en: 'Managed the full sales cycle from outreach to closing.',
          ar: 'إدارة دورة المبيعات كاملة من التواصل لحد إقفال الصفقات.',
        },
      },
    ],
    roleOverview: {
      en: 'Managed sales and client acquisition activities, from identifying potential customers and understanding their needs to presenting solutions, negotiating, closing deals, and maintaining client relationships.',
      ar: 'أدرت أنشطة المبيعات والاستحواذ على العملاء، من تحديد العملاء المحتملين وفهم احتياجاتهم، لعرض الحلول، والتفاوض، وإقفال الصفقات، والحفاظ على العلاقات.',
    },
    responsibilities: {
      en: [
        'Generated and qualified leads.',
        'Conducted virtual client meetings and service presentations.',
        'Identified customer needs and recommended suitable solutions.',
        'Managed objections and negotiations.',
        'Maintained CRM records and sales pipelines.',
        'Followed up with prospects and existing clients.',
        'Built and maintained client relationships.',
      ],
      ar: [
        'توليد وتأهيل العملاء المحتملين (Lead Generation).',
        'عقد اجتماعات أونلاين مع العملاء وعرض الخدمات.',
        'تحديد احتياجات العملاء وترشيح الحلول المناسبة ليهم.',
        'التعامل مع الاعتراضات وإدارة التفاوض.',
        'متابعة بيانات الـ CRM وخطوط المبيعات (Pipelines).',
        'المتابعة المستمرة مع العملاء المحتملين والحاليين.',
        'بناء علاقات طويلة المدى مع العملاء والحفاظ عليها.',
      ],
    },
    keyAchievements: {
      en: [
        'Achieved 70% of the monthly target in the first month.',
        'Reached 120% of the target in the second month.',
      ],
      ar: [
        'تحقيق 70% من التارجت الشهري في أول شهر.',
        'الوصول إلى 120% من التارجت في تاني شهر.',
      ],
    },
    skillsDemonstrated: {
      en: [
        'Sales',
        'Marketing',
        'Lead Generation',
        'Client Acquisition',
        'Negotiation',
        'CRM',
        'Pipeline Management',
        'Relationship Management',
      ],
      ar: [
        'المبيعات',
        'التسويق',
        'Lead Generation',
        'استحواذ العملاء',
        'التفاوض',
        'CRM',
        'إدارة الـ Pipeline',
        'إدارة العلاقات',
      ],
    },
    bridgeBefore: {
      en: 'Alongside leading the team at X-FUSE, I stepped directly into sales & client growth.',
      ar: 'وجنب قيادة التيم في X-FUSE، دخلت بنفسي في المبيعات ونمو العملاء.',
    },
  },
  {
    id: 'careercv',
    color: '#E3B26E',
    softColor: '#F6E6CB',
    logoSrc: '/assets/aistudio/Cereer_Cv_1ecf1176.jpg',
    dates: 'Nov 2025 – Mar 2026',
    company: 'Career CV',
    role: 'Sales Specialist',
    achievements: [
      {
        badge: 'Leads',
        caption: {
          en: 'Converted inbound and outbound leads into paying customers.',
          ar: 'تحويل الـ inbound والـ outbound leads لعملاء فعليين.',
        },
      },
      {
        badge: 'Services',
        caption: {
          en: 'Sold graphic design, e-commerce, and business services.',
          ar: 'بيع خدمات الجرافيك ديزاين، التجارة الإلكترونية، وخدمات الأعمال.',
        },
      },
      {
        badge: 'Closing',
        caption: {
          en: 'Managed customer communication from inquiry to closing.',
          ar: 'إدارة التواصل مع العملاء من أول الاستفسار لحد إقفال البيع.',
        },
      },
    ],
    roleOverview: {
      en: 'Worked in sales, converting potential customers into clients through needs-based conversations, service recommendations, follow-up, and closing.',
      ar: 'اشتغلت في المبيعات على تحويل العملاء المحتملين لعملاء فعليين من خلال محادثات مبنية على فهم الاحتياج، ترشيح الخدمات المناسبة، المتابعة، وإقفال الصفقات.',
    },
    responsibilities: {
      en: [
        'Handled inbound and outbound leads.',
        'Promoted digital and business services.',
        'Identified client requirements and recommended suitable services.',
        'Managed conversations, objections, and follow-ups.',
        'Supported customer retention and relationship building.',
      ],
      ar: [
        'التعامل مع الـ inbound والـ outbound leads.',
        'الترويج للخدمات الرقمية وخدمات الأعمال.',
        'تحديد متطلبات العميل وترشيح الخدمات المناسبة له.',
        'إدارة المحادثات، الاعتراضات، والمتابعة المستمرة.',
        'دعم الحفاظ على العملاء وبناء علاقات مستمرة معهم.',
      ],
    },
    skillsDemonstrated: {
      en: [
        'Lead Conversion',
        'Consultative Selling',
        'Digital Services',
        'Customer Communication',
        'Sales Closing',
        'Customer Retention',
      ],
      ar: [
        'تحويل الـ Leads',
        'البيع الاستشاري',
        'الخدمات الرقمية',
        'التواصل مع العملاء',
        'إقفال المبيعات',
        'الحفاظ على العملاء',
      ],
    },
    bridgeBefore: {
      en: 'A tighter role came next: pure sales.',
      ar: 'والخطوة اللي بعدها كانت دور مركز أكتر: مبيعات مباشرة.',
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
      { id: 's-lead', label: { en: 'Team leadership', ar: 'قيادة التيم' }, level: 'Advanced', source: 'xfuse-lead' },
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
      { id: 'h-kpi', label: { en: 'KPI tracking & sales pipeline', ar: 'متابعة الـ KPIs والمبيعات' }, level: 'Advanced', source: 'xfuse-sell' },
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
      { id: 'tl-clickup', label: { en: 'ClickUp', ar: 'ClickUp' }, level: 'Advanced', source: 'xfuse-lead' },
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
    provider: { en: 'McKinsey', ar: 'McKinsey' },
  },
];
