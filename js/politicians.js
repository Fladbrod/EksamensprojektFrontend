const politicianTbody = document.getElementById("politicians-tbody");
const newPoliticianSelect = document.getElementById("create-politician-party");

getPoliticians()

function getPoliticians() {
    fetch(baseUrl + "/politicians")
        .then(response => response.json())
        .then(politicians => {
            politicianTbody.innerHTML = "";
            politicians.map(createPoliticianTableRow);
        });
}
function createPoliticianTableRow(politician) {
    const politicianTableRow = document.createElement("tr")
    politicianTbody.appendChild(politicianTableRow);

    constructPoliticianTableRow(politicianTableRow, politician);
}

function constructPoliticianTableRow(tableRow, politician) {
    const politicianTd = document.createElement("td");
    const partyTd = document.createElement("td");
    const actionTd = document.createElement("td");

    const updatePoliticianButton = document.createElement("button");
    updatePoliticianButton.className = "edit-btn";
    const acceptUpdateButton = document.createElement("button");
    acceptUpdateButton.className = "accept-btn";
    const deletePoliticianButton = document.createElement("button");
    deletePoliticianButton.className = "delete-btn";

    partyTd.innerText = politician.party.partyName;
    politicianTd.innerText = politician.politicianName;

    updatePoliticianButton.innerText = "Rediger";
    acceptUpdateButton.innerText = "Gem";
    acceptUpdateButton.style.display = "none";
    deletePoliticianButton.innerText = "Slet";

    actionTd.appendChild(updatePoliticianButton);
    actionTd.appendChild(acceptUpdateButton);
    actionTd.appendChild(deletePoliticianButton);

    tableRow.appendChild(politicianTd);
    tableRow.appendChild(partyTd);
    tableRow.appendChild(actionTd);

    updatePoliticianButton.addEventListener("click", () => {
        const politicianNameInput = document.createElement("input");
        const politicianPartyInput = document.createElement("select");

        politicianNameInput.value = politicianTd.innerText;
        politicianTd.innerText = "";

        partyTd.innerText = "";
        getPartiesForSelect(politicianPartyInput);


        politicianTd.appendChild(politicianNameInput);
        partyTd.appendChild(politicianPartyInput);

        updatePoliticianButton.style.display = "none";
        acceptUpdateButton.style.display = "";
    });

    acceptUpdateButton.addEventListener("click", () => {

        const politicianToUpdate = {
            politicianName: politicianTd.firstChild.value,
            party: {id: partyTd.firstChild.value}

        };

        fetch(baseUrl + "/politicians/" + politician.id, {
            method: "PATCH",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify(politicianToUpdate)
        }).then(response => {
            if (response.status === 200) {
                getPoliticians()
            }
        })
    });

    deletePoliticianButton.addEventListener("click", () => {
        if (confirm("Er du sikker på du vil slette?")) {
            fetch(baseUrl + "/politicians/" + politician.id, {
                method: "DELETE"
            }).then(response => {
                if (response.status === 200) {
                    tableRow.remove();
                } else {
                    console.log(response.status);
                }
            })
        }
    })
}

function getPartiesForSelect(select) {
    fetch(baseUrl + "/parties")
        .then(response => response.json())
        .then(parties => {
                parties.map(party => {
                    const politicianPartyOption = document.createElement("option");
                    politicianPartyOption.innerText = party.partyName;
                    politicianPartyOption.value = party.id;
                    select.appendChild(politicianPartyOption)
                })
            }
        )

}

getPartiesForSelect(newPoliticianSelect);

function createPolitician() {

    const name = document.getElementById("create-politician-name").value;
    const partyId = document.getElementById("create-politician-party").value;

    const politicianToCreate = {
        politicianName: name,
        party: {
            id: partyId,
            partyName: newPoliticianSelect.options[newPoliticianSelect.selectedIndex].text
        }
    };

    fetch(baseUrl + "/politicians", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(politicianToCreate)
    }).then(response => {
        if (response.status === 200) {
            return response.json()
        } else {
            console.log("Fejl med at oprette en politiker")
        }
    }).then(result => {
        politicianToCreate.id = result.id;
        createPoliticianTableRow(politicianToCreate);
        document.getElementById("create-politician-name").value = "";
    });
}

document.getElementById("new-politician-button")
    .addEventListener("click", createPolitician);

// Med hjælp fra https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_sort_table_number
function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("center-table");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch= true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}