"""Пелагея (A1–A2): дополнительная домашка «Gym 2A: Tom's Busy Week» — повторение урока 2A
(свободное время, always / usually / never, love / like / hate + -ing) и всего, что было раньше.
Открыта сразу, без расписания; ежедневные «7 Days of English» идут параллельно."""
from kit import *

OWNER, LID, P = 'pelageya', 'pelageya-gym2a', 'pgy'

CARDS = [
    ('go swimming', 'swim in a pool or the sea', 'ходить плавать', 'I go swimming on Saturdays.', '🏊'),
    ('play tennis', 'a game with a ball and rackets', 'играть в теннис', 'Anna plays tennis with Kate.', '🎾'),
    ('read books', '', 'читать книги', 'I love reading books in bed.', '📚'),
    ('watch films', '', 'смотреть фильмы', 'We usually watch films on Friday.', '🎬'),
    ('cook', 'make food', 'готовить', 'Tom likes cooking pasta.', '🍳'),
    ('ride a bike', '', 'кататься на велосипеде', 'Can you ride a bike?', '🚲'),
    ('go shopping', '', 'ходить по магазинам', 'Kate hates going shopping.', '🛍️'),
    ('listen to music', '', 'слушать музыку', 'I always listen to music on the bus.', '🎧'),
]

LISTEN = [
    ('f', 'Hi, Tom! What do you usually do at the weekend?'),
    ('m', 'On Saturday I always go swimming in the morning. Then I usually play tennis with my brother.'),
    ('f', 'Do you like cooking?'),
    ('m', "Yes, I love cooking! I often cook pasta on Sunday. But I never go shopping — I hate it!"),
    ('f', "Me too! I don't like shopping. I love reading. I read every evening."),
    ('m', "Can you ride a bike? Let's go to the park on Sunday!"),
    ('f', 'Yes, I can. Great idea!'),
]

TEXT = [
    "Hi Anna! This is my week. I work from Monday to Friday. I get up at seven and I always have coffee for breakfast.",
    "On Tuesday and Thursday I go to the gym after work. I don't like running, but I love swimming.",
    "My sister Kate lives near me. She's got a little dog, Bobby. We sometimes walk with him in the park. There's a nice café next to the park.",
    "On Friday evening we usually watch a film at home. Kate never watches horror films — she hates them! See you soon, Tom",
]


