const init = async function(){
  const style = document.createElement('style');
  //gets rid of the pesky border around personal records
  //
  style.textContent = `
    @media screen and (max-width: 2000px) {
      .table-responsive {
          border: 1px solid transparent;
      }

    .table>thead>tr>th,.table>thead>tr>td,.table>tbody>tr>th,.table>tbody>tr>td,.table>tfoot>tr>th,.table>tfoot>tr>td {
        border-top: 1px solid transparent;
    }
    .table>thead>tr>th {
        vertical-align: bottom;
        border-bottom: 0px solid transparent;
    }
  }`;
  document.head.appendChild(style);
  // table,#person table,table.wca-results {
  //     background-color: #ab303000
  // }

//bottom of page text
const injectElement = document.createElement('div');
injectElement.className = 'lol-element';
injectElement.innerHTML = 'Yo whaddup 😎'

document.body.appendChild(injectElement);
let elements = document.getElementsByClassName("world-rank ")
Array.from(elements).forEach(element => {
    let ele = parseInt(element.innerHTML)
    if (ele < 20) {
      element.style.backgroundColor = '#bf8c00';
      if (ele == 1) {
          element.style.color = '#FFFFFF'
      }
    } else if (ele > 20 && ele < 50) {
        element.style.backgroundColor = '#7d7d7d';
    } else if (ele > 50 && ele < 100) {
        element.style.backgroundColor = '#a05d00';
    }
  });
    const bod = document.body.style;
    bod.backgroundImage = 'linear-gradient(#a349d1, #ff7000)';
    bod.backgroundColor = '#FF7000';
    bod.height = '100vh';
    bod.margin = '0';
    bod.backgroundRepeat = 'no-repeat';
    bod.backgroundAttachment = 'fixed';

  // console.log(elements[0])
  let firstElement = elements[0]
  chrome.storage.sync.set({ "rank": firstElement.innerHTML }) 
  //test
  const rows = document.querySelectorAll('#person > div.personal-records > div > table > tbody > tr');
  for (let i = 0; i < rows.length; i++) {
    if (i % 2 === 0) {
      rows[i].style.background = 'linear-gradient(#a349d1, #ff7000)';
    } else {
      rows[i].style.background = 'linear-gradient(#a349d1, #189ad3)';
    }
  }



  const profileRow = document.querySelector('#person > div:nth-child(1) > div.details > div.bootstrap-table > div.fixed-table-container > div.fixed-table-body > table > tbody > tr');
  profileRow.style.background = 'linear-gradient(315deg, #550577, #5400FF'
    
//cool upcoming comps
const img = document.querySelector('#person > div:nth-child(1) > div.text-center > img');
const wcaId = document.querySelector("#person > div:nth-child(1) > div.details > div.bootstrap-table > div.fixed-table-container > div.fixed-table-body > table > tbody > tr > td:nth-child(2)").textContent;

console.log(wcaId)

var tokenOptions = {
  method: 'GET',
  redirect: 'follow'
};

var bearToken = await fetch("https://algs.vercel.app/api", tokenOptions)
let token = await (await bearToken.text()).toString();
console.log(token)
var myHeaders = new Headers();
myHeaders.append("authorization", token);
myHeaders.append("content-type", "application/json");

var raw = JSON.stringify({
  "sqlQuery": `SELECT name AS competition, countryid, start_date AS date FROM Competitions WHERE id IN (SELECT competitionid FROM Results WHERE personid = '${wcaId}' UNION SELECT r.competition_id FROM registrations r JOIN Competitions c ON r.competition_id = c.id WHERE r.user_id = (SELECT id FROM users WHERE wca_id = '${wcaId}') AND c.start_date > CURRENT_DATE() AND r.accepted_at IS NOT NULL AND r.deleted_at IS NULL) AND start_date > CURRENT_DATE() ORDER BY start_date;`,
  "page": 0,
  "size": 100
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

const res = await fetch("https://statistics-api.worldcubeassociation.org/database/query", requestOptions);
const response = await res.json();
console.log(response)
const table = response.content.map(row => ({
  Competition: row[0],
  Country: row[1],
  Date: row[2]
}));
const createTable = (data) => {
  const table = document.createElement('table');
  const header = table.createTHead();
  const row = header.insertRow(0);
  Object.keys(data[0]).forEach((key) => {
    const th = document.createElement('th');
    const text = document.createTextNode(key);

    th.style.border = '2.25px solid';
    th.style.borderColor = '#AD91FF';
    th.style.padding = '10px';
    th.style.textAlign = 'center'; // added
    th.style.fontWeight = 'bold';
    th.style.fontSize = '1.3rem';

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
      cell.style.borderColor = '#AD91FF';
      cell.style.padding = '10px';
      cell.appendChild(text);
    });
    
  });
  table.style.border = '1px solid';
  table.style.borderColor = '#AD91FF';
  table.style.color = '#000000';
  table.style.width = '80%';
  table.style.textAlign = 'center';
  table.style.marginLeft = 'auto';
  table.style.marginRight = 'auto';
  table.style.padding = '10px';
  // table.style.backgroundColor = '#2a2c30';
  const caption = table.createCaption();
  caption.textContent = 'Upcoming Competitions';
  caption.style.color = 'black';
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



// img.appendChild(upcomingComps);

//get token




}
init();

// .table>thead>tr>th {
//     vertical-align: bottom;
//     border-bottom: 2px solid #147311
// }

// .table-striped>tbody>tr:nth-of-type(odd) {
//     background-color: #000000;
// }