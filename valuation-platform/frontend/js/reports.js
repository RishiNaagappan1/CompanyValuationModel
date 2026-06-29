async function generateReport() {

    try {

        const ticker =
            document
                .getElementById("reportTicker")
                .value
                .trim()
                .toUpperCase();

        if (!ticker) {

            alert(
                "Enter a ticker."
            );

            return;

        }

        const response =
            await fetch(
                "https://animated-space-orbit-x5rw4jrj9g7p2v4gj-8000.app.github.dev/company/" +
                ticker
            );

        if (!response.ok) {

            throw new Error(
                "Company not found"
            );

        }

        const data =
            await response.json();

        const currentPrice =
            data.currentPrice || 100;

        const dcfValue =
            Number(
                localStorage.getItem(
                    "dcfValue"
                )
            ) ||
            currentPrice;

        const compsValue =
            Number(
                localStorage.getItem(
                    "compsValue"
                )
            ) ||
            currentPrice;

        const lboValue =
            Number(
                localStorage.getItem(
                    "lboValue"
                )
            ) ||
            currentPrice;

        const targetPrice =

            (dcfValue * 0.60)

            +

            (compsValue * 0.25)

            +

            (lboValue * 0.15);
        
        localStorage.setItem(
            "currentPrice",
            currentPrice
        );

        localStorage.setItem(
            "targetPrice",
            targetPrice
        );

        localStorage.setItem(
            "lastCompany",
            data.company
        );

        localStorage.setItem(
            "lastTarget",
            targetPrice.toFixed(2)
        );

        document.getElementById(
            "reportOutput"
        ).innerHTML = `

        <div class="form-card">

            <h1 style="
                margin-bottom:10px;
                font-size:32px;
            ">
                ${data.company}
            </h1>

            <p style="
                opacity:0.8;
                margin-bottom:0;
            ">
                Equity Research Report
            </p>

        </div>

        <div class="card-grid">

            <div class="card">

                <div class="card-label">
                    CURRENT PRICE
                </div>

                <div class="card-value">
                    $${currentPrice.toFixed(2)}
                </div>

            </div>

            <div class="card">

                <div class="card-label">
                    MARKET CAP
                </div>

                <div class="card-value">
                    $${(
                        data.marketCap /
                        1000000000
                    ).toFixed(1)}B
                </div>

            </div>

            <div class="card">

                <div class="card-label">
                    REVENUE
                </div>

                <div class="card-value">
                    $${(
                        data.revenue /
                        1000000000
                    ).toFixed(1)}B
                </div>

            </div>

            <div class="card">

                <div class="card-label">
                    EBITDA
                </div>

                <div class="card-value">
                    $${(
                        data.ebitda /
                        1000000000
                    ).toFixed(1)}B
                </div>

            </div>

            <div class="card">

                <div class="card-label">
                    EBITDA MARGIN
                </div>

                <div class="card-value">
                    ${data.ebitdaMargin}%
                </div>

            </div>

        </div>

        <div class="form-card">

            <h2>
                Valuation Summary
            </h2>

            <table>

                <tr>
                    <td>DCF Value</td>
                    <td>$${dcfValue.toFixed(2)}</td>
                </tr>

                <tr>
                    <td>Comparable Value</td>
                    <td>$${compsValue.toFixed(2)}</td>
                </tr>

                <tr>
                    <td>LBO Value</td>
                    <td>$${lboValue.toFixed(2)}</td>
                </tr>

                <tr>
                    <td><strong>Weighted Target Price</strong></td>
                    <td><strong>$${targetPrice.toFixed(2)}</strong></td>
                </tr>

            </table>

        </div>

        <div
            id="recommendationBox"
            class="form-card"
        >
        </div>

        <div class="form-card">

            <h2>
                Football Field Valuation
            </h2>

            <div id="footballField">

            </div>

        </div>

        <div class="form-card">

            <h2>
                DCF Sensitivity Analysis
            </h2>

            <div id="sensitivityTable">

            </div>

        </div>

        <div class="form-card">

            <h2>
                Business Overview
            </h2>

            <p>

                ${data.company}
                generates approximately

                <strong>
                    $${(
                        data.revenue /
                        1000000000
                    ).toFixed(1)}B
                </strong>

                in annual revenue.

            </p>

            <p>

                The company maintains an EBITDA
                margin of

                <strong>
                    ${data.ebitdaMargin}%
                </strong>

                and currently trades at a market
                capitalization of

                <strong>
                    $${(
                        data.marketCap /
                        1000000000
                    ).toFixed(1)}B
                </strong>.

            </p>

        </div>

        <div class="form-card">

            <h2>
                Analyst Commentary
            </h2>

            <p>

                This report combines DCF,
                Comparable Company Analysis,
                and LBO valuation methodologies.

            </p>

            <p>

                Weighted valuation suggests a
                target price of

                <strong>
                    $${targetPrice.toFixed(2)}
                </strong>

                versus a current market price of

                <strong>
                    $${currentPrice.toFixed(2)}
                </strong>.

            </p>

        </div>

        `;

        renderFootballField(data);

        renderSensitivityTable(data);

        renderRecommendation(
            data,
            targetPrice,
            dcfValue,
            compsValue,
            lboValue
        );

    }

    catch(error) {

        console.error(error);

        alert(
            "Unable to generate report."
        );

    }

}

