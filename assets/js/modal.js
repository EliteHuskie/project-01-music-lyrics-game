  // Get the modal element
  const modal = document.getElementById('initialsModal');

  // Get the <span> element that closes the modal
  const closeBtn = modal.querySelector('.close');

  // Function to open the modal
  function openModal() {
    modal.style.display = 'block';
  }

  // Function to close the modal
  function closeModal() {
    modal.style.display = 'none';
  }

  // Event listener for the close button
  closeBtn.addEventListener('click', closeModal);

  // Event listener to close the modal when the user clicks outside of it
  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });