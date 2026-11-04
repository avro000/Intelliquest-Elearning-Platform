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
      className="container py-24 sm:py-32 relative"
    >
      <div className="shadow-testimonials"></div>
      <div className="shadow-testimonials2"></div>

      <h2 className="text-3xl md:text-4xl font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
          {" "}
          People Love{" "}
        </span>
        IntelliQuest
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Real stories, real success — see how IntelliQuest is transforming the learning journey for everyone.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden bg-white/10 backdrop-blur-md border border-primary/20"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt=""
                    src={image}
                  />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>          
          )
        )}
      </div>
    </section>
  );
};