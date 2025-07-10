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

export function makeCommand() {
  const command = document.querySelector(".command");
  const code = command.querySelector("code");

  const userAgent = window.navigator.userAgent;

  const currentOS =
    osList.find((os) => os.pattern.test(userAgent)) || osList[0];

  code.textContent = currentOS?.command;

  command.querySelector("button").addEventListener("click", (e) => {
    e.preventDefault();

    navigator.clipboard.writeText(code.innerText.trim());
  });

  command.classList.remove("command--loading");
  command.removeAttribute("aria-busy");
}
