"""Дарья (B2) — урок 1C «Story Time»: как рассказывать истории детям на английском.
Наблюдение за учителем, инструменты сторителлинга, вопросы до / во время / после истории, narrative tenses для собственного рассказа,
микро-урок (рассказать историю «классу»), голос учителя, рефлексия. Формат — как в уроках 1A и 1B (flex)."""
from flex import *

OWNER = 'darya'
DATE = '2026-12-07'


def story_time():
    P, LID = 'dy3', 'darya-3'
    ids = Ids(P)
    cards = [
        ('a picture book', 'a children\'s book with big pictures and few words', 'книжка с картинками', 'Hold up the picture book so everyone can see.', '📚'),
        ('to predict', 'to guess what will happen next', 'предсказывать', 'What do you think will happen? Let\'s predict!', '🔮'),
        ('a repeated phrase', 'words that come again and again in a story', 'повторяющаяся фраза', '«Who\'s that walking on my bridge?» is a repeated phrase.', '🔁'),
        ('to join in', 'to start doing something together with others', 'подхватывать, присоединяться', 'The children join in with the repeated lines.', '🙌'),
        ('a prop', 'a real object you use to tell a story', 'реквизит', 'A toy bear is a great prop.', '🧸'),
        ('a pause', 'a short moment of silence', 'пауза', 'Make a dramatic pause before the end.', '⏸️'),
        ('a comprehension question', 'a question to check understanding', 'вопрос на понимание', 'Ask two comprehension questions after the story.', '❓'),
        ('an open question', 'a question with many possible answers', 'открытый вопрос', 'Why was the troll angry? — an open question.', '💭'),
        ('to act out', 'to perform a story with your body', 'разыгрывать', 'Let\'s act out the story!', '🎭'),
        ('a plot', 'the events of a story', 'сюжет', 'The plot is simple: three goats and a troll.', '🗺️'),
        ('the moral', 'the lesson of a story', 'мораль', 'What is the moral of the story?', '💡'),
        ('engaging', 'interesting and holding attention', 'увлекательный', 'Use an engaging voice.', '✨')]
    lines_ = [('f3', "Come and sit on the carpet, everyone. Today I've got a story… but first, look at my bag. What's inside?"), ('f2', 'A goat!'),
              ('f3', "Yes! A goat. And in this story, there are three goats — a little one, a middle one and a great big one. Who do you think lives under the bridge?"), ('f2', 'A monster!'),
              ('f3', "Good guess! Let's see… Once upon a time, three billy goats were living next to a river. They had eaten all the grass on their side, so they wanted to cross the bridge."),
              ('f3', 'The little goat went first. Trip, trap, trip, trap! Suddenly a voice shouted… everyone, together…'), ('f2', "Who's that walking on my bridge?"),
              ('f3', "Brilliant! It was a big, ugly troll! What do you think the little goat said?"), ('f2', "Don't eat me!"),
              ('f3', "Exactly! «Don't eat me — wait for my big brother!» … And so it went on. In the end the great big goat knocked the troll into the river, and the goats ate the green grass happily ever after."),
              ('f3', "So — how many goats were there? … Three! And how did the goats feel at the end? … Happy! Now, if you were the little goat, what would you do?")]
    sections = [
        ('lead', 'Lead-in', 'a story you remember', '7 min',
         route([('🧠', 'think'), ('🎧', 'observe a story'), ('🧰', 'storytelling toolkit'), ('🔍', 'good vs bad storytelling'), ('❓', 'questions'), ('🎬', 'tell a story'), ('📓', 'reflect')])
         + think(ids, 'Which story did you love as a child? Who told it to you? What made it special — the voice, the pictures, the ending?',
                 'Какую историю вы любили в детстве? Кто её рассказывал? Что делало её особенной? Сначала запишите, потом расскажите.',
                 ['My favourite story was… It was about…', 'My … used to tell it / read it to me…', 'It was special because…'])),
        ('watch', 'Observation', 'observe a story', '12 min',
         rubric('a', 'Listen to a teacher telling «The Three Billy Goats Gruff» to 6-year-olds. You are an observer: which techniques does she use?', 'Вы — наблюдатель: какие приёмы использует учитель?')
         + listening(P + '-lis', lines_, 'Year 1: story time on the carpet', 'Listen twice · Observe like a teacher', '🐐', {'f3': 'Miss Anna', 'f2': 'Children'})
         + deck('Observation checklist · Что вы заметили?', [
             mc(P + '-q1', 'How does she start?', ['with a mystery bag — a prop', 'by reading the title', 'with a vocabulary test'], 0),
             mc(P + '-q2', '«Who do you think lives under the bridge?» is…', ['a prediction question', 'a comprehension check', 'an instruction'], 0),
             mc(P + '-q3', 'Why does she stop and say «everyone, together…»?', ['so the children join in with the repeated phrase', 'because she forgot the words', 'to end the story'], 0),
             mc(P + '-q4', '«Trip, trap, trip, trap!» helps because…', ['sounds make the story engaging', 'it is grammar practice', 'it is a test'], 0),
             mc(P + '-q5', '«How many goats were there?» is…', ['a closed comprehension question', 'an open question', 'a prediction'], 0),
             mc(P + '-q6', '«If you were the little goat, what would you do?» is…', ['an open question to develop thinking', 'a yes/no question', 'a vocabulary drill'], 0)])
         + reveal('📜 Script', '<ol>%s</ol>' % ''.join('<li>%s</li>' % e(t) for _, t in lines_))),
        ('toolkit', 'Vocabulary', 'the storytelling toolkit', '10 min', vocab_section(ids, '1C', 'A storyteller\'s toolkit', cards, [
            ('to guess what will happen next →', 'to predict', ['to predict', 'to act out', 'to join in'], ''), ('a real object you use to tell a story →', 'a prop', ['a prop', 'a plot', 'a pause'], ''),
            ('a question with many possible answers →', 'an open question', ['an open question', 'a comprehension question', 'a repeated phrase'], ''), ('the lesson of a story →', 'the moral', ['the moral', 'the plot', 'a pause'], ''),
            ('interesting and holding attention →', 'engaging', ['engaging', 'boring', 'repeated'], '')],
            [('The children', ['join'], 'in with the repeated lines.'), ('A toy bear is a great', ['prop'], '.'), ("Let's act", ['out'], 'the story!'), ('Make a dramatic', ['pause'], 'before the end.'),
             ('What is the', ['moral'], 'of the story?')])),
        ('discover', 'Language for teachers', 'how to tell a story', '14 min',
         rubric('a', 'Compare two teachers telling the same story. Which one will keep 6-year-olds listening — and why?', 'Сравните двух учителей. Кто удержит внимание шестилеток и почему?')
         + roleplay(('Teacher 1 ❌', ['(reads fast from the book, no pictures shown) «Once upon a time there were three billy goats who wanted to cross a bridge in order to eat some grass, but there was a troll underneath it who was very unpleasant…»']),
                    ('Teacher 2 ✅', ['(shows the picture, uses a goat puppet) «Look! Three goats. Little… middle… BIG! They\'re hungry. Mmm, green grass! But… under the bridge… (pause) …who\'s there? 👀»']))
         + deck('Why is Teacher 2 better?', [mc(P + '-d1', 'Teacher 2 uses…', ['short sentences, pictures and a prop', 'long complex sentences', 'no visuals'], 0),
                                             mc(P + '-d2', 'She also…', ['makes a dramatic pause and asks a question', 'reads as fast as possible', 'translates every word'], 0),
                                             mc(P + '-d3', 'Her voice probably…', ['changes for each character', 'stays the same all the time', 'is very quiet'], 0)])
         + reveal('📘 Your toolkit · Правило: before — while — after',
                  easy('Before → while → after the story',
                       'Хорошая история на уроке — это <b>три этапа</b>. <b>Before</b>: вызвать интерес (реквизит, картинка, предсказание). <b>While</b>: паузы, разные голоса, жесты, дети <b>подхватывают</b> повторяющиеся фразы. '
                       '<b>After</b>: закрытые вопросы (проверить понимание), открытые вопросы (подумать), разыграть историю. Для собственного рассказа — <b>narrative tenses</b>: фон (were living), события (went, shouted), раньше (had eaten).',
                       [[('Look at my bag!', 'd'), ('What do you think…?', 'c')], [('Trip, trap!', 'b'), ('(pause)', 'a'), ('Everyone, together…', 'd')], [('How many…?', 'c'), ('If you were…, what would you do?', 'c')]],
                       [('🔮', 'What do you think will happen next?'), ('🔁', "Everyone, together: Who's that walking on my bridge?"), ('❓', 'How did the goats feel at the end?'), ('💭', 'If you were the little goat, what would you do?')],
                       [('Do you understand the story?', 'How many goats were there?', 'Проверяйте понимание конкретным вопросом.'),
                        ('(reading without showing pictures)', 'Hold the book up and point.', 'Картинки — главная опора у малышей.'),
                        ('Now translate the story.', "Let's act it out!", 'После истории — действие, не перевод.')],
                       note='Narrative tenses для рассказа: Once upon a time, three goats were living… · They had eaten all the grass… · Suddenly a voice shouted… · In the end…',
                       choose=[('Before', 'show a prop · picture walk · «What do you think…?»'), ('While', 'pauses · voices · gestures · repeated phrase'), ('After — check', 'closed questions: How many…? Who…?'),
                               ('After — think', 'open questions: Why…? What would you do…?'), ('After — do', 'act it out · draw · retell')]))),
        ('questions', 'Practice', 'closed or open?', '8 min',
         rubric('a', 'Sort the teacher\'s questions: closed (one right answer) or open (many answers)?', 'Закрытый вопрос (один ответ) или открытый (много ответов)?')
         + ex_select(ids, [('How many goats were there? →', 'closed', ['closed', 'open'], ''), ('Why was the troll so angry? →', 'open', ['closed', 'open'], ''), ('What colour was the grass? →', 'closed', ['closed', 'open'], ''),
                           ('What would you say to the troll? →', 'open', ['closed', 'open'], ''), ('Who went first? →', 'closed', ['closed', 'open'], ''), ('How could the goats and the troll be friends? →', 'open', ['closed', 'open'], '')])
         + rubric('b', 'Write two open questions of your own about any children\'s story you know.', 'Напишите два своих открытых вопроса.')
         + lines(ids, ['Open question 1: Why…? / How…?', 'Open question 2: What would you…?'])),
        ('auction', 'Accuracy', 'storytelling English: right or wrong?', '8 min',
         rubric('a', 'Error auction! Phrases that teachers often say at story time. Right or wrong? Bet 1–3 coins.', 'Аукцион ошибок: фразы учителей на «часе истории». Верно или нет?')
         + auction(ids, [('Once upon a time, three goats were living by a river.', True), ('They have eaten all the grass, so they wanted to cross.', False), ('Sit on the carpet, please.', True),
                         ('What do you think will happen next?', True), ('Listen the story carefully.', False), ('Suddenly a voice was shouting «Who\'s that?»', False),
                         ('In the end, they lived happily ever after.', True), ('Repeat after me all together.', True)])
         + reveal('✅ Answers and better versions', '<ul><li>They have eaten… → They <b>had eaten</b> all the grass (раньше другого события в прошлом).</li><li>Listen the story → <b>Listen to</b> the story.</li>'
                  '<li>Suddenly a voice was shouting → Suddenly a voice <b>shouted</b> (короткое событие — past simple).</li></ul>')),
        ('read', 'Reading', 'why stories matter', '10 min',
         rubric('a', 'Read the article for primary teachers. Which idea will you use at camp?', 'Какую идею вы используете в лагере?')
         + reading('Why Stories Belong in Every Young Learner Lesson', 'a teacher-training magazine · about 240 words', [
             'Children don\'t learn a language from lists. They learn it from meaning — and nothing carries meaning better than a story. Research shows that young learners who hear stories regularly remember far more new words than those who only practise vocabulary in exercises.',
             'Stories also give children a reason to listen. They want to know what happens next. When a teacher pauses before the troll appears, thirty six-year-olds hold their breath — and that attention is exactly what learning needs.',
             'The best classroom stories have three things: a simple plot, a repeated phrase and a clear ending. Repetition is not boring for small children; it is comforting. By the third time the troll shouts, the whole class is shouting with him.',
             'Don\'t worry if children don\'t understand every word. Pictures, gestures, props and your voice will carry the meaning. Translating the story, on the other hand, usually kills the magic.',
             'Finally, let the story live after you close the book. Ask children to act it out, draw their favourite moment or invent a new ending. A story that has been retold is a story that has been learned.'])
         + deck('True or false? · Верно или нет?', [mc('%s-tf%d' % (P, i + 1), q, ['True', 'False'], 0 if ok else 1) for i, (q, ok) in enumerate([
             ('Children who hear stories regularly remember more words.', True), ('Repetition is boring for small children.', False), ('A good classroom story has a simple plot and a clear ending.', True),
             ('Teachers should translate every word.', False), ('Acting out a story helps children learn it.', True)])])),
        ('microteach', 'Micro-teaching', 'tell a story', '15 min',
         cycle('<p>Choose a short children\'s story (for example «The Gingerbread Man», «Goldilocks», «Teremok» or your own). Plan how you will tell it to 6-year-olds in English in 4–5 minutes, using the before–while–after stages.</p>',
               '<p>Write your plan. Use narrative tenses for the story and include a repeated phrase, one prediction question, two closed and one open question. Take your time.</p>'
               + lines(ids, ['Before (prop / picture / prediction): …', 'Opening: Once upon a time, … was / were living…', 'Repeated phrase the children say: «…»', 'Main events (past simple): First… Then… Suddenly…',
                             'Something that had happened before (past perfect): …', 'Ending: In the end…', 'After — closed questions: …', 'After — open question: …']),
               '<p>Tell your story to your teacher — she plays a group of three excited six-year-olds! Afterwards you get two «stars» and one «wish».</p>'
               + phrases(['Come and sit on the carpet!', 'Look what I\'ve got…', 'What do you think will happen?', 'Everyone, together…', 'And then… (pause)…', 'How did … feel?', 'If you were…, what would you do?']))),
        ('voice', 'Teacher voice', 'a storyteller\'s voice', '5 min',
         rubric('a', 'A storyteller changes speed, volume and voice. Press 🔊 and repeat — then try it as a tiny goat, a big goat and a scary troll!', 'Меняйте скорость, громкость и голос: маленький козлик, большой козёл, страшный тролль.')
         + say_list([('Once upon a time…', '<u>ONCE</u> upon a <u>TIME</u>… (slow, soft)'), ('Trip, trap, trip, trap!', '<u>TRIP</u>, <u>TRAP</u> (light and fast)'), ("WHO'S that walking on MY bridge?", "<u>WHO'S</u> that walking on <u>MY</u> bridge? (deep and loud)"),
                     ('And then… (pause)… SPLASH!', 'and <u>THEN</u>… ⏸️ … <u>SPLASH</u>!'), ('And they lived happily ever after.', 'and they lived <u>HAP</u>pily ever <u>AF</u>ter ↘ (slow)')])),
        ('reflect', 'Reflection', 'teacher journal', '6 min',
         rubric('a', 'Your teacher journal: four sentences about today.', 'Дневник учителя: четыре предложения о сегодняшнем уроке.')
         + lines(ids, ['Today I learned that stories…', 'In my micro-lesson, the best moment was when…', 'Next time I will…', 'A story I want to tell at camp: …']) + send_box()),
    ]
    hw = hw_pair(ids,
                 [('to guess what will happen next →', 'to predict', ['to predict', 'to join in', 'to act out'], ''), ('the events of a story →', 'the plot', ['the plot', 'the moral', 'a prop'], ''),
                  ('words that come again and again in a story →', 'a repeated phrase', ['a repeated phrase', 'an open question', 'a pause'], '')],
                 [('Once upon a time', 'Once upon a time', ['Once upon a time', 'Once upon the time', 'One upon a time']), ('engaging', 'engaging', ['engaging', 'engineering', 'changing']),
                  ('the moral', 'the moral', ['the moral', 'the mortal', 'the mural'])],
                 [('The children joined', ['in'], 'with the repeated phrase.'), ("Let's act", ['out'], 'the story.'), ('Make a dramatic', ['pause'], '.')],
                 'Narrative tenses: write the verbs in the right form.', 'Прошедшие времена для рассказа.',
                 [('Once upon a time, three goats', ['were living'], 'by a river.', 'live — фон'), ('They', ['had eaten', "'d eaten"], 'all the grass on their side.', 'eat — раньше'),
                  ('The little goat', ['crossed'], 'the bridge first.', 'cross — событие'), ('While he was crossing, a voice', ['shouted'], '«Who\'s that?»', 'shout'),
                  ('The troll', ['had been waiting', "'d been waiting"], 'under the bridge for days.', 'wait — долго до этого')],
                 [('Listen the story carefully. →', ['Listen to the story carefully.']), ('They have eaten all the grass, so they left. →', ['They had eaten all the grass, so they left.']),
                  ('Do you understand the story? (as a comprehension check) →', ['How many goats were there?', 'Who went first?', 'How did the goats feel at the end?'])],
                 [(['were living', 'Three goats', 'by a river.'], 'Three goats were living by a river.'), (['What', 'do you think', 'will happen next?'], 'What do you think will happen next?')])
    return flex({'id': LID, 'prefix': P, 'owner': OWNER, 'code': '1C', 'title': 'Story Time', 'level': 'B2', 'category': 'Teaching young learners',
                 'minutes': '75–90 min', 'grammar': 'Storytelling: narrative tenses · before–while–after questions · closed vs open questions', 'date': DATE,
                 'gvp': {'g': 'narrative tenses for storytelling; prediction, closed and open questions', 'v': 'storytelling with young learners', 'p': "a storyteller's voice: pace, pauses, character voices"},
                 'eyebrow': 'IRIS SCHOOL · Дарья · урок 1C', 'tags': ['B2', 'Teaching young learners', 'Storytelling', 'Micro-teaching'],
                 'lead': 'Story time! 📚 Today you observe a teacher telling «The Three Billy Goats Gruff», build your storytelling toolkit, learn the before–while–after stages and the questions that make children think — '
                         'and then you tell a story yourself, to a very lively «class».',
                 'quote': ('If you want your children to be intelligent, read them fairy tales.', 'Albert Einstein (attributed)'),
                 'cards': cards, 'case': {'bad': [('They have eaten all the grass, so they wanted to cross.', 'They had eaten all the grass, so they wanted to cross.'), ('Listen the story.', 'Listen to the story.'),
                                                  ('Do you understand?', 'How many goats were there?')],
                                          'ok': ['Once upon a time, three goats were living by a river.', 'What do you think will happen next?', 'Everyone, together!', 'If you were the little goat, what would you do?']},
                 'sections': sections, 'hw': hw})


def build():
    return [story_time()]
