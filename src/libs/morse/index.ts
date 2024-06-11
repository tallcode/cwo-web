import morseCode from './map'

export default function (text: string) {
  return text.toUpperCase().split('').map(char => morseCode[char] || '').join(' ')
}
