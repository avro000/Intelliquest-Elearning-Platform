import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Free",
    popular: 0,
    price: 0,
    description:
      "Essential access to beginner courses and community discussions.",
    buttonText: "Get Started",
    benefitList: [
      "Access to free courses",
      "Community forum access",
      "Basic quiz assessments",
      "Course progress tracking",
      "Standard mobile support",
    ],
  },
  {
    title: "Premium",
    popular: 1,
    price: 5,
    description:
      "Unlimited access to all courses, quizzes, and certificates.",
    buttonText: "Start Free Trial",
    benefitList: [
      "All Free features included",
      "Unlimited premium courses",
      "Official certificates",
      "AI quiz insights",
      "Priority instructor support",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 15,
    description:
      "Team-level features, analytics, and bulk seat management.",
    buttonText: "Contact Us",
    benefitList: [
      "All Premium features included",
      "Dedicated account manager",
      "Custom learning paths",
      "Team analytics dashboard",
      "24/7 dedicated support",
    ],
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="container py-8 sm:py-12 md:py-20 relative"
    >
      <div className="shadow-price"></div>
      <div className="shadow-price2"></div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
        Get
        <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
          {" "}
          Unlimited{" "}
        </span>
        Access
      </h2>
      <h3 className="text-base sm:text-lg md:text-xl text-center text-muted-foreground pt-2 sm:pt-4 pb-6 sm:pb-8">
        Choose the plan that fits your learning ambitions and goals.
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className="bg-white/10 backdrop-blur-md border border-primary/20 flex flex-col justify-between"
          >
            <div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl sm:text-2xl">
                  {pricing.title}
                  {pricing.popular === PopularPlanType.YES ? (
                    <Badge
                      variant="default"
                      className="text-xs sm:text-sm text-background"
                    >
                      Most popular
                    </Badge>
                  ) : null}
                </CardTitle>
                <div className="pt-2">
                  <span className="text-3xl font-bold">${pricing.price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>

                <CardDescription className="pt-2 text-sm sm:text-base">{pricing.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <Button className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.488_0.243_264.376)]/90 transition duration-300 ease-in-out cursor-pointer text-primary">{pricing.buttonText}</Button>
              </CardContent>

              <hr className="w-4/5 m-auto mb-4 border-border" />
            </div>

            <CardFooter className="flex">
              <div className="space-y-3">
                {pricing.benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex items-center text-sm sm:text-base"
                  >
                    <Check className="text-[oklch(0.488_0.243_264.376)] size-5 shrink-0" />{" "}
                    <span className="ml-2">{benefit}</span>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
