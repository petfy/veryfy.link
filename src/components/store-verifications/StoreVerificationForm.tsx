import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VerificationFormData {
  storeName: string;
  storeUrl: string;
  businessName: string;
  businessType: string;
  contactEmail: string;
  description: string;
}

export function StoreVerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<VerificationFormData>();

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Create store entry
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .insert({
          name: data.storeName,
          url: data.storeUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (storeError) throw storeError;

      // Update user profile with business information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          business_name: data.businessName,
          business_type: data.businessType,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Verification request submitted",
        description: "We'll review your request and get back to you soon.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit verification request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="storeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input placeholder="Your store name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store URL</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://your-store.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Legal Name</FormLabel>
              <FormControl>
                <Input placeholder="Legal business name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., LLC, Corporation, Sole Proprietorship"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@business.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your business..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Verification Request"}
        </Button>
      </form>
    </Form>
  );
}