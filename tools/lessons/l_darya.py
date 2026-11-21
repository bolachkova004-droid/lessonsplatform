"""Дарья (B2) — будущий учитель начальных классов, вожатая в лагере, работает в профсоюзной организации; тихая и спокойная.
Курс: сильный английский B2 + английский для работы с детьми (classroom English, методика, лагерь).
Для спокойного ученика: «время подумать» перед говорением, письменная подготовка, роли с карточками, рефлексия.
1A «The First Five Minutes» — классный английский и начало урока (микропреподавание).
1B «Camp Counsellor» — лагерь: правила, дилеммы, ролевые сцены (second & third conditional)."""
from flex import *

OWNER = 'darya'
DATE = '2026-11-24'


def first_five():
    P, LID = 'dy1', 'darya'
    ids = Ids(P)
    cards = [
        ('a classroom routine', 'something you do the same way every lesson', 'классная рутина, ритуал', 'Our hello song is a classroom routine.', '🔁'),
        ('a warm-up', 'a short activity at the start of a lesson', 'разминка', 'A two-minute warm-up wakes everyone up.', '🔥'),
        ('TPR (Total Physical Response)', 'learning words by moving your body', 'TPR — обучение через движение', 'Stand up, turn around, sit down — that is TPR.', '🤸'),
        ('an ICQ (instruction-checking question)', 'a short question to check that children understood a task', 'вопрос на понимание инструкции', 'Are you working alone or with a partner?', '❓'),
        ('to model', 'to show how to do a task before children try', 'показать образец', 'Model the game with one child first.', '👩‍🏫'),
        ('to elicit', 'to get an answer from the children instead of telling them', 'вытягивать ответ у учеников', 'Elicit the word before you write it.', '🎣'),
        ('to drill', 'to repeat a word or phrase many times together', 'отрабатывать хором', 'Drill the new words in a whisper, then loudly.', '🗣️'),
        ('scaffolding', 'help that you slowly take away as children learn', 'поддержка (строительные леса)', 'Picture cards are good scaffolding.', '🏗️'),
        ('a flashcard', 'a card with a picture or a word', 'флеш-карточка', 'Show the flashcard and ask: What is it?', '🃏'),
        ('wait time', 'a few seconds of silence after a question', 'пауза после вопроса', 'Give three seconds of wait time.', '⏳'),
        ('praise', 'kind words when someone does well', 'похвала', 'Specific praise works best: Great sentence, Ira!', '🌟'),
        ('to grade your language', 'to make your English simpler for learners', 'упрощать свою речь', 'Grade your language for seven-year-olds.', '🎚️')]
    lines_ = [('f3', "Good morning, everyone!"), ('f2', 'Good morning, Miss Kate!'),
              ('f3', "Let's sing our hello song. Ready? Hello, hello, how are you?"),
              ('f3', 'Lovely singing! Now, stand up, please. Touch your nose. Touch your ears. Turn around. Sit down. Brilliant!'),
              ('f3', 'Look at my bag. What\'s in the bag today? Can you guess? Is it big or small?'), ('f2', 'Small!'),
              ('f3', "Yes, it's small. Listen… Woof, woof! What is it?"), ('f2', 'A dog!'),
              ('f3', "Great guessing, Misha! Today we're learning animal words. First, watch me. I hold up a card, I make the sound, you say the word. Watch… Meow!"),
              ('f2', 'A cat!'), ('f3', "Perfect. Now — are you saying the word or making the sound?"), ('f2', 'Saying the word!'),
              ('f3', "That's right. Hands on your heads if you're ready. OK, let's play!")]
    sections = [
        ('lead', 'Lead-in', 'your best teacher', '7 min',
         route([('🧠', 'think'), ('🎧', 'observe a lesson'), ('🧰', 'teacher toolkit'), ('🔍', 'good vs bad instructions'), ('🎬', 'teach 5 minutes'), ('📓', 'reflect')])
         + think(ids, 'Remember a primary school teacher you loved. What did he or she do in the <b>first five minutes</b> of a lesson? How did you feel?',
                 'Вспомните любимого учителя начальной школы. Что он делал в первые пять минут урока? Сначала запишите, потом расскажите.',
                 ['Her name was… She always…', 'I felt… because…', 'One thing I want to copy: …'])),
        ('watch', 'Observation', 'observe a lesson', '12 min',
         rubric('a', 'Listen to the start of an English lesson for 7-year-olds. You are an observer: which techniques does Miss Kate use?', 'Вы — наблюдатель на уроке у семилеток. Какие приёмы использует учительница?')
         + listening(P + '-lis', lines_, 'Year 2 English: the first five minutes', 'Listen twice · Observe like a teacher', '🏫', {'f3': 'Miss Kate', 'f2': 'Children'})
         + deck('Observation checklist · Что вы заметили?', [
             mc(P + '-q1', 'How does the lesson start?', ['with a greeting and a song — a routine', 'with a test', 'with homework check'], 0),
             mc(P + '-q2', 'What do the children do after the song?', ['move: TPR', 'write', 'read a text'], 0),
             mc(P + '-q3', 'How does Miss Kate introduce the topic?', ['a mystery bag and a guessing game', 'she writes the topic on the board', 'she explains in Russian'], 0),
             mc(P + '-q4', 'What does she do before the game?', ['models it: «Watch me»', 'gives a long explanation', 'puts the children in groups'], 0),
             mc(P + '-q5', '«Are you saying the word or making the sound?» is…', ['an ICQ — a check of the instructions', 'a grammar question', 'a joke'], 0),
             mc(P + '-q6', '«Great guessing, Misha!» is an example of…', ['specific praise', 'correction', 'an instruction'], 0)])),
        ('toolkit', 'Vocabulary', 'the teacher toolkit', '10 min', vocab_section(ids, '1A', "A primary teacher's toolkit", cards, [
            ('a short question to check understanding of a task →', 'an ICQ (instruction-checking question)', ['an ICQ (instruction-checking question)', 'a warm-up', 'a flashcard'], ''),
            ('to show how to do a task first →', 'to model', ['to model', 'to drill', 'to elicit'], ''),
            ('help that you slowly take away →', 'scaffolding', ['scaffolding', 'praise', 'a routine'], ''),
            ('a few seconds of silence after a question →', 'wait time', ['wait time', 'a warm-up', 'TPR (Total Physical Response)'], '')],
            [('Give three seconds of wait', ['time'], 'after a question.'), ('Show the', ['flashcard'], 'and ask: What is it?'), ('Grade your', ['language'], 'for young learners.')])),
        ('discover', 'Language for teachers', 'good instructions', '12 min',
         rubric('a', 'Compare two teachers giving the same instruction. Which is better for 7-year-olds — and why?', 'Сравните две инструкции. Какая лучше для семилеток и почему?')
         + roleplay(('Teacher 1 ❌', ['«OK, so now what I would like you to do, if you don\'t mind, is to take your pencils, and then maybe you could try to draw the animal that I am going to describe, and then we will check together, all right?»']),
                    ('Teacher 2 ✅', ['«Pencils up! 👆 Listen. I say an animal. You draw it. Watch me… (draws a cat). Ready? Are you drawing or writing?»']))
         + deck('Why is Teacher 2 better?', [mc(P + '-d1', 'Teacher 2 uses…', ['short imperatives: Listen. Draw.', 'long polite questions', 'the passive'], 0),
                                             mc(P + '-d2', 'She also…', ['models the task: «Watch me»', 'explains the grammar', 'asks children to translate'], 0),
                                             mc(P + '-d3', 'And she checks with…', ['an ICQ', 'a test', 'homework'], 0)])
         + reveal('📘 The rule · Правило: 5 steps of a good instruction',
                  easy('Get attention → short steps → model → ICQ → go!',
                       'Для детей инструкция — это <b>короткие команды</b> (imperatives), по одному шагу, с жестом. Сначала <b>покажите</b>, потом проверьте понимание <b>ICQ</b> — вопросом, на который можно ответить одним словом. '
                       'Не спрашивайте «Do you understand?» — дети всегда скажут «Yes».',
                       [[('Pencils up!', 'd'), ('Listen.', 'd'), ('I say,', 'a'), ('you draw.', 'c')], [('Watch me…', 'd'), ('(model)', 'b')], [('Are you drawing', 'c'), ('or writing?', 'c')]],
                       [('✏️', 'Pencils up! Listen. I say an animal, you draw it.'), ('👀', 'Watch me first.'), ('❓', 'Are you working alone or with a partner?'), ('🚦', "Ready? Go!")],
                       [('Do you understand?', 'Are you writing or drawing?', 'ICQ проверяет понимание, а «Do you understand?» — нет.'),
                        ('Now you will open the books and you will find page 12.', 'Books open. Page 12.', 'Коротко, по шагам.'),
                        ('Make exercise 3.', 'Do exercise 3.', 'Упражнение «делают»: do an exercise.')],
                       note='Let\'s… — вместе · Can you…, please? — вежливо · Hands up! · Pens down! · Eyes on me! · One, two, three — look at me!',
                       choose=[('Привлечь внимание', 'Eyes on me! · One, two, three — look at me!'), ('Дать задание', 'Listen. Draw. Match. Find a partner.'),
                               ('Показать', 'Watch me. / Let\'s do the first one together.'), ('Проверить понимание', 'ICQ: Are you…or…? How many…?'), ('Начать', "Ready? Go!")]))),
        ('auction', 'Accuracy', 'classroom English: right or wrong?', '8 min',
         rubric('a', 'Error auction! Teachers in Russia often say these phrases. Right or wrong? Bet 1–3 coins.', 'Аукцион ошибок: эти фразы часто говорят учителя. Верно или нет? Сделайте ставку.')
         + auction(ids, [('Open your books at page 12.', True), ('Make exercise 3.', False), ('Come to the blackboard.', False), ('Who is absent today?', True),
                         ('Write it down in your copybooks.', False), ('Let\'s check your homework.', True), ('Repeat after me.', True), ('Be quiet! Close your mouths!', False)])
         + reveal('✅ Answers and better versions', '<ul><li>Make exercise 3 → <b>Do</b> exercise 3.</li><li>blackboard → <b>the board</b> (today it is usually a whiteboard).</li>'
                  '<li>copybooks → <b>notebooks / exercise books</b>.</li><li>Close your mouths! → <b>Shh… voices off, please.</b> / <b>Quiet voices, please.</b></li></ul>')),
        ('read', 'Reading', 'what children need', '10 min',
         rubric('a', 'Read the article for new primary teachers. Which tip do you already use at camp?', 'Какой совет вы уже используете в лагере?')
         + reading('Five Things Young Learners Need in an English Lesson', 'a teacher-training magazine · about 220 words', [
             '1. Routines. A hello song, a weather check, a goodbye chant: children feel safe when they know what comes next. Safe children take risks and speak.',
             '2. Movement. Young children learn with their bodies. TPR games, action songs and «run and touch» activities are not breaks from learning — they are learning.',
             '3. Short activities. Change the activity often and mix calm tasks with lively ones. A quiet colouring task after a noisy game helps everyone settle.',
             '4. Stories. A good picture book gives language a context. Children happily hear the same story many times and soon join in with the repeated lines.',
             '5. Specific praise. «Good job» is fine, but «Great — you remembered "elephant"!» tells the child exactly what they did well. Praise the effort, not only the result.'])
         + deck('True or false? · Верно или нет?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
             ('Routines help children feel safe.', True), ('Movement is a break from learning.', False), ('It is good to mix calm and lively activities.', True),
             ('Children get bored if they hear the same story twice.', False), ('Specific praise tells the child what they did well.', True)])])),
        ('microteach', 'Micro-teaching', 'teach the first 5 minutes', '15 min',
         cycle('<p>Plan the first five minutes of an English lesson for 7-year-olds. Topic: <b>animals</b>. Include a greeting routine, a TPR warm-up, a way to introduce the topic and one game with clear instructions and an ICQ.</p>',
               '<p>Write your script below. Use short imperatives, a «Watch me» model and one ICQ. Take your time — there is no rush.</p>'
               + lines(ids, ['Greeting / routine: …', 'Warm-up (TPR): Stand up… Touch…', 'Topic: What\'s in my bag? …', 'Instructions for the game: …', 'ICQ: Are you…or…?', 'Praise: …']),
               '<p>Teach your five minutes to your teacher — she plays a class of three lively seven-year-olds! Afterwards you get two «stars» and one «wish».</p>'
               + phrases(['Good morning, everyone!', 'Eyes on me!', 'Watch me…', 'Your turn!', 'Ready? Go!', 'Brilliant listening!']))),
        ('pron', 'Teacher voice', 'a clear teacher voice', '5 min',
         rubric('a', 'A teacher\'s voice: slow, clear, with strong stress on the key word. Press 🔊 and repeat — then try it in a «whisper voice» and a «giant voice».', 'Голос учителя: медленно, чётко, ударение на главном слове.')
         + say_list([('Eyes on me!', '<u>EYES</u> on <u>ME</u>!'), ('Pencils down, please.', '<u>PEN</u>cils <u>DOWN</u>, please.'), ('Find a partner.', '<u>FIND</u> a <u>PART</u>ner.'),
                     ('Are you drawing or writing?', 'are you <u>DRAW</u>ing ↗ or <u>WRIT</u>ing ↘?'), ('Brilliant listening, everyone!', '<u>BRIL</u>liant <u>LIS</u>tening, <u>EV</u>eryone!')])),
        ('reflect', 'Reflection', 'teacher journal', '6 min',
         rubric('a', 'Every good teacher keeps a reflective journal. Write four sentences about today.', 'Хороший учитель ведёт дневник рефлексии. Четыре предложения о сегодняшнем уроке.')
         + lines(ids, ['Today I learned that…', 'In my micro-lesson, one thing went well: …', 'Next time I will…', 'A phrase I want to use at camp / school: …']) + send_box()),
    ]
    hw = hw_pair(ids,
                 [('a short activity at the start of a lesson →', 'a warm-up', ['a warm-up', 'a routine', 'praise'], ''), ('to get an answer from the children →', 'to elicit', ['to elicit', 'to model', 'to drill'], ''),
                  ('kind words when someone does well →', 'praise', ['praise', 'scaffolding', 'wait time'], '')],
                 [('Eyes on me!', 'Eyes on me!', ['Eyes on me!', 'Ice on me!', 'Eyes on the sea!']), ('Find a partner.', 'Find a partner.', ['Find a partner.', 'Fine, a partner.', 'Find a party.']),
                  ('scaffolding', 'scaffolding', ['scaffolding', 'scaffold', 'scolding'])],
                 [("Let's", ['drill'], 'the new words together.'), ('Model the game', ['first'], ', then let them play.'), ('Give children some wait', ['time'], '.')],
                 'Make the instruction short and clear: write one word.', 'Сделайте инструкцию короткой: впишите одно слово.',
                 [('', ['Open', 'Books'], 'your books at page 20.', ''), ('', ['Watch'], "me first. Then it's your turn.", ''), ('', ['Do'], 'exercise 4, please.', 'не make!'),
                  ('Are you working alone', ['or'], 'with a partner?', 'ICQ'), ('Pens', ['down'], ', eyes on me!', '')],
                 [('Make exercise 5. →', ['Do exercise 5.']), ('Come to the blackboard. →', ['Come to the board.', 'Come to the board, please.']),
                  ('Do you understand? (as an ICQ for «draw, don\'t write») →', ['Are you drawing or writing?'])])
    return flex({'id': LID, 'prefix': P, 'owner': OWNER, 'code': '1A', 'title': 'The First Five Minutes', 'level': 'B2', 'category': 'Teaching young learners',
                 'minutes': '75–90 min', 'grammar': 'Classroom English: imperatives, ICQs, Let\'s…, grading language · teacher toolkit', 'date': DATE,
                 'gvp': {'g': 'giving instructions: imperatives, sequencing, ICQs; common classroom-English mistakes', 'v': 'primary teaching methodology', 'p': 'teacher voice: stress and intonation'},
                 'eyebrow': 'IRIS SCHOOL · Дарья · урок 1A', 'tags': ['B2', 'Teaching young learners', 'Classroom English', 'Micro-teaching'],
                 'lead': 'Welcome, Darya! 🌱 Our course combines strong B2 English with the English you need as a primary teacher and a camp counsellor. '
                         'Today: the first five minutes of a lesson — observe a real-style lesson, build your teacher toolkit, learn what makes a great instruction, and teach your own micro-lesson.',
                 'quote': ('Children must be taught how to think, not what to think.', 'Margaret Mead'),
                 'cards': cards, 'case': {'bad': [('Make exercise 3.', 'Do exercise 3.'), ('Come to the blackboard.', 'Come to the board.'), ('Do you understand?', 'Are you drawing or writing?')],
                                          'ok': ['Eyes on me!', 'Watch me first.', 'Are you working alone or with a partner?', 'Brilliant listening!']},
                 'sections': sections, 'hw': hw, 'draft': False})


