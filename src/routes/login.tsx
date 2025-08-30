import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form } from "react-router";

export default function Login() {
	return (
		<div className="grid place-items-center min-h-svh">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>Enter your email below to login to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form action="/" method="post">
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" name="email" type="email" placeholder="Enter your email" required />
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Password</Label>
								<Input id="password" name="password" type="password" placeholder="Enter your password" required />
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
