"""Пелагея (A1–A2): «Gym: A Weekend by the Sea» — ещё одна домашка, упор на аудирование и чтение.
Только пройденное (1A–2A): there is / there are, предлоги места, have got, can, present simple, always / never,
love / like + -ing. Открыта сразу."""
from kit import *

OWNER, LID, P = 'pelageya', 'pelageya-gym-sea', 'pgs'

CARDS = [
    ('the sea', '', 'море', 'Our hotel is next to the sea.', '🌊'),
    ('a beach', '', 'пляж', 'There is a big beach.', '🏖️'),
    ('a hotel', '', 'гостиница', 'The hotel has got a pool.', '🏨'),
    ('a bridge', '', 'мост', 'There is an old bridge.', '🌉'),
    ('ice cream', '', 'мороженое', 'I love eating ice cream!', '🍦'),
    ('a boat', '', 'лодка', 'We can go on a boat.', '⛵'),
    ('a shell', '', 'ракушка', 'Kate likes looking for shells.', '🐚'),
    ('sunny', '', 'солнечный', "It's sunny today.", '☀️'),
]

CALL = [
    ('m', 'Hi, Anna! Where are you?'),
    ('f', "Hi, Tom! I'm by the sea with Kate. It's lovely here!"),
    ('m', 'Is your hotel nice?'),
    ('f', "Yes, it is. It's next to the beach, and there's a café opposite the hotel. There isn't a pool, but we can swim in the sea."),
    ('m', 'What do you do every day?'),
    ('f', 'We always have breakfast at nine. Then we usually go to the beach. Kate loves looking for shells.'),
    ('m', 'And in the evening?'),
    ('f', "We sometimes go on a boat. I never eat fish, but I love eating ice cream!"),
    ('m', 'Have a great time! See you on Sunday.'),
]

POSTCARD = [
    'Dear Tom,',
    "Greetings from the sea! The weather is sunny and warm. Our hotel is small, but it's got a big garden. There are two cafés near the hotel and a little shop between them.",
    "Kate can swim very well — she swims every morning. I can't swim, so I usually walk on the beach. I love walking by the sea!",
    "There's an old bridge in the town. We often go there in the evening. Kate has got a new camera and she takes a lot of photos.",
    'See you soon! Love, Anna',
]


