async function loadComparables() {

    try {

        const ticker =
            document
                .getElementById("compTicker")
                .value
                .trim()
                .toUpperCase();

        const response =
            await fetch(
                "https://animated-space-orbit-x5rw4jrj9g7p2v4gj-8000.app.github.dev/comparables/" + ticker
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load comparables"
            );

        }

        const data =
            await response.json();

        const avgEVRevenue =
            data.reduce(
                (sum, c) =>
                sum + c.evRevenue,
                0
            ) / data.length;

        const avgEVEBITDA =
            data.reduce(
                (sum, c) =>
                sum + c.evEbitda,
                0
            ) / data.length;

        const companyResponse =
            await fetch(
                "https://animated-space-orbit-x5rw4jrj9g7p2v4gj-8000.app.github.dev/company/" + ticker
            );

        const company =
            await companyResponse.json();

        const evRevenueValue =
            avgEVRevenue *
            company.revenue;

        const evEBITDAValue =
            avgEVEBITDA *
            company.ebitda;

        const enterpriseValue =
            (
                evRevenueValue +
                evEBITDAValue
            ) / 2;

        const equityValue =
            enterpriseValue +
            company.cash -
            company.debt;

        const impliedPrice =
            equityValue /
            company.sharesOutstanding;

        const tbody =
            document.querySelector(
                "#compsTable tbody"
            );

        tbody.innerHTML = "";

        data.forEach(company => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${company.ticker}</td>

                <td>${company.company}</td>

                <td>$${(company.marketCap / 1000000000).toFixed(1)}B</td>

                <td>$${(company.revenue / 1000000000).toFixed(1)}B</td>

                <td>$${(company.ebitda / 1000000000).toFixed(1)}B</td>

                <td>${company.evRevenue}x</td>

                <td>${company.evEbitda}x</td>

            `;

            tbody.appendChild(row);

        });

    }

    catch(error) {

        console.error(error);

        alert(
            "Unable to load comparable companies."
        );

    }

}

window.onload = function() {

    document.getElementById(
        "compTicker"
    ).value = "AAPL";

    loadComparables();

}