"""📚 Больше практики грамматики: раздел «Grammar practice» в каждом новом уроке (как в уроках платформы:
шаг 1 — выбрать, шаг 2 — написать форму, шаг 3 — исправить ошибку, шаг 4 — собрать предложение, шаг 5 — о себе).
BANK — упражнения по темам; LESSONS — какой урок какие темы получает. Раздел встаёт сразу после грамматики урока.
Формат пунктов: choose (предложение с ___, ответ, варианты) · write (предложение с ___, [ответы], подсказка) ·
fix (неверно, [верно]) · order ([куски], ответ) · me (подсказки для «о себе»)."""
from kit import Ids, rubric, ex_select, ex_gaps, ex_lines, ex_order, lines, section, e

B = {}


def T(key, title, choose, write, fix, order, me):
    B[key] = {'title': title, 'choose': choose, 'write': write, 'fix': fix, 'order': order, 'me': me}


# ======================================================================= A0–A2
T('past_regular', 'past simple: -ed', [
    ('Yesterday I ___ my grandma.', 'visited', ['visited', 'visit', 'visits']), ('We ___ football after school.', 'played', ['played', 'play', 'plaied']),
    ('She ___ a cake for the party.', 'baked', ['baked', 'bakeed', 'bakes']), ('They ___ to music all evening.', 'listened', ['listened', 'listen', 'listening']),
    ('I ___ English last night.', 'studied', ['studied', 'studyed', 'study']), ('He ___ the film.', "didn't like", ["didn't like", "didn't liked", 'not liked']),
    ('___ you watch TV yesterday?', 'Did', ['Did', 'Do', 'Were']), ('We ___ in the park on Sunday.', 'walked', ['walked', 'walk', 'walkt'])],
    [('Last summer we ___ in a big hotel.', ['stayed'], 'stay'), ('My dad ___ dinner yesterday.', ['cooked'], 'cook'), ('I ___ my room on Saturday.', ['cleaned'], 'clean'),
     ('The film ___ at eight.', ['started'], 'start'), ('She ___ her friend.', ['phoned', 'called'], 'phone'), ('We ___ to the zoo.', ["didn't go", 'did not go'], '➖ go'),
     ('', ['Did'], 'they dance at the party?', '❓'), ('Yes, they ___ .', ['did'], 'short answer')],
    [('I playd tennis. →', ['I played tennis.']), ('She was cooked dinner. →', ['She cooked dinner.']), ("We didn't watched TV. →", ["We didn't watch TV.", 'We did not watch TV.']),
     ('Did you visited Kate? →', ['Did you visit Kate?'])],
    [(['visited', 'We', 'our grandma.'], 'We visited our grandma.'), (["didn't", 'I', 'watch TV.'], "I didn't watch TV."), (['Did', 'she', 'dance?'], 'Did she dance?')],
    ['Last weekend I…', "Yesterday I didn't…"])

T('past_irregular', 'past simple: went, saw, ate…', [
    ('Last summer we ___ to the sea.', 'went', ['went', 'goed', 'go']), ('I ___ a big fish!', 'saw', ['saw', 'seed', 'see']), ('We ___ pancakes for breakfast.', 'had', ['had', 'haved', 'has']),
    ('She ___ a new dress.', 'bought', ['bought', 'buyed', 'brought']), ('They ___ home at ten.', 'came', ['came', 'comed', 'come']), ('He ___ a lot of photos.', 'took', ['took', 'taked', 'take']),
    ('I ___ my keys!', 'lost', ['lost', 'losed', 'lose']), ('We ___ sleep well.', "didn't", ["didn't", "don't", 'not'])],
    [('I ___ up at seven.', ['got'], 'get'), ('We ___ hot chocolate.', ['drank'], 'drink'), ('She ___ me a present.', ['gave'], 'give'), ('They ___ a snowman.', ['made'], 'make'),
     ('He ___ to work by bus.', ['went'], 'go'), ('I ___ a good book.', ['read'], 'read'), ('Where ___ you go?', ['did'], ''), ('We ___ see the museum.', ["didn't", 'did not'], '➖')],
    [('We goed to the park. →', ['We went to the park.']), ('Did you saw the film? →', ['Did you see the film?']), ('I eated a pizza. →', ['I ate a pizza.']), ("She didn't came. →", ["She didn't come.", 'She did not come.'])],
    [(['went', 'We', 'to the cinema.'], 'We went to the cinema.'), (['did', 'Where', 'you', 'go?'], 'Where did you go?'), (['bought', 'I', 'a souvenir.'], 'I bought a souvenir.')],
    ['Last weekend I went…', 'I saw / ate…'])

T('was_were', 'was / were', [
    ('I ___ at home yesterday.', 'was', ['was', 'were']), ('They ___ very tired.', 'were', ['was', 'were']), ('The film ___ funny.', 'was', ['was', 'were']),
    ('___ you at school on Monday?', 'Were', ['Was', 'Were']), ('There ___ a lot of people.', 'were', ['was', 'were']), ('There ___ a cat in the garden.', 'was', ['was', 'were']),
    ('We ___ at the party.', "weren't", ["wasn't", "weren't"]), ('It ___ cold.', "wasn't", ["wasn't", "weren't"])],
    [('My mum ___ a teacher.', ['was'], ''), ('The shops ___ closed.', ['were'], ''), ('', ['Was'], 'it sunny?', '❓'), ('No, it ___ .', ["wasn't", 'was not'], ''),
     ('There ___ two dogs in the park.', ['were'], ''), ('There ___ a big tree.', ['was'], ''), ('We ___ happy.', ['were'], ''), ('I ___ hungry.', ["wasn't", 'was not'], '➖')],
    [('The lions was sleepy. →', ['The lions were sleepy.']), ('I were at the zoo. →', ['I was at the zoo.']), ('There was three bears. →', ['There were three bears.']), ('Was they happy? →', ['Were they happy?'])],
    [(['were', 'We', 'at the zoo.'], 'We were at the zoo.'), (['There', 'was', 'a big bear.'], 'There was a big bear.'), (['Was', 'it', 'cold?'], 'Was it cold?')],
    ['Yesterday I was…', 'Last summer there were…'])

T('pres_cont', 'present continuous', [
    ('Look! The baby ___ .', 'is sleeping', ['is sleeping', 'sleeps', 'sleeping']), ('I ___ a book now.', "'m reading", ["'m reading", 'read', 'reading']),
    ('They ___ football right now.', 'are playing', ['are playing', 'is playing', 'play']), ('She ___ TV at the moment.', "isn't watching", ["isn't watching", "doesn't watch", "aren't watching"]),
    ('___ you listening to me?', 'Are', ['Are', 'Do', 'Is']), ('What ___ he doing?', 'is', ['is', 'are', 'does']), ('We ___ on the beach.', 'are sitting', ['are sitting', 'are siting', 'sit']),
    ('It ___ now. Take an umbrella!', "'s raining", ["'s raining", 'rains', 'rain'])],
    [('My dad ___ dinner.', ["'s cooking", 'is cooking'], 'cook'), ('The children ___ in the sea.', ["'re swimming", 'are swimming'], 'swim'), ('I ___ a letter.', ["'m writing", 'am writing'], 'write'),
     ('She ___ a red dress today.', ["'s wearing", 'is wearing'], 'wear'), ('We ___ TV now.', ["aren't watching", 'are not watching', "'re not watching"], '➖ watch'),
     ('', ['Is'], 'he sleeping?', '❓'), ('They ___ photos.', ["'re taking", 'are taking'], 'take'), ('The sun ___ .', ["'s shining", 'is shining'], 'shine')],
    [('She swimming now. →', ["She's swimming now.", 'She is swimming now.']), ('They is playing. →', ["They're playing.", 'They are playing.']), ("I'm siting on the beach. →", ["I'm sitting on the beach."]),
     ('Are you listen? →', ['Are you listening?'])],
    [(["She's", 'reading', 'a book.'], "She's reading a book."), (['are', 'What', 'you', 'doing?'], 'What are you doing?'), (["We're", 'walking', 'in the park.'], "We're walking in the park.")],
    ['Right now I am…', 'My family is…'])

T('pp_ever', 'present perfect: Have you ever…?', [
    ('Have you ever ___ sushi?', 'eaten', ['eaten', 'ate', 'eat']), ('I have never ___ to Japan.', 'been', ['been', 'went', 'go']), ('She ___ a famous person.', 'has met', ['has met', 'have met', 'has meet']),
    ('___ you ever ridden a horse?', 'Have', ['Have', 'Did', 'Do']), ('No, I ___ .', "haven't", ["haven't", "didn't", "don't"]), ('We have ___ a whale.', 'seen', ['seen', 'saw', 'see']),
    ('He has never ___ a plane.', 'flown', ['flown', 'flew', 'fly']), ('I ___ snails.', "'ve never eaten", ["'ve never eaten", 'never ate', 'have ever eaten'])],
    [('Have you ever ___ a camel?', ['ridden'], 'ride'), ("I've never ___ a bone.", ['broken'], 'break'), ('She has ___ to Paris twice.', ['been'], 'be'), ('Have they ever ___ a prize?', ['won'], 'win'),
     ("We've ___ this film three times!", ['seen'], 'see'), ('He has never ___ coffee.', ['drunk'], 'drink'), ('', ['Has'], 'she ever cooked for ten people?', '❓'), ('Yes, she ___ .', ['has'], '')],
    [('Did you ever see a whale? →', ['Have you ever seen a whale?']), ("I've never eat sushi. →", ["I've never eaten sushi.", 'I have never eaten sushi.']), ('She have been to Italy. →', ['She has been to Italy.', "She's been to Italy."]),
     ('Have you ever been there? — Yes, I did. →', ['Yes, I have.'])],
    [(['Have', 'ever', 'you', 'been to Spain?'], 'Have you ever been to Spain?'), (["I've", 'never', 'seen snow.'], "I've never seen snow."), (['has', 'She', 'won a prize.'], 'She has won a prize.')],
    ["I've…", "I've never…"])

T('going_to', 'be going to', [
    ("I ___ visit my parents.", "'m going to", ["'m going to", 'going to', "'m going"]), ('She ___ learn to ski.', "'s going to", ["'s going to", 'are going to', 'going']),
    ('We ___ stay at home.', "aren't going to", ["aren't going to", "isn't going to", "don't going to"]), ('___ you going to travel?', 'Are', ['Are', 'Do', 'Is']),
    ("They're going to ___ a hotel.", 'book', ['book', 'booking', 'books']), ('What ___ you going to do?', 'are', ['are', 'do', 'is']), ("He's going to ___ .", 'relax', ['relax', 'relaxing', 'relaxes']),
    ('It ___ rain — look at the clouds!', "'s going to", ["'s going to", "'m going to", 'going to'])],
    [('I ___ (visit) Sochi.', ["'m going to visit", 'am going to visit'], 'visit'), ('We ___ (stay) in a hotel.', ["'re going to stay", 'are going to stay'], 'stay'),
     ('He ___ (not / work) in January.', ["isn't going to work", 'is not going to work', "'s not going to work"], '➖ work'), ('', ['Are'], 'you going to ski?', '❓'),
     ('My kids ___ (learn) to ski.', ["'re going to learn", 'are going to learn'], 'learn'), ('She ___ (read) a lot.', ["'s going to read", 'is going to read'], 'read'),
     ('Where are you going ___ stay?', ['to'], ''), ('They ___ (buy) a car.', ["'re going to buy", 'are going to buy'], 'buy')],
    [('I going to ski. →', ["I'm going to ski.", 'I am going to ski.']), ("She's going to skis. →", ["She's going to ski."]), ('We are going stay. →', ['We are going to stay.', "We're going to stay."]),
     ('What you are going to do? →', ['What are you going to do?'])],
    [(["I'm", 'going to', 'relax.'], "I'm going to relax."), (['are', 'Where', 'you going to', 'stay?'], 'Where are you going to stay?'), (["We're not", 'going to', 'work.'], "We're not going to work.")],
    ["In the holidays I'm going to…", "I'm not going to…"])

