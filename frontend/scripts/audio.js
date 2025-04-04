let mediaRecorder;
let audioChunks = [];
let isRecording = false;

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleRecording');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleRecording);
    }
});

async function toggleRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                await sendAudioToServer(audioBlob);
            };

            mediaRecorder.start();
            isRecording = true;
            toggleButton.textContent = 'Stop Recording';
            toggleButton.classList.add('recording');
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please ensure microphone permissions are granted');
        }
    } else {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        isRecording = false;
        toggleButton.textContent = 'Start Recording';
        toggleButton.classList.remove('recording');
    }
}

async function sendAudioToServer(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
        const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (data.text) {
            document.getElementById('userInput').value = data.text;
        } else {
            throw new Error(data.error || 'Transcription failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to transcribe audio');
    }
} 