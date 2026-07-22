// ---- THE LEARNING SPINE ----
// The game is a teaching engine wearing a thriller's skin. Every mission is built
// around a REAL principle of reading people / negotiation / scheming / power /
// economics. You practise it under pressure, then the debrief NAMES it — two-layer
// (plain mental model first, then the real jargon anchored to it). What you've used
// accretes into a codex ("the black book") you can reread. Pure data + lookups.

export type PrincipleId =
  // Act I — reading people + negotiation fundamentals
  | 'interests-not-positions'
  | 'types-and-tells'
  | 'leverage-and-batna'
  | 'loss-aversion'
  | 'reciprocity'
  | 'golden-bridge'
  | 'foot-in-the-door'
  // Act II — scheming + economics
  | 'triangulation'
  | 'information-asymmetry'
  | 'anchoring'
  | 'sunk-cost'
  | 'moral-hazard'
  | 'principal-agent'
  | 'follow-the-money'
  // Act III — power + politics + the meta-game
  | 'power-mapping'
  | 'plausible-deniability'
  | 'prisoners-dilemma'
  | 'walk-away-power'
  | 'the-mirror';

export interface Principle {
  id: PrincipleId;
  act: 1 | 2 | 3;
  name: string;    // the real term (the jargon he should end up knowing cold)
  plain: string;   // LAYER 1 — the noob mental model, everyday, no jargon
  real: string;    // LAYER 2 — names the term and ties it back to the plain model
}

