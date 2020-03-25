import { CustomNotation } from "../custom";

const FLAGS = [
  "\uD83C\uDDE6\uD83C\uDDEB", // Ascension Island
  "\uD83C\uDDE6\uD83C\uDDE9", // Andorra
  "\uD83C\uDDE6\uD83C\uDDEA", // United Arab Emirates
  "\uD83C\uDDE6\uD83C\uDDEB", // Afghanistan
  "\uD83C\uDDE6\uD83C\uDDEC", // Antigua & Barbuda
  "\uD83C\uDDE6\uD83C\uDDEE", // Anguilla
  "\uD83C\uDDE6\uD83C\uDDF1", // Albania
  "\uD83C\uDDE6\uD83C\uDDF2", // Armenia
  "\uD83C\uDDE6\uD83C\uDDF4", // Angola
  "\uD83C\uDDE6\uD83C\uDDF6", // Antarctica
  "\uD83C\uDDE6\uD83C\uDDF7", // Argentina
  "\uD83C\uDDE6\uD83C\uDDF8", // American Samoa
  "\uD83C\uDDE6\uD83C\uDDF9", // Austria
  "\uD83C\uDDE6\uD83C\uDDFA", // Australia
  "\uD83C\uDDE6\uD83C\uDDFC", // Aruba
  "\uD83C\uDDE6\uD83C\uDDFD", // Åland Islands
  "\uD83C\uDDE6\uD83C\uDDFF", // Azerbaijan
  "\uD83C\uDDE7\uD83C\uDDE6", // Bosnia & Herzegovina
  "\uD83C\uDDE7\uD83C\uDDE7", // Barbados
  "\uD83C\uDDE7\uD83C\uDDE9", // Bangladesh
  "\uD83C\uDDE7\uD83C\uDDEA", // Belgium
  "\uD83C\uDDE7\uD83C\uDDEB", // Burkina Faso
  "\uD83C\uDDE7\uD83C\uDDEC", // Bulgaria
  "\uD83C\uDDE7\uD83C\uDDED", // Bahrain
  "\uD83C\uDDE7\uD83C\uDDEE", // Burundi
  "\uD83C\uDDE7\uD83C\uDDEF", // Benin
  "\uD83C\uDDE7\uD83C\uDDF1", // St. Barthélemy
  "\uD83C\uDDE7\uD83C\uDDF2", // Bermuda
  "\uD83C\uDDE7\uD83C\uDDF3", // Brunei
  "\uD83C\uDDE7\uD83C\uDDF4", // Bolivia
  "\uD83C\uDDE7\uD83C\uDDF6", // Caribbean Netherlands
  "\uD83C\uDDE7\uD83C\uDDF7", // Brazil
  "\uD83C\uDDE7\uD83C\uDDF8", // Bahamas
  "\uD83C\uDDE7\uD83C\uDDF9", // Bhutan
  "\uD83C\uDDE7\uD83C\uDDFB", // Bouvet Island
  "\uD83C\uDDE7\uD83C\uDDFC", // Botswana
  "\uD83C\uDDE7\uD83C\uDDFE", // Belarus
  "\uD83C\uDDE7\uD83C\uDDFF", // Belize
  "\uD83C\uDDE8\uD83C\uDDE6", // Canada
  "\uD83C\uDDE8\uD83C\uDDE8", // Cocos (Keeling) Islands
  "\uD83C\uDDE8\uD83C\uDDE9", // Congo - Kinshasa
  "\uD83C\uDDE8\uD83C\uDDEB", // Central African Republic
  "\uD83C\uDDE8\uD83C\uDDEC", // Congo - Brazzaville
  "\uD83C\uDDE8\uD83C\uDDED", // Switzerland
  "\uD83C\uDDE8\uD83C\uDDEE", // Côte d’Ivoire
  "\uD83C\uDDE8\uD83C\uDDF0", // Cook Islands
  "\uD83C\uDDE8\uD83C\uDDF1", // Chile
  "\uD83C\uDDE8\uD83C\uDDF2", // Cameroon
  "\uD83C\uDDE8\uD83C\uDDF3", // China
  "\uD83C\uDDE8\uD83C\uDDF4", // Colombia
  "\uD83C\uDDE8\uD83C\uDDF5", // Clipperton Island
  "\uD83C\uDDE8\uD83C\uDDF7", // Costa Rica
  "\uD83C\uDDE8\uD83C\uDDFA", // Cuba
  "\uD83C\uDDE8\uD83C\uDDFB", // Cape Verde
  "\uD83C\uDDE8\uD83C\uDDFC", // Curaçao
  "\uD83C\uDDE8\uD83C\uDDFD", // Christmas Island
  "\uD83C\uDDE8\uD83C\uDDFE", // Cyprus
  "\uD83C\uDDE8\uD83C\uDDFF", // Czechia
  "\uD83C\uDDE9\uD83C\uDDEA", // Germany
  "\uD83C\uDDE9\uD83C\uDDEC", // Diego Garcia
  "\uD83C\uDDE9\uD83C\uDDEF", // Djibouti
  "\uD83C\uDDE9\uD83C\uDDF0", // Denmark
  "\uD83C\uDDE9\uD83C\uDDF2", // Dominica
  "\uD83C\uDDE9\uD83C\uDDF4", // Dominican Republic
  "\uD83C\uDDE9\uD83C\uDDFF", // Algeria
  "\uD83C\uDDEA\uD83C\uDDE6", // Ceuta & Melilla
  "\uD83C\uDDEA\uD83C\uDDE8", // Ecuador
  "\uD83C\uDDEA\uD83C\uDDEA", // Estonia
  "\uD83C\uDDEA\uD83C\uDDEC", // Egypt
  "\uD83C\uDDEA\uD83C\uDDED", // Western Sahara
  "\uD83C\uDDEA\uD83C\uDDF7", // Eritrea
  "\uD83C\uDDEA\uD83C\uDDF8", // Spain
  "\uD83C\uDDEA\uD83C\uDDF9", // Ethiopia
  "\uD83C\uDDEA\uD83C\uDDFA", // European Union
  "\uD83C\uDDEB\uD83C\uDDEE", // Finland
  "\uD83C\uDDEB\uD83C\uDDEF", // Fiji
  "\uD83C\uDDEB\uD83C\uDDF0", // Falkland Islands
  "\uD83C\uDDEB\uD83C\uDDF2", // Micronesia
  "\uD83C\uDDEB\uD83C\uDDF4", // Faroe Islands
  "\uD83C\uDDEB\uD83C\uDDF7", // France
  "\uD83C\uDDEC\uD83C\uDDE6", // Gabon
  "\uD83C\uDDEC\uD83C\uDDE7", // United Kingdom
  "\uD83C\uDDEC\uD83C\uDDE9", // Grenada
  "\uD83C\uDDEC\uD83C\uDDEA", // Georgia
  "\uD83C\uDDEC\uD83C\uDDEB", // French Guiana
  "\uD83C\uDDEC\uD83C\uDDEC", // Guernsey
  "\uD83C\uDDEC\uD83C\uDDED", // Ghana
  "\uD83C\uDDEC\uD83C\uDDEE", // Gibraltar
  "\uD83C\uDDEC\uD83C\uDDF1", // Greenland
  "\uD83C\uDDEC\uD83C\uDDF2", // Gambia
  "\uD83C\uDDEC\uD83C\uDDF3", // Guinea
  "\uD83C\uDDEC\uD83C\uDDF5", // Guadeloupe
  "\uD83C\uDDEC\uD83C\uDDF6", // Equatorial Guinea
  "\uD83C\uDDEC\uD83C\uDDF7", // Greece
  "\uD83C\uDDEC\uD83C\uDDF8", // South Georgia & South Sandwich Islands
  "\uD83C\uDDEC\uD83C\uDDF9", // Guatemala
  "\uD83C\uDDEC\uD83C\uDDFA", // Guam
  "\uD83C\uDDEC\uD83C\uDDFC", // Guinea-Bissau
  "\uD83C\uDDEC\uD83C\uDDFE", // Guyana
  "\uD83C\uDDED\uD83C\uDDF0", // Hong Kong SAR China
  "\uD83C\uDDED\uD83C\uDDF2", // Heard & McDonald Islands
  "\uD83C\uDDED\uD83C\uDDF3", // Honduras
  "\uD83C\uDDED\uD83C\uDDF7", // Croatia
  "\uD83C\uDDED\uD83C\uDDF9", // Haiti
  "\uD83C\uDDED\uD83C\uDDFA", // Hungary
  "\uD83C\uDDEE\uD83C\uDDE8", // Canary Islands
  "\uD83C\uDDEE\uD83C\uDDE9", // Indonesia
  "\uD83C\uDDEE\uD83C\uDDEA", // Ireland
  "\uD83C\uDDEE\uD83C\uDDF1", // Israel
  "\uD83C\uDDEE\uD83C\uDDF2", // Isle of Man
  "\uD83C\uDDEE\uD83C\uDDF3", // India
  "\uD83C\uDDEE\uD83C\uDDF4", // British Indian Ocean Territory
  "\uD83C\uDDEE\uD83C\uDDF6", // Iraq
  "\uD83C\uDDEE\uD83C\uDDF7", // Iran
  "\uD83C\uDDEE\uD83C\uDDF8", // Iceland
  "\uD83C\uDDEE\uD83C\uDDF9", // Italy
  "\uD83C\uDDEF\uD83C\uDDEA", // Jersey
  "\uD83C\uDDEF\uD83C\uDDF2", // Jamaica
  "\uD83C\uDDEF\uD83C\uDDF4", // Jordan
  "\uD83C\uDDEF\uD83C\uDDF5", // Japan
  "\uD83C\uDDF0\uD83C\uDDEA", // Kenya
  "\uD83C\uDDF0\uD83C\uDDEC", // Kyrgyzstan
  "\uD83C\uDDF0\uD83C\uDDED", // Cambodia
  "\uD83C\uDDF0\uD83C\uDDEE", // Kiribati
  "\uD83C\uDDF0\uD83C\uDDF2", // Comoros
  "\uD83C\uDDF0\uD83C\uDDF3", // St. Kitts & Nevis
  "\uD83C\uDDF0\uD83C\uDDF5", // North Korea
  "\uD83C\uDDF0\uD83C\uDDF7", // South Korea
  "\uD83C\uDDF0\uD83C\uDDFC", // Kuwait
  "\uD83C\uDDF0\uD83C\uDDFE", // Cayman Islands
  "\uD83C\uDDF0\uD83C\uDDFF", // Kazakhstan
  "\uD83C\uDDF1\uD83C\uDDE6", // Laos
  "\uD83C\uDDF1\uD83C\uDDE7", // Lebanon
  "\uD83C\uDDF1\uD83C\uDDE8", // St. Lucia
  "\uD83C\uDDF1\uD83C\uDDEE", // Liechtenstein
  "\uD83C\uDDF1\uD83C\uDDF0", // Sri Lanka
  "\uD83C\uDDF1\uD83C\uDDF7", // Liberia
  "\uD83C\uDDF1\uD83C\uDDF8", // Lesotho
  "\uD83C\uDDF1\uD83C\uDDF9", // Lithuania
  "\uD83C\uDDF1\uD83C\uDDFA", // Luxembourg
  "\uD83C\uDDF1\uD83C\uDDFB", // Latvia
  "\uD83C\uDDF1\uD83C\uDDFE", // Libya
  "\uD83C\uDDF2\uD83C\uDDE6", // Morocco
  "\uD83C\uDDF2\uD83C\uDDE8", // Monaco
  "\uD83C\uDDF2\uD83C\uDDE9", // Moldova
  "\uD83C\uDDF2\uD83C\uDDEA", // Montenegro
  "\uD83C\uDDF2\uD83C\uDDEB", // St. Martin
  "\uD83C\uDDF2\uD83C\uDDEC", // Madagascar
  "\uD83C\uDDF2\uD83C\uDDED", // Marshall Islands
  "\uD83C\uDDF2\uD83C\uDDF0", // North Macedonia
  "\uD83C\uDDF2\uD83C\uDDF1", // Mali
  "\uD83C\uDDF2\uD83C\uDDF2", // Myanmar (Burma)
  "\uD83C\uDDF2\uD83C\uDDF3", // Mongolia
  "\uD83C\uDDF2\uD83C\uDDF4", // Macao SAR China
  "\uD83C\uDDF2\uD83C\uDDF5", // Northern Mariana Islands
  "\uD83C\uDDF2\uD83C\uDDF6", // Martinique
  "\uD83C\uDDF2\uD83C\uDDF7", // Mauritania
  "\uD83C\uDDF2\uD83C\uDDF8", // Montserrat
  "\uD83C\uDDF2\uD83C\uDDF9", // Malta
  "\uD83C\uDDF2\uD83C\uDDFA", // Mauritius
  "\uD83C\uDDF2\uD83C\uDDFB", // Maldives
  "\uD83C\uDDF2\uD83C\uDDFC", // Malawi
  "\uD83C\uDDF2\uD83C\uDDFD", // Mexico
  "\uD83C\uDDF2\uD83C\uDDFE", // Malaysia
  "\uD83C\uDDF2\uD83C\uDDFF", // Mozambique
  "\uD83C\uDDF3\uD83C\uDDE6", // Namibia
  "\uD83C\uDDF3\uD83C\uDDE8", // New Caledonia
  "\uD83C\uDDF3\uD83C\uDDEA", // Niger
  "\uD83C\uDDF3\uD83C\uDDEB", // Norfolk Island
  "\uD83C\uDDF3\uD83C\uDDEC", // Nigeria
  "\uD83C\uDDF3\uD83C\uDDEE", // Nicaragua
  "\uD83C\uDDF3\uD83C\uDDF1", // Netherlands
  "\uD83C\uDDF3\uD83C\uDDF4", // Norway
  "\uD83C\uDDF3\uD83C\uDDF5", // Nepal
  "\uD83C\uDDF3\uD83C\uDDF7", // Nauru
  "\uD83C\uDDF3\uD83C\uDDFA", // Niue
  "\uD83C\uDDF3\uD83C\uDDFF", // New Zealand
  "\uD83C\uDDF4\uD83C\uDDF2", // Oman
  "\uD83C\uDDF5\uD83C\uDDE6", // Panama
  "\uD83C\uDDF5\uD83C\uDDEA", // Peru
  "\uD83C\uDDF5\uD83C\uDDEB", // French Polynesia
  "\uD83C\uDDF5\uD83C\uDDEC", // Papua New Guinea
  "\uD83C\uDDF5\uD83C\uDDED", // Philippines
  "\uD83C\uDDF5\uD83C\uDDF0", // Pakistan
  "\uD83C\uDDF5\uD83C\uDDF1", // Poland
  "\uD83C\uDDF5\uD83C\uDDF2", // St. Pierre & Miquelon
  "\uD83C\uDDF5\uD83C\uDDF3", // Pitcairn Islands
  "\uD83C\uDDF5\uD83C\uDDF7", // Puerto Rico
  "\uD83C\uDDF5\uD83C\uDDF8", // Palestinian Territories
  "\uD83C\uDDF5\uD83C\uDDF9", // Portugal
  "\uD83C\uDDF5\uD83C\uDDFC", // Palau
  "\uD83C\uDDF5\uD83C\uDDFE", // Paraguay
  "\uD83C\uDDF6\uD83C\uDDE6", // Qatar
  "\uD83C\uDDF7\uD83C\uDDEA", // Réunion
  "\uD83C\uDDF7\uD83C\uDDF4", // Romania
  "\uD83C\uDDF7\uD83C\uDDF8", // Serbia
  "\uD83C\uDDF7\uD83C\uDDFA", // Russia
  "\uD83C\uDDF7\uD83C\uDDFC", // Rwanda
  "\uD83C\uDDF8\uD83C\uDDE6", // Saudi Arabia
  "\uD83C\uDDF8\uD83C\uDDE7", // Solomon Islands
  "\uD83C\uDDF8\uD83C\uDDE8", // Seychelles
  "\uD83C\uDDF8\uD83C\uDDE9", // Sudan
  "\uD83C\uDDF8\uD83C\uDDEA", // Sweden
  "\uD83C\uDDF8\uD83C\uDDEC", // Singapore
  "\uD83C\uDDF8\uD83C\uDDED", // St. Helena
  "\uD83C\uDDF8\uD83C\uDDEE", // Slovenia
  "\uD83C\uDDF8\uD83C\uDDEF", // Svalbard & Jan Mayen
  "\uD83C\uDDF8\uD83C\uDDF0", // Slovakia
  "\uD83C\uDDF8\uD83C\uDDF1", // Sierra Leone
  "\uD83C\uDDF8\uD83C\uDDF2", // San Marino
  "\uD83C\uDDF8\uD83C\uDDF3", // Senegal
  "\uD83C\uDDF8\uD83C\uDDF4", // Somalia
  "\uD83C\uDDF8\uD83C\uDDF7", // Suriname
  "\uD83C\uDDF8\uD83C\uDDF8", // South Sudan
  "\uD83C\uDDF8\uD83C\uDDF9", // São Tomé & Príncipe
  "\uD83C\uDDF8\uD83C\uDDFB", // El Salvador
  "\uD83C\uDDF8\uD83C\uDDFD", // Sint Maarten
  "\uD83C\uDDF8\uD83C\uDDFE", // Syria
  "\uD83C\uDDF8\uD83C\uDDFF", // Eswatini
  "\uD83C\uDDF9\uD83C\uDDE6", // Tristan da Cunha
  "\uD83C\uDDF9\uD83C\uDDE8", // Turks & Caicos Islands
  "\uD83C\uDDF9\uD83C\uDDE9", // Chad
  "\uD83C\uDDF9\uD83C\uDDEB", // French Southern Territories
  "\uD83C\uDDF9\uD83C\uDDEC", // Togo
  "\uD83C\uDDF9\uD83C\uDDED", // Thailand
  "\uD83C\uDDF9\uD83C\uDDEF", // Tajikistan
  "\uD83C\uDDF9\uD83C\uDDF0", // Tokelau
  "\uD83C\uDDF9\uD83C\uDDF1", // Timor-Leste
  "\uD83C\uDDF9\uD83C\uDDF2", // Turkmenistan
  "\uD83C\uDDF9\uD83C\uDDF3", // Tunisia
  "\uD83C\uDDF9\uD83C\uDDF4", // Tonga
  "\uD83C\uDDF9\uD83C\uDDF7", // Turkey
  "\uD83C\uDDF9\uD83C\uDDF9", // Trinidad & Tobago
  "\uD83C\uDDF9\uD83C\uDDFB", // Tuvalu
  "\uD83C\uDDF9\uD83C\uDDFC", // Taiwan
  "\uD83C\uDDF9\uD83C\uDDFF", // Tanzania
  "\uD83C\uDDFA\uD83C\uDDE6", // Ukraine
  "\uD83C\uDDFA\uD83C\uDDEC", // Uganda
  "\uD83C\uDDFA\uD83C\uDDF2", // U.S. Outlying Islands
  "\uD83C\uDDFA\uD83C\uDDF3", // United Nations
  "\uD83C\uDDFA\uD83C\uDDF8", // United States
  "\uD83C\uDDFA\uD83C\uDDFE", // Uruguay
  "\uD83C\uDDFA\uD83C\uDDFF", // Uzbekistan
  "\uD83C\uDDFB\uD83C\uDDE6", // Vatican City
  "\uD83C\uDDFB\uD83C\uDDE8", // St. Vincent & Grenadines
  "\uD83C\uDDFB\uD83C\uDDEA", // Venezuela
  "\uD83C\uDDFB\uD83C\uDDEC", // British Virgin Islands
  "\uD83C\uDDFB\uD83C\uDDEE", // U.S. Virgin Islands
  "\uD83C\uDDFB\uD83C\uDDF3", // Vietnam
  "\uD83C\uDDFB\uD83C\uDDFA", // Vanuatu
  "\uD83C\uDDFC\uD83C\uDDEB", // Wallis & Futuna
  "\uD83C\uDDFC\uD83C\uDDF8", // Samoa
  "\uD83C\uDDFD\uD83C\uDDF0", // Kosovo
  "\uD83C\uDDFE\uD83C\uDDEA", // Yemen
  "\uD83C\uDDFE\uD83C\uDDF9", // Mayotte
  "\uD83C\uDDFF\uD83C\uDDE6", // South Africa
  "\uD83C\uDDFF\uD83C\uDDF2", // Zambia
  "\uD83C\uDDFF\uD83C\uDDFC"  // Zimbabwe
];

export class FlagsNotation extends CustomNotation {
  constructor() {
    super(FLAGS);
  }
  
  public get name(): string {
    return "Flags";
  }
}
