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
        content: "نصمم لك متجراً إلكترونياً سريعاً ومتكاملاً لإطلاق تجارتك وزيادة مبيعاتك خلال أيام.",
      },
      { property: "og:title", content: "متجرك الرقمي — متاجر إلكترونية جاهزة" },
      {
        property: "og:description",
        content: "حلول التجارة الإلكترونية السريعة لأصحاب الأنشطة والمحلات التجارية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SERVICES = [
  { icon: LayoutTemplate, title: "واجهة احترافية", text: "تصميم عصري وجذاب وسريع جداً على شاشات الهواتف." },
  { icon: Settings2, title: "لوحة تحكم سهلة", text: "أدر منتجاتك وطلباتك بضغطة زر دون أي خبرة برمجية." },
  { icon: Headphones, title: "دعم فني وتدريب", text: "نتابع معك خطوة بخطوة وندربك على إدارة متجرك بالكامل." },
  { icon: Rocket, title: "إطلاق سريع", text: "متجرك جاهز للبيع واستقبال الطلبات خلال أيام قليلة." },
  { icon: ShieldCheck, title: "أمان وموثوقية", text: "حماية تامة لبياناتك وقواعد بيانات متجرك وعملائك." },
  { icon: TrendingUp, title: "زيادة المبيعات", text: "تجربة شراء سلسة تقضي على تردد الزبون وتضاعف المبيعات." },
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
  const { texts, projects, plans, loading, saveTexts, addProject, removeProject, addPlan, removePlan } = useSiteData();
  const [adminOpen, setAdminOpen] = useState(false);
  
  // إعادة تشغيل المراقبة كلما تغير عدد الباقات أو المشاريع
  useReveal([projects.length, plans.length, loading]);

  const whatsappLink = `https://wa.me/${texts.whatsappNumber || "9647700000000"}?text=${encodeURIComponent(
    "مرحباً، أود الاستفسار عن تفاصيل تصميم متجر إلكتروني معك."
  )}`;

  const getPackageOrderLink = (packageName: string) => {
    return `https://wa.me/${texts.whatsappNumber || "9647700000000"}?text=${encodeURIComponent(
      `مرحباً، أود حجز والتحدث حول "${packageName}".`
    )}`;
  };

  return (
    <div className="min-h-screen overflow-x-hidden text-right">
      {/* الهيدر */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
          <a href="#top" className="flex items-center gap-2 text-base font-bold text-primary sm:text-lg">
            <Store className="h-5 w-5 sm:h-6 sm:w-6" /> {texts.brand}
          </a>
          <div className="hidden gap-5 text-sm font-medium md:flex">
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
            className="rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 sm:px-5 sm:py-2 sm:text-sm"
          >
            تواصل معنا
          </a>
        </nav>
      </header>

      {/* قسم الواجهة (Hero) */}
      <section id="top" className="bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-20">
          <div className="reveal space-y-4 text-center md:text-right">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground sm:text-sm">
              متاجر إلكترونية جاهزة وسريعة
            </span>
            <h1 className="text-3xl font-extrabold leading-snug md:text-4xl lg:text-5xl">
              <span className="text-gradient">{texts.heroTitle}</span>
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              {texts.heroDescription}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-gradient-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lift transition hover:-translate-y-0.5 sm:px-8 sm:py-3 sm:text-base"
              >
                {texts.heroCta}
              </a>
              <a
                href="#pricing"
                className="inline-block rounded-full border border-border bg-card px-6 py-2.5 text-sm font-bold text-foreground shadow-soft transition hover:bg-muted sm:px-8 sm:py-3 sm:text-base"
              >
                عرض الباقات
              </a>
            </div>
          </div>
          <div className="reveal mt-2 md:mt-0">
            <img
              src={heroImg}
              alt="متجر إلكتروني احترافي"
              width={1280}
              height={1024}
              fetchPriority="high"
              className="float-slow mx-auto w-full max-w-md rounded-2xl shadow-lift md:max-w-none md:rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* قسم الإحصائيات والأرقام */}
      <section className="border-y bg-card/60 py-6 backdrop-blur-sm sm:py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4">
          <div className="reveal flex flex-col items-center p-2 text-center">
            <ShoppingBag className="mb-1.5 h-5 w-5 text-primary sm:h-6 sm:w-6" />
            <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{texts.statsProjects || "+15"}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">متجر تم إطلاقه</div>
          </div>
          <div className="reveal flex flex-col items-center p-2 text-center">
            <Users className="mb-1.5 h-5 w-5 text-primary sm:h-6 sm:w-6" />
            <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{texts.statsVisitors || "+2,500"}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">زيارة ومشتري مسجل</div>
          </div>
          <div className="reveal flex flex-col items-center p-2 text-center">
            <Award className="mb-1.5 h-5 w-5 text-primary sm:h-6 sm:w-6" />
            <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{texts.statsSatisfaction || "100%"}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">نسبة رضا وتوصية</div>
          </div>
          <div className="reveal flex flex-col items-center p-2 text-center">
            <Zap className="mb-1.5 h-5 w-5 text-primary sm:h-6 sm:w-6" />
            <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">{texts.statsUptime || "99.9%"}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">استقرار وسرعة قياسية</div>
          </div>
        </div>
      </section>

      {/* قسم من نحن */}
      <section id="about" className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16 md:py-20">
        <div className="reveal space-y-4">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{texts.aboutTitle}</h2>
          <div className="mx-auto h-1 w-12 rounded-full bg-gradient-primary sm:w-16" />
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg sm:leading-loose">
            {texts.aboutText}
          </p>
        </div>
      </section>

      {/* قسم الخدمات */}
      <section id="services" className="bg-sky py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-3xl md:text-4xl">
            {texts.servicesTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="reveal group rounded-2xl border bg-card p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-6"
              >
                <div className="mb-3 inline-flex rounded-xl bg-gradient-primary p-2.5 text-primary-foreground transition group-hover:scale-105">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1.5 text-lg font-bold">{s.title}</h3>
                <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم باقات الأسعار */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-10 sm:py-14 md:py-20">
        <div className="reveal mb-4 text-center sm:mb-8">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">باقات إنشاء المتاجر</h2>
          <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">اختر الباقة المناسبة لحجم تجارتك وابدأ البيع فوراً</p>

          {/* مؤشر السحب لهواتف والتابلت */}
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary md:hidden animate-pulse">
            <span>اسحب لمعاينة باقي الباقات</span>
            <span className="text-sm font-bold">←</span>
          </div>
        </div>

        {/* عرض البطاقات */}
        <div className="flex gap-3 overflow-x-auto px-1 pb-4 pt-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:p-0">
          {plans && plans.length > 0 ? (
            plans.map((tier) => (
              <div
                key={tier.id}
                className={`relative flex min-w-[78vw] max-w-[78vw] shrink-0 snap-center flex-col justify-between rounded-2xl border p-5 transition duration-300 sm:min-w-[320px] sm:max-w-none md:min-w-0 md:max-w-none md:p-6 ${
                  tier.popular
                    ? "border-primary bg-card shadow-lift ring-2 ring-primary/40 md:-translate-y-2"
                    : "border-border bg-card/70 hover:shadow-soft"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 right-6 rounded-full bg-gradient-primary px-3 py-0.5 text-[11px] font-bold text-primary-foreground shadow-sm">
                    الأكثر طلباً
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 border-b pb-4">
                    <div>
                      <h3 className="text-lg font-bold sm:text-xl">{tier.name}</h3>
                      {tier.description && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{tier.description}</p>
                      )}
                    </div>
                    <div className="text-left shrink-0">
                      <span className="text-2xl font-extrabold text-primary sm:text-3xl">{tier.price}</span>
                      <span className="mr-1 text-xs font-semibold text-muted-foreground">
                        {tier.currency === "IQD" || tier.currency === ("د.ع" as any) ? "د.ع" : "$"}
                      </span>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs sm:text-sm">
                    {tier.features && tier.features.length > 0 ? (
                      tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-neutral-700 dark:text-neutral-300 leading-snug">{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-muted-foreground">لا توجد مزايا مسجلة</li>
                    )}
                  </ul>
                </div>

                <a
                  href={getPackageOrderLink(tier.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 block w-full rounded-xl py-2.5 text-center text-xs font-bold transition sm:text-sm ${
                    tier.popular
                      ? "bg-gradient-primary text-primary-foreground shadow-lift hover:opacity-90"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  طلب هذه الباقة
                </a>
              </div>
            ))
          ) : (
            /* حالة الهيكل أثناء التحميل لتجنب المساحة الفارغة تماماً */
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex min-w-[78vw] max-w-[78vw] shrink-0 animate-pulse flex-col justify-between rounded-2xl border border-border bg-card/40 p-5 sm:min-w-[320px] md:min-w-0 md:max-w-none"
              >
                <div className="space-y-4">
                  <div className="h-6 w-1/2 rounded bg-muted"></div>
                  <div className="h-4 w-3/4 rounded bg-muted/60"></div>
                  <div className="h-20 w-full rounded bg-muted/40"></div>
                </div>
                <div className="mt-6 h-10 w-full rounded-xl bg-muted"></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* قسم الأعمال والنماذج */}
      <section id="portfolio" className="bg-sky py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-3xl md:text-4xl">
            {texts.portfolioTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {projects.map((p) => (
  <a
    key={p.id}
    href={p.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
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
                <div className="p-4 sm:p-5">
                  <h3 className="flex items-center justify-between text-base font-bold sm:text-lg">
                    {p.name}
                    <ExternalLink className="h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100" />
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{p.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* قسم آراء العملاء */}
      <section id="testimonials" className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20">
        <div className="reveal mb-10 text-center sm:mb-14">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">آراء وتجارب أصحاب المتاجر</h2>
          <p className="mt-2 text-xs text-muted-foreground sm:text-sm">ثقة عملائنا هي أساس استمرارنا ونجاحنا</p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="reveal relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft sm:p-6"
            >
              <Quote className="absolute left-4 top-4 h-6 w-6 text-primary/10 sm:left-6 sm:top-6 sm:h-8 sm:w-8" />
              <div>
                <div className="flex gap-1 text-amber-500 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-500 sm:h-4 sm:w-4" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">"{t.feedback}"</p>
              </div>
              <div className="mt-4 border-t pt-3 sm:mt-6 sm:pt-4">
                <div className="font-bold text-xs sm:text-sm text-foreground">{t.name}</div>
                <div className="text-[11px] sm:text-xs text-primary">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* الفوتر */}
      <footer id="contact" className="bg-gradient-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:py-12 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
              <Store className="h-5 w-5 sm:h-6 sm:w-6" /> {texts.brand}
            </h3>
            <p className="text-xs opacity-90 sm:text-sm">{texts.heroTitle}</p>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0" />
              <span dir="ltr">{texts.contactPhone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0" />
              {texts.contactEmail}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0" />
              {texts.contactAddress}
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-primary-foreground/20 py-3 text-xs opacity-80 sm:py-4">
          © {new Date().getFullYear()} {texts.brand}. جميع الحقوق محفوظة.
          <button
            onClick={() => setAdminOpen(true)}
            aria-label="لوحة التحكم"
            className="p-1 opacity-30 transition hover:opacity-100"
          >
            <Lock className="h-3 w-3" />
          </button>
        </div>
      </footer>

      {/* زر واتساب العائم */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل معنا عبر واتساب"
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2.5 text-white shadow-lift transition hover:scale-105 hover:bg-[#20ba5a] sm:bottom-6 sm:left-6 sm:px-4 sm:py-3"
      >
        <svg className="h-5 w-5 fill-current sm:h-6 sm:w-6" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.044c.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
        </svg>
        <span className="font-bold text-xs sm:text-sm">واتساب</span>
      </a>

      {/* لوحة التحكم */}
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        texts={texts}
        projects={projects}
        plans={plans}
        saveTexts={saveTexts}
        addProject={addProject}
        removeProject={removeProject}
        addPlan={addPlan}
        removePlan={removePlan}
      />
    </div>
  );
}
