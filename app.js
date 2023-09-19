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
                  <h5 class="card-header">
            ${user.name} 
             </h5>
             <ul class="list-group list-group-flush">
          อายุ ${user.age}
          </ul>
          <ul class="list-group list-group-flush">
            <a href="${user.ncd}" class="list-group-item list-group-item-action list-group-item-primary" type="button">${user.linktxt}</a>          
           <a href="${user.adl}" class="list-group-item list-group-item-action list-group-item-success" type="button">ประเมินความสามารถในการทำกิจวัตรประจำวัน ADL</a>        
          <a href="${user.qq}" class="list-group-item list-group-item-action list-group-item-warning" type="button">ประเมินโรคซึมเศร้า 2Q,9Q</a>    
         <a href="${user.ncdplus}" class="list-group-item list-group-item-action list-group-item-info" type="button">ประเมินภาวะสุขภาพกาย สุขภาพจิต</a>
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
