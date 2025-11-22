// Dummy residents data
const residents = [
  { name: "Maria Santos", id: "USR-2025-009", address: "Sample Address", contact: "+63 910 123 4567", device: "SC-KC-009", date: "SEPTEMBER 15, 2024" },
  { name: "Juan Dela Cruz", id: "USR-2025-010", address: "Gulod Street", contact: "+63 920 123 4567", device: "SC-KC-010", date: "SEPTEMBER 16, 2024" },
  { name: "Anna Reyes", id: "USR-2025-011", address: "Villaflor Subd.", contact: "+63 930 123 4567", device: "SC-KC-011", date: "SEPTEMBER 18, 2024" },
];

const tableBody = document.getElementById("residentTable");

function renderResidents(list) {
  tableBody.innerHTML = "";
  list.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><div class="profile-initial">MS</div> ${r.name}</td>
      <td>${r.id}</td>
      <td>${r.address}</td>
      <td>${r.contact}</td>
      <td>${r.device}</td>
      <td>${r.date}</td>
      <td class="actions">
        <i class="fas fa-eye"></i>
        <i class="fas fa-pen"></i>
        <i class="fas fa-trash"></i>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

renderResidents(residents);

// Search function
document.getElementById("searchInput").addEventListener("input", e => {
  const search = e.target.value.toLowerCase();
  const filtered = residents.filter(r => r.name.toLowerCase().includes(search));
  renderResidents(filtered);
});
