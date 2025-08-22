function showLoading() {
  document.getElementById("loading").style.display = "block";
}
function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function showError(title, text) {
  Swal.fire(title, text, "error");
}

function showToastSuccess(text) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer: 3000
  });
}

async function getProfile() {
  showLoading();
  const cid = document.getElementById("cid").value.trim();

  // ตรวจสอบความถูกต้องของเลขบัตร
  if (!/^\d{13}$/.test(cid)) {
    showError("ผิดพลาด!", "เลขบัตรประชาชน ต้องเป็นตัวเลข 13 หลัก!");
    hideLoading();
    return;
  }

  const profile = await liff.getProfile();
  const gas = `https://script.google.com/macros/s/AKfycbwnqRFiJYRlyDvkQN1rBQMwFr8xckr4DI7vMXZpTLavPqKsW9Ss-Ntk5pF9VP-OxwLx/exec?user=${profile.userId}&name=${profile.displayName}&cid=${cid}`;
  const res = await fetch(gas);
  const data = await res.json();

  if (!data.user || data.user.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "ไม่พบข้อมูล!",
      text: "โปรดตรวจสอบ หรือแจ้งเจ้าหน้าที่เพื่อเพิ่มข้อมูล",
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => location.reload());
    hideLoading();
    return;
  }

  showToastSuccess("พบข้อมูล");

  const output = data.user.map(user => `
    <div class="col">
      <div class="card text-center border-0">
        <h2 class="card-header">${user.name}</h2>
        <ul class="list-group list-group-flush"><h3>อายุ ${user.age}</h3></ul>
        <ul class="list-group list-group-flush">
          <a href="${user.ncd}" target="_blank" class="list-group-item list-group-item-action list-group-item-primary"><h2>${user.linktxt}</h2></a>
          <a href="${user.adl}" target="_blank" class="list-group-item list-group-item-action list-group-item-success"><h2>ADL</h2></a>
          <a href="${user.qq}" target="_blank" class="list-group-item list-group-item-action list-group-item-warning"><h2>2Q/9Q</h2></a>
          <a href="${user.ncdplus}" target="_blank" class="list-group-item list-group-item-action list-group-item-info"><h2>สุขภาพกาย/ใจ</h2></a>
          <a href="${user.dental}" target="_blank" class="list-group-item list-group-item-action list-group-item-light"><h2>ตรวจช่องปาก</h2></a>
        </ul>
      </div>
    </div>
  `).join("");

  document.getElementById("output").innerHTML = output;
  hideLoading();
}

async function main() {
  await liff.init({ liffId: "1654797991-NRELReLk" }); // <-- ใช้ LIFF ID จริงของคุณ
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login();
  }
}

function reloadPage() {
  Swal.fire({
    title: "กำลังเคลียร์ข้อมูล!",
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  }).then(() => location.reload());
}
