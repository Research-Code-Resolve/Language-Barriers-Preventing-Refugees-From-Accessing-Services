// Mock response engine — simulates future RAG-backed /api/chat responses.
// This will be replaced by real /api/chat calls via chatService.js.
// Responses are tagged with isDemo: true and verified: false until the RAG backend is connected.

const HEALTH_RESPONSES = {
  en: "You can access healthcare at the camp clinic, which is open daily from 8 AM to 5 PM. For emergencies, go to the nearest health post or call the medical helpline. Pregnant women can receive antenatal care at the maternal health center. Bring your refugee ID or registration document when you visit.",
  ar: "يمكنك الوصول إلى الرعاية الصحية في عيادة المخيم، التي تفتح يوميًا من 8 صباحًا حتى 5 مساءً. للحالات الطارئة، اذهب إلى أقرب نقطة صحية أو اتصل بالخط الطبي. يمكن للحوامل تلقي رعاية ما قبل الولادة في مركز صحة الأمومة. أحضر بطاقة هوية اللاجئ أو وثيقة التسجيل عند الزيارة.",
  sw: "Unaweza kupata huduma za afya katika kliniki ya kambi, ambayo hufungua kila siku kutoka saa 8 asubuhi hadi 5 jioni. Kwa dharura, nenda kituo cha afya cha karibu au piga simu ya dharura. Wanaojifungua wanaweza kupata huduma za uzazi katika kituo cha afya ya mama. Lete kitambulisho cha m refugee wakati wa kutembelea.",
  fr: "Vous pouvez accéder aux soins de santé à la clinique du camp, ouverte tous les jours de 8h à 17h. En cas d'urgence, rendez-vous au poste de santé le plus proche ou appelez la ligne médicale. Les femmes enceintes peuvent recevoir des soins prénatals au centre de santé maternelle. Apportez votre pièce d'identité de réfugié lors de votre visite.",
  so: "Waxaad ka heli kartaa caafimaadka xarunta caafimaad ee xerada, oo maalin kasta u furan saaka 8 ilaa 5 galabnimo. Duruufaha, aad dhakhtarka ugu dhow ama wac lambarka caafimaad. Haweenka uurka leh waxay heli karaan daryeelka uurka xarunta caafimaadka hooyo. Keen aqoonsiga qaxootiga markaad booqanayso.",
  rw: "Ushobora kubona serivisi z'ubuzima ku kigo nderabuzima cya kambi, gifungura buri munsi kuva saa 8 z'igitondo kugeza saa 5 z'umugoroba. Mu byihutirwa, gjya ku kigo nderabuzima cyegereye cyangwa uhamagare umurongo w'ubuvuzi. Abagore batwite bashobora kubona serivisi z'ubuzima bw'ima ku kigo cy'ubuzima bw'ima. Uzane urwangida cyangwa inyandiko y'kwiyandikisha mu gihe usuye.",
};

const LEGAL_RESPONSES = {
  en: "Legal aid is available at the protection desk in your camp. You can get help with asylum applications, documentation, resettlement, and protection concerns. Legal clinics operate on weekdays — ask at the service point for the schedule. If you feel unsafe, tell a protection officer immediately.",
  ar: "المساعدة القانونية متاحة في مكتب الحماية في مخيمك. يمكنك الحصول على مساعدة في طلبات اللجوء والوثائق وإعادة التوطين وقضايا الحماية. تعمل العيادات القانونية في أيام الأسبوع — اسأل في نقطة الخدمة عن الجدول. إذا شعرت بعدم الأمان، أخبر مسؤول الحماية فورًا.",
  sw: "Usaidizi wa kisheria unapatikana katika dawati la ulinji katika kambi yako. Unaweza kupata msaada kwa maombi ya makazi, nyaraka, uhamisho, na masuala ya ulinji. Kliniki za kisheria hufanya kazi siku za wiki — uliza kituo cha huduma kwa ratiba. Ukihisi huna usalama, mwambie afisa wa ulinji mara moja.",
  fr: "L'aide juridique est disponible au bureau de protection dans votre camp. Vous pouvez obtenir de l'aide pour les demandes d'asile, la documentation, la réinstallation et les questions de protection. Les cliniques juridiques fonctionnent en semaine — demandez le planning au point de service. Si vous vous sentez en danger, informez immédiatement un agent de protection.",
  so: "Caawimaada sharciga waxaa laga heli karaa xafiiska ilaalinta xeradaada. Waxaad ka heli kartaa caawimaad codsiyaanka magangalinta, aqoonsiga, dib-u-dhiska, iyo arrimaha ilaalinta. Xarumaha sharciga waxay shaqeeyaan maalmaha toddobaadka — waydii meesha adeegga jadwalka. Haddii aad dareento in aad aan amaan ahayn, sii waraan saraakiisha ilaalinta dartiis.",
  rw: "Ubufasha bw'amategeko buboneka ku biro by'imiryango i kibi cyawe. Ushobora kubona ubufasha ku by'ubutumire bwa cyubahiro, inyandiko, kwimura, n'ibibazo byo kurinda. Ibizamini by'amategeko bikora mu minsi yo ku cyumweru — baza ku kigo cy'imikorere umushinga. Nubike ko utameze neza, babwiye umukozi w'imiryango y'itegeko akozwe vuba.",
};