T('will_going', "will or going to?", [
    ("The phone is ringing! — I ___ answer it.", "'ll", ["'ll", "'m going to", 'am']), ("We ___ have a party. We decided last week.", "'re going to", ["'re going to", "'ll", 'will to']),
    ('___ I help you with your bags?', 'Shall', ['Shall', 'Will', 'Do']), ("I promise I ___ be late.", "won't", ["won't", "don't", "'m not going"]),
    ("I think it ___ snow tomorrow.", 'will', ['will', 'is', 'shall']), ("It's cold. — I ___ close the window.", "'ll", ["'ll", "'m going to", 'close']),
    ("Look at those clouds! It ___ rain.", "'s going to", ["'s going to", "'ll", 'rains']), ("I ___ visit Grandma on Sunday — I've bought the tickets.", "'m going to", ["'m going to", "'ll", 'visit'])],
    [("I'm thirsty. — I ___ get you some water.", ["'ll", 'will'], 'now'), ('We ___ fly to Spain in May. We have the tickets.', ["'re going to", 'are going to'], 'plan'),
     ('', ['Shall'], 'I open the door?', 'offer'), ('I promise I ___ tell anyone.', ["won't", 'will not'], 'promise'), ('I think you ___ love this film.', ["'ll", 'will'], 'opinion'),
     ('She ___ study medicine. She has decided.', ["'s going to", 'is going to'], 'plan'), ("Don't worry, I ___ help you.", ["'ll", 'will'], ''), ('Are you ___ to come to the party?', ['going'], '')],
    [('Will I carry your bag? →', ['Shall I carry your bag?']), ("I'll to call you. →", ["I'll call you.", 'I will call you.']), ("I promise I don't tell. →", ["I promise I won't tell.", 'I promise I will not tell.']),
     ("We going to have a party. →", ["We're going to have a party.", 'We are going to have a party.'])],
    [(['Shall', 'I', 'help you?'], 'Shall I help you?'), (["I'll", 'call you', 'tomorrow.'], "I'll call you tomorrow."), (["We're", 'going to', 'celebrate.'], "We're going to celebrate.")],
    ["Next weekend I'm going to…", "I promise I'll…"])

T('will_pred', "will / won't: predictions", [
    ('In 2050 robots ___ cook for us.', 'will', ['will', 'are', 'going']), ("People ___ drive cars.", "won't", ["won't", "don't", "not will"]), ('___ we live on the Moon?', 'Will', ['Will', 'Do', 'Are']),
    ('I think it ___ rain.', "'ll", ["'ll", 'is', 'rains']), ("I don't think he ___ come.", 'will', ['will', "won't", 'is']), ('Cars will ___ electric.', 'be', ['be', 'are', 'to be']),
    ('She will ___ a doctor.', 'be', ['be', 'is', 'to be']), ('Life ___ be better.', 'will', ['will', 'wills', 'is'])],
    [('In the future people ___ (live) longer.', ['will live', "'ll live"], 'live'), ('Robots ___ (not / do) all the work.', ["won't do", 'will not do'], '➖ do'), ('', ['Will'], 'we have flying cars?', '❓'),
     ('I think I ___ (be) a teacher.', ["'ll be", 'will be'], 'be'), ('It ___ (be) sunny tomorrow.', ["'ll be", 'will be'], 'be'), ('We ___ (not / need) money.', ["won't need", 'will not need'], '➖ need'),
     ('Prices ___ (go) up.', ['will go', "'ll go"], 'go'), ('Maybe she ___ (win).', ['will win', "'ll win"], 'win')],
    [('Robots will cooks. →', ['Robots will cook.']), ('I will to be a vet. →', ['I will be a vet.', "I'll be a vet."]), ("People don't will drive. →", ["People won't drive.", 'People will not drive.']),
     ('Will people to live on Mars? →', ['Will people live on Mars?'])],
    [(['will', 'Robots', 'cook for us.'], 'Robots will cook for us.'), (["won't", 'I', 'need a car.'], "I won't need a car."), (['Will', 'we', 'fly?'], 'Will we fly?')],
    ['In 2050 I will…', "I won't…"])

T('comparatives_A', 'comparatives and superlatives', [
    ('A plane is ___ than a train.', 'faster', ['faster', 'more fast', 'fastest']), ('This jacket is ___ than that one.', 'more expensive', ['more expensive', 'expensiver', 'most expensive']),
    ('My bag is ___ than yours.', 'bigger', ['bigger', 'biger', 'more big']), ('This is ___ pizza in town!', 'the best', ['the best', 'the better', 'the goodest']),
    ('Today is ___ than yesterday.', 'worse', ['worse', 'badder', 'worst']), ('She is ___ girl in the class.', 'the tallest', ['the tallest', 'the taller', 'the most tall']),
    ('Moscow is bigger ___ Tver.', 'than', ['than', 'that', 'then']), ('This is the ___ comfortable chair.', 'most', ['most', 'more', 'best'])],
    [('The metro is ___ than a taxi.', ['cheaper'], 'cheap'), ('My phone is ___ than yours.', ['newer'], 'new'), ('This film is ___ than that one.', ['more interesting'], 'interesting'),
     ('Summer is ___ season.', ['the hottest'], 'hot'), ('He is ___ player in the team.', ['the best'], 'good'), ('Your English is ___ than mine!', ['better'], 'good'),
     ('This is ___ day of my life!', ['the happiest'], 'happy'), ('A taxi is ___ than a bus.', ['more comfortable'], 'comfortable')],
    [('My bag is more big than yours. →', ['My bag is bigger than yours.']), ('It is the most cheap shop. →', ['It is the cheapest shop.', "It's the cheapest shop."]), ('She is taller that me. →', ['She is taller than me.']),
     ('This is the goodest cake. →', ['This is the best cake.'])],
    [(['is', 'cheaper', 'The bus', 'than the train.'], 'The bus is cheaper than the train.'), (['the best', "It's", 'shop in town.'], "It's the best shop in town."), (['is', 'bigger', 'Moscow', 'than Sochi.'], 'Moscow is bigger than Sochi.')],
    ['My city is …-er than…', 'The best place in my town is…'])

T('rules_A', "can / can't / have to / don't have to", [
    ("In football you ___ touch the ball with your hands.", "can't", ["can't", "don't have to", 'can']), ('Cyclists ___ wear a helmet.', 'have to', ['have to', "can't", 'has to']),
    ("You ___ be tall to play chess.", "don't have to", ["don't have to", "can't", 'have to']), ('She ___ train every day.', 'has to', ['has to', 'have to', 'have']),
    ('In tennis you ___ use a racket.', 'have to', ['have to', "don't have to", "can't"]), ('You ___ swim here — it\'s dangerous!', "can't", ["can't", "don't have to", 'have to']),
    ('Do you ___ wear a uniform?', 'have to', ['have to', 'has to', 'can to']), ('Goalkeepers ___ use their hands.', 'can', ['can', "can't", 'have'])],
    [('In chess you ___ talk.', ["can't", 'cannot'], 'нельзя'), ('Swimmers ___ be in the water.', ['have to'], 'обязательно'), ('You ___ pay — it\'s free.', ["don't have to", 'do not have to'], 'не обязательно'),
     ('He ___ get up at six for training.', ['has to'], 'обязательно'), ('You ___ use your phone in the exam.', ["can't", 'cannot'], 'нельзя'), ('We ___ wear a helmet on bikes.', ['have to'], 'обязательно'),
     ('', ['Does'], 'she have to work today?', '❓'), ('Children ___ play here. It\'s a playground!', ['can'], 'можно')],
    [('He have to train. →', ['He has to train.']), ('You can to play. →', ['You can play.']), ('She don\'t have to go. →', ["She doesn't have to go.", 'She does not have to go.']),
     ('Do you has to work? →', ['Do you have to work?'])],
    [(['have to', 'You', 'wear a helmet.'], 'You have to wear a helmet.'), (["can't", 'You', 'talk.'], "You can't talk."), (["don't have to", 'You', 'be tall.'], "You don't have to be tall.")],
    ['At work / school I have to…', "I don't have to…"])

T('should_A', "should / shouldn't", [
    ('You look tired. You ___ go to bed.', 'should', ['should', "shouldn't", 'should to']), ("You ___ eat so many sweets.", "shouldn't", ["shouldn't", 'should', 'not should']),
    ('He should ___ the doctor.', 'see', ['see', 'to see', 'sees']), ('___ I take an umbrella?', 'Should', ['Should', 'Do', 'Am']), ('They ___ be late.', "shouldn't", ["shouldn't", "don't should", 'should not to']),
    ('She ___ study more.', 'should', ['should', 'shoulds', 'should to']), ('You should ___ careful.', 'be', ['be', 'are', 'to be']), ('We ___ trust him.', "shouldn't", ["shouldn't", "don't", "not"])],
    [('You ___ drink more water.', ['should'], 'совет'), ('Children ___ play with fire.', ["shouldn't", 'should not'], '➖'), ('', ['Should'], 'I call her?', '❓'), ('He should ___ to his teacher.', ['listen'], 'listen'),
     ('You ___ tell everyone your secrets.', ["shouldn't", 'should not'], '➖'), ('We ___ leave now.', ['should'], ''), ('She should ___ a jacket.', ['wear'], 'wear'), ('You ___ watch TV all night.', ["shouldn't", 'should not'], '➖')],
    [('You should to listen. →', ['You should listen.']), ('He shoulds go. →', ['He should go.']), ("You don't should go. →", ["You shouldn't go.", 'You should not go.']), ('Should I to help? →', ['Should I help?'])],
    [(['should', 'You', 'be careful.'], 'You should be careful.'), (["shouldn't", 'We', 'trust him.'], "We shouldn't trust him."), (['Should', 'I', 'go?'], 'Should I go?')],
    ['A friend is tired. He should…', 'You shouldn\'t…'])

T('who_questions', 'questions: Who saw…? / Who did … see?', [
    ('Who ___ out of the door? — Black Dog.', 'ran', ['ran', 'did run', 'did ran']), ('Who ___ Jim see? — Silver.', 'did', ['did', 'was', 'do']), ('What ___ ? — A man ran away.', 'happened', ['happened', 'did happen', 'happen']),
    ('Who ___ the letter? — Mr Trelawney wrote it.', 'wrote', ['wrote', 'did write', 'did wrote']), ('What did Silver ___ ?', 'say', ['say', 'said', 'says']),
    ('Who ___ you meet yesterday?', 'did', ['did', 'was', 'have']), ('Who ___ the window? — Tom broke it.', 'broke', ['broke', 'did break', 'breaked']), ('Where ___ they go?', 'did', ['did', 'were', 'do'])],
    [('Who ___ the cake? — Anna made it.', ['made'], 'make'), ('Who ___ you see at the inn? — I saw Silver.', ['did'], ''), ('What ___ in the inn?', ['happened'], 'happen'), ('Who ___ Jim a letter? — The Squire.', ['gave'], 'give'),
     ('What did the captain ___ ?', ['say'], 'say'), ('Who ___ first? — Harry.', ['came'], 'come'), ('Who did Silver ___ after Black Dog?', ['send'], 'send'), ('What ___ you do yesterday?', ['did'], '')],
    [('Who did run away? →', ['Who ran away?']), ('Who Jim saw? →', ['Who did Jim see?']), ('What did happen? →', ['What happened?']), ('What Silver said? →', ['What did Silver say?'])],
    [(['did', 'Who', 'Jim', 'see?'], 'Who did Jim see?'), (['Who', 'ran', 'away?'], 'Who ran away?'), (['happened', 'What', 'next?'], 'What happened next?')],
    ['A question about the story: Who…?', 'Another question: What did…?'])

T('some_any', 'some / any · How much / How many', [
    ('I need ___ eggs.', 'some', ['some', 'any']), ("We haven't got ___ milk.", 'any', ['some', 'any']), ('Have you got ___ butter?', 'any', ['some', 'any']), ('How ___ apples do you need?', 'many', ['many', 'much']),
    ('How ___ sugar?', 'much', ['many', 'much']), ("There isn't ___ bread.", 'any', ['some', 'any']), ("I'd like ___ water, please.", 'some', ['some', 'any']), ('How ___ is it? — 200 roubles.', 'much', ['much', 'many'])],
    [('There are ___ apples on the table.', ['some'], 'some / any'), ('Are there ___ shops near here?', ['any'], 'some / any'), ("We don't need ___ flour.", ['any'], 'some / any'), ('How ___ eggs?', ['many'], 'much / many'),
     ('How ___ milk?', ['much'], 'much / many'), ('Can I have ___ tea, please?', ['some'], 'some / any'), ('Is there ___ cheese?', ['any'], 'some / any'), ('How ___ people came?', ['many'], 'much / many')],
    [('How much eggs? →', ['How many eggs?']), ('I need any butter. →', ['I need some butter.']), ("There isn't some milk. →", ["There isn't any milk.", 'There is not any milk.']), ('How many sugar? →', ['How much sugar?'])],
    [(['some', "I'd like", 'apples, please.'], "I'd like some apples, please."), (['any', 'Have you got', 'butter?'], 'Have you got any butter?'), (['How many', 'eggs', 'do you need?'], 'How many eggs do you need?')],
    ['In my fridge there is some…', "There isn't any…"])

