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
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";

interface VerificationFormData {
  storeName: string;
  storeUrl: string;
  businessName: string;
  businessType: string;
  contactEmail: string;
  description: string;
  logo?: File;
}

export function StoreVerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const form = useForm<VerificationFormData>();
  const queryClient = useQueryClient();

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("logo", file);
    }
  };

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      let logoUrl = null;
      if (data.logo) {
        const fileExt = data.logo.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('store-logos')
          .upload(filePath, data.logo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('store-logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      // Create store entry
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .insert({
          name: data.storeName,
          url: data.storeUrl,
          user_id: user.id,
          verification_status: "pending",
          logo_url: logoUrl,
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

      // Refresh the stores list in the table
      queryClient.invalidateQueries({ queryKey: ["stores"] });

      toast({
        title: "Verification request submitted",
        description: "We'll review your request and get back to you soon.",
      });

      form.reset();
      setLogoPreview(null);
    } catch (error) {
      console.error("Verification request error:", error);
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
        <div className="space-y-4">
          <FormLabel>Store Logo</FormLabel>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus className="h-8 w-8 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Upload your store logo</p>
              <p>Recommended size: 512x512px</p>
            </div>
          </div>
        </div>

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