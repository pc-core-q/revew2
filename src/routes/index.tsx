import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutTemplate, Settings2, Headphones, Rocket, ShieldCheck, TrendingUp, ExternalLink, Phone, Mail, MapPin, Lock, Store, Menu, X } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useSiteData } from "@/lib/site-store";
import { useReveal } from "@/hooks/use-reveal";
import { AdminPanel } from "@/components/site/AdminPanel";
import { PlansCarousel } from "@/components/site/PlansCarousel";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "متجرك الرقمي — متاجر إلكترونية جاهزة" },
      { name: "description", content: "ننقل تجارتك إلى العالم الرقمي بمتاجر إلكترونية احترافية جاهزة للاستخدام." },
      { property: "og:title", content: "متجرك الرقمي — متاجر إلكترونية جاهزة" },
      { property: "og:description", content: "متاجر إلكترونية احترافية جاهزة لأصحاب المتاجر المحلية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SERVICES = [
  { icon: LayoutTemplate, title: "واجهة احترافية", text: "تصميم عصري وجذاب يعمل على جميع الأجهزة." },
  { icon: Settings2, title: "لوحة تحكم سهلة", text: "أدر منتجاتك وطلباتك بضغطة زر دون خبرة تقنية." },
  { icon: Headphones, title: "دعم فني", text: "فريق دعم متواجد لمساعدتك في كل خطوة." },
  { icon: Rocket, title: "إطلاق سريع", text: "متجرك جاهز للبيع خلال أيام قليلة." },
  { icon: ShieldCheck, title: "أمان وموثوقية", text: "حماية لبياناتك وبيانات عملائك." },
  { icon: TrendingUp, title: "زيادة المبيعات", text: "أدوات تسويق تساعدك على الوصول لعملاء أكثر." },
];

const NAV_LINKS = [
  ["#about", "من نحن"],
  ["#services", "خدماتنا"],
  ["#plans", "الباقات"],
  ["#portfolio", "أعمالنا"],
  ["#contact", "تواصل معنا"],
] as const;

