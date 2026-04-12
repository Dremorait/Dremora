document.addEventListener('DOMContentLoaded', () => {
    // Shared functionality to handle form submissions logically
    
    function attachFormHandler(formId, endpointPath) {
        const form = document.getElementById(formId);
        if(!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const dataObj = Object.fromEntries(formData.entries());

            // Detect if running locally or in production
            const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                ? 'http://localhost:5000' 
                : 'https://dremora.onrender.com'; // Your live Render URL

            try {
                const response = await fetch(`${API_BASE_URL}${endpointPath}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataObj)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Success: ' + result.message);
                    form.reset();
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (err) {
                alert('Connection Error: Could not reach the backend server.');
                console.error(err);
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    attachFormHandler('contactForm', '/api/contact');
    attachFormHandler('internshipForm', '/api/internship/apply');
});
