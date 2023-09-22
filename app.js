async function loading(){
     document.getElementById("loading").style.display = "none";
    }

async function getProfile() {
    document.getElementById("loading").style.display = "block";
     let cid = document.getElementById("cid").value;
  // ตรวจสอบความยาวของรหัส PIN
  if (cid.length !== 13) {
     //alert("เลขบัตรประจำตัวประชาชน ต้องยาว 13 หลัก");
  Swal.fire(
    'ผิดพลาด!',
    'เลขบัตรประจำตัวประชาชน ต้องยาว 13 หลัก!',
    'error'
  );
    return;
  }

  // ตรวจสอบว่ารหัส PIN ประกอบด้วยตัวเลขเท่านั้น
  for (const char of cid) {
    if (!/[0-9]/.test(char)) {
      // alert("เลขบัตรประจำตัวประชาชน ต้องเป็นตัวเลขเท่านั้น");
    Swal.fire(
      'ผิดพลาด!',
      'เลขบัตรประจำตัวประชาชน ต้องเป็นตัวเลขเท่านั้น!',
      'error'
    );
      return;
    }
  }
     
     const profile = await liff.getProfile()
   
    const gas = `https://script.google.com/macros/s/AKfycbwnqRFiJYRlyDvkQN1rBQMwFr8xckr4DI7vMXZpTLavPqKsW9Ss-Ntk5pF9VP-OxwLx/exec?user=${profile.userId}&name=${profile.displayName}&cid=${cid}`;
    const records = await fetch(gas);
    const data = await records.json();

    // ตรวจสอบว่าพบข้อมูลหรือไม่
  if (data.user === null || data.user === undefined ||data.user == 0 ) {
    // ไม่พบข้อมูล
    // alert("ไม่พบข้อมูล กรุณาแจ้ง จนท. เพื่อเพิ่มข้อมูลในระบบ");
    Swal.fire(
      'ไม่พบข้อมูล!',
      'โปรดตรวจสอบอีกครั้ง หรือแจ้ง จนท. เพื่อเพิ่มข้อมูลในระบบ!',
      'error'
    );
    
  } else {
    // พบข้อมูล
    // ใช้ข้อมูลใน JSON object
    console.log(data);
   
  }
    
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
