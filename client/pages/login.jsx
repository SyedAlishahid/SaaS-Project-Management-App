import { cn } from "cn";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
export function LoginFrom({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [data, setData] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      setError();
      console.log("Both feild required!");
    }

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success) {
        localStorage.setItem("refreshToken", response.data.user.refreshToken); // save BEFORE next call
        toast.success(`Hi, ${response.data.user.name}`);
        console.log(response.data.user.refreshToken);
        const ws = await api.get("/workspace/my-workspace"); // your getMyWorkspaces route
        console.log(ws.data);
        const workspaceId = ws.data.workspaces[0]?._id;
        navigate(
          workspaceId ? `/dashboard/${workspaceId}` : "/workspace/my-workspace",
          {
            replace: true,
          },
        );
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
        "flex flex-col gap-6 h-screen w-full justify-center items-center",
        className,
      )}
      {...props}
    >
      <Card className={"max-w-[430px] min-w-96 "}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </Field>
              <Field>
                <Button type="submit" onClick={handleSignup}>
                  Login
                </Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
                {error ? (
                  <p className="text-red-700 font-bold text-center p-2">
                    `${error.message}`
                  </p>
                ) : (
                  ""
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
