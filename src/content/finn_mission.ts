import type { Mission } from '../domain/mission';

// DENSE manhwa panels — one meaningful shot per dialogue beat, so the scene reads
// like a comic that turns with the words (the kitchen → the tell → the read forks
// → the name → the knock at the door → each ending its own image + mood).
const KITCHEN = 'assets/art/scene/finn_kitchen.jpg';    // wide: her cramped dockside kitchen, his coat on the hook
const COAT = 'assets/art/scene/finn_coat.jpg';          // close: the dead man's coat, still hung like he'll be back for it
const STILL = 'assets/art/scene/finn_still.jpg';        // her, upright, dry-eyed, terrifyingly composed at the door
const WARY = 'assets/art/scene/finn_wary.jpg';          // she doesn't invite you in so much as not stop you
const NOTES = 'assets/art/scene/finn_notes.jpg';        // the wrong tell for read_truth: a shoebox, dates circled, a case being built
const TURNEDAWAY = 'assets/art/scene/finn_turnedaway.jpg'; // the wrong tell for read_revenge: she ran a man with a knife off her porch
const ENVELOPE = 'assets/art/scene/finn_envelope.jpg';  // the wrong tell for read_broke: Kastner's hush money, unopened, gathering dust
const SOFTEN = 'assets/art/scene/finn_soften.jpg';      // disarm: something in her eases, a half-inch
const TEST = 'assets/art/scene/finn_test.jpg';          // disarm: she tests what you actually want
const NAME = 'assets/art/scene/finn_name.jpg';          // name: her stillness finally cracks
const GRIEF = 'assets/art/scene/finn_grief.jpg';        // name: what three a.m. sounds like in this house
const STUNG = 'assets/art/scene/finn_stung.jpg';        // n2: the wall slams back, worse than before
const CALMTHREAT = 'assets/art/scene/finn_calmthreat.jpg'; // press: the cup set down, exact and terrible
const WARN = 'assets/art/scene/finn_warn.jpg';          // press: the quiet warning that is somehow louder than shouting
const CASH = 'assets/art/scene/finn_cash.jpg';          // bribe: a bill set on her table
const INSULT = 'assets/art/scene/finn_insult.jpg';      // bribe: she points you at the envelope she never opened
const KNOCK = 'assets/art/scene/finn_knock.jpg';        // THE COMPLICATION: a shadow crosses the frosted glass, boots on the step
const HIDE = 'assets/art/scene/finn_hide.jpg';           // you step back into the hall, let her handle the door alone
const BRAZEN = 'assets/art/scene/finn_brazen.jpg';       // you stay in plain sight, she covers for you on the spot
const CONFRONT = 'assets/art/scene/finn_confront.jpg';   // you plant yourself in the doorway — and hand him the exact thing he came looking for
const AFTER = 'assets/art/scene/finn_after.jpg';         // the door's shut again, and something in the room has changed
const CLEAR_END = 'assets/art/scene/finn_clear_end.jpg';
const GUARDED_END = 'assets/art/scene/finn_guarded_end.jpg';
const BURNED_END = 'assets/art/scene/finn_burned_end.jpg';

