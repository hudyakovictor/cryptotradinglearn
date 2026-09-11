# ИТЕРАЦИЯ 2 — Каталог нормализованных терминов (TERM-ID)

Дата: 2026-09-11. Правила: термины не объединяются автоматически; каждому присваивается каноническое имя; связи (duplicate/synonym/broader/narrower/related/uncertain) фиксируются. Определения — из источников; интерпретации помечены [инт.].

## Ядро рыночной механики

| TERM-ID | Каноническое | Исходные формулировки / синонимы | SRC | Ур. | Определение (по источнику) | Практика/данные/инструменты | Предпосылки | Связи и неясности |
|---|---|---|---|---|---|---|---|---|
| TERM-001 | Order book | стакан (RU), глубина рынка | 0044 | beg | Дисплей лимитных заявок покупателей/продавцов; в RU-практике «анализ стакана» = чтение потока заявок | CScalp: занятие «Анализ стакана» | интерфейс биржи | related: order flow (TERM-030); synonym «стакан» (RU) |
| TERM-002 | Order types | market/limit/stop/conditional | 0001, 0011, 0016 | beg | Типы заявок и их исполнение | гайды Binance/Bitfinex/BitMEX | счет на бирже | narrower: limit order (TERM-003) |
| TERM-003 | Limit order | «инструкция купить/продать по конкретной цене» | 0017 | beg | Buy исполняется по лимиту или ниже, sell — по лимиту или выше | CMC glossary | — | — |
| TERM-004 | Bid-ask spread | спред | 0001 | beg | Разница лучшей цены покупки и продажи | статья Binance Academy | — | related: slippage (TERM-005) |
| TERM-005 | Slippage | проскальзывание | 0001, 0109 | beg | Разница между ожидаемой и фактической ценой исполнения | Binance Academy; критика TradingView paper (отсутствует в симуляторе!) | — | ВАЖНО: демо-среды искажают (SRC-0109) |
| TERM-006 | Perpetual futures | перпетуалы, perpetuals, perps | 0016, 0025 | int | Фьючерс без даты экспирации; funding привязывает к споту | BitMEX «What are Perpetual Futures»; Duke (dYdX перпы) | фьючерсы | related: funding rate (TERM-010) |
| TERM-007 | Futures contract types | quanto / linear / inverse | 0016 | int | Типы номинации контрактов; inverse — P&L в BTC | BitMEX «Types of Futures Contracts» | фьючерсы | unique для BitMEX-гайдов |
| TERM-008 | Margin (cross/isolated) | кросс/изолированная маржа | 0016 | int | Изолированная = маржа одной позиции; кросс = весь баланс | BitMEX guide | механика позиций | related: liquidation (TERM-012), leverage (TERM-009) |
| TERM-009 | Leverage | плечо | 0016, 0108 | beg–int | Заёмный капитал для увеличения экспозиции | Binance demo (3000 USDT); BitMEX | маржа | числовых лимитов в источниках нет (пробел) |
| TERM-010 | Funding rate | ставка финансирования | 0015, 0051, 0016 | int | Периодические платежи между лонгами/шортами перпов | Deribit (уроки), CryptoQuant (метрика) | перпетуалы | related but different: borrowing cost (не то же!) |
| TERM-011 | Open interest | OI, открытый интерес | 0051 | int | Число открытых позиций (контрактов) | CryptoQuant | деривативы | — |
| TERM-012 | Liquidation | ликвидация позиции | 0016, 0107 | int | Принудительное закрытие при недостатке маржи | Bybit demo; BitMEX margin guides | маржа | related: stop-loss (TERM-024) — РАЗНЫЕ механизмы (зафиксировано) |
| TERM-013 | Mark price / index price | маркировочная/индексная цена | 0015 | int | Цена маркировки для расчёта P&L и ликвидации vs индексная рыночная | Deribit inverse-урок | деривативы | NEW относительно словаря итер. 1 |
| TERM-014 | Fees | комиссии (maker/taker) | 0015, 0011, 0024 | beg | Комиссии сделок; вычитаются из P&L | Deribit («subtract fees»), Bitfinex «What fees does Bitfinex charge» | — | числовых расписаний в изученном — мало |

