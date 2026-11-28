"""Пелагея (A1–A2): дополнительная домашка «Gym 2E: Past Simple Clinic» — много практики Past Simple на типичных ошибках:
написание -ed (stopped, studied, danced), неправильные глаголы, didn't + V1 (не didn't went), Did…? + V1 (не Did you saw?),
was / were vs did, слова-маркеры yesterday / last / ago. Открыта сразу, как и прошлые Gym."""
from kit import *

OWNER, LID, P = 'pelageya', 'pelageya-gym2e', 'pgps'

CARDS = [
    ('go → went', 'Yesterday I went to the shop.', 'идти / ехать → пошёл', 'We went to the park.', '🚶'), ('eat → ate', 'I ate a sandwich.', 'есть → ел', 'She ate a big pizza.', '🍕'),
    ('see → saw', 'I saw a film.', 'видеть → видел', 'We saw a fox!', '👀'), ('buy → bought', 'I bought a dress.', 'покупать → купил', 'He bought a present.', '🛍️'),
    ('have → had', 'I had a shower.', 'иметь, есть → было', 'We had breakfast at eight.', '🍳'), ('make → made', 'I made a cake.', 'делать → сделал', 'Grandma made pancakes.', '🥞'),
    ('take → took', 'I took a photo.', 'брать → взял', 'Tom took the bus.', '📸'), ('come → came', 'She came home late.', 'приходить → пришёл', 'They came at seven.', '🏠'),
    ('get up → got up', 'I got up at seven.', 'вставать → встал', 'I got up early.', '⏰'), ('write → wrote', 'I wrote a message.', 'писать → написал', 'Kate wrote a postcard.', '✍️'),
    ('drink → drank', 'I drank some tea.', 'пить → пил', 'We drank hot chocolate.', '☕'), ('sleep → slept', 'I slept well.', 'спать → спал', 'The baby slept all night.', '😴')]

LISTEN = [
    ('f', 'Hi, Tom! What did you do yesterday?'), ('m', 'Hi, Anna! In the morning I got up late — at ten! Then I had breakfast and went to the market.'),
    ('f', 'What did you buy?'), ('m', "I bought apples and cheese. I didn't buy bread — they didn't have any."),
    ('f', 'Did you see Kate?'), ('m', 'Yes, I did! We met in the café. We drank coffee and talked for two hours.'),
    ('f', 'And in the evening?'), ('m', "I watched a film and cooked dinner. I didn't go to bed late — I was tired. What about you?"),
    ('f', 'I stayed at home. I studied English and wrote three messages to my friends. And I made a cake!'), ('m', 'Did you eat it all?'), ('f', 'No, I didn\'t! I left some for you!')]

TEXT = [
    'Last Saturday Kate (wake up) ___ at eight. She (have) ___ a quick breakfast and (go) ___ to the station.',
    'She (take) ___ the train to Tver. It (be) ___ cold, but the sun was shining.',
    'In Tver she (visit) ___ her grandmother. They (walk) ___ by the river and (eat) ___ ice cream — in winter!',
    'In the evening Kate (come) ___ home. She (not / watch) ___ TV. She (write) ___ in her diary: «A perfect day!»']
TEXT_ANS = [['woke up'], ['had'], ['went'], ['took'], ['was'], ['visited'], ['walked'], ['ate'], ['came'], ["didn't watch", 'did not watch'], ['wrote']]


