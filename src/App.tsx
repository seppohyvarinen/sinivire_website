import { useEffect, useState } from "react"
import { client } from "./sanityClient"
import "./App.css"
import logo from "./assets/bubble.png"

type SectionId = "hero" | "about" | "services" | "contact"

interface NavLink {
  label: string
  id: SectionId
}

interface PageContent {
  hero?: string
  about?: string
  services?: string
  contact?: string
}

const NAV_LINKS: NavLink[] = [
  { label: "Home",     id: "hero" },
  { label: "About",    id: "about" },
  { label: "Services", id: "services" },
  { label: "Contact",  id: "contact" },
]

function scrollTo(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export default function App() {
  const [content, setContent] = useState<PageContent | null>(null)
  const [active, setActive]   = useState<SectionId>("hero")
  const [scrolled, setScrolled] = useState<boolean>(false)

  // Fetch from Sanity
  useEffect(() => {
    client
      .fetch<PageContent>(`*[_type == "page"][0]{ hero, about, services, contact }`)
          .then((data) => {
      console.log("SANITY DATaA:", data)
      setContent(data)
    })
      .catch(console.error)
  }, [])

  // Sticky nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Active nav highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id as SectionId)
          }
        })
      },
      { threshold: 0.5 }
    )

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__logo">Sinivire</div>
        <div className="navbar__links-wrap">
          <ul className="navbar__links">
            {NAV_LINKS.map(({ label, id }) => (
              <li key={id}>
                <button
                  className={`nav-btn ${active === id ? "nav-btn--active" : ""}`}
                  onClick={() => scrollTo(id)}
                  style={{ backgroundImage: `url(${logo})` }}
                >
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Sections */}
      <main>
        <section id="hero" className="section section--hero">
          <div className="section__inner">
            <h1 className="hero__headline">
              {content?.hero ?? "Mitä on mielessä?"}
            </h1>
            <button className="cta-btn" onClick={() => scrollTo("contact")}>
              Get in touch
            </button>
          </div>
        </section>

        <section id="about" className="section section--light">
          <div className="section__inner">
            <h2 className="section__title">About us</h2>
            <p className="section__body">
              {content?.about ?? "Loading…"}
            </p>
          </div>
        </section>

        <section id="services" className="section section--dark">
          <div className="section__inner">
            <h2 className="section__title">Services</h2>
            <p className="section__body">
              {content?.services ?? "Loading…"}
            </p>
          </div>
        </section>

        <section id="contact" className="section section--light">
          <div className="section__inner">
            <h2 className="section__title">Contact</h2>
            <p className="section__body">
              Reach us at{" "}
              <a
                href={`mailto:${content?.contact ?? ""}`}
                className="contact-link"
              >
                {content?.contact ?? "Loading…"}
              </a>
            </p>
          </div>
        </section>
      </main>
    </>
  )
}