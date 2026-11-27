"""Этапы «как у Дарьи» для уроков, собранных раньше через std (23 ноября и более ранние):
think — «время подумать» в начале урока; task — задание «подготовка → рассказ» в Speaking.
kit.std берёт отсюда, если в самом уроке этих ключей нет."""

X = {}


def add(lid, think, task, plan, report):
    X[lid] = {'think': think, 'task': {'task': task[0], 'task_ru': task[1], 'plan': plan, 'report': report}}


# ---------------------------------------------------------------- A1–A2, 23 ноября
add('pelageya-7', ('What is your favourite animal? Have you been to a zoo? What animals did you see?', 'Ваше любимое животное? Вы были в зоопарке? Кого видели?', ['My favourite animal is…', 'At the zoo I saw…', 'It was… (big / funny / beautiful)']),
    ('Tell your teacher about a day out you remember: a zoo, a park, a trip. Where were you? Who was there? What was it like?', 'Расскажите о дне, который запомнился: где вы были, кто был с вами, как было.'),
    ['Where: I was at / in…', 'Who: … was / were with me.', 'The weather: It was…', 'There was / There were…', 'It was great / funny / boring because…'],
    ['Last summer I was at…', 'There were…', 'It was…', 'My favourite… was…'])
add('varya-7', ('What do you usually wear to a party? Where do you like to buy clothes?', 'Что вы надеваете на праздник? Где любите покупать одежду?', ['To a party I wear…', 'I like to buy clothes at…', 'My favourite colour is…']),
    ('You have 5,000 roubles for a party outfit. Compare three shops (cheap, nice, expensive) and choose the best one.', 'У вас 5000 рублей на наряд. Сравните три магазина и выберите лучший.'),
    ['Shop 1 is cheaper than…', 'Shop 2 is more beautiful than…', 'Shop 3 is the most expensive…', 'The best shop is… because…'],
    ['… is cheaper than…', '… is the most…', 'I think the best is…', "I'm going to buy…"])
add('olya-4', ('Have you been to St Petersburg or another big city? What did you do there?', 'Вы были в Петербурге или другом большом городе? Что делали?', ['I went to…', 'I saw / visited…', 'My favourite place was…']),
    ('Tell your teacher about your best weekend trip. Where did you go? What did you see, eat and buy?', 'Расскажите о лучшей поездке на выходные: куда ездили, что видели, ели, купили.'),
    ['Where and when: I went to… in…', 'I saw…', 'I ate…', 'I bought…', 'It was… because…'],
    ['Last year I went to…', 'On Saturday we…', 'Then we…', 'I really liked…'])
add('efim-3', ("What new food have you tried recently? Did you like it?", 'Какую новую еду вы недавно пробовали? Понравилось?', ["I've tried…", 'It was…', "I've never tried… but I'd like to."]),
    ('Interview your teacher: ask five «Have you ever…?» questions. Then tell her three things you have done and two you have never done.', 'Задайте преподавателю пять вопросов «Have you ever…?», потом расскажите о себе.'),
    ['Question 1: Have you ever…?', 'Question 2: …', 'Question 3: …', "About me: I've… / I've never…", 'Follow-up: When did you…?'],
    ['Have you ever…?', 'Yes, I have. / No, I haven\'t.', "I've… but I've never…", 'When did you…?'])
add('vladimir-3', ('Where would you like to go on holiday next year? Why?', 'Куда бы вы хотели поехать в отпуск в следующем году? Почему?', ['I would like to go to…', 'because…', "I'm (not) going to…"]),
    ('Plan your next holiday: where you are going to go, how, where you are going to stay and what you are going to do. Tell your teacher.', 'Спланируйте отпуск: куда, как, где жить, что делать.'),
    ["I'm going to go to…", "I'm going to travel by…", "I'm going to stay in…", "I'm going to… / I'm not going to…"],
    ["Next summer I'm going to…", "We're going to stay…", "I'm going to visit…", "I'm not going to…"])
add('sasha-4', ('How do you usually celebrate birthdays: at home, in a café, with friends?', 'Как вы обычно празднуете дни рождения?', ['I usually celebrate…', 'Last year I…', 'My dream birthday: …']),
    ('Plan a surprise party for a friend. Decide: what you are going to do (plans) and what you will do if there are problems (quick decisions).', 'Спланируйте вечеринку-сюрприз: планы и решения на месте.'),
    ["We're going to have the party at…", "I'm going to invite…", "If it rains, I'll…", 'I promise I will…'],
    ["We're going to…", "I'll… (decision now)", 'Shall I…?', "I promise I won't tell!"])
