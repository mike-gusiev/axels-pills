import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Trash2, User, Pill, Clock, CheckCircle, Calendar, AlertTriangle, Package, } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
const MedicationSystem = () => {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState('patients');
    const [patients, setPatients] = useState([
        {
            id: '1',
            name: 'Иванов И.И.',
            medications: [
                {
                    id: '1',
                    name: 'Аспирин',
                    morning: true,
                    afternoon: false,
                    evening: true,
                    pillsRemaining: 45,
                },
                {
                    id: '2',
                    name: 'Витамин D',
                    morning: true,
                    afternoon: false,
                    evening: false,
                    pillsRemaining: 12,
                },
            ],
        },
        {
            id: '2',
            name: 'Петрова А.С.',
            medications: [
                {
                    id: '3',
                    name: 'Омега-3',
                    morning: true,
                    afternoon: true,
                    evening: false,
                    pillsRemaining: 28,
                },
                {
                    id: '4',
                    name: 'Магний',
                    morning: false,
                    afternoon: false,
                    evening: true,
                    pillsRemaining: 8,
                },
                {
                    id: '5',
                    name: 'Кальций',
                    morning: true,
                    afternoon: false,
                    evening: true,
                    pillsRemaining: 35,
                },
            ],
        },
    ]);
    const [newPatientName, setNewPatientName] = useState('');
    const [newMedication, setNewMedication] = useState('');
    const [newMedicationPills, setNewMedicationPills] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [medsFS, setMedsFS] = useState([]);
    useEffect(() => {
        if (!user)
            return;
        const unsub = onSnapshot(collection(db, `users/${user.uid}/medications`), (snapshot) => {
            const medications = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));
            setMedsFS(medications);
        });
        return () => unsub();
    }, [user]);
    const todayISO = () => {
        const d = new Date();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };
    const [selectedDate, setSelectedDate] = useState(todayISO());
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffInDays = (a, b) => {
        const A = startOfDay(a).getTime();
        const B = startOfDay(b).getTime();
        return Math.round((A - B) / (1000 * 60 * 60 * 24));
    };
    const dailyFor = (m) => (m.morning ? 1 : 0) + (m.afternoon ? 1 : 0) + (m.evening ? 1 : 0);
    const pillsAtDate = (m, asOfISO) => {
        const daily = dailyFor(m);
        if (!daily)
            return Infinity;
        const today = new Date();
        const asOf = new Date(asOfISO);
        const forward = Math.max(0, diffInDays(asOf, today));
        const projected = m.pillsRemaining - daily * forward;
        return Math.max(0, projected);
    };
    const daysRemainingAt = (m, asOfISO) => {
        const daily = dailyFor(m);
        if (!daily)
            return Infinity;
        const pills = pillsAtDate(m, asOfISO);
        if (pills === Infinity)
            return Infinity;
        return Math.floor(pills / daily);
    };
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 86400000); // 24h
        return () => clearInterval(timer);
    }, []);
    const addPatient = () => {
        if (newPatientName.trim()) {
            const newPatient = {
                id: Date.now().toString(),
                name: newPatientName,
                medications: [],
            };
            setPatients((prev) => [...prev, newPatient]);
            setNewPatientName('');
        }
    };
    const addMedication = (patientId) => {
        if (newMedication.trim() && newMedicationPills) {
            setPatients((prev) => prev.map((patient) => patient.id === patientId
                ? {
                    ...patient,
                    medications: [
                        ...patient.medications,
                        {
                            id: Date.now().toString(), // Changed from number to string
                            name: newMedication,
                            morning: false,
                            afternoon: false,
                            evening: false,
                            pillsRemaining: parseInt(newMedicationPills, 10),
                        },
                    ],
                }
                : patient));
            setNewMedication('');
            setNewMedicationPills('');
        }
    };
    const removeMedication = (patientId, medicationId) => {
        setPatients((prev) => prev.map((patient) => patient.id === patientId
            ? {
                ...patient,
                medications: patient.medications.filter((med) => med.id !== medicationId),
            }
            : patient));
    };
    const toggleSchedule = (patientId, medicationId, timeOfDay) => {
        setPatients((prev) => prev.map((patient) => patient.id === patientId
            ? {
                ...patient,
                medications: patient.medications.map((med) => med.id === medicationId
                    ? { ...med, [timeOfDay]: !med[timeOfDay] }
                    : med),
            }
            : patient));
    };
    const removePatient = (patientId) => {
        setPatients((prev) => prev.filter((patient) => patient.id !== patientId));
    };
    const getScheduleText = (medication) => {
        const times = [];
        if (medication.morning)
            times.push('вранці');
        if (medication.afternoon)
            times.push('вдень');
        if (medication.evening)
            times.push('ввечері');
        return times.length > 0 ? times.join(', ') : 'не назначено';
    };
    const getDailyConsumption = (medication) => {
        let daily = 0;
        if (medication.morning)
            daily++;
        if (medication.afternoon)
            daily++;
        if (medication.evening)
            daily++;
        return daily;
    };
    const getDaysRemaining = (medication) => {
        const daily = getDailyConsumption(medication);
        return daily > 0 ? Math.floor(medication.pillsRemaining / daily) : Infinity;
    };
    const getAllMedications = (asOfISO) => {
        return medsFS.map((m) => {
            const daily = (m.morning ? 1 : 0) + (m.afternoon ? 1 : 0) + (m.evening ? 1 : 0);
            const pills = pillsAtDate(m, asOfISO);
            const days = pills === Infinity
                ? Infinity
                : Math.floor(pills / (daily || 1));
            return {
                id: m.id,
                name: m.name,
                totalPills: pills === Infinity ? 0 : pills,
                patients: [],
                dailyConsumption: daily,
                daysRemaining: days,
            };
        });
    };
    const getMonthlyConsumption = (medication) => {
        const daily = getDailyConsumption(medication);
        return daily * 30;
    };
    const updatePillCount = async (id, newCount) => {
        if (!user)
            return;
        const n = parseInt(newCount, 10);
        if (Number.isNaN(n))
            return;
        await updateDoc(doc(db, `users/${user.uid}/medications/${id}`), {
            pillsRemaining: n,
        });
    };
    const formatDate = (date) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };
    const getWarningLevel = (daysRemaining) => {
        if (daysRemaining <= 3)
            return 'critical';
        if (daysRemaining <= 7)
            return 'warning';
        return 'normal';
    };
    const getWarningColor = (level) => {
        switch (level) {
            case 'critical':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'warning':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            default:
                return 'bg-green-100 border-green-300 text-green-800';
        }
    };
    const Header = () => (_jsx("div", { className: "bg-white shadow-lg mb-6", children: _jsxs("div", { className: "max-w-6xl mx-auto px-6 py-4", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-800 mb-4 flex items-center", children: [_jsx(Pill, { className: "mr-3 text-blue-600" }), "Axels Pills Tracker"] }), _jsxs("nav", { className: "flex space-x-1", children: [_jsxs("button", { onClick: () => setCurrentPage('patients'), className: `px-4 py-2 rounded-md font-medium transition-colors ${currentPage === 'patients'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: [_jsx(User, { className: "w-4 h-4 inline-block mr-2" }), "\u041F\u0430\u0446\u0456\u0454\u043D\u0442\u0438"] }), _jsxs("button", { onClick: () => setCurrentPage('medications'), className: `px-4 py-2 rounded-md font-medium transition-colors ${currentPage === 'medications'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: [_jsx(Package, { className: "w-4 h-4 inline-block mr-2" }), "\u041F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0438"] })] })] }) }));
    const PatientsPage = () => (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg mb-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-3 text-blue-800", children: "\u0414\u043E\u0434\u0430\u0442\u0438 \u043F\u0430\u0446\u0456\u0454\u043D\u0442\u0430" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { type: "text", placeholder: "\u041F\u0406\u0411 \u043F\u0430\u0446\u0456\u0454\u043D\u0442\u0430", value: newPatientName, onChange: (e) => setNewPatientName(e.target.value), className: "flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" }), _jsxs("button", { onClick: addPatient, className: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center", children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "\u0414\u043E\u0434\u0430\u0442\u0438"] })] })] }), _jsx("div", { className: "space-y-6", children: patients.map((patient) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("h3", { className: "text-xl font-semibold text-gray-800 flex items-center", children: [_jsx(User, { className: "w-5 h-5 mr-2 text-green-600" }), patient.name] }), _jsx("button", { onClick: () => removePatient(patient.id), className: "text-red-600 hover:text-red-800 p-1", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "bg-white p-3 rounded-md mb-4", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { type: "text", placeholder: "\u041D\u0430\u0437\u0432\u0430 \u043F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0430", value: selectedPatient === patient.id ? newMedication : '', onChange: (e) => {
                                            setNewMedication(e.target.value);
                                            setSelectedPatient(patient.id);
                                        }, className: "flex-1 p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" }), _jsx("input", { type: "number", placeholder: "\u041A-\u0442\u044C \u0442\u0430\u0431\u043B\u0435\u0442\u043E\u043A", value: selectedPatient === patient.id ? newMedicationPills : '', onChange: (e) => {
                                            setNewMedicationPills(e.target.value);
                                            setSelectedPatient(patient.id);
                                        }, className: "w-32 p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500" }), _jsxs("button", { onClick: () => addMedication(patient.id), className: "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center", children: [_jsx(Pill, { className: "w-4 h-4 mr-1" }), "\u0414\u043E\u0434\u0430\u0442\u0438"] })] }) }), _jsxs("div", { className: "space-y-3", children: [patient.medications.map((medication) => {
                                    const daysRemaining = getDaysRemaining(medication);
                                    const warningLevel = getWarningLevel(daysRemaining);
                                    return (_jsxs("div", { className: `bg-white p-4 rounded-md border-l-4 border-blue-500 ${warningLevel !== 'normal'
                                            ? 'ring-2 ring-opacity-50 ' +
                                                getWarningColor(warningLevel)
                                            : ''}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-medium text-lg text-gray-800 flex items-center", children: [_jsx(Pill, { className: "w-4 h-4 mr-2 text-blue-600" }), medication.name] }), _jsxs("div", { className: "flex items-center mt-1 space-x-4", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["\u0417\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044F:", ' ', _jsxs("strong", { children: [medication.pillsRemaining, " \u0442\u0430\u0431."] })] }), _jsxs("span", { className: "text-sm text-gray-600", children: ["\u0412\u0438\u0441\u0442\u0430\u0447\u0438\u0442\u044C \u043D\u0430:", ' ', _jsxs("strong", { children: [daysRemaining === Infinity ? '∞' : daysRemaining, ' ', "\u0434\u043D."] })] }), warningLevel !== 'normal' && (_jsxs("span", { className: `text-xs px-2 py-1 rounded-full flex items-center ${getWarningColor(warningLevel)}`, children: [_jsx(AlertTriangle, { className: "w-3 h-3 mr-1" }), warningLevel === 'critical'
                                                                                ? 'Терміново поповнити!'
                                                                                : 'Скоро закінчиться'] }))] })] }), _jsx("button", { onClick: () => removeMedication(patient.id, medication.id), className: "text-red-500 hover:text-red-700 p-1", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Clock, { className: "w-4 h-4 mr-2 text-gray-600" }), _jsx("span", { className: "text-sm text-gray-600 font-medium", children: "\u0413\u0440\u0430\u0444\u0456\u043A \u043F\u0440\u0438\u0439\u043E\u043C\u0443:" })] }), _jsx("div", { className: "flex gap-4 ml-6", children: ['morning', 'afternoon', 'evening'].map((time) => {
                                                    const labels = {
                                                        morning: 'Вранці',
                                                        afternoon: 'Вдень',
                                                        evening: 'Ввечері',
                                                    };
                                                    return (_jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: medication[time], onChange: () => toggleSchedule(patient.id, medication.id, time), className: "sr-only" }), _jsxs("div", { className: `flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${medication[time]
                                                                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                                                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'}`, children: [medication[time] && (_jsx(CheckCircle, { className: "w-3 h-3 mr-1" })), labels[time]] })] }, time));
                                                }) }), _jsxs("div", { className: "mt-2 ml-6 text-sm text-gray-600", children: [_jsx("strong", { children: "\u041F\u0440\u0438\u0439\u043C\u0430\u0442\u0438:" }), " ", getScheduleText(medication), _jsxs("span", { className: "ml-4", children: [_jsx("strong", { children: "\u0412 \u043C\u0456\u0441\u044F\u0446\u044C:" }), " ~", getMonthlyConsumption(medication), " \u0442\u0430\u0431."] })] })] }, medication.id));
                                }), patient.medications.length === 0 && (_jsx("div", { className: "text-gray-500 text-center py-4 italic", children: "\u041F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0438 \u043D\u0435 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u0456" }))] })] }, patient.id))) }), patients.length === 0 && (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(User, { className: "w-16 h-16 mx-auto mb-4 text-gray-300" }), _jsx("p", { className: "text-lg", children: "\u041F\u0430\u0446\u0456\u0454\u043D\u0442\u0438 \u043D\u0435 \u0434\u043E\u0434\u0430\u043D\u0456" })] }))] }));
    const MedicationsPage = () => {
        const allMedications = getAllMedications(selectedDate);
        const criticalMedications = allMedications.filter((med) => getWarningLevel(med.daysRemaining) === 'critical');
        const warningMedications = allMedications.filter((med) => getWarningLevel(med.daysRemaining) === 'warning');
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { className: "text-sm text-gray-700", children: "\u0414\u0430\u0442\u0430:" }), _jsx("span", { className: "text-sm text-blue-600", children: formatDate(selectedDate) })] }), _jsx("div", { className: "max-w-[300px]", children: _jsx(DatePicker, { selected: new Date(selectedDate), onChange: (date) => {
                                    if (date) {
                                        const y = date.getFullYear();
                                        const m = String(date.getMonth() + 1).padStart(2, '0');
                                        const d = String(date.getDate()).padStart(2, '0');
                                        setSelectedDate(`${y}-${m}-${d}`);
                                    }
                                }, inline: true, calendarClassName: "w-full" }) })] }), (criticalMedications.length > 0 || warningMedications.length > 0) && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-800 mb-4 flex items-center", children: [_jsx(AlertTriangle, { className: "w-5 h-5 mr-2 text-orange-600" }), "\u0421\u043F\u043E\u0432\u0456\u0449\u0435\u043D\u043D\u044F"] }), criticalMedications.length > 0 && (_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "font-medium text-red-800 mb-2", children: "\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C \u0437\u0430\u043F\u0430\u0441\u043E\u0432:" }), _jsx("div", { className: "space-y-2", children: criticalMedications.map((med, index) => (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-3 rounded", children: _jsxs("p", { className: "text-red-800", children: [_jsx("strong", { children: med.name }), " - \u0437\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044F", ' ', med.totalPills, " \u0442\u0430\u0431. (\u0432\u0438\u0441\u0442\u0430\u0447\u0438\u0442\u044C \u043D\u0430 ", med.daysRemaining, ' ', "\u0434\u043D.)"] }) }, index))) })] })), warningMedications.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-yellow-800 mb-2", children: "\u0421\u043A\u043E\u0440\u043E \u0437\u0430\u043A\u0456\u043D\u0447\u0438\u0442\u044C\u0441\u044F:" }), _jsx("div", { className: "space-y-2", children: warningMedications.map((med, index) => (_jsx("div", { className: "bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded", children: _jsxs("p", { className: "text-yellow-800", children: [_jsx("strong", { children: med.name }), " - \u0437\u0430\u043B\u0438\u0448\u0438\u043B\u043E\u0441\u044F", ' ', med.totalPills, " \u0442\u0430\u0431. (\u0432\u0438\u0441\u0442\u0430\u0447\u0438\u0442\u044C \u043D\u0430 ", med.daysRemaining, ' ', "\u0434\u043D.)"] }) }, index))) })] }))] })), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsxs("h2", { className: "text-2xl font-semibold text-gray-800 mb-6 flex items-center", children: [_jsx(Package, { className: "w-6 h-6 mr-2 text-green-600" }), "\u0412\u0441\u0456 \u043F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0438"] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full table-auto", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50 border-b", children: [_jsx("th", { className: "text-left p-3 font-semibold", children: "\u041D\u0430\u0437\u0432\u0430 \u043F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0430" }), _jsx("th", { className: "text-left p-3 font-semibold", children: "\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0438\u0439 \u0437\u0430\u043B\u0438\u0448\u043E\u043A" }), _jsx("th", { className: "text-left p-3 font-semibold", children: "\u0412\u0438\u0442\u0440\u0430\u0442\u0430 \u043D\u0430 \u0434\u0435\u043D\u044C" }), _jsx("th", { className: "text-left p-3 font-semibold", children: "\u0412\u0438\u0441\u0442\u0430\u0447\u0438\u0442\u044C \u043D\u0430 \u0434\u043D\u0456\u0432" }), _jsx("th", { className: "text-left p-3 font-semibold", children: "\u041F\u0440\u0438\u0439\u043C\u0430\u044E\u0442\u044C \u043F\u0430\u0446\u0456\u0454\u043D\u0442\u0438" }), _jsx("th", { className: "text-left p-3 font-semibold", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx("th", { className: "text-left p-3 font-semibold", children: "\u0414\u0456\u0457" })] }) }), _jsx("tbody", { children: allMedications.map((medication, index) => {
                                            const warningLevel = getWarningLevel(medication.daysRemaining);
                                            return (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "p-3 font-medium", children: medication.name }), _jsxs("td", { className: "p-3", children: [medication.totalPills, " \u0442\u0430\u0431."] }), _jsxs("td", { className: "p-3", children: [medication.dailyConsumption, " \u0442\u0430\u0431."] }), _jsx("td", { className: "p-3", children: medication.daysRemaining === Infinity
                                                            ? '∞'
                                                            : medication.daysRemaining }), _jsx("td", { className: "p-3 text-sm text-gray-600", children: medication.patients.join(', ') }), _jsx("td", { className: "p-3", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getWarningColor(warningLevel)}`, children: warningLevel === 'critical'
                                                                ? 'Критичний'
                                                                : warningLevel === 'warning'
                                                                    ? 'Попередження'
                                                                    : 'Норма' }) }), _jsx("td", { className: "p-3", children: _jsx("input", { type: "number", placeholder: "\u041D\u043E\u0432\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C", onChange: (e) => updatePillCount(medication.id, e.target.value), className: "w-24 p-1 text-xs border rounded focus:ring-2 focus:ring-blue-500" }) })] }, index));
                                        }) })] }) }), allMedications.length === 0 && (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Package, { className: "w-16 h-16 mx-auto mb-4 text-gray-300" }), _jsx("p", { className: "text-lg", children: "\u041F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0438 \u043D\u0435 \u0434\u043E\u0434\u0430\u043D\u0456" })] }))] })] }));
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: [_jsx(Header, {}), _jsx("div", { className: "max-w-6xl mx-auto px-6 pb-6", children: currentPage === 'patients' ? _jsx(PatientsPage, {}) : _jsx(MedicationsPage, {}) })] }));
};
export default MedicationSystem;
