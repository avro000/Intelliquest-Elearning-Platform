import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BookOpenCheck, Brain, LineChart } from "lucide-react";

interface ServiceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const serviceList: ServiceProps[] = [
  {
    title: "Self-paced Learning",
    description: "Access courses anytime and learn at your own speed.",
    icon: <BookOpenCheck className="text-[oklch(0.488_0.243_264.376)] w-[2.5rem] h-[2.5rem] sm:w-[3rem] sm:h-[3rem]" />,
  },
  {
    title: "Course Tracking",
    description: "Monitor your progress and milestones throughout each course.",
    icon: <LineChart className="text-[oklch(0.488_0.243_264.376)] w-[2.5rem] h-[2.5rem] sm:w-[3rem] sm:h-[3rem]" />,
  },
  {
    title: "Smart Quizzes",
    description: "Reinforce concepts with AI-powered quizzes and instant feedback.",
    icon: <Brain className="text-[oklch(0.488_0.243_264.376)] w-[2.5rem] h-[2.5rem] sm:w-[3rem] sm:h-[3rem]" />,
  },
];

export const Services = () => {
  return (
    <section className="container py-8 sm:py-12 md:py-20">
      <div className="grid lg:grid-cols-2 gap-8 place-items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mt-3 mb-6 sm:mb-8">
            At IntelliQuest, we prioritize the needs of our learners, offering a personalized and impactful educational experience that supports long-term success and professional growth.
          </p>

          <div className="flex flex-col gap-4 sm:gap-6">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex flex-row justify-start items-center gap-4 p-4 sm:p-6">
                  <div className="bg-[oklch(0.488_0.243_264.376)]/20 p-2 rounded-2xl shrink-0">
                    {icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative w-full lg:w-fit flex justify-center mt-6 lg:mt-0">
          <div className="shadow-services"></div>
          <img
            src="/cube-leg.png"
            className="w-[220px] sm:w-[320px] md:w-[450px] lg:w-[600px] object-contain relative z-10"
            alt="About services"
          />
        </div>
      </div>
    </section>
  );
};
