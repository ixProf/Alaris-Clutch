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

    // Alaris FlowX
    flowX: {
      title: string;
      category: string;
      tagline: string;
      features: Array<{
        title: string;
        desc: string;
      }>;
      ctaTry: string;
    };

    // Alaris Nexus
    nexus: {
      title: string;
      category: string;
      tagline: string;
      desc: string;
      subline: string;
      pills: string[];
      stats: Array<{
        label: string;
        val: string;
      }>;
      ctaTry: string;
    };

    // Alaris Orbit
    orbit: {
      title: string;
      category: string;
      tagline: string;
      intro: string;
      features: Array<{
        title: string;
        desc: string;
      }>;
      overviewHeading: string;
      overviewSub: string;
      overviewDesc: string;
      specs: Array<{
        label: string;
        val: string;
      }>;
      ctaTry: string;
      ctaInquire: string;
    };

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

      // FlowX English
      flowX: {
        title: 'Alaris FlowX',
        category: '01 // RESTAURANT OPERATING SYSTEM',
        tagline: 'Engineered specifically for speed, precision, and operational clarity in restaurants.',
        features: [
          {
            title: 'Interactive Floor & Table Plan',
            desc: 'Real-time table status monitoring, seating capacity overview, and seamless order reassignments.',
          },
          {
            title: 'High-Speed POS & Order Creation',
            desc: 'Category filtering, instant menu lookup, custom kitchen modifier notes, and direct dispatch.',
          },
          {
            title: 'Kitchen Display System (KDS)',
            desc: 'Live chef ticket pipeline with real-time status updates (Preparing, Ready, Served).',
          },
          {
            title: 'Inventory & Stock Depletion',
            desc: 'Raw ingredient stock tracking, minimum threshold alerts, and automated recipe consumption logs.',
          },
          {
            title: 'Payments, Settlements & Invoicing',
            desc: 'Multi-mode cash, card, and digital wallet checkout with discount handling, refunds, and receipt printing.',
          },
          {
            title: 'Role-Based Access Control',
            desc: 'Granular permissions for managers, waitstaff, chefs, cashiers, and stock controllers.',
          },
        ],
        ctaTry: 'Try FlowX Live',
      },

      // Nexus English
      nexus: {
        title: 'Alaris Nexus',
        category: '02 // E-COMMERCE & COMMERCE ENGINE',
        tagline: 'Everything you sell, unified in one powerful hub.',
        desc: 'A modern e-commerce and sales platform built to orchestrate products, orders, customers, payments, and multi-channel inventory with extraordinary speed and high efficiency.',
        subline: 'Fast sales engine and integrated inventory management network',
        pills: ['Unified Sales Catalog', 'Instant Digital Checkout', 'Real-Time Stock Sync'],
        stats: [
          { label: 'Order Capacity', val: '+50K / Day' },
          { label: 'Checkout Speed', val: '< 1 Second' },
          { label: 'Product Sync', val: 'Real-Time' },
        ],
        ctaTry: 'Try Nexus Live',
      },

      // Orbit English
      orbit: {
        title: 'Alaris Orbit',
        category: '03 // VENUE MANAGEMENT & TREASURY INTELLIGENCE',
        tagline: 'Core Platform Capabilities',
        intro: 'Engineered from scratch to guarantee effortless venue management, rigorous financial ledgers, and live treasury metrics.',
        features: [
          {
            title: 'Reservation & Venue Tracking',
            desc: 'Hall and venue scheduling with customer profiles, booking lifecycles (Confirmed, Completed, Cancelled), and collision-free availability checks.',
          },
          {
            title: 'Expenses & Financial Ledgers',
            desc: 'Granular operational cost tracking alongside revenue streams with real-time net P&L and profit margin analytics.',
          },
          {
            title: 'Capital Allocation & Treasury',
            desc: 'Track investment injections and capital, monitor liquidity reserves, and maintain a real-time view of available treasury funds.',
          },
          {
            title: 'Automated Audit & Reporting',
            desc: 'Generate and export financial statements in PDF and Excel in Arabic and English with role-based security enforcement.',
          },
        ],
        overviewHeading: 'Platform Architecture Overview',
        overviewSub: 'Engineered for Operational Excellence',
        overviewDesc:
          'Alaris Orbit was designed by Alaris Space to establish complete synergy between venue reservations and live financial analytics. Rather than relying on disconnected tools, Orbit provides a unified control plane that automatically synchronizes operational events with financial records.',
        specs: [
          { label: 'Full REST API', val: 'ASP.NET Core REST Server' },
          { label: 'Relational Database', val: 'SQL Server with ACID Ledger Guarantees' },
          { label: 'Role Permissions', val: 'Granular Admin & Executive System Controls' },
        ],
        ctaTry: 'Try Orbit Live',
        ctaInquire: 'Inquire About Product',
      },

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

      // FlowX Arabic
      flowX: {
        title: 'ألاريس فلو إكس (Alaris FlowX)',
        category: '01 // نظام إدارة المطاعم المتكامل',
        tagline: 'مصمم خصيصاً لتحقيق السرعة والدقة والوضوح التشغيلي للمطاعم.',
        features: [
          {
            title: 'شبكة طاولات تفاعلية',
            desc: 'متابعة فورية لحالة الطاولات، سعة المقاعد، ونقل الطلبات بين الطاولات بسلاسة.',
          },
          {
            title: 'نقاط بيع سريعة وإنشاء طلبات',
            desc: 'تصفية حسب التصنيفات، بحث سريع في القائمة، ملاحظات خاصة، وإرسال فوري للمطبخ.',
          },
          {
            title: 'شاشة المطبخ (KDS)',
            desc: 'متابعة فورية لتذاكر الطهاة مع تحديث حالة كل عنصر (جاري التحضير، جاهز، تم التقديم).',
          },
          {
            title: 'إدارة المخزون والتنبيهات',
            desc: 'تتبع مخزون المكونات الخام، حدود المخزون الأدنى، وسجلات الاستهلاك التلقائي.',
          },
          {
            title: 'الدفع والدفعيات والفواتير',
            desc: 'دفع نقدي، بطاقات ائتمانية، ومحافظ رقمية، تطبيق الخصومات، الاسترداد، وطباعة الفواتير.',
          },
          {
            title: 'إدارة الصلاحيات والأدوار',
            desc: 'تحديد دقيق لصلاحيات المدراء، الخدام، الطهاة، أمناء الصندوق، ومسؤولي المخزون.',
          },
        ],
        ctaTry: 'جرّب المنتج',
      },

      // Nexus Arabic
      nexus: {
        title: 'ألاريس نيكسوس (Alaris Nexus)',
        category: '02 // منصة التجارة والمبيعات الموحدة',
        tagline: 'كل حاجة بتبيعها في مكان واحد قوي.',
        desc: 'منصة تجارة إلكترونية ومبيعات حديثة مصممة لإدارة المنتجات، الأوردرات، والعملاء، والمدفوعات والمخزون بكفاءة عالية وسرعة خيالية.',
        subline: 'محرك مبيعات سريع وشبكة إدارة مخزون متكاملة',
        pills: ['كتالوج مبيعات موحد', 'دفع إلكتروني سريع', 'مزامنة المخزون لحظيًا'],
        stats: [
          { label: 'طاقة الأوردرات', val: '+٥٠ ألف/يومياً' },
          { label: 'سرعة الدفع', val: 'أقل من ثانية' },
          { label: 'مزامنة المنتجات', val: 'فورية' },
        ],
        ctaTry: 'جرّب المنتج',
      },

      // Orbit Arabic
      orbit: {
        title: 'ألاريس أوربت (Alaris Orbit)',
        category: '03 // إدارة القاعات والخزينة المالية المباشرة',
        tagline: 'القدرات والإمكانيات الرئيسية',
        intro: 'صُمم النظام من الصفر لضمان سهولة تشغيل القاعات ودقة السجلات المالية ومؤشرات الخزينة المباشرة.',
        features: [
          {
            title: 'إدارة وتتبع الحجوزات',
            desc: 'جدولة حجوزات القاعات والمواقع مع متابعة بيانات العملاء وحالات الحجز (مؤكد، مكتمل، ملغى) وفحص التوفر لمنع التعارض.',
          },
          {
            title: 'المصروفات والسجلات المالية',
            desc: 'تسجيل وتصنيف التكاليف التشغيلية بجانب الإيرادات وتتبع صافي الأرباح والخسائر ونسب هامش الربح مباشرة.',
          },
          {
            title: 'إدارة وتخصيص رأس المال',
            desc: 'إدارة ضخ الاستثمارات ورأس المال، تتبع احتياطيات السيولة، ومراقبة توزيع الأصول ورصيد الخزينة المتاح.',
          },
          {
            title: 'التقارير والتحليلات المؤتمتة',
            desc: 'إنشاء وتصدير التقارير المالية بصيغ PDF و Excel باللغتين العربية والإنجليزية مع تطبيق صلاحيات أمان الأدوار.',
          },
        ],
        overviewHeading: 'نظرة عامة على المنصة',
        overviewSub: 'صُمم لتحقيق التميز التشغيلي',
        overviewDesc:
          'تم تصميم منصة ألاريس أوربيت بواسطة شركة Alaris Space للربط الكامل بين إدارة الحجوزات والتحليلات المالية المباشرة، بدلاً من استخدام أدوات منفصلة، توفر المنصة واجهة مجمعة تُحدث السجلات المالية تلقائياً.',
        specs: [
          { label: 'واجهة برمجة كاملة', val: 'خادم ASP.NET Core REST' },
          { label: 'قاعدة بيانات علاقات', val: 'SQL Server وحماية السجلات' },
          { label: 'صلاحيات الأدوار', val: 'تحكم مسؤول ومدير النظام' },
        ],
        ctaTry: 'جرّب المنتج',
        ctaInquire: 'الاستفسار عن هذا المنتج',
      },

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
