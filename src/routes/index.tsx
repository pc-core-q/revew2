import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutTemplate,
  Settings2,
  Headphones,
  Rocket,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Lock,
  Store,
  CheckCircle2,
  Users,
  Award,
  Zap,
  ShoppingBag,
  Star,
  Quote,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useSiteData } from "@/lib/site-store";
import { useReveal } from "@/hooks/use-reveal";
import { AdminPanel } from "@/components/site/AdminPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "متجرك الرقمي — تصميم وبرمجة متاجر إلكترونية احترافية" },
      {
        name: "description",
        content: "ننقل تجارتك إلى العالم الرقمي بمتاجر إلكترونية فائقة السرعة ومتكاملة لزيادة مبيعاتك.",
      },
      { property: "og:title", content: "متجرك الرقمي — متاجر إلكترونية جاهزة" },
      {
        property: "og:description",
        content: "حلول متكاملة للتجارة الإلكترونية لأصحاب الأنشطة والمحلات التجارية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SERVICES = [
  { icon: LayoutTemplate, title: "واجهة احترافية", text: "تصميم عصري وجذاب وسريع جداً على كافة الهواتف." },
  { icon: Settings2, title: "لوحة تحكم سهلة", text: "أدر منتجاتك وطلباتك بضغطة زر دون الحاجة لأي خبرة تقنية." },
  { icon: Headphones, title: "دعم فني وتدريب", text: "نتابع معك خطوة بخطوة وندربك على إدارة متجرك بالكامل." },
  { icon: Rocket, title: "إطلاق سريع", text: "متجرك جاهز للبيع واستقبال الطلبات خلال أيام قليلة." },
  { icon: ShieldCheck, title: "أمان وموثوقية", text: "حماية تامة لبياناتك وقواعد بيانات متجرك وعملائك." },
  { icon: TrendingUp, title: "زيادة المبيعات", text: "تجربة شراء سلسة تقضي على تردد الزبون وتضاعف معدل التحويل." },
];

const TESTIMONIALS = [
  {
    name: "متجر زينة للأزياء",
    role: "تجارة ملابس",
    feedback: "السرعة وتجربة الطلب السلسة فرقت معنا جداً، زبائننا لاحظوا الفرق والمبيعات زادت من أول أسبوعين.",
    stars: 5,
  },
  {
    name: "بيت العطور",
    role: "عطور ومستحضرات",
    feedback: "تصميم أنيق ومرتب ولوحة تحكم مريحة لإدارة الطلبات. الدعم الفني كان متعاوناً وسريعاً بأي تعديل.",
    stars: 5,
  },
  {
    name: "مركز الرواد للإلكترونيات",
    role: "ملحقات هواتف وأجهزة",
    feedback: "أفضل استثمار سويناه لعملنا، نقلنا من الاعتماد على رسائل الخاص غير المنظمة إلى نظام طلبات دقيق وسهل.",
    stars: 5,
  },
];

