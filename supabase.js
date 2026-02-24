// ====== Configure Supabase ======
const SUPABASE_URL = "https://qyaymudqiosbutaudhux.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YXltdWRxaW9zYnV0YXVkaHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY5NzYsImV4cCI6MjA4NzUzMjk3Nn0.tivHA2aId6gqRN4XVQfIKUh8BQ-fMbSCOg8Y9RTxAe0";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function $(id) { return document.getElementById(id); }
function isPage(name) { return window.location.pathname.endsWith(name); }

async function redirectIfNeeded() {
  const { data: { session } } = await supabase.auth.getSession();

  // Protect dashboard
  if (isPage("dashboard.html") && !session) {
    window.location.href = "login.html";
    return;
  }

  // If logged in and on login page, go dashboard
  if (isPage("login.html") && session) {
    window.location.href = "dashboard.html";
    return;
  }

  // Show user email on dashboard
  if (isPage("dashboard.html") && session) {
    const userLine = $("userLine");
    if (userLine) userLine.textContent = `Signed in as ${session.user.email}`;
  }
}

async function setupLoginPage() {
  if (!isPage("login.html")) return;

  const msg = $("msg");
  const form = $("authForm");
  const signupBtn = $("signupBtn");
  const resetBtn = $("resetBtn");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Signing in…";

    const email = $("email").value.trim();
    const password = $("password").value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      msg.textContent = error.message;
      return;
    }
    window.location.href = "dashboard.html";
  });

  signupBtn?.addEventListener("click", async () => {
    msg.textContent = "Creating account…";

    const email = $("email").value.trim();
    const password = $("password").value;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      msg.textContent = error.message;
      return;
    }

    msg.textContent = "Account created. If email confirmation is enabled, check your inbox.";
  });

  resetBtn?.addEventListener("click", async () => {
    const email = $("email").value.trim();
    if (!email) {
      msg.textContent = "Enter your email first, then click Forgot password.";
      return;
    }

    msg.textContent = "Sending password reset email…";

    // IMPORTANT: Set your redirect URL in Supabase Auth settings if needed
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname.replace("login.html", "login.html")}`
    });

    if (error) {
      msg.textContent = error.message;
      return;
    }
    msg.textContent = "Password reset email sent. Check your inbox.";
  });
}

async function setupLogout() {
  const btn = $("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.href = "login.html";
  });
}

// Run
redirectIfNeeded();
setupLoginPage();
setupLogout();

// Optional: react to auth changes
supabase.auth.onAuthStateChange((_event, _session) => {
  // Keep it simple: rely on redirectIfNeeded when pages load.
});