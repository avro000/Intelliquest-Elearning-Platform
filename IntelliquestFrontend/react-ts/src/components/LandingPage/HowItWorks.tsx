import { MapIcon, MedalIcon, PlaneIcon, TrophyIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.5rem] h-[2.5rem]" />,
    title: "Accessible Learning",
    description:
      "Learn at your own pace on any device, with a clean, intuitive interface made for every kind of learner.",
  },
  {
    icon: <MapIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.5rem] h-[2.5rem]" />,
    title: "Vibrant Community",
    description:
      "Connect with peers, join discussions, and grow together through live sessions and collaborative spaces.",
  },
  {
    icon: <PlaneIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.5rem] h-[2.5rem]" />,
    title: "Scalable Progression",
    description:
      "Start with the basics and advance to expert-level topics with guided paths tailored to your growth.",
  },
  {
    icon: <TrophyIcon className="fill-[oklch(0.488_0.243_264.376)] w-[2.5rem] h-[2.5rem]" />,
    title: "Motivating Experience",
    description:
      "Earn rewards, track your milestones, and enjoy gamified learning that keeps you inspired every step of the way.",
  },
];

export const HowItWorks = () => {
  return (   
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32 relative"
    >
      <div className="shadow-price2"></div>
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
      Master new skills with a seamless, interactive, and empowering learning experience.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};