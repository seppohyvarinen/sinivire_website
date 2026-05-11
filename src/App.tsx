import { useEffect, useState } from "react"
import { client } from "./sanityClient.ts"
import "./App.css"
import logo from "./assets/bubblez.png"
import { HeroBubbles } from "./components/HeroBubbles"
import { SectionDivider } from "./components/SectionDivider"
import { Background } from "./components/BackGround.tsx"

type SectionId = "hero" | "about" | "services" | "contact" | "research"

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
  description?: string
  image?: any
}

interface PageContent {
  hero?: string
  about?: {
    text?: string
    therapists?: Therapist[]
  }
  services?: Service[]
  contact?: string
}

const NAV_LINKS: NavLink[] = [
  { label: "Tervetuloa",   id: "hero"     },
  { label: "Keitä olemme?", id: "about"   },
  { label: "Palvelut",     id: "services" },
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

  // Fetch from Sanity
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
      description,
      image{
        asset->{
          url
        }
      }
    },
    contact
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
      <div className="therapist-card__text">
        <h3>{t.name}</h3>
        <p>{t.description}</p>
      </div>
    </div>
  ))}
</div>
  </div>
</section>


<section id="services" className="section section--dark">
  <div className="section__inner">
    <h2 className="section__title">Palvelut</h2>

    <p className="section__body">
      {/* optional intro text if you add it to schema later */}
    </p>

<div className="therapists">
  {content?.services?.map((s, i) => (
    <div key={i} className="therapist-card">
      {s.image?.asset?.url && (
        <img src={s.image.asset.url} alt={s.name} />
      )}
      <div className="therapist-card__text">
        <h3>{s.name}</h3>
        <p>{s.description}</p>
      </div>
    </div>
  ))}
</div>
  </div>
</section>


        <section id="contact" className="section section--light">
          <div className="section__inner">
            <h2 className="section__title">Yhteystiedot</h2>
            <p className="section__body">
              
              <a href={`mailto:${content?.contact ?? ""}`} className="contact-link">
                {content?.contact ?? "Loading…"}
              </a>
            </p>
          </div>
        </section>
      </main>

      {researchOpen && (
  <div
    className="modal-backdrop"
    onClick={() => setResearchOpen(false)}
  >
    <div className="modal" onClick={e => e.stopPropagation()}>
      <p>Tutkimusdata tänne</p>
      <button onClick={() => setResearchOpen(false)}>✕</button>
    </div>
  </div>
)}
    </>
  )
}