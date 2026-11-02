export interface PodcastChapter {
  id: string;
  timeSeconds: number;
  timeFormatted: string;
  title: {
    fr: string;
    ar: string;
  };
  description: {
    fr: string;
    ar: string;
  };
}

export interface PodcastEpisodeData {
  title: {
    fr: string;
    ar: string;
  };
  subtitle: {
    fr: string;
    ar: string;
  };
  duration: string;
  durationSeconds: number;
  src: string;
  hosts: {
    name: string;
    role: { fr: string; ar: string };
  }[];
  chapters: PodcastChapter[];
  narrationScript: {
    fr: string;
    ar: string;
  };
  keyHighlights: {
    fr: string;
    ar: string;
  }[];
  notebookLmUrl?: string;
}

export const DENTAL_PODCAST_DATA: PodcastEpisodeData = {
  title: {
    fr: "Épisode Spécial : L'Écosystème Digital Tout-en-Un pour Chirurgiens-Dentistes",
    ar: "الحلقة الاستثنائية: المنظومة الشاملة لعيادات وجراحي الأسنان بالمغرب",
  },
  subtitle: {
    fr: "Analyse stratégique audio : Comment libérer 15h/semaine et dominer Google Maps & WhatsApp pour 2000 DH sans abonnement.",
    ar: "تحليل استراتيجي صوتي مركز: كيف توفر 15 ساعة أسبوعياً وتتصدر خرائط جوجل وتلغي أعباء السكرتارية بـ 2000 درهم فقط بدون اشتراك شهري.",
  },
  duration: "03:03",
  durationSeconds: 183,
  src: "/audio/podcast-dental-mastery.mp3",
  hosts: [
    {
      name: "سارة (Sarah)",
      role: { fr: "Consultante Stratégie Dentaire", ar: "مستشارة استراتيجيات طب الأسنان" },
    },
    {
      name: "كريم (Karim)",
      role: { fr: "Analyste Systèmes & Digital", ar: "محلل المنظومات والتحول الرقمي" },
    },
  ],
  chapters: [
    {
      id: "ch1",
      timeSeconds: 0,
      timeFormatted: "00:00",
      title: {
        fr: "Introduction : Le Défi du Temps & Le Bâtiment Numérique",
        ar: "المقدمة: معضلة الوقت الضائع والباب الرقمي المكسور",
      },
      description: {
        fr: "Pourquoi 53% des patients quittent un site trop lent et comment y remédier.",
        ar: "لماذا يغادر 53% من المرضى المواقع البطيئة قبل قراءة اسم الطبيب.",
      },
    },
    {
      id: "ch2",
      timeSeconds: 48,
      timeFormatted: "00:48",
      title: {
        fr: "Pilier 1 : Site Ultra-Rapide (0.8s) & Triage Interactif",
        ar: "الركيزة 1: الموقع فائق السرعة (0.8 ثانية) والتشخيص التفاعلي",
      },
      description: {
        fr: "Bouton d'urgence, diagnostic guidé en 3 clics et 3 canaux de réservation.",
        ar: "نظام فرز أولي ذكي في 3 خطوات مع 3 خيارات حجز فورية (هاتف، نموذج، واتساب).",
      },
    },
    {
      id: "ch3",
      timeSeconds: 85,
      timeFormatted: "01:25",
      title: {
        fr: "Pilier 2 & 3 : SEO Google Maps, Plan 52 Semaines & WhatsApp",
        ar: "الركيزة 2 و 3: سيو خرائط جوجل، خطة 52 أسبوعاً وأتمتة الواتساب",
      },
      description: {
        fr: "Économiser 15h/semaine avec la banque de 20 réponses types WhatsApp.",
        ar: "توفير 15 ساعة عمل أسبوعياً عبر بنك ردود الواتساب وتصدر خرائط جوجل.",
      },
    },
    {
      id: "ch4",
      timeSeconds: 125,
      timeFormatted: "02:05",
      title: {
        fr: "Pilier 4 & Offre : Carte DentaLink & Pack 2000 DH TTC",
        ar: "الركيزة 4 والخاتمة: بطاقة DentaLink وعرض 2000 درهم بدون اشتراكات",
      },
      description: {
        fr: "Carte NFC & QR Code, nom de domaine et hébergement offerts sans renouvellement, 0 DH d'abonnement.",
        ar: "حفظ جهة الاتصال بنقرة واحدة، استضافة ونطاق مجاناً، والدفع بعد المعاينة والرضا الكامل.",
      },
    },
  ],
  narrationScript: {
    ar: "سارة: دعونا نبدأ هذا التحليل الشامل اليوم بتخيل بسيط. نحن في عالم طب الأسنان نبحث دائماً عن الدقة المتناهية. المريض يأتي بألم، نلتقط صورة أشعة، نشير إلى الشاشة ونقول المشكلة هنا تماماً. كريم: بالضبط، دقة هندسية إن صح التعبير. سارة: صحيح، لكن بمجرد أن نخرج من غرفة العلاج وننظر إلى الجانب الإداري والتسويقي للعيادة، المشهد يختلف جذرياً ونواجه فوضى إدارية. ولهذا السبب نحلل منظومة Dental Branding Pro التي تعالج الباب الرقمي المكسور وتوفر موقعاً يفتح في 0.8 ثانية مع تشخيص تفاعلي وأتمتة كاملة للواتساب توفر 15 ساعة أسبوعياً وبطاقة DentaLink الذكية بعرض 2000 درهم فقط بدون أي اشتراك شهري.",
    fr: "Bienvenue sur le podcast officiel Dental Branding Pro : l'écosystème digital tout-en-un pour chirurgiens-dentistes au Maroc. Découvrez comment libérer 15 heures par semaine, automatiser vos réservations WhatsApp, dominer le SEO Google Maps et fidéliser vos patients avec la carte DentaLink pour seulement 2 000 DH en paiement unique sans abonnement.",
  },
  keyHighlights: [
    {
      fr: "⚡ 15 heures de gestion administrative et réponses répétitives économisées chaque semaine.",
      ar: "⚡ توفير ما يزيد عن 15 ساعة أسبوعياً من الإجابات المكررة والأعمال الإدارية المرهقة.",
    },
    {
      fr: "🎯 Positionnement dans le Top 3 local sur Google Maps pour les chirurgiens-dentistes.",
      ar: "🎯 الصعود ضمن المراكز الثلاثة الأولى (Top 3) في عمليات البحث المحلية على Google Maps.",
    },
    {
      fr: "💬 Scénarios WhatsApp testés : réduction de 70% des questions sans suite.",
      ar: "💬 سيناريوهات ردود واتساب احترافية تقلل الاستفسارات غير الجادة بنسبة 70%.",
    },
    {
      fr: "💎 Tarif unique 2000 DH sans abonnement récurrent — Rentabilisé dès le 1er patient.",
      ar: "💎 استثمار لمرة واحدة بقيمة 2000 درهم فقط بدون اشتراك سنوي — يُسترد مع أول مريض.",
    },
  ],
};
