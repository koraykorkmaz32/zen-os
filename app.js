// --- UYGULAMA BAŞLATICI ---
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    ThemeModule.init();
    QuotesModule.init();
    WaterModule.init();
    FocusModule.init();
    CalendarModule.init();
    ListManager.init();
});

// --- 1. TEMA YÖNETİMİ ---
const ThemeModule = {
    init() {
        const btn = document.getElementById('themeToggle');
        if (localStorage.getItem('zen_theme') === 'zen') document.body.setAttribute('data-theme', 'zen');
        
        btn.addEventListener('click', () => {
            const isZen = document.body.getAttribute('data-theme') === 'zen';
            if (isZen) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('zen_theme', 'cyber');
            } else {
                document.body.setAttribute('data-theme', 'zen');
                localStorage.setItem('zen_theme', 'zen');
            }
        });
    }
};

// --- 2. MOTİVASYON SÖZLERİ ---
const QuotesModule = {
    quotes: [
        "Başarı, her gün tekrarlanan küçük disiplinlerin toplamıdır.",
        "Zihnin sakini, hayatın hâkimi olur.",
        "Odaklandığın şey büyür. Gücünü dağıtma.",
        "Bugün yapacakların, yarınki seni inşa eder."
    ],
    init() {
        const text = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        document.getElementById('quoteText').innerText = `"${text}"`;
    }
};

// --- 3. AKILLI SU TAKİBİ (İSTEDİĞİN GİBİ) ---
const WaterModule = {
    totalGlasses: 10,
    volPerGlass: 200,
    activeGlasses: [],

    init() {
        this.checkReset();
        this.render();
    },

    checkReset() {
        const lastDate = localStorage.getItem('zen_water_date');
        const today = new Date().toDateString();
        
        // Eğer gün değişmişse (00:00'ı geçmişse) sıfırla
        if (lastDate !== today) {
            this.activeGlasses = [];
            this.save();
        } else {
            this.activeGlasses = JSON.parse(localStorage.getItem('zen_water_state')) || [];
        }
    },

    save() {
        localStorage.setItem('zen_water_state', JSON.stringify(this.activeGlasses));
        localStorage.setItem('zen_water_date', new Date().toDateString());
        this.updateUI();
    },

    toggle(index) {
        if (this.activeGlasses.includes(index)) {
            // Varsa çıkar (Yanlışlıkla basmayı geri al)
            this.activeGlasses = this.activeGlasses.filter(id => id !== index);
        } else {
            // Yoksa ekle
            this.activeGlasses.push(index);
        }
        this.save();
        this.render();
    },

    render() {
        const grid = document.getElementById('waterGrid');
        grid.innerHTML = '';
        for (let i = 0; i < this.totalGlasses; i++) {
            const btn = document.createElement('div');
            btn.className = `glass-btn ${this.activeGlasses.includes(i) ? 'active' : ''}`;
            btn.innerHTML = '<i data-lucide="droplet" size="16"></i>';
            btn.addEventListener('click', () => this.toggle(i));
            grid.appendChild(btn);
        }
        this.updateUI();
        lucide.createIcons();
    },

    updateUI() {
        document.getElementById('waterTotalText').innerText = this.activeGlasses.length * this.volPerGlass;
    }
};

// --- 4. DEEP WORK (POMODORO) ---
const FocusModule = {
    time: 25 * 60,
    timerId: null,
    init() {
        document.getElementById('timerBtn').addEventListener('click', () => this.toggle());
    },
    toggle() {
        const btn = document.getElementById('timerBtn');
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
            btn.innerText = "Devam Et";
        } else {
            btn.innerText = "Durdur";
            this.timerId = setInterval(() => {
                this.time--;
                const m = Math.floor(this.time / 60);
                const s = this.time % 60;
                document.getElementById('timerDisplay').innerText = `${m}:${s.toString().padStart(2, '0')}`;
                if (this.time <= 0) {
                    clearInterval(this.timerId);
                    alert("Odaklanma süresi bitti!");
                }
            }, 1000);
        }
    }
};

// --- 5. TAKVİM ---
const CalendarModule = {
    init() {
        const d = new Date();
        document.getElementById('calMonth').innerText = d.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
        
        let html = '';
        const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === d.getDate() ? 'today' : '';
            html += `<div class="cal-day ${isToday}">${i}</div>`;
        }
        document.getElementById('calGrid').innerHTML = html;
    }
};

// --- 6. LİSTE YÖNETİCİSİ (To-Do, Habit, Meal, Budget) ---
const ListManager = {
    budgetTotal: 0,

    init() {
        // Todo
        document.getElementById('todoAddBtn').addEventListener('click', () => this.addItem('todoInput', 'todoList'));
        // Habit
        document.getElementById('habitAddBtn').addEventListener('click', () => this.addItem('habitInput', 'habitList'));
        // Meal
        document.getElementById('mealAddBtn').addEventListener('click', () => {
            const day = document.getElementById('mealDaySelect').value;
            this.addItem('mealInput', 'mealList', ` <span style="opacity:0.5; font-size:0.8rem;">(${day})</span>`);
        });
        // Budget
        document.getElementById('budgetAddBtn').addEventListener('click', () => this.addBudget());
    },

    addItem(inputId, listId, suffix = "") {
        const input = document.getElementById(inputId);
        if (!input.value.trim()) return;

        const li = document.createElement('li');
        li.innerHTML = `<span>${input.value}${suffix}</span> <span class="delete-btn">✕</span>`;
        
        li.querySelector('.delete-btn').addEventListener('click', () => li.remove());
        
        document.getElementById(listId).appendChild(li);
        input.value = '';
    },

    addBudget() {
        const input = document.getElementById('budgetInput');
        const val = input.value.trim();
        if (!val) return;

        // Metnin içindeki sayıları bul (Örn: "Kira 15000" -> 15000)
        const amounts = val.match(/\d+/g);
        if (amounts) {
            this.budgetTotal += parseInt(amounts[amounts.length - 1]);
            document.getElementById('budgetTotalText').innerText = this.budgetTotal;
        }

        const li = document.createElement('li');
        li.innerHTML = `<span>${val}</span> <span class="delete-btn">✕</span>`;
        
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            if (amounts) {
                this.budgetTotal -= parseInt(amounts[amounts.length - 1]);
                document.getElementById('budgetTotalText').innerText = this.budgetTotal;
            }
            li.remove();
        });

        document.getElementById('budgetList').appendChild(li);
        input.value = '';
    }
};
