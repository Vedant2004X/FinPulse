// parental_control.js

document.addEventListener('DOMContentLoaded', () => {
    const reportScamBtn = document.getElementById('reportScamBtn');

    if (reportScamBtn) {
        reportScamBtn.addEventListener('click', () => {
            // In a real application, this would open a modal or redirect to a reporting page.
            // For this demo, we'll use the existing showMessage function if available,
            // or a simple alert if not.
            if (typeof goalTracker !== 'undefined' && typeof goalTracker.showMessage === 'function') {
                goalTracker.showMessage('Thank you for your report! We will review it shortly.', 'success');
            } else {
                // Fallback if showMessage is not available on the page
                // Create a simple temporary message element
                const tempMessage = document.createElement('div');
                tempMessage.textContent = 'Thank you for your report! We will review it shortly.';
                tempMessage.style.position = 'fixed';
                tempMessage.style.top = '20px';
                tempMessage.style.right = '20px';
                tempMessage.style.padding = '15px 25px';
                tempMessage.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
                tempMessage.style.color = 'white';
                tempMessage.style.borderRadius = '10px';
                tempMessage.style.boxShadow = '0 10px 25px rgba(39, 174, 96, 0.3)';
                tempMessage.style.zIndex = '10002'; // Ensure it's above other elements
                tempMessage.style.fontWeight = '600';
                document.body.appendChild(tempMessage);
                setTimeout(() => {
                    tempMessage.remove();
                }, 3000);
            }
        });
    }

    // Placeholder for PDF download links
    const downloadLinks = document.querySelectorAll('.download-link');
    downloadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            if (typeof goalTracker !== 'undefined' && typeof goalTracker.showMessage === 'function') {
                goalTracker.showMessage('PDF download is a demo feature and not yet implemented.', 'error');
            } else {
                 // Fallback if showMessage is not available on the page
                const tempMessage = document.createElement('div');
                tempMessage.textContent = 'PDF download is a demo feature and not yet implemented.';
                tempMessage.style.position = 'fixed';
                tempMessage.style.top = '20px';
                tempMessage.style.right = '20px';
                tempMessage.style.padding = '15px 25px';
                tempMessage.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                tempMessage.style.color = 'white';
                tempMessage.style.borderRadius = '10px';
                tempMessage.style.boxShadow = '0 10px 25px rgba(231, 76, 60, 0.3)';
                tempMessage.style.zIndex = '10002';
                tempMessage.style.fontWeight = '600';
                document.body.appendChild(tempMessage);
                setTimeout(() => {
                    tempMessage.remove();
                }, 3000);
            }
            console.warn(`Download link clicked for: ${link.textContent}. Actual download not implemented.`);
        });
    });
});
