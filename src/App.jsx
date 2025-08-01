import { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import PopupIntro from './components/PopupIntro';
import ProgressBar from './components/ProgressBar';
import Step1_PatientInfo from './pages/Step1_PatientInfo';
import Step2_DescriptionMedia from './pages/Step2_DescriptionMedia';
import Step3_PreviewPayment from './pages/Step3_PreviewPayment';
import Step4_PaymentRedirect from './pages/Step4_PaymentRedirect';
import Step5_Success from './pages/Step5_Success';
import './styles/variables.css';

// Mapping pathname to step number for progress bar
const pathStep = {
  '/step1': 1,
  '/step2': 2,
  '/step3': 3,
  '/step4': 4,
  '/success': 5,
};

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    nationalCode: '',
    mobile: '',
    doctorId: '',
    description: '',
    media: [],
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Determine current step from URL
  const step = pathStep[location.pathname] || 1;

  return (
    <div dir="rtl" className="healio-root">
      {showIntro && <PopupIntro onClose={() => setShowIntro(false)} />}
      <ProgressBar step={step} total={5} />
      <Routes>
        <Route path="/" element={<Navigate to="/step1" replace />} />
        <Route path="/step1" element={<Step1_PatientInfo form={form} setForm={setForm} onNext={() => navigate('/step2')} />} />

        <Route
          path="/step2"
          element={
            <Step2_DescriptionMedia
              form={form}
              setForm={setForm}
              onNext={() => navigate('/step3')}
              onBack={() => navigate('/step1')}
            />
          }
        />
        <Route
          path="/step3"
          element={
            <Step3_PreviewPayment
              form={form}
              setForm={setForm}
              onNext={() => navigate('/step4')}
              onBack={() => navigate('/step2')}
            />
          }
        />
        <Route
          path="/step4"
          element={
            <Step4_PaymentRedirect
              form={form}
              onSuccess={() => navigate('/success')}
              onFail={() => navigate('/step3')}
            />
          }
        />
        <Route
          path="/success"
          element={<Step5_Success onHome={() => navigate('/')} />}
        />
      </Routes>
    </div>
  );
}

export default App;
