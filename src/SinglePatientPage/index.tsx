import React from 'react';
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Entry, Patient } from '../types';
import { useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

const SinglePatientPage: React.FC = () => {
  const location = useLocation();
  //console.log(location.state.id);
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

          {Object.values(patient.entries).map((entry: Entry) => (
            <div key={entry.id}>
              {entry.date} {entry.description}
              <>
                {entry.diagnosisCodes?.map((code) => (
                  <ul>
                    <li>{code}</li>
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
