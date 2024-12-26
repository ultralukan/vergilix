"use client"

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import { createValidationSchema } from "./validation";

export default function PasswordRecover() {
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");
  const [edit, setEdit] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const t = useTranslations('FormPassRecovery');
  const e = useTranslations('Validation');
  

  const handleSubmit = () => {
    try {
      setSuccessMessage("");
      setEdit(true);
      setPassword("");
      setPasswordConf("");
      setSuccessMessage(t("successMessage"));
    } catch(e){
      console.log(e);
    }
  }

  const initialValues = useMemo(() => {
    return({
      password: password,
      passwordConf: passwordConf,
    })
  }, [password, passwordConf])

  const validationSchema = useMemo(() => createValidationSchema(e), [e])

  return(
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        <Form className={styles.form}>
          <div>
            {successMessage ? <h5 className={styles.title}>{t('successMessage')}</h5> : null}
          </div>
          <div className={styles.main}>
            <div className={styles.fields}>
              <h5>{t('title')}</h5>
              <div className={styles.formItems}>
                <div className={styles.formItem}>
                  <Input
                    label={t('password')}
                    name='password'
                    type="password"
                    value={password}
                    setValue={setPassword}
                    disabled={edit}
                  />
                </div>
                <div className={styles.formItem}>
                  <Input
                    label={t('repeatPassword')}
                    name='passwordConf'
                    type="password"
                    value={passwordConf}
                    setValue={setPasswordConf}
                    disabled={edit}
                  />
                </div>
              </div>
            </div>
            <div className={styles.rules}>
              <h5>{t('rulesTitle')}</h5>
              <ul>
                <li>{t('rule1')}</li>
                <li>{t('rule2')}</li>
                <li>{t('rule3')}</li>
                <li>{t('rule4')}</li>
                <li>{t('rule5')}</li>
              </ul>
            </div>
          </div>
          <div className={styles.button}>
          <Button
            label={edit ? t("formEdit") : t("formSave")}
            type={edit ? "button" : "submit"}
            onClick={() => edit && setEdit(!edit)}
          />
          </div>
        </Form>
      </Formik>
  )
}