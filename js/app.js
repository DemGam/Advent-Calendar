(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    const calendar = document.querySelector("#calendar");
    const xhrCalendar = new XMLHttpRequest;
    const parser = new DOMParser;
    let fullDate = new Date;
    let currentDay = fullDate.getDate();
    if (calendar) {
        if (currentDay <= 15) xhrCalendar.open("get", "../files/calendar_data.xml", true); else xhrCalendar.open("get", "../files/calendar_data_second.xml", true);
        xhrCalendar.send();
        xhrCalendar.onreadystatechange = function readXML() {
            if (4 == xhrCalendar.readyState) {
                if (200 == xhrCalendar.status) {
                    let calendarData = parser.parseFromString(xhrCalendar.responseText, "text/xml");
                    let days = calendarData.getElementsByTagName("day");
                    for (var i = 0; i < days.length; i++) {
                        let date = days[i].getElementsByTagName("date")[0].textContent;
                        let imgBg = days[i].getElementsByTagName("bg")[0].textContent;
                        if (parseInt(date) < currentDay) calendar.insertAdjacentHTML("beforeend", `<div class="calendar__box calendar__box_bg"><img src="img/gifts/${imgBg}" alt="Gift of the day"></div>`);
                        if (parseInt(date) == currentDay) {
                            let goToLink = days[i].getElementsByTagName("link")[0].textContent;
                            calendar.insertAdjacentHTML("beforeend", `<div class="calendar__box calendar__box_current" data-url="${goToLink}"><img src="img/gifts/${imgBg}" alt="Gift of the day"><h3 class="calendar__day">${date}</h3></div>`);
                        }
                        if (parseInt(date) > currentDay) calendar.insertAdjacentHTML("beforeend", `<div class="calendar__box"><h3 class="calendar__day">${date}</h3></div>`);
                    }
                    calendar.insertAdjacentHTML("beforeend", `<div class="calendar__box calendar__box_decor"><img src="img/gifts/bells.jpg" alt="X-mass bells"></div>`);
                    checkCurrentDayBox();
                }
                if (404 == xhrCalendar.status) {
                    calendar.insertAdjacentHTML("beforeend", '<h3 class="error-message">Something has gone wrong<br>Try again later</h3>');
                    console.log("File of resource not found");
                }
            }
        };
    }
    function checkCurrentDayBox() {
        const currentDayBox = document.querySelector(".calendar__box_current");
        const giftUrl = currentDayBox.dataset.url;
        if (currentDayBox) currentDayBox.addEventListener("click", (function() {
            currentDayBox.classList.toggle("_animate-active");
            setTimeout((() => {
                window.location.href = giftUrl;
            }), 500);
        }), {
            once: true
        });
    }
    const winners = document.querySelector("#winners");
    const xhrWinnersCurrent = new XMLHttpRequest;
    const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    let currentMonth = monthNames[fullDate.getMonth()];
    if (winners) {
        xhrWinnersCurrent.open("get", "../files/winners-current.xml", true);
        xhrWinnersCurrent.send();
        xhrWinnersCurrent.onreadystatechange = function readXML() {
            if (4 == xhrWinnersCurrent.readyState) if (200 == xhrWinnersCurrent.status) {
                let winnersData = parser.parseFromString(xhrWinnersCurrent.responseText, "text/xml");
                winners.insertAdjacentHTML("beforeend", `<div class="winners__year">This year's winners</div>`);
                let cardsWinnerDiv = document.createElement("div");
                cardsWinnerDiv.className = "winners__cards";
                winners.appendChild(cardsWinnerDiv);
                function createCardWinnerDiv(dayBlock, winDataBlock, prizeBlock) {
                    let cardWinnerDiv = document.createElement("div");
                    cardWinnerDiv.className = "winners__card card-winner";
                    cardWinnerDiv.innerHTML = dayBlock + winDataBlock + prizeBlock;
                    cardsWinnerDiv.appendChild(cardWinnerDiv);
                }
                let dayWinners = winnersData.getElementsByTagName("winner");
                for (var i = 0; i < currentDay; i++) {
                    let day = dayWinners[i].getElementsByTagName("day")[0].textContent;
                    let name = dayWinners[i].getElementsByTagName("name")[0].textContent;
                    let town = dayWinners[i].getElementsByTagName("town")[0].textContent;
                    let prize = dayWinners[i].getElementsByTagName("prize")[0].textContent;
                    let dayBlock = `<div class="card-winner__date">${day} ${currentMonth}</div>`;
                    let nameSpan = `<span class="card-winner__name">${name}, </span>`;
                    let townSpan = `<span class="card-winner__town">${town}</span>`;
                    let winDataBlock = `<p class="card-winner__data">${nameSpan}${townSpan}</p>`;
                    let prizeBlock = `<p class="card-winner__prize">${prize}</p>`;
                    createCardWinnerDiv(dayBlock, winDataBlock, prizeBlock);
                }
            }
        };
    }
    const xhrWinnersPast = new XMLHttpRequest;
    if (winners) {
        xhrWinnersPast.open("get", "../files/winners-past.xml", true);
        xhrWinnersPast.send();
        xhrWinnersPast.onreadystatechange = function readXML() {
            if (4 == xhrWinnersPast.readyState) if (200 == xhrWinnersPast.status) {
                let winnersData = parser.parseFromString(xhrWinnersPast.responseText, "text/xml");
                let yearWinners = winnersData.getElementsByTagName("winners");
                Object.values(yearWinners).forEach((year => {
                    winners.insertAdjacentHTML("beforeend", `<div class="winners__year">Winners of ${year.getAttribute("year")}</div>`);
                    let cardsWinnerDiv = document.createElement("div");
                    cardsWinnerDiv.className = "winners__cards";
                    winners.appendChild(cardsWinnerDiv);
                    function createCardWinnerDiv(dayBlock, winDataBlock, prizeBlock) {
                        let cardWinnerDiv = document.createElement("div");
                        cardWinnerDiv.className = "winners__card card-winner";
                        cardWinnerDiv.innerHTML = dayBlock + winDataBlock + prizeBlock;
                        cardsWinnerDiv.appendChild(cardWinnerDiv);
                    }
                    let dayWinners = year.getElementsByTagName("winner");
                    Object.values(dayWinners).forEach((winner => {
                        let day = winner.getElementsByTagName("day")[0].textContent;
                        let name = winner.getElementsByTagName("name")[0].textContent;
                        let town = winner.getElementsByTagName("town")[0].textContent;
                        let prize = winner.getElementsByTagName("prize")[0].textContent;
                        let dayBlock = `<div class="card-winner__date">${day} December</div>`;
                        let nameSpan = `<span class="card-winner__name">${name}, </span>`;
                        let townSpan = `<span class="card-winner__town">${town}</span>`;
                        let winDataBlock = `<p class="card-winner__data">${nameSpan}${townSpan}</p>`;
                        let prizeBlock = `<p class="card-winner__prize">${prize}</p>`;
                        createCardWinnerDiv(dayBlock, winDataBlock, prizeBlock);
                    }));
                }));
            }
        };
    }
    window["FLS"] = true;
    isWebp();
})();
