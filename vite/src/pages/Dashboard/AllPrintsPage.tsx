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

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await axios.get("http://localhost:3000/dash/ongoing", {
          withCredentials: true,
        });

        console.log(response);
        console.log(response.data);

        setFiles(response.data);
      } catch (error) {
        console.error("Error retreiving user files", error);
      }
    }
    fetchFiles();
  }, []);

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl font-semibold mb-6">Your prints</h1>
      <p>Lists all prints and their current status</p>

      <p className="mb-12 font-semibold mt-4">The changes are realtime.</p>

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

              <TableCell>{file.done ? "Done" : "Pending"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
