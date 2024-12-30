import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="animate-float mb-8 inline-block">
        <Shield className="h-20 w-20 text-primary mx-auto" />
      </div>
      <h1 className="text-6xl font-bold mb-6 text-primary">
        Trust Badge Solution for Online Stores
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Verify your online store, protect your customers, and grow your business with our trusted verification platform.
      </p>
      <div className="flex gap-4 justify-center">
        <Button size="lg">Get Verified Now</Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </div>
    </div>
  );
};