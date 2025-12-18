"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { generateImage, generateImageSchema, type GenerateImageInput } from "@/app/actions/generate-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

export function ImageGeneratorForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ imageUrl?: string; error?: string } | null>(null);

  const form = useForm<GenerateImageInput>({
    resolver: zodResolver(generateImageSchema),
    defaultValues: {
      prompt: "",
      style: "",
      width: 512,
      height: 512,
    },
  });

  async function onSubmit(data: GenerateImageInput) {
    setResult(null);
    
    startTransition(async () => {
      const response = await generateImage(data);
      
      if (response.success && response.imageUrl) {
        setResult({ imageUrl: response.imageUrl });
      } else {
        setResult({ error: response.error || "Failed to generate image" });
      }
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Image Generator</CardTitle>
          <CardDescription>
            Enter a prompt to generate an image using AI. This is a mock implementation.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A beautiful sunset over mountains..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe the image you want to generate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="photorealistic, oil painting, digital art..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional style description for the image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Image width (256-1024)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>Image height (256-1024)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Image"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <div className="text-destructive p-4 rounded-md bg-destructive/10">
                {result.error}
              </div>
            ) : result.imageUrl ? (
              <div className="space-y-4">
                <img
                  src={result.imageUrl}
                  alt="Generated image"
                  className="w-full rounded-lg border"
                />
                <p className="text-sm text-muted-foreground">
                  Image generated successfully! (This is a mock placeholder)
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

