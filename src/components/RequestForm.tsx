"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, CircleCheckBig, CircleX, Info } from "lucide-react";
import { format } from "date-fns";

import { cn, daysFromNow } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { CountrySelect } from "./CountrySelect";
import { CurrencySelect } from "./CurrencySelect";
import { Textarea } from "./ui/textarea";
import { useMemo, useState } from "react";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  country: z.string({
    message: "Country is required",
  }),
  projectCode: z
    .string()
    .length(9, { message: "Must be in the format ABCD-1234." })
    .regex(/^[A-Z]{4}-\d{4}$/, {
      message: "Must be in the format ABCD-1234.",
    }),
  projectDescription: z
    .string()
    .min(10, { message: "Project description must be at least 10 characters." })
    .max(150, {
      message: "Project description should not be more than 150 characters.",
    }),
  currency: z.string(),
  amount: z.any(),
});

export function RequestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      projectCode: "",
      country: undefined,
      currency: "",
      amount: 0,
      projectDescription: "",
    },
  });
  const [country, startDate] = form.watch(["country", "startDate"]);
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  const countryIsOpec = useMemo(() => {
    const isOPEC = JSON.parse(country ?? "{}").isOPEC;
    if (isOPEC)
      form.setValue("currency", "USD", {
        shouldDirty: true,
        shouldTouch: true,
      });
    return isOPEC;
  }, [country]);

  const endDateDefaultMonth = useMemo<Date>(() => {
    const date = startDate ? new Date(startDate) : new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }, [startDate]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { country, ...rest } = values;
    const selectedCountry = JSON.parse(country).name;
    fetch("https://test-noema-api.azurewebsites.net/api/requests", {
      method: "POST",
      body: JSON.stringify({ ...rest, country: selectedCountry }),
    })
      .then(() => {
        toast({
          title:
            "You have submitted a financing request. You will hear back from us shortly.",
          description: (
            <div className="flex justify-center mt-5">
              <CircleCheckBig
                size={86}
                color="green"
              />
            </div>
          ),
          style: {
            textAlign: "center",
          },
        });
        form.reset();
      })
      .catch(() => {
        toast({
          title:
            "Oops! There was an error submitting your request, please try again later.",
          description: (
            <div className="flex justify-center mt-5">
              <CircleX
                size={86}
                color="red"
              />
            </div>
          ),
          style: {
            textAlign: "center",
          },
        });
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[750px]"
      >
        <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <CountrySelect
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                OPEC countries are indicated with an oil barrel emoji (🛢️).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <CurrencySelect
                    disabled={countryIsOpec}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="projectCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="ABCD-1234"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the project."
                  className="resize-none"
                  rows={5}
                  maxLength={150}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Should not exceed 150 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h3>Validity period</h3>
          <p className="text-blue-700">
            <Info
              size={16}
              className="inline mr-1"
            />
            <span className="text-xs">
              Start date should be at least 15 days from date of submission and
              End date should be between 1 to 3 years from the Start date.
            </span>
          </p>
          <div className="grid grid-rows-2 sm:grid-rows-1 grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-2 mt-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start date</FormLabel>
                  <Popover
                    open={startCalendarOpen}
                    onOpenChange={setStartCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex w-full justify-between px-4 py-3.5 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick validity start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        captionLayout="dropdown-buttons"
                        mode="single"
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 50}
                        defaultMonth={new Date()}
                        numberOfMonths={2}
                        selected={field.value}
                        onSelect={(value) => {
                          field.onChange(value);
                          setStartCalendarOpen(false);
                        }}
                        disabled={(date) => date < daysFromNow(15)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End date</FormLabel>
                  <Popover
                    open={endCalendarOpen}
                    onOpenChange={setEndCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex w-full justify-between px-4 py-3.5 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick validity end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        className="mt-4"
                        captionLayout="dropdown-buttons"
                        mode="single"
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 50}
                        defaultMonth={endDateDefaultMonth}
                        numberOfMonths={2}
                        selected={field.value}
                        onSelect={(value) => {
                          field.onChange(value);
                          setEndCalendarOpen(false);
                        }}
                        disabled={(date) => {
                          const minDate = startDate
                            ? new Date(startDate)
                            : daysFromNow(15);
                          const maxDate = new Date(minDate);
                          minDate.setFullYear(minDate.getFullYear() + 1);
                          maxDate.setFullYear(maxDate.getFullYear() + 3);
                          return date < minDate || date > maxDate;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
