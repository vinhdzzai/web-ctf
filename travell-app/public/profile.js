fetch("/api/profile")
  .then(res => {
    if (!res.ok) {
      window.location.href = "/login.html"; // chưa login thì đá về login
      return;
    }
    return res.json();
  })
  .then(data => {
    if (data) {
      document.querySelector("#welcome").innerText = data.message;
    }
  });

document.querySelector("#btnLogout").addEventListener("click", async () => {
  await fetch("/logout", { method: "POST" });
  window.location.href = "/login.html";
});

function renderList(items) {
  const container = document.querySelector("#userList");

  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = item; 
    container.appendChild(li);
  });
}

document.querySelector("#btnAdd").addEventListener("click", () => {
  const input = document.querySelector("#itemInput").value;
  renderList([input]);
});