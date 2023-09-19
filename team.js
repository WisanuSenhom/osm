async function getProfile() {
     document.getElementById("loading").style.display = "block";
     const profile = await liff.getProfile()
     const xurl = `https://script.google.com/macros/s/AKfycbzRuhRDDFVfX0lKhUSxdGGjE7uaQFmO5UBLKkKijJBeNCIClAzJntnJ5T-z3dTPXvxU/exec?user=${profile.userId}&name=${profile.displayName}`;
   
   const records = await fetch(xurl);
   const data = await records.json();
   
   let output = '';

     data.user.forEach(function(user){
       output += `
       <div class="col">
       <div class="card text-center border-0">
       <img class="card-img-top" src="${user.pic}" alt="Card image cap">
            <h5 class="card-header">
           ${user.name} 
            </h5>
         <h7 class="card-header">
         (${user.position})
         </h7>
         <ul class="list-group list-group-flush">
           <li class="list-group-item">วันที่ลงเวลามาล่าสุด : ${user.datein}</li>
          <li class="list-group-item">ระยะห่างจากสำนักงาน : ${user.distance}</li>
           <li class="list-group-item">พิกัด : ${user.geo}</li>
           <a href="${user.location}" class="btn btn-info" type="button">เปิดแผนที่ตำแหน่งลงเวลาล่าสุด</a>
           <a href="${user.sheet}" class="btn btn-success" type="button">คืนข้อมูล Google Sheet (รายงานลงเวลารรายวัน รายเดือน รายบุคคล)</a>
         </ul>
       </div>
       </div>    
       `
     });

     document.getElementById('output').innerHTML = output; 
     document.getElementById("loading").style.display = "none";
}

async function main() {
    await liff.init({ liffId: "1654797991-gPq2xR2n" })
      if (liff.isLoggedIn()) {
        getProfile() 
      } else {
        liff.login()
      }
  }
  main()