const INTERPRETER_RESPONSES = {
  en: "To request an interpreter, visit the service desk at your camp and ask for interpretation support. You can also ask any staff member to arrange one for your appointment. Interpretation is free and available in multiple languages. Don't let language stop you from getting help.",
  ar: "لطلب مترجم، قم بزيارة مكتب الخدمة في مخيمك واطلب دعم الترجمة. يمكنك أيضًا أن تطلب من أي موظف ترتيب مترجم لموعدك. الترجمة مجانية ومتاحة بلغات متعددة. لا تدع اللغة تمنعك من الحصول على المساعدة.",
  sw: "Kuomba mkalimani, tembelea dawati la huduma katika kambi yako na uulize usaidizi wa utafsiri. Unaweza pia kuomba mwanachama wowote wa wafanyakazi kupanga mkalimani kwa miadi yako. Utafsiri ni bure na unapatikana kwa lugha nyingi. Usiruhusu lugha ikuzuie kupata msaada.",
  fr: "Pour demander un interprète, rendez-vous au bureau de service dans votre camp et demandez un soutien en interprétation. Vous pouvez également demander à tout membre du personnel d'en organiser un pour votre rendez-vous. L'interprétation est gratuite et disponible en plusieurs langues. Ne laissez pas la langue vous empêcher d'obtenir de l'aide.",
  so: "Si aad u codsato turjubaan, booqo xafiiska adeegga xeradaada oo codso caawimaada turjubaanka. Waxaad kale oo codsan kartaa mid ka mid ah shaqaalaha in ay ku qabtaan turjubaan ballankaaga. Turjumaanta waa bilaash waxaana lagu heli karaa luqado badan. Ha yeelin luqada in ay kaa hor istaagto helitaanka caawimaada.",
  rw: "Kugira ngo usabe umusemuzi, njyere ku biro by'imikorere mu kibi cyawe ushize ubusabe bwo gufasha gusobanura. Ushobora no gusaba umukozi wese kugurisha umusemuzi ku gihe cyo kuganira. Gusobanura ni byo buntu kandi buboneka mu ndimi nyinshi. Nta kibazo cy'ururimi kikwibagiranye gufasha.",
};

const DOCUMENT_HELP_RESPONSES = {
  en: "I can help explain your document. You can upload it using the document button or scan it using the Document Scanner. Once the text is extracted, I can help summarize or explain it in simple language.",
  ar: "يمكنني مساعدتك في شرح مستندك. يمكنك رفعه باستخدام زر المستند أو مسحه ضوئيًا باستخدام ماسح المستندات. بمجرد استخراج النص، يمكنني مساعدتك في تلخيصه أو شرحه بلغة بسيطة.",
  sw: "Ninaweza kukusaidia kueleza hati yako. Unaweza kuipakia kwa kitufe cha hati au kuisafisha kwa Skana ya Hati. Mara maandishi yakiwa yametolewa, ninaweza kukusaidia kuyafupisha au kuyaeleza kwa lugha rahisi.",
  fr: "Je peux vous aider à expliquer votre document. Vous pouvez le télécharger en utilisant le bouton de document ou le scanner en utilisant le scanner de documents. Une fois le texte extrait, je peux vous aider à le résumer ou à l'expliquer en langage simple.",
  so: "Waxaan kaa caawin karaa sharaxidda dukumentigaaga. Waxaad ku soo geli kartaa adigoo isticmaalaya badhanka dukumentiga ama adigoo isticmaalaya Scanner-ka Dukumentiga. Marka qoraalka la soo saaro, waxaan kaa caawin karaa koobinta ama sharaxidda si fudud.",
  rw: "Nshobora kugufasha gusobanura inyandiko yawe. Ushobora kuyiyakira ukoresheje buto y'inyandiko cyangwa ukayisikana ukoresheje Sikaneri y'Inyandiko. Inyandiko zimaze gusohoka, nshobora kugufasha kuzisobanura cyangwa kuzisobanurira mu rurimi rworoshye.",
};

