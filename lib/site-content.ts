import type { MediaAsset } from '@/lib/media'

export interface RelationshipMilestone {
  label: string
  title: string
  description: string
}

export interface LoveReason {
  title: string
  subtitle: string
  description: string
  image: MediaAsset
}

export interface SpecialWishEntry {
  id: string
  clue: string
  prompt: string
  answers: string[]
  mediaSrc: string
  mediaType: 'video' | 'audio'
}

export interface HeroPixelSectionContent {
  eyebrow: string
  title: string
  body: string
  hint: string
  image: MediaAsset
}

export interface MemoriesSectionContent {
  eyebrow: string
  title: string
  intro: string
  body: string
  aside: string
  lines: string[]
}

export interface JourneySectionContent {
  eyebrow: string
  title: string
  intro: string
  closing: string
}

export interface ColorRevealSectionContent {
  eyebrow: string
  title: string
  body: string
  bodyTwo: string
  image: MediaAsset
}

export interface LetterSectionContent {
  eyebrow: string
  title: string
  personalizationTitle: string
  personalizationBody: string
}

export interface FinalSectionContent {
  eyebrow: string
  title: string
  tags: string[]
}

export interface SpecialWishesSectionContent {
  eyebrow: string
  title: string
  completedTitle: string
  completedBody: string
}

export interface SiteContent {
  heroImages: MediaAsset[]
  heroPixelSectionContent: HeroPixelSectionContent
  memoryGalleryImages: MediaAsset[]
  memoriesSectionContent: MemoriesSectionContent
  journeyImages: MediaAsset[]
  relationshipMilestones: RelationshipMilestone[]
  journeySectionContent: JourneySectionContent
  colorRevealSectionContent: ColorRevealSectionContent
  loveReasons: LoveReason[]
  specialWishEntries: SpecialWishEntry[]
  specialWishesSectionContent: SpecialWishesSectionContent
  closingLines: string[]
  letterSectionContent: LetterSectionContent
  finalSectionContent: FinalSectionContent
}

export const heroImages: MediaAsset[] = [
  {
    src: '/images/whylove/1.jpg',
    alt: 'Portrait detail for the hero section',
    caption: 'The kind of face that makes time slow down.',
  },
  {
    src: '/images/memories/2.jpg',
    alt: 'Dreamy memory card image',
    caption: 'Even ordinary days feel cinematic with you in them.',
  },
  {
    src: '/images/whylove/4.jpg',
    alt: 'Soft portrait for editorial stack',
    caption: 'You make calm look beautiful.',
  },
]

export const heroPixelSectionContent: HeroPixelSectionContent = {
  eyebrow: 'Happy birthday, Saniya',
  title: 'A little birthday note first, then the whole picture finds you.',
  body:
    'It starts quietly, right in the center, like the first thing I wanted you to see. Then as you scroll, the words drift aside and the scattered pixels come together, because that is exactly what you did to my life too.',
  hint: 'Scroll gently and let the picture appear.',
  image: {
    src: '/images/whylove/5.jpg',
    alt: 'Romantic portrait for the opening particle reveal',
  },
}

