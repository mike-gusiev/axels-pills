const date = new Date();

const day = date.getDate();
const monthInNumbers = date.getMonth() + 1;

export function getDate() : string {
  switch(monthInNumbers) {
    case 1:
      return `${day} січня`;
    case 2:
      return `${day} лютого`;
    case 3:
      return `${day} березня`;
    case 4:
      return `${day} квітня`;
    case 5:
      return `${day} травня`;
    case 6:
      return `${day} червня`;
    case 7:
      return `${day} липня`;
    case 8:
      return `${day} серпня`;
    case 9:
      return `${day} вересня`;
    case 10:
      return `${day} жовтня`;
    case 11:
      return `${day} листопада`;
    case 12:
      return `${day} грудня`;
    default:
      return `${day}`;
  }
}