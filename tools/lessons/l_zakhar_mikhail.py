"""Захар и Михаил (B1+ → B2): «What If? 5 Days of Conditionals» — ежедневные задания посложнее, только по пройденному
уроку 3A (third, second и mixed conditionals; слова missions & malfunctions) плюс продвинутые формы уровня B2:
Had I known…, But for…, If it hadn't been for…, I wish / If only + had V3, unless / as long as / otherwise.
Урок 4 (modals of deduction) ещё не пройден — его здесь нет."""
import datetime
from kit import *
from kit import _ex, gap

OWNER, LID, P = 'zakhar-mikhail', 'zakhar-mikhail-daily', 'zmd'
START = datetime.date(2026, 11, 17)
DAYS = [(START + datetime.timedelta(days=i)).isoformat() for i in range(5)]

CARDS = [
    ('to launch', 'to start sending out a product, update or rocket', 'запускать', 'A routine update was launched at 2 a.m.', '🚀'),
    ('a malfunction', 'a fault in a machine or system', 'сбой, неисправность', 'A malfunction stopped the check-in system.', '⚠️'),
    ('a backup', 'a second copy or system you use if the first fails', 'резерв, резервная копия', 'Test your backup before you need it.', '💾'),
    ('to troubleshoot', 'to find and fix problems', 'искать и устранять неполадки', 'We spent the night troubleshooting.', '🛠️'),
    ('to improvise', 'to do something without a plan, with what you have', 'импровизировать', 'Staff improvised with paper lists.', '📝'),
    ('an outage', 'a period when a service or electricity stops working', 'отключение, простой', 'The outage lasted six hours.', '🔌'),
    ('a near miss', 'a situation when a disaster almost happens', 'чуть не случившаяся беда', 'Honestly, it was a near miss.', '😮‍💨'),
    ('trial and error', 'trying different ways until one works', 'метод проб и ошибок', 'He found the answer by trial and error.', '🔁'),
    ('curious', 'wanting to know or learn about something', 'любопытный, любознательный', 'Had he been less curious, he would have thrown them away.', '🔍'),
    ('to abort', 'to stop something before it is finished', 'прервать, отменить', 'Nothing was aborted.', '⛔'),
]

PODCAST = [
    ('f', 'Welcome back to «Byte Size». Last spring a small airport lost all its computer systems for six hours. Dan, you were the engineer on duty that night. What happened?'),
    ('m2', 'At about two in the morning a routine software update was launched on the main server. Within minutes the check-in system, the screens and the baggage system all crashed.'),
    ('f', "Didn't you have a backup?"),
    ('m2', 'We did, but it was in the same building and on the same network. If the backup had been somewhere else, we would have switched over in minutes.'),
    ('f', 'So what did you do?'),
    ('m2', "We had to improvise. Staff checked passengers in by hand, with paper lists and marker pens. It was slow, but it worked. If they hadn't kept calm, it would have been chaos."),
    ('f', 'Were any flights cancelled?'),
    ('m2', 'Two early flights were delayed by three hours, but nothing was aborted. Honestly, it was a near miss. If the outage had happened at seven in the morning, thousands of people would have been stuck.'),
    ('f', 'What has changed since then?'),
    ('m2', "A lot. If we hadn't had that night, we wouldn't have a second data centre today. And now no update is installed without a test on a copy of the system first."),
    ('f', 'Last question. If you could give one piece of advice to other engineers, what would it be?'),
    ('m2', "Test your backup before you need it. A backup you've never tested is just a hope."),
]

