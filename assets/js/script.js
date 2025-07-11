import { makeCommand } from "./modules/command.js";

function showToast(message, type = "success") {
  const toast = document.getElementById("copyToast");
  const toastContent = toast.querySelector(".toast-content span");

  toastContent.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  makeCommand(showToast);
});

export { showToast };
