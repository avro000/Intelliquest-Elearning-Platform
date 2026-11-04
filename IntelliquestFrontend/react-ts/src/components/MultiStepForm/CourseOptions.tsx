import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Step3Props {
  form: UseFormReturn<any>;
}

export default function Step3({ form }: Step3Props) {
  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="font-semibold text-xl">Course Benefits & Prerequisites</h1>
      </div>
      <FormField control={form.control} name="benefits" render={({ field }) => (
        <FormItem>
          <FormLabel>What are the benefits for students in this course?</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter course benefits" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="prerequisites" render={({ field }) => (
        <FormItem>
          <FormLabel>What are the prerequisites for starting this course?</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Enter course prerequisites" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </>
  );
}
