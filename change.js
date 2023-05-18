var style = getComputedStyle(document.body)
const txtColor = style.getPropertyValue('--txtcolor')
const bgColor = style.getPropertyValue('--bgcolor')
const primaryColor = style.getPropertyValue('--primary')
const secondaryColor = style.getPropertyValue('--secondary')
const accentColor = style.getPropertyValue('--accent')

console.log('Text Color:', txtColor);
console.log('Background Color:', bgColor);
console.log('Primary Color:', primaryColor);
console.log('Secondary Color:', secondaryColor);
console.log('Accent Color:', accentColor);

const init = async function() {
    // table,#person table,table.wca-results {
    //     background-color: #ab303000
    // }

    // bottom of page text
    getToken();

    // const injectElement = document.createElement('div');
    // injectElement.className = 'lol-element';
    // injectElement.innerHTML = 'Yo whaddup 😎'

    // document.body.appendChild(injectElement);

    //gold silver bronze colours
    let elements = document.querySelectorAll(".world-rank, .country-rank, .continent-rank");
    Array.from(elements).forEach(element => {
    let ele = parseInt(element.innerHTML);
    if (ele < 20) {
        element.style.backgroundColor = '#bf8c00';
        if (ele == 1) {
        element.style.color = 'lightblue';
    }
    } else if (ele > 20 && ele < 50) {
        element.style.backgroundColor = '#7d7d7d';
    } else if (ele > 50 && ele < 100) {
        element.style.backgroundColor = '#a05d00';
    }
    });
    let rows = document.querySelectorAll('div.personal-records table.table-striped tbody tr');
Array.from(rows).forEach((row,index) => {
    let worldRank = parseInt(row.querySelector('.world-rank').innerHTML);
    let continentRank = parseInt(row.querySelector('.continent-rank').innerHTML);
    let countryRank = parseInt(row.querySelector('.country-rank').innerHTML);
    let secWorldRank = parseInt(row.querySelectorAll('.world-rank')[1].innerHTML);
    let secContinentRank = parseInt(row.querySelectorAll('.continent-rank')[1].innerHTML);
    let secCountryRank = parseInt(row.querySelectorAll('.country-rank')[1].innerHTML);
    
    console.log(worldRank, continentRank, countryRank);
    console.log(secWorldRank, secContinentRank, secCountryRank);
    console.log(index);

    let element;

    if (worldRank === 1) {
        element = row.querySelector('.world-rank')
    } else if (continentRank === 1) {
        element = row.querySelector('.continent-rank')
    } else if (countryRank === 1) {
        element = row.querySelector('.country-rank')

    }

    if (element) {
        element.style.zIndex = '9999';
        element.style.animation = 'rainbow-shadow 5s infinite linear';
    }

    let selement;

    if (secWorldRank === 1) {
        selement = row.querySelectorAll('.world-rank')[1]
    } else if (secContinentRank === 1) { 
        selement = row.querySelectorAll('.continent-rank')[1]
    } else if (secCountryRank === 1) {
        selement = row.querySelectorAll('.country-rank')[1]
    } 

    if (selement) {
        selement.style.zIndex = '9999';
        selement.style.animation = 'rainbow-shadow 5s infinite linear';
    }
});





    // cool upcoming comps table
    const img = document.querySelector('#person > div:nth-child(1) > div.text-center > img');
    const wcaId = document.querySelector('#person > div:nth-child(1) > div.details > div.bootstrap-table > div.fixed-table-container > div.fixed-table-body > table > tbody > tr > td > div > div:nth-child(2) > span.value').textContent;
    console.log(wcaId);
    var token = await getToken();
    console.log(token);

    var myHeaders = new Headers();
    myHeaders.append("authorization", token);
    myHeaders.append("content-type", "application/json");

    var raw = JSON.stringify({"sqlQuery": `SELECT name AS competition, countryid, start_date AS date FROM Competitions WHERE id IN (SELECT competitionid FROM Results WHERE personid = '${wcaId}' UNION SELECT r.competition_id FROM registrations r JOIN Competitions c ON r.competition_id = c.id WHERE r.user_id = (SELECT id FROM users WHERE wca_id = '${wcaId}') AND c.start_date > CURRENT_DATE() AND r.accepted_at IS NOT NULL AND r.deleted_at IS NULL) AND start_date > CURRENT_DATE() ORDER BY start_date;`, "page": 0, "size": 100});

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res = await fetch("https://statistics-api.worldcubeassociation.org/database/query", requestOptions);
    const response = await res.json();
    if(response.content.length == 0){
      const noComps = document.createElement('h2');
      noComps.textContent = 'No Upcoming Competitions';
      noComps.style.marginBottom = '20px';
      noComps.style.textAlign = 'center';
      noComps.style.fontWeight = 'bold';
      appendTable = document.querySelector("#person > div:nth-child(1) > div.details")
      appendTable.appendChild(noComps);
    } else {
    const table = response.content.map(row => ({Competition: row[0], Country: row[1], Date: row[2]}));
    const createTable = (data) => {
        const table = document.createElement('table');
        const header = table.createTHead();
        const row = header.insertRow(0);
        Object.keys(data[0]).forEach((key) => {
            const th = document.createElement('th');
            const text = document.createTextNode(key);

            th.style.border = '2.25px solid';
            th.style.borderColor = txtColor;
            th.style.padding = '10px';
            th.style.textAlign = 'center'; // added
            th.style.fontWeight = 'bold';
            th.style.fontSize = '1.3rem';
            th.style.color = txtColor;


            th.appendChild(text);
            row.appendChild(th);
        });
        const tbody = document.createElement('tbody');
        data.forEach((rowData) => {
            const row = tbody.insertRow(-1);
            Object.values(rowData).forEach((value) => {
                const cell = row.insertCell();
                const text = document.createTextNode(value);
                cell.style.border = '2.25px solid';
                cell.style.borderColor = txtColor;
                cell.style.padding = '10px';
                cell.style.color = txtColor;
                cell.appendChild(text);
            });

        });
        table.style.border = '1px solid';
        table.style.borderColor = txtColor;
        table.style.color = bgColor;
        table.style.width = '80%';
        table.style.textAlign = 'center';
        table.style.marginLeft = 'auto';
        table.style.marginRight = 'auto';
        table.style.padding = '10px';
        const caption = table.createCaption();
        caption.textContent = 'Upcoming Competitions';
        caption.style.color = txtColor;
        caption.style.textAlign = 'center';
        caption.style.fontWeight = 'bold';
        caption.style.fontSize = '2rem';
        caption.style.marginBottom = '10px';

        table.appendChild(header); // added

        table.appendChild(tbody);
        return table;
    };


    const tableElement = createTable(table);
    tableElement.style.marginBottom = '20px';
    appendTable = document.querySelector("#person > div:nth-child(1) > div.details")
    appendTable.appendChild(tableElement);
    // console.log(table[0])
    console.table(table, ['Competition', 'Country', 'Date']);
    }

// .table>thead>tr>th {
//     vertical-align: bottom;
//     border-bottom: 2px solid #147311
// }

// .table-striped>tbody>tr:nth-of-type(odd) {
//     background-color: #000000;
// }
  }
  init()
//wca database query stuff
async function getToken() {
    const {token} = await chrome.storage.sync.get('token');
    console.log(token);

    // If token is somehow null, update it manually
    // this takes a while, so it's better to just update it in the background
    // but it's here just in case
    if (!token) {
        try {
            const bearToken = await fetch("https://algs.vercel.app/api", {
                method: 'GET',
                redirect: 'follow'
            });
            if (! bearToken.ok) {
                throw new Error(`HTTP error! status: ${
                    bearToken.status
                }`);
            }
            const newToken = await bearToken.text();
            // console.log(token);
            await chrome.storage.sync.set({'token': newToken});
            console.log(`Updated token to: ${newToken}`);
            return newToken;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    return token;
}
