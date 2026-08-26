export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string };

export type Author = {
  name: string;
  role: string;
  initials: string;
  avatar: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  featured?: boolean;
  image: string;
  content: PostBlock[];
};

function avatarFor(seed: string) {
  return `https://i.pravatar.cc/150?u=${seed}`;
}

const authors: Record<string, Author> = {
  maya: {
    name: "Maya Ferreira",
    role: "Travel Editor",
    initials: "MF",
    avatar: avatarFor("maya-ferreira-rsd"),
  },
  jonas: {
    name: "Jonas Willett",
    role: "Staff Writer",
    initials: "JW",
    avatar: avatarFor("jonas-willett-rsd"),
  },
  amara: {
    name: "Amara Osei",
    role: "Culture Editor",
    initials: "AO",
    avatar: avatarFor("amara-osei-rsd"),
  },
  priya: {
    name: "Priya Nair",
    role: "Wellness Contributor",
    initials: "PN",
    avatar: avatarFor("priya-nair-rsd"),
  },
  leo: {
    name: "Leo Bianchi",
    role: "Lifestyle Editor",
    initials: "LB",
    avatar: avatarFor("leo-bianchi-rsd"),
  },
};

function coverImage(seed: string) {
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

export const posts: Post[] = [
  // Travel
  {
    slug: "slow-mornings-in-lisbon",
    title: "Slow Mornings in Lisbon",
    excerpt:
      "Why the best way to know a city is to wake up early, find a bakery, and let the rest of the day unfold on its own schedule.",
    category: "travel",
    author: authors.maya,
    date: "2026-08-12",
    readTime: "6 min read",
    featured: true,
    image: coverImage("slow-mornings-in-lisbon"),
    content: [
      {
        type: "paragraph",
        text: "Lisbon does not ask to be rushed. The trams still climb the same hills they did a century ago, the pastelarias open before the sun has cleared the rooftops, and nobody seems to be in a hurry to get anywhere in particular. I spent five mornings doing exactly one thing before nine a.m.: walking, without a destination, until I found somewhere serving coffee.",
      },
      {
        type: "heading",
        text: "The ritual of the first coffee",
      },
      {
        type: "paragraph",
        text: "There is a particular quiet to a Lisbon café at seven in the morning — the espresso machine hissing, a handful of regulars reading the paper standing up at the counter, the smell of custard tart just out of the oven. I learned to order a bica and a pastel de nata and say nothing else, and it was enough to be waved toward a stool by the window.",
      },
      {
        type: "paragraph",
        text: "By the third morning I had a route: down through Alfama's narrow stairs while the laundry lines were still damp, along the river where the light comes in low and gold, and back up through streets that hadn't yet filled with tourists. None of it was planned. All of it became the part of the trip I remember most clearly.",
      },
      {
        type: "quote",
        text: "You don't need an itinerary to know a place. You need one good bakery and the willingness to get a little lost on the way there.",
      },
      {
        type: "paragraph",
        text: "If you're planning your own trip, resist the urge to fill every morning with a museum or a monument. Leave the first two hours of the day empty. Let the city fill them for you.",
      },
    ],
  },
  {
    slug: "the-night-trains-of-eastern-europe",
    title: "The Night Trains of Eastern Europe",
    excerpt:
      "A love letter to the sleeper cars, border checks, and unexpected conversations that come with crossing a continent after dark.",
    category: "travel",
    author: authors.jonas,
    date: "2026-07-28",
    readTime: "8 min read",
    image: coverImage("the-night-trains-of-eastern-europe"),
    content: [
      {
        type: "paragraph",
        text: "There's a specific kind of stillness that settles over a sleeper compartment once the conductor has checked your ticket and the corridor lights dim. Outside, fields and small stations blur past in the dark. Inside, four strangers negotiate who gets the top bunk.",
      },
      {
        type: "paragraph",
        text: "I've taken the overnight train between Budapest and Kraków three times now, and no two trips have looked the same. Once it was a retired geologist who spent an hour explaining the limestone formations we couldn't see. Another time it was two students heading home for a wedding, sharing a bag of langos through the dark.",
      },
      {
        type: "heading",
        text: "Why the slow way still wins",
      },
      {
        type: "paragraph",
        text: "A budget flight would get you there in under two hours. But you'd miss the border crossing at 3 a.m., the half-asleep passport checks, the way the whole car goes quiet and then, somehow, back to laughing within minutes. Night trains compress a journey into something communal in a way air travel rarely manages.",
      },
      {
        type: "paragraph",
        text: "Bring your own snacks, a scarf that doubles as a pillow, and low expectations for sleep. What you get in return is a version of travel that feels increasingly rare — unhurried, a little uncomfortable, and genuinely memorable.",
      },
    ],
  },
  {
    slug: "packing-light-for-three-months",
    title: "Packing Light for Three Months",
    excerpt:
      "Everything I learned about carry-on-only travel after a season of moving between six countries with one bag.",
    category: "travel",
    author: authors.maya,
    date: "2026-06-15",
    readTime: "5 min read",
    image: coverImage("packing-light-for-three-months"),
    content: [
      {
        type: "paragraph",
        text: "The bag was 40 liters. The trip was three months, six countries, and every kind of weather from alpine cold to coastal humidity. Here's what actually made the cut, and what I mailed home after week two.",
      },
      {
        type: "paragraph",
        text: "The rule that saved me: everything had to work at least two ways. One rain shell that also worked as a windbreaker for early flights. One pair of shoes that could handle a hike and a nice dinner without looking like it was trying too hard at either.",
      },
      {
        type: "heading",
        text: "What I actually wore, daily",
      },
      {
        type: "paragraph",
        text: "Four merino t-shirts, two pairs of trousers, one packable dress, a compression cube for the layers I hoped not to need. Laundry became a weekly ritual rather than an emergency, usually done in a sink with travel detergent and a lot of patience.",
      },
      {
        type: "paragraph",
        text: "The biggest lesson wasn't about gear at all — it was that owning less on the road made decisions faster. Fewer choices in the morning meant more time for the parts of the trip that actually mattered.",
      },
    ],
  },

  // Lifestyle
  {
    slug: "the-case-for-a-slower-morning-routine",
    title: "The Case for a Slower Morning Routine",
    excerpt:
      "No cold plunges, no five a.m. alarms — just a handful of small habits that make the first hour of the day feel like yours again.",
    category: "lifestyle",
    author: authors.leo,
    date: "2026-08-05",
    readTime: "5 min read",
    image: coverImage("the-case-for-a-slower-morning-routine"),
    content: [
      {
        type: "paragraph",
        text: "Somewhere along the way, the morning routine became a competitive sport — cold plunges, sunrise runs, journaling prompts, a supplement stack that needs its own shelf. I tried most of it. None of it stuck.",
      },
      {
        type: "paragraph",
        text: "What did stick was smaller and far less photogenic: waking up without immediately reaching for my phone, making coffee slowly instead of hitting a button and walking away, and sitting somewhere with natural light for ten minutes before opening a laptop.",
      },
      {
        type: "heading",
        text: "Small habits, compounded",
      },
      {
        type: "paragraph",
        text: "None of these changes were dramatic on their own. Together, they shifted how the whole day felt — less reactive, more like something I was choosing rather than something happening to me.",
      },
      {
        type: "quote",
        text: "A morning routine doesn't need to optimize you. It just needs to belong to you.",
      },
    ],
  },
  {
    slug: "how-to-build-a-capsule-wardrobe-that-actually-works",
    title: "How to Build a Capsule Wardrobe That Actually Works",
    excerpt:
      "A practical, no-nonsense approach to fewer clothes and more outfits — without another Pinterest board you'll never open again.",
    category: "lifestyle",
    author: authors.leo,
    date: "2026-07-19",
    readTime: "7 min read",
    image: coverImage("how-to-build-a-capsule-wardrobe-that-actually-works"),
    content: [
      {
        type: "paragraph",
        text: "Capsule wardrobes have a branding problem. They sound restrictive, like a rulebook for people who enjoy denying themselves things. In practice, a good one is the opposite — it's about removing friction, not adding limits.",
      },
      {
        type: "paragraph",
        text: "Start with what you already reach for. Before buying anything, spend two weeks tracking what you actually wear. You'll likely find it's a smaller list than your closet suggests, and that list is your real starting palette.",
      },
      {
        type: "heading",
        text: "Building around a neutral base",
      },
      {
        type: "paragraph",
        text: "Charcoal, cream, and one warm accent tone go a long way. Once the base pieces coordinate with each other by default, getting dressed stops being a decision and starts being a formality.",
      },
      {
        type: "paragraph",
        text: "The goal isn't fewer clothes for its own sake. It's a closet where nearly everything works with everything else, so the only real question in the morning is what you feel like wearing.",
      },
    ],
  },
  {
    slug: "the-quiet-appeal-of-analog-hobbies",
    title: "The Quiet Appeal of Analog Hobbies",
    excerpt:
      "Film cameras, paper maps, letterpress cards — why doing things the slow, imperfect way has become its own kind of luxury.",
    category: "lifestyle",
    author: authors.jonas,
    date: "2026-06-30",
    readTime: "6 min read",
    image: coverImage("the-quiet-appeal-of-analog-hobbies"),
    content: [
      {
        type: "paragraph",
        text: "I bought a film camera on a whim two years ago, mostly out of nostalgia. What kept me shooting with it had nothing to do with nostalgia at all — it was the wait. Twenty-four exposures, then a week before you see any of them.",
      },
      {
        type: "paragraph",
        text: "That delay changes how you shoot. You think harder about the frame because you can't check it immediately. You take fewer photos and, somehow, end up with more that actually matter.",
      },
      {
        type: "heading",
        text: "Friction as a feature",
      },
      {
        type: "paragraph",
        text: "The same logic shows up in a lot of analog hobbies — hand-writing letters, using a paper map instead of a phone, cooking from a printed recipe instead of a scrolling video. The extra effort isn't a bug. It's what makes the activity feel like it belongs to you rather than to an algorithm.",
      },
    ],
  },

  // Culture
  {
    slug: "the-grandmothers-who-keep-a-cuisine-alive",
    title: "The Grandmothers Who Keep a Cuisine Alive",
    excerpt:
      "In a small kitchen outside Palermo, three generations of women still make the same Sunday sauce — and the recipe has never been written down.",
    category: "culture",
    author: authors.amara,
    date: "2026-08-01",
    readTime: "9 min read",
    image: coverImage("the-grandmothers-who-keep-a-cuisine-alive"),
    content: [
      {
        type: "paragraph",
        text: "Nonna Concetta doesn't measure anything. Salt goes in by feel, the tomatoes go in when they smell right, and the sauce is done when it's done — not a minute before, no matter what the clock says.",
      },
      {
        type: "paragraph",
        text: "For three generations, the Sunday sauce in this kitchen has passed down through watching, not writing. Her daughter learned by standing at her elbow. Her granddaughter is learning the same way now, phone camera rolling, half for memory and half in case the details slip.",
      },
      {
        type: "heading",
        text: "A recipe that resists translation",
      },
      {
        type: "paragraph",
        text: "Ask Concetta for exact quantities and she laughs. It isn't that she's withholding the recipe — it's that the recipe was never really about quantities. It's about the sound the garlic makes when it's ready, the color of the oil, decisions made by instinct built over sixty years of Sundays.",
      },
      {
        type: "quote",
        text: "You don't learn this from a card. You learn it from standing here long enough that your hands remember before your head does.",
      },
      {
        type: "paragraph",
        text: "That's the quiet threat facing a lot of home cuisines — not that anyone stops caring, but that the knowledge only exists in kitchens like this one, passed down in person, one Sunday at a time.",
      },
    ],
  },
  {
    slug: "night-markets-and-the-art-of-eating-standing-up",
    title: "Night Markets and the Art of Eating Standing Up",
    excerpt:
      "From Taipei to Oaxaca, the world's best meals rarely come with a tablecloth — here's what night markets teach us about food and community.",
    category: "culture",
    author: authors.amara,
    date: "2026-07-10",
    readTime: "7 min read",
    image: coverImage("night-markets-and-the-art-of-eating-standing-up"),
    content: [
      {
        type: "paragraph",
        text: "There's no reservation system at a night market, no hostess, no menu with a wine pairing suggestion. There's a plastic stool if you're lucky, a stranger's elbow next to yours, and a vendor who has made the same dish ten thousand times.",
      },
      {
        type: "paragraph",
        text: "What struck me most across markets in Taipei, Oaxaca, and Marrakech wasn't the food itself, though it was extraordinary — it was how little ceremony surrounded it. Eating well didn't require a special occasion. It just required showing up hungry.",
      },
      {
        type: "heading",
        text: "Food without the formality",
      },
      {
        type: "paragraph",
        text: "Night markets strip dining down to its essentials: good ingredients, someone who knows exactly what to do with them, and a crowd that agrees they've found something worth standing in line for. There's a lesson in there for how we think about food back home, where a good meal has come to imply a certain amount of production.",
      },
    ],
  },
  {
    slug: "the-last-letterpress-in-town",
    title: "The Last Letterpress in Town",
    excerpt:
      "A print shop that has survived three recessions and a pandemic on the strength of wedding invitations and stubborn craftsmanship.",
    category: "culture",
    author: authors.jonas,
    date: "2026-05-22",
    readTime: "6 min read",
    image: coverImage("the-last-letterpress-in-town"),
    content: [
      {
        type: "paragraph",
        text: "The presses are older than anyone currently working them. Cast iron, foot-pedaled, the kind of machine that requires you to listen to it as much as operate it. Mateo has run this shop for eleven years and can tell when a roller needs adjusting by the sound of a single pass.",
      },
      {
        type: "paragraph",
        text: "Letterpress printing should have died decades ago, economically speaking. It's slower and more expensive than digital printing in every measurable way. And yet the orders keep coming — wedding invitations, mostly, from people who want to feel the impression of the type pressed into heavy paper.",
      },
      {
        type: "heading",
        text: "Slowness as the selling point",
      },
      {
        type: "paragraph",
        text: "\"People aren't paying for the ink,\" Mateo told me. \"They're paying for the fact that a person had to set every letter by hand.\" In an age of instant everything, that fact alone has become the whole product.",
      },
    ],
  },

  // Wellness
  {
    slug: "what-a-decade-of-journaling-taught-me",
    title: "What a Decade of Journaling Taught Me",
    excerpt:
      "Ten years, dozens of notebooks, and one honest takeaway: the habit matters far more than the method.",
    category: "wellness",
    author: authors.priya,
    date: "2026-08-18",
    readTime: "6 min read",
    image: coverImage("what-a-decade-of-journaling-taught-me"),
    content: [
      {
        type: "paragraph",
        text: "I've tried bullet journaling, gratitude lists, morning pages, and a stretch of therapy-recommended prompts I mostly ignored. What survived a decade wasn't any particular method. It was showing up with a pen most days, even for two sentences.",
      },
      {
        type: "paragraph",
        text: "The notebooks themselves are a strange kind of time capsule. Flipping back through them isn't always flattering — a lot of repeated worries, the same arguments with myself. But that repetition turned out to be useful information, a pattern I couldn't see in the moment but could see clearly on the page.",
      },
      {
        type: "heading",
        text: "Consistency beats the perfect prompt",
      },
      {
        type: "paragraph",
        text: "If you've stalled out on journaling because you can't find the right format, that's the wrong problem to solve. Write badly, write short, write about nothing in particular. The format matters far less than showing up again tomorrow.",
      },
    ],
  },
  {
    slug: "walking-as-medicine",
    title: "Walking as Medicine",
    excerpt:
      "No app, no plan, no destination — just forty minutes a day and a habit that quietly reshaped how I handle stress.",
    category: "wellness",
    author: authors.priya,
    date: "2026-07-03",
    readTime: "5 min read",
    image: coverImage("walking-as-medicine"),
    content: [
      {
        type: "paragraph",
        text: "It started as a way to avoid a difficult phone call. I put on shoes, left my phone at home, and walked for forty minutes with no destination. I've done some version of that walk almost every day since.",
      },
      {
        type: "paragraph",
        text: "There's a specific kind of thinking that only seems to happen in motion — not the productive, list-making kind, but something slower and more honest. Problems that felt unsolvable at a desk tend to loosen their grip somewhere around minute twenty.",
      },
      {
        type: "quote",
        text: "The walk rarely solves anything directly. It just makes the problem small enough to fit back in my hands.",
      },
      {
        type: "paragraph",
        text: "No tracking, no pace goals, no app open in your pocket. The whole point is the absence of a metric — just legs, air, and enough time for your mind to catch up with itself.",
      },
    ],
  },
  {
    slug: "learning-to-rest-without-guilt",
    title: "Learning to Rest Without Guilt",
    excerpt:
      "Rest isn't a reward you earn after finishing the list. Unlearning that idea took longer than expected, and it's still a work in progress.",
    category: "wellness",
    author: authors.priya,
    date: "2026-05-29",
    readTime: "7 min read",
    image: coverImage("learning-to-rest-without-guilt"),
    content: [
      {
        type: "paragraph",
        text: "For most of my twenties, rest was something I had to earn. A finished to-do list came first; the nap, the slow afternoon, the guilt-free hour on the couch came after, if there was time left over. There rarely was.",
      },
      {
        type: "paragraph",
        text: "The shift didn't come from a single realization. It came slowly, mostly from noticing how much better my actual work got when I stopped treating rest as the thing I had to justify.",
      },
      {
        type: "heading",
        text: "Rest as maintenance, not reward",
      },
      {
        type: "paragraph",
        text: "Reframing rest as maintenance rather than a prize changed the guilt equation entirely. You don't feel guilty for changing the oil in a car you rely on. The same logic, it turns out, applies to a person.",
      },
      {
        type: "paragraph",
        text: "It's still a work in progress some weeks more than others. But the goal isn't to get it perfect. It's to keep noticing when the old rule — earn it first — starts creeping back in, and to gently set it back down.",
      },
    ],
  },
];

export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getAllPosts().filter((post) => post.category === categorySlug);
}

export function getFeaturedPost(): Post {
  return posts.find((post) => post.featured) ?? getAllPosts()[0];
}

export function getRecentPosts(limit: number, excludeSlug?: string): Post[] {
  return getAllPosts()
    .filter((post) => post.slug !== excludeSlug)
    .slice(0, limit);
}

export function getRelatedPosts(post: Post, limit: number): Post[] {
  return getPostsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, limit);
}
