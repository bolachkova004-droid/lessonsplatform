"""Пелагея (A1–A2): ежедневная практика на 7 дней (повторение уроков 1A–2A) и следующий урок 2B."""
import datetime
from kit import *

OWNER = 'pelageya'
START = datetime.date(2026, 11, 14)
DAYS = [(START + datetime.timedelta(days=i)).isoformat() for i in range(7)]
P = 'pgd'

# день: заголовок, emoji, тема, реплики, вопрос (q, opts, ok), слова-выбор, грамматика-пропуски, строка для письма
PLAN = [
    ('My town', '🏙️', 'город: there is / there are', [('f', 'Hi! This is my town. There is a big park and there are two cafés.'), ('f', "There isn't a cinema, but there is a library next to the school.")],
     ('Is there a cinema?', ["Yes, there is.", "No, there isn't."], 1),
     [('a place with books →', 'a library', ['a library', 'a park', 'a café'], ''), ('a place with trees →', 'a park', ['a bank', 'a park', 'a shop'], '')],
     [('There', ['is'], 'a bank in my street.', 'is / are'), ('There', ['are'], 'three shops near my house.', 'is / are'), ('Is', ['there'], 'a cinema here?', ''), ("There", ["aren't", 'are not'], 'any museums.', '➖ are')],
     'In my town there is…'),
    ('Where is it?', '🗺️', 'где это: предлоги', [('m', "Excuse me, where's the bank?"), ('f', "It's next to the supermarket, opposite the park."), ('m', 'Thank you!')],
     ('Where is the bank?', ['next to the supermarket', 'behind the school', 'in the park'], 0),
     [('рядом с →', 'next to', ['next to', 'opposite', 'between'], ''), ('напротив →', 'opposite', ['behind', 'opposite', 'next to'], ''), ('между →', 'between', ['between', 'in front of', 'next to'], '')],
     [("The café is", ['between'], 'the bank and the shop.', 'между'), ("The cat is", ['behind'], 'the sofa.', 'за'), ("Go", ['straight'], 'on and turn left.', 'прямо'), ("Is there a park", ['near'], 'here?', 'рядом')],
     'My house is next to…'),
    ('Have got & can', '💪', 'have got и can', [('f', "I've got a sister. She's got a cat."), ('f', "My sister can swim, but she can't ride a bike. I can play the guitar!")],
     ("Can the sister ride a bike?", ['Yes, she can.', "No, she can't."], 1),
     [('I ___ a dog. →', "'ve got", ["'ve got", "'s got", 'can'], ''), ('She ___ swim. →', 'can', ['can', 'has', 'is'], '')],
     [('She', ['has got', "'s got"], 'two brothers.', 'have got'), ('I', ["can't", 'cannot'], 'cook, but I can make tea.', '➖ can'), ('', ['Have'], 'you got a pet?', '❓'), ('', ['Can'], 'you play the piano?', '❓')],
     "I've got… I can…"),
    ("Anna's day", '⏰', 'распорядок дня: present simple', [('f', "Anna gets up at seven. She has breakfast and goes to work at eight."), ('f', "She doesn't work on Saturdays. In the evening she watches TV.")],
     ('What does Anna do in the evening?', ['She watches TV.', 'She goes to work.', 'She has breakfast.'], 0),
     [('to start the day →', 'get up', ['get up', 'go to bed', 'have lunch'], ''), ('to eat in the morning →', 'have breakfast', ['have dinner', 'have breakfast', 'watch TV'], '')],
     [('Anna', ['gets'], 'up at seven.', 'get'), ('She', ['goes'], 'to work at eight.', 'go'), ('She', ["doesn't work", 'does not work'], 'on Saturdays.', '➖ work'), ('I', ['watch'], 'TV in the evening.', 'watch')],
     'I get up at…'),
    ('How often?', '📆', 'always / usually / never + like / love / hate -ing', [('m', "I always play football on Sunday. I love playing football!"), ('m', "I never go swimming — I hate swimming. I usually read in the evening.")],
     ('What does he hate?', ['swimming', 'football', 'reading'], 0),
     [('100% →', 'always', ['always', 'usually', 'never'], ''), ('0% →', 'never', ['sometimes', 'never', 'usually'], '')],
     [('I love', ['reading'], 'books.', 'read'), ('She', ['never'], 'eats meat.', 'никогда'), ('We', ['usually'], 'go to the park on Sundays.', 'обычно'), ('He hates', ['getting'], 'up early.', 'get')],
     'I love…, but I hate…'),
    ('Question day', '❓', 'вопросы Do / Does', [('f', 'Do you like coffee?'), ('m', "Yes, I do. Does your brother like coffee?"), ('f', "No, he doesn't. He likes tea.")],
     ('Does her brother like coffee?', ["Yes, he does.", "No, he doesn't."], 1),
     [('___ you like tea? →', 'Do', ['Do', 'Does', 'Are'], ''), ('___ she work here? →', 'Does', ['Do', 'Does', 'Is'], '')],
     [('', ['Do'], 'you live in a big city?', '❓'), ('', ['Does'], 'Tom play tennis?', '❓'), ('Where', ['does'], 'Anna work?', 'do / does'), ('Yes, I', ['do'], '.', 'короткий ответ')],
     'A question for my teacher: Do you…?'),
    ('My week', '🏆', 'финал: всё вместе', [('f', "Hi! I'm Kate. I live in a small town. There's a lovely park next to my house."), ('f', "I've got a dog, Max. I usually walk with him in the morning. I love walking! On Saturdays I don't work, so I go to the café with my friends.")],
     ('Where is the park?', ['next to Kate\'s house', 'opposite the café', 'behind the school'], 0),
     [('собака →', 'a dog', ['a dog', 'a cat', 'a horse'], ''), ('друзья →', 'friends', ['friends', 'family', 'neighbours'], '')],
     [('Kate', ['lives'], 'in a small town.', 'live'), ("She", ["'s got", 'has got'], 'a dog.', 'have got'), ('She', ['usually'], 'walks with him in the morning.', 'обычно'), ("She", ["doesn't work", 'does not work'], 'on Saturdays.', '➖ work')],
     'My week: …'),
]


