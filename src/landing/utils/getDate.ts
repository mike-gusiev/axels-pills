import i18n from '../../i18n';

const date = new Date();

const day = date.getDate();
const monthInNumbers = date.getMonth() + 1;

export function getDate(): string {
  const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const monthKey = monthKeys[monthInNumbers - 1];
  const monthName = i18n.t(`months.${monthKey}`);

  return `${day} ${monthName}`;
}
