import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const FormSchema = z.object({
  shopId: z.string(),
  paperSize: z.string(),
  orientation: z.string(),
  file: z.union([z.instanceof(File), z.undefined()]),
  color: z.boolean(),
  pageRange: z.string().optional(),
  copies: z.coerce.number().min(1),
});

let INITIAL_NUMBER_OF_PAGES;

export default function PrintPage() {
  const { toast } = useToast();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    async function fetchShops() {
      try {
        const response = await axios.get("http://localhost:3000/shop/all", {
          withCredentials: true,
        });
        console.log(response.data);
        setShops(response.data);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    }
    fetchShops();
  }, []);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      paperSize: "A4",
      orientation: "Portrait",
      copies: 1,
    },
  });

  const validatePageRange = (value) => {
    const regex = /^(\d+(-\d+)?)(,(\d+(-\d+)?))*$/;
    return regex.test(value);
  };

  const [formData, setFormData] = useState({
    shopId: "",
    paperSize: "A4",
    orientation: "Portrait",
    file: undefined,
    color: false,
    pageRange: "",
    copies: 1,
  });

  async function onSubmit(data) {
    if (data.pageRange && !validatePageRange(data.pageRange)) {
      toast({
        title: "Invalid Page Range",
        description: "Please enter a valid page range.",
        status: "error",
      });
      return;
    }

    const formData = new FormData();
    if (data.file) {
      formData.append("file", data.file);
    }

    formData.append("shopId", data.shopId);
    formData.append("paperSize", data.paperSize);
    formData.append("orientation", data.orientation);
    formData.append("color", String(data.color));
    formData.append("pageRange", data.pageRange || "");
    formData.append("copies", String(data.copies));

    try {
      const response = await axios.post(
        "http://localhost:3000/dash/files",
        formData,
        {
          withCredentials: true,
        }
      );

      toast({
        title: "Print submitted successfully",
        description: response.data.message,
      });
    } catch (error) {
      console.error("Error sending form data:", error);
      toast({
        title: "Error",
        description: "Failed to submit print job.",
        status: "error",
      });
    }
  }

  const [numPages, setNumPages] = useState();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [secondPageNumber, setSecondPageNumber] = useState(2);
  const [customPages, setCustomPages] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);

  function onDocumentLoadSuccess({ numPages }) {
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

  function handlePageChange(event) {
    const value = event.target.value;
    if (value === "") {
      setCustomPages([]);
    } else if (validatePageRange(value)) {
      setCustomPages(getPagesFromRange(value));
    }
  }

  useEffect(() => {
    if (!customPages.length) {
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
      <Toaster />
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
                name="shopId"
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

                          {shops.map((shop) => (
                            <SelectItem
                              value={shop.shop_id.toString()}
                              key={shop.shop_id}
                            >
                              {shop.shop_name}
                            </SelectItem>
                          ))}
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
                name="pageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Range</FormLabel>
                    <Input
                      className="mb-5 mt-1"
                      placeholder="Comma separated pages or range or both"
                      {...field}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                        handlePageChange(event);
                      }}
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
          <div className="border-[1px] py-8 rounded-md drop-shadow-sm flex justify-center items-center flex-col">
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
