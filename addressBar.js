chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    var args = text.split(' ');
    var description = args.length > 3 ? "Too many inputs (max 3)" : "Rankings Command Format: event, region, type";
    chrome.omnibox.setDefaultSuggestion({description: description});

    var suggestions = [
        {
            content: 'person '+(args[1] || ''),
            description: "Go to a Person by WCA ID: "+(args[1]||'')
        },
        {
            content: 'search '+(args[1]||''),
            description: "Search Command: search "+(args[1]||'')
        },
        {
            content: "stats",
            description: "Statistics Page Command: stats"
        },
        {
            content: "comps",
            description: "Comps Page Command: comps"
        },
        {
            content: "live",
            description: "Live Command: live"
        },
        {
            content: "forum",
            description: "Forum Command: forum"
        },
        {
            content: "regs",
            description: "Regulations Command: regs"
        }
    ];

    // Sort suggestions based on relevance
    suggestions.sort((a, b) => {
        var relevanceA = a.description.toLowerCase().indexOf(text.toLowerCase());
        var relevanceB = b.description.toLowerCase().indexOf(text.toLowerCase());
        return relevanceB - relevanceA;
    });

    suggest(suggestions);
});


chrome.omnibox.onInputEntered.addListener(async (text) => {
    var request = text.split(' ')
    var link = ''
    if (text.startsWith('stat')) {
        chrome.tabs.update({url: 'https://statistics.worldcubeassociation.org/'});
        return;
    } else if (text.startsWith('comp')) {
        chrome.tabs.update({url: 'https://www.worldcubeassociation.org/competitions'});
        return;
    } else if (text.startsWith('live')) {
        chrome.tabs.update({url: 'https://live.worldcubeassociation.org/'});
        return;
    } else if (text.startsWith('forum')) {
        chrome.tabs.update({url: 'https://forum.worldcubeassociation.org'});
        return;
    } else if (text.startsWith('reg')) {
        chrome.tabs.update({url: 'https://www.worldcubeassociation.org/regulations/'});
        return;
    } else if (text.startsWith('person')) {
        chrome.tabs.update({url: 'https://www.worldcubeassociation.org/persons/'+request[1]});
        return;
    } else if (text.startsWith('search')) {
        chrome.tabs.update({url: 'https://www.worldcubeassociation.org/search?q='+request[1]});
        return;
    } else if (text) {
        if (request.length == 3) {
            link = await searchWca(request[0].toLowerCase(), request[1].toLowerCase(), request[2].toLowerCase())
            console.log(link.toString())
            chrome.tabs.update({url: link});
        } else if (request.length == 2) {
            link = await searchWca(request[0].toLowerCase(), request[1].toLowerCase())
            console.log(link.toString())
            chrome.tabs.update({url: link});
        } else if (request.length == 1) {
            link = await searchWca(request[0].toLowerCase())
            console.log(link.toString())
            chrome.tabs.update({url: link});
        } else {
            link = 'https://www.worldcubeassociation.org/results/rankings/'
            // chrome.tabs.update({ url: link });
        }
    }
});

// don't worry about all this, just definition tables
// and a small function for making the url

