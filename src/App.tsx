import { useEffect, useState, useRef } from "react"
import { client } from "./sanityClient.ts"
import "./App.css"
import logo from "./assets/bubblez.png"
import { HeroBubbles } from "./components/HeroBubbles"
import { SectionDivider } from "./components/SectionDivider"
import { Background } from "./components/BackGround.tsx"

type SectionId = "hero" | "about" | "services" | "contact" | "research" | "applying"

interface NavLink {
  label: string
  id: SectionId
}

type Therapist = {
  name?: string
  image?: any
  description?: string
}

type Service = {
  name?: string
  shortDescription?: string
  longDescription?: string
  image?: any
}

type ResearchItem = {
  title: string
  abstract: string
  link: string
}



interface PageContent {
  hero?: string
  about?: {
    text?: string
    therapists?: Therapist[]
  }
  applying?: {
  applicationProcess?: string
  therapyGoals?: string
}
  services?: Service[]
  contact?: {
  email?: string
  instagram?: string
  address?: string
}
  research?: ResearchItem[]
}

const NAV_LINKS: NavLink[] = [
  { label: "Palvelut",   id: "services"     },
  { label: "Keitä olemme?", id: "about"   },
  { label: "Musiikkiterapiaan hakeminen", id: "applying" },
  { label: "Tutkimus",     id: "research" },
  { label: "Yhteystiedot", id: "contact"  },
]

function scrollTo(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export default function App() {
  const [content, setContent]   = useState<PageContent | null>(null)
  const [active, setActive]     = useState<SectionId>("hero")
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)
  const [researchOpen, setResearchOpen] = useState(false)
  const [expandedService, setExpandedService] = useState<number | null>(null)

  // Detect portrait phone
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px) and (orientation: portrait)")
    const update = () => {
      setIsPortrait(mq.matches)
      if (!mq.matches) setMenuOpen(false)   // close menu when rotating
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  // Add this useEffect to lock/unlock body scroll
useEffect(() => {
  if (researchOpen) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
  return () => {
    document.body.style.overflow = ""
  }
}, [researchOpen])

  // Fetch from Sanity LISÄÄ UUSI SARAKE Näin haet terapiaan.. Terapian tavoitteet. ratkaissut...
  useEffect(() => {
    client
      .fetch<PageContent>(`
  *[_type == "page"][0]{
    hero,
    about{
      text,
      therapists[]{
        name,
        description,
        image{
          asset->{
            url
          }
        }
      }
    },
    services[]{
      name,
      shortDescription,
      longDescription,
      image{
        asset->{
          url
        }
      }
    },
      applying{
    applicationProcess,
    therapyGoals
  },
    research[]{
      title,
      abstract,
      link
    },
    contact{
  email,
  instagram,
  address
},
  }
`)
      .then((data) => {
        console.log("SANITY DATAA:", data)
        setContent(data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
  document.body.classList.toggle("is-portrait", isPortrait)
}, [isPortrait])

  // Sticky nav shadow
// Sticky nav shadow + arc collapse on scroll
useEffect(() => {
const onScroll = () => {
  const y = window.scrollY
  setScrolled(y > 10)

  // Start arc collapse earlier, but margin resets later
  const arcProgress = Math.min(y / 120, 1)
  document.documentElement.style.setProperty("--arc-collapse", String(arcProgress))

  // Margin collapses only after 220px of scroll (text well gone by then)
// Margin collapses only after 350px of scroll (bigger text needs more room)
const marginProgress = Math.min(Math.max((y - 150) / 100, 0), 1)
document.documentElement.style.setProperty("--nav-margin-collapse", String(marginProgress))}
  window.addEventListener("scroll", onScroll, { passive: true })
  return () => window.removeEventListener("scroll", onScroll)
}, [])

  // Active nav highlight via IntersectionObserver
useEffect(() => {
  if (!content) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id as SectionId)
      })
    },
    { threshold: 0.5 }
  )

  NAV_LINKS.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  return () => observer.disconnect()
}, [content])