def build():
    secs = []
    ids = Ids(P)

    def add(key, label, title, mins, body):
        sid = '%s-hw-%s' % (P, key)
        secs.append((sid, label, section(sid, label, title, mins, body)))

    add('prep', 'Start here', "Tom's Busy Week", '8 min',
        task([('Six short parts: words, listening, reading, grammar, mistakes, writing. Do one or two parts a day.', 'Шесть коротких частей. Можно делать по одной-две в день.'),
              ('Everything is from our lessons — no new grammar!', 'Всё из наших уроков — новой грамматики нет.'),
              ('At the end press «Отправить преподавателю».', 'В конце — «Отправить преподавателю».')])
        + rubric('a', 'Remember the rule. Press 🔊 and repeat.', 'Вспомните правило. Нажмите 🔊 и повторите.')
        + easy('always · usually · never + I love swimming',
               'Как часто? Слово <b>always / usually / sometimes / never</b> стоит <b>перед</b> глаголом: I <b>always</b> go… '
               'А после <b>love / like / hate</b> глагол получает <b>-ing</b>: I love <b>swimming</b>.',
               [[('I', 'a'), ('always', 'c'), ('go', 'd'), ('swimming.', 'b')],
                [('Tom', 'a'), ('never', 'c'), ('goes', 'd'), ('shopping.', 'b')],
                [('I', 'a'), ('love', 'd'), ('reading', 'c'), ('books.', 'b')]],
               [('🏊', 'I always go swimming on Saturday.'), ('🛍️', 'Tom never goes shopping.'), ('📚', 'I love reading books.'), ('🍳', 'Tom likes cooking pasta.')],
               [('I go always swimming.', 'I always go swimming.', 'always — перед глаголом.'),
                ('I love read.', 'I love reading.', 'После love / like / hate — глагол с -ing.'),
                ('Tom never go shopping.', 'Tom never goes shopping.', 'he / she → -s.')],
               note='100% always → usually → sometimes → never 0%',
               choose=[('Всегда', 'always'), ('Обычно', 'usually'), ('Иногда', 'sometimes'), ('Никогда', 'never')])
        + rubric('b', 'Words: tap the cards, press 🔊 and repeat.', 'Слова: нажимайте на карточки, слушайте и повторяйте.') + bank('2A', 'Free time', CARDS)
        + rubric('c', 'Which word is it?', 'Какое это слово?')
        + ex_pic(ids, [('🏊', 'go swimming', ['go swimming', 'go shopping', 'cook']),
                       ('🎾', 'play tennis', ['ride a bike', 'play tennis', 'read books']),
                       ('🎧', 'listen to music', ['watch films', 'listen to music', 'cook']),
                       ('🚲', 'ride a bike', ['ride a bike', 'go swimming', 'play tennis'])]))

    add('listen', 'Listening', 'Anna and Tom: the weekend', '6 min',
        rubric('a', 'Listen to Anna and Tom. What do they want to do on Sunday?', 'Послушайте. Что они хотят сделать в воскресенье?')
        + listening(P + '-lis', LISTEN, 'Anna and Tom', 'Listen twice · Слушайте два раза · 🐢 — медленнее', '📞', {'f': 'Anna', 'm': 'Tom'})
        + mc(P + '-q0', 'On Sunday they want to…', ['go to the park', 'go shopping', 'play tennis'], 0)
        + rubric('b', 'Listen again. Answer the cards.', 'Послушайте ещё раз и ответьте.')
        + deck('Anna and Tom · Детали', [
            mc(P + '-q1', 'What does Tom always do on Saturday morning?', ['He goes swimming.', 'He plays tennis.', 'He cooks.'], 0),
            mc(P + '-q2', 'Who does Tom play tennis with?', ['with Anna', 'with his brother', 'with Kate'], 1),
            mc(P + '-q3', 'What does Tom hate?', ['cooking', 'shopping', 'swimming'], 1),
            mc(P + '-q4', 'When does Anna read?', ['every morning', 'every evening', 'never'], 1),
            mc(P + '-q5', 'Can Anna ride a bike?', ['Yes, she can.', "No, she can't."], 0)]))

    add('read', 'Reading', "Tom's message", '7 min',
        rubric('a', "Read Tom's message to Anna.", 'Прочитайте сообщение Тома.')
        + reading("Tom → Anna", 'a message · about 100 words', TEXT)
        + rubric('b', 'True or false?', 'Верно или нет?')
        + deck('True or false? · Верно или нет?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
            ('Tom gets up at seven.', True), ('Tom loves running.', False), ('Kate has got a cat.', False),
            ("There's a café next to the park.", True), ('Kate loves horror films.', False)])])
        + rubric('c', 'Find the words in the message and write them.', 'Найдите слова в тексте и напишите.')
        + ex_gaps(ids, [('Tom', ['always'], 'has coffee for breakfast.', 'всегда'),
                        ('He goes to the gym on Tuesday and', ['Thursday'], '.', 'день'),
                        ('Kate has got a little', ['dog'], ', Bobby.', ''),
                        ('On Friday evening they', ['usually'], 'watch a film.', 'обычно')]))

    add('grammar', 'Grammar', 'how often · love + -ing', '8 min',
        intro('🏋️', 'Grammar: tap, then type.', '8 minutes', 'Грамматика: сначала выбирайте, потом пишите.')
        + rubric('a', 'Choose.', 'Выберите.')
        + ex_select(ids, [('I love', 'swimming', ['swim', 'swimming', 'swims'], '.'),
                          ('Tom', 'never', ['never', 'don\'t', 'isn\'t'], 'goes shopping.'),
                          ('Anna', 'likes', ['like', 'likes', 'liking'], 'reading.'),
                          ('', 'Does', ['Do', 'Does', 'Is'], 'Kate like films?'),
                          ('We', "don't", ["doesn't", "don't", "aren't"], 'work on Sunday.'),
                          ('There', 'is', ['is', 'are', 'has'], 'a café next to the park.')])
        + rubric('b', 'Write the correct form.', 'Напишите правильную форму.')
        + ex_gaps(ids, [('Kate hates', ['getting'], 'up early.', 'get'),
                        ('Tom', ['plays'], 'tennis with his brother.', 'play'),
                        ('I', ["don't like", 'do not like'], 'running.', '➖ like'),
                        ('', ['Can'], 'you ride a bike?', '❓'),
                        ('My sister', ['has got', "'s got"], 'a dog.', 'have got')])
        + rubric('c', 'Put the words in order.', 'Соберите предложения.')
        + ex_order(ids, [(['go', 'I', 'swimming', 'always'], 'I always go swimming'),
                         (['cooking', 'Tom', 'loves'], 'Tom loves cooking'),
                         (['never', 'She', 'watches', 'horror films'], 'She never watches horror films')]))

    add('accuracy', 'Accuracy', 'Find the mistake', '5 min',
        rubric('a', 'One mistake in each sentence. Write the correct sentence.', 'В каждом предложении одна ошибка. Напишите правильно.')
        + ex_lines(ids, [('I go always to the gym. → ', ['I always go to the gym.', 'I always go to the gym']),
                         ('She like reading. → ', ['She likes reading.', 'She likes reading']),
                         ('I love cook. → ', ['I love cooking.', 'I love cooking']),
                         ('Tom don\'t like shopping. → ', ["Tom doesn't like shopping.", 'Tom does not like shopping.', "Tom doesn't like shopping", 'Tom does not like shopping']),
                         ('Do she play tennis? → ', ['Does she play tennis?', 'Does she play tennis'])]))

    add('challenge', 'Writing', 'My week', '6 min',
        rubric('a', 'Write to Tom about your week: 4–5 sentences.', 'Напишите Тому о своей неделе: 4–5 предложений.')
        + box('<b>Example:</b> I usually get up at eight. I always have tea. On Saturday I go swimming. I love reading, but I hate cooking!', '📝')
        + lines(ids, ['I usually…', 'I always / never…', 'On Saturday I…', 'I love … -ing, but I hate … -ing.', '…'])
        + rubric('b', 'Done? Press «Отправить преподавателю». Well done! 🌟', 'Готово? Нажмите «Отправить преподавателю». Молодец!') + send_box())

    gid = LID + '-games'
    secs.append((gid, 'Games', section(gid, 'Games', 'Play and review', '10 min', games_block(LID, [(w, r) for w, _, r, _, _ in CARDS], {
        'bad': [('I go always swimming.', 'I always go swimming.'), ('I love read.', 'I love reading.'), ('She like tennis.', 'She likes tennis.')],
        'ok': ['Tom never goes shopping.', 'I love cooking.', 'Do you like films?']}))))

    meta = {'id': LID, 'owner': OWNER, 'title': "Gym 2A: Tom's Busy Week", 'level': 'A1–A2', 'category': 'Homework', 'minutes': '35–40 min',
            'description': "Tom's week: free time words, a listening, a message, always / usually / never and love / like / hate + -ing — mostly tapping.",
            'grammar': 'Review 2A: always · usually · never · love / like / hate + -ing', 'date': '2026-11-16', 'code': 'HW',
            'hwSection': P + '-hw-prep', 'hwSince': '2026-11-16T06:00:00Z', 'draft': False, 'kind': 'homework', 'hwTag': 'ПОВТОРЕНИЕ · УРОК 2A',
            'gvp': {'g': 'always / usually / never · love / like / hate + -ing (review)', 'v': 'free time', 'p': ''}}
    d, h = lesson(meta, {}, secs, 'IRIS SCHOOL · Пелагея · домашка',
                  "Tom's busy week: free time words, a phone call with Anna, Tom's message — and lots of practice with always, never and I love swimming! 💪",
                  ['A1–A2', 'Homework', '35–40 min'])
    return [(d, h, vocab_of(CARDS))]