## Опционы

| TERM-ID | Каноническое | Синонимы | SRC | Ур. | Определение | Связи |
|---|---|---|---|---|---|---|
| TERM-015 | Call option | опцион колл | 0015, 0024 | int | Право купить по страйку | — |
| TERM-016 | Put option | опцион пут | 0015 | int | Право продать по страйку | — |
| TERM-017 | Strike price | страйк | 0015, 0024 | int | Цена исполнения | — |
| TERM-018 | Premium | премия опциона | 0015, 0024 | int | Цена опциона; убыток покупателя ограничен премией | — |
| TERM-019 | ITM/OTM | in/at/out of the money | 0015, 0024 | int | Соотношение страйка и спота | — |
| TERM-020 | Option Greeks | Delta, Theta, Vega, Gamma | 0015 | adv | Чувствительности цены опциона | секции 8–11 Deribit |
| TERM-021 | European style option | — | 0024 | int | Исполнение только в экспирацию (опционы CME) | vs American style — не встречен (пробел) |
| TERM-022 | Cash settlement / BRR | расчёт наличными по BRR | 0024 | int | Урегулирование в USD по Bitcoin Reference Rate | unique CME |
| TERM-023 | Put-call ratio | — | 0016 | int | Индикатор настроения по соотношению пут/колл | BitMEX guide |

## Анализ и методы

| TERM-ID | Каноническое | Синонимы | SRC | Ур. | Определение/контекст | Связи/неясности |
|---|---|---|---|---|---|---|
| TERM-024 | Stop-loss | стоп-лосс | 0041, 0091 | beg | Приказ закрытия при достижении цены; у Дугласа — обязательный инструмент | related: liquidation — РАЗНЫЕ механизмы |
| TERM-025 | Position sizing | размер позиции | 0041, 0091 | int | Расчёт объёма позиции от риска | Douglas: 1–2% риска на сделку (числовой критерий!) | related: money management (broader) |
| TERM-026 | Risk-reward ratio | R:R, риск-прибыль | 0041 | int | Отношение возможного убытка к прибыли | Chart Guys Module 7 | — |
| TERM-027 | Candlestick patterns | свечные паттерны | 0088, 0016, 0038 | beg | Формации японских свечей | Nison (канон), BitMEX «Ultimate Guide to Chart Pattern Analysis» | — |
| TERM-028 | Chart patterns | графические паттерны (H&S, triangles, flags) | 0016, 0038, 0089 | beg–int | Формации графика; Bulkowski даёт статистику (на акциях) | — |
| TERM-029 | Support/Resistance | поддержка/сопротивление | 0038–0040 | beg | Уровни разворота спроса/предложения | — |
| TERM-030 | Order flow | поток ордеров, лента | 0044, 0047 | int | Анализ потока сделок/заявок; RU: «скейлинг стакана» | CScalp; ICT | related: order book (TERM-001); related: market microstructure — РАЗНЫЕ области (зафикс.) |
| TERM-031 | Market structure | структура рынка | 0047, 0048 | int | Последовательность HH/HL/LH/LL | ICT-контекст | — |
| TERM-032 | Order blocks | ОБ, order blocks | 0047, 0048, 0049 | int | Зоны институциональных заявок (ICT) | NEW; доказательная база отсутствует (пробел) |
| TERM-033 | Liquidity pool (ICT) | пулы ликвидности, equal highs/lows | 0047, 0049 | int | Зоны скопления стопов, «магниты цены» (ICT) | NEW; не путать с AMM liquidity pools (TERM-042) — КОНФЛИКТ ТЕРМИНОВ зафиксирован |
| TERM-034 | SMT divergence | — | 0049 | int | Расхождение связанных инструментов как признак манипуляции (ICT) | NEW |
| TERM-035 | Wyckoff method | — | — (словарь) | — | В изученных источниках итер. 1–2 НЕ ВСТРЕЧЕН | пробел |
| TERM-036 | Elliott Wave | волны Эллиотта | 0090, 0067 | int–adv | Волновой циклический анализ | Frost&Prechter; преподаётся в RU-наставничестве (Голоднюк) | доказательная база не найдена |
| TERM-037 | Fibonacci retracement | фибо-уровни | 0041, 0040 | int | Уровни откатов по коэффициентам | Chart Guys Module 9 | — |
| TERM-038 | Ichimoku Cloud | Ишимоку | 0041 | int | Комплексный индикатор | Chart Guys Module 9 | — |
| TERM-039 | Death cross / golden cross | смерть/золотой крест | 0017 | beg | Пересечение 50/200 MA | CMC glossary | — |
| TERM-040 | FUD | fear, uncertainty, doubt | 0003 | beg | Дезинформация (сленг) | Kraken Crypto 101 | — |

