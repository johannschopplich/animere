(async () => {
  if (!("serviceWorker" in navigator)) return;

  const hasExistingSw = !!navigator.serviceWorker.controller;

  if (!import.meta.env.DEV) {
    try {
      navigator.serviceWorker.register("/service-worker.js");
    } catch (error) {
      console.error("Error during service worker registration:", error);
    }
  } else if (hasExistingSw) {
    const registration = await navigator.serviceWorker.ready;
    registration.unregister();
  }
})();
