"use client"

import { useState, useRef } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

type DropDownItemProps = {
  label: string;
  text: string;
};

export default function DropdownItem({ label, text }: DropDownItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.header, {
          [styles.headerShow]: isOpen,
        })} onClick={toggleDropdown}>
        <span className={styles.label}>{label}</span>
        <button
          className={classNames(styles.toggleButton, {
            [styles.open]: isOpen,
          })}
        >
          {isOpen ? <RemoveCircleOutlineIcon className={styles.icon}/> : <AddCircleOutlineIcon className={styles.icon}/>}
        </button>
      </div>
      <div
        ref={contentRef}
        className={classNames(styles.content, {
          [styles.show]: isOpen,
        })}
        style={{
          height: isOpen
            ? `${contentRef.current?.scrollHeight}px`
            : "0",
        }}
      >
        <div className={styles.innerContent}>{text}</div>
      </div>
    </div>
  );
}
