async function addToPortfolio() {

    try {

        const ticker =
            document
                .getElementById("portfolioTicker")
                .value
                .trim()
                .toUpperCase();

        if (!ticker) {

            return;

        }

        const response =
            await fetch(
                "https://animated-space-orbit-x5rw4jrj9g7p2v4gj-8000.app.github.dev/company/" +
                ticker
            );

        const data =
            await response.json();

        const currentPrice =
            data.currentPrice || 100;

        const dcfValue =
            currentPrice * 1.20;

        const compsValue =
            currentPrice * 1.10;

        const lboValue =
            currentPrice * 0.95;

        const targetPrice =

            (dcfValue * 0.50) +

            (compsValue * 0.30) +

            (lboValue * 0.20);

        const upside =

            ((targetPrice - currentPrice)

            / currentPrice) * 100;

        let rating = "HOLD";

        if (upside > 15) {

            rating = "BUY";

        }

        else if (upside < -10) {

            rating = "SELL";

        }

        const table =
            document.querySelector(
                "#portfolioTable tbody"
            );

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${ticker}</td>

            <td>${rating}</td>

            <td>$${targetPrice.toFixed(2)}</td>

        `;

        table.appendChild(row);

        savePortfolio();

    }

    catch(error) {

        console.error(error);

        alert(
            "Unable to load company."
        );

    }

}
function savePortfolio() {

    const rows =
        document.querySelectorAll(
            "#portfolioTable tbody tr"
        );

    const portfolio = [];

    rows.forEach(row => {

        portfolio.push({

            ticker:
                row.children[0].innerText,

            rating:
                row.children[1].innerText,

            targetPrice:
                row.children[2].innerText

        });

    });

    localStorage.setItem(

        "portfolio",

        JSON.stringify(portfolio)

    );

}
function loadPortfolio() {

    const portfolio =

        JSON.parse(

            localStorage.getItem(
                "portfolio"
            )

        ) || [];

    const table =
        document.querySelector(
            "#portfolioTable tbody"
        );

    portfolio.forEach(company => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${company.ticker}</td>

            <td>${company.rating}</td>

            <td>${company.targetPrice}</td>

        `;

        table.appendChild(row);

    });

}
window.onload = function() {

    loadPortfolio();

};
document.getElementById(
    "latestCompany"
).innerText =
    "Company: " +
    (
        localStorage.getItem(
            "lastCompany"
        ) || "-"
    );

document.getElementById(
    "latestRating"
).innerText =
    "Rating: " +
    (
        localStorage.getItem(
            "lastRating"
        ) || "-"
    );

document.getElementById(
    "latestTarget"
).innerText =
    "Target Price: $" +
    (
        localStorage.getItem(
            "lastTarget"
        ) || "-"
    );