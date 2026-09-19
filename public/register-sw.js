if("serviceWorker" in navigator){
  let refreshing=false;

  const register=async()=>{
    try{
      const registration=await navigator.serviceWorker.register("/daily-shot/sw.js",{
        scope:"/daily-shot/",
        updateViaCache:"none"
      });

      const activateUpdate=()=>{
        if(registration.waiting){
          registration.waiting.postMessage({type:"SKIP_WAITING"});
        }
      };

      registration.addEventListener("updatefound",()=>{
        const worker=registration.installing;
        if(!worker) return;
        worker.addEventListener("statechange",()=>{
          if(worker.state==="installed" && navigator.serviceWorker.controller){
            activateUpdate();
          }
        });
      });

      // Check on every launch and whenever the installed app returns to foreground.
      await registration.update();
      activateUpdate();
      document.addEventListener("visibilitychange",()=>{
        if(document.visibilityState==="visible") registration.update().catch(()=>{});
      });
      window.addEventListener("focus",()=>registration.update().catch(()=>{}));
    }catch(error){
      console.error("Daily Shot service worker registration failed",error);
    }
  };

  navigator.serviceWorker.addEventListener("controllerchange",()=>{
    if(refreshing) return;
    refreshing=true;
    window.location.reload();
  });

  window.addEventListener("load",register);
}