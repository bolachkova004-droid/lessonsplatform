"""Наборы слов для персонализации: цель ученика → сфера → 20 слов с примерами.
Формат строки: english | перевод | example sentence."""

GOALS = [
    # id, emoji, название, подпись
    ('study', '🎓', 'Учёба', 'школа, колледж, университет'),
    ('work', '💼', 'Работа', 'карьера, клиенты, коллеги'),
    ('travel', '✈️', 'Путешествия', 'отели, дорога, кафе'),
    ('exam', '📝', 'Экзамен', 'ОГЭ, ЕГЭ, IELTS, TOEFL'),
    ('move', '🏡', 'Переезд', 'жизнь в другой стране'),
    ('talk', '💬', 'Для себя', 'общение, фильмы, книги'),
]

# сфера: (цель, emoji, название, ключевые слова для свободного ответа)
AREAS = {
    'chem': ('study', '🧪', 'Химия', 'хими|химик|chem|фарма|лаборат'),
    'math': ('study', '📐', 'Математика', 'матем|алгебр|геометр|math|статист'),
    'physics': ('study', '⚛️', 'Физика и инженерия', 'физик|physic|инженер|технич|механ'),
    'bio': ('study', '🧬', 'Биология и медицина', 'биолог|медиц|врач|bio|анатом|мед'),
    'cs': ('study', '💻', 'Программирование', 'програм|информат|айти|it|код|разработ'),
    'econ': ('study', '📈', 'Экономика', 'эконом|финанс|менеджм|бизнес|econ'),
    'law': ('study', '⚖️', 'Юриспруденция', 'юрист|юрид|право|law|адвокат'),
    'arts': ('study', '📚', 'Языки и история', 'филолог|истор|лингв|литерат|перевод'),
    'school': ('study', '🏫', 'Школа', 'школ|класс|урок'),
    'it': ('work', '🖥️', 'IT и разработка', 'айти|it|програм|разработ|девопс|тестиров|аналит'),
    'med': ('work', '🩺', 'Медицина', 'врач|медсест|клиник|медиц|стомат|фарма'),
    'tourism': ('work', '🐎', 'Туризм и экскурсии', 'тур|гид|экскурс|лошад|конн|горы|туризм'),
    'hotel': ('work', '🍽️', 'Отели и рестораны', 'отел|гостин|ресторан|кафе|официант|бариста|повар'),
    'sales': ('work', '📣', 'Продажи и маркетинг', 'продаж|маркет|smm|реклам|клиент|sales'),
    'finance': ('work', '💰', 'Финансы и бухгалтерия', 'бухгалт|финанс|банк|аудит|налог'),
    'eng': ('work', '🛠️', 'Инженерия и производство', 'инженер|завод|производ|строит|механ'),
    'edu': ('work', '👩‍🏫', 'Образование', 'учител|преподав|педагог|репетит|тренер'),
    'logistics': ('work', '🚚', 'Логистика', 'логист|склад|достав|закуп|транспорт'),
    'design': ('work', '🎨', 'Дизайн и медиа', 'дизайн|фото|видео|медиа|блог|арт'),
    'sport': ('work', '⚽', 'Спорт и фитнес', 'спорт|футбол|фитнес|тренир|зал|бег'),
    'office': ('work', '🗂️', 'Офис и управление', 'офис|менедж|руковод|hr|секретар|управл'),
    'travel': ('travel', '✈️', 'Путешествия', ''),
    'exam': ('exam', '📝', 'Экзамены', 'егэ|огэ|ielts|toefl|экзам|cambridge'),
    'move': ('move', '🏡', 'Жизнь за границей', 'переезд|эмигр|релок|виза'),
    'talk': ('talk', '💬', 'Общение', ''),
}

