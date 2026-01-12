<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>기본동사100 스피드퀴즈</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
            -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent;
            word-break: keep-all; background-color: #f8fafc; font-family: system-ui, -apple-system, sans-serif;
        }
        .card { perspective: 1000px; }
        .card-inner {
            position: relative; width: 100%; height: 320px;
            transition: transform 0.6s; transform-style: preserve-3d; cursor: pointer;
        }
        .card.flipped .card-inner { transform: rotateY(180deg); }
        .card-front, .card-back {
            position: absolute; width: 100%; height: 100%;
            backface-visibility: hidden; display: flex; flex-direction: column;
            align-items: center; justify-content: center; border-radius: 1.5rem;
            padding: 2rem; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .card-back { transform: rotateY(180deg); }
        .active-tab { background-color: #4f46e5 !important; color: white !important; }
        .star-checked { color: #fbbf24 !important; fill: #fbbf24 !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
    </style>
</head>
<body oncontextmenu="return false">

    <div class="max-w-md mx-auto px-4 py-6">
        <header class="text-center mb-6">
            <h1 class="text-2xl font-black text-indigo-600 tracking-tight italic">기본동사100 스피드퀴즈</h1>
        </header>

        <div class="flex space-x-2 mb-6 overflow-x-auto pb-2 no-scrollbar font-bold text-sm">
            <button onclick="selectWeek(1)" id="tab-1" class="week-tab flex-shrink-0 px-5 py-2 bg-white rounded-full shadow-sm border border-slate-100 active-tab">Week 1</button>
            <button class="flex-shrink-0 px-5 py-2 bg-slate-100 text-slate-300 rounded-full shadow-sm border border-slate-100 cursor-not-allowed">Week 2+</button>
        </div>

        <div id="setup-screen" class="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
            <div id="selected-week-title" class="text-indigo-500 font-black text-xl mb-6 italic tracking-widest uppercase">WEEK 1</div>
            <div class="space-y-4">
                <button onclick="startQuiz('mild')" class="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-100 active:scale-95 transition">순한맛 시작</button>
                <button onclick="startQuiz('spicy')" class="w-full py-5 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-100 active:scale-95 transition">매운맛 시작</button>
            </div>
            <div class="mt-8 p-4 bg-slate-50 rounded-xl text-[11px] text-slate-400 text-left leading-relaxed">
                <p>• <strong>순한맛</strong>: 대표예제 + Model examples</p>
                <p>• <strong>매운맛</strong>: 모든 출처 랜덤 10문항</p>
                <p class="mt-2 text-rose-400 font-bold">※ 모바일 Tip: 옆면 무음 스위치를 해제하세요!</p>
            </div>
        </div>

        <div id="quiz-screen" class="hidden">
            <div class="flex justify-between items-center mb-6 px-2">
                <span id="progress-text" class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">1 / 10</span>
                <button onclick="location.reload()" class="text-slate-400 font-bold text-xs uppercase">Exit ✕</button>
            </div>

            <div id="card-container" class="card" onclick="flipCard()">
                <div class="card-inner">
                    <div class="card-front bg-white border border-slate-100">
                        <span class="text-indigo-400 font-black text-[10px] tracking-widest mb-6 uppercase">Korean</span>
                        <p id="q-korean" class="text-xl font-bold leading-snug px-4 text-center"></p>
                        <p class="mt-10 text-slate-300 text-xs font-bold animate-pulse">카드를 터치하여 정답 확인</p>
                    </div>
                    <div class="card-back bg-indigo-600 text-white">
                        <button id="star-btn" onclick="toggleStar(event)" class="absolute top-6 right-6 text-white/40 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/>
                            </svg>
                        </button>
                        <span class="text-indigo-200 font-black text-[10px] tracking-widest mb-6 uppercase">English</span>
                        <p id="q-english" class="text-xl font-black leading-snug px-4 mb-8 text-center"></p>
                        <button onclick="event.stopPropagation(); playTTS();" class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center active:scale-90 transition shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        </button>
                        <div id="q-info" class="absolute bottom-8 text-[10px] text-indigo-300 font-bold uppercase tracking-widest italic"></div>
                    </div>
                </div>
            </div>
            <button id="next-btn" onclick="nextQuestion()" class="w-full mt-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hidden active:scale-95 transition">다음 문제로 NEXT</button>
        </div>

        <div id="result-screen" class="hidden bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
            <h2 class="text-center font-black text-xl text-slate-800 mb-8 tracking-tighter">퀴즈 완료 리포트</h2>
            <div id="starred-list" class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scroll"></div>
            <button onclick="location.reload()" class="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-bold active:scale-95 transition">메인으로 돌아가기</button>
        </div>
    </div>

    <script>
        // Week 1 전체 85개 예문 (Day 1 ~ Day 5)
        const allData = [
            {w:1, d:1, s:"대표", k:"반려동물 키우시나요?", e:"Do you have any pets?"},
            {w:1, d:1, s:"교재1", k:"내 조카는 거북이를 키운다.", e:"My nephew has a turtle."},
            {w:1, d:1, s:"교재1", k:"나는 시카고에 사는 친구들이 있다.", e:"I have some friends living in Chicago."},
            {w:1, d:1, s:"교재1", k:"남동생과 나는 우애가 돈독하다.", e:"My brother and I have a strong bond."},
            {w:1, d:1, s:"교재1", k:"내 생각은 달랐다.", e:"I had a different idea."},
            {w:1, d:1, s:"교재1", k:"친구들과 술래잡기하면서 놀던 즐거운 추억이 있다.", e:"I have some fond memories of playing tag with my friends."},
            {w:1, d:1, s:"교재2", k:"프로젝트가 끝나서 좋죠?", e:"Are you glad the project is over?"},
            {w:1, d:1, s:"교재2", k:"솔직히 시원섭섭해요. 일을 끝내서 홀가분하긴 한데, 팀이 그리울 것 같아요.", e:"Honestly, I have mixed feelings. I’m relieved we finished the work, but I’ll miss the team."},
            {w:1, d:1, s:"교재2", k:"음대 대신 의대를 선택한 거 맞지?", e:"You chose med school over music, right?"},
            {w:1, d:1, s:"교재2", k:"응, 힘든 결정이었어.", e:"Yeah, it was a tough decision."},
            {w:1, d:1, s:"교재2", k:"음악을 계속하지 않은 걸 후회해?", e:"Do you have any regrets about not pursuing music?"},
            {w:1, d:1, s:"교재2", k:"조금은 그렇지만, 되도록 생각 안 하려고 해", e:"A few, but I try not to think about it too much."},
            {w:1, d:1, s:"교재3", k:"그녀는 공포 영화보다는 영어 강의를 택할 겁니다.", e:"She would choose an English lecture over any horror movie."},
            {w:1, d:1, s:"교재3", k:"어떤 사람들은 가구를 살 때 가격보다 품질을 중시한다.", e:"Some people choose quality over price when buying furniture."},
            {w:1, d:1, s:"교재3", k:"어떻게 내가 아닌 그 사람을 선택할 수가 있어!", e:"I can’t believe you chose him over me!"},
            {w:1, d:1, s:"교재3", k:"장기적인 목표보다 눈앞의 즐거움을 선택하는 사람들이 있다.", e:"Some people choose short-term pleasure over long-term goals."},
            {w:1, d:2, s:"대표", k:"방금 간식을 먹었더니, 배가 별로 안 고파요.", e:"I just had a snack, so I’m not that hungry."},
            {w:1, d:2, s:"교재1", k:"나는 아침으로 주로 시리얼을 먹는다.", e:"I usually have cereal for breakfast."},
            {w:1, d:2, s:"교재1", k:"저는 스테이크 먹을게요.", e:"I’ll have the steak, please."},
            {w:1, d:2, s:"교재1", k:"오늘 점심으로 아무것도 안 먹었어요.", e:"I didn’t have anything for lunch today."},
            {w:1, d:2, s:"교재1", k:"출발하기 전에 뭐라도 먹어야 해.", e:"You should have something before you leave."},
            {w:1, d:2, s:"교재1", k:"피자 먹으면서 영화 보자.", e:"Let’s have some pizza and watch a movie."},
            {w:1, d:2, s:"교재2", k:"수업 전에 뭐 좀 먹었어?", e:"Did you have anything before class?"},
            {w:1, d:2, s:"교재2", k:"그냥 바나나 하나 먹었어. 시간이 없었어.", e:"Just a banana. I was in a rush."},
            {w:1, d:2, s:"교재2", k:"점심은 주로 몇 시에 먹어요?", e:"What time do you usually have lunch?"},
            {w:1, d:2, s:"교재2", k:"그렇게 안 바쁘면 대략 12시쯤에요.", e:"Around noon, if I’m not too busy."},
            {w:1, d:2, s:"교재2", k:"오, 저도 그런데! 오늘 저랑 뭐 간단히 먹을래요?", e:"Oh, me too! Want to grab something together today?"},
            {w:1, d:2, s:"교재2", k:"좋지요! 한국 음식이라면 좋아요.", e:"Sure! I could go for some Korean food."},
            {w:1, d:2, s:"교재3", k:"어제 공원에서 널 봤어.", e:"I saw you at the park yesterday."},
            {w:1, d:2, s:"교재3", k:"어제 공원에서 널 지켜봤어.", e:"I watched you at the park yesterday."},
            {w:1, d:2, s:"교재3", k:"술집에 있는 TV에서 경기가 나오던데, 집중해서 보지는 않았어.", e:"I saw the game on the TV at the bar, but I didn’t watch it."},
            {w:1, d:2, s:"교재3", k:"그 영화를 대형 화면으로 봤어.", e:"I saw the movie on the big screen."},
            {w:1, d:2, s:"교재3", k:"어젯밤에 넷플릭스 다큐멘터리를 보고 있는데 엄마한테 전화가 왔다.", e:"My mom called while I was watching a Netflix documentary last night."},
            {w:1, d:3, s:"대표", k:"어제 아침에는 별일이 다 있었어요.", e:"I had a weird morning yesterday."},
            {w:1, d:3, s:"교재1", k:"우리는 지난주 일본에서 정말 좋은 시간을 보냈어요.", e:"We had a great time in Japan last week."},
            {w:1, d:3, s:"교재1", k:"나는 힘든 유년 시절을 보냈다.", e:"I had a rough childhood."},
            {w:1, d:3, s:"교재1", k:"제가 접속 상태가 안 좋은 것 같습니다.", e:"I think I have a bad connection."},
            {w:1, d:3, s:"교재1", k:"저희는 만나면 늘 대화가 즐겁습니다.", e:"We always have such good conversations."},
            {w:1, d:3, s:"교재1", k:"그는 비행기를 오래 타서, 잠을 좀 더 자야 해요.", e:"He had a long flight, so he needs some extra sleep."},
            {w:1, d:3, s:"교재2", k:"여전히 예술 학교에 진학할 계획이니?", e:"Are you still planning to go to art school?"},
            {w:1, d:3, s:"교재2", k:"잘 모르겠어. 전공 때문에 엄마랑 사이가 틀어졌거든.", e:"I’m not sure. My mom and I had a falling-out over my major."},
            {w:1, d:3, s:"교재2", k:"안녕, 최근에 잘 안 보이더라.", e:"Hey, I haven’t seen you around lately."},
            {w:1, d:3, s:"교재2", k:"응∙∙∙ 한 주 동안 마음이 좀 힘들었거든.", e:"I know... I had a rough week, emotionally."},
            {w:1, d:3, s:"교재2", k:"무슨 일인지 이야기해 줄래?", e:"Want to talk about it?"},
            {w:1, d:3, s:"교재2", k:"음, 다음에. 우선 머리 좀 식힐 시간이 필요해서.", e:"Maybe later. I just need some time to clear my head."},
            {w:1, d:3, s:"교재3", k:"내가 어렸을 때, 우리 이웃이 나무에서 떨어졌어요.", e:"My neighbor fell out of a tree when I was young."},
            {w:1, d:3, s:"교재3", k:"아무래도 버스에서 내리다 핸드폰이 주머니에서 빠진 것 같아.", e:"I think my phone fell out of my pocket while I was getting off the bus."},
            {w:1, d:3, s:"교재3", k:"그 두 사람 크리스마스 이후로 사이가 완전히 틀어졌대.", e:"Those two had a major falling-out after Christmas."},
            {w:1, d:3, s:"교재3", k:"제 동업자와 저는 돈 문제로 사이가 멀어졌어요.", e:"My business partner and I had a falling-out over money."},
            {w:1, d:4, s:"대표", k:"삼성이 오늘 신제품 출시 행사를 열어요.", e:"Samsung is having a new-product launch today."},
            {w:1, d:4, s:"교재1", k:"제가 이번 주말에 집들이를 합니다.", e:"I’m having a housewarming party this weekend."},
            {w:1, d:4, s:"교재1", k:"백화점들이 이번 주에 일제히 세일을 한다.", e:"The department stores are all having sales this week."},
            {w:1, d:4, s:"교재1", k:"우리는 6월에 코엑스에서 채용 박람회를 열었다.", e:"We had a job fair at COEX in June."},
            {w:1, d:4, s:"교재1", k:"이번 주말에 모임이 있으니 오고 싶으면 오렴.", e:"We’re having a get-together this weekend if you want to join."},
            {w:1, d:4, s:"교재1", k:"그 제과점에서 오늘 원 플러스 원 행사를 한다.", e:"The bakery has a buy-one-get-one deal today."},
            {w:1, d:4, s:"교재2", k:"여행용 가방을 새로 사야 해.", e:"I need to buy some new luggage."},
            {w:1, d:4, s:"교재2", k:"아, 코스트코에서 지금 샘소나이트 여행 가방 세일 중인데.", e:"Oh, Costco is having a sale on Samsonite luggage right now."},
            {w:1, d:4, s:"교재2", k:"준호 씨, 브라질 생활 어때요?", e:"How is life in Brazil treating you, Junho?"},
            {w:1, d:4, s:"교재2", k:"쉽지는 않지만 나아지고 있습니다.", e:"It’s not easy, but it’s getting better."},
            {w:1, d:4, s:"교재2", k:"지금쯤이면 친구도 사귀었겠어요?", e:"Do you have any friends yet?"},
            {w:1, d:4, s:"교재2", k:"아파트 단지에 한국인 가정이 매주 바비큐 파티를 해요.", e:"A couple of Korean families live in my building and we have barbeques every Friday."},
            {w:1, d:4, s:"교재3", k:"퇴근은 한 거지?", e:"Did you leave work yet?"},
            {w:1, d:4, s:"교재3", k:"엄마한테 전화한 거지?", e:"Did you call your mom yet?"},
            {w:1, d:4, s:"교재3", k:"저녁은 먹은 거지?", e:"Did you eat dinner yet?"},
            {w:1, d:4, s:"교재3", k:"집안일은 다 한 거지?", e:"Did you finish your chores yet?"},
            {w:1, d:4, s:"교재3", k:"당신 이미 집 나선 거지?", e:"Did you leave yet?"},
            {w:1, d:4, s:"교재3", k:"지갑을 두고 왔네. 아래쪽으로 던져 줄 수 있을까?", e:"I forgot my wallet. Could you throw it down to me, please?"},
            {w:1, d:4, s:"교재3", k:"알았어.", e:"OK."},
            {w:1, d:5, s:"대표", k:"오후에는 집안일을 좀 해야 해요.", e:"I have some chores to do in the afternoon."},
            {w:1, d:5, s:"교재1", k:"할 일이 산더미같이 쌓여 있다.", e:"I have tons of work to do."},
            {w:1, d:5, s:"교재1", k:"답장해야 할 이메일이 몇 개 있다.", e:"I have a few emails to reply to."},
            {w:1, d:5, s:"교재1", k:"오늘 오후에 몇 가지 볼일이 좀 있다.", e:"I have some errands to run this afternoon."},
            {w:1, d:5, s:"교재1", k:"금요일까지 프로젝트 하나를 마무리해야 한다.", e:"We have a project to finish by Friday."},
            {w:1, d:5, s:"교재1", k:"크리스마스 쇼핑을 좀 해야 한다.", e:"I have some Christmas shopping to do."},
            {w:1, d:5, s:"교재2", k:"안녕하세요, 제리. 우리 방금 프로젝트 진행 상황에 대해 이야기하고 있었어요.", e:"Good morning, Jerry. We were just talking about the project updates."},
            {w:1, d:5, s:"교재2", k:"네, 늦어서 죄송해요. 뭐 좀 처리할 게 있었어요.", e:"Yes, sorry I’m late. I had something to take care of."},
            {w:1, d:5, s:"교재2", k:"오늘 바빠? 점심 먹자.", e:"Are you busy today? Let’s have lunch."},
            {w:1, d:5, s:"교재2", k:"안 돼. 우체국 가는 길이야.", e:"I can’t. I’m on my way to the post office."},
            {w:1, d:5, s:"교재2", k:"중고나라에서 바지 다섯 개를 팔아서, 택배 부칠 게 많아.", e:"I just sold five pairs of pants, so I have a lot of packages to ship."},
            {w:1, d:5, s:"교재3", k:"이번 주말에 친구 고양이를 돌봐 주기로 했어.", e:"I’m taking care of my friend’s cat this weekend."},
            {w:1, d:5, s:"교재3", k:"저희 아빠는 건강을 좀 더 신경 쓰셔야 해요.", e:"My dad needs to take better care of his health."},
            {w:1, d:5, s:"교재3", k:"휴가 가기 전에 처리해야 할 일이 좀 있어.", e:"I have some work to take care of before I start my vacation."},
            {w:1, d:5, s:"교재3", k:"저희 엄마는 주로 오후 시간에 정원을 손질하십니다.", e:"My mom usually takes care of her garden in the afternoons."},
            {w:1, d:5, s:"교재3", k:"회사에서 모든 경비를 다 대 줬어요.", e:"The company took care of everything."}
        ];

        // 고유 ID 부여
        allData.forEach((item, index) => item.id = index + 1);

        const sourceMap = { "대표": "대표예제", "교재1": "Model examples", "교재2": "Small talk", "교재3": "Further studies" };
        let selectedWeek = 1;
        let quizPool = [];
        let currentIndex = 0;
        let starredIds = new Set();

        function selectWeek(w) {
            selectedWeek = w;
            document.querySelectorAll('.week-tab').forEach(t => t.classList.remove('active-tab'));
            document.getElementById(`tab-${w}`).classList.add('active-tab');
        }

        // 모바일 오디오 깨우기: 더 강력한 방식
        function unlockAudio() {
            if ('speechSynthesis' in window) {
                const msg = new SpeechSynthesisUtterance("Quiz Start");
                msg.volume = 0;
                msg.rate = 10;
                window.speechSynthesis.speak(msg);
                window.speechSynthesis.cancel(); // 즉시 취소하여 엔진만 활성화
            }
        }

        function startQuiz(mode) {
            unlockAudio(); // 버튼 클릭 시 엔진 잠금 해제

            let weekData = allData.filter(item => item.w === selectedWeek);
            let filtered = (mode === 'mild') 
                ? weekData.filter(item => item.s === '대표' || item.s === '교재1') 
                : [...weekData];

            // 랜덤 10개 추출
            quizPool = filtered.sort(() => Math.random() - 0.5).slice(0, 10);
            currentIndex = 0;
            starredIds.clear();
            
            document.getElementById('setup-screen').classList.add('hidden');
            document.getElementById('quiz-screen').classList.remove('hidden');
            showQuestion();
        }

        function showQuestion() {
            const item = quizPool[currentIndex];
            const card = document.getElementById('card-container');
            const star = document.getElementById('star-btn');
            
            card.classList.remove('flipped');
            star.classList.remove('star-checked');
            document.getElementById('next-btn').classList.add('hidden');
            
            document.getElementById('q-korean').innerText = item.k;
            document.getElementById('q-english').innerText = item.e;
            document.getElementById('q-info').innerText = `Day ${String(item.d).padStart(3, '0')} - ${sourceMap[item.s]}`;
            document.getElementById('progress-text').innerText = `${currentIndex + 1} / ${quizPool.length}`;
        }

        function flipCard() {
            document.getElementById('card-container').classList.add('flipped');
            document.getElementById('next-btn').classList.remove('hidden');
        }

        function toggleStar(e) {
            e.stopPropagation();
            const item = quizPool[currentIndex];
            const starBtn = document.getElementById('star-btn');
            if (starredIds.has(item.id)) {
                starredIds.delete(item.id);
                starBtn.classList.remove('star-checked');
            } else {
                starredIds.add(item.id);
                starBtn.classList.add('star-checked');
            }
        }

        function playTTS() {
            const text = document.getElementById('q-english').innerText;
            if ('speechSynthesis' in window) {
                // 이전 대기 음성 모두 제거
                window.speechSynthesis.cancel();

                // iOS에서 새 인스턴스 생성이 필요할 수 있음
                const msg = new SpeechSynthesisUtterance();
                msg.text = text;
                msg.lang = 'en-US';
                msg.rate = 0.9;
                
                // 음성 목록 로딩 (iOS Safari 대응)
                let voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    msg.voice = voices.find(v => v.lang.includes('en-US')) || voices[0];
                }

                window.speechSynthesis.speak(msg);
            }
        }

        function nextQuestion() {
            currentIndex++;
            if (currentIndex < quizPool.length) showQuestion();
            else showResults();
        }

        function showResults() {
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');
            const listEl = document.getElementById('starred-list');
            listEl.innerHTML = '<p class="text-[10px] text-slate-400 font-black mb-4 uppercase tracking-widest text-center">⭐ 다시 학습할 문장</p>';
            
            const starredItems = quizPool.filter(item => starredIds.has(item.id));
            if (starredItems.length === 0) {
                listEl.innerHTML += '<p class="text-sm text-slate-400 py-12 text-center font-bold">체크한 문장이 없네요!</p>';
            } else {
                starredItems.forEach(item => {
                    const div = document.createElement('div');
                    div.className = "p-5 bg-indigo-50 rounded-2xl border border-indigo-100 mb-3";
                    div.innerHTML = `
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-[9px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-black tracking-tighter">DAY ${item.d}</span>
                            <span class="text-[9px] text-indigo-400 font-bold italic">${sourceMap[item.s]}</span>
                        </div>
                        <p class="text-xs text-slate-500 mb-1 leading-relaxed">${item.k}</p>
                        <p class="text-sm font-black text-indigo-900 leading-snug">${item.e}</p>
                    `;
                    listEl.appendChild(div);
                });
            }
        }

        // 보안: 우클릭/복사 방지
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's')) e.preventDefault();
            if (e.key === 'F12') e.preventDefault();
        });
    </script>
</body>
</html>
