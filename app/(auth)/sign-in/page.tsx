'use client';

import {signInWithEmail, signUpWithEmail} from "@/lib/actions/auth.actions";

import { Button } from '@/components/ui/button';
import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import PixelCharacter from '@/components/PixelCharacter';
import {signInEmail} from "better-auth/api";
import {toast} from "sonner";
import { useForm } from 'react-hook-form';
import {useRouter} from "next/navigation";

const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            
            if(result.success) {
                toast.success('Welcome back!', {
                    description: 'Successfully signed in to your account'
                });
                router.push('/');
            } else {
                toast.error('Sign in failed', {
                    description: result.error || 'Please check your credentials and try again'
                });
            }
        } catch (e) {
            console.error('Unexpected error:', e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'An unexpected error occurred'
            });
        }
    }

    return (
        <>
            <div className="flex flex-col items-center mb-6">
                <PixelCharacter variant="hero" size="xl" animated={true} />
                <h1 className="form-title mt-4">Welcome back</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="start@hack.com"
                    register={register}
                    error={errors.email}
                    validation={{ 
                        required: 'Email is required', 
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Please enter a valid email address'
                        }
                    }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Signing In' : 'Sign In'}
                </Button>

                <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
            </form>
        </>
    );
};
export default SignIn;
