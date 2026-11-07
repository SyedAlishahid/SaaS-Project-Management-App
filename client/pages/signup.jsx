import { cn } from "cn";
import { Link } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import api from "../api/axios.js";

export function SignupForm({ className, ...props }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profile, setProfile] = useState(null);

  const [error, setError] = useState(null);
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer); // cleanup on unmount or re-trigger
    }
  }, [error]);
  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    formData.append("profile", profile);
    if (!name && !email && !password && !profile) {
      setError({
        message: "Name, email, password and Profile all feilds are required~",
      });
      toast.warning(
        "Name, email, password and Profile all feilds are required~",
      );
      return;
    }
    try {
      const response = await api.post("/auth/sign-up", formData);
      setName();
      setEmail();
      setPassword();
      setProfile(null);
      toast.success(`Hi, ${response.data.user.name}`);
      console.log(response.data);
      if (response.data.success === true) {
        toast.success("Account created successfully!");

        navigate("/login");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError(error.response?.data);
      toast.error(error.response?.data);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center w-screen items-center m-4 gap-6",
        className,
      )}
      {...props}
    >
      <Card className={"max-w-[430px] min-w-96  "}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-1 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Input
                id="image"
                type="file"
                onChange={(e) => setProfile(e.target.files[0] || null)}
                accept="image/*"
                className="cursor-pointer  pr-10 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
              />

              {error ? (
                <p className="text-center p-4 text-red-500 text-bold font-bold">
                  {error.message}
                </p>
              ) : (
                ""
              )}
              <Link to="/login">
                <Field>
                  <Button onClick={handleSignup} type="submit">
                    Create Account
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <a href="#">Sign in</a>
                  </FieldDescription>
                </Field>
              </Link>
            </FieldGroup>
          </form>
        </CardContent>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </Card>
    </div>
  );
}
