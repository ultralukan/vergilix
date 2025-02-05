"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import PlusIcon from "../../../public/plus.svg";
import MinusIcon from "../../../public/minus.svg";
import {formatDate, formatDateNoTime} from "@/services/dates";
import { useTranslations } from "next-intl";
import { CustomPagination } from "../CustomPagination";
import {Box} from "@mui/material";
import Image from "next/image";
import {LinearIndeterminate} from "@/components/Progress";

interface TableRow {
  _id: string;
  amountCrypto: number;
  amountRub: number;
  createdAt: string;
  currency: string;
  duration: number;
  endsAt: string;
  startRate: number;
  userId: string;
}

interface CustomTableProps {
  data: TableRow[];
  isLoading: boolean;
}

export const StakingsTable: React.FC<CustomTableProps> = ({ data, isLoading }) => {
  const t = useTranslations("StakingsTable");
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableRow | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("body-lock");
    } else {
      document.body.classList.remove("body-lock");
    }
    return () => {
      document.body.classList.remove("body-lock");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (data.length) {
      setTotalPages(Math.ceil(data.length / pagination.pageSize));
    } else {
      setTotalPages(1)
    }
  }, [data, pagination.pageSize]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const preparedData = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return [...sortedData.slice(startIndex, endIndex)];
  }, [sortedData, pagination.pageIndex, pagination.pageSize]);

  const handleSort = (key: keyof TableRow) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof TableRow) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") return "▲";
      if (sortConfig.direction === "desc") return "▼";
    }
    return null;
  };

  const toggleRow = (id: string) => {
    setExpandedRow((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <h5 className={styles.label}>{t("label")}</h5>
      {
        isLoading ? <Box className={styles.linear}>
          <LinearIndeterminate />
        </Box> : !!preparedData.length ? (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
              <tr>
                <th onClick={() => handleSort("amountRub")}>
                  {t("amount")} {getSortIcon("amountRub")}
                </th>
                <th onClick={() => handleSort("currency")}>
                  {t("currency")} {getSortIcon("currency")}
                </th>
                <th onClick={() => handleSort("createdAt")}>
                  {t("dateStart")} {getSortIcon("createdAt")}
                </th>
                <th onClick={() => handleSort("endsAt")}>
                  {t("dateEnd")} {getSortIcon("endsAt")}
                </th>
                <th onClick={() => handleSort("duration")}>
                  {t("duration")} {getSortIcon("duration")}
                </th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              {preparedData.map((row) => (
                <React.Fragment key={row._id}>
                  <tr
                    className={`${styles.tableRow} ${
                      expandedRow.includes(row._id) ? styles.expandedRow : ""
                    }`}
                    onClick={isMobile ? () => toggleRow(row._id) : undefined}
                  >
                    {/* <td className={styles.idColumn}>{row._id}</td> */}
                    <td className={styles.amount}>
                      {row.amountRub} ₽
                    </td>
                    <td >
                      {row.currency}
                    </td>
                    <td>{formatDateNoTime(row.createdAt).ru.noTime}</td>
                    <td>{formatDateNoTime(row.endsAt).ru.noTime}</td>
                    <td>{row.duration}</td>
                    <td>
                      {expandedRow.includes(row._id) ? (
                        <MinusIcon className={styles.icon}/>
                      ) : (
                        <PlusIcon className={styles.icon}/>
                      )}
                    </td>
                  </tr>
                  {expandedRow.includes(row._id) && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={9}>
                        <div className={styles.details}>
                          <div className={styles.detailsText}>
                            {row?.amountRub && (
                              <p>
                                <span>{t("amount")}:</span> {row.amountRub} ₽
                              </p>
                            )}
                            {row?.currency && (
                              <p>
                                <span>{t("currency")}:</span> {row.currency}
                              </p>
                            )}
                            {row?.duration && (
                              <p>
                                <span>{t("duration")}:</span> {row.duration}
                              </p>
                            )}
                            {row?.createdAt && (
                              <p>
                                <span>{t("dateStart")}:</span>{" "}
                                {formatDateNoTime(row.createdAt).ru.noTime}
                              </p>
                            )}
                            {row?.endsAt && (
                              <p>
                                <span>{t("dateEnd")}:</span>{" "}
                                {formatDateNoTime(row.endsAt).ru.noTime}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              </tbody>
            </table>
          </div>
        ) : <div className={styles.helperText}>
          <Image
            src={"/error.png"}
            alt="icon"
            width={40}
            height={40}
          />
          {t("noData")}
        </div>
      }

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <CustomPagination
            pagination={pagination}
            setPagination={setPagination}
            totalPages={totalPages}
          />
        </div>
      )}
    </>
  );
};