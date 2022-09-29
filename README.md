# ARM

## Project setup
**[Установка NodeJS и NPM](https://nodejs.org/en/ "Установка NodeJS и NPM")**

**[Установка Vue CLI](https://cli.vuejs.org/ru/guide/installation.html "Установка Vue CLI")**

```
vue add vuetify apollo
npm install --save vue-meta axios vue-axios vue-moment apexcharts vue-apexcharts leaflet
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

---

# Описание структуры

- `/public` - общедоступные файлы, такие как стили, картинки и т.п.
	- `/fonts` - шрифты
	- `/img` - картинки
	- `/sass` - стили
- `/src` - код проекта
    - `/components` - компоненты
        - `/Cards` - виджеты
            - `/Realty` - виджеты для страницы "Карта здания"
                - `HeatSchedule.vue` - график потребления теплоснабжения
                - `ResourceConsumption.vue` - потребление ресурсов
            - `Dashboard.vue` - соответствие температурному графику
            - `Efficiency.vue` - энергоэффективность
            - `Heat.vue` - приборы учета тепла
            - `Organizations.vue` - теплоснабжающие организации
            - `Outages.vue` - аварийные/плановые отключения
            - `Payments.vue` - начисления и платежи
        - `/Nav` - навигация
            - `/Footer.vue` - нижний колонтитул
            - `/Main.vue` - боковая панель с навигацией
            - `/NavBar.vue` - верхний колонтитул
        - `/NoFiltersSelected.vue` - универсальный текст для необходимости выбора фильтров
        - `/PageFilters.vue` - основные фильтры страниц
    - `/graphql` - [запросы в БД](https://studio.apollographql.com/sandbox/schema/reference "запросы в БД")
    - `/plugins` - настройка vuetify
    - `/router` - маршрутизация (Vue Router)
    - `/sass` - стили vuetify
    - `/views` -  компоненты, которые служат представлением для маршрутизации vue router
        - `/Overhaul` - подразделы дашборда "Капитальный ремонт в МКД"
          - `/Index.vue` - страница дашборд "Капитальный ремонт в МКД"
          - `/AccountsReceivable.vue` - страница "Дебиторская задолженность"
          - `/CollectionRate.vue` - страница "Собираемость взносов"
          - `/ContributionHistory.vue` - страница "История размера взноса"
          - `/Entrances.vue` - страница "Подъезды"
          - `/JobsTypes.vue` - страница "Типы работ"
        - `/Ventilation` - подразделы дашборда "Состояние систем вентиляции и дымоуправления"
          - `/Index.vue` - страница дашборд "Состояние систем вентиляции и дымоуправления"
          - `/VentilationCondition.vue` - страница "Ввод/вывод данных"
        - `/Dashboard.vue` - страница "Дашборд теплоснабжение"
        - `/EnergyEfficiency.vue` - страница "Класс энергоэффективности объекта недвижимости"
        - `/Login.vue` - страница "Авторизация"
        - `/OrgInfo.vue` - страница "Карта организации"
        - `/OrgList.vue` - страница "Список организаций"
        - `/Outages.vue` - страница "Аварийные/плановые отключения"
        - `/Overhaul.vue` - страница роутинга дашборда "Капитальный ремонт в МКД"
        - `/Overhaul.vue` - страница роутинга дашборда "Состояние систем вентиляции и дымоуправления"
        - `/Realty.vue` - страница "Карта объекта недвижимости"
        - `/UserSettings.vue` - страница "Персональные данные"
    - `/App.vue` - корневой компонент приложения
    - `/main.js` - основной файл проекта, который загружает Vue-приложение
    - `/vue-apollo.js` - конфигурация vue-apollo
