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

export default function PrintPage() {
  return (
    <div>
      <h2>Prints</h2>

      <p>Select from nearby printing shops</p>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a shop" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="Kanjirapally">Kanjirapally</SelectItem>
            <SelectItem value="Koovalappy">Koovalappy</SelectItem>
            <SelectItem value="Global AJCE">Global AJCE</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <p>Paper size</p>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="Kanjirapally">A4</SelectItem>
            <SelectItem value="Koovalappy">A3</SelectItem>
            <SelectItem value="Global AJCE">A1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <p>Select Orientation</p>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a size" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Orientation</SelectLabel>
            <SelectItem value="Kanjirapally">Portrait</SelectItem>
            <SelectItem value="Koovalappy">Landscape</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <p>Upload you file</p>
      <Input className="w-[180px]" type="file" placeholder="Browse file" />

      <p>Pages</p>
      <Input className="w-[180px]" type="text" placeholder="Pages" />

      <p>Copies</p>
      <Input className="w-[180px]" type="number" placeholder="Copies" />
    </div>
  );
}
