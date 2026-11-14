"""Иола и Марина: грамматика проще и по шагам.
Плотные таблицы «Grammar Bank» в их уроках заменены блоками Grammar Easy (как у других учеников):
одна мысль → как выбрать → формула → примеры с 🔊 → типичные ошибки. Упражнения не меняются.

FIXES: {id раздела: (где менять, html)}; где менять — 'bank' (таблица Grammar Bank раздела)
или ('between', начало, конец): заменить кусок от начала до конца (конец остаётся)."""
from kit import easy

FIXES = {}


def fix(sid, *args, where='bank', **kw):
    FIXES[sid] = (where, easy(*args, **kw))


# ---------------------------------------------------------------- Иола (B1)

fix('io-grammar', 'much bigger · as big as · the biggest ever',
    'Сравниваем двоих → <b>bigger / more dangerous</b>. Выделяем одного из всех → <b>the biggest / the most dangerous</b>. '
    'А маленькие слова показывают, <b>насколько</b>: much / far = «намного», a bit = «чуть-чуть».',
    [[('A tardigrade', 'a'), ('is', 'd'), ('much smaller', 'c'), ('than an ant.', 'b')],
     [('My cat', 'a'), ('is', 'd'), ('as lazy as', 'c'), ('a sloth.', 'b')],
     [('It', 'a'), ('is', 'd'), ('one of the longest', 'c'), ('migrations on Earth.', 'b')]],
    [('🐜', 'A tardigrade is much smaller than an ant.'),
     ('🐱', 'My cat is as lazy as a sloth!'),
     ('🎬', "This is the best film I've ever seen."),
     ('🦥', 'The slower it moves, the less energy it uses.')],
    [('much more bigger', 'much bigger', 'После much — одна форма: bigger или more + длинное слово.'),
     ('very faster', 'much faster', 'very со сравнением не работает → much / far.'),
     ('one of the best player', 'one of the best players', 'После one of the — множественное число.')],
    note='small → smaller → the smallest · dangerous → more dangerous → the most dangerous · good → better → the best · bad → worse → the worst',
    choose=[('Намного больше?', 'much / far bigger'),
            ('Чуть-чуть?', 'a bit bigger'),
            ('Такой же / не такой, как…', '(not) as big as'),
            ('Лучший из всего, что я видела', "the best … I've ever seen"),
            ('Один из лучших', 'one of the best + мн. число'),
            ('Чем …, тем …', 'the more …, the better')])

fix('hlio-grammar', "If you see a spider, you'll…",
    'Реальное «если …, то …» о будущем. Хитрость: после <b>if</b> — <b>настоящее</b> время, '
    'а <b>will / won\'t / might</b> — только во второй части.',
    [[('If', 'c'), ('you', 'a'), ('catch', 'd'), ('an apple,', 'b')],
     [('you', 'a'), ("'ll have", 'd'), ('good luck all year.', 'b')]],
    [('🕷️', "If I see a spider, I won't scream."),
     ('🪞', "If you break a mirror, you'll have bad luck."),
     ('🌧️', "It's cloudy. It might rain later."),
     ('🤞', "Unless you cross your fingers, it won't work.")],
    [('If you will peel an apple…', 'If you peel an apple…', 'После if — без will.'),
     ('It might to rain.', 'It might rain.', 'После might — глагол без to.'),
     ("Unless you don't hurry…", 'Unless you hurry…', 'unless уже значит «если не».')],
    note="Половинки можно поменять: You'll have good luck if you catch an apple. (тогда без запятой)",
    choose=[('Уверена ✅', "will ('ll)"), ('Может быть 🤔', 'might'), ('Точно нет ❌', "won't"), ('Если не…', 'unless = if … not')])