## On-chain и данные

| TERM-ID | Каноническое | Синонимы | SRC | Ур. | Определение | Связи |
|---|---|---|---|---|---|---|
| TERM-041 | On-chain analysis | анализ блокчейн-данных | 0001, 0050, 0051, 0052 | int | Анализ данных блокчейна для оценки рынка | Binance track; CryptoQuant | broader: fundamental analysis |
| TERM-042 | MVRV | market value / realized value | 0050, 0051 | adv | Мультипликатор недо/переоценки | CryptoQuant/Glassnode | — |
| TERM-043 | SOPR | spent output profit ratio | 0050, 0051 | adv | Доля прибыли в потраченных выходах | — | — |
| TERM-044 | NUPL | net unrealized profit/loss | 0050 | adv | Чистая нереализованная прибыль | — | — |
| TERM-045 | NVT | network value to transactions | 0051 | adv | «P/E блокчейна» | — | — |
| TERM-046 | Puell Multiple | — | 0051 | adv | Доход майнеров к рыночной капе | — | — |
| TERM-047 | UTXO | unspent transaction output | 0050 | adv | Неизрасходованные выходы — основа supply-метрик | — | — |
| TERM-048 | Exchange flows / reserves | притоки/резервы бирж | 0051, 0052 | int | Движение монет на/с бирж; резерв = потенциальное предложение | CCN | — |
| TERM-049 | Point-in-time data | PIT-данные | 0050 | adv | Неизменяемые исторические данные для бэктестинга без look-ahead | Glassnode docs | КРИТИЧНО для валидации on-chain стратегий |
| TERM-050 | Impermanent loss | непостоянная потеря | 0025 | int | Потеря LP из-за расхождения цен | Duke DeFi | — |
| TERM-051 | AMM | automated market maker | 0025 | int | Модель ценообразования пулов (Uniswap) | — | — |
| TERM-052 | Flash loans | флэш-кредиты | 0025 | int | Беззалоговые кредиты в одной транзакции | — | — |

## Риск и методология проверки

