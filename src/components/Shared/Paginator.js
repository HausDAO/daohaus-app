import React, { useEffect, useState } from 'react';
import Pagination from 'rc-pagination';

const Paginator = ({ perPage, setRecords, allRecords, reset }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (allRecords) {
      setTotalPages(allRecords.length);
      // TODO: Should we reset this on filtering? This only derives the action if the total count is different and doesn't account for sorting
      // const page = allRecords.length === totalPages ? currentPage : 1;
      // setCurrentPage(page);
      setRecords(filterVisibleRecords(allRecords, currentPage));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRecords]);

  useEffect(() => {
    if (reset) {
      handlePageChange(1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setRecords(filterVisibleRecords(allRecords, page));
  };

  const filterVisibleRecords = (acts, page) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return acts.slice(start, end);
  };

  return (
    <Pagination
      onChange={handlePageChange}
      current={currentPage}
      total={totalPages}
      pageSize={perPage}
      hideOnSinglePage={true}
    />
  );
};

export default Paginator;
