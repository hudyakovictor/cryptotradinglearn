# ИТЕРАЦИЯ 2 — Обновления статусов изученности и журнал аудита

Дата: 2026-09-11. База: реестр итерации 1 (113 SRC). Метод: загрузка ключевых страниц (fetch) + использование полных выдержек контента, полученных в итерации 1. Правила: L-статус повышается только при фактическом изучении; платный контент не обходится.

## 1. Обновления L-статусов

| SRC | Было | Стало | Что изучено | Что осталось недоступным |
|---|---|---|---|---|
| SRC-0001 Binance Academy | L1 | **L2** | Загружена страница каталога курсов: треки Beginner Track, Intermediate Track, **Crypto Risk Management**, **On-Chain Analysis for Beginners**, AI Unlocked; партнёрские курсы (Cardano, Injective, Aptos, Marlin, AWS, BNB Chain, Global Fintech Institute — регуляторные риски!); университетские курсы (ESCP платный, EBU, Oulu, Прага — платный); сертификаты PDF+NFT; квизы; отзывы (Binance Angels — маркер ангажированности отзывов) | Сами уроки треков не прочитаны; RU-версия не открыта |
| SRC-0015 Deribit Options Course | L2 | **L3** | Изучены: структура 13 секций; урок «Option Profit/Loss Calculation Examples» (5+ числовых примеров P&L: strike 10000, premium 0.05 BTC, ITM/OTM исходы, продажа опционов, раннее закрытие); принцип «fees вычитаются из итогового P&L» | Секции 7–12 (волатильность, греки) — только названия |
| SRC-0016 BitMEX Guides | L2 | **L2+** | Загружена полная страница гайдов: подтверждены разделы What is Crypto (стейкинг, майнинг, кошельки, **exit liquidity**, перпетуалы), BitMEX Guides (KYC, депозит, типы ордеров, безопасность, индикаторы, **типы фьючерсных контрактов quanto/linear/inverse**, cross/isolated margin), Trading 101 | Полные тексты статей о базисе и арбитраже не прочитаны (→ итерация 3/4) |
| SRC-0024 CME crypto futures course | L2 | **L3** | Изучены 2 урока: «Get to know options on Bitcoin futures» (спецификация: 5 BTC, тик $25/$5, экспирация последняя пятница, European style, cash settlement в BRR, портфельная маржа; числовые примеры $370/$620; квиз «Test your knowledge») | Остальные уроки курса (BTC/ETH/Micro/BTIC) |
| SRC-0044 CScalp курс | L2 | **L3** | Загружена страница курса: 12 шагов (не 10, как в итерации 1 — исправление); изучены шаги 1–2 (самопроверка: время, «скальпинг — ремесло», мотивация; поиск ответов: Google→чат→форум→поддержка); программа: занятие №0 риск-менеджмент, №1 точки входа, №2 анализ стакана, №3 техника сделки; **дневник трейдера входит в комплект**; дисклеймер «исключительно профессиональное мнение без гарантий и обещаний»; обновление 11.2024; аудитория 12 000 трейдеров/день (заявление) | Видео-занятия (не просмотрены); полные тексты шагов 3–12 |
| SRC-0050 Glassnode | L1 | **L2 + КОРРЕКЦИЯ** | КОРРЕКЦИЯ: academy.glassnode.com редиректит на docs.glassnode.com — «академия» как отдельный раздел не подтверждён на 2026-09-11; вместо неё — Metric Catalog, Point-in-Time Metrics (данные для бэктестинга без look-ahead!), Data Availability, CLI/MCP-интеграции | Статьи-объяснения метрик (21 шт. по обзорам 2024) — местоположение на 2026 не подтверждено |
| SRC-0051 CryptoQuant | L1 | **L3** | Изучена статья «What is On-Chain Data?» (полностью в выдержке): роль on-chain данных, интерпретация метрик, CQ Dataguide, честная оговорка «on-chain data is still in the early stage» | Остальные статьи User Guide |
| SRC-0055 QuantConnect Boot Camp | L2 | **L2** | Подтверждены 14 уроков-стратегий (полные названия+длительности), принцип «от лабораторий к paper/live», Algorithm Framework | Сами лаборатории (требуют аккаунт QC) |
| SRC-0058 Freqtrade | L1 | **L2** | Подтверждены из выдачи: IStrategy, backtesting, hyperopt, FreqAI (ML-модуль), dry-run, Telegram/FreqUI, режимы spot/futures, CCXT-коннекторы | Документация не читалась постранично |
| SRC-0082 Kamps & Kleinberg | L1 | **L3** | Аннотация и структура изучены: 412 pump-событий, 300+ TG-каналов, метод random forest, вывод о масштабируемости явления | Полный текст |
| SRC-0083 Victor & Hagemann | L1 | **L3** | Аннотация изучена: 149 событий на Binance, ML-детектор, кап < $50M | Полный текст |
| SRC-0084 What drives P&D | L1 | **L3** | Аннотация изучена: 1457 событий, драйверы | Полный текст (paywall) |
| SRC-0079 Makarov & Schoar | L1 | **L2** | Аннотация изучена (арбитраж, capital controls, 80% объёма — common component) | Полный текст (SSRN PDF) |
| SRC-0103/0104 CFTC/SEC alerts | L1 | **L3** | Тексты изучены: полный список red flags; риски платформ (нерегулируемость, торговля против клиента, манипуляции, киберриски) | — |
| SRC-0107 Bybit Demo FAQ | L2 | **L3** | Текст изучен: определения Demo vs Testnet, стартовые средства, механика исполнения | — |
| SRC-0021 eToro Academy | L2 | **L2** | Полные программы 3 курсов (33 урока суммарно, с длительностями и описаниями) | Контент уроков (частично Club-only) |
| SRC-0025 Duke DeFi | L2 | **L2** | Подтверждены программы 4 курсов с помодульной детализацией (Uniswap v2/v3, impermanent loss, flash loans, dYdX перпетуалы, risks framework) | Видеолекции |
| SRC-0028 CFI | L2 | **L2** | Полная программа intro-курса (13 интерактивных упражнений, polls) | Уроки |
| SRC-0041 Chart Guys | L2 | **L2** | Модули 1,2,3,7,8,9,10 структуры подтверждены; сторонний обзор isthiscourselegit.com (позитивная оценка честности, $149.99) | Уроки (платно) |
| SRC-0027 Dune | L2 | **L2** | Quickstart (SQL-пример изучен), перечень гайдов Dune 101 | Полные гайды |
| SRC-0094 CryptoDataDownload | L1 | **L2** | Страницы data прочитаны: free CSV policy, Zero-Gap OHLCV (provenance: raw/reconciled/filled), признание гэпов у бирж | — |
| SRC-0005 Bybit Learn | L1 | **L2** | Структуры двух курсов (5 уроков; 4 обещания) | Уроки |
| SRC-0019 WhiteBIT Education | L1 | **L2** | Программа WhiteBASE: 2+10 блоков, 18 уроков, тесты, SBT-сертификат | Видео (email-gate) |
| SRC-0007 KuCoin Learn | L1 | **L2** | Подтверждена серия #ThinkBeforeYouInvest (12+ статей безопасности), Learn&Earn механика | Статьи |
| SRC-0109 TradingView Paper | L1 | **L2** | Изучена критика: perfect fills, отсутствие slippage/funding, DEX-данные, real-time крипто-данные | — |
| SRC-0096 BabyPips | L0 | **L0** | Не проверен (перенос на итерацию 4) | — |
| SRC-0069 ITT-Обучение | L1 | **L2** | Программа 2 уровней (инвестирование, портфель/FA, трейдинг, новости) | Посты |

