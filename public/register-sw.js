if ("serviceWorker" in navigator) {
  let refreshing = false;
  const hadController = Boolean(navigator.serviceWorker.controller);

  async function refreshDeployment() {
    try {
      const registration = await navigator.serviceWorker.register("/daily-shot/sw.js?v=10", {
        scope: "/daily-shot/",
        updateViaCache: "none"
      });

      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      await registration.update();

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed") worker.postMessage({ type: "SKIP_WAITING" });
        });
      });
    } catch (error) {
      console.error("Daily Shot update check failed", error);
    }
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener("load", refreshDeployment);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refreshDeployment();
  });
}