fix('io2-grammar', 'too small · not big enough',
    '<b>too</b> = «слишком» — это проблема 😬. <b>enough</b> = «достаточно» ✅. '
    'Запомните место: enough <b>после</b> прилагательного (warm enough), но <b>перед</b> существительным (enough fish).',
    [[('The tent', 'a'), ('was', 'd'), ('too small', 'c'), ('for four people.', 'b')],
     [('My sleeping bag', 'a'), ("wasn't", 'd'), ('warm enough.', 'c')],
     [('There', 'a'), ("wasn't", 'd'), ('enough fish', 'c'), ('for everyone.', 'b')]],
    [('⛺', 'Our tent was too small for four people.'),
     ('🎒', 'Mum packed too much food.'),
     ('🦟', 'There are too many midges!'),
     ('🛌', "My sleeping bag wasn't warm enough.")],
    [('enough warm', 'warm enough', 'enough — после прилагательного.'),
     ('fish enough', 'enough fish', 'enough — перед существительным.'),
     ('too much small', 'too small', 'Перед прилагательным — просто too.')],
    note="Одно и то же двумя способами: The tent was too small. = The tent wasn't big enough. · too heavy to carry = «слишком тяжёлый, чтобы нести»",
    choose=[('Слишком + прилагательное', 'too small'),
            ('Слишком много (не посчитать: food, water)', 'too much food'),
            ('Слишком много (можно посчитать: midges)', 'too many midges'),
            ('Достаточно + прилагательное', 'warm enough'),
            ('Достаточно + существительное', 'enough fish')])

fix('io2-grammar-2', 'a few · a little · plenty of · hardly any · none',
    'Сначала посмотрите на существительное: его <b>можно посчитать</b> (biscuits, midges) или <b>нельзя</b> (food, water)? От этого зависит слово.',
    [[('We', 'a'), ('have', 'd'), ('a few', 'c'), ('biscuits.', 'b')],
     [('Can I have', 'd'), ('a little', 'c'), ('milk?', 'b')],
     [('There are', 'd'), ('hardly any', 'c'), ('midges today.', 'b')]],
    [('💧', "We've got plenty of water."),
     ('🍪', 'We only have a few biscuits left.'),
     ('🥛', 'Can I have a little milk, please?'),
     ('🏪', 'How many shops are there? None.')],
    [("We haven't got hardly any chocolate.", "We've got hardly any chocolate.", 'hardly any уже значит «почти нет» — второе not не нужно.'),
     ('a few milk', 'a little milk', 'milk не посчитать → a little.'),
     ('How much jumpers?', 'How many jumpers?', 'jumpers можно посчитать → many.')],
    note='Шкала: plenty of 😊 → a few / a little 🙂 → hardly any 😕 → no / none ❌',
    choose=[('Немного (можно посчитать)', 'a few biscuits'),
            ('Немного (нельзя посчитать)', 'a little chocolate'),
            ('Полно, с запасом 😊', 'plenty of water'),
            ('Почти нет 😕', 'hardly any midges'),
            ('Ноль ❌', 'no shops · None. (без существительного)'),
            ('Сколько?', 'How many jumpers? · How much water?')])

fix('io3-grammar', "will · probably · might · won't",
    'Предсказываем будущее и показываем, <b>насколько уверены</b>. Глагол после will / might — простой, без to.',
    [[('Most cars', 'a'), ('will', 'd'), ('be', 'c'), ('electric.', 'b')],
     [('Some islands', 'a'), ('might', 'd'), ('disappear.', 'c')],
     [('Plastic bags', 'a'), ("probably won't", 'd'), ('exist.', 'c')]],
    [('🚗', 'Most cars will be electric.'),
     ('☀️', 'Summers will probably be hotter.'),
     ('🏝️', 'Some islands might disappear.'),
     ('🛍️', "I don't think plastic bags will exist.")],
    [('will to be', 'will be', 'После will — без to.'),
     ("won't probably", "probably won't", "probably — перед won't."),
     ("I think it won't rain.", "I don't think it will rain.", 'Так говорят носители.')],
    note="Порядок: will probably, но probably won't. «Я думаю, не будет» → I don't think it will…",
    choose=[('100% ✅', 'will / will definitely'), ('80% 🙂', 'will probably'), ('50% 🤔', 'might'),
            ('20% 🙁', "probably won't"), ('0% ❌', "definitely won't")])

fix('io3-grammar-2', "If it rains, we'll stay at home",
    'Реальная ситуация в будущем и её результат. По-русски «если пойдёт дождь» — будущее, а по-английски после <b>if</b> — <b>настоящее</b>: If it rains. '
    '<b>will</b> — только во второй части.',
    [[('If', 'c'), ('you', 'a'), ('walk', 'd'), ('to school,', 'b')],
     [('you', 'a'), ("'ll reduce", 'd'), ('your carbon footprint.', 'b')]],
    [('🚶', "If you walk to school, you'll reduce your carbon footprint."),
     ('🌍', 'If we do nothing, things might get worse.'),
     ('🚌', "We'll miss the bus if we don't leave now."),
     ('⏰', "Unless we act now, it'll be too late.")],
    [("If it will rain, we'll stay at home.", "If it rains, we'll stay at home.", 'После if — без will.'),
     ("Unless you don't hurry…", 'Unless you hurry…', 'unless уже значит «если не».'),
     ("If you recycle it, they make a new one.", "If you recycle it, they'll make a new one.", 'Во второй части — will.')],
    note='if в начале → запятая после if-части · if в середине → запятой нет',
    choose=[('Часть с if', 'настоящее: If you walk…'),
            ('Результат', "will / won't / might: you'll save…"),
            ('Если не…', 'unless = if … not')])

