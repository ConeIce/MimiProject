import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function Dashboard() {
  axios
    .get("http://localhost:3000/admin-dash/test-route", {
      withCredentials: true,
    })
    .then((res) => {
      console.log(res);
    });

  return (
    <div className="p-10 px-16 w-full">
      <h1 className="text-2xl">Shop Settings</h1>

      <div>
        <Label>Shop Name</Label>
        <Input
          type="text"
          className="mt-3"
          placeholder="This name will be displayed to customers"
        />
      </div>

      <h1 className="text-2xl mt-8">Shop summary</h1>

      <div className="flex gap-8">
        <div className="bg-black text-white text-2xl font-bold p-8 rounded-md   ">
          45 Total Prints
        </div>
        <div className="bg-black text-white text-2xl font-bold p-8 rounded-md   ">
          35 Prints Pending
        </div>
        <div className="bg-black text-white text-2xl font-bold p-8 rounded-md   ">
          $3000 in Profits
        </div>
      </div>
    </div>
  );
}
