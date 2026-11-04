import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BookOpenCheck, Brain, LineChart} from "lucide-react";


interface ServiceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const serviceList: ServiceProps[] = [
  {
    title: "Self-paced Learning",
    description: "Access courses anytime and learn at your own speed.",
    icon: <BookOpenCheck className="text-[oklch(0.488_0.243_264.376)] w-[3.5rem] h-[3.5rem]" />,
  },
  {
    title: "Course Tracking",
    description: "Monitor your progress and milestones throughout each course.",
    icon: <LineChart className="text-[oklch(0.488_0.243_264.376)] w-[3.5rem] h-[3.5rem]" />,
  },
  {
    title: "Smart Quizzes",
    description: "Reinforce concepts with AI-powered quizzes and instant feedback.",
    icon: <Brain className="text-[oklch(0.488_0.243_264.376)] w-[3.5rem] h-[3.5rem]" />,
  },
];


export const Services = () => {
  return (
    <section className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
              Client-Centric{" "}
            </span>
            Services
          </h2>

          <p className="text-muted-foreground text-xl mt-4 mb-8">
            At IntelliQuest, we prioritize the needs of our learners, offering a personalized and impactful educational experience that supports long-term success and professional growth.
          </p>

          <div className="flex flex-col gap-8">
            {serviceList.map(({ icon, title, description }: ServiceProps) => (
              <Card key={title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-[oklch(0.488_0.243_264.376)]/20 p-1 rounded-2xl">
                    {icon}
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative w-fit">
          <div className="shadow-services"></div>
          <img
            src="/cube-leg.png"
            className="w-[300px] md:w-[500px] lg:w-[600px] object-contain relative z-10"
            alt="About services"
          />
        </div>

      </div>
    </section>

  );
};