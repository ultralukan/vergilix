"use client"

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useEffect, useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { Box, Step, StepLabel, Stepper, SxProps } from "@mui/material";
import DatePC from "@/components/DatePC";
import { Theme } from "@emotion/react";
import UploadForm from "@/components/Upload";
import { LinearIndeterminate } from "@/components/Progress";
import { getValidationSchema } from "./validation";
import { useUpdateUserMutation } from "@/api/user";
import { ApiError } from "@/types/error";
import { useAppSelector } from "@/store";

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
  const user = useAppSelector((state) => state.auth.user);

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
  const e = useTranslations('Validation');
  const a = useTranslations('API');

  const [resultTitle, setResultTitle] = useState(t("resultTitlePending"));

  const [update] = useUpdateUserMutation();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if(user) {
      if(user?.IdentityVerified === 'completed') {
        setResultTitle(t("resultTitleCompleted"))
        setActiveStep(4)
      } else if(user?.IdentityVerified === 'pending') {
        setResultTitle(t("resultTitlePending"))
        setActiveStep(4)
      }
    }
  }, [t, user])


  useEffect(() => {
    try {
      if (user && Object.keys(user).length) {
        if (user?.fullName) {
          const [surname, name, patronymic] = user.fullName.split(" ");
          if (surname) setSurname(surname);
          if (name) setName(name);
          if (patronymic) setPatronymic(patronymic);
        }
  
        if (user?.dateOfBirth) setBirthhday(user.dateOfBirth);
        if (user?.placeOfBirth) setPlace(user.placeOfBirth);
  
        if (user?.passportData) {
          if (user.passportData.documentNumber) setDocumentNumber(user.passportData.documentNumber);
          if (user.passportData.issueDate) setDocumentDate(user.passportData.issueDate);
          if (user.passportData.issuingAuthority) setDocumentPlace(user.passportData.issuingAuthority);
        }
  
        if (user?.inn) setInn(user.inn);
  
        if (user?.address) {
          if (user.address.country) setCountry(user.address.country);
          if (user.address.region) setRegion(user.address.region);
          if (user.address.city) setCity(user.address.city);
          if (user.address.street) setStreet(user.address.street);
          if (user.address.house) setHouse(user.address.house);
          if (user.address.building) setCorps(user.address.building);
          if (user.address.apartment) setAppart(user.address.apartment);
          if (user.address.postalCode) setHomeIndex(user.address.postalCode);
        }
  
        if (user?.phoneNumber) setPhone(user.phoneNumber);
  
        if (user?.verificationPhoto) {
          const file = new File([user.verificationPhoto], "verification.jpg", { type: "image/jpeg" });
          setFile(file);
        }
      }
    } catch (error) {
      console.error("Ошибка при заполнении данных пользователя:", error);
    }
  }, [user]);
  
  

  const initialValues = useMemo(() => {
    return({
      name: name,
      surname: surname,
      patronymic: patronymic,
      birthday: birthday,
      place: place,
      phone: phone,
      documentNumber: documentNumber,
      documentDate: documentDate,
      documentPlace: documentPlace,
      inn: inn,
      country: country,
      city: city,
      house: house,
      corps: corps,
      appart: appart,
      region: region,
      street: street,
      homeIndex: homeIndex,
      file: file,
    })
  }, [name, surname, patronymic, birthday, place, phone, documentNumber, documentDate, documentPlace, inn, country, city, house, corps, appart, region, street, homeIndex, file])

  const steps = [
    t('personality'),
    t('document'),
    t('address'),
    t('photo'),
    'result'
  ];

  const prevLastStep = activeStep === steps.length - 2;
  const lastStep = activeStep === steps.length - 1;

  const handleSubmit = async (values, { resetForm }) => {
    if (prevLastStep) {
      setIsLoading(true);
      try {
        const fullName = `${surname} ${name} ${patronymic}`;
        const fileBase64 = await fileToBase64(file);
  
        const response = await update({ 
          fullName,
          dateOfBirth: birthday,
          placeOfBirth: place,
          passportData: {
            documentNumber: documentNumber,
            issueDate: documentDate,
            issuingAuthority: documentPlace
          },
          inn: inn,
          address: {
            country: country,
            region: region,
            city: city,
            street: street,
            house: house,
            building: corps,
            apartment: appart,
            postalCode: homeIndex,
          },
          phoneNumber: phone,
          verificationPhoto: fileBase64,
          IdentityVerified: 'pending'
        }).unwrap();
  
        if (response) {
          resetForm();
          setIsLoading(false);
          handleNext();
        }
      } catch (error) {
        setIsLoading(false);
        if (error && (error as ApiError).data) {
          const status = (error as ApiError).status;
  
          if ([400, 401, 404, 500].includes(status)) {
            setErrorMessage(a(`updateUser${status}`));
          } else {
            setErrorMessage("An unexpected error occurred");
          }
        }
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
                required
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formSurname')}
                name='surname'
                type="text"
                value={surname}
                setValue={setSurname}
                required
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
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItem}>
              <DatePC
                label={t('formBirthday')}
                name='birthday'
                value={birthday}
                setValue={setBirthhday}
                required
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formPlace')}
                name='place'
                type="text"
                value={place}
                setValue={setPlace}
                required
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
                required
              />
            </div>
            <div className={styles.formItem}>
              <DatePC
                label={t('formDocDate')}
                name='documentDate'
                value={documentDate}
                setValue={setDocumentDate}
                required
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
                required
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
                required
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
                required
              />
            </div>
            <div className={styles.formItem}>
              <Input
                label={t('formStreet')}
                name='street'
                type="text"
                value={street}
                setValue={setStreet}
                required
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formHouse')}
                name='house'
                type="number"
                value={house}
                setValue={setHouse}
                required
              />
            </div>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formCorps')}
                name='corps'
                type="number"
                value={corps}
                setValue={setCorps}
              />
            </div>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formApart')}
                name='appart'
                type="number"
                value={appart}
                setValue={setAppart}
              />
            </div>
            <div className={styles.formItemLittle}>
              <Input
                label={t('formIndx')}
                name='homeIndex'
                type="number"
                value={homeIndex}
                setValue={setHomeIndex}
              />
            </div>
          </div>
      </>
    )
  }

  const photoStep = (errors) => {
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
          <UploadForm errors={errors} value={file} setValue={setFile}/>
          {errorMessage ? <h5 className={styles.titleError}>{errorMessage}</h5> : null}
        </div>
      </>
    )
  }


  const resultStep = () => {
    return (
      <div className={styles.resultWrapper}>
            <>
              <h5 className={styles.title}>{resultTitle}</h5>
              {
                user?.IdentityVerified === 'pending' ? (
                  <div className={styles.result}>
                    <div className={styles.image}>
                      <img src={"./person.png"} />
                    </div>
                    <div className={styles.text}>
                      {t("resultMsg")}
                    </div>
                  </div>
                ) : null
              }
            </>
      </div>
    );
  }
  

  const validationSchema = useMemo(() => getValidationSchema(activeStep, e), [activeStep, e])

  return(
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        {({errors}) => {
          return (
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
                  <StepLabel><span className={styles.stepperLabel}>{label}</span></StepLabel>
                </Step>
              ))}
            </Stepper>
            {
              isLoading ? ( <Box className={styles.linear}>
                <LinearIndeterminate />
              </Box>) :activeStep === 0 ? personalityStep() : activeStep === 1 ? documentStep() : activeStep === 2 ? addressStep() : activeStep === 3 ? photoStep(errors?.file) :  activeStep === 4 ? resultStep() :null
            }

            {
              !isLoading && (
                <>
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
                        // onClick={(e) => {
                        //   if (!prevLastStep) {
                        //     e.preventDefault();
                        //     handleNext();
                        //   }
                        // }}
                      />
                    </div>
                  ) : null
                  }
                </div>
                </>
              )
            }
          </Form>
            )
        }}

      </Formik>
  )
}

const fileToBase64 = (file: File | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file)
  });
};