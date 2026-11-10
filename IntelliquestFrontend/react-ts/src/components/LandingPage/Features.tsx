import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureProps {
  title: string;
  description: string;
  image: string;
}

const features: FeatureProps[] = [
  {
    title: "Responsive Design",
    description:
      "Learn on any device with a platform built to adapt seamlessly across desktop, tablet, and mobile.",
    image: "/looking-ahead.png",
  },
  {
    title: "Intuitive Interface",
    description:
      "Navigate your learning journey with ease through a clean, modern, and user-friendly experience.",
    image: "/reflecting.png",
  },
  {
    title: "AI-Powered Insights",
    description:
      "Get personalized course suggestions and performance feedback with smart analytics driven by AI.",
    image: "/growth.png",
  },
];

const featureList: string[] = [
  "Courses",
  "Webinars",
  "Tracking",
  "Gamification",
  "Expertise",
  "Mobile",
  "Community",
  "Quizzes",
  "Personalization",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-8 sm:py-12 md:py-20 space-y-6 sm:space-y-8"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-2 sm:gap-3">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-xs sm:text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title} className="flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm sm:text-base text-muted-foreground">{description}</CardContent>
            </div>

            <CardFooter className="pt-4">
              <img
                src={image}
                alt={title}
                className="w-[180px] sm:w-[220px] lg:w-[260px] mx-auto object-contain"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