function renderFootballField(company) {

    const currentPrice =
        company.currentPrice || 100;

    const dcfValue =
        currentPrice * 1.15;

    const compsValue =
        currentPrice * 1.05;

    const lboValue =
        currentPrice * 0.90;

    const valuations = [

        {
            name: "DCF",
            low: dcfValue * 0.90,
            high: dcfValue * 1.10
        },

        {
            name: "Public Comps",
            low: compsValue * 0.90,
            high: compsValue * 1.10
        },

        {
            name: "LBO",
            low: lboValue * 0.90,
            high: lboValue * 1.10
        }

    ];

    const maxValue =
        Math.max(
            ...valuations.map(
                v => v.high
            )
        ) * 1.25;

    const container =
        document.getElementById(
            "footballField"
        );

    container.innerHTML = "";

    valuations.forEach(v => {

        const width =
            ((v.high - v.low) /
            maxValue) * 100;

        const offset =
            (v.low /
            maxValue) * 100;

        const currentPosition =
            (currentPrice /
            maxValue) * 100;

        container.innerHTML += `

        <div class="valuation-row">

            <div class="valuation-label">

                ${v.name}

            </div>

            <div
                style="
                    width:650px;
                    position:relative;
                    height:32px;
                "
            >

                <div
                    class="valuation-bar"
                    style="
                        position:absolute;
                        left:${offset}%;
                        width:${width}%;
                    "
                >
                </div>

                <div
                    style="
                        position:absolute;
                        left:${currentPosition}%;
                        width:3px;
                        height:30px;
                        background:black;
                    "
                >
                </div>

            </div>

            <div class="valuation-values">

                $${v.low.toFixed(0)}
                -
                $${v.high.toFixed(0)}

            </div>

        </div>

        `;

    });

}
function renderSensitivityTable(company) {

    const container =
        document.getElementById(
            "sensitivityTable"
        );

    const waccs =
        [8, 9, 10];

    const terminalGrowths =
        [2, 3, 4];

    let html = `

        <table id="sensitivityTable">

            <tr>

                <th>WACC / TG</th>

                <th>2%</th>

                <th>3%</th>

                <th>4%</th>

            </tr>

    `;

    const base =
        company.currentPrice || 100;

    waccs.forEach(wacc => {

        html += `<tr>`;

        html += `<td>${wacc}%</td>`;

        terminalGrowths.forEach(tg => {

            const value =
                base *
                ((10 - wacc) * 0.15 + 1) *
                ((tg - 2) * 0.10 + 1);

            html += `

                <td>

                    $${value.toFixed(0)}

                </td>

            `;

        });

        html += `</tr>`;

    });

    html += `</table>`;

    container.innerHTML = html;

}
function renderRecommendation(
    company,
    targetPrice,
    dcfValue,
    compsValue,
    lboValue
) {

    const currentPrice =
        company.currentPrice || 100;

    const upside =
        (
            (
                targetPrice -
                currentPrice
            )
            /
            currentPrice
        ) * 100;

    let rating =
        "HOLD";

    if (upside > 15) {

        rating =
            "BUY";

    }

    else if (upside < -10) {

        rating =
            "SELL";

    }

    localStorage.setItem(
        "lastRating",
        rating
    );

    document.getElementById(
        "recommendationBox"
    ).innerHTML = `

    <h2>
        Investment Recommendation
    </h2>

    <h1 style="
        font-size:48px;
        margin-bottom:10px;
    ">
        ${rating}
    </h1>

    <p>

        Current Price:
        <strong>
            $${currentPrice.toFixed(2)}
        </strong>

    </p>

    <p>

        Target Price:
        <strong>
            $${targetPrice.toFixed(2)}
        </strong>

    </p>

    <p>

        Upside / Downside:
        <strong>
            ${upside.toFixed(1)}%
        </strong>

    </p>

    <hr>

    <p>

        DCF Value:
        <strong>
            $${dcfValue.toFixed(2)}
        </strong>

    </p>

    <p>

        Comparable Value:
        <strong>
            $${compsValue.toFixed(2)}
        </strong>

    </p>

    <p>

        LBO Value:
        <strong>
            $${lboValue.toFixed(2)}
        </strong>

    </p>

    `;
}
function downloadPDF() {

    const report =
        document.getElementById(
            "reportOutput"
        );

    html2pdf()

        .set({

            margin: 0.5,

            filename:
                "EquityResearchReport.pdf",

            image: {
                type: "jpeg",
                quality: 1
            },

            html2canvas: {
                scale: 2
            },

            jsPDF: {
                unit: "in",
                format: "letter",
                orientation: "portrait"
            }

        })

        .from(report)

        .save();

}