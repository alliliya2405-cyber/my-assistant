'use strict';
const STORAGE_KEY='myAssistantProFinal.v1';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const localDateIso=(d=new Date())=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`};
const parseLocalDate=(value)=>{const x=iso(value);if(!x)return new Date(NaN);const [y,m,d]=x.split('-').map(Number);return new Date(y,m-1,d,12)};
const todayIso=()=>localDateIso();
const validIsoDate=(value)=>{const m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return false;const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12);return d.getFullYear()===Number(m[1])&&d.getMonth()===Number(m[2])-1&&d.getDate()===Number(m[3])};
const iso=(d)=>{if(!d)return'';const value=String(d).trim();if(validIsoDate(value))return value;const m=value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);if(!m)return'';const converted=`${m[3]}-${m[2]}-${m[1]}`;return validIsoDate(converted)?converted:''};
const fmt=(d)=>{const x=iso(d);if(!x)return d||'—';const [y,m,day]=x.split('-');return `${day}.${m}.${y}`};
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=x=>JSON.parse(JSON.stringify(x));
const nowStamp=()=>new Date().toISOString();
function sample(){
  const p1=uid(),p2=uid(),p3=uid(),p4=uid(),p5=uid(),p6=uid(),p7=uid(),p8=uid();
  const projects=[
    {id:p1,name:'Методическая школа 2.0',areas:['Профессиональное','Образование'],goal:'Разработать модель методической школы и компетентностный профиль методиста ДОО.',meaning:'Систематизация методического подхода и описание «кода Петерсон».',start:'2026-07-01',end:'2026-12-20',roles:'Руководитель, исследователь, методист',status:'active',team:[{id:uid(),name:'Л.Г.',role:'Эксперт',contact:'',note:'Согласование содержания'}],subprojects:[{id:uid(),name:'Код Петерсон',goal:'Определить ключевые основания подхода.',start:'2026-07-01',end:'2026-09-30',owner:'Я',artifact:'Презентация и описание модели',team:[],sprints:[{id:uid(),name:'Стратегическая сессия',start:'2026-08-05',end:'2026-08-08',goal:'Собрать основания кода',owner:'Я',artifact:'Протокол сессии'}]}],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()},
    {id:p2,name:'Обучение педагогов',areas:['Профессиональное','Образование'],goal:'Подготовить и провести живые вебинары для педагогов.',meaning:'Повышение качества методической подготовки педагогов.',start:'2026-08-01',end:'2026-08-31',roles:'Руководитель программы, спикер',status:'active',team:[{id:uid(),name:'О.Ф.',role:'Координатор',contact:'',note:'Организация групп'}],subprojects:[],sprints:[{id:uid(),name:'Живые вебинары',start:'2026-08-17',end:'2026-08-21',goal:'Провести поток курса',owner:'Я',artifact:'Презентации и записи'}],links:[],createdAt:nowStamp(),updatedAt:nowStamp()},
    {id:p3,name:'Числумики',areas:['Профессиональное'],goal:'Разработать пособия и математические прописи.',meaning:'Создание серии материалов для дошкольников.',start:'2026-06-01',end:'2026-12-15',roles:'Руководитель проекта, автор',status:'active',team:[{id:uid(),name:'Т.В.',role:'Дизайнер',contact:'',note:'Макеты пособий'}],subprojects:[{id:uid(),name:'Готовимся к школе. Часть 2',goal:'Подготовить тексты, легенду и задания.',start:'2026-07-01',end:'2026-10-30',owner:'Я',artifact:'Рабочий макет тетради',team:[],sprints:[{id:uid(),name:'Тексты персонажей',start:'2026-08-01',end:'2026-08-15',goal:'Подготовить тексты ко всем занятиям',owner:'Я',artifact:'Тексты в макете'}]},{id:uid(),name:'Математические прописи',goal:'Разработать концепцию пяти прописей.',start:'2026-07-01',end:'2026-11-30',owner:'Я',artifact:'ТЗ и дизайн-концепция',team:[],sprints:[]}],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()},
    {id:p4,name:'Игралочка',areas:['Профессиональное'],goal:'Обновить материалы курса и карты ключевого содержания.',meaning:'Развитие методических материалов курса.',start:'2026-08-01',end:'2026-11-30',roles:'Методист, автор',status:'active',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()},
    {id:p5,name:'Сетевые события ИМС «Учусь учиться»',areas:['Профессиональное'],goal:'Спланировать и провести сетевые события.',meaning:'Координация профессионального сообщества.',start:'2026-09-01',end:'2027-05-31',roles:'Руководитель, модератор',status:'planned',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()},
    {id:p6,name:'ФИП — лаборатория 3',areas:['Профессиональное'],goal:'Согласовать план работы лаборатории на учебный год.',meaning:'Методическое сопровождение участников.',start:'2026-08-01',end:'2027-06-30',roles:'Руководитель лаборатории',status:'active',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()},
    {id:p7,name:'Группа ПИ',areas:['Профессиональное'],goal:'Организовать работу проектной группы.',meaning:'Совместная разработка материалов.',start:'2026-09-01',end:'2027-05-31',roles:'Куратор',status:'planned',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()},
    {id:p8,name:'Группа «Преемственность»',areas:['Профессиональное','Образование'],goal:'Разработать материалы для взаимодействия ДОО и начальной школы.',meaning:'Поддержка преемственности образовательных ступеней.',start:'2026-07-01',end:'2027-05-31',roles:'Руководитель группы, автор',status:'active',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()}
  ];
  const tasks=[
    {id:uid(),title:'Подготовить презентацию «Код Петерсон»',projectId:p1,date:'2026-08-05',start:'09:00',duration:120,priority:'priority',sphere:'professional',role:'Исследователь',method:'Анализ и проектирование',result:'Черновик презентации',status:'planned',done:false},
    {id:uid(),title:'Составить ТЗ для первой прописи',projectId:p3,date:'2026-08-06',start:'11:30',duration:90,priority:'urgent',sphere:'professional',role:'Руководитель проекта',method:'Техническое задание',result:'Согласованное ТЗ',status:'planned',done:false},
    {id:uid(),title:'Подготовить программу живых вебинаров',projectId:p2,date:'2026-08-07',start:'15:00',duration:120,priority:'priority',sphere:'education',role:'Спикер',method:'Проектирование курса',result:'Программа потока',status:'done',done:true},
    {id:uid(),title:'Доработать карты ключевого содержания',projectId:p4,date:'2026-08-08',start:'10:00',duration:100,priority:'current',sphere:'professional',role:'Методист',method:'Методическая разработка',result:'Комплект карт',status:'planned',done:false},
    {id:uid(),title:'Подготовить план лаборатории 3',projectId:p6,date:'2026-08-10',start:'14:00',duration:90,priority:'current',sphere:'professional',role:'Руководитель лаборатории',method:'Планирование',result:'План 2026–2027',status:'planned',done:false}
  ];
  const reportId=uid(),planId=uid();
  const reports=[
    {id:reportId,type:'report',title:'ОТЧЁТ ДОШКОЛЬНОГО ОТДЕЛА ЗА ИЮНЬ 2026 ГОДА',department:'Дошкольный отдел',period:'июнь 2026 года',createdAt:nowStamp(),updatedAt:nowStamp(),rows:[
      {id:uid(),employee:'Абдуллина Л.Э.',project:'Peterson.kids (Геткурс)',activity:'Управление проектом; координация запуска продукта; мониторинг обратной связи и активности родителей.',plan:'Продолжить мониторинг посещаемости и активности участников Навигатора.',result:'Выделено место для вкладки пособий «Математика с числумиками». Завершена загрузка бесплатного математического марафона.',time:'5%'},
      {id:uid(),employee:'Абдуллина Л.Э.',project:'Математика с числумиками',activity:'Управление проектом; согласование работ по дорожной карте; координация разработки пособий.',plan:'Получить рисунки, подготовить макет, согласовать занятия, разработать задания и тексты, подготовить ТЗ к части 2.',result:'Завершена работа над рисунками и правками первой тетради. Материалы переданы корректору и учебному редактору. Задания части 2 согласованы.',time:'45%'},
      {id:uid(),employee:'Абдуллина Л.Э.',project:'Методическая школа 2.0',activity:'Разработка компетентностного профиля методиста ДОО.',plan:'Подготовить подробную презентацию и ответ на вопрос «Что такое код Петерсон?».',result:'Запланирована стратегическая сессия. Построена логика поиска и обоснования кода Петерсон.',time:'20%'},
      {id:uid(),employee:'Исса О.Ф.',project:'Peterson.kids (Геткурс)',activity:'Администрирование Навигатора-помощника; статистика; ответы пользователям.',plan:'Заполнить архив марафонов, отслеживать статистику, отвечать на вопросы пользователей.',result:'Основные задачи выполнены, раздел «Математика с числумиками» находится в работе.',time:'35%'},
      {id:uid(),employee:'Королева С.И.',project:'Обучение педагогов и родителей',activity:'КПК по курсу «Игралочка».',plan:'Провести живые вебинары и доработать материалы по итогам рефлексии.',result:'Проведены вебинары, собрана обратная связь, материалы скорректированы.',time:'58%'}
    ]},
    {id:planId,type:'plan',title:'ПЛАН ДОШКОЛЬНОГО ОТДЕЛА НА ИЮЛЬ + АВГУСТ 2026 ГОДА',department:'Дошкольный отдел',period:'июль + август 2026 года',createdAt:nowStamp(),updatedAt:nowStamp(),rows:[
      {id:uid(),employee:'Абдуллина Л.Э.',project:'Математика с числумиками. Пособия «Готовимся к школе»',activity:'Управление проектом; координация разработки; разработка контента.',plan:'Подготовить тексты персонажей; разработать концепцию-легенду части 2; завершить часть 1; составить дорожную карту; провести организационную встречу.',result:'',time:''},
      {id:uid(),employee:'Абдуллина Л.Э.',project:'Математические прописи',activity:'Управление проектом; координация разработки пособий; разработка контента.',plan:'Подготовить ТЗ для первой прописи; утвердить концепцию пяти прописей; согласовать дизайн-концепцию и дорожную карту.',result:'',time:''},
      {id:uid(),employee:'Абдуллина Л.Э.',project:'Методическая школа 2.0',activity:'Исследование и разработка кода Петерсон; разработка модели школы.',plan:'Провести стратегические сессии по коду Петерсон, Методической школе и проекту «Числумики».',result:'',time:''},
      {id:uid(),employee:'Исса О.Ф.',project:'Peterson.kids (Геткурс)',activity:'Администрирование Навигатора-помощника.',plan:'Заполнить архив марафонов; отслеживать статистику; отвечать на вопросы; заполнить раздел «Математика с числумиками».',result:'',time:''},
      {id:uid(),employee:'Королева С.И.',project:'КодПетерсон',activity:'Разработка методических материалов.',plan:'Доработать карты ключевого содержания курса «Игралочка» и выполнить текущие задачи.',result:'',time:''}
    ]}
  ];
  return {
    version:3,settings:{workingMode:false,notifications:true,hiddenTemplates:[],expandedProjects:[p1],focusProjectId:'',collapsedEntries:{}},
    projects,tasks,
    assignments:[{id:uid(),projectId:p3,person:'Т.В.',task:'Подготовить дизайн-концепцию прописей',deadline:'2026-08-15',status:'in_progress',note:'Согласовать на рабочей встрече'}],
    meetings:[{id:uid(),date:'2026-08-04',title:'Совещание дошкольного отдела',participants:'Абдуллина Л.Э., Исса О.Ф., Королева С.И.',questions:'Статус проектов; подготовка вебинаров; план лаборатории.',notes:'Согласованы ближайшие приоритеты.',tasks:'Подготовить материалы к следующей встрече.',projectId:p1,projectIds:[p1,p2,p3]}],
    notes:[{id:uid(),title:'Полезные ссылки отдела',note:'Zoom: ссылка на рабочую комнату\nОблачное хранилище: папка отдела\nРабочий чат: ссылка',projectId:p1,tags:'ссылки, отдел'}],
    library:[{id:uid(),title:'Шаблон дорожной карты',type:'Документ',url:'',note:'Пример структуры дорожной карты проекта.',projectId:p3,tags:'шаблон, проект'}],
    reflections:[{id:uid(),period:'week',date:'2026-08-02',wins:'Сформирован план месяца.',difficulties:'Много параллельных проектов.',meanings:'Сосредоточиться на ключевых продуктах.',next:'Закрыть ТЗ и подготовить стратегическую сессию.'}],
    health:[
      {id:uid(),title:'Ходьба',icon:'🚶',trigger:'every_2',enabled:true,doneDates:[],scheduleEnabled:true,scheduleTime:'08:00',scheduleDuration:30,scheduleDays:['1','2','3','4','5','6','0']},
      {id:uid(),title:'Вода',icon:'💧',trigger:'after_focus',enabled:true,doneDates:[],scheduleEnabled:true,scheduleTime:'10:30',scheduleDuration:5,scheduleDays:['1','2','3','4','5','6','0']},
      {id:uid(),title:'Капли в глаза',icon:'👁️',trigger:'every_2',enabled:true,doneDates:[],scheduleEnabled:true,scheduleTime:'13:00',scheduleDuration:5,scheduleDays:['1','2','3','4','5','6','0']},
      {id:uid(),title:'Спорт',icon:'🏃',trigger:'manual',enabled:true,doneDates:[],scheduleEnabled:true,scheduleTime:'19:00',scheduleDuration:45,scheduleDays:['2','4','6']}
    ],
    family:{
      husband:[{id:uid(),title:'Совместный вечер',note:'Запланировать прогулку и ужин.',date:'2026-08-08',tags:'досуг',done:false}],
      daughter:[{id:uid(),title:'Планы на выходные',note:'Выбрать совместное занятие.',date:'2026-08-09',tags:'семья',done:false}],
      mother:[{id:uid(),title:'Позвонить маме',note:'Обсудить самочувствие и планы.',date:'2026-08-03',tags:'забота',done:false}]
    },
    education:{
      philosophy:[{id:uid(),title:'Философия / МГУ',note:'Прочитать материалы семинара и сделать конспект.',date:'2026-08-12',tags:'МГУ',done:false}],
      books:[{id:uid(),title:'Книга месяца',note:'Читать по 20 страниц в день.',date:'2026-08-31',tags:'чтение',done:false}],
      webinars:[{id:uid(),title:'Вебинар по управлению проектами',note:'Зафиксировать три идеи для работы.',date:'2026-08-14',tags:'вебинар',done:false}],
      courses:[{id:uid(),title:'Курс по цифровым инструментам',note:'Пройти второй модуль.',date:'2026-08-20',tags:'курс',done:false}]
    },
    leisure:[{id:uid(),title:'Театр',note:'Выбрать спектакль на август.',date:'2026-08-22',tags:'культура',done:false}],
    quotes:[
      {id:uid(),text:'Большие результаты складываются из маленьких последовательных шагов.',author:'Мой ассистент',category:'Развитие',tags:['фокус','движение'],date:'2026-08-03',featured:true,favorite:true,note:'Главная мысль дня.'},
      {id:uid(),text:'Смысл проекта проявляется в том результате, который меняет практику.',author:'Рабочая заметка',category:'Проекты',tags:['смысл','результат'],date:'2026-08-02',featured:false,favorite:false,note:''},
      {id:uid(),text:'Время, выделенное осознанно, превращается в движение к цели.',author:'Личная коллекция',category:'Время',tags:['планирование'],date:'2026-08-01',featured:false,favorite:true,note:''}
    ],
    reports,
    boards:[{id:uid(),name:'Стратегическая доска',projectId:p1,stickies:[{id:uid(),x:40,y:40,color:'#fff3a6',text:'Код Петерсон'},{id:uid(),x:260,y:120,color:'#d9f0ff',text:'Компетентностный профиль'}],paths:[]}],
    history:[{id:uid(),type:'demo',title:'Создана демонстрационная рабочая система',projectId:'',at:nowStamp()}],
    pomodoro:{focus:25,short:5,long:15,sessions:2}
  }
}
const PRESCHOOL_DEPARTMENT='Дошкольный отдел';
const PRESCHOOL_REPORT_NAMES=['абдуллина','королева','исса'];

function isPreschoolName(name=''){
  const value=String(name).trim().toLowerCase();
  return PRESCHOOL_REPORT_NAMES.some(part=>value.includes(part));
}

function normalizedDepartment(member={}){
  return member.department || member.division ||
    (isPreschoolName(member.name) ? PRESCHOOL_DEPARTMENT : 'Другое подразделение');
}

function preschoolEmployees(){
  const people=teamRegistry().filter(person =>
    person.department===PRESCHOOL_DEPARTMENT && isPreschoolName(person.name)
  );
  const required=['Абдуллина Л.Э.','Королева С.И.','Исса О.Ф.'];
  required.forEach(name=>{
    const surname=name.split(' ')[0].toLowerCase();
    if(!people.some(person=>person.name.toLowerCase().includes(surname))){
      people.push({
        name,
        contact:'',
        department:PRESCHOOL_DEPARTMENT,
        roles:new Set(),
        projects:[],
        statuses:new Set()
      });
    }
  });
  return people.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
}

function cleanPreschoolReportRows(){
  state.reports.forEach(doc=>{
    if(String(doc.department||'').toLowerCase()===PRESCHOOL_DEPARTMENT.toLowerCase()){
      doc.rows=(doc.rows||[]).filter(row=>isPreschoolName(row.employee));
    }
  });
}

function mergeChislumikiBusinessProcess(out){
  const imported=window.CHISLUMIKI_PROCESS_DATA;
  out.businessProcesses=Array.isArray(out.businessProcesses)?out.businessProcesses.filter(x=>x&&typeof x==='object'):[];
  if(!imported)return;
  let p=out.projects.find(x=>/числумик/i.test(x.name||''));
  if(!p){p={id:uid(),name:'Числумики',areas:['Профессиональное'],goal:'Разработать линейку пособий «Математика с числумиками».',meaning:'Управление полным циклом создания пособий.',start:'2025-01-01',end:'2031-12-31',roles:'Руководитель проекта, автор',status:'active',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()};out.projects.push(p)}
  const previous=out.businessProcesses.find(x=>x.key==='chislumiki-part2');
  const previousOps=new Map((previous?.operations||[]).map(x=>[x.id,x]));
  const process={...clone(imported),key:'chislumiki-part2',projectId:p.id,operations:imported.operations.map(op=>{
    const previousOp=previousOps.get(op.id);
    return {...op,status:previousOp?.status||op.status};
  })};
  out.businessProcesses=out.businessProcesses.filter(x=>x.key!=='chislumiki-part2');out.businessProcesses.push(process);
  const people=[
    ['chislumiki-person-peterson-va','Петерсон В.А.','Владелец продукта'],
    ['chislumiki-person-peterson-lg','Петерсон Л.Г.','Утверждение содержания'],
    ['chislumiki-person-abdullina','Абдуллина Л.Э.','Руководитель разработки'],
    ['chislumiki-person-kochemasova','Кочемасова Е.Е.','Автор'],
    ['chislumiki-person-nilova','Нилова Т.В.','Руководитель производства'],
    ['chislumiki-person-methodists','Методисты','Методическая экспертиза'],
    ['chislumiki-person-designer','Дизайнер','Дизайн макета'],
    ['chislumiki-person-artist','Художник','Иллюстрации'],
    ['chislumiki-person-art-editor','Художественный редактор','Художественная экспертиза'],
    ['chislumiki-person-proofreader','Корректор','Корректура']
  ];
  p.team=Array.isArray(p.team)?p.team:[];
  people.forEach(([id,name,role])=>{if(!p.team.some(m=>m.id===id||String(m.name||'').toLowerCase()===name.toLowerCase()))p.team.push({id,name,role,contact:'',note:'Роль импортирована из матрицы RACI',department:PRESCHOOL_DEPARTMENT})});
}

function normalize(s){
  const base=sample(), source=(s&&typeof s==='object'&&!Array.isArray(s))?s:{};
  const out={...base,...source};
  const arrays=['projects','tasks','assignments','meetings','notes','library','reflections','health','leisure','quotes','reports','boards','history'];
  arrays.forEach(k=>{if(!Array.isArray(out[k]))out[k]=[]});
  const ensureId=x=>{if(!x.id)x.id=uid();return x};
  out.projects=out.projects.filter(x=>x&&typeof x==='object').map(ensureId);
  out.projects.forEach(p=>{
    p.name=String(p.name||'Без названия');p.team=Array.isArray(p.team)?p.team.filter(Boolean).map(ensureId):[];
    p.sprints=Array.isArray(p.sprints)?p.sprints.filter(Boolean).map(ensureId):[];
    p.subprojects=Array.isArray(p.subprojects)?p.subprojects.filter(Boolean).map(ensureId):[];
    p.subprojects.forEach(sp=>{sp.name=String(sp.name||'Подпроект');sp.team=Array.isArray(sp.team)?sp.team.filter(Boolean).map(ensureId):[];sp.sprints=Array.isArray(sp.sprints)?sp.sprints.filter(Boolean).map(ensureId):[]});p.team.forEach(m=>{m.department=normalizedDepartment(m)});p.subprojects.forEach(sp=>sp.team.forEach(m=>{m.department=normalizedDepartment(m)}));
  });
  ['tasks','assignments','meetings','notes','library','reflections','leisure','quotes','boards','history'].forEach(k=>out[k]=out[k].filter(x=>x&&typeof x==='object').map(ensureId));
  out.assignments.forEach(a=>{
    a.title=String(a.title||a.task||'Поручение');
    a.assignee=String(a.assignee||a.person||'');
    a.brief=String(a.brief||a.note||'');
    a.criteria=String(a.criteria||'');
    a.deadline=iso(a.deadline)||'';
    a.status=['assigned','doing','in_progress','review','done'].includes(a.status)?(a.status==='in_progress'?'doing':a.status):'assigned'
  });
  out.meetings.forEach(m=>{
    m.agenda=String(m.agenda||m.questions||'');
    m.actionItems=String(m.actionItems||m.tasks||'');
    m.decisions=String(m.decisions||'');
    m.notes=String(m.notes||'');
    m.projectIds=Array.isArray(m.projectIds)?[...new Set(m.projectIds.filter(Boolean))]:(m.projectId?[m.projectId]:[]);
    m.completedActionItems=Array.isArray(m.completedActionItems)?[...new Set(m.completedActionItems.map(Number).filter(Number.isInteger))]:[]
    m.confirmedActions=Array.isArray(m.confirmedActions)?m.confirmedActions.filter(x=>x&&typeof x==='object').map(ensureId).map(x=>({...x,title:String(x.title||'').trim(),assignee:String(x.assignee||'').trim(),assigneeId:String(x.assigneeId||''),deadline:validIsoDate(x.deadline)?x.deadline:(m.date||todayIso()),projectId:String(x.projectId||''),enabled:x.enabled!==false})):[]
  });
  ['notes','library','leisure'].forEach(k=>out[k].forEach(x=>{
    x.tags=Array.isArray(x.tags)?x.tags.filter(Boolean):String(x.tags||'').split(',').map(v=>v.trim()).filter(Boolean);
    x.title=String(x.title||'Без названия');x.note=String(x.note||x.content||'')
  }));
  out.quotes.forEach(q=>{
    q.text=String(q.text||'').trim();
    q.author=String(q.author||'').trim();
    q.category=String(q.category||'Без категории');
    q.tags=Array.isArray(q.tags)?q.tags.filter(Boolean):String(q.tags||'').split(',').map(v=>v.trim()).filter(Boolean);
    q.date=validIsoDate(q.date)?q.date:todayIso();
    q.featured=!!q.featured;q.favorite=!!q.favorite;q.note=String(q.note||'')
  });
out.reports=out.reports.filter(x=>x&&typeof x==='object').map(ensureId);out.reports.forEach(r=>{r.type=r.type==='plan'?'plan':'report';r.title=String(r.title||'Документ');r.department=String(r.department||'Дошкольный отдел');r.period=String(r.period||'');r.rows=Array.isArray(r.rows)?r.rows.filter(Boolean).map(ensureId):[]});
  out.health=out.health.filter(x=>x&&typeof x==='object').map(ensureId);
  out.health.forEach(h=>{h.title=String(h.title||'Привычка');h.doneDates=Array.isArray(h.doneDates)?[...new Set(h.doneDates.filter(validIsoDate))]:[];h.enabled=h.enabled!==false;h.scheduleEnabled=h.scheduleEnabled===true;h.scheduleTime=/^([01]\d|2[0-3]):[0-5]\d$/.test(h.scheduleTime||'')?h.scheduleTime:'09:00';h.scheduleDuration=Math.max(5,Math.min(480,Number(h.scheduleDuration)||15));h.scheduleDays=Array.isArray(h.scheduleDays)&&h.scheduleDays.length?[...new Set(h.scheduleDays.map(String).filter(d=>['0','1','2','3','4','5','6'].includes(d)))]:['1','2','3','4','5','6','0']});
  out.family={...base.family,...(out.family&&typeof out.family==='object'?out.family:{})};
  out.education={...base.education,...(out.education&&typeof out.education==='object'?out.education:{})};
  Object.keys(out.family).forEach(k=>{if(!Array.isArray(out.family[k]))out.family[k]=[];out.family[k]=out.family[k].filter(Boolean).map(ensureId);out.family[k].forEach(x=>{x.tags=Array.isArray(x.tags)?x.tags.filter(Boolean):String(x.tags||'').split(',').map(v=>v.trim()).filter(Boolean)})});
  Object.keys(out.education).forEach(k=>{if(!Array.isArray(out.education[k]))out.education[k]=[];out.education[k]=out.education[k].filter(Boolean).map(ensureId);out.education[k].forEach(x=>{x.tags=Array.isArray(x.tags)?x.tags.filter(Boolean):String(x.tags||'').split(',').map(v=>v.trim()).filter(Boolean)})});
  out.settings={...base.settings,...(out.settings&&typeof out.settings==='object'?out.settings:{})};out.settings.hiddenTemplates=Array.isArray(out.settings.hiddenTemplates)?[...new Set(out.settings.hiddenTemplates)]:[];out.settings.expandedProjects=Array.isArray(out.settings.expandedProjects)?[...new Set(out.settings.expandedProjects)]:[];out.settings.focusProjectId=out.settings.focusProjectId||'';out.settings.collapsedEntries=(out.settings.collapsedEntries&&typeof out.settings.collapsedEntries==='object')?out.settings.collapsedEntries:{};out.settings.collapsedProjectSections=(out.settings.collapsedProjectSections&&typeof out.settings.collapsedProjectSections==='object')?out.settings.collapsedProjectSections:{};out.settings.projectOrder=Array.isArray(out.settings.projectOrder)?out.settings.projectOrder.filter(Boolean):[];out.settings.hiddenWeekDays=Array.isArray(out.settings.hiddenWeekDays)?out.settings.hiddenWeekDays.map(Number).filter(i=>i>=0&&i<=6):[];out.settings.roadmapCompareHidden=Array.isArray(out.settings.roadmapCompareHidden)?out.settings.roadmapCompareHidden.filter(Boolean):[];out.settings.roadmapCompareScale=['week','month','quarter'].includes(out.settings.roadmapCompareScale)?out.settings.roadmapCompareScale:'month';out.settings.taskView=['list','kanban'].includes(out.settings.taskView)?out.settings.taskView:'list';out.settings.businessProcessView=['overview','operations','roadmap','raci'].includes(out.settings.businessProcessView)?out.settings.businessProcessView:'overview';
  out.pomodoro={...base.pomodoro,...(out.pomodoro&&typeof out.pomodoro==='object'?out.pomodoro:{})};
  if(!out.boards.length)out.boards=[{id:uid(),name:'Моя доска',projectId:'',stickies:[],paths:[]}];
  out.boards.forEach(b=>{b.stickies=Array.isArray(b.stickies)?b.stickies.filter(Boolean).map(ensureId):[];b.paths=Array.isArray(b.paths)?b.paths:[];b.shapes=Array.isArray(b.shapes)?b.shapes.filter(Boolean).map(ensureId):[];b.undoStack=Array.isArray(b.undoStack)?b.undoStack.slice(-30):[];b.width=Math.max(1200,Number(b.width)||1800);b.height=Math.max(620,Number(b.height)||1000)});
  const seen=new Set();out.tasks=out.tasks.filter(t=>{if(t.generatedByHealth&&t.healthHabitId&&t.date){const key=`${t.healthHabitId}|${t.date}`;if(seen.has(key))return false;seen.add(key)}return true});
  out.businessProcesses=[];
  out.tasks=out.tasks.filter(t=>t.linkedSourceType!=='business_process');
  out.version=8;return out
}
let state=(()=>{try{return normalize(MyAssistantDataStore.load())}catch{return sample()}})();
try{cleanPreschoolReportRows()}catch(err){console.error('Report cleanup failed',err)}
let route=sessionStorage.getItem('myAssistant.route')||'dashboard', dayCursor=new Date(), weekCursor=new Date(), monthCursor=new Date(), monthSelectedDate=todayIso(), monthTaskFilter='all', activeBoard=state.boards[0]?.id||'';
let weekDayIndex=(new Date().getDay()+6)%7;
if(route==='business_process'||route==='pomodoro')route='week';
if(route==='roadmaps')route='month';
function persist(message){try{MyAssistantDataStore.save(state);const status=$('#saveStatus');if(status){status.textContent='Сохранено локально';status.classList.remove('error')}if(message)toast(message);return true}catch(e){const status=$('#saveStatus');if(status){status.textContent='Ошибка сохранения';status.classList.add('error')}toast('Не удалось сохранить данные. Проверьте настройки браузера.');console.error(e);return false}}
function log(type,title,projectId=''){state.history.unshift({id:uid(),type,title,projectId,at:nowStamp()});state.history=state.history.slice(0,500)}
const project=id=>state.projects.find(x=>x.id===id);
const progress=items=>items.length?Math.round(items.filter(x=>x.done||x.status==='done'||x.status==='accepted').length/items.length*100):0;
const DAY_LABELS={'1':'Пн','2':'Вт','3':'Ср','4':'Чт','5':'Пт','6':'Сб','0':'Вс'};
function localIsoDate(d=new Date()){return localDateIso(d)}
function habitOccursOn(h,date){return h.enabled!==false&&h.scheduleEnabled===true&&(h.scheduleDays||[]).includes(String(date.getDay()))}
function syncHealthTasks(h,daysAhead=45){state.tasks=state.tasks.filter(t=>!(t.healthHabitId===h.id&&t.generatedByHealth===true&&t.date>=localIsoDate()));if(!h.enabled||!h.scheduleEnabled)return;const start=new Date();start.setHours(12,0,0,0);for(let i=0;i<=daysAhead;i++){const d=new Date(start);d.setDate(start.getDate()+i);if(!habitOccursOn(h,d))continue;const date=localIsoDate(d),done=(h.doneDates||[]).includes(date);state.tasks.push({id:uid(),title:`${h.icon||'❤'} ${h.title}`,date,start:h.scheduleTime||'09:00',duration:Number(h.scheduleDuration)||15,priority:'current',sphere:'health',role:'Забота о здоровье',method:'Привычка',result:h.title,status:done?'done':'planned',done,projectId:'',healthHabitId:h.id,generatedByHealth:true})}}
function syncAllHealthTasks(){state.health.forEach(h=>syncHealthTasks(h))}
function setHabitDone(h,date,done){h.doneDates=h.doneDates||[];h.doneDates=done?[...new Set([...h.doneDates,date])]:h.doneDates.filter(d=>d!==date);state.tasks.filter(t=>t.healthHabitId===h.id&&t.date===date).forEach(t=>{t.done=done;t.status=done?'done':'planned'})}
const scheduledReminderKeys=new Set();
function checkTimedHealthReminders(){const now=new Date(),date=localIsoDate(now),time=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;state.health.filter(h=>habitOccursOn(h,now)&&h.scheduleTime===time&&!(h.doneDates||[]).includes(date)).forEach(h=>{const key=`${h.id}|${date}|${time}`;if(scheduledReminderKeys.has(key))return;scheduledReminderKeys.add(key);const msg=`${h.icon||'❤'} ${h.title} — запланировано на ${time}`;toast(msg);if('Notification'in window&&Notification.permission==='granted')new Notification('Мой ассистент · Здоровье',{body:msg})})}


const LINKED_TASK_SOURCES={
  assignment:'Поручение',
  sprint:'Спринт',
  meeting:'Совещание',
  reflection:'Рефлексия',
  family:'Семья',
  education:'Образование',
  leisure:'Досуг',
};
function linkedTaskKey(type,id,extra=''){return `${type}:${id}:${extra}`}
function linkedTaskSourceLabel(t){return t.linkedSourceType?LINKED_TASK_SOURCES[t.linkedSourceType]||t.linkedSourceType:''}
function upsertLinkedTask(key,data){
  let t=state.tasks.find(x=>x.linkedKey===key);
  if(t)Object.assign(t,data,{linkedKey:key,generatedLinked:true});
  else state.tasks.push({id:uid(),linkedKey:key,generatedLinked:true,...data});
}

function teamMemberDirectory(){
  const map=new Map();
  state.projects.forEach(p=>projectTeamWithSubprojects(p).forEach(m=>{
    const name=String(m.name||'').trim();if(!name)return;
    const key=name.toLowerCase();if(!map.has(key))map.set(key,{id:m.id||uid(),name,projectIds:new Set()});
    map.get(key).projectIds.add(p.id)
  }));
  return [...map.values()].map(x=>({...x,projectIds:[...x.projectIds]})).sort((a,b)=>a.name.localeCompare(b.name,'ru'))
}
function personTokens(name=''){
  return String(name).toLowerCase().replace(/ё/g,'е').replace(/[^а-яa-z0-9\s-]/gi,' ').split(/\s+/).filter(Boolean)
}
function matchTeamMember(text=''){
  const source=String(text).toLowerCase().replace(/ё/g,'е');
  const scored=teamMemberDirectory().map(person=>{
    const tokens=personTokens(person.name),surname=tokens[0]||'';
    let score=0;
    if(surname.length>=5){const stem=surname.slice(0,Math.max(5,surname.length-2));if(source.includes(surname))score+=6;else if(source.includes(stem))score+=4}
    tokens.slice(1).forEach(t=>{if(t.length>1&&source.includes(t))score+=1});
    return {person,score}
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  return scored[0]&&(!scored[1]||scored[0].score>scored[1].score)?scored[0].person:null
}
function extractDeadline(text='',fallback=''){
  const isoMatch=String(text).match(/\b(20\d{2})[-.\/](0?[1-9]|1[0-2])[-.\/](0?[1-9]|[12]\d|3[01])\b/);
  if(isoMatch)return `${isoMatch[1]}-${String(isoMatch[2]).padStart(2,'0')}-${String(isoMatch[3]).padStart(2,'0')}`;
  const ru=String(text).match(/\b(?:до\s+)?(0?[1-9]|[12]\d|3[01])\s+(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+(20\d{2}))?/i);
  if(ru){const months=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],year=ru[3]||String(parseLocalDate(fallback||todayIso()).getFullYear());return `${year}-${String(months.indexOf(ru[2].toLowerCase())+1).padStart(2,'0')}-${String(ru[1]).padStart(2,'0')}`}
  return validIsoDate(fallback)?fallback:todayIso()
}
function cleanExtractedTask(text='',personName=''){
  let value=String(text).trim().replace(/^[-–—•\d.)\s]+/,'');
  if(personName){const surname=personTokens(personName)[0],stem=surname.slice(0,Math.max(5,surname.length-2));if(stem)value=value.replace(new RegExp(`^${stem}[а-я-]*\\s*(?:[:—–-]|долж(?:ен|на|ны)|нужно|необходимо|поручено)?\\s*`,'i'),'')}
  value=value.replace(/^(?:ответственн(?:ый|ая)|исполнитель)\s*:\s*[^.。;]+[.;]\s*/i,'').replace(/\s*(?:до\s+)?\d{1,2}\s+(?:января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:\s+20\d{2})?\s*\.?$/i,'').replace(/\s*\b20\d{2}[-.\/]\d{1,2}[-.\/]\d{1,2}\b\s*\.?$/,'').trim();
  return value.charAt(0).toUpperCase()+value.slice(1)
}
function extractMeetingTaskCandidates(meeting){
  const sources=[meeting.actionItems,meeting.decisions,meeting.notes].filter(Boolean).join('\n');
  const chunks=sources.split(/\n+|(?<=[.!?;])\s+/).map(x=>x.trim()).filter(x=>x.length>3),seen=new Set(),rows=[];
  chunks.forEach(raw=>{
    const pipe=raw.split('|').map(x=>x.trim()),person=matchTeamMember(pipe.length>1?pipe[0]:raw);
    const explicit=/(?:ответственн(?:ый|ая)|исполнитель|поручено|долж(?:ен|на|ны)|нужно|необходимо|подготовить|согласовать|проверить|сделать|отправить|разработать|организовать|провести)/i.test(raw);
    if(!person||(!explicit&&pipe.length<2))return;
    const title=cleanExtractedTask(pipe.length>1?pipe[1]:raw,person.name);if(title.length<3)return;
    const projectName=pipe[3]||'',matchedProject=state.projects.find(p=>p.name.toLowerCase()===projectName.toLowerCase());
    const key=`${person.id}|${title.toLowerCase()}`;if(seen.has(key))return;seen.add(key);
    rows.push({id:uid(),enabled:true,assigneeId:person.id,assignee:person.name,title,deadline:extractDeadline(pipe[2]||raw,meeting.date),projectId:matchedProject?.id||person.projectIds.find(id=>(meeting.projectIds||[]).includes(id))||(meeting.projectIds||[])[0]||person.projectIds[0]||'',raw})
  });
  return rows
}

function meetingActionRows(meeting){
  if(Array.isArray(meeting.confirmedActions)&&meeting.confirmedActions.length)return meeting.confirmedActions.filter(x=>x.enabled!==false&&x.title).map((x,index)=>({index,actionId:x.id,assigneeId:x.assigneeId||'',assignee:x.assignee||'Исполнитель не указан',title:x.title,deadline:x.deadline||meeting.date||todayIso(),projectId:x.projectId||'',raw:x.raw||x.title}));
  const fallbackPeople=String(meeting.participants||'').split(/[,;\n]/).map(x=>x.trim()).filter(Boolean);
  return String(meeting.actionItems||'').split('\n').map(x=>x.trim()).filter(Boolean).map((line,index)=>{
    const parts=line.split('|').map(x=>x.trim());
    if(parts.length>=2){
      const assignee=parts[0]||fallbackPeople[0]||'Исполнитель не указан';
      const title=parts[1]||'Задание по совещанию';
      const deadline=validIsoDate(parts[2])?parts[2]:(meeting.date||todayIso());
      const projectName=parts[3]||'';
      const matched=state.projects.find(p=>p.name.toLowerCase()===projectName.toLowerCase());
      return {index,assignee,title,deadline,projectId:matched?.id||(meeting.projectIds||[])[0]||'',raw:line}
    }
    return {
      index,
      assignee:fallbackPeople[index]||fallbackPeople[0]||'Исполнитель не указан',
      title:line,
      deadline:meeting.date||todayIso(),
      projectId:(meeting.projectIds||[])[0]||'',
      raw:line
    }
  })
}
function syncMeetingAssignments(){
  const validKeys=new Set();
  state.meetings.forEach(meeting=>{
    meetingActionRows(meeting).forEach(row=>{
      const key=`meeting-assignment:${meeting.id}:${row.index}`;
      validKeys.add(key);
      let assignment=state.assignments.find(a=>a.meetingAssignmentKey===key);
      const status=(meeting.completedActionItems||[]).includes(row.index)?'done':(assignment?.status||'assigned');
      const data={
        title:row.title,
        projectId:row.projectId,
        assignee:row.assignee,
        assigneeId:row.assigneeId||'',
        deadline:row.deadline,
        brief:`Источник: совещание «${meeting.title}» от ${fmt(meeting.date)}.\n${meeting.decisions||meeting.notes||''}`.trim(),
        criteria:meeting.decisions||'Результат должен быть представлен к указанному сроку.',
        status,
        generatedFromMeeting:true,
        meetingAssignmentKey:key,
        sourceMeetingId:meeting.id,
        sourceMeetingItemIndex:row.index
      };
      if(assignment)Object.assign(assignment,data);
      else state.assignments.push({id:uid(),...data})
    })
  });
  state.assignments=state.assignments.filter(a=>!a.generatedFromMeeting||validKeys.has(a.meetingAssignmentKey))
}
function syncLinkedTasks(){
  syncMeetingAssignments();
  const validLinkedKeys=new Set();
  const upsert=(key,data)=>{validLinkedKeys.add(key);upsertLinkedTask(key,data)};
  state.assignments.forEach(a=>upsert(linkedTaskKey('assignment',a.id),{
    title:a.title,date:a.deadline||todayIso(),start:'09:00',duration:60,priority:'priority',
    sphere:'professional',role:a.assignee||'Исполнитель',method:a.generatedFromMeeting?'Задание по совещанию':'Поручение',
    result:a.criteria||a.brief||'',status:a.status==='done'?'done':(a.status==='doing'?'doing':'planned'),
    done:a.status==='done',projectId:a.projectId||'',linkedSourceType:'assignment',linkedSourceId:a.id
  }));
  state.projects.forEach(p=>{
    (p.sprints||[]).forEach(sp=>upsert(linkedTaskKey('sprint',sp.id),{
      title:`Спринт: ${sp.name}`,date:sp.end||sp.start||todayIso(),start:'09:00',duration:90,
      priority:'priority',sphere:'professional',role:sp.owner||'Ответственный',method:'Спринт',
      result:sp.artifact||sp.goal||'',status:sp.done?'done':'planned',done:!!sp.done,projectId:p.id,
      linkedSourceType:'sprint',linkedSourceId:sp.id,linkedProjectId:p.id
    }));
    (p.subprojects||[]).forEach(sub=>(sub.sprints||[]).forEach(sp=>upsert(linkedTaskKey('sprint',sp.id),{
      title:`${sub.name}: ${sp.name}`,date:sp.end||sp.start||todayIso(),start:'09:00',duration:90,
      priority:'priority',sphere:'professional',role:sp.owner||'Ответственный',method:'Спринт подпроекта',
      result:sp.artifact||sp.goal||'',status:sp.done?'done':'planned',done:!!sp.done,projectId:p.id,
      linkedSourceType:'sprint',linkedSourceId:sp.id,linkedProjectId:p.id,linkedSubprojectId:sub.id
    })));
  });
  state.reflections.forEach(r=>{
    if(!String(r.next||'').trim())return;
    upsert(linkedTaskKey('reflection',r.id),{
      title:r.next,date:r.date||todayIso(),start:'09:00',duration:30,priority:'current',
      sphere:'personal',role:'Автор',method:'Следующий шаг рефлексии',result:r.meaning||r.results||'',
      status:r.nextDone?'done':'planned',done:!!r.nextDone,projectId:'',
      linkedSourceType:'reflection',linkedSourceId:r.id
    })
  });
  const lifeGroups=[['family',state.family],['education',state.education]];
  lifeGroups.forEach(([type,group])=>Object.values(group||{}).flat().forEach(x=>{
    if(!x?.title)return;
    upsert(linkedTaskKey(type,x.id),{
      title:x.title,date:x.date||todayIso(),start:'09:00',duration:30,priority:'current',
      sphere:type==='education'?'education':'personal',role:type==='education'?'Учащийся':'Член семьи',
      method:LINKED_TASK_SOURCES[type],result:x.note||'',status:x.done?'done':'planned',done:!!x.done,
      projectId:'',linkedSourceType:type,linkedSourceId:x.id
    })
  }));
  state.leisure.forEach(x=>{
    if(!x?.title)return;
    upsert(linkedTaskKey('leisure',x.id),{
      title:x.title,date:x.date||todayIso(),start:'18:00',duration:60,priority:'current',
      sphere:'personal',role:'Организатор',method:'Досуг',result:x.note||'',status:x.done?'done':'planned',
      done:!!x.done,projectId:'',linkedSourceType:'leisure',linkedSourceId:x.id
    })
  });
  (state.businessProcesses||[]).forEach(process=>(process.operations||[]).forEach(op=>{
    const status=businessProcessTaskStatus(op.status),done=status==='done';
    upsert(linkedTaskKey('business_process',op.id),{
      title:`${op.code}. ${op.operation}`,date:op.end||op.start||'',start:'09:00',duration:60,
      priority:op.risk?'priority':'current',sphere:'professional',role:op.responsible||'Ответственный',method:'Операция бизнес-процесса',
      result:op.result||op.readiness||'',status,done,projectId:process.projectId||'',linkedSourceType:'business_process',linkedSourceId:op.id
    })
  }));
  state.tasks=state.tasks.filter(t=>!t.generatedLinked||validLinkedKeys.has(t.linkedKey));
}
function findLinkedSourceTask(t){
  if(!t?.linkedSourceType)return null;
  if(t.linkedSourceType==='assignment')return state.assignments.find(x=>x.id===t.linkedSourceId);
  if(t.linkedSourceType==='reflection')return state.reflections.find(x=>x.id===t.linkedSourceId);
  if(t.linkedSourceType==='meeting')return state.meetings.find(x=>x.id===t.linkedSourceId);
  if(t.linkedSourceType==='leisure')return state.leisure.find(x=>x.id===t.linkedSourceId);
  if(t.linkedSourceType==='family')return Object.values(state.family||{}).flat().find(x=>x.id===t.linkedSourceId);
  if(t.linkedSourceType==='education')return Object.values(state.education||{}).flat().find(x=>x.id===t.linkedSourceId);
  if(t.linkedSourceType==='business_process')return (state.businessProcesses||[]).flatMap(x=>x.operations||[]).find(x=>x.id===t.linkedSourceId);
  if(t.linkedSourceType==='sprint'){
    for(const p of state.projects){
      const direct=(p.sprints||[]).find(x=>x.id===t.linkedSourceId);if(direct)return direct;
      for(const sp of p.subprojects||[]){const nested=(sp.sprints||[]).find(x=>x.id===t.linkedSourceId);if(nested)return nested}
    }
  }
  return null
}
function updateLinkedSourceFromTask(t){
  const source=findLinkedSourceTask(t);if(!source)return;
  if(t.linkedSourceType==='assignment')source.status=t.done?'done':'assigned';
  else if(t.linkedSourceType==='reflection')source.nextDone=!!t.done;
  else if(t.linkedSourceType==='meeting'){
    source.completedActionItems=Array.isArray(source.completedActionItems)?source.completedActionItems:[];
    const i=Number(t.linkedItemIndex);
    source.completedActionItems=t.done?[...new Set([...source.completedActionItems,i])]:source.completedActionItems.filter(x=>x!==i)
  } else if(t.linkedSourceType==='business_process')source.status=t.done?'Готово':businessProcessSourceStatus(t.status);
  else source.done=!!t.done
}
const bar=p=>`<div class="progress"><span style="width:${Math.max(0,Math.min(100,p))}%"></span></div>`;
const empty=(t='Пока нет данных')=>`<div class="empty">${esc(t)}</div>`;
function toast(text){const el=document.createElement('div');el.className='toast';el.textContent=text;$('#toastRoot').append(el);setTimeout(()=>el.remove(),3200)}
const NAV=[
  {id:'home',label:'Главная',route:'dashboard'},
  {id:'planning',label:'Планирование',items:[['day','Сегодня'],['week','Неделя'],['month','Месяц'],['tasks','Задачи']]},
  {id:'projects-area',label:'Проекты',items:[['projects','Все проекты'],['meetings','Совещания'],['team','Команда'],['resources','Ресурсная карта'],['reports','Отчёты']]},
  {id:'life',label:'Жизнь',items:[['health','Здоровье'],['family','Семья'],['education','Образование'],['leisure','Досуг']]},
  {id:'knowledge',label:'Знания',items:[['notes','Заметки'],['library','Библиотека'],['reflection','Рефлексия'],['board','Доска'],['quotes','Цитаты дня']]},
  {id:'more',label:'Ещё',items:[['search','Поиск'],['history','Хронология'],['templates','Настройки и шаблоны'],['calendar','Обмен календарём']]}
];
const navRoutes=()=>NAV.flatMap(section=>section.route?[[section.route,section.label]]:(section.items||[]));
const titles=Object.fromEntries(navRoutes());
function buildNav(){
  const storedOpen=sessionStorage.getItem('myAssistant.navSection')||'';
  const activeSection=NAV.find(section=>section.route===route||(section.items||[]).some(([id])=>id===route));
  const openSection=storedOpen||activeSection?.id||'planning';
  $('#nav').innerHTML=NAV.map(section=>{
    if(section.route)return `<button data-route="${section.route}" class="nav-primary ${route===section.route?'active':''}">${section.label}</button>`;
    const isOpen=section.id===openSection||section.id===activeSection?.id;
    return `<div class="nav-section ${isOpen?'open':''}" data-nav-section="${section.id}"><button class="nav-section-toggle" type="button" aria-expanded="${isOpen}"><span>${section.label}</span><span class="nav-chevron">›</span></button><div class="nav-section-items">${section.items.map(([id,n])=>`<button data-route="${id}" class="${route===id?'active':''}">${n}</button>`).join('')}</div></div>`
  }).join('');
  $$('[data-route]').forEach(b=>b.onclick=()=>{route=b.dataset.route;sessionStorage.setItem('myAssistant.route',route);document.body.classList.remove('menu-open');render()});
  $$('.nav-section-toggle').forEach(button=>button.onclick=()=>{
    const section=button.closest('[data-nav-section]'),willOpen=!section.classList.contains('open');
    $$('.nav-section').forEach(item=>{item.classList.remove('open');item.querySelector('.nav-section-toggle')?.setAttribute('aria-expanded','false')});
    if(willOpen){section.classList.add('open');button.setAttribute('aria-expanded','true');sessionStorage.setItem('myAssistant.navSection',section.dataset.navSection)}
    else sessionStorage.removeItem('myAssistant.navSection')
  })
}

const collapsibleRoutes={
  dashboard:{selector:'#content > .card, #content .grid > .card',label:'Панель'},
  day:{selector:'.list-row',edit:'editTask',label:'Задача'},
  week:{selector:'.day-column, .card',label:'День недели'},
  month:{selector:'.month-day, .card',label:'День месяца'},
  tasks:{selector:'.list-row',edit:'editTask',label:'Задача'},
  kanban:{selector:'.kanban-column',label:'Колонка Kanban'},
  team:{selector:'article.team-person-card',label:'Участник команды'},
  resources:{selector:'.grid > .card',label:'Участник'},
  meetings:{selector:'article.card',edit:'editMeeting',label:'Совещание'},
  reports:{selector:'article.report-card',label:'Отчёт или план'},
  calendar:{selector:'#content > .grid > .card, #content > .card',label:'Календарь'},
  health:{selector:'article.card',edit:'editHealth',label:'Привычка'},
  family:{selector:'.life-grid > .card',label:'Раздел семьи'},
  education:{selector:'.life-grid > .card',label:'Раздел образования'},
  leisure:{selector:'article.card',edit:'editSimple',label:'Запись'},
  quotes:{selector:'article.quote-card',label:'Цитата'},
  notes:{selector:'article.card',edit:'editSimple',label:'Заметка'},
  library:{selector:'article.card',edit:'editSimple',label:'Материал'},
  reflection:{selector:'article.card',edit:'editReflection',label:'Рефлексия'},
  board:{selector:'.board-shell, .card',label:'Доска'},
  search:{selector:'.list-row, article.card',label:'Результат поиска'},
  history:{selector:'.timeline-item',label:'Изменение'},
  templates:{selector:'.grid.cols-2 > .card',label:'Шаблон'}
};
function entryTitle(el,fallback){
  return el.querySelector('h2,h3,h4,.item-title,b,strong')?.textContent?.trim()||fallback;
}
function entryId(el,config,index){
  if(config.edit){
    const attr='data-'+config.edit.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
    const target=el.querySelector('['+attr+']');
    if(target)return target.getAttribute(attr);
  }
  const key=el.querySelector('[data-life-key]')?.dataset.lifeKey;
  if(key)return key;
  const reportId=el.querySelector('[data-edit-report]')?.dataset.editReport;
  if(reportId)return reportId;
  const person=el.querySelector('h2')?.textContent?.trim();
  if(route==='team'&&person)return person.toLowerCase();
  return `${route}-${index}-${entryTitle(el,config.label).slice(0,80)}`;
}
function collapsedSet(){return new Set(state.settings.collapsedEntries?.[route]||[])}
function saveCollapsedSet(set){state.settings.collapsedEntries=state.settings.collapsedEntries||{};state.settings.collapsedEntries[route]=[...set];persist()}



function makeInternalScrollable(entry){
  if(!entry)return;
  entry.classList.add('universal-scroll-area')
}
function enhanceProjectInternalScroll(){
  $$('.project-card .project-details').forEach(el=>el.classList.add('universal-scroll-area','project-scroll-area'))
}
function applyUniversalScrollbars(){
  const selectors=[
    '#content > .hero',
    '#content > .card',
    '#content .grid > .card',
    '#content .list-row',
    '#content .subcard',
    '#content .mini-card',
    '#content .timeline-item',
    '#content .kanban-column',
    '#content .schedule-wrap',
    '#content .month-grid',
    '#content .life-grid > .card',
    '#content .report-card',
    '#content .report-table-wrap',
    '#content .template-list',
    '#content .board-shell',
    '#content .resource-card',
    '#content .meeting-card'
  ];
  selectors.forEach(selector=>{
    $$(selector).forEach(el=>{
      if(el.closest('.modal'))return;
      el.classList.add('universal-scroll-area')
    })
  });
  $$('#content textarea').forEach(el=>el.classList.add('universal-textarea-scroll'))
}
function enhanceCollapsibleEntries(){
  const config=collapsibleRoutes[route];if(!config)return;
  const container=$('#content'),items=[...container.querySelectorAll(config.selector)].filter(el=>!el.closest('.modal')&&!el.classList.contains('empty-state'));
  if(!items.length)return;
  const set=collapsedSet();
  const firstToolbar=container.querySelector(':scope > .toolbar')||container.querySelector('.hero');
  if(firstToolbar&&!container.querySelector('.global-collapse-controls')){
    const controls=document.createElement('div');controls.className='global-collapse-controls';
    controls.innerHTML='<button class="btn ghost small" type="button" data-collapse-route>Свернуть все</button><button class="btn ghost small" type="button" data-expand-route>Развернуть все</button>';
    firstToolbar.insertAdjacentElement('afterend',controls);
    controls.querySelector('[data-collapse-route]').onclick=()=>{const all=new Set(items.map((el,i)=>entryId(el,config,i)));saveCollapsedSet(all);render()};
    controls.querySelector('[data-expand-route]').onclick=()=>{saveCollapsedSet(new Set());render()};
  }
  items.forEach((el,index)=>{
    if(el.dataset.collapseReady)return;el.dataset.collapseReady='1';
    const id=entryId(el,config,index),title=entryTitle(el,config.label),isCollapsed=set.has(id);
    el.classList.add('collapsible-entry');el.classList.toggle('global-collapsed',isCollapsed);
    const bar=document.createElement('div');bar.className='global-collapse-bar';
    bar.innerHTML=`<button class="entry-collapse-toggle" type="button" aria-expanded="${!isCollapsed}" aria-label="${isCollapsed?'Развернуть':'Свернуть'}"><span>${isCollapsed?'›':'⌄'}</span></button><div class="entry-collapse-title">${esc(title)}</div><div class="entry-collapse-hint">${isCollapsed?'Нажмите, чтобы открыть':'Свернуть'}</div>`;
    el.prepend(bar);
    bar.querySelector('button').onclick=e=>{e.stopPropagation();const next=collapsedSet();next.has(id)?next.delete(id):next.add(id);saveCollapsedSet(next);render()};
    makeInternalScrollable(el);
  });
}
function removeLegacyMonthRoadmapTitle(){
  if(route!=='month')return;
  const legacyTitle=/^дорожная\s+карта\s+по\s+проекту\s+[«"']?числумики[»"']?$/i;
  $$('h1,h2,h3,.page-title,.calendar-title,.roadmap-title').forEach(el=>{
    const text=(el.textContent||'').trim().replace(/\s+/g,' ');
    if(legacyTitle.test(text))el.remove();
  });
}
function render(){buildNav();$('#pageTitle').textContent=titles[route]||'Мой ассистент';$('#breadcrumb').textContent=route==='dashboard'?'Главная':'Мой ассистент';const map={dashboard:renderDashboard,day:renderDay,week:renderWeek,month:renderMonth,projects:renderProjects,tasks:renderTasks,kanban:renderKanban,team:renderTeam,resources:renderResources,meetings:renderMeetings,reports:renderReports,calendar:renderCalendar,health:renderHealth,family:renderFamily,education:renderEducation,leisure:renderLeisure,quotes:renderQuotes,notes:renderNotes,library:renderLibrary,reflection:renderReflection,board:renderBoard,search:renderSearch,history:renderHistory,templates:renderTemplates};$('#content').innerHTML=(map[route]||renderDashboard)();removeLegacyMonthRoadmapTitle();bindPage();enhanceCollapsibleEntries();enhanceProjectInternalScroll();applyUniversalScrollbars();$('#content').focus({preventScroll:true});requestAnimationFrame(updatePageScrollControls)}
function taskRow(t){return `<div class="list-row ${t.done?'done':''}"><div><div class="item-title">${esc(t.title)} ${t.linkedSourceType?`<span class="chip">${esc(linkedTaskSourceLabel(t))}</span>`:''}</div><div class="item-meta">${fmt(t.date)} ${esc(t.start||'')} · ${esc(project(t.projectId)?.name||'Без проекта')} · ${esc(t.role||'Роль не указана')} · ${esc(t.method||'Метод не указан')}</div>${t.result?`<div class="item-meta"><b>Результат:</b> ${esc(t.result)}</div>`:''}</div><div class="actions">${t.generatedLinked?'':`<button class="btn ghost small" data-edit-task="${t.id}">Изменить</button>`}<button class="btn ${t.done?'ghost':'primary'} small" data-toggle-task="${t.id}">${t.done?'Вернуть':'Готово'}</button></div></div>`}

function quoteOfDay(){
  const today=todayIso();
  return state.quotes.find(q=>q.featured&&q.date===today)
    ||state.quotes.find(q=>q.featured)
    ||state.quotes.find(q=>q.date===today)
    ||state.quotes[0]
    ||null
}
function quoteCard(q){
  return `<article class="card quote-card ${q.featured?'quote-featured':''}">
    <div class="quote-mark">“</div>
    <blockquote>${esc(q.text)}</blockquote>
    <div class="quote-meta"><b>${esc(q.author||'Автор не указан')}</b><span>${esc(q.category||'Без категории')} · ${fmt(q.date)}</span></div>
    <div class="chips">${(q.tags||[]).map(t=>`<span class="chip">${esc(t)}</span>`).join('')}${q.favorite?'<span class="chip">★ Избранное</span>':''}${q.featured?'<span class="chip">Цитата дня</span>':''}</div>
    ${q.note?`<p class="quote-note">${esc(q.note)}</p>`:''}
    <div class="actions">
      <button class="btn ghost small" data-feature-quote="${q.id}">${q.featured?'Снять с главной':'На главную'}</button>
      <button class="btn ghost small" data-favorite-quote="${q.id}">${q.favorite?'Убрать ★':'В избранное'}</button>
      <button class="btn ghost small" data-edit-quote="${q.id}">Изменить</button>
      <button class="btn danger small" data-delete-quote="${q.id}">Удалить</button>
    </div>
  </article>`
}
function renderQuotes(){
  const categories=[...new Set(state.quotes.map(q=>q.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
  const favorites=state.quotes.filter(q=>q.favorite).length;
  return `<div class="hero"><p class="eyebrow">Коллекция смыслов</p><h2>Цитаты дня</h2><p>Сохраняйте важные мысли, выбирайте главную цитату дня и структурируйте коллекцию по темам и тегам.</p></div>
  <div class="grid cols-3"><div class="card metric"><span>Всего цитат</span><strong>${state.quotes.length}</strong></div><div class="card metric"><span>Категорий</span><strong>${categories.length}</strong></div><div class="card metric"><span>Избранных</span><strong>${favorites}</strong></div></div>
  <section class="card quote-controls">
    <button class="btn primary" data-add-quote>+ Добавить цитату</button>
    <input class="search-input" id="quoteSearch" placeholder="Поиск по тексту, автору или тегу">
    <select id="quoteCategory"><option value="">Все категории</option>${categories.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select>
    <label class="form-check"><input class="form-check-input" type="checkbox" id="quoteFavorites"><span class="form-check-label">Только избранное</span></label>
  </section>
  <div id="quoteList" class="quotes-grid">${state.quotes.slice().sort((a,b)=>(b.featured-a.featured)||(b.date||'').localeCompare(a.date||'')).map(quoteCard).join('')||empty('Добавьте первую цитату')}</div>`
}
function openQuote(q=null){
  const fields=[
    {name:'text',label:'Текст цитаты',type:'textarea',required:true,full:true},
    {name:'author',label:'Автор или источник',full:true},
    {name:'category',label:'Категория',full:true,placeholder:'Например: Проекты, Время, Образование'},
    {name:'tagsText',label:'Теги через запятую',full:true},
    {name:'date',label:'Дата',type:'date'},
    {name:'note',label:'Личная заметка или смысл',type:'textarea',full:true},
    {name:'featured',label:'Показывать на главной',type:'select',options:[['false','Нет'],['true','Да']]},
    {name:'favorite',label:'Избранное',type:'select',options:[['false','Нет'],['true','Да']]}
  ];
  modal(q?'Редактировать цитату':'Новая цитата',fields,o=>{
    o.tags=o.tagsText.split(',').map(v=>v.trim()).filter(Boolean);delete o.tagsText;
    o.featured=o.featured==='true';o.favorite=o.favorite==='true';
    if(o.featured)state.quotes.forEach(x=>x.featured=false);
    if(q)Object.assign(q,o);else state.quotes.unshift({id:uid(),...o});
    persist('Цитата сохранена')
  },q?{...q,tagsText:(q.tags||[]).join(', '),featured:String(q.featured),favorite:String(q.favorite)}:{date:todayIso(),featured:'false',favorite:'false',category:'Развитие'})
}
function renderDashboard(){const today=state.tasks.filter(t=>t.date===todayIso()&&!t.done);const overdue=state.tasks.filter(t=>!t.done&&t.date&&t.date<todayIso()).sort((a,b)=>a.date.localeCompare(b.date));const urgent=state.tasks.filter(t=>!t.done&&(t.priority==='urgent'||t.priority==='priority')).slice(0,8);const undated=state.tasks.filter(t=>!t.done&&!t.date);const nextMeeting=state.meetings.filter(m=>m.date>=todayIso()).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time))[0];const recent=state.history.slice(0,4);const q=quoteOfDay();return `<div class="hero"><p class="eyebrow">Ваш день</p><h2>${overdue.length?`Сначала разберите ${overdue.length} просроченн${overdue.length===1?'ую задачу':'ых задач'}`:'Что важно сегодня?'}</h2><p>${nextMeeting?`Ближайшее совещание: ${esc(nextMeeting.title)} · ${fmt(nextMeeting.date)} ${esc(nextMeeting.time||'')}`:'Проекты, задачи и личные планы — в одном спокойном пространстве.'}</p></div>${q?`<section class="card dashboard-quote"><div class="quote-mark">“</div><blockquote>${esc(q.text)}</blockquote><div class="quote-meta"><b>${esc(q.author||'Автор не указан')}</b><button class="btn ghost small" data-route-quotes>Все цитаты</button></div></section>`:''}<div class="grid cols-4"><button class="card metric metric-action" data-dashboard-filter="overdue"><span>Просрочено</span><strong>${overdue.length}</strong></button><button class="card metric metric-action" data-dashboard-filter="today"><span>Сегодня</span><strong>${today.length}</strong></button><button class="card metric metric-action" data-dashboard-filter="undated"><span>Без даты</span><strong>${undated.length}</strong></button><button class="card metric metric-action" data-route-meetings><span>Ближайшие совещания</span><strong>${state.meetings.filter(m=>m.date>=todayIso()).length}</strong></button></div><div class="grid cols-2" style="margin-top:18px"><section class="card"><div class="section-title"><h2>${overdue.length?'Просрочено':'Сегодня'}</h2><button class="btn primary small" data-add-task>+ Задача</button></div><div class="list">${(overdue.length?overdue:today).slice(0,8).map(taskRow).join('')||empty()}</div></section><section class="card"><h2>Требует внимания</h2><div class="list">${urgent.map(taskRow).join('')||empty()}</div></section></div><section class="card" style="margin-top:18px"><div class="section-title"><h2>Продолжить работу</h2><button class="btn ghost small" data-route-history>Вся хронология</button></div><div class="list">${recent.map(x=>`<div class="list-row"><div><div class="item-title">${esc(x.title)}</div><div class="item-meta">${new Date(x.at).toLocaleString('ru-RU')}</div></div></div>`).join('')||empty('История изменений пока пуста')}</div></section>`}

function calendarTaskCard(t,view='calendar'){
  const linked=t.linkedSourceType?`<span class="chip">${esc(linkedTaskSourceLabel(t))}</span>`:'';
  return `<article class="calendar-task-card ${t.done?'done':''}" data-calendar-task="${t.id}">
    <button type="button" class="calendar-task-main" data-edit-task="${t.id}" title="Открыть и изменить задачу">
      <span class="calendar-task-title">${esc(t.title)}</span>
      ${linked}
      <span class="calendar-task-meta">${esc(t.start||'Без времени')}${project(t.projectId)?` · ${esc(project(t.projectId).name)}`:''}</span>
    </button>
    <div class="calendar-task-actions">
      <button type="button" class="calendar-edit-btn" data-edit-task="${t.id}" aria-label="Редактировать задачу">✎</button>
      <button type="button" class="calendar-done-btn" data-toggle-task="${t.id}" aria-label="${t.done?'Вернуть задачу':'Отметить выполненной'}">${t.done?'↶':'✓'}</button>
      ${t.generatedLinked?'':`<button type="button" class="calendar-delete-btn" data-delete-task="${t.id}" aria-label="Удалить задачу">×</button>`}
    </div>
  </article>`
}
function renderDay(){
  const hours=[...Array(18)].map((_,i)=>i+6),date=localDateIso(dayCursor);
  return `<div class="calendar-toolbar day-navigation">
    <button class="btn ghost" data-day-shift="-1" aria-label="Предыдущий день">←</button>
    <div><p class="eyebrow">План дня</p><h2>${new Intl.DateTimeFormat('ru-RU',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(dayCursor)}</h2></div>
    <button class="btn ghost" data-day-shift="1" aria-label="Следующий день">→</button>
    <input type="date" id="dayDatePicker" value="${date}" aria-label="Выбрать дату">
    <button class="btn ghost" id="goToday">Сегодня</button>
    <button class="btn primary" data-add-task>+ Задача</button>
  </div>
  <div class="card day-schedule">${hours.map(h=>{
    const ts=state.tasks.filter(t=>t.date===date&&Number((t.start||'99').slice(0,2))===h);
    return `<div class="day-hour-row">
      <div class="day-time-label">${String(h).padStart(2,'0')}:00</div>
      <div class="day-task-area">${ts.map(t=>calendarTaskCard(t,'day')).join('')||'<span class="day-empty">Свободно</span>'}</div>
      <button class="btn ghost small" data-slot-date="${date}" data-slot-hour="${h}">+ Добавить</button>
    </div>`
  }).join('')}</div>`
}
function weekDates(){const d=new Date(weekCursor),day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return [...Array(7)].map((_,i)=>{const x=new Date(d);x.setDate(d.getDate()+i);return x})}
function renderWeek(){
  const ds=weekDates(),weekTasks=state.tasks.filter(t=>t.date>=localDateIso(ds[0])&&t.date<=localDateIso(ds[6]));
  const done=weekTasks.filter(t=>t.done).length,open=weekTasks.length-done,priority=weekTasks.filter(t=>!t.done&&t.priority==='priority').length;
  weekDayIndex=Math.max(0,Math.min(6,weekDayIndex));
  const activeDate=localDateIso(ds[weekDayIndex]);
  const activeTasks=state.tasks.filter(t=>t.date===activeDate).sort((a,b)=>(a.start||'99:99').localeCompare(b.start||'99:99'));
  return `<section class="week-workspace">
    <header class="week-main-toolbar">
      <div class="week-title"><p class="eyebrow">План недели</p><h2>${fmt(localDateIso(ds[0]))} — ${fmt(localDateIso(ds[6]))}</h2></div>
      <div class="week-navigation" aria-label="Навигация по неделям">
        <button class="btn ghost" data-week-shift="-1" aria-label="Предыдущая неделя">←</button>
        <button class="btn ghost" id="goCurrentWeek">Текущая неделя</button>
        <button class="btn ghost" data-week-shift="1" aria-label="Следующая неделя">→</button>
        <button class="btn primary" data-add-task>+ Новая задача</button>
      </div>
    </header>
    <div class="week-summary" aria-label="Итоги недели">
      <div><span>Всего</span><strong>${weekTasks.length}</strong></div>
      <div><span>Осталось</span><strong>${open}</strong></div>
      <div><span>Выполнено</span><strong>${done}</strong></div>
      <div class="${priority?'has-priority':''}"><span>Приоритетных</span><strong>${priority}</strong></div>
    </div>
    <nav class="week-day-tabs" aria-label="Выбор дня недели">
      ${ds.map((d,i)=>{const date=localDateIso(d),count=state.tasks.filter(t=>t.date===date).length;return `<button type="button" class="week-day-tab ${i===weekDayIndex?'active':''} ${date===todayIso()?'today':''}" data-week-day="${i}" aria-current="${i===weekDayIndex?'date':'false'}"><span>${new Intl.DateTimeFormat('ru-RU',{weekday:'short'}).format(d)}</span><strong>${d.getDate()}</strong><small>${count?`${count} задач${count===1?'а':count<5?'и':''}`:'свободно'}</small></button>`}).join('')}
    </nav>
    <section class="week-focus-day ${activeDate===todayIso()?'today':''}" aria-label="Выбранный день">
      <header class="week-focus-head">
        <button class="btn ghost week-day-arrow" data-week-day-move="-1" aria-label="Предыдущий день">←</button>
        <button type="button" class="week-focus-title" data-week-jump="${weekDayIndex}" aria-label="Открыть подробный план дня">
          <span>${new Intl.DateTimeFormat('ru-RU',{weekday:'long'}).format(ds[weekDayIndex])}</span>
          <strong>${new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long'}).format(ds[weekDayIndex])}</strong>
        </button>
        <span class="week-day-count">${activeTasks.length}</span>
        <button class="btn ghost week-day-arrow" data-week-day-move="1" aria-label="Следующий день">→</button>
      </header>
      <div class="week-focus-tasks">${activeTasks.length?activeTasks.map(t=>calendarTaskCard(t,'week')).join(''):`<div class="week-day-empty"><span>Свободный день</span><small>Можно оставить время для отдыха или важной задачи</small></div>`}</div>
      <button class="week-day-add" data-slot-date="${activeDate}" data-slot-hour="9">+ Добавить задачу на этот день</button>
    </section>
  </section>`
}
function renderMonth(){
  const y=monthCursor.getFullYear(),m=monthCursor.getMonth(),first=new Date(y,m,1),start=new Date(first);
  start.setDate(1-((first.getDay()+6)%7));
  const cells=[...Array(42)].map((_,i)=>{const x=new Date(start);x.setDate(start.getDate()+i);return x});
  const monthStart=localDateIso(first),monthEnd=localDateIso(new Date(y,m+1,0));
  const monthTasks=state.tasks.filter(t=>t.date>=monthStart&&t.date<=monthEnd);
  const open=monthTasks.filter(t=>!t.done).length,done=monthTasks.length-open,priority=monthTasks.filter(t=>!t.done&&(t.priority==='priority'||t.priority==='urgent')).length;
  const monthFilterMatch=t=>monthTaskFilter==='open'?!t.done:monthTaskFilter==='done'?t.done:monthTaskFilter==='priority'?!t.done&&(t.priority==='priority'||t.priority==='urgent'):true;
  const filterLabels={all:'Все задачи',open:'Оставшиеся задачи',done:'Выполненные задачи',priority:'Важные задачи'};
  if(!monthSelectedDate||monthSelectedDate<localDateIso(cells[0])||monthSelectedDate>localDateIso(cells[41]))monthSelectedDate=monthStart;
  const selectedTasks=state.tasks.filter(t=>t.date===monthSelectedDate&&monthFilterMatch(t)).sort((a,b)=>(a.start||'99:99').localeCompare(b.start||'99:99'));
  const monthLabel=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(monthCursor);
  const selectedLabel=new Intl.DateTimeFormat('ru-RU',{weekday:'long',day:'numeric',month:'long'}).format(parseLocalDate(monthSelectedDate));
  return `<section class="month-workspace">
  <header class="month-main-toolbar">
    <div><p class="eyebrow">План месяца</p><h2>${monthLabel}</h2></div>
    <div class="month-navigation" aria-label="Навигация по месяцам">
      <button class="btn ghost" data-month="-1" aria-label="Предыдущий месяц">←</button>
      <button class="btn ghost" id="goCurrentMonth">Текущий месяц</button>
      <button class="btn ghost" data-month="1" aria-label="Следующий месяц">→</button>
      <button class="btn primary" data-add-task>+ Новая задача</button>
    </div>
  </header>
  <div class="month-summary" aria-label="Фильтры задач месяца">
    ${[['all','Всего задач',monthTasks.length],['open','Осталось',open],['done','Выполнено',done],['priority','Важное',priority]].map(([key,label,count])=>`<button type="button" class="month-summary-filter ${key==='priority'&&priority?'has-priority':''} ${monthTaskFilter===key?'active':''}" data-month-filter="${key}" aria-pressed="${monthTaskFilter===key}"><span>${label}</span><strong>${count}</strong><small>${monthTaskFilter===key?'Показаны':'Показать задачи'}</small></button>`).join('')}
  </div>
  <div class="month-filter-status" role="status"><span>${filterLabels[monthTaskFilter]}</span><button type="button" data-month-filter="all" ${monthTaskFilter==='all'?'hidden':''}>Сбросить фильтр</button></div>
  <div class="month-layout">
  <div class="month-calendar-card card">
  <div class="month-grid editable-month-grid" aria-label="Календарь на ${monthLabel}">
    <div class="head">Пн</div><div class="head">Вт</div><div class="head">Ср</div><div class="head">Чт</div><div class="head">Пт</div><div class="head weekend">Сб</div><div class="head weekend">Вс</div>
    ${cells.map(d=>{
      const di=localDateIso(d),ts=state.tasks.filter(t=>t.date===di&&monthFilterMatch(t)).sort((a,b)=>(a.start||'99:99').localeCompare(b.start||'99:99')),visible=ts.slice(0,2),extra=Math.max(0,ts.length-visible.length);
      const classes=[d.getMonth()!==m?'dim':'',di===todayIso()?'today':'',di===monthSelectedDate?'selected':'',(d.getDay()===0||d.getDay()===6)?'weekend':''].filter(Boolean).join(' ');
      return `<section class="month-cell ${classes}" data-month-day="${di}">
        <header class="month-cell-header">
          <button type="button" class="month-day-select" data-month-select="${di}" aria-label="Открыть ${di}"><span class="daynum">${d.getDate()}</span>${ts.length?`<span class="month-day-count">${ts.length}</span>`:''}</button>
          <button type="button" class="month-add-btn" data-slot-date="${di}" data-slot-hour="9" aria-label="Добавить задачу на ${di}">+</button>
        </header>
        <div class="month-task-preview">${visible.map(t=>`<button type="button" class="month-task-preview-item ${t.done?'done':''}" data-edit-task="${t.id}"><span>${esc(t.start||'—')}</span><b>${esc(t.title)}</b></button>`).join('')||'<span class="month-empty">Свободно</span>'}${extra?`<button type="button" class="month-more" data-month-select="${di}">Ещё ${extra}</button>`:''}</div>
      </section>`
    }).join('')}
  </div></div>
  <aside class="month-day-panel card" aria-label="Задачи выбранного дня">
    <header><div><p class="eyebrow">Выбранный день</p><h3>${selectedLabel}</h3></div><span class="month-panel-count">${selectedTasks.length}</span></header>
    <div class="month-panel-tasks">${selectedTasks.map(t=>calendarTaskCard(t,'month-panel')).join('')||`<div class="month-day-empty"><b>По выбранному фильтру задач нет</b><span>Выберите другую плашку или добавьте новый план.</span></div>`}</div>
    <button class="month-panel-add" data-slot-date="${monthSelectedDate}" data-slot-hour="9">+ Добавить задачу на этот день</button>
  </aside></div></section>`
}

function roadmapDate(value){const d=parseLocalDate(value);return Number.isNaN(d.getTime())?null:d}
function roadmapProjectRange(p){
  const dates=[p.start,p.end];
  (p.sprints||[]).forEach(x=>dates.push(x.start,x.end));
  (p.subprojects||[]).forEach(sp=>{dates.push(sp.start,sp.end);(sp.sprints||[]).forEach(x=>dates.push(x.start,x.end))});
  const valid=dates.map(roadmapDate).filter(Boolean);
  if(!valid.length)return null;
  return {start:new Date(Math.min(...valid)),end:new Date(Math.max(...valid))}
}
function roadmapDays(a,b){return Math.max(1,Math.round((b-a)/86400000))}
function roadmapPct(date,start,end){return Math.max(0,Math.min(100,roadmapDays(start,date)/roadmapDays(start,end)*100))}
function roadmapBar(item,start,end,kind='project'){
  const a=roadmapDate(item.start),b=roadmapDate(item.end||item.start);
  if(!a||!b)return '';
  const left=roadmapPct(a,start,end),right=roadmapPct(b,start,end),width=Math.max(1.2,right-left);
  const title=`${item.name||item.title||'Этап'}: ${fmt(item.start)} — ${fmt(item.end||item.start)}`;
  return `<button type="button" class="roadmap-bar roadmap-${kind}" style="left:${left}%;width:${width}%" title="${esc(title)}" data-roadmap-project="${item.projectId||''}"><span>${esc(item.name||item.title||'Этап')}</span></button>`
}
function roadmapTicks(start,end,scale){
  const ticks=[],d=new Date(start);
  d.setHours(0,0,0,0);
  if(scale==='week'){d.setDate(d.getDate()-((d.getDay()+6)%7))}
  else if(scale==='month'){d.setDate(1)}
  else {d.setMonth(Math.floor(d.getMonth()/3)*3,1)}
  while(d<=end){
    ticks.push(new Date(d));
    if(scale==='week')d.setDate(d.getDate()+7);
    else if(scale==='month')d.setMonth(d.getMonth()+1);
    else d.setMonth(d.getMonth()+3)
  }
  return ticks
}
function renderRoadmaps(){
  const hidden=new Set(state.settings.roadmapCompareHidden||[]);
  const projects=orderedProjects().filter(p=>!hidden.has(p.id)&&roadmapProjectRange(p));
  const allRanges=state.projects.map(roadmapProjectRange).filter(Boolean);
  if(!allRanges.length)return `<div class="hero"><h2>Сравнение дорожных карт</h2><p>Укажите даты начала и завершения проектов, подпроектов или спринтов.</p></div>`;
  let start=new Date(Math.min(...allRanges.map(r=>r.start))),end=new Date(Math.max(...allRanges.map(r=>r.end)));
  start.setDate(start.getDate()-7);end.setDate(end.getDate()+7);
  const scale=state.settings.roadmapCompareScale||'month',ticks=roadmapTicks(start,end,scale),today=roadmapDate(todayIso()),todayPct=today?roadmapPct(today,start,end):-1;
  const activeProjects=state.projects.filter(p=>!hidden.has(p.id)&&roadmapProjectRange(p)).length;
  return `<div class="hero"><p class="eyebrow">Портфель проектов</p><h2>Сравнение дорожных карт</h2><p>Все выбранные проекты расположены на одной временной шкале. Так видны параллельные этапы, пересечения сроков и периоды высокой нагрузки.</p></div>
  <section class="card roadmap-controls">
    <div><b>Масштаб</b><div class="actions">${[['week','Недели'],['month','Месяцы'],['quarter','Кварталы']].map(([v,l])=>`<button class="btn small ${scale===v?'primary':'ghost'}" data-roadmap-scale="${v}">${l}</button>`).join('')}</div></div>
    <div><b>Проекты на экране</b><div class="roadmap-project-toggles">${orderedProjects().map(p=>`<label class="form-check"><input class="form-check-input" type="checkbox" data-roadmap-toggle="${p.id}" ${hidden.has(p.id)?'':'checked'}><span class="form-check-label">${esc(p.name)}</span></label>`).join('')}</div></div>
    <div class="actions"><button class="btn ghost small" id="roadmapShowAll">Показать все</button><button class="btn ghost small" id="roadmapActiveOnly">Только активные</button></div>
  </section>
  <div class="grid cols-3 roadmap-metrics">
    <div class="card metric"><span>Показано проектов</span><strong>${activeProjects}</strong></div>
    <div class="card metric"><span>Общий период</span><strong>${fmt(localDateIso(start))} — ${fmt(localDateIso(end))}</strong></div>
    <div class="card metric"><span>Текущая дата</span><strong>${fmt(todayIso())}</strong></div>
  </div>
  <div class="roadmap-scroll card">
    <div class="roadmap-board" style="min-width:${Math.max(1000,ticks.length*120)}px">
      <div class="roadmap-axis-label">Проект / этап</div>
      <div class="roadmap-axis">${ticks.map(t=>`<div class="roadmap-tick" style="left:${roadmapPct(t,start,end)}%"><span>${new Intl.DateTimeFormat('ru-RU',scale==='week'?{day:'2-digit',month:'short'}:scale==='month'?{month:'short',year:'2-digit'}:{month:'short',year:'numeric'}).format(t)}</span></div>`).join('')}${todayPct>=0&&todayPct<=100?`<div class="roadmap-today" style="left:${todayPct}%"><span>Сегодня</span></div>`:''}</div>
      ${projects.map(p=>{
        const r=roadmapProjectRange(p),subrows=(p.subprojects||[]),sprints=(p.sprints||[]);
        return `<section class="roadmap-project-row">
          <div class="roadmap-row-label"><b>${esc(p.name)}</b><span>${fmt(p.start)} — ${fmt(p.end)} · ${esc(p.status||'active')}</span></div>
          <div class="roadmap-track">${roadmapBar({...p,projectId:p.id},start,end,'project')}</div>
          ${subrows.map(sp=>`<div class="roadmap-row-label roadmap-child-label"><span>↳ ${esc(sp.name)}</span></div><div class="roadmap-track roadmap-child-track">${roadmapBar({...sp,projectId:p.id},start,end,'subproject')}${(sp.sprints||[]).map(x=>roadmapBar({...x,projectId:p.id},start,end,'sprint')).join('')}</div>`).join('')}
          ${sprints.length?`<div class="roadmap-row-label roadmap-child-label"><span>Спринты проекта</span></div><div class="roadmap-track roadmap-child-track">${sprints.map(x=>roadmapBar({...x,projectId:p.id},start,end,'sprint')).join('')}</div>`:''}
        </section>`
      }).join('')||empty('Выберите хотя бы один проект')}
    </div>
  </div>
  <div class="roadmap-legend"><span><i class="legend-project"></i>Проект</span><span><i class="legend-subproject"></i>Подпроект</span><span><i class="legend-sprint"></i>Спринт</span><span><i class="legend-today"></i>Сегодня</span></div>`
}
function renderProjects(){return `<div class="projects-header card"><div><p class="eyebrow">Портфель проектов</p><h2>Мои проекты <span class="chip">${state.projects.length}</span></h2><p class="muted">Все проекты видны компактным списком. Разверните нужный или включите режим фокуса.</p></div><div class="projects-actions"><button class="btn primary large-action" data-add-project>＋ Добавить проект</button><button class="btn ghost" data-quick-project>Быстро добавить</button></div></div><div class="toolbar sticky-project-toolbar"><input class="search-input" id="projectFilter" placeholder="Поиск по названию проекта"><div class="actions"><button class="btn ghost small" id="collapseAllProjects">Свернуть все</button><button class="btn ghost small" id="expandAllProjects">Развернуть все</button><button class="btn primary mobile-add-project" data-add-project>＋ Проект</button></div></div><div id="projectList" class="project-sort-list">${projectCards(orderedProjects())}</div>`}


function projectTeamWithSubprojects(p){
  const rows=[],seen=new Set();
  const add=(m,source,spid='')=>{
    const key=`${String(m.name||'').trim().toLowerCase()}|${String(m.role||'').trim().toLowerCase()}|${source}`;
    if(seen.has(key))return;
    seen.add(key);
    rows.push({...m,source,subprojectId:spid})
  };
  (p.team||[]).forEach(m=>add(m,'Проект'));
  (p.subprojects||[]).forEach(sp=>(sp.team||[]).forEach(m=>add(m,`Подпроект: ${sp.name}`,sp.id)));
  return rows
}
function teamRegistry(){
  const map=new Map();
  state.projects.forEach(p=>{
    projectTeamWithSubprojects(p).forEach(m=>{
      const name=String(m.name||'Без имени').trim(),key=name.toLowerCase();
      if(!map.has(key))map.set(key,{name,memberIds:new Set(),contact:m.contact||'',department:normalizedDepartment(m),roles:new Set(),projects:[],statuses:new Set()});
      const x=map.get(key);
      if(m.id)x.memberIds.add(m.id);
      if(m.contact&&!x.contact)x.contact=m.contact;if(normalizedDepartment(m)===PRESCHOOL_DEPARTMENT)x.department=PRESCHOOL_DEPARTMENT;
      if(m.role)x.roles.add(m.role);
      x.projects.push({projectId:p.id,project:p.name,source:m.source,role:m.role||'Роль не указана',status:p.status||'active'});
      x.statuses.add(p.status||'active')
    })
  });
  state.assignments.forEach(a=>{
    const name=String(a.assignee||'').trim();
    if(!name)return;
    const key=name.toLowerCase();
    if(!map.has(key))map.set(key,{name,memberIds:new Set(),contact:'',department:isPreschoolName(name)?PRESCHOOL_DEPARTMENT:'Другое подразделение',roles:new Set(),projects:[],statuses:new Set()});
    const x=map.get(key),p=project(a.projectId);
    if(a.assigneeId)x.memberIds.add(a.assigneeId);
    if(p&&!x.projects.some(r=>r.projectId===p.id&&r.source==='Поручение'))x.projects.push({projectId:p.id,project:p.name,source:'Поручение',role:'Исполнитель',status:a.status||'assigned'});
    x.statuses.add(a.status||'assigned')
  });
  return [...map.values()].sort((a,b)=>a.name.localeCompare(b.name,'ru'))
}
function memberCards(team,pid,spid=''){return (team||[]).map(m=>`<div class="mini-card"><div class="toolbar"><b>${esc(m.name)}</b><div class="actions"><button class="btn ghost small" data-edit-member="${m.id}" data-project="${pid}" ${spid?`data-subproject="${spid}"`:''}>Изменить</button><button class="btn danger small" data-delete-member="${m.id}" data-project="${pid}" ${spid?`data-subproject="${spid}"`:''}>Удалить</button></div></div><div class="item-meta">${esc(m.role||'Роль не указана')} · ${esc(normalizedDepartment(m))}${m.contact?` · ${esc(m.contact)}`:''}</div>${m.note?`<p>${esc(m.note)}</p>`:''}</div>`).join('')||empty('Команда пока не добавлена')}
function sprintCards(sprints,pid,spid=''){return (sprints||[]).map(s=>`<div class="timeline-item"><div class="toolbar"><b>${esc(s.name)}</b><div class="actions"><button class="btn ghost small" data-edit-sprint="${s.id}" data-project="${pid}" ${spid?`data-subproject="${spid}"`:''}>Изменить</button><button class="btn danger small" data-delete-sprint="${s.id}" data-project="${pid}" ${spid?`data-subproject="${spid}"`:''}>Удалить</button></div></div><div class="item-meta">${fmt(s.start)} — ${fmt(s.end)} · ${esc(s.owner||'Без ответственного')}</div><p>${esc(s.goal||'')}</p><div class="item-meta">Артефакт: ${esc(s.artifact||'—')}</div></div>`).join('')||empty('Спринты пока не добавлены')}

function projectSectionKey(pid,section,spid=''){return `${pid}:${spid?spid+':':''}${section}`}
function isProjectSectionCollapsed(pid,section,spid=''){return state.settings.collapsedProjectSections?.[projectSectionKey(pid,section,spid)]===true}
function projectSection(pid,section,title,content,actions='',spid=''){
  const key=projectSectionKey(pid,section,spid),collapsed=isProjectSectionCollapsed(pid,section,spid);
  return `<section class="project-inner-section ${collapsed?'inner-collapsed':''}" data-project-section="${key}">
    <header class="project-inner-header">
      <button class="project-inner-toggle" type="button" data-toggle-project-section="${key}" aria-expanded="${!collapsed}" aria-label="${collapsed?'Развернуть':'Свернуть'} раздел"><span>${collapsed?'›':'⌄'}</span></button>
      <h3>${esc(title)}</h3>
      <div class="actions">${actions}</div>
    </header>
    <div class="project-inner-content" ${collapsed?'hidden':''}>${content}</div>
  </section>`
}
function subprojectCard(p,sp){
  const info=`<div class="subproject-summary"><p>${esc(sp.goal||'')}</p><div class="item-meta">${fmt(sp.start)} — ${fmt(sp.end)} · ${esc(sp.owner||'Без ответственного')}</div><div class="item-meta">Артефакт: ${esc(sp.artifact||'—')}</div></div>`;
  const team=projectSection(p.id,'team','Команда подпроекта',`<div class="mini-stack">${memberCards(sp.team,p.id,sp.id)}</div>`,`<button class="btn ghost small" data-add-member="${p.id}" data-subproject="${sp.id}">+ Участник</button>`,sp.id);
  const sprints=projectSection(p.id,'sprints','Спринты подпроекта',`<div class="timeline">${sprintCards(sp.sprints,p.id,sp.id)}</div>`,`<button class="btn ghost small" data-add-sprint="${p.id}" data-subproject="${sp.id}">+ Спринт</button>`,sp.id);
  return `<article class="subcard subproject-card">
    <header class="subproject-header">
      <button class="project-inner-toggle" type="button" data-toggle-project-section="${projectSectionKey(p.id,'card',sp.id)}" aria-expanded="${!isProjectSectionCollapsed(p.id,'card',sp.id)}"><span>${isProjectSectionCollapsed(p.id,'card',sp.id)?'›':'⌄'}</span></button>
      <b>${esc(sp.name)}</b>
      <div class="actions"><button class="btn ghost small" data-edit-subproject="${sp.id}" data-project="${p.id}">Изменить</button><button class="btn danger small" data-delete-subproject="${sp.id}" data-project="${p.id}">Удалить</button></div>
    </header>
    <div class="subproject-body" ${isProjectSectionCollapsed(p.id,'card',sp.id)?'hidden':''}>${info}${team}${sprints}</div>
  </article>`
}

function orderedProjects(items=state.projects){
  const order=state.settings.projectOrder||[],rank=new Map(order.map((id,i)=>[id,i]));
  return [...items].sort((a,b)=>(rank.has(a.id)?rank.get(a.id):999999)-(rank.has(b.id)?rank.get(b.id):999999)||state.projects.indexOf(a)-state.projects.indexOf(b))
}
function saveProjectOrder(ids){
  state.settings.projectOrder=[...ids];
  persist('Порядок проектов сохранён')
}
function collapseWholeProject(pid){
  const list=new Set(state.settings.expandedProjects||[]);
  list.delete(pid);
  state.settings.expandedProjects=[...list];
  if(state.settings.focusProjectId===pid)state.settings.focusProjectId='';
}
function projectCards(items){
  const expanded=new Set(state.settings.expandedProjects||[]);
  const focusId=state.settings.focusProjectId||'';
  return items.map(p=>{
    const ts=state.tasks.filter(t=>t.projectId===p.id),pr=progress(ts),isOpen=expanded.has(p.id)||focusId===p.id;
    const teamContent=`<div class="subgrid">${projectTeamWithSubprojects(p).map(m=>`<div class="mini-card"><div class="toolbar"><b>${esc(m.name)}</b><span class="chip">${esc(m.source)}</span></div><div class="item-meta">${esc(m.role||'Роль не указана')} · ${esc(normalizedDepartment(m))}${m.contact?` · ${esc(m.contact)}`:''}</div>${m.note?`<p>${esc(m.note)}</p>`:''}</div>`).join('')||empty('Команда пока не добавлена')}</div>`;
    const subsContent=`<div class="subgrid">${(p.subprojects||[]).map(sp=>subprojectCard(p,sp)).join('')||empty()}</div>`;
    const sprintContent=`<div class="timeline">${sprintCards(p.sprints,p.id)}</div>`;
    return `<article class="card project-card ${isOpen?'expanded':'collapsed'} ${focusId===p.id?'focused-project':''}" style="margin-bottom:12px" data-project-card="${p.id}" draggable="true">
      <header class="project-summary">
        <button class="project-toggle" type="button" data-toggle-project="${p.id}" aria-expanded="${isOpen}" aria-label="${isOpen?'Свернуть':'Развернуть'} проект"><span class="project-chevron">${isOpen?'⌄':'›'}</span></button>
        <div class="project-summary-main">
          <div class="chips">${(p.areas||[]).map(a=>`<span class="chip">${esc(a)}</span>`).join('')}</div>
          <h2>${esc(p.name)}</h2>
          <div class="project-compact-meta"><span>${esc(p.status||'active')}</span><span>${fmt(p.start)} — ${fmt(p.end)}</span><span>${pr}%</span></div>
        </div>
        <div class="actions project-summary-actions">
          <span class="drag-handle" title="Перетащите проект" aria-hidden="true" data-project-drag-handle="${p.id}">⋮⋮</span>
          <button class="btn ghost small" type="button" data-collapse-project="${p.id}">Свернуть проект</button>
          <button class="btn ghost small" type="button" data-focus-project="${p.id}">${focusId===p.id?'Снять фокус':'Фокус'}</button>
          <button class="btn ghost small" type="button" data-edit-project="${p.id}">Изменить</button>
          <button class="btn danger small" type="button" data-delete-project="${p.id}">Удалить</button>
        </div>
      </header>
      <div class="project-details" ${isOpen?'':'hidden'}>
        ${p.goal?`<p class="project-goal">${esc(p.goal)}</p>`:''}
        <div class="project-meta"><span>Начало: ${fmt(p.start)}</span><span>Завершение: ${fmt(p.end)}</span><span>Статус: ${esc(p.status||'active')}</span><span>Мои роли: ${esc(p.roles||'—')}</span></div>
        ${bar(pr)}
        <div class="project-inner-controls"><button class="btn ghost small" data-collapse-project-inner="${p.id}">Свернуть блоки</button><button class="btn ghost small" data-expand-project-inner="${p.id}">Развернуть блоки</button></div>
        ${projectSection(p.id,'team',`Команда проекта (${projectTeamWithSubprojects(p).length})`,teamContent,`<button class="btn ghost small" data-add-member="${p.id}">+ Участник</button>`)}
        ${projectSection(p.id,'subprojects',`Подпроекты (${(p.subprojects||[]).length})`,subsContent,`<button class="btn ghost small" data-add-subproject="${p.id}">+ Подпроект</button>`)}
        ${projectSection(p.id,'sprints',`Спринты проекта (${(p.sprints||[]).length})`,sprintContent,`<button class="btn ghost small" data-add-sprint="${p.id}">+ Спринт</button>`)}
      </div>
    </article>`
  }).join('')||empty()
}
function currentBusinessProcess(){return (state.businessProcesses||[]).find(x=>x.key==='chislumiki-part2')||null}
function businessProcessTaskStatus(status){return status==='Готово'?'done':status==='В работе'?'doing':['На согласовании','Доработка'].includes(status)?'review':'planned'}
function businessProcessSourceStatus(status){return status==='doing'?'В работе':status==='review'?'На согласовании':status==='done'?'Готово':'Не начато'}
function businessStatusOptions(selected){return ['Не начато','В работе','На согласовании','Доработка','Готово'].map(x=>`<option ${x===selected?'selected':''}>${x}</option>`).join('')}
function businessProcessProgress(process){const ops=process?.operations||[];return ops.length?Math.round(ops.filter(x=>x.status==='Готово').length/ops.length*100):0}
function processSchedule(op){
  if(!op.start&&!op.end)return '<span class="process-no-date">Плановые даты не указаны в Excel</span>';
  const parts=[];
  if(op.start)parts.push(`<span><b>Начало</b>${fmt(op.start)}</span>`);
  if(op.end)parts.push(`<span><b>Окончание</b>${fmt(op.end)}</span>`);
  return `<span class="process-dates">${parts.join('')}</span>${op.duration?`<small>Норматив: ${esc(op.duration)}</small>`:''}`;
}
function processOperationsForPerson(name){const target=String(name||'').toLowerCase(),surname=target.split(/\s+/)[0];return (currentBusinessProcess()?.operations||[]).filter(op=>{const owner=String(op.responsible||'').toLowerCase();return owner===target||(surname.length>4&&owner.startsWith(surname))})}
function renderBusinessProcess(){
  const process=currentBusinessProcess();if(!process)return empty('Данные бизнес-процесса не загружены');
  const view=state.settings.businessProcessView||'overview',ops=process.operations||[],done=ops.filter(x=>x.status==='Готово').length,doing=ops.filter(x=>x.status==='В работе').length,review=ops.filter(x=>['На согласовании','Доработка'].includes(x.status)).length,risks=ops.filter(x=>x.risk).length;
  const labels={overview:'Обзор',operations:'Операции',roadmap:'Дорожные карты',raci:'RACI'},tabs=Object.keys(labels).map(id=>`<button class="btn ${view===id?'primary':'ghost'}" data-process-view="${id}">${labels[id]}</button>`).join('');
  let body='';
  if(view==='overview')body=`<div class="process-guide"><b>Как читать процесс</b><span>Этапы идут по порядку. В каждой карточке сначала показан ожидаемый результат, затем проверка качества и тот, кто принимает работу.</span></div><div class="process-stage-grid">${process.processMap.map(stage=>{const rows=ops.filter(x=>x.stage===stage.stage),progress=rows.length?Math.round(rows.filter(x=>x.status==='Готово').length/rows.length*100):0;return `<article class="card process-stage-card"><div class="process-stage-head"><span class="process-stage-number">${esc(stage.number)}</span><div><span class="process-stage-kicker">Этап ${esc(stage.number)}</span><h3>${esc(stage.stage)}</h3></div><span class="process-stage-progress">${progress}%</span></div><p class="process-stage-scope">${esc(stage.scope)}</p><dl class="process-stage-details"><div><dt>Результат</dt><dd>${esc(stage.result)}</dd></div><div><dt>Проверка качества</dt><dd>${esc(stage.gate)}</dd></div><div><dt>Принимает</dt><dd>${esc(stage.approver)}</dd></div></dl>${bar(progress)}<small class="process-stage-count">${rows.length} операций</small></article>`}).join('')}</div>`;
  if(view==='operations')body=`<div class="process-source-note"><b>Точное соответствие исходному Excel</b><span>Все 16 столбцов показаны отдельно и в том же порядке, что на листе «Ч.2_Реестр операций». Пустые ячейки обозначены знаком «—».</span></div><section class="card process-filters"><input id="processSearch" class="search-input" aria-label="Поиск операций" placeholder="Найти операцию, результат или сотрудника"><select id="processStageFilter" aria-label="Фильтр по этапу"><option value="">Все этапы</option>${process.processMap.map(x=>`<option value="${esc(x.stage)}">${esc(x.stage)}</option>`).join('')}</select><select id="processOwnerFilter" aria-label="Фильтр по ответственному"><option value="">Все ответственные</option>${[...new Set(ops.map(x=>x.responsible).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru')).map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select><select id="processStatusFilter" aria-label="Фильтр по статусу"><option value="">Все статусы</option>${['Не начато','В работе','На согласовании','Доработка','Готово'].map(x=>`<option>${x}</option>`).join('')}</select></section><div class="card process-table-wrap"><table class="process-table process-operations-table"><thead><tr><th>ID</th><th>Этап</th><th>Подпроцесс</th><th>Операция</th><th>Результат</th><th>Ответственный</th><th>Участники</th><th>Утверждает</th><th>Предшественник</th><th>План, начало</th><th>План, конец</th><th>Норматив, дн.</th><th>Статус</th><th>Версия / ссылка</th><th>Критерий готовности</th><th>Комментарий / риск</th></tr></thead><tbody>${ops.map(op=>`<tr class="process-operation-row" data-process-stage="${esc(op.stage)}" data-process-owner="${esc(op.responsible)}" data-process-status-row="${esc(op.status)}" data-process-search="${esc([op.code,op.stage,op.subprocess,op.operation,op.result,op.responsible,op.participants,op.approver,op.predecessor,op.versionLink,op.readiness,op.risk].join(' ').toLowerCase())}"><td data-label="ID"><b>${esc(op.code)}</b></td><td data-label="Этап">${esc(op.stage||'—')}</td><td data-label="Подпроцесс">${esc(op.subprocess||'—')}</td><td data-label="Операция"><strong>${esc(op.operation||'—')}</strong></td><td data-label="Результат">${esc(op.result||'—')}</td><td data-label="Ответственный"><b>${esc(op.responsible||'—')}</b></td><td data-label="Участники">${esc(op.participants||'—')}</td><td data-label="Утверждает">${esc(op.approver||'—')}</td><td data-label="Предшественник">${esc(op.predecessor||'—')}</td><td data-label="План, начало">${op.start?fmt(op.start):'—'}</td><td data-label="План, конец">${op.end?fmt(op.end):'—'}</td><td data-label="Норматив, дн.">${esc(op.duration||'—')}</td><td data-label="Статус"><select aria-label="Статус операции ${esc(op.code)}" data-process-status="${op.id}">${businessStatusOptions(op.status)}</select></td><td data-label="Версия / ссылка">${op.versionLink?`<a href="${esc(op.versionLink)}" target="_blank" rel="noopener">${esc(op.versionLink)}</a>`:'—'}</td><td data-label="Критерий готовности">${esc(op.readiness||'—')}</td><td data-label="Комментарий / риск">${esc(op.risk||'—')}</td></tr>`).join('')}</tbody></table></div>`;
  if(view==='roadmap')body=`<section class="card"><h2>Дорожная карта одного пособия</h2><div class="process-roadmap">${process.projectRoadmap.map(x=>`<article><span class="process-stage-number">${esc(x.number)}</span><div><b>${esc(x.stage)}</b><p>${esc(x.result)}</p><small>${fmt(x.start)} — ${fmt(x.end)} · ${esc(x.responsible)} · ${esc(x.status)}</small></div></article>`).join('')}</div></section><section class="card"><h2>Линейка пособий</h2><div class="process-portfolio">${process.portfolioRoadmap.map(x=>`<article><div><b>${esc(x.title)}</b><small>${esc(x.priority)} приоритет · ${fmt(x.start)} — ${fmt(x.end)}</small></div><span class="chip">${esc(x.status)}</span></article>`).join('')}</div></section>`;
  if(view==='raci')body=`<section class="card process-table-wrap"><table class="process-table raci-table"><thead><tr><th>Этап / результат</th>${process.raciPeople.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${process.raci.map(row=>`<tr><td><b>${esc(row.stage)}</b><small>${esc(row.result)}</small></td>${process.raciPeople.map(person=>`<td class="raci-${String(row.roles[person]||'').toLowerCase()}">${esc(row.roles[person]||'—')}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="muted">R — выполняет; A — принимает результат; C — консультирует; I — получает информацию.</p></section>`;
  return `<div class="hero process-hero"><div><p class="eyebrow">Проект «Числумики»</p><h2>Процесс создания пособия</h2><p>От идеи до готового продукта: 6 этапов и ${ops.length} операций.</p></div><small>Статусы автоматически обновляются в задачах и у ответственных сотрудников.</small></div><div class="grid cols-4 process-metrics"><div class="card metric"><span>Операций</span><strong>${ops.length}</strong></div><div class="card metric"><span>Готово</span><strong>${done}</strong></div><div class="card metric"><span>В процессе</span><strong>${doing+review}</strong></div><div class="card metric"><span>Общий прогресс</span><strong>${businessProcessProgress(process)}%</strong></div></div><div class="toolbar process-tabs"><div class="actions" role="tablist" aria-label="Представление процесса">${tabs}</div><div class="actions"><span class="chip">${risks} замечаний</span><button class="btn ghost" data-open-process-project>Открыть проект</button></div></div>${body}`
}
function renderTasks(){syncLinkedTasks();const view=state.settings.taskView||'list';const projects=[...state.projects].sort((a,b)=>a.name.localeCompare(b.name,'ru'));return `<div class="task-workspace"><div class="toolbar"><div class="actions"><button class="btn primary" data-add-task>+ Новая задача</button><button class="btn ${view==='list'?'primary':'ghost'}" data-task-view="list">Список</button><button class="btn ${view==='kanban'?'primary':'ghost'}" data-task-view="kanban">Kanban</button></div><span class="muted">Задачи, поручения, спринты и совещания</span></div><section class="card task-filters"><input class="search-input" id="taskSearch" placeholder="Поиск по задачам"><select id="taskStatus"><option value="">Все статусы</option><option value="overdue">Просрочено</option><option value="today">Сегодня</option><option value="week">На 7 дней</option><option value="undated">Без даты</option><option value="done">Выполнено</option></select><select id="taskProject"><option value="">Все проекты</option>${projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><select id="taskSource"><option value="">Все источники</option><option value="manual">Обычные задачи</option><option value="assignment">Поручения</option><option value="meeting">Совещания</option><option value="sprint">Спринты</option></select></section><div id="taskResults">${view==='kanban'?renderKanbanBody(state.tasks):renderTaskGroups(state.tasks)}</div></div>`}
function renderTaskGroups(items){const groups=[['Просрочено',items.filter(t=>!t.done&&t.date&&t.date<todayIso())],['Сегодня',items.filter(t=>!t.done&&t.date===todayIso())],['Позже',items.filter(t=>!t.done&&t.date>todayIso())],['Без даты',items.filter(t=>!t.done&&!t.date)],['Выполнено',items.filter(t=>t.done)]];return groups.filter(([,rows])=>rows.length).map(([name,rows])=>`<section class="task-group"><h2>${name} <span class="chip">${rows.length}</span></h2><div class="list">${rows.map(taskRow).join('')}</div></section>`).join('')||empty('Задач по выбранным условиям нет')}
function renderKanbanBody(tasks){const cols=[['planned','Запланировано'],['doing','В работе'],['review','На проверке'],['done','Выполнено']];return `<div class="kanban">${cols.map(([s,n])=>{const items=tasks.filter(t=>(t.done?'done':t.status||'planned')===s);return `<section class="kanban-col" data-drop="${s}"><div class="kanban-col-head"><h3>${n}</h3><span class="chip">${items.length}</span></div>${items.map(t=>`<article class="kanban-card ${t.done?'done':''}" draggable="true" data-drag-task="${t.id}" tabindex="0"><div class="kanban-card-title">${esc(t.title)}</div><div class="item-meta">${esc(project(t.projectId)?.name||'Без проекта')} · ${fmt(t.date)}</div><div class="actions kanban-actions">${t.generatedLinked?'':`<button class="btn ghost small" data-edit-task="${t.id}">Редактировать</button>`}<button class="btn ${t.done?'ghost':'primary'} small" data-toggle-task="${t.id}">${t.done?'Вернуть':'Готово'}</button></div></article>`).join('')||empty('В этой колонке пока нет задач')}</section>`}).join('')}</div>`}
function renderKanban(){const cols=[['planned','Запланировано'],['doing','В работе'],['review','На проверке'],['done','Выполнено']];return `<div class="toolbar"><span class="muted">Перетаскивайте карточки между колонками или используйте кнопки на карточке.</span><button class="btn primary" data-add-task>+ Новая задача</button></div><div class="kanban">${cols.map(([s,n])=>{const items=state.tasks.filter(t=>(t.done?'done':t.status||'planned')===s);return `<section class="kanban-col" data-drop="${s}"><div class="kanban-col-head"><h3>${n}</h3><span class="chip">${items.length}</span></div>${items.map(t=>`<article class="kanban-card ${t.done?'done':''}" draggable="true" data-drag-task="${t.id}" tabindex="0"><div class="kanban-card-title">${esc(t.title)} ${t.linkedSourceType?`<span class="chip">${esc(linkedTaskSourceLabel(t))}</span>`:''}</div><div class="item-meta">${esc(project(t.projectId)?.name||'Без проекта')}</div><div class="item-meta">${fmt(t.date)}${t.start?' · '+esc(t.start):''}</div>${t.result?`<div class="kanban-result">${esc(t.result)}</div>`:''}<div class="actions kanban-actions">${t.generatedLinked?'':`<button class="btn ghost small" type="button" data-edit-task="${t.id}">Редактировать</button>`}<button class="btn ${t.done?'ghost':'primary'} small" type="button" data-toggle-task="${t.id}">${t.done?'Вернуть':'Готово'}</button>${t.generatedLinked?'':`<button class="btn danger small" type="button" data-delete-task="${t.id}">Удалить</button>`}</div></article>`).join('')||empty('В этой колонке пока нет задач')}</section>`}).join('')}</div>`}
function renderTeam(){
  syncMeetingAssignments();
  const people=teamRegistry();
  return `<div class="hero"><p class="eyebrow">Единый реестр</p><h2>Команда всех проектов</h2><p>Участники проектов и подпроектов объединяются автоматически. Для каждого человека показаны роли, проекты, источник участия и текущие статусы.</p></div>
  <div class="toolbar"><button class="btn primary" data-add-assignment>+ Поручение</button><span class="muted">Участников добавляйте в карточках проектов и подпроектов</span></div>
  <div class="team-registry">${people.map(person=>`<article class="card team-person-card"><div class="toolbar"><div><h2>${esc(person.name)}</h2><div class="item-meta">${esc([...person.roles].join(', ')||'Роль не указана')} · ${esc(person.department||'Другое подразделение')}${person.contact?` · ${esc(person.contact)}`:''}</div></div><div class="chips">${[...person.statuses].map(st=>`<span class="chip">${esc(st)}</span>`).join('')}</div></div>
  <div class="team-project-list">${person.projects.map(r=>`<div class="team-project-row"><div><b>${esc(r.project)}</b><div class="item-meta">${esc(r.source)} · ${esc(r.role)}</div></div><span class="chip">${esc(r.status)}</span></div>`).join('')}</div>
  <div class="section-title compact"><h3>Поручения</h3></div><div class="list">${state.assignments.filter(a=>(a.assigneeId&&person.memberIds?.has(a.assigneeId))||String(a.assignee||'').toLowerCase()===person.name.toLowerCase()).map(a=>`<div class="list-row ${a.status==='done'?'done':''}"><div><b>${esc(a.title)}</b><div class="item-meta">${esc(project(a.projectId)?.name||'Без проекта')} · ${fmt(a.deadline)} · ${esc(a.status)} ${a.generatedFromMeeting?'· Совещание':''}</div>${a.generatedFromMeeting?`<div class="item-meta">Источник: ${esc(state.meetings.find(m=>m.id===a.sourceMeetingId)?.title||'Совещание')}</div>`:''}</div><div class="actions">${a.generatedFromMeeting?`<button class="btn ghost small" data-open-source-meeting="${a.sourceMeetingId}">Открыть совещание</button>`:`<button class="btn ghost small" data-edit-assignment="${a.id}">Изменить</button><button class="btn danger small" data-delete-assignment="${a.id}">Удалить</button>`}</div></div>`).join('')||empty('Поручений нет')}</div></article>`).join('')||empty('Добавьте участников в проекты или подпроекты')}</div>`
}
function renderResources(){
  const people=teamRegistry();
  return `<div class="hero"><p class="eyebrow">Ресурсная карта</p><h2>Загрузка участников</h2><p>Проекты, подпроекты и поручения каждого участника.</p></div><div class="grid cols-2">${people.map(person=>`<section class="card"><h2>${esc(person.name)}</h2><div class="item-meta">${person.projects.length} участий · ${state.assignments.filter(a=>String(a.assignee||'').toLowerCase()===person.name.toLowerCase()&&a.status!=='done').length} открытых поручений</div><div class="list">${person.projects.map(r=>`<div class="list-row"><div><b>${esc(r.project)}</b><div class="item-meta">${esc(r.source)} · ${esc(r.role)} · ${esc(r.status)}</div></div></div>`).join('')}</div></section>`).join('')||empty('Команда ещё не заполнена')}</div>`
}
function renderHistory(){return `<div class="toolbar"><span class="muted">Последние ${state.history.length} изменений</span><button class="btn ghost" id="clearHistory">Очистить историю</button></div><div class="timeline">${state.history.map(h=>`<div class="timeline-item"><b>${esc(h.title)}</b><div class="item-meta">${new Date(h.at).toLocaleString('ru-RU')} · ${esc(project(h.projectId)?.name||h.type)}</div></div>`).join('')||empty()}</div>`}

function renderMeetings(){syncMeetingAssignments();return `<div class="toolbar"><button class="btn primary" data-add-meeting>+ Совещание</button><span class="muted">После сохранения можно проверить и распределить задачи по команде</span></div>${state.meetings.map(m=>`<article class="card" style="margin-bottom:14px"><div class="toolbar"><div><h2>${esc(m.title)}</h2><div class="item-meta">${fmt(m.date)} ${esc(m.time||'')} · ${esc(m.participants||'')}</div></div><div class="actions"><button class="btn primary small" data-review-meeting-tasks="${m.id}">Распознать задачи</button><button class="btn ghost small" data-edit-meeting="${m.id}">Изменить</button><button class="btn ghost small" data-protocol="${m.id}">Протокол</button><button class="btn danger small" data-delete-meeting="${m.id}">Удалить</button></div></div><p><b>Проекты:</b> ${(m.projectIds||[]).map(id=>esc(project(id)?.name||'')).join(', ')||'—'}</p><p><b>Вопросы:</b><br>${esc(m.agenda||'—')}</p><p><b>Решения:</b><br>${esc(m.decisions||'—')}</p>
  <div class="meeting-actions-preview"><b>Задания участникам:</b>${meetingActionRows(m).map(row=>`<div class="meeting-action-row"><div><strong>${esc(row.assignee)}</strong><span>${esc(row.title)}</span><small>${fmt(row.deadline)} · ${esc(project(row.projectId)?.name||'Без проекта')}</small></div><span class="chip">${(m.completedActionItems||[]).includes(row.index)?'Выполнено':'Назначено'}</span></div>`).join('')||'<p>—</p>'}</div>
  <p><b>Заметки:</b><br>${esc(m.notes||'—')}</p></article>`).join('')||empty()}`}

function reportTypeLabel(type){return type==='plan'?'План':'Отчёт'}
function reportDefaultTitle(type,period){return `${reportTypeLabel(type).toUpperCase()} ДОШКОЛЬНОГО ОТДЕЛА ${period?`ЗА ${period}`:''}`.trim()}
function reportRowsByEmployee(doc){
  const groups=new Map();
  (doc.rows||[]).forEach(row=>{const employee=row.employee||'Без сотрудника';if(!groups.has(employee))groups.set(employee,[]);groups.get(employee).push(row)});
  return [...groups.entries()]
}
function reportTable(doc){
  const isPlan=doc.type==='plan';
  const groups=reportRowsByEmployee(doc);
  if(!groups.length)return empty('Добавьте строки вручную или соберите их из задач приложения.');
  return groups.map(([employee,rows],employeeIndex)=>`<section class="report-employee"><h3>${employeeIndex+1}. ${esc(employee)}</h3><div class="report-table-wrap"><table class="report-table"><thead><tr><th>Проект</th><th>Вид деятельности</th><th>План (начало месяца)</th><th>Результат (конец месяца)</th><th>Время</th><th></th></tr></thead><tbody>${rows.map(row=>`<tr><td>${esc(row.project||'')}</td><td>${esc(row.activity||'')}</td><td>${esc(row.plan||'')}</td><td>${esc(isPlan?'':(row.result||''))}</td><td>${esc(row.time||'')}</td><td class="report-row-actions"><button class="btn ghost small" data-edit-report-row="${row.id}" data-report-id="${doc.id}">Изменить</button><button class="btn danger small" data-delete-report-row="${row.id}" data-report-id="${doc.id}">Удалить</button></td></tr>`).join('')}</tbody></table></div></section>`).join('')
}
function renderReports(){cleanPreschoolReportRows();
  const selected=state.reports[0];
  return `<div class="hero"><p class="eyebrow">Документы отдела</p><h2>Отчёты и планы</h2><p>В отчёты дошкольного отдела входят только Абдуллина, Королева и Исса. Структура: сотрудник → проект → вид деятельности → план → результат → время.</p></div>
  <section class="card report-command-center">
    <h3>Действия с документами</h3>
    <div class="report-command-grid">
      <button class="btn primary" data-create-report-template="report">Создать отчёт по шаблону</button>
      <button class="btn primary" data-create-report-template="plan">Создать план по шаблону</button>
      <button class="btn accent" data-collect-current-report ${selected?'':'disabled'}>Собрать данные в текущий документ</button>
      <button class="btn ghost" data-export-current-report ${selected?'':'disabled'}>Скачать текущий документ Word</button>
    </div>
    <p class="hint">${selected?`Текущий документ: ${esc(selected.title)}`:'Сначала создайте отчёт или план.'}</p>
    <div class="report-source-list"><span>Источники автоматической сборки:</span><span class="chip">Задачи</span><span class="chip">Поручения</span><span class="chip">Совещания</span><span class="chip">Проекты</span><span class="chip">Спринты</span><span class="chip">Рефлексия</span></div>
  </section>
  <div class="toolbar"><div class="actions"><button class="btn primary" data-add-report="report">+ Пустой отчёт</button><button class="btn primary" data-add-report="plan">+ Пустой план</button></div><span class="muted">Документы ниже можно редактировать построчно</span></div>
  <div class="reports-list">${state.reports.map(doc=>`<article class="card report-card">
    <div class="toolbar report-card-header"><div><span class="chip">${reportTypeLabel(doc.type)}</span><h2>${esc(doc.title)}</h2><div class="item-meta">${esc(doc.department)} · ${esc(doc.period||'Период не указан')}</div></div>
    <div class="actions report-actions"><button class="btn ghost small" data-edit-report="${doc.id}">Настройки</button><button class="btn ghost small" data-add-report-row="${doc.id}">+ Строка</button><button class="btn primary small" data-collect-report="${doc.id}">Собрать данные</button><button class="btn primary small" data-export-report="${doc.id}">Word</button><button class="btn danger small" data-delete-report="${doc.id}">Удалить</button></div></div>
    ${reportTable(doc)}
  </article>`).join('')||empty('Пока нет отчётов и планов')}</div>`
}
function createReportFromTemplate(type){
  const isPlan=type==='plan';
  const title=isPlan?'ПЛАН ДОШКОЛЬНОГО ОТДЕЛА НА НОВЫЙ ПЕРИОД':'ОТЧЁТ ДОШКОЛЬНОГО ОТДЕЛА ЗА НОВЫЙ ПЕРИОД';
  const rows=preschoolEmployees().map(person=>({id:uid(),employee:person.name,project:'',activity:'',plan:'',result:'',time:''}));
  const doc={id:uid(),type:isPlan?'plan':'report',title,department:'Дошкольный отдел',period:'Новый период',rows,createdAt:nowStamp(),updatedAt:nowStamp()};
  state.reports.unshift(doc);persist('Документ создан по шаблону');render()
}
function openReport(doc=null,type='report'){
  const fields=[
    {name:'type',label:'Тип документа',type:'select',options:[['report','Отчёт'],['plan','План']]},
    {name:'period',label:'Период',required:true,placeholder:'Например: июнь 2026 года',full:true},
    {name:'department',label:'Отдел',required:true,full:true},
    {name:'title',label:'Заголовок',full:true,placeholder:'Можно оставить пустым — заголовок сформируется автоматически'}
  ];
  modal(doc?'Настройки документа':'Новый документ',fields,o=>{
    const title=o.title||reportDefaultTitle(o.type,o.period);
    if(doc)Object.assign(doc,{...o,title});
    else state.reports.unshift({id:uid(),...o,title,rows:[],createdAt:nowStamp(),updatedAt:nowStamp()});
    persist('Документ сохранён')
  },doc?{...doc}:{type,period:'',department:'Дошкольный отдел',title:''})
}
function openReportRow(doc,row=null){
  const fields=[
    {name:'employee',label:'Сотрудник дошкольного отдела',required:true,full:true,type:'select',options:preschoolEmployees().map(p=>[p.name,p.name])},
    {name:'project',label:'Проект',required:true,full:true},
    {name:'activity',label:'Вид деятельности',type:'textarea',full:true},
    {name:'plan',label:'План (начало месяца)',type:'textarea',full:true},
    {name:'result',label:'Результат (конец месяца)',type:'textarea',full:true,hint:doc.type==='plan'?'Для плана поле можно оставить пустым.':''},
    {name:'time',label:'Время',placeholder:'Например: 15%'}
  ];
  modal(row?'Изменить строку':'Добавить строку',fields,o=>{
    if(row)Object.assign(row,o);
    else doc.rows.push({id:uid(),...o});
    doc.updatedAt=nowStamp();persist('Строка сохранена')
  },row||{employee:'',project:'',activity:'',plan:'',result:'',time:''})
}
function collectReportData(doc){
  const fields=[
    {name:'employee',label:'Сотрудник дошкольного отдела',required:true,full:true,type:'select',options:preschoolEmployees().map(p=>[p.name,p.name])},
    {name:'period',label:'Месяц',required:true,full:true,placeholder:'2026-08'},
    {name:'sources',label:'Источники данных',type:'multi',full:true,options:[['tasks','Задачи'],['assignments','Поручения'],['meetings','Совещания'],['projects','Проекты и спринты'],['reflections','Рефлексия']]},
    {name:'replace',label:'Режим сборки',type:'select',options:[['append','Добавить к существующим строкам'],['replace','Заменить строки этого сотрудника']]}
  ];
  modal('Собрать единый документ',fields,o=>{
    const period=o.period.trim(),employee=o.employee.trim(),sources=o.sources.length?o.sources:['tasks','assignments','meetings','projects'];
    if(!/^\d{4}-\d{2}$/.test(period))throw new Error('Неверный формат месяца');
    if(o.replace==='replace')doc.rows=doc.rows.filter(r=>String(r.employee||'').toLowerCase()!==employee.toLowerCase());
    const bucket=new Map();
    const add=(projectName,activity,plan,result,minutes=0)=>{
      const key=projectName||'Другое';
      if(!bucket.has(key))bucket.set(key,{project:key,activities:new Set(),plans:[],results:[],minutes:0});
      const b=bucket.get(key);
      if(activity)b.activities.add(activity);
      if(plan)b.plans.push(plan);
      if(result)b.results.push(result);
      b.minutes+=Number(minutes)||0
    };
    if(sources.includes('tasks')){
      state.tasks.filter(t=>String(t.date||'').startsWith(period)).forEach(t=>{
        add(project(t.projectId)?.name||'Другое',t.method||t.role||'Работа по проекту',t.title,(doc.type==='report'&&(t.done||t.status==='done'))?(t.result||t.title):'',t.duration)
      })
    }
    if(sources.includes('assignments')){
      state.assignments.filter(a=>String(a.deadline||'').startsWith(period)&&(String(a.assignee||'').toLowerCase()===employee.toLowerCase()||employee.toLowerCase()==='я')).forEach(a=>{
        add(project(a.projectId)?.name||'Другое','Поручение / техническое задание',a.title,(doc.type==='report'&&a.status==='done')?(a.criteria||a.title):'',60)
      })
    }
    if(sources.includes('meetings')){
      state.meetings.filter(m=>String(m.date||'').startsWith(period)&&(!m.participants||m.participants.toLowerCase().includes(employee.toLowerCase())||employee.toLowerCase()==='я')).forEach(m=>{
        const ids=m.projectIds?.length?m.projectIds:[''];
        ids.forEach(id=>add(project(id)?.name||'Совещания отдела','Совещание',m.agenda||m.title,doc.type==='report'?(m.decisions||m.notes||''):'',60))
      })
    }
    if(sources.includes('projects')){
      state.projects.forEach(p=>{
        const active=(p.start||'').slice(0,7)<=period&&(!(p.end)||(p.end||'').slice(0,7)>=period);
        if(!active)return;
        add(p.name,'Управление проектом',p.goal||p.meaning,doc.type==='report'?(p.status==='done'?'Проект завершён':'Работа продолжается'):'',0);
        (p.sprints||[]).filter(sp=>String(sp.start||'').startsWith(period)||String(sp.end||'').startsWith(period)).forEach(sp=>{
          add(p.name,'Спринт',sp.goal||sp.name,doc.type==='report'?(sp.artifact||''):'',0)
        });
        (p.subprojects||[]).forEach(sub=>{
          (sub.sprints||[]).filter(sp=>String(sp.start||'').startsWith(period)||String(sp.end||'').startsWith(period)).forEach(sp=>{
            add(p.name,`Подпроект: ${sub.name}`,sp.goal||sp.name,doc.type==='report'?(sp.artifact||''):'',0)
          })
        })
      })
    }
    if(sources.includes('reflections')){
      state.reflections.filter(r=>String(r.date||'').startsWith(period)).forEach(r=>{
        add('Другое','Рефлексия',r.next||r.meaning||'',doc.type==='report'?(r.results||r.wins||''):'',0)
      })
    }
    const total=[...bucket.values()].reduce((sum,b)=>sum+b.minutes,0);
    bucket.forEach(b=>{
      doc.rows.push({
        id:uid(),employee,project:b.project,
        activity:[...b.activities].join('\n'),
        plan:b.plans.filter(Boolean).join('\n'),
        result:doc.type==='report'?b.results.filter(Boolean).join('\n'):'',
        time:total&&b.minutes?`${Math.round(b.minutes/total*100)}%`:''
      })
    });
    doc.updatedAt=nowStamp();
    persist(`Собрано строк: ${bucket.size}`)
  },{employee:preschoolEmployees()[0]?.name||'Абдуллина Л.Э.',period:'2026-08',sources:['tasks','assignments','meetings','projects'],replace:'append'})
}
function wordEscape(v){return esc(String(v||'')).replace(/\n/g,'<br>')}
function reportWordHtml(doc){
  const groups=reportRowsByEmployee(doc);
  return `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4 landscape;margin:1.2cm}body{font-family:"Times New Roman",serif;font-size:11pt;color:#000}h1{text-align:center;font-size:15pt;text-transform:uppercase;margin:0 0 18px}h2{font-size:12pt;margin:18px 0 8px}table{width:100%;border-collapse:collapse;table-layout:fixed;margin-bottom:16px}th,td{border:1px solid #000;padding:6px;vertical-align:top;white-space:pre-wrap;word-wrap:break-word}th{text-align:center;font-weight:bold}.c1{width:16%}.c2{width:20%}.c3{width:27%}.c4{width:27%}.c5{width:10%;text-align:center}</style></head><body><h1>${wordEscape(doc.title)}</h1>${groups.map(([employee,rows],i)=>`<h2>${i+1}. ${wordEscape(employee)}</h2><table><thead><tr><th class="c1">Проект</th><th class="c2">Вид деятельности</th><th class="c3">План (начало месяца)</th><th class="c4">Результат (конец месяца)</th><th class="c5">Время</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${wordEscape(r.project)}</td><td>${wordEscape(r.activity)}</td><td>${wordEscape(r.plan)}</td><td>${wordEscape(doc.type==='plan'?'':r.result)}</td><td class="c5">${wordEscape(r.time)}</td></tr>`).join('')}</tbody></table>`).join('')}</body></html>`
}
function exportReportWord(doc){
  const blob=new Blob(['\ufeff',reportWordHtml(doc)],{type:'application/msword;charset=utf-8'});
  const safe=(doc.title||'document').replace(/[\\/:*?"<>|]+/g,'_');
  download(blob,`${safe}.doc`)
}
function renderCalendar(){return `<div class="hero"><p class="eyebrow">Google Calendar</p><h2>Безопасный обмен календарём</h2><p>В локальной версии доступны экспорт и импорт ICS, а также добавление отдельного события.</p></div><div class="grid cols-2"><section class="card"><h3>Из приложения</h3><button class="btn primary" id="exportIcs">Скачать .ics</button> <button class="btn ghost" id="openGoogle">Открыть Google Calendar</button></section><section class="card"><h3>В приложение</h3><label class="btn primary file-btn">Импортировать .ics<input id="icsInput" type="file" accept=".ics,text/calendar" hidden></label></section></div><section class="card" style="margin-top:18px"><h3>Будущие задачи</h3><div class="list">${state.tasks.filter(t=>!t.done&&t.date>=todayIso()).map(t=>`<div class="list-row"><div><b>${esc(t.title)}</b><div class="item-meta">${fmt(t.date)} ${esc(t.start||'')}</div></div><button class="btn ghost small" data-google-one="${t.id}">Добавить в Google</button></div>`).join('')||empty()}</div></section>`}
function renderHealth(){const done=h=>(h.doneDates||[]).includes(todayIso());return `<div class="toolbar"><button class="btn primary" data-add-health>+ Привычка</button><span class="muted">Привычки с расписанием автоматически появляются в плане дня</span></div><div class="health-grid">${state.health.map(h=>`<article class="card habit"><div class="habit-icon">${esc(h.icon||'❤')}</div><div style="flex:1"><div class="toolbar"><h3>${esc(h.title)}</h3><div class="actions"><button class="btn ghost small" data-edit-health="${h.id}">Настроить</button><button class="btn danger small" data-delete-health="${h.id}">Удалить</button></div></div><div class="item-meta">Pomodoro: ${esc(({after_focus:'после каждого Pomodoro',every_2:'после 2 Pomodoro',every_4:'после 4 Pomodoro',break_start:'в начале перерыва',manual:'без Pomodoro'})[h.trigger]||'без Pomodoro')}</div>${h.scheduleEnabled?`<div class="item-meta">По времени: <b>${esc(h.scheduleTime)}</b> · ${Number(h.scheduleDuration)||15} мин · ${(h.scheduleDays||[]).map(d=>DAY_LABELS[d]).join(', ')}</div>`:`<div class="item-meta">По времени: выключено</div>`}<button class="btn ${done(h)?'ghost':'primary'} small" data-toggle-health="${h.id}" style="margin-top:12px">${done(h)?'✓ Выполнено':'Отметить сегодня'}</button></div></article>`).join('')}</div>`}
const lifeCfg={family:[['husband','Любимый муж'],['daughter','Любимая доченька'],['mother','Мамочка']],education:[['philosophy','Философия / МГУ'],['books','Книги'],['webinars','Вебинары'],['courses','Курсы']]};
function renderLife(type){return `<div class="hero"><p class="eyebrow">${type==='family'?'Близкие':'Развитие'}</p><h2>${type==='family'?'Семья':'Образование'}</h2><p>${type==='family'?'Заметки, планы и важные моменты':'Книги, курсы, вебинары и обучение'}</p></div><div class="life-grid">${lifeCfg[type].map(([key,n])=>`<section class="card"><div class="toolbar"><h3>${n}</h3><button class="btn primary small" data-add-life="${type}" data-life-key="${key}">+ Запись</button></div><div class="list">${(state[type][key]||[]).map(x=>`<div class="list-row ${x.done?'done':''}"><div><b>${esc(x.title)}</b><div class="item-meta">${fmt(x.date)} · ${esc(x.note||'')}</div></div><div class="actions"><button class="btn ghost small" data-edit-life="${x.id}" data-life-type="${type}" data-life-key="${key}">Изменить</button><button class="btn danger small" data-delete-life="${x.id}" data-life-type="${type}" data-life-key="${key}">Удалить</button></div></div>`).join('')||empty()}</div></section>`).join('')}</div>`}
const renderFamily=()=>renderLife('family'), renderEducation=()=>renderLife('education');
function renderLeisure(){return simpleCollection('leisure','Досуг','+ Добавить',true)}
function renderNotes(){return simpleCollection('notes','Заметки','+ Заметка',true)}
function renderLibrary(){return simpleCollection('library','Библиотека артефактов','+ Материал',true)}
function simpleCollection(key,title,button){return `<div class="toolbar"><button class="btn primary" data-add-simple="${key}">${button}</button></div><div class="grid cols-2">${state[key].map(x=>`<article class="card"><div class="toolbar"><h3>${esc(x.title)}</h3><div class="actions"><button class="btn ghost small" data-edit-simple="${x.id}" data-simple-key="${key}">Изменить</button><button class="btn danger small" data-delete-simple="${x.id}" data-simple-key="${key}">Удалить</button></div></div><p>${esc(x.note||x.content||'')}</p><div class="item-meta">${fmt(x.date)} · ${esc((x.tags||[]).join(', '))}</div>${x.url?`<a href="${esc(x.url)}" target="_blank" rel="noopener">Открыть ссылку</a>`:''}</article>`).join('')||empty()}</div>`}
function renderReflection(){return `<div class="toolbar"><button class="btn primary" data-add-reflection>+ Рефлексия</button></div><div class="grid cols-2">${state.reflections.map(r=>`<article class="card"><div class="toolbar"><h3>${esc(r.type||'Рефлексия')}</h3><div class="actions"><button class="btn ghost small" data-edit-reflection="${r.id}">Изменить</button><button class="btn danger small" data-delete-reflection="${r.id}">Удалить</button></div></div><div class="item-meta">${fmt(r.date)}</div><p><b>Результаты:</b> ${esc(r.results||'')}</p><p><b>Смыслы:</b> ${esc(r.meaning||'')}</p><p><b>Следующий шаг:</b> ${esc(r.next||'')}</p></article>`).join('')||empty()}</div>`}
let pomo={mode:'focus',left:state.pomodoro.focus*60,running:false,timer:null};
function renderPomodoro(){return `<section class="card pomo"><p class="eyebrow">${pomo.mode==='focus'?'Фокус':'Перерыв'}</p><h2>${pomo.mode==='focus'?'Pomodoro':'Время восстановиться'}</h2><div class="timer" id="timerText">${String(Math.floor(pomo.left/60)).padStart(2,'0')}:${String(pomo.left%60).padStart(2,'0')}</div><div class="actions" style="justify-content:center"><button class="btn primary" id="pomoStart">${pomo.running?'Пауза':'Старт'}</button><button class="btn ghost" id="pomoReset">Сбросить</button><button class="btn ghost" id="pomoTestSignal">Проверить сигнал</button></div><p class="muted">Завершено фокус-сессий: ${state.pomodoro.sessions}</p><p class="hint">По завершении всегда появляется крупное визуальное окно.</p></section>`}

function boardSnapshot(b){
  return JSON.stringify({
    stickies:b.stickies||[],
    paths:b.paths||[],
    shapes:b.shapes||[],
    brushColor:b.brushColor,
    brushWidth:b.brushWidth
  })
}
function pushBoardUndo(b){
  b.undoStack=Array.isArray(b.undoStack)?b.undoStack:[];
  const snap=boardSnapshot(b);
  if(b.undoStack[b.undoStack.length-1]!==snap)b.undoStack.push(snap);
  if(b.undoStack.length>30)b.undoStack.shift()
}
function undoBoard(b){
  if(!b.undoStack?.length){toast('Нет действий для отмены');return}
  const snap=JSON.parse(b.undoStack.pop());
  b.stickies=snap.stickies||[];b.paths=snap.paths||[];b.shapes=snap.shapes||[];
  b.brushColor=snap.brushColor||'#374151';b.brushWidth=Number(snap.brushWidth)||3;
  persist('Последнее действие отменено');render()
}
function shapeSvg(shape){
  const x=Number(shape.x)||100,y=Number(shape.y)||100,w=Number(shape.w)||160,h=Number(shape.h)||100;
  const color=esc(shape.color||'#3b82f6'),fill=esc(shape.fill||'rgba(59,130,246,.10)'),sw=Number(shape.width)||3;
  if(shape.type==='circle')return `<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>`;
  if(shape.type==='triangle')return `<polygon points="${x+w/2},${y} ${x+w},${y+h} ${x},${y+h}" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if(shape.type==='line')return `<line x1="${x}" y1="${y}" x2="${x+w}" y2="${y+h}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  if(shape.type==='arrow')return `<defs><marker id="arrow-${shape.id}" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="${color}"/></marker></defs><line x1="${x}" y1="${y}" x2="${x+w}" y2="${y+h}" stroke="${color}" stroke-width="${sw}" marker-end="url(#arrow-${shape.id})"/>`;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${color}" stroke-width="${sw}"/>`
}
function renderBoard(){
  const b=state.boards.find(x=>x.id===activeBoard)||state.boards[0];
  if(!b)return empty();
  b.paths=b.paths||[];b.shapes=b.shapes||[];b.undoStack=b.undoStack||[];
  b.brushColor=b.brushColor||'#374151';b.brushWidth=Number(b.brushWidth)||3;b.tool=b.tool||'move';
  b.width=Math.max(1200,Number(b.width)||1800);b.height=Math.max(620,Number(b.height)||1000);
  const colors=['#111827','#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'];
  return `<div class="toolbar board-toolbar">
    <select id="boardSelect">${state.boards.map(x=>`<option value="${x.id}" ${x.id===b.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
    <div class="actions board-tools">
      <button class="btn primary" id="addSticky">+ Стикер</button>
      <button class="btn ghost" id="undoBoard" ${b.undoStack.length?'':'disabled'}>↶ Отменить</button>
      <button class="btn ghost ${b.tool==='move'?'active-tool':''}" id="moveMode">✥ Перемещение</button>
      <button class="btn ghost ${b.tool==='draw'?'active-tool':''}" id="drawMode">✎ Кисть</button>
      <button class="btn ghost ${b.tool==='erase'?'active-tool':''}" id="eraseMode">⌫ Ластик</button>
      <label class="board-control">Фигура <select id="shapeType"><option value="">Выберите</option><option value="rectangle">Прямоугольник</option><option value="circle">Круг / овал</option><option value="triangle">Треугольник</option><option value="line">Линия</option><option value="arrow">Стрелка</option></select></label>
      <button class="btn ghost" id="addShape">+ Вставить фигуру</button>
      <label class="board-control">Толщина <select id="brushWidth"><option value="2" ${b.brushWidth===2?'selected':''}>Тонкая</option><option value="4" ${b.brushWidth===4?'selected':''}>Средняя</option><option value="7" ${b.brushWidth===7?'selected':''}>Толстая</option><option value="12" ${b.brushWidth===12?'selected':''}>Маркер</option></select></label>
      <div class="color-palette" aria-label="Цвет">${colors.map(color=>`<button type="button" class="color-swatch ${b.brushColor===color?'selected':''}" data-brush-color="${color}" style="--swatch:${color}" aria-label="Выбрать цвет ${color}"></button>`).join('')}</div>
      <button class="btn ghost" id="clearDrawing">Очистить графику</button>
      <button class="btn ghost" id="newBoard">Новая доска</button>
      <button class="btn danger" id="deleteBoard">Удалить доску</button>
    </div>
  </div>
  <p class="hint board-hint">Рабочее поле прокручивается горизонтально и вертикально. В режиме «Перемещение» можно двигать стикеры и фигуры. Клик по фигуре или линии в режиме «Ластик» удаляет её.</p>
  <div class="board-scroll-container" id="boardScrollContainer">
    <div class="whiteboard ${b.tool==='draw'?'drawing':''} ${b.tool==='erase'?'erasing':''}" id="whiteboard" style="width:${b.width}px;height:${b.height}px">
      <svg class="board-svg" id="boardSvg" viewBox="0 0 ${b.width} ${b.height}" width="${b.width}" height="${b.height}">
        ${b.paths.map(p=>`<path data-path-id="${p.id}" d="${esc(p.d)}" fill="none" stroke="${esc(p.color||'#374151')}" stroke-width="${Number(p.width)||3}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
        ${b.shapes.map(shape=>`<g class="board-shape" data-shape-id="${shape.id}" transform="translate(0 0)">${shapeSvg(shape)}</g>`).join('')}
      </svg>
      ${b.stickies.map(sticky=>`<div class="sticky" data-sticky="${sticky.id}" style="left:${sticky.x}px;top:${sticky.y}px;background:${sticky.color}"><textarea data-sticky-text="${sticky.id}" placeholder="Введите текст">${esc(sticky.text)}</textarea><button class="btn danger small" data-delete-sticky="${sticky.id}">Удалить</button></div>`).join('')}
    </div>
  </div>`
}
function renderSearch(){return `<div class="toolbar"><input class="search-input" id="globalSearch" placeholder="Поиск по проектам, задачам, заметкам..."></div><div id="searchResults">${empty('Введите запрос')}</div>`}
function renderTemplates(){const defs=[['empty','Пустой проект'],['education','Обучающая программа'],['research','Исследовательский проект']].filter(([id])=>!state.settings.hiddenTemplates.includes(id));return `<div class="hero"><p class="eyebrow">Настройки данных</p><h2>${state.settings.workingMode?'Рабочая система':'Демонстрационный режим'}</h2><p>${state.settings.workingMode?'В приложении только ваши данные.':'Можно удалить все примеры и начать с чистой системы.'}</p></div><div class="grid cols-2"><section class="card"><h3>Шаблоны</h3><div class="template-list">${defs.map(([id,name])=>`<div class="template-row"><button class="btn ${id==='empty'?'primary':'ghost'}" data-template="${id}">${name}</button><button class="btn danger small" data-delete-template="${id}">Удалить шаблон</button></div>`).join('')||empty('Все шаблоны удалены')}</div></section><section class="card danger-zone"><h3>Рабочая система</h3><p>Удаляет демонстрационные проекты и примеры, сохраняя структуру, здоровье, семью и образование.</p><button class="btn danger" id="clearDemo">Очистить примеры</button></section></div>`}
function modal(title,fields,onSave,initial={}){
  const id='modalForm';
  $('#modalRoot').innerHTML=`<div class="modal-backdrop" role="presentation"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><div class="modal-header"><h2 id="modalTitle">${esc(title)}</h2><button class="icon-btn" type="button" aria-label="Закрыть" data-close-modal>×</button></div><form id="${id}" novalidate><div class="modal-scroll-area"><div class="form-grid">${fields.map(f=>fieldHtml(f,initial[f.name])).join('')}</div><div class="form-error" id="formError" aria-live="polite"></div><div class="modal-end-space" aria-hidden="true"></div></div><div class="modal-footer"><button type="button" class="btn ghost" data-close-modal>Отмена</button><button class="btn primary" type="submit">Сохранить</button></div></form></div></div>`;
  const close=()=>{$('#modalRoot').innerHTML='';document.removeEventListener('keydown',onKey)};
  const onKey=e=>{if(e.key==='Escape')close()};
  document.addEventListener('keydown',onKey);
  $$('[data-close-modal]').forEach(x=>x.onclick=close);
  $('.modal-backdrop')?.addEventListener('mousedown',e=>{if(e.target===e.currentTarget)close()});
  $('#'+id).onsubmit=e=>{
    e.preventDefault();const fd=new FormData(e.currentTarget),obj={};
    fields.forEach(f=>{if(f.type==='multi')obj[f.name]=fd.getAll(f.name);else obj[f.name]=fd.get(f.name)?.trim?.()??fd.get(f.name)});
    const missing=fields.find(f=>f.required&&!obj[f.name]);
    if(missing){$('#formError').textContent=`Заполните поле «${missing.label}»`;e.currentTarget.elements[missing.name]?.focus();return}
    const invalidDate=fields.find(f=>f.type==='date'&&obj[f.name]&&!validIsoDate(obj[f.name]));
    if(invalidDate){$('#formError').textContent=`Проверьте дату в поле «${invalidDate.label}»`;e.currentTarget.elements[invalidDate.name]?.focus();return}
    try{onSave(obj);close();render()}catch(err){console.error(err);$('#formError').textContent='Не удалось сохранить запись. Проверьте введённые данные.'}
  };
  setTimeout(()=>$('#'+id+' input, #'+id+' textarea, #'+id+' select')?.focus(),0)
}
function fieldHtml(f,v=''){const cls=f.full?'field full':'field';const hint=f.hint?`<span class="hint">${esc(f.hint)}</span>`:'';if(f.type==='textarea')return `<div class="${cls}"><label>${esc(f.label)}</label><textarea name="${f.name}" ${f.required?'required':''} placeholder="${esc(f.placeholder||'')}">${esc(v||'')}</textarea>${hint}</div>`;if(f.type==='multi'){const values=Array.isArray(v)?v:[];return `<fieldset class="${cls}"><legend>${esc(f.label)}</legend><div class="check-grid">${f.options.map(([x,n])=>`<label class="check-option"><input type="checkbox" name="${f.name}" value="${esc(x)}" ${values.includes(x)?'checked':''}> ${esc(n)}</label>`).join('')}</div>${hint}</fieldset>`}if(f.type==='select')return `<div class="${cls}"><label>${esc(f.label)}</label><select name="${f.name}">${f.options.map(([x,n])=>`<option value="${esc(x)}" ${String(v)===String(x)?'selected':''}>${esc(n)}</option>`).join('')}</select>${hint}</div>`;return `<div class="${cls}"><label>${esc(f.label)}</label><input name="${f.name}" type="${f.type||'text'}" value="${esc(v||'')}" ${f.required?'required':''} placeholder="${esc(f.placeholder||'')}">${hint}</div>`}
const projectFields=[
{name:'name',label:'Название проекта',required:true,full:true,placeholder:'Например: Новый образовательный проект'},
{name:'areasText',label:'Направления',full:true,placeholder:'Профессиональное, Образование, Семья',hint:'Можно указать несколько направлений через запятую.'},
{name:'goal',label:'Цель проекта',type:'textarea',full:true,placeholder:'Какого результата вы хотите достичь?'},
{name:'meaning',label:'Смысл и описание',type:'textarea',full:true,placeholder:'Почему проект важен и что в него входит?'},
{name:'start',label:'Дата начала',type:'date'},
{name:'end',label:'Дата завершения',type:'date'},
{name:'roles',label:'Ваши роли',full:true,placeholder:'Руководитель, методист, автор'},
{name:'status',label:'Статус',type:'select',options:[['active','Активный'],['planned','Запланирован'],['paused','На паузе'],['done','Завершён']]}
];
function openProject(p=null){modal(p?'Редактировать проект':'Новый проект',projectFields,o=>{const data={...o,areas:String(o.areasText||'').split(',').map(x=>x.trim()).filter(Boolean)};delete data.areasText;if(data.start&&data.end&&data.end<data.start)throw new Error('Дата завершения раньше даты начала');if(p){Object.assign(p,data,{updatedAt:nowStamp()});log('project','Изменён проект: '+p.name,p.id)}else{const np={id:uid(),...data,team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()};state.projects.unshift(np);state.settings.projectOrder=[np.id,...(state.settings.projectOrder||[]).filter(id=>id!==np.id)];state.settings.expandedProjects=[np.id];state.settings.focusProjectId=np.id;log('project','Создан проект: '+np.name,np.id)}persist('Проект сохранён')},p?{...p,areasText:(p.areas||[]).join(', ')}:{start:todayIso(),status:'active'})}
function openQuickProject(){modal('Быстро добавить проект',[
{name:'name',label:'Название проекта',required:true,full:true},
{name:'area',label:'Направление',placeholder:'Профессиональное, образование, семья'},
{name:'start',label:'Дата начала',type:'date'}
],o=>{const np={id:uid(),name:o.name,areas:o.area?[o.area]:[],goal:'',meaning:'',start:o.start||todayIso(),end:'',roles:'',status:'active',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()};state.projects.unshift(np);state.settings.projectOrder=[np.id,...(state.settings.projectOrder||[]).filter(id=>id!==np.id)];state.settings.expandedProjects=[np.id];state.settings.focusProjectId=np.id;log('project','Создан проект: '+np.name,np.id);persist('Проект добавлен')},{start:todayIso()})}
function openQuickAdd(){modal('Что добавить?',[{name:'type',label:'Тип записи',type:'select',full:true,options:[['task','Задачу'],['project','Проект'],['meeting','Совещание'],['note','Заметку'],['quote','Цитату'],['member','Участника команды']]},{name:'projectId',label:'Проект для участника',type:'select',full:true,options:[['','Выберите при добавлении участника'],...state.projects.map(p=>[p.id,p.name])],hint:'Поле используется только для типа «Участник команды».'}],o=>{state.settings.lastQuickAddType=o.type;persist();setTimeout(()=>{if(o.type==='task')openTask();if(o.type==='project')openProject();if(o.type==='meeting')openMeeting();if(o.type==='note')openSimple('notes');if(o.type==='quote')openQuote();if(o.type==='member'){if(!o.projectId){toast('Выберите проект для участника');openQuickAdd()}else openMember(o.projectId)}},0)},{type:state.settings.lastQuickAddType||'task',projectId:''})}
function openTask(t=null,preset={}){const fields=[{name:'title',label:'Продукт / задача',required:true,full:true},{name:'projectId',label:'Проект',type:'select',options:[['','Без проекта'],...state.projects.map(p=>[p.id,p.name])]},{name:'date',label:'Дата',type:'date'},{name:'start',label:'Время начала',type:'time'},{name:'duration',label:'Минуты',type:'number'},{name:'priority',label:'Категория',type:'select',options:[['current','Текущая'],['priority','Приоритетная'],['urgent','Срочная']]},{name:'sphere',label:'Сфера',type:'select',options:[['professional','Профессиональная'],['education','Образовательная'],['personal','Личная']]},{name:'role',label:'Роль'},{name:'method',label:'Метод'},{name:'result',label:'Ожидаемый результат',type:'textarea',full:true},{name:'status',label:'Статус',type:'select',options:[['planned','Запланировано'],['doing','В работе'],['review','На проверке'],['done','Выполнено']]}];modal(t?'Редактировать задачу':'Новая задача',fields,o=>{o.duration=Number(o.duration)||0;o.done=o.status==='done';if(t){Object.assign(t,o);log('task','Изменена задача: '+t.title,t.projectId)}else{const nt={id:uid(),...o};state.tasks.push(nt);log('task','Создана задача: '+nt.title,nt.projectId)}persist('Задача сохранена')},{date:todayIso(),start:'09:00',duration:'60',priority:'current',sphere:'professional',status:'planned',...(t||{}),...preset})}
function openSubproject(pid,sp=null){const fields=[{name:'name',label:'Название подпроекта',required:true,full:true},{name:'goal',label:'Цель',type:'textarea',full:true},{name:'start',label:'Начало',type:'date'},{name:'end',label:'Завершение',type:'date'},{name:'owner',label:'Ответственный'},{name:'artifact',label:'Итоговый артефакт',full:true},{name:'status',label:'Статус',type:'select',options:[['planned','Запланирован'],['doing','В работе'],['done','Завершён']]}];const p=project(pid);modal(sp?'Редактировать подпроект':'Новый подпроект',fields,o=>{if(sp)Object.assign(sp,o);else p.subprojects.push({id:uid(),...o,team:[],sprints:[]});log('subproject',(sp?'Изменён':'Создан')+' подпроект: '+o.name,pid);persist('Подпроект сохранён')},sp||{start:p.start,end:p.end,status:'planned'})}
function openMember(pid,spid='',member=null){
  const fields=[
    {name:'name',label:'Имя участника',required:true,full:true},
    {name:'department',label:'Подразделение',type:'select',options:[
      [PRESCHOOL_DEPARTMENT,PRESCHOOL_DEPARTMENT],
      ['Другое подразделение','Другое подразделение']
    ]},
    {name:'role',label:'Роль в проекте / подпроекте',full:true},
    {name:'contact',label:'Контакты',full:true},
    {name:'note',label:'Комментарий',type:'textarea',full:true}
  ];
  const p=project(pid);
  const sp=spid?p.subprojects.find(x=>x.id===spid):null;
  const team=sp?sp.team:p.team;
  modal(
    member?'Редактировать участника':'Добавить участника',
    fields,
    o=>{
      if(member)Object.assign(member,o);
      else team.push({id:uid(),...o});
      log('team',(member?'Изменён':'Добавлен')+' участник: '+o.name,pid);
      persist('Команда сохранена');
    },
    member?{...member,department:normalizedDepartment(member)}:{department:'Другое подразделение'}
  );
}
function openSprint(pid,spid='',sprint=null){const fields=[{name:'name',label:'Название спринта',required:true,full:true},{name:'goal',label:'Цель спринта',type:'textarea',full:true},{name:'start',label:'Начало',type:'date'},{name:'end',label:'Окончание',type:'date'},{name:'owner',label:'Ответственный'},{name:'artifact',label:'Артефакт',full:true}];const p=project(pid),sp=spid?p.subprojects.find(x=>x.id===spid):null,target=sp?sp.sprints:p.sprints;modal(sprint?'Редактировать спринт':'Новый спринт',fields,o=>{if(sprint)Object.assign(sprint,o);else target.push({id:uid(),...o});log('sprint',(sprint?'Изменён':'Создан')+' спринт: '+o.name,pid);syncLinkedTasks();persist('Спринт сохранён')},sprint||{start:sp?.start||p.start,end:sp?.end||p.end})}
function openAssignment(a=null){const f=[{name:'title',label:'Ожидаемый продукт',required:true,full:true},{name:'projectId',label:'Проект',type:'select',options:[['','Без проекта'],...state.projects.map(p=>[p.id,p.name])]},{name:'assignee',label:'Исполнитель',required:true},{name:'deadline',label:'Дедлайн',type:'date'},{name:'brief',label:'Техническое задание',type:'textarea',full:true},{name:'criteria',label:'Критерии готовности',type:'textarea',full:true},{name:'status',label:'Статус',type:'select',options:[['assigned','Назначено'],['doing','В работе'],['review','На проверке'],['done','Принято']]}];modal(a?'Редактировать поручение':'Новое поручение',f,o=>{if(a)Object.assign(a,o);else state.assignments.push({id:uid(),...o});log('assignment',(a?'Изменено':'Создано')+' поручение: '+o.title,o.projectId);syncLinkedTasks();persist('Поручение сохранено')},a||{deadline:todayIso(),status:'assigned'})}
function openMeetingTaskReview(meeting){
  if(!meeting)return;
  const extracted=extractMeetingTaskCandidates(meeting),previous=meeting.confirmedActions||[];
  const rows=(extracted.length?extracted:previous).map(row=>{
    const old=previous.find(x=>x.raw===row.raw||x.title.toLowerCase()===row.title.toLowerCase());return old?{...row,...old,id:old.id||row.id}:row
  });
  if(!rows.length){toast('Задачи с однозначно распознанным участником не найдены');return}
  const people=teamMemberDirectory();
  $('#modalRoot').innerHTML=`<div class="modal-backdrop" role="presentation"><div class="modal meeting-review-modal" role="dialog" aria-modal="true" aria-labelledby="meetingReviewTitle"><div class="modal-header"><div><h2 id="meetingReviewTitle">Проверить задачи совещания</h2><p class="muted">Проверьте исполнителя, формулировку, срок и проект. Снятая галочка исключает строку из распределения.</p></div><button class="icon-btn" type="button" aria-label="Закрыть" data-close-review>×</button></div><form id="meetingReviewForm"><div class="modal-scroll-area"><div class="meeting-review-list">${rows.map((row,i)=>`<section class="meeting-review-item" data-review-row="${i}"><label class="meeting-review-enable"><input type="checkbox" name="enabled-${i}" ${row.enabled!==false?'checked':''}> Создать задачу</label><input type="hidden" name="id-${i}" value="${esc(row.id)}"><input type="hidden" name="raw-${i}" value="${esc(row.raw||'')}"><div class="form-grid"><div class="field"><label>Исполнитель</label><select name="assignee-${i}" required>${people.map(p=>`<option value="${esc(p.id)}" ${p.id===row.assigneeId?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div><div class="field"><label>Срок</label><input type="date" name="deadline-${i}" value="${esc(row.deadline||meeting.date||todayIso())}"></div><div class="field full"><label>Задача</label><input name="title-${i}" value="${esc(row.title)}" required></div><div class="field full"><label>Проект</label><select name="project-${i}"><option value="">Без проекта</option>${state.projects.map(p=>`<option value="${p.id}" ${p.id===row.projectId?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div></div></section>`).join('')}</div><div class="form-error" id="meetingReviewError" aria-live="polite"></div></div><div class="modal-footer"><button type="button" class="btn ghost" data-close-review>Отмена</button><button class="btn primary" type="submit">Распределить задачи</button></div></form></div></div>`;
  const close=()=>{$('#modalRoot').innerHTML='';document.removeEventListener('keydown',onKey)};
  const onKey=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',onKey);$$('[data-close-review]').forEach(x=>x.onclick=close);
  $('#meetingReviewForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);meeting.confirmedActions=rows.map((row,i)=>{const person=people.find(p=>p.id===fd.get(`assignee-${i}`));return {id:fd.get(`id-${i}`)||uid(),enabled:fd.has(`enabled-${i}`),assigneeId:person?.id||'',assignee:person?.name||'',title:String(fd.get(`title-${i}`)||'').trim(),deadline:String(fd.get(`deadline-${i}`)||meeting.date||todayIso()),projectId:String(fd.get(`project-${i}`)||''),raw:String(fd.get(`raw-${i}`)||row.raw||'')}}).filter(x=>x.title);syncLinkedTasks();log('meeting',`Распределены задачи совещания: ${meeting.title}`);persist('Задачи распределены по участникам');close();render()};
  setTimeout(()=>$('#meetingReviewForm input:not([type="hidden"]), #meetingReviewForm select')?.focus(),0)
}
function openMeeting(m=null){const f=[{name:'title',label:'Название совещания',required:true,full:true},{name:'date',label:'Дата',type:'date'},{name:'time',label:'Время',type:'time'},{name:'participants',label:'Участники',full:true},{name:'projectNames',label:'Проекты через запятую',full:true},{name:'agenda',label:'Вопросы для обсуждения',type:'textarea',full:true},{name:'decisions',label:'Решения',type:'textarea',full:true},{name:'actionItems',label:'Задания участникам',type:'textarea',full:true,hint:'Можно писать обычным текстом: «Королева должна подготовить презентацию до 15 августа». После сохранения приложение предложит проверить распознанные задачи. Строгий формат через | также поддерживается.'},{name:'notes',label:'Заметки и полезные ссылки',type:'textarea',full:true}];modal(m?'Редактировать совещание':'Новое совещание',f,o=>{const names=o.projectNames.split(',').map(x=>x.trim().toLowerCase());o.projectIds=state.projects.filter(p=>names.includes(p.name.toLowerCase())).map(p=>p.id);delete o.projectNames;let target=m;if(m)Object.assign(m,o);else{target={id:uid(),...o,confirmedActions:[]};state.meetings.push(target)}log('meeting',(m?'Изменено':'Создано')+' совещание: '+o.title);syncLinkedTasks();persist('Совещание сохранено');if(extractMeetingTaskCandidates(target).length)setTimeout(()=>openMeetingTaskReview(target),80)},m?{...m,projectNames:(m.projectIds||[]).map(id=>project(id)?.name).filter(Boolean).join(', ')}:{date:todayIso(),time:'10:00'})}
function openSimple(key,x=null){const f=[{name:'title',label:'Название',required:true,full:true},{name:'date',label:'Дата',type:'date'},{name:'note',label:'Текст',type:'textarea',full:true},{name:'tagsText',label:'Теги через запятую',full:true},{name:'url',label:'Ссылка',type:'url',full:true}];modal(x?'Редактировать запись':'Новая запись',f,o=>{o.tags=o.tagsText.split(',').map(v=>v.trim()).filter(Boolean);delete o.tagsText;if(x)Object.assign(x,o);else state[key].push({id:uid(),...o});syncLinkedTasks();persist('Запись сохранена')},x?{...x,tagsText:(x.tags||[]).join(', ')}:{date:todayIso()})}
function openReflection(r=null){const f=[{name:'type',label:'Тип',type:'select',options:[['День','День'],['Неделя','Неделя'],['Месяц','Месяц'],['Проект','Проект']]},{name:'date',label:'Дата',type:'date'},{name:'results',label:'Что получилось',type:'textarea',full:true},{name:'meaning',label:'Смыслы и выводы',type:'textarea',full:true},{name:'next',label:'Следующий шаг',type:'textarea',full:true}];modal(r?'Редактировать рефлексию':'Новая рефлексия',f,o=>{if(r)Object.assign(r,o);else state.reflections.push({id:uid(),...o});syncLinkedTasks();persist('Рефлексия сохранена')},r||{date:todayIso(),type:'День'})}
function openHealth(h=null){const f=[{name:'title',label:'Название',required:true,full:true},{name:'icon',label:'Значок'},{name:'trigger',label:'Связь с Pomodoro',type:'select',options:[['after_focus','После каждого Pomodoro'],['every_2','После 2 Pomodoro'],['every_4','После 4 Pomodoro'],['break_start','В начале перерыва'],['manual','Не связывать с Pomodoro']]},{name:'scheduleEnabled',label:'Добавлять в план дня',type:'select',options:[['true','Да, по расписанию'],['false','Нет']]},{name:'scheduleTime',label:'Время',type:'time'},{name:'scheduleDuration',label:'Длительность, минут',type:'number'},{name:'scheduleDays',label:'Дни недели',type:'multi',full:true,options:[['1','Понедельник'],['2','Вторник'],['3','Среда'],['4','Четверг'],['5','Пятница'],['6','Суббота'],['0','Воскресенье']],hint:'В выбранные дни привычка автоматически появится в плане дня.'}];modal(h?'Настроить привычку':'Новая привычка',f,o=>{o.scheduleEnabled=o.scheduleEnabled==='true';o.scheduleDuration=Number(o.scheduleDuration)||15;if(!o.scheduleDays.length)o.scheduleDays=['1','2','3','4','5','6','0'];let target=h;if(h)Object.assign(h,o);else{target={id:uid(),...o,enabled:true,doneDates:[]};state.health.push(target)}syncHealthTasks(target);persist('Привычка и план дня сохранены')},h?{...h,scheduleEnabled:String(h.scheduleEnabled)}:{icon:'❤',trigger:'manual',scheduleEnabled:'false',scheduleTime:'09:00',scheduleDuration:'15',scheduleDays:['1','2','3','4','5','6','0']})}
function openLife(type,key,x=null){const f=[{name:'title',label:'План или заметка',required:true,full:true},{name:'date',label:'Дата',type:'date'},{name:'note',label:'Подробности',type:'textarea',full:true}];modal(x?'Редактировать':'Новая запись',f,o=>{if(x)Object.assign(x,o);else state[type][key].push({id:uid(),...o,done:false});persist('Запись сохранена')},x||{date:todayIso()})}
function addBusinessProcessTasksToTeam(){
  if(route!=='team')return;
  $$('.team-person-card').forEach(card=>{
    const name=card.querySelector('h2')?.textContent||'',ops=processOperationsForPerson(name);if(!ops.length)return;
    const section=document.createElement('section');section.className='team-process-section';
    section.innerHTML=`<div class="section-title compact"><h3>Операции процесса «Числумики» <span class="chip">${ops.length}</span></h3></div><div class="list">${ops.map(op=>`<div class="list-row ${op.status==='Готово'?'done':''}"><div><b>${esc(op.code)}. ${esc(op.operation)}</b><div class="item-meta">${esc(op.stage)} · ${fmt(op.end)} · ${esc(op.result)}</div></div><select data-process-status="${op.id}">${businessStatusOptions(op.status)}</select></div>`).join('')}</div>`;
    card.append(section)
  })
}
function bindPage(){
addBusinessProcessTasksToTeam();
$$('[data-process-view]').forEach(x=>x.onclick=()=>{state.settings.businessProcessView=x.dataset.processView;persist();render()});
$('[data-open-process-project]')?.addEventListener('click',()=>{const process=currentBusinessProcess();if(!process)return;state.settings.focusProjectId=process.projectId;state.settings.expandedProjects=[process.projectId];route='projects';sessionStorage.setItem('myAssistant.route',route);render()});
$$('[data-process-status]').forEach(x=>x.onchange=()=>{const op=currentBusinessProcess()?.operations.find(v=>v.id===x.dataset.processStatus);if(!op)return;op.status=x.value;syncLinkedTasks();log('business_process',`Статус операции ${op.code}: ${op.status}`,currentBusinessProcess()?.projectId||'');persist('Статус операции обновлён');render()});
function filterProcessOperations(){const q=($('#processSearch')?.value||'').toLowerCase().trim(),stage=$('#processStageFilter')?.value||'',owner=$('#processOwnerFilter')?.value||'',status=$('#processStatusFilter')?.value||'';$$('.process-operation-row').forEach(row=>{row.hidden=!!((q&&!row.dataset.processSearch.includes(q))||(stage&&row.dataset.processStage!==stage)||(owner&&row.dataset.processOwner!==owner)||(status&&row.dataset.processStatusRow!==status))})}
$('#processSearch')?.addEventListener('input',filterProcessOperations);$('#processStageFilter')?.addEventListener('change',filterProcessOperations);$('#processOwnerFilter')?.addEventListener('change',filterProcessOperations);$('#processStatusFilter')?.addEventListener('change',filterProcessOperations);
$$('[data-task-view]').forEach(x=>x.onclick=()=>{state.settings.taskView=x.dataset.taskView;persist();render()});
function filterTasks(){const q=($('#taskSearch')?.value||'').trim().toLowerCase(),status=$('#taskStatus')?.value||'',pid=$('#taskProject')?.value||'',source=$('#taskSource')?.value||'';const end=new Date(parseLocalDate(todayIso()));end.setDate(end.getDate()+7);const endIso=localDateIso(end);const rows=state.tasks.filter(t=>(!q||[t.title,t.result,project(t.projectId)?.name].join(' ').toLowerCase().includes(q))&&(!pid||t.projectId===pid)&&(!source||(source==='manual'?!t.linkedSourceType:t.linkedSourceType===source))&&(!status||(status==='overdue'&&!t.done&&t.date&&t.date<todayIso())||(status==='today'&&!t.done&&t.date===todayIso())||(status==='week'&&!t.done&&t.date>=todayIso()&&t.date<=endIso)||(status==='undated'&&!t.done&&!t.date)||(status==='done'&&t.done)));const target=$('#taskResults');if(target){target.innerHTML=state.settings.taskView==='kanban'?renderKanbanBody(rows):renderTaskGroups(rows);bindPage()}}
['taskSearch','taskStatus','taskProject','taskSource'].forEach(id=>{const el=$('#'+id);if(el&&!el.dataset.filterBound){el.dataset.filterBound='1';el.addEventListener(id==='taskSearch'?'input':'change',filterTasks)}});
$$('[data-dashboard-filter]').forEach(x=>x.onclick=()=>{route='tasks';sessionStorage.setItem('myAssistant.route',route);render();requestAnimationFrame(()=>{const f=$('#taskStatus');if(f){f.value=x.dataset.dashboardFilter;f.dispatchEvent(new Event('change'))}})});
$$('[data-route-meetings]').forEach(x=>x.onclick=()=>{route='meetings';sessionStorage.setItem('myAssistant.route',route);render()});
$$('[data-route-history]').forEach(x=>x.onclick=()=>{route='history';sessionStorage.setItem('myAssistant.route',route);render()});
$$('[data-open-source-meeting]').forEach(x=>x.onclick=()=>{route='meetings';render();requestAnimationFrame(()=>{const btn=$(`[data-edit-meeting="${x.dataset.openSourceMeeting}"]`);btn?.scrollIntoView({behavior:'smooth',block:'center'})})});

$('[data-route-quotes]')?.addEventListener('click',()=>{route='quotes';render()});
$$('[data-add-quote]').forEach(x=>x.onclick=()=>openQuote());
$$('[data-edit-quote]').forEach(x=>x.onclick=()=>openQuote(state.quotes.find(q=>q.id===x.dataset.editQuote)));
$$('[data-delete-quote]').forEach(x=>x.onclick=()=>{const q=state.quotes.find(q=>q.id===x.dataset.deleteQuote);if(q&&confirm('Удалить цитату?')){state.quotes=state.quotes.filter(v=>v.id!==q.id);persist('Цитата удалена');render()}});
$$('[data-feature-quote]').forEach(x=>x.onclick=()=>{const q=state.quotes.find(q=>q.id===x.dataset.featureQuote);if(!q)return;const next=!q.featured;state.quotes.forEach(v=>v.featured=false);q.featured=next;if(next)q.date=todayIso();persist(next?'Цитата размещена на главной':'Цитата снята с главной');render()});
$$('[data-favorite-quote]').forEach(x=>x.onclick=()=>{const q=state.quotes.find(q=>q.id===x.dataset.favoriteQuote);if(q){q.favorite=!q.favorite;persist();render()}});
function filterQuotes(){
  const query=($('#quoteSearch')?.value||'').toLowerCase().trim(),cat=$('#quoteCategory')?.value||'',fav=$('#quoteFavorites')?.checked;
  const rows=state.quotes.filter(q=>(!cat||q.category===cat)&&(!fav||q.favorite)&&(!query||[q.text,q.author,q.category,(q.tags||[]).join(' ')].join(' ').toLowerCase().includes(query)));
  const list=$('#quoteList');if(list){list.innerHTML=rows.sort((a,b)=>(b.featured-a.featured)||(b.date||'').localeCompare(a.date||'')).map(quoteCard).join('')||empty('Ничего не найдено');bindPage()}
}
$('#quoteSearch')?.addEventListener('input',filterQuotes);
$('#quoteCategory')?.addEventListener('change',filterQuotes);
$('#quoteFavorites')?.addEventListener('change',filterQuotes);


$$('[data-day-shift]').forEach(x=>x.onclick=()=>{dayCursor.setDate(dayCursor.getDate()+Number(x.dataset.dayShift));render()});
$('#dayDatePicker')?.addEventListener('change',e=>{if(e.target.value){dayCursor=parseLocalDate(e.target.value);render()}});
$('#goToday')?.addEventListener('click',()=>{dayCursor=new Date();render()});

$$('[data-week-jump]').forEach(x=>x.onclick=()=>{dayCursor=weekDates()[Number(x.dataset.weekJump)];route='day';sessionStorage.setItem('myAssistant.route',route);render()});
$$('[data-week-day]').forEach(x=>x.onclick=()=>{weekDayIndex=Number(x.dataset.weekDay);render()});
$$('[data-week-day-move]').forEach(x=>x.onclick=()=>{const next=weekDayIndex+Number(x.dataset.weekDayMove);if(next<0){weekCursor.setDate(weekCursor.getDate()-7);weekDayIndex=6}else if(next>6){weekCursor.setDate(weekCursor.getDate()+7);weekDayIndex=0}else weekDayIndex=next;render()});
$$('[data-week-shift]').forEach(x=>x.onclick=()=>{weekCursor.setDate(weekCursor.getDate()+7*Number(x.dataset.weekShift));render()});
$('#goCurrentWeek')?.addEventListener('click',()=>{weekCursor=new Date();weekDayIndex=(new Date().getDay()+6)%7;render()});

$$('[data-toggle-week-day]').forEach(x=>x.onclick=()=>{
  const i=Number(x.dataset.toggleWeekDay),hidden=new Set(state.settings.hiddenWeekDays||[]);
  hidden.has(i)?hidden.delete(i):hidden.add(i);
  if(hidden.size>=7){toast('Хотя бы один день должен оставаться видимым');return}
  state.settings.hiddenWeekDays=[...hidden];persist();render()
});
$('#showWeekdaysOnly')?.addEventListener('click',()=>{state.settings.hiddenWeekDays=[5,6];persist();render()});
$('#showWeekendOnly')?.addEventListener('click',()=>{state.settings.hiddenWeekDays=[0,1,2,3,4];persist();render();requestAnimationFrame(()=>{const el=$('#weekHorizontalScroll');if(el)el.scrollLeft=el.scrollWidth})});
$('#showAllWeekDays')?.addEventListener('click',()=>{state.settings.hiddenWeekDays=[];persist();render()});

$$('[data-create-report-template]').forEach(x=>x.onclick=()=>createReportFromTemplate(x.dataset.createReportTemplate));
$('[data-collect-current-report]')?.addEventListener('click',()=>{const doc=state.reports[0];if(doc)collectReportData(doc)});
$('[data-export-current-report]')?.addEventListener('click',()=>{const doc=state.reports[0];if(doc)exportReportWord(doc)});

$$('[data-add-report]').forEach(x=>x.onclick=()=>openReport(null,x.dataset.addReport));
$$('[data-edit-report]').forEach(x=>x.onclick=()=>openReport(state.reports.find(r=>r.id===x.dataset.editReport)));
$$('[data-delete-report]').forEach(x=>x.onclick=()=>{const doc=state.reports.find(r=>r.id===x.dataset.deleteReport);if(doc&&confirm(`Удалить документ «${doc.title}»?`)){state.reports=state.reports.filter(r=>r.id!==doc.id);persist('Документ удалён');render()}});
$$('[data-add-report-row]').forEach(x=>{x.onclick=()=>{const doc=state.reports.find(r=>r.id===x.dataset.addReportRow);if(doc)openReportRow(doc)}});
$$('[data-edit-report-row]').forEach(x=>{x.onclick=()=>{const doc=state.reports.find(r=>r.id===x.dataset.reportId);const row=doc?.rows.find(r=>r.id===x.dataset.editReportRow);if(doc&&row)openReportRow(doc,row)}});
$$('[data-delete-report-row]').forEach(x=>{x.onclick=()=>{const doc=state.reports.find(r=>r.id===x.dataset.reportId);if(doc&&confirm('Удалить строку?')){doc.rows=doc.rows.filter(r=>r.id!==x.dataset.deleteReportRow);persist('Строка удалена');render()}}});
$$('[data-collect-report]').forEach(x=>x.onclick=()=>{const doc=state.reports.find(r=>r.id===x.dataset.collectReport);if(doc)collectReportData(doc)});
$$('[data-export-report]').forEach(x=>x.onclick=()=>{const doc=state.reports.find(r=>r.id===x.dataset.exportReport);if(doc)exportReportWord(doc)});

$$('[data-add-project]').forEach(x=>x.onclick=()=>openProject());$$('[data-quick-project]').forEach(x=>x.onclick=()=>openQuickProject());
$$('[data-toggle-project]').forEach(x=>x.onclick=e=>{e.stopPropagation();const id=x.dataset.toggleProject;const list=new Set(state.settings.expandedProjects||[]);list.has(id)?list.delete(id):list.add(id);state.settings.expandedProjects=[...list];persist();render()});
$$('[data-collapse-project]').forEach(x=>x.onclick=e=>{e.stopPropagation();collapseWholeProject(x.dataset.collapseProject);persist();render()});
let draggedProjectId='';
$$('[data-project-card]').forEach(card=>{
  card.addEventListener('dragstart',e=>{draggedProjectId=card.dataset.projectCard;card.classList.add('dragging-project');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',draggedProjectId)});
  card.addEventListener('dragend',()=>{card.classList.remove('dragging-project');$$('[data-project-card]').forEach(c=>c.classList.remove('project-drop-target'));draggedProjectId=''});
  card.addEventListener('dragover',e=>{e.preventDefault();if(card.dataset.projectCard!==draggedProjectId)card.classList.add('project-drop-target')});
  card.addEventListener('dragleave',()=>card.classList.remove('project-drop-target'));
  card.addEventListener('drop',e=>{
    e.preventDefault();card.classList.remove('project-drop-target');
    const targetId=card.dataset.projectCard,sourceId=draggedProjectId||e.dataTransfer.getData('text/plain');
    if(!sourceId||sourceId===targetId)return;
    const ids=orderedProjects().map(p=>p.id),from=ids.indexOf(sourceId),to=ids.indexOf(targetId);
    if(from<0||to<0)return;
    ids.splice(from,1);ids.splice(to,0,sourceId);saveProjectOrder(ids);render()
  })
});
$$('[data-toggle-project-section]').forEach(x=>x.onclick=e=>{e.stopPropagation();const key=x.dataset.toggleProjectSection;state.settings.collapsedProjectSections=state.settings.collapsedProjectSections||{};state.settings.collapsedProjectSections[key]=!state.settings.collapsedProjectSections[key];persist();render()});
$$('[data-collapse-project-inner]').forEach(x=>x.onclick=e=>{e.stopPropagation();const pid=x.dataset.collapseProjectInner,p=project(pid);state.settings.collapsedProjectSections=state.settings.collapsedProjectSections||{};['team','subprojects','sprints'].forEach(section=>state.settings.collapsedProjectSections[projectSectionKey(pid,section)]=true);(p?.subprojects||[]).forEach(sp=>{state.settings.collapsedProjectSections[projectSectionKey(pid,'card',sp.id)]=true;state.settings.collapsedProjectSections[projectSectionKey(pid,'team',sp.id)]=true;state.settings.collapsedProjectSections[projectSectionKey(pid,'sprints',sp.id)]=true});persist();render()});
$$('[data-expand-project-inner]').forEach(x=>x.onclick=e=>{e.stopPropagation();const pid=x.dataset.expandProjectInner;Object.keys(state.settings.collapsedProjectSections||{}).filter(key=>key.startsWith(pid+':')).forEach(key=>delete state.settings.collapsedProjectSections[key]);persist();render()});
$$('[data-focus-project]').forEach(x=>x.onclick=e=>{e.stopPropagation();const id=x.dataset.focusProject;state.settings.focusProjectId=state.settings.focusProjectId===id?'':id;if(state.settings.focusProjectId)state.settings.expandedProjects=[id];persist();render()});
$('#collapseAllProjects')?.addEventListener('click',()=>{state.settings.expandedProjects=[];state.settings.focusProjectId='';persist();render()});
$('#expandAllProjects')?.addEventListener('click',()=>{state.settings.expandedProjects=state.projects.map(p=>p.id);state.settings.focusProjectId='';persist();render()});$$('[data-edit-project]').forEach(x=>x.onclick=()=>openProject(project(x.dataset.editProject)));$$('[data-delete-project]').forEach(x=>x.onclick=()=>{if(confirm('Удалить проект? Связанные задачи и поручения будут удалены; совещания, заметки, материалы и доски останутся, но будут отвязаны от проекта.')){const id=x.dataset.deleteProject;state.projects=state.projects.filter(p=>p.id!==id);state.settings.projectOrder=(state.settings.projectOrder||[]).filter(pid=>pid!==id);state.tasks=state.tasks.filter(t=>t.projectId!==id);state.assignments=state.assignments.filter(a=>a.projectId!==id);state.meetings.forEach(m=>{if(m.projectId===id)m.projectId='';if(Array.isArray(m.projectIds))m.projectIds=m.projectIds.filter(v=>v!==id)});state.notes.forEach(n=>{if(n.projectId===id)n.projectId=''});state.library.forEach(n=>{if(n.projectId===id)n.projectId=''});state.boards.forEach(b=>{if(b.projectId===id)b.projectId=''});log('project','Удалён проект',id);persist('Проект удалён');render()}});
$('#projectFilter')?.addEventListener('input',e=>{const value=e.target.value.toLowerCase();$('#projectList').innerHTML=projectCards(orderedProjects(state.projects.filter(p=>p.name.toLowerCase().includes(value))));bindPage();enhanceProjectInternalScroll();applyUniversalScrollbars()});
$$('[data-add-subproject]').forEach(x=>x.onclick=()=>openSubproject(x.dataset.addSubproject));$$('[data-edit-subproject]').forEach(x=>x.onclick=()=>{const p=project(x.dataset.project);openSubproject(p.id,p.subprojects.find(s=>s.id===x.dataset.editSubproject))});$$('[data-delete-subproject]').forEach(x=>x.onclick=()=>{if(!confirm('Удалить подпроект вместе с его командой и спринтами?'))return;const p=project(x.dataset.project);p.subprojects=p.subprojects.filter(sp=>sp.id!==x.dataset.deleteSubproject);syncLinkedTasks();persist('Подпроект удалён');render()});
$$('[data-add-member]').forEach(x=>x.onclick=()=>openMember(x.dataset.addMember,x.dataset.subproject||''));$$('[data-edit-member]').forEach(x=>x.onclick=()=>{const p=project(x.dataset.project),sp=x.dataset.subproject?p.subprojects.find(s=>s.id===x.dataset.subproject):null,team=sp?sp.team:p.team;openMember(p.id,x.dataset.subproject||'',team.find(m=>m.id===x.dataset.editMember))});$$('[data-delete-member]').forEach(x=>x.onclick=()=>{if(!confirm('Удалить участника из команды?'))return;const p=project(x.dataset.project),sp=x.dataset.subproject?p.subprojects.find(s=>s.id===x.dataset.subproject):null,target=sp?sp.team:p.team;if(sp)sp.team=target.filter(m=>m.id!==x.dataset.deleteMember);else p.team=target.filter(m=>m.id!==x.dataset.deleteMember);persist('Участник удалён');render()});
$$('[data-add-sprint]').forEach(x=>x.onclick=()=>openSprint(x.dataset.addSprint,x.dataset.subproject||''));$$('[data-edit-sprint]').forEach(x=>x.onclick=()=>{const p=project(x.dataset.project),sp=x.dataset.subproject?p.subprojects.find(s=>s.id===x.dataset.subproject):null,target=sp?sp.sprints:p.sprints;openSprint(p.id,x.dataset.subproject||'',target.find(s=>s.id===x.dataset.editSprint))});$$('[data-delete-sprint]').forEach(x=>x.onclick=()=>{if(!confirm('Удалить спринт?'))return;const p=project(x.dataset.project),sp=x.dataset.subproject?p.subprojects.find(s=>s.id===x.dataset.subproject):null,target=sp?sp.sprints:p.sprints;if(sp)sp.sprints=target.filter(s=>s.id!==x.dataset.deleteSprint);else p.sprints=target.filter(s=>s.id!==x.dataset.deleteSprint);syncLinkedTasks();persist('Спринт удалён');render()});
$$('[data-add-task]').forEach(x=>x.onclick=()=>openTask());$$('[data-slot-date]').forEach(x=>x.onclick=()=>openTask(null,{date:x.dataset.slotDate,start:String(x.dataset.slotHour).padStart(2,'0')+':00'}));$$('[data-month-day]').forEach(x=>x.ondblclick=()=>openTask(null,{date:x.dataset.monthDay}));$$('[data-edit-task]').forEach(x=>x.onclick=e=>{e.stopPropagation();openTask(state.tasks.find(t=>t.id===x.dataset.editTask))});$$('[data-toggle-task]').forEach(x=>x.onclick=e=>{e.stopPropagation();const t=state.tasks.find(t=>t.id===x.dataset.toggleTask);if(!t)return;t.done=!t.done;t.status=t.done?'done':'planned';if(t.healthHabitId){const h=state.health.find(h=>h.id===t.healthHabitId);if(h)setHabitDone(h,t.date,t.done)}if(t.generatedLinked)updateLinkedSourceFromTask(t);log('task',(t.done?'Завершена задача: ':'Возвращена задача: ')+t.title,t.projectId);syncLinkedTasks();persist('Статус задачи изменён');render()});$$('[data-delete-task]').forEach(x=>x.onclick=e=>{e.stopPropagation();const t=state.tasks.find(t=>t.id===x.dataset.deleteTask);if(!t)return;if(confirm(`Удалить задачу «${t.title}»?`)){state.tasks=state.tasks.filter(v=>v.id!==t.id);log('task','Удалена задача: '+t.title,t.projectId);persist('Задача удалена');render()}});
$$('[data-month]').forEach(x=>x.onclick=()=>{monthCursor.setMonth(monthCursor.getMonth()+Number(x.dataset.month));monthSelectedDate=localDateIso(new Date(monthCursor.getFullYear(),monthCursor.getMonth(),1));render()});
$('#goCurrentMonth')?.addEventListener('click',()=>{monthCursor=new Date();monthSelectedDate=todayIso();render()});
$$('[data-month-select]').forEach(x=>x.onclick=e=>{e.stopPropagation();monthSelectedDate=x.dataset.monthSelect;render()});
$$('[data-month-filter]').forEach(x=>x.onclick=e=>{e.stopPropagation();monthTaskFilter=x.dataset.monthFilter||'all';render()});
$$('[data-drag-task]').forEach(x=>x.ondragstart=e=>e.dataTransfer.setData('text/plain',x.dataset.dragTask));$$('[data-drop]').forEach(c=>{c.ondragover=e=>e.preventDefault();c.ondrop=e=>{const t=state.tasks.find(x=>x.id===e.dataTransfer.getData('text/plain'));if(t){t.status=c.dataset.drop;t.done=t.status==='done';if(t.generatedLinked)updateLinkedSourceFromTask(t);syncLinkedTasks();persist();render()}}});
$$('[data-add-assignment]').forEach(x=>x.onclick=()=>openAssignment());$$('[data-edit-assignment]').forEach(x=>x.onclick=()=>openAssignment(state.assignments.find(a=>a.id===x.dataset.editAssignment)));$$('[data-toggle-assignment]').forEach(x=>x.onclick=()=>{const a=state.assignments.find(a=>a.id===x.dataset.toggleAssignment);if(!a)return;a.status=a.status==='done'?'doing':'done';syncLinkedTasks();persist();render()});$$('[data-delete-assignment]').forEach(x=>x.onclick=()=>{const a=state.assignments.find(a=>a.id===x.dataset.deleteAssignment);if(a&&confirm(`Удалить поручение «${a.title}»?`)){state.assignments=state.assignments.filter(v=>v.id!==a.id);syncLinkedTasks();persist('Поручение удалено');render()}});
$$('[data-add-meeting]').forEach(x=>x.onclick=()=>openMeeting());$$('[data-edit-meeting]').forEach(x=>x.onclick=()=>openMeeting(state.meetings.find(m=>m.id===x.dataset.editMeeting)));$$('[data-review-meeting-tasks]').forEach(x=>x.onclick=()=>openMeetingTaskReview(state.meetings.find(m=>m.id===x.dataset.reviewMeetingTasks)));$$('[data-protocol]').forEach(x=>x.onclick=()=>downloadProtocol(state.meetings.find(m=>m.id===x.dataset.protocol)));$$('[data-delete-meeting]').forEach(x=>x.onclick=()=>{const m=state.meetings.find(m=>m.id===x.dataset.deleteMeeting);if(m&&confirm(`Удалить совещание «${m.title}»?`)){state.meetings=state.meetings.filter(v=>v.id!==m.id);syncLinkedTasks();persist('Совещание удалено');render()}});
$('#exportIcs')&&( $('#exportIcs').onclick=exportIcs );$('#openGoogle')&&( $('#openGoogle').onclick=()=>window.open('https://calendar.google.com','_blank','noopener') );$('#icsInput')&&( $('#icsInput').onchange=e=>importIcs(e.target.files[0]) );$$('[data-google-one]').forEach(x=>x.onclick=()=>openGoogleEvent(state.tasks.find(t=>t.id===x.dataset.googleOne)));
$$('[data-add-health]').forEach(x=>x.onclick=()=>openHealth());$$('[data-edit-health]').forEach(x=>x.onclick=()=>openHealth(state.health.find(h=>h.id===x.dataset.editHealth)));$$('[data-toggle-health]').forEach(x=>x.onclick=()=>{const h=state.health.find(h=>h.id===x.dataset.toggleHealth);const next=!(h.doneDates||[]).includes(todayIso());setHabitDone(h,todayIso(),next);persist();render()});$$('[data-delete-health]').forEach(x=>x.onclick=()=>{const h=state.health.find(h=>h.id===x.dataset.deleteHealth);if(h&&confirm(`Удалить привычку «${h.title}» и её будущие задачи из плана дня?`)){state.health=state.health.filter(v=>v.id!==h.id);state.tasks=state.tasks.filter(t=>t.healthHabitId!==h.id);persist('Привычка удалена');render()}});
$$('[data-add-life]').forEach(x=>x.onclick=()=>openLife(x.dataset.addLife,x.dataset.lifeKey));$$('[data-edit-life]').forEach(x=>x.onclick=()=>openLife(x.dataset.lifeType,x.dataset.lifeKey,state[x.dataset.lifeType][x.dataset.lifeKey].find(v=>v.id===x.dataset.editLife)));$$('[data-delete-life]').forEach(x=>x.onclick=()=>{const arr=state[x.dataset.lifeType][x.dataset.lifeKey],item=arr.find(v=>v.id===x.dataset.deleteLife);if(item&&confirm(`Удалить запись «${item.title}»?`)){state[x.dataset.lifeType][x.dataset.lifeKey]=arr.filter(v=>v.id!==item.id);syncLinkedTasks();persist('Запись удалена');render()}});
$$('[data-add-simple]').forEach(x=>x.onclick=()=>openSimple(x.dataset.addSimple));$$('[data-edit-simple]').forEach(x=>x.onclick=()=>openSimple(x.dataset.simpleKey,state[x.dataset.simpleKey].find(v=>v.id===x.dataset.editSimple)));$$('[data-delete-simple]').forEach(x=>x.onclick=()=>{const key=x.dataset.simpleKey,item=state[key].find(v=>v.id===x.dataset.deleteSimple);if(item&&confirm(`Удалить запись «${item.title}»?`)){state[key]=state[key].filter(v=>v.id!==item.id);persist('Запись удалена');render()}});
$$('[data-add-reflection]').forEach(x=>x.onclick=()=>openReflection());$$('[data-edit-reflection]').forEach(x=>x.onclick=()=>openReflection(state.reflections.find(r=>r.id===x.dataset.editReflection)));$$('[data-delete-reflection]').forEach(x=>x.onclick=()=>{const r=state.reflections.find(r=>r.id===x.dataset.deleteReflection);if(r&&confirm('Удалить эту рефлексию?')){state.reflections=state.reflections.filter(v=>v.id!==r.id);syncLinkedTasks();persist('Рефлексия удалена');render()}});
if($('#pomoStart'))$('#pomoStart').onclick=togglePomo;if($('#pomoReset'))$('#pomoReset').onclick=()=>{clearInterval(pomo.timer);pomo.timer=null;pomo.running=false;pomo.left=(pomo.mode==='focus'?state.pomodoro.focus:state.pomodoro.short)*60;render()};if($('#pomoTestSignal'))$('#pomoTestSignal').onclick=()=>showPomodoroSignal(pomo.mode==='focus'?'focus':'break','Это тестовый визуальный сигнал.');
if($('#boardSelect'))$('#boardSelect').onchange=e=>{activeBoard=e.target.value;render()};if($('#newBoard'))$('#newBoard').onclick=()=>{const n=prompt('Название доски');if(n){const b={id:uid(),name:n,projectId:'',stickies:[],paths:[],shapes:[],undoStack:[],width:1800,height:1000};state.boards.push(b);activeBoard=b.id;persist();render()}};if($('#deleteBoard'))$('#deleteBoard').onclick=()=>{const b=state.boards.find(x=>x.id===activeBoard);if(!b)return;if(state.boards.length===1){toast('Нельзя удалить единственную доску');return}if(confirm(`Удалить доску «${b.name}» со всеми стикерами и рисунками?`)){state.boards=state.boards.filter(x=>x.id!==b.id);activeBoard=state.boards[0]?.id||'';persist('Доска удалена');render()}};if($('#addSticky'))$('#addSticky').onclick=()=>{const b=state.boards.find(x=>x.id===activeBoard);pushBoardUndo(b);b.stickies.push({id:uid(),x:30+Math.random()*500,y:30+Math.random()*350,color:['#fff3a6','#ffd6e7','#d9f0ff','#dff6d5'][Math.floor(Math.random()*4)],text:''});persist();render()};bindBoard();
if($('#globalSearch'))$('#globalSearch').oninput=e=>runSearch(e.target.value);$$('[data-search-route]').forEach(x=>x.onclick=()=>{route=x.dataset.searchRoute;sessionStorage.setItem('myAssistant.route',route);render()});if($('#clearHistory'))$('#clearHistory').onclick=()=>{if(confirm('Очистить историю изменений?')){state.history=[];persist();render()}};
$$('[data-template]').forEach(x=>x.onclick=()=>useTemplate(x.dataset.template));$$('[data-delete-template]').forEach(x=>x.onclick=()=>{const id=x.dataset.deleteTemplate;if(confirm('Удалить этот шаблон из списка?')){state.settings.hiddenTemplates=[...new Set([...(state.settings.hiddenTemplates||[]),id])];persist('Шаблон удалён');render()}});if($('#clearDemo'))$('#clearDemo').onclick=clearDemo;
}
function bindBoard(){
  const wb=$('#whiteboard');if(!wb)return;
  const b=state.boards.find(x=>x.id===activeBoard);if(!b)return;
  b.brushColor=b.brushColor||'#374151';b.brushWidth=Number(b.brushWidth)||3;b.tool=b.tool||'move';
  const svg=$('#boardSvg');

  $('#undoBoard')?.addEventListener('click',()=>undoBoard(b));
  $('#moveMode')?.addEventListener('click',()=>{b.tool='move';persist();render()});
  $('#drawMode')?.addEventListener('click',()=>{b.tool=b.tool==='draw'?'move':'draw';persist();render()});
  $('#eraseMode')?.addEventListener('click',()=>{b.tool=b.tool==='erase'?'move':'erase';persist();render()});
  $('#brushWidth')?.addEventListener('change',e=>{b.brushWidth=Number(e.target.value);persist()});
  $$('[data-brush-color]').forEach(x=>x.onclick=()=>{b.brushColor=x.dataset.brushColor;persist();render()});

  $('#addShape')?.addEventListener('click',()=>{
    const type=$('#shapeType')?.value;
    if(!type){toast('Выберите геометрическую фигуру');return}
    pushBoardUndo(b);
    b.shapes.push({id:uid(),type,x:120+(b.shapes.length%6)*55,y:100+(b.shapes.length%5)*45,w:type==='circle'?130:180,h:type==='line'||type==='arrow'?70:110,color:b.brushColor,fill:'rgba(59,130,246,.10)',width:b.brushWidth});
    b.tool='move';persist('Фигура добавлена');render()
  });

  $$('[data-sticky-text]').forEach(x=>x.oninput=()=>{const sticky=b.stickies.find(st=>st.id===x.dataset.stickyText);if(sticky){sticky.text=x.value;persist()}});
  $$('[data-delete-sticky]').forEach(x=>x.onclick=()=>{pushBoardUndo(b);b.stickies=b.stickies.filter(st=>st.id!==x.dataset.deleteSticky);persist();render()});
  $$('[data-sticky]').forEach(el=>{
    let moving=false,ox=0,oy=0,started=false;
    el.onpointerdown=e=>{if(e.target.matches('textarea,button')||b.tool!=='move')return;moving=true;started=false;ox=e.offsetX;oy=e.offsetY;el.setPointerCapture(e.pointerId)};
    el.onpointermove=e=>{if(!moving)return;if(!started){pushBoardUndo(b);started=true}const rect=wb.getBoundingClientRect(),sticky=b.stickies.find(st=>st.id===el.dataset.sticky);sticky.x=Math.max(0,Math.min(b.width-220,e.clientX-rect.left-ox));sticky.y=Math.max(0,Math.min(b.height-160,e.clientY-rect.top-oy));el.style.left=sticky.x+'px';el.style.top=sticky.y+'px'};
    el.onpointerup=()=>{moving=false;if(started)persist()}
  });

  $$('[data-shape-id]').forEach(group=>{
    let moving=false,startX=0,startY=0,originX=0,originY=0,started=false;
    group.onpointerdown=e=>{
      const shape=b.shapes.find(sh=>sh.id===group.dataset.shapeId);if(!shape)return;
      if(b.tool==='erase'){pushBoardUndo(b);b.shapes=b.shapes.filter(sh=>sh.id!==shape.id);persist('Фигура удалена');render();return}
      if(b.tool!=='move')return;
      moving=true;started=false;startX=e.clientX;startY=e.clientY;originX=Number(shape.x)||0;originY=Number(shape.y)||0;svg.setPointerCapture(e.pointerId);e.stopPropagation()
    };
    group.onpointermove=e=>{
      if(!moving)return;const shape=b.shapes.find(sh=>sh.id===group.dataset.shapeId);if(!shape)return;
      if(!started){pushBoardUndo(b);started=true}
      const rect=svg.getBoundingClientRect(),scaleX=b.width/rect.width,scaleY=b.height/rect.height;
      shape.x=Math.max(0,Math.min(b.width-(shape.w||100),originX+(e.clientX-startX)*scaleX));
      shape.y=Math.max(0,Math.min(b.height-(shape.h||100),originY+(e.clientY-startY)*scaleY));
      group.innerHTML=shapeSvg(shape)
    };
    group.onpointerup=()=>{moving=false;if(started){persist();render()}}
  });

  $('#clearDrawing')?.addEventListener('click',()=>{
    if(!b.paths.length&&!b.shapes.length)return;
    if(confirm('Удалить все линии и фигуры с доски?')){pushBoardUndo(b);b.paths=[];b.shapes=[];persist();render()}
  });

  $$('[data-path-id]').forEach(path=>path.onclick=e=>{
    if(b.tool!=='erase')return;e.stopPropagation();pushBoardUndo(b);b.paths=b.paths.filter(p=>p.id!==path.dataset.pathId);persist('Линия удалена');render()
  });

  let drawing=false,points=[];
  svg.onpointerdown=e=>{
    if(b.tool!=='draw'||e.target.closest('[data-shape-id]')||e.target.matches('[data-path-id]'))return;
    drawing=true;const rect=svg.getBoundingClientRect();
    points=[[(e.clientX-rect.left)/rect.width*b.width,(e.clientY-rect.top)/rect.height*b.height]];
    svg.setPointerCapture(e.pointerId)
  };
  svg.onpointermove=e=>{
    if(!drawing)return;const rect=svg.getBoundingClientRect();
    points.push([(e.clientX-rect.left)/rect.width*b.width,(e.clientY-rect.top)/rect.height*b.height])
  };
  svg.onpointerup=()=>{
    if(!drawing)return;drawing=false;
    if(points.length>1){pushBoardUndo(b);b.paths.push({id:uid(),d:points.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '),color:b.brushColor,width:b.brushWidth});persist();render()}
  }
}

let pomodoroSignalTimer=null;
function closePomodoroSignal(){clearTimeout(pomodoroSignalTimer);pomodoroSignalTimer=null;const root=$('#pomodoroSignalRoot');if(root)root.innerHTML='';document.body.classList.remove('pomodoro-signal-active')}
function showPomodoroSignal(kind='focus',extra=''){
  const isFocus=kind==='focus',root=$('#pomodoroSignalRoot');if(!root)return;
  closePomodoroSignal();
  const title=isFocus?'Фокус-сессия завершена':'Перерыв завершён';
  const message=isFocus?'Пора отдохнуть и восстановиться.':'Можно возвращаться к следующей задаче.';
  root.innerHTML=`<div class="pomodoro-signal-backdrop" role="alertdialog" aria-modal="true" aria-labelledby="pomodoroSignalTitle"><div class="pomodoro-signal-card ${isFocus?'focus-finished':'break-finished'}"><div class="pomodoro-signal-icon">${isFocus?'✓':'▶'}</div><p class="eyebrow">${isFocus?'Pomodoro завершён':'Перерыв завершён'}</p><h2 id="pomodoroSignalTitle">${title}</h2><p>${message}</p>${extra?`<div class="pomodoro-signal-extra">${esc(extra)}</div>`:''}<div class="actions"><button class="btn primary" type="button" data-close-pomodoro-signal>Понятно</button></div></div></div>`;
  document.body.classList.add('pomodoro-signal-active');
  $('[data-close-pomodoro-signal]')?.addEventListener('click',closePomodoroSignal);
  $('.pomodoro-signal-backdrop')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closePomodoroSignal()});
  pomodoroSignalTimer=setTimeout(closePomodoroSignal,20000);
  if('Notification'in window&&Notification.permission==='granted'){try{new Notification('Мой ассистент · Pomodoro',{body:title})}catch(e){console.warn(e)}}
}
function finishPomodoro(){
  clearInterval(pomo.timer);pomo.timer=null;pomo.running=false;
  if(pomo.mode==='focus'){state.pomodoro.sessions++;const healthText=healthReminder();showPomodoroSignal('focus',healthText);pomo.mode='break';pomo.left=Math.max(1,Number(state.pomodoro.short)||5)*60}
  else{showPomodoroSignal('break');pomo.mode='focus';pomo.left=Math.max(1,Number(state.pomodoro.focus)||25)*60}
  persist();render()
}
function togglePomo(){
  if(pomo.running){clearInterval(pomo.timer);pomo.timer=null;pomo.running=false;render();return}
  if(pomo.left<=0)pomo.left=(pomo.mode==='focus'?state.pomodoro.focus:state.pomodoro.short)*60;
  pomo.running=true;const deadline=Date.now()+pomo.left*1000;
  pomo.timer=setInterval(()=>{pomo.left=Math.max(0,Math.ceil((deadline-Date.now())/1000));const tt=$('#timerText');if(tt)tt.textContent=`${String(Math.floor(pomo.left/60)).padStart(2,'0')}:${String(pomo.left%60).padStart(2,'0')}`;if(pomo.left<=0)finishPomodoro()},250);
  render()
}
function healthReminder(){
  const n=state.pomodoro.sessions;
  const items=state.health.filter(h=>h.enabled!==false&&!(h.doneDates||[]).includes(todayIso())&&(h.trigger==='after_focus'||h.trigger==='break_start'||(h.trigger==='every_2'&&n%2===0)||(h.trigger==='every_4'&&n%4===0)));
  if(!items.length)return'';
  const msg=items.slice(0,3).map(h=>`${h.icon||'❤'} ${h.title}`).join(' · ');
  toast('Перерыв: '+msg);return `Напоминание о здоровье: ${msg}`
}
function runSearch(q){q=q.trim().toLowerCase();if(!q){$('#searchResults').innerHTML=empty('Введите запрос');return}const rows=[];state.projects.filter(x=>[x.name,x.goal,x.meaning].join(' ').toLowerCase().includes(q)).forEach(x=>rows.push(['Проект',x.name,x.goal,'projects',x.id]));state.tasks.filter(x=>[x.title,x.result,project(x.projectId)?.name].join(' ').toLowerCase().includes(q)).forEach(x=>rows.push(['Задача',x.title,x.result,'tasks',x.id]));state.notes.filter(x=>[x.title,x.note,(x.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)).forEach(x=>rows.push(['Заметка',x.title,x.note,'notes',x.id]));state.library.filter(x=>[x.title,x.note,(x.tags||[]).join(' ')].join(' ').toLowerCase().includes(q)).forEach(x=>rows.push(['Материал',x.title,x.note,'library',x.id]));$('#searchResults').innerHTML=`<div class="list">${rows.map(r=>`<button class="list-row search-result" data-search-route="${r[3]}" data-search-id="${r[4]}"><div><span class="chip">${r[0]}</span><div class="item-title">${esc(r[1])}</div><div class="item-meta">${esc(r[2]||'')}</div></div><span aria-hidden="true">→</span></button>`).join('')||empty('Ничего не найдено')}</div>`;bindPage()}
function useTemplate(type){const names={empty:'Новый проект',education:'Обучающая программа',research:'Исследовательский проект'};const p={id:uid(),name:names[type],areas:type==='education'?['Образование']:['Профессиональное'],goal:'',meaning:'',start:todayIso(),end:'',roles:'Руководитель',status:'active',team:[],subprojects:[],sprints:[],links:[],createdAt:nowStamp(),updatedAt:nowStamp()};if(type==='education')p.subprojects=[{id:uid(),name:'Программа',goal:'',start:p.start,end:'',owner:'',artifact:'Программа курса',status:'planned',team:[],sprints:[]}];if(type==='research')p.subprojects=[{id:uid(),name:'Исследование',goal:'',start:p.start,end:'',owner:'',artifact:'Аналитический отчёт',status:'planned',team:[],sprints:[]}];state.projects.push(p);persist('Проект создан из шаблона');route='projects';render()}
function clearDemo(){if(!confirm('Удалить демонстрационные проекты и примеры? Ваши собственные данные определить автоматически невозможно. Рекомендуется сначала экспортировать резервную копию.'))return;state.projects=[];state.tasks=[];state.assignments=[];state.meetings=[];state.notes=[];state.library=[];state.reflections=[];state.leisure=[];state.settings.workingMode=true;persist('Рабочая система очищена');render()}
function download(name,text,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function exportIcs(){const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MyAssistant//RU'];state.tasks.filter(t=>t.date).forEach(t=>{const start=(t.date.replaceAll('-','')+'T'+(t.start||'09:00').replace(':','')+'00');lines.push('BEGIN:VEVENT','UID:'+t.id+'@myassistant','DTSTART:'+start,'SUMMARY:'+String(t.title).replace(/\n/g,' '),'DESCRIPTION:'+String(t.result||''),'END:VEVENT')});lines.push('END:VCALENDAR');download('my-assistant-calendar.ics',lines.join('\r\n'),'text/calendar')}
function importIcs(file){if(!file)return;const r=new FileReader();r.onload=()=>{const txt=r.result,blocks=txt.split('BEGIN:VEVENT').slice(1);blocks.forEach(b=>{const get=k=>(b.match(new RegExp(k+':([^\\r\\n]+)'))||[])[1]||'';const ds=get('DTSTART'),date=ds.slice(0,8).replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3'),time=ds.includes('T')?ds.slice(9,13).replace(/(\d{2})(\d{2})/,'$1:$2'):'09:00';state.tasks.push({id:uid(),title:get('SUMMARY')||'Событие',date,start:time,duration:60,priority:'current',sphere:'personal',role:'',method:'',result:get('DESCRIPTION'),status:'planned',done:false,projectId:''})});persist('Календарь импортирован');render()};r.readAsText(file)}
function openGoogleEvent(t){const dates=t.date.replaceAll('-','')+'T'+(t.start||'09:00').replace(':','')+'00';const end=new Date(`${t.date}T${t.start||'09:00'}`);end.setMinutes(end.getMinutes()+(Number(t.duration)||60));const e=`${end.getFullYear()}${String(end.getMonth()+1).padStart(2,'0')}${String(end.getDate()).padStart(2,'0')}T${String(end.getHours()).padStart(2,'0')}${String(end.getMinutes()).padStart(2,'0')}00`;window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t.title)}&dates=${dates}/${e}&details=${encodeURIComponent(t.result||'')}`,'_blank','noopener')}
function downloadProtocol(m){const text=`ПРОТОКОЛ СОВЕЩАНИЯ\n\nТема: ${m.title}\nДата: ${fmt(m.date)} ${m.time||''}\nУчастники: ${m.participants||''}\nПроекты: ${(m.projectIds||[]).map(id=>project(id)?.name).filter(Boolean).join(', ')}\n\nВОПРОСЫ\n${m.agenda||''}\n\nРЕШЕНИЯ\n${m.decisions||''}\n\nЗАМЕТКИ\n${m.notes||''}\n`;download(`Протокол-${m.date||todayIso()}.txt`,text)}
$('#menuBtn').onclick=()=>document.body.classList.toggle('menu-open');$('#quickAddBtn').onclick=()=>openTask();$('#exportBtn').onclick=()=>download(`my-assistant-backup-${todayIso()}.json`,JSON.stringify(state,null,2),'application/json');$('#importInput').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>20*1024*1024){toast('Файл слишком большой');e.target.value='';return}const r=new FileReader();r.onload=()=>{try{const parsed=JSON.parse(r.result);if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('structure');localStorage.setItem(STORAGE_KEY+'.beforeImport',JSON.stringify(state));state=normalize(parsed);if(!persist('Резервная копия импортирована'))throw new Error('storage');render()}catch(err){console.error(err);const backup=localStorage.getItem(STORAGE_KEY+'.beforeImport');if(backup){try{state=normalize(JSON.parse(backup))}catch{}}toast('Не удалось импортировать файл: структура повреждена или хранилище недоступно')}finally{e.target.value=''}};r.onerror=()=>toast('Не удалось прочитать файл');r.readAsText(f)};

$('#quickAddBtn').onclick=()=>openQuickAdd();
function updatePageScrollControls(){}
if('Notification'in window&&Notification.permission==='default')Notification.requestPermission().catch(()=>{});
const beforeHealthSync=JSON.stringify(state.tasks);syncAllHealthTasks();if(beforeHealthSync!==JSON.stringify(state.tasks))persist();syncLinkedTasks();persist();checkTimedHealthReminders();setInterval(checkTimedHealthReminders,30000);
render();
