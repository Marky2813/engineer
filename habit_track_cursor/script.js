(() => {
  const STORAGE_KEY = "habit-tracker-board-v1";

  const defaultState = {
    activeCategoryId: "morning",
    categories: [
      {
        id: "morning",
        name: "Morning",
        habits: [
          { id: "m1", title: "Wake up at 6:30", status: "todo" },
          { id: "m2", title: "Drink a glass of water", status: "todo" },
          { id: "m3", title: "10 min stretching", status: "in-progress" },
        ],
      },
      {
        id: "work",
        name: "Work",
        habits: [
          { id: "w1", title: "Plan top 3 tasks", status: "todo" },
          { id: "w2", title: "Deep focus block", status: "in-progress" },
          { id: "w3", title: "Inbox zero", status: "done" },
        ],
      },
      {
        id: "evening",
        name: "Evening",
        habits: [
          { id: "e1", title: "30 min reading", status: "todo" },
          { id: "e2", title: "Prepare for tomorrow", status: "todo" },
          { id: "e3", title: "No screens 30 min before bed", status: "in-progress" },
        ],
      },
    ],
  };

  /** @type {typeof defaultState} */
  let state = loadState();

  const categoryListEl = document.getElementById("categoryList");
  const activeCategoryNameEl = document.getElementById("activeCategoryName");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const addHabitForm = document.getElementById("addHabitForm");
  const habitTitleInput = document.getElementById("habitTitleInput");
  const habitStatusSelect = document.getElementById("habitStatusSelect");

  const columnBodies = {
    "todo": document.querySelector('[data-dropzone="todo"]'),
    "in-progress": document.querySelector('[data-dropzone="in-progress"]'),
    "done": document.querySelector('[data-dropzone="done"]'),
  };

  const countBadges = {
    "todo": document.querySelector('[data-count-for="todo"]'),
    "in-progress": document.querySelector('[data-count-for="in-progress"]'),
    "done": document.querySelector('[data-count-for="done"]'),
  };

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") throw new Error("bad data");
      // Basic shape check
      if (!Array.isArray(parsed.categories)) throw new Error("bad categories");
      return {
        activeCategoryId: parsed.activeCategoryId || defaultState.activeCategoryId,
        categories: parsed.categories.map((cat) => ({
          id: String(cat.id),
          name: String(cat.name || "Category"),
          habits: Array.isArray(cat.habits)
            ? cat.habits.map((h) => ({
                id: String(h.id),
                title: String(h.title || "Habit"),
                status: ["todo", "in-progress", "done"].includes(h.status)
                  ? h.status
                  : "todo",
              }))
            : [],
        })),
      };
    } catch (e) {
      console.warn("Failed to load habit board state, using defaults.", e);
      return structuredClone(defaultState);
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save habit board state.", e);
    }
  }

  function getActiveCategory() {
    return (
      state.categories.find((c) => c.id === state.activeCategoryId) ||
      state.categories[0]
    );
  }

  function setActiveCategory(categoryId) {
    if (state.activeCategoryId === categoryId) return;
    state.activeCategoryId = categoryId;
    saveState();
    render();
  }

  function createId(prefix = "h") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }

  function renderCategories() {
    if (!categoryListEl) return;
    categoryListEl.innerHTML = "";

    state.categories.forEach((cat) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "category-item" + (cat.id === state.activeCategoryId ? " active" : "");
      btn.dataset.categoryId = cat.id;

      const dot = document.createElement("span");
      dot.className = "category-item-dot";

      const label = document.createElement("span");
      label.className = "category-item-label";
      label.textContent = cat.name;

      btn.appendChild(dot);
      btn.appendChild(label);
      li.appendChild(btn);
      categoryListEl.appendChild(li);
    });
  }

  function renderBoard() {
    const cat = getActiveCategory();
    if (!cat) return;

    if (activeCategoryNameEl) {
      activeCategoryNameEl.textContent = cat.name;
    }

    const byStatus = {
      "todo": [],
      "in-progress": [],
      "done": [],
    };
    cat.habits.forEach((h) => {
      if (!byStatus[h.status]) byStatus[h.status] = [];
      byStatus[h.status].push(h);
    });

    ["todo", "in-progress", "done"].forEach((status) => {
      const container = columnBodies[status];
      const badge = countBadges[status];
      if (!container) return;
      container.innerHTML = "";

      const items = byStatus[status] || [];
      items.forEach((habit) => {
        const card = document.createElement("article");
        card.className = "habit-card";
        card.draggable = true;
        card.dataset.habitId = habit.id;
        card.dataset.categoryId = cat.id;

        const titleSpan = document.createElement("span");
        titleSpan.className = "habit-title";
        titleSpan.textContent = habit.title;

        const meta = document.createElement("div");
        meta.className = "habit-meta";

        const chip = document.createElement("span");
        chip.className = "habit-chip";
        chip.textContent = cat.name;

        const delBtn = document.createElement("button");
        delBtn.className = "habit-delete-btn";
        delBtn.type = "button";
        delBtn.title = "Remove habit";
        delBtn.innerHTML = "×";

        delBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          deleteHabit(cat.id, habit.id);
        });

        meta.appendChild(chip);
        meta.appendChild(delBtn);

        card.appendChild(titleSpan);
        card.appendChild(meta);

        attachDragHandlers(card);

        container.appendChild(card);
      });

      if (badge) {
        badge.textContent = String(items.length);
      }

      if (items.length === 0) {
        container.classList.add("empty");
      } else {
        container.classList.remove("empty");
      }
    });
  }

  function render() {
    renderCategories();
    renderBoard();
  }

  function addHabit(title, status) {
    const trimmed = title.trim();
    if (!trimmed) return;
    const cat = getActiveCategory();
    if (!cat) return;

    cat.habits.push({
      id: createId(cat.id),
      title: trimmed,
      status: status,
    });

    saveState();
    renderBoard();
  }

  function deleteHabit(categoryId, habitId) {
    const cat = state.categories.find((c) => c.id === categoryId);
    if (!cat) return;
    const idx = cat.habits.findIndex((h) => h.id === habitId);
    if (idx === -1) return;
    cat.habits.splice(idx, 1);
    saveState();
    renderBoard();
  }

  function moveHabit(categoryId, habitId, newStatus) {
    const cat = state.categories.find((c) => c.id === categoryId);
    if (!cat) return;
    const habit = cat.habits.find((h) => h.id === habitId);
    if (!habit) return;
    if (!["todo", "in-progress", "done"].includes(newStatus)) return;
    habit.status = newStatus;
    saveState();
    renderBoard();
  }

  function attachDragHandlers(cardEl) {
    cardEl.addEventListener("dragstart", (e) => {
      const habitId = cardEl.dataset.habitId;
      const categoryId = cardEl.dataset.categoryId;
      if (!habitId || !categoryId) return;
      cardEl.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ habitId, categoryId })
      );
    });

    cardEl.addEventListener("dragend", () => {
      cardEl.classList.remove("dragging");
    });
  }

  function attachColumnDropHandlers() {
    const columns = document.querySelectorAll(".column");

    columns.forEach((col) => {
      const status = col.getAttribute("data-status");
      if (!status) return;

      col.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        col.classList.add("drop-target");
      });

      col.addEventListener("dragleave", (e) => {
        if (!col.contains(e.relatedTarget)) {
          col.classList.remove("drop-target");
        }
      });

      col.addEventListener("drop", (e) => {
        e.preventDefault();
        col.classList.remove("drop-target");
        let payload;
        try {
          payload = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
        } catch {
          return;
        }
        if (!payload || !payload.habitId || !payload.categoryId) return;
        moveHabit(payload.categoryId, payload.habitId, status);
      });
    });
  }

  function attachEventListeners() {
    if (categoryListEl) {
      categoryListEl.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const btn = target.closest(".category-item");
        if (!btn) return;
        const id = btn.dataset.categoryId;
        if (!id) return;
        setActiveCategory(id);
      });
    }

    if (addCategoryBtn) {
      addCategoryBtn.addEventListener("click", () => {
        const name = window.prompt("New category name:");
        if (!name) return;
        const trimmed = name.trim();
        if (!trimmed) return;
        const id = createId("cat");
        state.categories.push({
          id,
          name: trimmed,
          habits: [],
        });
        state.activeCategoryId = id;
        saveState();
        render();
      });
    }

    if (addHabitForm && habitTitleInput && habitStatusSelect) {
      addHabitForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addHabit(habitTitleInput.value, habitStatusSelect.value);
        habitTitleInput.value = "";
        habitTitleInput.focus();
      });
    }
  }

  // Initialize
  attachColumnDropHandlers();
  attachEventListeners();
  render();
})();

