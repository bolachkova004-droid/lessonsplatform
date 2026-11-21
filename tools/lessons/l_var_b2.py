"""Ноябрь 2026, вторая волна: уроки с РАЗНОЙ структурой (не один шаблон).
Дмитрий 3C — TBL (сначала задание, язык потом): «The City of 2050», be likely to / bound to / set to.
Алексей 2B — test-teach-test: «Never Too Old to Learn», gerunds & infinitives.
Захар и Михаил 4B — квест-комната: «Escape the Museum», relative clauses + participle clauses.
Паша 4A — jigsaw + guided discovery: «Unsolved Mysteries», the passive (all forms) + it is thought that…"""
from flex import *

DATE = '2026-11-30'


def dmitry():
    P, LID = 'dm7', 'dmitry-7'
    ids = Ids(P)
    cards = [('a commute', 'the journey to and from work', 'дорога на работу', 'My commute takes an hour.', '🚇'), ('a green space', 'a park or garden in a city', 'зелёная зона', 'We need more green spaces.', '🌳'),
             ('car-free', 'without cars', 'без машин', 'The centre will be car-free.', '🚳'), ('affordable housing', 'homes people can pay for', 'доступное жильё', 'Affordable housing is the biggest problem.', '🏘️'),
             ('a skyscraper', 'a very tall building', 'небоскрёб', 'a 300-metre skyscraper', '🏙️'), ('overcrowded', 'with too many people', 'перенаселённый', 'Overcrowded trains at 8 a.m.', '👥'),
             ('to renovate', 'to repair and improve an old building', 'реконструировать', 'They renovated the old factory.', '🛠️'), ('a neighbourhood', 'an area of a city where people live', 'район', 'a quiet neighbourhood', '🏡'),
             ('urban', 'connected with cities', 'городской', 'urban planning', '🏢'), ('a 15-minute city', 'a city where you can reach everything you need in 15 minutes', 'город 15 минут', 'Paris wants to be a 15-minute city.', '⏱️')]
    lines_ = [('f3', "Welcome to «City Talk». My guest is Leo, an urban planner. Leo, what will our cities look like in 2050?"),
              ('m3', "Well, about two thirds of the world's population is likely to live in cities by then, so cities are bound to get bigger. The question is how."),
              ('f3', 'Up or out?'), ('m3', "Both, but I think the most exciting idea is the 15-minute city: everything you need — school, doctor, shops, a park — within a 15-minute walk or bike ride."),
              ('f3', 'Is it realistic?'), ('m3', "It's already happening. Paris is set to turn hundreds of streets into green spaces and bike lanes. But it's unlikely to work everywhere — some cities were built for cars."),
              ('f3', 'What about housing?'), ('m3', "That's the big problem. Rents are bound to rise if cities don't build more affordable housing. Renovating old buildings is often greener than building new skyscrapers."),
              ('f3', 'And cars?'), ('m3', "City centres are likely to become car-free. Self-driving buses may help, but honestly, the best transport is still a good pair of shoes!")]
    sections = [
        ('task', 'Task first', 'plan a neighbourhood', '15 min',
         route([('🏗️', 'task: plan a district'), ('🎧', 'listen to an expert'), ('🔍', 'notice the language'), ('🛠️', 'redo the task better'), ('🎤', 'present')])
         + rubric('a', 'No grammar yet! You and your teacher are city planners. A city has given you an old factory area (2 km²). Decide what to build. Use the English you already have.',
                  'Без грамматики! Вы — градостроители. Старая промзона 2 км². Решите, что построить, используя тот английский, что уже есть.')
         + cycle('<p>Choose 5 things for the district: housing, a park, a school, offices, a tram line, a car park, a market, a sports centre, a hospital, a skyscraper…</p>' + opinion(ids, ['affordable housing', 'a big park', 'a car park', 'a tram line', 'offices', 'a market', 'a skyscraper'], ['✅ yes', '🤔 maybe', '❌ no']),
                 lines(ids, ['Our district will have…', 'We decided not to build…, because…', 'The biggest problem might be…']),
                 '<p>Tell your teacher your plan in 2 minutes. Record yourself if you like — you will compare it with your second try.</p>')),
        ('expert', 'Listening', 'what the expert says', '10 min',
         rubric('a', 'Now listen to an urban planner. Which of his ideas were in your plan?', 'Послушайте градостроителя. Какие его идеи были в вашем плане?')
         + listening(P + '-lis', lines_, 'Podcast «City Talk»: cities in 2050', 'Listen twice · Note his predictions', '🏙️', {'f3': 'Host', 'm3': 'Leo, urban planner'})
         + deck('Details', [mc(P + '-q1', 'What is the 15-minute city?', ['everything you need within a 15-minute walk or ride', 'a city built in 15 years', 'a city with 15 districts'], 0),
                            mc(P + '-q2', 'What is Paris doing?', ['turning streets into green spaces and bike lanes', 'building skyscrapers', 'banning bikes'], 0),
                            mc(P + '-q3', 'Why is the 15-minute city unlikely everywhere?', ['some cities were built for cars', 'it is too expensive for Paris', 'people prefer long commutes'], 0),
                            mc(P + '-q4', 'What does Leo say about renovating?', ['often greener than building new', 'too slow', 'only for museums'], 0)])
         + rubric('b', 'Complete the notes.', 'Заполните заметки.')
         + ex_gaps(ids, [('By 2050 about two', ['thirds'], 'of people are likely to live in cities.'), ('Rents are bound to', ['rise'], 'without affordable housing.'),
                         ('City centres are likely to become', ['car-free'], '.')], size=14)),
        ('notice', 'Language focus', 'how experts predict', '12 min',
         rubric('a', 'Notice: how sure is Leo? Put the expressions in order from 100% to 0%.', 'Насколько Лео уверен? Расставьте выражения от 100% до 0%.')
         + examples(['Cities are <mark>bound to</mark> get bigger.', 'About two thirds <mark>are likely to</mark> live in cities.', 'Paris <mark>is set to</mark> turn streets into bike lanes.',
                     'Self-driving buses <mark>may</mark> help.', "It's <mark>unlikely to</mark> work everywhere."])
         + ex_select(ids, [('bound to →', '100% — certain', ['100% — certain', '50% — maybe', '10% — probably not'], ''), ('likely to →', '80% — probably', ['80% — probably', '100% — certain', '10% — probably not'], ''),
                           ('may / might →', '50% — maybe', ['50% — maybe', '100% — certain', '80% — probably'], ''), ('unlikely to →', '20% — probably not', ['20% — probably not', '80% — probably', '100% — certain'], ''),
                           ('be set to →', 'planned, it will happen', ['planned, it will happen', 'a guess', 'impossible'], '')])
         + reveal('📘 The rule', easy('bound to · likely to · set to + verb',
                                       'Прогнозы с разной уверенностью — это главное у экспертов. <b>be bound to</b> = точно случится. <b>be (un)likely to</b> = скорее всего (не). <b>be set to</b> = запланировано, вот-вот. '
                                       'Всё это — <b>be + … + to + глагол</b>. Можно и так: <b>There\'s a good chance that…</b>, <b>It\'s highly unlikely that…</b>',
                                       [[('Cities', 'a'), ('are bound to', 'd'), ('grow.', 'c')], [('Rents', 'a'), ('are likely to', 'd'), ('rise.', 'c')], [('Paris', 'a'), ('is set to', 'd'), ('ban cars.', 'c')]],
                                       [('🏙️', 'Cities are bound to get bigger.'), ('🏘️', 'Rents are likely to rise.'), ('🚲', 'Paris is set to build more bike lanes.'), ('🚗', "It's unlikely to work everywhere.")],
                                       [('Cities are likely grow.', 'Cities are likely to grow.', 'Не забывайте to.'), ('It is likely that rents to rise.', 'It is likely that rents will rise.', 'После that — обычное предложение.'),
                                        ('Prices are bound rising.', 'Prices are bound to rise.', 'to + простой глагол.')],
                                       choose=[('Точно', 'be bound to / be sure to'), ('Скорее всего', 'be likely to · There\'s a good chance that…'), ('Может быть', 'may / might / could'),
                                               ('Скорее всего нет', 'be unlikely to'), ('Запланировано', 'be set to · be due to')]))),
        ('practice', 'Practice', 'predictions', '8 min',
         rubric('a', 'Rewrite the predictions with the word in brackets.', 'Перепишите прогнозы со словом в скобках.')
         + ex_gaps(ids, [('Rents will almost certainly rise. → Rents are', ['bound to rise', 'sure to rise'], '.', 'bound'), ('Cars will probably disappear from the centre. → Cars are', ['likely to disappear'], 'from the centre.', 'likely'),
                         ('The new metro line opens next year (it is planned). → The new metro line is', ['set to open', 'due to open'], 'next year.', 'set'),
                         ('Flying taxis probably won\'t be common. → Flying taxis are', ['unlikely to be'], 'common.', 'unlikely')], size=16)),
        ('redo', 'Task again', 'present your plan again', '12 min',
         rubric('a', 'Now repeat your task — better! Update your district plan and present it again with at least four prediction expressions.', 'Повторите задание — лучше! Обновите план и представьте его снова.')
         + vocab_section(ids, '3C', 'The city of the future', cards, [('the journey to and from work →', 'a commute', ['a commute', 'a skyscraper', 'a neighbourhood'], ''),
                                                                      ('with too many people →', 'overcrowded', ['overcrowded', 'urban', 'car-free'], ''), ('to repair and improve an old building →', 'to renovate', ['to renovate', 'to commute', 'to rise'], '')], [],
                         'Vocabulary to upgrade your plan: tap the cards.', 'Слова, чтобы улучшить план.')
         + lines(ids, ['Our district is set to…', 'Rents are likely / unlikely to…', 'Thanks to …, people are bound to…', "There's a good chance that…", 'The biggest risk is…'])
         + phrases(['In our district…', 'The idea is that…', 'This is likely to…', "We've decided against… because…", 'Any questions?'])),
        ('debate', 'Speaking', 'your city', '8 min',
         debate('Big cities should ban private cars from the centre.', ['cleaner air and less noise', 'more space for people and parks', 'faster public transport'],
                ['problems for people with disabilities and families', 'shops in the centre may lose customers', 'not everyone can cycle in winter'],
                ['I strongly believe…', "That's bound to…", "It's unlikely to work in Moscow because…", 'On the other hand…'])),
        ('write', 'Writing', 'a vision statement', '6 min', rubric('a', 'Write a short vision statement for your district (5 sentences) and send it.', 'Короткое видение вашего района: 5 предложений.')
         + lines(ids, ['By 2035 our district…', '…is likely to…', '…is bound to…', '…is set to…', 'We hope that…']) + send_box()),
    ]
    hw = hw_pair(ids, [('a park or garden in a city →', 'a green space', ['a green space', 'a commute', 'a skyscraper'], ''), ('homes people can pay for →', 'affordable housing', ['affordable housing', 'a neighbourhood', 'urban'], ''),
                       ('connected with cities →', 'urban', ['urban', 'car-free', 'overcrowded'], '')],
                 [('a commute', 'a commute', ['a commute', 'a computer', 'a community']), ('skyscraper', 'skyscraper', ['skyscraper', 'sky scrapper', 'scraper']), ('likely', 'likely', ['likely', 'lately', 'lively'])],
                 [('My', ['commute'], 'takes an hour.'), ('They', ['renovated'], 'the old factory.'), ('Trains are', ['overcrowded'], 'at 8 a.m.')],
                 'Complete with bound / likely / unlikely / set + to.', 'Вставьте выражение.', [('Prices are', ['bound to', 'likely to'], 'go up — they always do.', 'точно'), ('The bridge is', ['set to', 'due to'], 'open in May.', 'запланировано'),
                                                                                              ("It's", ['unlikely to'], 'snow in Sochi in July.', 'вряд ли'), ('More people are', ['likely to'], 'work from home.', 'скорее всего')],
                 [('Cities are likely grow. →', ['Cities are likely to grow.']), ('It is bound happening. →', ['It is bound to happen.', "It's bound to happen."])])
    return flex({'id': LID, 'prefix': P, 'owner': 'dmitry', 'code': '3C', 'title': 'The City of 2050', 'level': 'B2', 'category': 'Cities & the future', 'minutes': '70 min',
                 'grammar': 'Predictions: be bound to / likely to / unlikely to / set to · There\'s a good chance that…', 'date': DATE,
                 'gvp': {'g': 'future probability: be bound / likely / unlikely / set / due to', 'v': 'cities and urban planning', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Дмитрий · урок 3C', 'tags': ['B2', 'Cities', 'Task first', 'Predictions'],
                 'lead': 'This lesson works differently: you do the task <b>first</b> — plan a new city district — then listen to an expert, notice the language he uses, and do the task again, better.',
                 'cards': cards, 'case': {'bad': [('Cities are likely grow.', 'Cities are likely to grow.'), ('Prices are bound rising.', 'Prices are bound to rise.')], 'ok': ['Rents are likely to rise.', 'Paris is set to build bike lanes.']},
                 'sections': sections, 'hw': hw})


def alexey():
    P, LID = 'ax5', 'alexey-b2-5'
    ids = Ids(P)
    cards = [('fluent', 'able to speak a language easily', 'свободно говорящий', "I'd love to be fluent in Spanish.", '🗣️'), ('a native speaker', 'a person who learned a language as a child', 'носитель языка', 'She sounds like a native speaker.', '🌍'),
             ('to pick up', 'to learn without formal study', 'нахвататься, выучить по ходу', 'I picked up some Italian on holiday.', '🧺'), ('a plateau', 'a time when you stop making progress', 'плато (застой)', 'Every learner hits a plateau.', '📉'),
             ('to brush up on', 'to improve a skill you learned before', 'освежить (навык)', 'I need to brush up on my French.', '🪥'), ('immersion', 'living in a language all day', 'погружение', 'Immersion is the fastest way.', '🌊'),
             ('spaced repetition', 'reviewing at growing intervals', 'интервальное повторение', 'Apps use spaced repetition.', '🔁'), ('to get by', 'to manage with basic skills', 'объясниться, справиться', 'I can get by in German.', '🧭'),
             ('a slip of the tongue', 'a small mistake when speaking', 'оговорка', "Don't worry, it was a slip of the tongue.", '👅'), ('motivated', 'wanting to do something', 'мотивированный', 'Adults are often more motivated.', '🔥')]
    lines_ = [('f3', "Thanks for coming, Tom. You started learning Japanese at fifty-two. Why?"),
              ('m4', "I'd always wanted to read Japanese novels in the original. I kept putting it off — work, kids, excuses. Then I retired and decided to stop making excuses."),
              ('f3', 'People say adults find it hard to learn languages.'), ('m4', "Children are better at picking up pronunciation, that's true. But adults are good at seeing patterns and planning. I'm used to working hard."),
              ('f3', 'How do you study?'), ('m4', "I avoid spending hours on grammar books. I spend twenty minutes a day on flashcards with spaced repetition, and I watch Japanese cooking shows — I enjoy watching them even when I don't understand everything."),
              ('f3', 'Have you ever wanted to give up?'), ('m4', "Many times! After a year I hit a plateau. I stopped noticing progress. A teacher suggested trying to write a diary in Japanese, and that really helped."),
              ('f3', 'Any advice?'), ('m4', "Don't wait to feel ready. Remember to make mistakes — they mean you're trying. And it's worth finding a language partner. I meet mine online every Sunday.")]
    sections = [
        ('test', 'Test', 'what do you already know?', '10 min',
         route([('🧪', 'test yourself'), ('🎧', 'interview'), ('📘', 'teach: the rules'), ('🧪', 'test again'), ('💬', 'your language story')])
         + rubric('a', 'Test first. Choose the correct form — don\'t look anything up. Then we will see what you need.', 'Сначала тест — без подсказок. Потом поймём, что нужно повторить.')
         + ex_select(ids, [('I decided', 'to learn', ['to learn', 'learning'], 'Japanese at 52.'), ('I avoid', 'spending', ['spending', 'to spend'], 'hours on grammar.'),
                           ('I enjoy', 'watching', ['watching', 'to watch'], 'cooking shows.'), ('He stopped', 'noticing', ['noticing', 'to notice'], 'progress.'),
                           ('Remember', 'to make', ['to make', 'making'], 'mistakes!'), ("It's worth", 'finding', ['finding', 'to find'], 'a language partner.'),
                           ("I'm used to", 'working', ['working', 'work'], 'hard.'), ('She suggested', 'trying', ['trying', 'to try'], 'a diary.')])),
        ('listen', 'Listening', 'never too old', '12 min',
         rubric('a', 'Listen to Tom, who started Japanese at 52. Check your test answers — every sentence is from the interview!', 'Все предложения теста — из интервью. Проверьте себя.')
         + listening(P + '-lis', lines_, 'Interview: learning Japanese at 52', 'Listen twice', '🇯🇵', {'f3': 'Interviewer', 'm4': 'Tom'})
         + deck('Details', [mc(P + '-q1', 'Why did Tom start Japanese?', ['to read Japanese novels', 'for work', 'his wife is Japanese'], 0),
                            mc(P + '-q2', 'What are adults good at, according to Tom?', ['seeing patterns and planning', 'pronunciation', 'learning without effort'], 0),
                            mc(P + '-q3', 'What helped him after a plateau?', ['writing a diary in Japanese', 'a trip to Tokyo', 'grammar books'], 0)])
         + ex_gaps(ids, [('He spends', ['twenty minutes', '20 minutes'], 'a day on flashcards.'), ('He meets his language partner every', ['Sunday'], '.')], size=14)),
        ('teach', 'Teach', 'the rules you need', '12 min',
         rubric('a', 'Now the rules — only what you need after the test.', 'Теперь правила — то, что нужно после теста.')
         + easy('verb + -ing / verb + to / change of meaning',
                'Запоминаем группами. <b>-ing</b>: enjoy, avoid, keep, mind, suggest, give up, put off, can\'t stand, it\'s worth, be used to. <b>to</b>: decide, want, hope, manage, afford, refuse, tend, learn. '
                'Смысл меняется: <b>remember / forget / stop / try + to</b> (действие впереди или цель) и <b>+ -ing</b> (действие уже было или как способ).',
                [[('I', 'a'), ('decided', 'd'), ('to learn', 'c'), ('Japanese.', 'b')], [('I', 'a'), ('avoid', 'd'), ('spending', 'c'), ('hours on grammar.', 'b')], [('I', 'a'), ('stopped', 'd'), ('noticing', 'c'), ('progress.', 'b')]],
                [('📚', 'I decided to stop making excuses.'), ('🍳', 'I enjoy watching cooking shows.'), ('📓', 'A teacher suggested trying a diary.'), ('🤝', "It's worth finding a language partner.")],
                [('I suggest to try a diary.', 'I suggest trying a diary.', 'suggest + -ing.'), ("I'm used to work hard.", "I'm used to working hard.", 'be used to + -ing.'), ('Remember making mistakes tomorrow!', 'Remember to make mistakes!', 'впереди → to.')],
                choose=[('Нравится, избегаю, откладываю', 'enjoy / avoid / put off + -ing'), ('Решил, удалось, не могу себе позволить', 'decide / manage / afford + to'), ('После предлога и be used to', '+ -ing'),
                        ('remember / stop / try', 'to = цель или впереди · -ing = уже было или способ')])),
        ('retest', 'Test again', 'test again', '8 min',
         rubric('a', 'Test again — new sentences, same rules.', 'Повторный тест: новые предложения, те же правила.')
         + ex_gaps(ids, [('I gave up', ['learning'], 'German at school.', 'learn'), ("I can't afford", ['to spend'], 'much on lessons.', 'spend'), ('Try', ['watching'], 'films with subtitles.', 'watch — как способ'),
                         ("Don't forget", ['to book'], 'the lesson.', 'book'), ('I keep', ['making'], 'the same mistake.', 'make'), ('He managed', ['to pass'], 'the exam at 60.', 'pass')])),
        ('words', 'Vocabulary', 'language learning', '8 min', vocab_section(ids, '2B', 'Learning languages', cards, [
            ('able to speak a language easily →', 'fluent', ['fluent', 'motivated', 'native'], ''), ('to improve a skill you learned before →', 'to brush up on', ['to brush up on', 'to pick up', 'to get by'], ''),
            ('a time when you stop making progress →', 'a plateau', ['a plateau', 'immersion', 'a slip of the tongue'], '')], [('I can get', ['by'], 'in Italian.'), ('Every learner hits a', ['plateau'], '.')])),
        ('story', 'Speaking', 'your language story', '12 min',
         think(ids, 'Prepare your «language biography»: which languages, when, what worked, what didn\'t, what next.', 'Ваша «языковая биография»: что, когда, что работало, что дальше.',
               ['I started learning … when…', 'I gave up / kept…', 'What works for me is …-ing', 'I\'d like to…'])
         + picker(['Which language would you love to learn next? Why?', 'What do you avoid doing when you study?', 'Have you ever hit a plateau? What did you do?', 'Is it worth paying for a teacher?',
                   'Do you think adults learn better than children?', 'What do you remember learning at school?'])),
        ('write', 'Writing', 'advice for a 50-year-old beginner', '7 min', rubric('a', 'Write five tips for an adult who wants to start a new language. Use -ing and to.', 'Пять советов взрослому новичку.')
         + lines(ids, ["Don't avoid …-ing", "It's worth …-ing", 'Remember to…', 'Try …-ing', 'Never give up …-ing']) + send_box()),
    ]
    hw = hw_pair(ids, [('a person who learned a language as a child →', 'a native speaker', ['a native speaker', 'a learner', 'a teacher'], ''), ('living in a language all day →', 'immersion', ['immersion', 'a plateau', 'spaced repetition'], ''),
                       ('to manage with basic skills →', 'to get by', ['to get by', 'to pick up', 'to brush up on'], '')],
                 [('fluent', 'fluent', ['fluent', 'fluid', 'flu']), ('immersion', 'immersion', ['immersion', 'emotion', 'immigration']), ('a plateau', 'a plateau', ['a plateau', 'a plate', 'a palace'])],
                 [('I need to brush', ['up'], 'on my French.'), ('I', ['picked'], 'up some Spanish in Spain.'), ('Adults are often more', ['motivated'], '.')],
                 'Write the verb: -ing or to.', 'Напишите -ing или to.', [('I hope', ['to visit'], 'Japan next year.', 'visit'), ('Do you mind', ['repeating'], 'that?', 'repeat'), ('She refused', ['to give'], 'up.', 'give'), ("It's no use", ['worrying'], '.', 'worry')],
                 [('I enjoy to learn languages. →', ['I enjoy learning languages.']), ('He suggested to use an app. →', ['He suggested using an app.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'alexey-b2', 'code': '2B', 'title': 'Never Too Old to Learn', 'level': 'B2', 'category': 'Learning languages', 'minutes': '70 min',
                 'grammar': 'Gerunds and infinitives · remember / stop / try + -ing or to', 'date': DATE,
                 'gvp': {'g': 'verb patterns: -ing / to; change of meaning', 'v': 'language learning', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Алексей · урок 2B', 'tags': ['B2', 'Learning', 'Test–teach–test', '-ing or to'],
                 'lead': 'Test first, then teach, then test again: you start with what you already know, learn only the rules you need, and finish with your own language story.',
                 'cards': cards, 'case': {'bad': [('I suggest to try.', 'I suggest trying.'), ("I'm used to work hard.", "I'm used to working hard.")], 'ok': ['I decided to learn Japanese.', "It's worth finding a partner."]},
                 'sections': sections, 'hw': hw})


def zakhar_mikhail():
    P, LID = 'zm6', 'zakhar-mikhail-6'
    ids = Ids(P)
    cards = [('an exhibit', 'an object in a museum', 'экспонат', 'The exhibit was stolen.', '🏺'), ('a clue', 'a piece of information that helps solve a mystery', 'улика, подсказка', 'Find the first clue.', '🔎'),
             ('a code', 'secret numbers or letters', 'код', 'The door needs a four-digit code.', '🔢'), ('a curator', 'the person in charge of a museum collection', 'куратор', 'The curator left a message.', '🧑‍🏫'),
             ('a vault', 'a secure room for valuable things', 'хранилище', 'The vault is underground.', '🏦'), ('to unlock', 'to open with a key or code', 'открыть (замок)', 'Unlock the next door.', '🔓'),
             ('ancient', 'very old', 'древний', 'an ancient Egyptian mask', '🗿'), ('a security camera', '', 'камера наблюдения', 'The security camera was off.', '📹'),
             ('a riddle', 'a question with a clever answer', 'загадка', 'Solve the riddle.', '❓'), ('to escape', 'to get out of a place', 'сбежать, выбраться', 'You have 45 minutes to escape.', '🏃')]
    sections = [
        ('brief', 'Mission', 'the mission', '5 min',
         route([('🎬', 'mission briefing'), ('🚪', 'room 1: who / which / whose'), ('🚪', 'room 2: commas'), ('🚪', 'room 3: -ing / -ed clauses'), ('🔓', 'final code'), ('🗣️', 'debrief')])
         + box('<b>Mission:</b> You are locked in the City Museum after closing time. The curator, Ms Grey, has left clues — but they only make sense if you understand <b>relative clauses</b>. '
               'Each room gives you a word or a number. Together they make the code that opens the exit. You have 45 minutes. Work as a team!', '🏛️')
         + listening(P + '-lis', [('f3', 'Hello, team. This is Ms Grey, the curator whose museum you are now locked in. Don\'t panic.'),
                                  ('f3', 'The exit opens with a code which is hidden in three rooms. Each room has a riddle that only careful readers can solve.'),
                                  ('f3', 'The first room is the Egyptian hall, where the ancient masks are kept. Start there. Good luck — and remember: details matter.')],
                     'Voicemail from the curator', 'Listen once', '📞', {'f3': 'Ms Grey'})
         + mc(P + '-m', 'Where do you start?', ['in the Egyptian hall', 'in the vault', 'at the exit'], 0)),
        ('room1', 'Room 1', 'the Egyptian hall', '12 min',
         rubric('a', 'Read the curator\'s notes. Fill each gap with who, which, where, whose or when. The circled letters make the first code word.', 'Вставьте who / which / where / whose / when.')
         + escape(ids, [('🗿', 'Clue 1', 'The man ___ found this mask was a farmer.', ['who', 'that']), ('🏺', 'Clue 2', 'This is the hall ___ the masks are kept.', ['where']),
                        ('📜', 'Clue 3', 'The scroll ___ is next to the mask is 3,000 years old.', ['which', 'that']), ('👑', 'Clue 4', 'It belonged to a queen ___ name nobody knows.', ['whose']),
                        ('🌙', 'Clue 5', 'Come back at midnight, ___ the guards change.', ['when'])])
         + reveal('🔑 Room 1 code', '<p>Code word 1 is the object <i>which</i> is 3,000 years old (clue 3): <b>SCROLL</b>. Write it down!</p>')
         + lines(ids, ['Code word 1: …'])),
        ('room2', 'Room 2', 'the portrait gallery', '12 min',
         rubric('a', 'In this room commas matter. Choose: is the sentence correct? (Remember: no «that» after a comma!)', 'Здесь важны запятые. Предложение правильное?')
         + ex_select(ids, [('The Mona Lisa, that is in Paris, is very small. →', 'Wrong', ['Right', 'Wrong'], ''), ('Leonardo, who painted it, was also an engineer. →', 'Right', ['Right', 'Wrong'], ''),
                           ('The painting which is on your left is a copy. →', 'Right', ['Right', 'Wrong'], ''), ('Ms Grey, who\'s the curator, loves riddles. →', 'Right', ['Right', 'Wrong'], ''),
                           ('The guard which works at night is asleep. →', 'Wrong', ['Right', 'Wrong'], '')])
         + rubric('b', 'Number of «Right» answers = the second code number.', 'Количество «Right» — второе число кода.')
         + ex_gaps(ids, [('Code number 2 =', ['3', 'three'], '')], size=6)),
        ('room3', 'Room 3', 'the vault', '14 min',
         rubric('a', 'The last room: B2 shortcut! Participle clauses make relative clauses shorter. Read and discover the rule.', 'Причастные обороты сокращают придаточные. Найдите правило.')
         + examples(['the man <s>who is</s> <mark>standing</mark> by the door = the man standing by the door', 'a mask <s>which was</s> <mark>found</mark> in 1922 = a mask found in 1922',
                     'visitors <s>who want</s> <mark>wanting</mark> to see the vault…'])
         + deck('Discover · Догадайтесь', [mc(P + '-r1', '-ing clause = …', ['an active meaning (who is doing / who does)', 'a passive meaning', 'the past perfect'], 0),
                                           mc(P + '-r2', '-ed / V3 clause = …', ['a passive meaning (which was done)', 'an active meaning', 'the future'], 0)])
         + rubric('b', 'Shorten the sentences. The first letters of the answers make the final word.', 'Сократите предложения.')
         + ex_gaps(ids, [('The vault, ___ (which was built) in 1900, is underground.', ['built'], ''), ('Exhibits ___ (which are kept) here are priceless.', ['kept'], ''),
                         ('The guard ___ (who is sitting) by the camera is asleep.', ['sitting'], ''), ('A key ___ (which was hidden) under the mask opens the vault.', ['hidden'], '')], size=12)
         + reveal('🔑 Final word', '<p>Code word 3 is the room <i>built</i> in 1900, where the exhibits are <i>kept</i>: <b>VAULT</b>. Your full code: <b>SCROLL – 3 – VAULT</b>. Tell it to your teacher to escape! 🎉</p>')),
        ('debrief', 'Debrief', 'after the escape', '10 min',
         rubric('a', 'Debrief: explain to your teacher how you solved each room. Use relative and participle clauses.', 'Расскажите, как вы решили каждую комнату.')
         + phrases(['The clue which helped us most was…', 'The room where we got stuck was…', 'Zakhar, who…, found…', 'A sentence starting with «Leonardo, who…» was…'])
         + vocab_section(ids, '4B', 'Museums and mysteries', cards, [('a piece of information that helps solve a mystery →', 'a clue', ['a clue', 'a code', 'a vault'], ''), ('very old →', 'ancient', ['ancient', 'modern', 'valuable'], '')], [])),
        ('design', 'Writing', 'design a room', '10 min',
         rubric('a', 'Each of you designs one more escape room for the other: write three clues with relative or participle clauses and the answer. Then swap and solve!', 'Каждый придумывает комнату для другого: три подсказки и ответ.')
         + lines(ids, ['Clue 1: …', 'Clue 2: …', 'Clue 3: …', 'Answer / code: …']) + send_box()),
    ]
    hw = hw_pair(ids, [('an object in a museum →', 'an exhibit', ['an exhibit', 'a clue', 'a curator'], ''), ('a secure room for valuable things →', 'a vault', ['a vault', 'a hall', 'a code'], ''),
                       ('a question with a clever answer →', 'a riddle', ['a riddle', 'a clue', 'a code'], '')],
                 [('ancient', 'ancient', ['ancient', 'agent', 'anxious']), ('a curator', 'a curator', ['a curator', 'a creator', 'a cure']), ('escape', 'escape', ['escape', 'escalate', 'a cape'])],
                 [('Solve the', ['riddle'], 'to open the door.'), ('The security', ['camera'], 'was off.'), ('You have 45 minutes to', ['escape'], '.')],
                 'Complete with who, which, where, whose or a participle (-ing / V3).', 'Вставьте местоимение или причастие.',
                 [('The museum,', ['which'], 'opened in 1900, is free on Sundays.', ''), ('Visitors', ['wanting'], 'to see the vault need a ticket.', 'want'), ('a painting', ['stolen'], 'in 1911', 'steal'),
                  ('the artist', ['whose'], 'work is on the wall', '')],
                 [('The guard which works here is asleep. →', ['The guard who works here is asleep.', 'The guard that works here is asleep.']), ('Paris, that is in France, has many museums. →', ['Paris, which is in France, has many museums.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'zakhar-mikhail', 'code': '4B', 'title': 'Escape the Museum', 'level': 'B1+ → B2', 'category': 'Game: escape room', 'minutes': '75 min',
                 'grammar': 'Relative clauses (defining & non-defining) · participle clauses: the man standing…, a mask found in…', 'date': DATE, 'meta': {'privateLive': True},
                 'gvp': {'g': 'relative clauses; reduced participle clauses', 'v': 'museums, clues and mysteries', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Захар и Михаил · урок 4B', 'tags': ['B1+ → B2', 'Escape room', 'Relative clauses', 'Team game'],
                 'lead': 'Today the lesson is a game: you are locked in a museum after closing time. Solve three rooms of grammar riddles, find the code and escape — then design a room for each other!',
                 'cards': cards, 'case': {'bad': [('The guard which works here…', 'The guard who works here…'), ('Paris, that is in France…', 'Paris, which is in France…')], 'ok': ['the man standing by the door', 'a mask found in 1922']},
                 'sections': sections, 'hw': hw})


def pasha():
    P, LID = 'ps6', 'pasha-6'
    ids = Ids(P)
    cards = [('a mystery', 'something nobody can explain', 'загадка, тайна', "It's one of the great mysteries.", '❓'), ('a theory', 'an idea that tries to explain something', 'теория', 'There are many theories.', '💡'),
             ('evidence', 'facts that show something is true', 'доказательства', 'There is no evidence.', '🧾'), ('to transport', 'to move things from one place to another', 'перевозить', 'The stones were transported 200 km.', '🚚'),
             ('a monument', 'a large old structure', 'памятник, сооружение', 'an ancient monument', '🗿'), ('to date back to', 'to have existed since', 'датироваться', 'It dates back to 3000 BC.', '📅'),
             ('an archaeologist', 'a scientist who studies ancient remains', 'археолог', 'Archaeologists are still digging.', '⛏️'), ('to decode', 'to understand a secret code or writing', 'расшифровать', 'Nobody has decoded it.', '🔐'),
             ('a manuscript', 'a book written by hand', 'рукопись', 'a strange manuscript', '📜'), ('puzzling', 'difficult to understand', 'загадочный', 'a puzzling discovery', '🤔')]
    sections = [
        ('lead', 'Lead-in', 'mysteries', '6 min',
         route([('🤔', 'guess'), ('📖', 'jigsaw: two mysteries'), ('🔍', 'discover the grammar'), ('🗣️', 'tell your theory'), ('🎭', 'TV documentary')])
         + rubric('a', 'Look at the three mysteries. What do you know about them? Which would you most like to solve?', 'Что вы знаете об этих загадках? Какую хотели бы разгадать?')
         + opinion(ids, ['Stonehenge (England)', 'The Voynich Manuscript', 'The Nazca Lines (Peru)'], ['I know a lot', 'I know a little', 'Never heard of it'])),
        ('jigsaw', 'Reading', 'two mysteries', '14 min',
         rubric('a', 'Jigsaw: you read A, your teacher reads B. Then explain your mystery — your teacher asks questions.', 'Вы читаете A, преподаватель — B. Потом расскажите свою загадку.')
         + jigsaw(('Stonehenge', ['Stonehenge, in the south of England, was built in several stages, starting about 5,000 years ago. Some of its smaller stones are believed to have been transported more than 200 kilometres from Wales.',
                                  'How they were moved is still not fully understood. It is thought that the monument was used to mark the movements of the sun, because it lines up with the sunrise in midsummer.']),
                  ('The Voynich Manuscript', ['The Voynich Manuscript is a book that was handwritten in an unknown script and is full of strange drawings of plants. Its parchment has been dated to the early 1400s.',
                                              'It has been studied by codebreakers and linguists for over a century, but it has never been decoded. It is now kept at Yale University.']))
         + deck('Check both texts', [mc(P + '-j1', 'Where did some Stonehenge stones come from?', ['Wales', 'France', 'Scotland'], 0), mc(P + '-j2', 'What may Stonehenge have been used for?', ['marking the sun\'s movements', 'a castle', 'a market'], 0),
                                     mc(P + '-j3', 'Has the Voynich Manuscript been decoded?', ['No, never.', 'Yes, in 1912.', 'Yes, by Yale.'], 0)])),
        ('discover', 'Grammar', 'discover the passive', '12 min',
         rubric('a', 'Look at the highlighted verbs from the texts. Answer the questions and discover the rules yourself.', 'Посмотрите на выделенные глаголы и сами найдите правила.')
         + examples(['Stonehenge <mark>was built</mark> about 5,000 years ago.', 'How they <mark>were moved</mark> is still not understood.', 'It <mark>has never been decoded</mark>.',
                     'It <mark>is now kept</mark> at Yale.', 'The stones <mark>are believed to have been transported</mark> 200 km.', '<mark>It is thought that</mark> it was used to mark the sun.'])
         + deck('Discover', [mc(P + '-d1', 'Why do the writers use the passive?', ['who did it is unknown or not important', 'to sound informal', 'because it is the future'], 0),
                             mc(P + '-d2', '«has never been decoded» is…', ['present perfect passive', 'past simple passive', 'future passive'], 0),
                             mc(P + '-d3', '«are believed to have been transported» talks about…', ['what people believe now about the past', 'a plan for the future', 'a fact we know for sure'], 0)])
         + reveal('📘 Check the rule', easy('be + V3 in every tense · It is thought that…',
                                             'Passive — <b>be</b> в нужном времени + <b>V3</b>: is built · was built · has been built · will be built · can be seen. '
                                             'Об учёных мнениях: <b>It is thought / believed / said that…</b> или <b>X is thought to + V</b> (сейчас) / <b>to have + V3</b> (о прошлом).',
                                             [[('It', 'a'), ('has never been', 'd'), ('decoded.', 'c')], [('It', 'a'), ('is thought', 'd'), ('that it marked the sun.', 'b')], [('The stones', 'a'), ('are believed', 'd'), ('to have been transported.', 'c')]],
                                             [('🗿', 'Stonehenge was built about 5,000 years ago.'), ('📜', 'It has never been decoded.'), ('☀️', 'It is thought that it marked the sun.'), ('🚚', 'The stones are believed to have been transported from Wales.')],
                                             [('It has never decoded.', 'It has never been decoded.', 'Нужен been.'), ('It is thought to be built 5,000 years ago.', 'It is thought to have been built 5,000 years ago.', 'О прошлом → to have been + V3.'),
                                              ('The stones were transport.', 'The stones were transported.', 'V3!')],
                                             choose=[('Сейчас, обычно', 'is / are + V3'), ('В прошлом', 'was / were + V3'), ('К сегодняшнему дню', 'has / have been + V3'), ('Мнение учёных', 'It is thought that… / is believed to (have)…')]))
         + rubric('b', 'Put the verbs into the passive.', 'Поставьте глаголы в passive.')
         + ex_gaps(ids, [('The Nazca Lines', ['were discovered'], 'from planes in the 1920s.', 'discover'), ('They', ['can be seen', 'can only be seen'], 'best from the air.', 'can / see'),
                         ('More lines', ['have been found'], 'recently with drones.', 'find'), ('They', ['are thought', 'are believed'], 'to be about 2,000 years old.', 'think')])),
        ('theory', 'Speaking', 'your theory', '10 min',
         think(ids, 'Choose one mystery and prepare your own theory. Use at least three passives.', 'Выберите загадку и подготовьте свою теорию: минимум три passive.',
               ['I think it was built / made / used…', 'It is said that…', 'In my opinion, the stones were…'])
         + phrases(['It is said that…', 'It is believed to…', "I'm convinced that…", 'There is no evidence that…', 'It might have been…'])),
        ('doc', 'Project', 'TV documentary', '12 min',
         cycle('<p>You are the narrator of a 1-minute TV documentary about a mystery (real or invented).</p>',
               lines(ids, ['Opening line: For centuries…', 'It was built / discovered…', 'It is thought / believed that…', 'Some experts say…, but…', 'The mystery has never been…']),
               '<p>Read your script like a documentary narrator — slowly, dramatically! Your teacher may record it.</p>' + listening(P + '-lis', [('m3', 'For centuries, these lines have been a mystery.'), ('m3', 'They were discovered from the air in the 1920s, and they are thought to be about two thousand years old.'), ('m3', 'But why were they made? Nobody really knows.')], 'Model: a documentary narrator', 'Listen to the style', '🎬', {'m3': 'Narrator'}))
         + vocab_section(ids, '4A', 'Mysteries', cards, [('facts that show something is true →', 'evidence', ['evidence', 'a theory', 'a mystery'], ''), ('difficult to understand →', 'puzzling', ['puzzling', 'ancient', 'famous'], '')], [])
         + send_box()),
    ]
    hw = hw_pair(ids, [('an idea that tries to explain something →', 'a theory', ['a theory', 'evidence', 'a monument'], ''), ('a scientist who studies ancient remains →', 'an archaeologist', ['an archaeologist', 'a curator', 'a historian'], ''),
                       ('a book written by hand →', 'a manuscript', ['a manuscript', 'a novel', 'a map'], '')],
                 [('evidence', 'evidence', ['evidence', 'evident', 'every dance']), ('a theory', 'a theory', ['a theory', 'a story', 'a tear']), ('decode', 'decode', ['decode', 'the code', 'decade'])],
                 [('It dates', ['back'], 'to 3000 BC.'), ('There is no', ['evidence'], 'for this theory.'), ('Nobody has', ['decoded'], 'the manuscript.')],
                 'Put the verbs into the passive.', 'Поставьте глаголы в passive.', [('The pyramids', ['were built'], 'about 4,500 years ago.', 'build'), ('The museum', ['will be opened', 'is going to be opened'], 'next year.', 'open'),
                                                                                    ('This mystery', ['has never been solved'], '.', 'never / solve'), ('It', ['is said', 'is believed', 'is thought'], 'that the castle is haunted.', 'say')],
                 [('It has never solved. →', ['It has never been solved.']), ('The stones were transport by boat. →', ['The stones were transported by boat.'])])
    return flex({'id': LID, 'prefix': P, 'owner': 'pasha', 'code': '4A', 'title': 'Unsolved Mysteries', 'level': 'Intermediate+', 'category': 'History & mysteries', 'minutes': '65 min',
                 'grammar': 'The passive in all tenses · It is thought that… / is believed to (have been)…', 'date': DATE,
                 'gvp': {'g': 'the passive (present, past, present perfect, modal); reporting passive', 'v': 'mysteries and archaeology', 'p': 'documentary narration'},
                 'eyebrow': 'IRIS SCHOOL · Паша · урок 4A', 'tags': ['Intermediate+', 'Mysteries', 'Jigsaw', 'Discover the rule'],
                 'lead': 'Stonehenge, an unreadable book and lines in the desert. You read one mystery, your teacher reads another — then you discover the grammar yourself and narrate your own TV documentary.',
                 'cards': cards, 'case': {'bad': [('It has never decoded.', 'It has never been decoded.'), ('The stones were transport.', 'The stones were transported.')], 'ok': ['It is thought that it marked the sun.', 'Stonehenge was built 5,000 years ago.']},
                 'sections': sections, 'hw': hw})


def build():
    return [dmitry(), alexey(), zakhar_mikhail(), pasha()]
