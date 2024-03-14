// import { Button } from "@/components/ui/button";
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormDescription,
//   FormMessage,
// } from "@/components/ui/form";

// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { Form, useForm } from "react-hook-form";
// import { Link } from "react-router-dom";

// import { z } from "zod";

// const formSchema = z.object({
//   shopName: z.string(),
//   paperSize: z.string(),
//   orientation: z.string(),
//   file: z.string(),
//   pages: z.string(),
//   copies: z.number(),
// });

// export default function PrintPage() {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       shopName: "",
//       paperSize: "",
//       orientation: "",
//       file: "",
//       pages: "",
//       copies: 0,
//     },
//   });

//   const [pages, setPages] = useState("");

//   const getStartEnd = (range: string) => {
//     const [start, end] = range.split("-");

//     return [Number(start), Number(end)];
//   };

//   const isRange = (range: string) => {
//     const [start, end] = getStartEnd(range);

//     if (range.includes("-") && start <= end) {
//       return true;
//     }
//     return false;
//   };

//   const splitRangeIntoPages = (range: string) => {
//     const [start, end] = getStartEnd(range);

//     const pages = Array.from({ length: end - start + 1 }, (_, i) => {
//       return start + i;
//     });

//     return pages;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const pagesArray = pages.split(",").map((page) => page.trim());

//     const pagesToPrint = [];

//     pagesArray.forEach((page) => {
//       if (isRange(page)) {
//         pagesToPrint.push(...splitRangeIntoPages(page));
//       } else if (Number(page)) {
//         pagesToPrint.push(Number(page));
//       }
//     });

//     console.log(pagesToPrint);
//   };

//   function onSubmit(data: z.infer<typeof formSchema>) {
//     console.log(data);
//   }

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-5">Prints</h2>

//       <form onSubmit={handleSubmit}>
//         <p>Select from nearby printing shops</p>
//         <Select>
//           <SelectTrigger className="w-[180px] mb-5 mt-1">
//             <SelectValue placeholder="Select a shop" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Shop</SelectLabel>
//               <SelectItem value="Kanjirapally">Kanjirapally</SelectItem>
//               <SelectItem value="Koovapally">Koovapally</SelectItem>
//               <SelectItem value="Global AJCE">Global AJCE</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         <p>Paper size</p>
//         <Select>
//           <SelectTrigger className="w-[180px] mb-5 mt-1">
//             <SelectValue placeholder="Select a size" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Size</SelectLabel>
//               <SelectItem value="Kanjirapally">A4</SelectItem>
//               <SelectItem value="Koovalappy">A3</SelectItem>
//               <SelectItem value="Global AJCE">A1</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         <p>Select Orientation</p>
//         <Select>
//           <SelectTrigger className="w-[180px] mb-5 mt-1">
//             <SelectValue placeholder="Select orientation" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Orientation</SelectLabel>
//               <SelectItem value="Kanjirapally">Portrait</SelectItem>
//               <SelectItem value="Koovalappy">Landscape</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         <p>Colour</p>
//         <Select>
//           <SelectTrigger className="w-[180px] mb-5 mt-1">
//             <SelectValue placeholder="Select a color" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectLabel>Color</SelectLabel>
//               <SelectItem value="Kanjirapally">Yes</SelectItem>
//               <SelectItem value="Koovalappy">No</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         <p>Upload you file</p>
//         <Input
//           className="w-[180px] mb-5 mt-1"
//           type="file"
//           placeholder="Browse file"
//         />

//         <p>Pages</p>
//         <Input
//           className="w-[180px] mb-5 mt-1"
//           type="text"
//           placeholder="Pages"
//           value={pages}
//           onChange={(e) => setPages(e.target.value)}
//         />

//         <p>Copies</p>
//         <Input
//           className="w-[180px] mb-5 mt-1"
//           type="number"
//           placeholder="Copies"
//         />

//         <Button type="submit">Submit</Button>
//       </form>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="w-2/3 space-y-6"
//         >
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a verified email to display" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="m@example.com">m@example.com</SelectItem>
//                     <SelectItem value="m@google.com">m@google.com</SelectItem>
//                     <SelectItem value="m@support.com">m@support.com</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>
//                   You can manage email addresses in your{" "}
//                   <Link href="/examples/forms">email settings</Link>.
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     </div>
//   );
// }

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

const getPagesFromRange = (range: string) => {
  const pagesArray = range.split(",").map((page) => page.trim());

  const pagesToPrint = [];

  pagesArray.forEach((page) => {
    if (isRange(page)) {
      pagesToPrint.push(...splitRangeIntoPages(page));
    } else if (Number(page)) {
      pagesToPrint.push(Number(page));
    }
  });

  return pagesToPrint;
};

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const FormSchema = z.object({
  shopName: z.string(),
  paperSize: z.string(),
  orientation: z.string(),
  file: z.instanceof(File),
  color: z.string(),
  pages: z.string().optional(),
  copies: z.coerce.number(),
});

export default function PrintPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    const pages = getPagesFromRange(data.pages);
    console.log(pages);
  }

  return (
    <div className="p-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
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
                      <SelectItem value="Kanjirapally">Kanjirapally</SelectItem>
                      <SelectItem value="Koovapally">Koovapally</SelectItem>
                      <SelectItem value="Global AJCE">Global AJCE</SelectItem>
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

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colour</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Colour" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Color</SelectLabel>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
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
                  className="w-[180px] mb-5 mt-1"
                  placeholder="Browse file"
                  {...field}
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
                    className="w-[180px] mb-5 mt-1"
                    type="number"
                    placeholder="Number of copies"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
