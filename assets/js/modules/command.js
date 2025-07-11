const osList = [
  {
    pattern: /linux/i,
    command:
      '/bin/bash -c "$(wget -qO- https://raw.githubusercontent.com/leorodriguesf/omakase/refs/heads/ubuntu/install.sh)"',
  },
  {
    pattern: /mac/i,
    command:
      '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/leorodriguesf/omakase/refs/heads/macos/install.sh)"',
  },
];

export function makeCommand(showToast) {
  const command = document.querySelector(".command");
  const code = command.querySelector("code");
  const copyButton = command.querySelector(".command-copy");
  const copyText = copyButton.querySelector(".copy-text");
  const statusText = command.querySelector(".status-text");

  const userAgent = window.navigator.userAgent;
  const currentOS =
    osList.find((os) => os.pattern.test(userAgent)) || osList[0];

  // Set the command text
  code.textContent = currentOS?.command;

  // Update status text based on detected OS
  const osName = currentOS.pattern.test(userAgent)
    ? currentOS.pattern.source.includes("mac")
      ? "macOS"
      : "Ubuntu Linux"
    : "Ubuntu Linux (default)";

  statusText.textContent = `Auto-detected for ${osName}`;

  // Enhanced copy functionality
  copyButton.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      // Change button state during copy
      copyText.textContent = "Copying...";
      copyButton.disabled = true;

      // Copy to clipboard
      await navigator.clipboard.writeText(code.textContent.trim());

      // Success feedback
      copyText.textContent = "Copied!";
      copyButton.style.backgroundColor = "var(--color-success)";

      // Show toast notification
      if (showToast) {
        showToast("Command copied to clipboard!");
      }

      // Reset button after delay
      setTimeout(() => {
        copyText.textContent = "Copy";
        copyButton.disabled = false;
        copyButton.style.backgroundColor = "";
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);

      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code.textContent.trim();
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        copyText.textContent = "Copied!";
        copyButton.style.backgroundColor = "var(--color-success)";

        if (showToast) {
          showToast("Command copied to clipboard!");
        }
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
        copyText.textContent = "Failed";
        copyButton.style.backgroundColor = "var(--color-error)";

        if (showToast) {
          showToast("Failed to copy command", "error");
        }
      }

      document.body.removeChild(textArea);

      // Reset button after delay
      setTimeout(() => {
        copyText.textContent = "Copy";
        copyButton.disabled = false;
        copyButton.style.backgroundColor = "";
      }, 2000);
    }
  });

  // Remove loading state
  command.classList.remove("command--loading");
  command.removeAttribute("aria-busy");

  // Add smooth entrance animation
  setTimeout(() => {
    command.style.opacity = "1";
    command.style.transform = "translateY(0)";
  }, 100);
}

// Initialize command styling
document.addEventListener("DOMContentLoaded", () => {
  const command = document.querySelector(".command");
  if (command) {
    command.style.opacity = "0";
    command.style.transform = "translateY(20px)";
    command.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  }
});
