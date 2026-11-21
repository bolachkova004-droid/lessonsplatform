"""Ноябрь 2026, вторая волна B1 / Intermediate — у каждого урока своя структура:
Юля К 2B — дилеммы (говорим сразу): «What Would You Do?», second conditional.
Оля B1 2C — детектив: «Lost Property», must / might / can't be.
Саша B1 3B — викторина + мини-презентация: «Made in…», passive (present / past).
Екатерина 3B — «испорченный телефон» + ролевая игра: «Can You Pass On a Message?», reported speech.
Иола 4A — проект: «Volunteers Wanted», present perfect simple vs continuous.
Милана 3B — опрос + история: «Thrill Seekers», -ed / -ing adjectives, so / such.
Марина 3B — история по картинкам + диктоглосс: «Travel Disasters», past continuous vs past simple.
Ксения 4A — дебаты: «City or Countryside?», comparatives: much / far / a bit, (not) as…as, the more… the more."""
from flex import *

DATE = '2026-11-30'


def yulia():
    P, LID = 'yk6', 'yulia-k-6'
    ids = Ids(P)
    cards = [('a dilemma', 'a difficult choice between two options', 'дилемма', 'I have a dilemma.', '⚖️'), ('honest', 'telling the truth', 'честный', 'Would you be honest?', '😇'),
             ('to hand in', 'to give something to a person in authority', 'сдать (находку)', 'I would hand it in to the police.', '👮'), ('to own up', 'to admit you did something wrong', 'признаться', 'He owned up to breaking the vase.', '🙋'),
             ('a white lie', 'a small lie to be kind', 'ложь во спасение', 'Is a white lie OK?', '🤍'), ('to keep a secret', 'not to tell anyone', 'хранить секрет', 'Can you keep a secret?', '🤫'),
             ('a reward', 'money or a gift for doing something good', 'вознаграждение', 'She got a reward.', '🎁'), ('to feel guilty', 'to feel bad about something you did', 'чувствовать вину', 'I would feel guilty.', '😣')]
    lines_ = [('f3', "OK, here's one for you. You find a wallet in the street. There are five hundred euros inside and an ID card. What would you do?"),
              ('m3', "Honestly? I'd hand it in to the police. If I lost my wallet, I'd want someone to do the same for me."),
              ('f3', "What if there was no ID card? Just the money?"), ('m3', "Hmm… that's harder. I'd still hand it in. If I kept it, I'd feel guilty for weeks."),
              ('f3', 'Next one. Your best friend gives you a terrible birthday present. Would you tell her?'),
              ('m3', "No way! I'd say «Thank you, I love it!» That's a white lie. It wouldn't help anyone if I told the truth."),
              ('f3', 'And if you saw a colleague taking money from the office?'), ('m3', "I'd talk to the colleague first. If they didn't stop, I'd tell my manager. What about you?"),
              ('f3', "I'd probably do the same. But I'd be very nervous!")]
    sections = [
        ('dilemmas', 'Speak first', 'three dilemmas', '12 min',
         route([('⚖️', 'dilemmas (speak first)'), ('🎧', 'two friends'), ('🔍', 'notice the grammar'), ('📝', 'magazine quiz'), ('💌', 'advice letter')])
         + rubric('a', 'No grammar yet — just talk. Read each dilemma, decide, and explain to your teacher.', 'Пока без грамматики — просто обсудите. Что бы вы сделали?')
         + opinion(ids, ['You find a wallet with €500 and an ID card.', 'Your friend gives you a present you hate.', 'You see a colleague taking money from the office.',
                         'A shop gives you too much change.'], ['keep quiet', 'act / tell', "it depends"])
         + phrases(['I think I would…', "I wouldn't…", 'It depends on…', 'Honestly…'])),
        ('listen', 'Listening', 'what would you do?', '10 min',
         rubric('a', 'Listen to two friends discussing the same dilemmas. Do they agree with you?', 'Два друга обсуждают те же дилеммы. Они согласны с вами?')
         + listening(P + '-lis', lines_, 'Two friends: «What would you do?»', 'Listen twice', '🗣️', {'f3': 'Kate', 'm3': 'Tom'})
         + deck('Details', [mc(P + '-q1', 'What would Tom do with the wallet?', ['hand it in to the police', 'keep the money', 'leave it'], 0),
                            mc(P + '-q2', 'Why?', ["He'd want the same if he lost his wallet.", 'He wants a reward.', 'He is a police officer.'], 0),
                            mc(P + '-q3', 'What about the terrible present?', ['He would tell a white lie.', 'He would tell the truth.', 'He would give it back.'], 0),
                            mc(P + '-q4', 'And the colleague taking money?', ['talk to the colleague first', 'call the police', 'do nothing'], 0)])),
        ('notice', 'Grammar', 'notice the pattern', '12 min',
         rubric('a', 'Look at Tom\'s sentences. What tense comes after <i>if</i>? Is the situation real or imagined?', 'Какое время после if? Ситуация реальная или воображаемая?')
         + examples(["If I <mark>lost</mark> my wallet, I<mark>'d want</mark> someone to do the same.", "If I <mark>kept</mark> it, I<mark>'d feel</mark> guilty.", "It <mark>wouldn't help</mark> anyone if I <mark>told</mark> the truth."])
         + deck('Discover', [mc(P + '-d1', 'After «if» Tom uses…', ['the past simple', 'will', 'the present'], 0), mc(P + '-d2', 'But he is talking about…', ['an imagined present or future', 'the past', 'a fact'], 0),
                             mc(P + '-d3', 'In the other part he uses…', ["would ('d) + verb", 'will + verb', 'the past'], 0)])
         + reveal('📘 Check the rule', easy("If I found…, I'd…",
                                             'Воображаемая, маловероятная ситуация <b>сейчас или в будущем</b> → <b>if + past simple</b>, <b>would + глагол</b>. Прошедшее время здесь не про прошлое — оно показывает «нереально». '
                                             'Совет: <b>If I were you, I\'d…</b>',
                                             [[('If', 'c'), ('I', 'a'), ('found', 'd'), ('a wallet,', 'b')], [("I'd", 'd'), ('hand it in.', 'b')]],
                                             [('👛', "If I found a wallet, I'd hand it in."), ('🎁', "If I hated the present, I wouldn't say so."), ('💡', "If I were you, I'd tell the truth.")],
                                             [("If I would find…", 'If I found…', 'После if — без would.'), ("If I found it, I will keep it.", "If I found it, I'd keep it.", 'would, не will.')]))
         + ex_gaps(ids, [('If I', ['found'], "€500, I'd hand it in.", 'find'), ('I', ["'d tell", 'would tell'], 'my manager if I saw it.', 'tell'), ('If you', ['were'], 'me, what would you do?', 'be'),
                         ('She', ["wouldn't keep", 'would not keep'], 'the money.', 'not / keep')])),
        ('quiz', 'Quiz', 'how honest are you?', '10 min',
         rubric('a', 'A magazine quiz. Choose your answers, then count your points and read your result.', 'Тест из журнала: выберите ответы и посчитайте баллы.')
         + opinion(ids, ['If a shop gave you too much change, would you give it back?', 'If your friend asked about her new haircut (and you hated it), would you tell the truth?',
                         'If you broke something in a hotel, would you own up?', 'If you knew a big secret about a friend, would you keep it?'], ['a) yes, always (3)', 'b) probably (2)', 'c) no (1)'])
         + reveal('📊 Results', '<p><b>10–12:</b> You are honest — maybe too honest! <b>7–9:</b> You are honest but kind; you use white lies to protect people. <b>4–6:</b> Hmm… remind us never to lend you our wallet! 😄</p>')
         + vocab_section(ids, '2B', 'Honesty and dilemmas', cards, [('a small lie to be kind →', 'a white lie', ['a white lie', 'a dilemma', 'a reward'], ''), ('to admit you did something wrong →', 'to own up', ['to own up', 'to hand in', 'to keep a secret'], '')], [])),
        ('write', 'Writing', 'an advice column', '10 min',
         rubric('a', 'A reader writes: «My neighbour\'s dog barks all night. I\'m too shy to complain. What should I do?» Write a reply with three pieces of advice.', 'Ответьте читателю: три совета.')
         + lines(ids, ["If I were you, I'd…", 'If you talked to him, he would probably…', "If that didn't work, I'd…", 'Good luck!']) + send_box()),
    ]
    hw = hw_pair(ids, [('a difficult choice between two options →', 'a dilemma', ['a dilemma', 'a reward', 'a secret'], ''), ('money or a gift for doing something good →', 'a reward', ['a reward', 'a white lie', 'a dilemma'], ''),
                       ('telling the truth →', 'honest', ['honest', 'guilty', 'shy'], '')],
                 [('guilty', 'guilty', ['guilty', 'gilded', 'gentle']), ('honest', 'honest', ['honest', 'hottest', 'honey']), ('a dilemma', 'a dilemma', ['a dilemma', 'a lemon', 'a diploma'])],
                 [('I would hand it', ['in'], 'to the police.'), ('He owned', ['up'], 'to his mistake.'), ('Can you keep a', ['secret'], '?')],
                 'Second conditional: write the verbs.', 'Второй тип условных.', [('If I', ['had'], 'more time, I would learn Italian.', 'have'), ('What', ['would'], 'you do if you won a million?', ''),
                                                                                  ('If he', ['were', 'was'], 'taller, he would play basketball.', 'be'), ('I', ["wouldn't lie", 'would not lie'], 'to my best friend.', 'not / lie')],
                 [("If I would have a car, I'd drive. →", ["If I had a car, I'd drive.", 'If I had a car, I would drive.']), ('If I found it, I will keep it. →', ["If I found it, I'd keep it.", 'If I found it, I would keep it.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'yulia-k', 'code': '2B', 'title': 'What Would You Do?', 'level': 'B1', 'category': 'Dilemmas & honesty', 'minutes': '60 min',
                 'grammar': "Second conditional: If I found…, I'd… · If I were you…", 'date': DATE, 'gvp': {'g': 'second conditional', 'v': 'honesty and dilemmas', 'p': "'d"},
                 'eyebrow': 'IRIS SCHOOL · Юля К · урок 2B', 'tags': ['B1', 'Dilemmas', 'Speak first', 'Second conditional'],
                 'lead': 'This lesson starts with talking, not grammar: tricky dilemmas about honesty. Then you hear two friends discuss them, notice how they say it — and take a magazine quiz.',
                 'cards': cards, 'case': {'bad': [('If I would find it…', 'If I found it…'), ('If I found it, I will keep it.', "If I found it, I'd keep it.")], 'ok': ["If I were you, I'd tell the truth.", "I'd hand it in."]},
                 'sections': sections, 'hw': hw})


def olya_b1():
    P, LID = 'ob5', 'olya-b1-5'
    ids = Ids(P)
    cards = [('lost property', 'a place where lost things are kept', 'бюро находок', 'Try the lost property office.', '🧳'), ('to belong to', 'to be someone\'s', 'принадлежать', 'Who does it belong to?', '👤'),
             ('a clue', 'something that helps you find the answer', 'улика', 'The ticket is a clue.', '🔎'), ('a receipt', 'a paper you get when you pay', 'чек', 'a receipt from a café', '🧾'),
             ('a charger', 'a cable to give power to a phone', 'зарядка', 'a phone charger', '🔌'), ('a sketchbook', 'a book for drawing', 'скетчбук', 'a sketchbook full of drawings', '✏️'),
             ('to deduce', 'to decide something from the facts', 'сделать вывод', 'What can you deduce?', '🧠'), ('an owner', 'the person something belongs to', 'владелец', 'We found the owner!', '🙋')]
    sections = [
        ('bag', 'Mystery', 'whose bag is it?', '12 min',
         route([('🎒', 'a mystery bag'), ('🎧', 'the lost property office'), ('🔍', 'detective grammar'), ('🕵️', 'solve three cases'), ('✍️', 'write a case')])
         + rubric('a', 'A bag was left on a train. Look at what was inside. Who is the owner? Say what you think.', 'В поезде оставили сумку. Чья она? Скажите, что думаете.')
         + box('<b>Inside the bag:</b> 🎫 a train ticket Moscow → Tver · ✏️ a sketchbook full of drawings of cats · 🧾 a receipt: 2 cappuccinos, 1 cookie for a dog · 🔌 a phone charger · 👓 reading glasses · 🎟️ a theatre ticket for Saturday', '🎒')
         + think(ids, 'Who do you think the owner is? Age, job, hobbies?', 'Кто, по-вашему, владелец?', ['I think the owner is…', 'Maybe he / she…', "He / she probably isn't…"])),
        ('listen', 'Listening', 'at the lost property office', '10 min',
         rubric('a', 'Two staff at the lost property office talk about the same bag. Were your ideas right?', 'Сотрудники бюро находок обсуждают сумку. Вы угадали?')
         + listening(P + '-lis', [('f3', 'Look at this bag from the 8.15 train. Whose do you think it is?'), ('m4', "The owner must be an artist — look at all these drawings. And she must love cats."),
                                  ('f3', "Why «she»? It might be a man."), ('m4', "True. But they can't be young — there are reading glasses in here."), ('f3', "Not necessarily. Lots of young people need glasses. Look, a cookie for a dog. They must have a dog."),
                                  ('m4', "And this theatre ticket is for Saturday. They'll definitely come back for it!"), ('f3', "The ticket says Tver. They might live there, or they might just be visiting."),
                                  ('m4', "Oh, wait — there's a name on the sketchbook: Anna Belova. Mystery solved!")],
                     'At the lost property office', 'Listen twice', '🧳', {'f3': 'Officer 1', 'm4': 'Officer 2'})
         + deck('Details', [mc(P + '-q1', 'Why must the owner be an artist?', ['There are lots of drawings.', 'There are paints.', 'There is a museum ticket.'], 0),
                            mc(P + '-q2', 'What does the cookie tell them?', ['They must have a dog.', 'They must be hungry.', 'They work in a café.'], 0),
                            mc(P + '-q3', 'How do they solve the mystery?', ['a name on the sketchbook', 'a phone call', 'the ticket'], 0)])),
        ('rule', 'Grammar', 'detective grammar', '12 min',
         rubric('a', 'Match the expressions with how sure the detective is.', 'Соотнесите выражение и уверенность детектива.')
         + ex_select(ids, [('The owner must be an artist. →', '95% — almost sure it is true', ['95% — almost sure it is true', '50% — maybe', '95% — almost sure it is NOT true'], ''),
                           ('It might be a man. →', '50% — maybe', ['50% — maybe', '95% — almost sure it is true', '95% — almost sure it is NOT true'], ''),
                           ("They can't be young. →", '95% — almost sure it is NOT true', ['95% — almost sure it is NOT true', '50% — maybe', '95% — almost sure it is true'], '')])
         + easy("must be · might be · can't be",
                'Делаем выводы о <b>настоящем</b> по уликам: <b>must</b> = наверняка да; <b>might / may / could</b> = возможно; <b>can\'t</b> = наверняка нет. После них — <b>простой глагол</b> (be, have, live, love). '
                'Важно: «наверняка нет» — это <b>can\'t</b>, а не mustn\'t!',
                [[('The owner', 'a'), ('must', 'd'), ('be', 'c'), ('an artist.', 'b')], [('They', 'a'), ('might', 'd'), ('live', 'c'), ('in Tver.', 'b')], [('They', 'a'), ("can't", 'd'), ('be', 'c'), ('young.', 'b')]],
                [('🎨', 'The owner must be an artist.'), ('🐶', 'They must have a dog.'), ('🚆', 'They might live in Tver.'), ('👓', "They can't be very young.")],
                [("They mustn't be young.", "They can't be young.", '«Наверняка нет» → can\'t.'), ('She must to be an artist.', 'She must be an artist.', 'Без to.'), ('He might is at home.', 'He might be at home.', 'После might — be.')],
                choose=[('Уверен, что да (улики!)', 'must + V'), ('Возможно', 'might / may / could + V'), ('Уверен, что нет', "can't + V")])),
        ('cases', 'Detective game', 'three cases', '12 min',
         rubric('a', 'Solve three cases. Complete with must, might or can\'t.', 'Три дела: вставьте must / might / can\'t.')
         + escape(ids, [('🧥', 'Case 1', 'A coat with sand in the pockets and a ferry ticket. The owner ___ have been to the sea — or live by it.', ['must']),
                        ('⚽', 'Case 2', 'A football boot, size 32. The owner ___ be an adult — it is a child\'s size!', ["can't", 'cannot']),
                        ('📚', 'Case 3', 'A Spanish dictionary and a plane ticket to Madrid. The owner ___ be learning Spanish — or maybe they are a teacher.', ['might', 'may', 'could'])])
         + vocab_section(ids, '2C', 'Lost and found', cards, [('a paper you get when you pay →', 'a receipt', ['a receipt', 'a ticket', 'a clue'], ''), ('to be someone\'s →', 'to belong to', ['to belong to', 'to deduce', 'to lose'], '')], [])),
        ('write', 'Writing', 'your own case', '10 min',
         rubric('a', 'Write your own «lost bag» case: list five objects. Then write three deductions. Your teacher will try to guess first!', 'Придумайте своё дело: пять предметов и три вывода.')
         + lines(ids, ['Inside the bag: …', 'The owner must…', 'The owner might…', "The owner can't…"]) + send_box()),
    ]
    hw = hw_pair(ids, [('a place where lost things are kept →', 'lost property', ['lost property', 'a museum', 'a station'], ''), ('the person something belongs to →', 'an owner', ['an owner', 'a clue', 'a receipt'], ''),
                       ('a cable to give power to a phone →', 'a charger', ['a charger', 'a receipt', 'a sketchbook'], '')],
                 [('a receipt', 'a receipt', ['a receipt', 'a recipe', 'a reset']), ('a clue', 'a clue', ['a clue', 'a glue', 'a crew']), ('deduce', 'deduce', ['deduce', 'reduce', 'produce'])],
                 [('Who does it belong', ['to'], '?'), ('The ticket is an important', ['clue'], '.'), ('We found the', ['owner'], '!')],
                 'Write must, might or can\'t.', "must / might / can't.", [("He's got a key to the school. He", ['must'], 'work there.', ''), ('She is only 12. She', ["can't", 'cannot'], 'be a driver.', ''),
                                                                         ("I'm not sure where Pavel is. He", ['might', 'may', 'could'], 'be at the gym.', ''), ('The lights are off. They', ['must', 'might'], 'be out.', '')],
                 [("She mustn't be at home — the car isn't here. →", ["She can't be at home — the car isn't here."]), ('He must to be tired. →', ['He must be tired.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'olya-b1', 'code': '2C', 'title': 'Lost Property', 'level': 'B1', 'category': 'Mystery & detective', 'minutes': '60 min',
                 'grammar': "Modals of deduction (present): must / might / can't be", 'date': DATE, 'gvp': {'g': "must / might / may / could / can't + infinitive", 'v': 'lost and found', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Оля · урок 2C', 'tags': ['B1', 'Detective', 'Mystery bag', "must · might · can't"],
                 'lead': 'A bag left on a train — whose is it? Today you are a detective: guess from the clues, listen to the lost property officers and solve three more cases.',
                 'cards': cards, 'case': {'bad': [("They mustn't be young.", "They can't be young."), ('She must to be an artist.', 'She must be an artist.')], 'ok': ['The owner must be an artist.', 'They might live in Tver.']},
                 'sections': sections, 'hw': hw})


def sasha_b1():
    P, LID = 'sb5', 'sasha-b1-5'
    ids = Ids(P)
    cards = [('to invent', 'to make something new that did not exist', 'изобретать', 'The telephone was invented in 1876.', '💡'), ('to produce', 'to make in large numbers', 'производить', 'Millions of phones are produced every year.', '🏭'),
             ('an invention', 'a new thing that someone has made', 'изобретение', 'the greatest invention', '⚙️'), ('to design', 'to plan how something will look and work', 'проектировать', 'It was designed in Sweden.', '📐'),
             ('to export', 'to sell to other countries', 'экспортировать', 'Tea is exported from India.', '🚢'), ('cotton', 'a natural material from a plant', 'хлопок', 'a cotton T-shirt', '👕'),
             ('to assemble', 'to put parts together', 'собирать (из деталей)', 'It is assembled in China.', '🔧'), ('a brand', 'a company name on a product', 'бренд', 'a famous brand', '🏷️')]
    sections = [
        ('quiz', 'Quiz show', 'where and when?', '12 min',
         route([('🏆', 'quiz show'), ('📖', 'check the facts'), ('📘', 'the rule'), ('🧸', 'show and tell'), ('🎤', 'mini-presentation')])
         + rubric('a', 'Quiz show! Guess the answers. Don\'t worry about the grammar — just play.', 'Викторина! Угадайте ответы.')
         + deck('Quiz · Где и когда?', [mc(P + '-z1', 'The telephone was invented in…', ['1876', '1920', '1801'], 0), mc(P + '-z2', 'Where were the first paper banknotes used?', ['China', 'Italy', 'England'], 0),
                                        mc(P + '-z3', 'Where was LEGO first made?', ['Denmark', 'Germany', 'the USA'], 0), mc(P + '-z4', 'Tetris was created in…', ['the USSR', 'Japan', 'the USA'], 0),
                                        mc(P + '-z5', 'Most of the world\'s coffee is grown in…', ['Brazil', 'Russia', 'Italy'], 0)])),
        ('read', 'Reading', 'the facts', '10 min',
         rubric('a', 'Read the facts and check your answers.', 'Прочитайте факты и проверьте ответы.')
         + reading('Did You Know?', 'five facts · about 130 words', ['The telephone was patented by Alexander Graham Bell in 1876.', 'The first paper money was used in China more than a thousand years ago.',
                                                                      'LEGO bricks were first made in Denmark. The name comes from the Danish words «leg godt» — «play well».',
                                                                      'Tetris was created in Moscow in 1984 by Alexey Pajitnov.', 'Brazil is the largest coffee producer in the world — about a third of the world\'s coffee is grown there.'])
         + deck('True or false?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
             ('LEGO was first made in Denmark.', True), ('Tetris was created in Japan.', False), ('About a third of the world\'s coffee is grown in Brazil.', True)])])),
        ('rule', 'Grammar', 'notice the passive', '12 min',
         rubric('a', 'All the facts use the same grammar. Find it.', 'Во всех фактах одна грамматика. Найдите её.')
         + examples(['The telephone <mark>was patented</mark> in 1876.', 'Tetris <mark>was created</mark> in Moscow.', 'Coffee <mark>is grown</mark> in Brazil.'])
         + easy('was made · is grown',
                'Когда важнее <b>что</b> сделали, а не <b>кто</b> — passive: <b>be + V3</b>. Факты сейчас → <b>is / are + V3</b>. История → <b>was / were + V3</b>. Кто сделал — <b>by</b>.',
                [[('Tetris', 'a'), ('was created', 'd'), ('in 1984.', 'b')], [('Coffee', 'a'), ('is grown', 'd'), ('in Brazil.', 'b')], [('It', 'a'), ('was invented', 'd'), ('by Bell.', 'c')]],
                [('🧱', 'LEGO was first made in Denmark.'), ('🎮', 'Tetris was created in Moscow.'), ('☕', 'Coffee is grown in Brazil.')],
                [('Tetris created in 1984.', 'Tetris was created in 1984.', 'Нужен be.'), ('It was invent by Bell.', 'It was invented by Bell.', 'V3!')])
         + ex_gaps(ids, [('My phone', ['was made'], 'in China.', 'make'), ('These cars', ['are produced'], 'in Kaluga.', 'produce'), ('The Eiffel Tower', ['was built'], 'in 1889.', 'build'),
                         ('Russian is', ['spoken'], 'in many countries.', 'speak')])),
        ('show', 'Show and tell', 'an object from home', '14 min',
         rubric('a', 'Take any object in your room (a mug, a phone, a jumper). Look at the label! Prepare a 1-minute mini-presentation.', 'Возьмите любой предмет. Посмотрите на этикетку! Подготовьте минутный рассказ.')
         + cycle('<p>Find information: where was it made / bought / designed? What is it made of?</p>',
                 lines(ids, ['This is my…', 'It was made in…', 'It is made of…', 'It was given to me by… / I bought it…', 'I like it because…']),
                 '<p>Present your object to your teacher. Your teacher asks two questions.</p>' + phrases(['This is…', 'It was made in…', 'It is made of…', 'It was designed by…']))
         + vocab_section(ids, '3B', 'Made in…', cards, [('to put parts together →', 'to assemble', ['to assemble', 'to export', 'to invent'], ''), ('to sell to other countries →', 'to export', ['to export', 'to produce', 'to design'], '')], [])),
        ('write', 'Writing', 'quiz questions', '8 min', rubric('a', 'Write three quiz questions for your teacher with the passive.', 'Три вопроса для викторины с passive.')
         + lines(ids, ['Where was … invented?', 'When was … built?', 'Which country is … grown / made in?']) + send_box()),
    ]
    hw = hw_pair(ids, [('to make something new →', 'to invent', ['to invent', 'to export', 'to assemble'], ''), ('a company name on a product →', 'a brand', ['a brand', 'an invention', 'a label'], ''),
                       ('a natural material from a plant →', 'cotton', ['cotton', 'plastic', 'metal'], '')],
                 [('invented', 'invented', ['invented', 'invited', 'inverted']), ('produced', 'produced', ['produced', 'reduced', 'introduced']), ('designed', 'designed', ['designed', 'decided', 'resigned'])],
                 [('It is', ['assembled'], 'in China.'), ('Tea is', ['exported'], 'from India.'), ('a cotton', ['T-shirt'], '')],
                 'Write the passive.', 'Напишите passive.', [('The Hermitage', ['was founded'], 'in 1764.', 'found'), ('Smartphones', ['are made'], 'in many countries.', 'make'),
                                                             ('Harry Potter', ['was written'], 'by J. K. Rowling.', 'write'), ('Rice', ['is grown'], 'in China.', 'grow')],
                 [('This car made in Japan. →', ['This car was made in Japan.', 'This car is made in Japan.']), ('Tea is grow in India. →', ['Tea is grown in India.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'sasha-b1', 'code': '3B', 'title': 'Made in…', 'level': 'B1', 'category': 'Inventions & products', 'minutes': '60 min',
                 'grammar': 'The passive: is made / was invented · by', 'date': DATE, 'gvp': {'g': 'passive present and past simple', 'v': 'inventions and products', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Саша · урок 3B', 'tags': ['B1', 'Quiz show', 'Show and tell', 'The passive'],
                 'lead': 'A quiz show to start, real facts to check, then a «show and tell»: pick up any object at home and tell its story in English.',
                 'cards': cards, 'case': {'bad': [('Tetris created in 1984.', 'Tetris was created in 1984.'), ('It was invent by Bell.', 'It was invented by Bell.')], 'ok': ['Coffee is grown in Brazil.', 'LEGO was first made in Denmark.']},
                 'sections': sections, 'hw': hw})


def ekaterina():
    P, LID = 'ek6', 'ekaterina-6'
    ids = Ids(P)
    cards = [('a voicemail', 'a recorded phone message', 'голосовое сообщение', 'I left you a voicemail.', '📞'), ('to pass on a message', 'to tell someone what another person said', 'передать сообщение', 'Can you pass on a message?', '📨'),
             ('to call back', 'to phone someone who called you', 'перезвонить', 'Please call me back.', '↩️'), ('urgent', 'very important and needing action now', 'срочный', "It's urgent!", '🚨'),
             ('to cancel', 'to say something will not happen', 'отменить', 'The meeting is cancelled.', '❌'), ('to postpone', 'to move to a later time', 'перенести (на потом)', 'They postponed the trip.', '⏭️'),
             ('a misunderstanding', 'when people understand something differently', 'недоразумение', 'It was a misunderstanding.', '🤷'), ('to remind', 'to help someone remember', 'напомнить', 'Remind me tomorrow.', '🔔')]
    vm = [('f3', "Hi Kate, it's Olga. I'm calling about Saturday. The dinner is cancelled because my mum is ill."), ('f3', "We'll have it next Saturday instead. Can you tell Max? I can't find his number."),
          ('m3', "Hello, this is Dr Petrov's office. Your appointment is on Tuesday at 10, not Thursday. Please call us back if you can't come."),
          ('f4', "Kate! It's Lena. I've lost my keys! Are you at home tonight? I'll come and get the spare ones at seven.")]
    sections = [
        ('phone', 'Telephone game', 'broken telephone', '10 min',
         route([('📞', 'broken telephone'), ('🎧', 'three voicemails'), ('🔍', 'how we report'), ('🎭', 'role-play: the office'), ('✉️', 'a message note')])
         + rubric('a', 'Play «broken telephone»: your teacher says a sentence quietly; you write it and say it back. How much changed? Then try it the other way round.', '«Испорченный телефон» с преподавателем.')
         + lines(ids, ['Sentence 1: …', 'Sentence 2: …'])),
        ('voicemails', 'Listening', 'three voicemails', '12 min',
         rubric('a', 'Kate has three voicemails. Listen and pass on the messages: who said what?', 'У Кейт три голосовых. Кто что сказал?')
         + listening(P + '-lis', vm, "Kate's voicemails", 'Listen twice', '📱', {'f3': 'Olga', 'm3': "Doctor's office", 'f4': 'Lena'})
         + deck('Details', [mc(P + '-q1', 'Why is the dinner cancelled?', ["Olga's mum is ill.", 'Olga is busy.', 'Max is ill.'], 0), mc(P + '-q2', 'When is the appointment?', ['Tuesday at 10', 'Thursday at 10', 'Tuesday at 7'], 0),
                            mc(P + '-q3', 'What has Lena lost?', ['her keys', 'her phone', 'her bag'], 0)])),
        ('report', 'Grammar', 'how we pass on messages', '12 min',
         rubric('a', 'Compare what they said and how Kate reports it. What changes?', 'Сравните прямую речь и пересказ. Что меняется?')
         + roleplay(('They said 💬', ['«The dinner <b>is</b> cancelled.»', '«We<b>\'ll</b> have it next Saturday.»', '«I<b>\'ve lost</b> my keys!»', '«<b>Can</b> you tell Max?»']),
                    ('Kate reports 🗣️', ['Olga said the dinner <b>was</b> cancelled.', 'She said they <b>would</b> have it next Saturday.', 'Lena said she <b>had lost</b> her keys.', 'Olga asked me <b>to tell</b> Max.']))
         + easy('She said (that) she had lost…',
                'Пересказываем чужие слова — время делает <b>шаг назад</b>: is → <b>was</b>, will → <b>would</b>, have lost → <b>had lost</b>, can → <b>could</b>. Местоимения меняются по смыслу (I → she). '
                '<b>say</b> что-то, <b>tell</b> кому-то что-то. Просьба → <b>asked me to</b> + глагол.',
                [[('Lena', 'a'), ('said', 'd'), ('she had lost', 'c'), ('her keys.', 'b')], [('Olga', 'a'), ('told me', 'd'), ('the dinner was', 'c'), ('cancelled.', 'b')], [('She', 'a'), ('asked me', 'd'), ('to tell', 'c'), ('Max.', 'b')]],
                [('🍽️', 'Olga said the dinner was cancelled.'), ('🔑', 'Lena said she had lost her keys.'), ('📞', 'Olga asked me to tell Max.')],
                [('She said me that…', 'She told me that… / She said that…', 'say — без «me»; tell me.'), ('She said she will come.', 'She said she would come.', 'will → would.')])
         + ex_gaps(ids, [('«I\'m tired.» → She said she', ['was'], 'tired.', ''), ('«I\'ll call you.» → He said he', ['would'], 'call me.', ''), ('«I can\'t come.» → She said she', ["couldn't", 'could not'], 'come.', ''),
                         ('«Please call back.» → They asked me', ['to call'], 'back.', ''), ('He', ['told'], 'me the meeting was postponed.', 'say / tell')])),
        ('office', 'Role-play', 'at the office', '12 min',
         rubric('a', 'Role-play. You work at a reception. Take three phone messages (from your teacher), then report them to «your boss» (also your teacher!).', 'Вы на ресепшене: примите три сообщения и передайте их «начальнику».')
         + roleplay(('You: receptionist', ['Answer: «Good morning, … How can I help?»', 'Write down each message.', 'Check: «So you want me to tell him that…?»', 'Report to the boss: «Mr Ivanov called. He said that…»']),
                    ('Teacher: callers and boss', ['Caller 1: a client — the meeting must be postponed.', 'Caller 2: a courier — the parcel will arrive at 3.', 'Caller 3: the boss\'s wife — urgent, call her back!']))
         + lines(ids, ['Message 1: …', 'Message 2: …', 'Message 3: …'])
         + vocab_section(ids, '3B', 'Messages', cards, [('to move to a later time →', 'to postpone', ['to postpone', 'to cancel', 'to remind'], ''), ('very important and needing action now →', 'urgent', ['urgent', 'cancelled', 'late'], '')], [])),
        ('note', 'Writing', 'a message note', '8 min', rubric('a', 'Write a note to Max passing on Olga\'s message (3–4 sentences, reported speech).', 'Записка Максу: перескажите сообщение Ольги.')
         + lines(ids, ['Max, Olga called. She said…', 'She told me…', 'She asked me to…']) + send_box()),
    ]
    hw = hw_pair(ids, [('a recorded phone message →', 'a voicemail', ['a voicemail', 'a letter', 'a note'], ''), ('to say something will not happen →', 'to cancel', ['to cancel', 'to postpone', 'to remind'], ''),
                       ('when people understand something differently →', 'a misunderstanding', ['a misunderstanding', 'a message', 'an argument'], '')],
                 [('urgent', 'urgent', ['urgent', 'urban', 'argent']), ('postpone', 'postpone', ['postpone', 'post on', 'postman']), ('call back', 'call back', ['call back', 'cold back', 'call bag'])],
                 [('Please call me', ['back'], '.'), ('Can you pass', ['on'], 'a message?'), ('', ['Remind'], 'me tomorrow, please.')],
                 'Report the sentences.', 'Перескажите.', [('«I live in Kazan.» → He said he', ['lived'], 'in Kazan.', ''), ('«I\'ve finished.» → She said she', ['had finished'], '.', ''),
                                                            ('«We will be late.» → They said they', ['would be'], 'late.', ''), ('«Close the door, please.» → He asked me', ['to close'], 'the door.', '')],
                 [('She said me she was tired. →', ['She told me she was tired.', 'She said she was tired.']), ('He said he will call. →', ['He said he would call.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'ekaterina', 'code': '3B', 'title': 'Can You Pass On a Message?', 'level': 'B1', 'category': 'Phone & messages', 'minutes': '60 min',
                 'grammar': 'Reported speech: said / told / asked me to · tense back-shift', 'date': DATE, 'gvp': {'g': 'reported statements and requests', 'v': 'phone messages', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Екатерина · урок 3B', 'tags': ['B1', 'Messages', 'Role-play', 'Reported speech'],
                 'lead': 'Broken telephone, real voicemails and a busy reception desk: today you pass on messages — exactly what you need when someone says «Can you tell her that…?»',
                 'cards': cards, 'case': {'bad': [('She said me…', 'She told me…'), ('He said he will call.', 'He said he would call.')], 'ok': ['Lena said she had lost her keys.', 'Olga asked me to tell Max.']},
                 'sections': sections, 'hw': hw})


def iola():
    P, LID = 'io6', 'iola-6'
    ids = Ids(P)
    cards = [('to volunteer', 'to work without pay to help others', 'работать волонтёром', 'I volunteer at an animal shelter.', '🙋'), ('a shelter', 'a place where homeless animals or people stay', 'приют', 'a dog shelter', '🏠'),
             ('a charity', 'an organisation that helps people in need', 'благотворительная организация', 'She works for a charity.', '💝'), ('to raise money', 'to collect money for a good cause', 'собирать деньги', 'We raised money for the hospital.', '💰'),
             ('a fundraiser', 'an event to raise money', 'благотворительное мероприятие', 'a fundraiser concert', '🎪'), ('to make a difference', 'to have a good effect', 'изменить к лучшему', 'You can make a difference.', '🌟'),
             ('a cause', 'an idea or aim that people support', 'дело, цель', 'a good cause', '🎗️'), ('a litter pick', 'an event where people collect rubbish', 'уборка мусора', 'a beach litter pick', '🗑️')]
    sections = [
        ('intro', 'Lead-in', 'helping hands', '8 min',
         route([('🙋', 'your ideas'), ('📖', 'meet three volunteers'), ('🔍', 'have done vs have been doing'), ('🎨', 'project: a campaign'), ('🎤', 'present')])
         + rubric('a', 'Which kind of volunteering would you choose?', 'Какое волонтёрство вы бы выбрали?')
         + opinion(ids, ['helping at an animal shelter', 'reading to old people', 'cleaning a beach or park', 'teaching children', 'organising a fundraiser'], ['😍 yes!', '🙂 maybe', '😐 not for me'])),
        ('read', 'Reading', 'three volunteers', '12 min',
         rubric('a', 'Read about three volunteers. Who has done the most?', 'Кто из волонтёров сделал больше всего?')
         + reading('Meet the Volunteers', 'a local newspaper · about 150 words', [
             'Masha, 19: I\'ve been volunteering at a dog shelter for two years. I\'ve walked hundreds of dogs, and I\'ve found homes for twelve of them!',
             'Pyotr, 67: I\'ve been reading to children at the library every Saturday since I retired. We\'ve read about forty books together this year.',
             'Alina, 33: Our team has been organising beach litter picks since May. So far we\'ve collected more than two tonnes of rubbish.'])
         + deck('True or false?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
             ('Masha has found homes for twelve dogs.', True), ('Pyotr started reading to children last month.', False), ('Alina\'s team has collected more than two tonnes of rubbish.', True)])])),
        ('compare', 'Grammar', 'done or doing?', '12 min',
         rubric('a', 'Look at the pairs. Which one is about <b>how long</b> (the activity), and which about <b>how many / the result</b>?', 'Какое предложение — о длительности, а какое — о результате?')
         + examples(["I<mark>'ve been volunteering</mark> for two years. — I<mark>'ve found</mark> homes for twelve dogs.", "Our team <mark>has been organising</mark> litter picks since May. — We<mark>'ve collected</mark> two tonnes."])
         + easy("have been doing vs have done",
                '<b>have been + -ing</b> — процесс и <b>сколько времени</b> (for, since, How long…?). <b>have + V3</b> — <b>результат</b> и <b>сколько штук</b> (twelve dogs, two tonnes, How many…?).',
                [[("I've been volunteering", 'd'), ('for two years.', 'b')], [("I've found", 'c'), ('homes for twelve dogs.', 'b')]],
                [('🐕', "I've been volunteering for two years."), ('🏡', "I've found homes for twelve dogs."), ('🗑️', "We've collected two tonnes of rubbish.")],
                [("I've been finding homes for twelve dogs.", "I've found homes for twelve dogs.", 'Сколько штук → have + V3.'), ("I've volunteered since 8 a.m. and I'm tired.", "I've been volunteering since 8 a.m. and I'm tired.", 'Процесс и усталость → been + -ing.')],
                choose=[('Как долго? Процесс', 'have been + -ing'), ('Сколько? Результат', 'have + V3')])
         + ex_select(ids, [("I", "'ve been walking", ["'ve been walking", "'ve walked"], 'dogs all morning — I\'m exhausted!'), ('She', "'s raised", ["'s raised", "'s been raising"], '€500 so far.'),
                           ('How long', 'have you been volunteering', ['have you been volunteering', 'have you volunteered'], 'here?'), ('How many books', 'have you read', ['have you read', 'have you been reading'], 'together?')])),
        ('project', 'Project', 'a volunteering campaign', '16 min',
         cycle('<p>Create a campaign to find volunteers for a cause you care about (animals, nature, children, old people…).</p>',
               lines(ids, ['Name of the campaign: …', 'Our cause: …', "We've been … since…", "So far we've…", 'We need volunteers who can…', 'Slogan: …']),
               '<p>Present your campaign in 1–2 minutes as if to a group of students. Your teacher will ask questions like «How long have you been…?» and «How many… have you…?».</p>')
         + vocab_section(ids, '4A', 'Volunteering', cards, [('an event to raise money →', 'a fundraiser', ['a fundraiser', 'a shelter', 'a charity'], ''), ('to have a good effect →', 'to make a difference', ['to make a difference', 'to raise money', 'to volunteer'], '')], [])
         + send_box()),
    ]
    hw = hw_pair(ids, [('a place where homeless animals stay →', 'a shelter', ['a shelter', 'a charity', 'a cause'], ''), ('an organisation that helps people in need →', 'a charity', ['a charity', 'a fundraiser', 'a shelter'], ''),
                       ('to collect money for a good cause →', 'to raise money', ['to raise money', 'to make a difference', 'to volunteer'], '')],
                 [('a charity', 'a charity', ['a charity', 'a cherry', 'a chair']), ('volunteer', 'volunteer', ['volunteer', 'volume', 'voluntary']), ('a cause', 'a cause', ['a cause', 'a course', 'a case'])],
                 [('You can make a', ['difference'], '.'), ('We', ['raised'], 'money for the hospital.'), ('a beach litter', ['pick'], '')],
                 'have been + -ing or have + V3?', 'Процесс или результат?', [("I", ["'ve been cleaning", 'have been cleaning'], 'the park since 9.', 'clean'), ("We", ["'ve collected", 'have collected'], '50 bags of rubbish.', 'collect'),
                                                                             ('How long', ['have you been'], 'learning English?', 'you / learn'), ('She', ["'s written", 'has written'], 'three letters today.', 'write')],
                 [("I've been reading three books this month. →", ["I've read three books this month.", 'I have read three books this month.']), ("How long have you volunteered here? (still now, process) →", ['How long have you been volunteering here?'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'iola', 'code': '4A', 'title': 'Volunteers Wanted', 'level': 'B1', 'category': 'Volunteering', 'minutes': '60 min',
                 'grammar': 'Present perfect simple vs continuous: how long vs how many', 'date': DATE, 'gvp': {'g': 'present perfect simple vs continuous', 'v': 'volunteering and charity', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Иола · урок 4A', 'tags': ['B1', 'Volunteering', 'Project', 'have done / have been doing'],
                 'lead': 'Three real-life volunteers, the difference between «I\'ve been doing» and «I\'ve done» — and your own volunteering campaign to present.',
                 'cards': cards, 'case': {'bad': [("I've been finding twelve homes.", "I've found twelve homes.")], 'ok': ["I've been volunteering for two years.", "We've collected two tonnes."]},
                 'sections': sections, 'hw': hw})


def milana():
    P, LID = 'ml6', 'milana-6'
    ids = Ids(P)
    cards = [('thrilling', 'very exciting', 'захватывающий', 'a thrilling ride', '🎢'), ('terrified', 'very, very frightened', 'в ужасе', 'I was terrified!', '😱'),
             ('exhausting', 'making you very tired', 'изматывающий', 'an exhausting climb', '🥵'), ('amazed', 'very surprised', 'поражённый', 'I was amazed by the view.', '🤩'),
             ('a bungee jump', 'jumping from a height on a long elastic rope', 'банджи-джампинг', 'my first bungee jump', '🪢'), ('an adrenaline junkie', 'a person who loves danger and excitement', 'любитель адреналина', "He's an adrenaline junkie.", '⚡'),
             ('a harness', 'straps that hold you safely', 'страховочная обвязка', 'Check your harness!', '🧗'), ('to scream', 'to shout loudly because of fear or excitement', 'кричать', 'Everyone screamed.', '🗯️')]
    lines_ = [('f4', "So, Mila, tell me about the bungee jump!"), ('f3', "Oh, it was such an amazing experience! But honestly, I was so terrified at the top."),
              ('f4', 'How high was it?'), ('f3', 'Sixty metres. When I looked down, the river looked so tiny. My legs were shaking.'),
              ('f4', 'And then?'), ('f3', 'The instructor checked my harness, counted to three, and I jumped. I screamed the whole time! It was the most thrilling five seconds of my life.'),
              ('f4', 'Would you do it again?'), ('f3', "Maybe! The worst part wasn't the jump — it was the waiting. Waiting is so exhausting."), ('f4', "You're such an adrenaline junkie!")]
    sections = [
        ('survey', 'Survey', 'are you a thrill seeker?', '10 min',
         route([('📋', 'survey'), ('🎧', 'a bungee story'), ('🔍', 'bored or boring?'), ('🏆', 'quiz show'), ('📝', 'your scariest moment')])
         + rubric('a', 'Answer the survey. Then ask your teacher the same questions.', 'Ответьте на вопросы, потом спросите преподавателя.')
         + opinion(ids, ['Would you try a bungee jump?', 'Do you like roller coasters?', 'Would you swim with sharks?', 'Would you fly in a hot-air balloon?', 'Would you walk on a glass bridge?'], ['yes! 😎', 'maybe 😬', 'never! 😱'])),
        ('listen', 'Listening', 'the bungee jump', '10 min',
         rubric('a', 'Mila tells a friend about her first bungee jump. What was the worst part?', 'Что было самым страшным?')
         + listening(P + '-lis', lines_, 'Mila\'s first bungee jump', 'Listen twice', '🪢', {'f4': 'Friend', 'f3': 'Mila'})
         + mc(P + '-g', 'What was the worst part?', ['the waiting', 'the jump', 'the instructor'], 0)
         + ex_gaps(ids, [('The jump was', ['sixty', '60'], 'metres high.'), ('It was the most thrilling five', ['seconds'], 'of her life.')], size=10)),
        ('adj', 'Grammar', 'terrified or terrifying?', '12 min',
         rubric('a', 'Notice: which adjective describes a <b>feeling</b>, which describes the <b>thing</b> that causes it?', 'Какое прилагательное — о чувстве, а какое — о том, что его вызывает?')
         + examples(['I was <mark>terrified</mark>. — It was <mark>terrifying</mark>.', 'I was <mark>exhausted</mark>. — Waiting is <mark>exhausting</mark>.', 'It was <mark>such</mark> an amazing experience. — I was <mark>so</mark> terrified.'])
         + easy('bored vs boring · so vs such',
                '<b>-ed</b> — как <b>я себя чувствую</b> (I\'m bored). <b>-ing</b> — какое что-то <b>есть</b>, что вызывает чувство (the film is boring). '
                '<b>so</b> + прилагательное (so terrified). <b>such (a/an)</b> + прилагательное + существительное (such an amazing experience).',
                [[('I', 'a'), ('was', 'd'), ('terrified.', 'c')], [('The jump', 'a'), ('was', 'd'), ('terrifying.', 'c')], [('It was', 'a'), ('such', 'd'), ('an amazing', 'c'), ('day!', 'b')]],
                [('😱', 'I was so terrified!'), ('🎢', 'It was a terrifying ride.'), ('🤩', 'It was such an amazing experience.')],
                [("I'm boring. (=мне скучно)", "I'm bored.", 'Чувство → -ed.'), ('It was so an amazing day.', 'It was such an amazing day.', 'такой + существительное → such a/an.')])
         + ex_select(ids, [('The film was so', 'boring', ['boring', 'bored'], 'that I fell asleep.'), ('I was really', 'excited', ['excited', 'exciting'], 'about the trip.'),
                           ('It was', 'such', ['such', 'so'], 'a long walk!'), ('We were', 'so', ['so', 'such'], 'tired.'), ('The news was', 'shocking', ['shocking', 'shocked'], '.')])),
        ('quiz', 'Quiz show', 'adjective quiz', '10 min',
         rubric('a', 'Quiz show: 30 seconds per question. Ready?', 'Викторина: 30 секунд на вопрос.')
         + deck('Quiz show', [mc(P + '-z1', 'After a 10-km run you feel…', ['exhausted', 'exhausting'], 0), mc(P + '-z2', 'A horror film is…', ['frightening', 'frightened'], 0),
                              mc(P + '-z3', 'Your friend didn\'t understand the lesson. She is…', ['confused', 'confusing'], 0), mc(P + '-z4', 'What a(n) ___ view!', ['amazing', 'amazed'], 0),
                              mc(P + '-z5', 'It was ___ a nice day.', ['such', 'so'], 0)])
         + vocab_section(ids, '3B', 'Thrills', cards, [('a person who loves danger →', 'an adrenaline junkie', ['an adrenaline junkie', 'an instructor', 'a tourist'], ''), ('very exciting →', 'thrilling', ['thrilling', 'terrified', 'exhausted'], '')], [])),
        ('story', 'Writing', 'your scariest moment', '10 min',
         think(ids, 'Remember a frightening or thrilling moment in your life. Write it as a short story.', 'Вспомните страшный или захватывающий момент.',
               ['It was such a…', 'I was so…', 'The … was really …-ing', 'In the end, …']) + send_box()),
    ]
    hw = hw_pair(ids, [('very, very frightened →', 'terrified', ['terrified', 'terrifying', 'tired'], ''), ('making you very tired →', 'exhausting', ['exhausting', 'exhausted', 'excited'], ''),
                       ('straps that hold you safely →', 'a harness', ['a harness', 'a helmet', 'a rope'], '')],
                 [('thrilling', 'thrilling', ['thrilling', 'filling', 'trilling']), ('amazed', 'amazed', ['amazed', 'amazing', 'a maze']), ('terrified', 'terrified', ['terrified', 'terrific', 'terrifying'])],
                 [("He's an adrenaline", ['junkie'], '.'), ('Check your', ['harness'], '!'), ('Everyone', ['screamed'], '.')],
                 'Choose -ed or -ing, so or such.', 'Выберите -ed / -ing, so / such.', [('The lecture was', ['boring'], '.', 'bore'), ("I'm", ['interested'], 'in art.', 'interest'),
                                                                                      ('It was', ['such'], 'a beautiful day.', 'so / such'), ('She was', ['so'], 'surprised.', 'so / such')],
                 [("I'm boring, let's go out! →", ["I'm bored, let's go out!", "I'm bored. Let's go out!"]), ('It was so a good film. →', ['It was such a good film.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'milana', 'code': '3B', 'title': 'Thrill Seekers', 'level': 'B1', 'category': 'Extreme experiences', 'minutes': '55 min',
                 'grammar': '-ed / -ing adjectives (bored / boring) · so / such', 'date': DATE, 'gvp': {'g': '-ed vs -ing adjectives; so + adj, such a + adj + noun', 'v': 'thrills and feelings', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Милана · урок 3B', 'tags': ['B1', 'Thrills', 'Survey', 'Quiz show'],
                 'lead': 'Are you a thrill seeker? A survey, a first bungee jump, a quiz show — and the difference between «I\'m bored» and «I\'m boring» (very important!).',
                 'cards': cards, 'case': {'bad': [("I'm boring.", "I'm bored."), ('It was so an amazing day.', 'It was such an amazing day.')], 'ok': ['I was so terrified!', 'It was such an amazing experience.']},
                 'sections': sections, 'hw': hw})


def marina():
    P, LID = 'mr6', 'marina-6'
    ids = Ids(P)
    cards = [('to miss a flight', 'to arrive too late for your plane', 'опоздать на рейс', 'We missed our flight.', '✈️'), ('a delay', 'when something happens later than planned', 'задержка', 'a three-hour delay', '⏳'),
             ('luggage', 'bags and suitcases', 'багаж', 'Our luggage got lost.', '🧳'), ('a boarding pass', 'a ticket you show to get on a plane', 'посадочный талон', 'Have your boarding pass ready.', '🎫'),
             ('to pour', 'to rain very heavily', 'лить (о дожде)', 'It was pouring.', '🌧️'), ('a pickpocket', 'a thief who steals from bags and pockets', 'карманник', 'Watch out for pickpockets!', '👛'),
             ('to break down', 'to stop working (a car)', 'сломаться', 'The bus broke down.', '🚌'), ('a nightmare', 'a very bad experience', 'кошмар', 'The journey was a nightmare.', '😫')]
    story = [('f', 'Last summer we were flying to Italy. While we were waiting at the gate, I was reading a book and my husband was sleeping.'),
             ('f', 'Suddenly I heard our names. The plane was leaving without us!'), ('f', 'We ran to the gate. While we were running, my husband dropped his boarding pass.'),
             ('f', 'When we finally got to Rome, it was pouring with rain and our luggage wasn\'t there. What a nightmare!')]
    sections = [
        ('pictures', 'Picture story', 'what happened?', '10 min',
         route([('🖼️', 'put the story in order'), ('✍️', 'dictogloss'), ('🔍', 'background vs action'), ('🔗', 'story chain'), ('📝', 'your travel disaster')])
         + rubric('a', 'A travel disaster in five pictures. Put them in order and tell the story with your teacher.', 'Пять картинок: расставьте по порядку и расскажите историю.')
         + timeline([('📖😴', 'waiting at the gate: reading, sleeping'), ('📢', 'hearing their names'), ('🏃🎫', 'running, dropping the boarding pass'), ('🌧️', 'arriving in Rome: pouring rain'), ('🧳❌', 'no luggage')])
         + ex_select(ids, [('Picture 1 shows…', 'what they were doing at the gate', ['what they were doing at the gate', 'the end of the story', 'the rain'], ''),
                           ('The story ends with…', 'no luggage', ['no luggage', 'a book', 'a run'], '')])),
        ('dicto', 'Dictogloss', 'listen and rebuild', '14 min',
         rubric('a', 'Dictogloss: listen to Marina\'s friend tell the story. First time — just listen. Second time — write key words. Then rebuild the story as close to the original as you can.',
                'Диктоглосс: послушайте, запишите ключевые слова, восстановите текст.')
         + dictogloss(P + '-dg', story, {'f': 'Speaker'}, ids, 4, '✈️')),
        ('focus', 'Grammar', 'background and action', '10 min',
         rubric('a', 'Compare your text with the original. Which verbs are the background (what was happening)? Which are the actions?', 'Какие глаголы — фон, а какие — события?')
         + easy('I was reading when I heard…',
                '<b>Past continuous</b> (was / were + -ing) — <b>фон</b>: что происходило в тот момент. <b>Past simple</b> — <b>действие</b>, которое случилось на этом фоне. '
                '<b>while</b> + процесс (while we were waiting), <b>when</b> + короткое событие (when I heard…).',
                [[('While we', 'a'), ('were waiting,', 'd'), ('I', 'a'), ('heard', 'c'), ('our names.', 'b')], [('We', 'a'), ('were running', 'd'), ('when', 'b'), ('he', 'a'), ('dropped', 'c'), ('his pass.', 'b')]],
                [('📖', 'I was reading a book.'), ('📢', 'Suddenly I heard our names.'), ('🏃', 'While we were running, he dropped his boarding pass.')],
                [('While we waited at the gate, I was hearing our names.', 'While we were waiting at the gate, I heard our names.', 'Фон → continuous, событие → simple.')])
         + ex_gaps(ids, [('I', ['was sleeping'], 'when the phone rang.', 'sleep'), ('While she was shopping, someone', ['stole'], 'her bag.', 'steal'),
                         ('It', ['was pouring'], 'when we arrived.', 'pour'), ('We', ['were having'], 'dinner when the lights went out.', 'have')])),
        ('chain', 'Speaking', 'story chain', '10 min',
         rubric('a', 'Story chain: your teacher starts a travel disaster; you continue with one sentence (background or action), then your teacher, then you…', 'Цепочка: по очереди добавляйте предложения.')
         + picker(['We were driving to the mountains when…', 'I was standing in a queue at passport control when…', 'While we were walking around Paris, …', 'It was midnight and we were looking for our hotel when…'])
         + vocab_section(ids, '3B', 'Travel disasters', cards, [('to arrive too late for your plane →', 'to miss a flight', ['to miss a flight', 'to break down', 'to pour'], ''), ('a very bad experience →', 'a nightmare', ['a nightmare', 'a delay', 'luggage'], '')], [])),
        ('write', 'Writing', 'your travel disaster', '8 min', rubric('a', 'Write about a real (or invented) travel disaster in 5 sentences.', 'Ваша (или придуманная) неудачная поездка: 5 предложений.')
         + lines(ids, ['It was … and we were …-ing…', 'Suddenly…', 'While we were…', 'When we finally…', 'In the end…']) + send_box()),
    ]
    hw = hw_pair(ids, [('bags and suitcases →', 'luggage', ['luggage', 'a boarding pass', 'a delay'], ''), ('a thief who steals from bags →', 'a pickpocket', ['a pickpocket', 'a passenger', 'a pilot'], ''),
                       ('to stop working (a car) →', 'to break down', ['to break down', 'to miss', 'to pour'], '')],
                 [('luggage', 'luggage', ['luggage', 'language', 'lunch']), ('a delay', 'a delay', ['a delay', 'a day', 'a display']), ('pouring', 'pouring', ['pouring', 'boring', 'pointing'])],
                 [('We missed our', ['flight'], '.'), ('a three-hour', ['delay'], ''), ('Have your boarding', ['pass'], 'ready.')],
                 'Past continuous or past simple?', 'Past continuous или past simple?', [('I', ['was walking'], 'home when I saw an accident.', 'walk'), ('While they were swimming, it', ['started'], 'to rain.', 'start'),
                                                                                     ('He', ['broke'], 'his leg while he was skiing.', 'break'), ('What', ['were you doing'], 'at 8 last night?', 'you / do')],
                 [('While I cooked, the phone was ringing. →', ['While I was cooking, the phone rang.']), ('I was seeing him when I was walking. →', ['I saw him when I was walking.', 'I saw him while I was walking.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'marina', 'code': '3B', 'title': 'Travel Disasters', 'level': 'Intermediate', 'category': 'Travel stories', 'minutes': '60 min',
                 'grammar': 'Past continuous vs past simple · when / while', 'date': DATE, 'gvp': {'g': 'past continuous for background, past simple for actions; when / while', 'v': 'travel problems', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Марина · урок 3B', 'tags': ['Intermediate', 'Travel', 'Dictogloss', 'Story chain'],
                 'lead': 'A story in pictures, a dictogloss (listen, note, rebuild!) and a story chain with your teacher — all about trips that went wrong.',
                 'cards': cards, 'case': {'bad': [('While I cooked, the phone was ringing.', 'While I was cooking, the phone rang.')], 'ok': ['I was reading when I heard our names.', 'It was pouring with rain.']},
                 'sections': sections, 'hw': hw})


def ksenia():
    P, LID = 'ks6', 'ksenia-6'
    ids = Ids(P)
    cards = [('the countryside', 'land outside towns', 'сельская местность', 'a house in the countryside', '🌾'), ('peaceful', 'quiet and calm', 'спокойный, мирный', 'a peaceful village', '🕊️'),
             ('crowded', 'full of people', 'многолюдный', 'crowded streets', '👥'), ('convenient', 'easy and useful', 'удобный', 'Shops nearby are convenient.', '👌'),
             ('isolated', 'far from other people', 'изолированный', 'It can feel isolated in winter.', '🏚️'), ('the cost of living', 'how much money you need to live', 'стоимость жизни', 'The cost of living is lower.', '💸'),
             ('nightlife', 'bars, clubs and events at night', 'ночная жизнь', 'great nightlife', '🌃'), ('fresh air', 'clean air', 'свежий воздух', 'I need fresh air.', '🌬️')]
    lines_ = [('f3', "I moved to a village two years ago and honestly, life is far calmer than in Moscow. The air is much cleaner and I sleep a lot better."),
              ('m3', "I tried living in the countryside once. It was a bit too quiet for me. And the nearest supermarket was twenty minutes by car!"),
              ('f3', "Sure, it's not as convenient as the city. But the more time I spend here, the less I miss the noise."),
              ('m3', "For me, the city is far more interesting. There's so much to do. Though the cost of living is much higher, of course.")]
    sections = [
        ('poll', 'Opinion poll', 'city or countryside?', '8 min',
         route([('🗳️', 'opinion poll'), ('🎧', 'two opinions'), ('🔍', 'stronger comparisons'), ('🛠️', 'prepare'), ('🎙️', 'debate'), ('📝', 'opinion paragraph')])
         + rubric('a', 'Where is it better? Vote.', 'Где лучше? Проголосуйте.')
         + opinion(ids, ['to raise children', 'to find a job', 'to stay healthy', 'to make friends', 'to spend your old age'], ['🏙️ city', '🌾 countryside', '🤝 both'])),
        ('listen', 'Listening', 'two opinions', '10 min',
         rubric('a', 'Listen to Anna and Igor. Who prefers what?', 'Кто что предпочитает?')
         + listening(P + '-lis', lines_, 'City or village?', 'Listen twice · notice how they compare', '🏡', {'f3': 'Anna', 'm3': 'Igor'})
         + deck('Details', [mc(P + '-q1', 'Anna lives…', ['in a village', 'in Moscow', 'in a small town'], 0), mc(P + '-q2', 'What was the problem for Igor?', ['the supermarket was far', 'the neighbours', 'the price'], 0),
                            mc(P + '-q3', 'Igor admits that the city is…', ['more expensive', 'quieter', 'healthier'], 0)])),
        ('focus', 'Language focus', 'stronger comparisons', '12 min',
         rubric('a', 'How do Anna and Igor make their comparisons stronger or softer? Find the words.', 'Как они усиливают или смягчают сравнение?')
         + examples(['life is <mark>far</mark> calmer', 'the air is <mark>much</mark> cleaner', 'I sleep <mark>a lot</mark> better', 'a <mark>bit</mark> too quiet', "it's <mark>not as</mark> convenient <mark>as</mark> the city", '<mark>the more</mark> time I spend here, <mark>the less</mark> I miss the noise'])
         + reveal('📘 The rule', easy('much / far / a bit + -er · not as … as · the more…, the…',
                                       'Усилить: <b>much / far / a lot</b> + сравнительная (far calmer). Смягчить: <b>a bit / slightly</b> (a bit cheaper). «Не такой…, как» — <b>not as … as</b>. «Чем больше…, тем…» — <b>the more…, the more / the less…</b>',
                                       [[('Life', 'a'), ('is', 'd'), ('far', 'c'), ('calmer.', 'b')], [("It's", 'a'), ('not as', 'd'), ('convenient', 'c'), ('as the city.', 'b')], [('The more', 'd'), ('I stay,', 'a'), ('the less', 'd'), ('I miss it.', 'b')]],
                                       [('🌾', 'Life is far calmer here.'), ('🛒', "It's not as convenient as the city."), ('😴', 'The more time I spend here, the less I miss the noise.')],
                                       [('very calmer', 'much calmer', 'very со сравнительной не работает.'), ('not so convenient like', 'not as convenient as', 'not as … as.')]))
         + ex_gaps(ids, [('Moscow is', ['much', 'far', 'a lot'], 'bigger than Tver.', 'намного'), ('The village is', ['a bit', 'slightly'], 'colder than the city.', 'чуть-чуть'),
                         ('The countryside is not', ['as'], 'exciting as the city.', ''), ('The', ['more'], 'I work, the more tired I get.', '')])),
        ('prep', 'Prepare', 'prepare your side', '10 min',
         debate('People are happier in the countryside than in big cities.', ['much cleaner air and fresher food', 'far less stress and noise', 'a lot cheaper housing'],
                ['far more jobs and opportunities', 'much better hospitals and schools', 'a lot more culture and nightlife'], ['Far more…', 'Not nearly as … as…', 'The more…, the more…', 'I see your point, but…'])
         + think(ids, 'Choose your side. Prepare three arguments with stronger comparisons.', 'Выберите сторону и подготовьте три аргумента.', ['Argument 1: …', 'Argument 2: …', 'Argument 3: …'])),
        ('debate', 'Debate', 'the debate', '10 min',
         rubric('a', 'Debate with your teacher: 1 minute each for opening, then free discussion, then a 30-second conclusion.', 'Дебаты: вступление по минуте, свободная дискуссия, заключение.')
         + phrases(["I'd like to start by saying…", 'First of all…', "That's a fair point, but…", 'To sum up…'])
         + vocab_section(ids, '4A', 'City and countryside', cards, [('quiet and calm →', 'peaceful', ['peaceful', 'crowded', 'isolated'], ''), ('how much money you need to live →', 'the cost of living', ['the cost of living', 'nightlife', 'fresh air'], '')], [])),
        ('write', 'Writing', 'opinion paragraph', '8 min', rubric('a', 'Write an opinion paragraph (5–6 sentences).', 'Абзац-мнение.')
         + lines(ids, ['In my opinion, …', 'Firstly, …', 'Secondly, …', 'On the other hand, …', 'To sum up, …']) + send_box()),
    ]
    hw = hw_pair(ids, [('full of people →', 'crowded', ['crowded', 'peaceful', 'isolated'], ''), ('far from other people →', 'isolated', ['isolated', 'convenient', 'crowded'], ''),
                       ('bars, clubs and events at night →', 'nightlife', ['nightlife', 'fresh air', 'the countryside'], '')],
                 [('peaceful', 'peaceful', ['peaceful', 'powerful', 'painful']), ('convenient', 'convenient', ['convenient', 'convent', 'conversation']), ('isolated', 'isolated', ['isolated', 'insulated', 'illustrated'])],
                 [('I need some fresh', ['air'], '.'), ('a house in the', ['countryside'], ''), ('The cost of', ['living'], 'is lower here.')],
                 'Complete the comparisons.', 'Закончите сравнения.', [('Sochi is', ['much', 'far', 'a lot'], 'warmer than Murmansk.', 'намного'), ('My flat is', ['a bit', 'slightly'], 'smaller than yours.', 'чуть-чуть'),
                                                                     ('Buses are not', ['as'], 'fast as the metro.', ''), ('The', ['more'], 'you practise, the better you get.', '')],
                 [('The village is very calmer. →', ['The village is much calmer.', 'The village is far calmer.', 'The village is a lot calmer.']), ("It's not so cheap like the countryside. →", ["It's not as cheap as the countryside."])])
    return flex({'id': LID, 'prefix': P, 'owner': 'ksenia', 'code': '4A', 'title': 'City or Countryside?', 'level': 'Intermediate', 'category': 'Places to live', 'minutes': '60 min',
                 'grammar': 'Comparatives: much / far / a bit · not as … as · the more…, the…', 'date': DATE, 'gvp': {'g': 'modifying comparatives; not as…as; the more… the more', 'v': 'city and countryside', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Ксения · урок 4A', 'tags': ['Intermediate', 'Debate', 'City vs countryside', 'Comparatives'],
                 'lead': 'An opinion poll, two people who disagree — and a real debate. Learn to compare like a native speaker: far calmer, a bit too quiet, the more…, the less…',
                 'cards': cards, 'case': {'bad': [('very calmer', 'much calmer'), ('not so cheap like', 'not as cheap as')], 'ok': ['Life is far calmer here.', 'The more I stay, the less I miss it.']},
                 'sections': sections, 'hw': hw})


def build():
    return [yulia(), olya_b1(), sasha_b1(), ekaterina(), iola(), milana(), marina(), ksenia()]