def build():
    secs = []
    ids = Ids(P)

    def add(key, label, title, mins, body):
        sid = '%s-hw-%s' % (P, key)
        secs.append((sid, label, section(sid, label, title, mins, body)))

    add('prep', 'Start here', 'A Weekend by the Sea', '6 min',
        task([('Anna and Kate are on holiday by the sea. Listen, read and write!', 'Анна и Кейт отдыхают на море. Слушаем, читаем и пишем.'),
              ('Only what we have done: there is / are, next to / opposite, have got, can, always / never, I love …-ing.', 'Только пройденное.'),
              ('Five short parts. At the end press «Отправить преподавателю».', 'Пять коротких частей. В конце — «Отправить преподавателю».')])
        + rubric('a', 'New words: tap the cards, press 🔊 and repeat.', 'Новые слова: нажимайте на карточки, слушайте и повторяйте.') + bank('SEA', 'By the sea', CARDS)
        + rubric('b', 'Which word is it?', 'Какое это слово?')
        + ex_pic(ids, [('🏖️', 'a beach', ['a beach', 'a bridge', 'a boat']),
                       ('🍦', 'ice cream', ['a shell', 'ice cream', 'the sea']),
                       ('⛵', 'a boat', ['a hotel', 'a boat', 'a beach']),
                       ('🐚', 'a shell', ['a shell', 'sunny', 'a bridge'])]))

    add('listen', 'Listening', 'Anna calls Tom', '7 min',
        rubric('a', 'Listen. Where is Anna?', 'Послушайте. Где Анна?')
        + listening(P + '-lis', CALL, 'Anna calls Tom', 'Listen twice · Слушайте два раза · 🐢 — медленнее', '📞', {'f': 'Anna', 'm': 'Tom'})
        + mc(P + '-q0', 'Where is Anna?', ['in the mountains', 'by the sea', 'at home'], 1)
        + rubric('b', 'Listen again. Answer the cards.', 'Послушайте ещё раз и ответьте.')
        + deck('Anna calls Tom · Детали', [
            mc(P + '-q1', 'Where is the hotel?', ['next to the beach', 'behind the station', 'in the park'], 0),
            mc(P + '-q2', 'Is there a pool?', ['Yes, there is.', "No, there isn't."], 1),
            mc(P + '-q3', 'What time do they have breakfast?', ['at eight', 'at nine', 'at ten'], 1),
            mc(P + '-q4', 'What does Kate love?', ['looking for shells', 'eating fish', 'swimming in a pool'], 0),
            mc(P + '-q5', 'What does Anna never eat?', ['ice cream', 'fish', 'cake'], 1)]))

    add('read', 'Reading', "Anna's postcard", '7 min',
        rubric('a', "Read Anna's postcard to Tom.", 'Прочитайте открытку Анны.')
        + reading('A postcard from the sea', 'about 100 words', POSTCARD)
        + rubric('b', 'True or false?', 'Верно или нет?')
        + deck('True or false? · Верно или нет?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
            ("It's cold and rainy.", False), ("The hotel has got a big garden.", True), ('There is a shop between the cafés.', True),
            ('Anna can swim very well.', False), ('Kate has got a new camera.', True)])])
        + rubric('c', 'Find the words in the postcard.', 'Найдите слова в открытке.')
        + ex_gaps(ids, [('Kate', ['swims'], 'every morning.', 'swim'),
                        ('I', ["can't", 'cannot'], 'swim.', '➖ can'),
                        ('I love', ['walking'], 'by the sea!', 'walk'),
                        ("There's an old", ['bridge'], 'in the town.', 'мост')]))

    add('grammar', 'Grammar', 'everything together', '7 min',
        rubric('a', 'Choose.', 'Выберите.')
        + ex_select(ids, [('There', 'are', ['is', 'are'], 'two cafés near the hotel.'),
                          ('The café is', 'opposite', ['opposite', 'on', 'at'], 'the hotel.'),
                          ('Kate', 'has got', ['have got', 'has got'], 'a new camera.'),
                          ('', 'Can', ['Can', 'Do', 'Is'], 'you swim?'),
                          ('Anna', 'never', ['never', "doesn't", 'not'], 'eats fish.'),
                          ('Kate loves', 'looking', ['look', 'looking', 'looks'], 'for shells.')])
        + rubric('b', 'Put the words in order.', 'Соберите предложения.')
        + ex_order(ids, [(['always', 'We', 'have breakfast', 'at nine'], 'We always have breakfast at nine'),
                         (['next to', 'The hotel', 'is', 'the beach'], 'The hotel is next to the beach'),
                         (['ice cream', 'I love', 'eating'], 'I love eating ice cream')])
        + rubric('c', 'One mistake in each sentence. Write the correct sentence.', 'Одна ошибка в каждом предложении. Напишите правильно.')
        + ex_lines(ids, [('There is two cafés. → ', ['There are two cafés.', 'There are two cafes.']),
                         ('Kate have got a camera. → ', ['Kate has got a camera.', "Kate's got a camera."]),
                         ('I can to swim. → ', ['I can swim.']),
                         ('We go always to the beach. → ', ['We always go to the beach.'])]))

    add('challenge', 'Writing', 'My postcard', '6 min',
        rubric('a', 'Write a postcard to Anna about your town or a holiday: 4–5 sentences.', 'Напишите Анне открытку о своём городе или отдыхе: 4–5 предложений.')
        + box('<b>Example:</b> Dear Anna, I\'m in Kazan. There is a big river and there are a lot of cafés. I usually walk in the park. I love eating chak-chak! Love, …', '📮')
        + lines(ids, ['Dear Anna, I\'m in…', 'There is / There are…', 'I usually / always…', 'I can… / I love …-ing', 'Love, …'])
        + rubric('b', 'Done? Press «Отправить преподавателю». Great job! 🌟', 'Готово? Нажмите «Отправить преподавателю». Отлично!') + send_box())

    gid = LID + '-games'
    secs.append((gid, 'Games', section(gid, 'Games', 'Play and review', '10 min', games_block(LID, [(w, r) for w, _, r, _, _ in CARDS], {
        'bad': [('There is two cafés.', 'There are two cafés.'), ('I can to swim.', 'I can swim.'), ('She have got a camera.', 'She has got a camera.')],
        'ok': ['The hotel is next to the beach.', 'I love eating ice cream.', 'We always have breakfast at nine.']}))))

    meta = {'id': LID, 'owner': OWNER, 'title': 'Gym: A Weekend by the Sea', 'level': 'A1–A2', 'category': 'Homework', 'minutes': '30–35 min',
            'description': "Anna's holiday by the sea: a phone call, a postcard, new words and everything we have done — there is, prepositions, have got, can, always / never, love + -ing.",
            'grammar': 'Review 1A–2A: there is · prepositions · have got · can · present simple · love + -ing', 'date': '2026-11-18', 'code': 'HW',
            'hwSection': P + '-hw-prep', 'hwSince': '2026-11-18T06:00:00Z', 'draft': False, 'kind': 'homework', 'hwTag': 'ПОВТОРЕНИЕ · СЛУШАЕМ И ЧИТАЕМ',
            'gvp': {'g': 'review of 1A–2A', 'v': 'by the sea, holidays', 'p': ''}}
    d, h = lesson(meta, {}, secs, 'IRIS SCHOOL · Пелагея · домашка',
                  "Anna and Kate are on holiday by the sea! Listen to Anna's call, read her postcard and write your own. 🌊",
                  ['A1–A2', 'Homework', '30–35 min'])
    return [(d, h, vocab_of(CARDS))]
