async function getProfile() {
    document.getElementById("loading").style.display = "block";
   const profile = await liff.getProfile()
   const xurl = `https://script.google.com/macros/s/AKfycbyuSgm2LuXj8nxatSWA19hgrcqX3ebqGtASWlBUmfMPciES1mXUeE5xO4A_7G3xDmf_/exec?user=${profile.userId}&name=${profile.displayName}`;
   
   const records = await fetch(xurl);
   const data = await records.json();
    
    let tab = '';
    data.user.forEach(function (user) {
        
          tab += `<tr>
          
            <td>${user.pname}</td>
            <td>${user.fname}</td>
            <td>${user.lname}</td>
            <td>${user.position}</td>
            <td><a href="tel:${user.tel}">${user.tel}</a></td>
            <td>${user.ban}</td>
            <td>${user.moo}</td>
   
          
        </tr>`
    });
    console.log(tab)
    document.getElementById('tbody').innerHTML = tab;
    document.getElementById("loading").style.display = "none";
    $('#userTable').DataTable({
        "data": data.user,
        "columns": [
         
            { "data": 'pname' },
            { "data": 'fname' },
            { "data": 'lname' },
            { "data": 'position' },
            { "data": 'tel' },
            { "data": 'ban' },
            { "data": 'moo' },
       
                ],
           "processing": true,
           "responsive":true,
        "order": [[ 0, 'desc' ], [ 3, 'asc' ]],
        //    "colReorder": true,
        //    "fixedColumns": true,
        //    "fixedHeader": true,
        //    "keys": true,
           "dom": 'Bfrtip',
           "buttons": [
            'copy', 'csv', 'excel', 'print'
        ]
        
    });
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
