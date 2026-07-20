import type { Mission } from '../domain/mission';

// DELUCA — Chapter Two's sit-down. Ricci's old boss, the district king who's been
// robbing Marlowe blind to build his own little empire. His crack is that secret:
// Marlowe murders men who steal from him, and DeLuca knows it. Your prep decides
// what's possible — Reese's file ('delucaProof') is the blade; Santo turned
// ('santoTurned') strips his muscle. A way-up outcome (deal.gotName) climbs you
// to Chapter Three; anything less leaves you stuck in his district.
export const DELUCA_CONFRONT: Mission = {
  id: 'deluca_confront',
  actionId: 'deluca_sitdown',
  nodeId: 'deluca',
  label: 'Sit down with DeLuca',
  palette: 'deluca',
  start: 's0_serene',
  nodes: [
    {
      id: 's0_serene',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "DeLuca holds court in the back of his club, gold rings catching the light, a man who enjoys being the biggest thing in the room. He doesn't know his room's been quietly taken apart around him." },
        { who: 'them', text: "So you're the little dockrat who did for Ricci. Cute. You climbed one rung and think you're a mountaineer. Sit. Amuse me before I have you thrown in the river with the rest of the trash." },
      ],
      choices: [{ id: 'go', label: 'Sit. Let him swagger.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_cracks',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, text: "The swagger's thinner tonight. Word's reached him that his people are being worked, and Vito DeLuca does not like surprises in his own house." },
        { who: 'them', text: "Somebody's been in my district, turning my men. If that somebody's you, dockrat, you've got about a minute to explain why you're still breathing." },
      ],
      choices: [{ id: 'go', label: 'Sit. He\'s rattled — use it.', tone: 'disarm', to: 'open' }],
    },
    {
      id: 's0_forewarned',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, text: "Someone ran to him. DeLuca knew you were coming and he's stacked the room — Santo's men at the doors, a pistol just under the tablecloth by his hand." },
        { who: 'them', text: "I know all about you, Vidal's whelp. Turned my cop, sniffed at my muscle. And here you are anyway. Bold, or stupid. Talk fast — I've already decided which." },
      ],
      choices: [{ id: 'go', label: "Hold his eye. Don't blink.", tone: 'disarm', to: 'open' }],
    },

    {
      id: 'open',
      mood: 'threat',
      beats: [
        { who: 'them', text: "Well? What does a dockrat bring to Vito DeLuca's table that keeps him out of the river?" },
      ],
      ask: "Everything you did in his district comes to this. What do you put on the table?",
      choices: [
        { id: 'blade', label: "The file — 'You've been robbing Marlowe blind to build your own kingdom. I can prove it. Marlowe kills men for less.'", tone: 'push', requires: ['delucaProof'], to: 'c_blade' },
        { id: 'muscle', label: "His muscle — 'Santo won't lift a hand for you. Your own dog stepped back. You're not as protected as you think.'", tone: 'push', requires: ['santoTurned'], to: 'c_muscle' },
        { id: 'ego', label: "His ambition — 'A man like you shouldn't answer to anyone. I can help you stop being Marlowe's middleman.'", tone: 'disarm', to: 'c_ego' },
        { id: 'nothing', label: "Face him with nerve alone — 'I did for Ricci. I can do for you.'", tone: 'push', to: 'o_crushed' },
      ],
    },

    {
      id: 'c_blade',
      mood: 'threat',
      beats: [
        { who: 'them', text: "(the gold rings go still on the tablecloth) …Where did you get that." },
        { who: 'you', text: "Doesn't matter. What matters is Marlowe never sees it — if you give me what I want. You know what he does to men who skim from him. Ricci did it small and he's finished. You did it big." },
        { who: 'them', text: "(the swagger gone, sweat at his collar) …Name it, then. Name it and let's both walk away from this." },
      ],
      ask: "You've got the district king by the throat, and he's more afraid of Marlowe than of you. What do you force — and how do you leave him?",
      choices: [
        { id: 'upFace', label: "Your climb, let him save face — 'You stay king of the Nine Streets. But from tonight you answer to me, and you open the door up to Marlowe.'", tone: 'disarm', to: 'o_up_ally' },
        { id: 'upBreak', label: "Your climb, and break him — 'You're done. Sign the district to me and crawl to Marlowe's door ahead of me.'", tone: 'push', to: 'o_up_broken' },
        { id: 'district', label: "Just the district — 'Hand me the Nine Streets and keep your secret. I'll find my own way up.'", tone: 'disarm', to: 'o_district' },
      ],
    },
    {
      id: 'c_muscle',
      mood: 'cold',
      beats: [
        { who: 'them', text: "(a glance at the door where Santo should be, and isn't) …Santo. That mountain of meat. You turned Santo." },
        { who: 'you', text: "I didn't turn him. You lost him — years ago, every time you called him your dog. I just told him he could put the leash down." },
        { who: 'them', text: "(rattled now, but proud) So I'm short a bodyguard. I've got twenty more men and a pistol under this table, boy. Muscle isn't the whole game." },
      ],
      ask: "His shield's gone but he's still got teeth and pride. Force it, or ease off?",
      choices: [
        { id: 'strongarm', label: "Force it — 'Twenty men who'll follow the winner. And that's not you anymore. Give me the way up.'", tone: 'push', to: 'o_up_broken' },
        { id: 'backoff', label: "Ease off — settle for what you can get without the blade.", tone: 'disarm', to: 'o_slip' },
      ],
    },
    {
      id: 'c_ego',
      mood: 'tense',
      beats: [
        { who: 'them', text: "(the greed lights up) …Now that. That's interesting talk. You think I like being Marlowe's errand boy? Collecting his coast, kissing his ring?" },
        { who: 'you', text: "I think you've already built your own kingdom in the cracks of his. I think you want more. And I think we could want it together." },
        { who: 'them', text: "(leaning in, hungry) …Show me you're worth more than talk, then. Give me a reason, not a wish." },
      ],
      ask: "His ambition's wide open — but a hungry man wants proof, not promises.",
      choices: [
        { id: 'press', label: "Show him the file (needs proof) — 'Here's your reason. I hold what could end you. Partner up, or hang.'", tone: 'push', requires: ['delucaProof'], to: 'c_blade' },
        { id: 'promise', label: "Promise it — 'Move with me now and I'll make you a king. Trust me.'", tone: 'push', to: 'o_slip' },
      ],
    },

    {
      id: 'o_up_ally',
      mood: 'hope',
      outcome: {
        key: 'up_ally', tone: 'good',
        title: 'DELUCA — BENT, NOT BROKEN',
        line: "He signs the district over in everything but name and, terrified of Marlowe, opens the door above him. \"You keep my secret, I keep your road clear. We understand each other.\" You've climbed another rung — and the district runs on your say-so now.",
        ripple: "DeLuca is yours — the Nine Streets answer to you, and the way up to Marlowe is open. You climb.",
        reflect: "Another man kept alive because he's more useful breathing. I'm getting good at that calculation. Ricci made it about me once. DeLuca just made it about himself.",
        deal: { closed: true, gotName: true, faceIdx: 0 },
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
      },
    },
    {
      id: 'o_up_broken',
      mood: 'threat',
      outcome: {
        key: 'up_broken', tone: 'mixed',
        title: 'DELUCA — YOU TOOK IT ALL',
        line: "You strip him of everything in front of his own men and send him crawling to Marlowe's door ahead of you, a broken king announcing his conqueror. You have the district and the road up. You also have a humiliated man who'll knife you the first chance he gets.",
        ripple: "You've taken the district by force — the climb continues. But DeLuca is destroyed and vengeful, and he's telling everyone your name.",
        reflect: "I put a king on his knees in front of his court and felt the old thing again — the enjoyment. Ten years, Ricci said. I keep proving him right, one broken man at a time.",
        deal: { closed: true, gotName: true, faceIdx: 2 },
        heatDelta: 1,
        tag: 'YOU CLIMB',
        cta: 'UP THE LADDER ▸',
      },
    },
    {
      id: 'o_district',
      mood: 'cold',
      outcome: {
        key: 'district', tone: 'mixed',
        title: 'DELUCA — THE STREETS, NOT THE STAIRS',
        line: "He hands you the Nine Streets to keep his secret buried — but not the door above. \"Find your own way up to the boss, dockrat. This is all I'm giving.\" You're richer, higher. You're not one rung closer to Marlowe.",
        ripple: "You hold the district now. But DeLuca kept the road up for himself — Marlowe stays out of reach. You've climbed sideways, not up.",
        deal: { closed: true, gotName: false, faceIdx: 1 },
      },
    },
    {
      id: 'o_slip',
      mood: 'cold',
      outcome: {
        key: 'slip', tone: 'mixed',
        title: 'DELUCA — HE WRIGGLES FREE',
        line: "Without the file at his throat, he smells the bluff. \"Bold, kid. But you came to a knife fight with a strong opinion.\" He gives you nothing, ushers you out with a smile, and doubles his guard. You should have brought the proof.",
        ripple: "DeLuca slips the noose — wary now, and warned. The road up stays shut, and he knows your face.",
        reflect: "I moved without enough, again. I want the top so badly I keep reaching before my hand's full. That's how men like me fall.",
        deal: { closed: false, gotName: false, faceIdx: 1 },
        heatDelta: 1,
      },
    },
    {
      id: 'o_crushed',
      mood: 'threat',
      outcome: {
        key: 'crushed', tone: 'bad',
        title: 'DELUCA — INTO THE RIVER',
        line: "He lets you finish, then laughs and lifts the pistol from under the tablecloth. \"You did for Ricci because Ricci was soft. I'm not soft.\" His men close the doors. You brought nerve to a room full of guns.",
        ripple: "You moved on the district king with nothing in your hand. DeLuca ends you the way he ends every dockrat who forgets his place.",
        reflect: "Pa taught me to know a man's strength before I moved on him. I walked into a room full of guns with a speech. …I hope he wasn't watching.",
        deal: { closed: false, gotName: false, faceIdx: 2 },
        heatDelta: 3,
        tag: 'THE END',
        cta: '— the river —',
      },
    },
  ],
};