function handleNavClick(id: SectionId) {
  if (id === "research") {
    setResearchOpen(true)
    setMenuOpen(false)
    return
  }
  scrollTo(id)
  setMenuOpen(false)
}

  return (
    <>
      {/* Navbar */}
<nav className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${isPortrait ? "navbar--portrait" : ""}`}>
  <div className="navbar__logo" />



        {isPortrait ? (
          /* ── Portrait phone: burger + dropdown ── */
          <>
{/* Replace the existing burger button with this */}
<button
  className={`burger ${menuOpen ? "burger--open" : ""}`}
  onClick={() => setMenuOpen((o) => !o)}
  aria-label="Toggle menu"
  aria-expanded={menuOpen}
>
  <span className="nav-btn__bubble" />
  <span className="burger__bars">
    <span /><span /><span />
  </span>
</button>

            <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
              <ul className="mobile-menu__list">
                {NAV_LINKS.map(({ label, id }, i) => (
                  <li key={id} style={{ "--i": i } as React.CSSProperties}>
                    <button
                      className={`mobile-nav-btn ${active === id ? "nav-btn--active" : ""}`}
                      onClick={() => handleNavClick(id)}
                    >
                      
                      <span>{label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          /* ── Landscape / desktop: existing arc nav ── */
          <div className="navbar__links-wrap">
            <ul className="navbar__links">
              {NAV_LINKS.map(({ label, id }, i) => (
                <li key={id}>
                  <button
                    className={`nav-btn ${active === id ? "nav-btn--active" : ""}`}
                    onClick={() => handleNavClick(id)}
                    data-pos={i}
                  >
                    <span className="nav-btn__bubble" />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Sections */}
      <main>
        <Background />
<section id="hero" className="section section--hero">
  <span className="navbar__company">

    {!menuOpen && (
      <>     <span className="navbar__company__name">Sinivire Oy</span>
    <span className="navbar__company__sub">Musiikkiterapian ammattilainen</span></>
    )}

  </span>
  <div className="section__inner">
    <p className="hero__headline">{content?.hero ?? ""}</p>
  </div>
</section>

<section id="services" className="section section--dark">
  <div className="section__inner">
    <h2 className="section__title">Palvelumme</h2>

    <div className="therapists">
      {content?.services?.map((s, i) => (
        <div key={i} className="therapist-card">
          {s.image?.asset?.url && (
            <img src={s.image.asset.url} alt={s.name} />
          )}
          <h3>{s.name}</h3>
<div className="therapist-card__text">
  <div className={`service-body ${expandedService === i ? "service-body--open" : ""}`}>
    <div className="service-body__inner">
      <p className="service-body__short">{s.shortDescription}</p>
      <p className="service-body__long">{s.longDescription}</p>
    </div>
  </div>
  {expandedService === i ? (
    <button className="service-toggle" onClick={() => setExpandedService(null)}>
      Näytä vähemmän ▲
    </button>
  ) : (
    <button className="service-toggle" onClick={() => setExpandedService(i)}>
      Lue lisää... ▼
    </button>
  )}
</div>
        </div>
      ))}
    </div>
  </div>
</section>

<section id="about" className="section section--light">
 
  <div className="section__inner">
    <h2 className="section__title">Terapeuttimme</h2>

    <p className="section__body">
      {content?.about?.text ?? ""}
    </p>

<div className="therapists">
  {content?.about?.therapists?.map((t, i) => (
    <div key={i} className="therapist-card">
      {t.image?.asset?.url && (
        <img src={t.image.asset.url} alt={t.name} />
      )}
      <h3>{t.name}</h3>           {/* ← moved here, between img and the glass box */}
      <div className="therapist-card__text">
        <p>{t.description}</p>   {/* ← no more h3 inside */}
      </div>
    </div>
  ))}
</div>
  </div>
</section>
<section id="applying" className="section section--light">
  <div className="section__inner section__inner--applying">
    <div className="applying-block">
      <h2 className="section__title applying-block__title">Hakuprosessi</h2>
      <div className="applying-bubble">
        <p>{content?.applying?.applicationProcess ?? ""}</p>
      </div>
    </div>
    <div className="applying-block">
      <h2 className="section__title applying-block__title">Terapian tavoitteet</h2>
      <div className="applying-bubble">
        <p>{content?.applying?.therapyGoals ?? ""}</p>
      </div>
    </div>
  </div>
</section>




<section id="contact" className="section section--light">
  <div className="section__inner">
    <h2 className="section__title">Yhteystiedot</h2>
    <div className="applying-bubble" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left' }}>
      {content?.contact?.email && (
        <p>
          <a href={`mailto:${content.contact.email}`} className="contact-link">
            {content.contact.email}
          </a>
        </p>
      )}
      {content?.contact?.instagram && (
        <p>
          <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer" className="contact-link">
            Instagram
          </a>
        </p>
      )}
      {content?.contact?.address && (
        <p>{content.contact.address}</p>
      )}
    </div>
  </div>
</section>
      </main>

{researchOpen && (
  <div
    className="modal-backdrop"
    onClick={() => setResearchOpen(false)}
  >
    <div className="modal" onClick={e => e.stopPropagation()}>
      <button className="modal__close" onClick={() => setResearchOpen(false)}>✕</button>
      <h3 className="modal__title">Tutkimus</h3>

      <div className="modal__content">
        {content?.research && content.research.length > 0 ? (
          content.research.map((item, i) => (
            <div key={i} className="research-item">
              <h5 className="research-item__title">{item.title}</h5>
              <p className="research-item__abstract">{item.abstract}</p>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="research-item__link"
                >
                  Lue lisää →
                </a>
              )}
            </div>
          ))
        ) : (
          <p>Ei tutkimuksia saatavilla.</p>
        )}
      </div>
    </div>
  </div>
)}
    </>
  )
}