function Index() {
  const { texts, projects, saveTexts, addProject, removeProject } = useSiteData();
  const [adminOpen, setAdminOpen] = useState(false);
  useReveal([projects.length]);

  const whatsappLink = `https://wa.me/${texts.whatsappNumber || "9647700000000"}?text=${encodeURIComponent(
    "مرحباً، أود الاستفسار عن تفاصيل تصميم متجر إلكتروني معك."
  )}`;

  const getPackageOrderLink = (packageName: string) => {
    return `https://wa.me/${texts.whatsappNumber || "9647700000000"}?text=${encodeURIComponent(
      `مرحباً، أود حجز والتحدث حول "${packageName}".`
    )}`;
  };

  const TIERS = [
    {
      name: "باقة الانطلاق",
      price: texts.priceStarter || "150$",
      desc: "الخيار الأمثل للمشاريع الناشئة ومتاجر الإنستغرام الراغبة بالانتقال للرقمية.",
      features: [
        "واجهة متجر سريعة لمنتجات محددة",
        "تكامل مباشر مع واتساب لإتمام الشراء",
        "تصميم متوافق مع كافة الهواتف",
        "استضافة مجانية عالية الاستقرار",
        "تسليم سريع خلال 3-5 أيام",
      ],
      popular: false,
    },
    {
      name: "الباقة الاحترافية",
      price: texts.pricePro || "300$",
      desc: "الحل الأكثر طلباً للمحلات والعلامات التجارية لنمو حقيقي ومبيعات مضاعفة.",
      features: [
        "منتجات وتصنيفات غير محدودة",
        "لوحة تحكم كاملة لإدارة المخزون والمبيعات",
        "ربط بوابات الدفع الإلكتروني المتاحة",
        "إشعارات فورية بالطلبات الجديدة",
        "دعم فني متواصل وتدريب كامل بالفيديو",
      ],
      popular: true,
    },
    {
      name: "باقة مخصصة",
      price: texts.priceCustom || "حسب الطلب",
      desc: "للمنصات ذات المتطلبات المحددة والأنظمة الكبيرة.",
      features: [
        "برمجة وهيكلة مخصصة بالكامل",
        "تكامل مع برامج المحاسبة والفواتير",
        "أداء فائق وسيرفرات مخصصة",
        "تطبيقات هواتف (اختياري)",
        "خطة صيانة ومتابعة دورية",
      ],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* الهيدر */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="#top" className="flex items-center gap-2 text-lg font-bold text-primary">
            <Store className="h-6 w-6" /> {texts.brand}
          </a>
          <div className="hidden gap-6 text-sm font-medium md:flex">
            {[
              ["#about", "من نحن"],
              ["#services", "خدماتنا"],
              ["#pricing", "الأسعار والباقات"],
              ["#portfolio", "أعمالنا"],
              ["#testimonials", "آراء العملاء"],
              ["#contact", "تواصل معنا"],
            ].map(([h, l]) => (
              <a key={h} href={h} className="text-muted-foreground transition hover:text-primary">
                {l}
              </a>
            ))}
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5"
          >
            تواصل معنا
          </a>
        </nav>
      </header>

      {/* قسم الواجهة (Hero) */}
      <section id="top" className="bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="reveal space-y-6 text-center md:text-right">
            <span className="inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
              متاجر إلكترونية جاهزة وسريعة
            </span>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              <span className="text-gradient">{texts.heroTitle}</span>
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground">{texts.heroDescription}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-gradient-primary px-8 py-3.5 text-lg font-bold text-primary-foreground shadow-lift transition hover:-translate-y-1"
              >
                {texts.heroCta}
              </a>
              <a
                href="#pricing"
                className="inline-block rounded-full border border-border bg-card px-8 py-3.5 text-lg font-bold text-foreground shadow-soft transition hover:bg-muted"
              >
                عرض الباقات
              </a>
            </div>
          </div>
          <div className="reveal">
            <img
              src={heroImg}
              alt="متجر إلكتروني احترافي"
              width={1280}
              height={1024}
              fetchPriority="high"
              className="float-slow w-full rounded-3xl shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* قسم الإحصائيات والأرقام */}
      <section className="border-y bg-card/60 py-10 backdrop-blur-sm">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          <div className="reveal flex flex-col items-center p-4 text-center">
            <ShoppingBag className="mb-2 h-7 w-7 text-primary" />
            <div className="text-3xl font-extrabold tracking-tight md:text-4xl">{texts.statsProjects || "+15"}</div>
            <div className="mt-1 text-sm text-muted-foreground">متجر تم إطلاقه</div>
          </div>
          <div className="reveal flex flex-col items-center p-4 text-center">
            <Users className="mb-2 h-7 w-7 text-primary" />
            <div className="text-3xl font-extrabold tracking-tight md:text-4xl">{texts.statsVisitors || "+2,500"}</div>
            <div className="mt-1 text-sm text-muted-foreground">زيارة ومشتري مسجل</div>
          </div>
          <div className="reveal flex flex-col items-center p-4 text-center">
            <Award className="mb-2 h-7 w-7 text-primary" />
            <div className="text-3xl font-extrabold tracking-tight md:text-4xl">{texts.statsSatisfaction || "100%"}</div>
            <div className="mt-1 text-sm text-muted-foreground">نسبة رضا وتوصية</div>
          </div>
          <div className="reveal flex flex-col items-center p-4 text-center">
            <Zap className="mb-2 h-7 w-7 text-primary" />
            <div className="text-3xl font-extrabold tracking-tight md:text-4xl">{texts.statsUptime || "99.9%"}</div>
            <div className="mt-1 text-sm text-muted-foreground">استقرار وسرعة قياسية</div>
          </div>
        </div>
      </section>

      {/* قسم من نحن */}
      <section id="about" className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="reveal space-y-5">
          <h2 className="text-3xl font-bold md:text-4xl">{texts.aboutTitle}</h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-gradient-primary" />
          <p className="text-lg leading-loose text-muted-foreground">{texts.aboutText}</p>
        </div>
      </section>

      {/* قسم الخدمات */}
      <section id="services" className="bg-sky py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal mb-12 text-center text-3xl font-bold md:text-4xl">{texts.servicesTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="reveal group rounded-2xl border bg-card p-7 transition duration-300 hover:-translate-y-2 hover:shadow-lift"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gradient-primary p-3 text-primary-foreground transition group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{s.title}</h3>
                <p className="text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم باقات الأسعار (تعديل مباشر من الأدمن) */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
        <div className="reveal mb-14 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">باقات إنشاء المتاجر</h2>
          <p className="mt-3 text-muted-foreground">اختر الباقة المناسبة لحجم تجارتك وابدأ البيع فوراً</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`reveal relative flex flex-col justify-between rounded-3xl border p-8 transition duration-300 ${
                tier.popular
                  ? "border-primary bg-card shadow-lift ring-2 ring-primary/50 md:-translate-y-2"
                  : "border-border bg-card/60 hover:shadow-soft"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3.5 right-1/2 translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-sm">
                  الأكثر طلباً
                </span>
              )}
              <div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-primary">{tier.price}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
                <div className="my-6 h-px w-full bg-border" />
                <ul className="space-y-3.5 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={getPackageOrderLink(tier.name)}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 block w-full rounded-xl py-3 text-center font-bold transition ${
                  tier.popular
                    ? "bg-gradient-primary text-primary-foreground shadow-lift hover:opacity-90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                طلب هذه الباقة
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* قسم الأعمال والنماذج (محدد بـ 4-5 مشاريع سريعة) */}
      <section id="portfolio" className="bg-sky py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal mb-12 text-center text-3xl font-bold md:text-4xl">{texts.portfolioTitle}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal group block overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-2 hover:shadow-lift"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="flex items-center justify-between text-lg font-bold">
                    {p.name}
                    <ExternalLink className="h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* قسم آراء العملاء */}
      <section id="testimonials" className="mx-auto max-w-6xl px-4 py-20">
        <div className="reveal mb-14 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">آراء وتجارب أصحاب المتاجر</h2>
          <p className="mt-3 text-muted-foreground">ثقة عملائنا هي أساس استمرارنا ونجاحنا</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="reveal relative flex flex-col justify-between rounded-2xl border bg-card p-7 shadow-soft"
            >
              <Quote className="absolute left-6 top-6 h-8 w-8 text-primary/10" />
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">"{t.feedback}"</p>
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="font-bold text-foreground">{t.name}</div>
                <div className="text-xs text-primary">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* الفوتر */}
      <footer id="contact" className="bg-gradient-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-2xl font-bold">
              <Store className="h-6 w-6" /> {texts.brand}
            </h3>
            <p className="opacity-90">{texts.heroTitle}</p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5" />
              <span dir="ltr">{texts.contactPhone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5" />
              {texts.contactEmail}
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-5 w-5" />
              {texts.contactAddress}
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-primary-foreground/20 py-4 text-sm opacity-80">
          © {new Date().getFullYear()} {texts.brand}. جميع الحقوق محفوظة.
          <button
            onClick={() => setAdminOpen(true)}
            aria-label="لوحة التحكم"
            className="opacity-30 transition hover:opacity-100"
          >
            <Lock className="h-3 w-3" />
          </button>
        </div>
      </footer>

      {/* زر واتساب العائم السريع */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lift transition hover:scale-105 hover:bg-[#20ba5a]"
      >
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
        </svg>
        <span className="hidden font-bold sm:inline text-sm">تواصل واتساب</span>
      </a>

      {/* لوحة التحكم */}
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        texts={texts}
        projects={projects}
        saveTexts={saveTexts}
        addProject={addProject}
        removeProject={removeProject}
      />
    </div>
  );
}
