import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

interface Step1Props {
  form: UseFormReturn<any>;
}

const languages = [
  { label: "English", value: "English" },
  { label: "Hindi", value: "Hindi" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Russian", value: "Russian" },
  { label: "Japanese", value: "Japanese" },
  { label: "Korean", value: "Korean" },
  { label: "Bengali", value: "Bengali" },
  { label: "Chinese", value: "Chinese" },
] as const;

export default function Step1({ form }: Step1Props) {
  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="font-semibold text-xl">Course Information</h1>
      </div>
      <FormField control={form.control} name="title" render={({ field }) => (
        <FormItem>
          <FormLabel>Course Name</FormLabel>
          <FormControl><Input type="text" placeholder="Enter course name" {...field} /></FormControl>
          <FormDescription>Enter a course title</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem>
          <FormLabel>Course Description</FormLabel>
          <FormControl><Textarea placeholder="Enter course description" {...field} /></FormControl>
          <FormDescription>Describe your course</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="price" render={({ field }) => (
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl><Input type="number" placeholder="Enter price" {...field} /></FormControl>
          <FormDescription>Enter the course price</FormDescription>
          <FormMessage />
        </FormItem>
      )} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField control={form.control} name="category" render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>Course Category</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="graphic-design">Graphic Design</SelectItem>
                  <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="level" render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>Course Level</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField control={form.control} name="thumbnail" render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel>Upload Thumbnail</FormLabel>
            <FormControl>
              <Input
                id="picture"
                type="file"
                className="cursor-pointer file:cursor-pointer text-xs sm:text-sm"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={(e) => field.onChange(e.target.files?.[0])}
              />
            </FormControl>
            {field.value && <p className="text-xs text-muted-foreground truncate">Selected: {field.value.name}</p>}
            <FormDescription>Please upload a valid image file in JPG, PNG, or GIF format.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col min-w-0">
              <FormLabel>Course Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal text-xs sm:text-sm",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">
                        {field.value
                          ? languages.find((language) => language.value === field.value)?.label
                          : "Select language"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[--radix-popover-trigger-width] min-w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList className="custom-scrollbar">
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => form.setValue("language", language.value)}
                          >
                            {language.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                language.value === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>This is the language that will be used in the Course.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
