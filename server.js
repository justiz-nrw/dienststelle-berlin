const fs = require('fs');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Файл для хранения счетчика
const COUNTER_FILE = 'visitor_count.txt';

// Инициализация файла счетчика
if (!fs.existsSync(COUNTER_FILE)) {
  fs.writeFileSync(COUNTER_FILE, '0');
}

app.use(express.json());
app.use(express.static('public'));

// Маршрут для трекинга
app.post('/track', (req, res) => {
  try {
    const visitorId = req.body.id;
    const count = parseInt(fs.readFileSync(COUNTER_FILE, 'utf8')) || 0;
    
    // Проверяем уникальность по ID
    if (!isDuplicate(visitorId)) {
      // Увеличиваем счетчик
      fs.writeFileSync(COUNTER_FILE, (count + 1).toString());
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Tracking error:', error);
    res.sendStatus(500);
  }
});

// Проверка на дубликаты
function isDuplicate(visitorId) {
  try {
    const log = fs.readFileSync('visitors.log', 'utf8');
    return log.includes(visitorId);
  } catch {
    return false;
  }
}

// Маршрут для просмотра статистики
app.get('/stats', (req, res) => {
  try {
    const count = fs.readFileSync(COUNTER_FILE, 'utf8');
    res.send(`Уникальных посетителей: ${count}`);
  } catch {
    res.send('Уникальных посетителей: 0');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});