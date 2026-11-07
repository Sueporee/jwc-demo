'use strict';

const STORAGE_KEY = 'zhike_jwc_v2';
const ME = '2023010421';

const ROLE_META = {
  student: {
    label: '学生',
    title: '学生工作台',
    name: '林知夏',
    initials: '林',
    meta: '2023 级 · 计算机科学',
    icon: 'cap',
    desc: '选课、课表、成绩与评教',
  },
  teacher: {
    label: '教师',
    title: '教师工作台',
    name: '周明远',
    initials: '周',
    meta: '副教授 · 计算机学院',
    icon: 'book',
    desc: '开课、课程内容与成绩',
  },
  academic: {
    label: '教务人员',
    title: '教务工作台',
    name: '陈静',
    initials: '陈',
    meta: '教务处 · 教学运行科',
    icon: 'clipboard',
    desc: '审核、教学班与选课规则',
  },
  admin: {
    label: '系统管理员',
    title: '系统管理工作台',
    name: '赵启明',
    initials: '赵',
    meta: '信息中心 · 系统管理',
    icon: 'shield',
    desc: '用户、角色、菜单与审计',
  },
};

const MENU_DEFS = {
  dashboard: { label: '工作台', icon: 'grid', group: '概览' },
  courses: { label: '选课中心', icon: 'search', group: '学习' },
  schedule: { label: '我的课表', icon: 'calendar', group: '学习' },
  grades: { label: '我的成绩', icon: 'chart', group: '学习' },
  evaluation: { label: '课程评价', icon: 'star', group: '学习' },
  notices: { label: '通知公告', icon: 'bell', group: '协同' },
  applications: { label: '开课申请', icon: 'file', group: '教学' },
  'my-courses': { label: '我的课程', icon: 'book', group: '教学' },
  'grade-entry': { label: '成绩录入', icon: 'edit', group: '教学' },
  'evaluation-results': { label: '评教结果', icon: 'chart', group: '教学' },
  'review-applications': { label: '开课审核', icon: 'check-square', group: '教务运行' },
  classes: { label: '教学班与排课', icon: 'layers', group: '教务运行' },
  catalog: { label: '课程库', icon: 'book', group: '教务运行' },
  'review-grades': { label: '成绩审核', icon: 'check', group: '教务运行' },
  rules: { label: '选课规则', icon: 'settings', group: '教务运行' },
  audit: { label: '审计日志', icon: 'shield', group: '治理' },
  users: { label: '用户管理', icon: 'users', group: '系统' },
  roles: { label: '角色管理', icon: 'users', group: '系统' },
  menus: { label: '菜单管理', icon: 'menu', group: '系统' },
};

const MENU_BY_ROLE = {
  student: [
    { label: '学习', items: ['dashboard', 'courses', 'schedule', 'grades', 'evaluation'] },
    { label: '协同', items: ['notices'] },
  ],
  teacher: [
    { label: '教学', items: ['dashboard', 'applications', 'my-courses', 'grade-entry', 'evaluation-results'] },
    { label: '协同', items: ['notices'] },
  ],
  academic: [
    { label: '教务运行', items: ['dashboard', 'review-applications', 'classes', 'catalog', 'review-grades', 'rules'] },
    { label: '协同与治理', items: ['notices', 'audit'] },
  ],
  admin: [
    { label: '系统', items: ['dashboard', 'users', 'roles', 'menus', 'audit'] },
  ],
};

const PAGE_META = {
  dashboard: { label: '工作台', title: '工作台', sub: '今天要处理的事，按角色排好优先级。' },
  courses: { label: '选课中心', title: '选课中心', sub: '先看冲突与容量，再决定选课或候补。名额变化走同一套事务。' },
  schedule: { label: '我的课表', title: '我的课表', sub: '按周查看课程、教室与教师，退选后自动刷新。' },
  grades: { label: '我的成绩', title: '我的成绩', sub: '只显示已发布成绩；更正走申请与审批，不直接改库。' },
  evaluation: { label: '课程评价', title: '课程评价', sub: '匿名提交，教师端只看到聚合结果与匿名文本。' },
  notices: { label: '通知公告', title: '通知公告', sub: '选课、候补、审核与成绩发布的关键节点都在这里留痕。' },
  applications: { label: '开课申请', title: '开课申请', sub: '先存草稿，再提交教务审核；发布时做教师、教室、教学班三重冲突检测。' },
  'my-courses': { label: '我的课程', title: '我的课程', sub: '维护课程内容版本，学生只看到已发布的版本。' },
  'grade-entry': { label: '成绩录入', title: '成绩录入', sub: '平时与期末按权重自动计算；提交后教师端锁定。' },
  'evaluation-results': { label: '评教结果', title: '评教结果', sub: '只展示聚合结果；样本少于 5 不展示明细。' },
  'review-applications': { label: '开课审核', title: '开课审核', sub: '通过后发布教学班；退回必须写清原因，教师可改后重提。' },
  classes: { label: '教学班与排课', title: '教学班与排课', sub: '容量调整、关班与冲突检测都在这里完成。' },
  catalog: { label: '课程库', title: '课程库', sub: '课程主数据只在课程库维护，教学班引用它，不复制。' },
  'review-grades': { label: '成绩审核', title: '成绩审核', sub: '先审核再发布；发布后学生可见，更正必须留痕。' },
  rules: { label: '选课规则', title: '选课规则', sub: '学期窗口、学分上限与候补上限由教务配置，学生端实时生效。' },
  audit: { label: '审计日志', title: '审计日志', sub: '角色、菜单、成绩与导出操作只追加，保留 180 天。' },
  users: { label: '用户管理', title: '用户管理', sub: '账号启用、停用与角色绑定；离职账号立即失效。' },
  roles: { label: '角色管理', title: '角色管理', sub: '角色是权限包，不是职级；同一个人可以拥有多个角色。' },
  menus: { label: '菜单管理', title: '菜单管理', sub: '菜单、按钮、接口与数据范围四处联动，保存后 10 秒内生效。' },
};

const DAYS = ['周一', '周二', '周三', '周四', '周五'];
const SLOTS = ['08:00', '10:00', '14:00', '16:00', '19:00'];
const SLOT_LABELS = ['第 1-2 节', '第 3-4 节', '第 5-6 节', '第 7-8 节', '第 9-10 节'];

function seedState() {
  const courses = [
    {
      id: 'CS201', code: 'CS201', name: '数据结构与算法', teacher: '周明远', dept: '计算机学院',
      credits: 3, capacity: 58, selected: 58, type: '专业必修', rating: 4.8,
      time: [{ day: 0, slot: 0 }, { day: 2, slot: 1 }],
      location: '逸夫楼 A302', weeks: '1-16 周', prereq: '程序设计基础',
      status: 'open', contentVersion: 'v2.3', contentUpdated: '2026-11-02',
      description: '从线性表、树到图与排序算法，配套 8 次实验课。课程以 C/C++ 描述，强调复杂度分析与工程实现。',
      chapters: ['绪论与复杂度', '线性表与栈队列', '树与二叉搜索树', '图与最短路径', '排序与查找', '综合实验'],
    },
    {
      id: 'CS305', code: 'CS305', name: '计算机网络', teacher: '李明哲', dept: '计算机学院',
      credits: 3, capacity: 55, selected: 55, type: '专业必修', rating: 4.6,
      time: [{ day: 1, slot: 2 }, { day: 3, slot: 0 }],
      location: '信息楼 B201', weeks: '1-16 周', prereq: '操作系统',
      status: 'open', contentVersion: 'v1.8', contentUpdated: '2026-08-28',
      description: '围绕 TCP/IP 协议栈展开，包含抓包实验与一个简单的可靠传输实现。',
      chapters: ['体系结构', '物理层与链路层', '网络层与路由', '传输层', '应用层', '抓包实验'],
    },
    {
      id: 'CS303', code: 'CS303', name: '操作系统', teacher: '王雪', dept: '计算机学院',
      credits: 3.5, capacity: 60, selected: 41, type: '专业必修', rating: 4.7,
      time: [{ day: 0, slot: 2 }, { day: 3, slot: 1 }],
      location: '逸夫楼 A401', weeks: '1-16 周', prereq: '计算机组成原理',
      status: 'open', contentVersion: 'v2.1', contentUpdated: '2026-11-01',
      description: '进程、内存、文件系统与并发控制，配合 xv6 源码阅读和实验。',
      chapters: ['进程与线程', '调度', '同步与死锁', '内存管理', '文件系统', 'xv6 实验'],
    },
    {
      id: 'CS306', code: 'CS306', name: '数据库系统', teacher: '陈思远', dept: '计算机学院',
      credits: 3, capacity: 50, selected: 50, type: '专业必修', rating: 4.5,
      time: [{ day: 1, slot: 0 }, { day: 3, slot: 2 }],
      location: '信息楼 B305', weeks: '1-16 周', prereq: '数据结构与算法',
      status: 'open', contentVersion: 'v1.6', contentUpdated: '2026-08-30',
      description: '关系模型、SQL、事务与索引设计，课程项目是一个小型教学管理数据库。',
      chapters: ['关系模型', 'SQL', '事务与并发', '索引与优化', '数据库设计', '课程项目'],
    },
    {
      id: 'AI101', code: 'AI101', name: '人工智能导论', teacher: '赵一帆', dept: '人工智能学院',
      credits: 2, capacity: 80, selected: 72, type: '通识选修', rating: 4.9,
      time: [{ day: 2, slot: 2 }],
      location: '博学楼 C101', weeks: '1-12 周', prereq: '无',
      status: 'open', contentVersion: 'v1.2', contentUpdated: '2026-11-03',
      description: '从搜索、机器学习到生成式模型，面向非人工智能专业的入门课。',
      chapters: ['智能体与搜索', '机器学习基础', '神经网络', '生成式模型', '伦理与治理'],
    },
    {
      id: 'EN204', code: 'EN204', name: '大学英语（四）', teacher: '许婉', dept: '外国语学院',
      credits: 2, capacity: 45, selected: 30, type: '公共必修', rating: 4.4,
      time: [{ day: 1, slot: 1 }, { day: 3, slot: 3 }],
      location: '文科楼 208', weeks: '1-16 周', prereq: '大学英语（三）',
      status: 'open', contentVersion: 'v1.1', contentUpdated: '2026-08-25',
      description: '学术阅读与写作，围绕一个专业主题完成小组展示与期末论文。',
      chapters: ['学术阅读', '摘要写作', '论证结构', '展示技巧', '期末论文'],
    },
    {
      id: 'PE102', code: 'PE102', name: '体育（羽毛球）', teacher: '孙浩', dept: '体育部',
      credits: 1, capacity: 30, selected: 28, type: '公共必修', rating: 4.3,
      time: [{ day: 4, slot: 2 }],
      location: '东区体育馆 3 号场', weeks: '1-16 周', prereq: '无',
      status: 'open', contentVersion: 'v1.0', contentUpdated: '2026-08-20',
      description: '羽毛球基本技术、规则与体能训练，期末进行对拉与比赛考核。',
      chapters: ['握拍与步法', '发球与接发', '高远球', '吊球与杀球', '比赛规则'],
    },
    {
      id: 'HI102', code: 'HI102', name: '中国近现代史纲要', teacher: '刘敏', dept: '马克思主义学院',
      credits: 2, capacity: 100, selected: 90, type: '公共必修', rating: 4.2,
      time: [{ day: 4, slot: 0 }],
      location: '博学楼 B203', weeks: '1-12 周', prereq: '无',
      status: 'open', contentVersion: 'v1.0', contentUpdated: '2026-08-18',
      description: '以专题方式梳理近现代中国的历史进程与关键转折。',
      chapters: ['导论', '民族危机与救亡', '革命与建国', '改革开放', '新时代'],
    },
    {
      id: 'CS220', code: 'CS220', name: '算法竞赛实训', teacher: '周明远', dept: '计算机学院',
      credits: 2, capacity: 30, selected: 12, type: '实践选修', rating: 4.9,
      time: [{ day: 0, slot: 0 }],
      location: '信息楼 B402', weeks: '3-14 周', prereq: '数据结构与算法',
      status: 'open', contentVersion: 'v1.0', contentUpdated: '2026-11-04',
      description: '以 ACM/ICPC 题型组织训练，每周一次专题赛与讲评。',
      chapters: ['贪心与构造', '动态规划', '图论', '数据结构进阶', '比赛复盘'],
    },
    {
      id: 'CS410', code: 'CS410', name: '分布式系统导论', teacher: '周明远', dept: '计算机学院',
      credits: 2, capacity: 1, selected: 0, type: '专业选修', rating: 4.8,
      time: [{ day: 4, slot: 3 }],
      location: '信息楼 B406', weeks: '1-12 周', prereq: '操作系统',
      status: 'open', contentVersion: 'v1.0', contentUpdated: '2026-11-05',
      description: '复制、共识、分区与容错。仅开放 1 个演示名额，用于并发抢课演示。',
      chapters: ['复制与一致性', '共识算法', '分区与容错', '分布式事务'],
    },
  ];

  const enrollments = [
    { id: 'en-1', studentId: ME, courseId: 'CS201', status: 'ENROLLED', studentName: '林知夏', enrolledAt: '2026-11-01 09:12', seq: null },
    { id: 'en-2', studentId: ME, courseId: 'CS303', status: 'ENROLLED', studentName: '林知夏', enrolledAt: '2026-11-01 09:14', seq: null },
    { id: 'en-3', studentId: ME, courseId: 'EN204', status: 'ENROLLED', studentName: '林知夏', enrolledAt: '2026-11-01 09:16', seq: null },
    { id: 'en-4', studentId: ME, courseId: 'CS305', status: 'WAITLIST', studentName: '林知夏', enrolledAt: '2026-11-02 10:05', seq: 1 },
    { id: 'en-5', studentId: '2023010188', courseId: 'CS201', status: 'WAITLIST', studentName: '张雨桐', enrolledAt: '2026-11-02 10:01', seq: 1, hasConflict: true },
    { id: 'en-6', studentId: '2023010231', courseId: 'CS201', status: 'WAITLIST', studentName: '王浩然', enrolledAt: '2026-11-02 10:02', seq: 2 },
  ];

  const applications = [
    {
      id: 'APP-2401', teacher: '周明远', courseName: '算法设计与分析', code: 'CS402',
      className: '计科 2301', capacity: 45, day: 2, slot: 3, location: '信息楼 B402',
      weeks: '1-16 周', status: 'PENDING', submittedAt: '2026-11-03 10:20',
      note: '面向大二下学期的专业选修，强调分治、动态规划与近似算法。',
    },
    {
      id: 'APP-2402', teacher: '周明远', courseName: '图神经网络专题', code: 'CS415',
      className: '计科 2302', capacity: 30, day: 4, slot: 4, location: '博学楼 C301',
      weeks: '3-14 周', status: 'DRAFT', submittedAt: null,
      note: '以论文研读和课程项目为主，需要先修机器学习基础。',
    },
    {
      id: 'APP-2403', teacher: '李明哲', courseName: '网络协议分析', code: 'CS312',
      className: '计科 2301', capacity: 40, day: 3, slot: 3, location: '信息楼 B201',
      weeks: '1-12 周', status: 'PENDING', submittedAt: '2026-11-04 14:10',
      note: '基于 Wireshark 与 Scapy 的协议分析实践课。',
    },
  ];

  const gradeBooks = [
    {
      id: 'GB-CS201', courseId: 'CS201', courseName: '数据结构与算法', className: '计科 2301',
      teacher: '周明远', status: 'DRAFT', submittedAt: null, publishedAt: null,
      students: [
        { id: ME, name: '林知夏', usual: 88, final: 92 },
        { id: '2023010188', name: '张雨桐', usual: 84, final: 79 },
        { id: '2023010231', name: '王浩然', usual: 91, final: 86 },
        { id: '2023010266', name: '陈子昂', usual: 76, final: 81 },
        { id: '2023010302', name: '许清和', usual: 93, final: 95 },
        { id: '2023010318', name: '周予安', usual: 69, final: 73 },
        { id: '2023010341', name: '沈星遥', usual: 82, final: 88 },
        { id: '2023010377', name: '顾言川', usual: 58, final: 64 },
      ],
    },
    {
      id: 'GB-CS305', courseId: 'CS305', courseName: '计算机网络', className: '计科 2301',
      teacher: '李明哲', status: 'SUBMITTED', submittedAt: '2026-11-05 16:20', publishedAt: null,
      students: [
        { id: '2023010188', name: '张雨桐', usual: 86, final: 84 },
        { id: '2023010231', name: '王浩然', usual: 78, final: 82 },
        { id: '2023010266', name: '陈子昂', usual: 90, final: 88 },
        { id: '2023010302', name: '许清和', usual: 83, final: 85 },
        { id: '2023010318', name: '周予安', usual: 72, final: 76 },
        { id: '2023010341', name: '沈星遥', usual: 88, final: 91 },
      ],
    },
  ];

  const publishedGrades = [
    { course: '高等数学（下）', credit: 4, usual: 92, final: 90, total: 90.6, gpa: 4.0, term: '2025-2026 春' },
    { course: '大学物理（上）', credit: 3, usual: 86, final: 88, total: 87.4, gpa: 3.7, term: '2025-2026 春' },
    { course: '程序设计基础', credit: 3, usual: 96, final: 94, total: 94.6, gpa: 4.0, term: '2025-2026 秋' },
    { course: '线性代数', credit: 3, usual: 89, final: 91, total: 90.4, gpa: 4.0, term: '2025-2026 秋' },
    { course: '形势与政策', credit: 1, usual: 88, final: 86, total: 86.6, gpa: 3.7, term: '2025-2026 秋' },
  ];

  return {
    version: 2,
    courses,
    enrollments,
    applications,
    gradeBooks,
    publishedGrades,
    evaluations: {
      CS201: { rating: 5, comment: '实验课节奏很好，复杂度分析讲得清楚。', at: '2026-11-06 21:10' },
    },
    evalStats: {
      CS201: { avg: 4.8, count: 46, dist: [34, 9, 2, 1, 0] },
      CS303: { avg: 4.6, count: 38, dist: [25, 10, 2, 1, 0] },
      EN204: { avg: 4.7, count: 41, dist: [29, 9, 2, 1, 0] },
    },
    roleMenus: {
      student: MENU_BY_ROLE.student.flatMap((g) => g.items),
      teacher: MENU_BY_ROLE.teacher.flatMap((g) => g.items),
      academic: MENU_BY_ROLE.academic.flatMap((g) => g.items),
      admin: MENU_BY_ROLE.admin.flatMap((g) => g.items),
    },
    users: [
      { name: '林知夏', id: '2023010421', role: '学生', dept: '计算机学院', status: '启用', last: '今天 09:12' },
      { name: '周明远', id: 'T2018042', role: '教师', dept: '计算机学院', status: '启用', last: '今天 08:40' },
      { name: '李明哲', id: 'T2017066', role: '教师', dept: '计算机学院', status: '启用', last: '昨天 17:05' },
      { name: '陈静', id: 'A2015008', role: '教务人员', dept: '教务处', status: '启用', last: '今天 08:02' },
      { name: '赵启明', id: 'S2014003', role: '系统管理员', dept: '信息中心', status: '启用', last: '今天 07:55' },
      { name: '王雪', id: 'T2019115', role: '教师', dept: '计算机学院', status: '启用', last: '昨天 15:28' },
      { name: '许婉', id: 'T2016031', role: '教师', dept: '外国语学院', status: '停用', last: '2026-08-30' },
    ],
    notifications: [
      { id: 'n1', title: '候补名额已更新', body: '计算机网络当前候补第 1 位，退课释放名额后将按顺序递补。', time: '今天 09:05', type: 'waitlist', read: false },
      { id: 'n2', title: '成绩发布提醒', body: '数据结构与算法成绩尚未发布，教师提交后由教务统一审核。', time: '昨天 18:20', type: 'grade', read: false },
      { id: 'n3', title: '选课窗口开放', body: '2026 秋季学期补退选开放至 11 月 12 日 21:00。', time: '11-07 09:00', type: 'course', read: false },
      { id: 'n4', title: '课程内容已更新', body: '操作系统第 4 章课件更新至 v2.1。', time: '11-06 16:40', type: 'content', read: true },
    ],
    audit: [
      { id: 'LOG-1024', time: '今天 09:12', actor: '林知夏', role: '学生', action: '选课', target: '数据结构与算法', detail: '事务提交，selected_count 58/58', requestId: 'req_8f2a91c4', result: '成功' },
      { id: 'LOG-1023', time: '今天 08:40', actor: '周明远', role: '教师', action: '提交开课申请', target: '算法设计与分析', detail: 'DRAFT → PENDING', requestId: 'req_4b7d20ea', result: '成功' },
      { id: 'LOG-1022', time: '今天 08:02', actor: '陈静', role: '教务人员', action: '调整容量', target: '计算机网络', detail: '55 → 60，触发候补递补', requestId: 'req_1c9e77b3', result: '成功' },
      { id: 'LOG-1021', time: '昨天 17:05', actor: '李明哲', role: '教师', action: '提交成绩', target: '计算机网络', detail: '6 名学生，DRAFT → SUBMITTED', requestId: 'req_6a30f1d9', result: '成功' },
    ],
    settings: {
      selectionOpen: true,
      creditLimit: 22,
      maxWaitlist: 3,
      semester: '2026 秋季学期',
      window: '09:00 - 21:00',
    },
  };
}

