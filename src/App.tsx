import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Infinity as InfinityIcon,
  LockKeyhole,
  Mail,
  MousePointerClick,
  PackageCheck,
  Pause,
  Play,
  Radio,
  ShieldCheck,
  Smartphone,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { faqItems } from "./seo-content";

const contactEndpoint = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined) ?? "/api/contact";

const steps = [
  {
    number: "01",
    icon: PackageCheck,
    title: "Recevez votre Biip",
    text: "La petite boîte arrive chez vous, prête à accueillir votre télécommande de portail.",
  },
  {
    number: "02",
    icon: Box,
    title: "Glissez la télécommande",
    text: "Placez-la dans la boîte. Le mécanisme appuie physiquement sur son bouton, comme vous le feriez.",
  },
  {
    number: "03",
    icon: Smartphone,
    title: "Ouvrez avec le téléphone",
    text: "Créez votre compte sur biip.fr/sign-up et partagez l’accès avec tous les téléphones utiles.",
  },
];

const assurances = [
  "Aucun changement sur le moteur du portail",
  "Aucune télécommande compatible à rechercher",
  "Votre installation actuelle reste intacte",
];

function App() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "missing-config">("idle");
  const [heroScene, setHeroScene] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;

    const updateScene = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = heroRef.current;
        if (!section) return;

        const compact = window.matchMedia("(max-width: 900px)").matches;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (compact || reducedMotion) {
          setHeroScene(3);
          return;
        }

        const availableScroll = section.offsetHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / availableScroll));
        setHeroScene(Math.min(3, Math.floor(progress * 4)));
      });
    };

    updateScene();
    window.addEventListener("scroll", updateScene, { passive: true });
    window.addEventListener("resize", updateScene);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScene);
      window.removeEventListener("resize", updateScene);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "biip-landing" }),
      });

      if (response.status === 503) {
        setStatus("missing-config");
        return;
      }
      if (!response.ok) throw new Error("Contact request failed");

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Biip, accueil">
          <Logo />
          <span>biip</span>
        </a>
        <nav aria-label="Navigation principale">
          <a href="#fonctionnement">Comment ça marche</a>
          <a href="#compatibilite">Compatibilité</a>
          <a href="#questions">Questions</a>
          <a href="#tarifs">Tarifs</a>
        </nav>
        <a className="button button-small button-dark" href="#contact">
          Je suis intéressé <ArrowRight aria-hidden="true" />
        </a>
      </header>

      <section className="hero-scroll" id="top" aria-labelledby="hero-title" ref={heroRef}>
        <div className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Ouvrez votre portail avec votre téléphone.</p>
            <h1 id="hero-title">Le boîtier universel.<br /><em>Pour votre portail.</em></h1>
            <p className="hero-intro">
              Biip transforme votre télécommande de portail en ouverture depuis votre téléphone. Le boîtier appuie
              physiquement à votre place : aucune copie de fréquence, aucun câblage et aucun changement d’installation.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Découvrir Biip <ArrowRight aria-hidden="true" />
              </a>
              <a className="text-link" href="#fonctionnement">
                Faites défiler pour voir <ArrowDown aria-hidden="true" />
              </a>
            </div>
            <div className="hero-trust">
              <span><CheckCircle2 /> Installation en 2 minutes</span>
              <span><CheckCircle2 /> Compatible avec votre portail</span>
            </div>
          </div>

          <div className="hero-visual">
            <ScrollDiagram scene={heroScene} />
          </div>
        </div>
      </section>

      <div className="proof-strip" aria-label="Points forts">
        <p><Radio /> 100% compatible</p>
        <p><LockKeyhole /> 100% sécurisé</p>
        <p><Zap /> Zéro travaux</p>
        <p><Users /> Accès illimités</p>
      </div>

      <VideoShowcase />

      <section className="section steps-section" id="fonctionnement" aria-labelledby="steps-title">
        <div className="section-heading centered">
          <p className="kicker">Simple comme biip</p>
          <h2 id="steps-title">De la boîte au portail<br />en trois petites étapes.</h2>
          <p>Pas besoin d’être bricoleur. Si vous savez poser une télécommande dans une boîte, vous savez installer Biip.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div className="step-icon"><step.icon aria-hidden="true" /></div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="compatibility" id="compatibilite" aria-labelledby="compatibility-title">
        <div className="compatibility-visual" aria-hidden="true">
          <div className="remote remote-one"><span /><span /></div>
          <div className="remote remote-two"><span /><span /><span /></div>
          <div className="remote remote-three"><span /></div>
          <div className="compatibility-ring"><Radio /></div>
          <p>Toutes les marques.<br />Toutes les fréquences.</p>
        </div>
        <div className="compatibility-copy">
          <p className="kicker kicker-light">Universel, pour de vrai</p>
          <h2 id="compatibility-title">Si votre télécommande ouvre le portail, Biip aussi.</h2>
          <p className="large-copy">
            Biip ne cherche pas à parler à votre portail. Il appuie simplement sur la télécommande que vous utilisez déjà.
            C’est ce qui le rend universel.
          </p>
          <ul>
            {assurances.map((item) => <li key={item}><Check /> {item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section access-section" aria-labelledby="access-title">
        <div className="access-copy">
          <p className="kicker">Une télécommande, autant de téléphones que nécessaire</p>
          <h2 id="access-title">Ouvrez à qui vous voulez.<br />Sans refaire de double.</h2>
          <p>
            Votre foyer grandit, un proche passe, un prestataire doit entrer ? Ajoutez simplement un accès. La télécommande
            physique reste en sécurité dans Biip.
          </p>
          <div className="feature-pills">
            <span><Users /> Accès illimités</span>
            <span><ShieldCheck /> Contrôle centralisé</span>
            <span><Wifi /> À distance</span>
          </div>
        </div>
        <PhoneDemo />
      </section>

      <section className="section faq-section" id="questions" aria-labelledby="faq-title">
        <div className="section-heading centered">
          <p className="kicker">Questions fréquentes</p>
          <h2 id="faq-title">Tout savoir sur le portail universel Biip.</h2>
          <p>
            Compatibilité, installation et partage des accès : les réponses essentielles avant d’ouvrir votre portail
            depuis votre téléphone.
          </p>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section pricing-section" id="tarifs" aria-labelledby="pricing-title">
        <div className="section-heading centered">
          <p className="kicker">Un prix simple. Pas de surprise.</p>
          <h2 id="pricing-title">Choisissez votre façon de dire biip.</h2>
        </div>
        <div className="pricing-grid">
          <article className="price-card">
            <div className="price-icon"><Radio /></div>
            <p className="plan-name">Biip mensuel</p>
            <p className="price"><strong>5€</strong><span>/ mois</span></p>
            <p>Pour profiter de Biip en toute liberté, sans engagement long terme.</p>
            <ul>
              <li><Check /> Votre boîte Biip incluse</li>
              <li><Check /> Téléphones illimités</li>
              <li><Check /> Accès à distance sécurisé</li>
            </ul>
            <a className="button button-outline" href="#contact">Choisir le mensuel <ChevronRight /></a>
          </article>
          <article className="price-card featured">
            <span className="popular">Le plus tranquille</span>
            <div className="price-icon"><InfinityIcon /></div>
            <p className="plan-name">Biip pour toujours</p>
            <p className="price"><strong>200€</strong><span>une fois</span></p>
            <p>Un seul paiement, puis votre portail reste connecté pour toujours.</p>
            <ul>
              <li><Check /> Votre boîte Biip incluse</li>
              <li><Check /> Téléphones illimités</li>
              <li><Check /> Aucun abonnement mensuel</li>
            </ul>
            <a className="button button-primary" href="#contact">Choisir pour toujours <ChevronRight /></a>
          </article>
        </div>
      </section>

      <section className="cta-section" id="contact" aria-labelledby="contact-title">
        <div>
          <p className="kicker kicker-light">Prêt à laisser la télécommande à la maison ?</p>
          <h2 id="contact-title">Votre portail n’attend plus que Biip.</h2>
          <p>Laissez-nous votre email. Nous vous recontactons pour vous présenter la boîte et préparer votre accès.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Votre adresse email</label>
          <div className="form-row">
            <div className="input-wrap"><Mail /><input id="email" name="email" type="email" autoComplete="email" placeholder="vous@email.fr" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
            <button className="button button-primary" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Envoi…" : "Je veux mon Biip"} <ArrowRight />
            </button>
          </div>
          <p className="form-status" aria-live="polite">
            {status === "success" && "Merci ! Votre demande a bien été envoyée."}
            {status === "error" && "Impossible d’envoyer la demande pour le moment."}
            {status === "missing-config" && "Le formulaire sera actif dès que le webhook Discord sera configuré."}
          </p>
        </form>
      </section>

      <footer>
        <a className="brand brand-light" href="#top"><Logo /> <span>biip</span></a>
        <p>Biip, le boîtier universel pour ouvrir votre portail avec votre téléphone.</p>
        <p>© {new Date().getFullYear()} Biip</p>
      </footer>
    </main>
  );
}

function Logo() {
  return <svg viewBox="0 0 40 40" role="img" aria-label="Logo Biip"><rect width="40" height="40" rx="12" fill="currentColor" /><path d="M10 20h4m4 0h4m4 0h4" stroke="white" strokeWidth="3.5" strokeLinecap="round" /><circle cx="20" cy="20" r="12.5" fill="none" stroke="white" strokeWidth="1.5" opacity=".35" /></svg>;
}

const sceneCopy = [
  ["La télécommande reste chez vous", "Installez-la simplement dans la boîte Biip."],
  ["Un appui depuis le téléphone", "Le grand bouton Biip remplace votre télécommande."],
  ["Biip appuie pour de vrai", "Le mécanisme déclenche votre télécommande physique."],
  ["Et le portail s’ouvre", "Sans câblage, sans travaux, sans incompatibilité."],
];

function ScrollDiagram({ scene }: { scene: number }) {
  return (
    <div className={`scroll-diagram scene-${scene}`} role="img" aria-label={`${sceneCopy[scene][0]}. ${sceneCopy[scene][1]}`}>
      <div className="diagram-topline">
        <span>Comment fonctionne Biip</span>
        <strong>0{scene + 1} / 04</strong>
      </div>
      <svg viewBox="0 0 720 520" aria-hidden="true">
        <defs>
          <pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#d7d8cf" />
          </pattern>
          <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#171914" floodOpacity=".14" />
          </filter>
        </defs>
        <rect width="720" height="520" rx="28" fill="#f8f7f1" />
        <rect width="720" height="520" rx="28" fill="url(#dot-grid)" />

        <g className="diagram-phone" filter="url(#soft-shadow)">
          <rect x="54" y="121" width="150" height="282" rx="28" fill="#171914" />
          <rect x="63" y="132" width="132" height="259" rx="21" fill="#fff" />
          <rect x="106" y="141" width="45" height="6" rx="3" fill="#171914" opacity=".18" />
          <text x="129" y="188" textAnchor="middle" className="svg-brand">biip</text>
          <circle className="phone-button-ring" cx="129" cy="276" r="58" fill="#eaf8cc" />
          <circle className="phone-button" cx="129" cy="276" r="46" fill="#c8ff57" />
          <text x="129" y="282" textAnchor="middle" className="svg-button-text">biip</text>
          <circle cx="129" cy="373" r="4" fill="#82b820" />
          <text x="129" y="360" textAnchor="middle" className="svg-small-text">Portail en ligne</text>
        </g>

        <path className="signal-path signal-left" d="M205 276 C245 276 248 276 283 276" />
        <path className="signal-path signal-right" d="M455 276 C495 276 504 276 535 276" />
        <circle className="signal-dot signal-dot-one" cx="235" cy="276" r="6" />
        <circle className="signal-dot signal-dot-two" cx="493" cy="276" r="6" />

        <g className="diagram-box" filter="url(#soft-shadow)">
          <path d="M286 185 L351 144 L446 181 L381 222 Z" fill="#3e4039" />
          <path d="M286 185 L381 222 L381 389 L286 350 Z" fill="#20221e" />
          <path d="M381 222 L446 181 L446 347 L381 389 Z" fill="#2c2e29" />
          <path d="M292 190 L351 154 L435 185 L377 215 Z" fill="#f1f0e8" />
          <g className="diagram-remote">
            <path d="M324 191 L352 174 L402 192 L374 210 Z" fill="#73766d" />
            <ellipse cx="353" cy="190" rx="8" ry="5" fill="#1c1d1a" />
            <ellipse cx="375" cy="198" rx="8" ry="5" fill="#1c1d1a" />
          </g>
          <g className="press-arm">
            <rect x="362" y="120" width="13" height="70" rx="6.5" fill="#c8ff57" />
            <circle cx="368.5" cy="193" r="9" fill="#171914" stroke="#c8ff57" strokeWidth="5" />
          </g>
          <text x="367" y="331" textAnchor="middle" className="box-logo">biip</text>
        </g>

        <g className="diagram-gate">
          <rect x="532" y="163" width="150" height="235" rx="5" fill="#ebeae3" stroke="#171914" strokeWidth="5" />
          <g className="gate-left">
            <rect x="537" y="168" width="70" height="225" fill="#3a3c36" />
            <path d="M550 168V393M565 168V393M580 168V393M595 168V393" stroke="#60635a" strokeWidth="5" />
          </g>
          <g className="gate-right">
            <rect x="607" y="168" width="70" height="225" fill="#3a3c36" />
            <path d="M619 168V393M634 168V393M649 168V393M664 168V393" stroke="#60635a" strokeWidth="5" />
          </g>
          <circle className="gate-status" cx="679" cy="146" r="9" />
        </g>

        <g className="motion-lines">
          <path d="M552 421l-20 14M572 426l-12 21M660 421l20 14M642 426l12 21" stroke="#8abc29" strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
      <div className="diagram-caption">
        <span className="caption-icon">{scene + 1}</span>
        <div><strong>{sceneCopy[scene][0]}</strong><p>{sceneCopy[scene][1]}</p></div>
      </div>
      <div className="diagram-progress" aria-hidden="true">
        {sceneCopy.map((_, index) => <span className={index <= scene ? "active" : ""} key={index} />)}
      </div>
    </div>
  );
}

function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.play().catch(() => setIsPlaying(false));
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setIsPlaying(false));
    else video.pause();
  }

  return (
    <section className="video-showcase" aria-labelledby="video-title">
      <div className="video-heading">
        <p className="kicker">Biip en mouvement</p>
        <h2 id="video-title">Un geste sur le téléphone.<br />Un portail qui s’ouvre.</h2>
        <p>La télécommande reste bien au chaud dans sa boîte. Biip se charge du reste.</p>
      </div>
      <div className="video-frame">
        <video
          ref={videoRef}
          src="./video.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          aria-label="Démonstration animée du fonctionnement de Biip"
        />
        <button className="video-control" type="button" onClick={togglePlayback} aria-label={isPlaying ? "Mettre la vidéo en pause" : "Lire la vidéo"}>
          {isPlaying ? <Pause /> : <Play />}
        </button>
        <span className="video-badge"><i /> Démonstration Biip</span>
      </div>
    </section>
  );
}

function PhoneDemo() {
  return (
    <div className="phone-stage" aria-label="Aperçu de l'application Biip">
      <div className="phone">
        <div className="phone-top"><span>9:41</span><span>● ◒</span></div>
        <div className="phone-app">
          <div className="app-brand"><Logo /> <span>biip</span></div>
          <p>Portail maison</p>
          <span className="online"><i /> En ligne</span>
          <button type="button" aria-label="Ouvrir le portail"><MousePointerClick /><strong>Ouvrir</strong><span>Appuyer pour ouvrir</span></button>
          <small><LockKeyhole /> Connexion sécurisée</small>
        </div>
      </div>
      <div className="pulse pulse-one" /><div className="pulse pulse-two" />
    </div>
  );
}

export default App;
