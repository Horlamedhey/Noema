import currencies from "../../public/currencies.json";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Currency {
  name: string;
  symbol: string;
  symbolNative: string;
  decimalDigits: number;
  rounding: number;
  code: string;
  namePlural: string;
}

export function CurrencySelect({
  ...props
}: Readonly<React.ComponentProps<typeof Select>>) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select a currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency: Currency) => (
          <SelectItem
            key={currency.code}
            value={currency.code}
          >
            {currency.code} - {currency.name} ({currency.symbolNative})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
