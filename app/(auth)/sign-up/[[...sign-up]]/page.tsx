"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import {useAuthActions} from "@convex-dev/auth/react";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
export default function LoginPage() {
  const {signIn} = useAuthActions();
  const router = useRouter();
  const [error,setError] = useState("");
  const [loading, setLoading] = useState(false)
  const handleSignUp=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setLoading(true);
    const formData=new FormData(e.target as HTMLFormElement);
    const email=formData.get("email") as string;
    const password=formData.get("password") as string;
    const confirmPassword=formData.get("confirmPassword") as string;
    if(!email || !password || !confirmPassword){
      setError("Email and password are required");
      setLoading(false);
      return;
    }
    if(password !== confirmPassword){
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
  try{
    await signIn("password",{
      email,
      password,
      flow:"signUp"
    });
    router.push("/sign-in")
  }
  catch(err){
    setError("Failed to create account");
    setLoading(false);
  }
  finally{
    setLoading(false);
  }
  }
  const handleGoogleSignUp=async()=>{
    setLoading(true);
    try{
      await signIn("google");
    }
    catch(err){
      setError("Failed to create account");
      setLoading(false);
    }
    finally{
      setLoading(false);
    }
  }
    return (
        <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                action=""
                className="max-w-92 m-auto h-fit w-full" onSubmit={handleSignUp}>
                <div className="p-6">
                    <div>
                        
                        <h1 className="mb-1 mt-4 text-xl font-semibold">Create a Gemify Account</h1>
                        <p>Welcome! Create an account to get started</p>
                    </div>

                    <div className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full" onClick={handleGoogleSignUp}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="0.98em"
                                height="1em"
                                viewBox="0 0 256 262">
                                <path
                                    fill="#4285f4"
                                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                                <path
                                    fill="#34a853"
                                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                                <path
                                    fill="#fbbc05"
                                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                                <path
                                    fill="#eb4335"
                                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                            </svg>
                            <span>Google</span>
                        </Button>
                    </div>

                    <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                        <hr className="border-dashed" />
                        <span className="text-muted-foreground text-xs">Or continue With</span>
                        <hr className="border-dashed" />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm">
                                Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="password"
                                id="password"
                                className="input sz-md variant-mixed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm">
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="confirmPassword"
                                id="confirmPassword"
                                className="input sz-md variant-mixed"
                            />
                        </div>

                        <Button className="w-full" type="submit" disabled={loading}>{loading ? "Creating account..." : "Continue"}</Button>
                    </div>
                </div>
                {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                <p className="text-accent-foreground text-center text-sm">
                    Have an account ?
                    <Button
                        asChild
                        variant="link"
                        className="px-2">
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                </p>
            </form>
        </section>
    )
}