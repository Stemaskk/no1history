// Ohlone History — redirect, no popup

document.addEventListener("DOMContentLoaded", () => {
    // ---------- helpers ----------
    function collectForm(formEl) {
        const data = {};
        const fd = new FormData(formEl);
        for (const [name, value] of fd.entries()) {
            if (data[name]) {
                if (Array.isArray(data[name])) data[name].push(value);
                else data[name] = [data[name], value];
            } else {
                data[name] = value;
            }
        }
        return data;
    }
    // remove spaces/punct, lowercase
    function normalizeLetters(s) {
        return (s || "").toLowerCase().replace(/[\s\.\-_,’'"]/g, "");
    }
    // digits only
    function digitsOnly(s) {
        return (s || "").toString().replace(/\D/g, "");
    }

    // ---------- correct answers ----------
    const correct = {
        // Q1
        "hist-meeting": "johnf.kennedyhighschool",

        // Q2: accept both with or without "Mr."
        "hist-suggester-accepted": [
            "mrfelipegalvan",
            "felipegalvan"
        ],

        // Q3
        "hist-tradition": "Miwuk tribe",

        // Q4
        "hist-first-grads": "16",

        // Q5
        "hist-president": "charlessasaki"
    };

    // ---------- redirect ----------
    const REDIRECT_URL = "https://bodyhead.netlify.app/";

    // ---------- checker ----------
    function allAnswersCorrect(ans) {
        const q1 = normalizeLetters(ans["hist-meeting"]) === correct["hist-meeting"];

        const suggester = normalizeLetters(ans["hist-suggester"]);
        const q2 = correct["hist-suggester-accepted"].includes(suggester);

        const q3 = (ans["hist-tradition"] || "") === correct["hist-tradition"];

        const q4 = digitsOnly(ans["hist-first-grads"]) === correct["hist-first-grads"];

        const q5 = normalizeLetters(ans["hist-president"]) === correct["hist-president"];

        return q1 && q2 && q3 && q4 && q5;
    }

    // ---------- wire up ----------
    const form = document.getElementById("quiz-form");
    const results = document.getElementById("results");
    const resetAll = document.getElementById("resetAll");

    if (!form || !results) {
        console.error("quiz-form or results not found. Check your HTML ids.");
        return;
    }

    form.setAttribute("action", "javascript:void(0)");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const ok = allAnswersCorrect(collectForm(form));
        if (ok) {
            results.textContent = "All correct! Redirecting…";
            setTimeout(() => { window.location.href = REDIRECT_URL; }, 50);
        } else {
            results.textContent = "Not quite — try again.";
        }
        results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    if (resetAll) {
        resetAll.addEventListener("click", () => {
            form.reset();
            results.textContent = "";
        });
    }
});
