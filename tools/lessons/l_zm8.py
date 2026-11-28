"""Захар и Михаил 4D «The Twelfth Man» (14 декабря) — болельщики: страсть или безумие?
Грамматика (новая для них): cleft sentences и эмфатические конструкции — What I love is… · It was… who… · All I want is… · do / does / did для усиления.
Урок с большим этапом обсуждения по схеме ESL-урока (flex.discussion) и дебатами."""
from flex import *

DATE = '2026-12-14'


def zakhar_mikhail():
    return std({
        'id': 'zakhar-mikhail-8', 'prefix': 'zm8', 'owner': 'zakhar-mikhail', 'code': '4D', 'title': 'The Twelfth Man', 'level': 'B1+ → B2', 'category': 'Sport & fans',
        'minutes': '90 min', 'grammar': 'Cleft sentences and emphasis: What I love is… · It was… who / that… · All I want is… · The thing that… · emphatic do / does / did', 'date': DATE,
        'meta': {'privateLive': True},
        'gvp': {'g': 'cleft sentences (What… is…, It is / was… who / that…, All… is…, The thing / reason / place… is…) and emphatic do for strong opinions', 'v': 'fans, stadiums and football culture', 'p': 'contrastive stress for emphasis'},
        'eyebrow': 'IRIS SCHOOL · Захар и Михаил · урок 4D', 'tags': ['B1+ → B2', 'Fans', 'Discussion', 'Cleft sentences'],
        'lead': "Do fans really win matches? Two radio callers argue about «the twelfth man», you read what science says about home advantage, learn how to make your opinions sound strong — "
                "«What really matters is…», «It was the fans who…» — and then a big discussion: passion, money, violence and the future of watching sport.",
        'think': ('Have you ever been to a stadium for a big match? What was the atmosphere like? If not — would you rather watch at the stadium or at home? Why?',
                  'Вы были на стадионе на большом матче? Какая была атмосфера? Если нет — где лучше смотреть: на стадионе или дома?', ['The best match I have seen live / on TV: …', 'What I remember most is…', 'I prefer… because…']),
        'aims': ['understand fans arguing on a radio phone-in', 'use 10 words about fans and stadiums', 'make opinions stronger with cleft sentences and emphatic do', 'take part in a long discussion and a debate'],
        'listen': {'title': 'the phone-in', 'task': "A sports radio phone-in: «Do fans win matches?» Listen once: do the two callers agree?", 'task_ru': 'Звонящие согласны друг с другом?',
                   'head': 'Radio phone-in: «The twelfth man»', 'names': {'m4': 'Host', 'm3': 'Caller Artem', 'f3': 'Caller Lena'}, 'emoji': '📻',
                   'lines': [('m4', "Tonight's question: do fans really win matches? First caller, Artem."),
                             ('m3', "Absolutely. What people don't understand is how loud it is down on the pitch. When forty thousand people are singing, the players feel it. It was the fans who won us the cup last year — the team was dead in the last ten minutes."),
                             ('m4', 'Strong words. Lena, you disagree?'),
                             ('f3', "I do love the atmosphere, but what wins matches is training and tactics, not singing. The thing that annoys me is when fans think they're more important than the players."),
                             ('m3', 'So why do teams win more at home?'), ('f3', "Good question. What studies actually show is that referees give slightly more decisions to the home team. It's the referees who feel the pressure, not just the players!"),
                             ('m4', 'Interesting. And during the pandemic, with empty stadiums?'),
                             ('f3', "Exactly! Home advantage almost disappeared. So yes, fans matter — but it's the referee they influence most."),
                             ('m3', "Fine, but all I'm saying is: without fans, football is just twenty-two people running. What makes it special is the passion."),
                             ('f3', "That I agree with. What I can't accept is violence. Passion — yes. Throwing things at players — never."),
                             ('m4', "So we do agree on something! Thanks to you both.")],
                   'gist': ('Do the two callers agree?', ['Partly — they agree passion matters but not about how much fans influence results.', 'Completely.', 'Not at all.'], 0),
                   'details': [('According to Artem, who won the cup last year?', ['the fans', 'the coach', 'the referee'], 0), ('What wins matches, according to Lena?', ['training and tactics', 'singing', 'luck'], 0),
                               ('What do studies show?', ['Referees give slightly more decisions to the home team.', 'Home teams always win.', 'Fans make players slower.'], 0),
                               ('What happened during the pandemic?', ['Home advantage almost disappeared.', 'Home teams won more.', 'Matches were cancelled.'], 0), ("What can't Lena accept?", ['violence', 'singing', 'expensive tickets'], 0)],
                   'notes': [('About', ['forty thousand', '40,000', '40 000'], 'people are singing.'), ('The team was dead in the last', ['ten minutes', '10 minutes'], '.'),
                             ("Lena says it's the", ['referee', 'referees'], 'fans influence most.'), ('Without fans, football is just twenty-two people', ['running'], '.')]},
        'vocab': {'title': 'fans and stadiums', 'theme': 'Fans and football culture', 'cards': [
            ('home advantage', 'the benefit of playing at your own stadium', 'преимущество своего поля', 'Home advantage is real.', '🏟️'), ('the atmosphere', 'the feeling in a place', 'атмосфера', 'The atmosphere was electric.', '⚡'),
            ('a chant', 'a song or words fans shout together', 'кричалка', 'The fans started a chant.', '📣'), ('a season ticket', 'a ticket for all home games of a season', 'абонемент', "I've had a season ticket for ten years.", '🎟️'),
            ('a supporter', 'a fan of a team', 'болельщик', 'loyal supporters', '🧣'), ('loyal', 'always supporting someone, even when things are bad', 'преданный', 'Loyal fans come even when the team loses.', '❤️'),
            ('hooliganism', 'violent behaviour by fans', 'хулиганство (фанатское)', 'Clubs must fight hooliganism.', '🚫'), ('to boo', 'to shout «boo» to show you are unhappy', 'освистывать', 'The fans booed the referee.', '👎'),
            ('a sell-out', 'an event where all tickets are sold', 'аншлаг', 'The derby was a sell-out.', '🈵'), ('to influence', 'to have an effect on someone', 'влиять', 'Fans influence referees.', '🧲')],
            'match': [('the benefit of playing at your own stadium →', 'home advantage', ['home advantage', 'a season ticket', 'a sell-out'], ''), ('a song fans shout together →', 'a chant', ['a chant', 'a boo', 'a whistle'], ''),
                      ('violent behaviour by fans →', 'hooliganism', ['hooliganism', 'loyalty', 'the atmosphere'], ''), ('an event where all tickets are sold →', 'a sell-out', ['a sell-out', 'a season ticket', 'a supporter'], ''),
                      ('to have an effect on someone →', 'to influence', ['to influence', 'to boo', 'to support'], '')],
            'gaps': [('The atmosphere was', ['electric', 'amazing', 'incredible'], '.'), ("I've had a season", ['ticket'], 'for ten years.'), ('The fans', ['booed'], 'the referee.'), ('The derby was a', ['sell-out'], '.')]},
        'notice': ("Look at the callers' sentences. How do they make the important part stronger?", 'Как они выделяют главное?',
                   ['<mark>What</mark> people don\'t understand <mark>is</mark> how loud it is.', '<mark>It was</mark> the fans <mark>who</mark> won us the cup.', 'I <mark>do</mark> love the atmosphere, but…',
                    "<mark>All</mark> I'm saying <mark>is</mark>: without fans, football is just running.", '<mark>The thing that</mark> annoys me <mark>is</mark>…'],
                   [('«What… is…» puts the important information…', ['at the end, after «is»', 'at the beginning', 'in a question'], 0), ('«It was the fans who…» emphasises…', ['who did it (the fans, not someone else)', 'when it happened', 'how it happened'], 0),
                    ('«I do love…» — the extra «do» shows…', ['strong feeling or contrast', 'a question', 'the past'], 0)]),
        'grammar': {'title': 'cleft sentences', 'head': 'What I love is… · It was… who… · I do believe…',
                    'idea': 'Чтобы выделить главное, носители «расщепляют» предложение. ① <b>What + подлежащее + глагол + is / was + главное</b>: What I love <b>is</b> the atmosphere. '
                            '② <b>It is / was + главное + who / that…</b>: It was <b>the fans</b> who won the cup. ③ <b>All / The thing / The reason / The place + … + is…</b>: All I want is…, The reason I go is… '
                            '④ <b>do / does / did + глагол</b> — для усиления или контраста: I <b>do</b> love football (правда люблю), He <b>did</b> score (всё-таки забил).',
                    'choose': [('Выделить предмет / идею', 'What I love is the atmosphere.'), ('Выделить, КТО / КОГДА / ГДЕ', 'It was the fans who… · It was in 2018 that…'), ('Всё, что…', 'All I want is…'),
                               ('Причина, вещь, место', 'The reason (why)… is… · The thing that… is…'), ('Усилить глагол', 'do / does / did + V: I do believe…')],
                    'rows': [[('What', 'c'), ('I love', 'a'), ('is', 'd'), ('the atmosphere.', 'b')], [('It was', 'd'), ('the fans', 'b'), ('who', 'c'), ('won the cup.', 'a')],
                             [('I', 'a'), ('do', 'd'), ('believe', 'c'), ('in my team.', 'b')]],
                    'note': 'После What-части — is (ед. ч.), даже если дальше много: What I need is two tickets. · В It-cleft для людей — who / that, для остального — that.',
                    'examples': [('📣', 'What I love about football is the atmosphere.'), ('🏆', 'It was the fans who won us the cup.'), ('❤️', 'I do love the passion, but I hate violence.'), ('🎟️', 'All I want is a ticket for the final.')],
                    'traps': [('What I love it is the atmosphere.', 'What I love is the atmosphere.', 'Без лишнего it.'), ('It was the coach which changed everything.', 'It was the coach who changed everything.', 'Для людей — who / that.'),
                              ('He did trained hard.', 'He did train hard.', 'После did — глагол из словаря.')],
                    'ex1': ('Rewrite with emphasis.', 'Перепишите с выделением.', [
                        ('I love the atmosphere. → What I love', ['is'], 'the atmosphere.', ''), ('Yashin saved it. → It was Yashin', ['who', 'that'], 'saved it.', ''),
                        ('I need a rest. → What I', ['need is'], 'a rest.', ''), ('We lost in the final. → It was in the final', ['that'], 'we lost.', ''),
                        ('He scored — really! → He', ['did score'], '!', 'emphatic did'), ('I only want to win. →', ['All I want'], 'is to win.', 'All…')]),
                    'ex2': ('Put the words in order.', 'Соберите предложения.', [(['What', 'annoys me', 'is', 'the noise.'], 'What annoys me is the noise.'), (['It was', 'the referee', 'who', 'made the mistake.'], 'It was the referee who made the mistake.'),
                                                                                (['I', 'do', 'love', 'derbies.'], 'I do love derbies.')])},
        'part2': {'key': 'read', 'label': 'Reading', 'title': 'the science of home advantage', 'task': 'Read the article. What is the main reason for home advantage?', 'task_ru': 'Какова главная причина преимущества своего поля?',
                  'head': 'Do Fans Really Win Matches? What the Data Says', 'small': 'a sports science article · about 250 words', 'text': [
                      'For over a hundred years, home teams in football have won more often than away teams. In the past, about 60 per cent of points went to the home side. But why?',
                      'What most fans believe is that their singing gives players energy. Partly true: studies show that players\' testosterone levels are higher before home games. But what researchers found more surprising was the effect on referees.',
                      'In one famous experiment, referees watched videos of tackles — some with crowd noise, some silent. With the noise on, they gave fewer fouls against the home team. It is the referee, not the striker, who reacts most to forty thousand voices.',
                      'The pandemic created a perfect natural experiment. In 2020–21, when matches were played in empty stadiums, home advantage in many leagues almost disappeared, and referees gave away teams fewer yellow cards than before.',
                      'Travel matters too, though less than in the past. What used to tire away teams were long bus journeys; today most teams fly. So the conclusion is clear: fans do matter — but the people they influence most are the ones with the whistle.'],
                  'tf': [('Home teams have won more often for over a hundred years.', True), ('Studies found no physical effect on players.', False), ('With crowd noise, referees gave fewer fouls against the home team.', True),
                         ('Home advantage grew in empty stadiums.', False), ('Travel is more important today than in the past.', False)],
                  'gaps': ('Find the emphatic structures in the text.', 'Найдите конструкции выделения в тексте.', [('What most fans', ['believe'], 'is that their singing gives players energy.', ''),
                                                                                                                    ('It is the referee, not the striker,', ['who'], 'reacts most', ''), ('fans', ['do'], 'matter', '')])},
        'extra': [('emphasis', 'Game', 'make it stronger', '8 min', lambda ids:
                   rubric('a', 'Emphasis battle! Zakhar and Mikhail take turns: turn each «flat» opinion into a strong one with a cleft sentence. The teacher gives a point for each correct one.',
                          'Битва выразительности: по очереди превращайте простое мнение в «сильное».')
                   + escape(ids, [('⚽', 'Flat 1', 'I love derbies. → What I ___ derbies. →', ['love is']),
                                  ('🏆', 'Flat 2', 'Akinfeev saved the penalty. → It ___ saved the penalty. →', ['was Akinfeev who', 'was Akinfeev that']),
                                  ('🎟️', 'Flat 3', 'I only want a ticket. → All I ___ a ticket. →', ['want is']),
                                  ('📣', 'Flat 4', 'The noise annoys me. → The thing ___ me is the noise. →', ['that annoys', 'which annoys'])])
                   + lines(ids, ['Zakhar: What I…', 'Mikhail: It was… who…', 'Zakhar: The reason I…', 'Mikhail: I do…'])),
                  ('discussion', 'Discussion', 'passion or madness?', '25 min', lambda ids:
                   rubric('a', '<b>Discussion lesson.</b> Answer level by level. Rules: give a reason and an example; use at least one «What I think is…» or «It\'s… that…» per answer; your partner asks the follow-up.',
                          'Урок-обсуждение: причина + пример, в каждом ответе хотя бы одна конструкция выделения; партнёр задаёт уточняющий вопрос.')
                   + discussion(ids, [
                       ('Level 1 · You as a fan', 'Уровень 1: личные вопросы', [
                           ('Which team do you support, and why that one?', 'Who or what got you into it?'), ('What is the best live sports event you have ever been to?', 'What made the atmosphere special?'),
                           ('Do you prefer watching with friends, at home alone, or at the stadium?', 'What do you do during the match?'), ('Have you ever been really angry at a referee?', 'Were you right, looking back?')]),
                       ('Level 2 · Opinions: fan culture', 'Уровень 2: мнения', [
                           ('Do fans have the right to boo their own players?', 'When is it fair, and when is it not?'), ('Are tickets to big matches too expensive?', 'Who is being priced out?'),
                           ('Should clubs listen to fans when they choose a coach or sell a player?', 'Give an example where fans were right.'),
                           ('Is it better to support your local team or the best team?', 'What does «loyal» mean to you?')]),
                       ('Level 3 · Controversial', 'Уровень 3: спорные вопросы', [
                           ('Should clubs be punished (e.g. games without fans) for their fans\' violence?', 'Is it fair to punish the peaceful majority?'),
                           ('Is football «just a game», or something more important?', 'What do people get from it that they can\'t get elsewhere?'),
                           ('Will watching sport in VR one day replace going to stadiums?', 'Would you buy a VR season ticket?'),
                           ('Should rich owners be allowed to buy clubs and spend unlimited money?', 'What happens to small clubs?'),
                           ('Are e-sports fans «real» fans?', 'What is the difference, if any?')])],
                       ['Fans win matches.', 'Ticket prices should be limited by law.', 'Players should be role models off the pitch.', 'Watching sport on TV is better than at the stadium.', 'Football clubs belong to their fans, not to their owners.'],
                       DISCUSS_PHRASES)),
                  ('debate', 'Debate', 'the big debate', '12 min', lambda ids:
                   rubric('a', 'Formal debate. Zakhar is FOR, Mikhail is AGAINST (then swap). 1 minute opening each → 2 minutes free debate → 30 seconds closing. The teacher is the judge and notes the best emphatic sentence.',
                          'Формальные дебаты: вступление по минуте, 2 минуты свободного спора, заключение по 30 секунд.')
                   + debate('Clubs should play behind closed doors if their fans behave violently.', ['It is the clubs who must control their fans.', 'Safety is more important than atmosphere.', 'It works: violence drops fast.'],
                            ['It is the peaceful majority who are punished.', 'What football needs is better policing, not empty stadiums.', 'Empty stadiums destroy the game\'s atmosphere and income.'],
                            ['What I would like to point out is…', 'It is precisely this point that…', 'I do see your point, but…', 'The real question is…', 'All I am asking is…'])
                   + lines(ids, ['My side: …', 'Opening (1 minute): …', 'My strongest emphatic sentence: …', 'Closing: …']))],
        'mix': {'title': 'a fan blog', 'task': 'A fan blog with mistakes. Correct them.', 'task_ru': 'Фанатский блог с ошибками. Исправьте.',
                'items': [('What I love it is the atmosphere. →', ['What I love is the atmosphere.']), ('It was the coach which changed everything. →', ['It was the coach who changed everything.', 'It was the coach that changed everything.']),
                          ('He did trained every day. →', ['He did train every day.']), ('All I want are a ticket. →', ['All I want is a ticket.'])]},
        'auction': [('What I love about football is the atmosphere.', True, ''), ('What I love it is the atmosphere.', False, 'What I love is the atmosphere.'), ('It was the fans who won us the cup.', True, ''),
                    ('It was the referee which made the mistake.', False, 'It was the referee who made the mistake.'), ('I do love the passion, but I hate violence.', True, ''), ('He did scored in the final!', False, 'He did score in the final!'),
                    ('All I want is a ticket for the final.', True, ''), ('The thing what annoys me is the noise.', False, 'The thing that annoys me is the noise.')],
        'pron': {'title': 'stress for emphasis', 'task': 'In emphatic sentences we stress the important word strongly. Press 🔊 and repeat — like a real fan!', 'task_ru': 'В эмфатических конструкциях сильное ударение на главном слове.',
                 'list': [('It was the fans who won the cup.', 'it was the <u>FANS</u> who won the cup'), ('I do love the atmosphere.', 'I <u>DO</u> love the atmosphere'), ('What I hate is violence.', 'what I <u>HATE</u> is <u>VI</u>olence'),
                          ('He did score!', 'he <u>DID</u> score!')]},
        'speaking': {'title': 'quick opinions', 'questions': ['What do you love most about your favourite sport?', 'Who was it that first took you to a match?', 'What annoys you most about modern football?',
                                                             'Is there a match you still can\'t forget?', 'What is it that makes a great captain?', 'Where do you think the best atmosphere in Russia is?'],
                     'phrases': ['What I love most is…', 'It was my… who…', 'The thing that annoys me is…', 'I do think…', 'What makes a great captain is…'],
                     'task': ('Debate: should violent fans mean empty stadiums?', 'Дебаты: пустые стадионы за насилие болельщиков?')},
        'task': {'task': 'Design the perfect matchday for fans (tickets, stadium, food, safety, atmosphere). Then each of you presents your plan in 2 minutes using at least five emphatic sentences. The teacher chooses the winning plan.',
                 'task_ru': 'Придумайте идеальный день матча для болельщиков. Каждый презентует план за 2 минуты — минимум пять конструкций выделения.',
                 'plan': ['Tickets: What fans need is…', 'Stadium: The thing that matters most is…', 'Safety: It is the club that…', 'Atmosphere: What makes it special is…', 'Food / extras: All we need is…'],
                 'report': ['What I propose is…', 'It is the fans who…', 'The reason this works is…', 'I do believe that…']},
        'writing': {'title': 'an opinion post', 'task': 'Write a fan-forum post (7–8 sentences): «Do fans really win matches?» Use at least five different emphatic structures.', 'task_ru': 'Пост на фанатском форуме: минимум пять разных конструкций выделения.',
                    'example': "What people forget is that football is played by players, not fans. However, I do believe that fans can change a match. It was our fans who kept singing when we were 0–2 down last year — and we drew 2–2. What the science shows is that crowds influence referees more than players. The thing that worries me is violence: all it takes is one idiot to ruin a game. So what we need is passion without aggression.",
                    'placeholders': ['What people forget is…', 'However, I do believe…', 'It was… who…', 'What the science shows is…', 'The thing that worries me is…', 'All it takes is…', 'So what we need is…']},
        'cans': [('I can understand fans arguing on the radio', 'понять спор болельщиков'), ('I can use 10 words about fans and stadiums', 'использовать 10 слов по теме'),
                 ('I can make my opinions stronger with cleft sentences', 'усиливать мнение конструкциями выделения'), ('I can take part in a discussion and a debate', 'участвовать в обсуждении и дебатах')],
        'hw': {'words_select': [('a fan of a team →', 'a supporter', ['a supporter', 'a referee', 'a player'], ''), ('a ticket for all home games →', 'a season ticket', ['a season ticket', 'a sell-out', 'a chant'], ''),
                                ('always supporting someone →', 'loyal', ['loyal', 'violent', 'electric'], '')],
               'listen': [('atmosphere', 'atmosphere', ['atmosphere', 'atmospheric', 'hemisphere']), ('hooliganism', 'hooliganism', ['hooliganism', 'hooligan', 'heroism']), ('booed', 'booed', ['booed', 'booked', 'bowed'])],
               'words_gaps': [('home', ['advantage'], ''), ('The fans started a', ['chant'], '.'), ('loyal', ['supporters', 'fans'], '')],
               'gaps': ('Rewrite with emphasis.', 'Перепишите с выделением.', [('I love the noise. → What I love', ['is'], 'the noise.', ''), ('The fans won it. → It was the fans', ['who', 'that'], 'won it.', ''),
                                                                              ('I want a rest. → All I want', ['is'], 'a rest.', ''), ('He trained hard — really. → He', ['did train'], 'hard.', ''), ('The referee annoys me. → The thing that annoys me', ['is'], 'the referee.', '')]),
               'fix': [('What I love it is the atmosphere. →', ['What I love is the atmosphere.']), ('It was the coach which changed everything. →', ['It was the coach who changed everything.', 'It was the coach that changed everything.']),
                       ('He did trained every day. →', ['He did train every day.'])],
               'order': [(['What', 'I need', 'is', 'a ticket.'], 'What I need is a ticket.'), (['It was', 'Yashin', 'who', 'saved it.'], 'It was Yashin who saved it.')]},
        'case': {'bad': [('What I love it is…', 'What I love is…'), ('It was the coach which…', 'It was the coach who…'), ('He did trained…', 'He did train…')],
                 'ok': ['What I love about football is the atmosphere.', 'It was the fans who won us the cup.', 'I do love the passion.', 'All I want is a ticket for the final.']},
    })


def build():
    return [zakhar_mikhail()]
