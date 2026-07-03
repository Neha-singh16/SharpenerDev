const API_BASE = "http://localhost:3000";

const state = {
  tables: [],
  currentTable: null,
  schema: [],
  recordsByTable: {},
};

const els = {
  createTableBtn: document.getElementById("createTableBtn"),
  insertRecordBtn: document.getElementById("insertRecordBtn"),
  tableList: document.getElementById("tableList"),
  tableTitle: document.getElementById("tableTitle"),
  tableHead: document.getElementById("tableHead"),
  tableBody: document.getElementById("tableBody"),
  createTableModal: document.getElementById("createTableModal"),
  recordModal: document.getElementById("recordModal"),
  tableNameInput: document.getElementById("tableName"),
  columnsContainer: document.getElementById("columnsContainer"),
  addColumnBtn: document.getElementById("addColumn"),
  saveTableBtn: document.getElementById("saveTable"),
  recordInputs: document.getElementById("recordInputs"),
  saveRecordBtn: document.getElementById("saveRecord"),
};

function showToast(message, isError = false) {
  const toast = document.createElement("div");
  toast.className = `toast${isError ? " error" : ""}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function openModal(modalEl) {
  modalEl.classList.add("open");
}

function closeModal(modalEl) {
  modalEl.classList.remove("open");
}

function resetCreateTableForm() {
  els.tableNameInput.value = "";
  els.columnsContainer.innerHTML = "";
  addColumnRow();
}

function addColumnRow(name = "", type = "STRING") {
  const row = document.createElement("div");
  row.className = "column-row";

  row.innerHTML = `
    <input type="text" class="column-name" placeholder="Column Name" value="${name}">
    <select class="column-type">
      <option value="STRING" ${type === "STRING" ? "selected" : ""}>STRING</option>
      <option value="INTEGER" ${type === "INTEGER" ? "selected" : ""}>INTEGER</option>
      <option value="FLOAT" ${type === "FLOAT" ? "selected" : ""}>FLOAT</option>
      <option value="BOOLEAN" ${type === "BOOLEAN" ? "selected" : ""}>BOOLEAN</option>
    </select>
    <button type="button" class="row-danger" aria-label="Remove column">Remove</button>
  `;

  row.querySelector(".row-danger").addEventListener("click", () => {
    row.remove();
    if (!els.columnsContainer.children.length) {
      addColumnRow();
    }
  });

  els.columnsContainer.appendChild(row);
}

function readColumnPayload() {
  const rows = Array.from(els.columnsContainer.querySelectorAll(".column-row"));
  const columns = rows
    .map((row) => {
      const columnName = row.querySelector(".column-name").value.trim();
      const columnType = row.querySelector(".column-type").value;
      return { columnName, columnType };
    })
    .filter((col) => col.columnName.length > 0);

  const names = columns.map((col) => col.columnName.toLowerCase());
  const hasDuplicates = new Set(names).size !== names.length;

  if (!columns.length) {
    throw new Error("Add at least one valid column");
  }
  if (hasDuplicates) {
    throw new Error("Column names must be unique");
  }

  return columns;
}

function renderTableList() {
  els.tableList.innerHTML = "";

  if (!state.tables.length) {
    const empty = document.createElement("p");
    empty.textContent = "No tables yet. Create one to start.";
    empty.style.color = "#5d6d60";
    empty.style.fontSize = "0.95rem";
    els.tableList.appendChild(empty);
    return;
  }

  state.tables.forEach((table) => {
    const item = document.createElement("button");
    item.className = `table-item${state.currentTable === table.tableName ? " active" : ""}`;
    item.textContent = table.tableName;
    item.addEventListener("click", () => selectTable(table.tableName));
    els.tableList.appendChild(item);
  });
}

function renderGrid() {
  els.tableHead.innerHTML = "";
  els.tableBody.innerHTML = "";

  if (!state.currentTable || !state.schema.length) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    row.innerHTML = "<td>Select a table to view records</td>";
    els.tableBody.appendChild(row);
    return;
  }

  state.schema.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = `${col.columnName} (${col.columnType})`;
    els.tableHead.appendChild(th);
  });

  const rows = state.recordsByTable[state.currentTable] || [];
  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    tr.innerHTML = `<td colspan="${state.schema.length}">No records yet. Insert one.</td>`;
    els.tableBody.appendChild(tr);
    return;
  }

  rows.forEach((rowData) => {
    const tr = document.createElement("tr");
    state.schema.forEach((col) => {
      const td = document.createElement("td");
      td.textContent = rowData[col.columnName] ?? "";
      tr.appendChild(td);
    });
    els.tableBody.appendChild(tr);
  });
}

async function loadTables() {
  try {
    const res = await axios.get(`${API_BASE}/table`);
    state.tables = res.data?.data || [];
    renderTableList();

    if (!state.currentTable && state.tables.length) {
      await selectTable(state.tables[0].tableName);
    }
  } catch (err) {
    console.error(err);
    showToast("Failed to load tables", true);
  }
}

async function selectTable(tableName) {
  state.currentTable = tableName;
  els.tableTitle.textContent = tableName;
  renderTableList();

  try {
    const res = await axios.get(`${API_BASE}/table/${encodeURIComponent(tableName)}/schema`);
    state.schema = res.data?.data || [];
    await loadRecords(tableName);
    renderGrid();
  } catch (err) {
    console.error(err);
    state.schema = [];
    state.recordsByTable[tableName] = [];
    renderGrid();
    showToast("Failed to load table schema", true);
  }
}

async function loadRecords(tableName) {
  try {
    const res = await axios.get(`${API_BASE}/record/${encodeURIComponent(tableName)}`);
    state.recordsByTable[tableName] = res.data?.data || [];
  } catch (err) {
    console.error(err);
    state.recordsByTable[tableName] = [];
    showToast("Failed to load records", true);
  }
}

function openRecordModal() {
  if (!state.currentTable || !state.schema.length) {
    showToast("Select a table first", true);
    return;
  }

  els.recordInputs.innerHTML = "";
  state.schema.forEach((col) => {
    const input = document.createElement("input");
    input.setAttribute("data-column", col.columnName);
    input.setAttribute("data-type", col.columnType);
    input.placeholder = `${col.columnName} (${col.columnType})`;
    els.recordInputs.appendChild(input);
  });

  openModal(els.recordModal);
}

function parseValue(raw, type) {
  if (type === "INTEGER") {
    const value = Number.parseInt(raw, 10);
    if (Number.isNaN(value)) {
      throw new Error("Invalid INTEGER value");
    }
    return value;
  }

  if (type === "FLOAT") {
    const value = Number.parseFloat(raw);
    if (Number.isNaN(value)) {
      throw new Error("Invalid FLOAT value");
    }
    return value;
  }

  if (type === "BOOLEAN") {
    const normalized = String(raw).toLowerCase();
    if (!["true", "false", "1", "0"].includes(normalized)) {
      throw new Error("BOOLEAN must be true/false/1/0");
    }
    return normalized === "true" || normalized === "1";
  }

  return raw;
}

function readRecordPayload() {
  const inputs = Array.from(els.recordInputs.querySelectorAll("input"));
  const row = {};

  for (const input of inputs) {
    const key = input.getAttribute("data-column");
    const type = input.getAttribute("data-type");
    const rawValue = input.value.trim();

    if (!rawValue.length) {
      throw new Error(`Value required for ${key}`);
    }

    row[key] = parseValue(rawValue, type);
  }

  return row;
}

async function saveRecord() {
  const payload = readRecordPayload();
  await axios.post(`${API_BASE}/record/${encodeURIComponent(state.currentTable)}`, payload);
  await loadRecords(state.currentTable);
  closeModal(els.recordModal);
  renderGrid();
  showToast("Record saved successfully");
}

async function handleCreateTable() {
  try {
    const tableName = els.tableNameInput.value.trim();
    if (!tableName) {
      throw new Error("Table name is required");
    }

    const columns = readColumnPayload();

    await axios.post(`${API_BASE}/table`, { tableName, columns });

    showToast("Table created successfully");
    closeModal(els.createTableModal);
    resetCreateTableForm();
    await loadTables();
    await selectTable(tableName);
  } catch (err) {
    console.error(err);
    const message = err.response?.data?.message || err.message || "Failed to create table";
    showToast(message, true);
  }
}

function initEvents() {
  els.createTableBtn.addEventListener("click", () => {
    resetCreateTableForm();
    openModal(els.createTableModal);
  });

  els.insertRecordBtn.addEventListener("click", openRecordModal);
  els.addColumnBtn.addEventListener("click", () => addColumnRow());
  els.saveTableBtn.addEventListener("click", handleCreateTable);
  els.saveRecordBtn.addEventListener("click", () => {
    saveRecord().catch((err) => {
      const message = err.response?.data?.message || err.message || "Failed to save record";
      showToast(message, true);
    });
  });

  [els.createTableModal, els.recordModal].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });
}

function init() {
  initEvents();
  renderGrid();
  loadTables();
}

init();
