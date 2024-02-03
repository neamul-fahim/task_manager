async function fetchUser() {
    try {
      const response = await fetch(`/user`, {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user name");
      }

      const data = await response.json();

      return data.user;
    } catch (error) {
      console.error("Error fetching user name:", error);
      return Null;
    }
  }

  async function updateUser() {
    const userNameDrawerElement =
      document.getElementById("user-name-drawer");
    const userNameElement = document.getElementById("user-username");
    const userEmailElement = document.getElementById("user-email");
    const userProfile = await fetchUser();

    if (userProfile) {
      userNameDrawerElement.textContent = userProfile.username;
      userNameElement.textContent = userProfile.username;
      userEmailElement.textContent = userProfile.email;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const drawerIcon = document.getElementById("drawer-icon");
    const sideDrawer = document.getElementById("side-drawer");
    const mainContent = document.getElementById("main-content");

    drawerIcon.addEventListener("click", toggleDrawer);

    async function toggleDrawer() {
      if (sideDrawer.style.left === "0px") {
        sideDrawer.style.left = "-250px";
        if (window.innerWidth <= 600) {
          sideDrawer.style.left = "-100%";
        }
        mainContent.classList.remove("drawer-open");
      } else {
        sideDrawer.style.left = "0";
        mainContent.classList.add("drawer-open");

        // Update the user name when the drawer is opened
        await updateUser();
      }
      drawerIcon.classList.toggle("drawer-open");
    }

    // Update the user name when the page loads
    updateUser();
  });