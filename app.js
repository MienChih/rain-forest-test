(() => {
  const form = document.getElementById("profile-form");
  const saveBtn = document.getElementById("btn-save");
  const saveFeedback = document.getElementById("save-feedback");

  const changePasswordBtn = document.getElementById("btn-change-password");
  const passwordModal = document.getElementById("password-modal");
  const passwordForm = document.getElementById("password-form");
  const passwordFeedback = document.getElementById("password-feedback");
  const cancelPasswordBtn = document.getElementById("btn-cancel-password");

  const copyUserIdBtn = document.getElementById("btn-copy-user-id");
  const userIdInput = document.getElementById("userId");
  const userIdFeedback = document.getElementById("user-id-feedback");

  if (!form) return;

  const initialData = new FormData(form);

  function isDirty() {
    const current = new FormData(form);
    for (const [key, value] of current.entries()) {
      if (initialData.get(key) !== value) return true;
    }
    return false;
  }

  function updateSaveState() {
    if (!saveBtn) return;
    const dirty = isDirty();
    saveBtn.disabled = !dirty;
    if (!dirty) {
      saveFeedback.textContent = "";
    }
  }

  form.addEventListener("input", () => {
    updateSaveState();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!isDirty()) return;
    saveFeedback.textContent = "Profile saved (frontend only, no backend).";
    saveFeedback.classList.add("helper--success");

    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      initialData.set(key, value.toString());
    }
    updateSaveState();
  });

  function openPasswordModal() {
    if (!passwordModal) return;
    passwordModal.classList.add("modal--open");
    passwordModal.setAttribute("aria-hidden", "false");
    passwordFeedback.textContent = "";
    passwordForm.reset();
    const current = document.getElementById("currentPassword");
    if (current) current.focus();
  }

  function closePasswordModal() {
    if (!passwordModal) return;
    passwordModal.classList.remove("modal--open");
    passwordModal.setAttribute("aria-hidden", "true");
    passwordFeedback.textContent = "";
    changePasswordBtn?.focus();
  }

  changePasswordBtn?.addEventListener("click", () => {
    openPasswordModal();
  });

  cancelPasswordBtn?.addEventListener("click", () => {
    closePasswordModal();
  });

  passwordForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const current = document.getElementById("currentPassword");
    const next = document.getElementById("newPassword");
    const confirm = document.getElementById("confirmPassword");
    if (!current || !next || !confirm) return;

    if (next.value !== confirm.value) {
      passwordFeedback.textContent = "New passwords do not match.";
      return;
    }

    passwordFeedback.textContent = "Password updated (frontend only).";
    passwordFeedback.classList.remove("helper--error");
    passwordFeedback.classList.add("helper--success");

    setTimeout(() => {
      closePasswordModal();
    }, 800);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && passwordModal?.classList.contains("modal--open")) {
      closePasswordModal();
    }
  });

  passwordModal?.addEventListener("click", (event) => {
    if (event.target === passwordModal || event.target === passwordModal.querySelector(".modal__backdrop")) {
      closePasswordModal();
    }
  });

  copyUserIdBtn?.addEventListener("click", async () => {
    if (!userIdInput) return;
    try {
      await navigator.clipboard.writeText(userIdInput.value);
      if (userIdFeedback) {
        userIdFeedback.textContent = "User ID copied to clipboard.";
      }
    } catch {
      userIdInput.select();
      document.execCommand("copy");
      if (userIdFeedback) {
        userIdFeedback.textContent = "User ID copied (fallback).";
      }
    }
    setTimeout(() => {
      if (userIdFeedback) userIdFeedback.textContent = "";
    }, 2000);
  });
})();

