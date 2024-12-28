import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import styles from "./index.module.scss";


type PaginationType = {
  pageIndex: number;
  pageSize: number;
};

export const CustomPagination = ({
  pagination,
  setPagination,
  totalPages,
}: {
  totalPages: number;
  pagination: PaginationType;
  setPagination: (value: PaginationType) => void;
}) => {
  const currentPage = pagination.pageIndex;

  const handlePageClick = (page: number) => {
    setPagination({ ...pagination, pageIndex: page });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setPagination({ ...pagination, pageIndex: currentPage + 1 });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setPagination({ ...pagination, pageIndex: currentPage - 1 });
    }
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(0, currentPage - halfVisible);
    const end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const disablePrevious = currentPage <= 0;
  const disableNext = currentPage >= totalPages - 1;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button onClick={handlePrevious} disabled={disablePrevious}>
        <ArrowBackIosIcon className={styles.pagArrow} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`${styles.pagButton} ${
            currentPage === page ? styles.pagBtnActive : ""
          }`}
        >
          {page + 1}
        </button>
      ))}

      <button onClick={handleNext} disabled={disableNext}>
        <ArrowForwardIosIcon className={styles.pagArrow} />
      </button>
    </div>
  );
};
