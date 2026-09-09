export type Locale = 'en' | 'ar';

export interface Translations {
  // Navigation & Common
  nav: {
    brand: string;
    brandSub: string;
    home: string;
    jobs: string;
    status: string;
    export: string;
    liveIndicator: string;
    toggleLang: string;
  };

  // Landing Page
  landing: {
    heroBadge: string;
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroTitleSuffix: string;
    heroSubtitle: string;
    ctaJobs: string;
    ctaCompany: string;
    companyTitle: string;
    companySubtitle: string;
    companyDescP1: string;
    companyDescP2: string;
    servicesTitle: string;
    servicesSubtitle: string;
    serviceNexusTitle: string;
    serviceNexusDesc: string;
    serviceOrbitTitle: string;
    serviceOrbitDesc: string;
    serviceFlowXTitle: string;
    serviceFlowXDesc: string;
    clutchSpotlightTitle: string;
    clutchSpotlightDesc: string;
    clutchSpotlightCta: string;
    statsLiveJobs: string;
    statsSources: string;
    statsUptime: string;
    footerCopyright: string;
    footerSub: string;
    footerFree: string;
    footerVisitCompany: string;
  };

  // Dashboard & Job Board
  dashboard: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filters: string;
    resetFilters: string;
    showingResults: string;
    noJobsFound: string;
    noJobsHint: string;
    sortBy: string;
    sortNewest: string;
    sortRelevance: string;
    page: string;
    of: string;
    previous: string;
    next: string;
    loading: string;
    errorFetching: string;
    retry: string;
  };

  // Filter Categories & Values
  filters: {
    categories: string;
    location: string;
    experience: string;
    posted: string;
    all: string;
    remote: string;
    egyptOnsite: string;
    otherLocation: string;
    junior: string;
    mid: string;
    senior: string;
    age24h: string;
    age1week: string;
    ageOlder: string;
  };

  // Categories Names
  categories: {
    dotnet: string;
    frontend: string;
    fullstack: string;
    backend: string;
    mobile: string;
    devops: string;
    data: string;
    ai: string;
    qa: string;
    embedded: string;
    security: string;
  };

  // Job Card & Modal
  job: {
    confidential: string;
    unspecifiedLocation: string;
    remoteBadge: string;
    viewDetails: string;
    applyNow: string;
    copyLink: string;
    copied: string;
    close: string;
    postedDate: string;
    experienceLevel: string;
    employmentType: string;
    salary: string;
    salaryNotDisclosed: string;
    technologies: string;
    categories: string;
    description: string;
    requirements: string;
    originalSource: string;
    freshBadge: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      brand: 'Alaris Clutch',
      brandSub: 'by Alaris Space',
      home: 'Home',
      jobs: 'Jobs Feed',
      status: 'Status',
      export: 'Export',
      liveIndicator: 'Continuous Indexing • Live Feed',
      toggleLang: 'العربية',
    },
    landing: {
      heroBadge: 'Alaris Space Ecosystem',
      heroTitlePrefix: 'Engineering High-Performance Intelligence & ',
      heroTitleHighlight: 'Autonomous Systems',
      heroTitleSuffix: '',
      heroSubtitle:
        'Alaris develops next-generation software infrastructure, resilient web crawling pipelines, and specialized intelligence engines that empower engineers and organizations worldwide.',
      ctaJobs: 'Explore Tech Jobs',
      ctaCompany: 'Visit Alaris Space',
      companyTitle: 'About Alaris',
      companySubtitle: 'Architecting modern software solutions at scale.',
      companyDescP1:
        'Alaris is a technology engineering collective dedicated to building ultra-fast, reliable, and intelligent digital products. We specialize in real-time data automation, distributed web indexing, and developer-first productivity ecosystems.',
      companyDescP2:
        'Our product suite bridges complex data gathering with intuitive interfaces, designed with surgical precision and uncompromising visual elegance.',
      servicesTitle: 'Core Capabilities & Services',
      servicesSubtitle: 'Pillars of the Alaris technology architecture.',
      serviceNexusTitle: 'Alaris Nexus',
      serviceNexusDesc:
        'Unified connectivity and intelligent API orchestration layer powering seamless cross-platform workflows and data pipelines.',
      serviceOrbitTitle: 'Alaris Orbit',
      serviceOrbitDesc:
        'Continuous data ingestion, real-time telemetry, and automated web indexing engine built for high-throughput discovery.',
      serviceFlowXTitle: 'Alaris FlowX',
      serviceFlowXDesc:
        'Next-generation asynchronous execution pipeline and event-driven automation framework for scalable task orchestration.',
      clutchSpotlightTitle: 'Alaris Clutch in Action',
      clutchSpotlightDesc:
        'A fully free, live demonstration of our autonomous scraping engine: continuously crawling LinkedIn, Wuzzuf, Remotive, Arbeitnow, and Indeed for tech talent.',
      clutchSpotlightCta: 'Open Jobs Dashboard',
      statsLiveJobs: 'Continuously Scraped Jobs',
      statsSources: 'Active Scraper Sources',
      statsUptime: 'Automated Worker Operations',
      footerCopyright: '© 2026 Alaris. All rights reserved.',
      footerSub: 'An Alaris Space product alongside Orbit, Nexus, and FlowX.',
      footerFree: '100% Free & Open-Source Intelligence',
      footerVisitCompany: 'alaris.space',
    },
    dashboard: {
      title: 'Tech Job Intelligence',
      subtitle:
        'Continuously scraped and classified engineering vacancies across Egypt and global remote sources.',
      searchPlaceholder: 'Search jobs by title, company, or technology...',
      filters: 'Filters',
      resetFilters: 'Reset',
      showingResults: 'Showing {count} tech jobs',
      noJobsFound: 'No jobs match your search filters.',
      noJobsHint: 'Try widening your keywords or clearing location and experience filters.',
      sortBy: 'Sort by:',
      sortNewest: 'Newest First',
      sortRelevance: 'Relevance',
      page: 'Page',
      of: 'of',
      previous: 'Previous',
      next: 'Next',
      loading: 'Fetching live vacancies...',
      errorFetching: 'Unable to load jobs. Please try again.',
      retry: 'Retry',
    },
    filters: {
      categories: 'Categories',
      location: 'Location & Work Style',
      experience: 'Experience Level',
      posted: 'Date Posted',
      all: 'All',
      remote: 'Remote Only',
      egyptOnsite: 'Egypt (Onsite / Hybrid)',
      otherLocation: 'International / Other',
      junior: 'Junior / Entry (0-2 yrs)',
      mid: 'Mid-Level (2-5 yrs)',
      senior: 'Senior (5+ yrs)',
      age24h: 'Last 24 Hours',
      age1week: 'Past Week',
      ageOlder: 'Older',
    },
    categories: {
      dotnet: '.NET & C#',
      frontend: 'Frontend & UI',
      fullstack: 'Full Stack',
      backend: 'Backend & Systems',
      mobile: 'Mobile (Flutter, Swift, Kotlin)',
      devops: 'DevOps & Cloud',
      data: 'Data Engineering & SQL',
      ai: 'AI & Machine Learning',
      qa: 'QA & Testing',
      embedded: 'Embedded & IoT',
      security: 'Cybersecurity',
    },
    job: {
      confidential: 'Confidential Company',
      unspecifiedLocation: 'Location Unspecified',
      remoteBadge: 'Remote',
      viewDetails: 'View Details',
      applyNow: 'Apply on Source',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      close: 'Close',
      postedDate: 'Posted',
      experienceLevel: 'Experience',
      employmentType: 'Employment Type',
      salary: 'Salary',
      salaryNotDisclosed: 'Not Disclosed',
      technologies: 'Detected Stack',
      categories: 'Categories',
      description: 'Job Description',
      requirements: 'Qualifications & Requirements',
      originalSource: 'Source',
      freshBadge: 'New',
    },
  },
  ar: {
    nav: {
      brand: 'ألاريس كلاتش',
      brandSub: 'من ألاريس سبيس',
      home: 'الرئيسية',
      jobs: 'الوظائف المباشرة',
      status: 'الحالة',
      export: 'تصدير',
      liveIndicator: 'فهرسة مستمرة • بث مباشر',
      toggleLang: 'English',
    },
    landing: {
      heroBadge: 'منظومة ألاريس سبيس',
      heroTitlePrefix: 'هندسة الأنظمة الذكية فائقة الأداء و',
      heroTitleHighlight: 'البيانات المؤتمتة',
      heroTitleSuffix: '',
      heroSubtitle:
        'تقوم ألاريس بتطوير بنية تحتية برمجية من الجيل القادم، وأنابيب زحف وفهرسة بيانات متينة، ومحركات ذكاء متخصصة تمكّن المهندسين والشركات حول العالم.',
      ctaJobs: 'استكشف الوظائف التقنية',
      ctaCompany: 'زيارة موقع ألاريس سبيس',
      companyTitle: 'عن شركة ألاريس',
      companySubtitle: 'تصميم حلول برمجية حديثة على نطاق واسع.',
      companyDescP1:
        'ألاريس هي مؤسسة هندسية تقنية مكرسة لبناء منتجات رقمية فائقة السرعة والموثوقية والذكاء. نحن متخصصون في أتمتة البيانات الحية، وفهرسة الويب الموزعة، وبيئات الإنتاجية الموجهة للمطورين.',
      companyDescP2:
        'تربط منتجاتنا بين جمع البيانات المعقدة والواجهات المتقنة سهلة الاستخدام، والمصممة بدقة هندسية عالية وتناغم بصري استثنائي.',
      servicesTitle: 'القدرات والخدمات الأساسية',
      servicesSubtitle: 'الركائز التكنولوجية لبنية ألاريس التقنية.',
      serviceNexusTitle: 'ألاريس نيكسوس (Alaris Nexus)',
      serviceNexusDesc:
        'طبقة ربط موحدة وتنسيق واجهات برمجية ذكية تدعم تدفقات العمل المتكاملة وخطوط البيانات عبر المنصات المختلفة.',
      serviceOrbitTitle: 'ألاريس أوربت (Alaris Orbit)',
      serviceOrbitDesc:
        'محرك استيعاب بيانات مستمر وتتبع فوري وفهرسة تلقائية لمصادر الويب مصمم للاكتشاف فائق الإنتاجية.',
      serviceFlowXTitle: 'ألاريس فلو إكس (Alaris FlowX)',
      serviceFlowXDesc:
        'مسار تنفيذ غير متزامن متقدم وإطار عمل لأتمتة المهام القائمة على الأحداث لإدارة المهام على نطاق واسع.',
      clutchSpotlightTitle: 'ألاريس كلاتش أثناء العمل',
      clutchSpotlightDesc:
        'عرض عملي ومجاني بالكامل لمحرك الفهرسة المستمر لدينا: يراقب باستمرار LinkedIn وWuzzuf وRemotive وArbeitnow وIndeed لأحدث الوظائف التقنية.',
      clutchSpotlightCta: 'فتح لوحة الوظائف',
      statsLiveJobs: 'وظيفة مفهرسة باستمرار',
      statsSources: 'مصادر زحف نشطة',
      statsUptime: 'عمليات الفهرسة المؤتمتة',
      footerCopyright: '© 2026 ألاريس. جميع الحقوق محفوظة.',
      footerSub: 'أحد منتجات ألاريس سبيس بجانب Orbit وNexus وFlowX.',
      footerFree: 'ذكاء تقني مجاني ومفتوح 100%',
      footerVisitCompany: 'alaris.space',
    },
    dashboard: {
      title: 'رادار الوظائف التقنية',
      subtitle:
        'وظائف تقنية مفهرسة ومصنفة تلقائياً على مدار الساعة من مصر ومصادر العمل عن بُعد العالمية.',
      searchPlaceholder: 'ابحث عن وظيفة، شركة، أو تقنية...',
      filters: 'التصفيات',
      resetFilters: 'إعادة ضبط',
      showingResults: 'عرض {count} وظيفة تقنية',
      noJobsFound: 'لم يتم العثور على وظائف مطابقة لمعايير البحث.',
      noJobsHint: 'جرّب توسيع كلمات البحث أو إلغاء تحديد خيارات الموقع والخبرة.',
      sortBy: 'الترتيب حسب:',
      sortNewest: 'الأحدث أولاً',
      sortRelevance: 'الأكثر صلة',
      page: 'صفحة',
      of: 'من',
      previous: 'السابق',
      next: 'التالي',
      loading: 'جاري جلب الوظائف الحالية...',
      errorFetching: 'تعذر جلب الوظائف. يرجى المحاولة لاحقاً.',
      retry: 'إعادة المحاولة',
    },
    filters: {
      categories: 'التخصصات',
      location: 'الموقع ونمط العمل',
      experience: 'مستوى الخبرة',
      posted: 'تاريخ النشر',
      all: 'الكل',
      remote: 'عن بُعد فقط (Remote)',
      egyptOnsite: 'مصر (حضوري / هجين)',
      otherLocation: 'دولي / أخرى',
      junior: 'مبتدئ (0-2 سنوات)',
      mid: 'متوسط (2-5 سنوات)',
      senior: 'خبير (5+ سنوات)',
      age24h: 'خلال 24 ساعة',
      age1week: 'خلال أسبوع',
      ageOlder: 'أقدم',
    },
    categories: {
      dotnet: '.NET و C#',
      frontend: 'واجهات أمامية (Frontend)',
      fullstack: 'شامل (Full Stack)',
      backend: 'أنظمة وخوادم (Backend)',
      mobile: 'تطبيقات الهاتف (Mobile)',
      devops: 'ديف أوبس وسحابيات (DevOps)',
      data: 'هندسة البيانات و SQL',
      ai: 'الذكاء الاصطناعي وتعلم الآلة',
      qa: 'ضمان الجودة واختبار البرمجيات',
      embedded: 'الأنظمة المدمجة وإنترنت الأشياء',
      security: 'الأمن السيبراني',
    },
    job: {
      confidential: 'شركة سرية',
      unspecifiedLocation: 'الموقع غير محدد',
      remoteBadge: 'عن بُعد',
      viewDetails: 'عرض التفاصيل',
      applyNow: 'التقديم من المصدر',
      copyLink: 'نسخ الرابط',
      copied: 'تم النسخ!',
      close: 'إغلاق',
      postedDate: 'تاريخ النشر',
      experienceLevel: 'الخبرة',
      employmentType: 'نوع التوظيف',
      salary: 'الراتب',
      salaryNotDisclosed: 'غير معلن',
      technologies: 'التقنيات المكتشفة',
      categories: 'التصنيفات',
      description: 'وصف الوظيفة',
      requirements: 'المؤهلات والمتطلبات',
      originalSource: 'المصدر',
      freshBadge: 'جديد',
    },
  },
};