T('just_already_yet', 'just / already / yet', [
    ("I've ___ got the keys — two minutes ago!", 'just', ['just', 'yet', 'ago']), ("Have you unpacked ___ ?", 'yet', ['yet', 'already', 'just']), ("She's ___ finished. She was very fast!", 'already', ['already', 'yet', 'still']),
    ("I haven't called him ___ .", 'yet', ['yet', 'already', 'just']), ("We've ___ eaten. We're not hungry.", 'already', ['already', 'yet', 'ever']), ("He's ___ arrived — he's in the hall.", 'just', ['just', 'yet', 'ever']),
    ("Have you seen the film ___ ?", 'yet', ['yet', 'just', 'already']), ("I've ___ been there three times.", 'already', ['already', 'yet', 'just'])],
    [("I've ___ finished my homework — look!", ['just'], 'только что'), ("Have you paid the landlord ___ ?", ['yet'], ''), ("They've ___ moved in.", ['already', 'just'], 'уже'), ("I haven't read it ___ .", ['yet'], ''),
     ('She has ___ (call) me.', ['just called'], 'just / call'), ('We have ___ (buy) a sofa.', ['already bought'], 'already / buy'), ("He ___ (not / unpack) yet.", ["hasn't unpacked", 'has not unpacked'], '➖ unpack'), ('', ['Have'], 'you set up the internet yet?', '❓')],
    [("I haven't yet finished. →", ["I haven't finished yet.", 'I have not finished yet.']), ("I've finished just. →", ["I've just finished.", 'I have just finished.']), ('Have you already finished yet? →', ['Have you finished yet?', 'Have you already finished?']),
     ("She hasn't already called. →", ["She hasn't called yet.", 'She has not called yet.'])],
    [(["I've", 'just', 'arrived.'], "I've just arrived."), (["I haven't", 'unpacked', 'yet.'], "I haven't unpacked yet."), (["She's", 'already', 'left.'], "She's already left.")],
    ["Today I've already…", "I haven't … yet."])

T('cafe', "I'd like… · Would you like…? · How much?", [
    ("I'd ___ a tea, please.", 'like', ['like', 'likes', 'want to']), ('___ you like coffee?', 'Would', ['Would', 'Do', 'Are']), ('Yes, ___ .', 'please', ['please', 'thank', 'yes']),
    ('No, ___ you.', 'thank', ['thank', 'please', 'thanks']), ('How ___ is it?', 'much', ['much', 'many', 'more']), ("It's five ___ roubles.", 'hundred', ['hundred', 'hundreds', 'thousand of']),
    ("I'd like ___ water, please.", 'some', ['some', 'any', 'a']), ('Here ___ are.', 'you', ['you', 'is', 'it'])],
    [("I'd ___ a coffee, please.", ['like'], ''), ('Would you like ___ ?', ['tea', 'coffee', 'water', 'milk'], 'a drink'), ('How much ___ it?', ['is'], ''), ("___ five hundred roubles.", ["It's", 'It is'], ''),
     ('Would you like sugar? — No, ___ you.', ['thank'], ''), ('Here is the ___ .', ['menu'], 'меню'), ("I'd like ___ soup, please.", ['some', 'a'], ''), ('Enjoy your ___ !', ['meal', 'tea', 'coffee'], '')],
    [('I want tea. →', ["I'd like a tea, please.", "I'd like tea, please.", 'I would like a tea, please.']), ('You like coffee? →', ['Would you like coffee?', 'Would you like a coffee?']), ('How many is it? →', ['How much is it?'])],
    [(["I'd like", 'a tea,', 'please.'], "I'd like a tea, please."), (['Would', 'you like', 'coffee?'], 'Would you like coffee?'), (['How much', 'is', 'it?'], 'How much is it?')],
    ["At a café: I'd like…", 'Would you like…?'])

T('directions', 'directions: turn left, go straight on', [
    ('___ left at the bridge.', 'Turn', ['Turn', 'Go', 'Cross']), ('Go straight ___ .', 'on', ['on', 'in', 'at']), ("The café is next ___ the hotel.", 'to', ['to', 'at', 'of']),
    ('___ the bridge.', 'Cross', ['Cross', 'Turn', 'Next']), ('Excuse me, where ___ the shop?', 'is', ['is', 'are', 'it']), ("It's ___ the river.", 'near', ['near', 'next', 'straight']),
    ('Turn ___ at the café. ➡️', 'right', ['right', 'left', 'on']), ("You're ___ !", 'welcome', ['welcome', 'please', 'thank'])],
    [('Turn ___ ⬅️', ['left'], ''), ('Turn ___ ➡️', ['right'], ''), ('Go straight ___ ⬆️', ['on'], ''), ("It's next ___ the hotel.", ['to'], ''), ('Excuse me, ___ is the toilet?', ['where'], ''),
     ('Cross the ___ .', ['bridge'], 'мост'), ("It's ___ — five minutes.", ['near'], 'близко'), ('Thank ___ !', ['you'], '')],
    [('Go straight. →', ['Go straight on.']), ('Where the café? →', ['Where is the café?', "Where's the café?"]), ("It's next the hotel. →", ["It's next to the hotel.", 'It is next to the hotel.'])],
    [(['Turn', 'left', 'at the bridge.'], 'Turn left at the bridge.'), (['Go', 'straight', 'on.'], 'Go straight on.'), (["It's", 'next to', 'the hotel.'], "It's next to the hotel.")],
    ['From the hotel to the café: …', 'From my house to the shop: …'])

# ======================================================================= B1
T('passive_B1', 'the passive: present and past', [
    ('The Mona Lisa ___ by Leonardo.', 'was painted', ['was painted', 'painted', 'is paint']), ('Coffee ___ in Brazil.', 'is grown', ['is grown', 'grows', 'is grew']),
    ('These cars ___ in Japan.', 'are made', ['are made', 'is made', 'make']), ('The thieves ___ at the airport.', 'were caught', ['were caught', 'was caught', 'caught']),
    ('The window ___ last night.', 'was broken', ['was broken', 'is broken', 'broke']), ('English ___ all over the world.', 'is spoken', ['is spoken', 'speaks', 'is speak']),
    ('When ___ the bridge built?', 'was', ['was', 'did', 'is']), ('Who was it written ___ ?', 'by', ['by', 'from', 'of'])],
    [('The pyramids ___ (build) 4,500 years ago.', ['were built'], 'build'), ('Millions of photos ___ (take) here every year.', ['are taken'], 'take'), ('The museum ___ (open) in 1852.', ['was opened'], 'open'),
     ('Tea ___ (grow) in India.', ['is grown'], 'grow'), ('The painting ___ (steal) in 1911.', ['was stolen'], 'steal'), ('These sweaters ___ (make) by hand.', ['are made'], 'make'),
     ('The letters ___ (not / send) yesterday.', ["weren't sent", 'were not sent'], '➖ send'), ('', ['Was'], 'the thief caught?', '❓')],
    [('The house built in 1900. →', ['The house was built in 1900.']), ('It was paint by Repin. →', ['It was painted by Repin.']), ('The cars is made in Kaluga. →', ['The cars are made in Kaluga.']),
     ('It was written from Tolstoy. →', ['It was written by Tolstoy.'])],
    [(['was painted', 'It', 'by Leonardo.'], 'It was painted by Leonardo.'), (['is grown', 'Coffee', 'in Brazil.'], 'Coffee is grown in Brazil.'), (['were', 'The thieves', 'caught.'], 'The thieves were caught.')],
    ['My city is famous for… It was built…', 'In my country … is / are made…'])

T('passive_B2', 'the passive in all tenses', [
    ('The manuscript has never ___ decoded.', 'been', ['been', 'be', 'being']), ('The new bridge ___ next year.', 'will be opened', ['will be opened', 'will open', 'is opening']),
    ('The castle ___ restored at the moment.', 'is being', ['is being', 'is been', 'has']), ('It ___ that the castle is haunted.', 'is said', ['is said', 'says', 'said']),
    ('The stones are believed to ___ transported by boat.', 'have been', ['have been', 'be', 'had been']), ('The lines can only ___ from the air.', 'be seen', ['be seen', 'see', 'been seen']),
    ('More lines ___ found recently.', 'have been', ['have been', 'were being', 'has been']), ('The mystery ___ solved yet.', "hasn't been", ["hasn't been", "wasn't being", "isn't"])],
    [('The pyramids ___ (build) about 4,500 years ago.', ['were built'], 'build'), ('This mystery ___ (never / solve).', ['has never been solved'], 'never / solve'),
     ('The museum ___ (renovate) at the moment.', ['is being renovated'], 'renovate'), ('The results ___ (publish) next month.', ['will be published', 'are going to be published'], 'publish'),
     ('The site must ___ (protect).', ['be protected'], 'protect'), ('It ___ (think) that it was a calendar.', ['is thought', 'is believed'], 'think'), ('He is said ___ (be) very rich.', ['to be'], 'be'),
     ('The ship is thought ___ (sink) in 1700.', ['to have sunk'], 'sink')],
    [('It has never decoded. →', ['It has never been decoded.']), ('The castle is restoring now. →', ['The castle is being restored now.']), ('It is thought to be built in 1200. →', ['It is thought to have been built in 1200.']),
     ('The road will build next year. →', ['The road will be built next year.'])],
    [(['has never been', 'It', 'decoded.'], 'It has never been decoded.'), (['is thought', 'It', 'that it marked the sun.'], 'It is thought that it marked the sun.'), (['is being', 'The castle', 'restored.'], 'The castle is being restored.')],
    ['A building in my city was built… It is said that…', 'It has never been…'])

T('first_cond', 'first conditional and time clauses', [
    ("If you train, you ___ finish.", "'ll", ["'ll", 'would', 'are']), ("When I ___ home, I'll call you.", 'get', ['get', "'ll get", 'got']), ("As soon as the race ___ , I'll run.", 'starts', ['starts', 'will start', 'start']),
    ("We'll miss the bus ___ we leave now.", 'unless', ['unless', 'if', 'when']), ("I won't stop until I ___ the finish.", 'reach', ['reach', "'ll reach", 'reached']), ("If it ___ , we'll stay at home.", 'rains', ['rains', "'ll rain", 'rain']),
    ("She'll be happy ___ you call her.", 'if', ['if', 'unless', 'until']), ("Before you ___ , stretch for five minutes.", 'run', ['run', "'ll run", 'ran'])],
    [("If I ___ (pass) the exam, I'll celebrate.", ['pass'], 'pass'), ("When she ___ (arrive), we'll have dinner.", ['arrives'], 'arrive'), ("If you run too fast, you ___ (get) tired.", ["'ll get", 'will get'], 'get'),
     ("I'll wait until you ___ (come).", ['come'], 'come'), ("We ___ (not / go) unless it stops raining.", ["won't go", 'will not go'], '➖ go'), ("As soon as I ___ (finish), I'll text you.", ['finish'], 'finish'),
     ("If he ___ (not / train), he won't win.", ["doesn't train", 'does not train'], '➖ train'), ("I'll call you before I ___ (leave).", ['leave'], 'leave')],
    [("If it will rain, we'll stay home. →", ["If it rains, we'll stay home.", 'If it rains, we will stay home.']), ("When I will see her, I'll tell her. →", ["When I see her, I'll tell her.", 'When I see her, I will tell her.']),
     ("Unless you don't hurry, we'll be late. →", ["Unless you hurry, we'll be late.", 'Unless you hurry, we will be late.']), ("I'll wait until you will come. →", ["I'll wait until you come.", 'I will wait until you come.'])],
    [(['If', 'you train,', "you'll finish."], "If you train, you'll finish."), (["I'll call you.", 'When', 'I get home,'], "When I get home, I'll call you."), (['unless', "We'll be late", 'we hurry.'], "We'll be late unless we hurry.")],
    ["If the weather is good this weekend, I'll…", "As soon as I get home today, I'll…"])