add('vika-6', ('Remember chapter 7: what do we know about Long John Silver so far?', 'Вспомните главу 7: что мы знаем о Сильвере?', ['Silver is…', 'He has…', 'I think he…']),
    ('Be a detective! Write five questions about chapter 8 for your teacher — some with «Who…?» about the subject, some with «Who did…?» about the object.', 'Пять вопросов о главе 8 для преподавателя: Who…? и Who did…?'),
    ['Who saw…?', 'Who did Jim…?', 'What happened…?', 'Where did…?', 'Why did…?'],
    ['Who ran away?', 'Who did Silver send…?', 'What happened next?', 'I think Silver…'])
add('mussa-2', ('What do tourists usually order at your café? Write three things.', 'Что туристы обычно заказывают в кафе? Три вещи.', ['1: …', '2: …', '3: …']),
    ('Role-play: your teacher is a tourist in your café. Take her order, say the prices and give the bill.', 'Преподаватель — туристка в кафе. Примите заказ, назовите цены, дайте счёт.'),
    ['Hello! Would you like…?', 'Tea or coffee?', "It's … roubles.", 'Here is the bill.'],
    ['Would you like…?', "I'd like…, please.", 'How much is it?', "It's… roubles.", 'Enjoy your meal!'])

# ---------------------------------------------------------------- B1 / Intermediate, 23 ноября
add('yulia-k-5', ('Which museum or painting has impressed you most? Why?', 'Какой музей или картина произвели на вас самое сильное впечатление?', ['The museum / painting: …', 'It was painted / built by…', 'It impressed me because…']),
    ('You are a TV reporter. Tell the story of a famous theft (real or invented) in the passive: what was stolen, how, who was arrested, when it was found.', 'Вы — тележурналист: расскажите о краже в passive.'),
    ['What was stolen: …', 'How it was stolen: …', 'Who was arrested / questioned: …', 'When / where it was found: …'],
    ['Last night… was stolen from…', 'The thieves were seen…', 'Two men were arrested…', 'The painting was found…'])
add('olya-b1-4', ('Have you ever trained for something: a race, an exam, a competition? What happened?', 'Вы когда-нибудь готовились к забегу, экзамену, соревнованию?', ['I trained for…', 'It was hard / easy because…', 'In the end…']),
    ('Make a plan for a real goal (a race, an exam, a trip). Explain the steps with if / when / as soon as / until / unless.', 'План реальной цели: шаги с if / when / as soon as / until / unless.'),
    ['My goal: …', "If I…, I'll…", "As soon as I…, I'll…", "I won't stop until…", "Unless I…, I won't…"],
    ["If I train…, I'll…", "When I finish, I'll…", "As soon as…", "I won't give up until…"])
add('sasha-b1-4', ('What games did you play as a child? Which one do you miss?', 'Во что вы играли в детстве? По чему скучаете?', ['As a child I used to play…', 'We would…', 'I miss… because…']),
    ('Compare your childhood with children today: games, school, technology, free time. Use used to, would and didn\'t use to.', 'Сравните своё детство и детство сегодняшних детей.'),
    ['Games: we used to…, now children…', 'School: we didn\'t use to…', 'Technology: …', 'Free time: we would…', 'Better then or now? …'],
    ['When I was a child, we used to…', 'We would…', "We didn't use to…", 'Today children…'])
add('ekaterina-5', ('What series are you watching now? Would you recommend it?', 'Какой сериал вы сейчас смотрите? Порекомендуете?', ["I'm watching…", "It's a series which / about…", 'I would / wouldn\'t recommend it because…']),
    ('Recommend a series to your teacher without saying its name. Describe it with who / which / where / whose — can she guess?', 'Порекомендуйте сериал, не называя его: опишите с who / which / where / whose.'),
    ["It's a series which…", "It's about a man / woman who…", "It's set in a city where…", 'The main character, whose…, …'],
    ["It's a series which…", 'The main character is a woman who…', 'It takes place in a town where…', 'Can you guess?'])
add('iola-5', ('What music did you listen to as a teenager? Do you still like it?', 'Какую музыку вы слушали подростком? Нравится ли она сейчас?', ['As a teenager I enjoyed listening to…', 'Now I prefer…', 'A song that reminds me of…']),
    ('Make your «soundtrack of life»: three songs for three moments of your life. Explain why, using -ing and to patterns.', '«Саундтрек жизни»: три песни для трёх моментов — объясните выбор.'),
    ['Song 1 (childhood): I remember…-ing', 'Song 2: I decided to… / I started…-ing', 'Song 3 (now): I enjoy…-ing', "I'd like to… / I hope to…"],
    ['I really enjoy listening to…', 'It reminds me of…', 'I decided to learn…', 'I hope to see them live.'])
