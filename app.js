async function loadingHide() {
  document.getElementById("loading").style.display = "none";
}

async function loadingShow() {
  document.getElementById("loading").style.display = "block";
}

// ✅ ตรวจสอบเลขบัตรประชาชน
function validateCID(cid) {
  if (cid.length !== 13) {
    Swal.fire('ผิดพลาด!', 'เลขบัตรประชาชน ต้องยาว 13 หลัก!', 'error');
    return false;
  }
  if (!/^\d{13}$/.test(cid)) {
    Swal.fire('ผิดพลาด!', 'เลขบัตรประชาชน ต้องเป็นตัวเลขเท่านั้น!', 'error');
    return false;
  }
  return true;
}

// ✅ โหลดข้อมูลผู้ใช้
async function getProfile() {
  await loadingShow();
  let cid = document.getElementById("cid").value;

  // ตรวจสอบเลขบัตรก่อน
  if (!validateCID(cid)) {
    await loadingHide();
    return;
  }

  try {
    // ดึงข้อมูลจาก LINE
    const profile = await liff.getProfile();

    // เรียก API (Google Apps Script)
    const gas = `https://script.google.com/macros/s/AKfycbwnqRFiJYRlyDvkQN1rBQMwFr8xckr4DI7vMXZpTLavPqKsW9Ss-Ntk5pF9VP-OxwLx/exec?user=${profile.userId}&name=${profile.displayName}&cid=${cid}`;
    const response = await fetch(gas);
    const data = await response.json();

    // ตรวจสอบข้อมูลที่ได้
    if (!data.user || data.user == 0) {
      let timerInterval;
      Swal.fire({
        icon: 'warning',
        title: 'ไม่พบข้อมูล!\nโปรดตรวจสอบ!\nหรือแจ้ง จนท. เพื่อเพิ่มข้อมูลในระบบ!',
        html: 'กำลังรีเฟชรข้อมูลในอีก <b></b> มิลลิวินาที',
        timer: 10000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          location.reload();
        }
      });
    } else {
      // Toast แสดงผลว่าพบข้อมูล
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
      });

      Toast.fire({
        icon: 'success',
        title: 'พบข้อมูล'
      });

      // แสดงผลข้อมูล
      let output = '';
      data.user.forEach(function (user) {
        output += `
          <div class="col">
            <div class="card text-center border-0">
              <h2 class="card-header">${user.name}</h2>
              <ul class="list-group list-group-flush">
                <h3>อายุ ${user.age}</h3>
              </ul>
              <ul class="list-group list-group-flush">
                <a href="${user.ncd}" target="_blank" class="list-group-item list-group-item-action list-group-item-primary"><h2>${user.linktxt}</h2></a>
                <a href="${user.adl}" target="_blank" class="list-group-item list-group-item-action list-group-item-success"><h2>ประเมินความสามารถในการทำกิจวัตรประจำวัน ADL</h2></a>
                <a href="${user.qq}" target="_blank" class="list-group-item list-group-item-action list-group-item-warning"><h2>ประเมินโรคซึมเศร้า 2Q,9Q</h2></a>
                <a href="${user.ncdplus}" target="_blank" class="list-group-item list-group-item-action list-group-item-info"><h2>ประเมินภาวะสุขภาพกาย สุขภาพจิต</h2></a>
                <a href="${user.dental}" target="_blank" class="list-group-item list-group-item-action list-group-item-light"><h2>ตรวจสุขภาพช่องปาก</h2></a>
              </ul>
            </div>
          </div>
        `;
      });
      document.getElementById('output').innerHTML = output;
    }
  } catch (error) {
    // กรณี API ล่ม หรืออินเทอร์เน็ตขัดข้อง
    Swal.fire('ผิดพลาด!', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 'error');
    console.error(error);
  } finally {
    // ✅ ซ่อน loading ไม่ว่าจะเกิดอะไรขึ้น
    await loadingHide();
  }
}

// ✅ เริ่มต้นระบบ LIFF
async function main() {
  await liff.init({ liffId: "1654797991-NRELReLk" });
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login();
  }
}
main();

// ✅ ปุ่มรีเฟรช
function reload() {
  let timerInterval;
  Swal.fire({
    title: 'กำลังเคลียร์ข้อมูล!',
    html: 'ในอีก <b></b> มิลลิวินาที',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector('b');
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      location.reload();
    }
  });
}
