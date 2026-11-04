import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Step1 from "./CourseInformation";
import Step2 from "./CourseContent";
import Step3 from "./CourseOptions";
import Step4 from "./StudyMaterials";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const FormSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  level: z.string().min(1, "Level is required"),
  thumbnail: z.custom<File>((val) => val instanceof File, "Thumbnail is required"),
  language: z.string().min(1, "Language is required"),
  topics: z.array(
    z.object({
      name: z.string().min(1, "Topic name is required"),
      subtopics: z.array(
        z.object({
          name: z.string().min(1, "Subtopic name is required"),
          videos: z.array(
            z.object({
              title: z.string().min(1, "Video title is required"),
              description: z.string().min(1, "Video description is required"),
              url: z.string().url("Invalid video URL"),
            })
          ),
        })
      ),
    })
  ),
  benefits: z.string().min(1, "Benefits are required"),
  prerequisites: z.string().min(1, "Prerequisites are required"),
  studyMaterials: z.array(
    z.object({
      name: z.string().min(1, "Study material name is required"),
      file: z.custom<File>((val) => val instanceof File, "File is required"),
    })
  ).min(1, "At least one study material is required"),
});

// Type based on the schema
type FormValues = z.infer<typeof FormSchema>;

export default function MultiStepCourseForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      level: "",
      thumbnail: undefined,
      language: "",
      topics: [{ name: "", subtopics: [] }],
      benefits: "",
      prerequisites: "",
      studyMaterials: [{ name: "", file: undefined }],
    },
  });

  const stepFields = [
    ["title", "description", "price", "category", "level", "thumbnail", "language"],
    ["topics"],
    ["benefits", "prerequisites"],
    ["studyMaterials"],
  ];

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const nextStep = async () => {
    setErrorMessage(null);
    let isValid = false;

    if ([1, 3, 4].includes(step)) {
      isValid = await form.trigger(stepFields[step - 1] as (keyof FormValues)[]);
    } else if (step === 2) {
      const topics = form.getValues("topics");
      if (!topics.length) {
        setErrorMessage("At least one topic is required.");
        return;
      }
      if (!topics[0]?.subtopics?.length) {
        setErrorMessage("At least one subtopic is required.");
        return;
      }
      if (!topics[0].subtopics[0]?.videos?.length) {
        setErrorMessage("At least one video is required.");
        return;
      }
      isValid = await form.trigger("topics");
    }

    if (isValid) setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const currentDateTime = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", values.category);
      formData.append("level", values.level);
      formData.append("language", values.language);
      formData.append("benefits", values.benefits);
      formData.append("prerequisites", values.prerequisites);
      formData.append("thumbnail", values.thumbnail);

      values.topics.forEach((topic, topicIndex) => {
        formData.append(`topics[${topicIndex}].name`, topic.name);

        topic.subtopics.forEach((subtopic, subtopicIndex) => {
          formData.append(`topics[${topicIndex}].subtopics[${subtopicIndex}].name`, subtopic.name);

          subtopic.videos.forEach((video, videoIndex) => {
            formData.append(`topics[${topicIndex}].subtopics[${subtopicIndex}].videos[${videoIndex}].title`, video.title);
            formData.append(`topics[${topicIndex}].subtopics[${subtopicIndex}].videos[${videoIndex}].description`, video.description);
            formData.append(`topics[${topicIndex}].subtopics[${subtopicIndex}].videos[${videoIndex}].url`, video.url);
          });
        });
      });

      values.studyMaterials.forEach((material, matIndex) => {
        formData.append(`studyMaterials[${matIndex}].name`, material.name);
        formData.append(`studyMaterials[${matIndex}].file`, material.file);
      });

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:9092/auth/create-courses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      const data = await response.text();

      if (response.ok) {
        toast.success("Course created successfully!", {
          description: currentDateTime,
          style: {
            backgroundColor: "#16a34a",
            color: "white",
          },
        });
        form.reset();
        setStep(1);
      } else {
        toast.error("Error creating course", {
          description: data || "Failed to create course!",
          style: {
            backgroundColor: "#dc2626",
            color: "white",
          },
        });
      }
    } catch (error: any) {
      console.error("Network error:", error);
      toast.error("Network Error", {
        description: "Please check your internet connection.",
        style: {
          backgroundColor: "#dc2626",
          color: "white",
        },
      });
    }
  };

  return (
    <div className="w-full h-full p-5">
      <Card className="p-6 w-full h-full relative overflow-hidden justify-between">
        <Progress value={(step / totalSteps) * 100} className="absolute top-0 left-0 w-full h-2" />
        <CardContent className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && <Step1 form={form} />}
              {step === 2 && <Step2 form={form} />}
              {step === 3 && <Step3 form={form} />}
              {step === 4 && <Step4 form={form} />}
              {errorMessage && (
                <Alert variant="destructive" className="mb-4 border border-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
        <div className="flex justify-between px-6 pb-6">
          <Button onClick={prevStep} disabled={step === 1} variant="outline">
            Back
          </Button>
          <Button
            onClick={async () => {
              if (step === totalSteps) {
                const isFinalValid = await form.trigger();
                if (isFinalValid) {
                  form.handleSubmit(onSubmit)();
                }
              } else {
                nextStep();
              }
            }}
          >
            {step === totalSteps ? "Submit" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}