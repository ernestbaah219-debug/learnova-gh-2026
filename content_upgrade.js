/* Learnova GH curriculum/content upgrade: deeper class-aware lessons, topic-matched examples and assessments. */
(()=>{
  const C=window.LEARNOVA_CURRICULUM||{};
  const rank=l=>{const m=String(l).match(/(Primary|JHS|SHS)\s*(\d+)/i);if(!m)return 1;return m[1].toLowerCase()==='primary'?+m[2]:m[1].toLowerCase()==='jhs'?6+ +m[2]:9+ +m[2]};
  const stage=l=>{const r=rank(l);return r<=3?'Foundation':r<=6?'Upper Primary':r<=9?'Junior High application':'Senior High analysis'};
  const official={
    primary:['English Language','Mathematics','Science','History','Creative Arts','Our World Our People','Religious and Moral Education','Physical Education','Ghanaian Language'],
    jhs:['English Language','Mathematics','Science','Social Studies','French','Arabic','Ghanaian Language','Physical Education and Health','Religious and Moral Education','Creative Arts and Design','Career Technology','Computing'],
    shs:['Additional Mathematics','Agricultural Science','Agriculture','Applied Technology','Arabic','Art and Design Foundation','Art and Design Studio','Aviation and Aerospace Engineering','Biology','Biomedical Science','Chemistry','Computing','Design Communication Technology','Economics','Engineering','English Language','French','General Science','Government','History','ICT','Literature in English','Manufacturing Engineering','Mathematics','Performing Arts','Physical Education and Health','Physics','Religious and Moral Education','Robotics','Social Studies','Spanish','Geography']
  };
  const topics={
    'English Language':['Reading Comprehension','Vocabulary Development','Grammar','Parts of Speech','Sentence Structure','Punctuation','Paragraph Writing','Summary Writing','Oral Communication','Critical Reading','Creative Writing','Information Retrieval'],
    'Mathematics':['Number and Numeration','Place Value','Four Operations','Fractions','Decimals','Percentages','Ratio and Proportion','Algebraic Expressions','Equations','Geometry','Measurement','Statistics','Probability','Graphs','Financial Mathematics','Problem Solving','Mathematical Reasoning'],
    'Additional Mathematics':['Sets and Logic','Functions','Algebra','Trigonometry','Coordinate Geometry','Sequences and Series','Vectors','Calculus','Statistics','Probability','Mathematical Modelling'],
    'Science':['Living Things','Matter','Energy','Forces','The Human Body','Plants','Animals','Earth and Space','Environment','Health and Safety','Scientific Investigation','Technology and Society'],
    'Integrated Science':['Scientific Method','Matter','Cells','Forces and Motion','Energy','Electricity','Waves','Human Biology','Ecology','Chemical Reactions','Scientific Investigation'],
    'General Science':['Scientific Measurement','Matter and Atomic Structure','Mechanics','Waves','Electricity','Chemistry','Cell Biology','Genetics','Ecology','Scientific Investigation'],
    'Social Studies':['The Individual and Society','Family and Community','Culture and Identity','Governance','Citizenship','Ghanaian Economy','Natural Resources','Environment','Population','National Development','Conflict and Peace','Globalisation'],
    'History':['Sources of History','Early Ghanaian States','Trans-Saharan Trade','European Contact','Colonial Rule','Nationalism','Independence','Post-Independence Ghana','Ghanaian Heritage','Historical Evidence','Historical Change and Continuity'],
    'Our World Our People':['Myself and My Family','My School','My Community','Our Environment','Culture and Identity','Citizenship','Health and Safety','Occupations','Resources','Ghana and the World'],
    'Religious and Moral Education':['God and Creation','Holy Books','Worship','Moral Values','Family Life','Community Responsibility','Peace and Conflict','Stewardship','Religious Practices','Respect and Tolerance','Leadership and Service'],
    'Physical Education':['Locomotor Skills','Non-Locomotor Skills','Manipulative Skills','Fitness','Games','Athletics','Dance','Safety','Healthy Living','Teamwork'],
    'Physical Education and Health':['Fitness and Wellness','Movement Skills','Games and Sports','Athletics','Dance','Personal Hygiene','Nutrition','Safety','Mental Wellbeing','Healthy Lifestyle'],
    'Creative Arts':['Drawing','Colour','Pattern','Design','Music','Drama','Dance','Craft','Art Appreciation','Creative Projects'],
    'Creative Arts and Design':['Design Process','Drawing and Illustration','Colour','Graphic Design','Craft','Textiles','Music','Drama','Dance','Creative Projects','Design Evaluation'],
    'Computing':['Computer Systems','Input and Output','Files and Folders','Word Processing','Presentations','Spreadsheets','Internet Safety','Algorithms','Programming','Digital Citizenship','Data and Information','Networks'],
    'ICT':['Computer Hardware','Software','Operating Systems','Networks','Databases','Spreadsheets','Web Technologies','Cyber Safety','Programming','Information Management'],
    'French':['Greetings and Introductions','Numbers','Family','School','Colours','Days and Months','Food and Drinks','Directions','Everyday Conversations','Basic Grammar','Reading Comprehension','Writing in French'],
    'Ghanaian Language':['Alphabet and Sounds','Greetings','Nouns','Pronouns','Verbs','Sentence Formation','Reading','Writing','Proverbs','Culture and Oral Tradition','Translation','Listening and Speaking'],
    'Arabic':['Alphabet','Sounds and Pronunciation','Numbers','Greetings','Family','School Vocabulary','Basic Sentences','Reading','Writing','Everyday Communication','Grammar','Translation'],
    'Spanish':['Greetings','Numbers','Family','School','Colours','Days and Months','Food','Directions','Conversation','Grammar','Reading','Translation'],
    'Career Technology':['Safety','Tools and Materials','Food and Nutrition','Clothing and Textiles','Woodwork','Metalwork','Electrical Basics','Entrepreneurship','Design and Making','Project Work'],
    'Agricultural Science':['Farm Planning','Soil','Crop Production','Animal Production','Farm Tools','Pests and Diseases','Farm Records','Agribusiness','Post-Harvest Management','Sustainable Agriculture','Farm Safety'],
    'Agriculture':['Soils','Crop Husbandry','Animal Husbandry','Farm Management','Farm Economics','Agricultural Extension','Pests and Diseases','Mechanisation','Agribusiness','Sustainable Agriculture'],
    'Applied Technology':['Technology and Society','Materials','Tools','Workshop Safety','Design','Manufacturing','Energy','Electronics','Automation','Project Development'],
    'Art and Design Foundation':['Visual Elements','Drawing','Colour Theory','Composition','Design Principles','Art History','Observation','Creative Thinking','Materials','Portfolio Development'],
    'Art and Design Studio':['Studio Practice','Drawing','Painting','Sculpture','Printmaking','Textiles','Mixed Media','Art Criticism','Contemporary Art','Portfolio Development'],
    'Aviation and Aerospace Engineering':['Aviation Safety','Aircraft Structure','Aerodynamics','Flight Principles','Propulsion','Navigation','Meteorology','Avionics','Maintenance','Aerospace Systems'],
    'Biology':['Cell Biology','Biological Molecules','Nutrition','Transport','Respiration','Photosynthesis','Genetics','Evolution','Ecology','Human Biology','Homeostasis'],
    'Biomedical Science':['Cells and Tissues','Anatomy','Physiology','Microbiology','Immunology','Disease','Laboratory Methods','Biochemistry','Genetics','Public Health'],
    'Chemistry':['Atomic Structure','Chemical Bonding','Stoichiometry','Acids Bases and Salts','Redox','Organic Chemistry','Equilibrium','Energetics','Rates of Reaction','Practical Chemistry'],
    'Design Communication Technology':['Technical Drawing','Design Principles','Orthographic Projection','Isometric Drawing','CAD','Materials','Structures','Product Design','Design Evaluation','Design Projects'],
    'Economics':['Basic Economic Concepts','Demand','Supply','Market Equilibrium','Production','National Income','Inflation','Unemployment','Public Finance','Ghanaian Economy','Economic Development'],
    'Engineering':['Engineering Materials','Mechanics','Electrical Principles','Thermodynamics','Fluid Systems','Structures','Manufacturing','Control Systems','Engineering Design','Project Management'],
    'Government':['State and Society','Constitution','Democracy','Political Parties','Pressure Groups','Public Opinion','Elections','Local Government','International Relations','Governance in Ghana','Human Rights'],
    'Geography':['Map Work','Rocks','Weather','Climate','Relief','Population','Settlement','Agriculture','Industry','Environmental Management','Fieldwork'],
    'Literature in English':['Prose','Poetry','Drama','Characterisation','Setting','Theme','Style','Literary Devices','Context','Critical Appreciation'],
    'Manufacturing Engineering':['Manufacturing Processes','Engineering Materials','Workshop Safety','Machining','Fabrication','Production Planning','Quality Control','Automation','Maintenance','Manufacturing Projects'],
    'Performing Arts':['Performance','Drama','Music','Dance','Stagecraft','Voice','Movement','Rehearsal','Audience','Production Project'],
    'Physics':['Measurement','Mechanics','Waves','Heat','Electricity','Magnetism','Light','Atomic Physics','Electronics','Practical Physics'],
    'Robotics':['Robotics Systems','Sensors','Actuators','Control','Programming','Circuits','Mechanical Design','Automation','Robot Ethics','Robotics Projects']
  };
  const defs={
    'Fractions':'A fraction is a number that represents part of a whole or a ratio of two quantities, written with a numerator and denominator.',
    'Decimals':'A decimal is a way of representing a number using place values based on powers of ten, including tenths, hundredths and thousandths.',
    'Percentages':'A percentage is a number expressed as a part out of one hundred.',
    'Ratio and Proportion':'A ratio compares two or more quantities by showing how much of one quantity there is compared with another.',
    'Place Value':'Place value is the value a digit has because of its position in a number.',
    'Algebraic Expressions':'An algebraic expression is a mathematical expression containing numbers, variables and operations.',
    'Equations':'An equation is a mathematical statement showing that two expressions have equal values.',
    'Photosynthesis':'Photosynthesis is the process by which green plants use light energy to make food from carbon dioxide and water, releasing oxygen.',
    'Cell Biology':'Cell biology is the study of cells, their structures, functions and activities.',
    'Cells':'A cell is the basic structural and functional unit of a living organism.',
    'Constitution':'A constitution is a set of fundamental rules and principles used to govern a country.',
    'Demand':'Demand is the quantity of a good or service consumers are willing and able to buy at different prices during a given period.',
    'Supply':'Supply is the quantity of a good or service producers are willing and able to offer for sale at different prices during a given period.',
    'Inflation':'Inflation is a sustained rise in the general level of prices of goods and services over time.',
    'Probability':'Probability is the measure of how likely an event is to occur.',
    'Geometry':'Geometry is the branch of mathematics concerned with shapes, sizes, positions, angles and properties of space.',
    'Statistics':'Statistics is the collection, organisation, analysis and interpretation of data.',
    'Grammar':'Grammar is the system of rules that governs how words are formed and arranged to communicate meaning.',
    'Reading Comprehension':'Reading comprehension is the ability to understand, interpret and evaluate information in a written passage.',
    'Translation':'Translation is the process of changing a message from one language into another while preserving its meaning.',
    'Programming':'Programming is the process of designing and writing instructions that a computer can execute to perform tasks.',
    'Algorithms':'An algorithm is a clear, ordered set of steps used to solve a problem or complete a task.',
    'Ecosystems':'An ecosystem is a community of living organisms interacting with one another and with the non-living parts of their environment.',
    'Electricity':'Electricity is the movement or presence of electric charge and the effects produced by that charge.',
    'Forces':'A force is a push or pull that can change the motion, direction or shape of an object.',
    'Energy':'Energy is the capacity to do work or cause change.',
    'Matter':'Matter is anything that has mass and occupies space.',
    'Acids Bases and Salts':'Acids, bases and salts are classes of substances with characteristic chemical properties and reactions.',
    'Chemical Bonding':'Chemical bonding is the attraction that holds atoms or ions together in substances.',
    'Genetics':'Genetics is the study of heredity and how characteristics are passed from parents to offspring.',
    'Ecology':'Ecology is the study of relationships between organisms and between organisms and their environment.'
  };
  const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=(h^s.charCodeAt(i))*16777619>>>0;return h>>>0};
  const num=(seed,min,max)=>min+((seed>>>0)%(max-min+1));
  function ensure(level,subject,list){if(!C[level])C[level]={};if(!C[level][subject])C[level][subject]=[];const arr=C[level][subject],seen=new Set(arr.map(x=>String(x.title).toLowerCase()));for(const title of list){if(!seen.has(title.toLowerCase())){arr.push({title,keyIdea:title,explanation:'',examples:[],questions:[]});seen.add(title.toLowerCase())}}}
  for(let n=1;n<=6;n++){const l=`Primary ${n}`;ensure(l,'English Language',topics['English Language']);ensure(l,'Mathematics',topics.Mathematics);ensure(l,'Science',topics.Science);ensure(l,'History',topics.History);ensure(l,'Creative Arts',topics['Creative Arts']);ensure(l,'Our World Our People',topics['Our World Our People']);ensure(l,'Religious and Moral Education',topics['Religious and Moral Education']);ensure(l,'Physical Education',topics['Physical Education']);ensure(l,'Ghanaian Language',topics['Ghanaian Language']);if(n>=4){ensure(l,'French',topics.French);ensure(l,'Computing',topics.Computing)}}
  for(let n=1;n<=3;n++){const l=`JHS ${n}`;for(const s of official.jhs)ensure(l,s,topics[s]||['Introduction','Key Concepts','Applications','Practical Work','Assessment']);if(C[l]?.['Science']&&C[l]?.['Integrated Science'])delete C[l]['Integrated Science'];}
  for(let n=1;n<=3;n++){const l=`SHS ${n}`;for(const s of official.shs)ensure(l,s,topics[s]||['Introduction','Core Concepts','Applications','Practical Work','Data Analysis','Problem Solving','Evaluation']);}
  function definition(title,subject){
    const key=String(title||'').trim();
    if(defs[key]) return defs[key];
    const low=key.toLowerCase(), sub=String(subject||'').toLowerCase();
    const smart={
      'our environment':'The environment is the total of the living and non-living things that surround us and affect life.',
      'environment':'The environment is the total of the living and non-living things that surround us and affect life.',
      'living things':'Living things are organisms that carry out life processes such as nutrition, respiration, growth, excretion and reproduction.',
      'plants':'Plants are living organisms that usually make their own food by photosynthesis and have structures such as roots, stems and leaves.',
      'animals':'Animals are living organisms that obtain food from other organisms and respond to changes in their surroundings.',
      'human body':'The human body is the organised structure of tissues, organs and organ systems that work together to keep a person alive and functioning.',
      'family and community':'A family is a group of people related by birth, marriage or care, while a community is a group of people living or working together in a particular place.',
      'citizenship':'Citizenship is the status of belonging to a country, together with the rights, duties and responsibilities that come with that membership.',
      'governance':'Governance is the process by which decisions are made, authority is exercised and public affairs are managed.',
      'democracy':'Democracy is a system of government in which citizens participate in choosing leaders and in public decision-making.',
      'culture and identity':'Culture is the shared way of life of a group of people, while identity is the sense of who a person or group is.',
      'natural resources':'Natural resources are useful materials and features obtained from nature, such as water, soil, forests, minerals and wildlife.',
      'national development':'National development is the improvement of a country’s economic, social, political, technological and environmental conditions for the wellbeing of its people.',
      'conflict and peace':'Conflict is a disagreement or struggle between people or groups, while peace is a condition in which disputes are managed without violence and people live cooperatively.',
      'population':'Population is the total number of people living in a particular place at a given time.',
      'map work':'Map work is the use and interpretation of maps to locate places, measure distance, identify patterns and understand geographical features.',
      'weather':'Weather is the condition of the atmosphere at a particular place and time, including temperature, rainfall, wind, humidity and cloud cover.',
      'climate':'Climate is the long-term pattern of weather conditions experienced in a place, usually described over many years.',
      'rocks':'Rocks are naturally occurring solid materials made of one or more minerals or mineral-like substances that form part of the Earth’s crust.',
      'soil':'Soil is the upper layer of the Earth’s surface in which plants grow, containing mineral particles, organic matter, air and water.',
      'photosynthesis':'Photosynthesis is the process by which green plants use light energy to make glucose from carbon dioxide and water, releasing oxygen as a by-product.',
      'cell biology':'Cell biology is the study of cells, including their structures, functions, activities and interactions.',
      'scientific method':'The scientific method is a systematic way of investigating questions by observing, forming hypotheses, testing them, analysing evidence and drawing conclusions.',
      'scientific investigation':'Scientific investigation is a planned process of asking a question, collecting evidence through observation or experiment, analysing results and drawing a conclusion.',
      'matter':'Matter is anything that has mass and occupies space.',
      'energy':'Energy is the capacity to do work or cause change.',
      'forces':'A force is a push or pull that can change the motion, direction or shape of an object.',
      'electricity':'Electricity is the movement or presence of electric charge and the effects produced by that charge.',
      'ecosystems':'An ecosystem is a community of living organisms interacting with one another and with the non-living parts of their environment.',
      'programming':'Programming is the process of designing and writing instructions that a computer can execute to perform tasks.',
      'algorithms':'An algorithm is a clear, ordered set of steps used to solve a problem or complete a task.',
      'computer systems':'A computer system is a combination of hardware, software, data and users that work together to process information.',
      'digital citizenship':'Digital citizenship is the responsible, safe and respectful use of digital technologies and online services.',
      'internet safety':'Internet safety is the practice of protecting personal information, devices and wellbeing while using online services.',
      'grammar':'Grammar is the system of rules that governs how words are formed and arranged to communicate meaning.',
      'reading comprehension':'Reading comprehension is the ability to understand, interpret and evaluate information in a written passage.',
      'summary writing':'Summary writing is the skill of presenting the main ideas of a longer text briefly and accurately in one’s own words.',
      'creative writing':'Creative writing is the use of imagination and language to create original stories, poems, descriptions or other literary works.',
      'oral communication':'Oral communication is the exchange of ideas, information and feelings through spoken language, supported by listening and appropriate expression.',
      'vocabulary development':'Vocabulary development is the process of learning, understanding and correctly using new words.',
      'translation':'Translation is the process of changing a message from one language into another while preserving its meaning.',
      'greetings and introductions':'Greetings and introductions are expressions used to meet people politely, say hello and give basic information about oneself or another person.',
      'family':'Family is the group of people connected by birth, marriage, adoption or close care and responsibility.',
      'food and drinks':'Food and drinks are substances people consume to obtain nutrients, water and energy needed for growth, health and daily activities.',
      'directions':'Directions are words or instructions used to tell someone where to go or how to reach a place.',
      'basic grammar':'Basic grammar is the set of foundational rules for forming correct words, phrases and sentences in a language.',
      'tools and materials':'Tools and materials are equipment and substances selected and used to make, repair or construct useful products safely.',
      'entrepreneurship':'Entrepreneurship is the process of identifying an opportunity, organising resources and taking calculated risks to create value through a business or project.',
      'farm planning':'Farm planning is the process of deciding what, where, when and how farming activities will be carried out using available land, labour, capital and other resources.',
      'crop production':'Crop production is the planned cultivation and management of crops from land preparation through planting, care, harvesting and storage.',
      'animal production':'Animal production is the scientific and practical management of livestock for useful products such as meat, milk, eggs, fibre or work.',
      'sustainable agriculture':'Sustainable agriculture is farming that meets present needs while conserving soil, water, biodiversity and other resources for future generations.',
      'demand':'Demand is the quantity of a good or service consumers are willing and able to buy at different prices during a given period.',
      'supply':'Supply is the quantity of a good or service producers are willing and able to offer for sale at different prices during a given period.',
      'inflation':'Inflation is a sustained rise in the general level of prices of goods and services over time.',
      'unemployment':'Unemployment is a situation in which people who are able and willing to work and are seeking work do not have jobs.',
      'national income':'National income is the total income earned by the factors of production of a country during a given period, usually one year.',
      'public finance':'Public finance is the management of government revenue, expenditure, borrowing and financial resources.',
      'constitution':'A constitution is a set of fundamental rules and principles used to govern a country and define how state power is organised and exercised.',
      'human rights':'Human rights are basic rights and freedoms that belong to every person simply because they are human.',
      'elections':'Elections are organised processes through which citizens choose representatives or decide on public issues by voting.',
      'political parties':'Political parties are organised groups of people who share political ideas and seek to influence government, usually by winning elections.',
      'prose':'Prose is written or spoken language arranged in ordinary sentences and paragraphs rather than in the regular rhythmic form of poetry.',
      'poetry':'Poetry is literary expression that uses carefully chosen language, rhythm, imagery and other devices to communicate ideas and feelings.',
      'drama':'Drama is a literary and performing form in which characters and events are presented through dialogue, action and performance.',
      'characterisation':'Characterisation is the way a writer or performer creates and develops the personality, qualities and behaviour of a character.',
      'setting':'Setting is the time, place and social environment in which a story, play or other narrative occurs.',
      'theme':'A theme is a central idea, message or insight explored in a literary or artistic work.',
      'literary devices':'Literary devices are deliberate techniques such as metaphor, simile, imagery and personification used to create meaning or effect in a text.',
      'atomic structure':'Atomic structure is the arrangement of protons, neutrons and electrons within an atom.',
      'chemical bonding':'Chemical bonding is the attraction that holds atoms or ions together in substances.',
      'stoichiometry':'Stoichiometry is the calculation of the quantitative relationships between reactants and products in a chemical reaction.',
      'genetics':'Genetics is the study of heredity and how characteristics are passed from parents to offspring.',
      'evolution':'Evolution is the change in inherited characteristics of populations over generations.',
      'homeostasis':'Homeostasis is the maintenance of relatively stable internal conditions in an organism despite changes in its external or internal environment.',
      'microbiology':'Microbiology is the study of microorganisms such as bacteria, fungi, protozoa and microscopic algae, including their structure and effects.',
      'immunology':'Immunology is the study of the immune system and how the body recognises and responds to harmful substances and pathogens.',
      'aerodynamics':'Aerodynamics is the study of how air moves around objects and the forces produced when objects move through air.',
      'flight principles':'Flight principles are the scientific principles explaining how an aircraft becomes airborne, moves through the air and is controlled.',
      'sensors':'Sensors are devices that detect physical conditions such as light, temperature, distance or motion and convert them into signals.',
      'actuators':'Actuators are devices that convert control signals into physical movement or action.',
      'automation':'Automation is the use of technology and control systems to perform tasks with reduced direct human intervention.'
    };
    if(smart[low]) return smart[low];
    if(/math|additional mathematics/i.test(sub)){
      if(/number/i.test(low)) return `${key} is the mathematical study of numbers, their properties, relationships and operations.`;
      if(/geometry/i.test(low)) return `${key} is the study of shapes, sizes, positions, angles and spatial relationships.`;
      if(/statistics/i.test(low)) return `${key} is the mathematical study of collecting, organising, analysing and interpreting data.`;
      if(/probability/i.test(low)) return `${key} is the study and measurement of the likelihood of events occurring.`;
      if(/algebra|function|equation/i.test(low)) return `${key} is a mathematical method for representing quantities and relationships using numbers, symbols and rules.`;
      if(/calculus/i.test(low)) return `${key} is the branch of mathematics concerned with change, rates of change and accumulation.`;
      return `${key} is a mathematical concept used to represent quantities, relationships or patterns and to solve problems.`;
    }
    if(/science|biology|chemistry|physics|biomedical/i.test(sub)) return `${key} is the scientific study of a particular aspect of the natural world, using observation, evidence, models and investigation.`;
    if(/language|english|french|arabic|spanish/i.test(sub)) return `${key} is a language skill or language feature used to understand, communicate or express meaning accurately.`;
    if(/history/i.test(sub)) return `${key} is the study of a historical event, development, source or change and its significance over time.`;
    if(/geography/i.test(sub)) return `${key} is the geographical study of a place, physical feature, human activity or relationship between people and the environment.`;
    if(/government|social studies|rme/i.test(sub)) return `${key} is the study of a social, civic, moral or political idea and its role in people’s lives and society.`;
    if(/computing|ict|robotics/i.test(sub)) return `${key} is the study or practical use of digital systems, information, computation or technology to solve problems and perform tasks.`;
    if(/agric/i.test(sub)) return `${key} is the study or practical management of an agricultural activity, resource, process or production system.`;
    if(/art|creative|design|performing/i.test(sub)) return `${key} is the study and practical application of creative ideas, techniques, materials or performance methods to communicate or make something.`;
    if(/technology|engineering|career/i.test(sub)) return `${key} is the study and practical application of tools, materials, systems and processes to design, make, maintain or improve useful products.`;
    return `${key} is a subject-specific concept concerned with ${key.toLowerCase()}, studied so that learners can understand its meaning, features, uses and applications.`;
  }
  function levelDemand(l){const r=rank(l);if(r<=3)return 'Learners should identify, describe and use the idea in familiar situations using clear, simple language.';if(r<=6)return 'Learners should explain how and why the idea works, connect it to examples, and apply it to new but familiar situations.';if(r<=9)return 'Learners should apply the concept to unfamiliar situations, compare ideas, explain causes and effects, and justify their answers.';return 'Learners should analyse unfamiliar situations, combine concepts, evaluate evidence, justify conclusions and solve multi-step problems.'}
  function importanceFor(title,subject){const x=String(title||'').toLowerCase(),s=String(subject||'').toLowerCase();
    const map={
      'environment':'It helps learners understand how living things depend on their surroundings and how human actions can protect or damage natural resources.',
      'cells':'It helps learners understand how living organisms are built and how specialised cells work together to keep an organism alive.',
      'photosynthesis':'It explains how green plants make food, release oxygen and provide the energy that supports many food chains.',
      'matter':'It helps learners explain the materials around them and understand changes such as melting, boiling, freezing and condensation.',
      'forces':'It helps learners explain movement, balance and changes in the motion or shape of objects in everyday life and technology.',
      'energy':'It helps learners understand how machines, organisms and everyday activities obtain, transfer and use energy.',
      'electricity':'It helps learners understand electrical circuits, safe use of electrical devices and how electrical energy is used in homes, schools and industry.',
      'fractions':'It helps learners represent parts of wholes accurately and solve problems involving sharing, measurement, money, time and quantities.',
      'decimals':'It helps learners represent precise quantities and perform accurate calculations involving money, measurements and data.',
      'percentages':'It helps learners compare quantities and solve everyday problems involving discounts, increases, marks, taxes and rates.',
      'ratio and proportion':'It helps learners compare quantities fairly and solve problems involving recipes, scale, mixtures, speed and sharing.',
      'algebraic expressions':'It helps learners represent unknown quantities and relationships compactly so that mathematical problems can be solved systematically.',
      'equations':'It helps learners find unknown quantities by expressing a relationship as two equal quantities and applying inverse operations.',
      'geometry':'It helps learners understand shape and space and apply measurements when designing, building, drawing and solving practical problems.',
      'statistics':'It helps learners turn data into useful information so that patterns, comparisons and decisions can be supported by evidence.',
      'probability':'It helps learners measure uncertainty and make informed predictions about events in games, science, business and everyday decisions.',
      'reading comprehension':'It helps learners understand instructions, textbooks, stories, examination questions and information from everyday sources.',
      'grammar':'It helps learners communicate ideas clearly and correctly in speech and writing.',
      'vocabulary development':'It increases the range of words learners can understand and use, improving reading, writing, speaking and listening.',
      'translation':'It helps learners communicate meaning accurately between languages and understand people from different language backgrounds.',
      'citizenship':'It helps learners understand their rights and responsibilities and participate responsibly in their communities and country.',
      'history':'It helps learners understand how past events shaped present communities, institutions, identities and national development.',
      'governance':'It helps learners understand how public decisions are made, how authority is exercised and how citizens can participate responsibly.',
      'demand':'It helps learners understand how consumers respond to prices and other factors in markets.',
      'supply':'It helps learners understand how producers decide what quantities to offer and how markets respond to changing conditions.',
      'inflation':'It helps learners understand changes in purchasing power, living costs, savings and economic decisions.',
      'programming':'It develops logical problem-solving skills and enables learners to create useful digital tools and automated solutions.',
      'algorithms':'It teaches learners to break problems into clear, ordered steps before implementing a solution.',
      'agriculture':'It connects scientific knowledge with food production, livelihoods, environmental care and national development.',
      'entrepreneurship':'It develops the ability to identify opportunities, organise resources, create value and solve practical problems.'
    };
    for(const k of Object.keys(map)) if(x.includes(k)) return map[k];
    if(/math/i.test(s)) return `It gives learners a reliable mathematical method for solving ${x} problems, checking results and applying quantitative reasoning to real situations.`;
    if(/science|biology|chemistry|physics/i.test(s)) return `It helps learners explain natural phenomena, interpret evidence and apply scientific knowledge to health, technology and the environment.`;
    if(/language|english|french|arabic|spanish/i.test(s)) return `It strengthens communication by helping learners understand, express and interpret meaning accurately in ${subject}.`;
    if(/history/i.test(s)) return `It helps learners connect past events and evidence with changes in society and the development of communities and Ghana.`;
    if(/government|social studies|rme/i.test(s)) return `It helps learners understand people, values, institutions, rights, responsibilities and decisions that affect society.`;
    if(/computing|ict|robotics/i.test(s)) return `It helps learners use technology responsibly and solve problems with digital systems, information and computational thinking.`;
    if(/agric/i.test(s)) return `It develops practical knowledge that can improve agricultural production, resource management, food security and livelihoods.`;
    return `It matters because it gives learners knowledge and practical understanding they can use to interpret situations, make sound decisions and solve relevant problems.`;
  }
  function understandingFor(title,subject,l){const r=rank(l),x=String(title||'').toLowerCase();
    let method='Start with the textbook definition, identify the key terms and parts, study a worked example or real situation, practise the method, and explain the result in your own words.';
    if(/math/i.test(subject)) method='Start by identifying the quantities and what is being asked. Write the rule or formula, substitute the values, show each calculation on a separate line, simplify carefully, include units where needed, and check the final answer against the question.';
    else if(/science|biology|chemistry|physics/i.test(subject)) method='Start with the definition, identify the parts or variables involved, describe the process in the correct order, connect cause and effect, then use observations or evidence to support the conclusion.';
    else if(/language|english|french|arabic|spanish/i.test(subject)) method='Start with meaning and vocabulary, examine the sentence or passage, identify the language feature, translate or paraphrase accurately when needed, then use the feature in a new sentence or context.';
    else if(/history|government|social studies/i.test(subject)) method='Start with the key term or event, identify who or what is involved, explain causes and effects, use relevant evidence or examples, and connect the idea to Ghanaian or wider society.';
    if(r>=10) method+=' At SHS level, compare alternatives, analyse evidence, justify conclusions and solve unfamiliar or multi-step problems.';
    else if(r>=7) method+=' At JHS level, apply the idea to new situations, explain causes and effects and justify the answer.';
    else if(r>=4) method+=' In upper primary, move from simple examples to explaining how and why the idea works.';
    else method+=' In lower primary, use familiar objects, simple language and repeated practice before moving to new examples.';
    return method;
  }
  function mathExamples(title,l){
    const seed=hash(l+'|'+title),a=num(seed,2,12),b=num(seed>>4,2,15),c=num(seed>>8,2,9),d=num(seed>>12,2,20),u=num(seed>>16,2,8);
    const E=[]; const push=x=>E.push(x);
    if(/number and numeration/i.test(title)){push(`Example 1: Add ${a} + ${b}.<br><b>Solution:</b> ${a} + ${b} = <b>${a+b}</b>.`);push(`Example 2: Subtract ${a} from ${d}.<br><b>Solution:</b> ${d} − ${a} = <b>${d-a}</b>.`);push(`Example 3: Multiply ${a} × ${b}.<br><b>Solution:</b> ${a} × ${b} = <b>${a*b}</b>.`);push(`Example 4: Divide ${d*b} by ${b}.<br><b>Solution:</b> ${d*b} ÷ ${b} = <b>${d}</b>.`)}
    else if(/place value/i.test(title)){const n=`${a}${b}${c}${d}`;push(`Example 1: In ${n}, identify the place value of the digit ${b}.<br><b>Solution:</b> Starting from the right, the places are ones, tens, hundreds, thousands. Locate ${b} and multiply the digit by its place value.`);push(`Example 2: Write ${n} in expanded form.<br><b>Solution:</b> Separate each digit according to its place value: ${a}×10000 + ${b}×1000 + ${c}×100 + ${d}×10 + ${u}.`)}
    else if(/four operations/i.test(title)){push(`Example 1: ${a} + ${b} × ${c}.<br><b>Solution:</b> Multiply first: ${b} × ${c} = ${b*c}. Then add ${a}: ${a} + ${b*c} = <b>${a+b*c}</b>.`);push(`Example 2: (${a} + ${b}) × ${c}.<br><b>Solution:</b> Brackets first: ${a}+${b}=${a+b}. Then ${a+b}×${c}=<b>${(a+b)*c}</b>.`)}
    else if(/fraction/i.test(title)){const den1=4,den2=6;push(`Example 1: Add 1/${den1} + 1/${den2}.<br><b>Solution:</b> LCM of 4 and 6 is 12. Convert: 1/4=3/12 and 1/6=2/12. Add: 3/12+2/12=<b>5/12</b>.`);push(`Example 2: Find 3/4 of ${d*4}.<br><b>Solution:</b> ${d*4} ÷ 4 = ${d}; ${d} × 3 = <b>${d*3}</b>.`);push(`Example 3: Simplify ${a*2}/${a*4}.<br><b>Solution:</b> Divide numerator and denominator by ${a*2}: <b>1/2</b>.`)}
    else if(/decimal/i.test(title)){push(`Example 1: Add ${a}.${c} + ${b}.${c}.<br><b>Solution:</b> Align decimal points: ${a}.${c} + ${b}.${c} = <b>${a+b}.${c*2}</b> (carry where necessary).`);push(`Example 2: Multiply ${a}.${c} × 10.<br><b>Solution:</b> Move the decimal point one place right: <b>${a*10+c}</b>.`)}
    else if(/percentage/i.test(title)){const p=c*5,price=a*20;push(`Example 1: Find ${p}% of GH₵${price}.<br><b>Solution:</b> ${p}/100 × ${price} = <b>GH₵${price*p/100}</b>.`);push(`Example 2: A learner scores ${a} out of ${b}. Find the percentage.<br><b>Solution:</b> ${a}/${b} × 100 = <b>${(a/b*100).toFixed(2)}%</b>.`);push(`Example 3: Increase ${price} by ${p}%.<br><b>Solution:</b> Increase = ${price}×${p}/100=${price*p/100}. New value = ${price}+${price*p/100}=<b>${price+price*p/100}</b>.`)}
    else if(/ratio and proportion/i.test(title)){push(`Example 1: Share ${a+b} in the ratio ${a}:${b}.<br><b>Solution:</b> Total parts=${a}+${b}=${a+b}. One part=(${a+b})÷(${a+b})=1. Shares are <b>${a} and ${b}</b>.`);push(`Example 2: If 3 books cost GH₵${d*3}, one book costs ${d*3}÷3=GH₵${d}. Five books cost 5×${d}=<b>GH₵${d*5}</b>.`)}
    else if(/algebraic expressions/i.test(title)){push(`Example 1: Evaluate 3x + 5 when x=${a}.<br><b>Solution:</b> 3(${a})+5=${3*a}+5=<b>${3*a+5}</b>.`);push(`Example 2: Simplify ${a}x + ${b}x − ${c}.<br><b>Solution:</b> Combine like terms: (${a}+${b})x−${c}=<b>${a+b}x−${c}</b>.`);push(`Example 3: Expand ${a}(x+${b}).<br><b>Solution:</b> ${a}×x + ${a}×${b} = <b>${a}x+${a*b}</b>.`)}
    else if(/equations/i.test(title)){push(`Example 1: Solve ${a}x + ${b} = ${a*c+b}.<br><b>Solution:</b> Subtract ${b}: ${a}x=${a*c}. Divide by ${a}: <b>x=${c}</b>. Check: ${a}(${c})+${b}=${a*c+b}.`);push(`Example 2: Solve 2x = ${d*2}.<br><b>Solution:</b> Divide both sides by 2: x=${d*2}÷2=<b>${d}</b>.`)}
    else if(/statistics/i.test(title)){push(`Example 1: Find the mean of ${a}, ${b}, ${c}.<br><b>Solution:</b> Sum=${a}+${b}+${c}=${a+b+c}. Count=3. Mean=${a+b+c}÷3=<b>${((a+b+c)/3).toFixed(2)}</b>.`);push(`Example 2: Find the median of ${a}, ${b}, ${c}.<br><b>Solution:</b> Arrange from smallest to largest, then select the middle value.`)}
    else if(/probability/i.test(title)){push(`Example 1: A bag has ${a+b} counters and ${a} are red. Find P(red).<br><b>Solution:</b> P(red)=favourable÷total=${a}/${a+b}.`);push(`Example 2: What is the probability of an impossible event?<br><b>Solution:</b> No outcome is favourable, so P=0.`)}
    else if(/area|perimeter|geometry/i.test(title)){push(`Example 1: A rectangle is ${a} m long and ${b} m wide. Find its area.<br><b>Solution:</b> A=l×w=${a}×${b}=<b>${a*b} m²</b>.`);push(`Example 2: Find its perimeter.<br><b>Solution:</b> P=2(l+w)=2(${a}+${b})=<b>${2*(a+b)} m</b>.`);push(`Example 3: Triangle with base ${a} cm and height ${b} cm.<br><b>Solution:</b> A=½bh=½×${a}×${b}=<b>${.5*a*b} cm²</b>.`)}
    else if(/measurement/i.test(title)){push(`Example 1: Convert ${a} km to metres.<br><b>Solution:</b> 1 km=1000 m, so ${a}×1000=<b>${a*1000} m</b>.`);push(`Example 2: Convert ${b} m to centimetres.<br><b>Solution:</b> 1 m=100 cm, so ${b}×100=<b>${b*100} cm</b>.`)}
    else if(/financial mathematics/i.test(title)){push(`Example 1: An item costs GH₵${d*10} and is discounted by ${c*5}%.<br><b>Solution:</b> Discount=${d*10}×${c*5}/100=GH₵${d*10*c*5/100}. Sale price=GH₵${d*10-d*10*c*5/100}.`);push(`Example 2: Simple interest on GH₵${d*100} at ${c*2}% for 2 years.<br><b>Solution:</b> I=PRT/100=${d*100}×${c*2}×2/100=<b>GH₵${d*100*c*2*2/100}</b>.`)}
    else if(/graphs/i.test(title)){push(`Example 1: Points are (1,2) and (3,6). Find the gradient.<br><b>Solution:</b> m=(6−2)/(3−1)=4/2=<b>2</b>.`);push(`Example 2: If y=2x+1 and x=3, find y.<br><b>Solution:</b> y=2(3)+1=<b>7</b>.`)}
    else if(/problem solving/i.test(title)){push(`Example 1: A learner has GH₵${d*2}, spends GH₵${a}, then receives GH₵${b}.<br><b>Solution:</b> ${d*2}−${a}+${b}=<b>GH₵${d*2-a+b}</b>.`);push(`Example 2: A trip covers ${a} km in ${b} hours. Speed=distance÷time=${a}÷${b}=<b>${(a/b).toFixed(2)} km/h</b>.`)}
    else {push(`Example 1: Identify the given values, choose the correct mathematical rule, substitute the values, calculate and check the result.`);push(`Example 2: Change one value in a ${title} problem and solve again, explaining how the answer changes.`);push(`Example 3: Create a real-life ${title} problem using money, measurement, time, data or quantities, then show the complete solution.`)}
    while(E.length<10)E.push(`Worked Example ${E.length+1}: Create a ${title} problem appropriate for ${l}. <b>Solution method:</b> write the given information → choose the correct rule/formula → substitute values → calculate each step → state the final answer with units → check that the answer is reasonable.`);
    return E.slice(0,10);
  }
  function languageExamples(title,subject,l){const french=/french/i.test(subject), pairs=french?['Bonjour — Hello','Merci — Thank you','Comment allez-vous ? — How are you?','Je m’appelle Ama. — My name is Ama.','J’aime apprendre. — I like learning.','Où est l’école ? — Where is the school?','Au revoir. — Goodbye.','S’il vous plaît. — Please.','Quel âge as-tu ? — How old are you?','À demain. — See you tomorrow.']:['Akwaaba — Welcome','Medaase — Thank you','Mepa wo kyɛw — Please','Wo ho te sɛn? — How are you?','Me din de Ama. — My name is Ama.','Meda wo ase. — I thank you.','Ɛhe na sukuu no wɔ? — Where is the school?','Yɛbɛhyia bio. — See you again.','M’ani gye ho. — I like it.','Meda wo akye. — Good morning.'];return pairs.map((p,i)=>`Example ${i+1}: ${p}. In ${l}, explain the meaning, identify the language feature in <b>${title}</b>, and use it in a short sentence.`)}
  function otherExamples(title,subject,l){
    const x=String(title||'').toLowerCase(), s=String(subject||'').toLowerCase();
    const map=[];
    if(/constitution/.test(x)) map.push(`Example 1 — Definition: A constitution is a set of fundamental rules used to govern a country.<br><b>Importance:</b> A constitution helps a country to set laws, organise government and protect citizens' rights.<br><b>Real-life application:</b> Government institutions use constitutional rules when making and applying public decisions.`);
    else if(/demand/.test(x)) map.push(`Example 1 — Definition: Demand is the quantity of a good or service consumers are willing and able to buy at a given price and time.<br><b>Importance:</b> Demand helps businesses decide what customers are likely to buy.<br><b>Real-life application:</b> A shop may stock more school bags before a new school term because demand is expected to rise.`);
    else if(/supply/.test(x)) map.push(`Example 1 — Definition: Supply is the quantity of a good or service producers are willing and able to offer for sale at a given price and time.<br><b>Importance:</b> Supply helps producers plan how much to produce and sell.<br><b>Real-life application:</b> A farmer may send more tomatoes to market when a larger harvest is available.`);
    else if(/photosynthesis/.test(x)) map.push(`Example 1 — Definition: Photosynthesis is the process by which green plants use light energy to make glucose from carbon dioxide and water.<br><b>Importance:</b> Photosynthesis provides food for plants and releases oxygen needed by many living things.<br><b>Real-life application:</b> Farmers provide healthy plants with suitable light, water and carbon dioxide so they can make food effectively.`);
    else if(/ecosystem|ecology/.test(x)) map.push(`Example 1 — Definition: An ecosystem is a community of living organisms interacting with one another and with their physical environment.<br><b>Importance:</b> Understanding ecosystems helps people protect biodiversity and natural resources.<br><b>Real-life application:</b> Protecting wetlands helps preserve habitats, water quality and food chains.`);
    else if(/electricity|circuit/.test(x)) map.push(`Example 1 — Definition: An electric circuit is a complete path through which electric current can flow.<br><b>Importance:</b> Understanding circuits helps people use electrical devices safely and correctly.<br><b>Real-life application:</b> A torch works when its battery, switch and lamp form a complete circuit.`);
    else if(/force/.test(x)) map.push(`Example 1 — Definition: A force is a push or pull that can change the motion or shape of an object.<br><b>Importance:</b> Forces help us understand movement, balance and how machines work.<br><b>Real-life application:</b> Kicking a football applies a force that changes the ball's motion.`);
    else if(/matter|states of matter/.test(x)) map.push(`Example 1 — Definition: Matter is anything that has mass and occupies space.<br><b>Importance:</b> Understanding matter helps explain the materials used at home, school and in industry.<br><b>Real-life application:</b> Ice melts into liquid water when it gains enough heat.`);
    else if(/inflation/.test(x)) map.push(`Example 1 — Definition: Inflation is a sustained increase in the general price level of goods and services over time.<br><b>Importance:</b> Inflation helps people understand why the purchasing power of money can change.<br><b>Real-life application:</b> If the price of common food items rises, a fixed amount of money may buy fewer items than before.`);
    else if(/citizenship|rights|responsibil/.test(x)) map.push(`Example 1 — Definition: Citizenship concerns membership of a country together with the rights and responsibilities connected with that membership.<br><b>Importance:</b> Good citizenship helps communities maintain order, cooperation and responsible participation.<br><b>Real-life application:</b> A citizen can obey laws, protect public property and participate responsibly in community activities.`);
    else if(/history|colonial|independence/.test(x)) map.push(`Example 1 — Definition: History is the study of past events using evidence such as documents, artefacts, oral accounts and records.<br><b>Importance:</b> History helps people understand how past events shaped present society.<br><b>Real-life application:</b> Studying Ghana's past helps learners understand changes in governance, culture and national development.`);
    else if(/grammar|noun|verb|adjective|sentence/.test(x)) map.push(`Example 1 — Definition: Grammar is the system of rules that governs how words are formed and combined in a language.<br><b>Importance:</b> Grammar helps speakers and writers communicate ideas clearly and accurately.<br><b>Real-life application:</b> Correct sentence structure makes school answers, messages and formal writing easier to understand.`);
    else if(/reading|comprehension/.test(x)) map.push(`Example 1 — Definition: Reading comprehension is the ability to understand, interpret and evaluate information in a text.<br><b>Importance:</b> It helps learners understand textbooks, instructions, stories and examination questions.<br><b>Real-life application:</b> A learner reads a school notice and identifies the date, place and instructions correctly.`);
    else if(/agric/.test(s)) map.push(`Example 1 — Definition: ${title} concerns a practical agricultural idea or process.<br><b>Importance:</b> It helps improve food production, resource use and agricultural livelihoods.<br><b>Real-life application:</b> A farmer can apply the idea when planning, producing, storing or marketing crops or livestock.`);
    else if(/computing|ict|robotics/.test(s)) map.push(`Example 1 — Definition: ${title} is a computing or digital-systems concept used to solve problems or perform tasks.<br><b>Importance:</b> It develops digital literacy and structured problem-solving skills.<br><b>Real-life application:</b> Learners can use the concept when creating, testing or using a digital solution.`);
    else if(/science|biology|chemistry|physics/.test(s)) map.push(`Example 1 — Definition: ${definition(title,subject)}<br><b>Importance:</b> It helps learners explain natural phenomena and make evidence-based decisions.<br><b>Real-life application:</b> The idea can be observed in a home, school, laboratory, health, environmental or technology situation.`);
    else if(/english|language|french|ghanaian language|arabic|spanish/.test(s)) map.push(`Example 1 — Definition: ${definition(title,subject)}<br><b>Importance:</b> It helps learners communicate meaning accurately in ${subject}.<br><b>Real-life application:</b> Learners use it when speaking, reading, writing, listening or translating in school and everyday communication.`);
    else map.push(`Example 1 — Definition: ${definition(title,subject)}<br><b>Importance:</b> ${title} helps learners understand an important idea and use it correctly when solving problems or making decisions.<br><b>Real-life application:</b> A learner can observe or use ${title} in a school, home, community, workplace or Ghanaian-life situation.`);
    const base=map[0];
    const more=[
      `Example 2 — Cause and effect: When ${title} is applied correctly, the expected result can be observed; when an important condition is missing, the result can change.`,
      `Example 3 — School situation: A learner uses ${title} while completing a class activity and explains why the result fits the concept.`,
      `Example 4 — Home situation: A learner identifies ${title} in an everyday home situation and explains what is happening.`,
      `Example 5 — Community situation: ${title} can be seen or applied in a community activity; the learner identifies the relevant feature and explains its effect.`,
      `Example 6 — Comparison: Compare ${title} with a closely related concept and state one clear difference.`,
      `Example 7 — Problem: A real situation involves ${title}. Identify the problem, apply the concept and state the result.`,
      `Example 8 — Evidence: Give one observation, fact, event, object or result that supports an explanation of ${title}.`,
      `Example 9 — Ghana connection: Explain one accurate way ${title} relates to Ghanaian school, community, culture, environment, work or development.`,
      `Example 10 — Higher-level application: Analyse a new situation involving ${title}, use relevant evidence or reasoning, and state a justified conclusion.`
    ];
    return [base,...more];
  }
  function questionSet(title,subject,l){const seed=hash(l+'|'+subject+'|'+title),r=rank(l),d=definition(title,subject),qs=[];if(/math/i.test(subject)){const a=num(seed,3,15),b=num(seed>>5,2,12),c=num(seed>>9,2,9);let items=[];
    if(/algebraic expressions/i.test(title))items=[{question:`Evaluate 3x + 5 when x = ${a}.`,answer:String(3*a+5)},{question:`Simplify ${a}x + ${b}x − ${c}.`,answer:`${a+b}x − ${c}`},{question:`A taxi charges GH₵${b} plus GH₵${a} per kilometre. Write an expression for x kilometres.`,answer:`${a}x + ${b}`}];
    else if(/equations/i.test(title))items=[{question:`Solve ${a}x + ${b} = ${a*c+b}.`,answer:String(c)},{question:`What should you do first after writing a linear equation?`,answer:'Use inverse operations to isolate the unknown while keeping both sides equal.'}];
    else if(/percentage/i.test(title))items=[{question:`What is ${c*5}% of GH₵${a*10}?`,answer:`GH₵${(a*10*c*5/100).toFixed(2)}`},{question:`A learner scores ${a} out of ${b}. How do you convert this result to a percentage?`,answer:`${a}/${b} × 100` }];
    else if(/fraction/i.test(title))items=[{question:`A class has ${a+b} equal parts and ${a} are selected. What fraction is selected?`,answer:`${a}/${a+b}`},{question:`What is the first useful step when adding fractions with different denominators?`,answer:'Find a common denominator.'}];
    else if(/decimal/i.test(title))items=[{question:`Add ${a}.${c} and ${b}.${c}.`,answer:String((a+b)+c/5)},{question:`Why must decimal points be aligned when adding decimals?`,answer:'So corresponding place values are combined correctly.'}];
    else if(/ratio/i.test(title))items=[{question:`A class has ${a} boys and ${b} girls. What is the ratio of boys to girls?`,answer:`${a}:${b}`},{question:`If both parts of a ratio are multiplied by 3, what happens to the ratio?`,answer:'It remains an equivalent ratio.'}];
    else if(/probability/i.test(title))items=[{question:`A bag has ${a+b} equally likely counters and ${a} are red. What is the probability of red?`,answer:`${a}/${a+b}`},{question:`What is the probability of an impossible event?`,answer:'0'}];
    else if(/statistics/i.test(title))items=[{question:`What is the first step when finding the median of a data set?`,answer:'Arrange the data in order.'},{question:`What does the mean represent in a data set?`,answer:'The total of the values divided by the number of values.'}];
    else if(/area|perimeter/i.test(title))items=[{question:`A rectangle is ${a} m by ${b} m. What is its area?`,answer:`${a*b} m²`},{question:`What formula gives the perimeter of a rectangle with length l and width w?`,answer:'2(l + w)'}];
    else items=[{question:`In a ${title} problem, what information should you identify before calculating?`,answer:'The given information and what the question asks you to find.'},{question:`How can you check a ${title} answer?`,answer:'Use a suitable second method or check whether the result is reasonable.'}];qs.push(...items);}
    const templates=r<=3?[`What is ${title}?`,`Which statement best describes ${title}?`,`Why is ${title} important?`,`Which situation shows ${title} in everyday life?`,`What is one main feature of ${title}?`]:r<=6?[`Explain ${title} in your own words.`,`Why does ${title} matter?`,`How can ${title} be applied in a new situation?`,`What is the difference between ${title} and a related idea?`,`What would happen if an important part of ${title} changed?`]:r<=9?[`Apply your knowledge of ${title} to a new situation.`,`Which evidence would best support an explanation of ${title}?`,`How are two ideas in ${title} connected?`,`What common mistake can occur when using ${title}, and how can it be corrected?`,`How would you justify an answer about ${title}?`]:[`Analyse a new situation involving ${title}.`,`Which conclusion about ${title} is best supported by evidence?`,`How could ${title} be used to solve a real problem?`,`Evaluate two possible approaches to a ${title} problem and justify the better one.`,`How can ${title} be connected to another concept to reach a stronger conclusion?`];templates.forEach((q,i)=>qs.push({question:q,answer:i===0?d:`A strong ${l} answer should use the definition, relevant features, evidence or application of ${title}, and explain why the conclusion follows.`}));while(qs.length<10)qs.push({question:`${l} application ${qs.length+1}: explain one accurate example of ${title} and why it demonstrates the topic.`,answer:`It must directly demonstrate ${title} and include a clear reason.`});return qs.slice(0,10).map((q,i)=>({...q,hint:`Use the definition, relevant evidence and practical application of ${title}.`}))}
  for(const l of Object.keys(C))for(const s of Object.keys(C[l]))for(const t of C[l][s]||[]){const def=definition(t.title,s),r=rank(l);t.keyIdea=def;t.explanation=`<b>Definition</b><br>${def}<br><br><b>Meaning in ${s}</b><br>${t.title} refers specifically to the concept described above. Learners should know its key terms, parts, relationships and uses rather than memorising a vague description.<br><br><b>Why it is important</b><br>${importanceFor(t.title,s)}<br><br><b>How to understand it</b><br>${understandingFor(t.title,s,l)}<br><br><b>Learning progression</b><br>${levelDemand(l)} The same topic becomes deeper and more demanding as the learner moves from Primary to JHS and SHS.`;t.examples=/math/i.test(s)?mathExamples(t.title,l):languageExamples(t.title,s,l).concat(/french|ghanaian language|arabic|spanish/i.test(s)?[]:otherExamples(t.title,s,l)).slice(0,10);if(!/math/i.test(s)&&!/french|ghanaian language|arabic|spanish/i.test(s))t.examples=otherExamples(t.title,s,l);t.questions=questionSet(t.title,s,l);t.quiz=t.questions}
  window.LEARNOVA_CURRICULUM=C;window.LEARNOVA_CONTENT_VERSION='curriculum-expanded-class-aware';
})();
