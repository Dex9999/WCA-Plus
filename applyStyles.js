const go = async function() {
  //override styles, takes a sec to load
  //for user customization
  //fuked rn

  const bod = document.body.style;
  bod.backgroundImage = "none !important";
  bod.backgroundColor = '#2c2c2c';
  deleteRule('body');
}
go()

function deleteRule(selectorText) {
  // Get all the stylesheets on the page
  const styleSheets = document.styleSheets;

  // Loop through each stylesheet
  for (let i = 0; i < styleSheets.length; i++) {
    // Get the stylesheet's rules
    const rules = styleSheets[i].cssRules;

    // Loop through each rule
    for (let j = 0; j < rules.length; j++) {
      // If the rule matches the selector text, delete it
      if (rules[j].selectorText === selectorText) {
        styleSheets[i].deleteRule(j);
        return true;
      }
    }
  }

  return false;
}