const DOCUMENT_RESPONSES = {
  en: "I've received the text from your document. What would you like me to help you with?",
  ar: "لقد تلقيت النص من مستندك. بماذا تريد أن أساعدك؟",
  sw: "Nimepokea maandishi kutoka kwa hati yako. Ninaweza kukusaidia vipi?",
  fr: "J'ai reçu le texte de votre document. Comment puis-je vous aider ?",
  so: "Waxaan qaatay qoraalka dokumentigaaga. Sideen kuu caawin karaa?",
  rw: "Nakiriye inyandiko ivuye ku nyandiko yawe. Nshobora kugufasha gute?",
};

const DOCUMENT_ACTION_RESPONSES = {
  explain: {
    en: "Here's what this document means in simple terms: This appears to be an official letter. Key points are highlighted, and any actions you need to take are listed. I recommend reading each section carefully and noting any deadlines mentioned.",
    ar: "إليك ما يعنيه هذا المستند بمصطلحات بسيطة: يبدو أن هذا خطاب رسمي. يتم تمييز النقاط الرئيسية، ويتم سرد أي إجراءات تحتاج إلى اتخاذها. أوصي بقراءة كل قسم بعناية وتدوين أي مواعيد نهائية مذكورة.",
    sw: "Hii hapa inamaanisha hati hii kwa maneno rahisi: Hii inaonekana kuwa barua rasmi. Pointi muhimu zimeangaziwa, na hatua yoyote unayohitaji kuchukua zimeorodheshwa. Napendekeza usome kila sehemu kwa makini ukaandike tarehe yoyote ya mwisho iliyotajwa.",
    fr: "Voici ce que ce document signifie en termes simples : Il s'agit d'une lettre officielle. Les points clés sont mis en évidence et les actions à entreprendre sont listées. Je vous recommande de lire chaque section attentivement et de noter les échéances mentionnées.",
    so: "Halkan waxaa ku qoran macnaha dokumentigan si fudud: Tani waxay u ekaataa warqad rasmi ah. Dhibcaha muhiimka ah waxaa la iftiimiyay, talaabooyinka aad qaadanayso waa la soo bandhigay. Waxaan kuu talinayaa in aad si taxaddar leh u akhrido qayb kasta oo aad qorto taariikh kasta oo dhamaato ee la xusay.",
    rw: "Ibi ni ibyo inyandiko ivuga mu magambo yoroheje: Iyi aba ari ibaruwa nyoboka. Utudomo tw'ingenzi twagaragajwe, n'amagambo yo gukora yagaragajwe. Nkugiriye inama gusoma buri cyiciro uhishe kandi wandike itariki z'igihe cyo herezo zibitswe.",
  },
  summarize: {
    en: "Summary: This document contains important information about your case or service. The main sections cover what you need to know, any actions required, and relevant dates. If anything is unclear, I can explain specific parts in more detail.",
    ar: "ملخص: يحتوي هذا المستند على معلومات مهمة حول قضيتك أو خدمتك. تغطي الأقسام الرئيسية ما تحتاج إلى معرفته وأي إجراءات مطلوبة وتواريخ ذات صلة. إذا كان هناك أي شيء غير واضح، يمكنني شرح أجزاء محددة بمزيد من التفصيل.",
    sw: "Muhtasari: Hati hii ina habari muhimu kuhusu kesi yako au huduma yako. Sehemu kuu zinashughulikia unachohitaji kujua, hatua zinazohitajika, na tarehe husika. Ikiwa kitu chochote hakijawazi, naweza kueleza sehemu mahususi kwa undani zaidi.",
    fr: "Résumé : Ce document contient des informations importantes sur votre dossier ou service. Les sections principales couvrent ce que vous devez savoir, les actions requises et les dates pertinentes. Si quelque chose n'est pas clair, je peux expliquer des parties spécifiques plus en détail.",
    so: "Kooban: Dukumentigan waxaa ku jira macluumaad muhiim ah oo ku saabsan kiiskaaga ama adeeggaaga. Qaybaha waaweyn waxay daboolayaan waxa aad u baahan tahay in aad ogaato, talaabooyinka lagu baahan yahay, iyo taariikhaha la xidhiidha. Hadii wax aan cadayn, waxaan ka sharxi karaa qaybaha gaarka ah si dhammaystir ah.",
    rw: "Inshuro: Iyi nyandiko ifite amakuru y'ingenzi ku byerekeye inshingano cyangwa serivisi yawe. Ibyice by'ingensi byerekora ibyo ugomba kumenya, ibikorwa byiswe, n'amatariki afite irebero. Ikindi bitagaragara neza, nshobora gusobanura ibice byihariye byinshi.",
  },
  translate_explain: {
    en: "Translation and explanation: I'll translate the key parts of this document and explain what they mean. The document appears to be an official notice. Here's the translation of the main points, followed by a plain-language explanation of what you need to do.",
    ar: "الترجمة والشرح: سأترجم الأجزاء الرئيسية من هذا المستند وأشرح ما تعنيه. يبدو أن المستند إشعار رسمي. إليك ترجمة النقاط الرئيسية، يليها شرح بلغة بسيطة لما تحتاج إلى فعله.",
    sw: "Tafsiri na ueleza: Nitafsiri sehemu kuu za hati hii na kueleza zimaanisha nini. Hati inaonekana kuwa arafa rasmi. Hapa kuna tafsiri ya pointi kuu, ikifuatwa na maelezo kwa lugha rahisi ya unachohitaji kufanya.",
    fr: "Traduction et explication : Je traduirai les parties clés de ce document et expliquerai ce qu'elles signifient. Le document semble être un avis officiel. Voici la traduction des points principaux, suivie d'une explication en langage clair de ce que vous devez faire.",
    so: "Turjumaad iyo sharax: Waxaan turjumi doonaa qaybaha waaweyn ee dokumentigan oo aan sharxi doonaa waxay ka dhigan yihiin. Dukumentigan wuxuu u ekaa digniin rasmi ah. Halkan waxaa ku qoran turjumaada dhibcaha waaweyn, kaas oo raacaya sharaxaad si fudud oo ku saabsan waxa aad u baahan tahay in aad sameysid.",
    rw: "Ubusobanuro n'ibisobanuro: Nzobanura ibice by'ingenzi bya iyi nyandiko nkaba nisobanura ibyo bivuga. Inyandiko isa n'itangazo ryemewe. Hano hari ubusobanuro bw'utudomo tw'ingenzi, bukurikijwe n'ibisobanuro mu rurimi rworoshye by'ibyo ugomba gukora.",
  },
  next_steps: {
    en: "Here's what you should do next: 1) Read the document carefully. 2) Note any deadlines or dates mentioned. 3) If the document requires a response, visit the relevant service desk. 4) If you're unsure about anything, bring the document to the service desk and a staff member will help you understand it.",
    ar: "إليك ما يجب عليك فعله بعد ذلك: 1) اقرأ المستند بعناية. 2) دون أي مواعيد نهائية أو تواريخ مذكورة. 3) إذا كان المستند يتطلب ردًا، قم بزيارة مكتب الخدمة ذي الصلة. 4) إذا لم تكن متأكدًا من أي شيء، أحضر المستند إلى مكتب الخدمة وسيساعدك أحد الموظفين على فهمه.",
    sw: "Hivi ndivyo unavyopaswa kufanya kesho: 1) Soma hati kwa makini. 2) Andika tarehe yoyote ya mwisho iliyotajwa. 3) Ikiwa hati inahitaji jibu, tembelea dawati husika la huduma. 4) Ukiwa na shaka juu ya chochote, lete hati kwenye dawati la huduma na mwanachama wa wafanyakazi atakusaidia kuelewa.",
    fr: "Voici ce que vous devriez faire ensuite : 1) Lisez le document attentivement. 2) Notez les échéances ou dates mentionnées. 3) Si le document exige une réponse, rendez-vous au bureau de service concerné. 4) Si vous n'êtes sûr de rien, apportez le document au bureau de service et un membre du personnel vous aidera à le comprendre.",
    so: "Halkan waxaa ku qoran waxa aad qabtayo xiga: 1) Akhri dukumentiga si taxaddar leh. 2) Qor taariikh kasta oo dhamaato ee la xusay. 3) Hadii dukumentigu uu u baahdo jawaab, booqo xafiiska adeegga ee la xidhiidha. 4) Hadii aanad hubin wax, keen dukumentiga xafiiska adeegga oo shaqaale kuu caawi doono fahminta.",
    rw: "Hano nibyo ugomba gukora bikurikije: 1) Soma inyandiko uhishe. 2) Andika itariki z'igihe cyo herezo cyangwa zibitswe. 3) Niba inyandiko isaba igisubizo, njyere ku biro by'imikorere byihariye. 4) Nutaboneza neza ikintu, zana inyandiko ku biro by'imikorere umukozi agufasha kuyisobanukirwa.",
  },
};

