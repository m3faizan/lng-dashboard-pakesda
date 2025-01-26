import { Hero } from "@/components/blocks/hero"

export default function Landing() {
  return (
    <Hero
      title="LNG."
      subtitle="Navigate Pakistan's LNG Market with Confidence."
      actions={[
        {
          label: "Try Demo",
          href: "/",
          variant: "outline"
        },
        {
          label: "Start Free",
          href: "/",
          variant: "default"
        }
      ]}
      titleClassName="text-5xl md:text-6xl font-extrabold"
      subtitleClassName="text-lg md:text-xl max-w-[600px]"
      actionsClassName="mt-8"
    />
  );
}