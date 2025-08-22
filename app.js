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
       document.getElementById("loading").style.display = "none";
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
         document.getElementById("loading").style.display = "none";
      return;
         
    }
  }
     
     const profile = await liff.getProfile()
   
    const gas = `https://script.google.com/macros/s/AKfycbwnqRFiJYRlyDvkQN1rBQMwFr8xckr4DI7vMXZpTLavPqKsW9Ss-Ntk5pF9VP-OxwLx/exec?user=${profile.userId}&name=${profile.displayName}&cid=${cid}`;
    const records = await fetch(gas);
    const data = await records.json();

  // ตรวจสอบว่าพบข้อมูลหรือไม่
  if (data.user === null || data.user === undefined ||data.user == 0 ) {
let timerInterval
    Swal.fire({
      icon: 'warning',
      title: 'ไม่พบข้อมูล!\nโปรดตรวจสอบ!\nหรือแจ้ง จนท. เพื่อเพิ่มข้อมูลในระบบ!',
      html: 'กำลังรีเฟชรข้อมูลในอีก <b></b> มิลลิวินาที',
      timer: 10000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft()
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        location.reload();
       // console.log('I was closed by the timer')
      }
    });
       
    document.getElementById("loading").style.display = "none";
  } else {
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: 'พบข้อมูล'
    })
  };
    
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
            <a href="${user.ncd}" target="_blank" class="list-group-item list-group-item-action list-group-item-primary" type="button"><h2>${user.linktxt}</h2></a>          
           <a href="${user.adl}" target="_blank" class="list-group-item list-group-item-action list-group-item-success" type="button"><h2>ประเมินความสามารถในการทำกิจวัตรประจำวัน ADL</h2></a>        
          <a href="${user.qq}" target="_blank" class="list-group-item list-group-item-action list-group-item-warning" type="button"><h2>ประเมินโรคซึมเศร้า 2Q,9Q</h2></a>    
         <a href="${user.ncdplus}" target="_blank" class="list-group-item list-group-item-action list-group-item-info" type="button"><h2>ประเมินภาวะสุขภาพกาย สุขภาพจิต</h2></a>
        <a href="${user.dental}" target="_blank" class="list-group-item list-group-item-action list-group-item-light" type="button"><h2>ตรวจสุขภาพช่องปาก</h2></a>
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

function reload(){
  let timerInterval
Swal.fire({
  title: 'กำลังเคลียร์ข้อมูล!',
  html: 'ในอีก <b></b> มิลลิวินาที',
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft()
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    location.reload();
    console.log('I was closed by the timer')
  }
});
 
}
