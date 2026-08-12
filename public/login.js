const form = document.querySelector("#loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = "/travel"; // login xong chuyển trang
  } else {
    document.querySelector("#result").innerText = data.message;
  }
});
