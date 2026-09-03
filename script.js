// ============================================================
// TERRIBLE GMAIL CLONE — TERMINAL EDITION
// Every "feature" below is an INTENTIONAL UX anti-pattern.
// See README.md for what real design principle each one breaks.
// ============================================================

// ---- Fake inbox data ----
const emails = [
  { id: 1, sender: "Boss", subject: "FIRED", body: "You are fired from my company due to your incompetence", unread: true },
  { id: 2, sender: "Mom", subject: "Dinner on Sunday?", body: "Are you coming home for dinner on Sunday? Let me know soon.", unread: true },
  { id: 3, sender: "Registrar", subject: "Fee Payment Reminder", body: "This is a reminder that your semester fee is due next week.", unread: true },
  { id: 4, sender: "Amazon", subject: "Stolen order", body: "Your order was shipped but it got stolen on its way, we can't give you a refund,sorry for the inconvinience caused", unread: false },
  { id: 5, sender: "GitHub", subject: "Security alert", body: "A new device signed in to your account.", unread: true },
  { id: 6, sender: "Netflix", subject: "Payment pending", body: "Your payment for the upcoming month is still pending.", unread: false },
  { id: 7, sender: "WIFE", subject: "IT'S OVER!", body: "I want a divorce! and i am keeping the kids with me", unread: true },
  { id: 8, sender: "LinkedIn", subject: "3 new notifications", body: "See who viewed your profile this week.", unread: false },
  { id: 9, sender: "Professor Mohit", subject: "Assignment Deadline Extended", body: "The deadline has been pushed to next Monday.", unread: true },
  { id: 10, sender: "Swiggy", subject: "Your order is on the way", body: "Your food will arrive in approximately 25 minutes.", unread: false },
  { id: 11, sender: "Placement Cell", subject: "Internship Drive Registration", body: "Register before Friday to be considered for the drive.", unread: true },
  { id: 12, sender: "Spotify", subject: "Your Wrapped is here", body: "See your most-played tracks and artists this year.", unread: false },
  { id: 13, sender: "Zomato", subject: "Rate your last order", body: "How was your recent order? Tap to rate.", unread: false },
  { id: 14, sender: "Hostel Warden", subject: "Room Inspection Notice", body: "Rooms will be inspected this Saturday morning.", unread: true },
  { id: 15, sender: "Dad", subject: "CALL ME", body: "Where are you???, Call me immediately!!", unread: true },
  { id: 16, sender: "Google", subject: "Unusual activity detected", body: "Someone has hacked your account and stolen all your data", unread: false },
  { id: 17, sender: "Coursera", subject: "Course completion certificate", body: "Congratulations on completing your course.", unread: false },
  { id: 18, sender: "Flipkart", subject: "Big Billion Day sale starts now", body: "Don't miss out on the biggest sale of the year.", unread: true },
];

// Deleted emails go here instead of vanishing -- used by the Trash
// sidebar item, see ANTI-PATTERN 13 below.
let trashedEmails = [];

const emailListEl = document.getElementById("emailList");
const readingPane = document.getElementById("readingPane");

// ---- Render the inbox list ----
function renderEmails(list) {
  emailListEl.innerHTML = "";
  list.forEach(email => {
    const li = document.createElement("li");
    li.className = email.unread ? "unread" : "";
    li.dataset.id = email.id;
    li.innerHTML =
      '<span class="sender">' + email.sender + '</span>' +
      '<span class="snippet"><strong>' + email.subject + '</strong> — ' + email.body + '</span>';

    // ANTI-PATTERN 1: read/unread state flips randomly on hover.
    li.addEventListener("mouseenter", () => {
      if (Math.random() < 0.5) {
        email.unread = !email.unread;
        li.classList.toggle("unread", email.unread);
      }
    });

    li.addEventListener("click", () => openEmail(email));
    emailListEl.appendChild(li);
  });
}

