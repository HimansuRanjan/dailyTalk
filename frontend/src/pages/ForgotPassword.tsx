import { clearAllForgotPasswordErrors, forgotPassword} from "../store/slices/forgotPasswordSlice"; 
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import LoadingButton from "./sub-components/LoadingButton";
import { AppDispatch, RootState } from "../store/store";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { loading, error, message } = useSelector(
    (state: RootState) => state.forgotPassword
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();
  const navigateTo = useNavigate();

  const handleForgotPassword = () => {
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch(clearAllForgotPasswordErrors());
    }

    if(isAuthenticated){
      navigateTo("/");
    }

    if(message !== null){
      toast.success(message);
    }

  }, [dispatch, isAuthenticated, loading, error]);

  return <>
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to Find to your account
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
                <Link
                  to={"/login"}
                  className="ml-auto inline-block text-sm underline"
                >
                  Remember your password?
                </Link>
              </div>
              
            </div> 
            {
              loading ? (<LoadingButton content={"Logging In"}/>) : (<Button type="submit" className="w-full" onClick={handleForgotPassword}>
                Proceed
              </Button>)
            }
            
          </div>
        </CardContent>
      </Card>
    </div>
  </>;
};

export default ForgotPassword;
