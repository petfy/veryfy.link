import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export const PricingCard = ({ title, price, features, recommended }: PricingCardProps) => {
  return (
    <Card className={`p-6 ${recommended ? 'border-2 border-primary' : ''}`}>
      <div className="text-center mb-6">
        {recommended && (
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
            Recommended
          </span>
        )}
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-gray-500">/month</span>
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-5 w-5 text-secondary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={recommended ? "default" : "outline"}>
        Get Started
      </Button>
    </Card>
  );
};