def build():
    secs = []
    ids = Ids(P)

    def add(key, label, title, mins, body):
        sid = '%s-hw-%s' % (P, key)
        secs.append((sid, label, section(sid, label, title, mins, body)))

    add('prep', 'Start here', 'Past Simple Clinic', '8 min',
        task([('Nine short parts: the rule, -ed, irregular verbs, «didn\'t», questions, a story, mistakes, listening, writing. Do two or three parts a day.', 'Девять коротких частей. Делайте по две-три в день.'),
              ('These are the mistakes we often make — let\'s fix them for ever! 💪', 'Это частые ошибки — исправим их навсегда!'),
              ('At the end press «Отправить преподавателю».', 'В конце — «Отправить преподавателю».')])
        + rubric('a', 'Remember the rule. Press 🔊 and repeat.', 'Вспомните правило. Нажмите 🔊 и повторите.')
        + easy('Past Simple: ➕ worked / went · ➖ didn\'t work · ❓ Did you work?',
               'О прошлом (yesterday, last week, two days ago): обычные глаголы + <b>-ed</b> (worked), неправильные — своя форма (go → <b>went</b>). '
               '<b>«Не»</b> → <b>didn\'t + глагол как в словаре</b>: I didn\'t <b>go</b> (не didn\'t went!). <b>Вопрос</b> → <b>Did + кто + глагол как в словаре</b>: Did you <b>see</b>…? (не Did you saw!). '
               'Состояния и места — <b>was / were</b>: I was tired. They were at home.',
               [[('I', 'a'), ('went', 'd'), ('to the shop.', 'b')], [('I', 'a'), ("didn't", 'd'), ('go', 'c'), ('to the shop.', 'b')], [('Did', 'd'), ('you', 'a'), ('go', 'c'), ('to the shop?', 'b')]],
               [('🛍️', 'I went to the shop yesterday.'), ('🙅', "I didn't go to the gym."), ('❓', 'Did you see Kate? — Yes, I did.'), ('😴', 'I was tired.')],
               [("I didn't went.", "I didn't go.", "После didn't — форма из словаря."), ('Did you saw it?', 'Did you see it?', 'После Did — форма из словаря.'),
                ('I was go to the park.', 'I went to the park.', 'Действие — без was.'), ('She goed home.', 'She went home.', 'go — неправильный глагол.')],
               note='Маркеры: yesterday · last night / week / year · two days ago · in 2020 · when I was a child',
               choose=[('Да ➕', 'worked / went'), ('Нет ➖', "didn't + work / go"), ('Вопрос ❓', 'Did … work / go?'), ('Состояние, место', 'was / were'), ('Короткий ответ', "Yes, I did. / No, I didn't.")])
        + rubric('b', 'Irregular verbs: tap the cards, press 🔊 and repeat.', 'Неправильные глаголы: нажимайте на карточки и повторяйте.') + bank('2E', 'Irregular verbs', CARDS))

    add('ed', 'Grammar', 'regular verbs: -ed spelling', '7 min',
        rubric('a', 'Write the past form. Be careful with the spelling!', 'Напишите прошедшую форму. Осторожно с написанием!')
        + box('<b>Spelling:</b> work → work<b>ed</b> · dance → danc<b>ed</b> (только -d) · stud<b>y</b> → stud<b>ied</b> · pl<b>ay</b> → play<b>ed</b> (гласная + y) · st<b>op</b> → sto<b>pped</b> (удвоение)', '✏️')
        + ex_gaps(ids, [('I', ['watched'], 'a film.', 'watch'), ('She', ['danced'], 'all evening.', 'dance'), ('We', ['studied'], 'English yesterday.', 'study'), ('They', ['played'], 'football.', 'play'),
                        ('The bus', ['stopped'], 'near my house.', 'stop'), ('He', ['tried'], 'sushi for the first time.', 'try'), ('I', ['liked'], 'the cake.', 'like'), ('We', ['stayed'], 'at home.', 'stay'),
                        ('Kate', ['planned'], 'a party.', 'plan'), ('My mum', ['cried'], 'at the film.', 'cry')], size=12))

    add('irregular', 'Grammar', 'irregular verbs', '8 min',
        rubric('a', 'Choose the past form.', 'Выберите прошедшую форму.')
        + ex_select(ids, [('go →', 'went', ['went', 'goed', 'gone'], ''), ('see →', 'saw', ['saw', 'seed', 'seen'], ''), ('buy →', 'bought', ['bought', 'buyed', 'brought'], ''),
                          ('eat →', 'ate', ['ate', 'eated', 'eaten'], ''), ('take →', 'took', ['took', 'taked', 'taken'], ''), ('write →', 'wrote', ['wrote', 'writed', 'written'], '')])
        + rubric('b', 'Write the past form in the sentence.', 'Напишите прошедшую форму в предложении.')
        + ex_gaps(ids, [('Yesterday I', ['got up'], 'at seven.', 'get up'), ('We', ['had'], 'pancakes for breakfast.', 'have'), ('She', ['made'], 'a big salad.', 'make'), ('They', ['came'], 'home at nine.', 'come'),
                        ('I', ['drank'], 'two cups of tea.', 'drink'), ('The baby', ['slept'], 'all night.', 'sleep'), ('Tom', ['bought'], 'a new phone.', 'buy'), ('We', ['saw'], 'a beautiful rainbow.', 'see')], size=12))

    add('negative', 'Grammar', "«didn't» + verb", '6 min',
        rubric('a', "Choose: after didn't — the verb from the dictionary!", "Выберите: после didn't — глагол как в словаре!")
        + ex_select(ids, [("I didn't", 'go', ['go', 'went', 'goed'], 'to the gym.'), ("She didn't", 'eat', ['eat', 'ate', 'eats'], 'the soup.'), ("We didn't", 'see', ['see', 'saw', 'seen'], 'the film.'),
                          ("He didn't", 'buy', ['buy', 'bought', 'buys'], 'bread.')])
        + rubric('b', 'Make the sentences negative.', 'Сделайте предложения отрицательными.')
        + ex_gaps(ids, [('I went to work. → I', ["didn't go", 'did not go'], 'to work.', '➖'), ('She watched TV. → She', ["didn't watch", 'did not watch'], 'TV.', '➖'),
                        ('We had lunch. → We', ["didn't have", 'did not have'], 'lunch.', '➖'), ('They came early. → They', ["didn't come", 'did not come'], 'early.', '➖'),
                        ('He wrote a letter. → He', ["didn't write", 'did not write'], 'a letter.', '➖')], size=14))

    add('questions', 'Grammar', 'questions: Did…? Where did…?', '7 min',
        rubric('a', 'Choose the correct question.', 'Выберите правильный вопрос.')
        + ex_select(ids, [('', 'Did you see', ['Did you see', 'Did you saw', 'Do you saw'], 'Kate yesterday?'), ('Where', 'did you go', ['did you go', 'did you went', 'you went'], 'last weekend?'),
                          ('What', 'did she buy', ['did she buy', 'did she bought', 'she bought'], '?'), ('', 'Were', ['Were', 'Did', 'Was'], 'you at home on Sunday?')])
        + rubric('b', 'Complete the questions and short answers.', 'Дополните вопросы и короткие ответы.')
        + ex_gaps(ids, [('', ['Did'], 'you like the film? — Yes, I did.', '❓'), ('What did you', ['eat'], 'for dinner?', 'eat'), ('Where did they', ['go'], 'on holiday?', 'go'),
                        ('Did Tom call you? — No, he', ["didn't", 'did not'], '.', 'short answer'), ('When', ['did'], 'you get up?', '❓'), ('Did you have fun? — Yes, I', ['did'], '!', 'short answer')], size=10))

    add('story', 'Reading', "Kate's perfect Saturday", '8 min',
        rubric('a', "Read Kate's story. Write the verbs in the Past Simple (in order).", 'Прочитайте историю Кейт и поставьте глаголы в Past Simple (по порядку).')
        + reading("Kate's perfect Saturday", 'a short story · fill in the verbs', TEXT)
        + ex_gaps(ids, [('Verb %d:' % (i + 1), a, '') for i, a in enumerate(TEXT_ANS)], size=14)
        + rubric('b', 'True or false?', 'Верно или нет?')
        + deck('True or false? · Верно или нет?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
            ('Kate went to Tver by train.', True), ('It was warm.', False), ('She visited her grandmother.', True), ('She watched TV in the evening.', False)])]))

    add('clinic', 'Accuracy', 'the mistake clinic', '8 min',
        rubric('a', 'Doctor, help! Each sentence has one typical mistake. Write the correct sentence.', 'Доктор, помогите! В каждом предложении одна типичная ошибка. Напишите правильно.')
        + ex_lines(ids, [("I didn't went to school. → ", ["I didn't go to school.", 'I did not go to school.']), ('Did you saw my keys? → ', ['Did you see my keys?']),
                         ('She goed to the park. → ', ['She went to the park.']), ('We was at home yesterday. → ', ['We were at home yesterday.']),
                         ('I was eat a pizza. → ', ['I ate a pizza.']), ('He studyed all night. → ', ['He studied all night.']), ('They stoped the car. → ', ['They stopped the car.']),
                         ('Where you went yesterday? → ', ['Where did you go yesterday?']), ("I buyed a new bag. → ", ['I bought a new bag.']), ('Did she liked the cake? → ', ['Did she like the cake?'])])
        + rubric('b', 'Put the words in order.', 'Соберите предложения.')
        + ex_order(ids, [(["didn't", 'I', 'go', 'to work.'], "I didn't go to work."), (['Did', 'you', 'see', 'the fox?'], 'Did you see the fox?'), (['did', 'Where', 'you', 'go?'], 'Where did you go?'),
                         (['bought', 'She', 'a new dress', 'last week.'], 'She bought a new dress last week.')]))

    add('listen', 'Listening', 'Tom\'s Saturday', '6 min',
        rubric('a', 'Listen to Anna and Tom. Did Tom have a good day?', 'Послушайте. У Тома был хороший день?')
        + listening(P + '-lis', LISTEN, 'Anna and Tom: yesterday', 'Listen twice · 🐢 — медленнее', '📞', {'f': 'Anna', 'm': 'Tom'})
        + deck('Anna and Tom · Детали', [
            mc(P + '-q1', 'When did Tom get up?', ['at ten', 'at seven', 'at nine'], 0), mc(P + '-q2', 'What did he buy?', ['apples and cheese', 'bread and milk', 'a cake'], 0),
            mc(P + '-q3', "Why didn't he buy bread?", ["They didn't have any.", 'He forgot.', 'It was expensive.'], 0), mc(P + '-q4', 'Where did he meet Kate?', ['in the café', 'at the market', 'at home'], 0),
            mc(P + '-q5', 'What did Anna make?', ['a cake', 'dinner', 'tea'], 0)])
        + rubric('b', 'Listen again and write the verbs.', 'Послушайте ещё раз и напишите глаголы.')
        + ex_gaps(ids, [('Tom', ['went'], 'to the market.', ''), ('He', ["didn't buy", 'did not buy'], 'bread.', ''), ('They', ['drank'], 'coffee.', ''), ('Anna', ['wrote'], 'three messages.', '')], size=12))

    add('write', 'Writing', 'my yesterday', '6 min',
        rubric('a', 'Write about yesterday: 6 sentences. Use 3 irregular verbs, 1 «didn\'t» and 1 question to your teacher.', 'Ваш вчерашний день: 6 предложений — 3 неправильных глагола, 1 «didn\'t» и 1 вопрос преподавателю.')
        + box("<b>Example:</b> Yesterday I got up at seven. I had coffee and went to work. In the evening I made soup. I didn't watch TV. I read a book. Did you have a nice day?", '📝')
        + lines(ids, ['Yesterday I got up…', 'Then I…', 'In the afternoon I…', "I didn't…", 'In the evening I…', 'Did you…?'])
        + rubric('b', 'Done? Press «Отправить преподавателю». Well done! 🌟', 'Готово? Нажмите «Отправить преподавателю». Молодец!') + send_box())

    gid = LID + '-games'
    secs.append((gid, 'Games', section(gid, 'Games', 'Play and review', '10 min', games_block(LID, [(w, r) for w, _, r, _, _ in CARDS], {
        'bad': [("I didn't went.", "I didn't go."), ('Did you saw it?', 'Did you see it?'), ('She goed home.', 'She went home.'), ('We was at home.', 'We were at home.')],
        'ok': ['I went to the shop yesterday.', "I didn't go to the gym.", 'Did you see Kate?', 'We bought apples.']}))))

    meta = {'id': LID, 'owner': OWNER, 'title': 'Gym 2E: Past Simple Clinic', 'level': 'A1–A2', 'category': 'Homework', 'minutes': '45–60 min',
            'description': "Lots of Past Simple practice on typical mistakes: -ed spelling, irregular verbs, didn't + verb, Did…? questions, was / were — a story, a listening and a mistake clinic.",
            'grammar': "Past Simple clinic: -ed spelling · irregular verbs · didn't + V1 · Did…? + V1 · was / were", 'date': '2026-11-28', 'code': 'HW',
            'hwSection': P + '-hw-prep', 'hwSince': '2026-11-28T06:00:00Z', 'draft': False, 'kind': 'homework', 'hwTag': 'ТРЕНАЖЁР · PAST SIMPLE',
            'gvp': {'g': "Past Simple: regular and irregular verbs, negatives and questions (typical mistakes)", 'v': 'irregular verbs', 'p': ''}}
    d, h = lesson(meta, {}, secs, 'IRIS SCHOOL · Пелагея · домашка',
                  "The Past Simple Clinic 🩺: -ed spelling, irregular verbs, «didn't go» (not «didn't went»!), «Did you see?» (not «Did you saw?») — a story, a listening and a mistake clinic. Lots of practice!",
                  ['A1–A2', 'Homework', 'Past Simple', '45–60 min'])
    return [(d, h, vocab_of(CARDS))]
