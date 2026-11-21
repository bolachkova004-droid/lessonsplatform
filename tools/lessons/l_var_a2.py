"""Ноябрь 2026, вторая волна A0–A2 — разная структура уроков:
Пелагея 2D — история в картинках + речёвка: «Kate's Birthday», past simple -ed (+ произношение /t/ /d/ /ɪd/).
Варя 3B — опрос «Find someone who…»: «Have You Ever…?», present perfect ever / never.
Оля 1E — задание-покупки на рынке: «At the Market», some / any, How much / How many.
Ефим 1D — викторина и «угадай вид спорта»: «Sports Day», can / have to / don't have to.
Владимир 1D — задача с картой: «Getting Around», comparatives (faster, cheaper).
Саша 3B — test–teach–test: «Moving Day», present perfect just / already / yet.
Вика Ch9 — чтение по ролям (reading circle): «Powder and Arms», should / shouldn't.
Мусса S3 — TPR + карта: «This Way, Please!», directions."""
from flex import *

DATE = '2026-11-30'


def pelageya():
    P, LID = 'pg8', 'pelageya-8'
    ids = Ids(P)
    cards = [('a birthday', '', 'день рождения', "It was Kate's birthday.", '🎂'), ('a present', '', 'подарок', 'Tom wrapped a present.', '🎁'), ('a candle', '', 'свеча', 'She blew out the candles.', '🕯️'),
             ('to invite', '', 'приглашать', 'Kate invited six friends.', '💌'), ('to dance', '', 'танцевать', 'We danced all evening.', '💃'), ('to bake', '', 'печь', 'Anna baked a cake.', '🍰'),
             ('balloons', '', 'шарики', 'Tom painted funny balloons.', '🎈'), ('to laugh', '', 'смеяться', 'Everyone laughed.', '😂')]
    story = [('f', "Saturday was Kate's birthday. She invited six friends to her flat."), ('f', 'Anna baked a big chocolate cake, and Tom painted funny faces on the balloons.'),
             ('f', 'At seven o\'clock everyone arrived. They played games and danced.'), ('f', 'Then Kate opened her presents and blew out the candles. Everyone laughed and clapped. It was a great party!')]
    sections = [
        ('chant', 'Chant', 'the -ed chant', '6 min',
         route([('🎵', 'chant'), ('🖼️', 'picture story'), ('🎧', 'listen'), ('📘', 'Grammar Easy'), ('👂', '/t/ /d/ /ɪd/'), ('✍️', 'my birthday')])
         + rubric('a', 'Press 🔊 and say the chant with a rhythm! Clap on every verb.', 'Нажмите 🔊 и повторяйте в ритме, хлопайте на каждом глаголе.')
         + say_list([('I played, I danced, I laughed all day!', 'I <u>PLAYED</u>, I <u>DANCED</u>, I <u>LAUGHED</u> all <u>DAY</u>!'), ('She baked, she painted, she wanted to stay!', 'she <u>BAKED</u>, she <u>PAINT</u>ed, she <u>WANT</u>ed to <u>STAY</u>!')])),
        ('pictures', 'Picture story', 'Kate\'s party', '10 min',
         rubric('a', 'Look at the pictures. What happened at Kate\'s party? Guess with your teacher.', 'Что было на вечеринке? Угадайте с преподавателем.')
         + timeline([('💌', 'Kate invited six friends'), ('🍰🎈', 'Anna baked a cake, Tom painted balloons'), ('🎲💃', 'they played games and danced'), ('🎁🕯️', 'Kate opened presents, blew out the candles')])
         + listening(P + '-lis', story, "Kate's birthday", 'Listen twice', '🎂', {'f': 'Anna'})
         + deck('Check', [mc(P + '-q1', 'How many friends did Kate invite?', ['six', 'four', 'ten'], 0), mc(P + '-q2', 'What did Anna bake?', ['a chocolate cake', 'bread', 'cookies'], 0),
                          mc(P + '-q3', 'What did Tom paint?', ['funny faces on balloons', 'a picture', 'the door'], 0)])),
        ('grammar', 'Grammar', 'past simple -ed — Grammar Easy', '10 min',
         easy('play → played · dance → danced',
              'О прошлом: к глаголу добавляем <b>-ed</b>. Одинаково для всех: I / she / they <b>played</b>. Если глагол на <b>-e</b> → только <b>-d</b> (dance → danced). Согласная + <b>y</b> → <b>-ied</b> (study → studied).',
              [[('Kate', 'a'), ('invited', 'd'), ('six friends.', 'b')], [('They', 'a'), ('danced', 'd'), ('all evening.', 'b')]],
              [('💌', 'Kate invited six friends.'), ('🍰', 'Anna baked a cake.'), ('💃', 'They danced.'), ('😂', 'Everyone laughed.')],
              [('She inviteed…', 'She invited…', 'На -e → только -d.'), ('They was danced.', 'They danced.', 'Без was.')])
         + ex_gaps(ids, [('Kate', ['invited'], 'her friends.', 'invite'), ('They', ['played'], 'games.', 'play'), ('Anna', ['baked'], 'a cake.', 'bake'), ('Everyone', ['laughed'], '.', 'laugh'),
                         ('I', ['studied'], 'English yesterday.', 'study')])),
        ('sounds', 'Pronunciation', '/t/ /d/ /ɪd/', '8 min',
         rubric('a', '-ed has three sounds! Press 🔊 and choose the sound.', 'У -ed три звука. Нажмите 🔊 и выберите.')
         + ex_listen_pick(ids, [('danced', '/t/', ['/t/', '/d/', '/ɪd/']), ('played', '/d/', ['/t/', '/d/', '/ɪd/']), ('painted', '/ɪd/', ['/t/', '/d/', '/ɪd/']), ('laughed', '/t/', ['/t/', '/d/', '/ɪd/']), ('invited', '/ɪd/', ['/t/', '/d/', '/ɪd/'])])
         + reveal('💡 Tip', '<p>After <b>t</b> or <b>d</b> → /ɪd/ (painted, wanted, invited). After p, k, s, sh, ch, f → /t/ (danced, laughed). Other → /d/ (played, cleaned).</p>')),
        ('write', 'Writing', 'my last birthday', '10 min',
         rubric('a', 'Write about your last birthday — 4 sentences with -ed verbs.', 'Ваш последний день рождения: 4 предложения.')
         + lines(ids, ['On my birthday I…', 'I invited / visited…', 'We… (play / dance / cook / watch)', 'In the evening I…'])
         + vocab_section(ids, '2D', 'A birthday party', cards, [('🕯️ →', 'a candle', ['a candle', 'a present', 'a balloon'], ''), ('🎁 →', 'a present', ['a present', 'a birthday', 'a cake'], '')], []) + send_box()),
    ]
    hw = hw_pair(ids, [('🎈 →', 'balloons', ['balloons', 'candles', 'presents'], ''), ('😂 →', 'to laugh', ['to laugh', 'to dance', 'to bake'], ''), ('💌 →', 'to invite', ['to invite', 'to play', 'to paint'], '')],
                 [('danced', 'danced', ['danced', 'dance', 'dancing']), ('wanted', 'wanted', ['wanted', 'want', 'wants']), ('cleaned', 'cleaned', ['cleaned', 'clean', 'cleans'])],
                 [('She blew out the', ['candles'], '.'), ('Anna', ['baked'], 'a cake.'), ('Tom wrapped a', ['present'], '.')],
                 'Write the past simple.', 'Напишите прошедшее время.', [('I', ['watched'], 'a film yesterday.', 'watch'), ('We', ['cooked'], 'dinner.', 'cook'), ('She', ['phoned'], 'her mum.', 'phone'), ('They', ['visited'], 'Moscow.', 'visit')],
                 [('I playd tennis. →', ['I played tennis.']), ('She was cleaned her room. →', ['She cleaned her room.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'pelageya', 'code': '2D', 'title': "Kate's Birthday", 'level': 'A1–A2', 'category': 'Parties', 'minutes': '50 min',
                 'grammar': 'Past simple: -ed verbs · /t/ /d/ /ɪd/ (Grammar Easy)', 'date': DATE, 'gvp': {'g': 'past simple regular verbs', 'v': 'a birthday party', 'p': '-ed: /t/ /d/ /ɪd/'},
                 'eyebrow': 'IRIS SCHOOL · Пелагея · урок 2D', 'tags': ['A1–A2', 'Picture story', 'Chant', 'past simple -ed'],
                 'lead': 'Today we start with a chant and a picture story! Kate had a birthday party — find out what happened and learn to talk about the past with -ed.',
                 'cards': cards, 'case': {'bad': [('She inviteed…', 'She invited…'), ('They was danced.', 'They danced.')], 'ok': ['Kate invited six friends.', 'Everyone laughed.']},
                 'sections': sections, 'hw': hw})


def varya():
    P, LID = 'vr8', 'varya-8'
    ids = Ids(P)
    cards = [('to ride a camel', '', 'кататься на верблюде', 'Have you ever ridden a camel?', '🐪'), ('to climb a mountain', '', 'подняться на гору', "I've climbed a mountain.", '🏔️'),
             ('to win a prize', '', 'выиграть приз', "She's won a prize.", '🏆'), ('to meet a famous person', '', 'встретить знаменитость', "I've never met a famous person.", '🌟'),
             ('to fly in a plane', '', 'летать на самолёте', 'Have you ever flown in a plane?', '✈️'), ('to break a bone', '', 'сломать кость', "He's broken his arm.", '🦴'),
             ('to see the sea', '', 'видеть море', "I've seen the sea.", '🌊'), ('to cook for friends', '', 'готовить для друзей', "I've cooked for ten friends.", '🍳')]
    sections = [
        ('survey', 'Find someone who', 'find someone who…', '14 min',
         route([('🔎', 'find someone who…'), ('📘', 'Grammar Easy'), ('🎧', 'Mia\'s interview'), ('🏆', 'class records'), ('✍️', 'my experiences')])
         + rubric('a', 'Ask your teacher (and your family at home!). Write the name and one extra detail.', 'Спросите преподавателя (и дома — семью). Запишите имя и деталь.')
         + survey(ids, ['Have you ever ridden a camel?', 'Have you ever climbed a mountain?', 'Have you ever won a prize?', 'Have you ever met a famous person?', 'Have you ever broken a bone?'])
         + phrases(['Have you ever…?', 'Yes, I have!', "No, I haven't.", 'When?', 'Where?'])),
        ('rule', 'Grammar', 'Have you ever…? — Grammar Easy', '10 min',
         easy("Have you ever…? · I've never…",
              'Опыт в жизни, неважно когда → <b>have / has + V3</b>. «Ты когда-нибудь…?» = <b>Have you ever…?</b> «Никогда» = <b>I\'ve never…</b> Когда? → уже past simple: <b>When did you…?</b>',
              [[('Have', 'd'), ('you', 'a'), ('ever', 'c'), ('ridden', 'd'), ('a camel?', 'b')], [("I've", 'a'), ('never', 'c'), ('met', 'd'), ('a famous person.', 'b')]],
              [('🐪', 'Have you ever ridden a camel?'), ('🏔️', "Yes, I have. I've climbed Elbrus!"), ('🌟', "I've never met a famous person.")],
              [('Did you ever ride a camel?', 'Have you ever ridden a camel?', 'Опыт → have + V3.'), ("I've never meet him.", "I've never met him.", 'V3: met.')])
         + ex_gaps(ids, [('Have you ever', ['seen'], 'a whale?', 'see'), ("I've never", ['flown'], 'in a helicopter.', 'fly'), ('She has', ['won'], 'two prizes.', 'win'), ('', ['Have'], 'you ever broken a bone?', '❓')])),
        ('listen', 'Listening', "Mia's interview", '10 min',
         listening(P + '-lis', [('f', 'Grandpa, have you ever ridden a camel?'), ('m', "Yes, I have! In Egypt, in 1985. It was very tall and very slow."), ('f', 'Have you ever met a famous person?'),
                                ('m', "Hmm… Yes! I've met a cosmonaut. He came to my school."), ('f', 'Wow! Have you ever broken a bone?'), ('m', "No, I've never broken a bone. I've been lucky!")],
                   "Mia interviews Grandpa", 'Listen twice', '👴', {'f': 'Mia', 'm': 'Grandpa'})
         + deck('Check', [mc(P + '-q1', 'Where did Grandpa ride a camel?', ['in Egypt', 'in India', 'in Moscow'], 0), mc(P + '-q2', 'Who has he met?', ['a cosmonaut', 'a singer', 'a footballer'], 0),
                          mc(P + '-q3', 'Has he ever broken a bone?', ["No, he hasn't.", 'Yes, he has.'], 0)])),
        ('records', 'Speaking', 'class records', '8 min',
         rubric('a', 'Tell your teacher your «records»: the best thing you\'ve ever done, the strangest food you\'ve ever eaten, the most beautiful place you\'ve ever seen.', 'Ваши «рекорды».')
         + picker(['the best thing you have ever done', 'the strangest food you have ever eaten', 'the most beautiful place you have ever seen', 'the longest journey you have ever made'])
         + vocab_section(ids, '3B', 'Experiences', cards, [('🏆 →', 'to win a prize', ['to win a prize', 'to see the sea', 'to break a bone'], ''), ('🐪 →', 'to ride a camel', ['to ride a camel', 'to fly in a plane', 'to climb a mountain'], '')], [])),
        ('write', 'Writing', 'my experiences', '8 min', rubric('a', 'Write 5 sentences: things you have and haven\'t done.', 'Пять предложений: что вы делали и не делали.')
         + lines(ids, ["I've…", "I've…", "I've never…", "I've never…", 'Have you ever…?']) + send_box()),
    ]
    hw = hw_pair(ids, [('🦴 →', 'to break a bone', ['to break a bone', 'to win a prize', 'to see the sea'], ''), ('✈️ →', 'to fly in a plane', ['to fly in a plane', 'to ride a camel', 'to climb a mountain'], ''),
                       ('🌊 →', 'to see the sea', ['to see the sea', 'to cook for friends', 'to meet a famous person'], '')],
                 [('ever', 'ever', ['ever', 'never', 'every']), ("I've never", "I've never", ["I've never", 'I never', "I've ever"]), ('ridden', 'ridden', ['ridden', 'written', 'hidden'])],
                 [('Have you ever', ['ridden'], 'a horse?'), ("I've", ['never'], 'been to Paris.'), ("She's", ['won'], 'a prize.')],
                 'Write the present perfect.', 'Present perfect.', [("I've never", ['eaten'], 'sushi.', 'eat'), ('Have you ever', ['been'], 'to the sea?', 'be'), ('He has', ['climbed'], 'a mountain.', 'climb'),
                                                                   ('We have never', ['seen'], 'snow in May.', 'see')],
                 [('Did you ever see a whale? →', ['Have you ever seen a whale?']), ("I've never meet him. →", ["I've never met him.", 'I have never met him.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'varya', 'code': '3B', 'title': 'Have You Ever…?', 'level': 'A2', 'category': 'Experiences', 'minutes': '55 min',
                 'grammar': "Present perfect: Have you ever…? I've never… (Grammar Easy)", 'date': DATE, 'gvp': {'g': 'present perfect for experiences', 'v': 'life experiences', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Варя · урок 3B', 'tags': ['A2', 'Find someone who', 'Survey', 'Have you ever…?'],
                 'lead': 'Today you are a reporter! Start with a «Find someone who…» survey, then learn the grammar, listen to Mia\'s interview with Grandpa and tell your teacher your personal records.',
                 'cards': cards, 'case': {'bad': [('Did you ever ride a camel?', 'Have you ever ridden a camel?')], 'ok': ["I've never met a famous person.", 'Have you ever climbed a mountain?']},
                 'sections': sections, 'hw': hw})


def olya():
    P, LID = 'ol5', 'olya-5'
    ids = Ids(P)
    cards = [('flour', 'white powder for bread and cakes', 'мука', 'a kilo of flour', '🌾'), ('eggs', '', 'яйца', 'six eggs', '🥚'), ('butter', '', 'масло (сливочное)', 'some butter', '🧈'),
             ('sugar', '', 'сахар', 'How much sugar?', '🍬'), ('apples', '', 'яблоки', 'How many apples?', '🍎'), ('milk', '', 'молоко', 'a litre of milk', '🥛'),
             ('a kilo', '', 'килограмм', 'a kilo of apples', '⚖️'), ('a recipe', 'instructions for cooking something', 'рецепт', "Grandma's recipe", '📋')]
    sections = [
        ('recipe', 'Task', 'the recipe', '10 min',
         route([('📋', 'read a recipe'), ('📝', 'make a shopping list'), ('📘', 'some / any, much / many'), ('🛒', 'role-play: the market'), ('🥧', 'your recipe')])
         + rubric('a', 'Kate wants to bake an apple pie. Read the recipe.', 'Кейт хочет испечь яблочный пирог. Прочитайте рецепт.')
         + box('<b>Grandma\'s Apple Pie</b><br>• 4 apples • 200 g flour • 150 g sugar • 100 g butter • 2 eggs • a little milk<br>Mix the flour, butter and sugar. Add the eggs and a little milk. Put the apples on top. Bake for 40 minutes.', '🥧')
         + rubric('b', 'Kate has got: 1 apple, 500 g sugar, no flour, 2 eggs, no butter, milk. Make her shopping list.', 'У Кейт есть: 1 яблоко, сахар, нет муки, 2 яйца, нет масла, молоко. Составьте список покупок.')
         + ex_select(ids, [('apples →', 'buy 3', ['buy 3', "don't buy"], ''), ('flour →', 'buy', ['buy', "don't buy"], ''), ('sugar →', "don't buy", ['buy', "don't buy"], ''), ('butter →', 'buy', ['buy', "don't buy"], '')])),
        ('rule', 'Grammar', 'some / any — Grammar Easy', '12 min',
         easy('some / any · How much? / How many?',
              'Можно посчитать (apples, eggs) → <b>How many?</b> Нельзя посчитать (flour, sugar, milk) → <b>How much?</b> <b>some</b> — в утверждениях (I need some flour). <b>any</b> — в вопросах и отрицаниях (Have you got any butter? There isn\'t any flour).',
              [[('I need', 'd'), ('some', 'c'), ('flour.', 'b')], [("There isn't", 'd'), ('any', 'c'), ('butter.', 'b')], [('How many', 'c'), ('apples', 'b'), ('do you need?', 'd')]],
              [('🌾', 'I need some flour.'), ('🧈', "There isn't any butter."), ('🍎', 'How many apples do you need?'), ('🍬', 'How much sugar is there?')],
              [('How much apples?', 'How many apples?', 'Можно посчитать → many.'), ('I need any eggs.', 'I need some eggs.', 'Утверждение → some.')])
         + ex_select(ids, [('How', 'many', ['much', 'many'], 'eggs do you need?'), ('How', 'much', ['much', 'many'], 'milk is there?'), ("We haven't got", 'any', ['some', 'any'], 'butter.'), ('I want', 'some', ['some', 'any'], 'apples.')])),
        ('market', 'Role-play', 'at the market', '14 min',
         listening(P + '-lis', [('m', 'Good morning! Can I help you?'), ('f', "Yes, please. I'd like some apples."), ('m', 'How many would you like?'), ('f', "Three, please. And have you got any butter?"),
                                ('m', "Yes, we have. How much do you need?"), ('f', 'A hundred grams, please. How much is that?'), ('m', "That's two hundred roubles."), ('f', 'Here you are. Thank you!')],
                   'Kate at the market', 'Listen, then act it out', '🛒', {'m': 'Seller', 'f': 'Kate'})
         + roleplay(('You: the customer', ['Buy everything on Kate\'s list.', 'Ask: Have you got any…?', 'Ask: How much is it?']), ('Teacher: the seller', ['You have no flour today!', 'Apples are 50 roubles each.', 'Offer something else.']))
         + phrases(["I'd like some…, please.", 'Have you got any…?', 'How much is it?', 'How many would you like?', 'Here you are.'])),
        ('write', 'Writing', 'your recipe', '10 min',
         rubric('a', 'Write a simple recipe you love (5 lines): ingredients and steps.', 'Ваш любимый простой рецепт: продукты и шаги.')
         + lines(ids, ['Name: …', 'You need: some…, a little…, two…', 'First, …', 'Then …', 'Finally, …'])
         + vocab_section(ids, '1E', 'Food and cooking', cards, [('🌾 →', 'flour', ['flour', 'sugar', 'butter'], ''), ('instructions for cooking →', 'a recipe', ['a recipe', 'a kilo', 'a menu'], '')], []) + send_box()),
    ]
    hw = hw_pair(ids, [('🥚 →', 'eggs', ['eggs', 'apples', 'butter'], ''), ('🧈 →', 'butter', ['butter', 'milk', 'flour'], ''), ('⚖️ →', 'a kilo', ['a kilo', 'a litre', 'a recipe'], '')],
                 [('flour', 'flour', ['flour', 'flower', 'floor']), ('butter', 'butter', ['butter', 'better', 'bitter']), ('How much', 'How much', ['How much', 'How many', 'How mush'])],
                 [('a kilo of', ['flour'], ''), ('a litre of', ['milk'], ''), ("Grandma's", ['recipe'], '')],
                 'some or any? much or many?', 'some / any, much / many.', [('Have you got', ['any'], 'eggs?', ''), ('I need', ['some'], 'milk.', ''), ('How', ['many'], 'apples?', ''), ('How', ['much'], 'flour?', '')],
                 [('How much eggs do you need? →', ['How many eggs do you need?']), ("There isn't some milk. →", ["There isn't any milk.", 'There is not any milk.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'olya', 'code': '1E', 'title': 'At the Market', 'level': 'A2', 'category': 'Food & shopping', 'minutes': '55 min',
                 'grammar': 'some / any · How much? / How many? (Grammar Easy)', 'date': DATE, 'gvp': {'g': 'countable / uncountable; some / any; How much / How many', 'v': 'food and cooking', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Оля · урок 1E', 'tags': ['A2', 'Task', 'Market role-play', 'some · any'],
                 'lead': 'A real task: read Grandma\'s apple pie recipe, make a shopping list and buy everything at the market — in English!',
                 'cards': cards, 'case': {'bad': [('How much apples?', 'How many apples?'), ('I need any eggs.', 'I need some eggs.')], 'ok': ["I'd like some apples, please.", 'Have you got any butter?']},
                 'sections': sections, 'hw': hw})


def efim():
    P, LID = 'ef4', 'efim-4'
    ids = Ids(P)
    cards = [('a referee', 'the person who controls a match', 'судья', 'The referee showed a red card.', '🧑‍⚖️'), ('a team', '', 'команда', 'a football team', '👥'), ('a goal', '', 'гол', 'He scored a goal.', '⚽'),
             ('a rule', '', 'правило', 'the rules of tennis', '📏'), ('to score', 'to get a point or goal', 'забить', 'She scored three points.', '🎯'), ('a racket', '', 'ракетка', 'a tennis racket', '🎾'),
             ('a helmet', '', 'шлем', 'You have to wear a helmet.', '⛑️'), ('to win', '', 'выигрывать', 'Who won the match?', '🏆')]
    sections = [
        ('quiz', 'Quiz show', 'sports quiz', '10 min',
         route([('🏆', 'quiz show'), ('📘', 'can / have to'), ('🕵️', 'guess the sport'), ('🎧', 'a new sport'), ('📝', 'invent a sport')])
         + deck('Quiz show · Спортивная викторина', [mc(P + '-z1', 'How many players are in a football team on the pitch?', ['eleven', 'nine', 'six'], 0), mc(P + '-z2', 'In tennis you use a…', ['racket', 'bat', 'stick'], 0),
                                                       mc(P + '-z3', 'In basketball you can\'t…', ['run with the ball without bouncing it', 'jump', 'pass the ball'], 0), mc(P + '-z4', 'Who controls a football match?', ['a referee', 'a coach', 'a fan'], 0)])),
        ('rule', 'Grammar', 'can and have to — Grammar Easy', '12 min',
         easy("can · can't · have to · don't have to",
              '<b>can</b> — можно, <b>can\'t</b> — нельзя (правило). <b>have to</b> — обязательно. <b>don\'t have to</b> — не обязательно (можно, но не нужно). he / she → <b>has to</b>, <b>doesn\'t have to</b>.',
              [[('In football', 'b'), ('you', 'a'), ("can't", 'd'), ('touch the ball with your hands.', 'c')], [('Cyclists', 'a'), ('have to', 'd'), ('wear a helmet.', 'c')], [('You', 'a'), ("don't have to", 'd'), ('be tall.', 'c')]],
              [('⚽', "In football you can't touch the ball with your hands."), ('⛑️', 'Cyclists have to wear a helmet.'), ('🏀', "You don't have to be tall to play basketball.")],
              [("You don't have to touch the ball! (=нельзя)", "You can't touch the ball!", 'Нельзя → can\'t.'), ('She have to train.', 'She has to train.', 'she → has to.')])
         + ex_select(ids, [('In football the goalkeeper', 'can', ['can', "can't"], 'use his hands.'), ('In tennis you', 'have to', ['have to', "don't have to"], 'use a racket.'),
                           ('You', "don't have to", ["don't have to", "can't"], 'be fast to play chess.'), ('In basketball you', "can't", ['can', "can't"], 'kick the ball.')])),
        ('guess', 'Game', 'guess the sport', '10 min',
         rubric('a', 'Your teacher describes a sport with can / have to. Guess it! Then you describe one.', 'Преподаватель описывает вид спорта — угадайте. Потом вы.')
         + escape(ids, [('🏐', 'Sport 1', 'You have to hit the ball over a net with your hands. You can\'t catch it. →', ['volleyball']), ('🏊', 'Sport 2', 'You have to be in water. You don\'t have to use a ball. →', ['swimming']),
                        ('♟️', 'Sport 3', 'You don\'t have to run. You have to think a lot. You can\'t talk. →', ['chess'])])),
        ('listen', 'Listening', 'a new sport', '8 min',
         listening(P + '-lis', [('m', "Have you heard of padel? It's like tennis, but the court is smaller and it has walls."), ('f', 'Do you have to use a big racket?'),
                                ('m', "No, the racket is small and it hasn't got strings. And you have to play in pairs — two against two."), ('f', 'Can the ball hit the walls?'),
                                ('m', "Yes, it can! That's the fun part.")], 'What is padel?', 'Listen twice', '🎾', {'m': 'Max', 'f': 'Zoe'})
         + deck('Check', [mc(P + '-q1', 'Padel is like…', ['tennis', 'football', 'golf'], 0), mc(P + '-q2', 'You have to play…', ['two against two', 'alone', 'in teams of six'], 0),
                          mc(P + '-q3', 'Can the ball hit the walls?', ['Yes, it can.', "No, it can't."], 0)])),
        ('invent', 'Project', 'invent a sport', '10 min',
         cycle('<p>Invent a new sport (for example, football on bikes 😄).</p>', lines(ids, ['Name: …', 'You have to…', 'You can…', "You can't…", "You don't have to…"]), '<p>Explain your sport to your teacher. Would she play it?</p>')
         + vocab_section(ids, '1D', 'Sport', cards, [('the person who controls a match →', 'a referee', ['a referee', 'a team', 'a coach'], ''), ('⛑️ →', 'a helmet', ['a helmet', 'a racket', 'a goal'], '')], []) + send_box()),
    ]
    hw = hw_pair(ids, [('🎾 →', 'a racket', ['a racket', 'a helmet', 'a goal'], ''), ('to get a point or goal →', 'to score', ['to score', 'to win', 'to play'], ''), ('📏 →', 'a rule', ['a rule', 'a team', 'a referee'], '')],
                 [('referee', 'referee', ['referee', 'refugee', 'reverie']), ('a helmet', 'a helmet', ['a helmet', 'a hamlet', 'a helmut']), ('scored', 'scored', ['scored', 'scared', 'stored'])],
                 [('He', ['scored'], 'a goal.'), ('Who', ['won'], 'the match?'), ('You have to wear a', ['helmet'], '.')],
                 "can / can't / have to / don't have to", 'Вставьте модальный глагол.', [('In chess you', ["can't", 'cannot'], 'talk.', 'нельзя'), ('Swimmers', ['have to'], 'be in the water.', 'обязательно'),
                                                                                        ('You', ["don't have to", 'do not have to'], 'be tall to play.', 'не обязательно'), ('She', ['has to'], 'train every day.', 'обязательно')],
                 [('He have to train. →', ['He has to train.']), ("You don't have to kick the ball in basketball! (=нельзя) →", ["You can't kick the ball in basketball!"])])
    return flex({'id': LID, 'prefix': P, 'owner': 'efim', 'code': '1D', 'title': 'Sports Day', 'level': 'A2', 'category': 'Sport', 'minutes': '55 min',
                 'grammar': "can / can't · have to / don't have to (Grammar Easy)", 'date': DATE, 'gvp': {'g': "can / can't for rules; have to / don't have to", 'v': 'sports and rules', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Ефим · урок 1D', 'tags': ['A2', 'Quiz show', 'Guess the sport', 'can · have to'],
                 'lead': 'A sports quiz, a «guess the sport» game, a strange new sport called padel — and at the end you invent your own sport with its rules!',
                 'cards': cards, 'case': {'bad': [('She have to train.', 'She has to train.')], 'ok': ["You can't touch the ball with your hands.", 'Cyclists have to wear a helmet.']},
                 'sections': sections, 'hw': hw})


def vladimir():
    P, LID = 'vl4', 'vladimir-4'
    ids = Ids(P)
    cards = [('the metro', '', 'метро', 'The metro is faster.', '🚇'), ('a taxi', '', 'такси', 'A taxi is more expensive.', '🚕'), ('a bus', '', 'автобус', 'The bus is cheaper.', '🚌'),
             ('a scooter', '', 'самокат', 'an electric scooter', '🛴'), ('a traffic jam', 'a lot of cars that cannot move', 'пробка', "There's a traffic jam.", '🚗'),
             ('a ticket', '', 'билет', 'a metro ticket', '🎫'), ('to get to', 'to arrive at', 'добраться до', 'How do I get to the airport?', '📍'), ('rush hour', 'the busy time when people go to work', 'час пик', 'Avoid rush hour!', '⏰')]
    sections = [
        ('problem', 'Problem', 'the problem', '8 min',
         route([('🗺️', 'a problem to solve'), ('📊', 'compare the options'), ('📘', 'comparatives'), ('🎧', 'ask for advice'), ('✅', 'your decision')])
         + box('<b>Problem:</b> Your colleague from London, Tom, lands at Sheremetyevo airport at 8 a.m. on Monday. He has a meeting in the city centre at 10. He has a big suitcase. How should he get there?', '✈️')
         + rubric('a', 'Look at the options.', 'Посмотрите на варианты.')
         + box('🚕 <b>Taxi:</b> 60–90 min (traffic jams in rush hour!) · 2,500 roubles<br>🚆 <b>Aeroexpress train + metro:</b> 55 min · 600 roubles<br>🚌 <b>Bus + metro:</b> 80 min · 120 roubles', '📊')),
        ('compare', 'Grammar', 'compare the options', '12 min',
         easy('faster · cheaper · more comfortable',
              'Сравниваем два варианта: короткое слово + <b>-er</b> (fast → faster), длинное — <b>more</b> + слово (more comfortable). Дальше <b>than</b>. good → <b>better</b>, bad → <b>worse</b>.',
              [[('The train', 'a'), ('is', 'd'), ('faster', 'c'), ('than a taxi.', 'b')], [('A taxi', 'a'), ('is', 'd'), ('more comfortable', 'c'), ('than a bus.', 'b')]],
              [('🚆', 'The train is faster than a taxi in rush hour.'), ('🚌', 'The bus is cheaper than the train.'), ('🚕', 'A taxi is more comfortable with a big suitcase.')],
              [('more cheap', 'cheaper', 'Короткое слово → -er.'), ('faster that', 'faster than', 'than.')])
         + ex_gaps(ids, [('The bus is', ['cheaper'], 'than the train.', 'cheap'), ('A taxi is', ['more expensive'], 'than the bus.', 'expensive'), ('In rush hour the train is', ['faster'], 'than a taxi.', 'fast'),
                         ('With a big suitcase, a taxi is', ['more comfortable'], '.', 'comfortable'), ('The metro is', ['better'], 'than the bus in winter.', 'good')])),
        ('advice', 'Listening', 'ask for advice', '10 min',
         listening(P + '-lis', [('m', 'Alice, how do I get from Sheremetyevo to the centre? I have a meeting at ten.'), ('f', 'Take the Aeroexpress. It is faster than a taxi in the morning, and much cheaper.'),
                                ('m', 'But I have a big suitcase.'), ('f', "Then a taxi is more comfortable. But at eight o'clock there are traffic jams. You might be late!"), ('m', 'OK, the train then. Thanks!')],
                   'Tom asks Alice', 'Listen twice', '📞', {'m': 'Tom', 'f': 'Alice'})
         + deck('Check', [mc(P + '-q1', 'What does Alice recommend?', ['the Aeroexpress', 'a taxi', 'a bus'], 0), mc(P + '-q2', 'Why not a taxi?', ['traffic jams', 'it is dirty', 'no taxis'], 0)])),
        ('decide', 'Task', 'your decision', '12 min',
         cycle('<p>Decide: how should Tom travel? And how do YOU get to work?</p>', lines(ids, ['Tom should take… because it is …-er than…', 'It is also more … than…', 'I usually get to work by… It is … than…']),
               '<p>Explain your decision to your teacher. She disagrees — defend your choice!</p>' + phrases(['I think… is better because…', "It's faster / cheaper than…", "Yes, but it's more…"]))
         + vocab_section(ids, '1D', 'Transport', cards, [('a lot of cars that cannot move →', 'a traffic jam', ['a traffic jam', 'rush hour', 'a ticket'], ''), ('🛴 →', 'a scooter', ['a scooter', 'a bus', 'a taxi'], '')], []) + send_box()),
    ]
    hw = hw_pair(ids, [('the busy time when people go to work →', 'rush hour', ['rush hour', 'a traffic jam', 'the metro'], ''), ('🚇 →', 'the metro', ['the metro', 'a bus', 'a taxi'], ''), ('🎫 →', 'a ticket', ['a ticket', 'a map', 'a bus'], '')],
                 [('cheaper', 'cheaper', ['cheaper', 'cheap', 'chipper']), ('faster', 'faster', ['faster', 'fast', 'father']), ('more expensive', 'more expensive', ['more expensive', 'expensive', 'more extensive'])],
                 [('How do I get', ['to'], 'the airport?'), ("There's a traffic", ['jam'], '.'), ('Avoid rush', ['hour'], '!')],
                 'Write the comparative.', 'Сравнительная степень.', [('A plane is', ['faster'], 'than a train.', 'fast'), ('Moscow is', ['bigger'], 'than Tver.', 'big'), ('This hotel is', ['more comfortable'], 'than that one.', 'comfortable'),
                                                                     ('Today the weather is', ['worse'], 'than yesterday.', 'bad')],
                 [('The bus is more cheap. →', ['The bus is cheaper.']), ('A taxi is faster that a bus. →', ['A taxi is faster than a bus.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'vladimir', 'code': '1D', 'title': 'Getting Around', 'level': 'A2', 'category': 'Transport', 'minutes': '50 min',
                 'grammar': 'Comparatives: faster, cheaper, more comfortable, better (Grammar Easy)', 'date': DATE, 'gvp': {'g': 'comparative adjectives + than', 'v': 'transport', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Владимир · урок 1D', 'tags': ['A2', 'Problem solving', 'Transport', 'Comparatives'],
                 'lead': 'A real problem to solve: a colleague lands at the airport at 8 and has a meeting at 10. Compare the options, ask for advice and make a decision!',
                 'cards': cards, 'case': {'bad': [('more cheap', 'cheaper'), ('faster that', 'faster than')], 'ok': ['The train is faster than a taxi.', 'The bus is cheaper.']},
                 'sections': sections, 'hw': hw})


def sasha():
    P, LID = 'sa5', 'sasha-5'
    ids = Ids(P)
    cards = [('to move house', 'to go to live in a new home', 'переезжать', 'We are moving house.', '🏠'), ('a box', '', 'коробка', 'I have packed ten boxes.', '📦'), ('to unpack', 'to take things out of boxes', 'распаковывать', "I haven't unpacked yet.", '📭'),
             ('a removal van', 'a big car for moving furniture', 'грузовик для переезда', 'The removal van has just arrived.', '🚚'), ('a landlord', 'a person who rents you a flat', 'арендодатель', "I've already paid the landlord.", '🧑‍💼'),
             ('the keys', '', 'ключи', "I've just got the keys!", '🔑'), ('to set up', 'to prepare and connect', 'настроить, подключить', 'Have you set up the internet yet?', '🔌'), ('a to-do list', '', 'список дел', 'My to-do list is long.', '📝')]
    sections = [
        ('test', 'Test', 'test yourself', '8 min',
         route([('🧪', 'test'), ('🎧', 'moving day'), ('📘', 'just / already / yet'), ('🧪', 'test again'), ('📝', 'your to-do list')])
         + rubric('a', 'Test first! Choose the correct word. No help yet.', 'Сначала тест — без подсказок.')
         + ex_select(ids, [("I've", 'just', ['just', 'yet'], 'got the keys — five minutes ago!'), ("Have you unpacked", 'yet', ['yet', 'already'], '?'), ("We've", 'already', ['already', 'yet'], 'paid the landlord.'),
                           ("I haven't set up the internet", 'yet', ['yet', 'just'], '.')])),
        ('listen', 'Listening', 'moving day', '10 min',
         listening(P + '-lis', [('f', "Sasha! How's the move going?"), ('m', "Crazy! The removal van has just arrived. I've already packed twenty boxes."), ('f', 'Have you got the keys yet?'),
                                ('m', "Yes, I've just got them from the landlord. But I haven't found my phone charger yet!"), ('f', 'Ha! Have you set up the internet?'),
                                ('m', "Not yet. That's on my to-do list for tomorrow.")], 'Moving day', 'Listen and check your test', '📦', {'f': 'Masha', 'm': 'Sasha'})
         + deck('Check', [mc(P + '-q1', 'What has just arrived?', ['the removal van', 'Masha', 'a pizza'], 0), mc(P + '-q2', 'How many boxes has he packed?', ['twenty', 'ten', 'two'], 0),
                          mc(P + '-q3', "What hasn't he found yet?", ['his phone charger', 'the keys', 'the van'], 0)])),
        ('teach', 'Teach', 'just · already · yet', '10 min',
         easy("just · already · yet",
              'Present perfect + маленькие слова. <b>just</b> = только что. <b>already</b> = уже (раньше, чем ждали). <b>yet</b> = ещё не (в отрицании) / уже? (в вопросе) — <b>в конце</b>.',
              [[("I've", 'a'), ('just', 'c'), ('got', 'd'), ('the keys.', 'b')], [("I've", 'a'), ('already', 'c'), ('packed', 'd'), ('20 boxes.', 'b')], [("I haven't", 'a'), ('unpacked', 'd'), ('yet.', 'c')]],
              [('🔑', "I've just got the keys!"), ('📦', "I've already packed twenty boxes."), ('📭', "I haven't unpacked yet."), ('🔌', 'Have you set up the internet yet?')],
              [("I haven't yet unpacked.", "I haven't unpacked yet.", 'yet — в конце.'), ("I've got just the keys.", "I've just got the keys.", 'just — перед глаголом.')],
              choose=[('Только что', "just: I've just…"), ('Уже', "already: I've already…"), ('Ещё не / уже?', "yet: I haven't… yet. / Have you… yet?")])),
        ('retest', 'Test again', 'test again', '8 min',
         ex_gaps(ids, [("I've", ['just'], 'finished — two minutes ago.', ''), ("Have you called the landlord", ['yet'], '?', ''), ("She's", ['already'], 'unpacked everything!', ''), ("We haven't bought a sofa", ['yet'], '.', '')])),
        ('list', 'Task', 'your to-do list', '12 min',
         rubric('a', 'Write your to-do list for this week. Then tell your teacher what you have already done and what you haven\'t done yet.', 'Ваш список дел: что уже сделано, а что ещё нет.')
         + lines(ids, ["✅ I've already…", "✅ I've just…", "❌ I haven't … yet.", "❌ I haven't … yet."])
         + vocab_section(ids, '3B', 'Moving house', cards, [('to take things out of boxes →', 'to unpack', ['to unpack', 'to set up', 'to move house'], ''), ('a person who rents you a flat →', 'a landlord', ['a landlord', 'a neighbour', 'a driver'], '')], []) + send_box()),
    ]
    hw = hw_pair(ids, [('📦 →', 'a box', ['a box', 'a van', 'a key'], ''), ('🚚 →', 'a removal van', ['a removal van', 'a taxi', 'a bus'], ''), ('to prepare and connect →', 'to set up', ['to set up', 'to unpack', 'to move'], '')],
                 [('already', 'already', ['already', 'all ready', 'early']), ('yet', 'yet', ['yet', 'yes', 'jet']), ('just', 'just', ['just', 'juice', 'jest'])],
                 [("I've just got the", ['keys'], '!'), ('My to-do', ['list'], 'is long.'), ("I haven't", ['unpacked'], 'yet.')],
                 'just, already or yet?', 'just / already / yet.', [("I've", ['just'], 'arrived home.', 'только что'), ("Have you finished", ['yet'], '?', ''), ("He's", ['already'], 'gone to bed.', 'уже'), ("I haven't read it", ['yet'], '.', '')],
                 [("I haven't yet finished. →", ["I haven't finished yet.", 'I have not finished yet.']), ("I've finished just. →", ["I've just finished.", 'I have just finished.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'sasha', 'code': '3B', 'title': 'Moving Day', 'level': 'Pre-Intermediate → Intermediate', 'category': 'Home & moving', 'minutes': '50 min',
                 'grammar': 'Present perfect: just / already / yet', 'date': DATE, 'gvp': {'g': 'present perfect with just, already, yet', 'v': 'moving house', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Саша · урок 3B', 'tags': ['Pre-Int → Int', 'Test–teach–test', 'Moving house', 'just · already · yet'],
                 'lead': 'Test first, then listen to a crazy moving day, learn the rule, test again — and finish with your own real to-do list.',
                 'cards': cards, 'case': {'bad': [("I haven't yet finished.", "I haven't finished yet.")], 'ok': ["I've just got the keys!", "I've already packed 20 boxes."]},
                 'sections': sections, 'hw': hw})


def vika():
    P, LID = 'vk9', 'vika-7'
    ids = Ids(P)
    cards = [('the crew', 'all the people who work on a ship', 'команда (корабля)', "The captain didn't like the crew.", '👥'), ('a voyage', 'a long journey by sea', 'плавание, путешествие', 'a dangerous voyage', '🧭'),
             ('gunpowder', 'a powder that explodes', 'порох', 'They moved the gunpowder.', '💥'), ('arms', 'weapons', 'оружие', 'Put the arms near the cabin.', '🗡️'),
             ('a cabin', 'a small room on a ship', 'каюта', "the captain's cabin", '🚪'), ('to trust', 'to believe someone is honest', 'доверять', "Don't trust anyone!", '🤝'),
             ('the mate', 'the officer after the captain', 'помощник капитана', 'Mr Arrow, the mate', '🧑‍✈️'), ('a secret', '', 'секрет', 'The map was a secret.', '🤫')]
    text = ['Jim went on board the Hispaniola. The captain, Mr Smollett, was a serious, strict man. He asked to speak to the Squire and the Doctor.',
            '«I don\'t like this voyage,» said the captain. «I don\'t like the men, and I don\'t like my mate, Mr Arrow.»',
            '«Why not?» asked the Squire angrily.', '«The crew know more about this trip than I do,» said the captain. «Everyone is talking about a treasure map. That is dangerous. You should not tell everyone your secrets.»',
            'He asked them to move the gunpowder and the arms to the back of the ship, near the cabins, and to put the men they trusted there too.',
            'The Squire was angry, but the Doctor agreed with the captain. «We should listen to him,» he said. Then they heard Long John Silver singing happily on the deck.']
    sections = [
        ('roles', 'Reading circle', 'choose your roles', '6 min',
         route([('🎭', 'reading-circle roles'), ('📖', 'read chapter 9'), ('🗣️', 'share your role'), ('📘', 'should / shouldn\'t'), ('🧭', 'advice for the captain')])
         + rubric('a', 'Today we read like a book club. You have two roles; your teacher has the other two. Read the chapter with your role in mind.', 'Читаем как книжный клуб: у вас две роли, у преподавателя — две.')
         + roleplay(('Your roles', ['📝 <b>Summariser</b>: tell the chapter in 4 sentences.', '❓ <b>Question master</b>: write 3 questions about the chapter.']),
                    ('Teacher\'s roles', ['🔤 <b>Word master</b>: explains 4 new words.', '🔗 <b>Connector</b>: connects the story to real life.']))),
        ('read', 'Reading', 'chapter 9', '12 min',
         reading('Treasure Island · Chapter 9: Powder and Arms', 'adapted for A2 · about 190 words', text)
         + deck('Check', [mc(P + '-q1', 'Who is Mr Smollett?', ['the captain', 'the cook', 'the doctor'], 0), mc(P + '-q2', "Why doesn't the captain like the voyage?", ['The crew know about the treasure map.', 'The ship is old.', 'It is too cold.'], 0),
                          mc(P + '-q3', 'What does he want to move?', ['the gunpowder and arms', 'the food', 'the map'], 0), mc(P + '-q4', 'Who agrees with the captain?', ['the Doctor', 'the Squire', 'Silver'], 0)])),
        ('share', 'Speaking', 'share your role', '10 min',
         rubric('a', 'Do your roles: write your summary and your questions. Then share with your teacher.', 'Выполните свои роли и поделитесь.')
         + lines(ids, ['Summary 1: …', 'Summary 2: …', 'Summary 3: …', 'Summary 4: …', 'Question 1: …', 'Question 2: …', 'Question 3: …'])),
        ('should', 'Grammar', "should / shouldn't — Grammar Easy", '10 min',
         easy("You should… · You shouldn't…",
              'Совет: <b>should + глагол</b> («стоит, следует»). Совет «не делать»: <b>shouldn\'t</b>. Одинаково для всех: I / he / they should. После should — <b>без to</b>.',
              [[('You', 'a'), ("shouldn't", 'd'), ('tell everyone', 'c'), ('your secrets.', 'b')], [('We', 'a'), ('should', 'd'), ('listen', 'c'), ('to him.', 'b')]],
              [('🤫', "You shouldn't tell everyone your secrets."), ('🧭', 'We should listen to the captain.'), ('💥', 'They should move the gunpowder.')],
              [('You should to listen.', 'You should listen.', 'Без to.'), ('He shoulds go.', 'He should go.', 'Без -s.')])
         + ex_select(ids, [('The Squire', "shouldn't", ['should', "shouldn't"], 'tell everyone about the map.'), ('They', 'should', ['should', "shouldn't"], 'move the arms near the cabins.'),
                           ('Jim', 'should', ['should', "shouldn't"], 'be careful.'), ('The crew', "shouldn't", ['should', "shouldn't"], 'know about the treasure.')])),
        ('advice', 'Writing', 'advice for the captain', '10 min',
         rubric('a', 'You are Jim. Write 4 pieces of advice for Captain Smollett or the Squire.', 'Вы — Джим. Четыре совета капитану или сквайру.')
         + lines(ids, ['Captain, you should…', 'You shouldn\'t…', 'Mr Trelawney, you should…', 'We all should…'])
         + vocab_section(ids, 'Ch9', 'Treasure Island, chapter 9', cards, [('all the people who work on a ship →', 'the crew', ['the crew', 'the mate', 'a cabin'], ''), ('a long journey by sea →', 'a voyage', ['a voyage', 'a trip', 'a secret'], '')], []) + send_box()),
    ]
    hw = hw_pair(ids, [('a small room on a ship →', 'a cabin', ['a cabin', 'a deck', 'the crew'], ''), ('weapons →', 'arms', ['arms', 'gunpowder', 'maps'], ''), ('to believe someone is honest →', 'to trust', ['to trust', 'to tell', 'to agree'], '')],
                 [('voyage', 'voyage', ['voyage', 'village', 'voice']), ('the crew', 'the crew', ['the crew', 'the screw', 'the clue']), ('gunpowder', 'gunpowder', ['gunpowder', 'gun power', 'powder'])],
                 [('The captain was strict and', ['serious'], '.'), ("Don't", ['trust'], 'Silver!'), ('They moved the', ['gunpowder'], '.')],
                 "should or shouldn't?", "should / shouldn't.", [('You', ["shouldn't", 'should not'], 'tell your secrets to strangers.', ''), ('Jim', ['should'], 'listen to the Doctor.', ''),
                                                               ('Sailors', ['should'], 'obey the captain.', ''), ('The Squire', ["shouldn't", 'should not'], 'be so angry.', '')],
                 [('You should to be careful. →', ['You should be careful.']), ('He shoulds listen. →', ['He should listen.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'vika', 'code': 'Ch9', 'title': 'Chapter 9: Powder and Arms', 'level': 'A2', 'category': 'Reading: Treasure Island', 'minutes': '50 min',
                 'grammar': "should / shouldn't for advice (Grammar Easy) · reading circle", 'date': DATE, 'gvp': {'g': "should / shouldn't", 'v': 'Treasure Island, chapter 9', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Вика · Treasure Island', 'tags': ['A2', 'Treasure Island', 'Reading circle', "should"],
                 'lead': 'Today we read like a real book club: you and your teacher each have reading roles. Captain Smollett doesn\'t trust the crew — what advice would you give him?',
                 'cards': cards, 'case': {'bad': [('You should to listen.', 'You should listen.')], 'ok': ["You shouldn't tell everyone your secrets.", 'We should listen to the captain.']},
                 'sections': sections, 'hw': hw})


def mussa():
    P, LID = 'ms3', 'mussa-3'
    ids = Ids(P)
    cards = [('left', '', 'налево', 'Turn left.', '⬅️'), ('right', '', 'направо', 'Turn right.', '➡️'), ('straight on', '', 'прямо', 'Go straight on.', '⬆️'),
             ('next to', '', 'рядом с', 'next to the hotel', '↔️'), ('near', '', 'рядом, недалеко', 'near the river', '📍'), ('the cable car', '', 'канатная дорога', 'Where is the cable car?', '🚡'),
             ('a toilet', '', 'туалет', 'Where is the toilet?', '🚻'), ('a bridge', '', 'мост', 'Cross the bridge.', '🌉')]
    sections = [
        ('tpr', 'TPR', 'move and say', '8 min',
         route([('🙋', 'move and say'), ('🗺️', 'the village map'), ('🎧', 'a tourist asks'), ('🎭', 'show the way'), ('✍️', 'write the way')])
         + rubric('a', 'Stand up! Press 🔊, say it and do it: point left, right, walk forward.', 'Встаньте! Нажмите 🔊, повторите и покажите рукой.')
         + say_list([('Turn left.', '⬅️ turn <u>LEFT</u>'), ('Turn right.', '➡️ turn <u>RIGHT</u>'), ('Go straight on.', '⬆️ go straight <u>ON</u>'), ("It's next to the hotel.", '↔️ next to the hotel'), ('Cross the bridge.', '🌉 cross the bridge')])),
        ('map', 'Map', 'the village map', '10 min',
         box('<b>Map of the village:</b><br>🏨 Hotel — ☕ Café (next to the hotel)<br>⬆️ straight on → 🌉 Bridge → 🚡 Cable car<br>⬅️ left from the hotel → 🏪 Shop · 🚻 Toilet (near the shop)<br>➡️ right from the hotel → 🐎 Horse stables', '🗺️')
         + rubric('a', 'You are at the hotel. Choose the answer.', 'Вы у гостиницы. Выберите ответ.')
         + ex_select(ids, [('Where is the café? →', "It's next to the hotel.", ["It's next to the hotel.", 'Cross the bridge.', 'Turn right.'], ''), ('Where is the cable car? →', 'Go straight on and cross the bridge.', ['Go straight on and cross the bridge.', 'Turn left.', "It's next to the hotel."], ''),
                           ('Where are the horses? →', 'Turn right.', ['Turn right.', 'Turn left.', 'Go straight on.'], ''), ('Where is the toilet? →', 'Turn left. It\'s near the shop.', ["Turn left. It's near the shop.", 'Turn right.', 'Cross the bridge.'], '')])),
        ('listen', 'Listening', 'a tourist asks', '8 min',
         listening(P + '-lis', [('f', 'Excuse me, where is the cable car?'), ('m', 'Go straight on and cross the bridge. The cable car is there.'), ('f', 'Is it far?'), ('m', 'No, it\'s near. Five minutes.'), ('f', 'Thank you!'), ('m', "You're welcome!")],
                   'A tourist asks Mussa', 'Listen twice', '🚡', {'f': 'Tourist', 'm': 'Mussa'})
         + deck('Check', [mc(P + '-q1', 'Where does she want to go?', ['the cable car', 'the café', 'the hotel'], 0), mc(P + '-q2', 'Is it far?', ['No, five minutes.', 'Yes, one hour.'], 0)])),
        ('show', 'Role-play', 'show the way', '10 min',
         rubric('a', 'Your teacher is a tourist. She asks the way. Use the map and help her. Then swap!', 'Преподаватель — туристка, спрашивает дорогу. Помогите по карте. Потом поменяйтесь.')
         + phrases(['Excuse me, where is…?', 'Go straight on.', 'Turn left / right.', "It's next to…", "It's near…", 'Cross the bridge.', "You're welcome!"])),
        ('write', 'Writing', 'write the way', '8 min',
         rubric('a', 'Write the way from the hotel to two places.', 'Напишите, как пройти от гостиницы до двух мест.')
         + lines(ids, ['To the cable car: …', 'To the shop: …'])
         + vocab_section(ids, 'S3', 'Directions', cards, [('⬅️ →', 'left', ['left', 'right', 'straight on'], ''), ('🌉 →', 'a bridge', ['a bridge', 'a toilet', 'the cable car'], '')], []) + send_box()),
    ]
    hw = hw_pair(ids, [('➡️ →', 'right', ['right', 'left', 'near'], ''), ('⬆️ →', 'straight on', ['straight on', 'next to', 'left'], ''), ('🚡 →', 'the cable car', ['the cable car', 'a bridge', 'a shop'], '')],
                 [('left', 'left', ['left', 'lift', 'let']), ('right', 'right', ['right', 'write', 'light']), ('near', 'near', ['near', 'here', 'nearly'])],
                 [('Turn', ['left'], '.'), ('Go straight', ['on'], '.'), ("It's next", ['to'], 'the hotel.')],
                 'Complete.', 'Вставьте слово.', [('', ['Turn'], 'right.', ''), ('Cross the', ['bridge'], '.', ''), ('Excuse me, where', ['is'], 'the café?', ''), ("It's", ['near'], 'the shop.', 'рядом')],
                 [('Go straight. →', ['Go straight on.']), ('Where the café? →', ['Where is the café?', "Where's the café?"])])
    return flex({'id': LID, 'prefix': P, 'owner': 'mussa', 'code': 'S3', 'title': 'This Way, Please!', 'level': 'A0', 'category': 'Starter · directions', 'minutes': '45 min',
                 'grammar': 'Directions: turn left / right, go straight on, next to, near', 'date': DATE, 'gvp': {'g': 'imperatives for directions; next to / near', 'v': 'directions in the village', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Мусса · урок S3', 'tags': ['A0', 'TPR', 'Map', 'Directions'],
                 'lead': 'Tourists often ask the way! Stand up, move and learn the words with your body, then help a tourist find the cable car on the village map.',
                 'cards': cards, 'case': {'bad': [('Go straight.', 'Go straight on.'), ('Where the café?', 'Where is the café?')], 'ok': ['Turn left.', "It's next to the hotel."]},
                 'sections': sections, 'hw': hw})


def build():
    return [pelageya(), varya(), olya(), efim(), vladimir(), sasha(), vika(), mussa()]
