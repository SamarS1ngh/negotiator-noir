import type { Mission } from '../domain/mission';

// SANTO — DeLuca's enforcer. A slab of scarred muscle who's hurt more men than he
// can count and felt nothing doing it. You can't frighten him and you can't out-
// muscle him. But DeLuca treats his most dangerous man like a dog — underpays
// him, talks down to him in front of the crew — and even a dog remembers.
//   TURNED  — he steps aside; when you move on DeLuca, he won't lift a hand
//   HEDGES  — he stays out of it; won't help, won't warn
//   LOYAL   — you misjudge him; he tells DeLuca someone's circling (heat)
export const SANTO_MISSION: Mission = {
  id: 'santo_mission',
  actionId: 'santo_turn',
  nodeId: 'santo',
  label: 'Work the enforcer',
  palette: 'marlowe',
  start: 's0',
  nodes: [
    {
      id: 's0',
      mood: 'threat',
      beats: [
        { who: 'you', caption: true, text: "Santo stands outside DeLuca's club like part of the wall, and about as talkative. I've watched him break a man's jaw and then hold a door for the next one. You don't threaten a man like this. You find the one crack in the stone." },
        { who: 'them', text: "(without looking down at me) Members only. And you're not. Walk." },
      ],
      ask: "A wall of a man you can't scare or fight. What's your way in?",
      choices: [
        { id: 'respect', label: "His dignity — 'DeLuca called you his dog in front of the crew last week. I heard it. So did they.'", tone: 'disarm', to: 'n_respect' },
        { id: 'worth', label: "His worth — 'You're the most dangerous man on these streets, and he pays you like a doorman.'", tone: 'disarm', to: 'n_worth' },
        { id: 'threat', label: "Lean on him — 'Help me, or I make sure DeLuca hears you and I talked.'", tone: 'push', to: 'o_loyal' },
      ],
    },
    {
      id: 'n_respect',
      mood: 'tense',
      beats: [
        { who: 'them', text: "(the flat eyes move, finally, down to me) …You heard that." },
        { who: 'you', text: "Everyone heard it. 'My dog.' A man who's bled for him twenty years, and that's the word he uses. Where I come from, you don't say that about a man you respect. You say it about a thing you own." },
        { who: 'them', text: "(a long, dangerous silence) …He's said worse. I don't need respect from a fat man in a loud suit." },
      ],
      ask: "The stone's cracked — there's a slow anger under it. Push it, or offer him something?",
      choices: [
        { id: 'offer', label: "Offer him out — 'Then stop being his dog. Step aside when I move on him. That's all.'", tone: 'disarm', to: 'o_turned' },
        { id: 'goad', label: "Goad him — 'Prove me wrong, then. Go run and tell him like a good dog.'", tone: 'push', to: 'o_hedges' },
      ],
    },
    {
      id: 'n_worth',
      mood: 'tense',
      beats: [
        { who: 'them', text: "(a grunt that might be a laugh) Money. Everyone thinks it's money. It's never been the money." },
        { who: 'you', text: "Then what? Twenty years, the same corner, the same club, breaking the same men for a man who calls you a dog. What's it for, Santo?" },
        { who: 'them', text: "(quiet) …I don't know anymore. That's the honest answer. I stopped knowing a long time ago." },
      ],
      ask: "You've found the empty place under the muscle. What do you put in it?",
      choices: [
        { id: 'choice', label: "A choice of his own — 'Then for once, do a thing because you chose it. Step aside.'", tone: 'disarm', to: 'o_turned' },
        { id: 'pity', label: "Pity him — 'You poor bastard. You've got nothing.'", tone: 'push', to: 'o_hedges' },
      ],
    },
    {
      id: 'o_turned',
      mood: 'warm',
      outcome: {
        key: 'turned', tone: 'good',
        title: 'SANTO — HE STEPS BACK',
        line: "He looks at his own scarred hands for a while. \"When you move on him,\" he says, \"I'll be somewhere else. I've been his hand for twenty years. Let's see how he does without one.\"",
        ripple: "DeLuca's muscle just quietly stepped back. When you make your move, the most dangerous man in the district will be looking the other way.",
        reflect: "I gave a killer his first choice in twenty years, and he chose me. I should feel like I saved something. Mostly I feel like I found a better weapon.",
        grants: ['santoTurned'],
        dispositions: [{ nodeId: 'santo', set: 4 }],
      },
    },
    {
      id: 'o_hedges',
      mood: 'cold',
      outcome: {
        key: 'hedges', tone: 'mixed',
        title: 'SANTO — HE STAYS OUT OF IT',
        line: "He turns back to the door and the conversation is over. \"I won't help you. I won't stop you. Do what you came to do and leave me my corner.\" Neutral, immovable, a wall again.",
        ripple: "Santo won't warn DeLuca — but he won't step aside either. You'll have to move on DeLuca with his muscle still standing.",
        dispositions: [{ nodeId: 'santo', set: 2 }],
      },
    },
    {
      id: 'o_loyal',
      mood: 'threat',
      outcome: {
        key: 'loyal', tone: 'bad',
        title: 'SANTO — STILL THE DOG',
        line: "\"Threaten me.\" He says it slowly, like tasting it. \"You threaten ME.\" A hand the size of a shovel closes on your collar and walks you to the street. He's already deciding whether to mention you to DeLuca. He decides yes.",
        ripple: "You leaned on the one man who can't be leaned on. Santo tells DeLuca a stranger's been circling — DeLuca tightens the district and waits.",
        reflect: "Threatened a killer to his face. My father would have read the man before he opened his mouth. I keep leading with the thing I hate about the men I'm hunting.",
        heatDelta: 3,
        worldFlags: ['delucaForewarned'],
        dispositions: [{ nodeId: 'santo', set: 0 }],
      },
    },
  ],
};
