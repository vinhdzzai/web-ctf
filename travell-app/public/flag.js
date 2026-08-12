document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".flag-form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.classList.contains("done")) return;

      const input = form.querySelector("input[name='flagInput']");
      const feedback = form.querySelector(".flag-feedback");
      const flagIndex = form.querySelector("input[name='flagIndex']").value;

      if (!input || !feedback) return;

      const response = await fetch("/flag/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flagIndex,
          flagInput: input.value,
        }),
      });

      const result = await response.json();
      const success = result.success === true;

      feedback.textContent = result.message || "Có lỗi xảy ra.";
      feedback.classList.toggle("success", success);
      feedback.classList.toggle("error", !success);

      if (success) {
        form.classList.add("done");
        input.disabled = true;
        input.value = result.message.includes("Flag")
          ? input.value
          : input.value;
        const status = form.querySelector(".status-indicator");
        if (status) {
          status.textContent = "Giải xong";
        }
      }
    });
  });
});
