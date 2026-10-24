# Portfolio spec: "Full Stack & GenAI" (Soda-method)

Status: **Approved. Steps 1-3 built** (worlds, type, nav, hero, depth layers, tokens, world switch). Steps 4-5 (chapters as drawers, responsive polish for sections) are next.
Method: dissect why the Soda page works, then apply the same method to this subject.

---

## 1. Why Soda works (the method to transplant)

| # | Soda does | Why it works |
|---|---|---|
| 1 | **One hero object** (the can) dead centre, huge | The eye has exactly one place to land. The product *is* the page. |
| 2 | **Colour = the product's flavour.** Whole screen is one saturated radial gradient: bright core behind the can fading to near-black edge | Looks lit from behind the object. Colour is an idea, not a theme. Clicking a flavour changes the whole world. |
| 3 | **Type is architecture.** 10vw+ cursive, outline word + solid word, `line-height 0.8`, one headline each side of the can | The words frame the object; the outline/solid pair gives rhythm without extra elements. |
| 4 | **Five depth layers** moving in different directions on pointer (bg props -30, leaves -15, can tilt, text, fg props +60) + rising bubbles | Real depth from cheap parallax. Foreground props overlap the type, so it feels 3D. |
| 5 | **The pointer is a force**: can tilts toward it, props are repelled inside 400px, everything floats forever | The page reacts like a physical thing; there is always motion but never noise. |
| 6 | **One signature choreography**: flavour click = background morph, can spins 720deg with blur and swaps texture at the peak, props implode to centre, change model, explode out | The memorable 2 seconds. Everything else stays quiet. |
| 7 | **Restraint**: glass nav, one pill CTA with a pink "+" circle, 3 lines of copy, one award badge, one accent colour in 3 places, **no scroll** | Nothing competes with the object. Premium = few elements, executed well. |
| 8 | **Props match the subject** (cherries for cherry soda, blueberries for blue) | Every floating thing says something about the product. |

## 2. Why my portfolio fails (honest diagnosis)

1. **No colour idea.** Navy plus periwinkle is the default "dark mode developer" look. The scrim also kills the glow behind the character, so nothing is lit.
2. **Not one hero.** The avatar is small, dim and shoved right; headline, pill, paragraph, two buttons and links all fight for attention.
3. **Dust is not props.** Random sparkles say nothing. Soda's props are the product.
4. **SaaS-card kit.** Experience, projects and education are rounded dark cards in grids with eyebrow labels: exactly the template look.
5. **Brochure copy.** "I build the whole product..." is a paragraph, not a claim.
6. **No signature moment**, and text walls sit directly on the 3D stage.

---

## 3. The concept

**The man at the desk is the product.** The page is built around him exactly like Soda is built around the can.
- **Hero object:** the avatar (black suit, red tie, beard) at his laptop, dead centre, large, lit from behind, tilting toward the cursor.
- **Props:** floating glossy **3D tech tokens** (React, TypeScript, Python, FastAPI, AWS, Postgres, LangChain...) drifting around him, repelled by the pointer. These are the cherries.
- **Flavours = Worlds:** the three project categories are the flavours. Clicking one morphs the world (colour), swaps the laptop screen, and implodes/explodes the tokens into that world's stack.
- **Words either side:** left = identity, right = role. Outline word + solid word.

## 4. Worlds (palette: derived from the subject)

Rule: the character's **red tie** must pop, so the default world is its **complement (teal)**. Each world is a radial gradient: bright core behind him, ink at the edges. One shared accent.

| World | Category | `--bg-inner` | `--bg-mid` | `--bg-outer` |
|---|---|---|---|---|
| **Petrol** (default) | Enterprise AI Agents | `#0aa3a0` | `#05505a` | `#010f13` |
| **Ultramarine** | Data & Document Automation | `#3552ff` | `#14217f` | `#040824` |
| **Violet** | Personal Projects | `#7a35e8` | `#32107a` | `#0b0220` |

- **Accent (one, ~3 places):** `#ffd6c6` (warm cream-peach). Used on: active nav pill, the "+" circle of the CTA, active card border. Text on accent: `#1a0f0c`.
- **Ink/UI:** text `#ffffff`, muted `rgba(255,255,255,0.72)`, glass `rgba(255,255,255,0.07)` with border `rgba(255,255,255,0.18)`, `backdrop-filter: blur(20px)`.
- **Banned:** slate/navy greys, periwinkle, gold.
- Body background transition: `background 1.2s cubic-bezier(0.4,0,0.2,1)`; world switch also tweens the CSS variables with GSAP `1.5s power2.inOut` (as Soda).

