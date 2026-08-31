-- Removes the 12 launch demo posts (the travel/lifestyle placeholder
-- content). Run this once in HeidiSQL / your MySQL client after the site
-- is switched to the new story categories.
--
-- Your own posts are NOT touched — only these 12 known demo slugs.

DELETE FROM posts WHERE slug IN (
  'slow-mornings-in-lisbon',
  'the-night-trains-of-eastern-europe',
  'packing-light-for-three-months',
  'the-case-for-a-slower-morning-routine',
  'how-to-build-a-capsule-wardrobe-that-actually-works',
  'the-quiet-appeal-of-analog-hobbies',
  'the-grandmothers-who-keep-a-cuisine-alive',
  'night-markets-and-the-art-of-eating-standing-up',
  'the-last-letterpress-in-town',
  'what-a-decade-of-journaling-taught-me',
  'walking-as-medicine',
  'learning-to-rest-without-guilt'
);

-- The old demo categories are left in the categories table only if you
-- added them manually; the new 8 story categories are seeded automatically.
-- To drop leftover old ones:
-- DELETE FROM categories WHERE slug IN ('travel','lifestyle','culture','wellness');