## 2. Журнал аудита (AUDIT_LOG итерации 2)

- AUDIT-02-01 [correction]: SRC-0044 CScalp — в итерации 1 указано «10 шагов», фактически программа из 12 пунктов (содержание) при 10 основных шагах обучения. Исправлено.
- AUDIT-02-02 [correction]: SRC-0050 Glassnode — «Academy» (21 статья) существовала по данным обзоров 2022–2024; на 2026-09-11 academy.glassnode.com редиректит на docs.glassnode.com. Метрики задокументированы в Metric Catalog; образовательные статьи, возможно, мигрированы/удалены. Статус понижен до «требует перепроверки нахождения статей». Уникальная находка: раздел Point-in-Time Metrics — редкий документированный подход к устранению look-ahead bias в on-chain данных.
- AUDIT-02-03 [conflict-note]: SRC-0001 Binance Academy — отзывы студентов на странице каталога принадлежат «Binance Angels» (амбассадоры биржи) — аффилированные отзывы, не независимые.
- AUDIT-02-04 [merge-candidate]: SRC-0017 CoinMarketCap Academy принадлежит Binance (как и SRC-0001) — частичное дублирование экосистемы; объединение не проводится, связь зафиксирована.
- AUDIT-02-05 [new-source]:SRC-0113 Elevify «Crypto Fundamental Analysis Course» (en, free/premium) — закрывает часть пробела сегмента F, но платформа под тем же подозрением на AI-генерацию, что SRC-0045.
- AUDIT-02-06 [new-source]: SRC-0114 BloFin Academy «Value Investing in Crypto: Fundamental Analysis for Token Selection» (05/2026) — качественный контент FA (5 pillars, tokenomics-инфляция/концентрация, чек-лист, инструменты DefiLlama/Token Terminal/GitHub) от биржи BloFin (новая биржа для пула — кандидат №23).
- AUDIT-02-07 [new-source]: SRC-0115 Grayscale «Tokenomics: Fundamental Valuation Methods for Crypto» (вебинар 04/2023, для фин. советников; категории токенов: payment/smart contract/dApp) — институциональный взгляд на оценку.
- AUDIT-02-08 [gap-update]: Пробел F (фундаментальный анализ) частично закрыт: Binance Academy On-Chain track, BloFin Academy, Grayscale, Elevify, ITT уровень 2. Пробел P (риск-менеджмент) частично закрыт треком Binance «Crypto Risk Management» и занятием №0 CScalp — но standalone-глубоких курсов по-прежнему нет.
- AUDIT-02-09 [uncertainty]: SRC-0002 Coinbase Learn&Earn — противоречие: Bitget Academy (SRC-0006) заявляет о дисконтинуации программы в 2025; сторонний обзор 08.2025 описывает её как активную. Требуется проверка на итерации 4 (CONFLICT-ID присвоен в итерации 3).

## 3. Итоговая статистика L-статусов после итерации 2

| Статус | Итерация 1 | После итерации 2 |
|---|---|---|
| L0 | 28 | 26 |
| L1 | 55 | 48 |
| L2 | 24 | 33 |
| L3 | 0 | 11 |
| L4–L6 | 0 | 0 |

L3 достигнут для: SRC-0015 (Deribit, частично), 0024 (CME), 0044 (CScalp), 0051 (CryptoQuant), 0082, 0083, 0084 (pump-and-dump), 0103, 0104 (CFTC/SEC), 0107 (Bybit Demo), 0004× (OKX guide — частично L3 по статье «How to Learn Crypto Trading»).
L4+ не присвоен никому: полные курсы/книги не прочитаны — честная граница этапа.