let state = loadState();
const ui = {
  courseTab: 'all',
  courseSearch: '',
  menuRole: 'student',
  gradeBook: 'GB-CS201',
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2) return parsed;
    }
  } catch (error) {
    console.warn('读取本地演示数据失败，将使用初始数据。', error);
  }
  return seedState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('保存本地演示数据失败。', error);
  }
}

/* ---------- Helpers ---------- */
function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function nowText() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function timeText() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function gpaFor(total) {
  if (total >= 90) return 4.0;
  if (total >= 85) return 3.7;
  if (total >= 82) return 3.3;
  if (total >= 78) return 3.0;
  if (total >= 75) return 2.7;
  if (total >= 72) return 2.3;
  if (total >= 68) return 2.0;
  if (total >= 64) return 1.5;
  if (total >= 60) return 1.0;
  return 0;
}

function totalScore(usual, final) {
  return Number((Number(usual) * 0.3 + Number(final) * 0.7).toFixed(1));
}

function courseById(id) {
  return state.courses.find((c) => c.id === id);
}

function bookById(id) {
  return state.gradeBooks.find((b) => b.id === id);
}

function currentEnrollment(courseId) {
  return state.enrollments.find((e) => e.studentId === ME && e.courseId === courseId && e.status !== 'CANCELLED');
}

function enrolledCourses() {
  return state.enrollments
    .filter((e) => e.studentId === ME && (e.status === 'ENROLLED' || e.status === 'PROMOTED'))
    .map((e) => courseById(e.courseId))
    .filter(Boolean);
}

function waitlistEntries() {
  return state.enrollments.filter((e) => e.studentId === ME && e.status === 'WAITLIST');
}

function currentCredits() {
  return enrolledCourses().reduce((sum, c) => sum + c.credits, 0);
}

function activeRole() {
  const route = parseRoute();
  return route ? route.role : 'student';
}

function pageForRole(role) {
  return state.roleMenus[role] || [];
}

function unreadCount() {
  return state.notifications.filter((n) => !n.read).length;
}

function hasConflict(course) {
  if (!course || !Array.isArray(course.time)) return false;
  return enrolledCourses().some((other) => other.id !== course.id &&
    other.time.some((a) => course.time.some((b) => a.day === b.day && a.slot === b.slot)));
}

function waitlistPosition(courseId) {
  const queue = state.enrollments
    .filter((e) => e.courseId === courseId && e.status === 'WAITLIST')
    .sort((a, b) => (a.seq || 0) - (b.seq || 0));
  const index = queue.findIndex((e) => e.studentId === ME);
  return index >= 0 ? index + 1 : 0;
}

function nextSeq(courseId) {
  const queue = state.enrollments.filter((e) => e.courseId === courseId && e.status === 'WAITLIST');
  return queue.reduce((max, e) => Math.max(max, e.seq || 0), 0) + 1;
}

function addAudit(action, target, detail = '') {
  const role = activeRole();
  const meta = ROLE_META[role];
  const id = 'LOG-' + (1030 + state.audit.length);
  state.audit.unshift({
    id,
    time: '今天 ' + timeText(),
    actor: meta.name,
    role: meta.label,
    action,
    target,
    detail,
    requestId: 'req_' + Math.random().toString(36).slice(2, 10),
    result: '成功',
  });
  state.audit = state.audit.slice(0, 48);
}

function pushNotification(title, body, type = 'info') {
  state.notifications.unshift({
    id: 'n' + Date.now(),
    title,
    body,
    time: '今天 ' + timeText(),
    type,
    read: false,
  });
  state.notifications = state.notifications.slice(0, 12);
}

function toast(message, type = 'success') {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  const glyph = type === 'error' ? 'alert' : type === 'warn' ? 'info' : 'check';
  el.innerHTML = `<span class="toast-icon">${icon(glyph, 18)}</span><span>${esc(message)}</span>`;
  root.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 260);
  }, 3200);
}

function icon(name, size = 18) {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    book: '<path d="M5 19.5A2.5 2.5 0 0 1 7.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/>',
    star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9L12 3z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a3 3 0 0 1 6 0"/><path d="M9 10h6M9 14h6M9 18h4"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    'check-square': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    cap: '<path d="m22 10-10-5L2 10l10 5 10-5z"/><path d="M6 12v5c0 2 2.7 3 6 3s6-1 6-3v-5"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    filter: '<path d="M3 5h18l-7 8v5l-4 2v-7L3 5z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
  };
  const body = paths[name] || paths.grid;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* ---------- Routing ---------- */
function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  if (!raw) return null;
  const parts = raw.split('/');
  const role = parts[0];
  const page = parts[1] || 'dashboard';
  if (!ROLE_META[role]) return null;
  return { role, page };
}

function navigate(role, page) {
  location.hash = `#/${role}/${page}`;
}

