"use client"

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { Box, Step, StepLabel, Stepper, SxProps } from "@mui/material";
import DatePC from "@/components/DatePC";
import { Theme } from "@emotion/react";
import UploadForm from "@/components/Upload";
import { LinearIndeterminate } from "@/components/Progress";

const baseStyles: SxProps<Theme> = {
  '& .MuiStepLabel-iconContainer .Mui-completed': {
    color: '#6BE8C2',
  },
  '& .MuiStepLabel-iconContainer .Mui-active': {
    color: '#6BE8C2',
  },
  '& .MuiStepLabel-label.Mui-active': {
    fontWeight: 'bold',
    color: '#000',
  },
  '& .MuiStepLabel-label': {
    color: '#A3A3A3',
  },
  '& .MuiStepConnector-line.Mui-active': {
    borderColor: '#6BE8C2',
  },
  '& .MuiStepConnector-line.Mui-completed': {
    borderColor: '#6BE8C2',
  },
};



export default function VerificationForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [birthday, setBirthhday] = useState("");
  const [place, setPlace] = useState("");
  const [phone, setPhone] = useState("");

  const [documentNumber, setDocumentNumber] = useState("");
  const [documentDate, setDocumentDate] = useState("");
  const [documentPlace, setDocumentPlace] = useState("");
  const [inn, setInn] = useState("");

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [house, setHouse] = useState("");
  const [corps, setCorps] = useState("");
  const [appart, setAppart] = useState("");
  const [region, setRegion] = useState("");
  const [street, setStreet] = useState("");
  const [homeIndex, setHomeIndex] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations('FormVerification');

  const steps = [
    t('personality'),
    t('document'),
    t('address'),
    t('photo'),
    'result'
  ];

  const prevLastStep = activeStep === steps.length - 2;
  const lastStep = activeStep === steps.length - 1;

  const handleSubmit = () => {
    
    if (prevLastStep) {
      try {
        setIsLoading(true);
        
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
  
        handleNext();
  
      } catch (error) {
        console.error(error);
      }
    } else {
      handleNext();
    }
  };
  

  const handleNext = () => {
    setActiveStep(prevStep => Math.min(prevStep + 1, steps.length));
  };

  const handleBack = () => {
    setActiveStep(prevStep => Math.max(prevStep - 1, 0));
  };

  const initialValues = useMemo(() => {
    return({
      name: name,
      surname: surname,
      patronymic: patronymic,
      birthday: birthday,
      place: place,
      phone: phone,
    })
  }, [name, surname, patronymic, birthday, place, phone])

  const personalityStep = () => {
    return(
      <>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t('formName')}
                name='name'
                type="text"
                value={name}
                setValue={setName}
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formSurname')}
                name='surname'
                type="text"
                value={surname}
                setValue={setSurname}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t('formPatronymic')}
                name='patronymic'
                type="text"
                value={patronymic}
                setValue={setPatronymic}
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formPhone')}
                name='phone'
                type="text"
                value={phone}
                setValue={setPhone}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <DatePC
                label={t('formBirthday')}
                name='birdhday'
                value={birthday}
                setValue={setBirthhday}
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formPlace')}
                name='place'
                type="text"
                value={place}
                setValue={setPlace}
              />
            </div>
          </div>
      </>
    )
  }

  const documentStep = () => {
    return(
      <>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t('formDocNumber')}
                name='documentNumber'
                type="text"
                value={documentNumber}
                setValue={setDocumentNumber}
              />
            </div>
            <div className={styles.formItem}>
              <DatePC
                label={t('formDocDate')}
                name='documentDate'
                value={documentDate}
                setValue={setDocumentDate}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItemFull}>
              <Input
                label={t('formDocPlace')}
                name='documentPlace'
                type="text"
                value={documentPlace}
                setValue={setDocumentPlace}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t('formInn')}
                name='inn'
                type="text"
                value={inn}
                setValue={setInn}
              />
            </div>
          </div>
      </>
    )
  }

  const addressStep = () => {
    return(
      <>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t('formCountry')}
                name='country'
                type="text"
                value={country}
                setValue={setCountry}
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formRegion')}
                name='region'
                type="text"
                value={region}
                setValue={setRegion}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <Input
                label={t('formCity')}
                name='city'
                type="text"
                value={city}
                setValue={setCity}
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formStreet')}
                name='street'
                type="text"
                value={street}
                setValue={setStreet}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formHouse')}
                name='house'
                type="text"
                value={house}
                setValue={setHouse}
              />
            </div>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formCorps')}
                name='corps'
                type="text"
                value={corps}
                setValue={setCorps}
              />
            </div>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formApart')}
                name='appart'
                type="text"
                value={appart}
                setValue={setAppart}
              />
            </div>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formIndx')}
                name='homeIndex'
                type="text"
                value={homeIndex}
                setValue={setHomeIndex}
              />
            </div>
          </div>
      </>
    )
  }

  const photoStep = () => {
    return(
      <>
        <div className={styles.form}>
          <h5 className={styles.title}>{t("photoTitle")}</h5>
          <div className={styles.instruction}>
            <div className={styles.image}>
              <img src="./person.png" alt="personicon"/>
            </div>
            <div className={styles.rules}>
              <ul>
                <li>{t('rule1')}</li>
                <li>{t('rule2')}</li>
                <li>{t('rule3')}</li>
                <li>{t('rule4')}</li>
                <li>{t('rule5')}</li>
                <li>{t('rule6')}</li>
              </ul>
            </div>
          </div>
          <UploadForm value={file} setValue={setFile}/>
        </div>
      </>
    )
  }


  const resultStep = () => {
    return(
      <>
        <div className={styles.resultWrapper}>
          {
            isLoading ? (
              <Box className={styles.linear}>
                <LinearIndeterminate />
              </Box>
            ) : (
              <>
              <h5 className={styles.title}>{t("resultTitle")}</h5>
              <div className={styles.result}>
                <div className={styles.image}>
                  <img src={"./person.png"} />
                </div>
                <div className={styles.text}>
                  {t("resultMsg")}
                </div>
              </div>
              </>
            )
          }
        </div>
      </>
    )
  }

  return(
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        <Form className={styles.form}>
          <Stepper 
            className={styles.stepper} 
            activeStep={activeStep} 
            sx={
              {
                '& .MuiStepConnector-line': {
                  borderColor: '#DDD',
              }}}
            >
            {[...steps.slice(0, -1)].map((label) => (
              <Step key={label} sx={baseStyles}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {
            activeStep === 0 ? personalityStep() : activeStep === 1 ? documentStep() : activeStep === 2 ? addressStep() : activeStep === 3 ? photoStep() :  activeStep === 4 ? resultStep() :null
          }
          <div className={styles.buttons}>
            {activeStep < steps.length && activeStep > 0 && !lastStep && (
              <div className={styles.button}>
                <Button 
                  label={t('btnPrevText')} 
                  onClick={handleBack}
                  showBackArrow={true}
                  showArrow={false}
                />
              </div>
            )}
            {!lastStep ? (
              <div className={styles.button}>
                <Button 
                  label={prevLastStep ? t('btnCompleteText') : t('btnNextText')}
                  type={"submit"}
                />
              </div>
            ) : null
            }
          </div>
        </Form>
      </Formik>
  )
}