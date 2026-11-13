"""Мусса (A0, самостоятельно, любит игры): 10 ежедневных миссий по 5 минут — каждая открывается в свой день."""
import datetime
from kit import *

LID, P = 'mussa-daily', 'msd'
START = datetime.date(2026, 11, 14)
DAYS = [(START + datetime.timedelta(days=i)).isoformat() for i in range(10)]

# день: (заголовок, emoji, тема по-русски, карточки, «послушай и выбери», «картинка → слово», порядок слов)
PLAN = [
    ('Hello again!', '👋', 'привет и числа', [
        ('hello', '', 'привет', 'Hello! I\'m Mussa.', '👋'), ('goodbye', '', 'до свидания', 'Goodbye! See you!', '👋'),
        ('please', '', 'пожалуйста (прошу)', 'Tea, please.', '🫖'), ('thank you', '', 'спасибо', 'Thank you, Mussa!', '👍'),
        ('yes', '', 'да', 'Yes, I ride.', '✅'), ('no', '', 'нет', 'No, thank you.', '❌')],
     [('seven', '7', ['3', '7', '10']), ('twelve', '12', ['2', '11', '12']), ('five', '5', ['5', '9', '4']), ('ten', '10', ['10', '6', '1'])],
     [('👋', 'hello', ['hello', 'no', 'a horse']), ('✅', 'yes', ['yes', 'goodbye', 'snow']), ('❌', 'no', ['please', 'no', 'thank you'])],
     [(['Mussa.', "I'm", 'Hello!'], "Hello! I'm Mussa.")]),
    ('Colours of Elbrus', '🎨', 'цвета', [
        ('white', '', 'белый', 'a white horse', '❄️'), ('black', '', 'чёрный', 'a black horse', '⚫'),
        ('brown', '', 'коричневый', 'a brown horse', '🐴'), ('green', '', 'зелёный', 'green trees', '🌲'),
        ('blue', '', 'синий, голубой', 'a blue river', '🌊'), ('red', '', 'красный', 'a red ball', '🔴')],
     [('white', 'white', ['white', 'black', 'red']), ('green', 'green', ['blue', 'green', 'brown']), ('a brown horse', 'a brown horse', ['a black horse', 'a brown horse', 'a white horse'])],
     [('🌲', 'green', ['green', 'red', 'white']), ('🔴', 'red', ['black', 'red', 'blue']), ('🌊', 'blue', ['blue', 'brown', 'green'])],
     [(['horse.', 'a white', 'I have'], 'I have a white horse.'), (['is', 'My ball', 'red.'], 'My ball is red.')]),
    ('What\'s the weather?', '☀️', 'погода', [
        ('sunny', '', 'солнечно', "It's sunny today.", '☀️'), ('cold', '', 'холодно', "It's cold in the mountains.", '🥶'),
        ('hot', '', 'жарко', "It's hot in July.", '🔥'), ('rain', '', 'дождь', "It's rainy. Take a jacket!", '🌧️'),
        ('snow', '', 'снег', 'There is snow on Elbrus.', '❄️'), ('cloudy', '', 'облачно', "It's cloudy.", '☁️')],
     [("It's sunny.", "It's sunny.", ["It's sunny.", "It's cold.", "It's hot."]), ("It's cold.", "It's cold.", ["It's hot.", "It's cold.", "It's cloudy."]), ('snow', 'snow', ['rain', 'snow', 'sunny'])],
     [('☀️', 'sunny', ['sunny', 'cold', 'cloudy']), ('🥶', 'cold', ['hot', 'cold', 'rain']), ('☁️', 'cloudy', ['snow', 'sunny', 'cloudy'])],
     [(['today.', "It's", 'cold'], "It's cold today.")]),
    ('Football day', '⚽', 'футбол', [
        ('a coach', '', 'тренер', 'My coach is great.', '🧑‍🏫'), ('a fan', '', 'болельщик', 'I am a fan of football.', '🎉'),
        ('pass', '', 'отдать пас', 'Pass the ball!', '⚽'), ('Goal!', '', 'Гол!', 'Goal! We win!', '🥅'),
        ('the score', '', 'счёт', 'The score is two – one.', '📊'), ('run', '', 'бегать, бежать', 'I run fast.', '🏃')],
     [('Pass the ball!', 'Pass the ball!', ['Pass the ball!', 'Goal!', 'I run fast.']), ('a coach', 'a coach', ['a fan', 'a coach', 'a team']), ('two – one', '2 – 1', ['2 – 1', '1 – 2', '3 – 0'])],
     [('🥅', 'Goal!', ['Goal!', 'a fan', 'run']), ('🏃', 'run', ['pass', 'run', 'win']), ('🏆', 'win', ['win', 'kick', 'a coach'])],
     [(['football', 'I play', 'on Saturday.'], 'I play football on Saturday.')]),
    ('My family', '👨', 'семья', [
        ('my mother', '', 'моя мама', 'This is my mother.', '👩'), ('my father', '', 'мой папа', 'This is my father.', '👨'),
        ('my brother', '', 'мой брат', 'My brother rides too.', '👦'), ('my sister', '', 'моя сестра', 'My sister likes horses.', '👧'),
        ('my grandmother', '', 'моя бабушка', 'My grandmother makes tea.', '👵'), ('my family', '', 'моя семья', 'My family is big.', '🏠')],
     [('my sister', 'my sister', ['my brother', 'my sister', 'my mother']), ('my father', 'my father', ['my father', 'my grandmother', 'my family']), ('This is my mother.', 'This is my mother.', ['This is my mother.', 'This is my horse.', 'This is my team.'])],
     [('👵', 'my grandmother', ['my grandmother', 'my sister', 'my father']), ('👦', 'my brother', ['my mother', 'my brother', 'my family']), ('👩', 'my mother', ['my mother', 'my brother', 'a tourist'])],
     [(['is', 'This', 'my brother.'], 'This is my brother.')]),
    ('Tea for the tourists', '🫖', 'еда и чай для туристов', [
        ('tea', '', 'чай', 'Tea, please.', '🫖'), ('coffee', '', 'кофе', 'A coffee, please.', '☕'),
        ('soup', '', 'суп', 'The soup is hot.', '🍲'), ('an apple', '', 'яблоко', 'An apple for my horse.', '🍎'),
        ('water', '', 'вода', 'Water, please.', '💧'), ('Here you are.', '', 'Вот, пожалуйста (даю).', 'Tea? Here you are.', '👍')],
     [('Tea, please.', 'Tea, please.', ['Tea, please.', 'Water, please.', 'Coffee, please.']), ('soup', 'soup', ['soup', 'tea', 'an apple']), ('Here you are.', 'Here you are.', ['Thank you.', 'Here you are.', 'Goodbye.'])],
     [('☕', 'coffee', ['coffee', 'water', 'soup']), ('🍎', 'an apple', ['tea', 'an apple', 'a ball']), ('💧', 'water', ['water', 'coffee', 'snow'])],
     [(['you', 'tea?', 'Would', 'like'], 'Would you like tea?')]),
    ('On the trail', '🧭', 'фразы гида', [
        ("Let's go!", '', 'Поехали! Пойдёмте!', "Let's go to the river!", '➡️'), ('Stop!', '', 'Стоп!', 'Stop here, please.', '🛑'),
        ('Look!', '', 'Смотрите!', 'Look! A waterfall!', '👀'), ('Follow me.', '', 'Следуйте за мной.', 'Follow me, please.', '🐎'),
        ('Be careful!', '', 'Осторожно!', 'Be careful! It\'s cold.', '🥶'), ('Take a photo!', '', 'Сфотографируйтесь!', 'Take a photo here!', '📸')],
     [("Let's go!", "Let's go!", ["Let's go!", 'Stop!', 'Look!']), ('Follow me.', 'Follow me.', ['Be careful!', 'Follow me.', 'Take a photo!']), ('Be careful!', 'Be careful!', ['Look!', 'Be careful!', "Let's go!"])],
     [('🛑', 'Stop!', ['Stop!', 'Look!', "Let's go!"]), ('👀', 'Look!', ['Follow me.', 'Look!', 'Stop!']), ('📸', 'Take a photo!', ['Take a photo!', 'Be careful!', 'Look!'])],
     [(['Elbrus!', 'Look!', 'This is'], 'Look! This is Elbrus!')]),
    ('Numbers 13–20', '🔢', 'числа 13–20 и «сколько?»', [
        ('thirteen', '', 'тринадцать', 'thirteen horses', '🔢'), ('fifteen', '', 'пятнадцать', 'fifteen tourists', '🔢'),
        ('eighteen', '', 'восемнадцать', 'eighteen kilometres', '🔢'), ('twenty', '', 'двадцать', 'twenty minutes', '🔢'),
        ('How much?', '', 'Сколько стоит?', 'How much is the tour?', '💰'), ('How many?', '', 'Сколько (штук)?', 'How many horses?', '🐎')],
     [('fourteen', '14', ['14', '40', '4']), ('sixteen', '16', ['6', '16', '60']), ('twenty', '20', ['12', '20', '2']), ('nineteen', '19', ['19', '9', '90'])],
     [('💰', 'How much?', ['How much?', 'How many?', 'Hello!']), ('🐎', 'How many?', ['How many?', 'How much?', 'Goal!'])],
     [(['horses?', 'How many', 'do you have'], 'How many horses do you have?')]),
    ('Days of the week', '📅', 'дни недели', [
        ('Monday', '', 'понедельник', 'The tour is on Monday.', '📅'), ('Tuesday', '', 'вторник', 'on Tuesday', '📅'),
        ('Wednesday', '', 'среда', 'on Wednesday', '📅'), ('Saturday', '', 'суббота', 'I play football on Saturday.', '⚽'),
        ('Sunday', '', 'воскресенье', 'On Sunday I ride.', '🐎'), ('today', '', 'сегодня', 'Today is Friday.', '📅')],
     [('Monday', 'Monday', ['Monday', 'Sunday', 'Tuesday']), ('Wednesday', 'Wednesday', ['Saturday', 'Wednesday', 'Monday']), ('on Sunday', 'on Sunday', ['on Saturday', 'on Sunday', 'on Tuesday'])],
     [('⚽', 'Saturday', ['Saturday', 'Monday', 'today']), ('🐎', 'Sunday', ['Tuesday', 'Sunday', 'Wednesday'])],
     [(['on Monday.', 'is', 'The tour'], 'The tour is on Monday.')]),
    ('Boss level 🏆', '🏆', 'финал: всё вместе', [], [], [], []),
]