export const memoryGalleryImages: MediaAsset[] = [
  {
    src: '/images/memories/1.jpg',
    alt: 'Shared memory one',
    caption: 'The first frame I always come back to.',
    note: 'It still feels warm in my head, like the room kept a little of your light after we left.',
  },
  {
    src: '/images/memories/2.jpg',
    alt: 'Shared memory two',
    caption: 'A quiet moment that still glows.',
    note: 'Some memories are loud. This one is soft, and somehow that makes it stay longer.',
  },
  {
    src: '/images/memories/3.jpg',
    alt: 'Shared memory three',
    caption: 'Proof that your presence changes the mood of a room.',
    note: 'You have this way of making ordinary places feel chosen, like they matter just because you were there.',
  },
  {
    src: '/images/memories/4.jpg',
    alt: 'Shared memory four',
    caption: 'The kind of memory that keeps replaying on its own.',
    note: 'Not because something huge happened, but because being with you made even the small parts unforgettable.',
  },
  {
    src: '/images/memories/5.jpg',
    alt: 'Shared memory five',
    caption: 'Soft, vivid, and impossible to forget.',
    note: 'This is the sort of moment I would keep even if I had to give back everything else.',
  },
  {
    src: '/images/memories/6.jpg',
    alt: 'Shared memory six',
    caption: 'A moment that made everything feel more real.',
    note: 'The kind of second that quietly changes the shape of the whole day around it.',
  },
  {
    src: '/images/whylove/2.jpg',
    alt: 'Portrait memory seven',
    caption: 'The smile that made my whole day reset.',
    note: 'You smiled, and suddenly every other thought felt less important than staying in that moment.',
  },
  {
    src: '/images/whylove/5.jpg',
    alt: 'Portrait memory eight',
    caption: 'Still one of my favorite views in the world.',
    note: 'Some people become a place inside you. That is what these memories feel like now.',
  },
  {
    src: '/images/childhood/1.jpg',
    alt: 'Shared memory nine',
    caption: 'The softness was always there, even in the earliest frames.',
    note: 'Some photos feel less like old pictures and more like proof that sweetness was always part of you.',
  },
  {
    src: '/images/childhood/2.jpg',
    alt: 'Shared memory ten',
    caption: 'An older chapter that still feels quietly alive.',
    note: 'Looking back at this one feels like finding the beginning of something beautiful long before I knew it.',
  },
  {
    src: '/images/childhood/3.jpg',
    alt: 'Shared memory eleven',
    caption: 'A little version of you that still melts my heart.',
    note: 'There is something precious about seeing how innocence and warmth were already written into you so early.',
  },
  {
    src: '/images/childhood/4.jpg',
    alt: 'Shared memory twelve',
    caption: 'The kind of frame that makes time feel gentle.',
    note: 'This is the sort of memory that does not need noise. It stays simply because it feels pure.',
  },
  {
    src: '/images/whylove/1.jpg',
    alt: 'Shared memory thirteen',
    caption: 'The look that always manages to stay with me.',
    note: 'Some expressions pass in a second, but yours have a strange way of staying in my thoughts for much longer.',
  },
  {
    src: '/images/whylove/3.jpg',
    alt: 'Shared memory fourteen',
    caption: 'A frame full of your playful little magic.',
    note: 'Even in stillness, there is something lively about you that makes the whole moment feel awake.',
  },
  {
    src: '/images/whylove/4.jpg',
    alt: 'Shared memory fifteen',
    caption: 'One more reason these memories never really leave me.',
    note: 'The more I look through these moments, the more they feel less like the past and more like a part of me now.',
  },
]

export const memoriesSectionContent: MemoriesSectionContent = {
  eyebrow: 'Our memories',
  title: 'A whole section just for the moments that still replay in my chest.',
  intro:
    'I kept this one separate on purpose. It deserves its own atmosphere, its own pace, and its own kind of softness.',
  body:
    'This gallery is meant to feel like flipping through memories that never really went away. The motion is dreamy, the colors stay inside the same romantic palette, and every image can be replaced from one file whenever you want.',
  aside:
    'Right now these are dummy images, but the structure is ready for your real photos or Cloudinary public IDs whenever you want to swap them in.',
  lines: [
    'A random meeting, but somehow it changed everything.',
    'From study talks to smiles I started waiting for.',
    'You asked for my number, and maybe that was where fate quietly smiled.',
    'Those formal conversations never knew they would become this close.',
    'The same PG, the same days, and slowly the same comfort.',
    'Late-night calls made the distance between two hearts disappear.',
    'Every outing with you became a memory I still replay.',
    'Love came softly, but once it came, it felt like home.',
  ],
}

export const journeyImages: MediaAsset[] = [
  { src: '/images/childhood/1.jpg', alt: 'Journey image one' },
  { src: '/images/childhood/2.jpg', alt: 'Journey image two' },
  { src: '/images/childhood/3.jpg', alt: 'Journey image three' },
  { src: '/images/childhood/4.jpg', alt: 'Journey image four' },
  { src: '/images/memories/1.jpg', alt: 'Journey image five' },
  { src: '/images/memories/2.jpg', alt: 'Journey image six' },
  { src: '/images/memories/3.jpg', alt: 'Journey image seven' },
  { src: '/images/memories/4.jpg', alt: 'Journey image eight' },
  { src: '/images/memories/5.jpg', alt: 'Journey image nine' },
  { src: '/images/memories/6.jpg', alt: 'Journey image ten' },
  { src: '/images/whylove/1.jpg', alt: 'Journey image eleven' },
  { src: '/images/whylove/2.jpg', alt: 'Journey image twelve' },
  { src: '/images/whylove/3.jpg', alt: 'Journey image thirteen' },
  { src: '/images/whylove/4.jpg', alt: 'Journey image fourteen' },
  { src: '/images/whylove/5.jpg', alt: 'Journey image fifteen' },
]