T('second_cond', 'second conditional', [
    ("If I ___ a million, I'd travel.", 'had', ['had', 'have', 'would have']), ("If I were you, I ___ tell her.", "'d", ["'d", "'ll", 'will']), ("What ___ you do if you found a wallet?", 'would', ['would', 'will', 'did']),
    ("If she ___ more time, she'd learn Spanish.", 'had', ['had', 'has', "'d have"]), ("I ___ live there if it was cheaper.", "'d", ["'d", "'ll", 'will']), ("If I ___ you, I'd see a doctor.", 'were', ['were', 'am', 'would be']),
    ("We wouldn't be late if we ___ a car.", 'had', ['had', 'have', 'would have']), ("If he ___ the truth, he'd feel better.", 'told', ['told', 'tells', 'would tell'])],
    [("If I ___ (find) €500, I'd hand it in.", ['found'], 'find'), ("I ___ (buy) a house by the sea if I were rich.", ["'d buy", 'would buy'], 'buy'), ("If you ___ (be) me, what would you do?", ['were'], 'be'),
     ("She ___ (not / lie) to her friend.", ["wouldn't lie", 'would not lie'], '➖ lie'), ("If we ___ (live) in the country, we'd have a dog.", ['lived'], 'live'), ("What would you do if you ___ (win) the lottery?", ['won'], 'win'),
     ("If I ___ (not / work), I'd sleep all day.", ["didn't work", 'did not work'], '➖ work'), ("I ___ (help) you if I could.", ["'d help", 'would help'], 'help')],
    [("If I would have money, I'd travel. →", ["If I had money, I'd travel.", 'If I had money, I would travel.']), ("If I found it, I will keep it. →", ["If I found it, I'd keep it.", 'If I found it, I would keep it.']),
     ("If I am you, I'd go. →", ["If I were you, I'd go.", 'If I were you, I would go.']), ("What you would do? →", ['What would you do?'])],
    [(['If I were you,', "I'd", 'tell the truth.'], "If I were you, I'd tell the truth."), (['would', 'What', 'you do?'], 'What would you do?'), (['If I had time,', "I'd", 'learn Italian.'], "If I had time, I'd learn Italian.")],
    ['If I had a free year, I would…', 'If I were a teacher, I would…'])

T('third_cond', 'third conditional · should have', [
    ("If we had left earlier, we ___ the bus.", "wouldn't have missed", ["wouldn't have missed", "wouldn't miss", "didn't miss"]), ("If I ___ about it, I'd have helped.", 'had known', ['had known', 'knew', 'would know']),
    ("I ___ counted again. It was my mistake.", 'should have', ['should have', 'should', 'must']), ("If he had listened, he ___ got lost.", "wouldn't have", ["wouldn't have", "won't have", "didn't"]),
    ("She would have come if you ___ her.", 'had invited', ['had invited', 'invited', 'would invite']), ("We ___ brought more water.", 'should have', ['should have', 'should', 'had']),
    ("If it ___ rained, we'd have gone on the hike.", "hadn't", ["hadn't", "didn't", "wouldn't"]), ("You ___ told me! I would have helped.", 'should have', ['should have', 'should', 'must have'])],
    [("If I ___ (know), I would have called you.", ['had known', "'d known"], 'know'), ("They ___ (not / get) lost if they had used a map.", ["wouldn't have got", 'would not have got', "wouldn't have gotten"], '➖ get'),
     ("If we ___ (check) every pair, we would have noticed.", ['had checked', "'d checked"], 'check'), ("I ___ (should / bring) a first-aid kit.", ['should have brought', "should've brought"], 'should / bring'),
     ("If she had asked, I ___ (help) her.", ['would have helped', "'d have helped"], 'help'), ("He ___ (shouldn't / leave) the children alone.", ["shouldn't have left", 'should not have left'], '➖ should / leave'),
     ("If the bus ___ (not / break down), we'd have arrived on time.", ["hadn't broken down", 'had not broken down'], '➖ break down'), ("We would have won if we ___ (practise) more.", ['had practised', "'d practised", 'had practiced'], 'practise')],
    [("If I would have known, I'd have come. →", ["If I had known, I'd have come.", 'If I had known, I would have come.', "If I'd known, I would have come."]), ('I should counted again. →', ['I should have counted again.']),
     ('If we had left earlier, we would arrived on time. →', ['If we had left earlier, we would have arrived on time.']), ('She should has told us. →', ['She should have told us.'])],
    [(['If I had known,', 'I would have', 'helped.'], 'If I had known, I would have helped.'), (['should have', 'We', 'checked.'], 'We should have checked.'), (['If he had listened,', 'he would have', 'stayed.'], 'If he had listened, he would have stayed.')],
    ['Last year I should have…', 'If I had…, I would have…'])

T('used_to', 'used to / would', [
    ('When I was a child, I ___ play outside.', 'used to', ['used to', 'use to', 'was used to']), ("I ___ like vegetables.", "didn't use to", ["didn't use to", "didn't used to", "wasn't use to"]),
    ('___ you use to have a pet?', 'Did', ['Did', 'Were', 'Do']), ('Every summer we ___ go to the village.', 'would', ['would', 'will', 'were']), ('I ___ have long hair.', 'used to', ['used to', 'would', 'was']),
    ('My grandma ___ make pancakes on Sundays.', 'would', ['would', 'will', 'is']), ('We ___ live near the river.', 'used to', ['used to', 'would', 'use']), ('Did you use to ___ to school?', 'walk', ['walk', 'walked', 'walking'])],
    [('I ___ (collect) stickers.', ['used to collect'], 'collect'), ('We ___ (not / have) a car.', ["didn't use to have", 'did not use to have'], '➖ have'), ('Did you ___ (watch) cartoons?', ['use to watch'], 'watch'),
     ('Every evening Dad ___ (read) to us.', ['would read', 'used to read'], 'read'), ('She ___ (be) very shy.', ['used to be'], 'be — состояние'), ('I ___ (not / like) school.', ["didn't use to like", 'did not use to like'], '➖ like'),
     ('We ___ (play) hide and seek every day.', ['used to play', 'would play'], 'play'), ('He ___ (live) in Moscow.', ['used to live'], 'live — состояние')],
    [('I use to be shy. →', ['I used to be shy.']), ("We didn't used to have a TV. →", ["We didn't use to have a TV.", 'We did not use to have a TV.']), ('I would have a dog. →', ['I used to have a dog.']), ('Did you used to swim? →', ['Did you use to swim?'])],
    [(['used to', 'I', 'live', 'in a village.'], 'I used to live in a village.'), (['Did', 'use to', 'you', 'walk to school?'], 'Did you use to walk to school?'), (["didn't", 'use to', 'I', 'like milk.'], "I didn't use to like milk.")],
    ['When I was a child, I used to…', "I didn't use to…"])

T('get_used_to', 'used to · be used to · get used to', [
    ("I ___ train after school — now I train all day.", 'used to', ['used to', "'m used to", 'get used to']), ("I'm used to ___ up early.", 'getting', ['getting', 'get', 'got']),
    ("It took me a month to ___ the heat.", 'get used to', ['get used to', 'used to', 'be use to']), ("She isn't used to ___ in public.", 'speaking', ['speaking', 'speak', 'spoke']),
    ("___ you use to play football?", 'Did', ['Did', 'Were', 'Are']), ("He's slowly getting used to ___ diet.", 'the new', ['the new', 'eat the new', 'eats']),
    ("We ___ live by the sea.", 'used to', ['used to', 'are used to', 'get used']), ("I can't get used to ___ so early.", 'waking', ['waking', 'wake', 'woke'])],
    [("I ___ (play) the piano, but I gave up.", ['used to play'], 'used to'), ("Now I'm used to ___ (train) six hours a day.", ['training'], 'train'), ("I'm still getting used to ___ (live) alone.", ['living'], 'live'),
     ("She ___ (not / used to) the cold yet.", ["isn't used to", 'is not used to', "'s not used to"], 'be used to'), ("Did you ___ (use to) like sport?", ['use to'], ''), ("You'll soon ___ (get used to) it.", ['get used to'], ''),
     ("He ___ (be used to) working at night.", ["'s used to", 'is used to'], ''), ("I ___ (not / use to) eat fish.", ["didn't use to", 'did not use to'], '➖')],
    [("I'm used to train early. →", ["I'm used to training early.", 'I am used to training early.']), ('I use to play tennis. →', ['I used to play tennis.']), ("I can't get used to wake up early. →", ["I can't get used to waking up early.", 'I cannot get used to waking up early.']),
     ('I would have a red bike. →', ['I used to have a red bike.'])],
    [(["I'm", 'used to', 'getting up', 'early.'], "I'm used to getting up early."), (['used to', 'We', 'live', 'by the sea.'], 'We used to live by the sea.'), (["I'm", 'getting used to', 'the heat.'], "I'm getting used to the heat.")],
    ["Now I'm used to…", "I'm still getting used to…"])

T('relative_B1', 'relative clauses: who, which, where, whose', [
    ('The actor ___ plays the doctor is great.', 'who', ['who', 'which', 'where']), ("It's the café ___ we met.", 'where', ['where', 'which', 'who']), ('A series ___ has short episodes is perfect.', 'which', ['which', 'who', 'where']),
    ("He's the director ___ films won Oscars.", 'whose', ['whose', 'who', "who's"]), ('The book ___ I read was boring.', 'that', ['that', 'who', 'where']), ("That's the woman ___ dog bit me!", 'whose', ['whose', 'who', 'which']),
    ('I know a man ___ speaks five languages.', 'who', ['who', 'which', 'whose']), ('This is the town ___ I grew up.', 'where', ['where', 'which', 'that'])],
    [('A chef is a person ___ cooks in a restaurant.', ['who', 'that'], ''), ("That's the hotel ___ we stayed.", ['where'], ''), ('I like films ___ make me laugh.', ['which', 'that'], ''), ("She's the singer ___ songs I love.", ['whose'], ''),
     ('The man ___ sat next to me ate all the popcorn.', ['who', 'that'], ''), ('This is the shop ___ sells the best bread.', ['which', 'that'], ''), ('Moscow is the city ___ I was born.', ['where'], ''), ('I have a friend ___ father is a pilot.', ['whose'], '')],
    [('The actor which plays Tokyo is great. →', ['The actor who plays Tokyo is great.', 'The actor that plays Tokyo is great.']), ("It's the town which they filmed it. →", ["It's the town where they filmed it."]),
     ('She is the singer who her songs are famous. →', ['She is the singer whose songs are famous.']), ('The film that I saw it was great. →', ['The film that I saw was great.', 'The film I saw was great.', 'The film which I saw was great.'])],
    [(['who', 'I know a woman', 'speaks Chinese.'], 'I know a woman who speaks Chinese.'), (['where', 'This is the café', 'we met.'], 'This is the café where we met.'), (['whose', 'He is the man', 'car was stolen.'], 'He is the man whose car was stolen.')],
    ['My favourite film is the one where…', 'I know a person who…'])

T('relative_B2', 'relative clauses · commas · participle clauses', [
    ('The museum, ___ opened in 1900, is free on Sundays.', 'which', ['which', 'that', 'what']), ('Leonardo, ___ painted it, was also an engineer.', 'who', ['who', 'that', 'which']),
    ('The man ___ by the door is the guard.', 'standing', ['standing', 'stood', 'stands']), ('A mask ___ in 1922 is on display.', 'found', ['found', 'finding', 'founded']),
    ('The vendor, ___ stall is the oldest, sells tacos.', 'whose', ['whose', 'who', 'which']), ('Visitors ___ to see the vault need a ticket.', 'wanting', ['wanting', 'wanted', 'want']),
    ('The city ___ I grew up is very old.', 'where', ['where', 'which', 'that']), ('Pad thai, ___ is a noodle dish, is cheap.', 'which', ['which', 'that', 'what'])],
    [('My brother, ___ lives in Kazan, is a chef.', ['who'], ''), ('The painting ___ (steal) in 1911 was found in Florence.', ['stolen'], 'steal'), ('People ___ (live) here are friendly.', ['living'], 'live'),
     ('Paris, ___ is my favourite city, has great markets.', ['which'], ''), ('The guard ___ (sit) by the camera was asleep.', ['sitting'], 'sit'), ('A key ___ (hide) under the mask opens the vault.', ['hidden'], 'hide'),
     ('Rafael, ___ grandmother shopped here, knows everyone.', ['whose'], ''), ('This is the street ___ I was born.', ['where'], '')],
    [('Paris, that is in France, is beautiful. →', ['Paris, which is in France, is beautiful.']), ('The guard which works at night is asleep. →', ['The guard who works at night is asleep.', 'The guard that works at night is asleep.']),
     ('A mask finding in 1922 is famous. →', ['A mask found in 1922 is famous.']), ('My aunt, who she is a doctor, lives in Omsk. →', ['My aunt, who is a doctor, lives in Omsk.'])],
    [(['who', 'My sister,', 'is a teacher,', 'lives in Tver.'], 'My sister, who is a teacher, lives in Tver.'), (['standing', 'The man', 'by the door', 'is the guard.'], 'The man standing by the door is the guard.'),
     (['found', 'a mask', 'in 1922'], 'a mask found in 1922')],
    ['My hometown, which…, is…', 'A person living in my building…'])

