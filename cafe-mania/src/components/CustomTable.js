import React, { useState } from "react";
import { Table, FormControl, Button, Pagination } from "react-bootstrap";
import { FaSort, FaEdit, FaTrash } from "react-icons/fa";
import "../Assets/CSS/table.css";

const CustomTable = ({ cols, data, onUpdate, onDelete }) => {
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 9;

  const handleFilterChange = (e, key) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleSortClick = (key) => {
    setSortConfig((prevState) => {
      const newDirection =
        prevState.key === key && prevState.direction === "asc" ? "desc" : "asc";
      return { key, direction: newDirection };
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredData = data.filter((item) => {
    return cols.every((col) => {
      const key = col.field;
      if (!filters[key]) return true;
      return item[key]
        ?.toString()
        .toLowerCase()
        .includes(filters[key].toString().toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === bValue) return 0;
    if (sortConfig.direction === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(sortedData.length / recordsPerPage);

  const getPaginationItems = () => {
    let items = [];

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div id="table">
      <Table hover className="table-hover border ">
        <thead className="thead-dark">
          <tr>
            {cols.map((headerItem, index) => (
              <th key={index} className="header-cell p-3">
                <div className="header-content">
                  {headerItem.title}
                  <Button
                    variant="link"
                    onClick={() => handleSortClick(headerItem.field)}
                    className="sort-button"
                  >
                    <FaSort />
                  </Button>
                </div>
                <FormControl
                  type="text"
                  placeholder={`Filter ${headerItem.title}`}
                  onChange={(e) => handleFilterChange(e, headerItem.field)}
                  className="filter-input"
                />
              </th>
            ))}
            {(onUpdate || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((item, index) => (
            <tr key={index}>
              {cols.map((col, key) => (
                <td className="p-3" key={key}>
                  {col.render(item)}
                </td>
              ))}
              {(onUpdate || onDelete) && (
                <td>
                  <>
                    {onUpdate && (
                      <Button variant="link" onClick={() => onUpdate(item)}>
                        <FaEdit className="text-primary" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="link" onClick={() => onDelete(item._id)}>
                        <FaTrash className="text-danger" />
                      </Button>
                    )}
                  </>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end">
        <Pagination>
          {currentPage > 1 && (
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
          )}
          {getPaginationItems()}
          {currentPage < totalPages && (
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
          )}
        </Pagination>
      </div>
    </div>
  );
};

export default CustomTable;
