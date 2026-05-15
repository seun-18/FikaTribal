// Contact form handling — sends to Formspree (AJAX) and shows custom status messages
(function contactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // status element (created if missing)
  let statusWrap = form.querySelector('.contact-status');
  if (!statusWrap) {
    statusWrap = document.createElement('div');
    statusWrap.className = 'contact-status';
    statusWrap.style.marginTop = '12px';
    form.appendChild(statusWrap);
  }

  const submitButton = form.querySelector('button[type="submit"]');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showStatus(message, color) {
    statusWrap.style.color = color || '#d8b86a';
    statusWrap.innerHTML = message;
  }

  function showProcessingModal(isVisible) {
    let modal = document.getElementById('contact-processing-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'contact-processing-modal';
      modal.className = 'processing-modal';
      modal.innerHTML = `
        <div class="processing-content">
          <div class="spinner"></div>
          <h2>Sending Message...</h2>
          <p>Please wait while we send your message.</p>
        </div>
      `;
      document.body.appendChild(modal);
    }
    
    if (isVisible) {
      modal.classList.add('active');
    } else {
      modal.classList.remove('active');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusWrap.textContent = '';

    const name = (form.querySelector('[name="name"]') || {}).value?.trim() || '';
    const replyto = (form.querySelector('[name="_replyto"]') || {}).value?.trim() || '';
    const message = (form.querySelector('[name="message"]') || {}).value?.trim() || '';
    const gotcha = (form.querySelector('[name="_gotcha"]') || {}).value?.trim() || '';

    const errors = [];
    if (!name) errors.push('Please enter your name.');
    if (!replyto || !validateEmail(replyto)) errors.push('Please enter a valid email address.');
    if (!message || message.length < 6) errors.push('Please enter a message (6+ characters).');

    if (errors.length) {
      showStatus(errors.map(x => `<div>• ${x}</div>`).join(''), '#ffd966');
      return;
    }

    // If honeypot has a value, treat as spam and do nothing
    if (gotcha) {
      // silent success to bots
      showProcessingModal(false);
      showStatus('Message received.', '#d8b86a');
      form.reset();
      return;
    }

    // Use fetch to post the FormData to the form action
    const endpoint = form.getAttribute('action');
    if (!endpoint) {
      showStatus('Form endpoint is not configured. Please set the Formspree action URL.', '#ffb3b3');
      return;
    }

    const formData = new FormData(form);

    // Show processing modal and disable submit
    showProcessingModal(true);
    if (submitButton) {
      submitButton.disabled = true;
    }

    fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(async (response) => {
      if (response.ok) {
        showProcessingModal(false);
        showStatus('Thank you — your message was sent successfully. We will reply soon.', '#d8b86a');
        form.reset();
      } else {
        showProcessingModal(false);
        // try to parse JSON errors from Formspree
        let data;
        try { data = await response.json(); } catch (err) { data = null; }
        if (data && data.error) {
          showStatus(`Error: ${data.error}`, '#ffb3b3');
        } else {
          showStatus('Submission failed. Please try again or contact us directly.', '#ffb3b3');
        }
      }
    }).catch((err) => {
      console.error('Form submit error', err);
      showProcessingModal(false);
      showStatus('Network error while sending the message. Please try again.', '#ffb3b3');
    }).finally(() => {
      if (submitButton) {
        submitButton.disabled = false;
      }
    });
  });
})();