## 5. Typography

- **Display:** `Fraunces` (variable soft serif, optical size, true italics), weight 600, `font-size clamp(5rem, 11vw, 13rem)`, `line-height 0.82`, `letter-spacing -0.03em`. Outline word: `-webkit-text-stroke: 2px #fff; color: transparent;`. Solid word: white.
- **UI/body:** `Manrope` 400/500/700 (nav, cards, copy), body copy `1.05rem`, max width `380px`, max 3 lines.
- No mono labels, no tracked all-caps eyebrows, no numbering except real sequences.

## 6. Hero composition (1440x900, no scroll in the hero state)

```
 [A/S]        ( Home  About  Work  Experience  Contact )         [ Let's talk ]
 
 Aakash                     ┌───────────┐                 Full Stack
 Shetty        ◌ token      │  AVATAR   │      token ◌     & GenAI
                            │ at laptop │
 I ship AI products         └───────────┘          [card][card][card]
 end to end: React to           ◌ token              Enterprise Automation Personal
 Postgres to Bedrock.                                  ELMA 2.0   ACE        Verity
 [ See my work (+) ]                                   -90% time  25→3 min   0 unsafe
 [badge] ELMA · 3,000+ employees use it daily            (←) (→)
```

- Left column `z 100`: headline "Aakash" (outline) / "Shetty" (solid), 3-line description, pill CTA `See my work` + accent "+" circle, credential badge bottom-left.
- Centre: avatar `z 50`, fills ~70% of viewport height, `rotate/tilt` to cursor (see 8).
- Right column: three "world" cards (glass, 135px, product token poking out above the card by `-8rem` like the Soda can), each showing category lead project + one metric in the price slot; arrows beneath; headline "Full Stack" (outline) / "& GenAI" (solid) bottom-right.
- Nav: glass pill, active item filled accent. Logo "A/S" left, "Let's talk" glass button right.

## 7. Depth layers (z-index and pointer parallax, as Soda)

| Layer | Contents | z | Pointer parallax |
|---|---|---|---|
| L0 | Rising light motes (CSS, `floatUp 4-10s`, opacity 0.2-0.6) | 0 | none |
| L1 | Far tokens, small, blurred, 0.6-0.7 opacity | 0 | `-30px` |
| L2 | Mid tokens/ghost glyphs | -1 | `-15px` |
| L3 | Avatar + desk (R3F) | 50 | tilt: `orbit x = mouse.x*40deg`, `y = 90 + mouse.y*20deg` |
| L4 | Headlines, copy, CTA, cards | 100 | none |
| L5 | Foreground tokens, large (150-250px), overlap the type | 110 | `+60px` |

Mouse smoothing lerp `0.05`; tokens float with per-index durations `[5,7,6,8,5.5,6.5,9,11,10]`s, amplitude `15px` and `6deg`.

## 8. Interaction logic

- **Avatar:** head and eyes follow cursor (as now), whole group tilts +-40deg yaw / +-20deg pitch around the hero view.
- **Token repulsion:** radius `400px`, strength `-80`, lerp `0.1`, spin `angle += 0.2 * (1 + force*5)`.
- **Hover (cards):** token lifts `-30px`, rotates `-12deg`, scales `1.15` (spring), border brightens. **Hover (CTA):** pill rises 3px. **Magnetic** on "Let's talk".
- **Nav:** active pill slides between items (shared layout).
- **Cursor:** custom ring with "View" on cards (existing Cursor component, restyled to accent).

## 9. The signature moment: World switch (copy of Soda's, retargeted)

On click of a world card (guard: ignore while switching):
1. Background variables tween to the new world (`1.5s power2.inOut`); active card gets accent border.
2. Avatar turns toward the laptop and the **screen swaps** at the peak (ELMA chat / ACE invoice / Verity console); screen glow takes the world colour.
3. Tokens: implode to centre (`0.5s power2.in`, scale 0.1, opacity 0), swap to that world's stack (e.g. Enterprise: Bedrock, LangChain, MCP, pgvector; Automation: Python, OpenCV, Tesseract, Postgres; Personal: LangGraph, FastAPI, React, TypeScript), hold `0.3s`, explode to new random positions (`+-100px`, `0.9s back.out(1.5)`).
4. Headline right word cross-fades to the world's label ("& GenAI" stays; a small caption under the cards names the world).

