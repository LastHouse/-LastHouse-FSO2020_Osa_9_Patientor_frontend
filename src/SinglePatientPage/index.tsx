import React from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Diagnosis, Entry, Patient } from '../types';
import { useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { useStateValue } from '../state';

const SinglePatientPage: React.FC = () => {
  const location = useLocation();
  const [{ diagnoses }] = useStateValue();
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
            <div key={i}>
              {entry.date} {entry.description}
              <>
                {entry.diagnosisCodes?.map((code, i: number) => (
                  <ul key={i}>
                    <li>
                      {code}{' '}
                      {Object.values(diagnoses).map((diagnosis: Diagnosis) => {
                        if (diagnosis.code === code) {
                          return <div>{diagnosis.name}</div>;
                        }
                      })}
                    </li>
                  </ul>
                ))}
              </>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
export default SinglePatientPage;
