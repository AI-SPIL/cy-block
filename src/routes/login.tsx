import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Form, useActionData } from "react-router";
import { toast } from "sonner";

export default function Login() {
	const actionData = useActionData() as { error?: string } | undefined;

	useEffect(() => {
		if (actionData?.error) {
			toast.error(actionData.error);
		}
	}, [actionData]);

	return (
		<div className="grid place-items-center min-h-svh">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>Enter your email below to login to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form action="/" method="POST">
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="username">Username</Label>
								<Input 
									id="username" 
									name="username" 
									type="text"
									placeholder="Enter your username" 
									required 
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input 
									id="password" 
									name="password" 
									type="password" 
									placeholder="Enter your password" 
									required 
								/>
							</div>
							<Button type="submit" className="w-full">
								Login
							</Button>
						</div>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