export const relationshipMilestones: RelationshipMilestone[] = [
  {
    label: 'Childhood',
    title: 'Silent, innocent, and already carrying something special.',
    description:
      'As a little girl, you were quiet, innocent, and full of a sweet kind of cleverness. You were never the loud kind of shine. You were the soft kind people slowly notice and never forget.',
  },
  {
    label: 'Growing up',
    title: 'You kept pulling the best out of every stage of life.',
    description:
      'In childhood, you pulled the highest marks in almost every subject, as if excellence had already chosen you. As you grew, that same brilliance stayed with you and became grace, sincerity, and a quiet strength.',
  },
  {
    label: 'Becoming you',
    title: 'Beauty, innocence, and grace kept growing together in you.',
    description:
      'As you grew, you did not just become more beautiful. You became more graceful, more understanding, and even more precious. The lovely thing about you is that your outer beauty is only one part of what makes you unforgettable.',
  },
  {
    label: 'My favorite part',
    title: 'And then, without even trying, you pulled my whole heart too.',
    description:
      'You once pulled the highest marks in every subject, but somewhere along the way, you ended up pulling something even bigger, my whole heart. With your love, your care, and your presence, you made me feel like the happiest person to ever exist.',
  },
]

export const journeySectionContent: JourneySectionContent = {
  eyebrow: 'Your journey',
  title: 'The day Saniya was born, the world quietly became a more beautiful place.',
  intro:
    'Sometimes I really feel thankful to your parents for bringing someone like you into this world. You are pretty, beautiful, innocent, and full of a softness that is very rare. There are many ways to describe beauty, but honestly, you feel beyond all of them.',
  closing:
    'No camera, no photo, and no eyes can fully capture your real beauty, because the most beautiful part of you is not only how you look, it is also how you are.',
}

export const colorRevealSectionContent: ColorRevealSectionContent = {
  eyebrow: 'Before you',
  title: 'Before you, everything felt muted. You made it vivid.',
  body:
    'Life was moving, but it was not glowing. It felt quieter, flatter, almost like I was only seeing it in outlines. Then your presence arrived and suddenly everything had warmth again.',
  bodyTwo:
    'You did not just add color. You changed the whole atmosphere. Ordinary days started feeling brighter, softer, and worth remembering in a completely different way.',
  image: {
    src: '/images/bwtocolor/1-color.jpg',
    alt: 'Color reveal portrait',
  },
}

export const loveReasons: LoveReason[] = [
  {
    title: 'Your eyes',
    subtitle: 'The first thing that quietly makes everything else disappear.',
    description:
      'Your eyes have this impossible way of holding softness and mischief together. They do not just look beautiful. They make moments feel slower, closer, and somehow more honest than they were a second before.',
    image: { src: '/images/whylove/1.jpg', alt: 'Eyes portrait detail' },
  },
  {
    title: 'Your smile',
    subtitle: 'The version of joy that never needs an explanation.',
    description:
      'Your smile changes the whole mood around it. It makes ordinary frames look brighter and turns small moments into the kind that stay in my head long after they are over.',
    image: { src: '/images/whylove/2.jpg', alt: 'Smiling portrait detail' },
  },
  {
    title: 'Your looks',
    subtitle: 'The kind of beauty that keeps feeling new.',
    description:
      'It is not just one feature. It is the whole way you carry yourself, the softness, the glow, the little details that make you look like someone a person could keep looking at without getting tired for even a second.',
    image: { src: '/images/whylove/5.jpg', alt: 'Looks portrait detail' },
  },
  {
    title: 'Your anger',
    subtitle: 'Even your storms feel real in a way I cannot ignore.',
    description:
      'There is something strangely beautiful about the way you care enough to feel things deeply. Even your anger feels alive and honest, like proof that what matters to you is never fake or half-hearted.',
    image: { src: '/images/whylove/4.jpg', alt: 'Anger portrait detail' },
  },
  {
    title: 'Your funny way',
    subtitle: 'The playful little chaos that makes being around you unforgettable.',
    description:
      'Your humor, your timing, your random little ways of saying things, all of it makes you feel so alive. You make people smile without forcing it, and that kind of charm is impossible to fake.',
    image: { src: '/images/whylove/3.jpg', alt: 'Funny portrait detail' },
  },
]

