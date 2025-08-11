import React, { useState, useEffect } from 'react'
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
import LoadingButton from './sub-components/LoadingButton';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAllForgotPasswordErrors } from '../store/slices/forgotPasswordSlice';
import { toast } from "react-toastify";
import { getUser } from '../store/slices/userSlice';
import { AppDispatch, RootState } from '../store/store';

const ResetPassword = () => {
  const {token} = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, message } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const { isAuthenticated } = useSelector((state:RootState) => state.user);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigateTo = useNavigate();

  const handleResetPassword = ()=>{
    dispatch(resetPassword(token, password, confirmPassword));
  }

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
      dispatch(getUser());
    }

  }, [dispatch, isAuthenticated, loading, error, message]);
  return (
    <>
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Set New Password for Profile:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                placeholder="zbx@123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                type="password"
                placeholder="zbx@123"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {
              loading ? (<LoadingButton content={"Logging In"}/>) : (<Button type="submit" className="w-full" onClick={handleResetPassword}>
                Set Password
              </Button>)
            }
            
          </div>
        </CardContent>
      </Card>
    </div>
  </>
  )
}

export default ResetPassword
