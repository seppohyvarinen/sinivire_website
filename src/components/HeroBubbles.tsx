import { useEffect, useState } from "react"

const thinking    = "/thinkwoman.png"
const minibubble  = "/miniBubble4.png"
const minibubble2 = "/miniBubble3.png"

// ── Burger minibubble tuning ──────────────────────────────────────────────
// Both bubbles point toward top-right where the burger lives
const BURGER_BUBBLE_1 = { angle: 48,  d: 46, size: 10.0 }  // inner, closer to head
const BURGER_BUBBLE_2 = { angle: 56,  d: 130, size: 15.0 }  // outer, closer to burger

function usePortrait() {
  const [portrait, setPortrait] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px) and (orientation: portrait)")
    const update = () => setPortrait(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return portrait
}

function bubbleStyle(angle: number, d: number, size: number) {
  const rad = (angle * Math.PI) / 180
  const bx  =  Math.cos(rad) * d
  const by  = -Math.sin(rad) * d
  return {
    "--bx": `${bx}cqw`,
    "--by": `${by}cqw`,
    width:  `${size}cqw`,
  } as React.CSSProperties
}

export function HeroBubbles() {
  const isPortrait = usePortrait()

  return (
    <div className="hero-scene">
      <div className="hero-figure-wrap">
        

        {isPortrait && (
          <>
            <img
              src={minibubble}
              className="minibubble"
              style={bubbleStyle(BURGER_BUBBLE_1.angle, BURGER_BUBBLE_1.d, BURGER_BUBBLE_1.size)}
              alt=""
            />
            <img
              src={minibubble}
              className="minibubble"
              style={bubbleStyle(
                (BURGER_BUBBLE_1.angle + BURGER_BUBBLE_2.angle) / 2,
                (BURGER_BUBBLE_1.d    + BURGER_BUBBLE_2.d)    / 2,
                (BURGER_BUBBLE_1.size + BURGER_BUBBLE_2.size) / 2,
              )}
              alt=""
            />
            <img
              src={minibubble}
              className="minibubble"
              style={bubbleStyle(BURGER_BUBBLE_2.angle, BURGER_BUBBLE_2.d, BURGER_BUBBLE_2.size)}
              alt=""
            />
          </>
        )}
      </div>
    </div>
  )
}