function Index() {
  const {
    texts,
    projects,
    plans,
    saveTexts,
    addProject,
    updateProject,
    removeProject,
    savePlan,
    removePlan,
    movePlan,
    setFeaturedPlan,
  } = useSiteData();
  const [adminOpen, setAdminOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  return (
    <div className="min-h-dvh overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:py-4">
          <a href="#top" className="flex min-w-0 items-center gap-2 text-lg font-bold text-primary">
            <Store className="h-6 w-6 shrink-0" /> <span className="truncate">{texts.brand}</span>
          </a>
          <div className="hidden gap-6 text-sm font-medium md:flex">
            {NAV_LINKS.map(([h, l]) => (
              <a key={h} href={h} className="text-muted-foreground transition hover:text-primary">{l}</a>
            ))}
          </div>
          <a href="#contact" className="hidden rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 md:inline-block">تواصل معنا</a>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-muted md:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {menuOpen && (
          <div id="mobile-menu" className="border-t bg-background md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              {NAV_LINKS.filter(([h]) => h !== "#contact").map(([h, l]) => (
                <a key={h} href={h} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3.5 text-base font-medium hover:bg-muted">{l}</a>
              ))}
              <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-2 rounded-xl bg-gradient-primary px-4 py-3.5 text-center text-base font-bold text-primary-foreground">تواصل معنا</a>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="bg-gradient-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:py-14 md:grid-cols-2 md:py-24">
          <div className="reveal space-y-5 text-center md:space-y-6 md:text-right">
            <span className="inline-block rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">متاجر إلكترونية جاهزة</span>
            <h1 className="text-3xl font-extrabold leading-snug sm:text-4xl md:text-5xl lg:text-6xl">
              <span className="text-gradient">{texts.heroTitle}</span>
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{texts.heroDescription}</p>
            <a href="#contact" className="block w-full rounded-full bg-gradient-primary px-8 py-3.5 text-center text-lg font-bold sm:inline-block sm:w-auto text-primary-foreground shadow-lift transition hover:-translate-y-1">{texts.heroCta}</a>
          </div>
          <div className="reveal">
            <img src={heroImg} alt="متجر إلكتروني على الحاسوب والهاتف" width={1280} height={1024} fetchPriority="high" className="w-full rounded-2xl shadow-lift md:float-slow md:rounded-3xl" />
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-4xl px-4 py-12 text-center md:py-20">
        <div className="reveal space-y-5">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{texts.aboutTitle}</h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-gradient-primary" />
          <p className="text-base leading-loose text-muted-foreground md:text-lg">{texts.aboutText}</p>
        </div>
      </section>

      <section id="services" className="bg-sky py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="reveal mb-8 text-center text-2xl font-bold sm:text-3xl md:mb-12 md:text-4xl">{texts.servicesTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.title} className="reveal group flex items-start gap-4 rounded-2xl border bg-card p-5 transition duration-300 hover:-translate-y-2 hover:shadow-lift sm:block sm:p-7">
                <div className="inline-flex shrink-0 rounded-xl bg-gradient-primary p-3 sm:mb-4 text-primary-foreground transition group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold sm:mb-2 sm:text-xl">{s.title}</h3>
                  <p className="text-sm text-muted-foreground sm:text-base">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {plans.length > 0 && (
        <section id="plans" className="py-12 md:py-20">
          <div className="reveal mx-auto mb-4 max-w-6xl space-y-3 px-4 text-center md:mb-6">
            <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">{texts.plansTitle}</h2>
            {texts.plansSubtitle && <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">{texts.plansSubtitle}</p>}
          </div>
          <PlansCarousel plans={plans} />
        </section>
      )}

      <section id="portfolio" className="bg-sky">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <h2 className="reveal mb-8 text-center text-2xl font-bold sm:text-3xl md:mb-12 md:text-4xl">{texts.portfolioTitle}</h2>
        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="reveal group block overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-2 hover:shadow-lift active:scale-[0.98]">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {p.image && <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />}
              </div>
              <div className="p-4 md:p-5">
                <h3 className="flex items-center justify-between gap-2 text-lg font-bold">
                  {p.name}
                  <ExternalLink className="h-4 w-4 shrink-0 text-primary md:opacity-0 md:transition md:group-hover:opacity-100" />
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              </div>
            </a>
          ))}
        </div>
        </div>
      </section>

      <footer id="contact" className="bg-gradient-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2 md:gap-8 md:py-14">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-2xl font-bold"><Store className="h-6 w-6" /> {texts.brand}</h3>
            <p className="opacity-90">{texts.heroTitle}</p>
          </div>
          <ul className="space-y-1">
            <li>
              <a href={`tel:${texts.contactPhone.replace(/[^\d+]/g, "")}`} className="flex min-h-12 items-center gap-3 rounded-xl px-2 -mx-2 active:bg-primary-foreground/10">
                <Phone className="h-5 w-5 shrink-0" /><span dir="ltr">{texts.contactPhone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${texts.contactEmail}`} className="flex min-h-12 items-center gap-3 rounded-xl px-2 -mx-2 active:bg-primary-foreground/10">
                <Mail className="h-5 w-5 shrink-0" /><span className="break-all">{texts.contactEmail}</span>
              </a>
            </li>
            <li>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(texts.contactAddress)}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-xl px-2 -mx-2 active:bg-primary-foreground/10">
                <MapPin className="h-5 w-5 shrink-0" />{texts.contactAddress}
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-2 border-t border-primary-foreground/20 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-center text-sm opacity-80">
          © {new Date().getFullYear()} {texts.brand}. جميع الحقوق محفوظة.
          <button onClick={() => setAdminOpen(true)} aria-label="لوحة التحكم" className="inline-flex h-11 w-11 items-center justify-center opacity-30 transition hover:opacity-100">
            <Lock className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>

      <WhatsAppButton number={texts.whatsappNumber} message={texts.whatsappMessage} />

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} texts={texts} projects={projects} saveTexts={saveTexts} addProject={addProject} updateProject={updateProject}
        removeProject={removeProject}
        plans={plans}
        savePlan={savePlan}
        removePlan={removePlan}
        movePlan={movePlan}
        setFeaturedPlan={setFeaturedPlan}
      />
    </div>
  );
}