def daily():
    secs = []
    plan = ''.join('<li><b>Day %d · %s</b> — %s</li>' % (i + 1, t, topic) for i, (t, _, topic, *_r) in enumerate(PLAN))
    start = ('<div class="challenge-hero">%s<div><b>7 days · 15 minutes a day</b><span>Каждый день новое задание — повторяем всё, что прошли</span></div></div>' % img('📅', 'challenge-pic')
             + task([('Every day at midnight a new task opens here. 15 minutes a day!', 'Каждый день в полночь открывается новое задание на 15 минут.'),
                     ('We review everything from our lessons: town, directions, have got, can, my day, how often.', 'Повторяем всё из уроков: город, дорога, have got, can, мой день, how often.'),
                     ('At the end of each day press «Отправить преподавателю».', 'В конце дня — «Отправить преподавателю».'),
                     ('Your main lessons stay as they are — this is extra practice.', 'Основные уроки остаются как были — это дополнительная практика.')])
             + '<div class="box"><b>The plan · План</b><ol class="items">%s</ol></div>' % plan)
    secs.append((P + '-hw-prep', 'Start here', section(P + '-hw-prep', 'Start here', '7 Days of English', '2 min', start)))
    for i, (title, em, topic, lis, q, words, grams, write) in enumerate(PLAN):
        n = i + 1
        ids = Ids('%s-d%d' % (P, n))
        body = intro(em, 'Day %d of 7 · %s' % (n, title), '15 min', 'Сегодня: %s.' % topic)
        names = {'f': 'Kate' if n == 7 else 'Anna', 'm': 'Tom'}
        body += rubric('a', 'Listen. Answer the question.', 'Послушайте и ответьте.') + listening('%s-d%d-lis' % (P, n), lis, title, 'Listen twice · Слушайте два раза', em, names)
        body += mc('%s-d%d-q' % (P, n), q[0], q[1], q[2])
        body += rubric('b', 'Words: choose.', 'Слова: выберите.') + ex_select(ids, words)
        body += rubric('c', 'Grammar: complete the sentences.', 'Грамматика: вставьте слово.') + ex_gaps(ids, grams)
        body += rubric('d', 'Write one or two sentences about you.', 'Напишите одно-два предложения о себе.') + lines(ids, [write, '…'])
        body += rubric('e', 'Done? Press «Отправить преподавателю». See you tomorrow! 👋', 'Готово? Отправьте ответы. До завтра!') + send_box()
        sid = '%s-hw-day%d' % (P, n)
        lab = 'Day %d · %s' % (n, title)
        secs.append((sid, lab, section(sid, lab, title + ' ' + em, '15 min', body, lock=(DAYS[i], n))))
    meta = {'id': 'pelageya-daily', 'owner': OWNER, 'title': '7 Days of English', 'level': 'A1–A2', 'category': 'Daily practice', 'minutes': '7 × 15 min',
            'grammar': 'Review: there is · prepositions · have got · can · present simple · how often', 'date': '2026-11-13', 'code': 'D7',
            'hwSection': P + '-hw-prep', 'hwSince': '2026-11-13T06:00:00Z', 'draft': False, 'kind': 'homework', 'hwTag': 'КАЖДЫЙ ДЕНЬ · 7 ДНЕЙ',
            'daily': {'days': DAYS},
            'gvp': {'g': 'review of lessons 1A–2A', 'v': 'town, directions, family, daily routine, free time', 'p': ''}}
    d, h = lesson(meta, {}, secs, 'IRIS SCHOOL · Пелагея · каждый день', 'A new task every day for a week — 15 minutes. We review everything from our lessons: my town, where is it?, have got and can, Anna\'s day, how often — and on day 7, everything together! 🏆', ['A1–A2', 'Every day', '7 × 15 min'])
    return d, h, {}