// ---- Open an email in the reading pane ----
function openEmail(email) {
  readingPane.innerHTML =
    '<h2>' + email.subject + '</h2>' +
    '<p><strong>From:</strong> ' + email.sender + '</p>' +
    '<p>' + email.body + '</p>' +
    '<div class="pane-actions">' +
      '<button id="replyBtn">Reply</button>' +
      '<button id="deleteBtn">Delete</button>' +
      '<span id="swapZone"></span>' +
    '</div>';

  // ANTI-PATTERN 2: Reply opens a brand-new tab instead of replying inline.
  document.getElementById("replyBtn").addEventListener("click", () => {
    const w = window.open("", "_blank");
    w.document.write("<h1>Replying happens here now.</h1><p>There is nowhere to type on this page.</p>");
  });

  // ANTI-PATTERN 3: Delete demands five confirmations, silently does
  // nothing if you cancel any single one of them. Deleted mail goes
  // into trashedEmails instead of vanishing -- see the Trash sidebar
  // item further down.
  document.getElementById("deleteBtn").addEventListener("click", () => {
    const confirmations = [
      "Delete this email?",
      "Are you sure?",
      "Are you REALLY sure?",
      "This cannot be undone. Proceed?",
      "Final answer — delete forever?"
    ];
    for (const msg of confirmations) {
      if (!confirm(msg)) return;
    }
    const idx = emails.findIndex(e => e.id === email.id);
    const removed = emails.splice(idx, 1)[0];
    trashedEmails.push(removed);
    renderEmails(emails);
    readingPane.innerHTML = '<p id="placeholderText">SELECT AN EMAIL TO (MAYBE) READ IT.</p>';
  });

  // ANTI-PATTERN 4: "Unsubscribe" and "Delete Forever" are visually
  // identical and swap position every 2.5 seconds.
  const swapZone = document.getElementById("swapZone");
  swapZone.innerHTML =
    '<button class="danger-btn" data-role="unsub">Unsubscribe</button>' +
    '<button class="danger-btn" data-role="delete-forever">Delete Forever</button>';

  // ANTI-PATTERN 5: neither button does what it says. Each one takes
  // no real action, but confirms the OTHER action happened instead --
  // the system actively lies about what just occurred.
  swapZone.querySelector('[data-role="unsub"]').addEventListener("click", () => {
    alert("Email permanently deleted.");
  });
  swapZone.querySelector('[data-role="delete-forever"]').addEventListener("click", () => {
    alert("You have successfully unsubscribed from this sender.");
  });

  const swapInterval = setInterval(() => {
    if (!document.body.contains(swapZone)) { clearInterval(swapInterval); return; }
    const btns = swapZone.querySelectorAll("button");
    swapZone.insertBefore(btns[1], btns[0]);
  }, 2500);
}

// ---- ANTI-PATTERN 6: sidebar nav order shuffles on every page load ----
(function shuffleSidebar() {
  const navList = document.getElementById("navList");
  const items = Array.from(navList.children);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  items.forEach(item => navList.appendChild(item));
})();

// ---- Sidebar is now interactive -- but every label lies about what
// it does, and clicking one highlights a DIFFERENT random item as
// "active" so you can never trust which section you're supposedly in.
const navList = document.getElementById("navList");
navList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;
  const label = li.dataset.label;

  // ANTI-PATTERN 7: highlights a random (usually wrong) item.
  document.querySelectorAll("#navList li").forEach(item => item.classList.remove("active-fake"));
  const allItems = document.querySelectorAll("#navList li");
  allItems[Math.floor(Math.random() * allItems.length)].classList.add("active-fake");

  if (label === "Inbox") {
    renderEmails(emails);
    readingPane.innerHTML = '<p id="placeholderText">SELECT AN EMAIL TO (MAYBE) READ IT.</p>';
  } else if (label === "Starred") {
    // ANTI-PATTERN 8: dead-end feature with a fake paywall.
    alert("Starred requires VIT-Mail Premium. Upgrade not available in this build.");
  } else if (label === "Sent") {
    // ANTI-PATTERN 9: "Sent" doesn't show sent mail -- it opens Compose.
    composeBtn.click();
  } else if (label === "Drafts") {
    // ANTI-PATTERN 10: "Drafts" silently deletes a random email,
    // no confirmation at all -- the opposite problem from Delete.
    if (emails.length > 0) {
      const randIdx = Math.floor(Math.random() * emails.length);
      const gone = emails.splice(randIdx, 1)[0];
      trashedEmails.push(gone);
      renderEmails(emails);
    }
  } else if (label === "Trash") {
    // ANTI-PATTERN 11: "Trash" un-deletes everything you've ever
    // deleted, all at once, with no warning. Nothing is ever gone.
    if (trashedEmails.length > 0) {
      emails.push(...trashedEmails);
      trashedEmails = [];
      renderEmails(emails);
    }
  }
});

// ---- ANTI-PATTERN 12: fake logout that doesn't log out ----
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("Logout is disabled in this build. You are stuck here forever.");
});

// ---- ANTI-PATTERN 13: search matches the REVERSED query text ----
const searchBox = document.getElementById("searchBox");
const searchStatus = document.getElementById("searchStatus");
searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  const reversed = query.split("").reverse().join("");
  const filtered = emails.filter(e =>
    query === "" || e.subject.toLowerCase().includes(reversed)
  );
  renderEmails(filtered);
  searchStatus.textContent = query ? 'Showing highly relevant results for "' + query + '"' : "";
});

// ---- ANTI-PATTERN 14: scrolling the inbox scrambles font size & color ----
const emailListContainer = document.getElementById("emailListContainer");
let scrambling = false;
emailListContainer.addEventListener("scroll", () => {
  if (scrambling) return;
  scrambling = true;
  requestAnimationFrame(() => {
    document.querySelectorAll("#emailList li").forEach(li => {
      li.style.fontSize = (10 + Math.random() * 20) + "px";
      li.style.color = "hsl(" + Math.floor(Math.random() * 360) + ", 70%, 55%)";
    });
    scrambling = false;
  });
});

// ---- Compose modal ----
const composeModal = document.getElementById("composeModal");
const composeBtn = document.getElementById("composeBtn");
const closeCompose = document.getElementById("closeCompose");
const sendBtn = document.getElementById("sendBtn");
const attachBtn = document.getElementById("attachBtn");
const autoSendTimer = document.getElementById("autoSendTimer");
const toField = document.getElementById("toField");
const subjectField = document.getElementById("subjectField");
const bodyField = document.getElementById("bodyField");