T('ing_to_B1', '-ing or to: enjoy doing / decide to do', [
    ('I enjoy ___ to music.', 'listening', ['listening', 'to listen', 'listen']), ('She wants ___ a band.', 'to start', ['to start', 'starting', 'start']), ("I can't stand ___ in queues.", 'waiting', ['waiting', 'to wait', 'wait']),
    ('We decided ___ the piano.', 'to learn', ['to learn', 'learning', 'learn']), ("He's good at ___ songs.", 'writing', ['writing', 'to write', 'write']), ("I'd like ___ a concert.", 'to go to', ['to go to', 'going to', 'go to']),
    ('Do you mind ___ the music down?', 'turning', ['turning', 'to turn', 'turn']), ("I hope ___ them live.", 'to see', ['to see', 'seeing', 'see'])],
    [('I love ___ (dance).', ['dancing'], 'dance'), ('She learned ___ (play) the guitar at school.', ['to play'], 'play'), ('He finished ___ (practise) at ten.', ['practising', 'practicing'], 'practise'),
     ("I'm interested in ___ (sing) in a choir.", ['singing'], 'sing'), ('They want ___ (record) an album.', ['to record'], 'record'), ('I hate ___ (get) up early.', ['getting'], 'get'),
     ('We hope ___ (visit) London.', ['to visit'], 'visit'), ('Thank you for ___ (help) me.', ['helping'], 'help')],
    [('I enjoy to sing. →', ['I enjoy singing.']), ('I want learning the drums. →', ['I want to learn the drums.']), ("She's good at play chess. →", ["She's good at playing chess.", 'She is good at playing chess.']),
     ("I'd like going to Italy. →", ["I'd like to go to Italy.", 'I would like to go to Italy.'])],
    [(['enjoy', 'I', 'cooking.'], 'I enjoy cooking.'), (['decided', 'She', 'to learn', 'the violin.'], 'She decided to learn the violin.'), (["I'm", 'interested in', 'painting.'], "I'm interested in painting.")],
    ['I really enjoy…', 'Next year I hope to…'])

T('ing_to_B2', 'verb patterns: -ing / to · remember, stop, try', [
    ('Most people avoid ___ their passwords.', 'changing', ['changing', 'to change', 'change']), ('We managed ___ the bug.', 'to fix', ['to fix', 'fixing', 'fix']),
    ("It's worth ___ 2FA.", 'enabling', ['enabling', 'to enable', 'enable']), ('Remember ___ your screen before lunch.', 'to lock', ['to lock', 'locking', 'lock']),
    ('I remember ___ that link — it looked real.', 'clicking', ['clicking', 'to click', 'click']), ('Please stop ___ passwords down.', 'writing', ['writing', 'to write', 'write']),
    ("Have you tried ___ the router?", 'restarting', ['restarting', 'to restart', 'restart']), ('She refused ___ her password.', 'to share', ['to share', 'sharing', 'share'])],
    [('I keep ___ (forget) my passphrase.', ['forgetting'], 'forget'), ("We can't afford ___ (lose) data.", ['to lose'], 'lose'), ('He admitted ___ (click) the link.', ['clicking', 'having clicked'], 'click'),
     ('I tend ___ (put off) updates.', ['to put off'], 'put off'), ('She suggested ___ (run) training.', ['running'], 'run'), ("Don't forget ___ (back up) your files.", ['to back up'], 'back up'),
     ('On the way I stopped ___ (check) the address.', ['to check'], 'check — цель'), ('This laptop needs ___ (update).', ['updating', 'to be updated'], 'update')],
    [('I avoid to open attachments. →', ['I avoid opening attachments.']), ('We decided enabling 2FA. →', ['We decided to enable 2FA.']), ("It's worth to try. →", ["It's worth trying.", 'It is worth trying.']),
     ('She suggested to use an app. →', ['She suggested using an app.'])],
    [(['keep', 'People', 'reusing', 'passwords.'], 'People keep reusing passwords.'), (['to enable', 'We decided', '2FA.'], 'We decided to enable 2FA.'), (["It's worth", 'using', 'a password manager.'], "It's worth using a password manager.")],
    ['I keep putting off…', "It's worth …-ing"])

T('ppc', 'present perfect continuous · for / since', [
    ("I ___ pottery for three months.", "'ve been doing", ["'ve been doing", "'m doing", 'did']), ("She's been working here ___ 2020.", 'since', ['since', 'for', 'from']),
    ("How long ___ you been learning English?", 'have', ['have', 'are', 'do']), ("We've been waiting ___ an hour!", 'for', ['for', 'since', 'during']),
    ("He ___ been feeling stressed.", 'has', ['has', 'have', 'is']), ("I've been ___ yoga since May.", 'doing', ['doing', 'do', 'done']),
    ("They've been living here ___ ages.", 'for', ['for', 'since', 'ago']), ("It ___ raining all day.", "'s been", ["'s been", "'s", 'was'])],
    [('I ___ (learn) Spanish for a year.', ["'ve been learning", 'have been learning'], 'learn'), ('She ___ (play) tennis since May.', ["'s been playing", 'has been playing'], 'play'),
     ('How long ___ here?', ['have you been living'], 'you / live'), ('We ___ (wait) for twenty minutes.', ["'ve been waiting", 'have been waiting'], 'wait'),
     ("He's been painting ___ 2019.", ['since'], 'for / since'), ("I've been running ___ two years.", ['for'], 'for / since'), ('They ___ (work) too much recently.', ["'ve been working", 'have been working'], 'work'),
     ('My neighbour ___ (drill) all morning!', ["'s been drilling", 'has been drilling'], 'drill')],
    [("I'm learning English for five years. →", ["I've been learning English for five years.", 'I have been learning English for five years.']), ('She has been working here since three years. →', ['She has been working here for three years.', "She's been working here for three years."]),
     ('How long you have been waiting? →', ['How long have you been waiting?']), ('He have been running. →', ['He has been running.', "He's been running."])],
    [(["I've been", 'painting', 'for a year.'], "I've been painting for a year."), (['How long', 'have you been', 'swimming?'], 'How long have you been swimming?'), (["She's been", 'working', 'since May.'], "She's been working since May.")],
    ["I've been … for…", "I've been … since…"])

T('pp_simple_cont', 'present perfect simple or continuous?', [
    ("I ___ dogs all morning — I'm exhausted!", "'ve been walking", ["'ve been walking", "'ve walked", 'walked']), ("She ___ €500 so far.", "'s raised", ["'s raised", "'s been raising", 'raised']),
    ("How long ___ volunteering here?", 'have you been', ['have you been', 'have you', 'are you']), ("How many books ___ together?", 'have you read', ['have you read', 'have you been reading', 'did you read']),
    ("We ___ two tonnes of rubbish.", "'ve collected", ["'ve collected", "'ve been collecting", 'collect']), ("I ___ this book for a week, but I haven't finished it.", "'ve been reading", ["'ve been reading", "'ve read", 'read']),
    ("He ___ three emails today.", "'s written", ["'s written", "'s been writing", 'wrote']), ("Your hands are dirty! What ___ ?", 'have you been doing', ['have you been doing', 'have you done', 'did you do'])],
    [("I ___ (clean) since 9.", ["'ve been cleaning", 'have been cleaning'], 'clean — процесс'), ("We ___ (collect) 50 bags so far.", ["'ve collected", 'have collected'], 'collect — результат'),
     ("She ___ (work) here for two years.", ["'s been working", 'has been working'], 'work'), ("They ___ (find) homes for twelve dogs.", ["'ve found", 'have found'], 'find'),
     ("How long ___ English?", ['have you been learning'], 'you / learn'), ("How many countries ___ ?", ['have you visited'], 'you / visit'),
     ("I'm tired. I ___ (run).", ["'ve been running", 'have been running'], 'run'), ("I ___ (lose) my keys!", ["'ve lost", 'have lost'], 'lose')],
    [("I've been reading three books this month. →", ["I've read three books this month.", 'I have read three books this month.']), ('How long have you volunteered here? (still now) →', ['How long have you been volunteering here?']),
     ("I've been finding my keys. →", ["I've found my keys.", 'I have found my keys.']), ("She's written all day and she's tired. →", ["She's been writing all day and she's tired.", "She has been writing all day and she's tired."])],
    [(["I've been", 'volunteering', 'for two years.'], "I've been volunteering for two years."), (["We've", 'collected', 'two tonnes.'], "We've collected two tonnes."), (['How long', 'have you been', 'waiting?'], 'How long have you been waiting?')],
    ["I've been … for…", "So far I've…"])

T('obligation_B1', "should / must / have to / mustn't / don't have to", [
    ("You ___ go to bed earlier.", 'should', ['should', 'must to', 'have']), ("You ___ smoke here. It's forbidden.", "mustn't", ["mustn't", "don't have to", "shouldn't to"]),
    ("It's free — you ___ pay.", "don't have to", ["don't have to", "mustn't", "can't to"]), ("She ___ work on Saturdays.", 'has to', ['has to', 'have to', 'must to']),
    ("Do you ___ wear a uniform?", 'have to', ['have to', 'must', 'has to']), ("You ___ see a doctor if it hurts.", 'should', ['should', 'shouldn\'t', "don't have to"]),
    ("Tenants ___ keep pets here. It's in the contract.", "mustn't", ["mustn't", "don't have to", 'must']), ("We ___ hurry. We have lots of time.", "don't have to", ["don't have to", "mustn't", 'have to'])],
    [('You ___ drink more water.', ['should'], 'совет'), ('Children ___ play with matches.', ["mustn't", 'must not'], 'нельзя'), ("You ___ wear a tie. It's informal.", ["don't have to", 'do not have to'], 'не обязательно'),
     ('In Russia you ___ be 18 to vote.', ['have to', 'must'], 'правило'), ('He ___ get up at six.', ['has to'], 'обязательно'), ('You ___ eat so much sugar.', ["shouldn't", 'should not'], 'не советую'),
     ('', ['Do'], 'I have to pay now?', '❓'), ('She ___ work today. It\'s her day off.', ["doesn't have to", 'does not have to'], 'не обязательно')],
    [('You should to sleep more. →', ['You should sleep more.']), ("You mustn't pay — it's free! →", ["You don't have to pay — it's free!", "You don't have to pay, it's free!"]), ('She have to work. →', ['She has to work.']),
     ('You must to see a doctor. →', ['You must see a doctor.'])],
    [(['should', 'You', 'walk more.'], 'You should walk more.'), (["mustn't", 'You', 'park here.'], "You mustn't park here."), (["doesn't have to", 'She', 'work today.'], "She doesn't have to work today.")],
    ['At home I have to…', "At work you mustn't…"])

T('reported_B1', 'reported speech', [
    ("«I'm tired.» → She said she ___ tired.", 'was', ['was', 'is', 'were']), ("«I'll call you.» → He said he ___ call me.", 'would', ['would', 'will', 'can']),
    ("«I've lost my keys.» → She said she ___ her keys.", 'had lost', ['had lost', 'lost', 'has lost']), ("«Can you help?» → He asked if I ___ help.", 'could', ['could', 'can', 'will']),
    ("She ___ me that the meeting was cancelled.", 'told', ['told', 'said', 'say']), ("He ___ that he was busy.", 'said', ['said', 'told', 'tell']),
    ("«Please call back.» → They asked me ___ back.", 'to call', ['to call', 'call', 'calling']), ("«Where do you live?» → She asked where I ___ .", 'lived', ['lived', 'do live', 'live'])],
    [("«I live in Kazan.» → He said he ___ in Kazan.", ['lived'], ''), ("«We'll be late.» → They said they ___ late.", ['would be'], ''), ("«I can't come.» → She said she ___ come.", ["couldn't", 'could not'], ''),
     ("«Close the door.» → He asked me ___ the door.", ['to close'], ''), ("«I've finished.» → She said she ___ .", ['had finished'], ''), ("She ___ me she was ill.", ['told'], 'say / tell'),
     ("«Are you OK?» → He asked if I ___ OK.", ['was'], ''), ("«I'm working.» → She said she ___ .", ['was working'], '')],
    [('She said me she was tired. →', ['She told me she was tired.', 'She said she was tired.']), ('He said he will call. →', ['He said he would call.']), ('She asked where did I live. →', ['She asked where I lived.']),
     ('He asked me close the door. →', ['He asked me to close the door.'])],
    [(['said', 'She', 'she was tired.'], 'She said she was tired.'), (['told', 'He', 'me', 'he was busy.'], 'He told me he was busy.'), (['asked', 'She', 'me', 'to call back.'], 'She asked me to call back.')],
    ['Yesterday my friend told me that…', 'My boss asked me to…'])

