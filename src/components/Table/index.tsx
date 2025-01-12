"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import PlusIcon from "../../../public/plus.svg";
import MinusIcon from "../../../public/minus.svg";
import { formatDate } from "@/services/dates";
import { useTranslations } from "next-intl";
import Button from "../Button";
import { CustomPagination } from "../CustomPagination";
import { FormControl, MenuItem, Select } from "@mui/material";
import Image from "next/image";

interface TableRow {
  _id: string;
  status: string;
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  name: string;
  rate: string;
  receivedAmount: string;
  accountNumber: string;
  createdAt: string;
}

interface CustomTableProps {
  data: TableRow[];
}

export const TradesTable: React.FC<CustomTableProps> = ({ data }) => {
  const t = useTranslations("Trades");

  const statusLabels = {
    paid: t("statusPaid"),
    pending: t("statusPending"),
    completed: t("statusCompleted"),
    cancelled: t("statusCancelled"),
  };

  const statusFilterLabels = {
    all: t("labelFilterAll"),
    paid: t("labelFilterPaid"),
    pending: t("labelFilterPending"),
    completed: t("labelFilterCompleted"),
    cancelled: t("labelFilterCancelled"),
  };

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

  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusOptions = [...Object.keys(statusFilterLabels)];

  const filteredData = useMemo(() => {
    if (selectedStatus === "all" || !selectedStatus) return data;
    return data.filter((row) => row.status === selectedStatus);
  }, [data, selectedStatus]);

  useEffect(() => {
    if (filteredData.length) {
      setTotalPages(Math.ceil(filteredData.length / pagination.pageSize));
    } else {
      setTotalPages(1)
    }
  }, [filteredData, pagination.pageSize]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const preparedData = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    return [...sortedData.slice(startIndex, endIndex)];
  }, [sortedData, pagination.pageIndex, pagination.pageSize]);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    );
  };

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

  return (
    <>
      <div className={styles.selectContainer}>
        <FormControl  sx={{
          '@media (min-width: 500px)': {
            width: '300px'
          }}} fullWidth>
          <Select
            labelId="status-select-label"
            value={selectedStatus}
            onChange={(e) => {
              setPagination((prev) => ({...prev, pageIndex: 0}))
              setSelectedStatus(e.target.value as string)
              setIsMenuOpen(false)
            }}
            className={styles.select}
            sx={{
              background: '#FFF',
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: '1px solid #71E0C1'
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: '1px solid #71E0C1'
              },
            }}
            MenuProps={{
              open: isMenuOpen,
              onClose: () => setIsMenuOpen(false),
            }}
            onOpen={() => setIsMenuOpen(true)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {statusFilterLabels[option]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {
        !!preparedData.length ? (
          <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {/* <th onClick={() => handleSort("_id")}>
                  {t("id")} {getSortIcon("_id")}
                </th> */}
                <th onClick={() => handleSort("status")}>
                  {t("status")} {getSortIcon("status")}
                </th>
                <th onClick={() => handleSort("amount")}>
                  {t("amountSell")} {getSortIcon("amount")}
                </th>
                {/* <th onClick={() => handleSort("rate")}>
                  {t("currency")} {getSortIcon("rate")}
                </th> */}
                <th onClick={() => handleSort("receivedAmount")}>
                  {t("amountBuy")} {getSortIcon("receivedAmount")}
                </th>
                <th onClick={() => handleSort("createdAt")}>
                  {t("date")} {getSortIcon("createdAt")}
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
                    onClick={() => toggleRow(row._id)}
                  >
                    {/* <td className={styles.idColumn}>{row._id}</td> */}
                    <td className={styles.statusColumn}>
                      {statusLabels[row.status] || row.status}
                    </td>
                    <td className={styles.amount}>
                      {row.amount} {row.fromCurrency}
                    </td>
                    {/* <td>{row.rate}</td> */}
                    <td>{row.receivedAmount} {row.toCurrency}</td>
                    <td>{formatDate(row.createdAt).ru}</td>
                    <td>
                      {expandedRow.includes(row._id) ? (
                        <MinusIcon className={styles.icon} />
                      ) : (
                        <PlusIcon className={styles.icon} />
                      )}
                    </td>
                  </tr>
                  {expandedRow.includes(row._id) && (
                    <tr className={styles.detailsRow}>
                      <td colSpan={9}>
                        <div className={styles.details}>
                          <div className={styles.detailsText}>
                            {row?._id && (
                              <p>
                                <span>{t("id")}:</span> {row._id}
                              </p>
                            )}
                            {row?.status && (
                              <p>
                                <span>{t("status")}:</span>{" "}
                                {statusLabels[row.status] || row.status}
                              </p>
                            )}
                            {row?.amount && (
                              <p>
                                <span>{t("amountSellLabel")}:</span> {row.amount}
                              </p>
                            )}
                            {row?.fromCurrency && (
                              <p>
                                <span>{t("currencySellLabel")}:</span>{" "}
                                {row.fromCurrency}
                              </p>
                            )}
                            {row?.rate && (
                              <p>
                                <span>{t("currency")}:</span> {row.rate}
                              </p>
                            )}
                            {row?.receivedAmount && (
                              <p>
                                <span>{t("amountBuyLabel")}:</span>{" "}
                                {row.receivedAmount}
                              </p>
                            )}
                            {row?.toCurrency && (
                              <p>
                                <span>{t("currencyBuyLabel")}:</span>{" "}
                                {row.toCurrency}
                              </p>
                            )}
                            {row?.accountNumber && (
                              <p>
                                <span>{t("walletNumber")}:</span>{" "}
                                {row.accountNumber}
                              </p>
                            )}
                            {row?.createdAt && (
                              <p>
                                <span>{t("date")}:</span>{" "}
                                {formatDate(row.createdAt).ru}
                              </p>
                            )}
                          </div>

                          {
                            !['completed', 'cancelled'].includes(row?.status) && (
                              <div className={styles.button}>
                              <Button
                                onClick={() => window.open(`/trade/${row._id}`, "_blank")}
                                label={t("tradeButton")}
                              />
                            </div>
                            )
                          }

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