## 10. Scroll chapters (so the full résumé is still told)

The hero is the "home" state. Scrolling continues the approved story (turn, sit, type, dive into the screen) but **every chapter obeys the same recipe**: one big headline pair, one object, props, max 3 lines of copy, details behind a click.

| Chapter | Headline (outline / solid) | On stage | Details (click opens a glass drawer) |
|---|---|---|---|
| Home | Aakash / Shetty  ·  Full Stack / & GenAI | hero above | none |
| About | Built / to ship. | avatar turns to the room | capabilities (GenAI, Full Stack) |
| Experience | Allcargo / since 2025 | avatar types, screen shows the work | role bullets, tech chips |
| Work | Systems / in production. | camera dives into the screen; the world cards become the project switcher | project drawer per card |
| Education | Grounded / in data. | step back | degrees (GPA dials), coursework, certifications |
| Contact | Let's / talk. | bookend close-up, handshake | email copy, phone, links |

## 11. Copy (professional, specific)

- Home description (3 lines): "I ship AI products end to end: React to Postgres to Bedrock. Used daily by 3,000+ people."
- Badge: **ELMA** / "AI assistant in production at Allcargo".
- Card metrics: ELMA 2.0 "-90% response time", ACE "25 to 3 min per invoice", Verity "0 unsafe actions".
- CTA: "See my work". Nav: Home, About, Work, Experience, Contact.

## 12. Assets (all generated in code, nothing licensed)

- **Avatar + desk:** existing (Moncy Yohannan, with permission). Re-lit: add a **warm rim + coloured back-glow plane** in the world's inner colour so he looks backlit; remove the left text scrim.
- **Tokens:** R3F rounded glossy discs/cubes with canvas-drawn logos (React, TS, Python, FastAPI, AWS, Postgres, LangChain, MCP, OpenCV, LangGraph); `MeshPhysicalMaterial` clearcoat, same technique as the earlier tech-ball pit.
- **Motes:** CSS circles.

## 13. Responsive

- `max-width: 1200px`: avatar `100vw x 60vh`, headlines `5rem`, columns stack, world cards become a horizontal scroller under the avatar; tokens reduced to 5; tilt disabled on touch.
- Reduced motion: no float, no repulsion, instant world switch.

## 14. What gets reused / rebuilt

- **Keep:** `content.ts` data, Avatar loader and animations, ScreenTexture, Cursor, Loader (restyle), Magnetic/Reveal primitives, headless screenshot harness.
- **Rebuild:** hero composition, worlds (CSS variables + switch choreography), token props system, nav, type system, chapter overlays as drawers (replace the card-grid sections).
- **Delete:** the current dark-navy palette, the text scrim, dust sprites, grid sections on stage.

## 15. Build order and acceptance

1. Tokens + worlds + type + nav (static hero, screenshot, critique).
2. Hero lighting/back-glow, avatar framing, depth layers and pointer physics.
3. World switch choreography (the signature moment).
4. Chapters as drawers; scroll story re-anchored.
5. Responsive, reduced motion, performance pass, production build check.

**Acceptance (hostile art-director test):** at 1440x900 the hero must read in 2 seconds as *one object, one colour world, two giant words, one accent*; the world switch must feel like Soda's flavour switch; phone must feel designed, not shrunk.

---

# Part 2: The rest of the page (plan, awaiting approval)

## Diagnosis: why it goes dark
1. Sections paint their own near-black backgrounds (`.projects` ends in solid `--bg`, `.metrics` is `rgba(7,8,11,.62)`, Education/TechStack set `--bg`), which **hides the colour world** that makes the hero glow.
2. Everything below is the same dark card + small text. No new light, no new idea per section, no scale contrast.
3. The 3D man leaves the frame (camera dives into the laptop), so nothing "lit" is left on screen.
4. Dense paragraphs sit directly on gradient with no hierarchy.