const GENERIC_RESPONSES = {
  en: "I'm here to help. Could you tell me a bit more about what you need? I can help with health services, legal and protection services, or understanding documents you've received.",
  ar: "أنا هنا للمساعدة. هل يمكنك إخباري بالمزيد عما تحتاجه؟ يمكنني المساعدة في الخدمات الصحية، والخدمات القانونية والحماية، أو فهم المستندات التي تلقيتها.",
  sw: "Niko hapa kukusaidia. Unaweza kuniambia kidogo zaidi kuhusu unachohitaji? Ninaweza kusaidia kwa huduma za afya, huduma za kisheria na ulinji, au kuelewa hati ulizopokea.",
  fr: "Je suis là pour vous aider. Pouvez-vous m'en dire un peu plus sur ce dont vous avez besoin ? Je peux vous aider avec les services de santé, les services juridiques et de protection, ou comprendre les documents que vous avez reçus.",
  so: "Waxaan halkan kuugu jiraa caawimaada. Ma i sheegi kartaa wax badan oo ku saabsan waxa aad u baahan tahay? Waxaan kaa caawin karaa adeegyada caafimaadka, adeegyada sharciga iyo ilaalinta, ama fahmita dukumentiyada aad qabatid.",
  rw: "Ndi hano ngufasha. Wanshobora kubwira byinshi byerekeye ibyo usaba? Nshobora gufasha ku bijyanye n'amaserivisi y'ubuzima, amategeko n'imiryango, cyangwa gusobanukirwa inyandiko wabonye.",
};