// The curriculum. `plain` is the cartoon; `real` names the concept and anchors it
// to the cartoon (Samar's two-layer teach rule). Kept short — the debrief shows
// one of these tied to what the player JUST did, never a lecture.
export const PRINCIPLES: Record<PrincipleId, Principle> = {
  'interests-not-positions': {
    id: 'interests-not-positions', act: 1, name: 'Interests, not positions',
    plain: "A man yells 'I want the window shut!' — but what he wants is to not feel a draft. Shut the window OR hand him a coat: same win, and the coat costs you nothing.",
    real: "That gap is **positions vs interests** (Fisher & Ury, *Getting to Yes*). The demand is the position; the need under it is the interest. Sal's position was 'get out' — his interest was 'don't drown.' Trade to the interest and you spend nothing.",
  },
  'types-and-tells': {
    id: 'types-and-tells', act: 1, name: 'Read the type, watch the tell',
    plain: "Same words land differently on different men. Flattery swells a proud man and insults a scared one. Watch what leaks — a swallow, a glance at the door — not just what he says.",
    real: "Words are ~7% of the message; tone and body carry the rest (the **7-38-55** rule, Mehrabian). Reading his **type** picks the lever; reading his **tell** times it.",
  },
  'leverage-and-batna': {
    id: 'leverage-and-batna', act: 1, name: 'Leverage & BATNA',
    plain: "You only have power at a table if you can walk away to something. The man who MUST make a deal has already lost it.",
    real: "Your walk-away is your **BATNA** — Best Alternative To a Negotiated Agreement. **Leverage** is anything that worsens his BATNA (his skim, exposed, is yours). You having nothing to lose = an unbeatable BATNA; it can't be priced.",
  },
  'loss-aversion': {
    id: 'loss-aversion', act: 1, name: 'Loss aversion',
    plain: "Telling a man he'll LOSE what he has moves him twice as hard as offering him something new.",
    real: "That's **loss aversion** (Kahneman & Tversky): a loss hurts about twice as much as the same gain feels good. Frame the ask as protecting what he'd lose, not as a prize.",
  },
  'reciprocity': {
    id: 'reciprocity', act: 1, name: 'Reciprocity & the Ben Franklin effect',
    plain: "Do a man a small favour — or let him do YOU one — and he warms to you. People trust those they've invested in.",
    real: "The pull to repay is **reciprocity** (Cialdini); the twist where doing YOU a favour makes HIM like you is the **Ben Franklin effect**. A granted mercy buys more loyalty than a threat.",
  },
  'golden-bridge': {
    id: 'golden-bridge', act: 1, name: 'The golden bridge',
    plain: "A cornered man with no way out fights to the death. Leave him a exit that lets him keep his face, and he'll take it.",
    real: "Sun Tzu: build your enemy a **golden bridge** to retreat across. In negotiation it's letting him **save face** — a dignified 'yes' beats a humiliated 'no' every time.",
  },
  'foot-in-the-door': {
    id: 'foot-in-the-door', act: 1, name: 'Foot in the door',
    plain: "Ask for a tiny yes first. Once he's agreed to something small, the big ask feels consistent with who he just was.",
    real: "The **foot-in-the-door** technique: a small commitment reshapes his self-image, so the larger request rides the need to stay **consistent** (Cialdini).",
  },
  'triangulation': {
    id: 'triangulation', act: 2, name: 'Triangulation',
    plain: "Don't fight the strong man. Set two of his people against each other and stand where both need you.",
    real: "**Triangulation** / coalition play: become the pivot in a three-way so each side bids for you. The underdog's weapon — you can't out-muscle the empire, so you make it fight itself.",
  },
  'information-asymmetry': {
    id: 'information-asymmetry', act: 2, name: 'Information asymmetry',
    plain: "Knowing something he doesn't — or him not knowing what you know — is money. Who holds the secret sets the price.",
    real: "**Information asymmetry**: the party who knows more captures the value. A held secret is **kompromat**; trading it is **quid pro quo**. Control the leak, control the room.",
  },
  'anchoring': {
    id: 'anchoring', act: 2, name: 'Anchoring & framing',
    plain: "The first number said owns the whole haggle. Everything after is measured against it, even if it was absurd.",
    real: "**Anchoring** (Kahneman): the opening figure biases every later judgement. **Framing** picks the yardstick. Say your number first, and make it the frame.",
  },
  'sunk-cost': {
    id: 'sunk-cost', act: 2, name: 'The sunk-cost trap',
    plain: "A man who's already poured years into a thing will pour more to justify it — even when quitting is smarter.",
    real: "The **sunk-cost fallacy**: past investment that can't be recovered wrongly drives future choices. Point a rival at what he's already sunk and he'll overcommit to protect it.",
  },
  'moral-hazard': {
    id: 'moral-hazard', act: 2, name: 'Moral hazard',
    plain: "A man who keeps the reward but never eats the risk gets reckless. Someone else pays if it goes wrong, so why be careful?",
    real: "**Moral hazard**: when you're shielded from the downside, you take on more risk. It's WHY Marlowe's collectors skim — they pocket the upside; the house eats the loss.",
  },
  'principal-agent': {
    id: 'principal-agent', act: 2, name: 'The principal–agent problem',
    plain: "The boss (principal) can't watch every hired man (agent). So the hired man serves himself when the boss isn't looking.",
    real: "The **principal–agent problem**: agents pursue their own interest over the principal's when incentives and oversight are misaligned. Every skim in the empire is this gap — pry it open.",
  },
  'follow-the-money': {
    id: 'follow-the-money', act: 2, name: 'Follow the money',
    plain: "Dirty cash can't look dirty. It gets washed through real businesses until it looks earned. Trace the wash and you find the crime.",
    real: "**Money laundering**: placement → layering → integration turns illicit money 'clean.' Following the **cash flow** upstream exposes who's really being paid — and for what.",
  },
  'power-mapping': {
    id: 'power-mapping', act: 3, name: 'Power mapping & patronage',
    plain: "Draw who owes whom, who fears whom, who can hurt whom. The chart, not the title, tells you who really runs the room.",
    real: "**Power mapping**: charting real influence and dependency, not the org chart. **Patronage** — loyalty bought with favours — is its currency; track the ledger of who owes whom.",
  },
  'plausible-deniability': {
    id: 'plausible-deniability', act: 3, name: 'Plausible deniability & the cut-out',
    plain: "The man at the top never gives the order himself. He uses a middleman so nothing can be pinned on him.",
    real: "**Plausible deniability** via a **cut-out**: a layer that severs the paper trail so power stays clean-handed. To reach the top you must collapse the cut-out or make it testify.",
  },
  'prisoners-dilemma': {
    id: 'prisoners-dilemma', act: 3, name: "The prisoner's dilemma",
    plain: "Two partners can both stay silent and both win a little — but each fears the other will talk first, so both talk and both lose.",
    real: "The **prisoner's dilemma**: rational self-interest drives mutual defection even when cooperation pays more. Engineer the fear of the other defecting and your enemies betray each other for you.",
  },
  'walk-away-power': {
    id: 'walk-away-power', act: 3, name: 'Walk-away power',
    plain: "The strongest move at a table is sometimes standing up and leaving. The one who can truly walk holds the whip.",
    real: "**Walk-away power**: credibly ending the talk resets it on your terms — the flip side of BATNA. Knowing **when NOT to negotiate** is itself the negotiation.",
  },
  'the-mirror': {
    id: 'the-mirror', act: 3, name: 'The mirror',
    plain: "Every tool you've learned to bend people — you now use without flinching. Look up from the board: whose methods are these?",
    real: "The last lesson is about **you**. Mastery of manipulation is the exact skill set of the man you set out to destroy. **The mirror**: the cost of the climb is who you had to become.",
  },
};

export function principle(id: PrincipleId): Principle {
  return PRINCIPLES[id];
}

// codex ordering: by act, then by curriculum order within the record
const ORDER = Object.keys(PRINCIPLES) as PrincipleId[];
export function sortLearned(ids: Iterable<PrincipleId>): Principle[] {
  return [...new Set(ids)]
    .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
    .map((id) => PRINCIPLES[id]);
}
