import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AllPrintsPage() {
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchFiles();
  }, [page, statusFilter]);

  async function fetchFiles() {
    try {
      const response = await axios.get("http://localhost:3000/dash/ongoing", {
        withCredentials: true,
        params: {
          page,
          limit: 5,
        },
      });

      let filteredFiles = response.data.files;

      if (statusFilter !== "All") {
        filteredFiles = filteredFiles.filter(
          (file) => file.status === statusFilter
        );
      }

      setFiles(filteredFiles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error retrieving user files:", error);
    }
  }

  function handleFilterChange(filter) {
    setStatusFilter(filter);
    setPage(1);
  }

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl font-semibold mb-6">Your prints</h1>
      <p>Lists all prints and their current status</p>

      <p className="mb-12 font-semibold mt-4">The changes are realtime.</p>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            statusFilter === "All" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleFilterChange("All")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${
            statusFilter === "Pending"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleFilterChange("Pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded ${
            statusFilter === "Ongoing"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleFilterChange("ongoing")}
        >
          Ongoing
        </button>
        <button
          className={`px-4 py-2 rounded ${
            statusFilter === "Complete"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleFilterChange("Complete")}
        >
          Complete
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Print Id</TableHead>
            <TableHead>Pages</TableHead>
            <TableHead>Copies</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Shop Name</TableHead>
            <TableHead>Print status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.file_id}>
              <TableCell className="font-medium">{file.file_id}</TableCell>
              <TableCell className="font-medium">
                {file.pageRange || "All pages"}
              </TableCell>
              <TableCell>{file.copies}</TableCell>
              <TableCell>{file.filename}</TableCell>
              <TableCell>{file.shop_name}</TableCell>
              <TableCell>{file.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
