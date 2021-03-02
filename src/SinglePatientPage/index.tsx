import React from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Patient, Entry } from '../types';
import { useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import HealthCheckComponent from '../HealthCheckComponent';
import HospitalComponent from '../HospitalComponent';
import OccupationalHealthcareComponent from '../OccupationalHealthcareComponent';

const SinglePatientPage: React.FC = () => {
  const location = useLocation();

  const [patient, setPatient] = React.useState<Patient | null>();
  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${location.state.id}`
        );
        setPatient(patientFromApi);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPatient();
  }, [location.state.id]);

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<{
    entry: Entry;
  }> = ({ entry }) => {
    switch (entry.type) {
      case 'HealthCheck':
        return <HealthCheckComponent {...entry} />;
      case 'Hospital':
        return <HospitalComponent {...entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalHealthcareComponent {...entry} />;
      default:
        return assertNever(entry);
    }
  };

  if (!patient) return <div>loading...</div>;

  return (
    <div>
      {Object.values(patient).map((patient: Patient) => (
        <div key={patient.id}>
          <h1>
            {patient.name}
            {patient.gender === 'male' && <Icon name="mars" />}
            {patient.gender === 'female' && <Icon name="venus" />}
            {patient.gender === 'other' && <Icon name="other gender" />}
          </h1>
          <p>ssn: {patient.ssn}</p>
          <p>occupation: {patient.occupation}</p>
          <h2>Entries</h2>
          {Object.values(patient.entries).map((entry: Entry, i: number) => (
            <EntryDetails key={i} entry={entry} />
          ))}
        </div>
      ))}
    </div>
  );
};
export default SinglePatientPage;
