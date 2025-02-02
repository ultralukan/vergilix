"use client"

import { Form, Formik } from "formik";
import styles from "./index.module.scss";
import { useMemo, useState } from "react";
import Input from "@/components/Input";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Link from "next/link";
import {HtmlContent} from "@/components/HtmlContent";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const t = useTranslations('About');

  const handleSubmit = () => {}

  const initialValues = useMemo(() => {
    return({
      name: name,
      email: email,
      question: question,
    })
  }, [name, email, question])

  return(
    <div className={styles.wrapper}>
      {/* <div className={styles.bgText}>Vergilix</div> */}
      <h2 className={styles.title}>{t("feedbackTitle")}</h2>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize
      >
        <Form className={styles.form}>
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
                label={t('formEmail')}
                name='name'
                type="text"
                value={email}
                setValue={setEmail}
                required
              />
            </div>
          </div>
          <Input
            label={t('formQuest')}
            name='name'
            type="text"
            value={question}
            setValue={setQuestion}
            required
            multiline
            rows={5}
            // customStyles={{
            //   "& .MuiInputBase-input": {
            //     paddingLeft: "10px",
            //     fontWeight:
            //   },
            // }}
          />
          <div className={styles.terms}>
            <HtmlContent htmlString={t.raw("terms")}/>
          </div>
          <div className={styles.button}>
            <Button label={t('formBtn')}/>
          </div>
        </Form>
      </Formik>
    </div>
  )
}