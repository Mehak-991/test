document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = document.getElementById('loader');
    const statusMessage = document.getElementById('statusMessage');

    // Reset status
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';

    // UI Feedback: Loading
    btnText.style.opacity = '0';
    loader.style.display = 'block';
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('https://www.greatfrontend.com/api/questions/contact-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            statusMessage.textContent = 'Message sent successfully! We will get back to you soon.';
            statusMessage.classList.add('success');
            document.getElementById('contactForm').reset();
        } else {
            const errorData = await response.json().catch(() => ({}));
            statusMessage.textContent = errorData.message || 'Something went wrong. Please try again later.';
            statusMessage.classList.add('error');
        }
    } catch (error) {
        console.error('Submission error:', error);
        statusMessage.textContent = 'Network error. Please check your connection.';
        statusMessage.classList.add('error');
    } finally {
        // UI Feedback: Restore
        btnText.style.opacity = '1';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    }
});
