let dcfChart = null;

async function loadCompanyData() {

    try {

        const ticker =
            document.getElementById("tickerInput")
            .value
            .trim()
            .toUpperCase();

        if (!ticker) {

            alert("Please enter a ticker.");

            return;
        }

        const response =
            await fetch(
                "https://animated-space-orbit-x5rw4jrj9g7p2v4gj-8000.app.github.dev/company/" + ticker
            );

        if (!response.ok) {

            throw new Error(
                "Backend returned " +
                response.status
            );

        }

        const data =
            await response.json();

        console.log("Company Data:", data);

        document.getElementById("companyName").innerText =
            "Company: " + data.company;

        document.getElementById("marketCap").innerText =
            "Market Cap: $" +
            Number(data.marketCap).toLocaleString();

        document.getElementById("stockPrice").innerText =
            "Stock Price: $" +
            Number(data.currentPrice).toFixed(2);

        document.getElementById("revenue").innerText =
            "Revenue: $" +
            Number(data.revenue).toLocaleString();

        document.getElementById("ebitda").innerText =
            "EBITDA: $" +
            Number(data.ebitda).toLocaleString();

        document.getElementById("cash").innerText =
            "$" +
            Number(data.cash).toLocaleString();

        document.getElementById("debt").innerText =
            "$" +
            Number(data.debt).toLocaleString();

        document.getElementById("freeCashFlow").innerText =
            "$" +
            Number(data.freeCashFlow).toLocaleString();

        document.getElementById("sharesOutstanding").innerText =
            Number(data.sharesOutstanding).toLocaleString();

        document.getElementById("revenueGrowth").value =
            data.revenueGrowth;

        document.getElementById("ebitdaMargin").value =
            data.ebitdaMargin;

        document.getElementById("taxRate").value =
            21;

        document.getElementById("wacc").value =
            data.wacc;

        document.getElementById("terminalGrowth").value =
            data.terminalGrowth;

        localStorage.setItem(
            "dcfNumeric",
            priceTarget
        );

        calculateDCF(data);

    }

    catch(error) {

        console.error(error);

        alert(
            "Unable to load company data. Check backend and ticker."
        );

    }

}

function calculateDCF(companyData = null) {

    try {

        let revenue;

        if (companyData && companyData.revenue) {

            revenue = Number(companyData.revenue);

        } else {

            revenue = 1000000000;
        }

        const revenueGrowth =
            Number(
                document.getElementById(
                    "revenueGrowth"
                ).value
            ) / 100;

        const ebitdaMargin =
            Number(
                document.getElementById(
                    "ebitdaMargin"
                ).value
            ) / 100;

        const wacc =
            Number(
                document.getElementById(
                    "wacc"
                ).value
            ) / 100;

        const terminalGrowth =
            Number(
                document.getElementById(
                    "terminalGrowth"
                ).value
            ) / 100;

        if (wacc <= terminalGrowth) {

            alert(
                "WACC must be greater than Terminal Growth Rate"
            );

            return;
        }

        let projectedFCF = [];

        let currentRevenue = revenue;

        for (let year = 1; year <= 5; year++) {

            currentRevenue =
                currentRevenue *
                (1 + revenueGrowth);

            const ebitda =
                currentRevenue *
                ebitdaMargin;

            const taxRate =
                Number(
                    document.getElementById(
                        "taxRate"
                    ).value
                ) / 100;

            const taxes =
                ebitda *
                taxRate;

            const capex =
                currentRevenue *
                0.03;

            const fcf =
                ebitda -
                taxes -
                capex;

            projectedFCF.push(fcf);

        }

        let enterpriseValue = 0;

        projectedFCF.forEach(
            (fcf, index) => {

                enterpriseValue +=
                    fcf /
                    Math.pow(
                        1 + wacc,
                        index + 1
                    );

            }
        );

        const terminalValue =
            (
                projectedFCF[4] *
                (1 + terminalGrowth)
            ) /
            (
                wacc -
                terminalGrowth
            );

        enterpriseValue +=
            terminalValue /
            Math.pow(
                1 + wacc,
                5
            );

        const cash =
            companyData?.cash || 0;

        const debt =
            companyData?.debt || 0;

        const sharesOutstanding =
            companyData?.sharesOutstanding || 1;

        const equityValue =
            enterpriseValue +
            cash -
            debt;

        const priceTarget =
            equityValue /
            sharesOutstanding;

        window.lastDCFValue =
            priceTarget;

        localStorage.setItem(
            "dcfValue",
            priceTarget
        );
        document.getElementById(
            "enterpriseValue"
        
        ).innerText =
            "$" +
            Math.round(
                enterpriseValue
            ).toLocaleString();

        document.getElementById(
            "equityValue"
        ).innerText =
            "$" +
            Math.round(
                equityValue
            ).toLocaleString();

        document.getElementById(
            "priceTarget"
        ).innerText =
            "$" +
            priceTarget.toFixed(2);

        drawDCFChart(projectedFCF);
        buildSensitivityTable(
            projectedFCF
        );

    }

    catch(error) {

        console.error(
            "DCF Error:",
            error
        );

    }

}

