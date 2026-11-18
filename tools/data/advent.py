"""🎄 Адвент-календарь Iris School: 31 окошко, 1–31 декабря. Новогоднее оформление — с 1 декабря по 10 января.

ON = False: календарь и оформление выключены, пока преподаватель не посмотрит демо и не одобрит.
Посмотреть на платформе до включения: добавить к адресу ?ny=2026-12-05 (любая дата), выключить предпросмотр: ?ny=off.

Каждое окошко — для двух уровней: 'a' (A0–A2, короткий текст, перевод виден сразу) и 'b' (B1–B2, длиннее,
перевод по кнопке). В окошке: факт / шутка / скороговорка / слово или идиома дня + вопрос на понимание.
Поля уровня: (en, ru, вопрос, варианты, номер верного) и необязательно say — текст для озвучки, если en читается плохо."""

ON = False
START = '2026-12-01'
NY_FROM = '2026-12-01'
NY_TO = '2027-01-10'

KINDS = {'fact': 'Знаете ли вы?', 'joke': 'Шутка дня', 'twister': 'Скороговорка', 'word': 'Слово дня', 'idiom': 'Выражение дня', 'wish': 'С Новым годом!'}


def D(emo, kind, title, a, b):
    return {'e': emo, 'k': kind, 't': title, 'a': a, 'b': b}


def L(en, ru, q, opts, ok=0, say=None):
    x = {'en': en, 'ru': ru, 'q': q, 'o': opts, 'ok': ok}
    if say:
        x['say'] = say
    return x


