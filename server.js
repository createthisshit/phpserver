const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Эндпоинт для получения уведомлений от YooMoney
app.post('/yoomoney/notification', (req, res) => {
    const { notification_type, operation_id, amount, currency, datetime, sender, codepro, label, sha1_hash } = req.body;

    // Введите ваш секретный ключ
    const secret = '7RxOh+Qv+jBB+UrytVPdsAKV';

    // Проверка подписи с помощью SHA-1
    const hashString = [notification_type, operation_id, amount, currency, datetime, sender, codepro, secret, label].join('&');
    const hash = crypto.createHash('sha1').update(hashString).digest('hex');

    if (hash === sha1_hash) {
        console.log('Подтверждение успешное');
        // Обработайте платеж и обновите баланс пользователя с id label
        res.sendStatus(200);
    } else {
        console.log('Ошибка подтверждения');
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
