import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const files = [
  {
    printId: 1,
    pages: 10,
    copies: 2,
    fileName: "file1.pdf",
    printStatus: "Done",
  },
  {
    printId: 2,
    pages: 5,
    copies: 1,
    fileName: "file2.pdf",
    printStatus: "Pending",
  },
  {
    printId: 3,
    pages: 8,
    copies: 3,
    fileName: "file3.pdf",
    printStatus: "Pending",
  },
];

export default function PrintQueue() {
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
          {files.map((file) => (
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
    </div>
  );
}
