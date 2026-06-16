document.addEventListener('DOMContentLoaded', function() {
    const saveBtn=document.getElementById('saveBtn');
    const apiInput=document.getElementById('apikey');
    const status=document.getElementById('status');

    chrome.storage.sync.get(['apiKey'], function(result) {
        if(result.apiKey){
            apiInput.value=result.apiKey;
            status.textContent='key already saved';
            status.style.color='green';
        }
    });

    saveBtn.addEventListener('click', function() {
        const apiKey=apiInput.value.trim();

        if(!apikey)
        {
            status.textContent='Please enter a valid API key.';
            status.style.color='red';
            return;
        }

        chrome.storage.sync.set({apiKey:apiKey}, function() {
            status.textContent='API key saved successfully!';
            status.style.color='green';
            setTimeout(() => {
                status.textContent='';
            }, 3000);
        });
    });
});