fix('io4-grammar', 'can → could → will be able to',
    '<b>can</b> = умею / могу сейчас. В прошлом — <b>could</b>. А для будущего и после других глаголов у can форм нет — берём <b>be able to</b>.',
    [[('An octopus', 'a'), ('can', 'd'), ('change', 'c'), ('colour.', 'b')],
     [('As a child, I', 'a'), ('could', 'd'), ('name', 'c'), ('every bird.', 'b')],
     [('We', 'a'), ("'ll be able to", 'd'), ('film', 'c'), ('in the dark.', 'b')]],
    [('🐙', 'An octopus can change colour.'),
     ('🐦', 'As a child, I could name every bird.'),
     ('🎥', "We'll be able to film in the dark."),
     ('🕊️', "I'd like to be able to fly.")],
    [('will can', 'will be able to', 'У can нет будущего.'),
     ('can to swim', 'can swim', 'После can — без to.'),
     ('I have could', 'I have been able to', 'У can нет перфекта.')],
    note='can / could + глагол без to: can swim, could run',
    choose=[('Сейчас', "can / can't"), ('В прошлом (умела)', "could / couldn't"), ('В будущем', 'will be able to'),
            ('Уже смогла / ещё не смогла', 'have been able to'), ('После would like, love…', 'to be able to')])

fix('io4-grammar-2', 'could или managed to?',
    '«<b>Умела</b>» вообще, долгое время → <b>could</b>. «<b>Смогла, удалось</b>» один раз, в трудной ситуации → <b>was able to / managed to</b>.',
    [[('Dogs', 'a'), ('could', 'd'), ('always smell', 'c'), ('well.', 'b')],
     [('Barry', 'a'), ('was able to', 'd'), ('find', 'c'), ('the climber.', 'b')],
     [('The doctors', 'a'), ('managed to', 'd'), ('save', 'c'), ('him.', 'b')]],
    [('🏊', 'As a child, I could swim.'),
     ('🐕', 'Barry was able to find the climber.'),
     ('🏥', 'The doctors managed to save him.'),
     ('🌫️', "They couldn't see anything.")],
    [('Barry could find the climber in eight minutes.', 'Barry was able to find the climber in eight minutes.', 'Один трудный случай → was able to.'),
     ('managed find', 'managed to find', 'Не забывайте to.')],
    choose=[('Умела долгое время', 'could'),
            ('Один раз, было трудно, но получилось', 'was able to / managed to'),
            ('Не смогла (любой случай)', "couldn't / wasn't able to / didn't manage to")])

# ---------------------------------------------------------------- Марина

fix('marina-grammar', "I work или I'm working?",
    'Спросите себя: это <b>обычно / всегда</b>? → Present Simple. Это <b>сейчас / в этот период</b>? → Present Continuous.',
    [[('I', 'a'), ('usually', 'c'), ('wake up', 'd'), ('at ten.', 'b')],
     [('She', 'a'), ('works', 'd'), ('from home.', 'b')],
     [('I', 'a'), ("'m drinking", 'd'), ('my third coffee.', 'b')]],
    [('⏰', 'I usually wake up at around ten.'),
     ('🏙️', 'My sister lives in Kazan.'),
     ('☕', "I'm drinking my third coffee."),
     ('🌙', "This month I'm trying to go to bed earlier.")],
    [("I'm wanting a new phone.", 'I want a new phone.', 'want, like, know, need — обычно без -ing.'),
     ('She work from home.', 'She works from home.', 'he / she / it → -s.'),
     ("I'm work now.", "I'm working now.", 'am / is / are + глагол с -ing.')],
    note='always, usually, every day → Simple · now, at the moment, this week, Look! → Continuous',
    choose=[('Привычка, распорядок, факт', 'I work · she works'),
            ('Прямо сейчас', "I'm working"),
            ('Временно, «в эти дни»', "I'm learning Spanish this month.")],
    where=('between', '<div class="g-grid">', '<p class="instr">Step 3.'))

