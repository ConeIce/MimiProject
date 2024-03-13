import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";

import { z } from "zod";

const formSchema = z.object({
  shopName: z.string(),
  paperSize: z.string(),
  orientation: z.string(),
  file: z.string(),
  pages: z.string(),
  copies: z.number(),
});

export default function PrintPage() {
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  // }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: "",
      paperSize: "",
      orientation: "",
      file: "",
      pages: "",
      copies: 0,
    },
  });

  const [pages, setPages] = useState("");

  const getStartEnd = (range: string) => {
    const [start, end] = range.split("-");

    return [Number(start), Number(end)];
  };

  const isRange = (range: string) => {
    const [start, end] = getStartEnd(range);

    if (range.includes("-") && start <= end) {
      return true;
    }
    return false;
  };

  const splitRangeIntoPages = (range: string) => {
    const [start, end] = getStartEnd(range);

    const pages = Array.from({ length: end - start + 1 }, (_, i) => {
      return start + i;
    });

    return pages;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const pagesArray = pages.split(",").map((page) => page.trim());

    const pagesToPrint = [];

    pagesArray.forEach((page) => {
      if (isRange(page)) {
        pagesToPrint.push(...splitRangeIntoPages(page));
      } else if (Number(page)) {
        pagesToPrint.push(Number(page));
      }
    });

    console.log(pagesToPrint);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-5">Prints</h2>

      <form onSubmit={handleSubmit}>
        <p>Select from nearby printing shops</p>
        <Select>
          <SelectTrigger className="w-[180px] mb-5 mt-1">
            <SelectValue placeholder="Select a shop" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Shop</SelectLabel>
              <SelectItem value="Kanjirapally">Kanjirapally</SelectItem>
              <SelectItem value="Koovapally">Koovapally</SelectItem>
              <SelectItem value="Global AJCE">Global AJCE</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <p>Paper size</p>
        <Select>
          <SelectTrigger className="w-[180px] mb-5 mt-1">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Size</SelectLabel>
              <SelectItem value="Kanjirapally">A4</SelectItem>
              <SelectItem value="Koovalappy">A3</SelectItem>
              <SelectItem value="Global AJCE">A1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <p>Select Orientation</p>
        <Select>
          <SelectTrigger className="w-[180px] mb-5 mt-1">
            <SelectValue placeholder="Select orientation" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Orientation</SelectLabel>
              <SelectItem value="Kanjirapally">Portrait</SelectItem>
              <SelectItem value="Koovalappy">Landscape</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <p>Colour</p>
        <Select>
          <SelectTrigger className="w-[180px] mb-5 mt-1">
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Color</SelectLabel>
              <SelectItem value="Kanjirapally">Yes</SelectItem>
              <SelectItem value="Koovalappy">No</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <p>Upload you file</p>
        <Input
          className="w-[180px] mb-5 mt-1"
          type="file"
          placeholder="Browse file"
        />

        <p>Pages</p>
        <Input
          className="w-[180px] mb-5 mt-1"
          type="text"
          placeholder="Pages"
          value={pages}
          onChange={(e) => setPages(e.target.value)}
        />

        <p>Copies</p>
        <Input
          className="w-[180px] mb-5 mt-1"
          type="number"
          placeholder="Copies"
        />

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