| TERM-ID | Каноническое | Синонимы | SRC | Ур. | Определение | Связи |
|---|---|---|---|---|---|---|
| TERM-053 | Risk management | риск-менеджмент | 0001 (трек), 0041, 0044 | beg–int | Система ограничения потерь | Binance track; Chart Guys M7; CScalp занятие №0 | standalone-глубина отсутствует (пробел) |
| TERM-054 | Expectancy | матожидание | — (не встречен!) | — | В источниках НЕ ВСТРЕЧЕН | пробел (критический для итерации 5) |
| TERM-055 | Win rate | винрейт | 0085 | beg | Доля прибыльных сделок | related: expectancy — РАЗНЫЕ метрики (правило итер. 1) | |
| TERM-056 | Risk of ruin | риск разорения | 0085 (косвенно) | adv | Вероятность потери всего капитала | — | — |
| TERM-057 | Backtesting | бэктестинг | 0056, 0057, 0058, 0055 | int | Проверка стратегии на истории | freqtrade; walbi; QC | related: paper trading — РАЗНЫЕ этапы |
| TERM-058 | Walk-forward | — | 0057, 0056 | adv | Окна оптимизация→тест→сдвиг | cripton.ai | — |
| TERM-059 | Out-of-sample | OOS | 0057 | adv | Проверка на данных вне оптимизации | — | — |
| TERM-060 | Survivorship bias | смещение выжившего | 0056, 0094 | adv | Искажение из-за исчезнувших активов | walbi (пример с альткоинами); CDD (гэпы) | — |
| TERM-061 | Look-ahead bias | заглядывание в будущее | 0050 (PIT) | adv | Использование будущих данных в прошлом | Glassnode PIT | — |
| TERM-062 | Zero-Gap OHLCV | бесшовные данные | 0094 | adv | Данные без пропусков с флагами происхождения | CDD Plus+ | — |
| TERM-063 | Demo account vs testnet | демо vs тестнет | 0107 | beg | Демо — в основной платформе, цены мейнета; тестнет — отдельная сеть, исполнение влияет на свой стакан | Bybit FAQ | различение зафиксировано официально |
| TERM-064 | Paper trading | бумажная торговля | 0011, 0109 | beg | Симуляция без реальных денег | Bitfinex; TradingView | ограничения TradingView (нет slippage/funding) |
| TERM-065 | Trading journal | дневник трейдера, журнал | 0044, 0045 | int | Запись сделок и решений | CScalp включает дневник в курс | — |
| TERM-066 | Learn & Earn / L2E | учись и зарабатывай | 0001, 0005, 0007, 0009 | beg | Микронаграды за прохождение обучения | множественные | маркетинговый инструмент бирж |
| TERM-067 | Pump and dump | памп-схема | 0082–0084 | int | Координированный разгон цены (Telegram) | академически описан | — |
| TERM-068 | Exit liquidity | выходная ликвидность | 0016 | int | Покупатели, на которых закрываются чужие позиции | BitMEX guide | — |
| TERM-069 | Proof of Reserves | доказательство резервов | 0018 | int | Верификация активов биржи | CoinGecko guide | — |
| TERM-070 | Tokenomics | токеномика | 0114, 0115 | int | Устройство предложения/инсентивов токена | BloFin: инфляция/концентрация/incentive alignment | — |
| TERM-071 | Value investing (crypto) | стоимостное инвестирование | 0114 | int | Покупка ниже внутренней стоимости сети | BloFin | — |
| TERM-072 | Regulatory risks | регуляторные риски | 0001 (курс GFI), 0106 | int | Правовые риски криптоактивов | Binance/GFI курс; MDS | — |
| TERM-073 | Advance fee fraud | предоплата за «вывод» | 0103 | beg | Требование платы за доступ к «прибыли» | SEC/CFTC | — |
| TERM-074 | SBT certificate | soulbound-сертификат | 0019 | — | Непередаваемый токен-сертификат | WhiteBIT | — |

## Связи терминов (не объединять автоматически)

- exact duplicate: «стакан» = order book (TERM-001) — подтверждено контекстом CScalp.
- synonym: перпетуалы = perpetual futures = perps (TERM-006).
- broader/narrower: risk management (TERM-053) ⊃ position sizing (TERM-025) ⊃ risk-reward (TERM-026).
- related but different (ЗАПРЕЩЕНО сливать): stop-loss vs liquidation; funding rate vs borrowing cost; backtest vs paper trading; win rate vs expectancy; technical analysis vs market microstructure; liquidity pool (AMM, TERM-051) vs liquidity pool (ICT, TERM-033) — омонимия!
- uncertain: CryptoQuant «CQ Dataguide» — торговая марка или общий термин (не установлено).
- NOT FOUND (пробелы словаря): Wyckoff (TERM-035), expectancy (TERM-054), Sharpe/Sortino/Calmar (в источниках не встречены), martingale (не встречен в изученных материалах), market making как учебная тема (только в коде Hummingbot).

## Статистика терминов

74 TERM-ID; из них NEW (не было в словаре итерации 1): 30 (TERM-007, 013, 018–023, 032–034, 042–052 частично, 058–064, 067–074).
Пробелы словаря (заявленные итерацией 1 темы, не найденные в источниках): Wyckoff, martingale, Monte Carlo, Sortino/Calmar, data snooping, p-hacking, DCA как учебная тема (упомянут только в ботаx), trend following (как термин не встречен, суть — в momentum-уроках QC).
