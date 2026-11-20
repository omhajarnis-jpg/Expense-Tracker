/*
 * SpendSmart — Gen-Z Expense Tracker 🇮🇳
 * Full JavaScript — Labs 2-8 + Budget Planner
 * Default: Indian Rupees | Name: Om
 */

// ============================================================
// LAB 3 — Arrays & Data Structures
// ============================================================
let expenses = [];
let tasks    = [];
let budgetChartInstance = null;

let profileData = {
    name:   "Om",
    email:  "om@example.com",
    phone:  "98765-43210",
    salary: 0,
    budget: 10000
};

const motivationalTips = [
    "Har ek rupaya count karo — no cap, it adds up! 💪",
    "₹100 roz bachao = ₹36,500 saal mein. Sheesh! 🌟",
    "Budget = freedom, not restriction. Lowkey W move yaar! ✨",
    "Future wala tu, present wale tujhe thank karega. 🙏",
    "Chill, you're doing great! Ek step at a time. 🚀",
    "SIP shuru karo abhi — compound interest is the real main character. ☕",
    "Paisa vasool life tab hoga jab track karega. No cap! 💯",
    "Financially dhakad banna hai? Start tracking — understood the assignment! 🔥",
];

const greetings = [
    ["Wagwan", "Ready to slay your finances today? Let's get this bread! 🍞"],
    ["Sup bestie", "You're lowkey becoming a finance guru. W move! 💰"],
    ["Hey there", "Tracking your budget is giving main character energy fr! ✨"],
    ["What's good", "Financially slaying again today? It's giving W vibes! 🔥"],
];

// ============================================================
// INDIAN RUPEE FORMATTER
// ============================================================
function formatINR(amount) {
    // Indian number system: 1,00,000 style
    const num = Math.abs(parseFloat(amount) || 0);
    const formatted = num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return `₹${formatted}`;
}

function formatINRDecimal(amount) {
    const num = Math.abs(parseFloat(amount) || 0);
    const formatted = num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `₹${formatted}`;
}

