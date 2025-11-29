// Data transaksi
let transactions = [];

// Tanggal
document.getElementById("current-date").innerText = new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

// Menu
function showSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(section).classList.add('active');
}

// Tambah transaksi
document.getElementById("transactionForm").addEventListener("submit", function(e){
  e.preventDefault();
  const type = document.getElementById("type").value;
  const jumlah = Number(document.getElementById("jumlah").value);
  const kategori = document.getElementById("kategori").value;
  const keterangan = document.getElementById("keterangan").value;
  const tanggal = document.getElementById("tanggal").value;

  transactions.push({ type, jumlah, kategori, keterangan, tanggal });
  updateSaldo();
  updateList();
  updateCharts();
  this.reset();
  showSection('kelola');
});

// Update saldo
function updateSaldo() {
  const total = transactions.reduce((acc,t) => t.type === "Pemasukan" ? acc + t.jumlah : acc - t.jumlah, 0);
  document.getElementById("total-saldo").innerText = "Rp " + total.toLocaleString();
}

// Update daftar transaksi
function updateList() {
  const list = document.getElementById("transactionList");
  list.innerHTML = "";
  transactions.forEach(t => {
    const div = document.createElement("div");
    div.innerHTML = `<span>${t.tanggal} - ${t.kategori} (${t.keterangan})</span> <span style="color:${t.type==='Pemasukan'?'green':'red'}">Rp ${t.jumlah.toLocaleString()}</span>`;
    list.appendChild(div);
  });
}

// Charts
function updateCharts() {
  const pemasukan = transactions.filter(t=>t.type==='Pemasukan').reduce((a,b)=>a+b.jumlah,0);
  const pengeluaran = transactions.filter(t=>t.type==='Pengeluaran').reduce((a,b)=>a+b.jumlah,0);

  // Pie Chart
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  if(window.pieChartInstance) window.pieChartInstance.destroy();
  window.pieChartInstance = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Bulan Lalu', 'Bulan Ini'],
      datasets: [{
        data: [400000, pemasukan],
        backgroundColor: ['#FF6B6B','#4D9DE0']
      }]
    }
  });

  // Line Charts
  const lineLabels = ['Minggu 1','Minggu 2','Minggu 3','Minggu 4'];
  const lineDataPemasukan = [200000,150000,300000,250000];
  const lineDataPengeluaran = [100000,50000,200000,100000];

  const ctx1 = document.getElementById('linePemasukan').getContext('2d');
  if(window.linePemasukanInstance) window.linePemasukanInstance.destroy();
  window.linePemasukanInstance = new Chart(ctx1,{ type:'line', data:{ labels:lineLabels, datasets:[{ label:'Pemasukan', data:lineDataPemasukan, borderColor:'#4D9DE0', tension:0.4, fill:false }] }, options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, display:false }, x:{ display:false } } } });

  const ctx2 = document.getElementById('linePengeluaran').getContext('2d');
  if(window.linePengeluaranInstance) window.linePengeluaranInstance.destroy();
  window.linePengeluaranInstance = new Chart(ctx2,{ type:'line', data:{ labels:lineLabels, datasets:[{ label:'Pengeluaran', data:lineDataPengeluaran, borderColor:'#FF6B6B', tension:0.4, fill:false }] }, options:{ plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, display:false }, x:{ display:false } } } });
}

updateSaldo();
updateList();
updateCharts();
showSection('form');