T('deduction', "must / might / can't be", [
    ('He has a key to the school. He ___ work there.', 'must', ['must', "can't", 'might']), ("She's only 10. She ___ be a driver.", "can't", ["can't", 'must', "mustn't"]),
    ("I'm not sure where he is. He ___ be at the gym.", 'might', ['might', 'must', "can't"]), ("The lights are off. They ___ be out.", 'must', ['must', "can't", 'should']),
    ("That ___ be Anna — she's in Paris!", "can't", ["can't", "mustn't", 'must']), ("They ___ live in Tver — I'm not sure.", 'might', ['might', 'must', "can't"]),
    ("You've worked all day. You ___ be tired.", 'must', ['must', 'might not', "can't"]), ("It ___ be true. Let's check.", 'may', ['may', 'must', "can't"])],
    [('The owner ___ be an artist — look at the drawings!', ['must'], '95% да'), ("He ___ be hungry — he's just eaten.", ["can't", 'cannot'], '95% нет'), ('She ___ be at work — I\'m not sure.', ['might', 'may', 'could'], '50%'),
     ('They have a dog lead. They ___ have a dog.', ['must'], ''), ("This ___ be his bag — it's pink and he hates pink.", ["can't", 'cannot'], ''), ('It ___ rain later.', ['might', 'may', 'could'], ''),
     ('You ___ be joking!', ['must'], ''), ('The shop ___ be open — it\'s Sunday.', ["can't", 'might not', 'may not'], '')],
    [("She mustn't be at home — her car isn't here. →", ["She can't be at home — her car isn't here.", "She can't be at home, her car isn't here."]), ('He must to be tired. →', ['He must be tired.']),
     ('He might is at home. →', ['He might be at home.']), ('They can be not in. →', ["They can't be in.", 'They might not be in.'])],
    [(['must', 'The owner', 'be an artist.'], 'The owner must be an artist.'), (["can't", 'He', 'be young.'], "He can't be young."), (['might', 'She', 'live in Tver.'], 'She might live in Tver.')],
    ['My neighbour must be… because…', "My boss can't be…"])

T('wishes', 'I wish / if only / should have', [
    ("I wish I ___ the piano. I miss it.", "hadn't given up", ["hadn't given up", "didn't give up", "wouldn't give up"]), ("If only I ___ speak Italian!", 'could', ['could', 'can', 'would']),
    ("I wish I ___ more time these days.", 'had', ['had', 'have', 'would have']), ("I ___ studied harder.", 'should have', ['should have', 'should', 'must']),
    ("I wish my neighbour ___ playing drums at night!", 'would stop', ['would stop', 'stopped', 'stops']), ("I wish I ___ taller.", 'were', ['were', 'am', 'would be']),
    ("If only I ___ about it yesterday!", 'had known', ['had known', 'knew', 'know']), ("We ___ sold the house. I miss it.", "shouldn't have", ["shouldn't have", "shouldn't", "didn't"])],
    [('I wish I ___ (keep) my old photos.', ['had kept', "'d kept"], 'keep'), ('If only I ___ (know) his number now!', ['knew'], 'know'), ('You ___ (not / eat) so much cake.', ["shouldn't have eaten", 'should not have eaten'], 'should'),
     ('I wish my brother ___ (call) me more often.', ['would call'], 'call'), ('I wish I ___ (be) on holiday now.', ['were', 'was'], 'be'), ('I wish I ___ (not / say) that.', ["hadn't said", 'had not said'], 'say'),
     ('He ___ (should / tell) us.', ['should have told', "should've told"], 'tell'), ('If only it ___ (stop) raining!', ['would stop'], 'stop')],
    [('I wish I have more time. →', ['I wish I had more time.']), ('I should called her. →', ['I should have called her.', "I should've called her."]), ("I wish I didn't say that yesterday. →", ["I wish I hadn't said that yesterday.", 'I wish I had not said that yesterday.']),
     ('I wish I would be rich. →', ['I wish I were rich.', 'I wish I was rich.'])],
    [(['I wish', "I hadn't", 'given up.'], "I wish I hadn't given up."), (['should have', 'You', 'told me.'], 'You should have told me.'), (['If only', 'I could', 'fly.'], 'If only I could fly.')],
    ['I wish I could…', 'I should have…'])

T('narrative_B2', 'narrative tenses', [
    ("I ___ for six hours when the weather changed.", 'had been walking', ['had been walking', 'was walking', 'walked']), ("When we arrived, the bus ___ .", 'had left', ['had left', 'left', 'has left']),
    ("It ___ dark when we found the hut.", 'was getting', ['was getting', 'got', 'had got']), ("Suddenly the wind ___ .", 'changed', ['changed', 'was changing', 'had been changing']),
    ("She was exhausted because she ___ all day.", 'had been climbing', ['had been climbing', 'climbed', 'has climbed']), ("By the time we got there, the shop ___ .", 'had closed', ['had closed', 'closed', 'was closing']),
    ("While I ___ , it started to snow.", 'was waiting', ['was waiting', 'waited', 'had waited']), ("Luckily, I ___ a torch.", 'had packed', ['had packed', 'was packing', 'had been packing'])],
    [("We ___ (walk) for three hours when we saw the lake.", ['had been walking', "'d been walking"], 'walk'), ("When I woke up, everyone ___ (go) out.", ['had gone', "'d gone"], 'go'),
     ("It ___ (rain) hard, so we stayed in.", ['was raining'], 'rain'), ("He ___ (find) his passport under the bed.", ['found'], 'find'), ("They were tired because they ___ (hike) since dawn.", ['had been hiking', "'d been hiking"], 'hike'),
     ("By the time the police arrived, the thief ___ (escape).", ['had escaped', "'d escaped"], 'escape'), ("While we ___ (drive), the car broke down.", ['were driving'], 'drive'), ("I ___ (never / see) such a view before.", ['had never seen', "'d never seen"], 'never / see')],
    [('I was walking for hours when it rained. →', ['I had been walking for hours when it rained.']), ('When we arrived, the bus already left. →', ['When we arrived, the bus had already left.']),
     ('While I walked, I saw a bear. →', ['While I was walking, I saw a bear.']), ('I had been packing a torch. →', ['I had packed a torch.', "I'd packed a torch."])],
    [(['had been', 'We', 'walking', 'for hours.'], 'We had been walking for hours.'), (['The bus', 'had', 'already', 'left.'], 'The bus had already left.'), (['was getting', 'It', 'dark.'], 'It was getting dark.')],
    ['I had been … when…', 'By the time I…, …had…'])

T('past_cont', 'past continuous and past simple', [
    ("I ___ when the phone rang.", 'was sleeping', ['was sleeping', 'slept', 'sleep']), ("While she was shopping, someone ___ her bag.", 'stole', ['stole', 'was stealing', 'steals']),
    ("It ___ when we arrived.", 'was pouring', ['was pouring', 'poured', 'pours']), ("What ___ you doing at 8 last night?", 'were', ['were', 'did', 'was']),
    ("We were having dinner when the lights ___ out.", 'went', ['went', 'were going', 'go']), ("___ they were waiting, they read a book.", 'While', ['While', 'When', 'During']),
    ("He ___ his leg while he was skiing.", 'broke', ['broke', 'was breaking', 'breaks']), ("I ___ TV when you called.", 'was watching', ['was watching', 'watched', 'watch'])],
    [('I ___ (walk) home when I saw an accident.', ['was walking'], 'walk'), ('While they were swimming, it ___ (start) to rain.', ['started'], 'start'), ('She ___ (read) when the doorbell rang.', ['was reading'], 'read'),
     ('We ___ (miss) our flight because of the traffic.', ['missed'], 'miss'), ('They ___ (drive) to Sochi when the car broke down.', ['were driving'], 'drive'), ('What ___ at ten last night?', ['were you doing'], 'you / do'),
     ('I ___ (lose) my passport while I was travelling.', ['lost'], 'lose'), ('When we ___ (arrive), it was snowing.', ['arrived'], 'arrive')],
    [('While I cooked, the phone was ringing. →', ['While I was cooking, the phone rang.']), ('I was seeing him when I was walking. →', ['I saw him when I was walking.', 'I saw him while I was walking.']),
     ('What did you doing at 8? →', ['What were you doing at 8?']), ('They was waiting. →', ['They were waiting.'])],
    [(['was reading', 'I', 'when you called.'], 'I was reading when you called.'), (['While', 'we were waiting,', 'it started to rain.'], 'While we were waiting, it started to rain.'), (['were', 'What', 'you doing?'], 'What were you doing?')],
    ['Yesterday at 7 p.m. I was…', 'While I was…, …'])

T('predictions_B2', 'predictions: bound to, likely to, set to', [
    ('Prices are ___ rise — they always do.', 'bound to', ['bound to', 'unlikely to', 'set']), ('More people are ___ work from home.', 'likely to', ['likely to', 'likely', 'like to']),
    ('The new metro line is ___ open next year.', 'set to', ['set to', 'setting to', 'set']), ("It's ___ to snow in Sochi in July.", 'unlikely', ['unlikely', 'likely', 'bound']),
    ("There's a good ___ that rents will rise.", 'chance', ['chance', 'likely', 'probably']), ('Cities are likely ___ bigger.', 'to get', ['to get', 'get', 'getting']),
    ("It's highly unlikely ___ cars will disappear.", 'that', ['that', 'to', 'what']), ('The bridge is ___ to open in May.', 'due', ['due', 'bound', 'likely that'])],
    [('Rents will almost certainly rise. → Rents are ___ rise.', ['bound to', 'sure to'], 'bound'), ('Cars will probably leave the centre. → Cars are ___ leave the centre.', ['likely to'], 'likely'),
     ('Flying taxis probably won\'t be common. → They are ___ be common.', ['unlikely to'], 'unlikely'), ('The stadium opens in June (planned). → It is ___ open in June.', ['set to', 'due to'], 'set'),
     ("There's a good ___ it will rain.", ['chance'], ''), ('Prices are bound ___ go up.', ['to'], ''), ("It's likely ___ we'll be late.", ['that'], ''), ('The plan is ___ to fail without money.', ['bound', 'likely', 'sure'], '')],
    [('Cities are likely grow. →', ['Cities are likely to grow.']), ('It is bound happening. →', ['It is bound to happen.', "It's bound to happen."]), ('It is likely that rents to rise. →', ['It is likely that rents will rise.', "It's likely that rents will rise."]),
     ('Prices are bound rising. →', ['Prices are bound to rise.'])],
    [(['are', 'Rents', 'likely to', 'rise.'], 'Rents are likely to rise.'), (['is set to', 'Paris', 'ban cars.'], 'Paris is set to ban cars.'), (["It's", 'unlikely to', 'work.'], "It's unlikely to work.")],
    ['In ten years my city is likely to…', "… is bound to…"])

