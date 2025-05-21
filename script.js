document.getElementById('warrantyForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = new FormData(this);

  const response = await fetch('/submit', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    alert('Report submitted successfully!');
    this.reset();
  } else {
    alert('Error submitting form.');
  }
});
