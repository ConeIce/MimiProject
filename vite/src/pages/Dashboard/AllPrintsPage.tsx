import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Printer, Cross, Check } from "lucide-react";

export default function AllPrintsPage() {
  return (
    <div className="p-10 grid grid-cols-3 gap-6">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>WAD_Project</CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <Printer />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">3 Copies</p>
              <p className="text-sm text-muted-foreground">Black and White</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="destructive">
            <Cross className="mr-2 h-4 w-4" /> Not Ready
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>WAD_Project</CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <Printer />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">3 Copies</p>
              <p className="text-sm text-muted-foreground">Black and White</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="destructive">
            <Cross className="mr-2 h-4 w-4" /> Not Ready
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>WAD_Project</CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <Printer />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">1 Copies</p>
              <p className="text-sm text-muted-foreground">Black and White</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="destructive">
            <Cross className="mr-2 h-4 w-4" /> Not Ready
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>WAD_Project</CardTitle>
          <CardDescription> </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <Printer />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">5 Copies</p>
              <p className="text-sm text-muted-foreground">Colour</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default">
            <Check className="mr-2 h-4 w-4" /> Ready
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
