-- Seed categories and sample bhajans
-- Run after schema.sql

-- Clear existing seed data (safe for fresh projects)
truncate playlist_items, playlists, bhajan_categories, bhajans, categories cascade;

-- Bhagwan
insert into categories (name, slug, type) values
  ('Ganesh', 'ganesh', 'bhagwan'),
  ('Ram', 'ram', 'bhagwan'),
  ('Sita', 'sita', 'bhagwan'),
  ('Hanuman', 'hanuman', 'bhagwan'),
  ('Krishna', 'krishna', 'bhagwan'),
  ('Radha', 'radha', 'bhagwan'),
  ('Shiva', 'shiva', 'bhagwan'),
  ('Durga', 'durga', 'bhagwan'),
  ('Lakshmi', 'lakshmi', 'bhagwan'),
  ('Saraswati', 'saraswati', 'bhagwan'),
  ('Vishnu', 'vishnu', 'bhagwan'),
  ('Kali', 'kali', 'bhagwan'),
  ('Guru', 'guru', 'bhagwan'),
  ('General', 'general', 'bhagwan');

-- Occasion
insert into categories (name, slug, type) values
  ('Birthday', 'birthday', 'occasion'),
  ('Wedding', 'wedding', 'occasion'),
  ('Funeral', 'funeral', 'occasion'),
  ('Memorial', 'memorial', 'occasion'),
  ('Diwali', 'diwali', 'occasion'),
  ('Holi', 'holi', 'occasion'),
  ('Raksha Bandhan', 'raksha-bandhan', 'occasion'),
  ('Navratri', 'navratri', 'occasion'),
  ('Ram Navami', 'ram-navami', 'occasion'),
  ('Janmashtami', 'janmashtami', 'occasion'),
  ('Shivratri', 'shivratri', 'occasion'),
  ('Hanuman Jayanti', 'hanuman-jayanti', 'occasion'),
  ('Jhandi', 'jhandi', 'occasion'),
  ('Satsang', 'satsang', 'occasion'),
  ('Morning Prayer', 'morning-prayer', 'occasion'),
  ('Evening Prayer', 'evening-prayer', 'occasion');

-- Bhajan type
insert into categories (name, slug, type) values
  ('Bhajan', 'bhajan', 'bhajan_type'),
  ('Prarthana', 'prarthana', 'bhajan_type'),
  ('Aarti', 'aarti', 'bhajan_type'),
  ('Chalisa', 'chalisa', 'bhajan_type'),
  ('Mantra', 'mantra', 'bhajan_type'),
  ('Kirtan', 'kirtan', 'bhajan_type');

-- Theme
insert into categories (name, slug, type) values
  ('Devotion', 'devotion', 'theme'),
  ('Surrender', 'surrender', 'theme'),
  ('Gratitude', 'gratitude', 'theme'),
  ('Peace', 'peace', 'theme'),
  ('Wisdom', 'wisdom', 'theme'),
  ('Protection', 'protection', 'theme');

-- Language
insert into categories (name, slug, type) values
  ('Hindi', 'hindi', 'language'),
  ('Sanskrit', 'sanskrit', 'language'),
  ('Gujarati', 'gujarati', 'language'),
  ('English', 'english', 'language');

-- Suitability
insert into categories (name, slug, type) values
  ('Funeral-specific', 'funeral-specific', 'suitability'),
  ('Suitable for funerals', 'suitable-for-funerals', 'suitability'),
  ('Not generally used at funerals', 'not-generally-used-at-funerals', 'suitability');