function render() {
  const route = parseRoute();
  const app = document.getElementById('app');
  if (!app) return;
  document.body.classList.remove('modal-open');
  closeModal();

  if (!route) {
    document.title = '知课教务 · 教务管理系统演示';
    app.innerHTML = renderLogin();
    return;
  }

  const allowed = pageForRole(route.role);
  const validPage = allowed.includes(route.page);
  const meta = PAGE_META[route.page] || PAGE_META.dashboard;
  document.title = `${meta.label} · 知课教务`;
  app.innerHTML = renderShell(route, validPage ? renderPage(route.role, route.page) : renderForbidden(route));
  if (validPage && route.page === 'courses') {
    applyCourseFilters();
  }
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderLogin() {
  const roles = ['student', 'teacher', 'academic', 'admin'];
  return `
    <div class="login">
      <div class="login-main">
        <div class="brand">
          <span class="brand-mark">知</span>
          <span>知课教务<small>ZHike Academic</small></span>
        </div>
        <div class="login-copy">
          <span class="eyebrow">2026 秋季学期 · 演示环境</span>
          <h1>把开课、选课、成绩与评教，收进一个入口。</h1>
          <p class="login-sub">四类角色，一套权限底座。学生少跑腿，教师少对表，教务看得见，管理员改得动。选择一个身份，直接进入对应的工作台。</p>
          <div class="login-proof">
            <div><strong>126</strong><span>门课程正在运行</span></div>
            <div><strong>1,000</strong><span>选课并发设计值</span></div>
            <div><strong>10 秒</strong><span>菜单变更生效上限</span></div>
          </div>
        </div>
        <div class="role-grid">
          ${roles.map((role) => {
            const m = ROLE_META[role];
            return `
              <button class="role-card" type="button" data-action="login" data-role="${role}">
                <span class="role-icon">${icon(m.icon, 18)}</span>
                <strong>${m.title}</strong>
                <span class="role-person">${m.name} · ${m.meta}</span>
                <span class="role-enter">${m.desc} ${icon('arrow', 14)}</span>
              </button>
            `;
          }).join('')}
        </div>
        <p class="login-note">演示环境免登录，数据只保存在当前浏览器。真实系统由飞书免登或学校统一认证接入。</p>
      </div>
      <aside class="login-preview" aria-label="今日教务预览">
        <div class="preview-shell">
          <div class="preview-top">
            <div>
              <div class="preview-title">今日教务</div>
              <div class="preview-date">2026 年 11 月 7 日 · 星期六</div>
            </div>
            <span class="live-pill">选课进行中</span>
          </div>
          <div class="preview-stats">
            <div class="preview-stat"><strong>126</strong><span>运行中的教学班</span></div>
            <div class="preview-stat"><strong>7</strong><span>待处理事项</span></div>
            <div class="preview-stat"><strong>986</strong><span>当前在线人数</span></div>
          </div>
          <div class="preview-card">
            <div class="preview-card-head"><span>今天 · 计算机学院</span><strong>3 节课</strong></div>
            <div class="preview-course">
              <div class="preview-time">08:00</div>
              <div><strong>数据结构与算法</strong><small>逸夫楼 A302 · 周明远</small></div>
            </div>
            <div class="preview-course">
              <div class="preview-time">10:00</div>
              <div><strong>操作系统</strong><small>逸夫楼 A401 · 王雪</small></div>
            </div>
            <div class="preview-course">
              <div class="preview-time">14:00</div>
              <div><strong>计算机网络</strong><small>信息楼 B201 · 李明哲</small></div>
            </div>
          </div>
          <div class="preview-foot">名额变化走同一套事务 · 关键操作写入审计 · 权限默认拒绝</div>
        </div>
      </aside>
    </div>
  `;
}

function renderShell(route, content) {
  const meta = ROLE_META[route.role];
  const pageMeta = PAGE_META[route.page] || PAGE_META.dashboard;
  const unread = unreadCount();
  return `
    <div class="app">
      <div class="sidebar-overlay" data-action="close-sidebar"></div>
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <span class="brand-mark">知</span>
          <span>知课教务<small>ZHike Academic</small></span>
        </div>
        <nav class="sidebar-nav" aria-label="主导航">
          ${renderSidebar(route)}
        </nav>
        <div class="sidebar-user">
          <div class="sidebar-user-row">
            <span class="avatar dark">${meta.initials}</span>
            <div><strong>${meta.name}</strong><span>${meta.meta}</span></div>
          </div>
          <div class="sidebar-actions">
            <button type="button" data-action="logout">退出演示</button>
            <button type="button" data-action="reset-data">重置数据</button>
          </div>
        </div>
      </aside>
      <div class="main">
        <header class="topbar">
          <button class="menu-toggle" type="button" data-action="toggle-sidebar" aria-label="打开导航">${icon('menu', 20)}</button>
          <div class="crumbs">
            <span>${meta.label}</span>
            <span>${icon('chevron-right', 12)}</span>
            <strong>${pageMeta.label}</strong>
          </div>
          <div class="topbar-right">
            <span class="semester-pill">${state.settings.semester}</span>
            <button class="icon-btn" type="button" data-action="nav" data-role="${route.role}" data-page="notices" aria-label="通知公告">
              ${icon('bell', 18)}
              ${unread ? '<span class="dot"></span>' : ''}
            </button>
            <select class="role-select" id="roleSelect" aria-label="切换当前角色">
              ${Object.entries(ROLE_META).map(([key, value]) => `<option value="${key}" ${key === route.role ? 'selected' : ''}>${value.label}</option>`).join('')}
            </select>
            <span class="avatar" title="${meta.name}">${meta.initials}</span>
          </div>
        </header>
        <main class="view" id="main">${content}</main>
      </div>
    </div>
  `;
}

function renderSidebar(route) {
  const menus = state.roleMenus[route.role] || [];
  const unread = unreadCount();
  return MENU_BY_ROLE[route.role].map((group) => {
    const items = group.items.filter((key) => menus.includes(key));
    if (!items.length) return '';
    return `
      <div class="nav-group">
        <div class="nav-label">${group.label}</div>
        ${items.map((key) => {
          const def = MENU_DEFS[key];
          const active = route.page === key;
          return `
            <a class="nav-link ${active ? 'active' : ''}" href="#/${route.role}/${key}" ${active ? 'aria-current="page"' : ''}>
              ${icon(def.icon, 18)}
              <span>${def.label}</span>
              ${key === 'notices' && unread ? `<span class="nav-badge">${unread}</span>` : ''}
            </a>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
}

function renderPage(role, page) {
  switch (page) {
    case 'dashboard': return renderDashboard(role);
    case 'courses': return renderCourses();
    case 'schedule': return renderSchedule(role);
    case 'grades': return renderGrades();
    case 'evaluation': return renderEvaluation();
    case 'notices': return renderNotices(role);
    case 'applications': return renderApplications();
    case 'my-courses': return renderMyCourses();
    case 'grade-entry': return renderGradeEntry();
    case 'evaluation-results': return renderEvaluationResults();
    case 'review-applications': return renderReviewApplications();
    case 'classes': return renderClasses();
    case 'catalog': return renderCatalog();
    case 'review-grades': return renderReviewGrades();
    case 'rules': return renderRules();
    case 'audit': return renderAudit();
    case 'users': return renderUsers();
    case 'roles': return renderRoles();
    case 'menus': return renderMenus();
    default: return renderForbidden({ role, page });
  }
}

function pageHead(title, sub, actions = '') {
  return `
    <div class="page-head">
      <div>
        <h1>${title}</h1>
        <p>${sub}</p>
      </div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ''}
    </div>
  `;
}

/* ---------- Dashboard ---------- */
function renderDashboard(role) {
  const meta = ROLE_META[role];
  const stats = dashboardStats(role);
  const firstName = meta.name.slice(0, 1);
  const hour = new Date().getHours();
  const greeting = hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好';
  return `
    ${pageHead(`${greeting}，${firstName}老师`.replace('老师', role === 'student' ? '同学' : role === 'academic' ? '老师' : role === 'admin' ? '老师' : '老师'), '这是您今天需要关注的教务动态。', '')}
    ${dashboardBanner(role)}
    <div class="stat-grid" style="margin-top: var(--s5);">
      ${stats.map((s) => statCard(s)).join('')}
    </div>
    <div class="dash-grid">
      <div class="panel">
        <div class="panel-head">
          <div><div class="panel-title">${role === 'admin' ? '系统待办' : role === 'academic' ? '待处理事项' : '今天要做的'}</div><div class="panel-sub">按截止时间排序</div></div>
          ${icon('clock', 18)}
        </div>
        <div class="panel-body">${dashboardTodos(role)}</div>
      </div>
      <div class="panel">
        <div class="panel-head">
          <div><div class="panel-title">${role === 'student' || role === 'teacher' ? '本周课表' : '系统动态'}</div><div class="panel-sub">${role === 'student' || role === 'teacher' ? '按当前角色生成' : '最近 24 小时'}</div></div>
        </div>
        <div class="panel-body">${role === 'student' || role === 'teacher' ? miniSchedule(role) : dashboardActivity(role)}</div>
      </div>
    </div>
    <div class="panel" style="margin-top: var(--s5);">
      <div class="panel-head">
        <div><div class="panel-title">最近通知</div><div class="panel-sub">与您当前角色相关的 2 条动态</div></div>
        <button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-role="${role}" data-page="notices">全部通知 ${icon('arrow', 14)}</button>
      </div>
      <div class="notice-list">
        ${state.notifications.slice(0, 2).map((n) => `
          <article class="notice-item ${n.read ? '' : 'unread'}">
            <span class="notice-mark"></span>
            <div style="flex:1;min-width:0;"><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p><time>${esc(n.time)}</time></div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function dashboardStats(role) {
  if (role === 'student') {
    return [
      { label: '已选学分', value: currentCredits().toFixed(1), unit: `/ ${state.settings.creditLimit}`, icon: 'chart', tone: 'blue', foot: '本学期 3 门课程' },
      { label: '候补中', value: waitlistEntries().length, unit: '门', icon: 'clock', tone: 'amber', foot: '计算机网络第 1 位' },
      { label: '待评价', value: enrolledCourses().filter((c) => !state.evaluations[c.id]).length, unit: '门', icon: 'star', tone: 'violet', foot: '评价截止 11 月 20 日' },
      { label: '成绩已发布', value: state.publishedGrades.length, unit: '门', icon: 'check', tone: 'green', foot: '上学期课程' },
    ];
  }
  if (role === 'teacher') {
    const books = state.gradeBooks.filter((b) => b.teacher === '周明远');
    return [
      { label: '授课班级', value: 3, unit: '个', icon: 'layers', tone: 'blue', foot: '本学期 126 名学生' },
      { label: '待提交成绩', value: books.filter((b) => b.status === 'DRAFT').length, unit: '份', icon: 'edit', tone: 'amber', foot: '数据结构与算法' },
      { label: '开课申请', value: state.applications.filter((a) => a.teacher === '周明远').length, unit: '项', icon: 'file', tone: 'violet', foot: '1 项待审核' },
      { label: '评教均分', value: '4.7', unit: '/ 5', icon: 'star', tone: 'green', foot: '样本 46 份' },
    ];
  }
  if (role === 'academic') {
    return [
      { label: '待审开课', value: state.applications.filter((a) => a.status === 'PENDING').length, unit: '项', icon: 'check-square', tone: 'amber', foot: '最早提交于 11 月 3 日' },
      { label: '待审成绩', value: state.gradeBooks.filter((b) => b.status === 'SUBMITTED').length, unit: '份', icon: 'check', tone: 'blue', foot: '计算机网络' },
      { label: '运行教学班', value: 126, unit: '个', icon: 'layers', tone: 'violet', foot: '本周新增 4 个' },
      { label: '选课异常', value: 0, unit: '条', icon: 'shield', tone: 'green', foot: '对账通过' },
    ];
  }
  return [
    { label: '启用账号', value: 5337, unit: '个', icon: 'users', tone: 'blue', foot: '本月新增 18 个' },
    { label: '角色', value: 4, unit: '个', icon: 'shield', tone: 'green', foot: '内置角色不可删除' },
    { label: '菜单节点', value: 26, unit: '个', icon: 'menu', tone: 'violet', foot: '含 8 个按钮权限' },
    { label: '今日审计', value: 18, unit: '条', icon: 'file', tone: 'amber', foot: '保留 180 天' },
  ];
}

function statCard(s) {
  return `
    <div class="stat">
      <div class="stat-top">
        <span class="stat-icon ${s.tone || ''}">${icon(s.icon, 18)}</span>
        <span class="stat-label">${s.label}</span>
      </div>
      <div class="stat-value">${s.value}<small>${s.unit || ''}</small></div>
      <div class="stat-foot">${s.foot || ''}</div>
    </div>
  `;
}

function dashboardBanner(role) {
  if (role === 'student') {
    return `
      <div class="banner" style="margin-top: var(--s5);">
        <div>
          <h2>补退选窗口开放中</h2>
          <p>当前还有 1 门候补课程，退课释放的名额会按队列顺序自动递补。</p>
        </div>
        <div class="banner-time">
          <div><div class="small muted">今日窗口</div><div class="banner-clock">${state.settings.window}</div></div>
          <button class="btn btn-primary" type="button" data-action="nav" data-role="student" data-page="courses">去选课 ${icon('arrow', 16)}</button>
        </div>
      </div>
    `;
  }
  if (role === 'teacher') {
    return `
      <div class="banner" style="margin-top: var(--s5);">
        <div>
          <h2>有 1 份成绩待提交</h2>
          <p>数据结构与算法已录入 8 名学生，提交后教师端锁定，等待教务审核。</p>
        </div>
        <div class="banner-time">
          <div><div class="small muted">截止时间</div><div class="banner-clock">11-12 18:00</div></div>
          <button class="btn btn-primary" type="button" data-action="nav" data-role="teacher" data-page="grade-entry">去录入 ${icon('arrow', 16)}</button>
        </div>
      </div>
    `;
  }
  if (role === 'academic') {
    return `
      <div class="banner" style="margin-top: var(--s5);">
        <div>
          <h2>${state.applications.filter((a) => a.status === 'PENDING').length} 个开课申请等待审核</h2>
          <p>通过后立即发布教学班；退回必须写清原因，教师可修改后重新提交。</p>
        </div>
        <div class="banner-time">
          <div><div class="small muted">承诺时限</div><div class="banner-clock">2 个工作日</div></div>
          <button class="btn btn-primary" type="button" data-action="nav" data-role="academic" data-page="review-applications">去审核 ${icon('arrow', 16)}</button>
        </div>
      </div>
    `;
  }
  return `
    <div class="banner" style="margin-top: var(--s5); border-color: #d9e3ff;">
      <div>
        <h2>权限变更，10 秒内联动四处</h2>
        <p>导航、面包屑、按钮与接口同时更新。前端隐藏只是体验，服务端校验才是边界。</p>
      </div>
      <div class="banner-time">
        <div><div class="small muted">最近变更</div><div class="banner-clock">2 分钟前</div></div>
        <button class="btn btn-primary" type="button" data-action="nav" data-role="admin" data-page="menus">去看菜单 ${icon('arrow', 16)}</button>
      </div>
    </div>
  `;
}

function dashboardTodos(role) {
  const items = role === 'student' ? [
    { title: '完成 2 门课程评价', sub: '操作系统、大学英语（四）尚未提交', tone: 'amber', page: 'evaluation', cta: '去评价' },
    { title: '确认计算机网络候补位次', sub: '当前第 1 位，退课释放后自动递补', tone: 'blue', page: 'courses', cta: '查看' },
    { title: '核对下周课表', sub: '周一第 1-2 节有数据结构实验', tone: 'green', page: 'schedule', cta: '看课表' },
  ] : role === 'teacher' ? [
    { title: '提交数据结构成绩', sub: '8 名学生已录入，提交后锁定', tone: 'amber', page: 'grade-entry', cta: '去提交' },
    { title: '跟进开课申请', sub: '算法设计与分析等待教务审核', tone: 'blue', page: 'applications', cta: '查看' },
    { title: '查看评教聚合结果', sub: '样本 46 份，均分 4.8', tone: 'green', page: 'evaluation-results', cta: '查看' },
  ] : role === 'academic' ? [
    { title: '审核 2 个开课申请', sub: '算法设计与分析、网络协议分析', tone: 'amber', page: 'review-applications', cta: '去审核' },
    { title: '审核计算机网络成绩', sub: '李明哲已提交 6 名学生', tone: 'blue', page: 'review-grades', cta: '去审核' },
    { title: '检查教学班容量', sub: '计算机网络 55/55，候补 1 人', tone: 'green', page: 'classes', cta: '去调整' },
  ] : [
    { title: '复核教师角色菜单', sub: '上次变更：2 分钟前，已生效', tone: 'blue', page: 'menus', cta: '去复核' },
    { title: '检查停用账号', sub: '许婉已停用，权限应立即失效', tone: 'amber', page: 'users', cta: '去查看' },
    { title: '导出本月审计', sub: '共 18 条，保留 180 天', tone: 'green', page: 'audit', cta: '去导出' },
  ];
  return `<div class="todo-list">${items.map((item) => `
    <div class="todo-item">
      <span class="todo-dot ${item.tone}"></span>
      <div><strong>${item.title}</strong><p>${item.sub}</p></div>
      <button class="btn btn-secondary btn-sm" type="button" data-action="nav" data-role="${role}" data-page="${item.page}">${item.cta}</button>
    </div>
  `).join('')}</div>`;
}

function miniSchedule(role) {
  const list = role === 'student' ? enrolledCourses() : state.courses.filter((c) => c.teacher === '周明远');
  const days = DAYS.map((day, index) => {
    const today = list.filter((c) => c.time.some((t) => t.day === index));
    return `
      <div class="mini-day">
        <h4>${day}</h4>
        ${today.length ? today.map((c, i) => `<div class="mini-course ${i % 2 ? 'green' : ''}" title="${esc(c.name)} · ${esc(c.location)}">${esc(c.name)}</div>`).join('') : '<div class="small faint" style="text-align:center;margin-top:16px;">无课</div>'}
      </div>
    `;
  }).join('');
  return `<div class="mini-schedule">${days}</div>
    <div class="course-note" style="margin-top: var(--s4);">${icon('info', 14)} 点击“我的课表”查看完整周视图</div>`;
}

function dashboardActivity(role) {
  const list = role === 'academic' ? [
    { title: '李明哲提交了计算机网络成绩', time: '今天 16:20', icon: 'check' },
    { title: '周明远提交了算法设计与分析开课申请', time: '今天 10:20', icon: 'file' },
    { title: '教学班容量调整：计算机网络 55 → 60', time: '今天 08:02', icon: 'layers' },
    { title: '选课对账完成，无计数漂移', time: '昨天 23:00', icon: 'shield' },
  ] : [
    { title: '教务发布了 2026 秋季补退选通知', time: '今天 09:00', icon: 'bell' },
    { title: '教师角色菜单新增“评教结果”', time: '昨天 17:40', icon: 'menu' },
    { title: '本月第 2 次权限复核完成', time: '昨天 14:10', icon: 'shield' },
    { title: '审计日志导出成功', time: '11-06 10:30', icon: 'download' },
  ];
  return `<div class="activity">${list.map((item) => `
    <div class="activity-item">
      <span class="activity-icon">${icon(item.icon, 15)}</span>
      <div><p>${esc(item.title)}</p><span>${item.time}</span></div>
    </div>
  `).join('')}</div>`;
}

/* ---------- Courses ---------- */
function renderCourses() {
  const total = enrolledCourses().length;
  const waitlist = waitlistEntries().length;
  return `
    ${pageHead('选课中心', PAGE_META.courses.sub, `
      <span class="chip green">${icon('clock', 13)} 窗口开放 ${state.settings.window}</span>
      <button class="btn btn-secondary btn-sm" type="button" data-action="demo-concurrency">${icon('refresh', 14)} 并发抢课演示</button>
    `)}
    <div class="toolbar">
      <div class="tabs" role="tablist" aria-label="课程筛选">
        ${[
          ['all', '全部课程'],
          ['open', '可选'],
          ['enrolled', '已选'],
          ['waitlist', '候补'],
        ].map(([key, label]) => `<button class="tab ${ui.courseTab === key ? 'active' : ''}" type="button" data-action="course-tab" data-tab="${key}">${label}</button>`).join('')}
      </div>
      <div class="search">
        ${icon('search', 16)}
        <input id="courseSearch" type="search" placeholder="搜索课程、教师或课程代码" value="${esc(ui.courseSearch)}" autocomplete="off">
      </div>
    </div>
    <div class="summary-line">
      <span>已选 <strong>${total}</strong> 门</span>
      <span>学分 <strong>${currentCredits().toFixed(1)}</strong> / ${state.settings.creditLimit}</span>
      <span>候补 <strong>${waitlist}</strong> 门</span>
      <span>${state.settings.selectionOpen ? '选课窗口开放中' : '选课窗口已关闭'}</span>
    </div>
    <div class="course-grid" id="courseGrid">
      ${state.courses.map((c) => renderCourseCard(c)).join('')}
    </div>
    <div id="courseEmpty" class="empty" style="display:none;">
      <div class="empty-icon">${icon('search', 20)}</div>
      <h3>没有匹配的课程</h3>
      <p>换一个关键词，或切换到“全部课程”。</p>
    </div>
    <div class="panel" style="margin-top: var(--s6);">
      <div class="panel-head">
        <div><div class="panel-title">工程校验</div><div class="panel-sub">名额与幂等是这门系统最硬的约束</div></div>
        <span class="chip blue">规则已启用</span>
      </div>
      <div class="panel-body">
        <div class="list">
          <div class="list-row"><div class="list-main"><strong>唯一约束</strong><span>同一学生对同一教学班只允许一条有效选课记录</span></div><span class="chip green">enrollments</span></div>
          <div class="list-row"><div class="list-main"><strong>原子占名额</strong><span>selected_count + 1 必须带 selected_count &lt; capacity 条件</span></div><span class="chip green">事务</span></div>
          <div class="list-row"><div class="list-main"><strong>候补 FIFO</strong><span>按 seq 严格排序；资格不通过标 EXPIRED 并跳下一位</span></div><span class="chip green">队列</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderCourseCard(course) {
  const enrollment = currentEnrollment(course.id);
  const isEnrolled = enrollment && (enrollment.status === 'ENROLLED' || enrollment.status === 'PROMOTED');
  const isWaitlist = enrollment && enrollment.status === 'WAITLIST';
  const full = course.selected >= course.capacity;
  const conflict = !isEnrolled && !isWaitlist && hasConflict(course);
  const percent = Math.min(100, Math.round((course.selected / course.capacity) * 100));
  const barClass = full ? 'full' : percent >= 85 ? 'warn' : '';
  let actions = '';
  let note = '';

  if (isEnrolled) {
    actions = `
      <button class="btn btn-secondary btn-sm" type="button" data-action="open-course" data-id="${course.id}">课程详情</button>
      <button class="btn btn-danger btn-sm" type="button" data-action="drop-course" data-id="${course.id}">退课</button>
    `;
    note = `${icon('check', 13)} 已加入课表，退课会释放名额并按队列递补`;
  } else if (isWaitlist) {
    actions = `
      <button class="btn btn-secondary btn-sm" type="button" data-action="open-course" data-id="${course.id}">课程详情</button>
      <button class="btn btn-ghost btn-sm" type="button" data-action="cancel-waitlist" data-id="${course.id}">取消候补</button>
    `;
    note = `${icon('clock', 13)} 候补第 ${waitlistPosition(course.id)} 位，退课释放后自动递补`;
  } else if (conflict) {
    actions = `<button class="btn btn-secondary btn-sm" type="button" disabled>时间冲突</button>
      <button class="btn btn-ghost btn-sm" type="button" data-action="open-course" data-id="${course.id}">查看冲突</button>`;
    note = `${icon('alert', 13)} 与已选课程时间重叠，先退课再选`;
  } else if (full) {
    actions = `<button class="btn btn-secondary btn-sm" type="button" data-action="open-course" data-id="${course.id}">课程详情</button>
      <button class="btn btn-primary btn-sm" type="button" data-action="join-waitlist" data-id="${course.id}">加入候补</button>`;
    note = `${icon('clock', 13)} 已满员，加入候补后按申请顺序递补`;
  } else {
    actions = `<button class="btn btn-secondary btn-sm" type="button" data-action="open-course" data-id="${course.id}">课程详情</button>
      <button class="btn btn-primary btn-sm" type="button" data-action="select-course" data-id="${course.id}">选课</button>`;
    note = `${icon('check', 13)} 名额充足，提交后课表立即刷新`;
  }

  return `
    <article class="course-card" data-course-card data-name="${esc(course.name + ' ' + course.teacher + ' ' + course.code)}" data-state="${isEnrolled ? 'enrolled' : isWaitlist ? 'waitlist' : (!full && !conflict ? 'open' : 'other')}">
      <div class="course-top">
        <span class="code">${course.code}</span>
        <span class="chip ${course.type === '专业必修' ? 'blue' : course.type === '通识选修' ? 'violet' : 'green'}">${course.type}</span>
      </div>
      <h3>${esc(course.name)}</h3>
      <div class="course-sub">${esc(course.teacher)} · ${esc(course.dept)}</div>
      <div class="course-meta">
        <span>${icon('clock', 14)} ${course.time.map((t) => `${DAYS[t.day]} ${SLOT_LABELS[t.slot]}`).join(' / ')}</span>
        <span>${icon('pin', 14)} ${esc(course.location)}</span>
        <span>${icon('book', 14)} ${course.credits} 学分</span>
      </div>
      <div class="capacity">
        <div class="capacity-row"><span>容量</span><strong>${course.selected} / ${course.capacity} 人</strong></div>
        <div class="bar ${barClass}"><span style="width:${percent}%"></span></div>
      </div>
      <div class="course-note">${note}</div>
      <div class="course-actions">${actions}</div>
    </article>
  `;
}

function applyCourseFilters() {
  const cards = Array.from(document.querySelectorAll('[data-course-card]'));
  const q = (ui.courseSearch || '').trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const text = (card.dataset.name || '').toLowerCase();
    const stateName = card.dataset.state;
    const matchQuery = !q || text.includes(q);
    const matchTab = ui.courseTab === 'all' ||
      (ui.courseTab === 'open' && stateName === 'open') ||
      (ui.courseTab === 'enrolled' && stateName === 'enrolled') ||
      (ui.courseTab === 'waitlist' && stateName === 'waitlist');
    const show = matchQuery && matchTab;
    card.style.display = show ? '' : 'none';
    if (show) visible += 1;
  });
  const empty = document.getElementById('courseEmpty');
  if (empty) empty.style.display = visible ? 'none' : 'block';
}

/* ---------- Schedule ---------- */
function renderSchedule(role) {
  const list = role === 'student' ? enrolledCourses() : state.courses.filter((c) => c.teacher === '周明远');
  const cells = [];
  for (let slot = 0; slot < SLOTS.length; slot += 1) {
    cells.push(`<div class="tt-slot"><strong>${SLOT_LABELS[slot]}</strong>${SLOTS[slot]}</div>`);
    for (let day = 0; day < DAYS.length; day += 1) {
      const course = list.find((c) => c.time.some((t) => t.day === day && t.slot === slot));
      cells.push(`
        <div class="tt-cell">
          ${course ? `<div class="tt-course ${course.type === '通识选修' ? 'green' : course.type === '实践选修' ? 'amber' : ''}">
            <strong>${esc(course.name)}</strong>
            <span>${esc(course.location)}</span>
            <span>${esc(course.teacher)}</span>
          </div>` : ''}
        </div>
      `);
    }
  }
  const mobile = DAYS.map((day, index) => {
    const courses = list.filter((c) => c.time.some((t) => t.day === index)).sort((a, b) => {
      const slotA = a.time.find((t) => t.day === index)?.slot ?? 99;
      const slotB = b.time.find((t) => t.day === index)?.slot ?? 99;
      return slotA - slotB || a.name.localeCompare(b.name, 'zh');
    });
    if (!courses.length) return '';
    return `<div class="day-list"><h3>${day}</h3>${courses.map((c) => `
      <div class="day-course">
        <span class="day-time">${SLOTS[c.time.find((t) => t.day === index).slot]}</span>
        <div><strong>${esc(c.name)}</strong><span>${esc(c.location)} · ${esc(c.teacher)}</span></div>
      </div>
    `).join('')}</div>`;
  }).join('');

  return `
    ${pageHead('我的课表', PAGE_META.schedule.sub, `<span class="chip blue">${state.settings.semester}</span>`)}
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">周视图</div><div class="panel-sub">第 9 周 · 11 月 2 日至 11 月 6 日</div></div><span class="chip green">${list.length} 门课程</span></div>
      <div class="panel-body">
        <div class="timetable-wrap">
          <div class="timetable">
            <div class="tt-head">节次</div>
            ${DAYS.map((d, i) => `<div class="tt-head">${d}<span>9/${14 + i}</span></div>`).join('')}
            ${cells.join('')}
          </div>
        </div>
        <div class="mobile-schedule">${mobile || '<div class="empty"><p>本周暂无课程。</p></div>'}</div>
      </div>
    </div>
    <div class="panel" style="margin-top: var(--s5);">
      <div class="panel-head"><div><div class="panel-title">课程清单</div><div class="panel-sub">按课程代码排序</div></div></div>
      <div class="panel-body">
        <div class="list">
          ${list.slice().sort((a, b) => a.code.localeCompare(b.code)).map((c) => `
            <div class="list-row">
              <span class="avatar">${esc(c.name.slice(0, 1))}</span>
              <div class="list-main"><strong>${esc(c.name)}</strong><span>${c.code} · ${esc(c.teacher)} · ${c.credits} 学分</span></div>
              <span class="chip">${c.time.map((t) => DAYS[t.day]).join(' / ')}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ---------- Grades ---------- */
function renderGrades() {
  const termKey = (term) => {
    const year = Number((term.match(/\d{4}/) || ['0'])[0]);
    const season = term.endsWith('春') ? 2 : 1;
    return year * 10 + season;
  };
  const rows = [...state.publishedGrades].sort((a, b) => termKey(b.term) - termKey(a.term));
  const gpa = rows.length ? (rows.reduce((sum, r) => sum + r.gpa * r.credit, 0) / rows.reduce((sum, r) => sum + r.credit, 0)).toFixed(2) : '—';
  const credits = rows.reduce((sum, r) => sum + r.credit, 0);
  const current = enrolledCourses().map((c) => {
    const book = state.gradeBooks.find((b) => b.courseId === c.id && b.status === 'PUBLISHED');
    const row = book && book.students.find((s) => s.id === ME);
    return {
      course: c.name,
      credit: c.credits,
      total: row ? totalScore(row.usual, row.final) : null,
      status: row ? '已发布' : '待发布',
    };
  });
  return `
    ${pageHead('我的成绩', PAGE_META.grades.sub, `<span class="chip blue">仅显示已发布成绩</span>`)}
    <div class="stat-grid">
      ${statCard({ label: '平均绩点', value: gpa, unit: '/ 4.0', icon: 'chart', tone: 'blue', foot: '已修课程加权' })}
      ${statCard({ label: '已修学分', value: credits, unit: '分', icon: 'book', tone: 'green', foot: '不含本学期在修' })}
      ${statCard({ label: '专业排名', value: '8', unit: '/ 126', icon: 'users', tone: 'violet', foot: '前 6.3%' })}
      ${statCard({ label: '待发布', value: current.filter((c) => c.status === '待发布').length, unit: '门', icon: 'clock', tone: 'amber', foot: '教师提交后由教务发布' })}
    </div>
    <div class="panel" style="margin-top: var(--s5);">
      <div class="panel-head"><div><div class="panel-title">本学期课程</div><div class="panel-sub">成绩发布前显示“待发布”</div></div></div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>课程</th><th>学分</th><th>总评</th><th>绩点</th><th>状态</th></tr></thead>
            <tbody>
              ${current.map((c) => `<tr><td>${esc(c.course)}</td><td>${c.credit}</td><td>${c.total == null ? '—' : c.total}</td><td>${c.total == null ? '—' : gpaFor(c.total)}</td><td><span class="chip ${c.status === '已发布' ? 'green' : 'amber'}">${c.status}</span></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="panel" style="margin-top: var(--s5);">
      <div class="panel-head"><div><div class="panel-title">历史成绩</div><div class="panel-sub">按学期倒序</div></div><span class="chip">共 ${rows.length} 门</span></div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>学期</th><th>课程</th><th>学分</th><th>平时</th><th>期末</th><th>总评</th><th>绩点</th></tr></thead>
            <tbody>
              ${rows.map((r) => `<tr><td>${esc(r.term)}</td><td>${esc(r.course)}</td><td>${r.credit}</td><td>${r.usual}</td><td>${r.final}</td><td><strong>${r.total}</strong></td><td>${r.gpa.toFixed(1)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="course-note" style="margin-top: var(--s4);">${icon('info', 14)} 成绩更正需提交申请，经教务审批后生成 CORRECTED 记录，保留原值与理由。</div>
      </div>
    </div>
  `;
}

/* ---------- Evaluation ---------- */
function renderEvaluation() {
  const courses = enrolledCourses();
  return `
    ${pageHead('课程评价', PAGE_META.evaluation.sub, `<span class="chip green">匿名提交 · 每课一次</span>`)}
    <div class="course-grid">
      ${courses.map((c) => {
        const done = state.evaluations[c.id];
        return `
          <article class="course-card">
            <div class="course-top"><span class="code">${c.code}</span><span class="chip ${done ? 'green' : 'amber'}">${done ? '已完成' : '待评价'}</span></div>
            <h3>${esc(c.name)}</h3>
            <div class="course-sub">${esc(c.teacher)} · ${c.credits} 学分</div>
            <div class="course-meta"><span>${icon('clock', 14)} ${c.time.map((t) => `${DAYS[t.day]} ${SLOT_LABELS[t.slot]}`).join(' / ')}</span></div>
            <div style="margin-top: var(--s4);">
              ${done ? `<div class="stars" aria-label="评分 ${done.rating} 星">${[1,2,3,4,5].map((n) => `<span style="color:${n <= done.rating ? '#e0a400' : '#d7dbe3'};font-size:24px;">★</span>`).join('')}</div><p class="small muted" style="margin-top:var(--s3);">${esc(done.comment || '已提交匿名评价。')}</p>` : `<p class="small muted">评价包含 5 项指标与一段匿名文本，教师端只看到聚合结果。</p>`}
            </div>
            <div class="course-actions">
              ${done ? `<span class="chip green">${icon('check', 12)} 已提交</span>` : `<button class="btn btn-primary" type="button" data-action="evaluate" data-id="${c.id}">开始评价 ${icon('arrow', 14)}</button>`}
            </div>
          </article>
        `;
      }).join('')}
    </div>
    <div class="panel" style="margin-top: var(--s5);">
      <div class="panel-head"><div><div class="panel-title">评价说明</div></div></div>
      <div class="panel-body">
        <div class="list">
          <div class="list-row"><div class="list-main"><strong>匿名保护</strong><span>不存储学生 ID 与评价正文的明文关联；样本小于 5 不展示明细。</span></div>${icon('shield', 18)}</div>
          <div class="list-row"><div class="list-main"><strong>每课一次</strong><span>提交后不可重复评价，可在截止前联系教务撤回。</span></div>${icon('check', 18)}</div>
        </div>
      </div>
    </div>
  `;
}

function renderEvaluationResults() {
  const courses = ['CS201', 'CS303', 'EN204'].map((id) => courseById(id)).filter(Boolean);
  return `
    ${pageHead('评教结果', PAGE_META['evaluation-results'].sub, `<span class="chip blue">聚合视图</span>`)}
    <div class="course-grid">
      ${courses.map((c) => {
        const stat = state.evalStats[c.id] || { avg: 0, count: 0, dist: [0,0,0,0,0] };
        const total = stat.dist.reduce((a, b) => a + b, 0) || 1;
        return `
          <article class="course-card">
            <div class="course-top"><span class="code">${c.code}</span><span class="chip ${stat.count >= 5 ? 'green' : 'amber'}">${stat.count >= 5 ? '样本充足' : '样本不足'}</span></div>
            <h3>${esc(c.name)}</h3>
            <div class="course-sub">${esc(c.teacher)} · ${stat.count} 份匿名样本</div>
            <div style="display:flex;align-items:baseline;gap:8px;margin-top:var(--s4);"><span style="font-size:var(--t-3xl);line-height:var(--lh-3xl);font-weight:600;">${stat.avg.toFixed(1)}</span><span class="muted">/ 5.0</span></div>
            <div class="progress-list" style="margin-top:var(--s4);">
              ${[5,4,3,2,1].map((n, i) => `<div class="progress-item"><span>${n} 星</span><div class="bar blue"><span style="width:${Math.round((stat.dist[i] / total) * 100)}%"></span></div><span>${stat.dist[i]}</span></div>`).join('')}
            </div>
            <div class="course-note" style="margin-top:var(--s4);">${icon('shield', 13)} 明细在样本 ≥ 5 时展示，正文已匿名</div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

/* ---------- Notices ---------- */
function renderNotices(role) {
  const canPublish = role === 'academic' || role === 'admin';
  return `
    ${pageHead('通知公告', PAGE_META.notices.sub, `
      ${canPublish ? `<button class="btn btn-primary" type="button" data-action="publish-notice">${icon('plus', 15)} 发布通知</button>` : ''}
      <button class="btn btn-secondary" type="button" data-action="mark-read">全部标为已读</button>
    `)}
    <div class="panel">
      <div class="notice-list">
        ${state.notifications.map((n) => `
          <article class="notice-item ${n.read ? '' : 'unread'}">
            <span class="notice-mark"></span>
            <div style="flex:1;min-width:0;">
              <strong>${esc(n.title)}</strong>
              <p>${esc(n.body)}</p>
              <time>${esc(n.time)}</time>
            </div>
            <span class="chip ${n.type === 'grade' ? 'green' : n.type === 'waitlist' ? 'amber' : 'blue'}">${n.type === 'grade' ? '成绩' : n.type === 'waitlist' ? '候补' : n.type === 'content' ? '课程' : '选课'}</span>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

/* ---------- Teacher applications ---------- */
function renderApplications() {
  const list = state.applications.filter((a) => a.teacher === '周明远');
  return `
    ${pageHead('开课申请', PAGE_META.applications.sub, `<button class="btn btn-primary" type="button" data-action="open-application">${icon('plus', 15)} 新建申请</button>`)}
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">我的申请</div><div class="panel-sub">草稿可改，提交后锁定，退回后可改再提</div></div><span class="chip">${list.length} 项</span></div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>课程</th><th>教学班</th><th>时间 / 地点</th><th>容量</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              ${list.map((a) => `<tr>
                <td><strong>${esc(a.courseName)}</strong><span class="sub">${a.code}</span></td>
                <td>${esc(a.className)}</td>
                <td>${DAYS[a.day]} ${SLOT_LABELS[a.slot]}<span class="sub">${esc(a.location)}</span></td>
                <td>${a.capacity}</td>
                <td><span class="chip ${a.status === 'PENDING' ? 'amber' : a.status === 'DRAFT' ? '' : a.status === 'PUBLISHED' ? 'green' : 'red'}">${statusLabel(a.status)}</span></td>
                <td>
                  ${a.status === 'DRAFT' ? `<button class="btn btn-secondary btn-sm" type="button" data-action="edit-application" data-id="${a.id}">编辑</button> <button class="btn btn-primary btn-sm" type="button" data-action="submit-application" data-id="${a.id}">提交审核</button>` : ''}
                  ${a.status === 'PENDING' ? `<button class="btn btn-ghost btn-sm" type="button" data-action="withdraw-application" data-id="${a.id}">撤回</button>` : ''}
                  ${a.status === 'REJECTED' ? `<button class="btn btn-secondary btn-sm" type="button" data-action="edit-application" data-id="${a.id}">修改重提</button>` : ''}
                  ${a.status === 'PUBLISHED' ? `<span class="small muted">已发布</span>` : ''}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="panel" style="margin-top: var(--s5);">
      <div class="panel-head"><div><div class="panel-title">审核链路</div><div class="panel-sub">教师只负责申请与内容，发布权在教务</div></div><span class="chip blue">3 个节点</span></div>
      <div class="panel-body">
        <div class="list">
          <div class="list-row"><span class="avatar">1</span><div class="list-main"><strong>草稿与提交</strong><span>填课程、教学班、容量、时间地点；提交后锁定，不能改字段。</span></div><span class="chip">当前</span></div>
          <div class="list-row"><span class="avatar">2</span><div class="list-main"><strong>教务审核</strong><span>教务检查教师、教室、教学班三重冲突；退回必须写原因。</span></div><span class="chip">待审</span></div>
          <div class="list-row"><span class="avatar">3</span><div class="list-main"><strong>发布教学班</strong><span>通过后生成可选教学班，学生端选课中心立刻出现。</span></div><span class="chip green">自动</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderMyCourses() {
  const list = state.courses.filter((c) => c.teacher === '周明远');
  return `
    ${pageHead('我的课程', PAGE_META['my-courses'].sub, `<span class="chip blue">${list.length} 门课程</span>`)}
    <div class="course-grid">
      ${list.map((c) => `
        <article class="course-card">
          <div class="course-top"><span class="code">${c.code}</span><span class="chip ${c.status === 'open' ? 'green' : ''}">${c.status === 'open' ? '已发布' : '已关闭'}</span></div>
          <h3>${esc(c.name)}</h3>
          <div class="course-sub">${c.selected} / ${c.capacity} 人 · ${c.credits} 学分</div>
          <div class="course-meta">
            <span>${icon('clock', 14)} ${c.time.map((t) => `${DAYS[t.day]} ${SLOT_LABELS[t.slot]}`).join(' / ')}</span>
            <span>${icon('pin', 14)} ${esc(c.location)}</span>
          </div>
          <div class="course-note" style="margin-top:var(--s4);">${icon('file', 13)} 内容版本 ${c.contentVersion} · 更新于 ${c.contentUpdated}</div>
          <div class="course-actions">
            <button class="btn btn-secondary btn-sm" type="button" data-action="edit-content" data-id="${c.id}">编辑课程内容</button>
            <button class="btn btn-ghost btn-sm" type="button" data-action="nav" data-role="teacher" data-page="evaluation-results">看评教</button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function renderGradeEntry() {
  const books = state.gradeBooks.filter((b) => b.teacher === '周明远');
  const book = books.find((b) => b.id === ui.gradeBook) || books[0];
  if (!book) {
    return `${pageHead('成绩录入', PAGE_META['grade-entry'].sub)}<div class="empty"><h3>暂无待录入成绩的班级</h3></div>`;
  }
  const locked = book.status !== 'DRAFT';
  return `
    ${pageHead('成绩录入', PAGE_META['grade-entry'].sub, `<span class="chip ${locked ? 'green' : 'amber'}">${statusLabel(book.status)}</span>`)}
    <div class="panel">
      <div class="panel-head">
        <div><div class="panel-title">${esc(book.courseName)} · ${esc(book.className)}</div><div class="panel-sub">平时 30% + 期末 70%；提交后锁定，等待教务审核</div></div>
        ${books.length > 1 ? `<select class="role-select" id="gradeBookSelect">${books.map((b) => `<option value="${b.id}" ${b.id === book.id ? 'selected' : ''}>${esc(b.courseName)}</option>`).join('')}</select>` : ''}
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>学生</th><th>学号</th><th>平时</th><th>期末</th><th>总评</th><th>绩点</th></tr></thead>
            <tbody>
              ${book.students.map((s) => {
                const total = totalScore(s.usual, s.final);
                return `<tr data-student-row="${s.id}">
                  <td><strong>${esc(s.name)}</strong></td>
                  <td class="mono">${s.id}</td>
                  <td><input class="field" style="min-height:34px;width:80px;padding:5px 8px;" type="number" min="0" max="100" value="${s.usual}" data-grade data-student="${s.id}" data-field="usual" ${locked ? 'disabled' : ''}></td>
                  <td><input class="field" style="min-height:34px;width:80px;padding:5px 8px;" type="number" min="0" max="100" value="${s.final}" data-grade data-student="${s.id}" data-field="final" ${locked ? 'disabled' : ''}></td>
                  <td><strong data-total>${total.toFixed(1)}</strong></td>
                  <td data-gpa>${gpaFor(total).toFixed(1)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div class="course-note" style="margin-top: var(--s4);">${icon('info', 14)} 总评 = 平时 × 30% + 期末 × 70%；绩点按学校换算规则计算。</div>
      </div>
      <div class="panel-foot" style="display:flex;justify-content:flex-end;gap:var(--s3);">
        ${locked ? `<span class="chip green">${icon('check', 12)} 已提交，等待教务审核</span>` : `<button class="btn btn-primary" type="button" data-action="submit-grades" data-id="${book.id}">提交审核</button>`}
      </div>
    </div>
  `;
}

/* ---------- Academic ---------- */
function renderReviewApplications() {
  const list = state.applications.filter((a) => a.status === 'PENDING');
  return `
    ${pageHead('开课审核', PAGE_META['review-applications'].sub, `<span class="chip amber">${list.length} 项待审</span>`)}
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">待审核申请</div><div class="panel-sub">通过后立即发布教学班；退回必须写原因</div></div></div>
      <div class="panel-body">
        ${list.length ? `<div class="list">${list.map((a) => `
          <div class="list-row" style="align-items:flex-start;">
            <span class="avatar">${esc(a.courseName.slice(0, 1))}</span>
            <div class="list-main">
              <strong>${esc(a.courseName)} <span class="code">${a.code}</span></strong>
              <span>${esc(a.teacher)} · ${esc(a.className)} · ${a.capacity} 人 · ${DAYS[a.day]} ${SLOT_LABELS[a.slot]} · ${esc(a.location)}</span>
              <span>${esc(a.note)}</span>
            </div>
            <div style="display:flex;gap:var(--s2);flex-wrap:wrap;justify-content:flex-end;">
              <button class="btn btn-secondary btn-sm" type="button" data-action="reject-application" data-id="${a.id}">退回</button>
              <button class="btn btn-primary btn-sm" type="button" data-action="approve-application" data-id="${a.id}">通过并发布</button>
            </div>
          </div>
        `).join('')}</div>` : `<div class="empty"><div class="empty-icon">${icon('check', 20)}</div><h3>没有待审核的开课申请</h3><p>教师提交后会出现在这里。</p></div>`}
      </div>
    </div>
    <div class="panel" style="margin-top: var(--s5);">
      <div class="panel-head"><div><div class="panel-title">通过之后发生什么</div><div class="panel-sub">一次操作，三处联动</div></div></div>
      <div class="panel-body">
        <div class="list">
          <div class="list-row"><span class="avatar">1</span><div class="list-main"><strong>生成教学班</strong><span>课程、教师、容量、时间地点写入教学班；学生端选课中心可见。</span></div><span class="chip green">发布</span></div>
          <div class="list-row"><span class="avatar">2</span><div class="list-main"><strong>写入审计</strong><span>记录审核人、时间、结论与退回原因，保留 180 天。</span></div><span class="chip">留痕</span></div>
          <div class="list-row"><span class="avatar">3</span><div class="list-main"><strong>通知教师</strong><span>飞书卡片推送结果；退回时附原因，教师可修改重提。</span></div><span class="chip blue">消息</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderClasses() {
  return `
    ${pageHead('教学班与排课', PAGE_META.classes.sub, `<span class="chip green">冲突检测开启</span>`)}
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">运行中的教学班</div><div class="panel-sub">容量调整会触发候补递补，一次退课只补 1 人</div></div><span class="chip">${state.courses.length} 个</span></div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>课程</th><th>教师</th><th>时间 / 地点</th><th>选课 / 容量</th><th>候补</th><th>操作</th></tr></thead>
            <tbody>
              ${state.courses.map((c) => {
                const wait = state.enrollments.filter((e) => e.courseId === c.id && e.status === 'WAITLIST').length;
                return `<tr>
                  <td><strong>${esc(c.name)}</strong><span class="sub">${c.code}</span></td>
                  <td>${esc(c.teacher)}</td>
                  <td>${c.time.map((t) => `${DAYS[t.day]} ${SLOT_LABELS[t.slot]}`).join(' / ')}<span class="sub">${esc(c.location)}</span></td>
                  <td><span class="mono">${c.selected} / ${c.capacity}</span><div class="bar ${c.selected >= c.capacity ? 'full' : 'blue'}" style="margin-top:5px;"><span style="width:${Math.min(100, Math.round(c.selected / c.capacity * 100))}%"></span></div></td>
                  <td>${wait ? `<span class="chip amber">${wait} 人</span>` : '<span class="faint">—</span>'}</td>
                  <td><button class="btn btn-secondary btn-sm" type="button" data-action="adjust-capacity" data-id="${c.id}">容量 +5</button></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderCatalog() {
  return `
    ${pageHead('课程库', PAGE_META.catalog.sub, `<span class="chip blue">${state.courses.length} 门课程</span>`)}
    <div class="panel">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>代码</th><th>课程</th><th>开课单位</th><th>学分</th><th>类型</th><th>先修</th><th>状态</th></tr></thead>
            <tbody>
              ${state.courses.map((c) => `<tr><td class="mono">${c.code}</td><td><strong>${esc(c.name)}</strong></td><td>${esc(c.dept)}</td><td>${c.credits}</td><td><span class="chip">${c.type}</span></td><td>${esc(c.prereq)}</td><td><span class="chip ${c.status === 'open' ? 'green' : ''}">${c.status === 'open' ? '开放' : '关闭'}</span></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderReviewGrades() {
  const list = state.gradeBooks.filter((b) => b.status === 'SUBMITTED' || b.status === 'REVIEWED');
  return `
    ${pageHead('成绩审核', PAGE_META['review-grades'].sub, `<span class="chip amber">${list.length} 份待处理</span>`)}
    ${list.length ? list.map((b) => {
      const avg = b.students.reduce((sum, s) => sum + totalScore(s.usual, s.final), 0) / b.students.length;
      return `
        <div class="panel" style="margin-bottom: var(--s4);">
          <div class="panel-head"><div><div class="panel-title">${esc(b.courseName)} · ${esc(b.className)}</div><div class="panel-sub">${esc(b.teacher)} 提交 · ${b.students.length} 名学生 · 平均 ${avg.toFixed(1)} 分</div></div><span class="chip ${b.status === 'REVIEWED' ? 'blue' : 'amber'}">${statusLabel(b.status)}</span></div>
          <div class="panel-body">
            <div class="table-wrap">
              <table>
                <thead><tr><th>学生</th><th>学号</th><th>平时</th><th>期末</th><th>总评</th><th>绩点</th></tr></thead>
                <tbody>${b.students.map((s) => `<tr><td>${esc(s.name)}</td><td class="mono">${s.id}</td><td>${s.usual}</td><td>${s.final}</td><td><strong>${totalScore(s.usual, s.final).toFixed(1)}</strong></td><td>${gpaFor(totalScore(s.usual, s.final)).toFixed(1)}</td></tr>`).join('')}</tbody>
              </table>
            </div>
          </div>
          <div class="panel-foot" style="display:flex;justify-content:flex-end;gap:var(--s3);">
            ${b.status === 'SUBMITTED' ? `<button class="btn btn-secondary" type="button" data-action="review-grades" data-id="${b.id}">审核通过</button>` : `<button class="btn btn-primary" type="button" data-action="publish-grades" data-id="${b.id}">发布成绩</button>`}
          </div>
        </div>
      `;
    }).join('') : `<div class="empty"><div class="empty-icon">${icon('check', 20)}</div><h3>没有待审核的成绩</h3><p>教师提交后会出现。</p></div>`}
  `;
}

function renderRules() {
  return `
    ${pageHead('选课规则', PAGE_META.rules.sub, `<span class="chip green">保存后立即生效</span>`)}
    <div class="panel" style="max-width:720px;">
      <div class="panel-head"><div><div class="panel-title">学期与选课参数</div><div class="panel-sub">学生端在保存后刷新，按新规则校验</div></div></div>
      <div class="panel-body">
        <form data-form="rules">
          <div class="form-grid">
            <div class="field span-2"><label for="semester">学期名称</label><input id="semester" name="semester" value="${esc(state.settings.semester)}"></div>
            <div class="field"><label for="window">选课窗口</label><input id="window" name="window" value="${esc(state.settings.window)}"></div>
            <div class="field"><label for="creditLimit">学分上限</label><input id="creditLimit" name="creditLimit" type="number" min="1" max="40" value="${state.settings.creditLimit}"></div>
            <div class="field"><label for="maxWaitlist">候补上限</label><input id="maxWaitlist" name="maxWaitlist" type="number" min="1" max="10" value="${state.settings.maxWaitlist}"></div>
            <div class="field"><label for="selectionOpen">选课窗口状态</label><select id="selectionOpen" name="selectionOpen"><option value="true" ${state.settings.selectionOpen ? 'selected' : ''}>开放</option><option value="false" ${!state.settings.selectionOpen ? 'selected' : ''}>关闭</option></select></div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:var(--s5);"><button class="btn btn-primary" type="submit">保存规则</button></div>
        </form>
      </div>
    </div>
  `;
}

function renderAudit() {
  return `
    ${pageHead('审计日志', PAGE_META.audit.sub, `<span class="chip blue">保留 180 天</span>`)}
    <div class="panel">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>时间</th><th>操作人</th><th>角色</th><th>动作</th><th>对象</th><th>请求 ID</th><th>结果</th></tr></thead>
            <tbody>
              ${state.audit.map((log) => `<tr><td>${esc(log.time)}</td><td>${esc(log.actor)}</td><td>${esc(log.role)}</td><td><strong>${esc(log.action)}</strong><span class="sub">${esc(log.detail)}</span></td><td>${esc(log.target)}</td><td class="mono">${esc(log.requestId)}</td><td><span class="chip green">${esc(log.result)}</span></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="course-note" style="margin-top:var(--s4);">${icon('shield', 14)} 日志只追加，不提供删除入口；导出操作也会写入审计。</div>
      </div>
    </div>
  `;
}

/* ---------- Admin ---------- */
function renderUsers() {
  return `
    ${pageHead('用户管理', PAGE_META.users.sub, `<button class="btn btn-primary" type="button" data-action="open-user">${icon('plus', 15)} 新增用户</button>`)}
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">账号列表</div><div class="panel-sub">停用后立即失去登录与接口权限</div></div><span class="chip">${state.users.length} 个演示账号</span></div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>姓名</th><th>工号 / 学号</th><th>角色</th><th>所属单位</th><th>状态</th><th>最近登录</th><th>操作</th></tr></thead>
            <tbody>
              ${state.users.map((u) => `<tr>
                <td><strong>${esc(u.name)}</strong></td>
                <td class="mono">${u.id}</td>
                <td><span class="chip ${u.role === '系统管理员' ? 'violet' : u.role === '教务人员' ? 'amber' : u.role === '教师' ? 'green' : 'blue'}">${u.role}</span></td>
                <td>${esc(u.dept)}</td>
                <td><span class="chip ${u.status === '启用' ? 'green' : 'red'}">${u.status}</span></td>
                <td>${esc(u.last)}</td>
                <td><button class="btn btn-ghost btn-sm" type="button" data-action="toggle-user" data-id="${u.id}">${u.status === '启用' ? '停用' : '启用'}</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderRoles() {
  const roleList = [
    { key: 'student', name: '学生', count: 4986, desc: '仅本人数据，选课、成绩、评教' },
    { key: 'teacher', name: '教师', count: 312, desc: '本人授课范围，开课、成绩、评教聚合' },
    { key: 'academic', name: '教务人员', count: 28, desc: '全校业务数据，可按院系缩权' },
    { key: 'admin', name: '系统管理员', count: 4, desc: '账号、角色、菜单、审计，业务只读' },
  ];
  return `
    ${pageHead('角色管理', PAGE_META.roles.sub, `<span class="chip blue">四类核心角色</span>`)}
    <div class="role-cards" style="margin-bottom:var(--s5);">
      ${roleList.map((r) => `<button class="role-tile" type="button" data-action="view-role" data-role="${r.key}"><strong>${r.name}</strong><span>${r.count} 人 · ${r.desc}</span></button>`).join('')}
    </div>
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">权限点位矩阵</div><div class="panel-sub">菜单可见不等于能操作；每个写操作还要校验接口与数据范围</div></div></div>
      <div class="panel-body">
        <div class="table-wrap">
          <table class="matrix-table">
            <thead><tr><th>点位</th><th>学生</th><th>教师</th><th>教务</th><th>管理员</th></tr></thead>
            <tbody>
              <tr><td>选课中心</td><td class="matrix-yes">本人</td><td class="matrix-no">—</td><td>只读 / 配置</td><td class="matrix-no">—</td></tr>
              <tr><td>开课申请</td><td class="matrix-no">—</td><td class="matrix-yes">本人</td><td class="matrix-yes">审核</td><td class="matrix-no">—</td></tr>
              <tr><td>成绩录入 / 审核</td><td class="matrix-no">—</td><td class="matrix-yes">录入本人</td><td class="matrix-yes">审核发布</td><td class="matrix-no">只读</td></tr>
              <tr><td>用户 / 角色 / 菜单</td><td class="matrix-no">—</td><td class="matrix-no">—</td><td class="matrix-no">—</td><td class="matrix-yes">增删改查</td></tr>
              <tr><td>审计日志</td><td class="matrix-no">—</td><td class="matrix-no">—</td><td>业务范围</td><td class="matrix-yes">查看 / 导出</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderMenus() {
  const role = ui.menuRole;
  const enabled = state.roleMenus[role] || [];
  const allKeys = Object.keys(MENU_DEFS);
  return `
    ${pageHead('菜单管理', PAGE_META.menus.sub, `<span class="chip green">保存后 10 秒内生效</span>`)}
    <div class="panel">
      <div class="panel-head"><div><div class="panel-title">按角色配置可见菜单</div><div class="panel-sub">取消后导航隐藏；直接访问 URL 会返回 403</div></div></div>
      <div class="panel-body">
        <div class="role-cards" style="margin-bottom:var(--s5);">
          ${['student', 'teacher', 'academic', 'admin'].map((r) => `<button class="role-tile ${role === r ? 'active' : ''}" type="button" data-action="menu-role" data-role="${r}"><strong>${ROLE_META[r].label}</strong><span>${state.roleMenus[r].length} 个可见项</span></button>`).join('')}
        </div>
        <div class="menu-tree">
          ${allKeys.map((key) => {
            const def = MENU_DEFS[key];
            const checked = enabled.includes(key);
            return `<label class="menu-row">
              <input type="checkbox" name="menu" value="${key}" ${checked ? 'checked' : ''}>
              <span class="role-icon" style="width:28px;height:28px;border-radius:8px;">${icon(def.icon, 14)}</span>
              <span>${def.label}</span>
              <span class="menu-meta">${def.group} · ${key}</span>
            </label>`;
          }).join('')}
        </div>
        <div style="display:flex;justify-content:flex-end;margin-top:var(--s5);">
          <button class="btn btn-primary" type="button" data-action="save-menus">保存并生效</button>
        </div>
      </div>
    </div>
    <div class="panel" style="margin-top:var(--s5);">
      <div class="panel-head"><div><div class="panel-title">联动检查</div></div></div>
      <div class="panel-body">
        <div class="list">
          <div class="list-row"><div class="list-main"><strong>导航与路由</strong><span>取消菜单后，侧栏隐藏；直接访问 hash 路由返回 403</span></div><span class="chip green">已实现</span></div>
          <div class="list-row"><div class="list-main"><strong>面包屑与按钮</strong><span>页面标题、操作按钮由同一份权限配置驱动</span></div><span class="chip green">已实现</span></div>
          <div class="list-row"><div class="list-main"><strong>接口与数据范围</strong><span>演示环境用页面守卫模拟；真实系统在服务端逐请求校验</span></div><span class="chip amber">模拟</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderForbidden(route) {
  return `
    <div class="forbidden">
      <div>
        <div class="code">403</div>
        <h1>当前角色没有这个页面的权限</h1>
        <p>${ROLE_META[route.role].label}的菜单里没有“${PAGE_META[route.page] ? PAGE_META[route.page].label : route.page}”。这不是页面不存在，而是权限默认拒绝。</p>
        <button class="btn btn-primary" type="button" data-action="nav" data-role="${route.role}" data-page="dashboard">返回工作台</button>
      </div>
    </div>
  `;
}

/* ---------- Status helpers ---------- */
function statusLabel(status) {
  return ({
    DRAFT: '草稿',
    PENDING: '待审核',
    APPROVED: '已通过',
    PUBLISHED: '已发布',
    REJECTED: '已退回',
    SUBMITTED: '已提交',
    REVIEWED: '已审核',
    ENROLLED: '已选',
    WAITLIST: '候补中',
    PROMOTED: '已递补',
    EXPIRED: '已过期',
    DROPPED: '已退课',
  })[status] || status;
}

/* ---------- Actions ---------- */
function selectCourse(id) {
  const course = courseById(id);
  if (!course) return;
  if (!state.settings.selectionOpen) return toast('选课窗口已关闭，请联系教务。', 'warn');
  const e = currentEnrollment(id);
  if (e && (e.status === 'ENROLLED' || e.status === 'PROMOTED')) return toast('您已经选过这门课。', 'warn');
  if (e && e.status === 'WAITLIST') return toast('这门课已在候补队列中。', 'warn');
  if (hasConflict(course)) return toast('与已选课程时间冲突，请先退掉冲突课程。', 'error');
  if (currentCredits() + course.credits > state.settings.creditLimit) {
    return toast(`超过学分上限 ${state.settings.creditLimit} 分。`, 'error');
  }
  if (course.selected >= course.capacity) {
    return joinWaitlist(id, true);
  }
  if (e) {
    e.status = 'ENROLLED';
    e.enrolledAt = nowText();
    e.seq = null;
  } else {
    state.enrollments.push({ id: 'en-' + Date.now(), studentId: ME, studentName: '林知夏', courseId: id, status: 'ENROLLED', enrolledAt: nowText(), seq: null });
  }
  course.selected = Math.min(course.capacity, course.selected + 1);
  addAudit('选课', course.name, `唯一键 (${ME}, ${id})，selected_count ${course.selected}/${course.capacity}`);
  pushNotification('选课成功', `${course.name} 已加入课表，第 ${course.selected}/${course.capacity} 个名额。`, 'course');
  saveState();
  render();
  toast(`选课成功，${course.name} 已加入课表。`);
}

function joinWaitlist(id, fromFull = false) {
  const course = courseById(id);
  if (!course) return;
  if (!state.settings.selectionOpen) return toast('选课窗口已关闭。', 'warn');
  const e = currentEnrollment(id);
  if (e && e.status === 'WAITLIST') return toast('已经在候补队列中。', 'warn');
  if (e && (e.status === 'ENROLLED' || e.status === 'PROMOTED')) return toast('您已选上这门课。', 'warn');
  if (waitlistEntries().length >= state.settings.maxWaitlist) {
    return toast(`最多同时候补 ${state.settings.maxWaitlist} 门课程。`, 'warn');
  }
  if (hasConflict(course)) return toast('与已选课程时间冲突，不能加入候补。', 'error');
  const seq = nextSeq(id);
  if (e) {
    e.status = 'WAITLIST';
    e.seq = seq;
    e.enrolledAt = nowText();
  } else {
    state.enrollments.push({ id: 'en-' + Date.now(), studentId: ME, studentName: '林知夏', courseId: id, status: 'WAITLIST', enrolledAt: nowText(), seq });
  }
  const pos = waitlistPosition(id);
  addAudit('加入候补', course.name, `seq=${seq}，队列位置 ${pos}`);
  saveState();
  render();
  toast(fromFull ? `课程已满，已加入候补，当前第 ${pos} 位。` : `已加入候补，当前第 ${pos} 位。`, 'warn');
}

function cancelWaitlist(id) {
  const e = currentEnrollment(id);
  const course = courseById(id);
  if (!e || e.status !== 'WAITLIST') return;
  e.status = 'CANCELLED';
  addAudit('取消候补', course.name, `seq=${e.seq}`);
  saveState();
  render();
  toast('已取消候补。');
}

function openCourseModal(id) {
  const c = courseById(id);
  if (!c) return;
  const e = currentEnrollment(id);
  const enrolled = e && (e.status === 'ENROLLED' || e.status === 'PROMOTED');
  const wait = e && e.status === 'WAITLIST';
  const full = c.selected >= c.capacity;
  const conflict = !enrolled && !wait && hasConflict(c);
  let action = `<button class="btn btn-secondary" type="button" data-action="close-modal">关闭</button>`;
  if (enrolled) action += `<button class="btn btn-danger" type="button" data-action="drop-course" data-id="${c.id}">退课</button>`;
  else if (wait) action += `<button class="btn btn-secondary" type="button" data-action="cancel-waitlist" data-id="${c.id}">取消候补</button>`;
  else if (conflict) action += `<button class="btn btn-secondary" type="button" disabled>时间冲突</button>`;
  else if (full) action += `<button class="btn btn-primary" type="button" data-action="join-waitlist" data-id="${c.id}">加入候补</button>`;
  else action += `<button class="btn btn-primary" type="button" data-action="select-course" data-id="${c.id}">选课</button>`;
  openModal({
    title: c.name,
    sub: `${c.code} · ${c.type} · ${c.credits} 学分`,
    body: `
      <div class="modal-section">
        <dl class="kv">
          <dt>授课教师</dt><dd>${esc(c.teacher)} · ${esc(c.dept)}</dd>
          <dt>上课时间</dt><dd>${c.time.map((t) => `${DAYS[t.day]} ${SLOT_LABELS[t.slot]}`).join(' / ')}</dd>
          <dt>地点</dt><dd>${esc(c.location)} · ${esc(c.weeks)}</dd>
          <dt>先修要求</dt><dd>${esc(c.prereq)}</dd>
          <dt>容量</dt><dd>${c.selected} / ${c.capacity} 人 ${full ? '<span class="chip red" style="margin-left:6px;">已满</span>' : ''}</dd>
          <dt>内容版本</dt><dd>${esc(c.contentVersion)} · ${esc(c.contentUpdated)}</dd>
        </dl>
      </div>
      <div class="modal-section"><h3>课程简介</h3><p class="muted" style="line-height:1.75;">${esc(c.description)}</p></div>
      <div class="modal-section"><h3>章节安排</h3><div style="display:flex;flex-wrap:wrap;gap:6px;">${c.chapters.map((ch) => `<span class="chip no-dot">${esc(ch)}</span>`).join('')}</div></div>
    `,
    foot: action,
  });
}

function confirmDrop(id) {
  const c = courseById(id);
  if (!c) return;
  openModal({
    title: '确认退课？',
    sub: c.name,
    body: `<p class="muted" style="line-height:1.75;">退课后名额立即释放，系统会按队列顺序尝试递补 1 人。已选记录会保留为 DROPPED，用于审计与对账。</p>`,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-danger" type="button" data-action="confirm-drop" data-id="${id}">确认退课</button>`,
  });
}

function dropCourse(id) {
  const c = courseById(id);
  const e = currentEnrollment(id);
  if (!c || !e || (e.status !== 'ENROLLED' && e.status !== 'PROMOTED')) return;
  e.status = 'DROPPED';
  c.selected = Math.max(0, c.selected - 1);
  addAudit('退课', c.name, `释放 1 个名额，selected_count ${c.selected}/${c.capacity}`);
  const promoted = promoteWaitlist(id);
  saveState();
  render();
  toast(promoted ? `退课成功，${promoted} 已候补递补。` : '退课成功，名额已释放。');
}

function promoteWaitlist(courseId) {
  const course = courseById(courseId);
  if (!course) return null;
  const queue = state.enrollments
    .filter((e) => e.courseId === courseId && e.status === 'WAITLIST')
    .sort((a, b) => (a.seq || 0) - (b.seq || 0));
  for (const e of queue) {
    if (course.selected >= course.capacity) break;
    let eligible = true;
    if (e.studentId === ME) {
      eligible = !hasConflict(course) && (currentCredits() + course.credits <= state.settings.creditLimit);
    } else if (e.hasConflict) {
      eligible = false;
    }
    if (!eligible) {
      e.status = 'EXPIRED';
      addAudit('候补过期', course.name, `${e.studentName || e.studentId} 资格校验未通过，跳下一位`);
      continue;
    }
    e.status = 'PROMOTED';
    e.promotedAt = nowText();
    course.selected = Math.min(course.capacity, course.selected + 1);
    addAudit('候补递补', course.name, `${e.studentName || e.studentId} 递补成功，selected_count ${course.selected}/${course.capacity}`);
    pushNotification('候补递补成功', `${course.name} 已为您递补成功，请查看课表。`, 'waitlist');
    return e.studentName || (e.studentId === ME ? '您' : e.studentId);
  }
  return null;
}

function adjustCapacity(id) {
  const c = courseById(id);
  if (!c) return;
  c.capacity += 5;
  const promoted = [];
  let guard = 0;
  while (c.selected < c.capacity && guard < 20) {
    const name = promoteWaitlist(id);
    if (!name) break;
    promoted.push(name);
    guard += 1;
  }
  addAudit('调整容量', c.name, `容量 +5 → ${c.capacity}，递补 ${promoted.length} 人`);
  saveState();
  render();
  toast(`容量已调整为 ${c.capacity} 人${promoted.length ? `，${promoted.join('、')} 已递补` : '，暂无候补'}。`);
}

function submitGrades(bookId) {
  const book = bookById(bookId);
  if (!book || book.status !== 'DRAFT') return;
  book.status = 'SUBMITTED';
  book.submittedAt = nowText();
  addAudit('提交成绩', book.courseName, `${book.students.length} 名学生，DRAFT → SUBMITTED`);
  pushNotification('成绩已提交', `${book.courseName} 已提交教务审核，教师端已锁定。`, 'grade');
  saveState();
  render();
  toast('成绩已提交，等待教务审核。');
}

function reviewGrades(bookId) {
  const book = bookById(bookId);
  if (!book || book.status !== 'SUBMITTED') return;
  book.status = 'REVIEWED';
  addAudit('审核成绩', book.courseName, 'SUBMITTED → REVIEWED');
  saveState();
  render();
  toast('审核通过，可以发布成绩。');
}

function publishGrades(bookId) {
  const book = bookById(bookId);
  if (!book || book.status !== 'REVIEWED') return;
  book.status = 'PUBLISHED';
  book.publishedAt = nowText();
  const mine = book.students.find((s) => s.id === ME);
  if (mine && !state.publishedGrades.some((r) => r.course === book.courseName && r.term === state.settings.semester)) {
    state.publishedGrades.push({
      course: book.courseName,
      credit: (courseById(book.courseId) || {}).credits || 3,
      usual: mine.usual,
      final: mine.final,
      total: totalScore(mine.usual, mine.final),
      gpa: gpaFor(totalScore(mine.usual, mine.final)),
      term: state.settings.semester,
    });
  }
  addAudit('发布成绩', book.courseName, 'REVIEWED → PUBLISHED，学生端可见');
  pushNotification('成绩已发布', `${book.courseName} 成绩已发布，可在“我的成绩”查看。`, 'grade');
  saveState();
  render();
  toast('成绩已发布，学生端立即可见。');
}

function approveApplication(id) {
  const app = state.applications.find((a) => a.id === id);
  if (!app) return;
  app.status = 'PUBLISHED';
  app.reviewedAt = nowText();
  if (!state.courses.some((c) => c.code === app.code)) {
    state.courses.push({
      id: 'APP-' + app.id,
      code: app.code,
      name: app.courseName,
      teacher: app.teacher,
      dept: '计算机学院',
      credits: 3,
      capacity: app.capacity,
      selected: 0,
      type: '专业选修',
      rating: 0,
      time: [{ day: app.day, slot: app.slot }],
      location: app.location,
      weeks: app.weeks,
      prereq: '无',
      status: 'open',
      contentVersion: 'v1.0',
      contentUpdated: nowText(),
      description: app.note || '教师新申请课程。',
      chapters: ['课程导论', '核心专题', '课程项目'],
    });
  }
  addAudit('通过开课申请', app.courseName, 'PENDING → PUBLISHED，教学班已发布');
  pushNotification('开课申请通过', `${app.courseName} 已通过审核并发布教学班。`, 'course');
  saveState();
  render();
  toast('已通过并发布教学班。');
}

function submitApplicationForm(form) {
  const data = new FormData(form);
  const id = data.get('id');
  const payload = {
    teacher: '周明远',
    courseName: data.get('courseName').trim(),
    code: data.get('code').trim().toUpperCase(),
    className: data.get('className').trim(),
    capacity: Number(data.get('capacity')),
    day: Number(data.get('day')),
    slot: Number(data.get('slot')),
    location: data.get('location').trim(),
    weeks: data.get('weeks').trim(),
    note: data.get('note').trim(),
    status: 'DRAFT',
    submittedAt: null,
  };
  if (!payload.courseName || !payload.code || !payload.className || !payload.location) {
    return toast('请把课程、代码、班级与地点填写完整。', 'error');
  }
  if (id) {
    const app = state.applications.find((a) => a.id === id);
    if (!app) return;
    Object.assign(app, payload);
    addAudit('修改开课申请', payload.courseName, '草稿已更新');
  } else {
    state.applications.push({ id: 'APP-' + Date.now(), ...payload });
    addAudit('新建开课申请', payload.courseName, '保存为草稿');
  }
  saveState();
  closeModal();
  render();
  toast('开课申请已保存为草稿。');
}

function submitApplication(id) {
  const app = state.applications.find((a) => a.id === id);
  if (!app || app.status !== 'DRAFT') return;
  const conflict = state.courses.some((c) => c.teacher === app.teacher && c.status === 'open' && c.time.some((t) => t.day === app.day && t.slot === app.slot));
  if (conflict) {
    return toast('教师在该时间已有教学班，请先调整时间。', 'error');
  }
  app.status = 'PENDING';
  app.submittedAt = nowText();
  addAudit('提交开课申请', app.courseName, 'DRAFT → PENDING');
  pushNotification('开课申请已提交', `${app.courseName} 已进入教务审核队列。`, 'course');
  saveState();
  render();
  toast('已提交教务审核。');
}

function withdrawApplication(id) {
  const app = state.applications.find((a) => a.id === id);
  if (!app || app.status !== 'PENDING') return;
  app.status = 'DRAFT';
  app.submittedAt = null;
  addAudit('撤回开课申请', app.courseName, 'PENDING → DRAFT');
  saveState();
  render();
  toast('已撤回，可继续修改。');
}

function openApplicationModal(app = null) {
  const isEdit = Boolean(app);
  openModal({
    title: isEdit ? '编辑开课申请' : '新建开课申请',
    sub: '保存为草稿，提交后进入教务审核',
    body: `
      <form data-form="application" id="applicationForm">
        <input type="hidden" name="id" value="${isEdit ? app.id : ''}">
        <div class="form-grid">
          <div class="field"><label for="courseName">课程名称</label><input id="courseName" name="courseName" value="${isEdit ? esc(app.courseName) : ''}" placeholder="例如：算法设计与分析" required></div>
          <div class="field"><label for="code">课程代码</label><input id="code" name="code" value="${isEdit ? esc(app.code) : ''}" placeholder="CS402" required></div>
          <div class="field"><label for="className">教学班</label><input id="className" name="className" value="${isEdit ? esc(app.className) : '计科 2301'}" required></div>
          <div class="field"><label for="capacity">容量</label><input id="capacity" name="capacity" type="number" min="1" max="200" value="${isEdit ? app.capacity : 45}" required></div>
          <div class="field"><label for="day">星期</label><select id="day" name="day">${DAYS.map((d, i) => `<option value="${i}" ${isEdit && app.day === i ? 'selected' : ''}>${d}</option>`).join('')}</select></div>
          <div class="field"><label for="slot">节次</label><select id="slot" name="slot">${SLOT_LABELS.map((s, i) => `<option value="${i}" ${isEdit && app.slot === i ? 'selected' : ''}>${s} · ${SLOTS[i]}</option>`).join('')}</select></div>
          <div class="field"><label for="location">地点</label><input id="location" name="location" value="${isEdit ? esc(app.location) : ''}" placeholder="信息楼 B402" required></div>
          <div class="field"><label for="weeks">周次</label><input id="weeks" name="weeks" value="${isEdit ? esc(app.weeks) : '1-16 周'}" required></div>
          <div class="field span-2"><label for="note">课程说明</label><textarea id="note" name="note" placeholder="课程目标、先修要求、考核方式">${isEdit ? esc(app.note) : ''}</textarea></div>
        </div>
      </form>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit" form="applicationForm">保存草稿</button>`,
  });
}

function openContentModal(courseId) {
  const c = courseById(courseId);
  if (!c) return;
  openModal({
    title: '编辑课程内容',
    sub: `${c.name} · 当前版本 ${c.contentVersion}`,
    body: `
      <form data-form="content" id="contentForm">
        <input type="hidden" name="courseId" value="${c.id}">
        <div class="field" style="margin-bottom:var(--s4);"><label for="contentTitle">课程简介</label><textarea id="contentTitle" name="description" style="min-height:120px;">${esc(c.description)}</textarea></div>
        <div class="field"><label for="chapters">章节安排（每行一个）</label><textarea id="chapters" name="chapters" style="min-height:150px;">${esc(c.chapters.join('\n'))}</textarea></div>
        <p class="field-hint" style="margin-top:var(--s3);">保存后生成新版本；学生端只看到 PUBLISHED 版本，旧版本保留为 ARCHIVED。</p>
      </form>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit" form="contentForm">发布新版本</button>`,
  });
}

function openEvaluationModal(courseId) {
  const c = courseById(courseId);
  if (!c) return;
  openModal({
    title: '匿名评价',
    sub: `${c.name} · ${c.teacher}`,
    body: `
      <form data-form="evaluation" id="evaluationForm">
        <input type="hidden" name="courseId" value="${c.id}">
        <div class="field" style="margin-bottom:var(--s4);">
          <label>总体评分</label>
          <div class="stars">
            ${[5, 4, 3, 2, 1].map((n) => `<input type="radio" id="star${n}" name="rating" value="${n}" ${n === 5 ? 'checked' : ''}><label for="star${n}" aria-label="${n} 星">★</label>`).join('')}
          </div>
        </div>
        <div class="field"><label for="comment">匿名建议</label><textarea id="comment" name="comment" placeholder="哪些地方做得好？哪里还可以改进？" style="min-height:120px;"></textarea></div>
        <p class="field-hint" style="margin-top:var(--s3);">不记录您的身份；教师端只看到聚合分与匿名文本，样本少于 5 不展示明细。</p>
      </form>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit" form="evaluationForm">提交匿名评价</button>`,
  });
}

function openRejectModal(id) {
  const app = state.applications.find((a) => a.id === id);
  if (!app) return;
  openModal({
    title: '退回开课申请',
    sub: `${app.courseName} · ${app.teacher}`,
    body: `
      <form data-form="reject" id="rejectForm">
        <input type="hidden" name="id" value="${app.id}">
        <div class="field"><label for="reason">退回原因</label><textarea id="reason" name="reason" placeholder="例如：与现有教学班时间冲突，请改到周三下午" required></textarea></div>
      </form>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-danger" type="submit" form="rejectForm">确认退回</button>`,
  });
}

function openNoticeModal() {
  openModal({
    title: '发布通知',
    sub: '按角色或全院推送；通知失败不回滚主流程',
    body: `
      <form data-form="notice" id="noticeForm">
        <div class="field" style="margin-bottom:var(--s4);"><label for="noticeTitle">标题</label><input id="noticeTitle" name="title" placeholder="例如：补退选截止提醒" required></div>
        <div class="field"><label for="noticeBody">正文</label><textarea id="noticeBody" name="body" placeholder="写清楚时间、对象和要做的动作" required></textarea></div>
      </form>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit" form="noticeForm">发布</button>`,
  });
}

function openUserModal() {
  openModal({
    title: '新增用户',
    sub: '账号创建后按角色获得默认权限',
    body: `
      <form data-form="user" id="userForm">
        <div class="form-grid">
          <div class="field"><label for="userName">姓名</label><input id="userName" name="name" required></div>
          <div class="field"><label for="userId">工号 / 学号</label><input id="userId" name="id" required></div>
          <div class="field"><label for="userRole">角色</label><select id="userRole" name="role"><option>学生</option><option>教师</option><option>教务人员</option><option>系统管理员</option></select></div>
          <div class="field"><label for="userDept">所属单位</label><input id="userDept" name="dept" value="计算机学院"></div>
        </div>
      </form>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-primary" type="submit" form="userForm">创建账号</button>`,
  });
}

function openRoleModal(roleKey) {
  const role = ROLE_META[roleKey];
  const menus = state.roleMenus[roleKey].map((k) => MENU_DEFS[k]?.label).filter(Boolean);
  openModal({
    title: `${role.label}的权限包`,
    sub: '角色不是职级，而是一组菜单、按钮与数据范围',
    body: `
      <div class="modal-section"><h3>可见菜单</h3><div style="display:flex;flex-wrap:wrap;gap:6px;">${menus.map((m) => `<span class="chip blue no-dot">${m}</span>`).join('')}</div></div>
      <div class="modal-section"><h3>数据范围</h3><p class="muted" style="line-height:1.75;">${roleKey === 'student' ? '仅本人：本人选课、课表、成绩与评教。' : roleKey === 'teacher' ? '仅本人授课：本人教学班、学生名单、成绩与评教聚合。' : roleKey === 'academic' ? '全校业务数据，可按院系缩权；不配置系统角色与菜单。' : '全局配置数据；业务数据默认只读，不参与审批。'}</p></div>
      <div class="modal-section"><h3>关键约束</h3><p class="muted" style="line-height:1.75;">${roleKey === 'teacher' ? '不能审核自己的开课申请，不能发布自己的成绩。' : roleKey === 'admin' ? '不参与开课审核与成绩发布，避免既配置又审批。' : roleKey === 'academic' ? '菜单与角色配置归系统管理员，教务不越界。' : '不能查看他人成绩，不能进入教务与系统管理菜单。'}</p></div>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">关闭</button>`,
  });
}

function openConcurrencyModal() {
  openModal({
    title: '30 人抢 1 个名额',
    sub: '并发演示 · 条件更新 + 唯一约束',
    body: `
      <p class="muted" style="line-height:1.75;margin-bottom:var(--s4);">系统会对同一教学班发起 30 个并发请求。只有 1 个请求能命中 <span class="mono">selected_count &lt; capacity</span> 的条件更新，其余返回“已满”。重复请求由唯一键收敛。</p>
      <div id="concurrencyBoard" style="display:grid;grid-template-columns:repeat(10,1fr);gap:6px;"></div>
      <div id="concurrencyResult" style="margin-top:var(--s5);"></div>
    `,
    foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">关闭</button><button class="btn btn-primary" type="button" data-action="run-concurrency" id="runConcurrencyBtn">开始演示</button>`,
  });
}

function runConcurrencyDemo() {
  const board = document.getElementById('concurrencyBoard');
  const result = document.getElementById('concurrencyResult');
  const btn = document.getElementById('runConcurrencyBtn');
  if (!board || !result) return;
  if (btn) btn.disabled = true;
  board.innerHTML = Array.from({ length: 30 }, (_, i) => `<span class="chip" data-req="${i}" style="justify-content:center;min-height:30px;">${i + 1}</span>`).join('');
  const nodes = Array.from(board.querySelectorAll('[data-req]'));
  let done = 0;
  nodes.forEach((node, i) => {
    setTimeout(() => {
      const success = i === 17;
      node.className = `chip ${success ? 'green' : 'red'}`;
      node.textContent = success ? '成功' : '已满';
      done += 1;
      if (done === nodes.length) {
        result.innerHTML = `<div class="banner" style="margin-top:0;"><div><h2 style="font-size:var(--t-base);">1 个成功，29 个已满</h2><p>selected_count 最终为 1/1；没有超卖，没有重复记录。</p></div><span class="chip green">事务通过</span></div>`;
        if (btn) btn.disabled = false;
        toast('并发演示完成：1 个成功，29 个已满。');
      }
    }, 120 + i * 45);
  });
}

/* ---------- Modal / toast ---------- */
function openModal({ title, sub = '', body = '', foot = '' }) {
  const root = document.getElementById('modal-root');
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="modal-head">
          <div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ''}</div>
          <button class="modal-close" type="button" data-action="close-modal" aria-label="关闭">${icon('x', 16)}</button>
        </div>
        <div class="modal-body">${body}</div>
        ${foot ? `<div class="modal-foot">${foot}</div>` : ''}
      </div>
    </div>
  `;
  document.body.classList.add('modal-open');
  const focusable = root.querySelector('input, select, textarea, button');
  if (focusable) setTimeout(() => focusable.focus(), 30);
}

function closeModal() {
  const root = document.getElementById('modal-root');
  if (root) root.innerHTML = '';
  document.body.classList.remove('modal-open');
}

/* ---------- Events ---------- */
document.addEventListener('click', (event) => {
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;

  if (action === 'close-modal') {
    if (event.target === actionEl || actionEl.classList.contains('modal-close')) closeModal();
    return;
  }
  if (action === 'close-sidebar') {
    document.getElementById('sidebar')?.classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('show');
    return;
  }
  if (action === 'toggle-sidebar') {
    document.getElementById('sidebar')?.classList.toggle('open');
    document.querySelector('.sidebar-overlay')?.classList.toggle('show');
    return;
  }
  if (action === 'login') {
    const role = actionEl.dataset.role;
    navigate(role, 'dashboard');
    return;
  }
  if (action === 'logout') {
    location.hash = '#/';
    return;
  }
  if (action === 'nav') {
    navigate(actionEl.dataset.role, actionEl.dataset.page);
    return;
  }
  if (action === 'course-tab') {
    ui.courseTab = actionEl.dataset.tab;
    render();
    return;
  }
  if (action === 'select-course') {
    closeModal();
    selectCourse(id);
    return;
  }
  if (action === 'drop-course') {
    closeModal();
    confirmDrop(id);
    return;
  }
  if (action === 'confirm-drop') {
    closeModal();
    dropCourse(id);
    return;
  }
  if (action === 'join-waitlist') {
    closeModal();
    joinWaitlist(id);
    return;
  }
  if (action === 'cancel-waitlist') {
    closeModal();
    cancelWaitlist(id);
    return;
  }
  if (action === 'open-course') {
    openCourseModal(id);
    return;
  }
  if (action === 'open-application') {
    openApplicationModal();
    return;
  }
  if (action === 'edit-application') {
    const app = state.applications.find((a) => a.id === id);
    if (app) openApplicationModal(app);
    return;
  }
  if (action === 'submit-application') {
    submitApplication(id);
    return;
  }
  if (action === 'withdraw-application') {
    withdrawApplication(id);
    return;
  }
  if (action === 'edit-content') {
    openContentModal(id);
    return;
  }
  if (action === 'evaluate') {
    openEvaluationModal(id);
    return;
  }
  if (action === 'mark-read') {
    state.notifications.forEach((n) => { n.read = true; });
    saveState();
    render();
    toast('已全部标为已读。');
    return;
  }
  if (action === 'publish-notice') {
    openNoticeModal();
    return;
  }
  if (action === 'submit-grades') {
    submitGrades(id);
    return;
  }
  if (action === 'review-grades') {
    reviewGrades(id);
    return;
  }
  if (action === 'publish-grades') {
    publishGrades(id);
    return;
  }
  if (action === 'approve-application') {
    approveApplication(id);
    return;
  }
  if (action === 'reject-application') {
    openRejectModal(id);
    return;
  }
  if (action === 'adjust-capacity') {
    adjustCapacity(id);
    return;
  }
  if (action === 'toggle-user') {
    const user = state.users.find((u) => u.id === id);
    if (user) {
      user.status = user.status === '启用' ? '停用' : '启用';
      addAudit(user.status === '停用' ? '停用账号' : '启用账号', user.name, '账号状态变更');
      saveState();
      render();
      toast(`${user.name} 已${user.status === '停用' ? '停用，权限立即失效' : '启用'}。`);
    }
    return;
  }
  if (action === 'open-user') {
    openUserModal();
    return;
  }
  if (action === 'view-role') {
    openRoleModal(actionEl.dataset.role);
    return;
  }
  if (action === 'menu-role') {
    ui.menuRole = actionEl.dataset.role;
    render();
    return;
  }
  if (action === 'save-menus') {
    const checked = Array.from(document.querySelectorAll('input[name="menu"]:checked')).map((el) => el.value);
    if (!checked.includes('dashboard')) {
      toast('工作台必须保留，否则用户登录后没有落点。', 'error');
      return;
    }
    state.roleMenus[ui.menuRole] = checked;
    addAudit('修改角色菜单', ROLE_META[ui.menuRole].label, `可见 ${checked.length} 项：${checked.join(', ')}`);
    saveState();
    const route = parseRoute();
    if (route && route.role === ui.menuRole && !checked.includes(route.page)) {
      navigate(route.role, 'dashboard');
    } else {
      render();
    }
    toast('菜单已保存，导航与路由已同步。');
    return;
  }
  if (action === 'reset-data') {
    openModal({
      title: '重置演示数据',
      sub: '会恢复初始课程、选课与审核状态',
      body: `<p class="muted" style="line-height:1.75;">当前浏览器里的选课、成绩、菜单与审计记录都会恢复为初始演示数据。这个操作不会影响任何真实系统。</p>`,
      foot: `<button class="btn btn-secondary" type="button" data-action="close-modal">取消</button><button class="btn btn-danger" type="button" data-action="confirm-reset">确认重置</button>`,
    });
    return;
  }
  if (action === 'confirm-reset') {
    localStorage.removeItem(STORAGE_KEY);
    state = seedState();
    saveState();
    closeModal();
    const route = parseRoute();
    if (route) navigate(route.role, 'dashboard');
    else render();
    toast('演示数据已重置。');
    return;
  }
  if (action === 'demo-concurrency') {
    openConcurrencyModal();
    return;
  }
  if (action === 'run-concurrency') {
    runConcurrencyDemo();
    return;
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();
  const type = form.dataset.form;
  const data = new FormData(form);

  if (type === 'application') {
    submitApplicationForm(form);
    return;
  }
  if (type === 'content') {
    const course = courseById(data.get('courseId'));
    if (!course) return;
    course.description = data.get('description').trim();
    course.chapters = data.get('chapters').split('\n').map((s) => s.trim()).filter(Boolean);
    const version = Number(course.contentVersion.replace('v', '')) + 0.1;
    course.contentVersion = 'v' + version.toFixed(1);
    course.contentUpdated = nowText().slice(0, 10);
    addAudit('发布课程内容', course.name, `新版本 ${course.contentVersion}，学生端 10 秒内可见`);
    saveState();
    closeModal();
    render();
    toast(`已发布 ${course.contentVersion}，学生端可见。`);
    return;
  }
  if (type === 'evaluation') {
    const courseId = data.get('courseId');
    const course = courseById(courseId);
    if (!course) return;
    state.evaluations[courseId] = {
      rating: Number(data.get('rating')) || 5,
      comment: (data.get('comment') || '').trim(),
      at: nowText(),
    };
    addAudit('提交评教', course.name, '匿名提交，服务端不记录学生 ID 与正文关联');
    saveState();
    closeModal();
    render();
    toast('匿名评价已提交，感谢反馈。');
    return;
  }
  if (type === 'reject') {
    const app = state.applications.find((a) => a.id === data.get('id'));
    if (!app) return;
    const reason = (data.get('reason') || '').trim();
    if (!reason) return toast('请填写退回原因。', 'error');
    app.status = 'REJECTED';
    app.rejectReason = reason;
    addAudit('退回开课申请', app.courseName, reason);
    pushNotification('开课申请被退回', `${app.courseName}：${reason}`, 'course');
    saveState();
    closeModal();
    render();
    toast('已退回，教师可修改后重提。');
    return;
  }
  if (type === 'notice') {
    const title = (data.get('title') || '').trim();
    const body = (data.get('body') || '').trim();
    if (!title || !body) return toast('标题和正文都要填写。', 'error');
    pushNotification(title, body, 'course');
    addAudit('发布通知', title, '按角色推送');
    saveState();
    closeModal();
    render();
    toast('通知已发布。');
    return;
  }
  if (type === 'user') {
    const name = (data.get('name') || '').trim();
    const id = (data.get('id') || '').trim();
    if (!name || !id) return toast('姓名和工号 / 学号不能为空。', 'error');
    state.users.push({ name, id, role: data.get('role'), dept: (data.get('dept') || '').trim(), status: '启用', last: '尚未登录' });
    addAudit('新增用户', name, `角色 ${data.get('role')}`);
    saveState();
    closeModal();
    render();
    toast('账号已创建。');
    return;
  }
  if (type === 'rules') {
    state.settings.semester = (data.get('semester') || '').trim() || state.settings.semester;
    state.settings.window = (data.get('window') || '').trim() || state.settings.window;
    state.settings.creditLimit = Number(data.get('creditLimit')) || state.settings.creditLimit;
    state.settings.maxWaitlist = Number(data.get('maxWaitlist')) || state.settings.maxWaitlist;
    state.settings.selectionOpen = data.get('selectionOpen') === 'true';
    addAudit('修改选课规则', state.settings.semester, `窗口 ${state.settings.window}，学分上限 ${state.settings.creditLimit}`);
    saveState();
    render();
    toast('规则已保存，学生端立即按新规则校验。');
    return;
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'roleSelect') {
    const role = event.target.value;
    const route = parseRoute();
    const page = route && state.roleMenus[role].includes(route.page) ? route.page : 'dashboard';
    navigate(role, page);
    return;
  }
  if (event.target.id === 'gradeBookSelect') {
    ui.gradeBook = event.target.value;
    render();
  }
});

document.addEventListener('input', (event) => {
  if (event.target.id === 'courseSearch') {
    ui.courseSearch = event.target.value;
    applyCourseFilters();
    return;
  }
  if (event.target.matches('[data-grade]')) {
    const row = event.target.closest('[data-student-row]');
    const book = state.gradeBooks.find((b) => b.id === ui.gradeBook);
    if (!row || !book) return;
    const studentId = event.target.dataset.student;
    const field = event.target.dataset.field;
    const value = Math.max(0, Math.min(100, Number(event.target.value) || 0));
    const student = book.students.find((s) => s.id === studentId);
    if (!student) return;
    student[field] = value;
    const total = totalScore(student.usual, student.final);
    const totalEl = row.querySelector('[data-total]');
    const gpaEl = row.querySelector('[data-gpa]');
    if (totalEl) totalEl.textContent = total.toFixed(1);
    if (gpaEl) gpaEl.textContent = gpaFor(total).toFixed(1);
    saveState();
  }
});

window.addEventListener('hashchange', render);

/* ---------- Boot ---------- */
if (!location.hash) {
  location.hash = '#/';
}
render();
