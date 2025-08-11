import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoadingButton from "./sub-components/LoadingButton";
import { AppDispatch, RootState } from "../store/store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigateTo = useNavigate();

  const { loading, isAuthenticated, error } = useSelector(
    (state: RootState) => state.user,
  );

  const handleLogin = () => {
    dispatch(login(email,password))
  };

  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch(clearAllUserErrors());
    }

    if(isAuthenticated){
      navigateTo("/");
    }

  }, [dispatch, isAuthenticated, loading, error]);


  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to={"/password/forgot"}
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                type="password"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                required 
                />
            </div>
            {
              loading ? (<LoadingButton content={"Reseting Password"}/>) : (<Button type="submit" className="w-full" onClick={handleLogin}>
                Login
              </Button>)
            }
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