async function searchWca(event, region, type) {
    const conversions = {
        '3x3': '333',
        '3': '333',
        '3by3': '333',
        '3x3x3 cube': '333',
        '33': '333',
        'three': '333',
        '3x3x3': '333',
        '333': '333',
        'clock': 'clock',
        'clk': 'clock',
        'c': 'clock',
        '🕰️': 'clock',
        '🎛️': 'clock',
        '2': '222',
        '2x2': '222',
        '222': '222',
        '3bld': '333bf',
        '3x3blind': '333bf',
        '3blind': '333bf',
        '3x3bld': '333bf',
        'b': '333bf',
        '333bf': '333bf',
        '4bld': '444bf',
        '4x4blind': '444bf',
        '4blind': '444bf',
        '444bf': '444bf',
        'iv': '444bf',
        '5bld': '555bf',
        '5x5blind': '555bf',
        '5blind': '555bf',
        'v': '555bf',
        '5x5bld': '555bf',
        '555bf': '555bf',
        'oh': '333oh',
        'onehanded': '333oh',
        'one-handed': '333oh',
        'one': '333oh',
        'o': '333oh',
        '333oh': '333oh',
        'a': 'average',
        'average': 'average',
        's': 'single',
        'single': 'single',
        'avg': 'average',
        'sin': 'single',
        '1': 'single',
        'pyra': 'pyram',
        'py': 'pyram',
        'p': 'pyram',
        'pyraminx': 'pyram',
        'pyram': 'pyram',
        '4x4': '444',
        '444': '444',
        '5': '555',
        '555': '555',
        '6': '666',
        '666': '666',
        '7': '777',
        '777': '777',
        'fmc': '333fm',
        'f': '333fm',
        'fm': '333fm',
        'megaminx': 'minx',
        'minx': 'minx',
        'm': 'minx',
        'mega': 'minx',
        'skub': 'skewb',
        'skewb': 'skewb',
        'sk': 'skewb',
        's': 'sq1',
        'sq1': 'sq1',
        'q': 'skewb',
        'k': 'skewb',
        'sq': 'sq1',
        'squan': 'sq1',
        'square': 'sq1',
        'square-1': 'sq1',
        'multi': '333mbf',
        '333mbf': '333mbf',
        'mbf': '333mbf',
        'mbld': '333mbf',
        'multi-blind': '333mbf',
        'e': '333mbf',
        'i': '333mbf',

        'ft': '333ft',
        '333fm': '333fm',
        'feet': '333ft',
        '333ft': '333ft',
        'magick': 'magic',
        'mgc': 'magic',
        'magic': 'magic',
        'mg': 'magic',
        'mm': 'mmagic',
        'mmagic': 'mmagic',
        'master': 'mmagic',
        'mastermagic': 'mmagic'
    };

    function getCountryName(iso2) {
        const countries = {
            "AD": "Andorra",
            "AE": "United Arab Emirates",
            "AF": "Afghanistan",
            "AG": "Antigua and Barbuda",
            "AI": "Anguilla",
            "AL": "Albania",
            "AM": "Armenia",
            "AO": "Angola",
            "AQ": "Antarctica",
            "AR": "Argentina",
            "AS": "American Samoa",
            "AT": "Austria",
            "AU": "Australia",
            "AW": "Aruba",
            "AX": "Aland Islands",
            "AZ": "Azerbaijan",
            "BA": "Bosnia and Herzegovina",
            "BB": "Barbados",
            "BD": "Bangladesh",
            "BE": "Belgium",
            "BF": "Burkina Faso",
            "BG": "Bulgaria",
            "BH": "Bahrain",
            "BI": "Burundi",
            "BJ": "Benin",
            "BL": "Saint Barthelemy",
            "BM": "Bermuda",
            "BN": "Brunei",
            "BO": "Bolivia",
            "BQ": "Bonaire, Saint Eustatius and Saba ",
            "BR": "Brazil",
            "BS": "Bahamas",
            "BT": "Bhutan",
            "BV": "Bouvet Island",
            "BW": "Botswana",
            "BY": "Belarus",
            "BZ": "Belize",
            "CA": "Canada",
            "CC": "Cocos Islands",
            "CD": "Democratic Republic of the Congo",
            "CF": "Central African Republic",
            "CG": "Republic of the Congo",
            "CH": "Switzerland",
            "CI": "Ivory Coast",
            "CK": "Cook Islands",
            "CL": "Chile",
            "CM": "Cameroon",
            "CN": "China",
            "CO": "Colombia",
            "CR": "Costa Rica",
            "CU": "Cuba",
            "CV": "Cape Verde",
            "CW": "Curacao",
            "CX": "Christmas Island",
            "CY": "Cyprus",
            "CZ": "Czech Republic",
            "DE": "Germany",
            "DJ": "Djibouti",
            "DK": "Denmark",
            "DM": "Dominica",
            "DO": "Dominican Republic",
            "DZ": "Algeria",
            "EC": "Ecuador",
            "EE": "Estonia",
            "EG": "Egypt",
            "EH": "Western Sahara",
            "ER": "Eritrea",
            "ES": "Spain",
            "ET": "Ethiopia",
            "FI": "Finland",
            "FJ": "Fiji",
            "FK": "Falkland Islands",
            "FM": "Micronesia",
            "FO": "Faroe Islands",
            "FR": "France",
            "GA": "Gabon",
            "GB": "United Kingdom",
            "GD": "Grenada",
            "GE": "Georgia",
            "GF": "French Guiana",
            "GG": "Guernsey",
            "GH": "Ghana",
            "GI": "Gibraltar",
            "GL": "Greenland",
            "GM": "Gambia",
            "GN": "Guinea",
            "GP": "Guadeloupe",
            "GQ": "Equatorial Guinea",
            "GR": "Greece",
            "GS": "South Georgia and the South Sandwich Islands",
            "GT": "Guatemala",
            "GU": "Guam",
            "GW": "Guinea-Bissau",
            "GY": "Guyana",
            "HK": "Hong Kong",
            "HM": "Heard Island and McDonald Islands",
            "HN": "Honduras",
            "HR": "Croatia",
            "HT": "Haiti",
            "HU": "Hungary",
            "ID": "Indonesia",
            "IE": "Ireland",
            "IL": "Israel",
            "IM": "Isle of Man",
            "IN": "India",
            "IO": "British Indian Ocean Territory",
            "IQ": "Iraq",
            "IR": "Iran",
            "IS": "Iceland",
            "IT": "Italy",
            "JE": "Jersey",
            "JM": "Jamaica",
            "JO": "Jordan",
            "JP": "Japan",
            "KE": "Kenya",
            "KG": "Kyrgyzstan",
            "KH": "Cambodia",
            "KI": "Kiribati",
            "KM": "Comoros",
            "KN": "Saint Kitts and Nevis",
            "KP": "North Korea",
            "KR": "South Korea",
            "KW": "Kuwait",
            "KY": "Cayman Islands",
            "KZ": "Kazakhstan",
            "LA": "Laos",
            "LB": "Lebanon",
            "LC": "Saint Lucia",
            "LI": "Liechtenstein",
            "LK": "Sri Lanka",
            "LR": "Liberia",
            "LS": "Lesotho",
            "LT": "Lithuania",
            "LU": "Luxembourg",
            "LV": "Latvia",
            "LY": "Libya",
            "MA": "Morocco",
            "MC": "Monaco",
            "MD": "Moldova",
            "ME": "Montenegro",
            "MF": "Saint Martin",
            "MG": "Madagascar",
            "MH": "Marshall Islands",
            "MK": "Macedonia",
            "ML": "Mali",
            "MM": "Myanmar",
            "MN": "Mongolia",
            "MO": "Macao",
            "MP": "Northern Mariana Islands",
            "MQ": "Martinique",
            "MR": "Mauritania",
            "MS": "Montserrat",
            "MT": "Malta",
            "MU": "Mauritius",
            "MV": "Maldives",
            "MW": "Malawi",
            "MX": "Mexico",
            "MY": "Malaysia",
            "MZ": "Mozambique",
            "NA": "Namibia",
            "NC": "New Caledonia",
            "NE": "Niger",
            "NF": "Norfolk Island",
            "NG": "Nigeria",
            "NI": "Nicaragua",
            "NL": "Netherlands",
            "NO": "Norway",
            "NP": "Nepal",
            "NR": "Nauru",
            "NU": "Niue",
            "NZ": "New Zealand",
            "OM": "Oman",
            "PA": "Panama",
            "PE": "Peru",
            "PF": "French Polynesia",
            "PG": "Papua New Guinea",
            "PH": "Philippines",
            "PK": "Pakistan",
            "PL": "Poland",
            "PM": "Saint Pierre and Miquelon",
            "PN": "Pitcairn",
            "PR": "Puerto Rico",
            "PS": "Palestinian Territory",
            "PT": "Portugal",
            "PW": "Palau",
            "PY": "Paraguay",
            "QA": "Qatar",
            "RE": "Reunion",
            "RO": "Romania",
            "RS": "Serbia",
            "RU": "Russia",
            "RW": "Rwanda",
            "SA": "Saudi Arabia",
            "SB": "Solomon Islands",
            "SC": "Seychelles",
            "SD": "Sudan",
            "SE": "Sweden",
            "SG": "Singapore",
            "SH": "Saint Helena",
            "SI": "Slovenia",
            "SJ": "Svalbard and Jan Mayen",
            "SK": "Slovakia",
            "SL": "Sierra Leone",
            "SM": "San Marino",
            "SN": "Senegal",
            "SO": "Somalia",
            "SR": "Suriname",
            "SS": "South Sudan",
            "ST": "Sao Tome and Principe",
            "SV": "El Salvador",
            "SX": "Sint Maarten",
            "SY": "Syria",
            "SZ": "Swaziland",
            "TC": "Turks and Caicos Islands",
            "TD": "Chad",
            "TF": "French Southern Territories",
            "TG": "Togo",
            "TH": "Thailand",
            "TJ": "Tajikistan",
            "TK": "Tokelau",
            "TL": "East Timor",
            "TM": "Turkmenistan",
            "TN": "Tunisia",
            "TO": "Tonga",
            "TR": "Turkey",
            "TT": "Trinidad and Tobago",
            "TV": "Tuvalu",
            "TW": "Taiwan",
            "TZ": "Tanzania",
            "UA": "Ukraine",
            "UG": "Uganda",
            "UM": "United States Minor Outlying Islands",
            "US": "United States",
            "UY": "Uruguay",
            "UZ": "Uzbekistan",
            "VA": "Vatican",
            "VC": "Saint Vincent and the Grenadines",
            "VE": "Venezuela",
            "VG": "British Virgin Islands",
            "VI": "U.S. Virgin Islands",
            "VN": "Vietnam",
            "VU": "Vanuatu",
            "WF": "Wallis and Futuna",
            "WS": "Samoa",
            "XK": "Kosovo",
            "YE": "Yemen",
            "YT": "Mayotte",
            "ZA": "South Africa",
            "ZM": "Zambia",
            "ZW": "Zimbabwe",

            "XF": "_Africa",
            "XM": "_Americas",
            "XA": "_Asia",
            "XE": "_Europe",
            "XN": "_North America",
            "XO": "_Oceania",
            "XS": "_South America",
            "XW": "world",
            "WORLD": "world",
            "ALL": "world",

            'A': 'average',
            'AVERAGE': 'average',
            'S': 'single',
            'SINGLE': 'single',
            'AVG': 'average',
            'SIN': 'single',
            '1': 'single'
        }
        return countries[iso2];
    }

    // type = capital(res.query.id) || 'average'
    var parsedEvent = conversions[event] || '333'
    var parsedRegion = region ? getCountryName(region.toUpperCase()) : 'world'
    var parsedType = 'average'

    if (parsedRegion == 'single' || parsedRegion == 'average') {
        parsedType = parsedRegion
        parsedRegion = 'world'
    } else {
        parsedType = conversions[type] || 'average'
    }

    if (parsedEvent == 'single' || parsedEvent == 'average') {
        parsedType = parsedEvent
        parsedEvent = '333'
    }

    var baseUrl = `https://www.worldcubeassociation.org/results/rankings/${parsedEvent}/${parsedType}?region=${parsedRegion}`
    // console.log(event,region,type)
    return baseUrl

}

chrome.alarms.onAlarm.addListener(async a => {
    console.log('Token Automatically Updated!', a);
    // cool token stuff
    await updateToken();
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get('alarm', async a => {
        if (!a) {
            chrome.alarms.create('alarm', {periodInMinutes: 110}); // 110
            // await updateToken();
        }
    });
});

chrome.windows.onCreated.addListener(async function(window) {
  console.log('New window created!', window);
  await updateToken();
});

async function updateToken() {
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
        const token = await bearToken.text();
        // console.log(token);
        await chrome.storage.sync.set({'token': token});
        console.log(`Updated token to: ${token}`);
    } catch (error) {
        console.error(error);
    }
}