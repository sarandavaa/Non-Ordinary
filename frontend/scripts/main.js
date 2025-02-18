document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const submitButton = document.getElementById('submitButton');
    const responseContainer = document.getElementById('responseContainer');

    submitButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (!message) return;

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Processing...';
            
            const response = await fetch('http://localhost:9090/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            
            if (response.ok) {
                responseContainer.innerHTML = `<p>${data.response}</p>`;
            } else {
                throw new Error(data.error || 'An error occurred');
            }
        } catch (error) {
            responseContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Explore Deeper';
        }
    });
});
