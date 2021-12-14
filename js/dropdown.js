const BiletumDropdown = {
  init: (selector = "[data-dropdown]") => {
    const dropdowns = document.querySelectorAll(selector);

    if (!dropdowns) return;

    const hideDropdowns = () => {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("dropmic--show");
      });
      document.removeEventListener("click", hideDropdowns);
    };

    const showDropdown = (dropdown) => {
      dropdown.classList.add("dropmic--show");
    };

    const clickDropdown = (dropdown) => {
      const isThisOpened = dropdown.classList.contains("dropmic--show");
      hideDropdowns();

      if (isThisOpened) return;

      showDropdown(dropdown);
      setTimeout(() => {
        document.addEventListener("click", hideDropdowns);
      }, 1);
    };

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", () => {
        clickDropdown(dropdown);
      });
    });
  },
};
