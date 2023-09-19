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
            <a href="${user.ncd}" class="btn btn-primary" type="button">${user.linktxt}</a>

           </ul>
           <ul class="list-group list-group-flush">
          
           <a href="${user.adl}" class="btn btn-success" type="button">คัดกรองภาวะพึ่งพิง ADL</a>

          </ul>
          <ul class="list-group list-group-flush">
        
          <a href="${user.qq}" class="btn btn-primary" type="button">คัดกรองโรคซึมเศร้า</a>
       
         </ul>
         <ul class="list-group list-group-flush">
         <a href="${user.ncdplus}" class="btn btn-success" type="button">คัดกรองสุขภาพกาย สุขภาพจิต</a>
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
