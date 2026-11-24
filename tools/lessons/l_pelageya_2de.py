"""Пелагея (A1–A2): 2D «Kate's Birthday» — полный урок (был слишком коротким) и 2E «A Weekend at Grandma's».
2D: past simple правильные глаголы (-ed), произношение /t/ /d/ /ɪd/, отрицание didn't и вопрос Did…?
2E: past simple неправильные глаголы (went, had, saw, ate…) и вопросы Where / What did you…?"""
from flex import *

OWNER = 'pelageya'


def birthday():
    P, LID = 'pg8', 'pelageya-8'
    ids = Ids(P)
    cards = [('a birthday', '', 'день рождения', "It was Kate's birthday.", '🎂'), ('a present', '', 'подарок', 'Kate opened her presents.', '🎁'),
             ('a candle', '', 'свеча', 'There were ten candles on the cake.', '🕯️'), ('to invite', '', 'приглашать', 'Kate invited six friends.', '💌'),
             ('to dance', '', 'танцевать', 'We danced all evening.', '💃'), ('to bake', '', 'печь', 'Anna baked a cake.', '🍰'), ('balloons', '', 'воздушные шарики', 'Tom painted funny faces on the balloons.', '🎈'),
             ('to laugh', '', 'смеяться', 'Everyone laughed.', '😂'), ('to clap', '', 'хлопать в ладоши', 'Everyone clapped.', '👏'), ('a guest', 'a person you invite', 'гость', 'The guests arrived at seven.', '🙋')]
    story = [('f', "Saturday was Kate's birthday. She invited six friends to her flat."), ('f', 'Anna baked a big chocolate cake, and Tom painted funny faces on the balloons.'),
             ('f', "At seven o'clock the guests arrived. They played games and danced."), ('f', 'Then Kate opened her presents. Everyone laughed and clapped. It was a great party!')]
    call = [('f2', "Hello, Tom! How was Kate's party?"), ('m', 'Hi, Grandma! It was great. We played games and danced a lot.'), ('f2', 'Did you dance too?'),
            ('m', "Yes, I did! But I didn't dance very well."), ('f2', 'Ha-ha! Did Kate like your present?'), ('m', 'Yes, she did. She loved the book.'),
            ('f2', 'Did Anna bake a cake?'), ('m', "Yes, a chocolate cake. But I didn't eat it — I was too full!")]
    sections = [
        ('chant', 'Warm-up', 'the -ed chant', '4 min',
         route([('🎵', 'chant'), ('🎂', 'words'), ('🖼️', 'picture story'), ('📘', '-ed'), ('👂', '/t/ /d/ /ɪd/'), ('📞', 'a phone call'), ('❓', "didn't · Did…?"), ('📖', 'a thank-you message'), ('🗣️', 'your party')])
         + rubric('a', 'Press 🔊 and say the chant with a rhythm! Clap on every verb.', 'Нажмите 🔊 и повторяйте в ритме, хлопайте на каждом глаголе.')
         + say_list([('I played, I danced, I laughed all day!', 'I <u>PLAYED</u>, I <u>DANCED</u>, I <u>LAUGHED</u> all <u>DAY</u>!'),
                     ('She baked, she painted, she wanted to stay!', 'she <u>BAKED</u>, she <u>PAINT</u>ed, she <u>WANT</u>ed to <u>STAY</u>!')])),
        ('words', 'Vocabulary', 'party words', '8 min',
         vocab_section(ids, '2D', 'A birthday party', cards,
                       [('🕯️ →', 'a candle', ['a candle', 'a present', 'a balloon'], ''), ('🎁 →', 'a present', ['a present', 'a birthday', 'a guest'], ''),
                        ('👏 →', 'to clap', ['to clap', 'to dance', 'to bake'], ''), ('a person you invite →', 'a guest', ['a guest', 'a present', 'a candle'], '')],
                       [('There were ten', ['candles'], 'on the cake.'), ('The', ['guests'], 'arrived at seven.'), ('Tom painted faces on the', ['balloons'], '.')])),
        ('story', 'Listening', "Kate's party", '8 min',
         rubric('a', 'Look at the pictures. What happened at the party? Guess, then listen.', 'Что было на вечеринке? Угадайте, потом послушайте.')
         + timeline([('💌', 'Kate invited six friends'), ('🍰🎈', 'Anna baked a cake, Tom painted balloons'), ('🎲💃', 'they played games and danced'), ('🎁👏', 'Kate opened her presents')])
         + listening(P + '-lis', story, "Kate's birthday", 'Listen twice', '🎂', {'f': 'Anna'})
         + deck('Check', [mc(P + '-q1', 'How many friends did Kate invite?', ['six', 'four', 'ten'], 0), mc(P + '-q2', 'What did Anna bake?', ['a chocolate cake', 'bread', 'cookies'], 0),
                          mc(P + '-q3', 'What did Tom paint?', ['funny faces on balloons', 'a picture', 'the door'], 0), mc(P + '-q4', 'When did the guests arrive?', ['at seven', 'at five', 'at nine'], 0)])),
        ('grammar', 'Grammar', 'past simple -ed — Grammar Easy', '10 min',
         rubric('a', 'Read the steps. Press 🔊 and repeat.', 'Прочитайте шаги, слушайте и повторяйте.')
         + easy('play → played · dance → danced',
                'О прошлом (вчера, в субботу, last week): к глаголу добавляем <b>-ed</b>. Одинаково для всех: I / she / they <b>played</b>. '
                'Глагол на <b>-e</b> → только <b>-d</b> (dance → danced). Согласная + <b>y</b> → <b>-ied</b> (study → studied).',
                [[('Kate', 'a'), ('invited', 'd'), ('six friends.', 'b')], [('They', 'a'), ('danced', 'd'), ('all evening.', 'b')], [('I', 'a'), ('studied', 'd'), ('yesterday.', 'b')]],
                [('💌', 'Kate invited six friends.'), ('🍰', 'Anna baked a cake.'), ('💃', 'They danced.'), ('😂', 'Everyone laughed.')],
                [('She inviteed…', 'She invited…', 'На -e → только -d.'), ('They was danced.', 'They danced.', 'Без was.'), ('I studyed.', 'I studied.', 'y → ied.')],
                choose=[('Обычный глагол', '+ ed: play → played'), ('Глагол на -e', '+ d: dance → danced'), ('Согласная + y', 'y → ied: study → studied')])
         + rubric('b', 'Write the past simple.', 'Напишите прошедшее время.')
         + ex_gaps(ids, [('Kate', ['invited'], 'her friends.', 'invite'), ('They', ['played'], 'games.', 'play'), ('Anna', ['baked'], 'a cake.', 'bake'),
                         ('Everyone', ['laughed'], '.', 'laugh'), ('I', ['studied'], 'English yesterday.', 'study'), ('We', ['watched'], 'a film.', 'watch')])
         + rubric('c', 'Put the words in order.', 'Соберите предложения.')
         + ex_order(ids, [(['invited', 'Kate', 'six friends.'], 'Kate invited six friends.'), (['danced', 'We', 'all evening.'], 'We danced all evening.')])),
        ('sounds', 'Pronunciation', '/t/ /d/ /ɪd/', '6 min',
         rubric('a', '-ed has three sounds! Press 🔊 and choose the sound.', 'У -ed три звука. Нажмите 🔊 и выберите.')
         + ex_listen_pick(ids, [('danced', '/t/', ['/t/', '/d/', '/ɪd/']), ('played', '/d/', ['/t/', '/d/', '/ɪd/']), ('painted', '/ɪd/', ['/t/', '/d/', '/ɪd/']),
                                ('laughed', '/t/', ['/t/', '/d/', '/ɪd/']), ('invited', '/ɪd/', ['/t/', '/d/', '/ɪd/']), ('cleaned', '/d/', ['/t/', '/d/', '/ɪd/'])])
         + reveal('💡 Tip', '<p>After <b>t</b> or <b>d</b> → /ɪd/ (painted, wanted, invited). After p, k, s, sh, ch, f → /t/ (danced, laughed, watched). Others → /d/ (played, cleaned).</p>')),
        ('call', 'Listening', "Tom calls Grandma", '6 min',
         rubric('a', 'Tom tells his grandma about the party. Did Tom eat the cake?', 'Том рассказывает бабушке о празднике. Ел ли он торт?')
         + listening(P + '-lis2', call, 'Tom and Grandma', 'Listen twice', '📞', {'m': 'Tom', 'f2': 'Grandma'})
         + deck('Check', [mc(P + '-c1', 'Did Tom dance?', ['Yes, he did.', "No, he didn't."], 0), mc(P + '-c2', 'Did Kate like the book?', ['Yes, she did.', "No, she didn't."], 0),
                          mc(P + '-c3', 'Did Tom eat the cake?', ["No, he didn't.", 'Yes, he did.'], 0)])),
        ('questions', 'Grammar', "didn't · Did…? — Grammar Easy", '8 min',
         easy("I didn't dance · Did you dance?",
              'Отрицание и вопрос в прошлом — с помощником <b>did</b>. ➖ <b>didn\'t</b> + глагол <b>без -ed</b>: I didn\'t dance. ❓ <b>Did</b> you <b>dance</b>? Ответ: <b>Yes, I did. / No, I didn\'t.</b>',
              [[('I', 'a'), ("didn't", 'd'), ('dance', 'c'), ('very well.', 'b')], [('Did', 'd'), ('you', 'a'), ('dance', 'c'), ('too?', 'b')]],
              [('💃', "I didn't dance very well."), ('❓', 'Did you dance too?'), ('🙂', 'Yes, I did.'), ('🍰', "No, I didn't eat the cake.")],
              [("I didn't danced.", "I didn't dance.", "После didn't — без -ed."), ('Did you liked it?', 'Did you like it?', 'После Did — без -ed.')])
         + ex_gaps(ids, [('I', ["didn't watch", 'did not watch'], 'TV yesterday.', '➖ watch'), ('', ['Did'], 'you like the party?', '❓'), ('Yes, I', ['did'], '.', ''),
                         ('She', ["didn't invite", 'did not invite'], 'Tom.', '➖ invite'), ('Did they', ['dance'], '?', 'dance')])),
        ('read', 'Reading', 'a thank-you message', '6 min',
         rubric('a', "Read Kate's message to her friends.", 'Прочитайте сообщение Кейт.')
         + reading("Kate → friends", 'a message · about 60 words', ['Thank you for a wonderful party! I loved my presents, especially the book from Tom and the flowers from Anna.',
                                                                    "The cake was delicious. I'm sorry I didn't dance much — my new shoes were too small! 😄", 'See you on Friday. Love, Kate'])
         + deck('True or false?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
             ('Kate loved her presents.', True), ('Anna gave Kate a book.', False), ('Kate danced a lot.', False)])])),
        ('mix', 'Accuracy', 'find the mistake', '4 min',
         rubric('a', 'One mistake in each sentence. Write it correctly.', 'Одна ошибка в каждом предложении.')
         + ex_lines(ids, [('She playd the piano. →', ['She played the piano.']), ("I didn't liked the film. →", ["I didn't like the film.", 'I did not like the film.']),
                          ('Did you visited Kate? →', ['Did you visit Kate?']), ('We was danced. →', ['We danced.'])])),
        ('speak', 'Speaking', 'your last birthday', '8 min',
         rubric('a', 'Answer your teacher. Short answer + one more sentence.', 'Короткий ответ + ещё одно предложение.')
         + picker(['Did you have a party on your last birthday?', 'Who did you invite?', 'Did you dance?', 'What presents did you get?', 'Did you bake a cake?', 'What did you watch last weekend?'])
         + phrases(['Yes, I did.', "No, I didn't.", 'I invited…', 'We played / danced / watched…'])),
        ('write', 'Writing', 'my last birthday', '6 min',
         rubric('a', 'Write about your last birthday — 4 sentences.', 'Ваш последний день рождения: 4 предложения.')
         + lines(ids, ['On my birthday I…', 'I invited / visited…', 'We… (played / danced / cooked / watched)', "I didn't…"]) + send_box()),
        ('check', 'Feedback', 'Can you…?', '3 min',
         selfcheck(ids, [('I can understand a story about a party', 'понять рассказ о празднике'), ('I can use past simple -ed', 'использовать past simple -ed'),
                         ("I can say <i>I didn't…</i> and ask <i>Did you…?</i>", "говорить I didn't… и спрашивать Did you…?")])),
    ]
    hw = hw_pair(ids, [('🎈 →', 'balloons', ['balloons', 'candles', 'presents'], ''), ('😂 →', 'to laugh', ['to laugh', 'to dance', 'to bake'], ''), ('💌 →', 'to invite', ['to invite', 'to play', 'to clap'], '')],
                 [('danced', 'danced', ['danced', 'dance', 'dancing']), ('wanted', 'wanted', ['wanted', 'want', 'wants']), ('cleaned', 'cleaned', ['cleaned', 'clean', 'cleans'])],
                 [('There were ten', ['candles'], 'on the cake.'), ('Anna', ['baked'], 'a cake.'), ('The', ['guests'], 'arrived at seven.')],
                 'Write the past simple: ➕ ➖ ❓', 'Прошедшее время: ➕ ➖ ❓', [('I', ['watched'], 'a film yesterday.', 'watch'), ('We', ["didn't cook", 'did not cook'], 'dinner.', '➖ cook'),
                                                                             ('', ['Did'], 'she phone her mum?', '❓'), ('They', ['visited'], 'Moscow.', 'visit')],
                 [('I playd tennis. →', ['I played tennis.']), ('She was cleaned her room. →', ['She cleaned her room.']), ('Did you liked it? →', ['Did you like it?'])],
                 [(['visited', 'We', 'Grandma.'], 'We visited Grandma.'), (['Did', 'you', 'dance?'], 'Did you dance?')])
    return flex({'id': LID, 'prefix': P, 'owner': OWNER, 'code': '2D', 'title': "Kate's Birthday", 'level': 'A1–A2', 'category': 'Parties', 'minutes': '60 min',
                 'grammar': "Past simple: -ed · didn't · Did…? · /t/ /d/ /ɪd/ (Grammar Easy)", 'date': '2026-11-30',
                 'gvp': {'g': "past simple regular verbs ➕ ➖ ❓", 'v': 'a birthday party', 'p': '-ed: /t/ /d/ /ɪd/'},
                 'eyebrow': 'IRIS SCHOOL · Пелагея · урок 2D', 'tags': ['A1–A2', 'Parties', 'past simple -ed', '60 min'],
                 'lead': 'Kate had a birthday party! A chant, party words, a picture story, Tom\'s phone call to Grandma and Kate\'s thank-you message — and how to talk about the past: '
                         "<i>We danced. I didn't dance very well. Did you like it?</i>",
                 'cards': cards, 'case': {'bad': [('She inviteed…', 'She invited…'), ("I didn't danced.", "I didn't dance."), ('Did you liked it?', 'Did you like it?')],
                                          'ok': ['Kate invited six friends.', 'Everyone laughed.', 'Did you dance?']},
                 'sections': sections, 'hw': hw})


