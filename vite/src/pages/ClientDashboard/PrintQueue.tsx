import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function PrintQueue() {
  const [pendingPrints, setPendingPrints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 5; // Number of prints per page

  useEffect(() => {
    fetchPendingPrints(currentPage);
  }, [currentPage]);

  const fetchPendingPrints = async (page) => {
    setLoading(true);

    try {
      // Fetch shop_id from shop_staff table using user_id from passport
      const responseShopId = await axios.get(
        "http://localhost:3000/shop/shopId",
        {
          withCredentials: true,
        }
      );

      const shop_id = responseShopId.data.shop_id;

      // Fetch pending prints with pagination from files table using shop_id
      const responsePrints = await axios.get(
        `http://localhost:3000/shop/prints/${shop_id}?page=${page}`,
        {
          withCredentials: true,
        }
      );

      setPendingPrints(responsePrints.data.prints);
      setTotalPages(responsePrints.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending prints:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl font-semibold mb-6">Pending Prints</h1>
      <p>
        Lists all prints waiting for printers/authorization. Completed prints
        can be found{" "}
        <a href="/here" className="underline">
          here
        </a>
      </p>

      <p className="mb-12 font-semibold mt-4">The changes are realtime.</p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Print Id</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Copies</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Print status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingPrints.map((file) => (
                <TableRow key={file.printId}>
                  <TableCell className="font-medium">{file.printId}</TableCell>
                  <TableCell className="font-medium">{file.pages}</TableCell>
                  <TableCell>{file.copies}</TableCell>
                  <TableCell>{file.fileName}</TableCell>
                  <TableCell>{file.printStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between">
            <Button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button onClick={nextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>

          <p className="mt-4 text-center">
            Page {currentPage} of {totalPages}
          </p>
        </>
      )}
    </div>
  );
}