TEXT = [
    "A · In September 1928 Alexander Fleming came back from a summer holiday to his untidy laboratory in London. On one of the dishes he had left out, a mould was growing, and around it the bacteria had died. If Fleming had cleaned his lab before he left, he might never have noticed it. It took more than ten years, and the work of other scientists, before penicillin could be produced in large quantities. Without that messy bench, the history of medicine would look very different today.",
    "B · In 1941 the Swiss engineer George de Mestral came home from a walk in the Alps and found his dog covered in burrs, tiny seeds that stick to fur. Instead of just pulling them off, he looked at them under a microscope and saw hundreds of tiny hooks. Had he been less curious, he would simply have thrown them away. After years of trial and error, he produced a fastener with hooks on one side and loops on the other: Velcro.",
    "C · In 1945 Percy Spencer, an engineer working on radar equipment, noticed that a chocolate bar in his pocket had melted. He realised that the microwaves from the radar had heated it, and he soon tested the idea with popcorn. If the chocolate hadn't melted, someone else would probably have made the discovery, but perhaps years later. The first microwave ovens were nearly as tall as a person and very expensive.",
    "D · In 1968 Spencer Silver, a chemist at the company 3M, was trying to invent a super-strong glue. Instead, he created a weak one that could be removed easily. For years nobody knew what to do with it. Then his colleague Art Fry, who sang in a church choir, got tired of his paper bookmarks falling out of his song book. If those bookmarks hadn't annoyed him, the little sticky note might never have been born.",
]


def kwt(ids, items):
    """B2 First, Use of English Part 4: (первое предложение, КЛЮЧ, начало, ответы, конец)"""
    from kit import _after
    return _ex(['<i>%s</i><br><b class="kw">%s</b> → %s%s%s' % (e(a), e(k), (e(b) + ' ') if b else '', gap(ids('k'), ans, 22), _after(e(c))) for a, k, b, ans, c in items])


def day(n, title, em, topic, mins, body):
    sid = '%s-hw-day%d' % (P, n)
    lab = 'Day %d · %s' % (n, title)
    head = intro(em, 'Day %d of 5 · %s' % (n, title), mins, 'Сегодня: %s.' % topic)
    end = rubric('✓', 'Done? Press «Отправить преподавателю».', 'Готово? Нажмите «Отправить преподавателю». Каждый отправляет свои ответы.') + send_box()
    return (sid, lab, section(sid, lab, title + ' ' + em, mins, head + body + end, lock=(DAYS[n - 1], n)))