-- Sample bhajan 1: Payo Ji Mere Ram Ratan Dhan Payo (Harry Panday)
-- Source: Payo_Ji_Ram_Ratan_Dhan_Payo_Bhajan_Translation.pdf
insert into bhajans (
  id,
  title,
  alternate_title,
  slug,
  artist_version,
  roman_lyrics,
  devanagari_lyrics,
  translation,
  meaning,
  audio_url,
  is_favourite,
  display_order
) values (
  'a1000000-0000-4000-8000-000000000001',
  'Payo Ji Mere Ram Ratan Dhan Payo',
  'Ram Ratan Dhan Payo',
  'payo-ji-mere-ram-ratan-dhan-payo',
  'Harry Panday',
  E'Ram ratan dhan payo\nGuruji mere Ram ratan dhan payo\n\nVastu amolik di mere Satguru\nKripa kari apanayo\nGuruji mere Ram ratan dhan payo\n\nJanam janam ki punji payi\nJag mein sabhi khovayo\nGuruji mere Ram ratan dhan payo\n\nKharch na khute, chor na lute\nDin din badhat savayo\nGuruji mere Ram ratan dhan payo\n\nSat ki naav khevatiya Satguru\nBhavsagar tar ayo\nGuruji mere Ram ratan dhan payo\n\nMira ke Prabhu Giridhar Nagar\nHarakh harakh jas gayo\nGuruji mere Ram ratan dhan payo\n\nKripa kari apanayo\nGuruji mere Ram ratan dhan payo\nRam ratan dhan payo\nGuruji mere Ram ratan dhan payo',
  E'राम रतन धन पायो\nगुरुजी मेरे राम रतन धन पायो\n\nवस्तु अमोलिक दी मेरे सतगुरु\nकृपा करी अपनायो\nगुरुजी मेरे राम रतन धन पायो\n\nजनम जनम की पूंजी पायी\nजग में सभी खोवायो\nगुरुजी मेरे राम रतन धन पायो\n\nखर्च न खूटे, चोर न लूटे\nदिन दिन बढ़त सवायो\nगुरुजी मेरे राम रतन धन पायो\n\nसत की नाव खेवटिया सतगुरु\nभवसागर तर आयो\nगुरुजी मेरे राम रतन धन पायो\n\nमीरा के प्रभु गिरिधर नागर\nहरख हरख जस गायो\nगुरुजी मेरे राम रतन धन पायो\n\nकृपा करी अपनायो\nगुरुजी मेरे राम रतन धन पायो\nराम रतन धन पायो\nगुरुजी मेरे राम रतन धन पायो',
  E'I have received the priceless treasure of Lord Ram.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nMy True Guru gave me this priceless treasure.\nThrough His grace He accepted me as His own.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nI have obtained the spiritual wealth of many lifetimes.\nWhile the world loses itself chasing temporary riches.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nThis treasure never runs out when shared; no thief can steal it.\nAnd it continues to grow every day.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nMy True Guru is the boatman of the boat of Truth.\nThrough Him I have crossed the ocean of worldly existence.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nMira''s Lord is Giridhar Nagar.\nShe sings His praise with joy.\nO my Guru, I have received the priceless treasure of Lord Ram.\n\nThrough His grace He accepted me as His own.\nO my Guru, I have received the priceless treasure of Lord Ram.\nI have received the priceless treasure of Lord Ram.\nO my Guru, I have received the priceless treasure of Lord Ram.',
  'A Mirabai bhajan in the Harry Panday satsang rendition. The greatest wealth is devotion to Ram — given by the True Guru, never stolen or spent, growing through practice. The refrain is sung after every verse.',
  'https://www.youtube.com/watch?v=aKEM2n6gOOA',
  true,
  1
);

