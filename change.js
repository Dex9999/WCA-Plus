const init = function(){
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

      console.log(elements[0])
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
}
init();

// .table>thead>tr>th {
//     vertical-align: bottom;
//     border-bottom: 2px solid #147311
// }

// .table-striped>tbody>tr:nth-of-type(odd) {
//     background-color: #000000;
// }