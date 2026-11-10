import { MapIcon, MedalIcon, PlaneIcon, TrophyIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.2rem] h-[2.2rem] sm:w-[2.5rem] sm:h-[2.5rem]" />,
    title: "Accessible Learning",
    description:
      "Learn at your own pace on any device, with a clean, intuitive interface made for every kind of learner.",
  },
  {
    icon: <MapIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.2rem] h-[2.2rem] sm:w-[2.5rem] sm:h-[2.5rem]" />,
    title: "Vibrant Community",
    description:
      "Connect with peers, join discussions, and grow together through live sessions and collaborative spaces.",
  },
  {
    icon: <PlaneIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.2rem] h-[2.2rem] sm:w-[2.5rem] sm:h-[2.5rem]" />,
    title: "Scalable Progression",
    description:
      "Start with the basics and advance to expert-level topics with guided paths tailored to your growth.",
  },
  {
    icon: <TrophyIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.2rem] h-[2.2rem] sm:w-[2.5rem] sm:h-[2.5rem]" />,
    title: "Motivating Experience",
    description:
      "Earn rewards, track your milestones, and enjoy gamified learning that keeps you inspired every step of the way.",
  },
];

export const HowItWorks = () => {
  return (   
    <section
      id="howItWorks"
      className="container text-center py-8 sm:py-12 md:py-20 relative"
    >
      <div className="shadow-price2"></div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        How It{" "}
        <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-2 sm:mt-4 mb-6 sm:mb-8 text-base sm:text-lg md:text-xl text-muted-foreground">
        Master new skills with a seamless, interactive, and empowering learning experience.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                <span className="text-lg sm:text-xl">{title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm sm:text-base text-muted-foreground">{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