add('milana-5', ("What is your favourite sweet or chocolate? Do you know where it's made?", 'Ваша любимая сладость? Знаете, где её делают?', ['My favourite is…', 'I think it is made in…', 'It is made from…']),
    ('Explain how something you like is made (bread, coffee, cheese, a cake…) step by step in the passive.', 'Объясните по шагам в passive, как делают то, что вы любите.'),
    ['First, … is / are…', 'Then … is…', 'After that, …', 'Finally, … is sold…'],
    ['First, the beans are…', 'Then they are…', 'After that…', 'Finally, it is packed and sold.'])
add('marina-5', ('Do you have a hobby you started recently? How long have you been doing it?', 'Есть ли хобби, которым вы недавно начали заниматься? Как долго?', ["I've been… since / for…", 'I started because…', "So far I've…"]),
    ('Tell your teacher about a hobby or project in your life: how long you have been doing it, what you have achieved, what you want next.', 'Расскажите о хобби: как долго, чего добились, что дальше.'),
    ["I've been… for / since…", "Recently I've been…", "So far I've…", 'Next I want to…'],
    ["I've been… since…", "I've already…", "Lately I've been…", "I've been thinking about…"])
add('ksenia-5', ('What do you do to feel good: sport, sleep, food, friends? What would you like to change?', 'Что вы делаете для хорошего самочувствия? Что хотели бы изменить?', ['To feel good I…', 'I should… more', 'I have to… / I don\'t have to…']),
    ('Be a health coach: your teacher describes her lifestyle problems. Give her five pieces of advice and rules with should, must, have to, mustn\'t, don\'t have to.', 'Вы — коуч по здоровью: пять советов и правил преподавателю.'),
    ['You should…', "You shouldn't…", 'You have to…', "You mustn't…", "You don't have to…"],
    ['I think you should…', 'You really must…', "You don't have to…, but…", 'Try to…'])

# ---------------------------------------------------------------- B2, 23 ноября
add('dmitry-6', ('Think of a decision in your life that changed everything. What if you had decided differently?', 'Вспомните решение, которое всё изменило. Что было бы, если бы вы решили иначе?', ['The decision: …', 'If I had…, I would…', 'I (don\'t) regret it because…']),
    ('Talk about «the road not taken»: one real regret and one thing you\'re glad you did. Use I wish, if only and should have.', 'Одно сожаление и одно решение, которым вы гордитесь: I wish, if only, should have.'),
    ['I wish I had…', 'If only I…', 'I should have… / shouldn\'t have…', "I'm glad I… because…", 'Now I wish I could…'],
    ['Looking back, I wish I had…', 'If only…', 'I should have…', "But I'm really glad that…"])
add('alexey-b2-4', ('Have you ever got lost or had an adventure on a trip? What happened?', 'Вы когда-нибудь терялись или попадали в приключение в поездке?', ['I was travelling in…', 'Suddenly…', 'In the end…']),
    ('Tell an adventure story (real or invented) using past simple, past continuous, past perfect and past perfect continuous. Your teacher guesses: true or false?', 'Приключение (реальное или выдуманное) во всех прошедших временах. Правда или вымысел?'),
    ['Background: I had been… / I was…', 'The problem: Suddenly…', 'What had happened before: …had…', 'The ending: …', 'True or invented?'],
    ['We had been walking for hours when…', 'It was getting dark…', 'I realised I had…', 'Finally…'])
add('zakhar-mikhail-5', ('Imagine you became a professional athlete tomorrow. What would be the hardest thing to get used to?', 'Если бы вы завтра стали профессиональным спортсменом — к чему было бы труднее всего привыкнуть?', ['The hardest thing would be…', "I'm used to… but not to…", 'I used to…']),
    ('Interview each other: life changes. Ask about something you used to do, something you are used to now and something you are getting used to.', 'Интервью друг другу: что раньше, к чему привыкли, к чему привыкаете.'),
    ['I used to… but now…', "I'm (not) used to…-ing", "I'm getting used to…-ing", "I'll never get used to…", 'Question for my partner: …'],
    ['I used to…', "Now I'm used to…", "I'm still getting used to…", 'What about you?'])
