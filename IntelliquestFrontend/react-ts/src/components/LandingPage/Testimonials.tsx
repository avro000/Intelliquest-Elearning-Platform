import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://plus.unsplash.com/premium_photo-1723802522352-9c1d0f67d6a1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fHBvcnRyYWl0JTIwaHVtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHwyfDB8fHww",
    name: "Sarah Lee",
    userName: "@sarah_lee",
    comment: "IntelliQuest transformed my learning experience with its engaging and interactive courses!",
  },
  {
    image: "https://plus.unsplash.com/premium_photo-1723600929036-568760ef9925?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fHBvcnRyYWl0JTIwaHVtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHwyfDB8fHww",
    name: "Michael Smith",
    userName: "@mike_smith",
    comment:
      "The platform is easy to use and the instructors are top-notch. My skills have improved significantly.",
  },
  {
    image: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXQlMjBodW1hbiUyMHByb2Zlc3Npb25hbHxlbnwwfDJ8MHx8fDA%3D",
    name: "Emily Clark",
    userName: "@emily_clark",
    comment:
      "I love the flexibility of the courses and the ability to learn at my own pace. Highly recommend!",
  },
  {
    image: "https://images.unsplash.com/photo-1722926323079-0836a07d2340?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fHBvcnRyYWl0JTIwaHVtYW4lMjBwcm9mZXNzaW9uYWx8ZW58MHwyfDB8fHww",
    name: "David Brown",
    userName: "@david_brown",
    comment:
      "A great platform for anyone looking to upskill. The interactive content keeps me engaged throughout.",
  },
  {
    image: "https://images.unsplash.com/photo-1722924908364-2a8ea385aab1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D",
    name: "Olivia Johnson",
    userName: "@olivia_johnson",
    comment:
      "I've taken several courses here, and the learning experience has been excellent. Can't wait to learn more!",
  },
  {
    image: "https://images.unsplash.com/photo-1722483642866-3e220aea97bf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI0fHx8ZW58MHx8fHx8",
    name: "James Wilson",
    userName: "@james_wilson",
    comment:
      "From beginner to advanced, IntelliQuest offers great content that suits every level. Truly a fantastic learning platform!",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container py-8 sm:py-12 md:py-20 relative"
    >
      <div className="shadow-testimonials"></div>
      <div className="shadow-testimonials2"></div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
          {" "}
          People Love{" "}
        </span>
        IntelliQuest
      </h2>

      <p className="text-base sm:text-lg md:text-xl text-muted-foreground pt-2 sm:pt-4 pb-6 sm:pb-8">
        Real stories, real success — see how IntelliQuest is transforming the learning journey for everyone.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mx-auto">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md w-full bg-white/10 backdrop-blur-md border border-primary/20"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2 p-4 sm:p-6">
                <Avatar>
                  <AvatarImage
                    alt=""
                    src={image}
                  />
                  <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-base sm:text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="text-sm sm:text-base text-muted-foreground p-4 sm:p-6 pt-0">{comment}</CardContent>
            </Card>          
          )
        )}
      </div>
    </section>
  );
};
