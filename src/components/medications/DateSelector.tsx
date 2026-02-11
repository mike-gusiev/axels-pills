import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-dark.css';

interface DateSelectorProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const DateSelector = ({ selectedDate, setSelectedDate }: DateSelectorProps) => {
  const { t } = useTranslation();

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = t('_locale', 'uk-UA');
    return d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        <span className="text-sm text-gray-700 dark:text-white">
          {t('home.medications.date')}:
        </span>
        <span className="text-sm text-blue-600">
          {formatDate(selectedDate)}
        </span>
      </div>

      <div className="w-full sm:max-w-[300px]">
        <DatePicker
          selected={new Date(selectedDate)}
          onChange={(date: Date | null) => {
            if (date) {
              const y = date.getFullYear();
              const m = String(date.getMonth() + 1).padStart(2, '0');
              const d = String(date.getDate()).padStart(2, '0');
              setSelectedDate(`${y}-${m}-${d}`);
            }
          }}
          inline
          calendarClassName="w-full"
        />
      </div>
    </div>
  );
};

export default DateSelector;
