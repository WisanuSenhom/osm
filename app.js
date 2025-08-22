// ฟังก์ชันสำหรับจัดการแสดง/ซ่อน loading
function setLoading(show) {
    document.getElementById("loading").style.display = show ? "block" : "none";
}

// ฟังก์ชันตรวจสอบ CID
function validateCID(cid) {
    if (cid.length !== 13) {
        Swal.fire('ผิดพลาด!', 'เลขบัตรประจำตัวประชาชน ต้องยาว 13 หลัก!', 'error');
        return false;
    }

    if (!/^\d+$/.test(cid)) {
        Swal.fire('ผิดพลาด!', 'เลขบัตรประจำตัวประชาชน ต้องเป็นตัวเลขเท่านั้น!', 'error');
        return false;
    }

    return true;
}

// ฟังก์ชันแสดงข้อความเมื่อไม่พบข้อมูล
function showNotFoundMessage() {
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
}

// ฟังก์ชันแสดงข้อความเมื่อพบข้อมูล
function showFoundMessage() {
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
}

// ฟังก์ชันแสดงผลข้อมูลผู้ใช้
function renderUserData(data) {
    let output = '';
    data.user.forEach(user => {
        output += `
        <div class="col">
            <div class="card text-center border-0">
                <h2 class="card-header">${user.name}</h2>
                <ul class="list-group list-group-flush">
                    <h3>อายุ ${user.age}</h3>
                </ul>
                <ul class="list-group list-group-flush">
                    <a href="${user.ncd}" target="_blank" class="list-group-item list-group-item-action list-group-item-primary" type="button">
                        <h2>${user.linktxt}</h2>
                    </a>          
                    <a href="${user.adl}" target="_blank" class="list-group-item list-group-item-action list-group-item-success" type="button">
                        <h2>ประเมินความสามารถในการทำกิจวัตรประจำวัน ADL</h2>
                    </a>        
                    <a href="${user.qq}" target="_blank" class="list-group-item list-group-item-action list-group-item-warning" type="button">
                        <h2>ประเมินโรคซึมเศร้า 2Q,9Q</h2>
                    </a>    
                    <a href="${user.ncdplus}" target="_blank" class="list-group-item list-group-item-action list-group-item-info" type="button">
                        <h2>ประเมินภาวะสุขภาพกาย สุขภาพจิต</h2>
                    </a>
                    <a href="${user.dental}" target="_blank" class="list-group-item list-group-item-action list-group-item-light" type="button">
                        <h2>ตรวจสุขภาพช่องปาก</h2>
                    </a>
                </ul>
            </div>    
        </div>`;
    });
    document.getElementById('output').innerHTML = output;
}

async function getProfile() {
    setLoading(true);
    
    const cid = document.getElementById("cid").value;
    
    if (!validateCID(cid)) {
        setLoading(false);
        return;
    }
    
    try {
        const profile = await liff.getProfile();
        const gas = `https://script.google.com/macros/s/AKfycbwnqRFiJYRlyDvkQN1rBQMwFr8xckr4DI7vMXZpTLavPqKsW9Ss-Ntk5pF9VP-OxwLx/exec?user=${profile.userId}&name=${profile.displayName}&cid=${cid}`;
        
        const response = await fetch(gas);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.user || data.user.length === 0) {
            showNotFoundMessage();
        } else {
            showFoundMessage();
            renderUserData(data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('ผิดพลาด!', 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    } finally {
        setLoading(false);
    }
}

async function main() {
    try {
        await liff.init({ liffId: "1654797991-NRELReLk" });
        if (liff.isLoggedIn()) {
            await getProfile();
        } else {
            liff.login();
        }
    } catch (error) {
        console.error('LIFF initialization failed', error);
    }
}

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

// เริ่มต้นการทำงาน
main();