fix('marina-hw-grammar', 'I work · she works · Does she work?',
    'Present Simple — то, что бывает <b>обычно</b>: привычки и факты. С <b>he / she / it</b> добавляем <b>-s</b>, '
    'а в вопросе и отрицании -s «уходит» в <b>does / doesn\'t</b>.',
    [[('She', 'a'), ('works', 'd'), ('from home.', 'b')],
     [('He', 'a'), ("doesn't drink", 'd'), ('coffee.', 'b')],
     [('Does', 'c'), ('she', 'a'), ('get up', 'd'), ('early?', 'b')]],
    [('🏠', 'I work from home.'),
     ('💻', 'She works from home.'),
     ('☕', "He doesn't drink coffee."),
     ('🌅', 'Does she usually get up early?')],
    [('Does she works?', 'Does she work?', 'После does — без -s.'),
     ("She don't drink coffee.", "She doesn't drink coffee.", "he / she / it → doesn't."),
     ('She work at home.', 'She works at home.', 'Не забывайте -s.')],
    note='watch → watches · go → goes · study → studies',
    choose=[('I / you / we / they', "work · don't work · Do you work?"),
            ('he / she / it', "works · doesn't work · Does she work?")])

fix('mf-grammar', 'I used to bake with my mum',
    '<b>used to</b> = «раньше (обычно) делала, а теперь нет». Это привычка в прошлом. Если было <b>один раз</b> — обычное прошедшее (baked, went).',
    [[('I', 'a'), ('used to', 'd'), ('bake', 'c'), ('with my mum.', 'b')],
     [('We', 'a'), ("didn't use to", 'd'), ('eat', 'c'), ('out.', 'b')],
     [('Did', 'd'), ('you', 'a'), ('use to', 'd'), ('cook?', 'b')]],
    [('👵', 'We used to visit my grandmother every Sunday.'),
     ('🎂', "Grandma didn't use to buy cakes in shops."),
     ('🍳', 'Did you use to cook with your mum?'),
     ('🥧', 'Last Sunday I baked a pie.')],
    [("I didn't used to eat out.", "I didn't use to eat out.", "После didn't — use без -d."),
     ('I use to bake.', 'I used to bake.', 'В утверждении — used.'),
     ('Last Sunday I used to bake a pie.', 'Last Sunday I baked a pie.', 'Один раз → Past Simple.')],
    note="➕ used to · ➖ didn't use to · ❓ Did you use to…? (в ➖ и ❓ — без -d)",
    choose=[('Раньше часто, а сейчас нет', 'used to + глагол'),
            ('Один раз, конкретный день', 'Past Simple: I baked a pie.')])

fix('hlmr-grammar', "I'm meeting · I'm going to · I'll",
    'В английском три «будущих». Выбор зависит от того, <b>когда вы решили</b> и <b>договорились ли</b>.',
    [[('I', 'a'), ("'m meeting", 'd'), ('my sister for lunch.', 'b')],
     [('I', 'a'), ("'m going to", 'd'), ('dress up', 'c'), ('as a vampire.', 'b')],
     [('I', 'a'), ("'ll", 'd'), ('buy', 'c'), ('some pumpkins.', 'b')]],
    [('🍽️', "I'm meeting my sister for lunch."),
     ('🧛', "I'm going to dress up as a vampire."),
     ('🎃', "I'll buy some pumpkins on my way."),
     ('🔊', "I'm sure it'll be loud.")],
    [("I'll meet my sister at one — we booked a table.", "I'm meeting my sister at one.", 'Договорились → Present Continuous.'),
     ("There's no music! — I'm going to bring my speakers.", "Don't worry, I'll bring my speakers.", 'Решили прямо сейчас → will.'),
     ('I will to dress up.', 'I will dress up.', 'После will — без to.')],
    choose=[('Договорились: время, место, люди 📅', "I'm meeting… (Present Continuous)"),
            ('Решила заранее, план 📝', "I'm going to…"),
            ('Решила прямо сейчас, предлагаю, обещаю ⚡', "I'll…"),
            ('Думаю, что так будет 🔮', "I'm sure it'll…")])