// MRS. FINN — widow of Danny Finn, a longshoreman who worked the same crane
// fifteen years and vanished three weeks after he started asking why the tonnage
// on pier six's unmarked crates never matched what came off the boat. No body,
// no funeral, no answer — just his coat still on the hook by her door. She is the
// EMOTIONAL CORE of Chapter 3 and a mirror held up to YOU: she doesn't want
// money and she doesn't want blood. She wants the truth, plain, and her
// husband's name back from whatever file it's rotting in. Grieving, proud, and
// most dangerous exactly when she goes still and quiet — she has already run one
// man with a knife off her porch and left a bribe unopened on her shelf for a
// month; she is nobody's victim to manage.
// THE WOVEN READ: before you say a real word, you have to decide what she
// actually is. The true read — a woman who has stopped grieving and started
// building a case, methodical, wanting only her husband's name cleared — opens
// the approaches that actually reach her (patience, the shared wound of a
// vanished father). Reading her as vengeful or as merely broke still reaches
// every approach, but foregrounds the two moves guaranteed to cost you: money
// insults her, and pushing her toward revenge only hardens the stillness she
// already keeps between herself and the world.
// THE COMPLICATION: mid-conversation, a shadow crosses her frosted-glass door
// and boots stop on the step — one of Kastner's men, making his rounds, checking
// that grief hasn't turned into talking. The real test isn't the visit. It's
// whether your being in that kitchen gets HER watched harder for it — the exact
// fate that swallowed her husband for asking questions.
// Three endings: CLEAR — she trusts you with her husband's own notebook and
// steps forward as a witness; GUARDED — you get the lead, but she keeps you at
// the door's distance, a source and nothing more; BURNED — you cost her the one
// thing she has left, her safety, and she shuts the door on you along with it.
// Palette 'crew' reuses the grimy dock amber already lit for the waterfront cast
// — her kitchen gets the same warm-rust, salt-worn light as the rest of Ch3.
export const FINN_MISSION: Mission = {
  id: 'finn_mission',
  actionId: 'finn_turn',
  nodeId: 'finn',
  label: 'Reach the widow',
  palette: 'crew',
  scene: 'assets/art/scene/finn.jpg',
  teaches: ['interests-not-positions', 'reciprocity'],
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: KITCHEN, text: "Danny Finn worked the same crane on pier six for fifteen years and never missed a shift. Three weeks after he started asking why the tonnage on those unmarked crates never matched the manifest, he didn't come home. No body. No funeral the union would pay for. Just a coat, still on a hook by his own kitchen door, like he'd only stepped out." },
        { who: 'you', caption: true, art: COAT, text: "I know that kind of vanishing. I grew up in the house it leaves behind." },
        { who: 'them', art: STILL, text: "(the door opens before you've knocked — she's been watching you cross the street) You're not from the union. Union men don't hesitate on the step." },
        { who: 'you', art: WARY, text: "No. I'm not from anyone, Mrs. Finn. I just want to know what happened to your husband." },
        { who: 'them', art: WARY, text: "(dry, not unkind, already turning back into the kitchen, leaving the door open behind her — which is either an invitation or a test) Everyone who's said that this month wanted my signature on something after. Sit if you're staying. Don't, if you're not." },
      ],
      ask: "A reporter, an insurance man, and a union lawyer have all stood on this exact step this month, each one calling it sympathy while they angled for something. You've got the length of her kitchen to decide which one she'll take you for. What is Mrs. Finn, really?",
      choices: [
        { id: 'read_truth', label: "A woman who's stopped grieving and started building a case. She doesn't want comfort — she wants the truth, and Danny's name back.", tone: 'disarm', to: 'r_truth' },
        { id: 'read_revenge', label: "A woman who wants somebody to bleed for this. Give her a name to hate and she'll move.", tone: 'push', to: 'r_revenge' },
        { id: 'read_broke', label: "A dockworker's widow with no income left and a coat she can't bring herself to sell. Money talks here.", tone: 'bribe', to: 'r_broke' },
      ],
    },

    // --- THE WOVEN READ: what you decide she truly is, before you say more ---
    {
      id: 'r_truth',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: NOTES, text: "On the counter, half under a dish towel like she doesn't want to be caught at it: a shoebox. Newspaper clippings, a shipping schedule torn out of somewhere she shouldn't have it, a calendar with dates circled in pencil going back to the week Danny started asking questions. That isn't grief laid out on a counter. That's a case file, built by hand, by someone with nowhere else to take it." },
      ],
      ask: "She isn't waiting to be comforted. She's waiting to see if you're finally someone worth handing the file to. How do you open that?",
      choices: [
        { id: 'disarm', label: "Nod at the shoebox — 'You've been building this alone. You don't have to anymore.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal. He asked questions too.'", tone: 'push', to: 'n1' },
        { id: 'press', label: "Lean in — 'I need to know exactly what he found, Mrs. Finn. Now.'", tone: 'press', to: 'p1' },
        { id: 'bribe', label: 'Set money on the table for what she knows.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_revenge',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, art: TURNEDAWAY, text: "You decide she's coiled for payback and just needs someone to point her — and then she mentions, flat, folding a dish towel, that a boy from the crew came by two weeks ago with a knife in his coat, offering to 'handle it.' She ran him off her porch herself, in the rain, and told him if one more man got hurt over her husband she'd never forgive herself for it. That isn't a woman hunting blood. That's a woman actively refusing it." },
      ],
      ask: "Hand a grieving woman a target when what she's actually guarding against is more bodies, and you'll watch her shut the door in your face too. What do you do instead?",
      choices: [
        { id: 'press', label: "Lean in — 'I need to know exactly what he found, Mrs. Finn. Now.'", tone: 'press', to: 'p1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal. He asked questions too.'", tone: 'push', to: 'n1' },
        { id: 'disarm', label: "Nod at the shoebox — 'You've been building this alone. You don't have to anymore.'", tone: 'disarm', to: 'd1' },
        { id: 'bribe', label: 'Set money on the table for what she knows.', tone: 'bribe', to: 'c1' },
      ],
    },
    {
      id: 'r_broke',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: ENVELOPE, text: "You clock the bare cupboards, the coat she still can't sell, and decide a widow this stretched has to need money more than anything else. Then you see it — a fat envelope wedged behind the sugar tin, unopened, gone soft with a month of dust. Kastner's people left it the week after the funeral that never happened. She hasn't touched it. Hasn't thrown it out either. Just left it there, exactly where hush money goes to be refused without the satisfaction of refusing it out loud." },
      ],
      ask: "She's already sitting on more cash than you're about to offer, untouched, on principle. Misread her as broke and you'll only prove you're one more man trying to buy her quiet. What do you actually do?",
      choices: [
        { id: 'bribe', label: 'Set money on the table for what she knows.', tone: 'bribe', to: 'c1' },
        { id: 'disarm', label: "Nod at the shoebox — 'You've been building this alone. You don't have to anymore.'", tone: 'disarm', to: 'd1' },
        { id: 'name', label: "Quietly — 'My father was Tomas Vidal. He asked questions too.'", tone: 'push', to: 'n1' },
        { id: 'press', label: "Lean in — 'I need to know exactly what he found, Mrs. Finn. Now.'", tone: 'press', to: 'p1' },
      ],
    },

    // --- disarm: she tests what you actually want ---
    {
      id: 'd1',
      mood: 'tense',
      beats: [
        { who: 'them', art: SOFTEN, text: "(something in her shoulders eases, half an inch, no more) You're the first one who's said that instead of asking me to say it first. (sits, finally, across from you) So. What do you actually want out of this house — my signature, my story, or my husband's name back?" },
        { who: 'you', art: TEST, text: "The last one. The other two are just what men usually settle for when they can't get it." },
      ],
      ask: "She's watching you decide how fast to move. Let her set the pace, or push for the shoebox now?",
      choices: [
        { id: 'patient', label: "Let her set the pace — 'Whenever you're ready. I'm not leaving before then.'", tone: 'disarm', to: 'turn' },
        { id: 'rush', label: "Push gently — 'I don't have the luxury of slow, Mrs. Finn. What's in the box?'", tone: 'press', to: 'o_guarded' },
      ],
    },

    // --- the name: the mirror moment ---
    {
      id: 'n1',
      mood: 'guilt',
      beats: [
        { who: 'them', art: NAME, text: "(the stillness cracks, just once — her hand stops flat on the table) Vidal. (a long breath) Then you already know what this kitchen sounds like at three in the morning. The specific quiet. The kind where you keep the radio on so the silence doesn't get to talk." },
        { who: 'you', art: GRIEF, text: "I know it. I've never once heard anyone else describe it right until just now." },
        { who: 'them', art: GRIEF, text: "(quieter) Danny asked one question about crates that didn't match a manifest. One. And they took him so clean there wasn't even a body to bury wrong. I don't want revenge on whoever did that. I want the world to admit he asked an honest question and didn't deserve what it cost him." },
      ],
      ask: "She just handed you the truest thing in the house. Build on it together, or use it to get what you came for faster?",
      choices: [
        { id: 'bond', label: "Then help me finish what neither of them got to. For both of them.", tone: 'disarm', to: 'turn' },
        { id: 'leverage', label: "Then you understand exactly why you have to tell me everything, right now.", tone: 'push', to: 'n2' },
      ],
    },
    {
      id: 'n2',
      mood: 'cold',
      beats: [
        { who: 'them', art: STUNG, text: "(the wall goes back up faster than it came down, worse than before) Don't you dare put my husband's name in your mouth to open a door you couldn't open honestly. I thought, for one second, you were different from the rest of them. That was my mistake, not yours." },
      ],
      ask: "You just spent the one thing she trusted you with. Pull back, or take what's left of the leverage?",
      choices: [
        { id: 'ease', label: "Pull back — 'You're right. I'm sorry. Help me because it's true, not because I made you.'", tone: 'disarm', to: 'turn' },
        { id: 'take', label: "Press anyway — 'I still need to know what he found.'", tone: 'push', to: 'o_guarded' },
      ],
    },

    // --- press: dangerous in her stillness ---
    {
      id: 'p1',
      mood: 'threat',
      beats: [
        { who: 'them', art: CALMTHREAT, text: "(sets her teacup down on its saucer, slow and exact, no clatter at all — which is somehow worse than if she'd thrown it) You want to stand in my kitchen, under my husband's coat, and tell me what I owe you." },
        { who: 'them', art: WARN, text: "(quiet, level, absolutely without heat — and that's what makes it land) Get out of this house before I forget that whoever raised you is somebody's mother too, worrying same as I do." },
      ],
      ask: "That wasn't fear. That was a warning from someone who's already buried what fear could do to her. Ease off, or push through it anyway?",
      choices: [
        { id: 'easeoff', label: "Ease off — 'You're right. I'm sorry. I'll wait for you to decide, not tell you to.'", tone: 'disarm', to: 'turn' },
        { id: 'pushfurther', label: "Push through — 'I don't have time to be polite about this, Mrs. Finn.'", tone: 'push', to: 'o_burned' },
      ],
    },

    // --- bribe: money is the one thing that insults her ---
    {
      id: 'c1',
      mood: 'cold',
      beats: [
        { who: 'you', caption: true, art: CASH, text: 'You set a bill on the table between you.' },
        { who: 'them', art: INSULT, text: "(doesn't look at the money — looks at the sugar tin instead, where the envelope's still wedged, unopened) That's the second envelope somebody's tried to leave in this kitchen this month. The first one came from the men who I think took my husband. I haven't opened it, and I haven't thrown it out, because the day I do either, I've decided which one it means. Take yours back before you make me decide about both at once." },
      ],
      ask: "You just handed her the exact insult Kastner's people already tried once. Retract it, or press the point?",
      choices: [
        { id: 'retract', label: "Pull it back — 'You're right. That was wrong of me. I don't want your silence, I want the truth.'", tone: 'disarm', to: 'turn' },
        { id: 'doubledown', label: "Push it toward her — 'Everyone needs it eventually. Take it.'", tone: 'bribe', to: 'o_burned' },
      ],
    },

    // --- THE COMPLICATION: the knock that means someone's watching ---
    {
      id: 'turn',
      mood: 'fear',
      beats: [
        { who: 'you', caption: true, art: KNOCK, text: "A shadow crosses the frosted glass of the kitchen door and boots stop, unhurried, on the step outside. Mrs. Finn doesn't jump. She goes still the way she was still when she opened the door to you — except this stillness has fear folded into the middle of it, precise as a knife in a drawer." },
        { who: 'them', art: STILL, text: "(barely a whisper, not looking away from the glass) Kastner's men make their rounds Thursdays. Checking the widows haven't started talking. Whatever you're going to do, do it now." },
      ],
      ask: "Whoever's on that step didn't come to see her cry. They came to see if grief has turned into talking — and you're standing in the exact kitchen that would prove it. What do you do?",
      choices: [
        { id: 'hide', label: "Step back into the hall — let her handle the door alone, like every other Thursday.", tone: 'disarm', to: 'turn_hide' },
        { id: 'brazen', label: "Stay in plain sight — trust her to cover for you on the spot.", tone: 'press', to: 'turn_brazen' },
        { id: 'confront', label: "Plant yourself in the doorway and meet his eyes — she's not facing this one alone.", tone: 'push', to: 'turn_confront' },
      ],
    },
    {
      id: 'turn_hide',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: HIDE, text: "You're in the hall before the second knock, out of the sightline, holding as still as she is. Through the wall you hear her open the door on the same flat, tired voice she must use every Thursday — nothing to report, no, she hasn't had visitors, no, she's not eating much, thank you for asking. The boots move on. She lets out a breath like she's been holding it since the wedding." },
      ],
      ask: "The danger's passed, and passed clean, because you made yourself invisible for her sake. What do you do with the rest of the time you've got in this kitchen?",
      choices: [
        { id: 'commit', label: "Whatever it costs from here, Danny's name gets cleared — not just the lead you came for.", tone: 'disarm', to: 'o_clear' },
        { id: 'transactional', label: "I need to know what he found. The rest of it I can't promise you.", tone: 'press', to: 'o_guarded' },
      ],
    },
    {
      id: 'turn_brazen',
      mood: 'tense',
      beats: [
        { who: 'you', caption: true, art: BRAZEN, text: "You stay right where you are. She opens the door with you in plain sight at her table and doesn't so much as blink — 'my cousin, up from the south side, come to see how I'm getting on' — delivered so smooth and so fast you'd believe it yourself. The man on the step studies you a beat too long, shrugs, and moves off. She sits back down across from you like her heart isn't still going." },
      ],
      ask: "She covered for you without a second's hesitation, cousin to a man she met an hour ago. What do you do with the time that bought you?",
      choices: [
        { id: 'commit', label: "Whatever it costs from here, Danny's name gets cleared — not just the lead you came for.", tone: 'disarm', to: 'o_clear' },
        { id: 'transactional', label: "I need to know what he found. The rest of it I can't promise you.", tone: 'press', to: 'o_guarded' },
      ],
    },
    {
      id: 'turn_confront',
      mood: 'threat',
      beats: [
        { who: 'you', art: CONFRONT, text: "You plant yourself in the doorway behind her, meeting his eyes straight on. 'You people already took her husband. What exactly do you want with her now?'" },
        { who: 'them', caption: true, art: CONFRONT, text: "The man on the step doesn't answer you. He looks past you, at her, for one long beat too many — cataloguing, you realize, exactly what he's found in this kitchen and exactly who found it there. Then he tips his hat and walks off unhurried, which is so much worse than if he'd hurried at all." },
      ],
      ask: "You just did the one thing Thursdays were built to catch. What now is entirely out of your hands.",
      choices: [
        { id: 'stay', label: "Stay and try to reassure her it'll be fine.", tone: 'disarm', to: 'o_burned' },
      ],
    },

    // --- endings ---
    {
      id: 'o_clear',
      mood: 'warm',
      portrait: CLEAR_END,
      outcome: {
        key: 'clear', tone: 'good',
        title: 'MRS. FINN — HIS OWN HAND',
        line: "She crosses to the door, and for the first time reaches into the coat still hanging there — Danny's coat — and draws a battered notebook from the inner pocket. Dates. Tonnage that never matched a manifest. The name of the boat he'd traced it to, in his own blunt hand, the last entry dated the day before he didn't come home. \"Whatever it takes,\" she says, \"I'll say all of it out loud, to whoever needs to hear it. I just needed to know somebody would actually listen instead of just writing it down and leaving.\"",
        ripple: "You walk out with Danny Finn's own notebook and a witness willing to stand up when it counts — leverage that names the cargo as real, and a widow no longer carrying this alone.",
        reflect: "Sal gave me a ledger because I threw a drowning man a rope. Mrs. Finn gave me her husband's coat pocket because I finally sat still long enough to let her decide I was worth it. Neither one of them wanted a cent. My father would have understood both of them better than I do.",
        heatDelta: -1,
        grants: ['witnessLead', 'finn_helped'],
        dispositions: [{ nodeId: 'finn', set: 4 }],
        campaign: { bonds: [{ id: 'finn', delta: 2 }], faction: { id: 'union', delta: 1 }, ledger: ['finn_helped'] },
        debrief: { principle: 'interests-not-positions',
          note: "Every visitor this month came at her position — sign this, say this, take this money and be quiet. You're the first to answer her actual interest: not comfort, not cash, not blood for blood, just the truth and her husband's name cleared. Danny Finn and Tomas Vidal both asked one honest question and both got erased for it — you didn't win her by promising revenge for that. You won her by wanting the same plain thing she does: **the truth, spoken out loud, by someone willing to listen to all of it.** That's what interests-not-positions actually costs: patience, not price." },
      },
    },
    {
      id: 'o_guarded',
      mood: 'cold',
      portrait: GUARDED_END,
      outcome: {
        key: 'guarded', tone: 'mixed',
        title: 'MRS. FINN — A LEAD, NOT A FRIEND',
        line: "She gives you what you came for — the notebook, the dates, the boat's name — the way you'd hand over a document you'd rather stopped being asked about. \"There. That's everything he found.\" No coat reached for twice, no offer to say any of it out loud herself. Whatever door was open a minute ago, it's closed again, politely, and staying that way.",
        ripple: "You have the thread on the cargo — enough to press Kastner with. You don't have a witness willing to stand behind it, and you don't have a widow who trusts you further than the papers you're holding.",
        reflect: "I got the notebook. I didn't get the woman who kept it seven years next to a dead man's coat, waiting for someone worth handing it to. My father would have waited for the rest of it.",
        grants: ['witnessLead'],
        dispositions: [{ nodeId: 'finn', set: 2 }],
        campaign: { bonds: [{ id: 'finn', delta: 0 }], faction: { id: 'union', delta: 0 }, ledger: ['finn_wary'] },
        debrief: { principle: 'reciprocity',
          note: "She handed you the lead, but notice what she didn't hand you — herself. **Reciprocity** only compounds when something's given freely first and answered in kind; the moment you pushed for the file on your clock instead of hers, or spent her grief to get there faster, you turned a relationship back into a transaction. You'll get the paperwork. You won't get the person who'd testify to it, because trust that's rushed never finishes closing." },
      },
    },
    {
      id: 'o_burned',
      mood: 'threat',
      portrait: BURNED_END,
      outcome: {
        key: 'burned', tone: 'bad',
        title: 'MRS. FINN — A DOOR THAT WON\'T OPEN AGAIN',
        line: "Whatever it cost her — the money you pushed back across her table, the name you demanded instead of earned, or the eyes you let a union man fix on her doorway — it lands the same. She doesn't shout. She just points you at the door, flat and final. \"Get out. You've done exactly what they did — you decided what I owe you and helped yourself to it. Don't come back.\"",
        ripple: "No notebook, no witness — and worse, a widow who was one Thursday away from safe now has a face attached to her kitchen that Kastner's man will remember. You didn't just lose a lead. You may have cost her the only thing she had left.",
        heatDelta: 2,
        dispositions: [{ nodeId: 'finn', set: 0 }],
        campaign: { bonds: [{ id: 'finn', delta: -2 }], faction: { id: 'union', delta: -1 }, ledger: ['finn_burned'] },
        reflect: "Kastner's people already tried to buy her silence once and left the envelope on her shelf when it didn't work. Tonight I leaned on the same woman with the same entitlement, just without the cash — or I let a stranger's eyes find her because I couldn't leave a doorway alone. My father's name got erased by men who decided what other people owed them. Tonight I was one of them.",
        debrief: { principle: 'interests-not-positions',
          note: "You answered her want with the wrong currency entirely. She never asked for money, and pressure only ever answers a demand, never a need — hers was never a demand, it was the plainest interest in the house: the truth, and to be left safe enough to tell it. Reach for revenge, cash, or force with a woman like Mrs. Finn and you're negotiating against a position that was never actually hers. That's the counterexample: get the interest wrong and every lever you pull backfires, because you're solving a problem she doesn't have." },
      },
    },
  ],
};
