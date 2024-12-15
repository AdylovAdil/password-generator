const characterAmountRange = document.getElementById('characterAmountRange');
const characterAmountNumber = document.getElementById('characterAmountNumber');
const includeUppercaseElement = document.getElementById('includeUppercase');
const includeNumbersElement = document.getElementById('includeNumbers');
const includeSymbolsElement = document.getElementById('includeSymbols');
const form = document.getElementById('passwordGeneratorForm');
const passwordDisplay = document.getElementById('passwordDisplay');
const copyButton = document.getElementById('copyButton');
const passwordStrength = document.getElementById('passwordStrength');
const passwordHistoryList = document.getElementById('passwordHistory');

const UPPERCASE_CHAR_CODES = arrayFromLowToHigh(65, 90);
const LOWERCASE_CHAR_CODES = arrayFromLowToHigh(97, 122);
const NUMBER_CHAR_CODES = arrayFromLowToHigh(48, 57);
const SYMBOL_CHAR_CODES = arrayFromLowToHigh(33, 47).concat(
  arrayFromLowToHigh(58, 64)
).concat(
  arrayFromLowToHigh(91, 96)
).concat(
  arrayFromLowToHigh(123, 126)
);

characterAmountNumber.addEventListener('input', syncCharacterAmount);
characterAmountRange.addEventListener('input', syncCharacterAmount);

form.addEventListener('submit', e => {
  e.preventDefault();
  const characterAmount = characterAmountNumber.value;
  const includeUppercase = includeUppercaseElement.checked;
  const includeNumbers = includeNumbersElement.checked;
  const includeSymbols = includeSymbolsElement.checked;
  
  if (!includeUppercase && !includeNumbers && !includeSymbols) {
    alert("Please select at least one character type (uppercase, numbers, or symbols).");
    return;
  }

  const password = generatePassword(characterAmount, includeUppercase, includeNumbers, includeSymbols);
  passwordDisplay.innerText = password;

  
  const strength = checkPasswordStrength(password);
  passwordStrength.innerText = strength;

  
  savePasswordHistory(password);
});

copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(passwordDisplay.innerText)
    
});

function generatePassword(characterAmount, includeUppercase, includeNumbers, includeSymbols) {
  let charCodes = LOWERCASE_CHAR_CODES;
  if (includeUppercase) charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
  if (includeSymbols) charCodes = charCodes.concat(SYMBOL_CHAR_CODES);
  if (includeNumbers) charCodes = charCodes.concat(NUMBER_CHAR_CODES);
  
  const passwordCharacters = [];
  for (let i = 0; i < characterAmount; i++) {
    const characterCode = charCodes[Math.floor(Math.random() * charCodes.length)];
    passwordCharacters.push(String.fromCharCode(characterCode));
  }
  return passwordCharacters.join('');
}

function arrayFromLowToHigh(low, high) {
  const array = [];
  for (let i = low; i <= high; i++) {
    array.push(i);
  }
  return array;
}

function syncCharacterAmount(e) {
  const value = e.target.value;
  characterAmountNumber.value = value;
  characterAmountRange.value = value;
}

function checkPasswordStrength(password) {
  const lengthCriteria = password.length >= 12;
  const numberCriteria = /[0-9]/.test(password);
  const uppercaseCriteria = /[A-Z]/.test(password);
  const symbolCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (lengthCriteria && numberCriteria && uppercaseCriteria && symbolCriteria) {
    return "Strong";
  } else if (lengthCriteria && (numberCriteria || uppercaseCriteria || symbolCriteria)) {
    return "Medium";
  } else {
    return "Weak";
  }
}

function savePasswordHistory(password) {
  const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
  history.push(password);
  localStorage.setItem('passwordHistory', JSON.stringify(history));

  updatePasswordHistoryList();
}

function updatePasswordHistoryList() {
  const history = JSON.parse(localStorage.getItem('passwordHistory')) || [];
  passwordHistoryList.innerHTML = '';
  history.forEach(password => {
    const listItem = document.createElement('li');
    listItem.textContent = password;
    passwordHistoryList.appendChild(listItem);
  });
}


document.addEventListener('DOMContentLoaded', updatePasswordHistoryList);
const clearHistoryButton = document.getElementById('clearHistoryButton');

clearHistoryButton.addEventListener('click', () => {
  
  localStorage.removeItem('passwordHistory');
  
  passwordHistoryList.innerHTML = '';

  alert('Password history cleared!');
});
