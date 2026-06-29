let currentCompany = null;
console.log("LBO JS LOADED");
console.log("NEW VERSION");
async function loadLBOData() {

    try {

        const ticker =
            document
                .getElementById("lboTicker")
                .value
                .trim()
                .toUpperCase();

        if (!ticker) {

            alert("Enter a ticker.");

            return;
        }

        const url =
            "https://animated-space-orbit-x5rw4jrj9g7p2v4gj-8000.app.github.dev/company/" +
            ticker;

        console.log(url);

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Company not found"
            );

        }

        const data =
            await response.json();

        currentCompany = data;
        console.log("Loaded company:", currentCompany);
        alert(
            "Loaded " +
            data.company
        );

    }

    catch(error) {

        console.error(error);

        alert(
            "Unable to load company."
        );

    }

}

function calculateLBO() {
console.log(currentCompany);
    if (!currentCompany) {

        alert(
            "Load a company first."
        );

        return;
    }

    const ebitda =
        currentCompany.ebitda || 0;

    const purchaseMultiple =
        parseFloat(
            document.getElementById(
                "purchaseMultiple"
            ).value
        );

    const debtPercent =
        parseFloat(
            document.getElementById(
                "debtPercent"
            ).value
        ) / 100;

    const exitMultiple =
        parseFloat(
            document.getElementById(
                "exitMultiple"
            ).value
        );

    const holdingPeriod =
        parseFloat(
            document.getElementById(
                "holdingPeriod"
            ).value
        );

    if (
        isNaN(purchaseMultiple) ||
        isNaN(debtPercent) ||
        isNaN(exitMultiple) ||
        isNaN(holdingPeriod)
    ) {

        alert(
            "Check your assumptions."
        );

        return;
    }

    const enterpriseValue =
        ebitda *
        purchaseMultiple;

    const debt =
        enterpriseValue *
        debtPercent;

    const equity =
        enterpriseValue -
        debt;

    const exitValue =
        ebitda *
        exitMultiple;

    const sponsorProceeds =
        exitValue -
        debt;

    localStorage.setItem(
        "lboValue",
        "$" + sponsorProceeds.toFixed(2)
    );

    localStorage.setItem(
        "lboNumeric",
        sponsorProceeds
    );
    
    const lboPrice =
    sponsorProceeds /
    (
        currentCompany.sharesOutstanding ||
        1000000000
    );

    localStorage.setItem(
        "lboValue",
        lboPrice
    );

    const moic =
        sponsorProceeds /
        equity;

    const irr =
        (
            Math.pow(
                moic,
                1 / holdingPeriod
            ) - 1
        ) * 100;

    document.getElementById(
        "enterpriseValue"
    ).innerText =
        "$" +
        (enterpriseValue / 1000000000)
        .toFixed(1) +
        "B";

    document.getElementById(
        "debtValue"
    ).innerText =
        "$" +
        (debt / 1000000000)
        .toFixed(1) +
        "B";

    document.getElementById(
        "equityContribution"
    ).innerText =
        "$" +
        (equity / 1000000000)
        .toFixed(1) +
        "B";

    document.getElementById(
        "exitValue"
    ).innerText =
        "$" +
        (exitValue / 1000000000)
        .toFixed(1) +
        "B";

    document.getElementById(
        "moic"
    ).innerText =
        moic.toFixed(2) +
        "x";

    document.getElementById(
        "irr"
    ).innerText =
        irr.toFixed(1) +
        "%";

}