// ============================================================
// DOCUMENT READY
// ============================================================
$(document).ready(function () {
    // Set today's date
    const today = new Date().toISOString().split("T")[0];
    $("#exp-date").val(today);

    // Random motivational tip
    $("#daily-tip").text(motivationalTips[Math.floor(Math.random() * motivationalTips.length)]);

    // Random greeting
    const g = greetings[Math.floor(Math.random() * greetings.length)];
    $("#greeting-text").text(`${g[0]}, ${profileData.name}! 👋`);
    $("#greeting-sub").text(g[1]);

    // Sidebar toggle (Lab 1)
    $("#menu-toggle").on("click", function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    // Close sidebar on outside click (mobile)
    $("#wrapper").on("click", function (e) {
        if ($(window).width() < 768 && $("#wrapper").hasClass("toggled") && !$(e.target).closest("#sidebar-wrapper, #menu-toggle").length) {
            $("#wrapper").removeClass("toggled");
        }
    });

    // Form handlers
    $("#add-expense-form").on("submit", handleAddExpense);
    $("#profile-form").on("submit", handleUpdateProfile);
    $("#add-task-btn").on("click", handleAddTask);
    $("#task-input").on("keypress", function (e) { if (e.key === "Enter") handleAddTask(); });

    // Close notification (Lab 7)
    $("#close-notification").on("click", function () {
        $("#notification-panel").stop(true).fadeOut(300);
    });

    // Lab 4 — Profile color change / Dark Mode
    $("#change-theme-btn").on("click", function () {
        $("body").toggleClass("dark-mode");
        const isDark = $("body").hasClass("dark-mode");
        $(this).html(isDark ? "<i class='bx bx-sun me-1'></i> Keep It Light ☀️" : "<i class='bx bx-moon me-1'></i> Change the Vibe 🌙");
        showNotification(isDark ? "✨ Welcome to the dark side. It's giving aesthetic!" : "✨ Back to the light. Fresh energy!");
    });

    // Nav avatar → profile
    $("#profile-nav-avatar").on("click", function () { switchTab("profile"); });

    // Init
    startCountdown();
    updateDashboard();
    renderExpenses();
    renderTasks();
});

// ============================================================
// SPA NAVIGATION
// ============================================================
function switchTab(tabId) {
    $(".page-section").removeClass("active").hide();
    $("#" + tabId).addClass("active").fadeIn(250);
    $(".list-group-item").removeClass("active");
    $("#nav-" + tabId).addClass("active");

    const titles = {
        "dashboard":   "Dashboard 🏠",
        "add-expense": "Add Expense 💸",
        "expenses":    "All Expenses 📋",
        "budget-plan": "Budget Planner 🧠",
        "todo":        "To-Do List ✅",
        "profile":     "My Profile 👤"
    };
    document.getElementById("page-title").textContent = titles[tabId] || "SpendSmart";

    if ($(window).width() < 768) $("#wrapper").removeClass("toggled");
}

// ============================================================
// LAB 2 — Mathematical Operations
// ============================================================
const add      = (a, b) => parseFloat(a) + parseFloat(b);
const subtract = (a, b) => parseFloat(a) - parseFloat(b);
const multiply = (a, b) => parseFloat(a) * parseFloat(b);
const divide   = (a, b) => parseFloat(b) !== 0 ? parseFloat(a) / parseFloat(b) : 0;

// ============================================================
// LAB 5 — Countdown Timer
// ============================================================
function startCountdown() {
    function tick() {
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        const diff = end.getTime() - now.getTime();
        if (diff <= 0) return;
        const pad = n => String(Math.floor(n)).padStart(2, "0");
        document.getElementById("days").textContent    = pad(diff / (1000 * 60 * 60 * 24));
        document.getElementById("hours").textContent   = pad((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById("minutes").textContent = pad((diff % (1000 * 60 * 60)) / (1000 * 60));
        document.getElementById("seconds").textContent = pad((diff % (1000 * 60)) / 1000);
    }
    tick();
    setInterval(tick, 1000);
}

// ============================================================
// LAB 7 — Notification (jQuery Effects)
// ============================================================
function showNotification(message, type = "default") {
    const panel = $("#notification-panel");
    $("#notification-message").text(message);
    const colors = { success: "#4CAF50", warning: "#FFB74D", danger: "#E57373", default: "#B4846C" };
    panel.css("border-left-color", colors[type] || colors.default);
    panel.stop(true, true).css("display", "flex").hide().slideDown(300).delay(3500).fadeOut(400);
}

// ============================================================
// LAB 6 — Regex Validation
// ============================================================
const REGEX = {
    name:   /^[a-zA-Z\s]{2,50}$/,
    email:  /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone:  /^[\d\s\-\+\(\)]{7,15}$/,
    amount: /^\d+(\.\d{1,2})?$/,
    desc:   /^.{2,100}$/
};

// ============================================================
// EXPENSE MANAGEMENT (Lab 3 + Lab 6)
// ============================================================
function handleAddExpense(e) {
    e.preventDefault();
    const desc      = $("#exp-desc").val().trim();
    const amountRaw = $("#exp-amount").val().trim();
    const date      = $("#exp-date").val();
    const category  = $("#exp-category").val();

    let valid = true;
    if (!REGEX.desc.test(desc)) {
        $("#desc-error").text("Description should be 2-100 characters bestie!");
        $("#exp-desc").addClass("is-invalid");
        valid = false;
    } else { $("#desc-error").text(""); $("#exp-desc").removeClass("is-invalid"); }

    if (!REGEX.amount.test(amountRaw) || parseFloat(amountRaw) <= 0) {
        $("#amount-error").text("Enter a valid amount — positive numbers only fr!");
        $("#exp-amount").addClass("is-invalid");
        valid = false;
    } else { $("#amount-error").text(""); $("#exp-amount").removeClass("is-invalid"); }

    if (!date)     { alert("Drop a date bestie!"); valid = false; }
    if (!category) { alert("You gotta pick a vibe (category)!"); valid = false; }
    if (!valid) return;

    // Lab 3: .push()
    expenses.push({ id: Date.now(), desc, amount: parseFloat(amountRaw), date, category });

    this.reset();
    $("#exp-date").val(new Date().toISOString().split("T")[0]);
    $(".form-control, .form-select").removeClass("is-invalid");

    showNotification(`💸 Done! ${category} — ${formatINR(parseFloat(amountRaw))} added. W move!`, "success");
    updateDashboard();
    renderExpenses();
    switchTab("dashboard");
}

function deleteExpense(id) {
    const idx = expenses.findIndex(e => e.id === id); // Lab 3: indexOf equivalent
    if (idx > -1) {
        expenses.splice(idx, 1);                       // Lab 3: array manipulation
        showNotification("🗑️ Expense deleted. L moment, but it's okay!", "danger");
        updateDashboard();
        renderExpenses();
    }
}

let sortAsc = false;
function sortExpenses() {
    sortAsc = !sortAsc;
    expenses.sort((a, b) => sortAsc ? a.amount - b.amount : b.amount - a.amount); // Lab 3: .sort()
    renderExpenses();
    showNotification(`📊 Sorted! (${sortAsc ? "Low → High" : "High → Low"})`);
}

// ============================================================
// DASHBOARD UPDATE (Lab 2 Math)
// ============================================================
function updateDashboard() {
    let totalSpent = 0;
    for (let i = 0; i < expenses.length; i++) { // Lab 3: for loop
        totalSpent = add(totalSpent, expenses[i].amount);
    }
    const balance   = subtract(profileData.budget, totalSpent);
    const pct       = profileData.budget > 0 ? multiply(divide(totalSpent, profileData.budget), 100) : 0;
    const remaining = subtract(profileData.budget, totalSpent);

    document.getElementById("total-balance").textContent         = formatINR(Math.max(balance, 0));
    document.getElementById("total-expenses").textContent        = formatINR(totalSpent);
    document.getElementById("monthly-budget-display").textContent= formatINR(profileData.budget);
    document.getElementById("budget-pct-label").textContent      = `${Math.min(pct, 100).toFixed(0)}% used`;
    document.getElementById("budget-remaining-label").textContent= `${formatINR(Math.max(remaining, 0))} left`;

    const subEl = document.getElementById("expense-sub");
    if (expenses.length === 0) {
        subEl.textContent = "Nothing spent yet 😌";
        subEl.style.color = "var(--text-muted)";
    } else {
        subEl.textContent = `${expenses.length} transaction${expenses.length > 1 ? "s" : ""} this month`;
        subEl.style.color = "#E57373";
    }

    const pb = $("#budget-progress");
    const w  = Math.min(pct, 100);
    pb.css("width", w + "%");

    if (pct >= 100) {
        pb.css("background-color", "#E57373");
        showNotification("🚨 Budget is gone! Slow down fr!", "danger");
    } else if (pct >= 80) {
        pb.css("background-color", "#FFB74D");
        showNotification("⚠️ 80% budget gone. Be careful bestie!", "warning");
    } else {
        pb.css("background-color", "var(--primary)");
    }

    renderRecentExpenses();
    renderExpenses();
}

function toggleBudgetEdit() {
    $("#budget-display-section").hide();
    $("#budget-edit-section").show();
    $("#quick-budget-input").val(profileData.budget).focus();
    $("#edit-budget-btn").hide();
}

function saveQuickBudget() {
    const val = parseFloat($("#quick-budget-input").val());
    if (!isNaN(val) && val > 0) {
        profileData.budget = val;
        $("#profile-budget").val(val);
        document.getElementById("profile-budget-display").textContent = formatINR(val);
        updateDashboard();
        showNotification(`✅ Budget updated to ${formatINR(val)}! Slay!`, "success");
        
        $("#budget-edit-section").hide();
        $("#budget-display-section").show();
        $("#edit-budget-btn").show();
    } else {
        showNotification("⚠️ Please enter a valid positive number!", "warning");
    }
}

function renderRecentExpenses() {
    const tbody = document.getElementById("recent-expenses-body");
    tbody.innerHTML = "";
    if (expenses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-cell">No expenses yet. Add one bestie! 🎉</td></tr>`;
        return;
    }
    const recent = [...expenses].slice(-5).reverse();
    for (let i = 0; i < recent.length; i++) {
        const exp = recent[i];
        tbody.innerHTML += `<tr>
            <td style="font-weight:700">${escapeHtml(exp.desc)}</td>
            <td><span class="cat-badge cat-${exp.category}">${exp.category}</span></td>
            <td style="color:var(--text-muted);font-size:0.85rem">${exp.date}</td>
            <td style="text-align:right;font-weight:700;color:#E57373;font-family:'Inter',sans-serif">-${formatINR(exp.amount)}</td>
        </tr>`;
    }
}

function renderExpenses() {
    const tbody  = document.getElementById("all-expenses-body");
    const filter = document.getElementById("filter-category").value;
    tbody.innerHTML = "";
    const filtered = filter ? expenses.filter(e => e.category === filter) : expenses; // Lab 3: filter

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-cell">${filter ? "Nothing in this category. Try another filter!" : "No expenses yet. Add one bestie!"}</td></tr>`;
        return;
    }
    for (let i = 0; i < filtered.length; i++) {
        const exp = filtered[i];
        tbody.innerHTML += `<tr>
            <td style="color:var(--text-muted);font-size:0.85rem">${exp.date}</td>
            <td><span class="cat-badge cat-${exp.category}">${exp.category}</span></td>
            <td style="font-weight:700">${escapeHtml(exp.desc)}</td>
            <td style="font-weight:700;color:#E57373;font-family:'Inter',sans-serif">-${formatINR(exp.amount)}</td>
            <td style="text-align:right">
                <button class="btn-sm-icon btn-delete" onclick="deleteExpense(${exp.id})" title="Delete it">
                    <i class='bx bx-trash'></i>
                </button>
            </td>
        </tr>`;
    }
}

// ============================================================
// BUDGET PLANNER — New Feature 🎯
// ============================================================

// Budget allocation strategy (Indian lifestyle)
const BUDGET_PLAN = [
    { key: "Needs",        label: "Needs / Essentials",  emoji: "🏠", desc: "Rent, Food, Transport, Bills", pct: 50, color: "#8C6A5D" },
    { key: "EMI",          label: "EMI / Loan Payment",  emoji: "🏦", desc: "Home loan, Personal loan, Credit card", pct: 10, color: "#B4846C" },
    { key: "Investment",   label: "Investment / SIP",     emoji: "📈", desc: "Mutual funds, Stocks, PPF, FD", pct: 15, color: "#C9956E" },
    { key: "Savings",      label: "Savings / Emergency",  emoji: "🐷", desc: "Emergency fund, Bank savings", pct: 10, color: "#D4A996" },
    { key: "Wants",        label: "Wants / Lifestyle",    emoji: "🛍️", desc: "Shopping, Entertainment, Eating out", pct: 10, color: "#E8C9BC" },
    { key: "Education",    label: "Education / Skills",   emoji: "📚", desc: "Courses, Books, Upskilling", pct: 5,  color: "#F0DDD5" },
];

const FINANCE_TIPS = [
    { icon: "📈", title: "Start a SIP — No Cap!", body: "Even a ₹500/month SIP can become ₹4+ lakh in 20 years. Compound interest is the real flex! It's bussin fr." },
    { icon: "🏦", title: "Build an Emergency Fund", body: "Keep 3-6 months of salary in an emergency fund. Job gone? Nah, not my tea. We are safe." },
    { icon: "💳", title: "Watch the EMIs", body: "Total EMI should never cross 40% of your monthly income. That's the rule, no cap." },
    { icon: "🎯", title: "Follow the 50-30-20 Rule", body: "50% Needs, 30% Wants, 20% Savings. The ultimate W formula for life. Understood the assignment!" },
    { icon: "🛒", title: "Avoid Impulse Buying", body: "Wait 24 hours before buying anything random. Lowkey saves so much cash bestie!" },
    { icon: "📊", title: "Save Tax Smartly", body: "Invest ₹1.5L under 80C to save tax. ELSS, PPF, NPS — your choice! Massive W move." },
    { icon: "🏠", title: "Keep Rent Below 30%", body: "Rent and utilities shouldn't exceed 30% of your monthly income. Slay your budget!" },
    { icon: "☕", title: "Do the Chai vs Latte Math", body: "A ₹200 coffee every day = ₹72,000/year! Daym! Make chai at home and invest that cash. Sheesh! 🚀" },
];

function generateBudgetPlan() {
    const salaryRaw = parseFloat($("#salary-input").val());

    if (!salaryRaw || salaryRaw < 1000) {
        showNotification("⚠️ Enter a valid salary — must be more than ₹1,000 bestie!", "warning");
        return;
    }

    profileData.salary = salaryRaw;
    document.getElementById("profile-salary-profile").value = salaryRaw;

    // Generate summary HTML
    let summaryHTML = "";
    BUDGET_PLAN.forEach(item => {
        const amount = multiply(divide(item.pct, 100), salaryRaw);
        summaryHTML += `
            <div class="budget-summary-item">
                <div class="sum-label">
                    <span class="sum-dot" style="background:${item.color}"></span>
                    ${item.emoji} ${item.label}
                </div>
                <div class="sum-amount">${formatINR(amount)}</div>
            </div>`;
    });
    $("#budget-summary-panel").html(summaryHTML);

    // Donut Chart
    $("#recommendation-section").fadeIn(400);
    $("#finance-tips-section").fadeIn(400);

    const labels  = BUDGET_PLAN.map(i => i.label);
    const data    = BUDGET_PLAN.map(i => multiply(divide(i.pct, 100), salaryRaw));
    const colors  = BUDGET_PLAN.map(i => i.color);

    // Update center label
    document.getElementById("donut-salary-display").textContent = formatINR(salaryRaw);

    if (budgetChartInstance) {
        budgetChartInstance.data.datasets[0].data   = data;
        budgetChartInstance.data.datasets[0].backgroundColor = colors;
        budgetChartInstance.update();
    } else {
        const ctx = document.getElementById("budget-donut-chart").getContext("2d");
        budgetChartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: "#FDFBF7",
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: false,
                cutout: "65%",
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.label}: ${formatINR(ctx.raw)} (${BUDGET_PLAN[ctx.dataIndex].pct}%)`
                        }
                    }
                },
                animation: { animateScale: true, duration: 800 }
            }
        });
    }

    // Recommendation Cards
    let cardsHTML = "";
    BUDGET_PLAN.forEach(item => {
        const amount = multiply(divide(item.pct, 100), salaryRaw);
        cardsHTML += `
            <div class="rec-card" style="background:${item.color}18;">
                <div class="rec-card-icon">${item.emoji}</div>
                <div class="rec-card-title">${item.label}</div>
                <div class="rec-card-amount">${formatINR(amount)}</div>
                <div class="rec-card-pct">${item.pct}% of salary · ${item.desc}</div>
                <div class="rec-card-bar">
                    <div class="rec-card-bar-fill" style="width:${item.pct}%;background:${item.color}"></div>
                </div>
            </div>`;
    });
    document.getElementById("recommendation-cards").innerHTML = cardsHTML;

    // Tips
    let tipsHTML = "";
    FINANCE_TIPS.forEach(tip => {
        tipsHTML += `
            <div class="finance-tip-card">
                <div class="tip-card-icon">${tip.icon}</div>
                <div class="tip-card-body">
                    <h6>${tip.title}</h6>
                    <p>${tip.body}</p>
                </div>
            </div>`;
    });
    document.getElementById("finance-tips-grid").innerHTML = tipsHTML;

    showNotification(`🎯 Budget plan ready for ${formatINR(salaryRaw)}/month. Slay!`, "success");
}

// ============================================================
// LAB 8 — Dynamic To-Do List (jQuery DOM)
// ============================================================
function handleAddTask() {
    const text = $("#task-input").val().trim();
    if (!text) { showNotification("⚠️ Drop a task name first bestie!", "warning"); return; }

    const id = Date.now();
    tasks.push({ id, text, done: false });

    const taskHTML = `
        <li class="task-item" id="task-${id}">
            <div class="task-left">
                <input class="form-check-input" type="checkbox" id="chk-${id}" onchange="toggleTask(${id})">
                <label for="chk-${id}" class="task-text">${escapeHtml(text)}</label>
            </div>
            <button class="task-del-btn" onclick="deleteTask(${id})" title="Remove it">
                <i class='bx bx-trash'></i>
            </button>
        </li>`;

    $("#task-list").prepend(taskHTML);    // Lab 8: prepend
    $("#task-input").val("");
    $("#empty-tasks").hide();
    showNotification("📋 Task added! Understood the assignment! 💯", "success");
}

function deleteTask(id) {
    $(`#task-${id}`).slideUp(250, function () {
        $(this).remove();                 // Lab 8: .remove()
        tasks = tasks.filter(t => t.id !== id);
        if (tasks.length === 0) $("#empty-tasks").show();
    });
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.done = !task.done;
        $(`#task-${id} .task-text`).toggleClass("done");  // Lab 8: jQuery DOM
    }
}