fix('mr3-grammar', "We're meeting at seven · I'm going to bake",
    'Present Continuous вы уже знаете — теперь он о <b>будущем</b>, как в русском «Завтра я встречаюсь с подругой». '
    'Есть <b>договорённость</b> → We\'re meeting. Есть <b>план</b>, но ещё ничего не заказано → I\'m going to…',
    [[('We', 'a'), ("'re meeting", 'd'), ("at Luigi's at seven.", 'b')],
     [('I', 'a'), ("'m going to", 'd'), ('bake', 'c'), ('a chocolate cake.', 'b')],
     [('What', 'c'), ('are you doing', 'd'), ('on Saturday?', 'b')]],
    [('🍝', "We're meeting at Luigi's at seven."),
     ('👵', "Dad's taking Gran for a walk."),
     ('🎂', "I'm going to bake a chocolate cake."),
     ('🌧️', "Look at those clouds! It's going to rain.")],
    [('We meeting at seven.', "We're meeting at seven.", 'Нужно am / is / are.'),
     ("She's going bake a cake.", "She's going to bake a cake.", 'Не забывайте to.'),
     ('What do you do on Saturday evening?', 'What are you doing on Saturday evening?', 'О планах на конкретный день — Continuous.')],
    note="С go обычно: I'm going to the party (а не going to go)",
    choose=[('Время, место, бронь, люди знают 📅', "We're meeting… (Present Continuous)"),
            ('Решила, собираюсь 📝', "I'm going to…"),
            ('Вижу, что сейчас случится 👀', "It's going to rain.")])

fix('mr3-grammar-2', "I'll… или I'm going to…?",
    'Главный вопрос: <b>когда вы решили?</b> Прямо сейчас → <b>will</b>. Раньше → <b>going to</b>.',
    [[('I', 'a'), ("'ll", 'd'), ('give', 'c'), ('you a hand.', 'b')],
     [('Shall', 'd'), ('I', 'a'), ('move', 'c'), ('the sofa?', 'b')],
     [('I', 'a'), ("'m going to", 'd'), ('wear', 'c'), ('my blue dress.', 'b')]],
    [('💡', "Wait, I know! We'll have it at our house."),
     ('🤝', "I'll give you a hand."),
     ('🤐', "I promise I won't say a word."),
     ('👵', 'I think Gran will love it.')],
    [('Will I help you?', 'Shall I help you?', 'Предлагаем помощь → Shall I…?'),
     ("The phone! — I'm going to answer it.", "The phone! — I'll answer it!", 'Решили сейчас → will.'),
     ('I think Gran loves the party tomorrow.', 'I think Gran will love the party.', 'Мнение о будущем → will.')],
    note="will not = won't · «Тебе помочь?» = Shall I help you?",
    choose=[('Решила прямо сейчас ⚡', "I'll…"), ('Предлагаю помощь 🤝', "I'll… / Shall I…?"),
            ('Обещаю 🤞', "I'll… / I won't…"), ('Думаю, что будет 🔮', 'I think … will…'),
            ('Решила раньше 📝', "I'm going to…")])

fix('mr4-grammar', "I've been · I went",
    'Говорим про <b>опыт</b> в жизни, неважно когда → <b>Present Perfect</b> (have / has + 3-я форма). '
    'Как только появляется <b>когда / где / как</b> → <b>Past Simple</b>.',
    [[('I', 'a'), ("'ve been", 'd'), ('to Japan.', 'b')],
     [('I', 'a'), ('went', 'd'), ('there', 'b'), ('in 2023.', 'c')],
     [('Have', 'd'), ('you', 'a'), ('ever bought', 'd'), ('anything second-hand?', 'b')]],
    [('🛍️', 'Have you ever bought anything second-hand?'),
     ('☕', 'Yes, I have. I bought a coffee machine last year.'),
     ('💸', "I've never borrowed money."),
     ('📅', 'When did you buy it? Last week.')],
    [("I've bought it last week.", 'I bought it last week.', 'last week, ago, in 2020 → только Past Simple.'),
     ('Did you ever been to Japan?', 'Have you ever been to Japan?', 'Опыт → Have you ever…?'),
     ('When have you bought it?', 'When did you buy it?', 'Вопрос «когда?» → Past Simple.')],
    note='Present Perfect: ever, never, before, in my life · Past Simple: yesterday, last…, … ago, in 2020, When…?',
    choose=[('Было ли когда-нибудь в жизни?', "I've been… · Have you ever…?"),
            ('Когда? Где? Детали', 'I went… · When did you…?')])