export const specialWishesSectionContent: SpecialWishesSectionContent = {
  eyebrow: 'Some wishes from special persons',
  title: 'Seven little guesses, seven voices waiting for her.',
  completedTitle: 'Every special person got their moment.',
  completedBody: 'That was the last one. A full little chain of voices just for her.',
}

export const specialWishEntries: SpecialWishEntry[] = [
  {
    id: 'wish-1',
    clue: 'This person knew your tiny-school-days version before the glow-up became obvious to the rest of us.',
    prompt: 'Who could this childhood friend be?',
    answers: ['riya'],
    mediaSrc: '/videos/special-wishes/1.mp4',
    mediaType: 'video',
  },
  {
    id: 'wish-2',
    clue: 'This one probably knows the embarrassing stories, the secret nicknames, and still adores you anyway.',
    prompt: 'Type the name to unlock the next wish.',
    answers: ['neha'],
    mediaSrc: '/videos/special-wishes/2.mp4',
    mediaType: 'video',
  },
  {
    id: 'wish-3',
    clue: 'A person from your old circle who can probably recognize your mood from one voice note.',
    prompt: 'Who do you think sent this?',
    answers: ['ananya'],
    mediaSrc: '/videos/special-wishes/3.mp4',
    mediaType: 'video',
  },
  {
    id: 'wish-4',
    clue: 'Someone who has seen your chaos and your sweetest side and kept choosing your friendship.',
    prompt: 'Guess the friend to continue.',
    answers: ['sakshi'],
    mediaSrc: '/videos/special-wishes/4.mp4',
    mediaType: 'video',
  },
  {
    id: 'wish-5',
    clue: 'This person feels like one of those names attached to core memories, old jokes, and random late-night talks.',
    prompt: 'Enter the right name to reveal the wish.',
    answers: ['simran'],
    mediaSrc: '/videos/special-wishes/5.mp4',
    mediaType: 'video',
  },
  {
    id: 'wish-6',
    clue: 'A special person who would definitely know the version of you that nobody else gets to see first.',
    prompt: 'Who is behind this one?',
    answers: ['muskan'],
    mediaSrc: '/videos/special-wishes/6.mp3',
    mediaType: 'audio',
  },
  {
    id: 'wish-7',
    clue: 'The final one comes from someone whose place in your life is stitched into years, not just moments.',
    prompt: 'One last guess.',
    answers: ['khushi'],
    mediaSrc: '/videos/special-wishes/7.mp4',
    mediaType: 'video',
  },
]

export const closingLines = [
  'You have this rare way of making life feel more detailed.',
  'More golden. More memorable. More worth pausing for.',
  'This page is only a small attempt at saying what you actually deserve to hear in person.',
  'You are loved deeply, admired endlessly, and thought about far more often than I know how to summarize.',
]

export const letterSectionContent: LetterSectionContent = {
  eyebrow: 'A note from my heart',
  title: 'Some people enter quietly, and still change everything.',
  personalizationTitle: '',
  personalizationBody: '',
}

export const finalSectionContent: FinalSectionContent = {
  eyebrow: 'For Saniya, always',
  title: 'You are, and always will be, my favorite feeling in this whole world.',
  tags: ['All my love, all my rights reserved by me for you.'],
}

export const defaultSiteContent: SiteContent = {
  heroImages,
  heroPixelSectionContent,
  memoryGalleryImages,
  memoriesSectionContent,
  journeyImages,
  relationshipMilestones,
  journeySectionContent,
  colorRevealSectionContent,
  loveReasons,
  specialWishEntries,
  specialWishesSectionContent,
  closingLines,
  letterSectionContent,
  finalSectionContent,
}