-- Sample bhajan 2: He Prabhu Anand Data (Harry Panday)
insert into bhajans (
  id,
  title,
  alternate_title,
  slug,
  artist_version,
  roman_lyrics,
  devanagari_lyrics,
  translation,
  meaning,
  audio_url,
  is_favourite,
  display_order
) values (
  'a1000000-0000-4000-8000-000000000002',
  'He Prabhu Anand Data',
  'Hey Prabhu Anand Data',
  'he-prabhu-anand-data',
  'Harry Panday',
  E'Om Bhur Bhuvah Swaha\nTat Savitur Varenyam\nBhargo Devasya Dhimahi\nDhiyo Yo Nah Prachodayat\n\nHe Prabhu Ananda Data, jnan ham ko dijiye\n\nShighra sare durguno ko, door ham se kijiye\nHe Prabhu Ananda Data, jnan ham ko dijiye\n\nLijiye hum ko sharan mein, ham sada chari bane\nHe Prabhu Ananda Data, jnan ham ko dijiye\n\nBrahmachari dharma rakshak, vira vrat-dhari bane\nHe Prabhu Ananda Data, jnan ham ko dijiye\n\nPrem se ham guru jano ki, nitya hi seva karen\nHe Prabhu Ananda Data, jnan ham ko dijiye\n\nSatya bole, jhoot tyage, mel aapas mein kare\nHe Prabhu Ananda Data, jnan ham ko dijiye\n\nNinda kisi ki ham kisi se, bhool kar bhi na kare\nHe Prabhu Ananda Data, jnan ham ko dijiye\n\nDivya jivan ho hamara, tere yash gaya kare\nHe Prabhu Ananda Data, jnan ham ko dijiye',
  E'ॐ भूर् भुवः स्वः\nतत् सवितुर् वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्\n\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये\n\nशीघ्र सारे दुर्गुणों को, दूर हम से कीजिये\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये\n\nलीजिये हम को शरण में, हम सदाचारि बने\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये\n\nब्रह्मचारी धर्म रक्षक, वीर व्रत-धारी बने\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये\n\nप्रेम से हम गुरु जनों की, नित्य ही सेवा करें\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये\n\nसत्य बोले, झूठ त्यागे, मेल आपस में करे\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये\n\nनिन्दा किसी की हम किसी से, भूल कर भी न करे\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये\n\nदिव्य जीवन हो हमारा, तेरे यश गाया करे\nहे प्रभु आनन्द दाता, ज्ञान हम को दीजिये',
  E'We meditate on the divine light of the Creator who pervades earth, sky and heaven —\nthe most worthy, radiant Lord.\nMay that light illuminate our intellect\nand guide our thoughts on the right path.\n\nO Lord, giver of bliss, grant us wisdom.\n\nQuickly remove all bad qualities from us.\nO Lord, giver of bliss, grant us wisdom.\n\nTake us into Your refuge; may we always live virtuously.\nO Lord, giver of bliss, grant us wisdom.\n\nMay we be disciplined protectors of dharma, brave keepers of sacred vows.\nO Lord, giver of bliss, grant us wisdom.\n\nWith love may we always serve our teachers and elders.\nO Lord, giver of bliss, grant us wisdom.\n\nMay we speak truth, give up falsehood, and live in harmony with one another.\nO Lord, giver of bliss, grant us wisdom.\n\nMay we never speak ill of anyone, even by mistake.\nO Lord, giver of bliss, grant us wisdom.\n\nMay our life be divine, always singing Your glory.\nO Lord, giver of bliss, grant us wisdom.',
  'Harry Panday''s satsang rendition opens with the Gayatri mantra, then He Prabhu Ananda Data. The refrain is sung after every verse — a prayer for wisdom, good character, service, truth, and a divine life.',
  'https://www.youtube.com/watch?v=PxBmatOEPdE',
  true,
  2
);

-- Sample bhajan 3: Bandow Charana Kamal Ragunandan (Surbhi Chahal)
insert into bhajans (
  id,
  title,
  alternate_title,
  slug,
  artist_version,
  roman_lyrics,
  devanagari_lyrics,
  translation,
  meaning,
  audio_url,
  is_favourite,
  display_order
) values (
  'a1000000-0000-4000-8000-000000000003',
  'Bandow Charana Kamal Ragunandan',
  'Bandau Charan Kamal Raghunandan',
  'bandow-charana-kamal-ragunandan',
  'Surbhi Chahal',
  E'Bandow charana kamal Ragunandan\n\nJina ki kripaa sakal sukha sampati\nPaawana jana bhaktana ura chandana\n\nAwadha puri prabhu nitya biraajata\nJanaka sutaa yuta dushta nikandana\n\nTeena taapa aru janama marana bhayo\nDoor karata chhina may jana ranjana\n\nBhakta namata charan may Bhagavana\nKripaa kariya sevak bhaya bhanjana\n\nBandow charana kamal Ragunandan',
  E'बंदौं चरण कमल रघुनन्दन\n\nजिनकी कृपा सकल सुख संपति\nपावन जन भक्तन उर चन्दन\n\nअवध पुरी प्रभु नित्य बिराजत\nजनक सुता युत दुष्ट निकन्दन\n\nतीन ताप अरु जनम मरण भय\nदूर करत छिन में जन रंजन\n\nभक्त नमत चरण में भगवान\nकृपा करिय सेवक भय भंजन\n\nबंदौं चरण कमल रघुनन्दन',
  E'I worship the lotus feet of Shri Raghunandan.\n\nBy His divine grace comes all bliss and prosperity.\nLike sandalwood, His grace rests on the hearts of pure devotees.\n\nThe Lord forever dwells in Ayodhya.\nWith Janak''s daughter Sita, He destroys the wicked.\n\nHe removes the three afflictions and the fear of birth and death.\nIn a moment He brings joy and peace to His devotees.\n\nDevotees bow at Your feet, O Lord.\nGrant Your mercy to Your servant and dispel all fear.\n\nI worship the lotus feet of Shri Raghunandan.',
  'A Ram bhajan of devotion to the lotus feet of Raghunandan. By His grace come bliss and prosperity; He dwells in Ayodhya with Sita, destroys evil, removes sorrow and fear, and shelters His devotees. Sung by Surbhi Chahal.',
  'https://www.youtube.com/watch?v=3QupRJS3k6Y',
  true,
  3
);

