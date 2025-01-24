import countries from "../../public/countries.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OpecCountry {
  name: string;
  isOPEC: boolean;
}

export function CountrySelect({
  ...props
}: Readonly<React.ComponentProps<typeof Select>>) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country: OpecCountry) => (
          <SelectItem
            key={country.name}
            value={JSON.stringify(country)}
          >
            {country.name}
            {country.isOPEC && "🛢️"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