BOSS_LISTEN = [
    ('Hello! My name is Mussa.', 'Hello! My name is Mussa.', ['Hello! My name is Mussa.', 'Goodbye, Mussa!', 'This is my horse.']),
    ('It\'s sunny today.', '☀️', ['☀️', '🥶', '🌧️']),
    ('a white horse', 'a white horse', ['a black horse', 'a white horse', 'a brown horse']),
    ('fifteen', '15', ['5', '15', '50']),
    ('Follow me.', 'Follow me.', ['Follow me.', 'Stop!', 'Look!']),
    ('on Saturday', 'on Saturday', ['on Sunday', 'on Saturday', 'on Monday']),
]
BOSS_DIALOG = [('f', 'Hello! Are you our guide?'), ('m', "Yes! Hello! I'm Mussa. Welcome to Elbrus!"), ('f', 'Nice to meet you! Is it cold today?'),
               ('m', "Yes, it's cold. Look! There is snow on the mountain."), ('f', 'Wow! Can I ride a white horse?'), ('m', "Yes, of course. This is Snow. Follow me. Let's go!")]


def day_body(n, title, em, topic, cards, listen, pics, order):
    ids = Ids('%s-d%d' % (P, n))
    if not cards:  # финал
        body = intro('🏆', 'Mission 10 of 10 · Boss level!', '7 min', 'Финальная миссия: всё, что вы выучили за 10 дней. Получится — вы молодец!')
        body += rubric('a', 'Listen. Choose.', 'Слушайте и выбирайте.') + ex_listen_pick(ids, BOSS_LISTEN)
        body += rubric('b', 'A tourist meets Mussa. Listen and read.', 'Туристка встречает Муссу. Послушайте и почитайте.')
        body += listening('%s-d10-lis' % P, BOSS_DIALOG, 'At the stables', 'Listen twice · Слушайте два раза', '🐎', {'f': 'Tourist', 'm': 'Mussa'})
        body += deck('Questions · Вопросы', [
            mc('%s-d10-q1' % P, 'Who is the guide?', ['Mussa', 'the tourist', 'Snow'], 0),
            mc('%s-d10-q2' % P, 'Is it hot today?', ['Yes, it is.', "No, it's cold."], 1),
            mc('%s-d10-q3' % P, 'What colour is the horse?', ['black', 'white', 'brown'], 1)])
        body += rubric('c', 'Put the words in order.', 'Соберите фразы.') + ex_order(ids, [
            (["I'm", 'Hello!', 'your guide.'], "Hello! I'm your guide."), (['cold', "It's", 'today.'], "It's cold today."), (['me.', 'Follow', "Let's go!"], "Let's go! Follow me.")])
        body += rubric('d', 'Write three sentences about you: your name, your horses, your football.', 'Напишите три предложения о себе: имя, лошади, футбол.')
        body += box('<b>Example:</b> I\'m Mussa. I have ten horses. I play football on Saturday.', '✍️') + lines(ids, ["I'm…", 'I have…', 'I play…'])
        body += rubric('e', '🏆 You did it! Send your answers to your teacher.', '🏆 Вы прошли все 10 миссий! Отправьте ответы преподавателю.') + send_box()
        return body
    body = intro(em, 'Mission %d of 10 · %s' % (n, title), '5 min', 'Миссия на 5 минут: %s. Нажимайте 🔊, слушайте и повторяйте вслух!' % topic)
    body += rubric('a', 'Tap each card, press 🔊 and repeat.', 'Нажимайте на карточки, слушайте и повторяйте.') + bank('D%d' % n, title, cards)
    body += rubric('b', 'Press 🔊. Choose.', 'Нажмите 🔊. Что прозвучало?') + ex_listen_pick(ids, listen)
    body += rubric('c', 'What is it? Tap.', 'Что это? Выберите.') + ex_pic(ids, pics)
    body += rubric('d', 'Put the words in order.', 'Соберите фразу.') + ex_order(ids, order)
    body += rubric('e', 'Done? Press «Отправить преподавателю». See you tomorrow! 👋', 'Готово? Нажмите «Отправить преподавателю». До завтра!') + send_box()
    return body