def camp():
    P, LID = 'dy2', 'darya-2'
    ids = Ids(P)
    cards = [
        ('a camp counsellor', 'a person who looks after children at a camp', 'вожатый', 'Darya works as a camp counsellor every summer.', '🏕️'),
        ('a cabin', 'a small wooden house where campers sleep', 'домик, корпус', 'Eight girls share a cabin.', '🛖'),
        ('homesick', 'sad because you miss your home and family', 'тоскующий по дому', 'Some children feel homesick on the first night.', '🥺'),
        ('lights out', 'the time when everyone must go to bed', 'отбой', 'Lights out is at ten.', '🌙'),
        ('a head count', 'counting the children to check nobody is missing', 'пересчёт детей', 'Do a head count before the bus leaves.', '🔢'),
        ('the buddy system', 'every child has a partner who always stays with them', 'система «напарник»', 'On the hike we use the buddy system.', '🤝'),
        ('an icebreaker', 'a game that helps people get to know each other', 'игра на знакомство', 'Start the first day with an icebreaker.', '🧊'),
        ('team-building', 'activities that help a group work together', 'командообразование', 'The raft race is great for team-building.', '🛶'),
        ('to supervise', 'to watch and be responsible for people', 'присматривать, отвечать за', 'Two counsellors supervise the lake.', '👀'),
        ('a first-aid kit', 'a box with things to treat small injuries', 'аптечка', 'Always take a first-aid kit on a hike.', '🩹'),
        ('a campfire', 'an outdoor fire where people sit and sing', 'костёр', 'We sang songs around the campfire.', '🔥'),
        ('to calm down', 'to become quiet and relaxed after being upset', 'успокоиться', 'Breathe slowly and calm down.', '🌬️')]
    debrief = [('f3', 'Max, have you got a minute? I wanted to talk about the hike yesterday.'),
               ('m3', "Sure. I still can't believe we lost Timur for twenty minutes."),
               ('f3', 'What exactly happened?'),
               ('m3', 'We stopped by the river for lunch. When we set off again, I did a head count, but I counted twenty-four instead of twenty-five. I thought I had made a mistake.'),
               ('f3', 'And Timur was still by the river?'), ('m3', 'Yes. He was looking for frogs. He had his headphones on, so he didn\'t hear us leave.'),
               ('f3', 'If you had used the buddy system, his partner would have noticed.'), ('m3', "You're right. I should have counted again. I'll never skip the buddy check again."),
               ('f3', "Don't be too hard on yourself — you found him quickly. If it happened again tomorrow, what would you do differently?"),
               ('m3', "I'd stop the whole group, do a proper head count and check every pair. And I'd ban headphones on hikes."),
               ('f3', "Good. Let's add that to the rules and tell the parents honestly. Can you write the incident report tonight?")]
    sections = [
        ('lead', 'Lead-in', 'a great counsellor', '7 min',
         route([('⭐', 'rank qualities'), ('📖', 'jigsaw reading'), ('🤔', 'dilemmas first'), ('🎧', 'a debrief'), ('🎭', 'role-play'), ('🧊', 'design an icebreaker')])
         + rubric('a', 'How important are these qualities for a camp counsellor? Choose ⭐ to ⭐⭐⭐.', 'Насколько важны эти качества для вожатого?')
         + opinion(ids, ['patience', 'a sense of humour', 'being calm in a crisis', 'creativity', 'being strict', 'listening skills', 'energy'], ['⭐', '⭐⭐', '⭐⭐⭐'])
         + think(ids, 'Which quality is your strongest? Which one would you like to develop?', 'Какое качество у вас сильнее всего? Какое хотите развить?', ['My strongest quality is… because…', "I'd like to become more…"])),
        ('words', 'Vocabulary', 'camp words', '10 min', vocab_section(ids, '1B', 'Summer camp', cards, [
            ('counting the children to check nobody is missing →', 'a head count', ['a head count', 'lights out', 'an icebreaker'], ''),
            ('a game that helps people get to know each other →', 'an icebreaker', ['an icebreaker', 'team-building', 'a campfire'], ''),
            ('sad because you miss your home →', 'homesick', ['homesick', 'exhausted', 'bored'], ''),
            ('to watch and be responsible for people →', 'to supervise', ['to supervise', 'to calm down', 'to model'], '')],
            [('', ['Lights'], 'out is at ten o\'clock.'), ('Always take a first-aid', ['kit'], 'on a hike.'), ('On the hike we use the buddy', ['system'], '.')])),
        ('jigsaw', 'Reading', 'two texts, one camp', '12 min',
         rubric('a', 'Jigsaw reading. You read text A; your teacher reads text B. Then tell each other the three most important ideas.', 'Вы читаете текст A, преподаватель — B. Потом расскажите друг другу главное.')
         + jigsaw(('A day at Pine Lake English Camp', ['7.30 wake-up music and stretching by the lake. 8.00 breakfast. 9.00–12.00 English clubs: drama, science, songs and a camp newspaper.',
                                                       'Afternoons are for sport, crafts and the lake (swimming only with two counsellors supervising). After dinner, each cabin prepares something for the evening show.',
                                                       'Lights out is at 10 p.m. for the younger campers and 10.30 for the teenagers. Counsellors meet at 10.45 to talk about the day.']),
                  ('Safety first: the counsellor\'s golden rules', ['Do a head count every time the group moves — leaving the dining hall, getting on a bus, leaving the beach.',
                                                                    'Use the buddy system on every trip: each child has a partner and checks on them at every stop.',
                                                                    'Never leave children alone near water. If a child is upset, find a quiet place, listen first and talk later.']))
         + rubric('b', 'Check: what do you know now about both texts?', 'Проверка по обоим текстам.')
         + deck('Both texts · Оба текста', [mc(P + '-j1', 'When do the English clubs happen?', ['in the morning', 'after dinner', 'at night'], 0),
                                            mc(P + '-j2', 'When must counsellors do a head count?', ['every time the group moves', 'only in the morning', 'once a week'], 0),
                                            mc(P + '-j3', 'What should you do first if a child is upset?', ['listen', 'call the parents', 'give a punishment'], 0)])),
        ('dilemmas', 'Grammar', 'dilemmas first, rules later', '14 min',
         rubric('a', 'Test first! Answer the dilemmas in writing — don\'t worry about mistakes yet.', 'Сначала задание, правило потом. Ответьте письменно, не бойтесь ошибок.')
         + survey(ids, ['A child refuses to join any activity on the first day. What would you do?', 'Two campers have a fight at lunch. What would you do?',
                        'A parent calls every evening and the child cries after each call. What would you say to the parent?'])
         + rubric('b', 'Now read the rule. Then improve your answers.', 'Теперь прочитайте правило и улучшите ответы.')
         + easy('If it happened… I would… · If I had… I would have…',
                'Воображаемая ситуация <b>сейчас или в будущем</b> → <b>if + past, would + V</b> (second conditional). Размышление о <b>прошлом</b>, которое уже не изменить → <b>if + had V3, would have + V3</b> (third conditional). '
                'Вожатые постоянно так говорят на «разборах полётов».',
                [[('If a child', 'a'), ('refused', 'd'), ('to join,', 'b'), ("I'd talk", 'c'), ('to them alone.', 'b')],
                 [('If we', 'a'), ('had used', 'd'), ('the buddy system,', 'b'), ('we would have noticed', 'c'), ('sooner.', 'b')]],
                [('🥺', "If a child felt homesick, I'd give them a small job to do."), ('🤝', 'If we had used the buddy system, his partner would have noticed.'),
                 ('🔢', 'I should have counted again.'), ('🧊', "If I were you, I'd start with an icebreaker.")],
                [('If a child would cry, I would…', 'If a child cried, I would…', 'В части с if — без would.'), ('If I had known, I would told you.', 'If I had known, I would have told you.', 'would have + V3.'),
                 ('If I was you…', 'If I were you…', 'В советах — were (разговорно допустимо was).')],
                choose=[('Представляю ситуацию', 'If + past, would + V'), ('Совет', "If I were you, I'd…"), ('Разбор прошлого', 'If + had V3, would have + V3'), ('Сожаление о своём действии', 'I should have + V3')])
         + rubric('c', 'Complete the sentences.', 'Закончите предложения.')
         + ex_gaps(ids, [('If a camper', ['felt'], "homesick, I'd give them a small job.", 'feel'), ("If I were you, I", ["'d start", 'would start'], 'with an icebreaker.', 'start'),
                         ('If we', ['had checked', "'d checked"], 'every pair, we would have noticed.', 'check'), ('If he had heard us, he', ['would have come', "would've come"], 'back.', 'come'),
                         ('I', ['should have counted', "should've counted"], 'again.', 'count')])),
        ('listen', 'Listening', 'the debrief', '10 min',
         rubric('a', 'Two counsellors talk after a hike. What went wrong, and what will they change?', 'Разбор после похода: что пошло не так и что изменят?')
         + listening(P + '-lis', debrief, 'After the hike: a debrief', 'Listen twice · Notice the conditionals', '🥾', {'f3': 'Lena (senior counsellor)', 'm3': 'Max (counsellor)'})
         + mc(P + '-g', 'What went wrong?', ['A boy stayed behind at the river.', 'A boy fell into the river.', 'The group got lost in the forest.'], 0)
         + rubric('b', 'Listen again and complete the notes.', 'Послушайте ещё раз и заполните заметки.')
         + ex_gaps(ids, [('Timur was missing for', ['twenty minutes', '20 minutes'], '.'), ('The head count was', ['twenty-four', '24'], 'instead of 25.'),
                         ("Timur didn't hear them because of his", ['headphones'], '.'), ('New rule: no headphones on', ['hikes'], '.')], size=16)),
        ('roleplay', 'Speaking', 'a homesick camper', '12 min',
         rubric('a', 'Role-play. Read your card, take a minute to prepare, then talk to the «camper» (your teacher).', 'Прочитайте карточку, подготовьтесь минуту, потом поговорите с «ребёнком».')
         + roleplay(('You: the counsellor', ['It is the second night of camp. Sonya (9) is crying in her cabin after lights out.', 'Find out what is wrong. Listen first.',
                                             'Calm her down and give one practical idea (a job, a buddy, a letter home).', 'Agree on a plan for tomorrow.']),
                    ('Teacher: Sonya, 9', ['You miss your mum and your dog.', 'You don\'t know anybody in the cabin.', 'You want to go home tomorrow.', 'You like drawing.']))
         + phrases(['What\'s the matter?', "It's OK to feel sad.", 'Lots of children feel like this.', 'How about…?', 'Shall we…?', "If you like, you could…", 'Let\'s try it for one day.'])),
        ('icebreaker', 'Project', 'design an icebreaker', '12 min',
         cycle('<p>Design an icebreaker for 10-year-olds on the first evening of camp. It must work in English, take 10 minutes and need no special equipment.</p>',
               lines(ids, ['Name of the game: …', 'Number of children / how to group them: …', 'Instructions (short imperatives!): …', 'ICQ: …', 'Why it works: …']),
               '<p>Present your game to your teacher as if she were a group of new campers. Then explain your choices as a future teacher.</p>' + phrases(['Everybody, stand in a circle.', "Here's how it works…", 'Watch me first.', 'Any questions?', 'Ready? Let\'s go!']))),
        ('write', 'Writing', 'an incident report', '8 min',
         rubric('a', 'Write a short incident report about the hike (from Max\'s notes). Be factual and calm: what happened, what you did, what you will change.', 'Короткий отчёт об инциденте: факты, действия, изменения.')
         + box('<b>Useful language:</b> At approximately… · The group was… · On noticing that…, I… · No one was injured. · In future we will… · I have informed…', '📝')
         + lines(ids, ['Date and place: …', 'What happened: …', 'Action taken: …', 'Outcome: …', 'Changes for the future: …']) + send_box()),
    ]
    hw = hw_pair(ids,
                 [('the time when everyone must go to bed →', 'lights out', ['lights out', 'a head count', 'a campfire'], ''), ('a box with things for small injuries →', 'a first-aid kit', ['a first-aid kit', 'a cabin', 'a buddy'], ''),
                  ('to become quiet and relaxed after being upset →', 'to calm down', ['to calm down', 'to supervise', 'to set off'], '')],
                 [('homesick', 'homesick', ['homesick', 'handsome', 'home sweet']), ('a head count', 'a head count', ['a head count', 'a headache', 'a bed count']),
                  ('team-building', 'team-building', ['team-building', 'tea building', 'teen building'])],
                 [('We sang songs around the', ['campfire'], '.'), ('Two counsellors', ['supervise'], 'the lake.'), ('Start the first evening with an', ['icebreaker'], '.')],
                 'Complete with the second or third conditional.', 'Второй или третий тип условных.',
                 [('If a child', ['refused'], "to eat, I'd tell the nurse.", 'refuse'), ("If I were you, I", ["'d talk", 'would talk'], 'to the parents.', 'talk'),
                  ('If we', ["hadn't brought", 'had not brought'], 'the first-aid kit, it would have been a disaster.', 'not / bring'), ('She', ['should have told', "should've told"], 'us earlier.', 'tell')],
                 [("If I would see a fight, I'd stop it. →", ["If I saw a fight, I'd stop it.", 'If I saw a fight, I would stop it.']),
                  ('If we had left earlier, we would arrived on time. →', ['If we had left earlier, we would have arrived on time.', "If we'd left earlier, we would have arrived on time."])])
    return flex({'id': LID, 'prefix': P, 'owner': OWNER, 'code': '1B', 'title': 'Camp Counsellor', 'level': 'B2', 'category': 'Summer camp & leading groups',
                 'minutes': '75–90 min', 'grammar': 'Second and third conditional for dilemmas and debriefs · should have', 'date': DATE,
                 'gvp': {'g': "second conditional (dilemmas, advice: If I were you…); third conditional and should have (reflecting on incidents)", 'v': 'summer camp, safety and leading groups', 'p': ''},
                 'eyebrow': 'IRIS SCHOOL · Дарья · урок 1B', 'tags': ['B2', 'Summer camp', 'Conditionals', 'Role-play'],
                 'lead': 'Your camp experience in English: a day at an English summer camp, safety rules, a debrief after a hike that went wrong, a homesick camper — and an icebreaker of your own design. '
                         'This lesson starts with tasks; the grammar comes when you need it.',
                 'cards': cards, 'case': {'bad': [("If a child would cry, I'd help.", "If a child cried, I'd help."), ('If I had known, I would told you.', 'If I had known, I would have told you.'),
                                                  ('I should counted again.', 'I should have counted again.')],
                                          'ok': ["If I were you, I'd start with an icebreaker.", 'Do a head count every time.', 'Lights out is at ten.', 'It\'s OK to feel sad.']},
                 'sections': sections, 'hw': hw})


def build():
    return [first_five(), camp()]
