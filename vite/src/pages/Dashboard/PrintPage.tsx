import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { getPagesFromRange } from "@/utils/getPagesFromRange";
import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const FormSchema = z.object({
  shopName: z.string(),
  paperSize: z.string(),
  orientation: z.string(),
  file: z.union([z.instanceof(File), z.undefined()]),
  color: z.boolean(),
  pages: z.string().optional(),
  copies: z.coerce.number().min(1),
});

let INITIAL_NUMBER_OF_PAGES: number;

export default function PrintPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      paperSize: "A4",
      orientation: "Portrait",
      copies: 1,
    },
  });

  const [formData, setFormData] = useState<z.infer<typeof FormSchema>>({
    shopName: "",
    paperSize: "A4",
    orientation: "Portrait",
    file: undefined,
    color: false,
    pages: "",
    copies: 1,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();

    if (data.file) {
      formData.append("file", data.file);
    }

    console.log(formData);

    formData.append("shopName", data.shopName);
    formData.append("paperSize", data.paperSize);
    formData.append("orientation", data.orientation);
    formData.append("color", String(data.color));
    formData.append("pages", data.pages || "");
    formData.append("copies", String(data.copies));

    fetch("http://localhost:3000/submitPrint", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  }

  const [numPages, setNumPages] = useState<number>();
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [secondPageNumber, setSecondPageNumber] = useState<number>(2);

  const [customPages, setCustomPages] = useState<number[]>([]);

  const [currIndex, setCurrIndex] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    INITIAL_NUMBER_OF_PAGES = numPages;
    setNumPages(numPages);
  }

  function handleNext() {
    if (customPages.length) {
      if (currIndex + 2 >= numPages) return;

      setCurrIndex((prev) => prev + 2);
    }

    if (currentPageNumber + 1 === numPages) return;

    setCurrentPageNumber((prev) => prev + 2);
    setSecondPageNumber((prev) => prev + 2);
  }

  function handlePrev() {
    if (customPages.length) {
      if (currIndex - 2 < 0) return;

      setCurrIndex((prev) => prev - 2);
    }

    if (currentPageNumber === 1) return;

    setCurrentPageNumber((prev) => prev - 2);
    setSecondPageNumber((prev) => prev - 2);
  }

  function handlePageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCustomPages(getPagesFromRange(event.target.value));
  }

  useEffect(() => {
    if (!customPages.length) {
      console.log("here");
      setCurrentPageNumber(1);
      setSecondPageNumber(2);
      setNumPages(INITIAL_NUMBER_OF_PAGES);
      return;
    }

    setCurrentPageNumber(customPages[currIndex]);
    setSecondPageNumber(customPages[currIndex + 1]);
    setNumPages(customPages.length);
  }, [customPages, currIndex]);

  return (
    <>
      {" "}
      <div className="p-8">
        <h2 className="text-3xl mb-8">Take a print</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <h3 className="text-xl font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <Input
                      className="mb-5 mt-1"
                      type="file"
                      placeholder="Browse file"
                      onChange={(event) => {
                        field.onChange(event.target?.files?.[0] ?? undefined);
                        setFormData({
                          ...formData,
                          file: event.target?.files?.[0],
                        });
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shopName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select a shop</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shop" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Shop</SelectLabel>
                          <SelectItem value="Kanjirapally">
                            Kanjirapally
                          </SelectItem>
                          <SelectItem value="Koovapally">Koovapally</SelectItem>
                          <SelectItem value="Global AJCE">
                            Global AJCE
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paperSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Size</SelectLabel>
                          <SelectItem value="A3">A3</SelectItem>
                          <SelectItem value="A4">A4</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orientation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orientation</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an orientation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Orientation</SelectLabel>
                          <SelectItem value="Portrait">Portrait</SelectItem>
                          <SelectItem value="Landscape">Landscape</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-xl font-semibold mt-10">Additional Settings</h3>
            <div className="grid grid-cols-2 gap-6 mb-5">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Colour</FormLabel>
                      <FormDescription>
                        Check to take a colour print
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pages</FormLabel>
                    <Input
                      className="mb-5 mt-1"
                      placeholder="Comma separated pages or range or both"
                      {...field}
                      onChange={handlePageChange}
                    />
                    <FormDescription>
                      Leave blank to print all pages
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="copies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Copies</FormLabel>
                    <FormControl>
                      <Input
                        className="mb-5 mt-1"
                        type="number"
                        placeholder="Number of copies"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <div className="p-8 border-l w-2/5">
        {!formData.file ? (
          <div className="border-[1px]  py-8 rounded-md drop-shadow-sm flex justify-center items-center flex-col">
            <h2 className="text-center text-xl font-semibold mb-4">
              Print Preview
            </h2>
            <p className="text-center w-[250px]">
              Select a pdf from your computer to display the print Preview
            </p>
          </div>
        ) : (
          <div className="">
            <Document
              file={formData?.file}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <div className="flex justify-center items-center">
                {" "}
                <Button variant="ghost" onClick={handlePrev}>
                  <ChevronLeft className="" />
                </Button>
                <span className="mx-6">
                  Page{" "}
                  <Badge className="mx-3">
                    {currentPageNumber}, {secondPageNumber}
                  </Badge>
                  of
                  <Badge className="ml-3">{numPages}</Badge>
                </span>
                <Button variant="ghost" onClick={handleNext}>
                  <ChevronRight className="" />
                </Button>
              </div>

              <div className="mt-8 flex gap-4">
                <Page
                  pageNumber={currentPageNumber}
                  className="border-2 drop-shadow-sm"
                  width={250}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
                <Page
                  pageNumber={secondPageNumber}
                  className="border-2 drop-shadow-sm"
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={250}
                />
              </div>
            </Document>
          </div>
        )}
      </div>
    </>
  );
}
