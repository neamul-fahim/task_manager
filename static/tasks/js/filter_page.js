const filters = {
    creationDate: "",
    dueDate: "",
    priority: "",
    status: "",
  };

  // Load saved filters from localStorage
  const savedFilters =
    JSON.parse(sessionStorage.getItem("taskFilters")) || {};
  Object.assign(filters, savedFilters);

  // Populate form with saved filters
  document.getElementById("creationDateFilter").value =
    filters.creationDate;
  document.getElementById("dueDateFilter").value = filters.dueDate;
  document.getElementById("priorityFilter").value = filters.priority;
  document.getElementById("statusFilter").value = filters.status;

  function applyFilters() {
    // Update filter values
    filters.creationDate =
      document.getElementById("creationDateFilter").value;
    filters.dueDate = document.getElementById("dueDateFilter").value;
    filters.priority = document.getElementById("priorityFilter").value;
    filters.status = document.getElementById("statusFilter").value;

    // Save filters to localStorage
    sessionStorage.setItem("taskFilters", JSON.stringify(filters));

    // Redirect to the page where you want to display filtered tasks
    window.location.href = `/home_page/`;
  }
