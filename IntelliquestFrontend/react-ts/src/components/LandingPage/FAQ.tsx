import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is IntelliQuest?",
    answer: "IntelliQuest is an e-learning platform offering expert-led courses designed for flexible, self-paced learning.",
    value: "item-1",
  },
  {
    question: "How do I enroll in a course?",
    answer: "Simply create an account, browse our course catalog, and click 'Enroll' on any course you wish to join.",
    value: "item-2",
  },
  {
    question: "Can I access courses on my mobile device?",
    answer: "Yes, our platform is fully responsive and optimized for both desktop and mobile devices.",
    value: "item-3",
  },
  {
    question: "Are there any free courses available?",
    answer: "Yes, IntelliQuest offers a selection of free courses. You can find them in the 'Free Courses' category.",
    value: "item-4",
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer: "Yes, learners receive a digital certificate upon successful completion of each course.",
    value: "item-5",
  },
];


export const FAQ = () => {
  return (
    <section
      id="faq"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-[oklch(0.488_0.243_264.376)]/60 to-[oklch(0.488_0.243_264.376)] text-transparent bg-clip-text">
          Questions
        </span>
      </h2>
      <Accordion
        type="single"
        collapsible
        className="w-full AccordionRoot"
      >
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem
            key={value}
            value={value}
          >
            <AccordionTrigger className="text-left cursor-pointer">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          target="_blank"
          href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJlFmSNczFDtcljjPLqHPZlXhgcZdsnlZfXcdxWpkrDmVBJvwGjGFxlFCqJjtJzdRWcLffL"
          className="text-[oklch(0.488_0.243_264.376)] transition-all border-[oklch(0.488_0.243_264.376)] hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};