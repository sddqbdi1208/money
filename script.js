const scriptURL = "https://script.google.com/macros/s/AKfycby7FNiniD2OY-MA7Y9U6B_OybOkA_GUjWVO_tDoUz6zhp7Hxb8EFkhQ4tf915m4DRww9g/exec";

document.addEventListener("DOMContentLoaded", () => {
  ambilSaldo();

  document.getElementById("tambah-pengeluaran").addEventListener("click", () => {
    const container = document.createElement("div");
    container.className = "pengeluaran-item";
    container.innerHTML = `
      <input type="text" placeholder="Nama item" class="nama-pengeluaran" />
      <input type="number" placeholder="Nominal" class="nominal-pengeluaran" />
    `;
    document.getElementById("pengeluaran-list").appendChild(container);
  });

  document.getElementById("money-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;
    const pemasukan = parseInt(document.getElementById("pemasukan").value) || 0;

    const namaEls = document.querySelectorAll(".nama-pengeluaran");
    const nominalEls = document.querySelectorAll(".nominal-pengeluaran");

    const pengeluaran = [];
    for (let i = 0; i < namaEls.length; i++) {
      const nama = namaEls[i].value.trim();
      const nominal = parseInt(nominalEls[i].value);
      if (nama && !isNaN(nominal)) {
        pengeluaran.push({ nama, nominal });
      }
    }

    // Kirim data dalam bentuk URL-encoded (bukan JSON langsung) agar bebas dari CORS preflight
    const formData = new URLSearchParams();
    formData.append("data", JSON.stringify({ tanggal, pemasukan, pengeluaran }));

    fetch(scriptURL, {
      method: "POST",
      body: formData, // ✅ Tidak memicu preflight
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Data berhasil disimpan!");
          location.reload();
        } else {
          alert("Gagal menyimpan: " + data.message);
        }
      })
      .catch((err) => {
        alert("Gagal menyimpan data");
        console.error(err);
      });
  });
});

function ambilSaldo() {
  fetch(scriptURL + "?saldo=1")
    .then((res) => res.json())
    .then((data) => {
      const saldo = data.saldo || 0;
      document.getElementById("saldo").textContent = formatRupiah(saldo);
    })
    .catch((err) => {
      console.error("Gagal mengambil saldo:", err);
    });
}

function formatRupiah(angka) {
  return "Rp " + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