def build():
    secs = []
    plan = ''.join('<li><b>Day %d · %s</b> — %s<span class="ru-line">%s</span></li>' % (
        i + 1, datetime.date.fromisoformat(DAYS[i]).strftime('%a %d %b'), t, topic) for i, (t, _, topic, *_r) in enumerate(PLAN))
    warm = Ids(P + '-w')
    start = ('<div class="challenge-hero">%s<div><b>10 days · 10 missions</b><span>Каждый день новая миссия — 5 минут</span></div></div>' % img('🏆', 'challenge-pic')
             + task([('Every day at midnight a new mission opens here. It takes 5 minutes!', 'Каждый день в полночь здесь открывается новая миссия на 5 минут.'),
                     ('Press 🔊, listen and say it aloud. Mistakes are OK!', 'Нажимайте 🔊, слушайте и повторяйте вслух. Ошибаться можно!'),
                     ('At the end of each mission press «Отправить преподавателю».', 'В конце каждой миссии нажимайте «Отправить преподавателю».'),
                     ('10 missions = Boss level and a 🏆!', '10 миссий — и финальный «Boss level» с кубком!')])
             + '<div class="box"><b>The plan · План</b><ol class="items">%s</ol></div>' % plan
             + rubric('a', 'Warm up now: what do you remember? Tap.', 'Разминка уже сейчас: что вы помните? Выберите.')
             + ex_pic(warm, [('🐎', 'a horse', ['a horse', 'a ball', 'snow']), ('⚽', 'football', ['football', 'a river', 'a tour']), ('🏔️', 'a mountain', ['a tourist', 'a mountain', 'a photo'])]))
    secs.append(('%s-hw-prep' % P, 'Start here', section('%s-hw-prep' % P, 'Start here', '10 days in Elbrus', '3 min', start)))
    words = []
    for i, d in enumerate(PLAN):
        n = i + 1
        sid = '%s-hw-day%d' % (P, n)
        lab = 'Day %d · %s' % (n, d[0])
        secs.append((sid, lab, section(sid, lab, d[0] + ' ' + d[1] if n < 10 else d[0], '5 min' if n < 10 else '7 min', day_body(n, *d), lock=(DAYS[i], n))))
        words += [(w, r) for w, _, r, _, _ in d[3]]
    case = {'bad': [('I is Mussa.', "I'm Mussa."), ('a horse white', 'a white horse'), ('It cold today.', "It's cold today."), ('Follow I.', 'Follow me.')],
            'ok': ["I'm Mussa.", 'a white horse', "It's cold today.", 'Follow me.', "Let's go!", 'Tea, please.', 'This is my brother.', 'The tour is on Monday.']}
    gid = LID + '-games'
    secs.append((gid, 'Games', section(gid, 'Games', 'Play every day', '10 min', games_block(LID, words, case))))
    meta = {'id': LID, 'owner': 'mussa', 'title': '10 Days in Elbrus', 'level': 'A0', 'category': 'Daily missions', 'minutes': '10 × 5 min',
            'grammar': "Daily missions · colours · weather · family · tour phrases", 'date': '2026-11-13', 'code': 'D10',
            'hwSection': '%s-hw-prep' % P, 'hwSince': '2026-11-13T06:00:00Z', 'draft': False, 'kind': 'homework', 'hwTag': 'КАЖДЫЙ ДЕНЬ · 10 МИССИЙ',
            'daily': {'days': DAYS},  # без «challenge»: его всплывающее окно написано под «4 Days, 4 Skills»
            'gvp': {'g': "I'm… · It's… · This is my… · Let's go!", 'v': 'colours, weather, football, family, food, tour phrases, numbers 13–20, days', 'p': 'listen and repeat'}}
    d, h = lesson(meta, {}, secs, 'IRIS SCHOOL · Мусса · 10 миссий',
                  'Ten short missions — one every day, 5 minutes each. Colours, weather, football, family, tea for tourists, guide phrases, numbers and days — and a Boss level on day 10! 🏆',
                  ['A0', 'Every day', '10 × 5 min', 'Games'])
    voc = {w: {'ru': r, 'example': ex} for dd in PLAN for w, _, r, ex, _ in dd[3]}
    return [(d, h, voc)]