DAYS = [
    D('🗓️', 'fact', 'Откуда адвент-календари',
      L('Advent calendars come from Germany. You open one little door every day!', 'Адвент-календари пришли из Германии. Каждый день открываешь одно окошко!',
        'Where do advent calendars come from?', ['Germany', 'Spain', 'Japan']),
      L('The first printed advent calendars appeared in Germany in the early 1900s. Children opened one little door each day as they counted down to Christmas.',
        'Первые печатные адвент-календари появились в Германии в начале 1900-х. Дети открывали по окошку в день, отсчитывая дни до Рождества.',
        'What does "count down" mean here?', ['count the days left until an event', 'count backwards from ten', 'forget the date'])),
    D('❄️', 'fact', 'Снежинки',
      L('Every snowflake has got six sides.', 'У каждой снежинки шесть лучей.', 'How many sides has a snowflake got?', ['four', 'six', 'eight'], 1),
      L('Almost every snowflake has six arms, because of the way water molecules join together when they freeze.',
        'Почти у каждой снежинки шесть лучей — из-за того, как молекулы воды соединяются, когда замерзают.',
        '"Freeze" means…', ['to become ice', 'to become hot', 'to fall down'])),
    D('🌲', 'fact', 'Ёлка из Норвегии',
      L('Every year Norway gives London a big Christmas tree.', 'Каждый год Норвегия дарит Лондону большую ёлку.', 'Who gives London a Christmas tree?', ['Norway', 'France', 'the USA']),
      L("Since 1947 Norway has sent a Christmas tree to Trafalgar Square every year, as a thank-you for Britain's help during the Second World War.",
        'С 1947 года Норвегия каждый год отправляет ёлку на Трафальгарскую площадь — в благодарность за помощь Британии во Второй мировой войне.',
        'Why does Norway send the tree?', ['to say thank you', 'to sell it', "because it's too big for Norway"])),
    D('⛄', 'joke', 'Снеговик летом',
      L('What do you call a snowman in summer? A puddle!', 'Как называется снеговик летом? Лужа!', 'A puddle is…', ['water on the ground', 'a big snowball', 'a winter hat']),
      L('Why did the snowman call his dog Frost? Because Frost bites!', 'Почему снеговик назвал собаку Мороз? Потому что «мороз кусается» — а frostbite по-английски «обморожение».',
        'Frostbite is…', ['an injury from extreme cold', 'a winter dessert', 'a kind of dog'])),
    D('🎅', 'fact', 'Дед Мороз',
      L("In Russia, Ded Moroz brings presents on New Year's Eve.", 'В России Дед Мороз приносит подарки в новогоднюю ночь.',
        'When does Ded Moroz bring presents?', ["on New Year's Eve", 'in summer', 'on his birthday']),
      L("Ded Moroz's official home is in Veliky Ustyug. He travels with his granddaughter, Snegurochka, and every year children send him thousands of letters.",
        'Официальная резиденция Деда Мороза — в Великом Устюге. Он путешествует с внучкой Снегурочкой, и каждый год дети присылают ему тысячи писем.',
        "Snegurochka is Ded Moroz's…", ['granddaughter', 'daughter', 'sister'])),
    D('🛷', 'twister', 'Скороговорка',
      L("Santa's sleigh slides on slippery snow.", 'Сани Санты скользят по скользкому снегу. Скажите три раза быстро!', '"Slippery" means…', ['скользкий', 'сладкий', 'снежный']),
      L('Seven slippery snowmen slid silently southwards.', 'Семь скользких снеговиков бесшумно скользили на юг. Три раза быстро!',
        '"Silently" means…', ['without any noise', 'very fast', 'in the snow'])),
    D('🏖️', 'fact', 'Рождество летом',
      L('In Australia, Christmas is in summer. People go to the beach!', 'В Австралии Рождество летом. Люди идут на пляж!',
        "What's the weather like at Christmas in Australia?", ['hot', 'snowy', 'freezing']),
      L('Because Australia is in the southern hemisphere, Christmas falls in the middle of summer, so many families have a barbecue or a picnic on the beach.',
        'Австралия в южном полушарии, поэтому Рождество приходится на середину лета: многие семьи устраивают барбекю или пикник на пляже.',
        'Christmas "falls in" summer means it…', ['happens in summer', 'is cancelled in summer', 'is cold'])),
    D('🍗', 'fact', 'Рождество в Японии',
      L('In Japan, many families eat fried chicken at Christmas.', 'В Японии многие семьи едят на Рождество жареную курицу.',
        'What do many Japanese families eat at Christmas?', ['fried chicken', 'pizza', 'fish soup']),
      L('Thanks to a famous advertising campaign in the 1970s, eating fried chicken on Christmas Eve became a tradition in Japan. People even order it weeks in advance.',
        'Благодаря знаменитой рекламе 1970-х жареная курица в сочельник стала в Японии традицией. Её даже заказывают за несколько недель.',
        '"In advance" means…', ['before the time it is needed', 'too late', 'for free'])),
    D('🧸', 'word', 'cosy · hygge',
      L('Cosy means warm and comfortable: a cosy blanket, a cosy evening.', 'cosy — уютный: тёплый и удобный. Уютный плед, уютный вечер.',
        'Which is cosy?', ['a warm room with tea', 'a cold bus stop', 'a noisy station']),
      L('Hygge is a Danish word for a cosy, happy feeling: candles, hot drinks and time with friends. English has borrowed it!',
        'Hygge (хюгге) — датское слово: уют и радость — свечи, горячие напитки, время с друзьями. Английский его позаимствовал!',
        'To "borrow" a word means…', ['to start using a word from another language', 'to forget a word', 'to translate badly'],
        say='Hygge is a Danish word for a cosy, happy feeling: candles, hot drinks and time with friends. English has borrowed it!')),
    D('📮', 'fact', 'Индекс Санты',
      L('In Canada, Santa has got a postcode: H0H 0H0!', 'В Канаде у Санты есть почтовый индекс: H0H 0H0!', 'What has Santa got in Canada?', ['a postcode', 'a car', 'a shop'],
        say='In Canada, Santa has got a postcode: H, zero, H, zero, H, zero!'),
      L('Canada Post answers letters sent to Santa at the North Pole, postcode H0H 0H0. Volunteers reply to more than a million letters a year.',
        'Почта Канады отвечает на письма Санте на Северный полюс, индекс H0H 0H0. Волонтёры отвечают больше чем на миллион писем в год.',
        'A volunteer works…', ['without pay', 'only at night', 'for a big salary'],
        say='Canada Post answers letters sent to Santa at the North Pole. Volunteers reply to more than a million letters a year.')),
    D('🚀', 'fact', 'Песня в космосе',
      L('Jingle Bells was the first song in space!', '«Jingle Bells» — первая песня, прозвучавшая в космосе!', 'Jingle Bells was the first song…', ['in space', 'on the radio', 'on TV']),
      L('In December 1965 two astronauts on Gemini 6 played Jingle Bells on a tiny harmonica and some bells: the first music ever performed in space.',
        'В декабре 1965 года два астронавта «Джемини-6» сыграли «Jingle Bells» на маленькой губной гармошке и колокольчиках — первая музыка, исполненная в космосе.',
        '"Performed" means…', ['played or sang for people', 'wrote', 'recorded secretly'])),
    D('🧊', 'idiom', 'break the ice · get cold feet',
      L('Break the ice means start talking with new people.', 'Break the ice — «растопить лёд», начать разговор с новыми людьми.',
        "At a party you 'break the ice'. You…", ['start a conversation', 'break a glass', 'go home']),
      L("To get cold feet means to suddenly feel too nervous to do something you planned: 'He got cold feet before the exam.'",
        'Get cold feet — испугаться и засомневаться в последний момент: «Он струсил перед экзаменом».',
        'She got cold feet before her presentation. She…', ['felt too nervous', 'had cold shoes', 'was very confident'])),
    D('🏠', 'fact', 'Пряничный домик',
      L('People make gingerbread houses at Christmas. You can eat them!', 'На Рождество делают пряничные домики. Их можно съесть!',
        'A gingerbread house is…', ['a house you can eat', 'a real house', 'a toy shop']),
      L('Gingerbread houses became popular in Germany in the 1800s, after the Brothers Grimm published the fairy tale Hansel and Gretel, with its house made of sweets.',
        'Пряничные домики стали популярны в Германии в XIX веке, после того как братья Гримм опубликовали сказку «Гензель и Гретель» с домиком из сладостей.',
        'Which fairy tale made gingerbread houses popular?', ['Hansel and Gretel', 'Cinderella', 'The Snow Queen'])),
    D('🦌', 'fact', 'Олень Рудольф',
      L('Rudolph the reindeer has got a red nose.', 'У оленя Рудольфа красный нос.', "What colour is Rudolph's nose?", ['red', 'blue', 'black']),
      L('Rudolph the Red-Nosed Reindeer was invented in 1939 for a free booklet from a department store in Chicago. The famous song came ten years later.',
        'Олень Рудольф появился в 1939 году в бесплатной книжечке универмага в Чикаго. Знаменитая песня — через десять лет.',
        'A "free booklet" was…', ['given to people for nothing', 'very expensive', 'only for adults'])),
    D('🍇', 'fact', '12 виноградин',
      L("In Spain, people eat twelve grapes at midnight on New Year's Eve.", 'В Испании в новогоднюю полночь едят двенадцать виноградин.',
        'How many grapes do they eat?', ['twelve', 'seven', 'twenty']),
      L('In Spain people try to eat twelve grapes, one on each stroke of the clock at midnight. Each grape is supposed to bring a lucky month.',
        'В Испании стараются съесть двенадцать виноградин — по одной на каждый удар часов в полночь. Каждая должна принести удачный месяц.',
        '"Is supposed to" means…', ['people believe it will', 'it must', 'it never does'])),
    D('🌨️', 'word', 'snowball · snowed in',
      L("A snowball is a ball of snow. Let's have a snowball fight!", 'Snowball — снежок. Давай поиграем в снежки!', 'Make a ___ and throw it!', ['snowball', 'snowman', 'snowflake']),
      L("To be snowed in means you can't leave a place because so much snow has fallen: 'We were snowed in for three days, so we played board games.'",
        'Be snowed in — оказаться отрезанным снегом: «Нас занесло снегом на три дня, и мы играли в настольные игры».',
        'If you are snowed in, you…', ["can't leave because of the snow", 'love the snow', 'are skiing'])),
    D('📚', 'fact', 'Книжный потоп',
      L('In Iceland, people give books on Christmas Eve and read all evening.', 'В Исландии в сочельник дарят книги и читают весь вечер.',
        'What do people in Iceland give on Christmas Eve?', ['books', 'shoes', 'phones']),
      L('Iceland has a tradition called the Christmas book flood: people exchange books on Christmas Eve and spend the evening reading with hot chocolate.',
        'В Исландии есть традиция «рождественский книжный потоп»: в сочельник обмениваются книгами и проводят вечер за чтением с горячим шоколадом.',
        'To "exchange" books means…', ['to give each other books', 'to buy many books', 'to return books to a library'])),
    D('🎊', 'fact', 'Рождественские хлопушки',
      L('In Britain, people pull Christmas crackers. Bang! Inside there is a paper hat and a joke.', 'В Британии тянут рождественские хлопушки. Бах! Внутри бумажная корона и шутка.',
        'What is inside a cracker?', ['a paper hat and a joke', 'a cake', 'money']),
      L("A Christmas cracker is a paper tube that two people pull until it snaps with a bang. Inside there's usually a paper crown, a small gift and a terrible joke.",
        'Рождественская хлопушка — бумажная трубочка, которую тянут двое, пока она не лопнет с хлопком. Внутри обычно бумажная корона, маленький подарок и ужасная шутка.',
        '"Snaps" means…', ['breaks suddenly', 'melts', 'sings'])),
    D('😂', 'joke', 'Шутка из хлопушки',
      L('What do you call an old snowman? Water!', 'Как называется старый снеговик? Вода!', 'Why water?', ['The snowman melted.', 'He likes swimming.', "He's thirsty."]),
      L("Why is it always cold at Christmas? Because it's in Decembrrrr!", 'Почему на Рождество всегда холодно? Потому что оно в «декабррре»!',
        '"Brrr" is the sound people make when they are…', ['cold', 'hungry', 'happy'], say="Why is it always cold at Christmas? Because it's in Decembrrr!")),
    D('🐦', 'fact', 'Малиновки на открытках',
      L('On British Christmas cards you often see a little red bird: a robin.', 'На британских рождественских открытках часто маленькая красная птичка — малиновка.',
        'A robin is…', ['a bird', 'a tree', 'a cake']),
      L("Robins appear on many British Christmas cards. One popular explanation: Victorian postmen wore red jackets and were nicknamed 'robins'.",
        'Малиновки — на многих британских открытках. Популярное объяснение: викторианские почтальоны носили красные куртки, и их прозвали «малиновками».',
        'A "nickname" is…', ['an informal name', 'a surname', 'a secret password'])),
    D('🌗', 'fact', 'Самый короткий день',
      L('21 December is the shortest day of the year.', '21 декабря — самый короткий день в году.', 'On 21 December the day is…', ['very short', 'very long', 'very hot'],
        say='The twenty-first of December is the shortest day of the year.'),
      L('Around 21 December the northern hemisphere has its winter solstice: the shortest day and the longest night. From now on, the days slowly get longer!',
        'Около 21 декабря в северном полушарии зимнее солнцестояние: самый короткий день и самая длинная ночь. Дальше дни понемногу удлиняются!',
        'After the solstice, the days get…', ['longer', 'shorter', 'colder'],
        say='Around the twenty-first of December the northern hemisphere has its winter solstice: the shortest day and the longest night. From now on, the days slowly get longer!')),
    D('🎁', 'word', 'wrap · re-gift',
      L('Wrap means put paper around a present: I wrap my presents in red paper.', 'Wrap — заворачивать подарок: я заворачиваю подарки в красную бумагу.',
        'I ___ the present in red paper.', ['wrap', 'eat', 'read']),
      L("To re-gift means to give someone a present that you were given: 'Is it OK to re-gift a scarf you never wear?'",
        'Re-gift — передарить подарок: «Можно ли передарить шарф, который ты не носишь?»',
        'If you re-gift something, you…', ['give away a present you received', 'buy a new present', 'return it to the shop'])),
    D('⛪', 'fact', 'Два Новых года',
      L('In Russia, Christmas is on 7 January.', 'В России Рождество 7 января.', 'When is Christmas in Russia?', ['7 January', '25 December', '1 March'],
        say='In Russia, Christmas is on the seventh of January.'),
      L("Russia celebrates Christmas on 7 January and even has an 'Old New Year' on the night of 13 to 14 January, because the Orthodox Church still follows the old Julian calendar.",
        'Рождество в России — 7 января, а ещё есть «старый Новый год» в ночь на 14 января: Православная церковь живёт по старому, юлианскому календарю.',
        'Why are there two New Years?', ['because of two different calendars', 'because people love parties', 'because of the weather'],
        say="Russia celebrates Christmas on the seventh of January and even has an Old New Year on the night of the thirteenth to the fourteenth of January, because the Orthodox Church still follows the old Julian calendar.")),
    D('🥕', 'fact', 'Сочельник',
      L('Today is Christmas Eve! In Britain, children leave a mince pie for Santa and a carrot for the reindeer.', 'Сегодня сочельник! В Британии дети оставляют Санте сладкий пирожок, а оленям — морковку.',
        'What do children leave for the reindeer?', ['a carrot', 'a cake', 'milk']),
      L('On Christmas Eve British children hang up stockings and leave out a mince pie for Father Christmas and a carrot for his reindeer. By the morning, only crumbs remain!',
        'В сочельник британские дети вешают чулки и оставляют сладкий пирожок Деду Морозу и морковку его оленям. К утру остаются только крошки!',
        '"Crumbs" are…', ['tiny pieces of food', 'small presents', 'snowflakes'])),
    D('🎄', 'fact', 'Merry Xmas!',
      L("Merry Christmas! People also write it as 'Xmas'.", 'С Рождеством! Его ещё пишут как «Xmas».', '"Xmas" means…', ['Christmas', 'X-ray', 'kisses'],
        say='Merry Christmas! People also write it as X-mas.'),
      L("The X in 'Xmas' isn't a modern shortcut: it comes from the Greek letter chi, the first letter of 'Christ' in Greek, and it has been used in writing for centuries.",
        'X в «Xmas» — не современное сокращение: это греческая буква «хи», первая буква слова «Христос» по-гречески, её веками использовали на письме.',
        'The X comes from…', ['a Greek letter', 'a maths sign', 'a kiss on a card'],
        say="The X in X-mas isn't a modern shortcut: it comes from the Greek letter chi, the first letter of Christ in Greek, and it has been used in writing for centuries.")),
    D('📦', 'fact', 'Boxing Day',
      L('26 December is Boxing Day in Britain. Many shops have big sales.', '26 декабря в Британии — Boxing Day. Во многих магазинах большие распродажи.',
        'What happens in many shops on Boxing Day?', ['big sales', 'they close for a month', 'free food'],
        say='The twenty-sixth of December is Boxing Day in Britain. Many shops have big sales.'),
      L("Boxing Day has nothing to do with sport: the name probably comes from the 'Christmas boxes' of money or gifts that employers once gave their servants on 26 December.",
        'Boxing Day не связан с боксом: название, скорее всего, от «рождественских коробок» с деньгами или подарками, которые хозяева когда-то дарили слугам 26 декабря.',
        '"Has nothing to do with" means…', ['is not connected with', 'is the same as', 'is the opposite of'],
        say="Boxing Day has nothing to do with sport: the name probably comes from the Christmas boxes of money or gifts that employers once gave their servants on the twenty-sixth of December.")),
    D('🧊', 'fact', 'Ледяной отель',
      L("In Sweden there is a hotel made of ice. It's minus five degrees inside!", 'В Швеции есть отель изо льда. Внутри минус пять градусов!',
        'The hotel is made of…', ['ice', 'wood', 'glass']),
      L('Every winter a hotel is built from blocks of river ice in the village of Jukkasjärvi, Sweden. Guests sleep on beds of ice in thermal sleeping bags, and in spring the hotel melts.',
        'Каждую зиму в шведской деревне Юккасъярви из речного льда строят отель. Гости спят на ледяных кроватях в тёплых спальниках, а весной отель тает.',
        'Why do guests need thermal sleeping bags?', ['to keep warm', 'to look nice', 'to sleep faster'],
        say='Every winter a hotel is built from blocks of river ice in a small village in Sweden. Guests sleep on beds of ice in thermal sleeping bags, and in spring the hotel melts.')),
    D('🥶', 'fact', 'Самое холодное место',
      L('The coldest place on Earth is Antarctica.', 'Самое холодное место на Земле — Антарктида.', 'The coldest place on Earth is…', ['Antarctica', 'Moscow', 'Canada']),
      L('The lowest temperature ever measured on the ground was minus 89.2 degrees Celsius, at the Russian Vostok Station in Antarctica, in 1983.',
        'Самая низкая температура, измеренная у поверхности Земли, — минус 89,2 °C на российской станции «Восток» в Антарктиде в 1983 году.',
        'Where was it measured?', ['at a Russian station in Antarctica', 'in Siberia', 'at the North Pole'],
        say='The lowest temperature ever measured on the ground was minus eighty-nine point two degrees Celsius, at the Russian Vostok Station in Antarctica, in nineteen eighty-three.')),
    D('🧦', 'twister', 'Скороговорка',
      L('Snowy socks, snowy boots, snowy socks, snowy boots!', 'Снежные носки, снежные сапоги! Скажите пять раз быстро!', 'Socks and boots are…', ['clothes', 'food', 'animals']),
      L('Which wristwatches are Swiss wristwatches?', 'Какие наручные часы — швейцарские? Скажите три раза быстро!', 'A wristwatch is a watch you wear on your…', ['wrist', 'neck', 'finger'])),
    D('🏴', 'fact', 'Хогманай',
      L("In Scotland, New Year's Eve is called Hogmanay.", 'В Шотландии новогодняя ночь называется Хогманай.', 'Hogmanay is…', ["New Year's Eve in Scotland", 'a Scottish dog', 'a song']),
      L("In Scotland, the first person to step into your home after midnight is the 'first foot'. A tall, dark-haired stranger carrying coal or shortbread is said to bring good luck.",
        'В Шотландии первый, кто входит в дом после полуночи, — «первая нога». Говорят, высокий темноволосый незнакомец с углём или песочным печеньем приносит удачу.',
        "The 'first foot' is…", ['the first visitor after midnight', 'a dance', 'the first day of January'])),
    D('🥂', 'wish', 'С Новым годом!',
      L("Happy New Year! The first country to say 'Happy New Year' is Kiribati, in the Pacific Ocean.", 'С Новым годом! Первая страна, где наступает Новый год, — Кирибати в Тихом океане.',
        'How do you say «С Новым годом!»?', ['Happy New Year!', 'Happy birthday!', 'Good night!']),
      L("At midnight people in many English-speaking countries hold hands and sing 'Auld Lang Syne', an old Scottish song by Robert Burns about old friends. Happy New Year, and thank you for a great year of English!",
        'В полночь во многих англоязычных странах берутся за руки и поют «Auld Lang Syne» — старую шотландскую песню Роберта Бёрнса о старых друзьях. С Новым годом — и спасибо за отличный год с английским!',
        'The song is about…', ['old friends', 'winter weather', 'Santa'])),
]

assert len(DAYS) == 31


def payload():
    return {'on': ON, 'start': START, 'nyFrom': NY_FROM, 'nyTo': NY_TO, 'kinds': KINDS, 'days': DAYS}


def texts():
    """Что озвучить голосом платформы."""
    out = []
    for d in DAYS:
        for t in ('a', 'b'):
            out.append(d[t].get('say') or d[t]['en'])
    return out