function pickByLang(map, lang) {
  return map[lang] || map.en;
}

// Intent detection — simple keyword matching for the demo.
// This will be replaced by the RAG backend; no complex NLP needed here.
function detectIntent(message) {
  const lower = message.toLowerCase();

  const documentKeywords = [
    'document', 'understand', 'letter', 'paper', 'explain this', 'what does this',
    'received', 'scan', 'scan it', 'what does it mean', 'what does this mean',
    'can you explain my document', 'i don\'t understand',
  ];
  const interpreterKeywords = ['interpreter', 'translate', 'language barrier', 'translation'];
  const legalKeywords = ['legal', 'asylum', 'protection', 'lawyer', 'court', 'rights', 'case', 'refugee status', 'resettlement'];
  const healthKeywords = ['health', 'clinic', 'doctor', 'medical', 'hospital', 'sick', 'medicine', 'pregnant', 'care', 'emergency', 'pharmacy'];

  if (documentKeywords.some((k) => lower.includes(k))) return 'document';
  if (interpreterKeywords.some((k) => lower.includes(k))) return 'interpreter';
  if (legalKeywords.some((k) => lower.includes(k))) return 'legal';
  if (healthKeywords.some((k) => lower.includes(k))) return 'health';

  return 'generic';
}

export function getDocumentIntro(lang) {
  return pickByLang(DOCUMENT_RESPONSES, lang);
}

export function getDocumentActionResponse(action, lang) {
  return pickByLang(DOCUMENT_ACTION_RESPONSES[action], lang);
}

export const DOCUMENT_ACTIONS = [
  { key: 'explain', label: 'Explain this document' },
  { key: 'summarize', label: 'Summarize it' },
  { key: 'translate_explain', label: 'Translate and explain it' },
  { key: 'next_steps', label: 'What should I do next?' },
  { key: 'ask_another', label: 'Ask another question' },
];

export function getAssistantResponse(message, context) {
  const { language = 'en', serviceType = 'health' } = context;
  const intent = detectIntent(message);

  let text;
  let source = null;

  switch (intent) {
    case 'health':
      text = pickByLang(HEALTH_RESPONSES, language);
      source = 'UNHCR / Service Provider Information';
      break;
    case 'legal':
      text = pickByLang(LEGAL_RESPONSES, language);
      source = 'UNHCR / Service Provider Information';
      break;
    case 'interpreter':
      text = pickByLang(INTERPRETER_RESPONSES, language);
      source = 'UNHCR / Service Provider Information';
      break;
    case 'document':
      text = pickByLang(DOCUMENT_HELP_RESPONSES, language);
      source = null;
      break;
    default:
      // Fall back to the selected service type if no intent is detected
      if (serviceType === 'legal') {
        text = pickByLang(LEGAL_RESPONSES, language);
        source = 'UNHCR / Service Provider Information';
      } else if (serviceType === 'health') {
        text = pickByLang(HEALTH_RESPONSES, language);
        source = 'UNHCR / Service Provider Information';
      } else {
        text = pickByLang(GENERIC_RESPONSES, language);
        source = null;
      }
  }

  return { text, source, isDemo: true, verified: false };
}
