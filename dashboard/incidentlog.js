/* ------------------------------
   Sample data & basic utilities
   ------------------------------ */
const sampleIncidents = [
  { id: "EMG-2024-1047", type: "Fire", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Maria Santos", status: "Responding", datetime: "2025-10-10 02:34 PM" },
  { id: "EMG-2024-1048", type: "Flood", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Juan Dela Cruz", status: "Resolved", datetime: "2025-10-10 01:20 PM" },
  { id: "EMG-2024-1049", type: "Crime", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Pedro Lopez", status: "Pending", datetime: "2025-10-09 10:05 AM" },
  { id: "EMG-2024-1050", type: "Fire", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Ana Reyes", status: "Responding", datetime: "2025-10-08 08:55 AM" },
  { id: "EMG-2024-1051", type: "Flood", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Maria Santos", status: "Resolved", datetime: "2025-09-30 05:20 PM" },
  { id: "EMG-2024-1052", type: "Crime", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Luis Miguel", status: "Pending", datetime: "2025-09-24 11:12 AM" },
  { id: "EMG-2024-1053", type: "Fire", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Maria Santos", status: "Resolved", datetime: "2025-09-20 03:00 PM" },
  { id: "EMG-2024-1054", type: "Flood", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Pedro Lopez", status: "Responding", datetime: "2025-09-15 09:45 AM" },
  { id: "EMG-2024-1055", type: "Crime", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Ana Reyes", status: "Pending", datetime: "2025-09-10 12:05 PM" },
  { id: "EMG-2024-1056", type: "Other", location: "63 San Nicasio St., Villaflor, Gulod, QC", reporter: "Guest", status: "Resolved", datetime: "2025-09-01 07:22 AM" },
  // add more to test pagination
];

let incidents = [];
const pageSize = 7;
let currentPage = 1;

/* ------------------------------
   DOM elements
   ------------------------------ */
const incidentTable = document.getElementById("incidentTable");
const totalCountEl = document.getElementById("totalCount");
const respondingCountEl = document.getElementById("respondingCount");
const resolvedCountEl = document.getElementById("resolvedCount");
const pendingCountEl = document.getElementById("pendingCount");
const tableTotalEl = document.getElementById("tableTotal");
const showingRangeEl = document.getElementById("showingRange");
const paginationEl = document.getElementById("pagination");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");
const clearFiltersBtn = document.getElementById("clearFilters");
const refreshBtn = document.getElementById("refreshBtn");

/* ------------------------------
   Init & render
   ------------------------------ */
function loadSample(){
  incidents = JSON.parse(JSON.stringify(sampleIncidents)); // clone
  // ensure many items for pagination
  while(incidents.length < 27){
    const idx = (incidents.length % sampleIncidents.length);
    const copy = {...sampleIncidents[idx]};
    copy.id = copy.id.replace(/\d+$/, (1000 + incidents.length));
    incidents.push(copy);
  }
}

function computeStats(list){
  totalCountEl.textContent = list.length;
  respondingCountEl.textContent = list.filter(i=>i.status==="Responding").length;
  resolvedCountEl.textContent = list.filter(i=>i.status==="Resolved").length;
  pendingCountEl.textContent = list.filter(i=>i.status==="Pending").length;
}

/* format badge and status */
function typeBadge(type){
  if(type==="Fire") return `<span class="badge-type badge-fire">${type}</span>`;
  if(type==="Flood") return `<span class="badge-type badge-flood">${type}</span>`;
  if(type==="Crime") return `<span class="badge-type badge-crime">${type}</span>`;
  return `<span class="badge-type badge-other">${type}</span>`;
}
function statusChip(s){
  if(s==="Responding") return `<span class="status-chip status-responding">${s}</span>`;
  if(s==="Resolved") return `<span class="status-chip status-resolved">${s}</span>`;
  return `<span class="status-chip status-pending">${s}</span>`;
}

/* filter logic */
function getFiltered(){
  const q = searchInput.value.trim().toLowerCase();
  const t = typeFilter.value;
  const s = statusFilter.value;
  const d = dateFilter.value; // yyyy-mm-dd if set

  let filtered = incidents.filter(it=>{
    if(q){
      const hay = `${it.id} ${it.type} ${it.location} ${it.reporter} ${it.status} ${it.datetime}`.toLowerCase();
      if(!hay.includes(q)) return false;
    }
    if(t && it.type!==t) return false;
    if(s && it.status!==s) return false;
    if(d){
      // simple compare date part
      const dt = it.datetime.split(" ")[0].replace(/-/g,'');
      const dval = d.replace(/-/g,'');
      if(!it.datetime.startsWith(d)) {
        // if stored format differs, try parse compare year-month-day
        const parsed = it.datetime.split(' ')[0]; // sample 2025-10-10
        if(parsed !== d) return false;
      }
    }
    return true;
  });

  return filtered;
}

/* render table and pagination */
function renderTable(){
  const filtered = getFiltered();
  computeStats(filtered);
  tableTotalEl.textContent = filtered.length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if(currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage-1)*pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // update showing range
  showingRangeEl.textContent = `${Math.min(start+1, filtered.length)} - ${Math.min(start+pageItems.length, filtered.length)} of ${filtered.length}`;

  // render rows
  incidentTable.innerHTML = pageItems.map((it, idx)=>{
    const globalIndex = start + idx;
    return `
      <tr data-index="${globalIndex}">
        <td><a href="#" class="incident-id" onclick="viewIncident(${globalIndex});return false;">${it.id}</a></td>
        <td>${typeBadge(it.type)}</td>
        <td>${it.location}</td>
        <td>${it.reporter}</td>
        <td>${statusChip(it.status)}</td>
        <td>${it.datetime}</td>
        <td class="actions">
          <button class="circle-btn" onclick="viewIncident(${globalIndex})" title="View"><i class="fas fa-eye"></i></button>
          <button class="circle-btn" onclick="editIncident(${globalIndex})" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="circle-btn" onclick="deleteIncident(${globalIndex})" title="Delete"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join("");

  // pagination
  renderPagination(totalPages);
}

/* pagination rendering */
function renderPagination(totalPages){
  paginationEl.innerHTML = "";
  // prev
  const prev = document.createElement("button");
  prev.textContent = "‹";
  prev.disabled = currentPage===1;
  prev.onclick = ()=>{ currentPage = Math.max(1, currentPage-1); renderTable(); };
  paginationEl.appendChild(prev);

  // pages (show first, last, current +-2)
  const pages = [];
  for(let i=1;i<=totalPages;i++){
    if(i===1 || i===totalPages || (i>=currentPage-2 && i<=currentPage+2)) pages.push(i);
    else if(pages[pages.length-1] !== '...') pages.push('...');
  }
  pages.forEach(p=>{
    if(p==='...'){
      const span = document.createElement("span");
      span.textContent = '...';
      span.style.padding = '8px 10px';
      paginationEl.appendChild(span);
    } else {
      const btn = document.createElement("button");
      btn.textContent = p;
      if(p===currentPage) btn.classList.add('active');
      btn.onclick = ()=>{ currentPage = p; renderTable(); };
      paginationEl.appendChild(btn);
    }
  });

  // next
  const next = document.createElement("button");
  next.textContent = "›";
  next.disabled = currentPage===totalPages;
  next.onclick = ()=>{ currentPage = Math.min(totalPages, currentPage+1); renderTable(); };
  paginationEl.appendChild(next);
}

/* ------------------------------
   CRUD actions & modal
   ------------------------------ */
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const incidentForm = document.getElementById("incidentForm");

function openAddModal(){
  modalTitle.textContent = "Add New Incident";
  document.getElementById("editIndex").value = "";
  incidentForm.reset();
  modalOverlay.style.display = "flex";
}
window.openAddModal = openAddModal;

document.getElementById("modalCancel").addEventListener("click", ()=> modalOverlay.style.display="none");
window.closeModal = ()=> modalOverlay.style.display="none";

function editIncident(globalIndex){
  const item = incidents[globalIndex];
  if(!item) return;
  modalTitle.textContent = "Edit Incident";
  document.getElementById("editIndex").value = globalIndex;
  document.getElementById("incType").value = item.type;
  document.getElementById("incStatus").value = item.status;
  document.getElementById("incLocation").value = item.location;
  document.getElementById("incReporter").value = item.reporter;

  // attempt parse date/time
  const dtParts = item.datetime.split(' ');
  const datePart = dtParts[0]; // assumption 2025-10-10
  if(datePart && datePart.match(/^\d{4}-\d{2}-\d{2}$/)) document.getElementById("incDate").value = datePart;
  else document.getElementById("incDate").value = '';
  document.getElementById("incTime").value = dtParts.slice(1).join(' ') || '';
  modalOverlay.style.display = "flex";
}

function viewIncident(globalIndex){
  const item = incidents[globalIndex];
  if(!item) return alert("Incident data not found.");
  // quick view: reuse modal as readonly
  modalTitle.textContent = "View Incident";
  document.getElementById("editIndex").value = globalIndex;
  document.getElementById("incType").value = item.type;
  document.getElementById("incStatus").value = item.status;
  document.getElementById("incLocation").value = item.location;
  document.getElementById("incReporter").value = item.reporter;
  document.getElementById("incDate").value = '';
  document.getElementById("incTime").value = item.datetime.split(' ').slice(1).join(' ');
  // disable fields
  Array.from(document.querySelectorAll('#incidentForm input, #incidentForm select')).forEach(el=>el.disabled=true);
  document.getElementById("modalSave").style.display = 'none';
  modalOverlay.style.display = "flex";
}

function enableModalInputs(){
  Array.from(document.querySelectorAll('#incidentForm input, #incidentForm select')).forEach(el=>el.disabled=false);
  document.getElementById("modalSave").style.display = '';
}

incidentForm.addEventListener("submit", function(e){
  e.preventDefault();
  const idx = document.getElementById("editIndex").value;
  const newItem = {
    id: idx === "" ? generateId() : incidents[idx].id,
    type: document.getElementById("incType").value,
    status: document.getElementById("incStatus").value,
    location: document.getElementById("incLocation").value,
    reporter: document.getElementById("incReporter").value,
    datetime: buildDatetime(document.getElementById("incDate").value, document.getElementById("incTime").value)
  };

  if(idx === ""){
    // add
    incidents.unshift(newItem);
    currentPage = 1;
  } else {
    incidents[idx] = newItem;
  }
  modalOverlay.style.display="none";
  enableModalInputs();
  renderTable();
});

function deleteIncident(globalIndex){
  if(!confirm("Delete this incident?")) return;
  incidents.splice(globalIndex,1);
  renderTable();
}

/* ------------------------------
   Helpers
   ------------------------------ */
function generateId(){
  const base = "EMG-2024-";
  return base + (1000 + Math.floor(Math.random()*9000));
}
function buildDatetime(dateStr, timeStr){
  if(dateStr){
    // date input returns yyyy-mm-dd
    const t = timeStr || "12:00 PM";
    return `${dateStr} ${t}`;
  }
  return new Date().toISOString().slice(0,10) + " " + (timeStr||"12:00 PM");
}

/* ------------------------------
   Filters & events
   ------------------------------ */
searchInput.addEventListener("input", ()=>{
  currentPage = 1; renderTable();
});
typeFilter.addEventListener("change", ()=>{ currentPage = 1; renderTable(); });
statusFilter.addEventListener("change", ()=>{ currentPage = 1; renderTable(); });
dateFilter.addEventListener("change", ()=>{ currentPage = 1; renderTable(); });
clearFiltersBtn.addEventListener("click", ()=>{
  searchInput.value=''; typeFilter.value=''; statusFilter.value=''; dateFilter.value=''; currentPage=1; renderTable();
});
refreshBtn.addEventListener("click", ()=>{
  loadSample(); currentPage=1; renderTable();
});

/* initialize */
loadSample();
renderTable();

/* When modal opens for view mode, allow close to re-enable inputs on close */
modalOverlay.addEventListener("click", function(e){
  if(e.target === modalOverlay){
    modalOverlay.style.display='none';
    enableModalInputs();
  }
});