def build():
    secs = []
    ids = Ids(P)
    plan = [('The night the airport went dark', 'listening: a podcast · which conditional?'),
            ('Happy accidents', 'reading: B2 First Part 7 · words from the text'),
            ('Use of English', 'key word transformations · open cloze'),
            ('Beyond «if»', 'Had I known… · But for… · I wish I had… · unless / as long as'),
            ('Final mission', 'mixed test · writing 140–190 words · speaking')]
    start = ('<div class="challenge-hero">%s<div><b>5 days · 25 minutes a day · B2</b><span>Только условные предложения — но на уровне экзамена</span></div></div>' % img('🧠', 'challenge-pic')
             + task([('Every day at midnight a new task opens here — five days, about 25 minutes each.', 'Каждый день в полночь открывается новое задание, примерно на 25 минут.'),
                     ('It is harder than the lesson: B2 First tasks and advanced structures.', 'Сложнее, чем на уроке: задания формата B2 First и продвинутые конструкции.'),
                     ('Only what we have done: third, second and mixed conditionals. Each of you sends his own answers.', 'Только пройденное: third, second и mixed conditionals. Каждый отправляет свои ответы.')])
             + '<div class="box"><b>The plan · План</b><ol class="items">%s</ol></div>' % ''.join('<li><b>Day %d · %s</b> — %s</li>' % (i + 1, t, d) for i, (t, d) in enumerate(plan))
             + rubric('a', 'Before you start: the map of unreal conditionals.', 'Перед стартом — карта нереальных условий.')
             + easy('2nd · 3rd · mixed — one map',
                    'Смотрите на <b>время каждой половины</b>. Нереально <b>сейчас</b> → if + past, would + V. Нереально <b>в прошлом</b> → if + had V3, would have V3. '
                    'Половины могут быть из разного времени — это <b>mixed</b>.',
                    [[('If I were in charge,', 'a'), ("I'd", 'd'), ('test every update.', 'b')],
                     [('If the backup had been elsewhere,', 'a'), ('we would have', 'd'), ('switched over.', 'b')],
                     [("If we hadn't had that night,", 'a'), ("we wouldn't have", 'd'), ('a second data centre today.', 'b')]],
                    [('🧑‍✈️', "If I were in charge, I'd test every update."),
                     ('💾', 'If the backup had been somewhere else, we would have switched over in minutes.'),
                     ('🏢', "If we hadn't had that night, we wouldn't have a second data centre today."),
                     ('😨', "If I weren't so careful, I would have lost everything last year.")],
                    [('If I would have known…', 'If I had known…', 'В части с if — никогда would.'),
                     ('If I had more time last year, I would have…', 'If I had had more time last year, I would have…', 'Прошлое → had + V3, даже если получается had had.'),
                     ("If he hadn't moved, he wouldn't have worked here now.", "If he hadn't moved, he wouldn't work here now.", 'Результат сейчас (now) → would + V.')],
                    choose=[('Нереально сейчас / вообще', 'if + past → would + V'),
                            ('Нереально в прошлом', 'if + had V3 → would have V3'),
                            ('Прошлое → результат сейчас', 'if + had V3 → would + V (now)'),
                            ('Факт сейчас → результат в прошлом', 'if + past → would have V3')]))
    secs.append((P + '-hw-prep', 'Start here', section(P + '-hw-prep', 'Start here', 'What If? 5 Days of Conditionals', '5 min', start)))

    # День 1 — аудирование
    b = (rubric('a', 'Listen to the podcast. How does Dan see that night now?', 'Послушайте подкаст. Как Дэн оценивает ту ночь сейчас?')
         + listening(P + '-lis', PODCAST, '«Byte Size»: the night the airport went dark', 'Listen twice · 🐢 if it\'s fast · Text at the end', '🛫', {'f': 'Nina (host)', 'm2': 'Dan'})
         + mc(P + '-d1-g', 'Dan sees that night as…', ['a total disaster', 'a near miss that taught them a lesson', 'a funny story'], 1)
         + rubric('b', 'Listen again. Choose the best answer (B2 First, Listening Part 4 style).', 'Послушайте ещё раз и выберите лучший ответ.')
         + deck('The airport · Детали', [
             mc(P + '-d1-q1', 'What caused the problem?', ['a hardware fault', 'a software update', 'a power cut'], 1),
             mc(P + '-d1-q2', "Why didn't the backup help?", ['It was too old.', 'It was in the same building and network.', 'Nobody knew the password.'], 1),
             mc(P + '-d1-q3', 'How were passengers checked in?', ['by hand, on paper', 'with their phones', 'They weren\'t checked in.'], 0),
             mc(P + '-d1-q4', 'What happened to the early flights?', ['Two were cancelled.', 'Two were delayed.', 'They left on time.'], 1),
             mc(P + '-d1-q5', 'Why does Dan call it a near miss?', ['A plane almost crashed.', 'At 7 a.m. thousands of people would have been stuck.', 'He almost lost his job.'], 1),
             mc(P + '-d1-q6', "What is Dan's main advice?", ['Buy a bigger server.', 'Test your backup before you need it.', 'Never install updates.'], 1)])
         + rubric('c', 'Which conditional is it?', 'Какое это условие?')
         + ex_select(ids, [('<i>If the backup had been somewhere else, we would have switched over in minutes.</i> →', 'third: imaginary past', ['second: imaginary now', 'third: imaginary past', 'mixed: past → now'], ''),
                           ("<i>If we hadn't had that night, we wouldn't have a second data centre today.</i> →", 'mixed: past → now', ['second: imaginary now', 'third: imaginary past', 'mixed: past → now'], ''),
                           ('<i>If you could give one piece of advice, what would it be?</i> →', 'second: imaginary now', ['second: imaginary now', 'third: imaginary past', 'mixed: past → now'], ''),
                           ("<i>If they hadn't kept calm, it would have been chaos.</i> →", 'third: imaginary past', ['second: imaginary now', 'third: imaginary past', 'mixed: past → now'], '')])
         + rubric('d', 'Words from the podcast: one word in each gap.', 'Слова из подкаста: одно слово в пропуск.')
         + ex_gaps(ids, [('A routine software update was', ['launched'], 'on the main server.'),
                         ('Staff had to', ['improvise'], ': paper lists and marker pens.'),
                         ('Two early flights were', ['delayed'], 'by three hours.'),
                         ('The', ['outage'], 'lasted six hours.'),
                         ("A backup you've never", ['tested'], 'is just a hope.')]))
    secs.append(day(1, 'The night the airport went dark', '🛫', 'подкаст и три вида условий на слух', '25 min', b))

    # День 2 — чтение
    opts = ['A', 'B', 'C', 'D']
    b = (rubric('a', 'Read the article. Which accident do you find the most surprising?', 'Прочитайте статью. Какая случайность удивила больше всего?')
         + reading('Happy accidents: four inventions nobody planned', 'a magazine article · about 330 words', TEXT)
         + rubric('b', 'B2 First, Reading Part 7. Which paragraph (A–D) says this? You can use a paragraph more than once.', 'В каком абзаце (A–D) это сказано? Один абзац можно выбрать несколько раз.')
         + ex_select(ids, [('An inventor studied the problem with a scientific instrument. →', 'B', opts, ''),
                           ('The aim of the research was the opposite of the result. →', 'D', opts, ''),
                           ("Someone's untidiness turned out to be useful. →", 'A', opts, ''),
                           ('A snack was used in an early test. →', 'C', opts, ''),
                           ('The first products were huge. →', 'C', opts, ''),
                           ('Other people had to develop the discovery further. →', 'A', opts, ''),
                           ('Years of experiments were needed to make the product. →', 'B', opts, ''),
                           ('A hobby outside work played a role. →', 'D', opts, '')])
         + rubric('c', 'Find the word or phrase in the text.', 'Найдите слово или выражение в тексте.')
         + ex_gaps(ids, [('not tidy (A) →', ['untidy', 'messy'], ''),
                         ('wanting to know about things (B) →', ['curious'], ''),
                         ('trying different ways until one works (B) →', ['trial and error'], ''),
                         ('became liquid because of heat (C) →', ['melted'], ''),
                         ('made someone a little angry (D) →', ['annoyed'], '')], size=16)
         + rubric('d', 'Find in the text: one third conditional, one mixed conditional and one sentence with «Had he…». Copy them.', 'Найдите в тексте третий тип, смешанный и предложение с «Had he…». Перепишите.')
         + lines(ids, ['Third conditional: If…', 'Mixed: Without…, … would… today.', 'Had he…'])
         + rubric('e', 'Your turn: an invention or a moment in YOUR life. Write two sentences.', 'Ваша очередь: изобретение или момент вашей жизни. Два предложения.')
         + lines(ids, ['If I hadn\'t…, I would never have…', 'If…, I wouldn\'t be … today.']))
    secs.append(day(2, 'Happy accidents', '🧪', 'статья о случайных изобретениях, задание B2 First Part 7', '25 min', b))

    # День 3 — Use of English
    b = (box('<b>How to do key word transformations</b><br>1) Don\'t change the key word. 2) Use <b>2–5 words</b> (contractions count as two: <i>hadn\'t</i> = had not). '
             '3) Read the full sentence again: does it mean exactly the same?<br><span class="ru-line">Ключевое слово не меняйте, пишите 2–5 слов, перечитайте всё предложение.</span>', '🎯')
         + rubric('a', 'B2 First, Use of English Part 4. Complete the second sentence so that it means the same as the first.', 'Закончите второе предложение так, чтобы смысл не изменился. 2–5 слов, включая слово в рамке.')
         + kwt(ids, [('I didn\'t know about the meeting, so I didn\'t go.', 'HAD', 'If I', ['had known', "'d known"], 'about the meeting, I would have gone.'),
                     ('We missed the flight because the taxi was late.', 'IF', "We wouldn't have missed the flight", ["if the taxi hadn't", 'if the taxi had not'], 'been late.'),
                     ('Thanks to your help, I passed the exam.', 'FOR', 'If it', ["hadn't been for", 'had not been for'], "your help, I wouldn't have passed the exam."),
                     ('I regret not learning to code at school.', 'WISH', 'I', ['wish I had learned', "wish I'd learned", 'wish I had learnt', "wish I'd learnt"], 'to code at school.'),
                     ('He didn\'t take the job in London, so he isn\'t rich now.', 'WOULD', 'If he had taken the job in London, he', ['would be rich'], 'now.'),
                     ('I\'m not good at maths, so I didn\'t become an engineer.', 'WERE', 'If I', ['were good', 'was good'], 'at maths, I would have become an engineer.'),
                     ("If you don't test the backup, you might lose everything.", 'UNLESS', 'You might lose everything', ['unless you test'], 'the backup.'),
                     ('The mission was aborted because of the malfunction.', 'WITHOUT', '', ['without the malfunction'], ", the mission wouldn't have been aborted.")])
         + rubric('b', 'Open cloze (B2 First, Part 2). Write ONE word in each gap.', 'Открытый пропуск: одно слово в каждый пропуск.')
         + box('<b>My worst day at work</b>', '💻')
         + ex_gaps(ids, [('If I', ['had'], 'checked the code before the launch, the app'),
                         ('', ["wouldn't", 'would not'], 'have crashed. And'),
                         ('', ['if'], 'my colleague hadn\'t stayed late, we would never'),
                         ('', ['have'], 'fixed it before the morning. Now I test everything:'),
                         ('', ['unless'], 'you test it, you can\'t trust it. Sometimes I wish I'),
                         ('', ['had'], 'learned this lesson earlier!')]))
    secs.append(day(3, 'Use of English', '🎯', 'key word transformations и open cloze в формате экзамена', '25 min', b))

    # День 4 — продвинутые формы
    b = (rubric('a', 'Read the steps. Press 🔊 and repeat. These are the B2 «extras» for conditionals.', 'Прочитайте шаги и повторите. Это продвинутые формы условий уровня B2.')
         + easy('Had I known… · But for… · I wish I had…',
                'Те же условия, но без привычного <b>if</b> — так звучит увереннее и «по-экзаменационному». Смысл не меняется.',
                [[('Had', 'd'), ('I', 'a'), ('known,', 'c'), ('I would have called you.', 'b')],
                 [('But for', 'd'), ('the engineers,', 'c'), ("the crew wouldn't have survived.", 'b')],
                 [('I', 'a'), ('wish', 'd'), ('I had tested', 'c'), ('the backup.', 'b')]],
                [('📞', 'Had I known, I would have called you.'),
                 ('👩‍🔧', "But for the engineers, the crew wouldn't have survived."),
                 ('💾', 'I wish I had tested the backup.'),
                 ('🤝', 'You can borrow my laptop as long as you bring it back tomorrow.')],
                [('I wish I would have known.', 'I wish I had known.', 'После wish о прошлом — had + V3.'),
                 ('Had I knew…', 'Had I known…', 'После Had — третья форма.'),
                 ("Unless you don't hurry, we'll be late.", "Unless you hurry, we'll be late.", 'unless = if … not, второе not не нужно.')],
                note='as long as / provided (that) + настоящее время = «при условии, что» · otherwise = «иначе»',
                choose=[('Если бы (тогда)… — без if', 'Had I known…, I would have…'),
                        ('Если бы не… (+ существительное)', 'But for… / If it hadn\'t been for…'),
                        ('Жаль, что (тогда)…', 'I wish / If only + had V3'),
                        ('Жаль, что (сейчас)…', 'I wish / If only + past: I wish I knew.'),
                        ('При условии, что…', 'as long as / provided (that) + present'),
                        ('Иначе…', '…; otherwise, …')])
         + rubric('b', 'Choose.', 'Выберите.')
         + ex_select(ids, [('', 'Had', ['Had', 'If', 'Were'], 'I known about the delay, I would have taken a later train.'),
                           ('But', 'for', ['for', 'of', 'without'], "the engineers, the crew wouldn't have survived."),
                           ('I wish I', 'had gone', ['had gone', 'went', 'would go'], 'to the conference last year. It was amazing!'),
                           ('If only I', 'had', ['had', 'have had', 'would have'], 'more free time now!'),
                           ('You can use my laptop', 'as long as', ['as long as', 'unless', 'otherwise'], "you're careful with it."),
                           ('We left early;', 'otherwise', ['otherwise', 'unless', 'provided'], ', we would have missed the train.')])
         + rubric('c', 'One mistake in each sentence. Write the correct sentence.', 'В каждом предложении одна ошибка. Напишите правильно.')
         + ex_lines(ids, [('If I would have known, I would have called you. → ', ['If I had known, I would have called you', "If I'd known, I would have called you", "If I had known, I'd have called you", "If I'd known, I'd have called you"]),
                          ("I wish I didn't say that yesterday. → ", ["I wish I hadn't said that yesterday", 'I wish I had not said that yesterday']),
                          ('Had I knew the answer, I would have told you. → ', ['Had I known the answer, I would have told you', "Had I known the answer, I'd have told you"]),
                          ("If it wasn't for the backup, we would have lost everything. → ", ["If it hadn't been for the backup, we would have lost everything", "If it hadn't been for the backup, we'd have lost everything", 'If it had not been for the backup, we would have lost everything']),
                          ('If he had studied harder, he would be passed the exam. → ', ['If he had studied harder, he would have passed the exam', "If he had studied harder, he'd have passed the exam", "If he'd studied harder, he would have passed the exam"])])
         + rubric('d', 'Put the words in order.', 'Соберите предложения.')
         + ex_order(ids, [(['Had I', 'known', 'I would have', 'come'], 'Had I known I would have come'),
                          (['But for', 'your help', 'I would have', 'failed'], 'But for your help I would have failed'),
                          (['I wish', 'I had', 'bought', 'that flat'], 'I wish I had bought that flat')])
         + rubric('e', 'About you: three true sentences.', 'О себе: три правдивых предложения.')
         + lines(ids, ['I wish I had… (a regret about the past)', 'But for…, I wouldn\'t…', 'Had I known…, I would have…']))
    secs.append(day(4, 'Beyond «if»', '🧩', 'Had I known…, But for…, I wish I had…, unless / as long as / otherwise', '25 min', b))

    # День 5 — финал
    b = (rubric('a', 'Final test: put the verbs in the correct form. All types are mixed!', 'Финальный тест: поставьте глаголы в нужную форму. Все типы вперемешку.')
         + ex_gaps(ids, [('If the engineers', ['had tested', "'d tested"], 'the update, the airport wouldn\'t have lost its systems.', 'test'),
                         ('If I', ['were', 'was'], 'you, I would make a backup right now.', 'be'),
                         ("If I hadn't learned English at school, I", ["wouldn't be able", 'would not be able'], 'to read this today.', 'not / be able'),
                         ('', ['Had'], 'they noticed the fault, the explosion wouldn\'t have happened.', 'one word'),
                         ('I wish I', ['had started', "'d started"], 'this course earlier.', 'start'),
                         ("If you don't test the backup, you", ['might lose', 'will lose', 'could lose', 'may lose'], 'everything.', 'lose')], size=16)
         + rubric('b', 'B2 First, Writing: a story (140–190 words). Each of you writes his own story. It must end with these words:', 'Каждый пишет свой рассказ на 140–190 слов. Он должен заканчиваться этими словами:')
         + box('«…and if I hadn\'t missed that train, I would never have met him.»<br><b>Checklist:</b> a good title · past tenses · at least one third and one mixed conditional · one «Had I…» or «But for…» · 3+ words from this week (backup, improvise, near miss, trial and error…)'
               '<span class="ru-line">Чек-лист: заголовок, прошедшие времена, минимум один третий и один смешанный тип, одна продвинутая форма, 3+ слова недели.</span>', '✍️')
         + '<ol class="items"><li><textarea class="gap line hw-say" id="%s" rows="9" placeholder="Title: … — It was a cold morning in…"></textarea></li></ol>' % ids('story')
         + rubric('c', 'Speaking: answer each question in pairs or on a voice message — about one minute each.', 'Говорение: ответьте на каждый вопрос в паре или голосовым сообщением, примерно по минуте.')
         + picker(['What is one decision in your life you would make differently? Why?', 'If you hadn\'t chosen your job, what would you be doing now?',
                   'What would happen to your work if the internet stopped for a week?', 'Tell me about a near miss you have had.',
                   'Which invention would you most like to have invented? Why?', 'Had you known English perfectly as a child, how would your life be different today?'])
         + phrases(['If I had…, I would have…', "If I hadn't…, I wouldn't be… now", 'Had I known…', 'But for…', 'I wish I had…', 'Looking back, …'])
         + rubric('d', 'How do you feel about conditionals now?', 'Как вы теперь себя чувствуете с условными предложениями?')
         + '<ol class="items selfcheck">%s</ol>' % ''.join('<li>%s <select class="gap" id="%s"><option value="">…</option><option>😃</option><option>🙂</option><option>🤔</option></select></li>'
                                                          % (e(t), ids('can')) for t in ['Third conditional', 'Mixed conditionals', 'Had I… / But for… / I wish…']))
    secs.append(day(5, 'Final mission', '🏆', 'финальный тест, рассказ в формате B2 First и говорение', '30 min', b))

    gid = LID + '-games'
    secs.append((gid, 'Games', section(gid, 'Games', 'Play and review', '10 min', games_block(LID, [(w, r) for w, _, r, _, _ in CARDS], {
        'bad': [('If I would have known, I would have come.', 'If I had known, I would have come.'), ('I wish I would have tested it.', 'I wish I had tested it.'),
                ('Had I knew, I would have called.', 'Had I known, I would have called.'), ("Unless you don't hurry, we'll be late.", "Unless you hurry, we'll be late.")],
        'ok': ["If we hadn't had that night, we wouldn't have a second data centre today.", 'But for the engineers, the crew would not have survived.', 'Test your backup before you need it.']}))))

    meta = {'id': LID, 'owner': OWNER, 'title': 'What If? 5 Days of Conditionals', 'level': 'B2', 'category': 'Daily practice', 'minutes': '5 × 25 min',
            'description': 'A harder daily challenge on conditionals only: a podcast, a B2 First reading, Use of English, advanced forms (Had I known…, But for…, I wish I had…) and a story.',
            'grammar': 'Third · second · mixed conditionals · Had I known… · But for… · I wish / If only · unless / as long as', 'date': '2026-11-16', 'code': 'D5',
            'hwSection': P + '-hw-prep', 'hwSince': '2026-11-16T06:00:00Z', 'draft': False, 'kind': 'homework', 'hwTag': 'КАЖДЫЙ ДЕНЬ · 5 ДНЕЙ · B2',
            'daily': {'days': DAYS}, 'privateLive': True,
            'gvp': {'g': 'third, second and mixed conditionals; inversion, but for, wish / if only, unless / as long as', 'v': 'missions and malfunctions; inventions', 'p': ''}}
    d, h = lesson(meta, {}, secs, 'IRIS SCHOOL · Захар и Михаил · каждый день',
                  'Five days, one topic — conditionals at B2 level. A podcast about an airport that went dark, four happy accidents that changed the world, exam tasks, the «extras» like Had I known… and But for…, and a final story. 🧠',
                  ['B2', 'Every day', '5 × 25 min'])
    return [(d, h, vocab_of(CARDS))]