function renderTasks() {
    if (tasks.length === 0) $("#empty-tasks").show();
    else $("#empty-tasks").hide();
}

// ============================================================
// LAB 4 — Profile Update + Lab 6 Regex
// ============================================================
function handleUpdateProfile(e) {
    e.preventDefault();
    const name   = document.getElementById("profile-name").value.trim();
    const email  = document.getElementById("profile-email").value.trim();
    const phone  = document.getElementById("profile-phone").value.trim();
    const salary = document.getElementById("profile-salary-profile").value.trim();
    const budget = document.getElementById("profile-budget").value.trim();

    // Lab 6: .test() validation
    if (!REGEX.name.test(name))   { alert("❌ Only letters and spaces allowed for name! (2-50 chars)"); return; }
    if (!REGEX.email.test(email)) { alert("❌ That email is not giving. Try: name@example.com"); return; }
    if (phone && !REGEX.phone.test(phone)) { alert("❌ Invalid phone number format fr!"); return; }
    if (!REGEX.amount.test(budget) || parseFloat(budget) <= 0) { alert("❌ Enter a valid positive number for your budget!"); return; }

    profileData.name   = name;
    profileData.email  = email;
    profileData.phone  = phone;
    profileData.salary = salary ? parseFloat(salary) : profileData.salary;
    profileData.budget = parseFloat(budget);

    // Lab 4: DOM update
    document.getElementById("profile-name-display").textContent  = name;
    document.getElementById("profile-email-display").textContent  = email;
    document.getElementById("profile-budget-display").textContent = formatINR(profileData.budget);

    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    document.getElementById("profile-avatar").textContent        = initials;
    document.getElementById("profile-nav-avatar").textContent    = initials;

    // Update greeting
    const g = greetings[Math.floor(Math.random() * greetings.length)];
    $("#greeting-text").text(`${g[0]}, ${name}! 👋`);

    // Sync salary to budget planner
    if (profileData.salary > 0) {
        $("#salary-input").val(profileData.salary);
    }

    updateDashboard();
    showNotification("✅ Profile saved! Keep slaying! 🔥", "success");
}

// ============================================================
// UTILITY
// ============================================================
function escapeHtml(str) {
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