fix('mr4-grammar-2', 'just · already · yet',
    'Три маленьких слова для Present Perfect: <b>just</b> = «только что», <b>already</b> = «уже», <b>yet</b> = «ещё не» / «уже?» в вопросе.',
    [[('I', 'a'), ("'ve", 'd'), ('just', 'c'), ('booked', 'd'), ('a trip.', 'b')],
     [('I', 'a'), ("haven't", 'd'), ('decided', 'd'), ('yet.', 'c')]],
    [('✈️', "I've just booked a trip."),
     ('💶', "I've already saved six thousand euros."),
     ('🤔', "I haven't decided yet."),
     ('❓', 'Have you spent it yet?')],
    [("I've booked just a trip.", "I've just booked a trip.", 'just — между have и глаголом.'),
     ("I haven't yet decided.", "I haven't decided yet.", 'yet — в конце.'),
     ("I've already booked it yesterday.", 'I booked it yesterday.', 'yesterday → Past Simple.')],
    note='just и already — между have и глаголом · yet — в самом конце',
    choose=[('Только что ⏱️', "I've just…"), ('Уже, раньше, чем ждали ✅', "I've already…"),
            ('Ещё не ⏳', "I haven't … yet."), ('Уже? (вопрос) ❓', 'Have you … yet?')])

fix('mrh-hw-prep', 'обычно · сейчас · раньше',
    'Три вопроса — три формы. Обычно, всегда, факт? → <b>Present Simple</b>. Сейчас, в этот период? → <b>Present Continuous</b>. '
    'Раньше было, а теперь нет? → <b>used to</b>.',
    [[('Gran', 'a'), ('gets up', 'd'), ('at six', 'b'), ('every day.', 'c')],
     [('Gran', 'a'), ('is sleeping', 'd'), ('right now.', 'c')],
     [('Lily', 'a'), ('used to', 'd'), ('visit', 'c'), ('Gran every Sunday.', 'b')]],
    [('👵', 'Gran gets up at six every day.'),
     ('😴', 'Shh! Gran is sleeping.'),
     ('🏡', 'This week Lily is staying with her Gran.'),
     ('🐟', "She didn't use to like fish.")],
    [("I'm knowing this recipe.", 'I know this recipe.', 'know, like, want, need — без -ing.'),
     ("Gran is thinking it's too spicy.", "Gran thinks it's too spicy.", 'think = «считаю» → без -ing.'),
     ('Did you used to cook?', 'Did you use to cook?', 'В вопросе — use без -d.')],
    note="always, every day → Simple · now, this week, Look! → Continuous · ➖ ❓: didn't use to · Did you use to…?",
    choose=[('Обычно, факт', 'Present Simple'), ('Сейчас, в эти дни', 'Present Continuous'), ('Раньше, а теперь нет', 'used to')])

fix('mr2h-hw-prep', 'usually wakes up · is making',
    'Обычно, привычка, факт? → <b>Present Simple</b>. Прямо сейчас или временно, в этом месяце? → <b>Present Continuous</b>.',
    [[('Lily', 'a'), ('usually', 'c'), ('wakes up', 'd'), ('at ten.', 'b')],
     [('Look! Lily', 'a'), ('is making', 'd'), ('a cappuccino.', 'b')],
     [('This month she', 'a'), ("'s working", 'd'), ("at Kate's café.", 'b')]],
    [('⏰', 'Lily usually wakes up at ten.'),
     ('☕', 'The café opens at seven.'),
     ('👀', 'Look! Lily is making a cappuccino.'),
     ('📅', "This month she's working at Kate's café.")],
    [('She usually is waking up at ten.', 'She usually wakes up at ten.', 'usually → Present Simple.'),
     ('Look! She makes a cappuccino.', "Look! She's making a cappuccino.", 'Look! → происходит сейчас.'),
     ('makeing · siting', 'making · sitting', '-e убираем; в коротких глаголах букву удваиваем.')],
    note='-ing: work → working · make → making · sit → sitting · lie → lying · always / usually / never — перед глаголом',
    choose=[('Обычно, привычка', 'Present Simple'), ('Прямо сейчас', 'Present Continuous'), ('Временно, в этом месяце', 'Present Continuous')])


def build_fixes():
    return FIXES
