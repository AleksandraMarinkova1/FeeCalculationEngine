# Fee Calculation Engine

Овој проект е решение за 48-часовниот предизвик за пресметка на тарифи/надоместоци за различни типови платни трансакции.

## Локално подигнување

Следи ги чекорите подолу за да го подигнеш проектот локално фронтенд:

1.git clone (https://github.com/AleksandraMarinkova1/FeeCalculationEngine.git)

2.cd FeeCalculationEngine

3.cd fee-calculation-front (ovde mi se naogja frontendot)

4.npm install

5.npm start

-Бекенд за да се подигне треба во нов терминал(целиот бекенд е во root => src):
1.cd FeeCalculationEngine

2.npm install

3.npm run dev

## Пример Single Transaction

"amount": 80,
"type": "POS",
"currency": "EUR",
"creditScore": 420
Output:2.0

## Пример: Batch трансакции

-овде е битно во овој формат да бидат внесени податоците

[{"amount":80,"type":"POS","creditScore":410,"currency":"EUR"}]
Result: 0.2
