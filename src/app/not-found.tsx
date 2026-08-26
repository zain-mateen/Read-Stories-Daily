import { Compass } from "@phosphor-icons/react/ssr";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center justify-center gap-4 py-24 text-center sm:py-32">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-charcoal-700/5 text-rust-500">
        <Compass size={30} />
      </span>
      <h1 className="font-display text-3xl font-semibold text-charcoal-800 sm:text-4xl">
        Page not found
      </h1>
      <p className="max-w-md text-base leading-relaxed text-charcoal-400">
        The story you&apos;re looking for may have moved, or never existed at
        all.
      </p>
      <Button href="/" className="mt-2">
        Back to Home
      </Button>
    </Container>
  );
}