-- Sample bhajan 4: Melodious Bhajans 10 (Shri Prakash Gossai) — video only
insert into bhajans (
  id,
  title,
  alternate_title,
  slug,
  artist_version,
  roman_lyrics,
  meaning,
  audio_url,
  is_favourite,
  display_order
) values (
  'a1000000-0000-4000-8000-000000000004',
  'Tribute to Shri Prakash Gossai - GTViBEZSC',
  'Melodious Bhajans 10: The Final Edition',
  'melodious-bhajans-10-the-final-edition',
  'Shri Prakash Gossai',
  '[Video only]',
  'Full CD video — GTViBEZSC Melodious Bhajans 10: The Final Edition, a tribute to Shri Prakash Gossai. Lyrics are not transcribed; play the video to listen.',
  '/videos/shri-prakash-gossai-melodious-bhajans-10.mp4',
  true,
  4
);

-- Sample bhajan 5: Hanuman Chalisa (Raj Barman) — original
insert into bhajans (
  id,
  title,
  alternate_title,
  slug,
  artist_version,
  roman_lyrics,
  translation,
  meaning,
  audio_url,
  is_favourite,
  display_order
) values (
  'a1000000-0000-4000-8000-000000000005',
  'Hanuman Chalisa',
  'Shri Hanuman Chalisa',
  'hanuman-chalisa-raj-barman',
  'Raj Barman',
  E'## Dohas\n\nShri Guru Charan Saroj Raj, Nij Manu Mukur Sudhari\nBarnaun Raghuvar Bimal Jasu, Jo Dayaku Phal Chari\n\nBuddhiheen Tanu Janike, Sumirau Pavan Kumar\nBal Buddhi Vidya Dehu Mohi, Harahu Kalesh Vikaar\n\n## Chaupais\n\nJai Hanuman Gyan Gun Sagar\nJai Kapis Tihun Lok Ujagar',
  E'See the bhajan page for the full line-by-line English translation.',
  'A classic prayer by Goswami Tulsidas. This library entry features the Raj Barman rendition.',
  '/audio/hanuman-chalisa-raj-barman.mp3',
  true,
  5
);

-- Sample bhajan 6: Hanuman Chalisa (Raj Barman) — slow
insert into bhajans (
  id,
  title,
  alternate_title,
  slug,
  artist_version,
  roman_lyrics,
  translation,
  meaning,
  audio_url,
  is_favourite,
  display_order
) values (
  'a1000000-0000-4000-8000-000000000006',
  'Hanuman Chalisa',
  'Slow version',
  'hanuman-chalisa-raj-barman-slow',
  'Raj Barman',
  E'## Dohas\n\nShri Guru Charan Saroj Raj, Nij Manu Mukur Sudhari\nBarnaun Raghuvar Bimal Jasu, Jo Dayaku Phal Chari\n\nBuddhiheen Tanu Janike, Sumirau Pavan Kumar\nBal Buddhi Vidya Dehu Mohi, Harahu Kalesh Vikaar\n\n## Chaupais\n\nJai Hanuman Gyan Gun Sagar\nJai Kapis Tihun Lok Ujagar',
  E'See the bhajan page for the full line-by-line English translation.',
  'Slow lyrical Raj Barman rendition of the Hanuman Chalisa.',
  '/audio/hanuman-chalisa-raj-barman-slow.mp3',
  true,
  6
);