## Principle: ONE continuous world, a new light for every chapter
The page background is **always the world gradient** (never a section colour). Sections are transparent. Each chapter moves the glow, so scrolling feels like travelling through one lit space (like Soda's single backdrop) instead of stacking dark boxes.

## Chapter map (light + object + type + content)

| # | Chapter | Backdrop (glow position / colour) | Hero object on stage | Giant type (outline / solid) | Content shown |
|---|---|---|---|---|---|
| 1 | **Home** (done) | core centre, world colour | man at desk, props | Aakash / Shetty | 3 lines, CTA, world cards |
| 2 | **Proof** | glow rises, brighter band | tokens drift down as a ticker | `3,000+` huge counter row | 4 numbers, one line each, no cards |
| 3 | **About** | glow shifts **left**, warmer edge (accent) | man turns, three-quarter view | Built / to ship. | 1 statement, 2 capability pills (not cards) |
| 4 | **Experience** | glow **centre-right**, behind the laptop | camera over his shoulder, screen shows work | Allcargo / 2025 | horizontal role strip: role + 2 numbers; click opens a drawer with bullets |
| 5 | **Work** | glow becomes the **screen light** (flood), then back to world colour | dive INTO the monitor; screen becomes the grid | Systems / in production | the 3 world tabs + 8 project tiles as **big visual tiles** (object + metric), drawer on click |
| 6 | **Education** | glow **low, wide**, calm | man leans back, framed degrees on a shelf | Grounded / in data | two degree plates with GPA rings; coursework as a single line; certs in a drawer |
| 7 | **Contact** | glow returns to **centre**, brightest of the page | close-up bookend, handshake | Let's / talk. | giant email pill, 3 links, credit |

## Colour rules for the lower page (so it stays premium, not "darker")
- Backdrop lightness never drops below the hero's mid tone: `--bg-mid` stays the floor; the outer vignette is the only near-black.
- Per-chapter glow = a second radial layer on `.world-bg` driven by scroll (CSS variables `--glow-x/--glow-y/--glow-a`), so no section ever needs a background.
- Surfaces = **glass** (`rgba(255,255,255,.07)` + 20px blur + 1px white-18% border), identical to the nav and world cards; text pure white / 72% white. No `#0a...` cards.
- Accent cream-peach only on: active states, the "+" circle, metrics' unit/underline. Metrics themselves are white at huge size.
- The world switch keeps working on every chapter (the three world cards pin as a small switcher in the nav on scroll).

## Layout rules (kills the "wall of cards" look)
- Max **one idea per screen**: headline pair + <=3 lines + one interactive element.
- Detail goes in a **drawer** (slide-in glass panel from the right, `640px`), opened by the tile/role; focus-trapped, Esc closes.
- Tiles are **visual**: a 3D prop (from `props3d.ts`) + big metric + name; hover tilts, the prop lifts (as the world cards do).
- Section height >= 100svh; text left ~40%, stage right ~60% (flip on alternate chapters).
- Parallax: giant outline word drifts at 0.6x scroll, props at 1.2x, text 1x.

## Motion
- Chapter headline: word-mask reveal once; outline word fills to solid on enter.
- Counters count up when the proof row enters.
- Drawer: spring slide + scrim fade; tiles stagger in 60ms.
- Background glow position tweened with scroll (no jank: CSS vars on one fixed element).
- `prefers-reduced-motion`: no parallax/float, instant glow.

## Build order
1. **Backdrop + glass system**: transparent sections, scroll-driven glow, shared `.glass` + drawer component. (Fixes "darker" immediately.)
2. Proof + About rebuilt (type-first).
3. Experience strip + Work tiles + drawer (the content-heavy part).
4. Education + Contact; world switcher in nav.
5. Phone pass for every chapter, reduced motion, production build, headless screenshots at 12 scroll positions x 2 viewports.

**Acceptance:** at any scroll position a screenshot must show a lit colour backdrop (no section can look near-black), one headline pair, <=3 lines of copy and one visual object.

## Open questions for you
1. Keep the **3D man on stage through the lower page** (right side, changing poses), or let him **leave after the hero** and use the props alone as the objects?
2. **Details in drawers** (clean but one extra click) vs. visible on page (shorter reading path, denser)?
3. Is a **single world colour for the whole page** (changes only when you click a world) right, or should each chapter shift hue by itself as you scroll?
