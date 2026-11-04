import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, XCircle } from "lucide-react";

interface Step4Props {
  form: UseFormReturn<any>;
}

export default function Step4({ form }: Step4Props) {
  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "studyMaterials",
  });

  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="font-semibold text-xl">Upload Study Materials</h1>
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="p-6 border rounded-lg relative space-y-4">
            <div className="flex items-center justify-center">
                <h2 className="font-semibold text-lg py-2 px-6 rounded-lg border border-card-foreground border-dashed">
                Study Material {index + 1}
                </h2>
            </div>
          {/* Study Material Name */}
          <FormField
            control={control}
            name={`studyMaterials.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter study material name" {...field} />
                </FormControl>
                <FormDescription>Enter a valid file name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Input */}
          <FormField
            control={control}
            name={`studyMaterials.${index}.file`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                {field.value && <p className="text-sm text-muted-foreground">Selected: {field.value.name}</p>}
                <FormDescription>Please upload a valid file in pdf, doc, docx, ppt or pptx format.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remove Study Material (Except First One) */}
          {index > 0 && (
            <button
              type="button"
              className="p-1 absolute top-2 right-2 text-destructive-foreground"
              onClick={() => remove(index)}
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}

      {/* Add Study Material Button */}
      <Button
        type="button"
        variant="secondary"
        className="mt-4"
        onClick={async () => {
          if (
            fields.length > 0 &&
            !(await form.trigger([
              `studyMaterials.${fields.length - 1}.name`,
              `studyMaterials.${fields.length - 1}.file`,
            ]))
          ) {
            return;
          }

          append({ name: "", file: undefined });
        }}
      >
        <Plus size={14} />
        Study Material
      </Button>
    </>
  );
}