function drawDCFChart(projectedFCF) {

    const ctx =
        document
            .getElementById("dcfChart")
            .getContext("2d");

    if (dcfChart) {

        dcfChart.destroy();

    }

    dcfChart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels: [
                    "Year 1",
                    "Year 2",
                    "Year 3",
                    "Year 4",
                    "Year 5"
                ],

                datasets: [

                    {

                        label:
                            "Projected Free Cash Flow",

                        data:
                            projectedFCF,

                        borderWidth: 3,

                        fill: false

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: true

                    }

                }

            }

        });

}

function buildSensitivityTable(
    projectedFCF
) {

    const waccValues =
        [0.08, 0.09, 0.10];

    const tgValues =
        [0.02, 0.025, 0.03];

    const ids = [

        ["wacc8tg2", "wacc8tg25", "wacc8tg3"],

        ["wacc9tg2", "wacc9tg25", "wacc9tg3"],

        ["wacc10tg2", "wacc10tg25", "wacc10tg3"]

    ];

    for (let i = 0; i < waccValues.length; i++) {

        for (let j = 0; j < tgValues.length; j++) {

            let ev = 0;

            projectedFCF.forEach(
                (fcf, index) => {

                    ev +=
                        fcf /
                        Math.pow(
                            1 + waccValues[i],
                            index + 1
                        );

                }
            );

            const terminalValue =
                (
                    projectedFCF[4] *
                    (1 + tgValues[j])
                ) /
                (
                    waccValues[i] -
                    tgValues[j]
                );

            ev +=
                terminalValue /
                Math.pow(
                    1 + waccValues[i],
                    5
                );

            document.getElementById(
                ids[i][j]
            ).innerText =
                "$" +
                Math.round(
                    ev / 1000000000
                ) +
                "B";

        }

    }

}

window.onload = function() {

    console.log(
        "Valuation Platform Loaded"
    );

    const tickerInput =
        document.getElementById(
            "tickerInput"
        );

    if (tickerInput) {

        tickerInput.value = "AAPL";

        loadCompanyData();

    }

};
const dashboardDCF =
    document.getElementById(
        "dashboardDCF"
    );

if (dashboardDCF) {

    dashboardDCF.innerText =
        "$" +
        (
            Number(
                localStorage.getItem(
                    "dcfValue"
                )
            ) || 0
        ).toFixed(2);

}

const dashboardComps =
    document.getElementById(
        "dashboardComps"
    );

if (dashboardComps) {

    dashboardComps.innerText =
        "$" +
        (
            Number(
                localStorage.getItem(
                    "compsValue"
                )
            ) || 0
        ).toFixed(2);

}

const dashboardLBO =
    document.getElementById(
        "dashboardLBO"
    );

if (dashboardLBO) {

    dashboardLBO.innerText =
        "$" +
        (
            Number(
                localStorage.getItem(
                    "lboValue"
                )
            ) || 0
        ).toFixed(2);

}