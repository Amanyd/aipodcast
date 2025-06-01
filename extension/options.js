document.addEventListener("DOMContentLoaded", function () {
  const saveButton = document.getElementById("save");
  const emailInput = document.getElementById("email");
  const body = document.body;
  const bgDuplicate = document.querySelector(".bg-duplicate");

  const ZOOM_DURATION = 7000; // 7 seconds, matches CSS animation duration

  // Calculate current scale of zoomEffect animation (between 1 and 1.1)
  function getCurrentZoomScale() {
    const time = performance.now() % ZOOM_DURATION;
    let t = time / ZOOM_DURATION;
    // Use sine wave easing for smooth zoom between 1 and 1.1
    return 1 + 0.1 * Math.sin(Math.PI * t);
  }

  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  function notifySuccess(email) {
    showNotification("Email Saved", `You've saved: ${email}`);
  }

  function notifyFailure(message) {
    showNotification("Invalid Email", message);
  }

  function showNotification(title, message) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body: message,
        icon: "icons/pod.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body: message,
            icon: "icons/pod.png",
          });
        }
      });
    }
  }

  saveButton.addEventListener("click", function () {
    const currentScale = getCurrentZoomScale();

    body.classList.add("burst");

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      notifyFailure("Please enter a valid email address.");
    } else {
      chrome.storage.sync.set({ userEmail: email }, function () {
        notifySuccess(email);
      });
    }

    // Setup duplicate background initial state
    bgDuplicate.style.transition = "none";
    bgDuplicate.style.opacity = "0";
    bgDuplicate.style.transform = `translate(-50%, -50%) scale(0)`;
    bgDuplicate.style.display = "block";

    // Force reflow to apply initial styles before transitioning
    void bgDuplicate.offsetWidth;

    // Animate duplicate scaling and opacity in, delayed by 200ms for smooth sync
    setTimeout(() => {
      bgDuplicate.style.transition = "transform 1.2s ease, opacity 1.2s ease";
      bgDuplicate.style.opacity = "1";
      bgDuplicate.style.transform = "translate(-50%, -50%) scale(1)";
    }, 200);

    // After burst animation + duplicate animation complete, remove burst and hide duplicate
    setTimeout(() => {
      body.classList.remove("burst");
      bgDuplicate.style.opacity = "0";
      bgDuplicate.style.transform = "translate(-50%, -50%) scale(0)";
      setTimeout(() => {
        bgDuplicate.style.display = "none";
      }, 700);
    }, 1400);
  });
});