T('ed_ing', '-ed / -ing adjectives · so / such', [
    ('The film was so ___ that I fell asleep.', 'boring', ['boring', 'bored']), ('I was really ___ about the trip.', 'excited', ['excited', 'exciting']), ('It was ___ a long walk!', 'such', ['such', 'so']),
    ('We were ___ tired.', 'so', ['so', 'such']), ('The news was ___ .', 'shocking', ['shocking', 'shocked']), ('I was ___ at the top of the tower.', 'terrified', ['terrified', 'terrifying']),
    ('What an ___ view!', 'amazing', ['amazing', 'amazed']), ('She was ___ by the question.', 'confused', ['confused', 'confusing'])],
    [('The lecture was ___ .', ['boring'], 'bore'), ("I'm ___ in art.", ['interested'], 'interest'), ('It was ___ a beautiful day.', ['such'], 'so / such'), ('She was ___ surprised.', ['so'], 'so / such'),
     ('The climb was ___ .', ['exhausting'], 'exhaust'), ('After the run I was ___ .', ['exhausted'], 'exhaust'), ('It was ___ an exciting match!', ['such'], 'so / such'), ('The instructions were ___ .', ['confusing'], 'confuse')],
    [("I'm boring, let's go out! →", ["I'm bored, let's go out!", "I'm bored. Let's go out!"]), ('It was so a good film. →', ['It was such a good film.']), ('I was very interesting in the lecture. →', ['I was very interested in the lecture.']),
     ('The view was such beautiful. →', ['The view was so beautiful.'])],
    [(['was', 'so', 'I', 'tired.'], 'I was so tired.'), (['such', 'It was', 'a great day!'], 'It was such a great day!'), (['boring.', 'The film', 'was', 'so'], 'The film was so boring.')],
    ['The most exciting thing I have done is…', 'I get bored when…'])

T('comparatives_B1', 'comparatives: much / far / a bit · not as … as', [
    ('Life here is ___ calmer than in Moscow.', 'far', ['far', 'very', 'more']), ("It's not ___ convenient as the city.", 'as', ['as', 'so', 'than']),
    ('The village is ___ bit colder.', 'a', ['a', 'the', 'much']), ('The ___ I stay, the less I miss the city.', 'longer', ['longer', 'long', 'longest']),
    ('The air is ___ cleaner.', 'much', ['much', 'very', 'more']), ('The city is far ___ interesting.', 'more', ['more', 'most', 'much']),
    ("It isn't as big ___ Moscow.", 'as', ['as', 'than', 'like']), ('The more you practise, the ___ you get.', 'better', ['better', 'good', 'best'])],
    [('Sochi is ___ warmer than Murmansk.', ['much', 'far', 'a lot'], 'намного'), ('My flat is ___ smaller than yours.', ['a bit', 'slightly', 'a little'], 'чуть-чуть'), ('Buses are not ___ fast as the metro.', ['as'], ''),
     ('The ___ you work, the more tired you get.', ['more'], ''), ('The countryside is ___ cheaper.', ['much', 'far', 'a lot'], 'намного'), ("It's not as noisy ___ the city.", ['as'], ''),
     ('Today is ___ (bad) than yesterday.', ['worse'], 'bad'), ('This is far ___ (good) than the old one.', ['better'], 'good')],
    [('The village is very calmer. →', ['The village is much calmer.', 'The village is far calmer.', 'The village is a lot calmer.']), ("It's not so cheap like the countryside. →", ["It's not as cheap as the countryside.", 'It is not as cheap as the countryside.']),
     ('The more I study, the more better I get. →', ['The more I study, the better I get.']), ('It is much more cheaper. →', ['It is much cheaper.', "It's much cheaper."])],
    [(['far', 'Life', 'is', 'calmer here.'], 'Life is far calmer here.'), (["It's not", 'as convenient', 'as the city.'], "It's not as convenient as the city."), (['The more', 'I travel,', 'the happier I am.'], 'The more I travel, the happier I am.')],
    ['My town is much … than…', 'The more I…, the…'])

T('classroom', 'classroom English: instructions, ICQs, Let\'s…', [
    ('___ exercise 3, please.', 'Do', ['Do', 'Make', 'Doing']), ('Open your books ___ page 12.', 'at', ['at', 'on', 'in']), ('Come to the ___ , please.', 'board', ['board', 'blackboard', 'desk board']),
    ('Write it in your ___ .', 'notebooks', ['notebooks', 'copybooks', 'textbooks pages']), ('Are you working alone ___ with a partner?', 'or', ['or', 'and', 'but']),
    ("___ check your homework.", "Let's", ["Let's", 'Lets', 'Let']), ('Eyes ___ me!', 'on', ['on', 'at', 'to']), ('___ me first.', 'Watch', ['Watch', 'Look', 'See'])],
    [('Pens ___ , eyes on me!', ['down'], ''), ('', ['Watch'], "me first. Then it's your turn.", ''), ('Find a ___ .', ['partner'], 'пара'), ('Are you drawing ___ writing?', ['or'], 'ICQ'),
     ('Hands ___ if you know!', ['up'], ''), ('Stand ___ , please.', ['up'], ''), ("Let's ___ the new words together.", ['drill', 'practise', 'say'], ''), ('Brilliant ___ , everyone!', ['listening', 'work', 'job'], 'praise')],
    [('Make exercise 5. →', ['Do exercise 5.']), ('Come to the blackboard. →', ['Come to the board.', 'Come to the board, please.']), ('Open your books on page 5. →', ['Open your books at page 5.', 'Open your books to page 5.']),
     ('Do you understand? (as an ICQ) →', ['Are you drawing or writing?', 'Are you working alone or with a partner?'])],
    [(['Pencils', 'up!', 'Listen.'], 'Pencils up! Listen.'), (['Are you', 'working alone', 'or with a partner?'], 'Are you working alone or with a partner?'), (["Let's", 'do', 'the first one together.'], "Let's do the first one together.")],
    ['My favourite classroom routine: …', 'An ICQ for a matching game: …'])


# ======================================================================= декабрь 2026: новые темы
T('can_A0', "can / can't · Can I…?", [
    ('You ___ ski here in winter.', 'can', ['can', 'cans', 'can to']), ("You ___ swim in the river. It's cold!", "can't", ["can't", 'can', 'not can']), ('___ I ride a horse?', 'Can', ['Can', 'Do', 'Am']),
    ('Yes, you ___ .', 'can', ['can', 'do', 'are']), ('She can ___ English.', 'speak', ['speak', 'speaks', 'to speak']), ("I ___ ride a horse. I don't know how.", "can't", ["can't", 'can', "don't"]),
    ('Can you ___ me?', 'help', ['help', 'helps', 'to help']), ('Where ___ I buy a ticket?', 'can', ['can', 'do', 'is'])],
    [('You ___ see Elbrus from here.', ['can'], 'можно'), ("You ___ go up at night.", ["can't", 'cannot'], 'нельзя'), ('', ['Can'], 'I pay by card?', '❓'), ('Yes, you ___ .', ['can'], ''),
     ('Tourists can ___ (ride) horses.', ['ride'], 'ride'), ('Can you ___ (speak) Russian?', ['speak'], 'speak'), ('Where can I ___ (buy) a ticket?', ['buy'], 'buy'), ("Sorry, you ___ park here.", ["can't", 'cannot'], 'нельзя')],
    [('You can to ski. →', ['You can ski.']), ('She cans swim. →', ['She can swim.']), ('Do I can pay by card? →', ['Can I pay by card?']), ('I not can ski. →', ["I can't ski.", 'I cannot ski.'])],
    [(['can', 'You', 'ski here.'], 'You can ski here.'), (['Can', 'I', 'pay by card?'], 'Can I pay by card?'), (["can't", 'You', 'swim here.'], "You can't swim here.")],
    ['In my village you can…', "I can… but I can't…"])

T('past_perfect', 'past perfect: had + V3', [
    ('When I got to the station, the train ___ .', 'had left', ['had left', 'left', 'has left']), ("I couldn't get in because I ___ my keys.", 'had lost', ['had lost', 'lost', 'have lost']),
    ('She was tired because she ___ all night.', "hadn't slept", ["hadn't slept", "didn't sleep", "hasn't slept"]), ('By the time we arrived, the film ___ .', 'had started', ['had started', 'started', 'was starting']),
    ('I ___ never seen snow before I went to Finland.', 'had', ['had', 'have', 'was']), ('___ you ever been there before?', 'Had', ['Had', 'Did', 'Were']),
    ('After she ___ the email, she called me.', 'had read', ['had read', 'has read', 'reads']), ("He was hungry because he ___ breakfast.", "hadn't had", ["hadn't had", "didn't have had", "hasn't had"])],
    [('When we arrived, everyone ___ (go) home.', ['had gone', "'d gone"], 'go'), ('I ___ (forget) my passport, so I missed the flight.', ['had forgotten', "'d forgotten"], 'forget'),
     ('She ___ (never / fly) before that trip.', ['had never flown', "'d never flown"], 'never / fly'), ('By 10 a.m. I ___ (already / finish) the report.', ['had already finished', "'d already finished"], 'already / finish'),
     ('They were upset because they ___ (not / win).', ["hadn't won", 'had not won'], '➖ win'), ('', ['Had'], 'you met him before?', '❓'), ('The shop ___ (close) by the time I got there.', ['had closed', "'d closed"], 'close'),
     ('I realised I ___ (leave) my phone at home.', ['had left', "'d left"], 'leave')],
    [('When I arrived, the bus already left. →', ['When I arrived, the bus had already left.']), ('I had saw the film before. →', ['I had seen the film before.', "I'd seen the film before."]),
     ("She didn't had eaten. →", ["She hadn't eaten.", 'She had not eaten.']), ('By the time he came, we have finished. →', ['By the time he came, we had finished.'])],
    [(['had left', 'The train', 'when I arrived.'], 'The train had left when I arrived.'), (["I'd never", 'seen', 'the sea', 'before.'], "I'd never seen the sea before."), (['had', 'She', 'already', 'gone.'], 'She had already gone.')],
    ['When I got home yesterday, I realised I had…', 'Before this year, I had never…'])

T('mixed_cond', 'mixed conditionals', [
    ("If I had studied medicine, I ___ a doctor now.", 'would be', ['would be', 'would have been', 'will be']), ("If she weren't so shy, she ___ the job last year.", 'would have taken', ['would have taken', 'would take', 'took']),
    ("If he ___ that train, they wouldn't be married today.", "hadn't missed", ["hadn't missed", "didn't miss", "wouldn't miss"]), ("We ___ lost now if we had brought a map.", "wouldn't be", ["wouldn't be", "wouldn't have been", "won't be"]),
    ('If I ___ better at maths, I would have become an engineer.', 'were', ['were', 'had been', 'would be']), ("If Fleming hadn't gone on holiday, we ___ penicillin today.", "might not have", ["might not have", "wouldn't have had", "don't have"]),
    ("If I didn't love the sea, I ___ to Sochi.", "wouldn't have moved", ["wouldn't have moved", "wouldn't move", "didn't move"]), ("I'd be rich now if I ___ in that company.", 'had invested', ['had invested', 'invested', 'would invest'])],
    [("If I ___ (take) that job in 2015, I'd live in London now.", ['had taken', "'d taken"], 'take'), ("If he weren't so lazy, he ___ (pass) the exam yesterday.", ['would have passed', "'d have passed"], 'pass'),
     ("If we had left earlier, we ___ (be) there now.", ['would be', "'d be"], 'be'), ("If she ___ (not / be) afraid of flying, she would have come with us.", ["weren't", 'were not', "wasn't"], '➖ be'),
     ("If the team ___ (score) that penalty, they would be champions now.", ['had scored', "'d scored"], 'score'), ("If I spoke Spanish, I ___ (understand) the guide yesterday.", ['would have understood', "'d have understood"], 'understand'),
     ("I ___ (not / be) so tired now if I had gone to bed early.", ["wouldn't be", 'would not be'], '➖ be'), ("If he ___ (have) more patience, he wouldn't have shouted.", ['had'], 'have — характер')],
    [("If I had studied medicine, I would have been a doctor now. →", ['If I had studied medicine, I would be a doctor now.']), ("If I would have taken the job, I'd be rich now. →", ["If I had taken the job, I'd be rich now.", 'If I had taken the job, I would be rich now.']),
     ("If she isn't so shy, she would have spoken. →", ["If she weren't so shy, she would have spoken.", "If she wasn't so shy, she would have spoken."]), ("If we left earlier, we would be there now. (we didn't) →", ['If we had left earlier, we would be there now.'])],
    [(['If I had', 'taken that job,', "I'd live", 'in Paris now.'], "If I had taken that job, I'd live in Paris now."), (["If he weren't", 'so shy,', 'he would have', 'asked her.'], "If he weren't so shy, he would have asked her."),
     (["We wouldn't be", 'lost now', 'if we had', 'brought a map.'], "We wouldn't be lost now if we had brought a map.")],
    ['If I had…, I would… now.', "If I weren't…, I would have…"])

