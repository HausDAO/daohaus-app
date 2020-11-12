import React, { useEffect, useState } from 'react';
import Pagination from 'rc-pagination';

const ActivityPaginator = ({ perPage, setRecords, allRecords }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (allRecords) {
      setRecords(filterVisibleActivites(allRecords, currentPage));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRecords]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setRecords(filterVisibleActivites(allRecords, page));
  };

  const filterVisibleActivites = (acts, page) => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return acts.slice(start, end);
  };

  return (
    <Pagination
      onChange={handlePageChange}
      current={currentPage}
      total={allRecords.length}
      pageSize={perPage}
      hideOnSinglePage={true}
    />
  );
};

export default ActivityPaginator;
