import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import { useAppSelector } from "@/store";
import { useTranslations } from "next-intl";
import { Box, Typography } from "@mui/material";
import "./Table.scss";
import PlusIcon from "./../../../public/plus.svg";
import MinusIcon from "./../../../public/minus.svg";
import styles from "./index.module.scss";
import classNames from "classnames";
import Button from "../Button";
import { TradeGetType } from "@/types/trades";
import { CustomPagination } from "../CustomPagination";

export const TradesTable = ({ data }: {data: TradeGetType[]}) => {
  const lang = useAppSelector((state) => state.auth.language);
  const t = useTranslations("Trades");
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 6,
  });

  useEffect(() => {
    if(data.length) {
      setTotalPages(Math.ceil(data.length / pagination.pageSize))
    }
  }, [data, pagination.pageSize])

  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);


  const preparedData:TradeGetType[]  = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
  
    return [...data.slice(startIndex, endIndex)];
  }, [data, pagination.pageIndex, pagination.pageSize]);
  

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const columns = useMemo<MRT_ColumnDef<typeof data[0]>[]>(
    () => [
      {
        accessorKey: "id",
        header: t("id"),
        size: 130,
      },
      {
        accessorKey: "status",
        header: t("status"),
        size: 140,
      },
      {
        accessorKey: "amountSell",
        header: t("amountSell"),
        size: 140,
      },
      {
        accessorKey: "name",
        header: t("name"),
      },
      {
        accessorKey: "currency",
        header: t("currency"),
        size: 250,
      },
      {
        accessorKey: "amountBuy",
        header: t("amountBuy"),
      },
      {
        accessorKey: "details",
        header: t("details"),
        size: 130,
      },
      {
        accessorKey: "date",
        header: t("date"),
        size: 130,
      },
    ],
    [t]
  );

  const table = useMaterialReactTable({
    columns,
    data: preparedData,
    localization: lang === "ru" ? MRT_Localization_RU : undefined,
    initialState: { density: "compact", columnPinning: { right: ['mrt-row-expand'] } },
    enableHiding: false,
    enableSorting: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableColumnActions: false,
    renderDetailPanel: ({ row }) => (
      <Box className={styles.details}>
        <Box className={styles.detailsWrapper}>
          <Box className={styles.detailsTitles}>
            <Typography>{t("status")}:</Typography>
            <Typography>{t("amountSell")}:</Typography>
            <Typography>{t("name")}:</Typography>
            <Typography>{t("date")}:</Typography>
            <Typography>{t("amountBuy")}:</Typography>
            <Typography>{t("currency")}:</Typography>
            <Typography>{t("details")}:</Typography>
          </Box>
          <Box className={styles.detailsValues}>
            <Typography sx={{ fontWeight: "bold" }}>{row.original.status}</Typography>
            <Typography sx={{ fontWeight: "bold" }}>{row.original.amountSell}</Typography>
            <Typography sx={{ fontWeight: "bold" }}>{row.original.name}</Typography>
            <Typography sx={{ fontWeight: "bold" }}>{row.original.date}</Typography>
            <Typography sx={{ fontWeight: "bold" }}>{row.original.amountBuy}</Typography>
            <Typography sx={{ fontWeight: "bold" }}>{row.original.currency}</Typography>
            <Typography sx={{ fontWeight: "bold" }}>{row.original.details}</Typography>
          </Box>
        </Box>
        <Box className={styles.detailsPay}>
          <Box className={styles.detailsPayTitle}>
            <Box className={styles.detailsPayTitleStatus}>
              <Box sx={{ marginBottom: "10px" }}>{t("status")}</Box>
              <Box sx={{ fontWeight: "bold" }}>{row.original.status}</Box>
            </Box>
            <Box className={styles.detailsPayTitleDate}>
              <Box sx={{ marginBottom: "10px" }}>{t("date")}</Box>
              <Box sx={{ fontWeight: "bold" }}>{row.original.date}</Box>
            </Box>
          </Box>
          <Box className={styles.detailsPayForm}>
            <Box className={styles.detailsPayTitleDate}>
              <Box sx={{ fontWeight: "bold" }}>{t("time")}</Box>
              <Box sx={{ fontWeight: "bold", fontSize: "28px" }}>{formattedTime}</Box>
            </Box>
            <Box className={styles.button}>
              <Button sx={{ marginTop: 2 }} label={t("btnPay")} type={"button"} />
            </Box>
          </Box>
        </Box>
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => ({
      className: classNames({
        "MuiTableRow-expanded": row.getIsExpanded(),
      }),
    }),
    muiExpandButtonProps: ({ row }) => ({
      children: !row.getIsExpanded() ? <PlusIcon className={styles.icon} /> : <MinusIcon className={styles.icon} />,
    }),
    manualPagination: true,
    rowCount: data.length,
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 3 }}></Typography>
      <MaterialReactTable table={table} />
      {totalPages > 1 && <CustomPagination pagination={pagination} setPagination={setPagination} totalPages={totalPages}/>}
    </Box>
  );
};