add('pasha-5', ('Which market or street food place do you love? What makes it special?', 'Какой рынок или место со стрит-фудом вы любите? Чем оно особенное?', ['The place: …', "It's a market where / which…", 'The best thing there is…']),
    ('Be a food guide: plan a walking tour of three places in your city for a foreign friend. Describe each with relative and participle clauses.', 'Вы гид: прогулка по трём местам города для иностранного друга.'),
    ['Stop 1: …, which…', 'Stop 2: a place where…', 'Stop 3: a café run by a woman whose…', '… made / sold there…'],
    ['First we go to…, which…', 'Then there is a market where…', 'The owner, whose…, …', 'Food made by… is…'])

# ---------------------------------------------------------------- более ранние уроки (16–19 ноября)
add('dmitry-5', ('How many passwords do you use? Have you ever had a problem with online security?', 'Сколько у вас паролей? Были ли проблемы с безопасностью?', ['I use about… passwords.', 'Once I…', 'I tend to…']),
    ('Give a 2-minute security briefing to new colleagues: five habits to stop, start and avoid. Use verb patterns (-ing / to).', 'Двухминутный инструктаж для новых коллег: пять привычек.'),
    ['Stop…-ing', 'Avoid…-ing', 'Remember to…', "It's worth…-ing", 'Never forget to…'],
    ['First, stop…', 'I strongly suggest…-ing', 'Remember to…', "It's worth…-ing"])
add('efim-2', ('Which gadget do you use most? Could you live without it?', 'Каким гаджетом пользуетесь чаще всего? Смогли бы без него?', ['I use… every day.', 'It is better than… because…', 'I could / couldn\'t live without it.']),
    ('Compare two gadgets you have (phones, laptops, watches…) and choose the best one for a friend.', 'Сравните два гаджета и выберите лучший для друга.'),
    ['Gadget 1 is …-er than…', 'Gadget 2 is more… than…', 'The best is… because…', 'It is the cheapest / the most…'],
    ['… is faster than…', '… is the most…', 'I recommend…', 'It is better because…'])
add('vladimir-2', ('Think of a funny or strange thing that happened at work. What happened?', 'Вспомните смешной или странный случай на работе.', ['It happened on…', 'First…', 'Then…']),
    ('Tell your teacher a story about a strange day (real or invented): what happened, who did what, how it ended.', 'История о странном дне: что случилось, кто что сделал, чем закончилось.'),
    ['When: Last…', 'First I…', 'Then…', 'Suddenly…', 'In the end…'],
    ['Last Friday I…', 'Then my boss…', 'Suddenly…', 'In the end we…'])
add('pelageya-6', ('Where would you like to be right now? What are people doing there?', 'Где бы вы хотели быть прямо сейчас? Что там делают люди?', ['I would like to be…', 'People are…', 'I am…']),
    ('Video call! Describe a photo of a busy place (a beach, a park, a street): who is there and what everyone is doing right now.', 'Видеозвонок: опишите фото людного места — кто что делает прямо сейчас.'),
    ['A man is…', 'Two children are…', 'A woman is…', 'The sun is… / It is…'],
    ['I can see…', 'He is…-ing', 'They are…-ing', 'Nobody is…-ing'])
add('varya-6', ('What do you think your life will be like in 2050?', 'Какой будет ваша жизнь в 2050 году?', ['In 2050 I will…', 'People will…', "We won't…"]),
    ('Make five predictions about life in 2050: home, school, transport, food, robots. Your teacher agrees or disagrees!', 'Пять прогнозов о жизни в 2050: дом, школа, транспорт, еда, роботы.'),
    ['Homes will…', "Children won't…", 'Cars will…', 'We will eat…', 'Robots will…'],
    ['I think … will…', "I don't think … will…", 'Maybe…', 'Do you agree?'])
add('ekaterina-4', ('What are the rules in your home or at your work? Which rule do you hate?', 'Какие правила дома или на работе? Какое вы не любите?', ['At home we have to…', "At work you mustn't…", 'I hate the rule…']),
    ('Write the «house rules» for a flatmate or a guest: five rules with have to, mustn\'t, don\'t have to, should.', '«Правила дома» для соседа или гостя: пять правил.'),
    ['You have to…', "You mustn't…", "You don't have to…", 'You should…', 'Please…'],
    ['In my flat you have to…', "You mustn't…", "You don't have to…, but…", 'You should…'])
add('yulia-k-4', ('What was the last interesting thing someone told you?', 'Что интересного вам недавно рассказали?', ['My friend told me that…', 'She said that…', 'I was surprised because…']),
    ('Gossip time 😄: report three conversations from this week — what people said, asked and asked you to do.', 'Перескажите три разговора недели: что сказали, о чём спросили, о чём попросили.'),
    ['… told me that…', '… said that…', '… asked me if…', '… asked me to…'],
    ['My boss told me that…', 'She asked me to…', 'He asked if…', 'I said that…'])