def grandma():
    P, LID = 'pg9', 'pelageya-9'
    ids = Ids(P)
    cards = [('a village', 'a very small town in the country', 'деревня', 'Grandma lives in a village.', '🏡'), ('a sledge', 'you sit on it and go down a snowy hill', 'санки', 'We went down the hill on a sledge.', '🛷'),
             ('a snowman', '', 'снеговик', 'We made a big snowman.', '⛄'), ('a stove', 'a big oven to heat a house', 'печка', 'The stove was warm.', '🔥'),
             ('pancakes', '', 'блины', 'Grandma made pancakes.', '🥞'), ('a forest', 'a lot of trees', 'лес', 'We went for a walk in the forest.', '🌲'),
             ('a hill', 'a small mountain', 'холм, горка', 'a big snowy hill', '⛰️'), ('jam', 'sweet fruit for bread', 'варенье', 'pancakes with jam', '🍓'),
             ('a train', '', 'поезд', 'We took the train.', '🚆'), ('to get up', 'to leave your bed', 'вставать', 'I got up at eight.', '⏰')]
    story = [('f', 'Hi Tom! Last weekend I went to my grandma\'s village with Kate.'), ('m', 'How did you get there?'), ('f', 'We took the train on Saturday morning. It was very snowy!'),
             ('m', 'What did you do?'), ('f', 'We went down a big hill on a sledge and made a funny snowman. Then we had dinner by the warm stove.'),
             ('m', 'What did you eat?'), ('f', 'Grandma made pancakes. We ate them with jam and drank hot tea.'), ('m', 'Did you see any animals?'),
             ('f', 'Yes! On Sunday we went for a walk in the forest and saw a fox!'), ('m', 'Wow! When did you come back?'), ('f', 'On Sunday evening. I was tired, but very happy.')]
    letter = ['Dear Anna and Kate,', 'Thank you for your visit. The house is very quiet now! The cat sat on your bed all Monday — she misses you.',
              'Yesterday I saw your snowman again. It is still in the garden, but now it has got only one eye!', 'I made more jam for you. Come again soon! Love, Grandma']
    sections = [
        ('lead', 'Lead-in', "Grandma's village", '6 min',
         route([('🏡', 'the village'), ('⛄', 'winter words'), ('🎧', "Anna's weekend"), ('📘', 'went · saw · ate'), ('🧠', 'memory game'), ('💌', "Grandma's letter"), ('🗣️', 'your weekend')])
         + rubric('a', 'Look and remember: what can you do in a village in winter? Choose ✅ or ❌.', 'Что можно делать в деревне зимой?')
         + opinion(ids, ['go down a hill on a sledge', 'make a snowman', 'swim in the river', 'eat pancakes by the stove', 'walk in the forest', 'go to the cinema'], ['✅', '❌'])),
        ('words', 'Vocabulary', 'winter in the village', '8 min',
         vocab_section(ids, '2E', 'A winter weekend', cards,
                       [('🛷 →', 'a sledge', ['a sledge', 'a train', 'a stove'], ''), ('a lot of trees →', 'a forest', ['a forest', 'a hill', 'a village'], ''),
                        ('a very small town in the country →', 'a village', ['a village', 'a forest', 'a city'], ''), ('🥞 →', 'pancakes', ['pancakes', 'jam', 'bread'], '')],
                       [('We made a big', ['snowman'], '.'), ('Pancakes with', ['jam'], ', please!'), ('The', ['stove'], 'was warm.')])),
        ('listen', 'Listening', "Anna's weekend", '10 min',
         rubric('a', 'Anna tells Tom about her weekend. Did she like it?', 'Анне понравились выходные?')
         + listening(P + '-lis', story, 'Anna and Tom', 'Listen twice', '❄️', {'f': 'Anna', 'm': 'Tom'})
         + mc(P + '-g', 'Did Anna like the weekend?', ['Yes, she was very happy.', "No, she didn't."], 0)
         + rubric('b', 'Listen again. Answer the cards.', 'Послушайте ещё раз.')
         + deck('Details', [mc(P + '-q1', 'How did they get to the village?', ['by train', 'by car', 'by bus'], 0), mc(P + '-q2', 'What did they make?', ['a snowman', 'a cake', 'a house'], 0),
                            mc(P + '-q3', 'What did Grandma make?', ['pancakes', 'soup', 'pizza'], 0), mc(P + '-q4', 'What animal did they see?', ['a fox', 'a bear', 'a wolf'], 0)])),
        ('grammar', 'Grammar', 'went · saw · ate — Grammar Easy', '12 min',
         rubric('a', 'Read the steps. Press 🔊 and repeat.', 'Прочитайте шаги, слушайте и повторяйте.')
         + easy('go → went · see → saw · eat → ate',
                'Многие частые глаголы в прошлом <b>не берут -ed</b> — у них своя форма, её нужно запомнить: go → <b>went</b>, have → <b>had</b>, see → <b>saw</b>, eat → <b>ate</b>, make → <b>made</b>. '
                'А в отрицании и вопросе — снова обычная форма с <b>did</b>: I <b>didn\'t go</b>. <b>Did</b> you <b>see</b>…?',
                [[('We', 'a'), ('went', 'd'), ('to the village.', 'b')], [('We', 'a'), ('saw', 'd'), ('a fox!', 'b')], [('Did', 'd'), ('you', 'a'), ('see', 'c'), ('a fox?', 'b')]],
                [('🚆', 'We took the train.'), ('⛄', 'We made a funny snowman.'), ('🥞', 'We ate pancakes with jam.'), ('🦊', 'We saw a fox!')],
                [('We goed to the village.', 'We went to the village.', 'go → went.'), ('Did you saw a fox?', 'Did you see a fox?', 'После did — обычная форма.'), ('We eated pancakes.', 'We ate pancakes.', 'eat → ate.')],
                note='go → went · have → had · see → saw · eat → ate · make → made · take → took · drink → drank · come → came · get up → got up',
                choose=[('➕ Утверждение', 'особая форма: went, saw, ate'), ('➖ Отрицание', "didn't + go / see / eat"), ('❓ Вопрос', 'Did you + go / see / eat?')])
         + rubric('b', 'Write the past simple.', 'Напишите прошедшее время.')
         + ex_gaps(ids, [('We', ['went'], 'to the village.', 'go'), ('Grandma', ['made'], 'pancakes.', 'make'), ('We', ['ate'], 'them with jam.', 'eat'), ('We', ['drank'], 'hot tea.', 'drink'),
                         ('I', ['got'], 'up at eight.', 'get up'), ('We', ['saw'], 'a fox in the forest.', 'see')])),
        ('memory', 'Game', 'memory game', '6 min',
         rubric('a', 'Memory game! Find the past form. Try to do it without looking at the steps.', 'Игра на память: найдите форму прошедшего времени.')
         + ex_select(ids, [('go →', 'went', ['went', 'goed', 'gone'], ''), ('have →', 'had', ['had', 'haved', 'has'], ''), ('see →', 'saw', ['saw', 'seed', 'seen'], ''), ('take →', 'took', ['took', 'taked', 'take'], ''),
                           ('come →', 'came', ['came', 'comed', 'come'], ''), ('drink →', 'drank', ['drank', 'drinked', 'drunk'], '')])),
        ('read', 'Reading', "Grandma's letter", '7 min',
         rubric('a', "Read Grandma's letter after the visit.", 'Прочитайте письмо бабушки.')
         + reading("Grandma's letter", 'a letter · about 70 words', letter)
         + deck('True or false?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
             ('The cat sat on the bed on Monday.', True), ('The snowman has got two eyes now.', False), ('Grandma made more jam.', True)])])
         + rubric('b', 'Find the past forms in the letter.', 'Найдите формы прошедшего времени.')
         + ex_gaps(ids, [('The cat', ['sat'], 'on your bed.', 'sit'), ('Yesterday I', ['saw'], 'your snowman.', 'see'), ('I', ['made'], 'more jam for you.', 'make')])),
        ('wh', 'Grammar', 'Where did you go?', '7 min',
         rubric('a', 'Questions about the weekend: Where / What / When did…? Complete.', 'Вопросы: Where / What / When did…?')
         + ex_gaps(ids, [('Where', ['did'], 'Anna go?', ''), ('What did they', ['eat'], '?', 'eat'), ('When did they come', ['back'], '?', ''), ('What did they', ['see'], 'in the forest?', 'see')])
         + ex_order(ids, [(['did', 'Where', 'you', 'go?'], 'Where did you go?'), (['did', 'What', 'you', 'eat?'], 'What did you eat?')])),
        ('pron', 'Pronunciation', 'went · saw · ate', '4 min',
         rubric('a', 'Press 🔊 and repeat. Be careful: <i>went</i> is not <i>want</i>!', 'Нажмите 🔊 и повторите. went — не want!')
         + say_list([('We went to the village.', 'we <u>WENT</u> to the <u>VIL</u>lage.'), ('We saw a fox.', 'we <u>SAW</u> a <u>FOX</u>.'), ('We ate pancakes.', 'we <u>ATE</u> <u>PAN</u>cakes.')])
         + ex_listen_pick(ids, [('went', 'went', ['went', 'want']), ('saw', 'saw', ['saw', 'so'])])),
        ('speak', 'Speaking', 'your weekend', '8 min',
         rubric('a', 'Answer your teacher about last weekend. Then ask her the same questions!', 'Ответьте о прошлых выходных, потом спросите преподавателя.')
         + picker(['Where did you go last weekend?', 'What did you eat?', 'What did you see?', 'Did you go for a walk?', 'What time did you get up on Sunday?', 'Did you make anything?'])
         + phrases(['I went to…', 'I had / ate…', 'I saw…', 'I got up at…', "I didn't…"])),
        ('write', 'Writing', 'a postcard', '6 min',
         rubric('a', 'Write a postcard to Grandma about a weekend (yours or invented) — 4 sentences.', 'Открытка бабушке о выходных: 4 предложения.')
         + lines(ids, ['Dear Grandma, last weekend I went…', 'I saw…', 'I ate / drank…', 'Love, …']) + send_box()),
        ('check', 'Feedback', 'Can you…?', '3 min',
         selfcheck(ids, [('I can understand a story about a weekend', 'понять рассказ о выходных'), ('I can use went, had, saw, ate, made', 'использовать went, had, saw, ate, made'),
                         ('I can ask <i>Where did you go?</i>', 'спросить Where did you go?')])),
    ]
    hw = hw_pair(ids, [('⛄ →', 'a snowman', ['a snowman', 'a sledge', 'a hill'], ''), ('a big oven to heat a house →', 'a stove', ['a stove', 'a train', 'a forest'], ''), ('to leave your bed →', 'to get up', ['to get up', 'to go', 'to make'], '')],
                 [('went', 'went', ['went', 'want', 'wind']), ('saw', 'saw', ['saw', 'so', 'sore']), ('ate', 'ate', ['ate', 'eight o\'clock', 'eat'])],
                 [('We went down the hill on a', ['sledge'], '.'), ('We went for a walk in the', ['forest'], '.'), ('Grandma lives in a', ['village'], '.')],
                 'Write the past simple.', 'Напишите прошедшее время.', [('I', ['went'], 'to the shop.', 'go'), ('She', ['had'], 'breakfast at nine.', 'have'), ('We', ["didn't see", 'did not see'], 'the film.', '➖ see'),
                                                                        ('Where', ['did'], 'you go?', ''), ('They', ['came'], 'home late.', 'come')],
                 [('We goed to Grandma. →', ['We went to Grandma.', "We went to Grandma's."]), ('Did you saw it? →', ['Did you see it?']), ('I eated pancakes. →', ['I ate pancakes.'])],
                 [(['went', 'We', 'to the forest.'], 'We went to the forest.'), (['did', 'What', 'you', 'see?'], 'What did you see?')])
    return flex({'id': LID, 'prefix': P, 'owner': OWNER, 'code': '2E', 'title': "A Weekend at Grandma's", 'level': 'A1–A2', 'category': 'Winter & weekends', 'minutes': '60 min',
                 'grammar': 'Past simple: went, had, saw, ate · Where did you go? (Grammar Easy)', 'date': '2026-12-07',
                 'gvp': {'g': 'past simple irregular verbs; Where / What did you…?', 'v': 'a winter weekend in the village', 'p': 'went vs want'},
                 'eyebrow': 'IRIS SCHOOL · Пелагея · урок 2E', 'tags': ['A1–A2', 'Winter', 'went · saw · ate', '60 min'],
                 'lead': "Anna and Kate spent a snowy weekend at Grandma's: a sledge, a snowman, pancakes by the stove and a fox in the forest! "
                         "Learn the most useful irregular verbs: <i>We went… We saw… We ate…</i>",
                 'cards': cards, 'case': {'bad': [('We goed there.', 'We went there.'), ('Did you saw it?', 'Did you see it?'), ('We eated pancakes.', 'We ate pancakes.')],
                                          'ok': ['We went to the village.', 'We saw a fox!', 'Grandma made pancakes.', 'Where did you go?']},
                 'sections': sections, 'hw': hw})


def build():
    return [birthday(), grandma()]