let autoSendCountdown = null;
let autoSendSecondsLeft = 5;

function resetAutoSendTimer() {
  clearInterval(autoSendCountdown);
  autoSendSecondsLeft = 5;
  autoSendCountdown = setInterval(() => {
    autoSendSecondsLeft--;
    autoSendTimer.textContent = "Sending automatically in " + autoSendSecondsLeft + "s (no undo)...";
    if (autoSendSecondsLeft <= 0) {
      clearInterval(autoSendCountdown);
      finalizeSend();
    }
  }, 1000);
}

// ANTI-PATTERN 15: the draft auto-sends 5 seconds after you stop typing.
[toField, subjectField, bodyField].forEach(field => {
  field.addEventListener("input", resetAutoSendTimer);
});

function finalizeSend() {
  alert("Message sent! (You didn't get a chance to double-check it.)");
  composeModal.classList.add("hidden");
  autoSendTimer.textContent = "";
}

composeBtn.addEventListener("click", () => {
  toField.value = "";
  subjectField.value = "";
  bodyField.value = "";
  autoSendTimer.textContent = "";
  clearInterval(autoSendCountdown);
  sendBtn.style.left = "14px";
  sendBtn.style.top = "14px";
  composeModal.classList.remove("hidden");
});

closeCompose.addEventListener("click", () => {
  clearInterval(autoSendCountdown);
  composeModal.classList.add("hidden");
});

// ANTI-PATTERN 16: the Send button runs away from the cursor (Fitts's Law).
sendBtn.addEventListener("mouseenter", () => {
  const footer = document.getElementById("composeFooter");
  const maxLeft = footer.clientWidth - sendBtn.offsetWidth - 10;
  const maxTop = footer.clientHeight - sendBtn.offsetHeight - 10;
  sendBtn.style.left = Math.max(10, Math.random() * maxLeft) + "px";
  sendBtn.style.top = Math.max(10, Math.random() * maxTop) + "px";
});
sendBtn.addEventListener("click", () => {
  clearInterval(autoSendCountdown);
  finalizeSend();
});

// ANTI-PATTERN 17: "Attach file" downloads an unrelated file instead
// of opening a file picker.
attachBtn.addEventListener("click", () => {
  const blob = new Blob(["This is not the file you wanted to attach."], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "not_your_file.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// ---- ANTI-PATTERN 18: a popup ad every 10 seconds, closable only by
// hunting down a tiny, low-contrast X button that relocates to a
// different corner every single time. The overlay sits on top of the
// entire page and eats all clicks, so there is no way to "just ignore
// it" and keep using the inbox -- you MUST find and click the X.
const adOverlay = document.getElementById("adOverlay");
const adBox = document.getElementById("adBox");
const adContent = document.getElementById("adContent");
const adCloseBtn = document.getElementById("adCloseBtn");

const fakeAds = [
  { headline: "CONGRATULATIONS!!!", body: "You are visitor #1,000,000!<br>Claim your FREE prize now." },
  { headline: "1 WEIRD TRICK", body: "Registrars HATE this one<br>simple fee-payment hack." },
  { headline: "YOUR PC HAS", body: "37 VIRUSES!!!<br>Download TotallyLegitCleaner.exe now." },
  { headline: "WIN A FREE", body: "SEMESTER!!!<br>Just enter your password to enter." },
  { headline: "AMAZING DEAL", body: "Buy 1 Get 1 FREE<br>on things you did not ask about." }
];

const adCorners = [
  { top: "6px", right: "6px", bottom: "", left: "" },
  { top: "6px", left: "6px", bottom: "", right: "" },
  { bottom: "6px", right: "6px", top: "", left: "" },
  { bottom: "6px", left: "6px", top: "", right: "" }
];

function showAd() {
  // Don't stack a second ad on top of one that's already open --
  // it'll just show again 10s after this one finally gets closed.
  if (!adOverlay.classList.contains("hidden")) return;

  const ad = fakeAds[Math.floor(Math.random() * fakeAds.length)];
  adContent.innerHTML =
    '<span class="ad-headline">' + ad.headline + '</span>' +
    ad.body +
    '<br><span class="ad-cta">CLICK HERE</span>';

  // Relocate the tiny close button to a random corner every time.
  const corner = adCorners[Math.floor(Math.random() * adCorners.length)];
  adCloseBtn.style.top = corner.top;
  adCloseBtn.style.bottom = corner.bottom;
  adCloseBtn.style.left = corner.left;
  adCloseBtn.style.right = corner.right;

  adOverlay.classList.remove("hidden");
}

adCloseBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  adOverlay.classList.add("hidden");
});

// Clicking anywhere else on the ad (including the fake "CLICK HERE"
// CTA) does nothing -- only the tiny X works, on purpose.
adBox.addEventListener("click", (e) => {
  if (e.target !== adCloseBtn) e.stopPropagation();
});

setInterval(showAd, 15000);

// ---- Initial render ----
renderEmails(emails);
