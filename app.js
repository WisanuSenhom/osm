async function loading(){
     document.getElementById("loading").style.display = "none";
    }

async function getProfile() {
    document.getElementById("loading").style.display = "block";
     let cid = document.getElementById("cid").value;
     const profile = await liff.getProfile()
   
    const gas = `https://script.google.com/macros/s/AKfycbwnqRFiJYRlyDvkQN1rBQMwFr8xckr4DI7vMXZpTLavPqKsW9Ss-Ntk5pF9VP-OxwLx/exec?user=${profile.userId}&name=${profile.displayName}&cid=${cid}`;
    const records = await fetch(gas);
    const data = await records.json();
    
    let output = '';
 
      data.user.forEach(function(user){
        output += `
        <div class="col">
        <div class="card text-center border-0">
                  <h2 class="card-header">
            ${user.name} 
             </h2>
             <ul class="list-group list-group-flush"><h3>
          อายุ ${user.age}</h3>
          </ul>
          <ul class="list-group list-group-flush">
            <a href="${user.ncd}" class="list-group-item list-group-item-action list-group-item-primary" type="button"><h2>${user.linktxt}</h2></a>          
           <a href="${user.adl}" class="list-group-item list-group-item-action list-group-item-success" type="button"><h2>ประเมินความสามารถในการทำกิจวัตรประจำวัน ADL</h2></a>        
          <a href="${user.qq}" class="list-group-item list-group-item-action list-group-item-warning" type="button"><h2>ประเมินโรคซึมเศร้า 2Q,9Q</h2></a>    
         <a href="${user.ncdplus}" class="list-group-item list-group-item-action list-group-item-info" type="button"><h2>ประเมินภาวะสุขภาพกาย สุขภาพจิต</h2></a>
        </ul>
   
        </div>    
        `
      });
     
      document.getElementById('output').innerHTML = output; 
        document.getElementById("loading").style.display = "none";
}

async function main() {
    await liff.init({ liffId: "1654797991-NRELReLk" })
      if (liff.isLoggedIn()) {
        getProfile() 
      } else {
        liff.login()
      }
  }
  main()
