-- Line-by-line translations (match roman lyric line breaks)
-- Run in Supabase SQL Editor

update bhajans
set translation = E'I have received the priceless treasure of Lord Ram.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nMy True Guru gave me this priceless treasure,\nand through His grace accepted me as His own.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nI have obtained the spiritual wealth of many lifetimes,\nwhile the world loses itself chasing temporary riches.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nThis treasure never runs out when shared; no thief can steal it,\nand it continues to grow every day.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nMy True Guru is the boatman of the boat of Truth,\nand through Him I have crossed the ocean of worldly existence.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nMira''s Lord is Giridhar Nagar;\nshe sings His praise with joy.'
where slug = 'payo-ji-mere-ram-ratan-dhan-payo';

update bhajans
set
  audio_url = 'https://www.youtube.com/watch?v=PxBmatOEPdE',
  artist_version = 'Harry Panday',
  translation = E'O Lord, giver of bliss, grant us wisdom.\nO Lord, giver of bliss, grant us peace.\n\nO Lord, giver of bliss, grant us devotion.\nO Lord, giver of bliss, grant us strength.\n\nRemove the darkness; light the lamp of knowledge.\nDwell in all and shower the nectar of love.\n\nO Lord, giver of bliss, grant us love.\nO Lord, giver of bliss, grant us dharma.\n\nRemove everyone''s sorrow and shower peace.\nShow the path of humanity; lead us on the path of truth.\n\nO Lord, giver of bliss, grant us wisdom.\nO Lord, giver of bliss, grant us peace.'
where slug = 'he-prabhu-anand-data';