T('adverbs_A', 'adverbs: well, fast, quickly, carefully', [
    ('Leo plays the piano very ___ .', 'well', ['well', 'good', 'goodly']), ('She runs ___ .', 'fast', ['fast', 'fastly', 'fasts']), ('He sings ___ — the dog runs away!', 'badly', ['badly', 'bad', 'badder']),
    ('Please speak ___ . I\'m writing.', 'slowly', ['slowly', 'slow', 'slowlly']), ('Grandma swims ___ .', 'carefully', ['carefully', 'careful', 'carefuly']), ('Tom works very ___ .', 'hard', ['hard', 'hardly', 'hards']),
    ('She is a ___ dancer.', 'good', ['good', 'well', 'goodly']), ('The children played ___ .', 'happily', ['happily', 'happy', 'happyly'])],
    [('She dances ___ .', ['beautifully'], 'beautiful'), ('He drives ___ .', ['carefully'], 'careful'), ('They ran ___ .', ['quickly'], 'quick'), ('I can swim ___ .', ['well'], 'good'),
     ('My brother cooks ___ .', ['badly'], 'bad'), ('Please talk ___ .', ['quietly'], 'quiet'), ('He works ___ .', ['hard'], 'hard'), ('She speaks English very ___ .', ['well'], 'good')],
    [('She sings very good. →', ['She sings very well.']), ('He runs fastly. →', ['He runs fast.']), ('Please speak slow. →', ['Please speak slowly.']), ('He is a well driver. →', ['He is a good driver.'])],
    [(['plays', 'Leo', 'the piano', 'beautifully.'], 'Leo plays the piano beautifully.'), (['can', 'She', 'swim', 'well.'], 'She can swim well.'), (['speaks', 'He', 'very', 'slowly.'], 'He speaks very slowly.')],
    ['I can … very well.', 'I … badly / slowly.'])

T('reporting_verbs', 'reporting verbs: admit, deny, refuse, warn, promise, accuse', [
    ('The coach admitted ___ mistakes.', 'making', ['making', 'to make', 'make']), ('The player refused ___ questions.', 'to answer', ['to answer', 'answering', 'answer']),
    ('He denied ___ the referee.', 'pushing', ['pushing', 'to push', 'push']), ('She promised ___ harder.', 'to train', ['to train', 'training', 'train']),
    ('The manager warned the players ___ late.', 'not to be', ['not to be', 'to not being', "don't be"]), ('Fans accused the referee ___ cheating.', 'of', ['of', 'for', 'to']),
    ('He apologised ___ missing the penalty.', 'for', ['for', 'of', 'about']), ('The coach suggested ___ a break.', 'taking', ['taking', 'to take', 'take'])],
    [('«I made a mistake.» → He admitted ___ a mistake.', ['making', 'having made'], 'make'), ("«I'll score next time.» → She promised ___ next time.", ['to score'], 'score'),
     ("«I didn't foul him.» → He denied ___ him.", ['fouling', 'having fouled'], 'foul'), ("«I won't talk about it.» → She refused ___ about it.", ['to talk'], 'talk'),
     ("«Don't relax!» → The coach warned them not ___ .", ['to relax'], 'relax'), ("«You cheated!» → They accused him ___ .", ['of cheating'], 'cheat'),
     ("«I'm sorry I was late.» → He apologised ___ late.", ['for being'], 'be'), ("«Let's watch the video.» → She suggested ___ the video.", ['watching'], 'watch')],
    [('He denied to push the player. →', ['He denied pushing the player.']), ('She refused answering. →', ['She refused to answer.']), ('They accused him for cheating. →', ['They accused him of cheating.']),
     ('The coach suggested us to rest. →', ['The coach suggested that we rest.', 'The coach suggested resting.', 'The coach suggested that we should rest.'])],
    [(['admitted', 'The coach', 'making mistakes.'], 'The coach admitted making mistakes.'), (['refused', 'She', 'to comment.'], 'She refused to comment.'), (['warned', 'He', 'us', 'not to give up.'], 'He warned us not to give up.')],
    ['Once my coach / teacher warned me…', 'I once promised…'])

T('cleft', 'cleft sentences and emphasis: What…is… · It was… who… · do / does / did', [
    ('___ I love about football is the atmosphere.', 'What', ['What', 'That', 'Which']), ('It was the goalkeeper ___ saved the match.', 'who', ['who', 'what', 'which']),
    ('What annoys me ___ the noise.', 'is', ['is', 'are', 'it']), ('I ___ believe fans make a difference.', 'do', ['do', 'am', 'does']),
    ('It was in 2018 ___ Russia hosted the World Cup.', 'that', ['that', 'which', 'what']), ('All I want ___ a ticket for the final.', 'is', ['is', 'are', 'it is']),
    ('He ___ train hard — every single day.', 'does', ['does', 'do', 'is']), ('The thing ___ I hate is diving.', 'that', ['that', 'what', 'who'])],
    [("I love the atmosphere. → What I love ___ the atmosphere.", ['is'], ''), ('Yashin saved it. → It was Yashin ___ saved it.', ['who', 'that'], ''),
     ('The referee made the mistake. → It ___ the referee who made the mistake.', ['was'], ''), ('I need a rest. → What I need ___ a rest.', ['is'], ''),
     ('She trained hard. → She ___ train hard!', ['did'], 'emphasis'), ('I want to win. → All I want ___ to win.', ['is'], ''),
     ('We lost in the final. → It was in the final ___ we lost.', ['that'], ''), ('I like her style. → I ___ like her style.', ['do'], 'emphasis')],
    [('What I love it is the atmosphere. →', ['What I love is the atmosphere.']), ('It was the coach which changed everything. →', ['It was the coach who changed everything.', 'It was the coach that changed everything.']),
     ('He did trained every day. →', ['He did train every day.']), ('All I want are a ticket. →', ['All I want is a ticket.'])],
    [(['What', 'I love', 'is', 'the atmosphere.'], 'What I love is the atmosphere.'), (['It was', 'the fans', 'who', 'won the game.'], 'It was the fans who won the game.'),
     (['I', 'do', 'believe', 'in my team.'], 'I do believe in my team.')],
    ['What I love about my favourite sport is…', 'It was … who first got me interested in…'])

# ======================================================================= какой урок — какие темы
LESSONS = {
    'pelageya-6': ['pres_cont'], 'pelageya-7': ['was_were'], 'pelageya-8': ['past_regular'], 'pelageya-9': ['past_irregular'],
    'varya-6': ['will_pred'], 'varya-7': ['comparatives_A'], 'varya-8': ['pp_ever'], 'olya-4': ['past_irregular'], 'olya-5': ['some_any'],
    'efim-2': ['comparatives_A'], 'efim-3': ['pp_ever'], 'efim-4': ['rules_A'], 'vladimir-2': ['past_irregular'], 'vladimir-3': ['going_to'], 'vladimir-4': ['comparatives_A'],
    'sasha-4': ['will_going'], 'sasha-5': ['obligation_B1'], 'vika-6': ['who_questions'], 'vika-7': ['should_A'], 'mussa-2': ['cafe'], 'mussa-3': ['directions'],
    'yulia-k-4': ['reported_B1'], 'yulia-k-5': ['passive_B1'], 'yulia-k-6': ['second_cond'], 'ekaterina-4': ['obligation_B1'], 'ekaterina-5': ['relative_B1'], 'ekaterina-6': ['reported_B1'],
    'olya-b1-4': ['first_cond'], 'olya-b1-5': ['deduction'], 'sasha-b1-4': ['used_to'], 'sasha-b1-5': ['passive_B1'], 'iola-5': ['ing_to_B1'], 'iola-6': ['pp_simple_cont'],
    'milana-5': ['passive_B1'], 'milana-6': ['ed_ing'], 'marina-5': ['ppc'], 'marina-6': ['past_cont'], 'ksenia-5': ['obligation_B1'], 'ksenia-6': ['comparatives_B1'],
    'pasha-5': ['relative_B2'], 'pasha-6': ['passive_B2'], 'zakhar-mikhail-5': ['get_used_to'], 'zakhar-mikhail-6': ['relative_B2'],
    'dmitry-5': ['ing_to_B2'], 'dmitry-6': ['wishes'], 'dmitry-7': ['predictions_B2'], 'alexey-b2-4': ['narrative_B2'], 'alexey-b2-5': ['ing_to_B2'],
    'darya': ['classroom'], 'darya-2': ['second_cond', 'third_cond'],
    # декабрь 2026
    'pelageya-10': ['adverbs_A'], 'varya-9': ['rules_A'], 'olya-6': ['comparatives_A'], 'efim-5': ['will_pred'], 'vladimir-5': ['pp_ever'], 'sasha-6': ['first_cond'],
    'vika-8': ['just_already_yet'], 'mussa-4': ['can_A0'], 'yulia-k-7': ['third_cond'], 'olya-b1-6': ['second_cond'], 'sasha-b1-6': ['reported_B1'], 'ekaterina-7': ['used_to'],
    'iola-7': ['passive_B1'], 'milana-7': ['reported_B1'], 'marina-7': ['past_perfect'], 'ksenia-7': ['deduction'], 'dmitry-8': ['mixed_cond'], 'alexey-b2-6': ['passive_B2'],
    'zakhar-mikhail-7': ['reporting_verbs'], 'pasha-7': ['narrative_B2'], 'darya-3': ['narrative_B2'], 'zakhar-mikhail-8': ['cleft'],
}

AFTER_ID = {}  # уроки без раздела «Grammar»: после какого раздела ставить практику
AFTER = ('Grammar', 'Grammar Bank', 'Language focus', 'Language for teachers', 'Teach', 'Test again', 'Room 3', 'Practice')


def _w(it):
    """(предложение с ___, ответы, подсказка) или уже готовое (до, ответы, после, подсказка)."""
    if len(it) == 4:
        return it
    s, a, h = it
    b, af = (s.split('___', 1) + [''])[:2]
    return (b.strip(), a, af.strip(), '' if '(' in s else h)


def _section(lid, key, n):
    t = B[key]
    ids = Ids('gp-%s-%d' % (lid, n))
    body = ('<div class="box hw-intro">🏋️ <b>Grammar practice · %s.</b> Five steps: from easy to harder. Press «Проверить» after each one.'
            '<span class="ru-line">Пять шагов: от простого к сложному. После каждого — «Проверить».</span></div>' % e(t['title']))
    body += rubric('a', '<b>Step 1.</b> Choose the correct form.', 'Шаг 1. Выберите правильную форму.')
    body += ex_select(ids, [(e(s.split('___')[0]).strip(), a, o, e(s.split('___')[1]).strip() if '___' in s else '') for s, a, o in t['choose']])
    body += rubric('b', '<b>Step 2.</b> Write the correct form.', 'Шаг 2. Напишите правильную форму.')
    body += ex_gaps(ids, [_w(it) for it in t['write']], size=16)
    body += rubric('c', '<b>Step 3.</b> Find the mistake and write the correct sentence.', 'Шаг 3. Найдите ошибку и напишите предложение правильно.')
    body += ex_lines(ids, [(e(w) + ' ', r) for w, r in t['fix']])
    body += rubric('d', '<b>Step 4.</b> Put the words in order.', 'Шаг 4. Соберите предложения.')
    body += ex_order(ids, t['order'])
    body += rubric('e', '<b>Step 5.</b> About you: two true sentences.', 'Шаг 5. О себе: два правдивых предложения.') + lines(ids, t['me'])
    sid = '%s-practice%s' % (lid, '' if n == 1 else n)
    return (sid, 'Grammar practice', section(sid, 'Grammar practice', 'grammar practice: ' + e(t['title']), '15 min', body))


def inject(lid, secs):
    """Вставить разделы практики после последнего грамматического раздела урока (до домашки)."""
    keys = LESSONS.get(lid)
    if not keys:
        return secs
    secs = [s for s in secs if not s[0].startswith(lid + '-practice')]
    at = 0
    for i, (sid, label, _) in enumerate(secs):
        if '-hw-' in sid or sid.endswith('-games'):
            break
        if label in AFTER or 'grammar' in sid:
            at = i + 1
    if lid in AFTER_ID:
        at = next(i + 1 for i, s in enumerate(secs) if s[0] == AFTER_ID[lid])
    if not at:
        at = next((i for i, s in enumerate(secs) if '-hw-' in s[0] or s[0].endswith('-games')), len(secs))
    new = [_section(lid, k, n) for n, k in enumerate(keys, 1)]
    return secs[:at] + new + secs[at:]