def lesson_2b():
    S = {
        'id': 'pelageya-6', 'prefix': 'pg6', 'owner': OWNER, 'code': '2B', 'title': 'A Video Call from the Beach', 'level': 'A1–A2', 'category': 'Holidays',
        'minutes': '60 min', 'grammar': 'present continuous ➕ ➖ ❓ · Listening · Grammar Easy', 'date': '2026-11-16',
        'gvp': {'g': 'present continuous: I\'m sitting / she\'s swimming; isn\'t / aren\'t; Are you…? (Grammar Easy)', 'v': 'on holiday: beach actions', 'p': '-ing /ɪŋ/'},
        'eyebrow': 'IRIS SCHOOL · Пелагея · урок 2B', 'tags': ['A1–A2', 'Holidays', 'present continuous', '60 min'],
        'lead': 'Anna is on holiday in Spain and calls Tom on video: <i>I\'m sitting on the beach, my brother is swimming!</i> What are they doing right now? Holiday words and the grammar of <b>now</b> — the easy way, with Russian hints.',
        'aims': ['understand a video call from the beach', 'use 10 holiday words', 'say what people are doing <b>now</b>: <i>I\'m swimming</i>'],
        'listen': {'title': "Anna's video call", 'task': 'Anna calls Tom from her holiday. Listen once: where is she?', 'task_ru': 'Анна звонит Тому из отпуска. Где она?',
                   'head': 'A video call from Spain', 'names': {'f': 'Anna', 'm': 'Tom'}, 'emoji': '📱',
                   'lines': [('m', 'Hi, Anna! Where are you?'), ('f', "Hi, Tom! I'm in Spain! I'm sitting on the beach right now."), ('m', 'Wow! What are you doing?'),
                             ('f', "I'm eating an ice cream and I'm talking to you! The sun is shining and it's very hot."), ('m', 'Where is your brother?'),
                             ('f', "He's swimming in the sea. And my parents are walking on the beach. They're taking photos."), ('m', 'Lucky you! I\'m sitting at work. It\'s raining here!')],
                   'gist': ('Where is Anna?', ['on the beach in Spain', 'at work', 'in a café at home'], 0),
                   'details': [('What is Anna eating?', ['an ice cream', 'a pizza', 'a sandwich'], 0), ('What is her brother doing?', ['sleeping', 'swimming', 'reading'], 1),
                               ('What are her parents doing?', ['swimming', 'walking and taking photos', 'eating'], 1), ('What is the weather like where Tom is?', ['sunny', 'hot', 'rainy'], 2)]},
        'vocab': {'title': 'On holiday', 'theme': 'On holiday', 'cards': [
            ('swim', '', 'плавать', 'He\'s swimming in the sea.', '🏊'), ('sunbathe', '', 'загорать', 'I\'m sunbathing on the beach.', '☀️'),
            ('take photos', '', 'фотографировать', 'They\'re taking photos.', '📸'), ('eat an ice cream', '', 'есть мороженое', 'I\'m eating an ice cream.', '🍦'),
            ('walk on the beach', '', 'гулять по пляжу', 'We\'re walking on the beach.', '🏖️'), ('buy souvenirs', '', 'покупать сувениры', 'Mum is buying souvenirs.', '🛒'),
            ('wear sunglasses', '', 'носить солнечные очки', 'I\'m wearing sunglasses.', '😎'), ('the sea', '', 'море', 'The sea is warm.', '🌊'),
            ('a hotel', '', 'отель', 'Our hotel is next to the beach.', '🏨'), ('a suitcase', '', 'чемодан', 'My suitcase is very big!', '🧳')],
            'match': [('to lie in the sun →', 'sunbathe', ['sunbathe', 'swim', 'buy'], ''), ('a big bag for a trip →', 'a suitcase', ['a hotel', 'a suitcase', 'the sea'], ''),
                      ('to make pictures with a phone →', 'take photos', ['take photos', 'wear', 'walk'], ''), ('a place to sleep on holiday →', 'a hotel', ['a hotel', 'a beach', 'a shop'], '')],
            'gaps': [('My mum is buying', ['souvenirs'], 'for our friends.'), ('The', ['sea'], 'is blue and warm.'), ("I'm wearing", ['sunglasses'], "— it's very sunny!")]},
        'grammar': {'title': 'present continuous — Grammar Easy', 'head': 'present continuous ➕ I\'m sitting · she\'s swimming',
                    'idea': 'Что происходит <b>прямо сейчас</b> (now, right now, look!) → <b>am / is / are + глагол-ing</b>. I <b>am</b> (I\'m) · he / she / it <b>is</b> (she\'s) · we / you / they <b>are</b> (they\'re).',
                    'rows': [[("I'm", 'a'), ('sitting', 'd'), ('on the beach', 'b'), ('right now.', 'c')], [("She's", 'a'), ('swimming', 'd'), ('in the sea.', 'b')], [("They're", 'a'), ('taking', 'd'), ('photos.', 'b')]],
                    'note': '-ing: eat → eat<b>ing</b> · take → tak<b>ing</b> (e убираем) · swim → swim<b>ming</b>, sit → sit<b>ting</b> (буква удваивается)',
                    'examples': [('🏖️', "I'm sitting on the beach."), ('🏊', "He's swimming in the sea."), ('📸', "They're taking photos."), ('☀️', 'The sun is shining.')],
                    'traps': [("I sitting on the beach.", "I'm sitting on the beach.", 'Нужен am / is / are.'), ("She's swim.", "She's swimming.", 'Нужно -ing.'), ("They is walking.", "They're walking.", 'they → are.')],
                    'ex1': ('Write am, is or are + -ing.', 'Напишите am / is / are + -ing.', [
                        ('I', ["'m eating", 'am eating'], 'an ice cream.', 'eat'), ('My brother', ["'s swimming", 'is swimming'], 'in the sea.', 'swim'),
                        ('My parents', ["'re walking", 'are walking'], 'on the beach.', 'walk'), ('Mum', ["'s buying", 'is buying'], 'souvenirs.', 'buy'), ('The sun', ["'s shining", 'is shining'], '.', 'shine')]),
                    'ex2': ('Put the words in order.', 'Соберите предложения.', [(["I'm", 'sunglasses.', 'wearing'], "I'm wearing sunglasses."), (["We're", 'on the beach.', 'walking'], "We're walking on the beach."), (['is', 'taking', 'Dad', 'photos.'], 'Dad is taking photos.')])},
        'part2': {'key': 'listen2', 'label': 'Listening', 'title': 'What are they doing?', 'task': 'Tom calls Anna again in the evening. Listen. True or false?', 'task_ru': 'Вечером Том звонит Анне ещё раз. Верно или нет?',
                  'head': 'The evening call', 'names': {'f': 'Anna', 'm': 'Tom'}, 'emoji': '🌙',
                  'lines': [('m', 'Hi again! Are you sunbathing?'), ('f', "No, I'm not. It's evening! We're having dinner in a café."), ('m', 'Is your brother swimming?'),
                            ('f', "No, he isn't. He's playing games on his phone. And Mum and Dad are dancing!"), ('m', 'Ha-ha! Have a great evening!')],
                  'tf': [('Anna is sunbathing.', False), ('They are having dinner in a café.', True), ('Her brother is swimming.', False), ("Anna's parents are dancing.", True)],
                  'gaps': ('➖ and ❓: complete.', 'Отрицание и вопрос: вставьте.', [("I'm", ['not'], 'sunbathing.', '➖'), ('He', ["isn't", 'is not'], 'swimming.', '➖'), ('', ['Are'], 'you having dinner?', '❓'), ('', ['Is'], 'your brother playing?', '❓')])},
        'mix': {'title': "Anna's postcard", 'task': 'Anna writes a postcard but makes mistakes. Correct them.', 'task_ru': 'Анна пишет открытку с ошибками. Исправьте.',
                'items': [('I sitting in a café. →', ["I'm sitting in a café.", 'I am sitting in a café.']), ('My brother is swim in the sea. →', ['My brother is swimming in the sea.']),
                          ('My parents is walking. →', ['My parents are walking.']), ('The sun shining. →', ['The sun is shining.', "The sun's shining."])]},
        'pron': {'title': '-ing /ɪŋ/', 'task': '-ing sounds /ɪŋ/ — not «инг»! Press 🔊 and repeat.', 'task_ru': '-ing звучит /ɪŋ/ — носом, без «г» на конце.',
                 'list': [('swimming', '<b>swimming</b> /ɪŋ/'), ('sitting', '<b>sitting</b>'), ('taking photos', '<b>taking</b> photos'), ('shining', '<b>shining</b>'), ("I'm eating an ice cream.", "I'm <b>eating</b> an ice cream.")]},
        'speaking': {'title': 'what are they doing?', 'questions': ['What are you doing right now?', 'What is your family doing now?', 'What do you usually do on holiday?', 'Do you like the sea or the mountains?', 'What are you wearing today?', 'Do you take photos on holiday?'],
                     'phrases': ["I'm sitting…", "I'm wearing…", "My mum is…", 'Right now…'],
                     'task': 'Video call game! Imagine you are on holiday. Your teacher calls you. Say three things you are doing now.', 'phrases2': ["Hi! I'm in…", "Right now I'm…", "My … is …-ing.", 'The sun is shining!']},
        'writing': {'title': 'a holiday message', 'task': "Write a message from your dream holiday. What are you and your family doing? Five sentences.", 'task_ru': 'Напишите сообщение из отпуска мечты: что вы и ваша семья делаете сейчас? Пять предложений.',
                    'example': "Hi! I'm in Italy. I'm sitting in a café next to the sea. I'm eating a pizza. My sister is buying souvenirs. The sun is shining!",
                    'placeholders': ["Hi! I'm in…", "I'm …-ing…", 'My … is …', 'The sun…', '…']},
        'cans': [('I can understand a video call from holiday', 'понять видеозвонок из отпуска'), ('I can use 10 holiday words', 'использовать 10 слов про отпуск'),
                 ("I can say what is happening now: <i>I'm swimming</i>", 'рассказать, что происходит сейчас'), ("I can say ➖ and ask ❓: <i>He isn't… Are you…?</i>", 'отрицание и вопрос')],
        'hw': {'words_select': [('to lie in the sun →', 'sunbathe', ['sunbathe', 'swim', 'walk'], ''), ('a place to sleep on holiday →', 'a hotel', ['a hotel', 'a suitcase', 'the sea'], ''), ('to wear on your eyes in the sun →', 'sunglasses', ['sunglasses', 'souvenirs', 'photos'], '')],
               'listen': [('take photos', 'take photos', ['take photos', 'buy souvenirs', 'swim']), ('a suitcase', 'a suitcase', ['a hotel', 'a suitcase', 'the sea']), ("She's swimming.", "She's swimming.", ["She's swimming.", "She's sitting.", "She's shopping."])],
               'words_gaps': [("I'm eating an ice", ['cream'], '.'), ('We are walking on the', ['beach'], '.'), ('Mum is buying', ['souvenirs'], '.')],
               'gaps': ('Complete with am / is / are + -ing.', 'Вставьте am / is / are + -ing.', [('Look! The children', ["'re playing", 'are playing'], 'in the sea.', 'play'), ('I', ["'m wearing", 'am wearing'], 'a hat.', 'wear'),
                                                                                                        ('Dad', ["isn't sleeping", 'is not sleeping'], '— he is reading.', '➖ sleep'), ('', ['Are'], 'you swimming?', '❓'), ('What', ['is'], 'she doing?', '❓')]),
               'fix': [('She are swimming. →', ["She's swimming.", 'She is swimming.']), ('I am eat a sandwich. →', ["I'm eating a sandwich.", 'I am eating a sandwich.']), ('They playing football. →', ["They're playing football.", 'They are playing football.'])],
               'order': [(['are', 'What', 'doing?', 'you'], 'What are you doing?'), (["isn't", 'He', 'sleeping.'], "He isn't sleeping.")]},
        'case': {'bad': [('I sitting on the beach.', "I'm sitting on the beach."), ('She swiming.', "She's swimming."), ('They is walking.', "They're walking."), ('Are he sleeping?', 'Is he sleeping?')],
                 'ok': ["I'm sitting on the beach.", "She's swimming.", "They're walking.", 'Is he sleeping?', "I'm eating an ice cream.", 'The sun is shining.']},
        'quote': ('Travel is the only thing you buy that makes you richer.', 'Anonymous'),
    }
    return std(S)


def build():
    return [daily(), lesson_2b()]
