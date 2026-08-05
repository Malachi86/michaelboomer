'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "@/lib/types";
import { useForm } from 'react-hook-form';
import { useToast } from "@/hooks/use-toast";

export function ProfileForm({ profile }: { profile: Profile }) {
    const { register, handleSubmit, formState: { isDirty, isSubmitting } } = useForm<Profile>({
        defaultValues: profile,
    });
    const { toast } = useToast();

    const onSubmit = (data: Profile) => {
        console.log(data);
        toast({
            title: "Profile Updated!",
            description: "Your changes have been submitted.",
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>This information will be displayed on your public portfolio.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Name</Label>
                        <Input id="full_name" {...register("full_name")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" {...register("bio")} rows={5} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profile_image">Profile Image URL</Label>
                        <Input id="profile_image" {...register("profile_image")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="resume_url">Resume URL</Label>
                        <Input id="resume_url" {...register("resume_url")} />
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Contact Details</CardTitle>
                    <CardDescription>Update your primary contact email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                   <Button type="submit" disabled={!isDirty || isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                   </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