PACKS = {
'chem': """
element | химический элемент | Oxygen is the most common element in the Earth's crust.
compound | соединение | Water is a compound of hydrogen and oxygen.
molecule | молекула | A water molecule has three atoms.
atom | атом | An atom has a nucleus and electrons.
solution | раствор | We prepared a salt solution in the lab.
acid | кислота | Lemon juice is a weak acid.
reaction | реакция | The reaction produced a lot of heat.
bond | химическая связь | Carbon can form four bonds.
to dissolve | растворяться | Sugar dissolves quickly in hot water.
to heat | нагревать | Heat the mixture for five minutes.
beaker | химический стакан | Pour the liquid into a beaker.
test tube | пробирка | She held the test tube over the flame.
periodic table | таблица Менделеева | Find sodium in the periodic table.
mixture | смесь | Air is a mixture of gases.
gas | газ | Carbon dioxide is a gas.
liquid | жидкость | Mercury is a liquid metal.
experiment | эксперимент | Our experiment failed the first time.
safety goggles | защитные очки | Always wear safety goggles in the lab.
to measure | измерять | Measure the temperature every minute.
result | результат | Write the result in your lab report.
""",
'math': """
equation | уравнение | Solve the equation for x.
to solve | решать | Can you solve this problem?
fraction | дробь | One half is a simple fraction.
to multiply | умножать | Multiply both sides by two.
to divide | делить | Divide the number by three.
square root | квадратный корень | The square root of nine is three.
angle | угол | A right angle is ninety degrees.
triangle | треугольник | A triangle has three sides.
proof | доказательство | The proof is on the next page.
function | функция | This function is always positive.
graph | график | Draw the graph of the function.
to calculate | вычислять | Calculate the area of the circle.
average | среднее значение | The average score was seventy.
percentage | процент | What percentage of students passed?
even number | чётное число | Four is an even number.
odd number | нечётное число | Seven is an odd number.
variable | переменная | Let x be a variable.
formula | формула | Use the formula for the area.
probability | вероятность | The probability of rain is low.
to round | округлять | Round the answer to two decimal places.
""",
'physics': """
force | сила | Gravity is a force.
energy | энергия | The sun gives us energy.
speed | скорость | The car's speed was sixty kilometres an hour.
mass | масса | Mass is measured in kilograms.
weight | вес | Your weight is lower on the Moon.
pressure | давление | The pressure inside the tyre is too high.
current | электрический ток | The current flows through the wire.
voltage | напряжение | The voltage is two hundred and twenty volts.
circuit | электрическая цепь | The circuit is broken.
wave | волна | Light travels as a wave.
to accelerate | ускоряться | The train accelerates slowly.
friction | трение | Friction slows the box down.
heat | тепло | Metal conducts heat well.
lens | линза | The lens focuses the light.
magnet | магнит | The magnet attracts iron.
to measure | измерять | We measure time in seconds.
gravity | гравитация | Gravity keeps us on the ground.
engine | двигатель | The engine needs fuel.
design | конструкция, проект | Our team finished the bridge design.
load | нагрузка | The bridge can carry a heavy load.
""",
'bio': """
cell | клетка | Every living thing is made of cells.
organ | орган | The heart is an organ.
tissue | ткань | Muscle tissue can contract.
blood | кровь | Blood carries oxygen.
heart | сердце | The heart pumps blood.
lungs | лёгкие | We breathe with our lungs.
gene | ген | Genes control eye colour.
species | вид (биол.) | This species lives only in Africa.
bacteria | бактерии | Some bacteria are useful.
virus | вирус | A virus can spread quickly.
immune system | иммунная система | Sleep helps your immune system.
to breathe | дышать | Breathe in slowly.
plant | растение | Plants need sunlight.
evolution | эволюция | Darwin wrote about evolution.
microscope | микроскоп | Look at the cell under the microscope.
disease | болезнь | Diabetes is a common disease.
treatment | лечение | The treatment worked well.
to digest | переваривать | The stomach digests food.
skeleton | скелет | The human skeleton has 206 bones.
research | исследование | She does research on cancer.
""",
'cs': """
algorithm | алгоритм | This algorithm sorts the list.
variable | переменная | Store the name in a variable.
loop | цикл | The loop runs ten times.
function | функция | Write a function that adds two numbers.
bug | ошибка в программе | I found a bug in my code.
to debug | отлаживать | It took an hour to debug the program.
to compile | компилировать | The code doesn't compile.
database | база данных | We keep the users in a database.
array | массив | The array has five elements.
string | строка | A name is a string.
input | ввод, входные данные | The program reads the input.
output | вывод | Print the output on the screen.
to run | запускать | Run the program again.
syntax | синтаксис | Check the syntax of your code.
library | библиотека (кода) | We use a library for charts.
network | сеть | The network is down.
to store | хранить | The app stores data on the server.
assignment | задание | The assignment is due on Friday.
lecture | лекция | The lecture is about recursion.
deadline | срок сдачи | The deadline is next Monday.
""",
'econ': """
supply | предложение | When supply falls, prices rise.
demand | спрос | Demand for electric cars is growing.
price | цена | The price went up by ten percent.
market | рынок | The market is very competitive.
profit | прибыль | The company made a big profit.
loss | убыток | They had a loss last year.
inflation | инфляция | Inflation was high this year.
tax | налог | Everyone pays income tax.
budget | бюджет | We need to cut the budget.
growth | рост | Economic growth is slow.
interest rate | процентная ставка | The bank raised the interest rate.
investment | инвестиция | It was a good investment.
cost | затраты, стоимость | Our main cost is rent.
income | доход | Her income doubled.
trade | торговля | Trade between the countries grew.
company | компания | He works for a small company.
competition | конкуренция | Competition keeps prices low.
to invest | инвестировать | They invest in green energy.
data | данные | The data shows a clear trend.
case study | разбор кейса | Read the case study before class.
""",
'law': """
law | закон | It is against the law.
contract | договор | Both sides signed the contract.
court | суд | The case went to court.
judge | судья | The judge listened to both sides.
lawyer | юрист, адвокат | You need a good lawyer.
evidence | доказательства | There is no evidence.
to sue | подать в суд | They sued the company.
rights | права | Everyone has the right to a fair trial.
crime | преступление | Crime has fallen this year.
guilty | виновный | The jury found him guilty.
innocent | невиновный | She is innocent.
witness | свидетель | The witness saw everything.
fine | штраф | He paid a fine.
to sign | подписывать | Please sign here.
clause | пункт договора | Read this clause carefully.
property | собственность | This is private property.
case | дело | The lawyer lost the case.
trial | судебный процесс | The trial lasted two weeks.
to appeal | обжаловать | They will appeal the decision.
regulation | нормативный акт | New regulations start in May.
""",
'arts': """
language | язык | She speaks three languages.
grammar | грамматика | Russian grammar is difficult.
vocabulary | словарный запас | Reading builds your vocabulary.
translation | перевод | The translation is very close.
to translate | переводить | Can you translate this poem?
novel | роман | This novel has six hundred pages.
poem | стихотворение | He wrote a poem about the sea.
author | автор | Who is the author of this book?
century | век | It was built in the twelfth century.
source | источник | Use at least three sources.
essay | эссе | I have to write an essay on Pushkin.
to quote | цитировать | Quote the text in your answer.
meaning | значение | What is the meaning of this word?
culture | культура | Language and culture are connected.
history | история | I love Russian history.
empire | империя | The Roman Empire was huge.
war | война | The war ended in 1945.
dialect | диалект | They speak a local dialect.
to argue | утверждать, доказывать | The author argues that people are good.
thesis | диплом, тезис | My thesis is about Shakespeare.
""",
'school': """
subject | предмет | My favourite subject is biology.
timetable | расписание | Check the timetable for Monday.
homework | домашнее задание | I have a lot of homework.
test | контрольная | We have a test on Friday.
mark | оценка | I got a good mark.
to pass | сдать | I passed the exam!
to fail | провалить | He failed the test.
classmate | одноклассник | My classmate helped me.
break | перемена | We play football at break.
to revise | повторять (к экзамену) | I need to revise for the exam.
textbook | учебник | Open your textbook at page ten.
notebook | тетрадь | Write it in your notebook.
headteacher | директор школы | The headteacher gave a speech.
uniform | школьная форма | We wear a uniform.
to learn by heart | учить наизусть | Learn the poem by heart.
project | проект | Our project is about recycling.
answer | ответ | Your answer is correct.
question | вопрос | Can I ask a question?
to explain | объяснять | Can you explain it again?
grade | класс; оценка | I'm in the ninth grade.
""",
'it': """
release | релиз | The release is planned for Friday.
to deploy | развернуть, выкатить | We deploy every day.
feature | функция, фича | The new feature is ready.
bug | баг | I'm fixing a bug in the login page.
to fix | исправлять | Can you fix it today?
requirement | требование | The client changed the requirements.
deadline | дедлайн | We can't miss the deadline.
code review | код-ревью | My code review is waiting.
to merge | слить ветку | I merged the branch this morning.
backlog | бэклог | Put it in the backlog.
sprint | спринт | The sprint ends on Tuesday.
server | сервер | The server is down.
to scale | масштабировать | We need to scale the service.
user | пользователь | Users love the new design.
update | обновление | Install the update tonight.
to test | тестировать | Did you test it on mobile?
stand-up | планёрка | Our stand-up is at ten.
estimate | оценка (сроков) | My estimate is three days.
to roll back | откатить | Roll back the last release.
security | безопасность | Security is our top priority.
""",
'med': """
patient | пациент | The patient feels better today.
symptom | симптом | Fever is a common symptom.
pain | боль | Where is the pain?
to prescribe | выписывать (лекарство) | The doctor prescribed antibiotics.
prescription | рецепт | Here is your prescription.
dose | доза | Take one dose twice a day.
blood pressure | давление | Your blood pressure is normal.
injection | укол | The nurse gave him an injection.
diagnosis | диагноз | The diagnosis was flu.
surgery | операция | The surgery went well.
allergy | аллергия | Do you have any allergies?
to recover | выздоравливать | She recovered quickly.
appointment | приём, запись | I have an appointment at nine.
ward | палата | He's in ward five.
emergency | срочный случай | Call an ambulance, it's an emergency!
to examine | осматривать | The doctor examined my throat.
side effect | побочный эффект | Headache is a side effect.
nurse | медсестра | The nurse checked my temperature.
x-ray | рентген | We need an X-ray of your arm.
check-up | осмотр | I go for a check-up every year.
""",
'tourism': """
tour | тур | Our tour starts at nine in the morning.
guide | гид | I am your guide today.
horse | лошадь | This horse is very calm.
saddle | седло | Sit in the saddle and relax.
to ride | ездить верхом | Have you ever ridden a horse?
helmet | шлем | Please put on your helmet.
trail | тропа | The trail goes up the mountain.
view | вид | What a beautiful view!
mountain | гора | Elbrus is the highest mountain in Europe.
valley | долина | We will stop in the valley for lunch.
waterfall | водопад | The waterfall is ten minutes away.
weather | погода | The weather changes fast in the mountains.
booking | бронирование | Your booking is for two people.
price | цена | The price includes lunch.
safety | безопасность | Safety comes first.
to stay together | держаться вместе | Please stay together on the trail.
slowly | медленно | Go slowly here, it's steep.
break | привал, перерыв | Let's take a short break.
souvenir | сувенир | You can buy souvenirs in the village.
Welcome! | Добро пожаловать! | Welcome to Elbrus!
""",
'hotel': """
reservation | бронь | I have a reservation for tonight.
to check in | заселиться | You can check in after two.
to check out | выселиться | Check out is at noon.
reception | ресепшен | Ask at reception.
single room | одноместный номер | A single room, please.
key card | ключ-карта | Here is your key card.
menu | меню | Can I see the menu, please?
to order | заказывать | Are you ready to order?
bill | счёт | Could we have the bill, please?
tip | чаевые | Tips are not included.
dish | блюдо | This dish is very spicy.
starter | закуска | We'll share a starter.
main course | основное блюдо | For the main course, I'll have fish.
dessert | десерт | Would you like a dessert?
waiter | официант | The waiter was very friendly.
complaint | жалоба | We received a complaint.
to apologise | извиняться | I apologise for the delay.
breakfast is included | завтрак включён | Breakfast is included in the price.
vegetarian | вегетарианский | Do you have a vegetarian option?
guest | гость | Our guests come from all over the world.
""",
'sales': """
customer | клиент | The customer is always right.
lead | потенциальный клиент | We got twenty new leads.
deal | сделка | We closed the deal yesterday.
discount | скидка | Can you give us a discount?
offer | предложение | This offer ends on Sunday.
target | цель, план продаж | We met our target this month.
campaign | кампания | The campaign was a success.
brand | бренд | They built a strong brand.
audience | аудитория | Who is our target audience?
to promote | продвигать | We promote it on social media.
feedback | обратная связь | Customer feedback is very positive.
competitor | конкурент | Our competitor lowered their prices.
to negotiate | вести переговоры | We negotiated a better price.
presentation | презентация | I'm giving a presentation tomorrow.
follow-up | повторный контакт | Send a follow-up email.
revenue | выручка | Revenue grew by fifteen percent.
to persuade | убеждать | She persuaded the client.
conversion | конверсия | Conversion is about three percent.
contract | контракт | They signed a one-year contract.
launch | запуск | The launch is next week.
""",
'finance': """
invoice | счёт-фактура | Please send me the invoice.
payment | платёж | The payment is overdue.
account | счёт | Transfer the money to this account.
balance | баланс | Check the balance at the end of the month.
expense | расход | Travel expenses are paid by the company.
budget | бюджет | We are over budget.
tax return | налоговая декларация | I filed my tax return.
audit | аудит | The audit starts on Monday.
report | отчёт | The quarterly report is ready.
to transfer | переводить (деньги) | I transferred the money yesterday.
loan | кредит | They took a loan from the bank.
debt | долг | The company has no debt.
asset | актив | Property is an asset.
salary | зарплата | Salaries are paid on the fifth.
cash flow | денежный поток | Cash flow is our main problem.
spreadsheet | таблица | It's all in the spreadsheet.
to approve | утверждать | The manager approved the budget.
receipt | чек | Keep the receipt.
forecast | прогноз | The forecast for next year is good.
deadline | срок | The tax deadline is in March.
""",
'eng': """
equipment | оборудование | The equipment is very expensive.
machine | станок, машина | The machine stopped working.
tool | инструмент | Use the right tool.
drawing | чертёж | Check the drawing again.
to assemble | собирать | We assemble the parts here.
part | деталь | This part is broken.
material | материал | Steel is a strong material.
quality control | контроль качества | Quality control found a problem.
maintenance | техобслуживание | Maintenance is every Monday.
shift | смена | I work the night shift.
to repair | ремонтировать | Can you repair the pump?
safety rules | правила безопасности | Follow the safety rules.
site | площадка, объект | The site is closed today.
to install | устанавливать | We installed new pipes.
measurement | измерение | Take the measurement twice.
supplier | поставщик | Our supplier is late.
specification | технические требования | It meets the specification.
prototype | прототип | The prototype works.
to test | испытывать | We tested the engine for ten hours.
failure | поломка, отказ | The failure was caused by heat.
""",
'edu': """
student | ученик, студент | My students are very motivated.
lesson plan | план урока | I write a lesson plan every week.
to explain | объяснять | Let me explain it differently.
exercise | упражнение | Do exercise three.
feedback | обратная связь | Good feedback helps students grow.
to assess | оценивать | We assess speaking and writing.
progress | прогресс | You've made great progress!
skill | навык | Listening is a key skill.
level | уровень | What level is the group?
curriculum | учебная программа | The curriculum changed this year.
to motivate | мотивировать | Games motivate young learners.
mistake | ошибка | Mistakes help us learn.
attendance | посещаемость | Attendance is important.
parents' meeting | родительское собрание | The parents' meeting is on Thursday.
classroom | класс (помещение) | The classroom is on the second floor.
to encourage | поощрять | Encourage them to speak.
material | материал | I prepare all my materials.
group work | работа в группах | We do a lot of group work.
goal | цель | What is your goal for this term?
certificate | сертификат | She has a teaching certificate.
""",
'logistics': """
delivery | доставка | Delivery takes three days.
warehouse | склад | The goods are in the warehouse.
shipment | партия груза | The shipment arrived late.
order | заказ | We received a big order.
stock | запас | This item is out of stock.
supplier | поставщик | We changed our supplier.
to ship | отправлять | We ship worldwide.
truck | грузовик | The truck is on the way.
customs | таможня | The goods are stuck at customs.
tracking number | трек-номер | Here is your tracking number.
route | маршрут | The driver changed the route.
to load | грузить | Load the boxes carefully.
pallet | паллета | Each pallet weighs a ton.
container | контейнер | The container left the port.
inventory | инвентаризация, остатки | We check the inventory every month.
lead time | срок поставки | The lead time is two weeks.
to purchase | закупать | We purchase parts from China.
damaged | повреждённый | Two boxes were damaged.
schedule | график | The schedule is very tight.
invoice | счёт | The invoice is attached.
""",
'design': """
draft | черновик | Here's the first draft.
layout | макет, вёрстка | I like the layout.
font | шрифт | This font is hard to read.
colour scheme | цветовая гамма | The colour scheme is too dark.
to edit | редактировать | I need to edit the video.
brief | бриф, задание | Read the brief first.
portfolio | портфолио | Show me your portfolio.
client | клиент | The client wants it brighter.
to shoot | снимать | We shoot the video on Monday.
lighting | освещение | The lighting is perfect.
background | фон | Make the background white.
image | изображение | The image is too small.
to upload | загружать | Upload the files to the folder.
deadline | срок | The deadline is tomorrow morning.
feedback | отзывы, правки | The client sent feedback.
version | версия | This is version three.
audience | аудитория | Our audience is young.
caption | подпись | Add a caption to the photo.
logo | логотип | The new logo looks great.
creative | творческий | It's a very creative idea.
""",
'sport': """
match | матч | We won the match three-one.
goal | гол | He scored a goal!
team | команда | Our team is the best.
coach | тренер | The coach is strict.
to train | тренироваться | We train four times a week.
player | игрок | He's a great player.
pitch | футбольное поле | The pitch is wet.
to kick | бить (по мячу) | Kick the ball to me!
to pass | пасовать | Pass the ball!
to win | выигрывать | We want to win.
to lose | проигрывать | They lost the game.
draw | ничья | It was a draw.
referee | судья | The referee gave him a yellow card.
fan | болельщик | The fans are singing.
warm-up | разминка | Don't skip the warm-up.
injury | травма | He has a knee injury.
fit | в хорошей форме | I want to get fit.
muscle | мышца | My muscles hurt after training.
score | счёт | What's the score?
champion | чемпион | They are the champions!
""",
'office': """
meeting | встреча | The meeting is at three.
colleague | коллега | My colleague can help you.
manager | руководитель | I'll ask my manager.
task | задача | I have three tasks today.
schedule | график | My schedule is very busy.
to arrange | организовать | Can you arrange a call?
agenda | повестка дня | What's on the agenda?
email | письмо | I'll send you an email.
attachment | вложение | Please see the attachment.
to reply | отвечать | Please reply by Friday.
report | отчёт | The report is almost ready.
priority | приоритет | This is our top priority.
to delegate | делегировать | Learn to delegate tasks.
responsible | ответственный | Who is responsible for this?
interview | собеседование | I have a job interview.
team | команда | Our team is small but strong.
to postpone | переносить | Let's postpone the meeting.
day off | выходной | I'm taking a day off.
to be in charge | быть ответственным | She's in charge of marketing.
remote work | удалённая работа | I prefer remote work.
""",
'travel': """
passport | паспорт | Don't forget your passport.
ticket | билет | I bought a return ticket.
boarding pass | посадочный талон | Show your boarding pass.
luggage | багаж | My luggage is lost.
departure | отправление | Departure is at 6 a.m.
arrival | прибытие | The arrival time is 10.
delay | задержка | There's a two-hour delay.
platform | платформа | The train leaves from platform four.
to book | бронировать | I booked a hotel near the beach.
sightseeing | осмотр достопримечательностей | We went sightseeing in Rome.
map | карта | Can you show me on the map?
directions | как пройти | Can you give me directions?
exchange rate | курс обмена | What's the exchange rate?
to rent | арендовать | Let's rent a car.
souvenir | сувенир | I bought a souvenir for my mum.
backpack | рюкзак | My backpack is too heavy.
excuse me | извините | Excuse me, where is the station?
round trip | поездка туда и обратно | A round trip costs fifty euros.
local | местный | Try the local food.
travel insurance | туристическая страховка | Do you have travel insurance?
""",
'exam': """
to compare | сравнивать | Compare the two charts.
to describe | описывать | Describe the picture.
advantage | преимущество | One advantage is the low price.
disadvantage | недостаток | The main disadvantage is noise.
in my opinion | по моему мнению | In my opinion, school uniforms are useful.
however | однако | It's cheap. However, it's slow.
moreover | более того | Moreover, it saves time.
for example | например | For example, many people work from home.
to increase | увеличиваться | The number increased sharply.
to decrease | уменьшаться | Sales decreased in May.
significant | значительный | There was a significant change.
to conclude | в заключение | To conclude, both sides have a point.
although | хотя | Although it was late, we continued.
whereas | тогда как | Boys prefer sport, whereas girls prefer music.
evidence | доказательство | There is evidence that sleep helps memory.
issue | проблема, вопрос | Pollution is a serious issue.
to argue | утверждать | Some people argue that tests are unfair.
trend | тенденция | The trend is clear.
on the other hand | с другой стороны | On the other hand, it is expensive.
in conclusion | в заключение | In conclusion, I agree.
""",
'move': """
visa | виза | I applied for a work visa.
residence permit | вид на жительство | My residence permit is ready.
rent | аренда | The rent is due on the first.
landlord | арендодатель | Call the landlord about the heating.
lease | договор аренды | We signed a one-year lease.
deposit | залог | The deposit is one month's rent.
bills | коммунальные платежи | Bills are not included.
bank account | банковский счёт | I need to open a bank account.
neighbourhood | район | It's a quiet neighbourhood.
to register | регистрироваться | You must register at the town hall.
appointment | запись (на приём) | I booked an appointment online.
form | анкета | Fill in this form, please.
GP | семейный врач | Register with a GP.
public transport | общественный транспорт | Public transport is cheap here.
groceries | продукты | Where do you buy groceries?
to settle in | обжиться | We settled in quickly.
homesick | скучающий по дому | I feel a bit homesick.
utility company | коммунальная служба | Call the utility company.
furnished | меблированный | It's a furnished flat.
local council | местная администрация | Contact the local council.
""",
'talk': """
to hang out | проводить время | Let's hang out this weekend.
to catch up | поболтать, наверстать | Let's catch up over coffee.
hobby | хобби | What's your hobby?
series | сериал | I'm watching a great series.
to recommend | советовать | Can you recommend a book?
weekend | выходные | What did you do at the weekend?
to be into | увлекаться | I'm really into cooking.
awesome | потрясающий | That's awesome!
to chat | болтать | We chatted for hours.
honestly | честно говоря | Honestly, I didn't like it.
by the way | кстати | By the way, how is your mum?
I see | понятно | Oh, I see.
no way! | не может быть! | No way! Really?
to get on with | ладить | I get on well with my sister.
to look forward to | ждать с нетерпением | I'm looking forward to the trip.
plans | планы | Any plans for tonight?
to feel like | хотеть (чего-то) | I feel like pizza.
podcast | подкаст | I listen to podcasts on the way to work.
lyrics | текст песни | I love the lyrics of this song.
small talk | лёгкая беседа | Small talk is important.
""",
}

def parse():
    out = {}
    for k, txt in PACKS.items():
        rows = []
        for line in txt.strip().splitlines():
            en, ru, ex = [x.strip() for x in line.split('|')]
            rows.append({'en': en, 'ru': ru, 'ex': ex})
        assert len(rows) == 20, (k, len(rows))
        out[k] = rows
    assert set(out) == set(AREAS), set(AREAS) ^ set(out)
    return out
