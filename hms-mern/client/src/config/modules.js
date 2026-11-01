// Field: k=key, l=label, t=input type, o=fixed options, ref=take options from another module's names
export const modules = {
  patients: { title: 'Patients', icon: '🧑', fields: [{ k: 'name', l: 'Name' }, { k: 'age', l: 'Age', t: 'number' }, { k: 'gender', l: 'Gender', o: ['Male', 'Female', 'Other'] }, { k: 'phone', l: 'Phone' }, { k: 'disease', l: 'Problem / Disease' }] },
  doctors: { title: 'Doctors', icon: '🩺', fields: [{ k: 'name', l: 'Name' }, { k: 'spec', l: 'Specialty' }, { k: 'phone', l: 'Phone' }, { k: 'fee', l: 'Fee', t: 'number' }] },
  appointments: { title: 'Appointments', icon: '📅', fields: [{ k: 'patient', l: 'Patient', ref: 'patients' }, { k: 'doctor', l: 'Doctor', ref: 'doctors' }, { k: 'date', l: 'Date', t: 'date' }, { k: 'status', l: 'Status', o: ['Pending', 'Done', 'Cancelled'] }] },
  admissions: { title: 'Admissions', icon: '🏨', fields: [{ k: 'patient', l: 'Patient', ref: 'patients' }, { k: 'ward', l: 'Ward', ref: 'wards' }, { k: 'date', l: 'Admit Date', t: 'date' }, { k: 'status', l: 'Status', o: ['Admitted', 'Discharged'] }] },
  labtests: { title: 'Lab Tests', icon: '🧪', fields: [{ k: 'patient', l: 'Patient', ref: 'patients' }, { k: 'test', l: 'Test Name' }, { k: 'price', l: 'Price', t: 'number' }, { k: 'result', l: 'Result' }, { k: 'status', l: 'Status', o: ['Pending', 'Done', 'Cancelled'] }] },
  wards: { title: 'Wards & Beds', icon: '🛏️', fields: [{ k: 'name', l: 'Ward / Room' }, { k: 'type', l: 'Type', o: ['General', 'Private', 'ICU', 'Emergency', 'Maternity'] }, { k: 'beds', l: 'Total Beds', t: 'number' }, { k: 'charge', l: 'Charge / Day', t: 'number' }] },
  medicines: { title: 'Pharmacy', icon: '💊', fields: [{ k: 'name', l: 'Medicine' }, { k: 'stock', l: 'Stock', t: 'number' }, { k: 'price', l: 'Price', t: 'number' }] },
  bloodbank: { title: 'Blood Bank', icon: '🩸', fields: [{ k: 'group', l: 'Blood Group', o: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] }, { k: 'units', l: 'Units', t: 'number' }, { k: 'donor', l: 'Donor' }, { k: 'date', l: 'Date', t: 'date' }] },
  departments: { title: 'Departments', icon: '🏢', fields: [{ k: 'name', l: 'Department' }, { k: 'head', l: 'Head Doctor' }, { k: 'phone', l: 'Phone' }] },
  staff: { title: 'Staff', icon: '👩‍⚕️', fields: [{ k: 'name', l: 'Name' }, { k: 'role', l: 'Role', o: ['Nurse', 'Receptionist', 'Pharmacist', 'Lab Technician', 'Cleaner', 'Security', 'Accountant'] }, { k: 'dept', l: 'Department', ref: 'departments' }, { k: 'phone', l: 'Phone' }, { k: 'salary', l: 'Salary', t: 'number' }] },
  ambulance: { title: 'Ambulance', icon: '🚑', fields: [{ k: 'vehicle', l: 'Vehicle No' }, { k: 'driver', l: 'Driver' }, { k: 'phone', l: 'Phone' }, { k: 'status', l: 'Status', o: ['Available', 'On Trip', 'Maintenance'] }] },
  expenses: { title: 'Expenses', icon: '💸', fields: [{ k: 'title', l: 'Expense' }, { k: 'cat', l: 'Category', o: ['Salary', 'Electricity', 'Medicine Purchase', 'Equipment', 'Maintenance', 'Other'] }, { k: 'amount', l: 'Amount', t: 'number' }, { k: 'date', l: 'Date', t: 'date' }] }
};
export const nav = [
  { group: 'Overview', items: [{ to: '/', icon: '📊', label: 'Dashboard' }] },
  { group: 'Clinical', items: ['patients', 'doctors', 'appointments', 'admissions', 'labtests', 'wards'] },
  { group: 'Pharmacy', items: ['medicines', 'bloodbank'] },
  { group: 'Operations', items: ['departments', 'staff', 'ambulance', 'expenses'] },
  { group: 'Finance & System', items: [{ to: '/billing', icon: '🧾', label: 'Billing' }, { to: '/settings', icon: '⚙️', label: 'Bill Settings' }] }
].map((g) => ({ ...g, items: g.items.map((i) => (typeof i === 'string' ? { to: '/m/' + i, icon: modules[i].icon, label: modules[i].title } : i)) }));