-- Link Payo Ji to categories
insert into bhajan_categories (bhajan_id, category_id)
select 'a1000000-0000-4000-8000-000000000001', id from categories
where (type = 'bhagwan' and slug in ('ram', 'general'))
   or (type = 'occasion' and slug in ('satsang', 'ram-navami', 'evening-prayer'))
   or (type = 'bhajan_type' and slug = 'bhajan')
   or (type = 'theme' and slug in ('devotion', 'gratitude'))
   or (type = 'language' and slug = 'hindi')
   or (type = 'suitability' and slug = 'suitable-for-funerals');

-- Link He Prabhu to categories
insert into bhajan_categories (bhajan_id, category_id)
select 'a1000000-0000-4000-8000-000000000002', id from categories
where (type = 'bhagwan' and slug = 'general')
   or (type = 'occasion' and slug in ('satsang', 'morning-prayer', 'evening-prayer', 'memorial'))
   or (type = 'bhajan_type' and slug = 'prarthana')
   or (type = 'theme' and slug in ('peace', 'wisdom', 'devotion'))
   or (type = 'language' and slug = 'hindi')
   or (type = 'suitability' and slug = 'suitable-for-funerals');

-- Link Bandow Charana Kamal to categories
insert into bhajan_categories (bhajan_id, category_id)
select 'a1000000-0000-4000-8000-000000000003', id from categories
where (type = 'bhagwan' and slug in ('ram', 'sita', 'general'))
   or (type = 'occasion' and slug in ('satsang', 'ram-navami', 'evening-prayer'))
   or (type = 'bhajan_type' and slug = 'bhajan')
   or (type = 'theme' and slug in ('devotion', 'protection'))
   or (type = 'language' and slug = 'hindi')
   or (type = 'suitability' and slug = 'suitable-for-funerals');

-- Link Melodious Bhajans 10 to categories
insert into bhajan_categories (bhajan_id, category_id)
select 'a1000000-0000-4000-8000-000000000004', id from categories
where (type = 'bhagwan' and slug = 'general')
   or (type = 'occasion' and slug in ('satsang', 'evening-prayer'))
   or (type = 'bhajan_type' and slug = 'bhajan')
   or (type = 'theme' and slug = 'devotion')
   or (type = 'language' and slug = 'hindi');

-- Link Hanuman Chalisa (original) to categories
insert into bhajan_categories (bhajan_id, category_id)
select 'a1000000-0000-4000-8000-000000000005', id from categories
where (type = 'bhagwan' and slug in ('hanuman', 'ram', 'general'))
   or (type = 'occasion' and slug in ('satsang', 'hanuman-jayanti', 'evening-prayer', 'morning-prayer'))
   or (type = 'bhajan_type' and slug = 'chalisa')
   or (type = 'theme' and slug in ('devotion', 'protection', 'wisdom'))
   or (type = 'language' and slug = 'hindi');

-- Link Hanuman Chalisa (slow) to categories
insert into bhajan_categories (bhajan_id, category_id)
select 'a1000000-0000-4000-8000-000000000006', id from categories
where (type = 'bhagwan' and slug in ('hanuman', 'ram', 'general'))
   or (type = 'occasion' and slug in ('satsang', 'hanuman-jayanti', 'evening-prayer', 'morning-prayer'))
   or (type = 'bhajan_type' and slug = 'chalisa')
   or (type = 'theme' and slug in ('devotion', 'protection', 'wisdom'))
   or (type = 'language' and slug = 'hindi');

-- Sample playlists
insert into playlists (id, name, description) values
  ('b1000000-0000-4000-8000-000000000001', 'Friday Satsang', 'A short set for weekly satsang'),
  ('b1000000-0000-4000-8000-000000000002', 'Funeral Bhajans', 'Gentle bhajans suitable for funeral and memorial services');

insert into playlist_items (playlist_id, bhajan_id, position, notes) values
  ('b1000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000002', 0, 'Open with this prayer'),
  ('b1000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 1, 'Main bhajan'),
  ('b1000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002', 0, null),
  ('b1000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000001', 1, 'Sing slowly');
