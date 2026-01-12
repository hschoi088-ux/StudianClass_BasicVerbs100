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
            word-break: keep-all; background-color: #f8fafc;
        }
        .card { perspective: 1000px; }
        .card-inner {
            position: relative; width: 100%; height: 300px;
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .star-checked { color: #fbbf24 !important; fill: #fbbf24 !important; }
    </style>
</head>
<body oncontextmenu="return false">

    <div class="max-w-md mx-auto px-4 py-6">
        <header class="text-center mb-6">
            <h1 class="text-2xl font-black text-indigo-600 tracking-tight">기본동사100 스피드퀴즈</h1>
        </header>

        <div class="flex space-x-2 mb-6 overflow-x-auto pb-2 no-scrollbar font-bold">
            <button onclick="selectWeek(1)" id="tab-1" class="week-tab flex-shrink-0 px-5 py-2 bg-white rounded-full shadow-sm border border-slate-100">Week 1</button>
            <button onclick="selectWeek(2)" id="tab-2" class="week-tab flex-shrink-0 px-5 py-2 bg-white rounded-full shadow-sm border border-slate-100">Week 2</button>
        </div>

        <div id="setup-screen" class="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
            <div id="selected-week-title" class="text-indigo-500 font-black text-xl mb-6 italic">WEEK 1</div>
            <div class="space-y-4">
                <button onclick="startQuiz('mild')" class="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-lg active:scale-95 transition">순한맛 시작</button>
                <button onclick="startQuiz('spicy')" class="w-full py-5 bg-orange-500 text-white rounded-2xl font-black shadow-lg active:scale-95 transition">매운맛 시작</button>
            </div>
        </div>

        <div id="quiz-screen" class="hidden">
            <div class="flex justify-between items-center mb-6">
                <span id="progress-text" class="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">1 / 10</span>
                <button onclick="location.reload()" class="text-slate-400 font-bold text-xs">종료</button>
            </div>

            <div id="card-container" class="card" onclick="flipCard()">
                <div class="card-inner">
                    <div class="card-front bg-white border border-slate-100 text-center">
                        <span class="text-indigo-400 font-black text-[10px] tracking-widest mb-4 uppercase">Korean</span>
                        <p id="q-korean" class="text-xl font-bold leading-snug px-4"></p>
                    </div>
                    <div class="card-back bg-indigo-600 text-white text-center">
                        <button id="star-btn" onclick="toggleStar(event)" class="absolute top-4 right-4 text-white/50 hover:text-yellow-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/>
                            </svg>
                        </button>
                        
                        <span class="text-indigo-200 font-black text-[10px] tracking-widest mb-4 uppercase">English</span>
                        <p id="q-english" class="text-xl font-bold leading-snug px-4 mb-6"></p>
                        
                        <button onclick="event.stopPropagation(); playTTS();" class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center active:scale-90 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        </button>
                        <div id="q-info" class="absolute bottom-6 text-[10px] text-indigo-300 font-bold"></div>
                    </div>
                </div>
            </div>

            <button id="next-btn" onclick="nextQuestion()" class="w-full mt-8 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hidden active:scale-95 transition">
                다음 문제
            </button>
        </div>

        <div id="result-screen" class="hidden bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
            <h2 class="text-center font-black text-xl text-slate-800 mb-6">퀴즈 종료!</h2>
            <div id="starred-list" class="space-y-3">
                </div>
            <button onclick="location.reload()" class="w-full mt-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold">처음으로 돌아가기</button>
        </div>
    </div>

    <script>
        const allData = [
            // Week 1
            {id:1, w:1, d:1, s:"대표", k:"반려동물 키우시나요?", e:"Do you have any pets?"},
            {id:2, w:1, d:1, s:"교재1", k:"내 조카는 거북이를 키운다.", e:"My nephew has a turtle."},
            {id:3, w:1, d:2, s:"대표", k:"저는 스테이크 먹을게요.", e:"I’ll have the steak, please."},
            // Week 2
            {id:4, w:2, d:6, s:"대표", k:"교토 기온 거리는 분위기가 매력적이에요.", e:"The Gion district in Kyoto has a charming vibe."},
            {id:5, w:2, d:7, s:"대표", k:"저녁 식사에 불러 줘서 고마워요.", e:"Thank you for having us over for dinner."}
        ];

        const sourceMap = { "대표": "대표예제", "교재1": "Model examples", "교재2": "Small talk", "교재3": "Further studies" };
        let selectedWeek = 1;
        let quizPool = [];
        let currentIndex = 0;
        let starredIds = new Set();

        function selectWeek(w) {
            selectedWeek = w;
            document.querySelectorAll('.week-tab').forEach(t => t.classList.remove('active-tab'));
            document.getElementById(`tab-${w}`).classList.add('active-tab');
            document.getElementById('selected-week-title').innerText = `WEEK ${w}`;
        }

        // 모바일 오디오 엔진 해제
        function unlockAudio() {
            if ('speechSynthesis' in window) {
                const msg = new SpeechSynthesisUtterance('');
                window.speechSynthesis.speak(msg);
            }
        }

        function startQuiz(mode) {
            unlockAudio();
            let weekData = allData.filter(item => item.w === selectedWeek);
            quizPool = (mode === 'mild') 
                ? weekData.filter(item => item.s === '대표' || item.s === '교재1') 
                : [...weekData];

            quizPool = quizPool.sort(() => Math.random() - 0.5).slice(0, 10);
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
            e.stopPropagation(); // 카드 뒤집히지 않게
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

        function nextQuestion() {
            currentIndex++;
            if (currentIndex < quizPool.length) showQuestion();
            else showResults();
        }

        function playTTS() {
            const text = document.getElementById('q-english').innerText;
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(text);
                msg.lang = 'en-US';
                msg.rate = 0.9;
                window.speechSynthesis.speak(msg);
            }
        }

        function showResults() {
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('result-screen').classList.remove('hidden');
            
            const listEl = document.getElementById('starred-list');
            listEl.innerHTML = '<p class="text-xs text-slate-400 font-bold uppercase mb-2">⭐ 내가 체크한 문장</p>';
            
            const starredItems = quizPool.filter(item => starredIds.has(item.id));
            
            if (starredItems.length === 0) {
                listEl.innerHTML += '<p class="text-sm text-slate-500 py-4">체크한 문장이 없습니다.</p>';
            } else {
                starredItems.forEach(item => {
                    const div = document.createElement('div');
                    div.className = "p-4 bg-slate-50 rounded-xl border border-slate-100";
                    div.innerHTML = `
                        <p class="text-[10px] text-indigo-500 font-bold mb-1">Day ${item.d} - ${sourceMap[item.s]}</p>
                        <p class="text-xs text-slate-500 mb-1">${item.k}</p>
                        <p class="text-sm font-bold text-slate-800">${item.e}</p>
                    `;
                    listEl.appendChild(div);
                });
            }
        }

        selectWeek(1);
    </script>
</body>
</html>
